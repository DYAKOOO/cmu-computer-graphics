# Telegram + Cloudflare + DeepSeek wiring

The complete map of what lives where. Update this whenever any piece moves.

## Components

### 1. Telegram bot (BotFather)

| Field | Value |
|---|---|
| Username | `@dyako_cg_streak_bot` |
| Created via | `@BotFather` on Telegram |
| Token | Stored in two places (see Secrets map below) |
| Privacy mode | **Off** (so it can read group messages without an explicit `/command`) |

### 2. The "cg" Telegram group

| Field | Value |
|---|---|
| Chat ID (group) | `-5245948814` |
| Chat ID (owner DM) | `7956548720` |
| Bot permission | Must be an **admin** for `sendPoll` to work in the group |

The minus sign on the group chat ID is significant — Telegram uses negative IDs
for groups/channels. To rediscover the chat ID for a new group:
```bash
# After adding the bot to the group and sending any message in it:
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getUpdates" | jq '.result[].message.chat'
```

### 3. Cloudflare Worker — `cg-tutor-bot`

- Repo: `/home/diako/csRobotics/cg-tutor-bot/` (local only, no git remote)
- Entry: `src/index.ts`
- Deploy: `cd /home/diako/csRobotics/cg-tutor-bot && npm run deploy`
- Webhook URL form: `https://cg-tutor-bot.<your-cf-subdomain>.workers.dev`
  (find the exact URL with `wrangler whoami` then check the CF dashboard, or
  run `wrangler deploy` — it prints the URL)
- Webhook is registered with Telegram via
  `cg-tutor-bot/scripts/set-webhook.sh` (needs `TELEGRAM_BOT_TOKEN`,
  `TELEGRAM_WEBHOOK_SECRET`, `WORKER_URL` in env).

### 4. DeepSeek

- Model: `deepseek-chat` (per `wrangler.toml`, configurable as the `DEEPSEEK_MODEL` var)
- Endpoint: `https://api.deepseek.com/v1/chat/completions`
- API key: managed on `platform.deepseek.com`, stored as a CF Worker secret.
- Why DeepSeek: cheap, large context (we send up to 2 lecture markdowns as
  ground truth). Switch to `deepseek-reasoner` for hard math/derivation questions.

### 5. This repo (lecture source of truth)

- `lectures/cg-NN-lecture-quiz.md` files are fetched by the Worker via
  `raw.githubusercontent.com` with `cf.cacheTtl: 3600`. So a `git push` to
  `main` here takes ~1 h to propagate to the bot.
- `scripts/quiz_to_telegram.py` posts polls **from your laptop**, not from CI
  or the Worker. It needs `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in env.

## Secrets map

The same `TELEGRAM_BOT_TOKEN` is stored in **three** places. Rotating it means
updating all three:

| Secret | Where it lives | How to set |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | GitHub repo secrets (this repo) | `gh secret set TELEGRAM_BOT_TOKEN` |
| `TELEGRAM_BOT_TOKEN` | Cloudflare Worker secret | `cd cg-tutor-bot && wrangler secret put TELEGRAM_BOT_TOKEN` |
| `TELEGRAM_BOT_TOKEN` | Local env when running `quiz_to_telegram.py` | `export TELEGRAM_BOT_TOKEN=…` (or `.env`, gitignored) |
| `TELEGRAM_CHAT_ID` | GitHub repo secrets | `gh secret set TELEGRAM_CHAT_ID` |
| `TELEGRAM_CHAT_ID` | Local env | same |
| `TELEGRAM_WEBHOOK_SECRET` | Cloudflare Worker secret | `wrangler secret put TELEGRAM_WEBHOOK_SECRET` (any random string; Telegram echoes it back in the `X-Telegram-Bot-Api-Secret-Token` header so the Worker can reject spoofed POSTs) |
| `DEEPSEEK_API_KEY` | Cloudflare Worker secret | `wrangler secret put DEEPSEEK_API_KEY` |

Cloudflare Worker `[vars]` (non-secret, live in `wrangler.toml`):
- `ALLOWED_CHAT_IDS` — comma-separated, gate which chats the bot will reply in
- `BOT_USERNAME` — used to detect @mentions; must match BotFather exactly
- `DEEPSEEK_MODEL` — `deepseek-chat` or `deepseek-reasoner`
- `LECTURES_BASE_URL` — `https://raw.githubusercontent.com/DYAKOOO/cmu-computer-graphics/main/lectures`

## Data flow — tutor chat

```
User in CG group: "@dyako_cg_streak_bot what's the gradient?"
         │
         ▼
Telegram → POST {webhook}/  (with X-Telegram-Bot-Api-Secret-Token header)
         │
         ▼
CF Worker (cg-tutor-bot)
  1. verify secret header
  2. check chat.id ∈ ALLOWED_CHAT_IDS
  3. strip @mention
  4. score keywords against TOPIC_INDEX → top 2 lectures
  5. fetch raw.githubusercontent.com/.../cg-03-lecture-quiz.md (edge cached)
  6. POST to api.deepseek.com/v1/chat/completions with lecture text as system context
  7. POST reply to api.telegram.org/.../sendMessage
```

## Data flow — quiz polls

```
You on laptop:  python3 scripts/quiz_to_telegram.py 3 1 3
         │
         ▼
quiz_to_telegram.py
  1. parse lectures/cg-03-lecture-quiz.md (reuses gen_quiz.parse_questions)
  2. for each MCQ in range:
       POST api.telegram.org/.../sendPoll {type=quiz, correct_option_id=…}
  3. append poll_id + correct answer to telegram_quiz/lec3.md
         │
         ▼
Telegram natively shows users right/wrong on tap.
Bot is *not* involved in grading these polls.
```

## What hasn't been built yet

- **Per-user scoring across runs.** The Worker advances the batch when any
  answer for each poll arrives — fine for a solo group. To track who answered
  what and aggregate accuracy over time, we'd write a third KV key
  `score:<chat>:<user>` and increment on each `poll_answer`. Not done.
- **Free-form answer grading.** The original Phase-2 plan was to grade
  free-text answers via DeepSeek. Superseded by native Telegram quiz polls
  (Telegram grades them natively). The DeepSeek path remains for chat only.
- **Aggregating poll vote counts.** `stopPoll` returns counts but also closes
  the poll. A `poll` (not `poll_answer`) update gives anonymous totals; we
  could subscribe to that too if we wanted dashboards.

# SOP: deploy or update the `cg-tutor-bot` Cloudflare Worker

The bot source lives in a **separate repo** at `/home/diako/csRobotics/cg-tutor-bot/`.
It has no git remote yet — see "Back this up" below.

## Routine deploy

```bash
cd /home/diako/csRobotics/cg-tutor-bot
npm run deploy
```

`wrangler deploy` reads `wrangler.toml`, uploads `src/index.ts`, and prints
the Worker URL. If you've never deployed before from this machine you'll be
prompted to log in to Cloudflare in a browser.

## First-time setup on a fresh machine

```bash
cd /home/diako/csRobotics/cg-tutor-bot
npm install
npx wrangler login

# 1. Create the KV namespace and paste the id into wrangler.toml
npx wrangler kv namespace create QUIZ_STATE   # wrangler v4+ syntax (was kv:namespace in v3)
# → prints something like: id = "abc123…"
# Open wrangler.toml and replace REPLACE_ME_WITH_KV_ID_FROM_WRANGLER with that id.

# 2. Push every secret. wrangler prompts for each value.
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_WEBHOOK_SECRET    # any random string
npx wrangler secret put DEEPSEEK_API_KEY

# 3. Deploy.
npm run deploy

# 4. Register the Worker URL as Telegram's webhook target.
#    Note: set-webhook.sh now requests both message + poll_answer updates.
export TELEGRAM_BOT_TOKEN='…'                 # same as above
export TELEGRAM_WEBHOOK_SECRET='…'            # same random string
export WORKER_URL='https://cg-tutor-bot.<your-subdomain>.workers.dev'
bash scripts/set-webhook.sh
```

Verify with:
```bash
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getWebhookInfo" | jq
```
You should see `"url": "<your worker URL>"` and `"pending_update_count": 0`.

## When you change `lectures/*.md` in this (cmu-computer-graphics) repo

The Worker fetches lecture markdown via `raw.githubusercontent.com` with a
1-hour edge cache. So your `git push` to `main` here propagates to the bot
within ~1 h with no Worker redeploy needed.

If you **rename or add** a lecture file, regenerate the topic index so the
keyword router knows about it:
```bash
cd /home/diako/csRobotics/cg-tutor-bot
python3 scripts/build-topic-index.py   # writes src/topic-index.ts
npm run deploy
```

## When you change the bot's behaviour (`src/index.ts`)

```bash
cd /home/diako/csRobotics/cg-tutor-bot
npm run deploy
# No need to re-register the webhook — it stays the same URL.
```

Tail live logs while you test in Telegram:
```bash
npx wrangler tail
```

## Debugging

- **Bot is silent in the group.** Check `wrangler tail` for `[skip]` lines.
  Most common: `chat.id ... not in allowed list` (update `ALLOWED_CHAT_IDS`
  in `wrangler.toml` and redeploy) or `group message not addressed to @bot`
  (you forgot to @mention it).
- **403 forbidden** on every request: `TELEGRAM_WEBHOOK_SECRET` mismatch
  between Worker secret and what was sent to `setWebhook`. Re-run
  `set-webhook.sh` with the right value.
- **DeepSeek 401**: `DEEPSEEK_API_KEY` secret is missing or expired. Reset
  with `npx wrangler secret put DEEPSEEK_API_KEY`.
- **Telegram webhook stops delivering**: `curl …/getWebhookInfo` and look at
  `last_error_message`. If the Worker was returning 5xx, Telegram throttles
  delivery. Fix the Worker, then `setWebhook` again with
  `drop_pending_updates=true`.

## Pause / unpause the bot

```bash
# Stop delivery while debugging:
cd /home/diako/csRobotics/cg-tutor-bot
bash scripts/drop-webhook.sh

# Re-enable:
bash scripts/set-webhook.sh
```

## Rotating the bot token

If the token leaks (or you suspect it has):
1. `@BotFather` → `/revoke` → choose `@dyako_cg_streak_bot` → it issues a new one.
2. Update **three** places:
   ```bash
   # Cloudflare Worker:
   cd /home/diako/csRobotics/cg-tutor-bot
   npx wrangler secret put TELEGRAM_BOT_TOKEN

   # GitHub Actions (in this cmu-computer-graphics repo):
   gh secret set TELEGRAM_BOT_TOKEN

   # Any local .env you have for running quiz_to_telegram.py
   ```
3. Re-register the webhook with the new token:
   ```bash
   bash scripts/set-webhook.sh
   ```

## Back this up (no remote yet!)

The `cg-tutor-bot` repo has no git remote. If this laptop dies, the deployed
Worker keeps running but you lose the source. To fix:
```bash
cd /home/diako/csRobotics/cg-tutor-bot
gh repo create DYAKOOO/cg-tutor-bot --private --source=. --remote=origin --push
```
After that, regular `git push` works. **Never commit `.dev.vars` or any file
containing the bot token.**

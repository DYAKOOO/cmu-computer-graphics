# Project Context (read this first)

Anything in this folder is **load-bearing context that lives outside the code**.
Future-me (or future-Claude) should read this *before* touching the Telegram /
quiz / DeepSeek pieces — they span three places (this repo, the `cg-tutor-bot`
repo, and the Cloudflare dashboard) and the wiring is easy to misremember.

## What's in here

```
.agent/
├── README.md                       this index
├── system/
│   └── telegram-bot.md             where each piece lives, secrets map, risks
└── sop/
    ├── start-quiz-session.md       how to use /quiz lecN in the CG group
    ├── send-quiz-batch.md          how to push quiz polls from the laptop (alt path)
    └── deploy-tutor-bot.md         how to update / redeploy the Worker
```

## The 30-second mental model

There are **three** Telegram features sharing one bot (`@dyako_cg_streak_bot`):

1. **Daily reminder** — [`.github/workflows/daily-reminder.yml`](../.github/workflows/daily-reminder.yml).
   GitHub Action fires once per morning, sends a Telegram message. One-way.
2. **Tutor chat** — Cloudflare Worker at [`/home/diako/csRobotics/cg-tutor-bot`](../../../cg-tutor-bot).
   Listens for `@dyako_cg_streak_bot` mentions in the CG group (and all DMs from
   the owner), retrieves the most relevant lecture markdown from this repo via
   `raw.githubusercontent.com`, calls **DeepSeek** for the answer, replies in chat.
3. **Adaptive quiz session** — same Worker, triggered by `/quiz lec<N>` in the
   group. Worker fetches the lecture markdown, posts 3 MCQ as native quiz
   polls, listens for `poll_answer` events, and auto-sends the next 3 once
   you've answered all of the current batch. State in Cloudflare KV. See
   [`sop/start-quiz-session.md`](sop/start-quiz-session.md).
4. **Laptop-side quiz sender** — [`scripts/quiz_to_telegram.py`](../scripts/quiz_to_telegram.py).
   Fallback path for when the Worker is down or you want to push a specific
   range manually. Logs `poll_id`s to `telegram_quiz/lec<N>.md`. See
   [`sop/send-quiz-batch.md`](sop/send-quiz-batch.md).

Telegram natively grades the polls (`correct_option_id` is set on every
`sendPoll`); neither the Worker nor the laptop script grades them.

## Cross-repo touchpoints

- This repo's lecture markdown is the bot's source of truth. It fetches
  `https://raw.githubusercontent.com/DYAKOOO/cmu-computer-graphics/main/lectures/<file>`
  with edge caching (1 h TTL). If you rename a lecture file, the bot will
  break until `topic-index.ts` in `cg-tutor-bot` is regenerated.
- The bot's `TOPIC_INDEX` is built by `cg-tutor-bot/scripts/build-topic-index.py`
  from the lecture quiz markdown in this repo.

## Risks worth knowing about

- **`cg-tutor-bot` has no git remote.** Six commits live only on this laptop.
  If the disk dies, the source code is gone (deployed Worker survives, but
  there's no `git pull` recovery). See `sop/deploy-tutor-bot.md` for the push fix.
- **One bot token across three integrations.** Rotating it means updating both
  GH Actions secrets *and* the Cloudflare Worker secret.
- **Chat ID is a negative integer** (`-5245948814`). Easy to drop the minus and
  end up DM'ing yourself. The Worker's `ALLOWED_CHAT_IDS` is the canonical list.

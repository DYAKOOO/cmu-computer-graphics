# SOP: send a quiz batch to the CG Telegram group

For when you want to push lecture questions to `@dyako_cg_streak_bot`'s "cg"
group as native Telegram quiz polls (Telegram grades them; we log poll IDs).

## Prereqs (one-time)

1. The bot must be **admin** of the CG group, with permission to send polls.
   (Quiz polls fail silently in groups where the bot is a regular member.)
2. Export the token and chat ID locally — do **not** commit them:
   ```bash
   export TELEGRAM_BOT_TOKEN='<from BotFather, also in GH Actions secrets>'
   export TELEGRAM_CHAT_ID='-5245948814'   # cg group; minus sign matters
   ```
   Tip: put them in a gitignored `.env` and `source .env` so you don't paste
   the token into the shell history.

## Run

```bash
# Lecture 3, questions 1 through 3:
python3 scripts/quiz_to_telegram.py 3 1 3

# Dry-run first to see what would be posted:
python3 scripts/quiz_to_telegram.py 3 1 3 --dry-run

# Whole lecture, 1.5 s between polls (default; raise --pause if rate-limited):
python3 scripts/quiz_to_telegram.py 3 1 70
```

## What gets logged

Each successful send appends one line to `telegram_quiz/lec<N>.md`:

```
- 2026-05-25T12:34:56+00:00 | Q1 | msg=42 | poll=AgADBAADBA… | correct=B (It offers a language for spatial relationships and rates of change)
```

The `poll=<id>` is what you'd need later to call `stopPoll` or to correlate
incoming `poll_answer` webhook events (not yet wired up — see
[system/telegram-bot.md](../system/telegram-bot.md#what-hasnt-been-built-yet)).

## Common failures

- **"Bad Request: poll question is too long"** — Telegram caps question text
  at 300 chars and each option at 100 chars. The script truncates with `…` but
  long LaTeX-heavy questions can lose meaning. Fix the source markdown to
  shorten it (or split into two questions).
- **"Bad Request: chat not found"** — wrong `TELEGRAM_CHAT_ID`. For groups the
  ID is negative. Verify with:
  ```bash
  curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getUpdates" | jq
  ```
- **No polls appear in the group** but the script reports "✓" — the bot likely
  isn't an admin, or the group has "Send Polls" off for regular members.
  Promote the bot in group settings.
- **HTTP 429 Too Many Requests** — Telegram allows ~1 message/sec to a single
  chat, with a burst tolerance. Increase `--pause` (default 1.5).

## After sending: collecting answers

Telegram shows users right/wrong instantly — that's the main value.

To pull aggregated vote counts later, the simplest path is:
```bash
# Get the latest poll state. Returns total_voter_count and per-option counts.
# Requires the original poll's chat_id and message_id from the log file.
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/stopPoll" \
  -d "chat_id=$TELEGRAM_CHAT_ID" \
  -d "message_id=<from log>"
```
(`stopPoll` returns final counts but also closes the poll. To peek without
closing, you'd need `poll_answer` updates via webhook — not wired up.)

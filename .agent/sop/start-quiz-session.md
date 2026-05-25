# SOP: run an adaptive quiz session via `/quiz`

The `cg-tutor-bot` Worker handles `/quiz lec<N>` in the CG group: it sends the
first three MCQ as native Telegram quiz polls, then auto-sends the next three
as soon as you've answered all three of the current batch.

## How to start a session

In the CG group, type:

```
/quiz lec2
```

Other forms that work: `/quiz 2`, `/quiz@dyako_cg_streak_bot lec2`.
The Worker replies with a one-liner confirming the lecture title, then posts
3 polls.

## What happens next

1. You tap an option on each of the 3 polls.
2. Telegram sends a `poll_answer` webhook event to the Worker for each tap.
3. After the **third** answer arrives, the Worker posts the next 3 polls.
4. Repeat until the lecture is done. The Worker sends `🎉 Lec N complete.`

State is held in Cloudflare KV (`QUIZ_STATE` namespace) with a 24-hour TTL.
If you abandon mid-quiz it auto-clears the next day.

## Cancel a session

```
/stopquiz
```

Or start a new lecture — `/quiz lec3` clears any in-progress session and
starts fresh.

## Lecture-content source of truth

The Worker fetches `cg-NN-lecture-quiz.md` from this repo via
`raw.githubusercontent.com` with a 1-hour edge cache. Edits to the markdown
take up to ~1 h to reach the bot; you can purge with a `wrangler deploy`
(redeploying invalidates the worker-side cache).

The TypeScript parser at `cg-tutor-bot/src/quiz-parser.ts` mirrors the Python
`parse_questions()` from this repo's `scripts/gen_quiz.py`. It:

- Skips `QF<N>` (FLOW / reveal) questions; only MCQ.
- Shuffles A/B/C/D with a `mulberry32(num * 1337)` PRNG (Python uses
  Mersenne Twister, so the shuffle *order* differs from the website, but it
  is deterministic per question and the correct-option index is updated
  accordingly).

## When something goes wrong

| Symptom | Cause / fix |
|---|---|
| Worker says "🤷 No lecture N in the index" | `cg-tutor-bot/src/topic-index.ts` was generated when lecture N didn't exist. Regenerate it: `cd cg-tutor-bot && python3 scripts/build-topic-index.py && npm run deploy` |
| Polls send but next batch never arrives | Webhook not configured for `poll_answer` updates. Re-run `cg-tutor-bot/scripts/set-webhook.sh` (the updated version allows `["message","poll_answer"]`). Verify with `curl …/getWebhookInfo` and check `allowed_updates`. |
| "Failed to send Qn" in the chat | Question or option exceeded Telegram's 300/100 char caps after wiki-link stripping. Shorten the source markdown. |
| Stale session refuses to advance | `/stopquiz` clears it. Or wait 24 h for the KV TTL to expire. |

## What this does NOT track

- Per-user scores. The Worker advances when **any** answer comes in for each
  poll in the batch — fine for a solo-Diako group. If multiple people use the
  bot, the first to vote on each poll advances the batch.
- Right/wrong counts. Telegram shows each user right/wrong on tap; we don't
  aggregate. To see totals, use `stopPoll` on individual `poll_id`s (see
  `send-quiz-batch.md` — same logic applies).

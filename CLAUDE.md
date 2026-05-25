# Project Instructions

**Before doing anything in this project, read [`agent.md`](agent.md) in full.**

It documents the exact workflow, conventions, and rules for this quiz project.s
Following it prevents the most common mistakes (wrong slide numbers, creating new files
instead of editing existing ones, wrong image paths, etc.).

**For anything touching Telegram, the `cg-tutor-bot` Cloudflare Worker, DeepSeek,
or the quiz-poll sender, also read [`.agent/README.md`](.agent/README.md) first.**

That folder is the SOP for the moving parts that span this repo, the separate
[`/home/diako/csRobotics/cg-tutor-bot`](../../cg-tutor-bot) repo, and the
Cloudflare/Telegram dashboards. The bot is `@dyako_cg_streak_bot`; the CG group
chat ID is `-5245948814`; the same token lives in three places (GitHub Actions
secrets, Cloudflare Worker secret, your local env); and the Worker source has no
git remote yet.

## Quick orientation

- **What this is**: Next.js 14 static quiz app for CMU 15-462 Computer Graphics, deployed to GitHub Pages.
- **Logseq source files**: `/home/diako/csRobotics/logseq3/pages/cg-NN-*-quiz.md.md` — these are the source of truth. Always edit these, never create new ones.
- **Symlinks**: `lectures/cg-NN-lecture-quiz.md` → Logseq source file.
- **JSX generation**: `python3 scripts/gen_quiz.py lectures/cg-NN-lecture-quiz.md NN`
- **Slide images**: must go to BOTH `public/assets/` and `/home/diako/csRobotics/logseq3/assets/`
- **Deployed at**: `dyakooo.github.io/cmu-computer-graphics`

## Image dimension limit

When viewing slide images to fix question-to-slide mappings, Claude will hit this error if too many large images are included in one request:

> An image in the conversation exceeds the dimension limit for many-image requests (2000px). Start a new session with fewer images.

**Rule**: Fix slide mappings in batches of at most 1/3 of the lecture at a time (~14 questions for a 41-question lecture). View only the slides needed for that batch. Start a new session for each batch.

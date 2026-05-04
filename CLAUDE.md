# Project Instructions

**Before doing anything in this project, read [`agent.md`](agent.md) in full.**

It documents the exact workflow, conventions, and rules for this quiz project.
Following it prevents the most common mistakes (wrong slide numbers, creating new files
instead of editing existing ones, wrong image paths, etc.).

## Quick orientation

- **What this is**: Next.js 14 static quiz app for CMU 15-462 Computer Graphics, deployed to GitHub Pages.
- **Logseq source files**: `/home/diako/csRobotics/logseq3/pages/cg-NN-*-quiz.md.md` — these are the source of truth. Always edit these, never create new ones.
- **Symlinks**: `lectures/cg-NN-lecture-quiz.md` → Logseq source file.
- **JSX generation**: `python3 scripts/gen_quiz.py lectures/cg-NN-lecture-quiz.md NN`
- **Slide images**: must go to BOTH `public/assets/` and `/home/diako/csRobotics/logseq3/assets/`
- **Deployed at**: `dyakooo.github.io/cmu-computer-graphics`

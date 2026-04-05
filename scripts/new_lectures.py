#!/usr/bin/env python3
"""
new_paper.py — Add a paper quiz to ThusSpokeRobotsPapers
Uses Claude Code (no separate API key needed).

Usage:  python3 scripts/new_paper.py
   or:  uv run scripts/new_paper.py
"""

import os
import re
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

# ─── Paths ────────────────────────────────────────────────────────────────────

PAPERS_DIR = Path("/home/diako/GoogleDrive/zoterodb/storage/AI/AI/Robotics")
REPO_ROOT   = Path(__file__).parent.parent
ROBOTS_DIR  = Path("/home/diako/csRobotics/robotics")
HUSKY_QUIZ  = REPO_ROOT / "Feb2026" / "husky" / "HUSKYQuiz.jsx"

MONTH_NAMES = {
    1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",
    7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec",
}

# ─── Helpers ──────────────────────────────────────────────────────────────────

TRANSCRIPTS_DIR = REPO_ROOT / "transcripts"


def list_sources() -> list[Path]:
    """List PDFs from Zotero + any .txt transcripts saved in repo/transcripts/."""
    pdfs = sorted(PAPERS_DIR.glob("*.pdf"))
    txts = sorted(TRANSCRIPTS_DIR.glob("*.txt")) if TRANSCRIPTS_DIR.exists() else []
    sources = pdfs + txts
    if not sources:
        print(f"No sources found in {PAPERS_DIR} or {TRANSCRIPTS_DIR}")
        sys.exit(1)
    print("\nAvailable sources:")
    for i, p in enumerate(sources):
        tag = "[transcript]" if p.suffix == ".txt" else "[pdf]"
        print(f"  [{i+1:2}] {tag} {p.name}")
    return sources


def select_source(sources: list[Path]) -> Path:
    while True:
        try:
            choice = int(input("\nSelect number: ")) - 1
            if 0 <= choice < len(sources):
                return sources[choice]
            print(f"Enter 1–{len(sources)}")
        except ValueError:
            print("Enter a number.")
        except KeyboardInterrupt:
            print("\nAborted.")
            sys.exit(0)


def parse_year(name: str) -> str:
    m = re.search(r'\b(202\d)\b', name)
    return m.group(1) if m else str(datetime.now().year)


def slugify(stem: str) -> str:
    """'Xie et al. - 2026 - HandelBot Real-World...' → 'HandelBot'"""
    stem = re.sub(r'^.*?\d{4}\s*[-–]\s*', '', stem)
    words = re.findall(r'[A-Z][A-Z]+|[A-Z][a-z]+', stem)
    slug = ''.join(words[:3])
    return slug if slug else re.sub(r'[^a-zA-Z0-9]', '', stem)[:20]


def clone_or_locate(url: str) -> Path | None:
    if not url.strip():
        return None
    # Handle SSH URLs (git@github.com:user/repo.git) and HTTPS
    repo_name = re.split(r'[/:]', url.rstrip('/'))[-1]
    if repo_name.endswith('.git'):
        repo_name = repo_name[:-4]   # removesuffix, not rstrip
    local = ROBOTS_DIR / repo_name
    if local.exists():
        print(f"  Found existing repo: {local}")
        return local
    print(f"  Cloning {url} …")
    try:
        subprocess.run(
            ["git", "clone", "--depth=1", url.strip(), str(local)],
            check=True,
        )
        print(f"  Cloned to {local}")
        return local
    except subprocess.CalledProcessError:
        print("  Clone failed. Proceeding without codebase.")
        return None


# ─── Quiz generation via claude -p ───────────────────────────────────────────

def generate_quiz(
    source_path: Path,
    paper_title: str,
    repo: Path | None,
    quiz_path: Path,
) -> None:
    """Invoke `claude -p` — uses Claude Code's existing auth, no API key needed."""

    codebase_instruction = ""
    if repo:
        codebase_instruction = f"""
## Codebase
The official implementation is at: {repo}

Read the most important source files (tasks, envs, configs, training scripts) using
Glob and Read. Include 4–6 implementation questions that cite exact file paths and
line numbers, e.g. `{repo.name}/src/module/file.py:42`.
"""

    if source_path.suffix == ".txt":
        source_instruction = f"""1. Read the transcript/notes file: {source_path}
   (This is a talk transcript or text notes — treat it as the primary source.)"""
    else:
        source_instruction = f"1. Read the PDF: {source_path}"

    prompt = f"""You are generating a quiz for a robotics/vision research paper or talk.

## Your task
{source_instruction}
2. Read the HUSKYQuiz.jsx template: {HUSKY_QUIZ}
   (study its EXACT structure: question types, explanation fields, React component, styling)
3. {codebase_instruction if repo else "No codebase provided — skip implementation questions."}
4. Generate a new quiz JSX for the paper: **{paper_title}**
5. Write the quiz to: {quiz_path}

## Requirements

### Questions (20–25 total)
- Question types: ~60% single-choice, ~25% multi-select, ~10% ordering or matching
- Section coverage: Abstract/Intro 10% | Methods 40% | Experiments 25% | Appendices 15% | Code 10% (if available)
- Difficulty: 25% Easy | 50% Medium | 25% Hard
- Each explanation MUST have four fields:
  - `intuition`: accessible analogy, no jargon
  - `math`: exact equation/table citations with page numbers
  - `computation`: Python pseudocode citing file:line from codebase (or paper algorithm)
  - `connection`: link to ablation, table, or codebase

### Code & structure
- Component name: `Quiz` (export default)
- Follow HUSKYQuiz.jsx EXACTLY: quizData array → Quiz component → welcome/quiz/results screens
- Inline styles only (no Tailwind). Dark theme: bg `#0a0a0f`, surface `#111118`, border `#2a2a3a`
- Pick an accent colour that fits the paper theme
- Include Google Fonts @import (Rajdhani + JetBrains Mono) in a <style> tag

### Output
Write the complete JSX file to {quiz_path}.
The file must start with `'use client';` and end with `export default Quiz;`.
Do not include markdown code fences in the file.
"""

    print(f"\nRunning Claude Code (claude -p) — no API key needed…")
    print(f"Quiz will be written to:\n  {quiz_path}")
    print(f"Streaming progress below (tool calls appear as they happen):\n")
    print("─" * 60)

    import json
    process = subprocess.Popen(
        [
            "claude", "-p", prompt,
            "--tools", "Read,Write,Glob,Grep",
            "--permission-mode", "acceptEdits",
            "--output-format", "stream-json",
            "--verbose",
            "--include-partial-messages",
        ],
        cwd=str(REPO_ROOT),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1,
    )

    for raw in (process.stdout or []):
        raw = raw.strip()
        if not raw:
            continue
        try:
            ev = json.loads(raw)
            t = ev.get("type", "")

            # Partial streaming token (--include-partial-messages)
            if t == "content_block_delta":
                delta = ev.get("delta", {})
                if delta.get("type") == "text_delta":
                    print(delta.get("text", ""), end="", flush=True)

            # Tool call starting — show name + path
            elif t == "content_block_start":
                block = ev.get("content_block", {})
                if block.get("type") == "tool_use":
                    inp  = block.get("input", {})
                    path = inp.get("file_path") or inp.get("path") or inp.get("pattern") or ""
                    print(f"\n  [{block.get('name')}] {str(path)[:80]}", flush=True)

            # Full assistant message (non-streaming fallback)
            elif t == "assistant":
                for block in ev.get("message", {}).get("content", []):
                    if block.get("type") == "text":
                        print(block.get("text", ""), end="", flush=True)
                    elif block.get("type") == "tool_use":
                        inp  = block.get("input", {})
                        path = inp.get("file_path") or inp.get("path") or inp.get("pattern") or ""
                        print(f"\n  [{block.get('name')}] {str(path)[:80]}", flush=True)

            elif t == "result":
                cost = ev.get("cost_usd")
                cost_str = f"  cost=${cost:.4f}" if cost else ""
                print(f"\n\n✓ Done{cost_str}", flush=True)

        except json.JSONDecodeError:
            print(raw, flush=True)

    process.wait()
    print("\n" + "─" * 60)
    if process.returncode != 0:
        err = process.stderr.read() if process.stderr else ""
        print(f"claude exited with code {process.returncode}\n{err[:500]}")
        sys.exit(process.returncode)

    if not quiz_path.exists():
        print(f"WARNING: Expected quiz file not found at {quiz_path}")
        print("Claude may have written it elsewhere — check the output above.")
    else:
        size = quiz_path.stat().st_size
        print(f"\nQuiz written → {quiz_path} ({size:,} bytes)")


# ─── app/page.jsx — auto-append to QUIZZES array ─────────────────────────────

def update_page_jsx(quiz_path: Path, paper_title: str, authors: str,
                    year: str, month: str, tags: list[str]) -> None:
    page = REPO_ROOT / "app" / "page.jsx"
    content = page.read_text()

    rel       = quiz_path.relative_to(REPO_ROOT).with_suffix('')
    import_path = '../' + '/'.join(rel.parts)
    component = quiz_path.stem
    slug      = component.lower().replace('quiz', '')
    tags_str  = ', '.join(f"'{t}'" for t in tags)

    if f"slug: '{slug}'" in content:
        print(f"  app/page.jsx already has '{slug}' — skipping")
        return

    # 1. Add import line before sentinel
    import_line = f"import {component} from '{import_path}';"
    content = content.replace(
        '// NEW_QUIZ_IMPORT',
        f'{import_line}\n// NEW_QUIZ_IMPORT'
    )

    # 2. Add QUIZZES entry before sentinel
    entry = (
        f"  {{\n"
        f"    slug: '{slug}',\n"
        f"    title: '{paper_title}',\n"
        f"    authors: '{authors}',\n"
        f"    year: {year},\n"
        f"    month: '{month}',\n"
        f"    tags: [{tags_str}],\n"
        f"    Component: {component},\n"
        f"  }},\n"
        f"  // NEW_QUIZ_ENTRY"
    )
    content = content.replace('  // NEW_QUIZ_ENTRY', entry)

    page.write_text(content)
    print(f"  app/page.jsx updated — added '{paper_title}'")


# ─── Main ─────────────────────────────────────────────────────────────────────

def main() -> None:
    print("╔══════════════════════════════════════════════════════╗")
    print("║   ThusSpokeRobotsPapers — New Paper Quiz Generator   ║")
    print("║              (powered by Claude Code)                ║")
    print("╚══════════════════════════════════════════════════════╝")

    # 1. Pick source (PDF or transcript)
    sources = list_sources()
    pdf = select_source(sources)
    print(f"\nSelected: {pdf.name}")

    # 2. Folder name
    year  = parse_year(pdf.name)
    slug  = slugify(pdf.stem)
    month = MONTH_NAMES[datetime.now().month]
    suggested = f"{month}{year}/{slug}"
    override  = input(f"\nFolder [{suggested}]: ").strip()
    # Guard: reject if user accidentally pasted a URL/git address
    if override and (override.startswith('http') or override.startswith('git@') or '/' in override and ':' in override):
        print(f"  That looks like a URL, not a folder name — using default: {suggested}")
        override = ''
    folder    = override if override else suggested

    # 3. Create folder and copy PDF
    paper_dir = REPO_ROOT / folder
    paper_dir.mkdir(parents=True, exist_ok=True)
    dest = paper_dir / pdf.name
    shutil.copy2(pdf, dest)
    print(f"PDF → {dest}")

    # 4. Optional codebase — auto-detect from existing symlinks in paper_dir
    repo: Path | None = None
    existing_repos = [
        p.resolve() for p in paper_dir.iterdir()
        if p.is_symlink() and p.resolve().is_dir()
    ]
    if existing_repos:
        repo = existing_repos[0]
        print(f"\nFound existing codebase: {repo}")
        ans = input("Use it for code questions? [Y/n] ").strip().lower()
        if ans == 'n':
            repo = None
    else:
        url = input("\nGitHub codebase URL (Enter to skip): ").strip()
        repo = clone_or_locate(url)
        if repo:
            link = paper_dir / repo.name
            if not link.exists():
                link.symlink_to(repo.resolve())

    # 5. Quiz output path
    quiz_path = paper_dir / f"{slug}Quiz.jsx"

    # 6. Paper metadata
    paper_title = re.sub(r'^.*?\d{4}\s*[-–]\s*', '', pdf.stem)
    authors     = re.match(r'^(.*?)\s*[-–]', pdf.stem)
    authors_str = authors.group(1).strip() if authors else 'Unknown'
    month       = MONTH_NAMES[datetime.now().month]

    # 7. Generate
    generate_quiz(dest, paper_title, repo, quiz_path)

    # 8. Auto-update page.jsx index (no prompt)
    if quiz_path.exists():
        update_page_jsx(quiz_path, paper_title, authors_str, year, month, tags=[])

    print(f"\n✓  Done!  Run `pnpm dev` to preview at http://localhost:3000")


if __name__ == "__main__":
    main()

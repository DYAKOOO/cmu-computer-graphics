#!/usr/bin/env python3
"""Log today's quiz study and commit to keep the GitHub streak alive.

Usage:
    python3 scripts/log_streak.py <count> [note...]

Examples:
    python3 scripts/log_streak.py 15 lec8 Q1-Q15
    python3 scripts/log_streak.py 5 reviewed barycentric coords
"""
import os
import subprocess
import sys
from datetime import date
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
LOG = REPO / "streak" / "log.md"


def main() -> int:
    if len(sys.argv) < 2 or not sys.argv[1].isdigit():
        print(__doc__)
        return 1

    count = int(sys.argv[1])
    note = " ".join(sys.argv[2:]) or "questions"
    today = date.today().isoformat()
    entry = f"- {today}: {count} {note}\n"

    LOG.parent.mkdir(exist_ok=True)
    existing = LOG.read_text() if LOG.exists() else "# Daily quiz streak log\n\n"

    # Replace today's entry if it already exists, otherwise append
    lines = existing.splitlines(keepends=True)
    out, replaced = [], False
    for line in lines:
        if line.startswith(f"- {today}:"):
            out.append(entry)
            replaced = True
        else:
            out.append(line)
    if not replaced:
        out.append(entry)
    LOG.write_text("".join(out))

    os.chdir(REPO)
    subprocess.run(["git", "add", str(LOG.relative_to(REPO))], check=True)
    result = subprocess.run(
        ["git", "diff", "--cached", "--quiet"],
        check=False,
    )
    if result.returncode == 0:
        print(f"No change for {today} — already logged with same content.")
        return 0

    subprocess.run(
        ["git", "commit", "-m", f"streak: {today} — {count} {note}"],
        check=True,
    )
    subprocess.run(["git", "push"], check=True)
    print(f"✓ Logged {count} {note} for {today} and pushed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

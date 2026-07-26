#!/usr/bin/env python3
"""debias_quiz.py — remove the length tell from CG quiz options.

67% of CG MCQs had the correct answer as the strictly-longest option (chance = 25%). The
cg-tutor-bot shuffles POSITION at send time, but LENGTH still gives it away. This rewrites
all four options of each MCQ to within ~10 chars, keeping each option's MEANING and the
same correct answer — batched per lecture through Qwen, with a hard verification gate:

  * exactly 4 non-empty options,
  * the new correct option still matches the OLD correct option's meaning (token overlap),
  * the correct option is NOT the strictly-longest.
Cards that fail the gate are LEFT UNCHANGED (never corrupt a question to hit a metric).
The `answer` INDEX is preserved (options[answer] stays the correct concept). All other
fields untouched. Writes quiz_data/lec*.json in place; commit + push makes it live (the
worker reads raw.githubusercontent, 5-min cache).

Env: QWEN_API_KEY.  Usage: python3 scripts/debias_quiz.py [--lecture 5] [--dry-run]
"""
from __future__ import annotations
import argparse
import glob
import json
import os
import re
import time
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
QUIZ = HERE.parent / "quiz_data"
API = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions"
LETTERS = ["A", "B", "C", "D"]

SYS = ("You debias multiple-choice options from a Computer Graphics course (CMU 15-462). "
       "For each question you get its four options and which index is correct. Rewrite ALL "
       "FOUR options to ROUGHLY THE SAME LENGTH. HARD RULES: "
       "(1) KEEP each option's meaning — the correct one stays correct, distractors stay "
       "wrong; (2) the CORRECT option must be one of the SHORTER two, and MUST NOT be the "
       "longest — trim it to a crisp phrase and pad distractors with plausible specifics so "
       "all four land within ~8 characters of each other; (3) no option a complete sentence "
       "while others are fragments; (4) plain text, no markdown/LaTeX. Reply ONLY with a "
       "JSON array, one item per question, in order: "
       "{num, options:[4 strings], answer:<index 0-3>}. Preserve num.")


def toks(s: str) -> set[str]:
    return set(re.findall(r"[a-z0-9]+", (s or "").lower())) - {
        "the", "a", "an", "of", "to", "in", "is", "that", "for", "and", "or", "it"}


def qwen(key: str, sys: str, payload: str) -> list:
    body = json.dumps({"model": "qwen-plus", "temperature": 0.4,
                       "messages": [{"role": "system", "content": sys},
                                    {"role": "user", "content": payload}]}).encode()
    for attempt in (1, 2, 3):
        try:
            req = urllib.request.Request(API, data=body, headers={
                "Authorization": f"Bearer {key}", "Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=180) as r:
                txt = json.loads(r.read())["choices"][0]["message"]["content"]
            m = re.search(r"\[.*\]", txt, re.S)
            return json.loads(m.group(0)) if m else []
        except Exception:
            if attempt == 3:
                return []
            time.sleep(3)
    return []


def longest_is_correct(opts: list[str], ans: int) -> bool:
    lens = [len(o) for o in opts]
    return lens[ans] == max(lens) and lens.count(max(lens)) == 1


SYS2 = ("You fix the LENGTH TELL in multiple-choice options (CMU 15-462 Computer Graphics). "
        "Each input has four options and the correct index. The correct one is currently the "
        "LONGEST, which gives it away. Rewrite so the CORRECT option is the SHORTEST — trim it "
        "to a minimal correct phrase — and make the three distractors somewhat LONGER, "
        "plausible, and still WRONG. Keep the correct option's MEANING. Reply ONLY with a JSON "
        "array in order: {num, options:[4 strings], answer:<index 0-3>}. Preserve num.")


def second_pass(key: str, files: list, dry: bool) -> None:
    """Focused rewrite of ONLY the still-longest-correct cards, in small batches."""
    total = fixed = 0
    for fp in files:
        fp = Path(fp)
        data = json.loads(fp.read_text())
        by_num = {q["num"]: q for q in data["questions"]}
        biased = [q for q in data["questions"]
                  if q.get("format") == "mcq" and isinstance(q.get("options"), list)
                  and len(q["options"]) == 4 and q.get("answer", -1) >= 0
                  and longest_is_correct(q["options"], q["answer"])]
        if not biased:
            continue
        changed = 0
        for i in range(0, len(biased), 8):                     # small batches balance better
            batch = biased[i:i + 8]
            payload = json.dumps([{"num": q["num"], "options": q["options"], "answer": q["answer"]}
                                  for q in batch], ensure_ascii=False)
            out = {r["num"]: r for r in qwen(key, SYS2, payload) if isinstance(r, dict) and "num" in r}
            for q in batch:
                total += 1
                r = out.get(q["num"])
                old_ans = q["answer"]
                ok = (r and isinstance(r.get("options"), list) and len(r["options"]) == 4
                      and all(isinstance(o, str) and o.strip() for o in r["options"])
                      and isinstance(r.get("answer"), int) and 0 <= r["answer"] < 4
                      and not longest_is_correct(r["options"], r["answer"]))
                if ok:
                    overlap = len(toks(q["options"][old_ans]) & toks(r["options"][r["answer"]]))
                    if overlap < max(1, len(toks(q["options"][old_ans])) // 3):
                        ok = False
                if ok:
                    q["options"] = r["options"]; q["answer"] = r["answer"]
                    fixed += 1; changed += 1
        if not dry and changed:
            fp.write_text(json.dumps(data, ensure_ascii=False, indent=2))
        mcqs = [q for q in data["questions"] if q.get("format") == "mcq" and len(q.get("options", [])) == 4]
        after = sum(longest_is_correct(q["options"], q["answer"]) for q in mcqs)
        print(f"  {fp.name:12} fixed {changed:2d}/{len(biased):2d} biased · now {after}/{len(mcqs)} ({100*after//max(1,len(mcqs))}%)")
        time.sleep(0.3)
    print(f"\nsecond pass: {fixed}/{total} stragglers fixed")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--lecture", type=int, default=0)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--second-pass", action="store_true")
    args = ap.parse_args()
    key = os.environ.get("QWEN_API_KEY", "")
    if not key:
        print("QWEN_API_KEY not set"); return 2

    files = ([QUIZ / f"lec{args.lecture}.json"] if args.lecture
             else sorted(glob.glob(str(QUIZ / "lec*.json")),
                         key=lambda p: int(re.search(r"\d+", Path(p).name).group() or 0)))
    if args.second_pass:
        second_pass(key, files, args.dry_run)
        return 0
    tot = fixed = kept_bias = skipped = 0
    for fp in files:
        fp = Path(fp)
        data = json.loads(fp.read_text())
        mcqs = [q for q in data["questions"]
                if q.get("format") == "mcq" and isinstance(q.get("options"), list)
                and len([o for o in q["options"] if o]) >= 2 and q.get("answer", -1) >= 0]
        if not mcqs:
            continue
        payload = json.dumps([{"num": q["num"], "options": q["options"], "answer": q["answer"]}
                              for q in mcqs], ensure_ascii=False)
        out = {r["num"]: r for r in qwen(key, SYS, payload) if isinstance(r, dict) and "num" in r}
        by_num = {q["num"]: q for q in mcqs}
        for num, q in by_num.items():
            tot += 1
            old_ans = q["answer"]
            was_bias = longest_is_correct(q["options"], old_ans)
            r = out.get(num)
            ok = (r and isinstance(r.get("options"), list) and len(r["options"]) == 4
                  and all(isinstance(o, str) and o.strip() for o in r["options"])
                  and isinstance(r.get("answer"), int) and 0 <= r["answer"] < 4)
            if ok:
                # meaning gate: new correct option must overlap the OLD correct option
                overlap = len(toks(q["options"][old_ans]) & toks(r["options"][r["answer"]]))
                needed = max(1, len(toks(q["options"][old_ans])) // 3)
                if overlap < needed or longest_is_correct(r["options"], r["answer"]):
                    ok = False
            if not ok:
                skipped += 1
                if was_bias:
                    kept_bias += 1
                continue
            q["options"] = r["options"]
            q["answer"] = r["answer"]
            fixed += 1
        if not args.dry_run:
            fp.write_text(json.dumps(data, ensure_ascii=False, indent=2))
        after = sum(longest_is_correct(q["options"], q["answer"]) for q in mcqs)
        print(f"  {fp.name:12} {len(mcqs):3d} mcq · longest-correct now {after:3d} ({100*after//len(mcqs)}%)")
        time.sleep(0.3)
    print(f"\n{fixed}/{tot} debiased · {skipped} left unchanged (gate) · {kept_bias} still biased "
          f"(LLM couldn't safely fix){' · DRY RUN' if args.dry_run else ''}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

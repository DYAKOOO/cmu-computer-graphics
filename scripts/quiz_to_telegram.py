#!/usr/bin/env python3
"""
Send CMU graphics quiz questions to a Telegram group as native quiz polls.

Reuses parse_questions() from gen_quiz.py so questions match the deployed site.

Env vars:
  TELEGRAM_BOT_TOKEN  bot token from @BotFather
  TELEGRAM_CHAT_ID    target chat/group id (use a negative id for groups)

Usage:
  python3 scripts/quiz_to_telegram.py 3 1 3       # send Q1..Q3 of lecture 3
  python3 scripts/quiz_to_telegram.py 3 4 6
  python3 scripts/quiz_to_telegram.py 3 1 70 --batch-size 3 --pause 2
"""
import argparse
import json
import os
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from gen_quiz import parse_questions  # noqa: E402

TG_QUESTION_LIMIT = 300
TG_OPTION_LIMIT   = 100
TG_EXPLAIN_LIMIT  = 200


def truncate(s, limit):
    s = (s or '').strip()
    if len(s) <= limit:
        return s
    return s[: limit - 1].rstrip() + '…'


def send_poll(token, chat_id, q):
    """Send a single quiz poll. Returns the Telegram response dict."""
    options = [truncate(opt, TG_OPTION_LIMIT) for opt in q['options'] if opt]
    if len(options) < 2:
        return {'ok': False, 'error': f"{q['qid']}: <2 options, skipped"}

    payload = {
        'chat_id':           chat_id,
        'question':          truncate(f"[{q['qid']}] {q['question']}", TG_QUESTION_LIMIT),
        'options':           json.dumps(options, ensure_ascii=False),
        'type':              'quiz',
        'correct_option_id': q['answer'],
        'is_anonymous':      'false',
    }
    expl = q.get('explanation') or q.get('intuition') or ''
    if expl:
        payload['explanation'] = truncate(expl.replace('\n', ' '), TG_EXPLAIN_LIMIT)

    body = urllib.parse.urlencode(payload).encode()
    url = f'https://api.telegram.org/bot{token}/sendPoll'
    req = urllib.request.Request(url, data=body, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        return {'ok': False, 'error': f'HTTP {e.code}: {e.read().decode()[:300]}'}
    except Exception as e:
        return {'ok': False, 'error': str(e)}


def append_log(log_path, q, result):
    """Append one line summarising the send to the per-lecture markdown log."""
    os.makedirs(os.path.dirname(log_path), exist_ok=True)
    ts = datetime.now(timezone.utc).isoformat(timespec='seconds')
    ok = result.get('ok')
    if ok:
        poll = result['result'].get('poll', {})
        poll_id = poll.get('id', '')
        msg_id = result['result'].get('message_id', '')
        correct_letter = 'ABCD'[q['answer']]
        line = (
            f"- {ts} | {q['qid']} | msg={msg_id} | poll={poll_id} | "
            f"correct={correct_letter} ({truncate(q['options'][q['answer']], 60)})\n"
        )
    else:
        line = f"- {ts} | {q['qid']} | ERROR: {result.get('error','')[:200]}\n"
    with open(log_path, 'a') as f:
        f.write(line)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('lecture', help='Lecture number, e.g. 3')
    ap.add_argument('start',   type=int, help='First question number to send (inclusive)')
    ap.add_argument('end',     type=int, help='Last question number to send (inclusive)')
    ap.add_argument('--pause', type=float, default=1.5,
                    help='Seconds to wait between polls (Telegram rate limit ~1/sec; default 1.5)')
    ap.add_argument('--dry-run', action='store_true', help='Print what would be sent, do not call Telegram')
    args = ap.parse_args()

    token   = os.environ.get('TELEGRAM_BOT_TOKEN', '').strip()
    chat_id = os.environ.get('TELEGRAM_CHAT_ID',   '').strip()
    if not args.dry_run and (not token or not chat_id):
        sys.exit('error: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set in env')

    md_path = os.path.join(ROOT, 'lectures', f'cg-{int(args.lecture):02d}-lecture-quiz.md')
    if not os.path.exists(md_path):
        sys.exit(f'error: quiz markdown not found: {md_path}')

    questions = parse_questions(md_path)
    selected = [q for q in questions if q['format'] == 'mcq'
                                       and not q['qid'].startswith('QF')
                                       and args.start <= q['num'] <= args.end]
    if not selected:
        sys.exit(f'error: no MCQ questions in range Q{args.start}..Q{args.end}')

    log_path = os.path.join(ROOT, 'telegram_quiz', f'lec{int(args.lecture)}.md')

    print(f'Sending {len(selected)} questions (Q{args.start}..Q{args.end}) → chat {chat_id or "(dry-run)"}')
    print(f'Log: {log_path}')
    print()

    for i, q in enumerate(selected):
        question_preview = truncate(q['question'], 70)
        if args.dry_run:
            print(f'  [DRY] {q["qid"]}: {question_preview}')
            print(f'        correct: {chr(65+q["answer"])}) {truncate(q["options"][q["answer"]], 60)}')
            continue
        result = send_poll(token, chat_id, q)
        append_log(log_path, q, result)
        if result.get('ok'):
            print(f'  ✓ {q["qid"]}  {question_preview}')
        else:
            print(f'  ✗ {q["qid"]}  {result.get("error","")[:200]}')
        if i < len(selected) - 1:
            time.sleep(args.pause)

    print()
    print(f'Done. Tail the log:  tail {log_path}')


if __name__ == '__main__':
    main()

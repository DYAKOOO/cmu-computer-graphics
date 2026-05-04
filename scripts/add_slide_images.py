#!/usr/bin/env python3
"""
For each lecture: extract slide text, convert PDF to images, match each quiz
question to its best slide, and insert the image reference into the Logseq
markdown file — skipping questions that already have any image attached.

Usage:
  python3 scripts/add_slide_images.py <lecture_num> [--dry-run]

Examples:
  python3 scripts/add_slide_images.py 6
  python3 scripts/add_slide_images.py 13 --dry-run
"""
import os, re, sys, json, subprocess, shutil, random, argparse
from pathlib import Path

BASE        = Path(__file__).resolve().parent.parent
PDF_DIR     = BASE / 'lecture_pdfs'
PUB_ASSETS  = BASE / 'public' / 'assets'
LOG_ASSETS  = Path('/home/diako/csRobotics/logseq3/assets')
LOG_PAGES   = Path('/home/diako/csRobotics/logseq3/pages')

LECTURES = {
    '6':  {'pdf': '06_3drotations_slides.pdf',         'file': 'cg-06-lecture-quiz.md.md'},
    '7':  {'pdf': '07_texture_slides.pdf',             'file': 'cg-07-lecture-quiz.md.md'},
    '8':  {'pdf': '08_depthtransparency_slides.pdf',   'file': 'cg-08-lecture-quiz.md'},
    '9':  {'pdf': '09_introgeometry_slides.pdf',       'file': 'cg-09-lecture-quiz.md.md'},
    '13': {'pdf': '13_spatialdatastructures_slides.pdf','file': 'cg-13-lecture-quiz.md.md'},
    '14': {'pdf': '14_color_slides.pdf',               'file': 'cg-14-lecture-quiz.md.md'},
    '15': {'pdf': '15_radiometry_slides.pdf',          'file': 'cg-15-lecture-quiz.md.md'},
    '16': {'pdf': '16_renderingequation_slides.pdf',   'file': 'cg-16-lecture-quiz.md.md'},
    '17': {'pdf': '17_numericalintegration_slides.pdf','file': 'cg-17-lecture-quiz.md.md'},
    '18': {'pdf': '18_montecarloraytracing_slides.pdf','file': 'cg-18-lecture-quiz.md.md'},
    '19': {'pdf': '19_variancereduction_slides.pdf',   'file': 'cg-19-lecture-quiz.md.md'},
}


# ── Slide text extraction ─────────────────────────────────────────────────────

def extract_slides(pdf_path: Path, lec_num: str) -> dict:
    """Return {slide_num_str: text} for every page of the PDF."""
    cache = Path(f'/tmp/lec{lec_num}_slides.json')
    if cache.exists():
        return json.loads(cache.read_text())

    result = subprocess.run(
        ['pdftotext', '-layout', str(pdf_path), '-'],
        capture_output=True, text=True
    )
    pages = result.stdout.split('\x0c')
    slides = {}
    for i, page in enumerate(pages, 1):
        text = page.strip()
        if text:
            slides[str(i)] = text
    cache.write_text(json.dumps(slides, indent=2))
    print(f"  Extracted {len(slides)} slides → {cache}")
    return slides


# ── Image generation ──────────────────────────────────────────────────────────

def generate_images(pdf_path: Path, lec_num: str) -> int:
    """Convert PDF pages to PNG images. Returns number of new images."""
    prefix = f'lec{lec_num}_slide'
    tmp_prefix = f'/tmp/{prefix}'

    # Generate if not already done
    existing = list(Path('/tmp').glob(f'{prefix}_*.png'))
    if not existing:
        subprocess.run(
            ['pdftoppm', '-r', '150', '-png', str(pdf_path), tmp_prefix],
            check=True
        )

    # Rename hyphen → underscore
    for f in Path('/tmp').glob(f'{prefix}-*.png'):
        new = str(f).replace(f'{prefix}-', f'{prefix}_')
        os.rename(str(f), new)

    images = sorted(Path('/tmp').glob(f'{prefix}_*.png'))
    copied = 0
    for img in images:
        for dst_dir in [PUB_ASSETS, LOG_ASSETS]:
            dst = dst_dir / img.name
            if not dst.exists():
                shutil.copy2(str(img), str(dst))
                copied += 1

    print(f"  {len(images)} images ready, {copied} newly copied")
    return len(images)


# ── Keyword scoring ───────────────────────────────────────────────────────────

STOPWORDS = {
    'the','a','an','is','are','was','were','be','been','being','have','has',
    'had','do','does','did','will','would','could','should','may','might',
    'that','this','these','those','of','in','on','at','to','for','from',
    'with','by','as','or','and','but','not','it','its','we','our','you',
    'your','they','their','what','which','how','why','when','where','who',
    'can','if','then','so','all','also','just','more','most','some','any',
    'each','both','into','than','about','up','out','no','use','used','using',
}

def keywords(text: str) -> set:
    words = re.findall(r'[a-zA-Z]{3,}', text.lower())
    return {w for w in words if w not in STOPWORDS}

def score_slide(q_kws: set, slide_text: str) -> int:
    return len(q_kws & keywords(slide_text))


# ── Temporal slide matching ───────────────────────────────────────────────────

def match_questions_to_slides(blocks: list, slides: dict) -> list:
    """
    For each block, find the best slide using keyword scoring + monotonic ordering.
    Returns list of (block, slide_num_or_None).
    slide_num is None if the block already has an image or is not a card.
    """
    results = []
    last_slide = 1
    n_slides = max(int(k) for k in slides)

    for block in blocks:
        # Not a card, or already has an image → skip
        if not re.search(r'- #card', block):
            results.append((block, None))
            continue
        if re.search(r'!\[.*?\]\(\.\./assets/', block):
            results.append((block, None))  # already has image, don't touch
            continue

        # Build keyword set from question + explanation
        q_match = re.search(r'- #card.*?$', block, re.MULTILINE)
        exp_match = re.search(r'- EXPLANATION:\s*([\s\S]*?)(?=\n\s*- (?:INTUITION|CODE|ANSWER):|\n- #card|\Z)', block)
        search_text = (q_match.group(0) if q_match else '') + ' ' + (exp_match.group(1) if exp_match else '')
        q_kws = keywords(search_text)

        if not q_kws:
            results.append((block, last_slide))
            continue

        # Score all slides from last_slide onward (enforce monotonic ordering)
        best_slide, best_score = last_slide, -1
        for snum in range(last_slide, n_slides + 1):
            s = score_slide(q_kws, slides.get(str(snum), ''))
            if s > best_score:
                best_score, best_slide = s, snum

        last_slide = best_slide
        results.append((block, best_slide))

    return results


# ── Markdown update ───────────────────────────────────────────────────────────

def insert_image_into_block(block: str, img_ref: str) -> str:
    """
    Insert the image ref after the last line of the EXPLANATION block,
    or after ANSWER if no EXPLANATION, or at the end of the block.
    """
    # Find EXPLANATION block end — insert before next block marker or end
    exp_m = re.search(
        r'(- EXPLANATION:[\s\S]*?)(\n\s*- (?:INTUITION|CODE|ANSWER):|\n- #card|\Z)',
        block
    )
    if exp_m:
        insert_at = exp_m.end(1)
        return block[:insert_at] + f'\n\t  {img_ref}' + block[insert_at:]

    # Fallback: after ANSWER line
    ans_m = re.search(r'(- ANSWER:.*?)(\n\s*- (?:INTUITION|CODE):|\n- #card|\Z)', block)
    if ans_m:
        insert_at = ans_m.end(1)
        return block[:insert_at] + f'\n\t  {img_ref}' + block[insert_at:]

    # Last resort: append before any trailing newlines
    return block.rstrip() + f'\n\t  {img_ref}\n'


# ── Main ──────────────────────────────────────────────────────────────────────

def process(lec_num: str, dry_run: bool = False):
    cfg = LECTURES.get(lec_num)
    if not cfg:
        print(f"Unknown lecture: {lec_num}"); return

    pdf_path  = PDF_DIR / cfg['pdf']
    md_path   = LOG_PAGES / cfg['file']
    prefix    = f'lec{lec_num}_slide'

    if not pdf_path.exists():
        print(f"PDF not found: {pdf_path}"); return
    if not md_path.exists():
        print(f"Markdown not found: {md_path}"); return

    print(f"\n=== Lecture {lec_num}: {cfg['file']} ===")

    # 1. Extract slide texts
    slides = extract_slides(pdf_path, lec_num)
    n_slides = len(slides)
    print(f"  {n_slides} slides")

    # 2. Generate images
    generate_images(pdf_path, lec_num)

    # 3. Parse markdown into blocks (split on card boundaries, keep header)
    content = md_path.read_text()
    # Split so each #card block is its own chunk; keep the header (first chunk)
    raw_blocks = re.split(r'(?=\n- #card )', content)
    # The first chunk is the file header; remaining are card blocks
    header = raw_blocks[0]
    card_blocks = raw_blocks[1:]  # each starts with \n- #card

    # 4. Check existing coverage
    total_cards = len(card_blocks)
    already_have_image = sum(1 for b in card_blocks if re.search(r'!\[.*?\]\(\.\./assets/', b))
    print(f"  {total_cards} cards, {already_have_image} already have images")

    if already_have_image == total_cards:
        print("  All cards already have images — nothing to do.")
        return

    # 5. Match cards to slides
    matched = match_questions_to_slides(card_blocks, slides)

    # 6. Insert image refs
    updated_blocks = []
    inserted = 0
    for block, slide_num in matched:
        if slide_num is None or not re.match(r'\n- #card', block):
            updated_blocks.append(block)
        else:
            # Zero-pad slide number to 2 digits
            padded = str(slide_num).zfill(2)
            img_ref = f'![{prefix}_{padded}.png](../assets/{prefix}_{padded}.png)'
            updated_blocks.append(insert_image_into_block(block, img_ref))
            inserted += 1

    new_content = header + ''.join(updated_blocks)

    if dry_run:
        print(f"  [DRY RUN] Would insert {inserted} image refs")
        # Show a sample
        for block, slide_num in matched[:3]:
            if slide_num:
                q_m = re.search(r'- #card \[Q\w*\].*?$', block, re.MULTILINE)
                print(f"    Q → slide {slide_num:02d}: {q_m.group(0)[:80] if q_m else '?'}")
    else:
        md_path.write_text(new_content)
        print(f"  Inserted {inserted} image refs into {md_path.name}")

    return inserted


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('lecture_num', nargs='?', default='all',
                    help='Lecture number (6-9, 13-19) or "all"')
    ap.add_argument('--dry-run', action='store_true')
    args = ap.parse_args()

    targets = list(LECTURES.keys()) if args.lecture_num == 'all' else [args.lecture_num]
    for lec in targets:
        process(lec, dry_run=args.dry_run)

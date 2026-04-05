#!/usr/bin/env python3
"""
Generate interactive React JSX quiz components from Logseq lecture quiz markdown files.

Usage:
  python gen_quiz.py <markdown_file> <lecture_num> [--part-size N]

The lectures/ folder should be symlinks to the actual Logseq pages:
  ln -s /path/to/logseq/pages/cg-XX-lecture-quiz.md lectures/cg-XX-lecture-quiz.md

This means editing notes in Logseq automatically updates the source for quiz generation.
Re-run this script after editing to regenerate the JSX files.
"""
import re
import sys
import os

PART_SIZE = 32  # max questions per quiz part


def parse_questions(md_path):
    with open(md_path, 'r') as f:
        content = f.read()

    # Split on question card boundaries
    blocks = re.split(r'(?=- #card \[Q\d+\])', content)
    questions = []

    for block in blocks:
        # Match question header line
        header = re.match(
            r'- #card \[Q(\d+)\]\s*(?:\[[^\]]*\]\s*)*\[([^\]]+)\]\s*(.+?)$',
            block, re.MULTILINE
        )
        if not header:
            continue

        qnum = int(header.group(1))
        timestamp = header.group(2).strip()
        question_raw = header.group(3).strip()
        # Strip trailing [[tags]] from question text
        question = re.sub(r'\s*\[\[.*?\]\]', '', question_raw).strip()

        # Extract A-D options (indented lines starting with A)/B)/C)/D))
        opts = {}
        for letter in 'ABCD':
            om = re.search(
                rf'^\s+{letter}\)\s+(.+?)(?:\s*\[\[.*?\]\])*\s*$',
                block, re.MULTILINE
            )
            if om:
                opts[letter] = om.group(1).strip()

        if len(opts) < 2:
            continue

        # Answer
        ans_m = re.search(r'- ANSWER:\s*([A-D])', block)
        answer = ans_m.group(1) if ans_m else 'A'

        # Full explanation block: everything from "- EXPLANATION:" to next top-level bullet or end
        exp_m = re.search(r'- EXPLANATION:\s*([\s\S]*?)(?=\n- #card|\n- ANSWER:|\Z)', block)
        explanation_raw = ''
        explanation_text = ''
        exp_images = []

        if exp_m:
            explanation_raw = exp_m.group(1)
            # Extract images within explanation
            exp_images = re.findall(r'!\[image\.png\]\(\.\./assets/(image_[^)]+)\)', explanation_raw)
            # Clean for display text: remove image lines, collapse Logseq IDs, strip [[tags]]
            text = re.sub(r'!\[image\.png\]\([^\)]+\)', '', explanation_raw)
            text = re.sub(r'\[\[.*?\]\]', '', text)
            text = re.sub(r'\s*id::[^\n]+', '', text)
            text = re.sub(r'\s*card-[a-z\-]+::[^\n]+', '', text)
            text = re.sub(r'\s*collapsed::\s*(true|false)', '', text)
            # Normalize whitespace but keep newlines between paragraphs
            lines = [l.strip() for l in text.strip().splitlines()]
            # Filter empty lines runs and join
            clean_lines = []
            for l in lines:
                if l or (clean_lines and clean_lines[-1]):
                    clean_lines.append(l)
            explanation_text = '\n'.join(clean_lines).strip()

        # All images in the entire block (question area + explanation)
        all_images = re.findall(r'!\[image\.png\]\(\.\./assets/(image_[^)]+)\)', block)
        # Deduplicate preserving order
        seen = set()
        images = []
        for img in all_images:
            if img not in seen:
                seen.add(img)
                images.append(img)

        # Logseq tags on the question line
        tags = re.findall(r'\[\[([^\]]+)\]\]', header.group(3))

        questions.append({
            'num': qnum,
            'timestamp': timestamp,
            'question': question,
            'options': [opts.get('A', ''), opts.get('B', ''), opts.get('C', ''), opts.get('D', '')],
            'answer': ord(answer) - ord('A'),
            'explanation': explanation_text,
            'images': images,
            'tags': tags,
        })

    questions.sort(key=lambda x: x['num'])
    return questions


def escape_js(s):
    """Escape for use inside JS template literals."""
    return s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')


def gen_jsx(questions, part_num, total_parts, cfg, source_file):
    """Generate one JSX file for a subset of questions."""
    title = cfg['title']
    accent = cfg['accent']
    icon = cfg['icon']
    part_label = f'Part {part_num}' if total_parts > 1 else ''
    display_title = f'{title}{" — " + part_label if part_label else ""}'
    q_range = f'Q{questions[0]["num"]}–Q{questions[-1]["num"]}'
    source_basename = os.path.basename(source_file)

    lines = []
    def w(s=''):
        lines.append(s)

    w("'use client'")
    w("import { useState, useEffect, useRef } from 'react'")
    w(f"import {{ {icon} }} from 'lucide-react'")
    w()
    w(f"// Source: lectures/{source_basename}  (symlinked from Logseq pages)")
    w(f"// {display_title} — {q_range} ({len(questions)} questions)")
    w(f"// Re-generate: python3 scripts/gen_quiz.py lectures/{source_basename} {cfg['lec_num']}")
    w()

    # SlideImages component
    w("function SlideImages({ images }) {")
    w("  if (!images || images.length === 0) return null")
    w("  return (")
    w("    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', margin: '0.75rem 0' }}>")
    w("      {images.map((img, i) => (")
    w("        <img key={i} src={`/assets/${img}`} alt={`slide-${i+1}`}")
    w("          onError={e => { e.target.style.display = 'none' }}")
    w("          style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid #334155', display: 'block' }} />")
    w("      ))}")
    w("    </div>")
    w("  )")
    w("}")
    w()

    # Quiz data array
    w("const quizData = [")
    for q in questions:
        opts_js = ', '.join(f'`{escape_js(o)}`' for o in q['options'])
        imgs_js = ', '.join(f'"{i}"' for i in q['images'])
        tags_js = ', '.join(f'"{t}"' for t in q['tags'])
        w("  {")
        w(f"    num: {q['num']},")
        w(f"    timestamp: `{escape_js(q['timestamp'])}`,")
        w(f"    question: `{escape_js(q['question'])}`,")
        w(f"    options: [{opts_js}],")
        w(f"    answer: {q['answer']},")
        w(f"    explanation: `{escape_js(q['explanation'])}`,")
        w(f"    images: [{imgs_js}],")
        w(f"    tags: [{tags_js}],")
        w(f"    source: `lectures/{escape_js(source_basename)}`,")
        w("  },")
    w("]")
    w()

    # Timer hook
    w("function useTimer() {")
    w("  const [elapsed, setElapsed] = useState(0)")
    w("  const ref = useRef(null)")
    w("  const start = () => { ref.current = setInterval(() => setElapsed(e => e + 1), 1000) }")
    w("  const stop = () => clearInterval(ref.current)")
    w("  const reset = () => { clearInterval(ref.current); setElapsed(0) }")
    w("  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`")
    w("  return { elapsed, fmt, start, stop, reset }")
    w("}")
    w()

    component_name = f"Lec{cfg['lec_num']}Part{part_num}Quiz" if total_parts > 1 else f"Lec{cfg['lec_num']}Quiz"
    w(f"export default function {component_name}() {{")
    w("  const [screen, setScreen] = useState('welcome')")
    w("  const [idx, setIdx] = useState(0)")
    w("  const [selected, setSelected] = useState(null)")
    w("  const [revealed, setRevealed] = useState(false)")
    w("  const [score, setScore] = useState(0)")
    w("  const [history, setHistory] = useState([])")
    w("  const timer = useTimer()")
    w("  const q = quizData[idx]")
    w(f"  const ACCENT = '{accent}'")
    w("  const card = { background: '#1e293b', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid #334155' }")
    w()

    # --- WELCOME SCREEN ---
    w("  if (screen === 'welcome') return (")
    w("    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'system-ui,sans-serif' }}>")
    w(f"      <{icon} size={{48}} color={{ACCENT}} style={{{{ marginBottom: '1.5rem' }}}} />")
    w(f"      <h1 style={{{{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem' }}}}>{display_title}</h1>")
    w(f"      <p style={{{{ color: '#94a3b8', marginBottom: '0.25rem' }}}}>{cfg['subtitle']}</p>")
    w(f"      <p style={{{{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}}}>{q_range} · {len(questions)} questions</p>")
    if total_parts > 1:
        link_parts = []
        for pn in range(1, total_parts + 1):
            color = 'ACCENT' if pn == part_num else '"#64748b"'
            link_parts.append(f'<a href="/{cfg["route"]}/{pn}" style={{{{ color: {color} }}}}>Part {pn}</a>')
        part_links = ' · '.join(link_parts)
        w(f"      <p style={{{{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1.5rem' }}}}>")
        w(f"        {part_links}")
        w("      </p>")
    w(f"      <p style={{{{ color: ACCENT, fontWeight: 600, fontSize: '0.85rem', marginBottom: '2rem', fontFamily: 'monospace' }}}}>lectures/{source_basename}</p>")
    w("      <button onClick={() => { setScreen('quiz'); timer.start() }}")
    w("        style={{ background: ACCENT, color: '#0f172a', fontWeight: 700, padding: '0.75rem 2.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1rem', marginBottom: '1rem' }}>")
    w("        Start Quiz")
    w("      </button>")
    w("      <a href='/' style={{ color: '#64748b', fontSize: '0.875rem' }}>← All quizzes</a>")
    w("    </div>")
    w("  )")
    w()

    # --- RESULTS SCREEN ---
    w("  if (screen === 'results') {")
    w("    const pct = Math.round(score / quizData.length * 100)")
    w("    return (")
    w("      <div style={{ minHeight: '100vh', background: '#0f172a', padding: '2rem', fontFamily: 'system-ui,sans-serif', color: '#f1f5f9' }}>")
    w("        <div style={{ maxWidth: '860px', margin: '0 auto' }}>")
    w(f"          <div style={{{{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}}}><{icon} size={{20}} color={{ACCENT}} /><h1 style={{{{ color: ACCENT, fontSize: '1.25rem', fontWeight: 700, margin: 0 }}}}>{display_title} — Results</h1></div>")
    w("          <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Time: {timer.fmt(timer.elapsed)}</p>")
    w("          <div style={{ ...card, textAlign: 'center', marginBottom: '2rem' }}>")
    w("            <div style={{ fontSize: '3rem', fontWeight: 800, color: ACCENT }}>{pct}%</div>")
    w("            <div style={{ color: '#94a3b8', marginTop: '0.5rem' }}>{score} / {quizData.length} correct</div>")
    w("          </div>")
    w("          {history.map((chosen, i) => {")
    w("            const qq = quizData[i]")
    w("            const ok = chosen === qq.answer")
    w("            return (")
    w("              <div key={i} style={{ ...card, borderColor: ok ? '#22c55e55' : '#ef444455', marginBottom: '1.25rem' }}>")
    w("                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>")
    w("                  <span style={{ color: '#64748b', fontSize: '0.78rem', fontFamily: 'monospace' }}>Q{qq.num} [{qq.timestamp}] · {qq.source}</span>")
    w("                  <span style={{ color: ok ? '#22c55e' : '#ef4444', fontSize: '1.1rem' }}>{ok ? '✓' : '✗'}</span>")
    w("                </div>")
    w("                <div style={{ fontWeight: 600, marginBottom: '0.75rem', lineHeight: 1.5 }}>{qq.question}</div>")
    w("                <div style={{ color: ok ? '#22c55e' : '#ef4444', fontSize: '0.9rem' }}>")
    w("                  Your answer: {qq.options[chosen]}")
    w("                </div>")
    w("                {!ok && <div style={{ color: '#22c55e', fontSize: '0.9rem', marginTop: '0.25rem' }}>Correct: {qq.options[qq.answer]}</div>}")
    w("                {qq.explanation ? (")
    w("                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #334155' }}>")
    w("                    <div style={{ color: ACCENT, fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.4rem' }}>EXPLANATION</div>")
    w("                    <div style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{qq.explanation}</div>")
    w("                  </div>")
    w("                ) : null}")
    w("                <SlideImages images={qq.images} />")
    w("                {qq.tags.length > 0 && <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>")
    w("                  {qq.tags.map((t, ti) => <span key={ti} style={{ background: `${ACCENT}22`, color: ACCENT, fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '99px' }}>{t}</span>)}")
    w("                </div>}")
    w("              </div>")
    w("            )")
    w("          })}")
    w("          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>")
    w("            <button onClick={() => { setScreen('welcome'); setIdx(0); setScore(0); setHistory([]); timer.reset() }}")
    w("              style={{ background: ACCENT, color: '#0f172a', fontWeight: 700, padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>")
    w("              Restart")
    w("            </button>")
    w("            <a href='/' style={{ display: 'flex', alignItems: 'center', color: '#64748b', fontSize: '0.875rem' }}>← All quizzes</a>")
    w("          </div>")
    w("        </div>")
    w("      </div>")
    w("    )")
    w("  }")
    w()

    # --- QUIZ SCREEN ---
    w("  const handleSelect = (i) => { if (!revealed) setSelected(i) }")
    w("  const handleReveal = () => { if (selected !== null) { setRevealed(true); if (selected === q.answer) setScore(s => s + 1) } }")
    w("  const handleNext = () => {")
    w("    setHistory(h => [...h, selected])")
    w("    if (idx + 1 >= quizData.length) { timer.stop(); setScreen('results') }")
    w("    else { setIdx(i => i + 1); setSelected(null); setRevealed(false) }")
    w("  }")
    w()
    w("  return (")
    w("    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '1.5rem', fontFamily: 'system-ui,sans-serif', color: '#f1f5f9' }}>")
    w("      <div style={{ maxWidth: '860px', margin: '0 auto' }}>")
    w()
    w("        {/* Header */}")
    w("        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>")
    w(f"          <div style={{{{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}}}><{icon} size={{18}} color={{ACCENT}} /><span style={{{{ color: ACCENT, fontWeight: 600, fontSize: '0.95rem' }}}}>{display_title}</span></div>")
    w("          <div style={{ display: 'flex', gap: '1.25rem', color: '#94a3b8', fontSize: '0.85rem' }}>")
    w("            <span>{timer.fmt(timer.elapsed)}</span>")
    w(f"            <span>{{idx+1}}/{len(questions)}</span>")
    w("            <span style={{ color: ACCENT }}>✓ {score}</span>")
    w("          </div>")
    w("        </div>")
    w()
    w("        {/* Progress bar */}")
    w(f"        <div style={{{{ background: '#1e293b', borderRadius: '99px', height: '5px', marginBottom: '1.25rem' }}}}>")
    w(f"          <div style={{{{ background: ACCENT, height: '100%', borderRadius: '99px', width: `${{Math.round((idx+1)/{len(questions)}*100)}}%`, transition: 'width 0.3s' }}}} />")
    w("        </div>")
    w()
    w("        {/* Question */}")
    w("        <div style={card}>")
    w("          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>")
    w("            <span style={{ color: '#64748b', fontSize: '0.78rem', fontFamily: 'monospace' }}>Q{q.num} · [{q.timestamp}]</span>")
    w(f"            <span style={{{{ color: '#475569', fontSize: '0.72rem', fontFamily: 'monospace' }}}}>lectures/{source_basename}</span>")
    w("          </div>")
    w("          <div style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.65, marginBottom: '1.25rem' }}>{q.question}</div>")
    w()
    w("          {/* Slide images shown before answering if present */}")
    w("          {!revealed && <SlideImages images={q.images} />}")
    w()
    w("          {/* Options */}")
    w("          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>")
    w("            {q.options.map((opt, i) => {")
    w("              let bg = '#0f172a', border = '#334155', color = '#cbd5e1'")
    w("              if (selected === i && !revealed) { bg = `${ACCENT}22`; border = ACCENT; color = '#f1f5f9' }")
    w("              if (revealed && i === q.answer) { bg = '#22c55e1a'; border = '#22c55e'; color = '#22c55e' }")
    w("              if (revealed && selected === i && i !== q.answer) { bg = '#ef44441a'; border = '#ef4444'; color = '#ef4444' }")
    w("              return (")
    w("                <button key={i} onClick={() => handleSelect(i)} style={{ background: bg, border: `1px solid ${border}`, color, padding: '0.75rem 1rem', borderRadius: '8px', textAlign: 'left', cursor: revealed ? 'default' : 'pointer', fontSize: '0.95rem', lineHeight: 1.5, transition: 'all 0.15s' }}>")
    w("                  <span style={{ fontWeight: 700, marginRight: '0.5rem' }}>{['A','B','C','D'][i]}.</span>{opt}")
    w("                </button>")
    w("              )")
    w("            })}")
    w("          </div>")
    w("        </div>")
    w()
    w("        {/* Explanation card (flip side) */}")
    w("        {revealed && (")
    w("          <div style={{ ...card, borderColor: `${ACCENT}44` }}>")
    w("            <div style={{ color: ACCENT, fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>EXPLANATION</div>")
    w("            {q.explanation ? (")
    w("              <div style={{ color: '#cbd5e1', lineHeight: 1.75, whiteSpace: 'pre-wrap', marginBottom: '0.75rem' }}>{q.explanation}</div>")
    w("            ) : <div style={{ color: '#475569', fontSize: '0.875rem' }}>No explanation provided.</div>}")
    w("            <SlideImages images={q.images} />")
    w("            {q.tags.length > 0 && (")
    w("              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>")
    w("                {q.tags.map((t, ti) => (")
    w("                  <span key={ti} style={{ background: `${ACCENT}22`, color: ACCENT, fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '99px' }}>{t}</span>")
    w("                ))}")
    w("              </div>")
    w("            )}")
    w("          </div>")
    w("        )}")
    w()
    w("        {/* Action buttons */}")
    w("        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>")
    w("          {!revealed && (")
    w("            <button onClick={handleReveal} disabled={selected === null}")
    w("              style={{ background: selected !== null ? ACCENT : '#1e293b', color: selected !== null ? '#0f172a' : '#475569', fontWeight: 700, padding: '0.75rem 2rem', borderRadius: '8px', border: `1px solid ${selected !== null ? ACCENT : '#334155'}`, cursor: selected !== null ? 'pointer' : 'not-allowed', transition: 'all 0.15s' }}>")
    w("              Check Answer")
    w("            </button>")
    w("          )}")
    w("          {revealed && (")
    w("            <button onClick={handleNext}")
    w("              style={{ background: ACCENT, color: '#0f172a', fontWeight: 700, padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>")
    w(f"              {{idx + 1 >= {len(questions)} ? 'See Results →' : 'Next →'}}")
    w("            </button>")
    w("          )}")
    w("          <a href='/' style={{ display: 'flex', alignItems: 'center', color: '#475569', fontSize: '0.875rem' }}>← All quizzes</a>")
    w("        </div>")
    w("      </div>")
    w("    </div>")
    w("  )")
    w("}")
    w()

    return '\n'.join(lines)


CONFIGS = {
    '3': {
        'lec_num': '3',
        'title': 'Lecture 3: Vector Calculus',
        'subtitle': 'Gradient, Divergence, Curl, Laplacian, Hessian',
        'accent': '#38bdf8',
        'icon': 'Sigma',
        'route': 'lec3',
        'file_prefix': 'Lec3VectorCalculus',
    },
    '4': {
        'lec_num': '4',
        'title': 'Lecture 4: Rasterization & Sampling',
        'subtitle': 'Pipeline, Coverage, Aliasing, SSAA, Nyquist',
        'accent': '#34d399',
        'icon': 'Monitor',
        'route': 'lec4',
        'file_prefix': 'Lec4Rasterization',
    },
    '5': {
        'lec_num': '5',
        'title': 'Lecture 5: Spatial Transformations',
        'subtitle': 'Linear maps, homogeneous coords, rotation, translation',
        'accent': '#f59e0b',
        'icon': 'Move',
        'route': 'lec5',
        'file_prefix': 'Lec5SpatialTransformations',
    },
    '2': {
        'lec_num': '2',
        'title': 'Lecture 2: Linear Algebra',
        'subtitle': 'Vectors, inner products, Gram-Schmidt, Fourier',
        'accent': '#818cf8',
        'icon': 'Grid',
        'route': 'lec2',
        'file_prefix': 'Lec2LinearAlgebra',
    },
}


def copy_images(questions, assets_dst):
    """Copy any referenced images from Logseq assets to public/assets/."""
    logseq_assets = '/home/diako/csRobotics/logseq3/assets'
    os.makedirs(assets_dst, exist_ok=True)
    copied = 0
    for q in questions:
        for img in q['images']:
            src = os.path.join(logseq_assets, img)
            dst = os.path.join(assets_dst, img)
            if os.path.exists(src) and not os.path.exists(dst):
                import shutil
                shutil.copy2(src, dst)
                copied += 1
    return copied


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('markdown_file', help='Path to the lecture quiz .md file')
    parser.add_argument('lecture_num', help=f'Lecture number. Known: {list(CONFIGS.keys())}')
    parser.add_argument('--part-size', type=int, default=PART_SIZE, help=f'Max questions per part (default {PART_SIZE})')
    args = parser.parse_args()

    cfg = CONFIGS.get(args.lecture_num)
    if not cfg:
        print(f"Unknown lecture: {args.lecture_num}. Known: {list(CONFIGS.keys())}")
        sys.exit(1)

    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    quiz_dir = os.path.join(base, 'quiz')
    assets_dst = os.path.join(base, 'public', 'assets')

    print(f"Parsing {args.markdown_file} ...")
    questions = parse_questions(args.markdown_file)
    print(f"Found {len(questions)} questions")

    # Copy missing images
    copied = copy_images(questions, assets_dst)
    if copied:
        print(f"Copied {copied} new images to public/assets/")

    # Split into parts
    ps = args.part_size
    parts = [questions[i:i+ps] for i in range(0, len(questions), ps)]
    total_parts = len(parts)

    print(f"Splitting into {total_parts} part(s) of ~{ps} questions each")

    source_file = args.markdown_file

    # Remove old quiz files for this lecture
    prefix = cfg['file_prefix']
    for f in os.listdir(quiz_dir):
        if f.startswith(prefix) and f.endswith('.jsx'):
            os.remove(os.path.join(quiz_dir, f))
            print(f"Removed old: {f}")

    generated = []
    for i, part_qs in enumerate(parts, 1):
        if total_parts == 1:
            out_name = f"{prefix}Quiz.jsx"
        else:
            out_name = f"{prefix}Part{i}Quiz.jsx"
        out_path = os.path.join(quiz_dir, out_name)
        jsx = gen_jsx(part_qs, i, total_parts, cfg, source_file)
        with open(out_path, 'w') as f:
            f.write(jsx)
        print(f"Written: quiz/{out_name}  ({len(part_qs)} questions, Q{part_qs[0]['num']}–Q{part_qs[-1]['num']})")
        generated.append((i, out_name, part_qs))

    # Print app route hint
    print()
    print("App routes needed:")
    route = cfg['route']
    if total_parts == 1:
        print(f"  app/{route}/page.js  →  import {prefix}Quiz")
    else:
        for i, name, qs in generated:
            comp = name.replace('.jsx', '')
            print(f"  app/{route}/{i}/page.js  →  import {comp}")
        print(f"  app/{route}/page.js  →  index listing all parts")

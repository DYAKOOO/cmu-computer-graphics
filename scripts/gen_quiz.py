#!/usr/bin/env python3
"""
Generate a full React JSX quiz component from a Logseq lecture quiz markdown file.
Usage: python gen_quiz.py <markdown_file> <output_jsx> <lecture_num>
"""
import re
import sys
import os

def parse_questions(md_path):
    with open(md_path, 'r') as f:
        content = f.read()

    # Split on question blocks
    blocks = re.split(r'(?=- #card \[Q\d+\])', content)
    questions = []

    for block in blocks:
        m = re.match(r'- #card \[Q(\d+)\]\s*(?:\[[^\]]*\]\s*)*\[([^\]]+)\]\s*(.+?)(?:\[\[.*?\]\])?$',
                     block, re.MULTILINE)
        if not m:
            continue
        qnum = int(m.group(1))
        timestamp = m.group(2).strip()
        question = m.group(3).strip()
        # Remove trailing [[tags]]
        question = re.sub(r'\s*\[\[.*?\]\]', '', question).strip()

        # Extract options A-D
        opts = {}
        for letter in 'ABCD':
            om = re.search(rf'^\s+{letter}\)\s+(.+?)(?:\s*\[\[.*?\]\])?$', block, re.MULTILINE)
            if om:
                opts[letter] = om.group(1).strip()

        # Answer
        ans_m = re.search(r'- ANSWER:\s*([A-D])', block)
        answer = ans_m.group(1) if ans_m else 'A'

        # Explanation - everything after "- EXPLANATION:" until next "- #card" or end
        exp_m = re.search(r'- EXPLANATION:\s*(.*?)(?=\n- #card|\Z)', block, re.DOTALL)
        explanation = ''
        if exp_m:
            raw = exp_m.group(1)
            # Remove image lines from explanation text
            raw = re.sub(r'\s*!\[image\.png\]\([^\)]+\)', '', raw)
            # Remove [[tags]]
            raw = re.sub(r'\[\[.*?\]\]', '', raw)
            # Remove Logseq IDs
            raw = re.sub(r'\s*id::[^\n]+', '', raw)
            # Collapse whitespace
            explanation = ' '.join(raw.split()).strip()

        # Images
        images = re.findall(r'!\[image\.png\]\(\.\./assets/(image_[^)]+)\)', block)

        if len(opts) < 4:
            continue

        questions.append({
            'num': qnum,
            'timestamp': timestamp,
            'question': question,
            'options': [opts.get('A',''), opts.get('B',''), opts.get('C',''), opts.get('D','')],
            'answer': ord(answer) - ord('A'),
            'explanation': explanation,
            'images': images,
        })

    questions.sort(key=lambda x: x['num'])
    return questions


def escape_js(s):
    return s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')


def gen_jsx(questions, lecture_num, title, subtitle, accent, icon_name):
    lines = []

    def w(s=''):
        lines.append(s)

    w("'use client'")
    w("import { useState, useEffect, useRef } from 'react'")
    w(f"import {{ {icon_name} }} from 'lucide-react'")
    w()
    w(f"// {title} — {len(questions)} questions")
    w()

    # SlideImages component
    w("function SlideImages({ images }) {")
    w("  if (!images || images.length === 0) return null")
    w("  return (")
    w("    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', margin: '1rem 0' }}>")
    w("      {images.map((img, i) => (")
    w("        <img key={i} src={`/assets/${img}`}")
    w("          alt={`Slide ${i+1}`}")
    w("          onError={e => { e.target.style.display = 'none' }}")
    w("          style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid #334155' }} />")
    w("      ))}")
    w("    </div>")
    w("  )")
    w("}")
    w()

    # Quiz data
    w("const quizData = [")
    for q in questions:
        opts_js = ', '.join(f'`{escape_js(o)}`' for o in q['options'])
        imgs_js = ', '.join(f'"{i}"' for i in q['images'])
        w(f"  {{")
        w(f"    num: {q['num']},")
        w(f"    timestamp: `{escape_js(q['timestamp'])}`,")
        w(f"    question: `{escape_js(q['question'])}`,")
        w(f"    options: [{opts_js}],")
        w(f"    answer: {q['answer']},")
        w(f"    explanation: `{escape_js(q['explanation'])}`,")
        w(f"    images: [{imgs_js}],")
        w(f"  }},")
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

    # Main component
    w(f"export default function {icon_name}Quiz() {{")
    w("  const [screen, setScreen] = useState('welcome')")
    w("  const [idx, setIdx] = useState(0)")
    w("  const [selected, setSelected] = useState(null)")
    w("  const [revealed, setRevealed] = useState(false)")
    w("  const [score, setScore] = useState(0)")
    w("  const [answers, setAnswers] = useState([])")
    w("  const timer = useTimer()")
    w("  const q = quizData[idx]")
    w(f"  const ACCENT = '{accent}'")
    w()

    # Style constants
    w("  const card = { background: '#1e293b', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid #334155' }")
    w()

    # Welcome screen
    w("  if (screen === 'welcome') return (")
    w("    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'system-ui,sans-serif' }}>")
    w(f"      <{icon_name} size={{48}} color={{ACCENT}} style={{{{ marginBottom: '1.5rem' }}}} />")
    w(f"      <h1 style={{{{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem' }}}}>{title}</h1>")
    w(f"      <p style={{{{ color: '#94a3b8', marginBottom: '0.5rem' }}}}>{subtitle}</p>")
    w(f"      <p style={{{{ color: ACCENT, fontWeight: 600, marginBottom: '2rem' }}}}>{len(questions)} questions</p>")
    w("      <button onClick={() => { setScreen('quiz'); timer.start() }}")
    w("        style={{ background: ACCENT, color: '#0f172a', fontWeight: 700, padding: '0.75rem 2.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>")
    w("        Start Quiz")
    w("      </button>")
    w("      <a href='/' style={{ marginTop: '1.5rem', color: '#64748b', fontSize: '0.875rem' }}>← Back to index</a>")
    w("    </div>")
    w("  )")
    w()

    # Results screen
    w("  if (screen === 'results') {")
    w("    const pct = Math.round(score / quizData.length * 100)")
    w("    return (")
    w("      <div style={{ minHeight: '100vh', background: '#0f172a', padding: '2rem', fontFamily: 'system-ui,sans-serif', color: '#f1f5f9' }}>")
    w("        <div style={{ maxWidth: '800px', margin: '0 auto' }}>")
    w(f"          <h1 style={{{{ color: ACCENT, fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}}}>{title} — Results</h1>")
    w("          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Time: {timer.fmt(timer.elapsed)}</p>")
    w("          <div style={{ ...card, textAlign: 'center', marginBottom: '2rem' }}>")
    w("            <div style={{ fontSize: '3rem', fontWeight: 800, color: ACCENT }}>{pct}%</div>")
    w("            <div style={{ color: '#94a3b8', marginTop: '0.5rem' }}>{score} / {quizData.length} correct</div>")
    w("          </div>")
    w("          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>")
    w("            {answers.map((a, i) => {")
    w("              const qq = quizData[i]")
    w("              const correct = a === qq.answer")
    w("              return (")
    w("                <div key={i} style={{ ...card, borderColor: correct ? '#22c55e44' : '#ef444444' }}>")
    w("                  <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Q{qq.num} [{qq.timestamp}]</div>")
    w("                  <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{qq.question}</div>")
    w("                  <div style={{ color: correct ? '#22c55e' : '#ef4444', fontSize: '0.9rem', marginBottom: '0.5rem' }}>")
    w("                    Your answer: {qq.options[a]} {correct ? '✓' : '✗'}")
    w("                  </div>")
    w("                  {!correct && <div style={{ color: '#22c55e', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Correct: {qq.options[qq.answer]}</div>}")
    w("                  {qq.explanation && <div style={{ color: '#94a3b8', fontSize: '0.875rem', borderTop: '1px solid #334155', paddingTop: '0.5rem', marginTop: '0.5rem' }}>{qq.explanation}</div>}")
    w("                  <SlideImages images={qq.images} />")
    w("                </div>")
    w("              )")
    w("            })}")
    w("          </div>")
    w("          <button onClick={() => { setScreen('welcome'); setIdx(0); setScore(0); setAnswers([]); timer.reset() }}")
    w("            style={{ marginTop: '2rem', background: ACCENT, color: '#0f172a', fontWeight: 700, padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>")
    w("            Restart")
    w("          </button>")
    w("          <a href='/' style={{ display: 'block', marginTop: '1rem', color: '#64748b', fontSize: '0.875rem' }}>← Back to index</a>")
    w("        </div>")
    w("      </div>")
    w("    )")
    w("  }")
    w()

    # Quiz screen
    w("  const handleSelect = (i) => { if (!revealed) setSelected(i) }")
    w("  const handleReveal = () => {")
    w("    if (selected === null) return")
    w("    setRevealed(true)")
    w("    if (selected === q.answer) setScore(s => s + 1)")
    w("  }")
    w("  const handleNext = () => {")
    w("    setAnswers(a => [...a, selected])")
    w("    if (idx + 1 >= quizData.length) { timer.stop(); setScreen('results') }")
    w("    else { setIdx(i => i + 1); setSelected(null); setRevealed(false) }")
    w("  }")
    w()

    w("  return (")
    w("    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '1.5rem', fontFamily: 'system-ui,sans-serif', color: '#f1f5f9' }}>")
    w("      <div style={{ maxWidth: '800px', margin: '0 auto' }}>")
    w("        {/* Header */}")
    w("        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>")
    w(f"          <div style={{{{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}}}><{icon_name} size={{20}} color={{ACCENT}} /><span style={{{{ color: ACCENT, fontWeight: 600 }}}}>{title}</span></div>")
    w("          <div style={{ display: 'flex', gap: '1.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>")
    w("            <span>{timer.fmt(timer.elapsed)}</span>")
    w(f"            <span>{{idx+1}} / {len(questions)}</span>")
    w("            <span style={{ color: ACCENT }}>Score: {score}</span>")
    w("          </div>")
    w("        </div>")
    w()
    w("        {/* Progress */}")
    w(f"        <div style={{{{ background: '#1e293b', borderRadius: '99px', height: '6px', marginBottom: '1.5rem' }}}}>")
    w(f"          <div style={{{{ background: ACCENT, height: '100%', borderRadius: '99px', width: `${{((idx+1)/{len(questions)})*100}}%`, transition: 'width 0.3s' }}}} />")
    w("        </div>")
    w()
    w("        {/* Question card */}")
    w("        <div style={card}>")
    w("          <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Q{q.num} · [{q.timestamp}]</div>")
    w("          <div style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem', lineHeight: 1.6 }}>{q.question}</div>")
    w("          <SlideImages images={q.images} />")
    w("          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>")
    w("            {q.options.map((opt, i) => {")
    w("              let bg = '#0f172a', border = '#334155', color = '#cbd5e1'")
    w("              if (selected === i && !revealed) { bg = `${ACCENT}22`; border = ACCENT; color = '#f1f5f9' }")
    w("              if (revealed && i === q.answer) { bg = '#22c55e22'; border = '#22c55e'; color = '#22c55e' }")
    w("              if (revealed && selected === i && i !== q.answer) { bg = '#ef444422'; border = '#ef4444'; color = '#ef4444' }")
    w("              return (")
    w("                <button key={i} onClick={() => handleSelect(i)}")
    w("                  style={{ background: bg, border: `1px solid ${border}`, color, padding: '0.75rem 1rem', borderRadius: '8px', textAlign: 'left', cursor: revealed ? 'default' : 'pointer', fontSize: '0.95rem', transition: 'all 0.15s' }}>")
    w("                  <span style={{ fontWeight: 700, marginRight: '0.5rem' }}>{['A','B','C','D'][i]}.</span>{opt}")
    w("                </button>")
    w("              )")
    w("            })}")
    w("          </div>")
    w("        </div>")
    w()
    w("        {/* Explanation */}")
    w("        {revealed && q.explanation && (")
    w("          <div style={{ ...card, borderColor: `${ACCENT}44` }}>")
    w("            <div style={{ color: ACCENT, fontWeight: 700, marginBottom: '0.5rem' }}>Explanation</div>")
    w("            <div style={{ color: '#cbd5e1', lineHeight: 1.7 }}>{q.explanation}</div>")
    w("          </div>")
    w("        )}")
    w()
    w("        {/* Buttons */}")
    w("        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>")
    w("          {!revealed && <button onClick={handleReveal} disabled={selected === null}")
    w("            style={{ background: selected !== null ? ACCENT : '#334155', color: selected !== null ? '#0f172a' : '#64748b', fontWeight: 700, padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', cursor: selected !== null ? 'pointer' : 'not-allowed' }}>")
    w("            Check Answer")
    w("          </button>}")
    w("          {revealed && <button onClick={handleNext}")
    w("            style={{ background: ACCENT, color: '#0f172a', fontWeight: 700, padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>")
    w(f"            {{idx + 1 >= {len(questions)} ? 'See Results' : 'Next Question →'}}")
    w("          </button>}")
    w("        </div>")
    w("      </div>")
    w("    </div>")
    w("  )")
    w("}")

    return '\n'.join(lines)


CONFIGS = {
    '3': {
        'title': 'Lecture 3: Vector Calculus',
        'subtitle': 'Gradient, Divergence, Curl, Laplacian, Hessian',
        'accent': '#38bdf8',
        'icon': 'Sigma',
        'out': 'Lec3VectorCalculusQuiz.jsx',
    },
    '4': {
        'title': 'Lecture 4: Rasterization & Sampling',
        'subtitle': 'Pipeline, Coverage, Aliasing, SSAA, Nyquist',
        'accent': '#34d399',
        'icon': 'Monitor',
        'out': 'Lec4RasterizationQuiz.jsx',
    },
    '5': {
        'title': 'Lecture 5: Spatial Transformations',
        'subtitle': 'Linear maps, homogeneous coordinates, rotation, translation',
        'accent': '#f59e0b',
        'icon': 'Move',
        'out': 'Lec5SpatialTransformationsQuiz.jsx',
    },
}

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: gen_quiz.py <markdown_file> <lecture_num>")
        print(f"  lecture_num: {list(CONFIGS.keys())}")
        sys.exit(1)

    md_path = sys.argv[1]
    lec = sys.argv[2]

    cfg = CONFIGS.get(lec)
    if not cfg:
        print(f"Unknown lecture num: {lec}. Known: {list(CONFIGS.keys())}")
        sys.exit(1)

    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_path = os.path.join(base, 'quiz', cfg['out'])

    print(f"Parsing {md_path}...")
    questions = parse_questions(md_path)
    print(f"Found {len(questions)} questions")

    jsx = gen_jsx(questions, lec, cfg['title'], cfg['subtitle'], cfg['accent'], cfg['icon'])

    with open(out_path, 'w') as f:
        f.write(jsx)

    print(f"Written to {out_path}")

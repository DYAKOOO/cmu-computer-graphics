#!/usr/bin/env python3
"""
Generate interactive React JSX quiz components from Logseq lecture quiz markdown,
matching the HandelBot quiz visual style.

Usage:
  python gen_quiz.py <markdown_file> <lecture_num> [--part-size N]

The lectures/ folder should be symlinks to the actual Logseq pages:
  ln -s /path/to/logseq/pages/cg-XX-lecture-quiz.md lectures/cg-XX-lecture-quiz.md

Editing notes in Logseq then re-running this script regenerates the quiz.
"""
import re
import sys
import os
import argparse
import shutil


PART_SIZE = 32  # max questions per quiz part


def parse_questions(md_path):
    with open(md_path, 'r') as f:
        content = f.read()

    blocks = re.split(r'(?=- #card \[Q\d+\])', content)
    questions = []

    for block in blocks:
        header = re.match(
            r'- #card \[Q(\d+)\]\s*(?:\[[^\]]*\]\s*)*\[([^\]]+)\]\s*(.+?)$',
            block, re.MULTILINE
        )
        if not header:
            continue

        qnum = int(header.group(1))
        timestamp = header.group(2).strip()
        question_raw = header.group(3).strip()
        question = re.sub(r'\s*\[\[.*?\]\]', '', question_raw).strip()

        opts = {}
        for letter in 'ABCD':
            om = re.search(rf'^\s+{letter}\)\s+(.+?)(?:\s*\[\[.*?\]\])*\s*$', block, re.MULTILINE)
            if om:
                opts[letter] = om.group(1).strip()

        if len(opts) < 2:
            continue

        ans_m = re.search(r'- ANSWER:\s*([A-D])', block)
        answer = ans_m.group(1) if ans_m else 'A'

        # Full explanation block (stops at - CODE: or next card)
        exp_m = re.search(r'- EXPLANATION:\s*([\s\S]*?)(?=\n\s*- CODE:|\n- #card|\Z)', block)
        explanation_text = ''
        images = []

        intuition_text = ''
        if exp_m:
            raw = exp_m.group(1)
            images = re.findall(r'!\[image\.png\]\(\.\./assets/(image_[^)]+)\)', raw)
            # Clean text
            text = re.sub(r'!\[image\.png\]\([^\)]+\)', '', raw)
            text = re.sub(r'\[\[.*?\]\]', '', text)
            text = re.sub(r'\s*id::[^\n]+', '', text)
            text = re.sub(r'\s*card-[a-z\-]+::[^\n]+', '', text)
            text = re.sub(r'\s*collapsed::\s*(true|false)', '', text)
            lines = [l.strip() for l in text.strip().splitlines()]
            clean = []
            for l in lines:
                if l or (clean and clean[-1]):
                    clean.append(l)
            explanation_text = '\n'.join(clean).strip()

            # Intuition: extract the quoted lecturer statement(s) — the "..." parts
            quotes = re.findall(r'"([^"]{15,})"', explanation_text)
            if quotes:
                # Use the longest quote as the key insight
                intuition_text = max(quotes, key=len).strip()
            else:
                # Fallback: first sentence of explanation
                first = explanation_text.split('.')[0].strip()
                intuition_text = first if len(first) > 20 else explanation_text[:200]

        # Optional code block: - CODE:\n  ```python\n  ...\n  ```
        code_text = ''
        code_m = re.search(r'- CODE:\s*\n([\s\S]*?)(?=\n- #card|\Z)', block)
        if code_m:
            raw_code = code_m.group(1)
            # Strip ```python / ``` fences and leading indent
            raw_code = re.sub(r'^\s*```[a-z]*\n?', '', raw_code)
            raw_code = re.sub(r'\n?\s*```\s*$', '', raw_code)
            # Remove consistent leading indentation (2 or 4 spaces added by Logseq)
            code_lines = raw_code.splitlines()
            if code_lines:
                indent = len(code_lines[0]) - len(code_lines[0].lstrip())
                code_text = '\n'.join(l[indent:] if len(l) >= indent else l for l in code_lines).strip()

        # Deduplicate images preserving order
        seen = set()
        unique_images = []
        for img in images:
            if img not in seen:
                seen.add(img)
                unique_images.append(img)

        tags = re.findall(r'\[\[([^\]]+)\]\]', block)

        questions.append({
            'num': qnum,
            'timestamp': timestamp,
            'question': question,
            'options': [opts.get('A',''), opts.get('B',''), opts.get('C',''), opts.get('D','')],
            'answer': ord(answer) - ord('A'),
            'intuition': intuition_text,
            'explanation': explanation_text,
            'code': code_text,
            'images': unique_images,
            'tags': list(dict.fromkeys(tags)),
        })

    questions.sort(key=lambda x: x['num'])
    return questions


def escape_js(s):
    return s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')


def gen_jsx(questions, part_num, total_parts, cfg, source_file):
    accent = cfg['accent']
    icon = cfg['icon']
    source_basename = os.path.basename(source_file)
    display_title = cfg['title'] + (f' — Part {part_num}' if total_parts > 1 else '')
    q_range = f"Q{questions[0]['num']}–Q{questions[-1]['num']}"
    n = len(questions)
    route = cfg['route']
    component_name = f"Lec{cfg['lec_num']}Part{part_num}Quiz" if total_parts > 1 else f"Lec{cfg['lec_num']}Quiz"

    L = []
    def w(s=''):
        L.append(s)

    w("'use client'")
    w("import { useState, useEffect, useCallback } from 'react'")
    w(f"import {{ ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, {icon} }} from 'lucide-react'")
    w()
    w(f"// Source: lectures/{source_basename}  (symlinked → Logseq pages)")
    w(f"// {display_title} · {q_range} · {n} questions")
    w(f"// Regenerate: python3 scripts/gen_quiz.py lectures/{source_basename} {cfg['lec_num']}")
    w()

    # quizData
    w("const quizData = [")
    for q in questions:
        opts_js = ', '.join(f'`{escape_js(o)}`' for o in q['options'])
        imgs_js = ', '.join(f'"{i}"' for i in q['images'])
        tags_js = ', '.join(f'"{t}"' for t in q['tags'])
        w("  {")
        w(f"    id: {q['num']},")
        w(f"    timestamp: `{escape_js(q['timestamp'])}`,")
        w(f"    question: `{escape_js(q['question'])}`,")
        w(f"    options: [{opts_js}],")
        w(f"    answer: {q['answer']},")
        w(f"    intuition: `{escape_js(q.get('intuition',''))}`,")
        w(f"    explanation: `{escape_js(q['explanation'])}`,")
        w(f"    code: `{escape_js(q.get('code',''))}`,")
        w(f"    images: [{imgs_js}],")
        w(f"    tags: [{tags_js}],")
        w(f"    source: `lectures/{escape_js(source_basename)}`,")
        w("  },")
    w("]")
    w()

    # Helpers
    w("const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''")
    w("const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`")
    w()

    # Timer hook
    w("const useTimer = () => {")
    w("  const [t, setT] = useState(0)")
    w("  const [active, setActive] = useState(false)")
    w("  useEffect(() => {")
    w("    if (!active) return")
    w("    const id = setInterval(() => setT(x => x+1), 1000)")
    w("    return () => clearInterval(id)")
    w("  }, [active])")
    w("  return { t, start: () => setActive(true), pause: () => setActive(false), reset: () => { setT(0); setActive(false) } }")
    w("}")
    w()

    # SlideImages
    w("function SlideImages({ images }) {")
    w("  if (!images || !images.length) return null")
    w("  return (")
    w("    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.75rem' }}>")
    w("      {images.map((img, i) => (")
    w("        <img key={i} src={`${BASE}/assets/${img}`} alt={`slide-${i+1}`}")
    w("          onError={e => { e.target.style.display='none' }}")
    w("          style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid #2a2a3a', display: 'block' }} />")
    w("      ))}")
    w("    </div>")
    w("  )")
    w("}")
    w()

    # Main component
    w(f"export default function {component_name}() {{")
    w("  const [screen, setScreen] = useState('welcome')")
    w("  const [qIdx, setQIdx] = useState(0)")
    w("  const [answers, setAnswers] = useState(Array(quizData.length).fill(null))")
    w("  const [selected, setSelected] = useState(null)")
    w("  const [showExp, setShowExp] = useState(false)")
    w("  const [reviewMode, setReviewMode] = useState(false)")
    w("  const [expTab, setExpTab] = useState('explanation')")
    w("  const [codeCopied, setCodeCopied] = useState(false)")
    w("  const { t, start, pause, reset: resetTimer } = useTimer()")
    w("  const q = quizData[qIdx]")
    w()

    # Colour palette matching HandelBot
    w(f"  const C = {{")
    w(f"    bg: '#0a0a0f',")
    w(f"    surface: '#111118',")
    w(f"    border: '#2a2a3a',")
    w(f"    accent: '{accent}',")
    w(f"    text: '#e2e8f0',")
    w(f"    muted: '#94a3b8',")
    w(f"    ok: '#10b981',")
    w(f"    err: '#ef4444',")
    w(f"    warn: '#f59e0b',")
    w(f"  }}")
    w()

    w("  const base = { fontFamily: 'system-ui,sans-serif', margin: 0, padding: 0, minHeight: '100vh',")
    w("    background: `linear-gradient(135deg, ${C.bg} 0%, #0f0f1a 100%)`, color: C.text,")
    w("    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }")
    w("  const box = { maxWidth: '900px', width: '100%', background: C.surface, borderRadius: '16px',")
    w("    border: `1px solid ${C.border}`, padding: '2.5rem', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }")
    w("  const btn = (extra={}) => ({ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none',")
    w("    background: C.accent, color: C.text, fontSize: '1rem', fontWeight: '600', cursor: 'pointer',")
    w("    display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', ...extra })")
    w("  const tag = (color=C.accent) => ({ padding: '0.25rem 0.75rem', borderRadius: '6px',")
    w("    background: `${color}22`, color, fontSize: '0.8rem', fontWeight: '600' })")
    w()

    w("  useEffect(() => { if (screen==='quiz' && !showExp && !reviewMode) start(); else pause() }, [screen,showExp,reviewMode,qIdx])")
    w()

    w("  const isCorrect = useCallback((question, ans) => {")
    w("    if (ans === null || ans === undefined) return false")
    w("    return ans === question.answer")
    w("  }, [])")
    w()

    w("  const handleSubmit = () => {")
    w("    const a = [...answers]; a[qIdx] = selected; setAnswers(a); setShowExp(true); setExpTab('explanation')")
    w("  }")
    w("  const handleNext = () => {")
    w("    if (qIdx < quizData.length - 1) { setQIdx(q => q+1); setSelected(null); setShowExp(false) }")
    w("    else { setScreen('results'); pause() }")
    w("  }")
    w("  const handlePrev = () => {")
    w("    if (qIdx > 0) { setQIdx(q => q-1); setSelected(null); setShowExp(false) }")
    w("  }")
    w("  const handleRestart = () => {")
    w("    setScreen('welcome'); setQIdx(0); setAnswers(Array(quizData.length).fill(null))")
    w("    setSelected(null); setShowExp(false); setReviewMode(false); resetTimer()")
    w("  }")
    w("  const handleReview = () => { setScreen('quiz'); setQIdx(0); setShowExp(false); setReviewMode(true) }")
    w()

    w("  const score = answers.filter((a,i) => isCorrect(quizData[i],a)).length")
    w("  const pct = Math.round(score / quizData.length * 100)")
    w()

    # Part nav links (static, no JS variable conflict)
    if total_parts > 1:
        part_link_els = []
        for pn in range(1, total_parts + 1):
            color = "C.accent" if pn == part_num else "C.muted"
            part_link_els.append(
                f'<a key={{{pn}}} href={{`${{BASE}}/{route}/{pn}`}} style={{{{ color: {color}, fontSize: "0.85rem" }}}}>Part {pn}</a>'
            )
        part_links_jsx = '\n          '.join(part_link_els)
    else:
        part_links_jsx = ''

    # ── WELCOME ──
    w("  if (screen === 'welcome') return (")
    w("    <div style={base}>")
    w("      <div style={box}>")
    w("        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>")
    w(f"          <{icon} size={{64}} color={{C.accent}} style={{{{ display: 'inline-block', marginBottom: '1rem' }}}} />")
    w(f"          <h1 style={{{{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}}}>{display_title}</h1>")
    w(f"          <p style={{{{ color: C.muted, marginBottom: '0.25rem' }}}}>{cfg['subtitle']}</p>")
    w(f"          <p style={{{{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}}}>lectures/{source_basename}</p>")
    if total_parts > 1:
        w(f"          <div style={{{{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}}}>")
        w(f"            {part_links_jsx}")
        w(f"          </div>")
    w(f"          <p style={{{{ color: C.accent, fontWeight: 600 }}}}>{q_range} · {n} questions</p>")
    w("        </div>")
    w()
    w("        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>")
    w("          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>")
    w(f"            <div><div style={{{{ fontSize: '2rem', fontWeight: 700, color: C.accent }}}}>{n}</div><div style={{{{ color: C.muted, fontSize: '0.9rem' }}}}>Questions</div></div>")
    w(f"            <div><div style={{{{ fontSize: '2rem', fontWeight: 700, color: C.accent }}}}>~{max(1, n//3)}min</div><div style={{{{ color: C.muted, fontSize: '0.9rem' }}}}>Est. Time</div></div>")
    w(f"            <div><div style={{{{ fontSize: '2rem', fontWeight: 700, color: C.accent }}}}>{total_parts}</div><div style={{{{ color: C.muted, fontSize: '0.9rem' }}}}>{'Parts' if total_parts > 1 else 'Part'}</div></div>")
    w("          </div>")
    w("        </div>")
    w()
    w("        <button style={btn({ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' })}")
    w("          onClick={() => { setScreen('quiz'); start() }}>")
    w(f"          <{icon} size={{20}} /> Start Quiz")
    w("        </button>")
    w("        <a href={`${BASE}/`} style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', color: C.muted, fontSize: '0.875rem' }}>← All quizzes</a>")
    w("      </div>")
    w("    </div>")
    w("  )")
    w()

    # ── RESULTS ──
    w("  if (screen === 'results') return (")
    w("    <div style={base}>")
    w("      <div style={box}>")
    w("        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>")
    w("          <Trophy size={64} color={pct >= 70 ? C.ok : pct >= 50 ? C.warn : C.err} />")
    w("          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '1rem', marginBottom: '0.5rem' }}>Quiz Complete!</h1>")
    w("          <p style={{ color: C.muted }}><Clock size={16} style={{ display:'inline', verticalAlign:'middle', marginRight:'0.4rem' }} />Time: {formatTime(t)}</p>")
    w("        </div>")
    w("        <div style={{ background: '#0d0d12', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', textAlign: 'center', border: `1px solid ${C.border}` }}>")
    w("          <div style={{ fontSize: '4rem', fontWeight: 700, color: pct>=70?C.ok:pct>=50?C.warn:C.err, marginBottom: '0.5rem' }}>{pct}%</div>")
    w("          <div style={{ fontSize: '1.2rem', color: C.muted, marginBottom: '0.75rem' }}>{score} / {quizData.length} correct</div>")
    w("          <div style={{ color: C.muted }}>{pct>=90?'Excellent!':pct>=70?'Great work!':pct>=50?'Good progress!':'Keep studying!'}</div>")
    w("        </div>")
    w("        <div style={{ display: 'flex', gap: '1rem' }}>")
    w("          <button style={btn({ flex: 1, justifyContent: 'center' })} onClick={handleReview}>")
    w("            <BookOpen size={20} /> Review Answers")
    w("          </button>")
    w("          <button style={btn({ flex: 1, justifyContent: 'center' })} onClick={handleRestart}>")
    w("            <RefreshCw size={20} /> Restart")
    w("          </button>")
    w("        </div>")
    w("        <a href={`${BASE}/`} style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', color: C.muted, fontSize: '0.875rem' }}>← All quizzes</a>")
    w("      </div>")
    w("    </div>")
    w("  )")
    w()

    # ── QUIZ SCREEN ──
    w("  return (")
    w("    <div style={base}>")
    w("      <div style={box}>")
    w()
    w("        {/* Header */}")
    w("        <div style={{ marginBottom: '1.5rem' }}>")
    w("          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>")
    w("            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>")
    w(f"              <{icon} size={{18}} color={{C.accent}} />")
    w(f"              <span style={{{{ color: C.accent, fontWeight: 600 }}}}>{display_title}</span>")
    w("            </div>")
    w("            <div style={{ display: 'flex', gap: '1.25rem', color: C.muted, fontSize: '0.875rem', alignItems: 'center' }}>")
    w("              <span><Clock size={14} style={{ display:'inline', verticalAlign:'middle', marginRight:'0.25rem' }} />{formatTime(t)}</span>")
    w(f"              <span>{{qIdx+1}}/{n}</span>")
    w("              <span style={{ color: C.accent }}>✓ {score}</span>")
    w("            </div>")
    w("          </div>")
    w("          <div style={{ height: '5px', background: C.border, borderRadius: '3px', overflow: 'hidden' }}>")
    w(f"            <div style={{{{ height: '100%', width: `${{Math.round((qIdx+1)/{n}*100)}}%`, background: C.accent, transition: 'width 0.3s' }}}} />")
    w("          </div>")
    w("        </div>")
    w()
    w("        {/* Question */}")
    w("        <div style={{ marginBottom: '1.5rem' }}>")
    w("          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem', alignItems: 'center' }}>")
    w("            <span style={tag()}>Q{q.id}</span>")
    w("            <span style={tag()}>[{q.timestamp}]</span>")
    w("            <span style={{ color: '#475569', fontSize: '0.72rem', fontFamily: 'monospace', marginLeft: 'auto' }}>{q.source}</span>")
    w("          </div>")
    w("          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, lineHeight: 1.55, marginBottom: '1.25rem' }}>{q.question}</h2>")
    w("        </div>")
    w()
    w("        {/* Options */}")
    w("        <div style={{ marginBottom: '1.5rem' }}>")
    w("          {q.options.map((opt, i) => {")
    w("            let borderColor = C.border, bgColor = C.surface")
    w("            if (showExp || reviewMode) {")
    w("              if (i === q.answer) { borderColor = C.ok; bgColor = `${C.ok}15` }")
    w("              else if (selected === i) { borderColor = C.err; bgColor = `${C.err}15` }")
    w("            } else if (selected === i) {")
    w("              borderColor = C.accent; bgColor = `${C.accent}15`")
    w("            }")
    w("            return (")
    w("              <div key={i} onClick={() => !(showExp||reviewMode) && setSelected(i)}")
    w("                style={{ padding: '1rem', borderRadius: '8px', border: `2px solid ${borderColor}`,")
    w("                  background: bgColor, cursor: (showExp||reviewMode)?'default':'pointer',")
    w("                  transition: 'all 0.2s', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>")
    w("                {(showExp||reviewMode) && i===q.answer && <CheckCircle size={18} color={C.ok} />}")
    w("                {(showExp||reviewMode) && selected===i && i!==q.answer && <XCircle size={18} color={C.err} />}")
    w("                <span style={{ fontWeight: 700, color: C.accent, minWidth: '1.2rem' }}>{['A','B','C','D'][i]}.</span>")
    w("                <span>{opt}</span>")
    w("              </div>")
    w("            )")
    w("          })}")
    w("        </div>")
    w()
    w("        {/* Explanation (shown after submit) */}")
    w("        {(showExp || reviewMode) && (")
    w("          <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: `1px solid ${C.border}` }}>")
    w("            {/* Tab switcher */}")
    w("            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>")
    w("              {['intuition','explanation','images','tags'].map(tab => {")
    w("                return (")
    w("                  <button key={tab} onClick={() => setExpTab(tab)}")
    w("                    style={{ padding: '0.3rem 0.85rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,")
    w("                      background: expTab===tab ? C.accent : '#1e1e2e', color: expTab===tab ? '#0a0a0f' : C.muted,")
    w("                      outline: expTab===tab ? 'none' : `1px solid ${C.border}` }}>")
    w("                    {tab==='intuition' ? '💡 Intuition' : tab==='explanation' ? '📖 Explanation' : tab==='images' ? '🖼 Slides' : '🔗 Tags'}")
    w("                  </button>")
    w("                )")
    w("              })}")
    w("            </div>")
    w("            {expTab === 'intuition' && (")
    w("              q.intuition")
    w("                ? (")
    w("                  <div style={{ borderLeft: `3px solid ${C.accent}`, paddingLeft: '1rem' }}>")
    w("                    <p style={{ margin: '0 0 0.25rem', fontSize: '0.72rem', fontWeight: 700, color: C.accent, letterSpacing: '0.06em' }}>KEY INSIGHT FROM LECTURE</p>")
    w("                    <p style={{ margin: 0, lineHeight: 1.75, color: C.text, fontSize: '1rem', fontStyle: 'italic' }}>\"{q.intuition}\"</p>")
    w("                  </div>")
    w("                )")
    w("                : <p style={{ color: '#475569', margin: 0 }}>No intuition extracted.</p>")
    w("            )}")
    w("            {expTab === 'explanation' && (")
    w("              q.explanation")
    w("                ? <p style={{ lineHeight: 1.8, color: C.muted, whiteSpace: 'pre-wrap', margin: 0 }}>{q.explanation}</p>")
    w("                : <p style={{ color: '#475569', margin: 0 }}>No explanation provided.</p>")
    w("            )}")
    w("            {expTab === 'images' && (")
    w("              q.images && q.images.length > 0")
    w("                ? <SlideImages images={q.images} />")
    w("                : <p style={{ color: '#475569', margin: 0 }}>No slide images for this question.</p>")
    w("            )}")
    w("            {expTab === 'tags' && (")
    w("              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>")
    w("                {q.tags.length > 0")
    w("                  ? q.tags.map((tg,i) => <span key={i} style={tag()}>{tg}</span>)")
    w("                  : <span style={{ color: '#475569' }}>No tags.</span>}")
    w("              </div>")
    w("            )}")
    w("          </div>")
    w("        )}")
    w()
    w("        {/* Navigation */}")
    w("        <div style={{ display: 'flex', gap: '1rem' }}>")
    w("          <button onClick={handlePrev} disabled={qIdx===0}")
    w("            style={btn({ background: C.border, opacity: qIdx===0?0.4:1, cursor: qIdx===0?'not-allowed':'pointer' })}>")
    w("            <ChevronLeft size={20} /> Prev")
    w("          </button>")
    w("          {!(showExp||reviewMode) && (")
    w("            <button onClick={handleSubmit} disabled={selected===null}")
    w("              style={btn({ flex:1, justifyContent:'center', opacity: selected===null?0.4:1, cursor: selected===null?'not-allowed':'pointer' })}>")
    w("              Submit Answer")
    w("            </button>")
    w("          )}")
    w("          {(showExp||reviewMode) && (")
    w("            <button onClick={handleNext} style={btn({ flex:1, justifyContent:'center' })}>")
    w(f"              {{qIdx < {n}-1 ? 'Next Question' : 'View Results'}} <ChevronRight size={{20}} />")
    w("            </button>")
    w("          )}")
    w("        </div>")
    w("      </div>")
    w("    </div>")
    w("  )")
    w("}")

    return '\n'.join(L)


CONFIGS = {
    '2': {'lec_num':'2','title':'Lecture 2: Linear Algebra','subtitle':'Vectors, inner products, Gram-Schmidt, Fourier','accent':'#818cf8','icon':'Grid','route':'lec2','file_prefix':'Lec2LinearAlgebra'},
    '3': {'lec_num':'3','title':'Lecture 3: Vector Calculus','subtitle':'Gradient, Divergence, Curl, Laplacian, Hessian','accent':'#38bdf8','icon':'Sigma','route':'lec3','file_prefix':'Lec3VectorCalculus'},
    '4': {'lec_num':'4','title':'Lecture 4: Rasterization & Sampling','subtitle':'Pipeline, Coverage, Aliasing, SSAA, Nyquist','accent':'#34d399','icon':'Monitor','route':'lec4','file_prefix':'Lec4Rasterization'},
    '5': {'lec_num':'5','title':'Lecture 5: Spatial Transformations','subtitle':'Linear maps, homogeneous coords, rotation, translation','accent':'#f59e0b','icon':'Move','route':'lec5','file_prefix':'Lec5SpatialTransformations'},
    '23': {'lec_num':'23','title':'Lecture 23: PDEs & Physical Animation','subtitle':'Elliptic/Parabolic/Hyperbolic PDEs, Laplacian, Wave/Heat Equations','accent':'#f87171','icon':'Waves','route':'lec23','file_prefix':'Lec23PDEs'},
}


def copy_images(questions, assets_dst):
    logseq_assets = '/home/diako/csRobotics/logseq3/assets'
    os.makedirs(assets_dst, exist_ok=True)
    copied = 0
    for q in questions:
        for img in q['images']:
            src = os.path.join(logseq_assets, img)
            dst = os.path.join(assets_dst, img)
            if os.path.exists(src) and not os.path.exists(dst):
                shutil.copy2(src, dst)
                copied += 1
    return copied


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('markdown_file')
    ap.add_argument('lecture_num', help=f'Known: {list(CONFIGS.keys())}')
    ap.add_argument('--part-size', type=int, default=PART_SIZE)
    args = ap.parse_args()

    cfg = CONFIGS.get(args.lecture_num)
    if not cfg:
        print(f"Unknown lecture: {args.lecture_num}. Known: {list(CONFIGS.keys())}"); sys.exit(1)

    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    quiz_dir = os.path.join(base, 'quiz')
    assets_dst = os.path.join(base, 'public', 'assets')

    print(f"Parsing {args.markdown_file} ...")
    questions = parse_questions(args.markdown_file)
    print(f"Found {len(questions)} questions")

    copied = copy_images(questions, assets_dst)
    if copied:
        print(f"Copied {copied} new images to public/assets/")

    ps = args.part_size
    parts = [questions[i:i+ps] for i in range(0, len(questions), ps)]
    total_parts = len(parts)
    print(f"Splitting into {total_parts} part(s)")

    prefix = cfg['file_prefix']
    for f in os.listdir(quiz_dir):
        if f.startswith(prefix) and f.endswith('.jsx'):
            os.remove(os.path.join(quiz_dir, f))
            print(f"Removed: {f}")

    for i, part_qs in enumerate(parts, 1):
        out_name = f"{prefix}Quiz.jsx" if total_parts == 1 else f"{prefix}Part{i}Quiz.jsx"
        jsx = gen_jsx(part_qs, i, total_parts, cfg, args.markdown_file)
        with open(os.path.join(quiz_dir, out_name), 'w') as fh:
            fh.write(jsx)
        print(f"Written: quiz/{out_name}  ({len(part_qs)} questions, Q{part_qs[0]['num']}–Q{part_qs[-1]['num']})")

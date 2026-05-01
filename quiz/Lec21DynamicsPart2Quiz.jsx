'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Activity } from 'lucide-react'

// Source: lectures/cg-21-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 21: Dynamics & Time Integration — Part 2 · Q33–Q38 · 6 questions
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-21-lecture-quiz.md 21

const quizData = [
  {
    id: 33,
    timestamp: `1:19:04`,
    question: `Which integrator is best for long-running animations that must conserve energy?`,
    options: [`Forward Euler (explicit, fast but energy grows over time)`, `Backward Euler (implicit, unconditionally stable but energy decays over time)`, `Symplectic Euler (nearly energy-conserving, staggered velocity/position updates)`, `Exact closed-form integration (always best but rarely available)`],
    answer: 2,
    intuition: ``,
    explanation: `At [1:18:23]–[1:18:49], the lecturer explains: "The cool thing that happens now is the pendulum now conserves energy almost exactly forever. So you start out, this pendulum's going back and forth, and you can keep on running your simulation for forever — for days, for hours, for weeks — and it'll keep on going back and forth with basically the same energy as at the beginning." Forward Euler gains energy; Backward Euler loses it; Symplectic Euler maintains it.`,
    code: ``,
    images: ["image_1777623127545_0.png", "image_1777623169321_0.png"],
    tags: ["Book"],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 34,
    timestamp: `1:21:23`,
    question: `What are the four main approaches to computing derivatives in simulation?`,
    options: [`Finite differences, integration, interpolation, extrapolation`, `By-hand derivation, numerical differentiation, automatic differentiation, symbolic differentiation`, `Gradient descent, Newton's method, secant method, bisection`, `Forward mode, backward mode, tangent mode, adjoint mode`],
    answer: 1,
    intuition: ``,
    explanation: `At [1:21:23]–[1:25:19], the lecturer describes four methods: (1) by-hand (laborious & error prone but clean/fast code), (2) numerical differentiation (perturb and divide; general but inaccurate), (3) automatic differentiation (pairs of (value, derivative) with chain rule; accurate and fast but requires code changes), (4) symbolic differentiation (expression tree transformation; good for one-time use but often produces complicated results). 5) Geometric differentiation , differentiating a vertex with respect to a triangle.`,
    code: ``,
    images: ["image_1777623356232_0.png"],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 35,
    timestamp: `1:29:47`,
    question: `What problem arises when h is made too small in numerical differentiation?`,
    options: [`The perturbation exceeds the domain of the function`, `Floating-point precision is exhausted — numbers are indistinguishable — and error increases`, `The algorithm converges too quickly and overshoots the derivative`, `Division by zero occurs because h appears in the denominator`],
    answer: 1,
    intuition: ``,
    explanation: `At [1:29:18]–[1:29:47], the lecturer explains: "If you get down to a certain size, there's not any separation between numbers anymore. What I've plotted here is the error that you get for smaller and smaller h. You see at some point you get down to a pretty small error, but then it shoots back up again when you make h too small. So this is part of the annoyance of working with numerical differentiation."`,
    code: ``,
    images: ["image_1777623752196_0.png"],
    tags: ["definition", "Differentiation/Numerical"],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 36,
    timestamp: `1:35:30`,
    question: `What is the gradient of triangle area with respect to vertex position P, reasoned geometrically?`,
    options: [`The gradient points along the opposite edge E with magnitude 1/2`, `The gradient is perpendicular to the opposite edge E with magnitude |E|/2`, `The gradient points toward the centroid with magnitude proportional to the perimeter`, `The gradient is the unit normal of the triangle with magnitude equal to the full area`],
    answer: 1,
    intuition: `Moving P parallel to E changes nothing (area = ½ base × height; base length and height are both unchanged). Moving P perpendicular to E changes height by 1, so area changes by |E|/2. Therefore: gradient direction = perpendicular to E, gradient magnitude = |E|/2. One clean geometric argument replaces a page of symbolic calculus from Mathematica.`,
    explanation: `At [1:35:30]–[1:39:18], the lecturer derives geometrically: "I know area is one half base times height. I can't change the length of the base by moving P. Moving P parallel to E doesn't change the height. So the gradient can't be parallel to E... The only other direction is orthogonal to the base... If H increases by one, area increases by one half the length of the base. The gradient of area must point in the direction perpendicular to E and must have magnitude proportional to |E|/2." In 3D: grad = (normal × E) / 2.`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 37,
    timestamp: `1:29:51`,
    question: `How does forward-mode automatic differentiation work mechanically?`,
    options: [`It symbolically rewrites the expression tree and evaluates the resulting derivative formula`, `It perturbs inputs by a small h and divides the output change by h`, `It propagates pairs (f, f’) through every arithmetic operation using the chain rule`, `It records the computation graph and replays it in reverse to accumulate gradients`],
    answer: 2,
    intuition: `Instead of computing f(x) and then separately computing f’(x), you carry both at once as a pair (value, derivative). Every arithmetic op has a chain-rule rule for transforming pairs. Multiplying (u, u’) × (v, v’) gives (uv, uv’ + vu’) — exactly the product rule. No symbolic trees, no finite differences: just pair arithmetic all the way through.`,
    explanation: `At [1:29:51], the lecturer explains: "Rather than work with values f, you’re going to work with pairs f and f prime. How do you operate on these pairs? Well, you use the chain rule to understand how any arithmetic operation is gonna transform these pairs." Example: f(x) = ax² at x=2. Start with (2,1) representing (x, dx/dx). Square via product rule: (2,1)×(2,1) = (4,4). Multiply by a: (4a, 4a). Derivative of ax² is 2ax, and 2a·2 = 4a — correct. Pros: good accuracy, reasonably fast. Cons: must redefine all arithmetic operators in code.`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 38,
    timestamp: `1:33:38`,
    question: `How does symbolic differentiation work, and what is its key limitation compared to geometric reasoning?`,
    options: [`It perturbs inputs numerically; limitation is floating-point precision loss`, `It builds an expression tree for f, applies derivative transformation rules to get a tree for f’, then evaluates it; limitation is it often produces unnecessarily complicated results`, `It replays a recorded computation graph backwards; limitation is high memory cost`, `It uses Fourier analysis to decompose f into sinusoids; limitation is it only works for periodic functions`],
    answer: 1,
    intuition: `Symbolic diff is like a rule-following algebra student — it applies the chain rule mechanically at every node of the expression tree, always correctly but never cleverly. The gradient of triangle area is geometrically obvious (perpendicular to opposite edge, magnitude |E|/2), but Mathematica outputs a full page of symbols even after simplification. Geometric intuition encodes the WHY; symbolic tools only know the HOW.`,
    explanation: `At [1:33:38], the lecturer explains: "If you build up an expression tree, once I have that tree, if I want the derivative I transform this tree into a tree for the derivative." Pros: derivative tree computed once, then evaluates cheaply for any inputs; no code rewriting required. Cons: tools like Mathematica and Maple struggle with vectors/matrices common in 3D graphics; results are often far more complex than a human derivation. The triangle area gradient example illustrates this — Mathematica’s output versus the two-line geometric argument.`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
]

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''
const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`

const useTimer = () => {
  const [t, setT] = useState(0)
  const [active, setActive] = useState(false)
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setT(x => x+1), 1000)
    return () => clearInterval(id)
  }, [active])
  return { t, start: () => setActive(true), pause: () => setActive(false), reset: () => { setT(0); setActive(false) } }
}

function SlideImages({ images }) {
  if (!images || !images.length) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.75rem' }}>
      {images.map((img, i) => (
        <img key={i} src={`${BASE}/assets/${img}`} alt={`slide-${i+1}`}
          onError={e => { e.target.style.display='none' }}
          style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid #2a2a3a', display: 'block' }} />
      ))}
    </div>
  )
}

export default function Lec21Part2Quiz() {
  const [screen, setScreen] = useState('welcome')
  const [qIdx, setQIdx] = useState(0)
  const [answers, setAnswers] = useState(Array(quizData.length).fill(null))
  const [selected, setSelected] = useState(null)
  const [showExp, setShowExp] = useState(false)
  const [reviewMode, setReviewMode] = useState(false)
  const [expTab, setExpTab] = useState('explanation')
  const [codeCopied, setCodeCopied] = useState(false)
  const { t, start, pause, reset: resetTimer } = useTimer()
  const q = quizData[qIdx]

  const C = {
    bg: '#0a0a0f',
    surface: '#111118',
    border: '#2a2a3a',
    accent: '#a78bfa',
    text: '#e2e8f0',
    muted: '#94a3b8',
    ok: '#10b981',
    err: '#ef4444',
    warn: '#f59e0b',
  }

  const base = { fontFamily: 'system-ui,sans-serif', margin: 0, padding: 0, minHeight: '100vh',
    background: `linear-gradient(135deg, ${C.bg} 0%, #0f0f1a 100%)`, color: C.text,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }
  const box = { maxWidth: '900px', width: '100%', background: C.surface, borderRadius: '16px',
    border: `1px solid ${C.border}`, padding: '2.5rem', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }
  const btn = (extra={}) => ({ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none',
    background: C.accent, color: C.text, fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', ...extra })
  const tag = (color=C.accent) => ({ padding: '0.25rem 0.75rem', borderRadius: '6px',
    background: `${color}22`, color, fontSize: '0.8rem', fontWeight: '600' })

  useEffect(() => { if (screen==='quiz' && !showExp && !reviewMode) start(); else pause() }, [screen,showExp,reviewMode,qIdx])

  const isCorrect = useCallback((question, ans) => {
    if (ans === null || ans === undefined) return false
    return ans === question.answer
  }, [])

  const handleSubmit = () => {
    const a = [...answers]; a[qIdx] = selected; setAnswers(a); setShowExp(true); setExpTab('explanation')
  }
  const handleNext = () => {
    if (qIdx < quizData.length - 1) { setQIdx(q => q+1); setSelected(null); setShowExp(false) }
    else { setScreen('results'); pause() }
  }
  const handlePrev = () => {
    if (qIdx > 0) { setQIdx(q => q-1); setSelected(null); setShowExp(false) }
  }
  const handleRestart = () => {
    setScreen('welcome'); setQIdx(0); setAnswers(Array(quizData.length).fill(null))
    setSelected(null); setShowExp(false); setReviewMode(false); resetTimer()
  }
  const handleReview = () => { setScreen('quiz'); setQIdx(0); setShowExp(false); setReviewMode(true) }

  const score = answers.filter((a,i) => isCorrect(quizData[i],a)).length
  const pct = Math.round(score / quizData.length * 100)

  if (screen === 'welcome') return (
    <div style={base}>
      <div style={box}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Activity size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 21: Dynamics & Time Integration — Part 2</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>ODEs, Lagrangian Mechanics, Euler Integrators, Particle Systems</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-21-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec21/1`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec21/2`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 2</a>
          </div>
          <p style={{ color: C.accent, fontWeight: 600 }}>Q33–Q38 · 6 questions</p>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>6</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Questions</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>~2min</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Est. Time</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>2</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Parts</div></div>
          </div>
        </div>

        <button style={btn({ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' })}
          onClick={() => { setScreen('quiz'); start() }}>
          <Activity size={20} /> Start Quiz
        </button>
        <a href={`${BASE}/`} style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', color: C.muted, fontSize: '0.875rem' }}>← All quizzes</a>
      </div>
    </div>
  )

  if (screen === 'results') return (
    <div style={base}>
      <div style={box}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Trophy size={64} color={pct >= 70 ? C.ok : pct >= 50 ? C.warn : C.err} />
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '1rem', marginBottom: '0.5rem' }}>Quiz Complete!</h1>
          <p style={{ color: C.muted }}><Clock size={16} style={{ display:'inline', verticalAlign:'middle', marginRight:'0.4rem' }} />Time: {formatTime(t)}</p>
        </div>
        <div style={{ background: '#0d0d12', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', textAlign: 'center', border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: '4rem', fontWeight: 700, color: pct>=70?C.ok:pct>=50?C.warn:C.err, marginBottom: '0.5rem' }}>{pct}%</div>
          <div style={{ fontSize: '1.2rem', color: C.muted, marginBottom: '0.75rem' }}>{score} / {quizData.length} correct</div>
          <div style={{ color: C.muted }}>{pct>=90?'Excellent!':pct>=70?'Great work!':pct>=50?'Good progress!':'Keep studying!'}</div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={btn({ flex: 1, justifyContent: 'center' })} onClick={handleReview}>
            <BookOpen size={20} /> Review Answers
          </button>
          <button style={btn({ flex: 1, justifyContent: 'center' })} onClick={handleRestart}>
            <RefreshCw size={20} /> Restart
          </button>
        </div>
        <a href={`${BASE}/`} style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', color: C.muted, fontSize: '0.875rem' }}>← All quizzes</a>
      </div>
    </div>
  )

  return (
    <div style={base}>
      <div style={box}>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 21: Dynamics & Time Integration — Part 2</span>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', color: C.muted, fontSize: '0.875rem', alignItems: 'center' }}>
              <span><Clock size={14} style={{ display:'inline', verticalAlign:'middle', marginRight:'0.25rem' }} />{formatTime(t)}</span>
              <span>{qIdx+1}/6</span>
              <span style={{ color: C.accent }}>✓ {score}</span>
            </div>
          </div>
          <div style={{ height: '5px', background: C.border, borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.round((qIdx+1)/6*100)}%`, background: C.accent, transition: 'width 0.3s' }} />
          </div>
        </div>

        {/* Question */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem', alignItems: 'center' }}>
            <span style={tag()}>Q{q.id}</span>
            <span style={tag()}>[{q.timestamp}]</span>
            <span style={{ color: '#475569', fontSize: '0.72rem', fontFamily: 'monospace', marginLeft: 'auto' }}>{q.source}</span>
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, lineHeight: 1.55, marginBottom: '1.25rem' }}>{q.question}</h2>
        </div>

        {/* Options */}
        <div style={{ marginBottom: '1.5rem' }}>
          {q.options.map((opt, i) => {
            let borderColor = C.border, bgColor = C.surface
            if (showExp || reviewMode) {
              if (i === q.answer) { borderColor = C.ok; bgColor = `${C.ok}15` }
              else if (selected === i) { borderColor = C.err; bgColor = `${C.err}15` }
            } else if (selected === i) {
              borderColor = C.accent; bgColor = `${C.accent}15`
            }
            return (
              <div key={i} onClick={() => !(showExp||reviewMode) && setSelected(i)}
                style={{ padding: '1rem', borderRadius: '8px', border: `2px solid ${borderColor}`,
                  background: bgColor, cursor: (showExp||reviewMode)?'default':'pointer',
                  transition: 'all 0.2s', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {(showExp||reviewMode) && i===q.answer && <CheckCircle size={18} color={C.ok} />}
                {(showExp||reviewMode) && selected===i && i!==q.answer && <XCircle size={18} color={C.err} />}
                <span style={{ fontWeight: 700, color: C.accent, minWidth: '1.2rem' }}>{['A','B','C','D'][i]}.</span>
                <span>{opt}</span>
              </div>
            )
          })}
        </div>

        {/* Explanation (shown after submit) */}
        {(showExp || reviewMode) && (
          <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: `1px solid ${C.border}` }}>
            {/* Tab switcher */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {['intuition','explanation','images','tags'].map(tab => {
                return (
                  <button key={tab} onClick={() => setExpTab(tab)}
                    style={{ padding: '0.3rem 0.85rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                      background: expTab===tab ? C.accent : '#1e1e2e', color: expTab===tab ? '#0a0a0f' : C.muted,
                      outline: expTab===tab ? 'none' : `1px solid ${C.border}` }}>
                    {tab==='intuition' ? '💡 Intuition' : tab==='explanation' ? '📖 Explanation' : tab==='images' ? '🖼 Slides' : '🔗 Tags'}
                  </button>
                )
              })}
            </div>
            {expTab === 'intuition' && (
              q.intuition
                ? (
                  <div style={{ borderLeft: `3px solid ${C.accent}`, paddingLeft: '1rem' }}>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.72rem', fontWeight: 700, color: C.accent, letterSpacing: '0.06em' }}>FIRST PRINCIPLES</p>
                    <p style={{ margin: 0, lineHeight: 1.8, color: C.text, fontSize: '0.95rem' }}>{q.intuition}</p>
                  </div>
                )
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition written yet. Add a <code style={{ color: C.accent }}>- INTUITION:</code> block under this question in <code style={{ color: C.accent }}>lectures/cg-21-lecture-quiz.md</code>.</p>
            )}
            {expTab === 'explanation' && (
              q.explanation
                ? <p style={{ lineHeight: 1.8, color: C.muted, whiteSpace: 'pre-wrap', margin: 0 }}>{q.explanation}</p>
                : <p style={{ color: '#475569', margin: 0 }}>No explanation provided.</p>
            )}
            {expTab === 'images' && (
              q.images && q.images.length > 0
                ? <SlideImages images={q.images} />
                : <p style={{ color: '#475569', margin: 0 }}>No slide images for this question.</p>
            )}
            {expTab === 'tags' && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {q.tags.length > 0
                  ? q.tags.map((tg,i) => <span key={i} style={tag()}>{tg}</span>)
                  : <span style={{ color: '#475569' }}>No tags.</span>}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handlePrev} disabled={qIdx===0}
            style={btn({ background: C.border, opacity: qIdx===0?0.4:1, cursor: qIdx===0?'not-allowed':'pointer' })}>
            <ChevronLeft size={20} /> Prev
          </button>
          {!(showExp||reviewMode) && (
            <button onClick={handleSubmit} disabled={selected===null}
              style={btn({ flex:1, justifyContent:'center', opacity: selected===null?0.4:1, cursor: selected===null?'not-allowed':'pointer' })}>
              Submit Answer
            </button>
          )}
          {(showExp||reviewMode) && (
            <button onClick={handleNext} style={btn({ flex:1, justifyContent:'center' })}>
              {qIdx < 6-1 ? 'Next Question' : 'View Results'} <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
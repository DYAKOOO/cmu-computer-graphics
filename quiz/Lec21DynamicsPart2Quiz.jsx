'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Activity } from 'lucide-react'

// Source: lectures/cg-21-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 21: Dynamics & Time Integration — Part 2 · QQ30–QQ38 · 9 questions (9 MCQ, 0 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-21-lecture-quiz.md 21

const quizData = [
  {
    id: 30,
    qid: `Q30`,
    qtype: `ANALYSIS`,
    format: `mcq`,
    timestamp: `1:15:24`,
    question: `What stability property does Backward Euler have?`,
    options: [`Stable only when τ = a exactly`, `Unconditionally stable for linear ODEs: never blows up regardless of time step size`, `Conditionally stable: requires τ < 1/a`, `Unstable for stiff systems (large a): requires very small time steps`],
    answer: 1,
    answerText: ``,
    intuition: `For u̇ = -au, Backward Euler gives u_{k+1} = u_k / (1 + τa). The factor 1/(1+τa) is always less than 1 for any τ > 0, a > 0 — so the sequence always decays. Compare to Forward Euler where the factor (1-τa) can exceed 1 and blow up. Implicit methods "look ahead" and self-correct, making them inherently more stable.`,
    explanation: `At [1:15:24]–[1:15:49], the lecturer derives: "U_{k+1} = 1/(1+τa) × u_k, which means after n steps, u_n = (1/(1+τa))^n × u₀... This is going to decay as long as 1 + τa > 1. Well, tau is a positive number, and A is a positive number, so this is always going to be true. What that means is backward Euler is unconditionally stable for linear ODEs."

that backward euler doesn't blow us but the drawback is we get damping. To solve damping , we can take more timestep but that is what we were trying to avoid in the first place. one way to solve it is simplectic euler.`,
    code: ``,
    images: ["image_1777622951939_0.png"],
    tags: ["Stability", "TheoriticalGuarantee", "Euler"],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 31,
    qid: `Q31`,
    qtype: `TRADEOFF`,
    format: `mcq`,
    timestamp: `1:13:55`,
    question: `What is the main drawback of Backward Euler compared to Forward Euler?`,
    options: [`It requires computing more force evaluations per step`, `It exhibits numerical damping — energy artificially dissipates even when the true system conserves energy`, `It is less stable for all time step sizes`, `It only works for linear ODEs and fails for nonlinear systems`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:13:55]–[1:14:22], the lecturer observes: "What's going to happen is the motion is going to become damped out. It's going to go slower and slower and slower until it stops and doesn't move at all. And that's also kind of sad, right? Where did all the energy go? We weren't modeling friction... But in our mathematical model, there was no friction. Energy shouldn't have been created or destroyed." This artificial damping is the price of unconditional stability.`,
    code: ``,
    images: ["image_1777623100398_0.png"],
    tags: ["Damping"],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 32,
    qid: `Q32`,
    qtype: `ALGORITHM`,
    format: `mcq`,
    timestamp: `1:17:31`,
    question: `What is the Symplectic Euler update rule?`,
    options: [`v_{k+1} = v_k + τ·f(q_k); q_{k+1} = q_k + τ·v_k (both use current state)`, `v_{k+1} = v_k + τ·f(q_{k+1}); q_{k+1} = q_k + τ·v_{k+1} (implicit velocity, implicit position)`, `q_{k+1} = q_k + τ·v_k + ½τ²·f(q_k) (Verlet position update)`, `v_{k+1} = v_k + τ·f(q_k); q_{k+1} = q_k + τ·v_{k+1} (explicit velocity from current q, position uses new v)`],
    answer: 3,
    answerText: ``,
    intuition: `The twist: update velocity first (using current position, like Forward Euler), THEN update position using the brand-new velocity (not the old one). This "stagger" — v then q, v then q — happens to conserve the symplectic structure of Hamiltonian mechanics. Result: energy is preserved over long simulations, unlike Forward (grows) or Backward (shrinks) Euler.`,
    explanation: `At [1:17:31]–[1:17:55], the lecturer describes: "We're gonna update our velocity using the current configuration. So we're gonna go from the current velocity to the next velocity using data from the current configuration. And then we're gonna update the configuration using our new velocity. So the configuration and the velocity aren't moving forward in lockstep. We're updating the velocity and then updating the configuration — they're kind of staggered."`,
    code: ``,
    images: ["image_1777623111287_0.png"],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 33,
    qid: `Q33`,
    qtype: `COMPARISON`,
    format: `mcq`,
    timestamp: `1:19:04`,
    question: `Which integrator is best for long-running animations that must conserve energy?`,
    options: [`Backward Euler (implicit, unconditionally stable but energy decays over time)`, `Symplectic Euler (nearly energy-conserving, staggered velocity/position updates)`, `Forward Euler (explicit, fast but energy grows over time)`, `Exact closed-form integration (always best but rarely available)`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:18:23]–[1:18:49], the lecturer explains: "The cool thing that happens now is the pendulum now conserves energy almost exactly forever. So you start out, this pendulum's going back and forth, and you can keep on running your simulation for forever — for days, for hours, for weeks — and it'll keep on going back and forth with basically the same energy as at the beginning." Forward Euler gains energy; Backward Euler loses it; Symplectic Euler maintains it.`,
    code: ``,
    images: ["image_1777623127545_0.png", "image_1777623169321_0.png"],
    tags: ["Book"],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 34,
    qid: `Q34`,
    qtype: `COMPARISON`,
    format: `mcq`,
    timestamp: `1:21:23`,
    question: `What are the four main approaches to computing derivatives in simulation?`,
    options: [`By-hand derivation, numerical differentiation, automatic differentiation, symbolic differentiation`, `Forward mode, backward mode, tangent mode, adjoint mode`, `Finite differences, integration, interpolation, extrapolation`, `Gradient descent, Newton's method, secant method, bisection`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:21:23]–[1:25:19], the lecturer describes four methods: (1) by-hand (laborious & error prone but clean/fast code), (2) numerical differentiation (perturb and divide; general but inaccurate), (3) automatic differentiation (pairs of (value, derivative) with chain rule; accurate and fast but requires code changes), (4) symbolic differentiation (expression tree transformation; good for one-time use but often produces complicated results). 5) Geometric differentiation , differentiating a vertex with respect to a triangle.`,
    code: ``,
    images: ["image_1777623356232_0.png"],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 35,
    qid: `Q35`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `1:29:47`,
    question: `What problem arises when h is made too small in numerical differentiation?`,
    options: [`Floating-point precision is exhausted — numbers are indistinguishable — and error increases`, `Division by zero occurs because h appears in the denominator`, `The algorithm converges too quickly and overshoots the derivative`, `The perturbation exceeds the domain of the function`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:29:18]–[1:29:47], the lecturer explains: "If you get down to a certain size, there's not any separation between numbers anymore. What I've plotted here is the error that you get for smaller and smaller h. You see at some point you get down to a pretty small error, but then it shoots back up again when you make h too small. So this is part of the annoyance of working with numerical differentiation."`,
    code: ``,
    images: ["image_1777623752196_0.png"],
    tags: ["definition", "Differentiation/Numerical"],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 36,
    qid: `Q36`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `1:35:30`,
    question: `What is the gradient of triangle area with respect to vertex position P, reasoned geometrically?`,
    options: [`The gradient is the unit normal of the triangle with magnitude equal to the full area`, `The gradient points along the opposite edge E with magnitude 1/2`, `The gradient points toward the centroid with magnitude proportional to the perimeter`, `The gradient is perpendicular to the opposite edge E with magnitude |E|/2`],
    answer: 3,
    answerText: ``,
    intuition: `Moving P parallel to E changes nothing (area = ½ base × height; base length and height are both unchanged). Moving P perpendicular to E changes height by 1, so area changes by |E|/2. Therefore: gradient direction = perpendicular to E, gradient magnitude = |E|/2. One clean geometric argument replaces a page of symbolic calculus from Mathematica.`,
    explanation: `At [1:35:30]–[1:39:18], the lecturer derives geometrically: "I know area is one half base times height. I can't change the length of the base by moving P. Moving P parallel to E doesn't change the height. So the gradient can't be parallel to E... The only other direction is orthogonal to the base... If H increases by one, area increases by one half the length of the base. The gradient of area must point in the direction perpendicular to E and must have magnitude proportional to |E|/2." In 3D: grad = (normal × E) / 2.`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 37,
    qid: `Q37`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `1:29:51`,
    question: `How does forward-mode automatic differentiation work mechanically?`,
    options: [`It symbolically rewrites the expression tree and evaluates the resulting derivative formula`, `It records the computation graph and replays it in reverse to accumulate gradients`, `It propagates pairs (f, f’) through every arithmetic operation using the chain rule`, `It perturbs inputs by a small h and divides the output change by h`],
    answer: 2,
    answerText: ``,
    intuition: `Instead of computing f(x) and then separately computing f’(x), you carry both at once as a pair (value, derivative). Every arithmetic op has a chain-rule rule for transforming pairs. Multiplying (u, u’) × (v, v’) gives (uv, uv’ + vu’) — exactly the product rule. No symbolic trees, no finite differences: just pair arithmetic all the way through.`,
    explanation: `At [1:29:51], the lecturer explains: "Rather than work with values f, you’re going to work with pairs f and f prime. How do you operate on these pairs? Well, you use the chain rule to understand how any arithmetic operation is gonna transform these pairs." Example: f(x) = ax² at x=2. Start with (2,1) representing (x, dx/dx). Square via product rule: (2,1)×(2,1) = (4,4). Multiply by a: (4a, 4a). Derivative of ax² is 2ax, and 2a·2 = 4a — correct. Pros: good accuracy, reasonably fast. Cons: must redefine all arithmetic operators in code.`,
    code: ``,
    images: ["image_1777624316910_0.png"],
    tags: ["Differentiation/Automatic"],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 38,
    qid: `Q38`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `1:33:38`,
    question: `How does symbolic differentiation work, and what is its key limitation compared to geometric reasoning?`,
    options: [`It builds an expression tree for f, applies derivative transformation rules to get a tree for f’, then evaluates it; limitation is it often produces unnecessarily complicated results`, `It perturbs inputs numerically; limitation is floating-point precision loss`, `It uses Fourier analysis to decompose f into sinusoids; limitation is it only works for periodic functions`, `It replays a recorded computation graph backwards; limitation is high memory cost`],
    answer: 0,
    answerText: ``,
    intuition: `Symbolic diff is like a rule-following algebra student — it applies the chain rule mechanically at every node of the expression tree, always correctly but never cleverly. The gradient of triangle area is geometrically obvious (perpendicular to opposite edge, magnitude |E|/2), but Mathematica outputs a full page of symbols even after simplification. Geometric intuition encodes the WHY; symbolic tools only know the HOW.`,
    explanation: `At [1:33:38], the lecturer explains: "If you build up an expression tree, once I have that tree, if I want the derivative I transform this tree into a tree for the derivative." Pros: derivative tree computed once, then evaluates cheaply for any inputs; no code rewriting required. Cons: tools like Mathematica and Maple struggle with vectors/matrices common in 3D graphics; results are often far more complex than a human derivation. The triangle area gradient example illustrates this — Mathematica’s output versus the two-line geometric argument.`,
    code: ``,
    images: ["image_1777624353888_0.png"],
    tags: ["Limitation", "Differentiation/Symbolic", "Tree"],
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
  const [revealed, setRevealed] = useState(false)
  const [reviewMode, setReviewMode] = useState(false)
  const [expTab, setExpTab] = useState('explanation')
  const { t, start, pause, reset: resetTimer } = useTimer()
  const q = quizData[qIdx]

  const C = {
    bg: '#0a0a0f', surface: '#111118', border: '#2a2a3a',
    accent: '#a78bfa', text: '#e2e8f0', muted: '#94a3b8',
    ok: '#10b981', err: '#ef4444', warn: '#f59e0b',
  }

  const base = { fontFamily: 'system-ui,sans-serif', margin: 0, padding: 0, minHeight: '100vh',
    background: `linear-gradient(135deg, ${C.bg} 0%, #0f0f1a 100%)`, color: C.text,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }
  const box = { maxWidth: '900px', width: '100%', background: C.surface, borderRadius: '16px',
    border: `1px solid ${C.border}`, padding: '2.5rem', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }
  const btn = (extra={}) => ({ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none',
    background: C.accent, color: '#0a0a0f', fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', ...extra })
  const tag = (color=C.accent) => ({ padding: '0.25rem 0.75rem', borderRadius: '6px',
    background: `${color}22`, color, fontSize: '0.8rem', fontWeight: '600' })

  useEffect(() => { if (screen==='quiz' && !showExp && !revealed && !reviewMode) start(); else pause() }, [screen,showExp,revealed,reviewMode,qIdx])

  const STORE = 'quiz_lec21'
  const [textAns, setTextAns] = useState({})
  const [notes, setNotes] = useState({})
  const [history, setHistory] = useState([])
  useEffect(() => {
    try {
      setTextAns(JSON.parse(localStorage.getItem(STORE+'_text') || '{}'))
      setNotes(JSON.parse(localStorage.getItem(STORE+'_notes') || '{}'))
      setHistory(JSON.parse(localStorage.getItem(STORE+'_hist') || '[]'))
    } catch {}
  }, [])
  const saveTextAns = (qid, val) => {
    const u = { ...textAns, [qid]: val }; setTextAns(u)
    try { localStorage.setItem(STORE+'_text', JSON.stringify(u)) } catch {}
  }
  const saveNote = (qid, val) => {
    const u = { ...notes, [qid]: val }; setNotes(u)
    try { localStorage.setItem(STORE+'_notes', JSON.stringify(u)) } catch {}
  }
  useEffect(() => {
    if (screen !== 'results') return
    const s = answers.filter((a,i) => quizData[i].format==='mcq' && a===quizData[i].answer).length
    const p = Math.round(s / (9 || 1) * 100)
    const entry = { date: new Date().toLocaleDateString(), score: s, pct: p, time: t }
    setHistory(prev => { const u = [entry, ...prev].slice(0,10); try { localStorage.setItem(STORE+'_hist', JSON.stringify(u)) } catch {} return u })
  }, [screen])

  const mcqQuestions = quizData.filter(q => q.format === 'mcq')
  const isCorrect = useCallback((question, ans) => {
    if (question.format !== 'mcq' || ans === null || ans === undefined) return false
    return ans === question.answer
  }, [])

  const handleSubmit = () => {
    const a = [...answers]; a[qIdx] = selected; setAnswers(a); setShowExp(true); setExpTab('explanation')
  }
  const handleReveal = () => {
    setRevealed(true); setShowExp(true); setExpTab('explanation')
  }
  const handleNext = () => {
    if (qIdx < quizData.length - 1) {
      setQIdx(q => q+1); setSelected(null); setShowExp(false); setRevealed(false)
    } else { setScreen('results'); pause() }
  }
  const handlePrev = () => {
    if (qIdx > 0) { setQIdx(q => q-1); setSelected(null); setShowExp(false); setRevealed(false) }
  }
  const handleRestart = () => {
    setScreen('welcome'); setQIdx(0); setAnswers(Array(quizData.length).fill(null))
    setSelected(null); setShowExp(false); setRevealed(false); setReviewMode(false); resetTimer()
  }
  const handleReview = () => { setScreen('quiz'); setQIdx(0); setShowExp(false); setRevealed(false); setReviewMode(true) }

  const score = answers.filter((a,i) => isCorrect(quizData[i],a)).length
  const pct = Math.round(score / (mcqQuestions.length || 1) * 100)

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
          <p style={{ color: C.accent, fontWeight: 600 }}>QQ30–QQ38 · 9 questions (9 graded + 0 open)</p>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>9</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Graded MCQ</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>0</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Open / Reveal</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>~3min</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Est. Time</div></div>
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
          <div style={{ fontSize: '1.2rem', color: C.muted, marginBottom: '0.75rem' }}>{score} / 9 MCQ correct</div>
          <div style={{ color: C.muted, marginTop: '0.5rem' }}>{pct>=90?'Excellent!':pct>=70?'Great work!':pct>=50?'Good progress!':'Keep studying!'}</div>
        </div>
        {/* Score history */}
        {history.length > 1 && (
          <div style={{ background: '#0d0d12', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: `1px solid ${C.border}` }}>
            <p style={{ margin: '0 0 0.75rem', fontSize: '0.72rem', fontWeight: 700, color: C.muted, letterSpacing: '0.05em' }}>PREVIOUS RUNS</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {history.slice(1).map((h, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: C.muted }}>
                  <span>{h.date}</span>
                  <span style={{ color: h.pct>=70?C.ok:h.pct>=50?C.warn:C.err, fontWeight: 600 }}>{h.pct}%</span>
                  <span>{h.score}/{h.score !== undefined ? h.score : '?'} correct</span>
                  <span>{formatTime(h.time)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={btn({ flex: 1, justifyContent: 'center' })} onClick={handleReview}>
            <BookOpen size={20} /> Review Answers
          </button>
          <button style={btn({ flex: 1, justifyContent: 'center' })} onClick={handleRestart}>
            <RefreshCw size={20} /> Restart
          </button>
        </div>
        <a href={`${BASE}/`} style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', color: C.muted, fontSize: '0.875rem' }}>← All quizzes &nbsp;·&nbsp; ✏️ Export notes from home page</a>
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
              <span>{qIdx+1}/9</span>
              <span style={{ color: C.accent }}>✓ {score}</span>
            </div>
          </div>
          <div style={{ height: '5px', background: C.border, borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.round((qIdx+1)/9*100)}%`, background: C.accent, transition: 'width 0.3s' }} />
          </div>
        </div>

        {/* Question */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem', alignItems: 'center' }}>
            <span style={tag()}>{q.qid}</span>
            <span style={tag(`${C.accent}99`)}>{q.qtype}</span>
            <span style={tag()}>[{q.timestamp}]</span>
            <span style={{ color: '#475569', fontSize: '0.72rem', fontFamily: 'monospace', marginLeft: 'auto' }}>{q.source}</span>
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, lineHeight: 1.55, marginBottom: '1.25rem' }}>{q.question}</h2>
        </div>

        {/* MCQ Options */}
        {q.format === 'mcq' && (
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
        )}

        {/* Reveal-format: student input */}
        {q.format === 'reveal' && !reviewMode && (
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: C.muted,
              letterSpacing: '0.05em', marginBottom: '0.5rem' }}>YOUR ANSWER</label>
            <textarea
              placeholder='Write your answer here before revealing the model answer...'
              value={textAns[q.qid] || ''}
              onChange={e => saveTextAns(q.qid, e.target.value)}
              rows={4}
              style={{ width: '100%', background: '#0d0d12', border: `1px solid ${C.border}`,
                borderRadius: '8px', color: C.text, fontSize: '0.95rem', padding: '0.75rem',
                resize: 'vertical', fontFamily: 'system-ui,sans-serif', lineHeight: 1.6,
                boxSizing: 'border-box', outline: 'none' }} />
          </div>
        )}

        {/* Reveal-format answer */}
        {q.format === 'reveal' && revealed && (
          <div style={{ background: `${C.ok}10`, border: `2px solid ${C.ok}55`, borderRadius: '12px',
            padding: '1.5rem', marginBottom: '1.5rem' }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.72rem', fontWeight: 700, color: C.ok, letterSpacing: '0.06em' }}>MODEL ANSWER</p>
            <p style={{ margin: 0, lineHeight: 1.8, color: C.text, whiteSpace: 'pre-wrap', fontSize: '0.98rem' }}>{q.answerText}</p>
          </div>
        )}

        {(showExp || reviewMode) && (
          <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {['intuition','explanation','images','notes','tags'].map(tab => (
                <button key={tab} onClick={() => setExpTab(tab)}
                  style={{ padding: '0.3rem 0.85rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                    background: expTab===tab ? C.accent : '#1e1e2e', color: expTab===tab ? '#0a0a0f' : C.muted,
                    outline: expTab===tab ? 'none' : `1px solid ${C.border}` }}>
                  {tab==='intuition' ? '💡 Intuition' : tab==='explanation' ? '📖 Explanation' : tab==='images' ? '🖼 Slides' : tab==='notes' ? '✏️ My Notes' : '🔗 Tags'}
                </button>
              ))}
            </div>
            {expTab === 'intuition' && (
              q.intuition
                ? <div style={{ borderLeft: `3px solid ${C.accent}`, paddingLeft: '1rem' }}>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.72rem', fontWeight: 700, color: C.accent, letterSpacing: '0.06em' }}>FIRST PRINCIPLES</p>
                    <p style={{ margin: 0, lineHeight: 1.8, color: C.text, fontSize: '0.95rem' }}>{q.intuition}</p>
                  </div>
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-21-lecture-quiz.md.</p>
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
            {expTab === 'notes' && (
              <div>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.72rem', fontWeight: 700, color: C.muted, letterSpacing: '0.05em' }}>YOUR QUESTIONS & NOTES</p>
                <textarea
                  placeholder='Follow-up questions, things to look up, connections to other topics...'
                  value={notes[q.qid] || ''}
                  onChange={e => saveNote(q.qid, e.target.value)}
                  rows={5}
                  style={{ width: '100%', background: '#0a0a0f', border: `1px solid ${C.border}`,
                    borderRadius: '8px', color: C.text, fontSize: '0.9rem', padding: '0.75rem',
                    resize: 'vertical', fontFamily: 'system-ui,sans-serif', lineHeight: 1.6,
                    boxSizing: 'border-box', outline: 'none' }} />
                <p style={{ margin: '0.4rem 0 0', fontSize: '0.75rem', color: '#475569' }}>Auto-saved to your browser.</p>
              </div>
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

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handlePrev} disabled={qIdx===0}
            style={btn({ background: C.border, color: C.text, opacity: qIdx===0?0.4:1, cursor: qIdx===0?'not-allowed':'pointer' })}>
            <ChevronLeft size={20} /> Prev
          </button>
          {q.format === 'mcq' && !(showExp||reviewMode) && (
            <button onClick={handleSubmit} disabled={selected===null}
              style={btn({ flex:1, justifyContent:'center', opacity: selected===null?0.4:1, cursor: selected===null?'not-allowed':'pointer' })}>
              Submit Answer
            </button>
          )}
          {q.format === 'reveal' && !revealed && !reviewMode && (
            <button onClick={handleReveal}
              style={btn({ flex:1, justifyContent:'center', background: '#1e3a5f', color: C.text, border: `1px solid ${C.accent}55` })}>
              <Eye size={20} /> Reveal Answer
            </button>
          )}
          {(showExp || revealed || reviewMode) && (
            <button onClick={handleNext} style={btn({ flex:1, justifyContent:'center' })}>
              {qIdx < 9-1 ? 'Next Question' : 'View Results'} <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
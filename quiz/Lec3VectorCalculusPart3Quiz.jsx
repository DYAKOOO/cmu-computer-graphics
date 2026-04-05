'use client'
import { useState, useEffect, useRef } from 'react'
import { Sigma } from 'lucide-react'

// Source: lectures/cg-03-lecture-quiz.md  (symlinked from Logseq pages)
// Lecture 3: Vector Calculus — Part 3 — Q65–Q70 (6 questions)
// Re-generate: python3 scripts/gen_quiz.py lectures/cg-03-lecture-quiz.md 3

function SlideImages({ images }) {
  if (!images || images.length === 0) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', margin: '0.75rem 0' }}>
      {images.map((img, i) => (
        <img key={i} src={`/assets/${img}`} alt={`slide-${i+1}`}
          onError={e => { e.target.style.display = 'none' }}
          style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid #334155', display: 'block' }} />
      ))}
    </div>
  )
}

const quizData = [
  {
    num: 65,
    timestamp: `1:13:27`,
    question: `What is the 2D curl formula?`,
    options: [`The determinant of the 2×2 Jacobian matrix`, `∂x₂/∂x₁ - ∂x₁/∂x₂`, `∂x₁/∂x₁ + ∂x₂/∂x₂`, `The divergence of the 2D vector field`],
    answer: 1,
    explanation: `The lecturer gives the formula at [1:13:27]: "The curl of x is equal to the partial derivative of the second coordinate function along the first coordinate direction minus the partial derivative of the first coordinate function along the second coordinate direction."`,
    images: ["image_1771989224011_0.png", "image_1772584933293_0.png", "image_1772584943241_0.png", "image_1772585074709_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 66,
    timestamp: `1:14:47`,
    question: `What relationship does the lecturer identify between curl and divergence?`,
    options: [`They are completely independent operations`, `The divergence of X equals the curl of the 90° rotation of X`, `The curl is always perpendicular to the divergence`, `The sum of curl and divergence always equals zero`],
    answer: 1,
    explanation: `The lecturer observes at [1:14:47]: "Do you notice anything about the relationship between curl and divergence? Hopefully you do! Hopefully what you are kind of picking up on is that the divergence of x is the same as the curl of the 90 degree rotation of x."`,
    images: ["image_1771989278643_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 67,
    timestamp: `1:16:38`,
    question: `In the fluid simulation example, what change in variables leads to different simulation results?`,
    options: [`Changing from 2D to 3D simulation`, `Changing from velocity field to stream function`, `Changing from laminar to turbulent flow`, `Changing from Eulerian to Lagrangian coordinates`],
    answer: 1,
    explanation: `The lecturer explains at [1:16:52]: "So in one case you might use the fluid velocity u, in the other case you use the so-called stream function psi. And you can see that just this mathematically fairly simple change really changes the behavior of the simulation."`,
    images: ["image_1771989335272_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 68,
    timestamp: `1:17:34`,
    question: `Why does the lecturer say the Laplacian is important for graphics?`,
    options: [`It only appears in specialized applications`, `It appears across many domains including geometry, rendering, simulation, and imaging`, `It's only important for color processing`, `It's only useful for physics simulations`],
    answer: 1,
    explanation: `The lecturer emphasizes at [1:17:34]: "This is unbelievably important for graphics, it shows up across geometry, across rendering, simulation, imaging, everywhere."`,
    images: ["image_1771989366312_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 69,
    timestamp: `1:21:19`,
    question: `How can the Laplacian be written in terms of other differential operators?`,
    options: [`As the gradient of the divergence`, `As the curl of the gradient`, `As the divergence of the gradient`, `As the divergence of the curl`],
    answer: 2,
    explanation: `The lecturer states at [1:21:19]: "We can write it using the operators we just talked about: divergence and gradient. So Laplacian of f is the divergence of the gradient of f."  ]`,
    images: ["image_1771989413169_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 70,
    timestamp: `1:27:25`,
    question: `How does the lecturer define the Hessian in terms of the gradient?`,
    options: [`The Hessian is the determinant of the gradient`, `The Hessian is the transpose of the gradient`, `The Hessian gives the directional derivative of the gradient`, `The Hessian is the integral of the gradient`],
    answer: 2,
    explanation: `The lecturer defines at [1:27:25]: "More precisely what I mean by that is if I take the Hessian of the function f and apply it to the vector or direction u, then I get the directional derivative of the gradient in the direction u."

-`,
    images: ["image_1771989791144_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
]

function useTimer() {
  const [elapsed, setElapsed] = useState(0)
  const ref = useRef(null)
  const start = () => { ref.current = setInterval(() => setElapsed(e => e + 1), 1000) }
  const stop = () => clearInterval(ref.current)
  const reset = () => { clearInterval(ref.current); setElapsed(0) }
  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
  return { elapsed, fmt, start, stop, reset }
}

export default function Lec3Part3Quiz() {
  const [screen, setScreen] = useState('welcome')
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [history, setHistory] = useState([])
  const timer = useTimer()
  const q = quizData[idx]
  const ACCENT = '#38bdf8'
  const card = { background: '#1e293b', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid #334155' }

  if (screen === 'welcome') return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'system-ui,sans-serif' }}>
      <Sigma size={48} color={ACCENT} style={{ marginBottom: '1.5rem' }} />
      <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem' }}>Lecture 3: Vector Calculus — Part 3</h1>
      <p style={{ color: '#94a3b8', marginBottom: '0.25rem' }}>Gradient, Divergence, Curl, Laplacian, Hessian</p>
      <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Q65–Q70 · 6 questions</p>
      <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
        <a href="/lec3/1" style={{ color: "#64748b" }}>Part 1</a> · <a href="/lec3/2" style={{ color: "#64748b" }}>Part 2</a> · <a href="/lec3/3" style={{ color: ACCENT }}>Part 3</a>
      </p>
      <p style={{ color: ACCENT, fontWeight: 600, fontSize: '0.85rem', marginBottom: '2rem', fontFamily: 'monospace' }}>lectures/cg-03-lecture-quiz.md</p>
      <button onClick={() => { setScreen('quiz'); timer.start() }}
        style={{ background: ACCENT, color: '#0f172a', fontWeight: 700, padding: '0.75rem 2.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1rem', marginBottom: '1rem' }}>
        Start Quiz
      </button>
      <a href='/' style={{ color: '#64748b', fontSize: '0.875rem' }}>← All quizzes</a>
    </div>
  )

  if (screen === 'results') {
    const pct = Math.round(score / quizData.length * 100)
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', padding: '2rem', fontFamily: 'system-ui,sans-serif', color: '#f1f5f9' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}><Sigma size={20} color={ACCENT} /><h1 style={{ color: ACCENT, fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Lecture 3: Vector Calculus — Part 3 — Results</h1></div>
          <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Time: {timer.fmt(timer.elapsed)}</p>
          <div style={{ ...card, textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: ACCENT }}>{pct}%</div>
            <div style={{ color: '#94a3b8', marginTop: '0.5rem' }}>{score} / {quizData.length} correct</div>
          </div>
          {history.map((chosen, i) => {
            const qq = quizData[i]
            const ok = chosen === qq.answer
            return (
              <div key={i} style={{ ...card, borderColor: ok ? '#22c55e55' : '#ef444455', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.78rem', fontFamily: 'monospace' }}>Q{qq.num} [{qq.timestamp}] · {qq.source}</span>
                  <span style={{ color: ok ? '#22c55e' : '#ef4444', fontSize: '1.1rem' }}>{ok ? '✓' : '✗'}</span>
                </div>
                <div style={{ fontWeight: 600, marginBottom: '0.75rem', lineHeight: 1.5 }}>{qq.question}</div>
                <div style={{ color: ok ? '#22c55e' : '#ef4444', fontSize: '0.9rem' }}>
                  Your answer: {qq.options[chosen]}
                </div>
                {!ok && <div style={{ color: '#22c55e', fontSize: '0.9rem', marginTop: '0.25rem' }}>Correct: {qq.options[qq.answer]}</div>}
                {qq.explanation ? (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #334155' }}>
                    <div style={{ color: ACCENT, fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.4rem' }}>EXPLANATION</div>
                    <div style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{qq.explanation}</div>
                  </div>
                ) : null}
                <SlideImages images={qq.images} />
                {qq.tags.length > 0 && <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {qq.tags.map((t, ti) => <span key={ti} style={{ background: `${ACCENT}22`, color: ACCENT, fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '99px' }}>{t}</span>)}
                </div>}
              </div>
            )
          })}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <button onClick={() => { setScreen('welcome'); setIdx(0); setScore(0); setHistory([]); timer.reset() }}
              style={{ background: ACCENT, color: '#0f172a', fontWeight: 700, padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
              Restart
            </button>
            <a href='/' style={{ display: 'flex', alignItems: 'center', color: '#64748b', fontSize: '0.875rem' }}>← All quizzes</a>
          </div>
        </div>
      </div>
    )
  }

  const handleSelect = (i) => { if (!revealed) setSelected(i) }
  const handleReveal = () => { if (selected !== null) { setRevealed(true); if (selected === q.answer) setScore(s => s + 1) } }
  const handleNext = () => {
    setHistory(h => [...h, selected])
    if (idx + 1 >= quizData.length) { timer.stop(); setScreen('results') }
    else { setIdx(i => i + 1); setSelected(null); setRevealed(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '1.5rem', fontFamily: 'system-ui,sans-serif', color: '#f1f5f9' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Sigma size={18} color={ACCENT} /><span style={{ color: ACCENT, fontWeight: 600, fontSize: '0.95rem' }}>Lecture 3: Vector Calculus — Part 3</span></div>
          <div style={{ display: 'flex', gap: '1.25rem', color: '#94a3b8', fontSize: '0.85rem' }}>
            <span>{timer.fmt(timer.elapsed)}</span>
            <span>{idx+1}/6</span>
            <span style={{ color: ACCENT }}>✓ {score}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ background: '#1e293b', borderRadius: '99px', height: '5px', marginBottom: '1.25rem' }}>
          <div style={{ background: ACCENT, height: '100%', borderRadius: '99px', width: `${Math.round((idx+1)/6*100)}%`, transition: 'width 0.3s' }} />
        </div>

        {/* Question */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ color: '#64748b', fontSize: '0.78rem', fontFamily: 'monospace' }}>Q{q.num} · [{q.timestamp}]</span>
            <span style={{ color: '#475569', fontSize: '0.72rem', fontFamily: 'monospace' }}>lectures/cg-03-lecture-quiz.md</span>
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.65, marginBottom: '1.25rem' }}>{q.question}</div>

          {/* Slide images shown before answering if present */}
          {!revealed && <SlideImages images={q.images} />}

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {q.options.map((opt, i) => {
              let bg = '#0f172a', border = '#334155', color = '#cbd5e1'
              if (selected === i && !revealed) { bg = `${ACCENT}22`; border = ACCENT; color = '#f1f5f9' }
              if (revealed && i === q.answer) { bg = '#22c55e1a'; border = '#22c55e'; color = '#22c55e' }
              if (revealed && selected === i && i !== q.answer) { bg = '#ef44441a'; border = '#ef4444'; color = '#ef4444' }
              return (
                <button key={i} onClick={() => handleSelect(i)} style={{ background: bg, border: `1px solid ${border}`, color, padding: '0.75rem 1rem', borderRadius: '8px', textAlign: 'left', cursor: revealed ? 'default' : 'pointer', fontSize: '0.95rem', lineHeight: 1.5, transition: 'all 0.15s' }}>
                  <span style={{ fontWeight: 700, marginRight: '0.5rem' }}>{['A','B','C','D'][i]}.</span>{opt}
                </button>
              )
            })}
          </div>
        </div>

        {/* Explanation card (flip side) */}
        {revealed && (
          <div style={{ ...card, borderColor: `${ACCENT}44` }}>
            <div style={{ color: ACCENT, fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>EXPLANATION</div>
            {q.explanation ? (
              <div style={{ color: '#cbd5e1', lineHeight: 1.75, whiteSpace: 'pre-wrap', marginBottom: '0.75rem' }}>{q.explanation}</div>
            ) : <div style={{ color: '#475569', fontSize: '0.875rem' }}>No explanation provided.</div>}
            <SlideImages images={q.images} />
            {q.tags.length > 0 && (
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {q.tags.map((t, ti) => (
                  <span key={ti} style={{ background: `${ACCENT}22`, color: ACCENT, fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '99px' }}>{t}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {!revealed && (
            <button onClick={handleReveal} disabled={selected === null}
              style={{ background: selected !== null ? ACCENT : '#1e293b', color: selected !== null ? '#0f172a' : '#475569', fontWeight: 700, padding: '0.75rem 2rem', borderRadius: '8px', border: `1px solid ${selected !== null ? ACCENT : '#334155'}`, cursor: selected !== null ? 'pointer' : 'not-allowed', transition: 'all 0.15s' }}>
              Check Answer
            </button>
          )}
          {revealed && (
            <button onClick={handleNext}
              style={{ background: ACCENT, color: '#0f172a', fontWeight: 700, padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
              {idx + 1 >= 6 ? 'See Results →' : 'Next →'}
            </button>
          )}
          <a href='/' style={{ display: 'flex', alignItems: 'center', color: '#475569', fontSize: '0.875rem' }}>← All quizzes</a>
        </div>
      </div>
    </div>
  )
}

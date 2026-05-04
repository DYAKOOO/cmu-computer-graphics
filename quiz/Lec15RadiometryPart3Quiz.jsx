'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Zap } from 'lucide-react'

// Source: lectures/cg-15-lecture-quiz.md.md  (symlinked → Logseq pages)
// Lecture 15: Radiometry — Part 3 · QQ62–QQ74 · 13 questions (13 MCQ, 0 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-15-lecture-quiz.md.md 15

const quizData = [
  {
    id: 62,
    qid: `Q62`,
    qtype: `MATHEMATICAL`,
    format: `mcq`,
    timestamp: `57:06`,
    question: `How is irradiance calculated for a uniform area light source?`,
    options: [`By taking the light's intensity and dividing by distance`, `By using the inverse square law`, `By multiplying the area of the light by its intensity`, `By integrating the incident radiance weighted by the cosine over the solid angle subtended by the source`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [57:06], the lecturer states, "If the source emits irradiance L, then we can say the irradiance at a point P arriving at a point P is the integral over the Hemisphere around that point of the incident radiance L at the point P in the direction Omega times cosine theta D Omega."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 63,
    qid: `Q63`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `58:08`,
    question: `What is projected solid angle?`,
    options: [`The solid angle divided by π`, `The cosine-weighted solid angle`, `The solid angle without accounting for direction`, `The solid angle projected onto a flat surface`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [58:08], the lecturer defines, "Projected solid angle is just the cosine weighted solid angle."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 64,
    qid: `Q64`,
    qtype: `EXAMPLE`,
    format: `mcq`,
    timestamp: `58:16`,
    question: `What example of an area light does the lecturer use to demonstrate solid angle calculations?`,
    options: [`A uniform disk source`, `A rectangular area light`, `A cylindrical light`, `A triangular light`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [58:16], the lecturer states, "As a concrete example we can consider a uniform disk source."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 65,
    qid: `Q65`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `59:20`,
    question: `For most light sources, how are the irradiance integrals typically solved?`,
    options: [`Using lookup tables`, `Only using the inverse square law`, `Using closed-form analytical solutions`, `Using numerical techniques and approximations`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [59:26], the lecturer notes, "For most light sources by the way you're not going to be able to get this closed form integral... In general we're gonna need numerical techniques for doing these kinds of integrals."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 66,
    qid: `Q66`,
    qtype: `VISUAL`,
    format: `mcq`,
    timestamp: `59:50`,
    question: `What visual characteristic distinguishes area lights from point lights?`,
    options: [`Area lights produce softer shadows and gradients`, `Area lights are always brighter`, `Area lights don't produce shadows`, `Area lights have more saturated colors`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [59:50], the lecturer explains, "It's gonna have kind of a softer appearance than point lights because the light, the emitted light is spread out over a larger area."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 67,
    qid: `Q67`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `1:00:30`,
    question: `What is a goniometric diagram?`,
    options: [`A type of shadow map`, `A diagram showing the position of lights in a scene`, `A chart showing light intensity as a function of angle`, `A 3D model of a lighting setup`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:00:55], the lecturer describes it as "a goniometric diagram which measures the light intensity as a function of angle."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 68,
    qid: `Q68`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `1:01:14`,
    question: `What practical application of photorealistic rendering does the lecturer highlight?`,
    options: [`Video game development`, `Movie special effects`, `Medical imaging`, `Architectural pre-visualization to see how buildings will look`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:01:14], the lecturer states, "This is one important use case of photorealistic rendering, not just for making cool-looking images but for actually doing pre-visualization. You're building a building, you're doing architecture and you want to get a sense of how is this really gonna look when we build it."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 69,
    qid: `Q69`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `1:01:33`,
    question: `What is photometry?`,
    options: [`The measurement of photographs`, `The human-centric version of radiometry`, `The measurement of light's chemical effects`, `The study of light sources`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:02:00], the lecturer defines, "All of these different radiometric quantities that we talked about have equivalence in photometry, which is kind of the human centric version of radiometry."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 70,
    qid: `Q70`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `1:02:13`,
    question: `What is luminance and how does it relate to radiance?`,
    options: [`Luminance is the total light in a scene; it's unrelated to radiance`, `Luminance only applies to artificial light sources`, `Luminance is a photometric quantity that corresponds to radiance`, `Luminance is a measure of color; it's a component of radiance`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:02:13], the lecturer states, "Luminance which is often represented by Y is a photometric quantity that corresponds to radiance."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 71,
    qid: `Q71`,
    qtype: `MATHEMATICAL`,
    format: `mcq`,
    timestamp: `1:02:24`,
    question: `How is luminance (Y) calculated from spectral radiance?`,
    options: [`By taking the maximum radiance across all wavelengths`, `By averaging the radiance values`, `By selecting only the green wavelengths`, `By integrating radiance over all wavelengths, weighted by the eye's response curve`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:02:24], the lecturer explains, "We're gonna integrate radiance over all wavelengths but we're gonna wait by the eyes response, by the eyes luminous efficacy curve."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 72,
    qid: `Q72`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `1:03:01`,
    question: `What aspect of human vision affects photometric measurements in different lighting conditions?`,
    options: [`Eye adaptation between daytime and nighttime vision`, `The focal length of the eye`, `The reflection off the back of the retina`, `The number of cones in the retina`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:03:01], the lecturer notes, "The eye is not even just one static model. Depending on whether it's daytime or nighttime for instance your eye is going to behave in very different ways."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 73,
    qid: `Q73`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `1:04:04`,
    question: `Why are there so many different terms and units in radiometry and photometry?`,
    options: [`Because people in different fields use different names for the same or analogous quantities`, `Because light measurement is inherently complex`, `Because each term refers to a completely different concept`, `Because the field is still developing standardized terminology`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:04:04], the lecturer explains, "The names are much more complicated than the concept and part of the reason is that people in different walks of life use different names for the same or analogous quantities."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 74,
    qid: `Q74`,
    qtype: `LIMITATION`,
    format: `mcq`,
    timestamp: `1:05:44`,
    question: `What small-scale light effects does the geometric optics model ignore?`,
    options: [`Color and wavelength`, `Intensity and brightness`, `Reflection and refraction`, `Diffraction and iridescence`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:05:49], the lecturer states, "That means we miss out on small scale effects like diffraction or iridescent."
-`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
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

export default function Lec15Part3Quiz() {
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
    accent: '#facc15', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec15'
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
    const p = Math.round(s / (13 || 1) * 100)
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
          <Zap size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 15: Radiometry — Part 3</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Radiance, irradiance, BRDFs, rendering equation basics</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-15-lecture-quiz.md.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec15/1`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec15/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
          <a key={3} href={`${BASE}/lec15/3`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 3</a>
          </div>
          <p style={{ color: C.accent, fontWeight: 600 }}>QQ62–QQ74 · 13 questions (13 graded + 0 open)</p>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>13</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Graded MCQ</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>0</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Open / Reveal</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>~4min</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Est. Time</div></div>
          </div>
        </div>

        <button style={btn({ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' })}
          onClick={() => { setScreen('quiz'); start() }}>
          <Zap size={20} /> Start Quiz
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
          <div style={{ fontSize: '1.2rem', color: C.muted, marginBottom: '0.75rem' }}>{score} / 13 MCQ correct</div>
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
              <Zap size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 15: Radiometry — Part 3</span>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', color: C.muted, fontSize: '0.875rem', alignItems: 'center' }}>
              <span><Clock size={14} style={{ display:'inline', verticalAlign:'middle', marginRight:'0.25rem' }} />{formatTime(t)}</span>
              <span>{qIdx+1}/13</span>
              <span style={{ color: C.accent }}>✓ {score}</span>
            </div>
          </div>
          <div style={{ height: '5px', background: C.border, borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.round((qIdx+1)/13*100)}%`, background: C.accent, transition: 'width 0.3s' }} />
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-15-lecture-quiz.md.md.</p>
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
              {qIdx < 13-1 ? 'Next Question' : 'View Results'} <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Hash } from 'lucide-react'

// Source: lectures/cg-17-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 17: Numerical Integration — Part 2 · QQ33–QQ46 · 14 questions (14 MCQ, 0 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-17-lecture-quiz.md 17

const quizData = [
  {
    id: 33,
    qid: `Q33`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `39:07`,
    question: `What distinguishes continuous probability distributions from discrete ones according to the lecture?`,
    options: [`Continuous distributions have a continuum of possible values rather than a finite set`, `Continuous distributions are always normally distributed`, `Continuous distributions have higher precision`, `Continuous distributions are easier to sample from`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [39:50], the professor explains: "Well there's a whole continuum of possible temperatures I could be fifty five and a half degrees I could be fifty five and a quarter degrees I could be fifty five and an eighth degrees." This contrasts with discrete distributions which have a finite set of possible values.`,
    code: ``,
    images: ["lec17_slide_24.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md`,
  },
  {
    id: 34,
    qid: `Q34`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `40:54`,
    question: `What properties must a probability density function satisfy according to the lecture?`,
    options: [`It must be non-negative and integrate to one over the domain`, `It must be symmetric around its mean`, `It must be differentiable and integrable`, `It must be continuous and bounded`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [40:54], the professor states: "The probability density P of X again has to satisfy some very simple rules for one thing it has to be non-negative my probability still can't be negative and it has to integrate to one over the whole domain."
-`,
    code: ``,
    images: ["image_1745943404642_0.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md`,
  },
  {
    id: 35,
    qid: `Q35`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `42:15`,
    question: `How is the CDF defined for continuous distributions?`,
    options: [`As the integral of the PDF from 0 to x`, `As the limit of the discrete CDF`, `As the derivative of the PDF`, `As the sum of probabilities up to a point`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [41:55], the professor explains: "The cumulative distribution function in the continuous setting is no longer a sum but it's an integral. So rather than taking a cumulative sum we just do a cumulative integral. If I want to know in particular the probability that something happened between 0 and X then I integrate from 0 to X."
-`,
    code: ``,
    images: ["image_1745945326393_0.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md`,
  },
  {
    id: 36,
    qid: `Q36`,
    qtype: `IMPLEMENTATION`,
    format: `mcq`,
    timestamp: `43:43`,
    question: `What challenge is associated with inverting the CDF for continuous distributions?`,
    options: [`It requires using numerical approximation methods`, `The CDF might not be invertible`, `Computing the CDF integral and then inverting it can be difficult in closed form`, `It requires solving a differential equation`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [44:00], the professor explains: "We need to know a formula for the integral of little P of X and we need to be able to invert this cumulative integral both of which can be challenging."
-`,
    code: ``,
    images: ["image_1745944040573_0.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md`,
  },
  {
    id: 37,
    qid: `Q37`,
    qtype: `CALCULATION`,
    format: `mcq`,
    timestamp: `45:14`,
    question: `In the quadratic distribution example, what is the probability density function being sampled?`,
    options: [`P(x) = 3x²`, `P(x) = 3x + 1`, `P(x) = 3x(1-x)`, `P(x) = 3(1-x)²`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [45:07], the professor specifies: "P of x equals 3 times 1 minus x squared so this blue curve here right it's more probable that things are gonna happen towards 0 then they're gonna happen off toward 1."
-`,
    code: ``,
    images: ["image_1745944083591_0.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md`,
  },
  {
    id: 38,
    qid: `Q38`,
    qtype: `IMPLEMENTATION`,
    format: `mcq`,
    timestamp: `46:22`,
    question: `How do we verify that our sampling method for the quadratic distribution is correct?`,
    options: [`By comparing it to a different sampling method`, `By proving it mathematically`, `By calculating the error in each sample`, `By generating many samples and checking that their histogram matches the original distribution`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [46:29], the professor explains: "What I see if I do this many many times and do a histogram is that the the histogram starts looking a lot like that original blue curve in fact if I keep taking more and more and more samples this histogram really will approach or really look nicely like that original distribution."`,
    code: ``,
    images: ["lec17_slide_29.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md`,
  },
  {
    id: 39,
    qid: `Q39`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `47:34`,
    question: `What scenario presents a challenge for the inversion method of sampling?`,
    options: [`When the PDF is not continuous`, `When the PDF is not bounded`, `When the distribution is non-uniform`, `When the CDF cannot be computed or inverted in closed form`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [47:34], the professor poses this challenge: "Let's say you can't invert your CDF in fact let's say you can't even compute your CDF all you know is the probability distribution that you want to sample from that's also a very common scenario."
-`,
    code: ``,
    images: ["image_1745941772247_0.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md`,
  },
  {
    id: 40,
    qid: `Q40`,
    qtype: `CHALLENGE`,
    format: `mcq`,
    timestamp: `48:55`,
    question: `What makes sampling from a 2D distribution like the unit disk more challenging than 1D distributions?`,
    options: [`The transformation from polar to Cartesian coordinates is complex`, `The CDF becomes a function of two variables making inversion more difficult`, `The unit disk has an irregular shape`, `The distribution is uniform`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [49:08], the professor explains: "We haven't said it all how to apply this conversion technique to multi-dimensional settings you can do it it's even more of a pain all right now you have to do kind of more integration and more tricky inversion doesn't sound like the right thing to do in this case."`,
    code: ``,
    images: ["lec17_slide_29.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md`,
  },
  {
    id: 41,
    qid: `Q41`,
    qtype: `ERROR`,
    format: `mcq`,
    timestamp: `50:23`,
    question: `What is wrong with the naive approach to uniform disk sampling using polar coordinates?`,
    options: [`It produces more samples in the center than near the edge`, `It produces samples outside the disk`, `The samples are not randomly distributed`, `It produces more samples near the edge than in the center`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [51:04], the professor explains: "Our sampling the way we said if the sampling is not uniform with respect to area points farther from the center of the circle are a lot less likely to be chosen."
-`,
    code: ``,
    images: ["image_1745944541436_0.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md`,
  },
  {
    id: 42,
    qid: `Q42`,
    qtype: `IMPLEMENTATION`,
    format: `mcq`,
    timestamp: `51:30`,
    question: `What is the correct approach to uniform sampling within a circle using the inversion method?`,
    options: [`Sample x and y uniformly from [-1,1] and reject points outside the circle`, `Sample θ uniformly from [0,2π] and r uniformly from [0,1]`, `Sample θ uniformly from [0,2π] and take the square root of a uniform random number for r`, `Sample θ uniformly from [0,2π] and r² uniformly from [0,1]`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [53:21], the professor concludes: "In the end we end up with this really simple procedure right just pick two uniform random numbers multiply the first one by 2 pi take the square root of the second one and this will spread out the samples properly over the domain."
-`,
    code: ``,
    images: ["image_1745943888039_0.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md`,
  },
  {
    id: 43,
    qid: `Q43`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `52:49`,
    question: `Why is the correct formula for uniform disk sampling surprisingly simple despite the complex derivation?`,
    options: [`Because the CDF separates into independent components for radius and angle`, `Because the disk has rotational symmetry`, `Because the inversion method always produces simple formulas`, `Because the probability density function is constant`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [52:15], the professor explains: "Because R and theta are independent right picking R doesn't have any influence on theta and vice versa we can think of the probability for the joint probability for R and theta as a product of P R and P theta."
-`,
    code: ``,
    images: ["image_1745943835798_0.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md`,
  },
  {
    id: 44,
    qid: `Q44`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `53:46`,
    question: `What is rejection sampling as described in the lecture?`,
    options: [`An approach that iteratively improves sample quality by rejecting outliers`, `A strategy that discards samples with high variance`, `A method that rejects samples that don't meet statistical criteria`, `A technique where samples are drawn from a simpler distribution and those outside the target region are discarded`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [54:02], the professor explains: "Why don't we we we don't know how to pick points inside the disc uniformly but something that's really easy to do is pick points uniformly inside a box... Then we just check... did it land inside the disk or not if it didn't land inside the disk we say whoa that one's not in our in our domain we should ignore it just toss it out and go again."
-`,
    code: ``,
    images: ["image_1745943147493_0.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md`,
  },
  {
    id: 45,
    qid: `Q45`,
    qtype: `EFFICIENCY`,
    format: `mcq`,
    timestamp: `55:33`,
    question: `What determines the efficiency of rejection sampling?`,
    options: [`The dimensionality of the sampling space`, `The implementation of the random number generator`, `The complexity of the PDF being sampled`, `The proportion of rejected samples versus accepted ones`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [55:40], the professor discusses efficiency: "These are these red samples or definitely no more than half of the total samples so yeah we get a factor of no more than 2 wasted samples." When showing a more complex shape, he notes that rejection would be very inefficient because most samples would be rejected.`,
    code: ``,
    images: ["lec17_slide_30.png"],
    tags: ["Sampling/Rejection", "Efficiency"],
    source: `lectures/cg-17-lecture-quiz.md`,
  },
  {
    id: 46,
    qid: `Q46`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `56:26`,
    question: `According to the lecture, what is the fundamental trade-off when choosing between different sampling methods?`,
    options: [`Computational efficiency versus the accuracy of the integral estimate`, `Ease of implementation versus theoretical soundness`, `Accuracy versus simplicity`, `Speed versus memory usage`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [56:41], the professor concludes: "In terms of efficiency and ultimately if we think about applying this to Monte Carlo integration ultimately to how accurately we can estimate our integral for a given amount of computation right and that at the end of the day is what our whole game is. How do we improve the accuracy of our integral estimate as a function of how much work we do."
-`,
    code: ``,
    images: ["lec17_slide_30.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md`,
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

export default function Lec17Part2Quiz() {
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
    accent: '#818cf8', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec17'
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
    const p = Math.round(s / (14 || 1) * 100)
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
          <Hash size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 17: Numerical Integration — Part 2</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Quadrature, Monte Carlo integration, importance sampling</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-17-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec17/1`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec17/2`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 2</a>
          </div>
          <p style={{ color: C.accent, fontWeight: 600 }}>QQ33–QQ46 · 14 questions (14 graded + 0 open)</p>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>14</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Graded MCQ</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>0</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Open / Reveal</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>~4min</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Est. Time</div></div>
          </div>
        </div>

        <button style={btn({ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' })}
          onClick={() => { setScreen('quiz'); start() }}>
          <Hash size={20} /> Start Quiz
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
          <div style={{ fontSize: '1.2rem', color: C.muted, marginBottom: '0.75rem' }}>{score} / 14 MCQ correct</div>
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
              <Hash size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 17: Numerical Integration — Part 2</span>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', color: C.muted, fontSize: '0.875rem', alignItems: 'center' }}>
              <span><Clock size={14} style={{ display:'inline', verticalAlign:'middle', marginRight:'0.25rem' }} />{formatTime(t)}</span>
              <span>{qIdx+1}/14</span>
              <span style={{ color: C.accent }}>✓ {score}</span>
            </div>
          </div>
          <div style={{ height: '5px', background: C.border, borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.round((qIdx+1)/14*100)}%`, background: C.accent, transition: 'width 0.3s' }} />
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-17-lecture-quiz.md.</p>
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
              {qIdx < 14-1 ? 'Next Question' : 'View Results'} <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
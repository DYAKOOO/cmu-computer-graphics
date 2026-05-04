'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Crosshair } from 'lucide-react'

// Source: lectures/cg-18-lecture-quiz.md.md  (symlinked → Logseq pages)
// Lecture 18: Monte Carlo Ray Tracing — Part 2 · QQ30–QQ46 · 17 questions (17 MCQ, 0 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-18-lecture-quiz.md.md 18

const quizData = [
  {
    id: 30,
    qid: `Q30`,
    qtype: `STRATEGY`,
    format: `mcq`,
    timestamp: `34:14`,
    question: `When importance sampling a BRDF, where should samples be concentrated?`,
    options: [`Primarily in shadow regions`, `Only in the specular reflection direction`, `Uniformly across the hemisphere`, `Around the lobe where most light is scattered`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [34:14], the lecturer states: "I really shouldn't waste time putting a lot of samples where there's essentially no reflection occurring where nothing is getting contributed to the integral I should really try to lump all of my samples around this lobe of the brdf where all the light is getting scattered out."
- # Monte Carlo Rendering Quiz - Part 3
- ## QUESTIONS (continued):`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 31,
    qid: `Q31`,
    qtype: `VISUAL`,
    format: `mcq`,
    timestamp: `53:15`,
    question: `What was the key improvement when using light source sampling instead of uniform hemisphere sampling?`,
    options: [`The image had better color accuracy`, `The image had much less noise with the same number of samples`, `The image rendered much faster`, `The image had improved shadow detail`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [53:23], the lecturer observes: "Here we're doing the exact same scene we're using the same number of sample rays just a hundred sample rays per pixel per point on the plane but the image is way smoother."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 32,
    qid: `Q32`,
    qtype: `EFFICIENCY`,
    format: `mcq`,
    timestamp: `54:55`,
    question: `According to the lecture, what two factors determine the efficiency of a Monte Carlo estimator?`,
    options: [`Convergence rate and memory usage`, `Speed and accuracy`, `Sample count and distribution type`, `Variance and cost`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [55:08]: "Efficiency is basically inversely proportional to both the variance of the estimator... but also you need to care about the cost... you do have to balance these things variance from end cost."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 33,
    qid: `Q33`,
    qtype: `SAMPLING`,
    format: `mcq`,
    timestamp: `56:24`,
    question: `What is the purpose of cosine weighted sampling?`,
    options: [`To allocate more samples to directions where cosine theta is large`, `To reduce the total number of samples needed`, `To allocate more samples to directions that contribute less to the integral`, `To eliminate the need for light source sampling`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [58:53], the lecturer states: "Why cosine theta well we want to say if the angle is shallow if the angle is small we want to sample there less if theta is close to zero it's close to the normal direction we want to sample they're more."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 34,
    qid: `Q34`,
    qtype: `PROBABILITY`,
    format: `mcq`,
    timestamp: `57:54`,
    question: `In the cosine weighted sampling implementation, what is the new probability density function?`,
    options: [`cosine theta / π`, `cosine² theta / π`, `cosine theta / 2π`, `1 / 2π`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [58:47]: "Our probability distribution let's let's try using one that looks like cosine theta over PI."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 35,
    qid: `Q35`,
    qtype: `SIMPLIFICATION`,
    format: `mcq`,
    timestamp: `59:18`,
    question: `What happens to the estimator when using cosine weighted sampling?`,
    options: [`It remains the same as with uniform sampling`, `It requires additional normalization`, `The cosine terms cancel out, making it simpler`, `It becomes more complex with additional terms`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [59:41], the lecturer explains: "Now actually interestingly enough our important sampling strategy is even simpler than our original estimator now we're just can do PI over n times the sum of the incident radiance."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 36,
    qid: `Q36`,
    qtype: `ILLUMINATION`,
    format: `mcq`,
    timestamp: `1:00:54`,
    question: `What type of illumination is discussed after direct lighting techniques?`,
    options: [`Volumetric illumination`, `Ambient illumination`, `Caustic illumination`, `Indirect illumination`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer introduces at [1:00:54]: "So far we've considered light coming from light sources just scattered once meaning it comes from the light source it hits a surface like our plane and then it bounces into our eyeball or into the camera how can we go further."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 37,
    qid: `Q37`,
    qtype: `ALGORITHM`,
    format: `mcq`,
    timestamp: `1:02:13`,
    question: `What algorithm is described for estimating the radiance values from the rendering equation?`,
    options: [`Photon mapping`, `Bidirectional path tracing`, `Metropolis light transport`, `Path tracing`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [1:02:13]: "Because the rendering equation is recursive we're also going to have a recursive algorithm for estimating the radiance values that come out of the rendering equation and this algorithm is called path tracing."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 38,
    qid: `Q38`,
    qtype: `APPROACH`,
    format: `mcq`,
    timestamp: `1:04:03`,
    question: `What unusual sampling approach is used in the recursive path tracing algorithm?`,
    options: [`Using exactly 16 samples at each bounce point`, `Using only one sample (ray) at each bounce point`, `Using samples only in the specular direction`, `Using a variable number of samples based on surface reflectivity`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:04:15], the lecturer explains: "Usually we're gonna just do a single sample we want to estimate this whole integral but at a given moment we're just gonna trace one ray we're gonna follow one incoming direction back towards the point that it came from."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 39,
    qid: `Q39`,
    qtype: `VISUALIZATION`,
    format: `mcq`,
    timestamp: `1:05:05`,
    question: `What became visible in shadow areas when single-bounce indirect illumination was added?`,
    options: [`Shadow areas became completely black`, `Caustic patterns appeared in the shadows`, `Nothing changed in shadow areas`, `Objects previously hidden in shadow became visible`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer points out at [1:05:45]: "What do you notice here you notice that things that were previously in shadow well they actually weren't in shadow right if you were really there you'd see all the hidden stuff because you'd have this indirect illumination."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 40,
    qid: `Q40`,
    qtype: `MATERIAL`,
    format: `mcq`,
    timestamp: `1:06:20`,
    question: `What material property was revealed when increasing from two to four light bounces?`,
    options: [`The lanterns were made of glass`, `The lanterns were made of plastic`, `The lanterns were made of paper`, `The lanterns were made of metal`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:06:25], the lecturer observes: "If we now go from two bounces to let's say four balances Wow okay that made a big difference look at the top of the image right what we actually see now is that thing that used to look black we realize is actually glass."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 41,
    qid: `Q41`,
    qtype: `CHALLENGE`,
    format: `mcq`,
    timestamp: `1:07:36`,
    question: `What challenge arises when determining how many bounces to trace in a path tracing algorithm?`,
    options: [`It's difficult to know if you've captured all important light paths`, `Longer paths increase memory usage exponentially`, `The algorithm becomes unstable with more than 16 bounces`, `GPUs cannot handle more than 8 bounces efficiently`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer asks at [1:07:36]: "At some point you say okay I think I've done a good job of exploring the space of paths and I'm sending out a lots of rays and I think that I've captured all the important illumination in this scene but how do you know."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 42,
    qid: `Q42`,
    qtype: `TECHNIQUE`,
    format: `mcq`,
    timestamp: `1:08:47`,
    question: `What technique is introduced to probabilistically terminate ray paths?`,
    options: [`Path pruning`, `Depth clamping`, `Russian Roulette`, `Importance culling`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [1:08:03]: "A strategy that is more principled is something called Russian roulette."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 43,
    qid: `Q43`,
    qtype: `PRINCIPLE`,
    format: `mcq`,
    timestamp: `1:10:33`,
    question: `Why is randomized path termination used instead of simply discarding low-contribution paths?`,
    options: [`To ensure the estimator remains unbiased`, `To make the algorithm run faster`, `To improve visual quality in dark areas`, `To reduce memory usage`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:10:33], the lecturer explains: "So instead we're going to again use randomness to help us out and say we're going to randomly discard low contribution samples in a way that leaves this estimator unbiased."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 44,
    qid: `Q44`,
    qtype: `RESULTS`,
    format: `mcq`,
    timestamp: `1:12:12`,
    question: `What happens to rendering time and image quality when using Russian Roulette?`,
    options: [`Rendering time increases while noise decreases`, `Both rendering time and noise decrease`, `Both rendering time and noise increase`, `Rendering time decreases while noise increases`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer observes at [1:13:41]: "So what you notice each time is the amount of time it took goes down the amount of noise goes up."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 45,
    qid: `Q45`,
    qtype: `BALANCE`,
    format: `mcq`,
    timestamp: `1:13:48`,
    question: `What balance must be considered when using variance reduction techniques?`,
    options: [`Memory usage versus computational complexity`, `Algorithm simplicity versus implementation complexity`, `Efficiency versus accuracy`, `CPU versus GPU utilization`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:13:48], the lecturer states: "As with all variance reduction strategies this is something where you need to figure out what's the right balance between efficiency and accuracy."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 46,
    qid: `Q46`,
    qtype: `PREVIEW`,
    format: `mcq`,
    timestamp: `1:15:16`,
    question: `What topic does the lecturer preview for the next lecture?`,
    options: [`Variance reduction techniques`, `Animation with Monte Carlo rendering`, `GPU acceleration for ray tracing`, `Advanced material models`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer concludes at [1:15:16]: "Next time we're going to talk more generally about this question of variance reduction how do we get the most out of our samples and how can we go beyond the basic important sampling strategies that we talked about this time."
-`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
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

export default function Lec18Part2Quiz() {
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
    accent: '#fb7185', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec18'
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
    const p = Math.round(s / (17 || 1) * 100)
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
          <Crosshair size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 18: Monte Carlo Ray Tracing — Part 2</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Path tracing, direct/indirect lighting, BRDF sampling</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-18-lecture-quiz.md.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec18/1`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec18/2`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 2</a>
          </div>
          <p style={{ color: C.accent, fontWeight: 600 }}>QQ30–QQ46 · 17 questions (17 graded + 0 open)</p>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>17</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Graded MCQ</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>0</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Open / Reveal</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>~5min</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Est. Time</div></div>
          </div>
        </div>

        <button style={btn({ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' })}
          onClick={() => { setScreen('quiz'); start() }}>
          <Crosshair size={20} /> Start Quiz
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
          <div style={{ fontSize: '1.2rem', color: C.muted, marginBottom: '0.75rem' }}>{score} / 17 MCQ correct</div>
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
              <Crosshair size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 18: Monte Carlo Ray Tracing — Part 2</span>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', color: C.muted, fontSize: '0.875rem', alignItems: 'center' }}>
              <span><Clock size={14} style={{ display:'inline', verticalAlign:'middle', marginRight:'0.25rem' }} />{formatTime(t)}</span>
              <span>{qIdx+1}/17</span>
              <span style={{ color: C.accent }}>✓ {score}</span>
            </div>
          </div>
          <div style={{ height: '5px', background: C.border, borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.round((qIdx+1)/17*100)}%`, background: C.accent, transition: 'width 0.3s' }} />
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-18-lecture-quiz.md.md.</p>
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
              {qIdx < 17-1 ? 'Next Question' : 'View Results'} <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
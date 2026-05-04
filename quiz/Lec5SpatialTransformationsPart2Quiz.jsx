'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Move } from 'lucide-react'

// Source: lectures/cg-05-lecture-quiz.md.md  (symlinked → Logseq pages)
// Lecture 5: Spatial Transformations — Part 2 · QQ33–QQ47 · 15 questions (15 MCQ, 0 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-05-lecture-quiz.md.md 5

const quizData = [
  {
    id: 33,
    qid: `Q33`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `54:38`,
    question: `- [Translation Verification] → [Mathematical confirmation]`,
    options: [`It becomes (cx,cy,c+1)`, `It becomes (cx+c,cy+c,c)`, `It becomes (cx+cu,cy+cv,c)`, `It becomes (cx+u,cy+v,c)`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `As shown at [54:47]: "The homogeneous coordinates p hat from our original point cp1 cp2c then become cp1 plus cu1 cp2 plus cu2 c right for all nonzero c."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 34,
    qid: `Q34`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `55:50`,
    question: `- [Homogeneous Translation—Matrix Representation] → [Matrix form]`,
    options: [`[[1, 0, 0], [0, 1, 0], [u₁, u₂, 1]]`, `[[1, 0, 0], [0, 1, 0], [0, 0, 1]] +`, `[[1, 0, u₁], [0, 1, u₂], [0, 0, 1]]`, `[[u₁, 0, 0], [0, u₂, 0], [0, 0, 1]]`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `As described at [56:30]: "So we're going to end up with a matrix that looks like this it looks like well the identity matrix plus some stuff in the upper right which is our displacement vector u1 u2." This corresponds to the matrix .`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 35,
    qid: `Q35`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `57:22`,
    question: `- [Other Transformations] → [Converting all transformations to homogeneous]`,
    options: [`As a 3D rotation that fixes the z-axis`, `As a completely different type of transformation`, `As a 2×2 rotation with an added row and column of zeros`, `As a 3D rotation around the origin`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `As stated at [57:57]: "So performing a two-dimensional rotation of our original shape is going to be equivalent to rotating that whole collection of shapes around the x3 axis and so we can express a 2d rotation as just a 3d rotation that fixes the vertical axis."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 36,
    qid: `Q36`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `59:09`,
    question: `- [3D Transformations in Homogeneous Coordinates] → [Extension to 3D]`,
    options: [`By using complex matrices instead of real matrices`, `By adding new transformation types specific to 3D`, `By appending one homogeneous coordinate to the 3D coordinates`, `By converting to quaternions for all 3D operations`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `As explained at [59:09]: "Not much changes in three dimensions or even in more dimensions we're always just going to append one homogeneous coordinate to the first three to the first n."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 37,
    qid: `Q37`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `1:00:15`,
    question: `- [Points vs. Vectors] → [Homogeneous coordinate choice]`,
    options: [`Points use integer coordinates, vectors use fractional coordinates`, `Points use Cartesian coordinates, vectors use polar coordinates`, `Points have non-zero homogeneous coordinate, vectors have zero`, `Points have positive homogeneous coordinate, vectors have negative`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `As stated at [1:03:01]: "In general a point will have a non-zero homogeneous coordinate for instance c equal to one and a vector will have a zero homogeneous coordinate for instance c equal to zero."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 38,
    qid: `Q38`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `1:03:08`,
    question: `- [Infinity Interpretation] → [Zero homogeneous coordinates]`,
    options: [`The point approaches infinity in the direction of the other coordinates`, `The point moves toward the origin`, `The point's coordinates become unstable`, `The point becomes undefined`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `As explained at [1:03:33]: "If we divide by a much much smaller number then they start shooting off toward infinity right and kind of the limit is that these vectors become points at infinity or what are sometimes called ideal points."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 39,
    qid: `Q39`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `1:04:42`,
    question: `- [Perspective Projection] → [Using homogeneous coordinates]`,
    options: [`By zeroing out the z-coordinate`, `By multiplying all coordinates by the z value`, `By setting the homogeneous coordinate to 1`, `By copying the z-coordinate into the homogeneous coordinate`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `As described at [1:05:27]: "We can build a matrix that just copies the z coordinate into the homogeneous coordinates something like this."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 40,
    qid: `Q40`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `1:06:20`,
    question: `- [Rasterization Pipeline] → [Transforming to screen coordinates]`,
    options: [`Converting projected coordinates to pixel coordinates, including y-axis flip`, `Normalizing all coordinates to the range [0,1]`, `Applying gamma correction to the coordinates`, `Converting to polar coordinates`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `As explained at [1:07:19]: "You should be careful by the way that in one coordinate system y points up and in another coordinate system y points down... in computer graphics images are often indexed in a way where you start at the top left and go down as y increases." This means converting to pixel coordinates includes a y-axis flip.`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 41,
    qid: `Q41`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `1:08:12`,
    question: `- [Scene Graph] → [Organizing hierarchical transformations]`,
    options: [`It allows transformations on parent objects to automatically affect their children`, `It reduces the number of transformations needed`, `It ensures all transformations are linear`, `It makes rendering faster`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `As explained at [1:09:21]: "The good thing about this is now if we go back and we transform the body right we want to just move the body left and right well then the upper arm and lower arm are going to go along with it we don't have to go and figure out what the new transformations for those parts of the body are."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 42,
    qid: `Q42`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `1:09:34`,
    question: `- [Scene Graph Implementation] → [Structure and operation]`,
    options: [`Collision detection information`, `The geometric mesh data`, `The rendering properties like materials`, `A linear transformation as a matrix`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `As stated at [1:09:34]: "A scene graph in general stores relative transformations in a directed graph right so each edge of this graph and the root node stores some linear transformation as a four by four matrix."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 43,
    qid: `Q43`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `1:11:32`,
    question: `- [Scene Graph Content] → [Models, lights, and instancing]`,
    options: [`Efficiently representing many copies of the same object with different transformations`, `Creating animated transformations`, `Reducing the complexity of individual objects`, `Adding lighting effects to objects`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `As explained at [1:11:54]: "Rather than actually having literally multiple copies of the geometry in memory in your in your computer what you can do is you can just put a pointer in the scene graph that says okay i want to draw a copy of this object but i'm going to do it with a different transformation than i did before."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 44,
    qid: `Q44`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `1:13:02`,
    question: `- [Order of Operations] → [Transformation sequence importance]`,
    options: [`Only the orientation changes`, `The scale factor is affected but not the position`, `Nothing, they commute with each other`, `The final position changes because the translation gets scaled in one case`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `As demonstrated at [1:13:20]: "If i first scale it by a half and then translate it by 3 1 i end up with a square that's size 1 on each side and has its lower left corner at the point 3 1. if on the other hand i reverse these operations and i first translate by 3 1 and then scale by one half well i get a square that has the same size it's still size 1 on each side but the lower left corner is now at 1.5 0.5." The lecturer explains at [1:13:53]: "By putting the scale second i kind of scaled my initial translation down."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 45,
    qid: `Q45`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `1:14:49`,
    question: `- [Rotation Around Center] → [Common transformation pattern]`,
    options: [`Rotate directly using a specialized matrix`, `Apply shear, rotate, apply inverse shear`, `Translate to origin, rotate, translate back`, `Scale by half, rotate, scale by two`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `As described at [1:15:16]: "What i'm going to do is i'm going to first translate it by minus x so that it's centered at the origin then i'm going to rotate by some angle theta and then i'm going to put it back i'm going to translate back by x to its original center."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 46,
    qid: `Q46`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `1:15:52`,
    question: `- [Putting It All Together] → [Complete transformation pipeline]`,
    options: [`By changing the field of view of the camera`, `By modifying the perspective projection matrix`, `By directly moving the camera through the scene`, `By applying the inverse transformation to the objects in the scene`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `As explained at [1:16:16]: "We're going to apply additional 3d transformations to position our camera actually what we're going to do is we're going to simulate the motion of the camera by applying the inverse transformation to the cube creature if we want the camera to move left we translate the creature right and so forth."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 47,
    qid: `Q47`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `1:17:33`,
    question: `- [Summary] → [Key concepts review]`,
    options: [`They allow clearly distinguishing between points and vectors`, `They reduce the memory needed for transformations`, `They make all calculations faster`, `They simplify the implementation of perspective projection`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `As summarized at [1:18:01]: "We also saw that homogeneous coordinates are super cool and useful because they let us clearly distinguish between points and vectors."
-`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
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

export default function Lec5Part2Quiz() {
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
    accent: '#f59e0b', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec5'
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
    const p = Math.round(s / (15 || 1) * 100)
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
          <Move size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 5: Spatial Transformations — Part 2</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Linear maps, homogeneous coords, rotation, translation</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-05-lecture-quiz.md.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec5/1`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec5/2`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 2</a>
          </div>
          <p style={{ color: C.accent, fontWeight: 600 }}>QQ33–QQ47 · 15 questions (15 graded + 0 open)</p>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>15</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Graded MCQ</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>0</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Open / Reveal</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>~5min</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Est. Time</div></div>
          </div>
        </div>

        <button style={btn({ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' })}
          onClick={() => { setScreen('quiz'); start() }}>
          <Move size={20} /> Start Quiz
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
          <div style={{ fontSize: '1.2rem', color: C.muted, marginBottom: '0.75rem' }}>{score} / 15 MCQ correct</div>
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
              <Move size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 5: Spatial Transformations — Part 2</span>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', color: C.muted, fontSize: '0.875rem', alignItems: 'center' }}>
              <span><Clock size={14} style={{ display:'inline', verticalAlign:'middle', marginRight:'0.25rem' }} />{formatTime(t)}</span>
              <span>{qIdx+1}/15</span>
              <span style={{ color: C.accent }}>✓ {score}</span>
            </div>
          </div>
          <div style={{ height: '5px', background: C.border, borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.round((qIdx+1)/15*100)}%`, background: C.accent, transition: 'width 0.3s' }} />
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-05-lecture-quiz.md.md.</p>
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
              {qIdx < 15-1 ? 'Next Question' : 'View Results'} <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
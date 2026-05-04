'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Film } from 'lucide-react'

// Source: lectures/cg-20-lecture-quiz.md.md  (symlinked → Logseq pages)
// Lecture 20: Introduction to Animation — Part 2 · QQ30–QQ48 · 19 questions (19 MCQ, 0 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-20-lecture-quiz.md.md 20

const quizData = [
  {
    id: 30,
    qid: `Q30`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `24:46`,
    question: `- [Cubic Splines] → [Special properties]`,
    options: [`They're the only type that can represent circles`, `They give exact solutions to the elastic spline problem under small displacements`, `According to the lecture, why are cubic splines particularly useful in computer graphics?`, `They use the fewest control points`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [25:00], Professor Crane explains: "One reason is that piecewise cubic splines give exact solutions to the elastic spline problem under the assumption of small displacements."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 31,
    qid: `Q31`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `27:52`,
    question: `- [Runge Phenomenon] → [Problem with high-degree polynomials]`,
    options: [`The computational challenges in solving high-degree polynomial equations`, `The tendency of high-degree polynomials to oscillate wildly near the endpoints`, `What is the Runge Phenomenon as described in the lecture?`, `The difficulty in finding roots of high-degree polynomials`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [28:47], Professor Crane describes: "As I go up I noticed that near the endpoints I get these these oscillations and they kind of get you know wilder and weirder as they go on even though overall my function is doing a better job at zero of approximating the target function."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 32,
    qid: `Q32`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `29:28`,
    question: `- [Cubic Polynomial Fitting] → [Endpoint constraints]`,
    options: [`4`, `When fitting a cubic polynomial to interpolate two endpoints, how many degrees of freedom (coefficients) does the polynomial have?`, `6`, `3`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [29:33], Professor Crane states: "Let's consider a single cubic polynomial P of T equals 80 cubed plus BT squared plus C T plus D" which shows four coefficients (A, B, C, D), and at [31:14] he confirms: "Cubic polynomial has these four degrees of freedom ABCD."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 33,
    qid: `Q33`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `41:35`,
    question: `- [Spline Properties] → [Three key characteristics]`,
    options: [`Interpolation, continuity, and locality`, `Flexibility, simplicity, and robustness`, `According to the lecture, what are the three key properties of splines that are discussed?`, `Parameterization, controllability, and convergence`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [41:35], Professor Crane explicitly lists these three properties: "We've talked about one key property already is interpolation"; at [41:43] "We've kind of talked about continuity also"; and at [42:15] "Another property that turns out to be pretty important and useful in practice is locality."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 34,
    qid: `Q34`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `44:04`,
    question: `- [Natural Spline Locality] → [System coupling]`,
    options: [`They use complex mathematical formulas`, `They require extensive computational resources`, `Why do natural splines lack the property of locality according to the lecture?`, `All equations are coupled and must be solved together as a system`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [44:04], Professor Crane explains: "The thing to think about here is that we have this big collection of 4n linear equations and all these equations are coupled meaning I kind of have to solve them all at once I couldn't just go in and solve one of those equations by itself or four of those equations by itself they are all interacting in some way."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 35,
    qid: `Q35`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `45:26`,
    question: `- [Bezier Splines] → [Control point approach]`,
    options: [`As linear combinations of Bernstein polynomials`, `As roots of polynomial equations`, `As parametric curves defined by derivatives`, `How does Professor Crane describe Bezier splines in terms of their mathematical foundation?`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [45:26], Professor Crane states: "We said busy splines or linear combinations of what are called the Bernstein polynomials."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 36,
    qid: `Q36`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `47:22`,
    question: `- [Bezier Applications] → [Practical uses]`,
    options: [`Medical imaging and architectural design`, `Which practical applications of Bezier curves does the professor highlight?`, `3D character animation and facial expressions`, `2D vector art in illustration programs and file formats like SVG, PDF, and fonts`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [47:22], Professor Crane mentions: "These curves Bezier curves are commonly used very commonly used for 2d vector art any kind of illustration program you use is going to be using busy occurs all the kind of standard file formats SVG PDF font formats are using very busy curves."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 37,
    qid: `Q37`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `48:34`,
    question: `- [Bezier Spline Properties] → [Mathematical formulation]`,
    options: [`What are the two main constraints that define a Bezier curve according to the mathematical formulation in the lecture?`, `Curvature and torsion`, `Derivatives and integrals`, `Control points and weights`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [48:34], Professor Crane explains: "When we have a Bezier curve we want the endpoints to interpolate the data... And we also want tangents to interpolate some given data."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 38,
    qid: `Q38`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `50:33`,
    question: `- [Bezier Property Analysis] → [Two property satisfaction]`,
    options: [`Interpolation and locality`, `Which two of the three key spline properties does a Bezier spline satisfy according to the lecture?`, `Parameterization and controllability`, `Continuity and locality`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [50:33], Professor Crane confirms interpolation: "Does it have interpolation well yeah by definition," and at [51:02] he confirms locality: "Does it have locality well sure," but at [52:14] he notes it lacks C2 continuity: "What about C 2 continuity does this curve have nice acceleration well no we didn't say anything about the second derivative."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 39,
    qid: `Q39`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `52:46`,
    question: `- [Catmull-Rom Splines] → [Position-based tangents]`,
    options: [`They require fewer control points`, `They are more computationally efficient`, `What is the key feature that makes Catmull-Rom splines different from standard Bezier splines?`, `They have higher continuity at the connection points`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [53:44], Professor Crane explains: "I only know the data points nobody's provided me with any tangents so I'm just gonna use the difference between the positions of neighbors to decide what my tangent should look like."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 40,
    qid: `Q40`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `55:27`,
    question: `- [Spline Property Comparison] → [The trade-off table]`,
    options: [`Ease of implementation versus mathematical complexity`, `You cannot simultaneously have all three properties (interpolation, continuity, and locality)`, `Higher-order continuity versus computational cost`, `According to the "no free lunch" principle described in the lecture, what is the fundamental trade-off when choosing spline types?`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [45:08], Professor Crane explicitly states: "What we're gonna discover is there's really no free lunch with cubic splines we can't simultaneously get all three properties interpolation continuity and locality," which he reinforces at [1:00:07]: "The point of this table is to say when it comes to splines there's no free lunch there's always some property that you have to give up on."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 41,
    qid: `Q41`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `56:14`,
    question: `- [B-Splines] → [Control without interpolation]`,
    options: [`Interpolation and continuity at the expense of locality`, `Which two properties does a B-spline prioritize at the expense of the third property?`, `Parameterization and flexibility at the expense of efficiency`, `Continuity and locality at the expense of interpolation`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [59:42], Professor Crane states: "For cubic b-spline curves these are going to be C 2 continuous by construction they're going to be local by construction because we're just adjusting coefficients in some basis but they're not going to have the interpolation property."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 42,
    qid: `Q42`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `59:42`,
    question: `- [B-Spline Properties] → [The third option]`,
    options: [`The control points only influence the shape indirectly`, `Why don't B-splines interpolate the control points according to the lecture?`, `They are designed for approximation rather than interpolation`, `There's nothing in their construction that guarantees they would pass through the data points`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:00:01], Professor Crane explains: "There's nothing in this construction that guaranteed they would exactly pass through the given values."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 43,
    qid: `Q43`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `1:01:05`,
    question: `- [Animation Data] → [What we interpolate]`,
    options: [`Only numerical data types`, `According to the lecture, what types of data can be interpolated for animation purposes?`, `Any attribute including positions, orientations, colors, and other properties`, `Only positions and rotations`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [20:28], Professor Crane explains: "In general the events don't just have to be positions I can actually interpolate any attribute I like I could interpolate colors or light intensities or camera locations camera zooms various geometric transformations and so forth," which he reinforces in this section.`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 44,
    qid: `Q44`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `1:03:42`,
    question: `- [Inverse Kinematics] → [Goal-oriented animation]`,
    options: [`To specify goal positions for end effectors rather than setting all joint angles manually`, `To reduce computational requirements`, `What is the primary goal of inverse kinematics according to the lecture?`, `To speed up the animation process`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:04:15], Professor Crane explains: "What I'd like to say is please put the hand here at time 1 and somewhere else at time 2 and then go ahead and figure out automatically how I should set all those other joint angles all those other degrees of freedom."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 45,
    qid: `Q45`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `1:04:50`,
    question: `- [Skeletal Animation] → [Organic deformation]`,
    options: [`What fundamental concept underlies skeletal animation according to the lecture?`, `Using keyframes to define character poses`, `Having a rigid skeleton underneath that drives the organic deformation of the mesh`, `Mapping motion capture data to a character`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:05:16], Professor Crane explains: "The secret is that under the skin you still have kind of a rigid skeleton you have a collection of rigid pieces these bones that you can see in the image on the left and those get transformed in the usual way... that skeleton then drives the configuration of the character."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 46,
    qid: `Q46`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `1:06:11`,
    question: `- [Linear Blend Skinning] → [Mesh deformation]`,
    options: [`By morphing between predefined shapes`, `By using procedural noise functions`, `How does linear blend skinning deform a mesh according to the lecture?`, `By applying a weighted linear combination of bone transformations to each vertex`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:06:11], Professor Crane describes: "To then transform the vertices of the mesh I might take let's say a linear combination of all those transformations so for each bone that affects that vertex of the mesh I apply the bones transformation to that vertex I get a bunch of different expositions and I add them all up and average them to get this deformed location."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 47,
    qid: `Q47`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `1:07:00`,
    question: `- [Blend Shapes] → [Pose interpolation]`,
    options: [`The bone transformations`, `The texture coordinates`, `In the context of blend shapes, what does the professor say is being interpolated by splines?`, `The coefficients that determine how much of each basic pose is used`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:07:21], Professor Crane states: "Where do the splines come in well the splines are interpolating the coefficients in this linear combination so I have a function that represents how happy am I over time I have a function that represents how sad I am over time each of those is represented by a spline."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 48,
    qid: `Q48`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `1:07:52`,
    question: `- [Conclusion] → [Preview of next lectures]`,
    options: [`Keyframing and character rigging`, `Skeletal animation and blend shapes`, `Motion capture and physically-based simulation`, `What two animation techniques does Professor Crane preview for future lectures?`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:08:04], Professor Crane states: "What we're gonna see in our next few lectures is how other modes of animation can really help to reduce the amount of effort we're gonna look at how we can use data acquire things from let's say motion capture and also how we can use physical simulation."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
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

export default function Lec20Part2Quiz() {
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
    accent: '#34d399', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec20'
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
    const p = Math.round(s / (19 || 1) * 100)
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
          <Film size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 20: Introduction to Animation — Part 2</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Keyframing, Splines, Hermite/Catmull-Rom/B-Splines, Skeletal Animation</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-20-lecture-quiz.md.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec20/1`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec20/2`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 2</a>
          </div>
          <p style={{ color: C.accent, fontWeight: 600 }}>QQ30–QQ48 · 19 questions (19 graded + 0 open)</p>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>19</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Graded MCQ</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>0</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Open / Reveal</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>~6min</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Est. Time</div></div>
          </div>
        </div>

        <button style={btn({ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' })}
          onClick={() => { setScreen('quiz'); start() }}>
          <Film size={20} /> Start Quiz
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
          <div style={{ fontSize: '1.2rem', color: C.muted, marginBottom: '0.75rem' }}>{score} / 19 MCQ correct</div>
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
              <Film size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 20: Introduction to Animation — Part 2</span>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', color: C.muted, fontSize: '0.875rem', alignItems: 'center' }}>
              <span><Clock size={14} style={{ display:'inline', verticalAlign:'middle', marginRight:'0.25rem' }} />{formatTime(t)}</span>
              <span>{qIdx+1}/19</span>
              <span style={{ color: C.accent }}>✓ {score}</span>
            </div>
          </div>
          <div style={{ height: '5px', background: C.border, borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.round((qIdx+1)/19*100)}%`, background: C.accent, transition: 'width 0.3s' }} />
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-20-lecture-quiz.md.md.</p>
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
              {qIdx < 19-1 ? 'Next Question' : 'View Results'} <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
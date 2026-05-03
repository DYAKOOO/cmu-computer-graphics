'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Search } from 'lucide-react'

// Source: lectures/cg-12-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 12: Geometric Queries — Part 2 · Q33–Q41 · 9 questions
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-12-lecture-quiz.md 12

const quizData = [
  {
    id: 33,
    timestamp: `42:04`,
    question: `What is the geometric meaning when a ray-sphere intersection equation has exactly one solution?`,
    options: [`The ray misses the sphere entirely`, `The ray passes through the center of the sphere`, `The ray is tangent to the sphere at a single point`, `The ray starts inside the sphere`],
    answer: 2,
    intuition: ``,
    explanation: `At [42:04] the lecturer states: "What does it mean if there's only one solution to this equation well there's something very very special that can happen which is the rate might just graze the sphere so rather than going in and then back out again it's just tangent to the sphere at a single point that's when the quadratic formula has only one solution."`,
    code: ``,
    images: ["lec12_slide_20.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 34,
    timestamp: `42:50`,
    question: `What does a negative t value signify in ray-object intersection calculations?`,
    options: [`The ray passes through the object's center`, `The ray misses the object entirely`, `The intersection point is in the opposite direction of the ray`, `The ray is inside the object`],
    answer: 2,
    intuition: ``,
    explanation: `At [42:57] the lecturer explains: "If T is negative that really is telling us that actually the Ray also doesn't hit the sphere at least not for that T value right it means I'm moving along a line that intersects the sphere but not for the half of the line that I care about."`,
    code: ``,
    images: ["lec12_slide_18.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 35,
    timestamp: `44:34`,
    question: `How is a plane implicitly described in the lecture?`,
    options: [`As a set of three points`, `As n^T x = C where n is the unit normal`, `As a parametric equation with two parameters`, `As the cross product of two vectors`],
    answer: 1,
    intuition: ``,
    explanation: `At [44:34] the lecturer says: "We say suppose we think of a plane as the set of all points X such that n transpose X is equal to C for some constant C n is again the unit normal C is some offset in the normal direction."`,
    code: ``,
    images: ["lec12_slide_20.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 36,
    timestamp: `47:12`,
    question: `What is the geometric meaning when n^T D = 0 in a ray-plane intersection calculation?`,
    options: [`The ray originates from the plane`, `The ray passes through the origin`, `The ray is traveling parallel to the plane`, `The ray is perpendicular to the plane`],
    answer: 2,
    intuition: ``,
    explanation: `At [47:12] the lecturer describes: "A funny case for me is if the if the Ray is traveling parallel to the plane right so it's flying above the plane and it never never intersects the plane it's not getting closer and it's not getting further away."`,
    code: ``,
    images: ["lec12_slide_30.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 37,
    timestamp: `49:01`,
    question: `What two-step approach does the lecturer suggest for ray-triangle intersection?`,
    options: [`First test each vertex, then test each edge`, `First check if the ray intersects the plane of the triangle, then check if the hit point is inside the triangle`, `First conduct a bounding box test, then do detailed intersection`, `First check if the ray is facing the triangle, then compute the intersection`],
    answer: 1,
    intuition: ``,
    explanation: `At [49:43] the lecturer explains: "Maybe a first good step for finding a ray triangle intersection is to just first figure out where does the Ray intersect the plane containing the triangle... from there there's not a whole lot more to say."`,
    code: ``,
    images: ["lec12_slide_30.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 38,
    timestamp: `51:15`,
    question: `What method does the lecturer suggest for determining if a point is inside a triangle?`,
    options: [`Checking if the point is visible from all three vertices`, `Using the triangle's medians`, `Computing barycentric coordinates and checking if they're all positive`, `Measuring the area of the triangle with the point included`],
    answer: 2,
    intuition: ``,
    explanation: `At [51:15] the lecturer suggests: "So I compute the signed area of the three little triangles made by connecting the hit point this white point to the three vertices of the triangle I divide those signed areas by the area of the triangle and I get the Bary centric coordinates... if all the very central coordinates are positive if all of them are positive then it's a point in the Triangle."`,
    code: ``,
    images: ["lec12_slide_22.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 39,
    timestamp: `52:18`,
    question: `What problem-solving principle does the lecturer emphasize for geometric queries?`,
    options: [`Always create new algorithms for each problem`, `Reduce problems to smaller atomic problems you already know how to solve`, `Use analytical solutions instead of numerical approaches`, `Focus on memory efficiency over computational efficiency`],
    answer: 1,
    intuition: ``,
    explanation: `At [52:18] the lecturer states: "Try to think when you're doing computer graphics about whether you can reduce a problem you're about to solve to a smaller more atomic problem that you already know how to solve."`,
    code: ``,
    images: ["lec12_slide_20.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 40,
    timestamp: `52:52`,
    question: `Why is optimizing ray-triangle intersection so important in practice?`,
    options: [`Because triangles are difficult to represent in computers`, `Because photorealistic rendering requires millions of ray-triangle intersections`, `Because it's used in user interface design`, `Because game engines can only process a limited number of triangles`],
    answer: 1,
    intuition: ``,
    explanation: `At [52:52] the lecturer explains: "If you want to make photorealistic imagery here's a here's a beautiful shot from Pixar's Koko right this image is made by shooting Ray's around the scene millions and millions of rays that intersect with extremely complicated geometry."`,
    code: ``,
    images: ["lec12_slide_10.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 41,
    timestamp: `55:23`,
    question: `What recent hardware development has advanced ray tracing capabilities?`,
    options: [`Specialized CPU instruction sets`, `Dedicated ray tracing hardware in GPUs (RTX pipeline)`, `New RAM architectures`, `Multi-core processors`],
    answer: 1,
    intuition: ``,
    explanation: `At [55:23] the lecturer mentions: "Just in the last few years NVIDIA has started putting what's called our TX pipeline into their a ray tracing pipeline into their GPU hardware and so this has really enabled a lot of things that weren't possible before."
-`,
    code: ``,
    images: ["lec12_slide_10.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
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

export default function Lec12Part2Quiz() {
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
    accent: '#22d3ee',
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
          <Search size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 12: Geometric Queries — Part 2</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>BVH, ray-triangle intersection, closest point queries</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-12-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec12/1`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec12/2`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 2</a>
          </div>
          <p style={{ color: C.accent, fontWeight: 600 }}>Q33–Q41 · 9 questions</p>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>9</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Questions</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>~3min</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Est. Time</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>2</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Parts</div></div>
          </div>
        </div>

        <button style={btn({ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' })}
          onClick={() => { setScreen('quiz'); start() }}>
          <Search size={20} /> Start Quiz
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
              <Search size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 12: Geometric Queries — Part 2</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition written yet. Add a <code style={{ color: C.accent }}>- INTUITION:</code> block under this question in <code style={{ color: C.accent }}>lectures/cg-12-lecture-quiz.md</code>.</p>
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
              {qIdx < 9-1 ? 'Next Question' : 'View Results'} <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
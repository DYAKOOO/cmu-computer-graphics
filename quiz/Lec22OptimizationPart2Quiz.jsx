'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, TrendingDown } from 'lucide-react'

// Source: lectures/cg-22-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 22: Introduction to Optimization — Part 2 · Q33–Q53 · 21 questions
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-22-lecture-quiz.md 22

const quizData = [
  {
    id: 33,
    timestamp: `45:11`,
    question: `What condition does the first derivative test check for in identifying critical points?`,
    options: [`The second derivative is positive`, `The second derivative is negative`, `The first derivative equals zero`, `The function is bounded`],
    answer: 2,
    intuition: ``,
    explanation: `At [45:11], the professor explains: "We want to find points where the derivative of the function is equal to zero we want to find points x star where the derivative is equal to zero."`,
    code: ``,
    images: ["image_1777605050183_0.png", "lec22_slide_17.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md`,
  },
  {
    id: 34,
    timestamp: `46:26`,
    question: `What additional condition must be satisfied beyond having a zero first derivative for a point to be a local minimum?`,
    options: [`The second derivative must equal zero`, `The second derivative must be positive`, `The first derivative must be defined`, `The function must be bounded`],
    answer: 1,
    intuition: ``,
    explanation: `At [46:26], the professor states: "We also need to look at the second derivative we need a second derivative test in particular we want to make sure that the second derivative is positive right it has this convex behavior at the critical point."`,
    code: ``,
    images: ["image_1777605094021_0.png", "lec22_slide_17.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md`,
  },
  {
    id: 35,
    timestamp: `48:28`,
    question: `In multivariable calculus, what does the gradient of a function represent?`,
    options: [`The curvature of the function`, `The direction of steepest ascent`, `The second-order behavior`, `The volume under the function`],
    answer: 1,
    intuition: ``,
    explanation: `At [48:28], the professor explains: "The gradient of the funk grad F kind of describes the slope of the function or the direction of steepest ascent that was a good way of looking at it."`,
    code: ``,
    images: ["image_1777605332423_0.png", "lec22_slide_18.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md`,
  },
  {
    id: 36,
    timestamp: `49:18`,
    question: `What is the Hessian of a function?`,
    options: [`A vector of first derivatives`, `A matrix of second partial derivatives`, `A third-order tensor`, `The determinant of the Jacobian`],
    answer: 1,
    intuition: ``,
    explanation: `At [49:18], the professor defines: "The Hessian is our generalization of the second derivative to multi variable functions and the way you usually learn this is it's a big matrix of all possible second partial derivatives so if I have variables x1 through xn then I take the second derivative of F with respect to X1 and then X1 then I do it again with respect to X1 and X2 X1 and X3 and so forth."`,
    code: ``,
    images: ["image_1777605341768_0.png", "lec22_slide_18.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md`,
  },
  {
    id: 37,
    timestamp: `50:27`,
    question: `What are the necessary conditions for a point to be a local minimum of a twice-differentiable function?`,
    options: [`The gradient equals zero, and the Hessian is negative definite`, `The gradient equals zero, and the Hessian is positive definite`, `The gradient equals zero, and the Hessian is positive semi-definite`, `The gradient equals the identity matrix, and the Hessian is zero`],
    answer: 2,
    intuition: ``,
    explanation: `At [50:27], the professor states: "They really don't look any different once we've generalized the first and second derivative we say to be at a local minimum of a function f not as long as it is twice differentiable as long as we can define the gradient of the Hessian gradient imagine then we'll be at an optimal point if the gradient at that point is zero and if the Hessian of the point is positive semi-definite."`,
    code: ``,
    images: ["image_1777605346119_0.png", "lec22_slide_18.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md`,
  },
  {
    id: 38,
    timestamp: `52:34`,
    question: `For the "potato chip" function example with constraints, what did the professor note about the gradient at the global minima?`,
    options: [`The gradient equals zero`, `The gradient is perpendicular to the constraint surface`, `The gradient is not zero at these constrained minima`, `The gradient is tangent to the constraint surface`],
    answer: 2,
    intuition: ``,
    explanation: `At [52:45], the professor points out: "Is the gradient of the function zero at these black points? No right if I was standing at that point the direction of steepest ascent is taking me upward it's a non zero vector okay."`,
    code: ``,
    images: ["image_1777605427262_0.png", "lec22_slide_19.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md`,
  },
  {
    id: 39,
    timestamp: `53:44`,
    question: `What are the conditions that characterize constrained optimization problems?`,
    options: [`Euler-Lagrange equations`, `Karush-Kuhn-Tucker (KKT) conditions`, `Bellman equations`, `Hamilton-Jacobi equations`],
    answer: 1,
    intuition: ``,
    explanation: `At [53:44], the professor states: "In general any local or global minimizer must satisfy the so called Karush-Kuhn-Tucker conditions or what people always abbreviate as the KKT conditions."`,
    code: ``,
    images: ["image_1777605512302_0.png", "lec22_slide_19.png"],
    tags: ["KKTConditions"],
    source: `lectures/cg-22-lecture-quiz.md`,
  },
  {
    id: 40,
    timestamp: `55:28`,
    question: `According to the professor, which property makes convex optimization problems generally easier to solve?`,
    options: [`They always have a feasible region`, `They can be solved in polynomial time`, `They have unique global minima`, `They can all be reduced to linear programming`],
    answer: 1,
    intuition: ``,
    explanation: `At [55:28], the professor explains: "Convex problems are a special class of problems that are almost always easy to solve in polynomial time."`,
    code: ``,
    images: ["image_1777605650078_0.png", "lec22_slide_20.png"],
    tags: ["ConvexOptimization"],
    source: `lectures/cg-22-lecture-quiz.md`,
  },
  {
    id: 41,
    timestamp: `56:29`,
    question: `How do you test whether a set is convex?`,
    options: [`Check that the boundary has continuous derivatives`, `Verify that any line segment between two points in the set lies entirely within the set`, `Confirm that the set contains the origin`, `Test if the set is symmetric about some axis`],
    answer: 1,
    intuition: ``,
    explanation: `At [56:29], the professor describes: "How do I know it's convex how do I test whether whether or not a set is convex the basic idea is I should be able to if it's convex I should be able to take any two points inside the set and connect them by a straight line segment that doesn't leave that set."`,
    code: ``,
    images: ["image_1777605660443_0.png", "lec22_slide_20.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md`,
  },
  {
    id: 42,
    timestamp: `57:25`,
    question: `How do you test whether a function is convex?`,
    options: [`The function must be differentiable everywhere`, `The function must be bounded`, `Any line segment between two points on the graph must lie above the graph`, `The function must have a unique minimum`],
    answer: 2,
    intuition: ``,
    explanation: `At [57:25], the professor explains: "What does it mean for a objective or a function to be convex kind of a similar idea if I look at the graph of the function here it is graph of f of X and I take any two points and connect them by straight line segment I want that line segment to be above the graph of the function for all possible pairs of points."`,
    code: ``,
    images: ["image_1777605669728_0.png", "lec22_slide_20.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md`,
  },
  {
    id: 43,
    timestamp: `58:16`,
    question: `What key benefit of convex optimization problems did the professor highlight in terms of initial guesses?`,
    options: [`They work with any initial guess and still reach the global optimum`, `They require fewer initial guesses than non-convex problems`, `The initial guess doesn't affect the computation time`, `The initial guess must be within the feasible region`],
    answer: 0,
    intuition: ``,
    explanation: `At [58:31], the professor states: "Because we don't have little local minima all over the place we know that the result we get won't depend on finding a good initial guess... with convex problems strongly convex problems we don't have to worry about this at all we can start with whatever random guess we want and we'll always get the same optimal solution."`,
    code: ``,
    images: ["image_1777605749519_0.png", "lec22_slide_20.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md`,
  },
  {
    id: 44,
    timestamp: `1:00:24`,
    question: `According to the lecture, what type of convex optimization problems frequently appear in computer graphics?`,
    options: [`Linear programming problems`, `Semidefinite programming problems`, `Convex quadratic problems`, `Geometric programming problems`],
    answer: 2,
    intuition: ``,
    explanation: `At [1:00:09], the professor says: "So let's take a look at one really important class of convex optimization problems that show up all the time day and night in computer graphics both in animation and in geometry processing and an image processing all over the place which are convex quadratic objectives."`,
    code: ``,
    images: ["image_1777608590620_0.png", "lec22_slide_21.png"],
    tags: ["optimization", "ddg", "ImageProcessing"],
    source: `lectures/cg-22-lecture-quiz.md`,
  },
  {
    id: 45,
    timestamp: `1:01:23`,
    question: `What is the mathematical form of a convex quadratic objective function?`,
    options: [`f(x) = x^T A x + b^T x + c, where A is positive semi-definite`, `f(x) = (1/2) x^T A x - x^T b, where A is positive semi-definite`, `f(x) = ||Ax - b||^2, where A is full rank`, `f(x) = (1/2) ||Ax - b||^2, where A is symmetric`],
    answer: 1,
    intuition: ``,
    explanation: `At [1:01:23], the professor says: "How do we write one of these down we can express it via a positive semi-definite matrix okay so if we have an objective that looks like this F naught of x equals 1/2 X transpose ax minus X transpose B where a is a positive semi definite matrix then that is a convex quadratic objective."`,
    code: ``,
    images: ["image_1777608595232_0.png", "lec22_slide_21.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md`,
  },
  {
    id: 46,
    timestamp: `1:04:15`,
    question: `What is the first-order optimality condition for the quadratic objective function f(x) = (1/2) x^T A x - x^T b?`,
    options: [`Ax = 0`, `Ax = b`, `A^T x = b`, `x = A^-1 b`],
    answer: 1,
    intuition: ``,
    explanation: `At [1:04:15], the professor derives: "So putting that all together we get a first order optimality condition of hey ax equals B so that's interesting if I'm ever solving a linear system involving a positive semi definite matrix a I could also think about that as minimizing this quadratic function as trying to find the bottom of a bowl-shaped function."`,
    code: ``,
    images: ["image_1777608753623_0.png", "lec22_slide_21.png"],
    tags: ["OptimialityCondition"],
    source: `lectures/cg-22-lecture-quiz.md`,
  },
  {
    id: 47,
    timestamp: `1:05:55`,
    question: `How did the professor visually describe a positive semi-definite quadratic function?`,
    options: [`As a valley with a unique minimum`, `As a cylinder sheet`, `As a mountain with a single peak`, `As a plane with no critical points`],
    answer: 1,
    intuition: ``,
    explanation: `At [1:05:55], the professor illustrates: "If my matrix a is positive semi-definite then the graph looks like this cylinder in the middle it's going up in some directions it's maybe straight in some other directions... if it's strongly convex function then it looks like this bowl on the rat on the far left."`,
    code: ``,
    images: ["lec22_slide_21.png"],
    tags: ["Visualization"],
    source: `lectures/cg-22-lecture-quiz.md`,
  },
  {
    id: 48,
    timestamp: `1:06:48`,
    question: `What skiing analogy did the professor use to explain optimizing convex functions?`,
    options: [`Skiing around a mogul field to find the lowest point`, `Skiing down a bowl to the bottom`, `Skiing across a flat plateau to find an exit`, `Skiing uphill to reach a viewpoint`],
    answer: 1,
    intuition: ``,
    explanation: `At [1:06:48], the professor uses this analogy: "This kind of gives a sense of why should it be that convex problems are easy to solve well if I have this bowl and I'm looking for the minimum of the bowl I can imagine just kind of skiing down to the bottom if I keep just going down down down following the gradient I'll get to the bottom."`,
    code: ``,
    images: ["image_1777608844041_0.png", "lec22_slide_22.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md`,
  },
  {
    id: 49,
    timestamp: `1:08:02`,
    question: `What did the professor say about the optimization problems that typically appear in graphics applications?`,
    options: [`They are usually linear systems that can be solved directly`, `They are usually well-structured convex problems`, `They are usually more complicated and often not convex`, `They are usually small enough to be solved by brute force`],
    answer: 2,
    intuition: ``,
    explanation: `At [1:08:02], the professor states: "The reality is the kinds of optimization problems that show up in graphics are way more complicated and sadly aren't often not convex even if that's a good of getting our head around optimization problems."`,
    code: ``,
    images: ["image_1777608862406_0.png", "image_1777608888150_0.png", "lec22_slide_22.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md`,
  },
  {
    id: 50,
    timestamp: `1:08:31`,
    question: `What basic algorithm did the professor describe as following the direction of steepest descent?`,
    options: [`Newton's method`, `Gradient descent`, `Simulated annealing`, `Interior point method`],
    answer: 1,
    intuition: ``,
    explanation: `At [1:09:27], the professor explains: "So the most basic version of this descent method is something called gradient descent okay and the basic idea is to follow the gradient downhill until the gradient is 0 so follow the direction that's minus the gradient right."`,
    code: ``,
    images: ["image_1777608964675_0.png", "lec22_slide_24.png"],
    tags: ["GradientDescent"],
    source: `lectures/cg-22-lecture-quiz.md`,
  },
  {
    id: 51,
    timestamp: `1:11:42`,
    question: `How did the professor relate gradient descent to concepts from the previous lecture?`,
    options: [`Gradient descent uses rendering equations similar to ray tracing`, `Gradient descent is a form of numerical integration similar to simulations`, `Gradient descent can be viewed as an ordinary differential equation`, `Gradient descent uses the same spatial data structures as collision detection`],
    answer: 2,
    intuition: ``,
    explanation: `At [1:12:04], the professor points out: "One thing that maybe you noticed after our last lecture is that the gradient descent equation the gradient descent evolution is an ordinary differential equation it says the change over time of the quantity X of T is minus the derivative of that function evaluated at X of T."
"don't pick timestep that are too big and too small".`,
    code: ``,
    images: ["image_1777609065058_0.png", "lec22_slide_25.png"],
    tags: ["ODE"],
    source: `lectures/cg-22-lecture-quiz.md`,
  },
  {
    id: 52,
    timestamp: `1:17:13`,
    question: `What geometric challenge did the professor identify with gradient descent in higher dimensions?`,
    options: [`The gradient can sometimes disappear due to numerical errors`, `The algorithm can oscillate back and forth in long, narrow valleys`, `The computation of the gradient becomes too expensive`, `The step size must increase exponentially with dimension`],
    answer: 1,
    intuition: ``,
    explanation: `At [1:17:20], the professor describes: "Here's a very very common phenomenon where our objective function in the vicinity of a local minimum looks like a long slender Valley and so if I start at a point and I walk for a little while along the gradient at that initial point and then I stop I update the Greg find a new gradient I walk a little bit along that direction and then I do it again and again and again the solution can oscillate back and forth right."`,
    code: ``,
    images: ["image_1777609145705_0.png", "lec22_slide_26.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md`,
  },
  {
    id: 53,
    timestamp: `1:18:58`,
    question: `What approach did the professor suggest to address the "valley problem" in gradient descent?`,
    options: [`Using smaller step sizes`, `Using momentum terms`, `Using higher-order derivatives like the Hessian`, `Using random restarts`],
    answer: 2,
    intuition: ``,
    explanation: `At [1:18:58], the professor suggests: "One technique is to consider higher-order derivatives of the function not only the gradient but perhaps the Hessian okay and the general idea what we want to achieve intuitively is to sort of apply a transformation to our function or really to apply a transformation to the domain over which the function is defined so that the local energy landscape doesn't look like this long skinny Valley but instead looks like a nice round bowl."

"some friend will tell you about some new nonconvex optimization such as SGD but nothing is without problems."`,
    code: ``,
    images: ["image_1777609303061_0.png", "lec22_slide_27.png"],
    tags: ["sgd"],
    source: `lectures/cg-22-lecture-quiz.md`,
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

export default function Lec22Part2Quiz() {
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
    accent: '#f59e0b',
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
          <TrendingDown size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 22: Introduction to Optimization — Part 2</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Gradient descent, Newton's method, convex optimization, inverse kinematics</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-22-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec22/1`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec22/2`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 2</a>
          </div>
          <p style={{ color: C.accent, fontWeight: 600 }}>Q33–Q53 · 21 questions</p>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>21</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Questions</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>~7min</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Est. Time</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>2</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Parts</div></div>
          </div>
        </div>

        <button style={btn({ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' })}
          onClick={() => { setScreen('quiz'); start() }}>
          <TrendingDown size={20} /> Start Quiz
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
              <TrendingDown size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 22: Introduction to Optimization — Part 2</span>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', color: C.muted, fontSize: '0.875rem', alignItems: 'center' }}>
              <span><Clock size={14} style={{ display:'inline', verticalAlign:'middle', marginRight:'0.25rem' }} />{formatTime(t)}</span>
              <span>{qIdx+1}/21</span>
              <span style={{ color: C.accent }}>✓ {score}</span>
            </div>
          </div>
          <div style={{ height: '5px', background: C.border, borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.round((qIdx+1)/21*100)}%`, background: C.accent, transition: 'width 0.3s' }} />
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition written yet. Add a <code style={{ color: C.accent }}>- INTUITION:</code> block under this question in <code style={{ color: C.accent }}>lectures/cg-22-lecture-quiz.md</code>.</p>
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
              {qIdx < 21-1 ? 'Next Question' : 'View Results'} <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
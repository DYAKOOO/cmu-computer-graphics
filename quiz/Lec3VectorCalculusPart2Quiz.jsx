'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Sigma } from 'lucide-react'

// Source: lectures/cg-03-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 3: Vector Calculus — Part 2 · Q33–Q64 · 32 questions
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-03-lecture-quiz.md 3

const quizData = [
  {
    id: 33,
    timestamp: `37:45`,
    question: `What alternative interpretation of the derivative does the lecturer provide?`,
    options: [`As the area under the curve`, `As the best linear approximation of the function`, `As the second-order derivative`, `As the inverse of integration`],
    answer: 1,
    explanation: `The lecturer states at [37:45]: "Another important view of the derivative is that it's sort of the best linear approximation of the function."`,
    images: ["image_1771970380896_0.png", "image_1772585164993_0.png"],
    tags: ["Approximation"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 34,
    timestamp: `38:58`,
    question: `In terms of a Taylor series, how is a function approximated beyond the constant and linear terms?`,
    options: [`By adding logarithmic terms`, `By adding exponential terms`, `By adding higher degree terms like quadratic, cubic, etc.`, `By adding periodic functions`],
    answer: 2,
    explanation: `The lecturer explains at [38:58]: "I've done constant, I've done linear, what can I do next? Well just keep going up in degree. I do a quadratic term so I say what is the parabola that's the best fit at this point."`,
    images: ["image_1771970397841_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 35,
    timestamp: `39:22`,
    question: `Why does the lecturer say approximating functions with linear or quadratic terms is useful in graphics?`,
    options: [`Because it creates more realistic visualizations`, `Because it reduces memory usage`, `Because it makes computation easier`, `Because it improves color accuracy`],
    answer: 2,
    explanation: `The lecturer states at [39:22]: "In general replacing complicated functions with a linear or sometimes quadratic approximation is a powerful trick that we'll see over and over again in graphics algorithms because it makes computation easier."`,
    images: ["image_1771970433285_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 36,
    timestamp: `40:19`,
    question: `What is the directional derivative?`,
    options: [`A vector pointing in the direction of steepest ascent`, `The derivative of a multivariable function along a specific direction`, `The change in direction of a vector field`, `The curl of a function at a point`],
    answer: 1,
    explanation: `The lecturer describes at [40:19]: "Perhaps the most basic starting point is to think about the directional derivative because we'll be able to easily connect it to the usual one-dimensional derivative."`,
    images: ["image_1771970503059_0.png"],
    tags: ["DirectionalDerivative"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 37,
    timestamp: `41:31`,
    question: `How is the directional derivative formally defined?`,
    options: [`As the gradient dotted with the direction vector`, `As the limit of [f(x₀+εu)-f(x₀)]/ε as ε→0`, `As the Laplacian of the function in the given direction`, `As the divergence of the function's gradient`],
    answer: 1,
    explanation: `The lecturer states at [41:31]: "The directional derivative along the direction u of the function f is just the usual derivative... the limit as epsilon goes to zero of f of x naught plus epsilon u minus f of x naught divided by epsilon."`,
    images: ["image_1771987890560_0.png"],
    tags: ["Derivation"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 38,
    timestamp: `42:54`,
    question: `What does the gradient tell us about a function?`,
    options: [`The total volume of the function`, `The second-order approximation of the function`, `The directional derivative in all possible directions`, `The boundary conditions of the function`],
    answer: 2,
    explanation: `The lecturer explains at [42:54]: "Before getting into the details, the gradient is basically something that tells us the directional derivative in all possible directions if we use it the right way."

-`,
    images: ["image_1771987937211_0.png", "image_1772584782720_0.png"],
    tags: ["Gradient"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 39,
    timestamp: `43:40`,
    question: `What does the lecturer say the gradient visually represents on a function?`,
    options: [`Arrows pointing in random directions`, `Vectors pointing in the direction of quickest increase (uphill)`, `The level sets of the function`, `The boundary of the function's domain`],
    answer: 1,
    explanation: `The lecturer describes at [43:40]: "Just by looking at this picture you get the sense that the gradient kind of points in the direction of quickest increase if we think of the dark blue colors as being small values in the function and the light blue or white colors being large values in the function, then the arrows are kind of pointing uphill."`,
    images: ["image_1771988006149_0.png"],
    tags: ["Coordinate"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 40,
    timestamp: `44:02`,
    question: `What is the proper name of the symbol ∇ used for the gradient?`,
    options: [`Del`, `Nabla`, `Gradient`, `Laplacian`],
    answer: 1,
    explanation: `The lecturer mentions at [44:02]: "By the way just as a piece of language this symbol that we use for the gradient is not really called grad it's actually got its own name it's called nabla."`,
    images: ["image_1771988003515_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 41,
    timestamp: `44:30`,
    question: `How is the gradient defined in terms of partial derivatives?`,
    options: [`The sum of all partial derivatives`, `The list of all partial derivatives along coordinate directions`, `The product of all partial derivatives`, `The maximum of all partial derivatives`],
    answer: 1,
    explanation: `The lecturer states at [44:56]: "I think a lot simpler way to think about this is hey, we already understand the directional derivative right? The directional derivative gives us the one dimensional derivative in some direction. So what is the gradient? It's just the list of the directional derivatives along all the coordinate axes x1, x2, x3, and so on."`,
    images: ["image_1771988089566_0.png"],
    tags: ["PartialDerivative", "Coordinate"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 42,
    timestamp: `46:31`,
    question: `What is the gradient of the function f(x₁,x₂) = x₁² + x₂²?`,
    options: [`(x₁, x₂)`, `(2x₁, 2x₂)`, `(1, 1)`, `2(x₁ + x₂)`],
    answer: 1,
    explanation: `The lecturer calculates at [47:14]: "We combine these to get our gradient grad f of x is equal to 2x1 2x2 which we could also just write as 2 times bold x."`,
    images: ["image_1771988120283_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 43,
    timestamp: `48:08`,
    question: `What is the first-order Taylor approximation of a function f around a point x₀?`,
    options: [`f(x) ≈ f(x₀)`, `f(x) ≈ f(x₀) + ∇f(x₀)·(x-x₀)`, `f(x) ≈ f(x₀) + (x-x₀)²`, `f(x) ≈ ∇f(x₀)`],
    answer: 1,
    explanation: `The lecturer gives the formula at [48:08]: "We can write this as f of x is approximately f of x naught plus the inner product of the gradient of f at x naught with the vector x minus x naught."`,
    images: ["image_1771988163054_0.png"],
    tags: ["Approximation"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 44,
    timestamp: `48:26`,
    question: `What happens to the function value when moving in the direction of the gradient?`,
    options: [`It decreases`, `It remains constant`, `It increases`, `It oscillates`],
    answer: 2,
    explanation: `The lecturer explains at [48:26]: "Starting at x naught we can see pretty easily that this term gets bigger if we move in the direction of the gradient right? Let's say that x minus x naught is equal to grad f, so we're moving uphill as quickly as possible."`,
    images: ["image_1771988197698_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 45,
    timestamp: `49:18`,
    question: `What does the gradient represent geometrically, according to the lecturer?`,
    options: [`The level curves of the function`, `The direction of steepest ascent`, `The second derivative of the function`, `The boundary of the function`],
    answer: 1,
    explanation: `The lecturer states at [49:18]: "This is our third important picture of the gradient, is that it's giving us the direction of steepest ascent. Meaning if we're standing at some point on the map, what direction should we travel to increase our altitude or increase the value of our function as quickly as possible."`,
    images: ["image_1771988213030_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 46,
    timestamp: `49:46`,
    question: `What optimization algorithm does the lecturer describe that uses the gradient?`,
    options: [`Simulated annealing`, `Genetic algorithms`, `Dynamic programming`, `Gradient descent`],
    answer: 3,
    explanation: `The lecturer describes at [50:01]: "What do we do? We start at some initial guess x naught, we evaluate the gradient at that point, we take a little step in the gradient direction and repeat, evaluate the gradient again, take a step again and so forth." This is gradient descent (or ascent depending on whether minimizing or maximizing).`,
    images: ["image_1771988229711_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 47,
    timestamp: `50:39`,
    question: `How is the gradient related to the directional derivative?`,
    options: [`They provide the same information in different forms`, `The directional derivative is the magnitude of the gradient`, `The inner product of the gradient with direction u equals the directional derivative along u`, `The gradient is the sum of all directional derivatives`],
    answer: 2,
    explanation: `The lecturer defines at [50:39]: "We can say that at each point x the gradient is the unique vector nabla f of x such that the inner product of nabla f with u is equal to the directional derivative of f along the direction u for all u."`,
    images: ["image_1771988289666_0.png"],
    tags: ["Relationship"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 48,
    timestamp: `52:23`,
    question: `What is the gradient of the dot product u·v with respect to u?`,
    options: [`u`, `v`, `u + v`, `u - v`],
    answer: 1,
    explanation: `The lecturer concludes at [53:46]: "So the gradient with respect to u is just the list of all the v components. But at this point I think oh that's interesting, I could have written that a lot more simply. I could have just written the gradient of u transpose v with respect to u is equal to v."`,
    images: ["image_1771988372388_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 49,
    timestamp: `54:50`,
    question: `What pattern does the lecturer identify for the gradient of xᵀy with respect to x?`,
    options: [`It equals x`, `It equals y`, `It equals the transpose of y`, `It equals x + y`],
    answer: 1,
    explanation: `The lecturer states at [54:50]: "For instance if I have two vectors x and y in rn and I have a symmetric matrix a then the derivative of x transpose y with respect to x is equal to y as we've just seen."`,
    images: ["image_1771988432424_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 50,
    timestamp: `55:04`,
    question: `What does the gradient of xᵀAx with respect to x equal?`,
    options: [`x`, `Ax`, `2Ax`, `A`],
    answer: 2,
    explanation: `The lecturer states at [55:04]: "If I have the gradient of x transpose a x with respect to x I get 2ax."

- QUESTIONS (continued):`,
    images: ["image_1771988467336_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 51,
    timestamp: `55:44`,
    question: `What resource does the lecturer recommend for matrix derivatives?`,
    options: [`The professor's lecture notes`, `The Matrix Cookbook`, `Linear Algebra Done Right`, `Matrix Calculus for Machine Learning`],
    answer: 1,
    explanation: `The lecturer mentions at [55:44]: "Beyond this little list here, there's an excellent resource the matrix cookbook that gives all sorts of nice matrix derivatives."`,
    images: [],
    tags: ["MatrixCookbook"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 52,
    timestamp: `56:50`,
    question: `What complex mathematical object is the lecturer taking the gradient of in the advanced example?`,
    options: [`A tensor field`, `A quaternion`, `A function of another function`, `A complex-valued function`],
    answer: 2,
    explanation: `The lecturer states at [56:50]: "Let's try taking the gradient of a function of another function. What does that mean? So you could imagine for instance that little f is a function on the real line like sine or cosine or whatever you like, and big f is a function that takes any function little f and assigns it a score or a value."`,
    images: ["image_1771988539060_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 53,
    timestamp: `59:40`,
    question: `In the advanced example, what is the function Big F of little f?`,
    options: [`The maximum value of little f`, `The L2 inner product of little f and little g`, `The derivative of little f`, `The integral of little f squared`],
    answer: 1,
    explanation: `The lecturer defines at [59:40]: "Let's consider a concrete function big f of little f which is equal to the l2 inner product of little f and little g for functions little f and little g on the unit interval."`,
    images: ["image_1771988651688_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 54,
    timestamp: `1:00:44`,
    question: `What does the lecturer claim is the gradient of Big F(little f) = ⟨little f, little g⟩₂?`,
    options: [`The function little f`, `The derivative of little g`, `The function little g`, `The zero function`],
    answer: 2,
    explanation: `The lecturer states at [1:00:44]: "So likewise this time I'm going to claim the gradient of big f is just little g. If we take the gradient of big f with respect to little f, the little f falls away and we're left with just little g."`,
    images: ["image_1771988662637_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 55,
    timestamp: `1:01:26`,
    question: `What intuition does the lecturer use to explain why the gradient of the L2 inner product is the function little g?`,
    options: [`That the derivative of a product is the sum of derivatives`, `That the inner product measures alignment, and the function best aligned with g is g itself`, `That the derivative of the inner product is always zero`, `That any function can be represented as an inner product`],
    answer: 1,
    explanation: `The lecturer explains at [1:01:26]: "Well okay now we really draw on our intuition about the inner product from thinking about little arrows right? The inner product measures how well two little arrows are aligned or how well two functions are aligned. So what is the function that is best aligned with little g? Well it's just little g."`,
    images: ["image_1771988670464_0.png"],
    tags: ["CG-Lecture-Question", "Intution"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 56,
    timestamp: `1:04:42`,
    question: `What is the gradient of the squared L2 norm of f with respect to f?`,
    options: [`f`, `2f`, `The norm of f`, `The square of f`],
    answer: 1,
    explanation: `The lecturer concludes at [1:04:42]: "The only solution to this equation, the only way for this to hold for all functions u is if nabla f is equal to 2 little f naught."`,
    images: ["image_1771988738747_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 57,
    timestamp: `1:05:09`,
    question: `What pattern does the lecturer highlight about differentiating functions of functions?`,
    options: [`It's always more complex than regular differentiation`, `It follows different rules than regular differentiation`, `It follows similar patterns to ordinary differentiation`, `It requires complex transform techniques`],
    answer: 2,
    explanation: `The lecturer observes at [1:05:09]: "The way we differentiate functions of functions really doesn't look different at all from the way we just differentiate ordinary variables. The derivative of x squared with respect to x is 2x, the derivative of norm of f squared with respect to f is just 2f."`,
    images: ["image_1771988786536_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 58,
    timestamp: `1:06:32`,
    question: `How does the lecturer define a vector field?`,
    options: [`A collection of vectors in space`, `A mapping from points in space to vectors`, `A derivative of a scalar field`, `A matrix that transforms vectors`],
    answer: 1,
    explanation: `The lecturer defines at [1:06:32]: "For instance we could think of a vector field on the plane as a map from r2 to r2. For each point in r2 we get a vector in r2."`,
    images: ["image_1771988827100_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 59,
    timestamp: `1:07:25`,
    question: `How many basic derivatives for vector fields does the lecturer identify?`,
    options: [`One - the gradient`, `Two - the divergence and curl`, `Three - the gradient, divergence, and curl`, `Four - the gradient, divergence, curl, and Laplacian`],
    answer: 1,
    explanation: `The lecturer states at [1:07:25]: "Acturally there are multiple answers. There are two basic derivatives for vector fields."
{:height 531, :width 658}`,
    images: ["image_1771988926877_0.png"],
    tags: ["Property", "Derivation"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 60,
    timestamp: `1:08:01`,
    question: `What does the divergence measure about a vector field?`,
    options: [`The circulation or rotational behavior`, `The average vector direction`, `The rate of expansion or contraction (source/sink behavior)`, `The total energy of the field`],
    answer: 2,
    explanation: `The lecturer explains at [1:08:01]: "The divergence measures basically how much the field is shrinking or expanding, how much it looks like a sink or a source where water is flowing out or flowing in."`,
    images: ["image_1771988951848_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 61,
    timestamp: `1:09:03`,
    question: `What does the curl measure about a vector field?`,
    options: [`The rate of expansion or contraction`, `How much the field is spinning (rotational behavior)`, `The magnitude of the vectors`, `The gradient of the field's energy`],
    answer: 1,
    explanation: `The lecturer states at [1:09:03]: "What is the curl measuring about this vector field? Hopefully it's not too hard to see that it's kind of measuring how much this field is spinning."`,
    images: ["image_1771989024001_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 62,
    timestamp: `1:09:41`,
    question: `How is the divergence written in notation?`,
    options: [`div X`, `∇ × X`, `∇ · X`, `∇² X`],
    answer: 2,
    explanation: `The lecturer notes at [1:09:41]: "We often write the divergence as nabla dot x."`,
    images: ["image_1771989058728_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 63,
    timestamp: `1:10:18`,
    question: `What is the coordinate formula for the divergence of a vector field?`,
    options: [`The determinant of the vector field's Jacobian`, `The sum of the partial derivatives of each component with respect to its corresponding coordinate`, `The trace of the vector field's gradient`, `The cross product of the gradient with the vector field`],
    answer: 1,
    explanation: `The lecturer describes at [1:10:18]: "We sum over all the coordinates each partial derivative being applied to each coordinate function. We take the derivative of the first coordinate function along the first direction, add that to the derivative of the second coordinate function along the second direction, and so on."`,
    images: ["image_1771989089559_0.png"],
    tags: ["Divergence"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 64,
    timestamp: `1:12:22`,
    question: `How is the curl written in notation?`,
    options: [`curl X`, `∇ × X`, `∇ · X`, `∇² X`],
    answer: 1,
    explanation: `The lecturer states at [1:12:22]: "We can write curl also with nabla. We can write it as nabla cross x with a cross product."`,
    images: ["image_1771989199368_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
]

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
        <img key={i} src={`/assets/${img}`} alt={`slide-${i+1}`}
          onError={e => { e.target.style.display='none' }}
          style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid #2a2a3a', display: 'block' }} />
      ))}
    </div>
  )
}

export default function Lec3Part2Quiz() {
  const [screen, setScreen] = useState('welcome')
  const [qIdx, setQIdx] = useState(0)
  const [answers, setAnswers] = useState(Array(quizData.length).fill(null))
  const [selected, setSelected] = useState(null)
  const [showExp, setShowExp] = useState(false)
  const [reviewMode, setReviewMode] = useState(false)
  const [expTab, setExpTab] = useState('explanation')
  const { t, start, pause, reset: resetTimer } = useTimer()
  const q = quizData[qIdx]

  const C = {
    bg: '#0a0a0f',
    surface: '#111118',
    border: '#2a2a3a',
    accent: '#38bdf8',
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
          <Sigma size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 3: Vector Calculus — Part 2</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Gradient, Divergence, Curl, Laplacian, Hessian</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-03-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href="/lec3/1" style={{ color: C.muted, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href="/lec3/2" style={{ color: C.accent, fontSize: "0.85rem" }}>Part 2</a>
          <a key={3} href="/lec3/3" style={{ color: C.muted, fontSize: "0.85rem" }}>Part 3</a>
          </div>
          <p style={{ color: C.accent, fontWeight: 600 }}>Q33–Q64 · 32 questions</p>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>32</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Questions</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>~10min</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Est. Time</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>3</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Parts</div></div>
          </div>
        </div>

        <button style={btn({ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' })}
          onClick={() => { setScreen('quiz'); start() }}>
          <Sigma size={20} /> Start Quiz
        </button>
        <a href='/' style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', color: C.muted, fontSize: '0.875rem' }}>← All quizzes</a>
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
        <a href='/' style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', color: C.muted, fontSize: '0.875rem' }}>← All quizzes</a>
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
              <Sigma size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 3: Vector Calculus — Part 2</span>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', color: C.muted, fontSize: '0.875rem', alignItems: 'center' }}>
              <span><Clock size={14} style={{ display:'inline', verticalAlign:'middle', marginRight:'0.25rem' }} />{formatTime(t)}</span>
              <span>{qIdx+1}/32</span>
              <span style={{ color: C.accent }}>✓ {score}</span>
            </div>
          </div>
          <div style={{ height: '5px', background: C.border, borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.round((qIdx+1)/32*100)}%`, background: C.accent, transition: 'width 0.3s' }} />
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
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {['explanation','images','tags'].map(tab => (
                <button key={tab} onClick={() => setExpTab(tab)}
                  style={{ padding: '0.3rem 0.8rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                    background: expTab===tab ? C.accent : C.border, color: expTab===tab ? '#0a0a0f' : C.muted }}>
                  {tab === 'explanation' ? '💡 Explanation' : tab === 'images' ? '🖼 Slides' : '🔗 Tags'}
                </button>
              ))}
            </div>
            {expTab === 'explanation' && (
              q.explanation
                ? <p style={{ lineHeight: 1.75, color: C.muted, whiteSpace: 'pre-wrap', margin: 0 }}>{q.explanation}</p>
                : <p style={{ color: '#475569', margin: 0 }}>No explanation provided.</p>
            )}
            {expTab === 'images' && <SlideImages images={q.images} />}
            {expTab === 'tags' && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {q.tags.length > 0
                  ? q.tags.map((t,i) => <span key={i} style={tag()}>{t}</span>)
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
              {qIdx < 32-1 ? 'Next Question' : 'View Results'} <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
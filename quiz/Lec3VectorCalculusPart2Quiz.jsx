'use client'
import { useState, useEffect, useRef } from 'react'
import { Sigma } from 'lucide-react'

// Source: lectures/cg-03-lecture-quiz.md  (symlinked from Logseq pages)
// Lecture 3: Vector Calculus — Part 2 — Q33–Q64 (32 questions)
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
    num: 33,
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
    num: 34,
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
    num: 35,
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
    num: 36,
    timestamp: `40:19`,
    question: `What is the directional derivative?`,
    options: [`A vector pointing in the direction of steepest ascent`, `The derivative of a multivariable function along a specific direction`, `The change in direction of a vector field`, `The curl of a function at a point`],
    answer: 1,
    explanation: `The lecturer describes at [40:19]: "Perhaps the most basic starting point is to think about the directional derivative because we'll be able to easily connect it to the usual one-dimensional derivative."`,
    images: ["image_1771970503059_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 37,
    timestamp: `41:31`,
    question: `How is the directional derivative formally defined?`,
    options: [`As the gradient dotted with the direction vector`, `As the limit of [f(x₀+εu)-f(x₀)]/ε as ε→0`, `As the Laplacian of the function in the given direction`, `As the divergence of the function's gradient`],
    answer: 1,
    explanation: `The lecturer states at [41:31]: "The directional derivative along the direction u of the function f is just the usual derivative... the limit as epsilon goes to zero of f of x naught plus epsilon u minus f of x naught divided by epsilon."`,
    images: ["image_1771987890560_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 38,
    timestamp: `42:54`,
    question: `What does the gradient tell us about a function?`,
    options: [`The total volume of the function`, `The second-order approximation of the function`, `The directional derivative in all possible directions`, `The boundary conditions of the function`],
    answer: 2,
    explanation: `The lecturer explains at [42:54]: "Before getting into the details, the gradient is basically something that tells us the directional derivative in all possible directions if we use it the right way."

-`,
    images: ["image_1771987937211_0.png", "image_1772584782720_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 39,
    timestamp: `43:40`,
    question: `What does the lecturer say the gradient visually represents on a function?`,
    options: [`Arrows pointing in random directions`, `Vectors pointing in the direction of quickest increase (uphill)`, `The level sets of the function`, `The boundary of the function's domain`],
    answer: 1,
    explanation: `The lecturer describes at [43:40]: "Just by looking at this picture you get the sense that the gradient kind of points in the direction of quickest increase if we think of the dark blue colors as being small values in the function and the light blue or white colors being large values in the function, then the arrows are kind of pointing uphill."`,
    images: ["image_1771988006149_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 40,
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
    num: 41,
    timestamp: `44:30`,
    question: `How is the gradient defined in terms of partial derivatives?`,
    options: [`The sum of all partial derivatives`, `The list of all partial derivatives along coordinate directions`, `The product of all partial derivatives`, `The maximum of all partial derivatives`],
    answer: 1,
    explanation: `The lecturer states at [44:56]: "I think a lot simpler way to think about this is hey, we already understand the directional derivative right? The directional derivative gives us the one dimensional derivative in some direction. So what is the gradient? It's just the list of the directional derivatives along all the coordinate axes x1, x2, x3, and so on."`,
    images: ["image_1771988089566_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 42,
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
    num: 43,
    timestamp: `48:08`,
    question: `What is the first-order Taylor approximation of a function f around a point x₀?`,
    options: [`f(x) ≈ f(x₀)`, `f(x) ≈ f(x₀) + ∇f(x₀)·(x-x₀)`, `f(x) ≈ f(x₀) + (x-x₀)²`, `f(x) ≈ ∇f(x₀)`],
    answer: 1,
    explanation: `The lecturer gives the formula at [48:08]: "We can write this as f of x is approximately f of x naught plus the inner product of the gradient of f at x naught with the vector x minus x naught."`,
    images: ["image_1771988163054_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 44,
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
    num: 45,
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
    num: 46,
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
    num: 47,
    timestamp: `50:39`,
    question: `How is the gradient related to the directional derivative?`,
    options: [`They provide the same information in different forms`, `The directional derivative is the magnitude of the gradient`, `The inner product of the gradient with direction u equals the directional derivative along u`, `The gradient is the sum of all directional derivatives`],
    answer: 2,
    explanation: `The lecturer defines at [50:39]: "We can say that at each point x the gradient is the unique vector nabla f of x such that the inner product of nabla f with u is equal to the directional derivative of f along the direction u for all u."`,
    images: ["image_1771988289666_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 48,
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
    num: 49,
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
    num: 50,
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
    num: 51,
    timestamp: `55:44`,
    question: `What resource does the lecturer recommend for matrix derivatives?`,
    options: [`The professor's lecture notes`, `The Matrix Cookbook`, `Linear Algebra Done Right`, `Matrix Calculus for Machine Learning`],
    answer: 1,
    explanation: `The lecturer mentions at [55:44]: "Beyond this little list here, there's an excellent resource the matrix cookbook that gives all sorts of nice matrix derivatives."`,
    images: [],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 52,
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
    num: 53,
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
    num: 54,
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
    num: 55,
    timestamp: `1:01:26`,
    question: `What intuition does the lecturer use to explain why the gradient of the L2 inner product is the function little g?`,
    options: [`That the derivative of a product is the sum of derivatives`, `That the inner product measures alignment, and the function best aligned with g is g itself`, `That the derivative of the inner product is always zero`, `That any function can be represented as an inner product`],
    answer: 1,
    explanation: `The lecturer explains at [1:01:26]: "Well okay now we really draw on our intuition about the inner product from thinking about little arrows right? The inner product measures how well two little arrows are aligned or how well two functions are aligned. So what is the function that is best aligned with little g? Well it's just little g."`,
    images: ["image_1771988670464_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 56,
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
    num: 57,
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
    num: 58,
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
    num: 59,
    timestamp: `1:07:25`,
    question: `How many basic derivatives for vector fields does the lecturer identify?`,
    options: [`One - the gradient`, `Two - the divergence and curl`, `Three - the gradient, divergence, and curl`, `Four - the gradient, divergence, curl, and Laplacian`],
    answer: 1,
    explanation: `The lecturer states at [1:07:25]: "Acturally there are multiple answers. There are two basic derivatives for vector fields."
{:height 531, :width 658}`,
    images: ["image_1771988874726_0.png", "image_1771988926877_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 60,
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
    num: 61,
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
    num: 62,
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
    num: 63,
    timestamp: `1:10:18`,
    question: `What is the coordinate formula for the divergence of a vector field?`,
    options: [`The determinant of the vector field's Jacobian`, `The sum of the partial derivatives of each component with respect to its corresponding coordinate`, `The trace of the vector field's gradient`, `The cross product of the gradient with the vector field`],
    answer: 1,
    explanation: `The lecturer describes at [1:10:18]: "We sum over all the coordinates each partial derivative being applied to each coordinate function. We take the derivative of the first coordinate function along the first direction, add that to the derivative of the second coordinate function along the second direction, and so on."`,
    images: ["image_1771989089559_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 64,
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

function useTimer() {
  const [elapsed, setElapsed] = useState(0)
  const ref = useRef(null)
  const start = () => { ref.current = setInterval(() => setElapsed(e => e + 1), 1000) }
  const stop = () => clearInterval(ref.current)
  const reset = () => { clearInterval(ref.current); setElapsed(0) }
  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
  return { elapsed, fmt, start, stop, reset }
}

export default function Lec3Part2Quiz() {
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
      <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem' }}>Lecture 3: Vector Calculus — Part 2</h1>
      <p style={{ color: '#94a3b8', marginBottom: '0.25rem' }}>Gradient, Divergence, Curl, Laplacian, Hessian</p>
      <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Q33–Q64 · 32 questions</p>
      <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
        <a href="/lec3/1" style={{ color: "#64748b" }}>Part 1</a> · <a href="/lec3/2" style={{ color: ACCENT }}>Part 2</a> · <a href="/lec3/3" style={{ color: "#64748b" }}>Part 3</a>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}><Sigma size={20} color={ACCENT} /><h1 style={{ color: ACCENT, fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Lecture 3: Vector Calculus — Part 2 — Results</h1></div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Sigma size={18} color={ACCENT} /><span style={{ color: ACCENT, fontWeight: 600, fontSize: '0.95rem' }}>Lecture 3: Vector Calculus — Part 2</span></div>
          <div style={{ display: 'flex', gap: '1.25rem', color: '#94a3b8', fontSize: '0.85rem' }}>
            <span>{timer.fmt(timer.elapsed)}</span>
            <span>{idx+1}/32</span>
            <span style={{ color: ACCENT }}>✓ {score}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ background: '#1e293b', borderRadius: '99px', height: '5px', marginBottom: '1.25rem' }}>
          <div style={{ background: ACCENT, height: '100%', borderRadius: '99px', width: `${Math.round((idx+1)/32*100)}%`, transition: 'width 0.3s' }} />
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
              {idx + 1 >= 32 ? 'See Results →' : 'Next →'}
            </button>
          )}
          <a href='/' style={{ display: 'flex', alignItems: 'center', color: '#475569', fontSize: '0.875rem' }}>← All quizzes</a>
        </div>
      </div>
    </div>
  )
}

'use client'
import { useState, useEffect, useRef } from 'react'
import { Sigma } from 'lucide-react'

// Source: lectures/cg-03-lecture-quiz.md  (symlinked from Logseq pages)
// Lecture 3: Vector Calculus — Part 1 — Q1–Q32 (32 questions)
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
    num: 1,
    timestamp: `01:05`,
    question: `Why is vector calculus important for computer graphics according to the lecturer?`,
    options: [`It provides the mathematical foundation for color theory`, `It offers a language for spatial relationships and rates of change`, `It's essential for GPU programming`, `It simplifies shader development`],
    answer: 1,
    explanation: `The lecturer explains at [01:23]: "The basic reason is that it gives us a language for talking about spatial relationships rates of change transformations and so forth."`,
    images: ["image_1771911982856_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 2,
    timestamp: `01:37`,
    question: `What specific application area in graphics does the lecturer mention that relies on partial differential equations?`,
    options: [`File compression algorithms`, `Color grading`, `Physically based animation`, `Hardware acceleration`],
    answer: 2,
    explanation: `The lecturer states at [01:48]: "This lets us do all sorts of things from physically based animation and geometry processing and image processing using the language of rates of change."`,
    images: [],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 3,
    timestamp: `02:23`,
    question: `What is the defining characteristic of the Euclidean norm according to the lecture?`,
    options: [`It always yields positive values`, `It is the length preserved by rigid motions of space`, `It works only in 3D space`, `It measures angles between vectors`],
    answer: 1,
    explanation: `The lecturer defines at [03:18]: "We can say the euclidean norm is the notion of length preserved by rigid motions of space, so rotations translations and reflections."`,
    images: ["image_1771912248659_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 4,
    timestamp: `03:53`,
    question: `What is the coordinate formula for the Euclidean norm when using orthonormal coordinates?`,
    options: [`The sum of the components`, `The maximum of the absolute values of the components`, `The square root of the sum of the squares of the components`, `The average of the components`],
    answer: 2,
    explanation: `The lecturer states at [03:53]: "If we have orthonormal coordinates then we can write the euclidean norm of a vector u as the square root of the sum of the squares of all the components."`,
    images: ["image_1771912292087_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 5,
    timestamp: `04:30`,
    question: `What important warning does the lecturer give about computing the Euclidean norm in coordinates?`,
    options: [`It can lead to floating-point errors`, `It only works in two dimensions`, `It doesn't give the geometric length unless using an orthonormal basis`, `It's computationally expensive`],
    answer: 2,
    explanation: `The lecturer warns at [04:30]: "A little warning, whenever we work in coordinates we have to be careful because this expression does not give us the geometric length unless the vector u happens to be encoded in an orthonormal basis."`,
    images: ["image_1771912295116_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 6,
    timestamp: `05:10`,
    question: `How does the lecturer define the Euclidean inner product in geometric terms?`,
    options: [`As the sum of component-wise products`, `As the norm of u times norm of v times cosine of the angle between them`, `As the projection of one vector onto another`, `As the reciprocal of the distance between vectors`],
    answer: 1,
    explanation: `The lecturer defines at [05:41]: "For n-dimensional vectors the euclidean inner product can be defined as inner product of uv is equal to the norm of u times the norm of v times the cosine of the angle theta between the vectors u and v."`,
    images: ["image_1771912310455_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 7,
    timestamp: `06:44`,
    question: `What condition must be met for the dot product formula to have geometric meaning?`,
    options: [`The vectors must be normalized`, `The vectors must have the same dimension`, `The coordinates must come from an orthonormal basis`, `The vectors must be perpendicular`],
    answer: 2,
    explanation: `The lecturer states at [06:44]: "Again we have our warning as with the euclidean norm, this expression this sum of component-wise products has no geometric meaning unless the coordinates come from an orthonormal basis."`,
    images: ["image_1771912379439_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 8,
    timestamp: `07:24`,
    question: `What does the cross product of two vectors produce, according to the lecture?`,
    options: [`A scalar value`, `A vector`, `A matrix`, `A tensor`],
    answer: 1,
    explanation: `The lecturer states at [07:32]: "The inner product took two vectors and produced a scalar. The cross product is going to do something a little different. It's going to take two vectors and produce a vector as output."`,
    images: [],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 9,
    timestamp: `07:52`,
    question: `What two properties define the cross product geometrically?`,
    options: [`Its magnitude is the dot product of the vectors and its direction is along their sum`, `Its magnitude is the area of the parallelogram and its direction is orthogonal to both vectors`, `Its magnitude is the product of vector lengths and its direction is the average of their directions`, `Its magnitude is the sum of the vectors and its direction is their difference`],
    answer: 1,
    explanation: `The lecturer explains at [07:52]: "I can say that the magnitude is equal to the area of the parallelogram made by the two vectors and I can say that the direction of the cross product is orthogonal to both vectors."`,
    images: ["image_1771913321064_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 10,
    timestamp: `08:34`,
    question: `Why does the cross product make sense only in three dimensions?`,
    options: [`Because in 2D there is no vector orthogonal to both vectors within the plane, and in 4D+ there are too many possible orthogonal vectors`, `Because cross products are only defined for 3D space mathematically`, `Because geometric operations only make sense in our physical 3D world`, `Because the parallelogram area property only works in 3D`],
    answer: 0,
    explanation: `The lecturer explains at [09:25]: "I have two vectors u v in the plane and I'm looking for a vector that's orthogonal to both of them. Well unless those vectors are parallel there is no vector in 2D that is orthogonal to both u and v." And at [09:45]: "When we go into 4D or any higher dimension we're going to actually have many different vectors that could be orthogonal to both u and v and have the desired magnitude." The 4D+ Problem: In four dimensions or higher, there are actually too many directions that are perpendicular to both u and v, so the cross product wouldn't give you a unique, single answer.`,
    images: ["image_1771913464398_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 11,
    timestamp: `10:19`,
    question: `What is the "abusive notation" the lecturer mentions for the 2D cross product?`,
    options: [`Using quaternions instead of vectors`, `Reporting just the signed area of the parallelogram`, `Ignoring the cross product entirely for 2D`, `Using complex numbers instead of vectors`],
    answer: 1,
    explanation: `The lecturer mentions at [10:19]: "A word of warning. Sometimes I and other people will use the cross product in 2D to just refer to this signed area of this parallelogram. So the area of the parallelogram and make it positive if it's sort of pointing out of the plane and negative if it's pointing into the plane."`,
    images: ["image_1771913472308_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 12,
    timestamp: `11:46`,
    question: `What is the precise mathematical definition of the cross product using determinants?`,
    options: [`It is the vector that makes the determinant of the three vectors equal to zero`, `It is the unique vector that makes the determinant of the matrix with columns u, v, and u×v equal to the product of their norms times sine of the angle`, `It is the vector that makes the determinant of the matrix equal to one`, `It is the unique vector that makes the determinant of the matrix negative`],
    answer: 1,
    explanation: `The lecturer defines at [11:46]: "The cross product is the unique vector u cross v that satisfies this relationship that says the square root of the determinant of the matrix with columns u v and u cross v is equal to the norm of u times the norm of v times sine theta."`,
    images: ["image_1771968532356_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 13,
    timestamp: `13:48`,
    question: `What geometric interpretation of the cross product does the lecturer describe as "really useful"?`,
    options: [`That it represents the normal vector to the plane containing both vectors`, `That it gives the volume of the parallelepiped formed by three vectors`, `That a cross product with a unit normal vector is equivalent to a quarter rotation in the plane`, `That it represents the projection of one vector onto another`],
    answer: 2,
    explanation: `The lecturer states at [14:00]: "A simple but useful observation is that a cross product with a unit normal vector n is equivalent to a quarter rotation in the plane with normal n."
{:height 547, :width 658}`,
    images: ["image_1771968664365_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 14,
    timestamp: `14:30`,
    question: `What is the result of n cross (n cross u) according to the lecture?`,
    options: [`u`, `-u`, `n`, `A vector perpendicular to both n and u`],
    answer: 1,
    explanation: `The lecturer explains at [14:46]: "Hopefully not too hard you see that n cross n cross u is another 90 degree rotation which means it's a 180 degree rotation of the original vector u which means it's actually equal to minus u."`,
    images: ["image_1771968737924_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 15,
    timestamp: `15:47`,
    question: `How can the dot product be expressed using matrix operations?`,
    options: [`As the determinant of a matrix containing both vectors`, `As the trace of the matrix formed by the vectors`, `As u transpose times v`, `As the eigenvalue of the vectors' outer product`],
    answer: 2,
    explanation: `The lecturer states at [16:06]: "It's often convenient for instance to express a dot product using a matrix product so if I wanted to represent u dot v that's no different from saying I write u transpose v."`,
    images: ["image_1771968934443_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 16,
    timestamp: `17:17`,
    question: `How does the lecturer represent a general inner product with coefficients using matrices?`,
    options: [`By constructing a matrix of coefficients and using u^T A v`, `By using the trace of a coefficient matrix`, `By constructing a diagonal matrix of coefficients`, `By using the determinant of a coefficient matrix`],
    answer: 0,
    explanation: `The lecturer explains at [17:56]: "What I'm going to do is build a little in this case two by two matrix because we're in two dimensions that has encoded in it all the constants all the coefficients in my expression for the inner product... And then I'm going to do something that looks just like what I did before u transpose v but I'm going to stick this matrix a in the middle. So I'm going to do u transpose a v."`,
    images: ["image_1771968987949_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 17,
    timestamp: `19:04`,
    question: `What important property does the matrix representing a general inner product have?`,
    options: [`It must be invertible`, `It must be symmetric`, `It must be diagonal`, `It must be positive definite`],
    answer: 1,
    explanation: `The lecturer points out at [19:04]: "Question why is the matrix that I got symmetric if I take the matrix a and apply its transpose I again get 2 1 1 3."

- What`,
    images: ["image_1771969001254_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 18,
    timestamp: `19:21`,
    question: `How can the cross product be represented using a matrix?`,
    options: [`As a 3×3 identity matrix multiplied by the vector`, `As a skew-symmetric matrix constructed from the vector components`, `As a symmetric matrix multiplied by the vector`, `As the eigenvalues of the vector's components`],
    answer: 1,
    explanation: `The lecturer explains at [19:40]: "This matrix has an interesting structure. It has the three components of the vector in it but half of them are negated... And you notice that this matrix now instead of being symmetric it's anti-symmetric or skew-symmetric."`,
    images: [],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 19,
    timestamp: `21:11`,
    question: `What happens when you swap the order of vectors in a cross product?`,
    options: [`The result is the same`, `The result is the negative of the original cross product`, `The result is orthogonal to the original cross product`, `The result is rotated by 90 degrees`],
    answer: 1,
    explanation: `The lecturer states at [21:11]: "It's useful to notice here that v cross u is minus u cross v. So the cross product is kind of a anti-symmetric operation if I exchange the order of the operands I get minus the result."`,
    images: ["image_1771969154783_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 20,
    timestamp: `23:54`,
    question: `What geometric interpretation does the lecturer give for the determinant of three vectors?`,
    options: [`The angle between the vectors`, `The projection of one vector onto another`, `The volume of the parallelepiped formed by the vectors`, `The sum of the vector magnitudes`],
    answer: 2,
    explanation: `The lecturer explains at [23:54]: "The determinant of three vectors u v and w gives me the volume of a little parallel pipet, a little box with edges u v and w."
**signed volume**`,
    images: ["image_1771969392356_0.png", "image_1771969197614_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 21,
    timestamp: `24:56`,
    question: `How does the lecturer geometrically calculate the volume of the parallelepiped formed by three vectors?`,
    options: [`By computing the triple integral of the vectors`, `By taking the dot product of one vector with the cross product of the other two`, `By summing the magnitudes of all three vectors`, `By calculating the eigenvalues of the matrix formed by the vectors`],
    answer: 1,
    explanation: `The lecturer states at [24:56]: "So now if I take the dot product of u cross v with w, what am I measuring? I'm measuring the height of the box times the area of the base and guess what that gives me the volume of this box."   - it recovers original mapping.`,
    images: ["image_1771969487599_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 22,
    timestamp: `27:01`,
    question: `What does the sign of the determinant represent geometrically?`,
    options: [`Whether the volume is positive or negative`, `Whether the vectors are linearly independent`, `Whether the orientation was preserved or reversed`, `Whether the vectors are orthogonal`],
    answer: 2,
    explanation: `The lecturer explains at [31:21]: "What does the sign of the determinant tell us in this case? Well, it's basically telling us whether the orientation was reversed."`,
    images: ["image_1771969597588_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 23,
    timestamp: `28:08`,
    question: `What is the relationship between a linear map and its matrix representation?`,
    options: [`The matrix columns are the images of the standard basis vectors`, `The matrix rows are the images of the standard basis vectors`, `The matrix diagonal contains the eigenvalues of the linear map`, `The matrix determinant equals the linear map's trace`],
    answer: 0,
    explanation: `The lecturer states at [28:48]: "This is pretty easy, the a vectors become the columns of the matrix. Right I put a 1 x a 1 y a 1 z down the first column and so forth."
{:height 621, :width 748}`,
    images: ["image_1771969732773_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 24,
    timestamp: `29:29`,
    question: `According to the lecturer, what's a good mental model for matrix-vector multiplication?`,
    options: [`Rotating and scaling the vector`, `Performing a sequence of dot products`, `Taking linear combinations of the columns using the vector components as coefficients`, `Transforming the coordinate system`],
    answer: 2,
    explanation: `The lecturer states at [29:29]: "So I can think of matrix vector multiplication again as taking linear combinations of the columns using the components of the vector I'm multiplying by as the coefficients."`,
    images: ["image_1771969739386_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 25,
    timestamp: `30:11`,
    question: `What geometric interpretation does the lecturer give for the determinant of a linear map?`,
    options: [`The angle of rotation caused by the map`, `The multiplicative change in volume caused by the map`, `The change in distance between points`, `The sum of the eigenvalues of the map`],
    answer: 1,
    explanation: `The lecturer explains at [30:48]: "Because the determinant of the matrix gives us the volume of the parallel pipette, the determinant of the linear map is telling us the change in volume. We had something that had unit volume one times one times one and we got something that has some other volume... so determinant is always telling you about the multiplicative change in volume."
- QUESTIONS (continued):`,
    images: ["image_1771969755550_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 26,
    timestamp: `32:39`,
    question: `What is the Jacobi identity for cross products?`,
    options: [`u × (v × w) = (u × v) × w`, `u × (v × w) + v × (w × u) + w × (u × v) = 0`, `u × (v × w) = v(u·w) - w(u·v)`, `u × v = -v × u`],
    answer: 1,
    explanation: `The lecturer states at [32:39]: "There's something called the Jacobi identity which just involves the cross product and that says something similar but different. It says that u cross v cross w plus v cross w cross u plus w cross u cross v is equal to zero."
{:height 556, :width 669}`,
    images: ["image_1771969698655_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 27,
    timestamp: `33:21`,
    question: `What is Lagrange's identity for cross products?`,
    options: [`u × (v × w) = (u × v) × w`, `u × (v × w) + v × (w × u) + w × (u × v) = 0`, `u × (v × w) = v(u·w) - w(u·v)`, `(u × v)·w = u·(v × w)`],
    answer: 2,
    explanation: `The lecturer explains at [33:21]: "Another triple product is something called Lagrange's identity which says that u cross v cross w is equal to v times u dot w minus w times u dot v, meaning you take the dot product and then you just use that scalar to multiply the vector."`,
    images: ["image_1771969766622_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 28,
    timestamp: `34:05`,
    question: `What are differential operators according to the lecture?`,
    options: [`Operators that calculate differences between vectors`, `Operators that represent integration of functions`, `Derivatives that act on vector fields`, `Operators that perform discrete approximations`],
    answer: 2,
    explanation: `The lecturer defines at [34:05]: "Differential operators are basically derivatives that act on vector fields."`,
    images: ["image_1771970129032_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 29,
    timestamp: `34:37`,
    question: `What application of differential operators in graphics does the lecture mention?`,
    options: [`Texture compression`, `User interface design`, `Numerical optimization by following gradients`, `Memory management`],
    answer: 2,
    explanation: `The lecturer explains at [34:37]: "These tools, differential operators, also provide the foundations for numerical optimization. So something that shows up a lot in computer graphics is that you want to find the best solution, you want to minimize cost by for instance following the gradient of some objective or energy function."`,
    images: ["image_1771970183463_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 30,
    timestamp: `35:30`,
    question: `What is the most basic definition of a derivative according to the lecture?`,
    options: [`The second-order approximation of a function`, `The change in a function with respect to time`, `The slope or rise over run of a function`, `The limit of a difference quotient`],
    answer: 2,
    explanation: `The lecturer states at [35:30]: "Perhaps the most basic definition, one that you might have learned first, is that it gives the slope. It gives the rise over run of the function for a short distance."`,
    images: ["image_1771970280186_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 31,
    timestamp: `35:41`,
    question: `What is the formal definition of the derivative?`,
    options: [`The integral of the function's rate of change`, `The limit as epsilon goes to zero of [f(x₀+ε)-f(x₀)]/ε`, `The second derivative of the function`, `The area under the function's curve`],
    answer: 1,
    explanation: `The lecturer gives the definition at [35:41]: "We look at how much the function is changing over a little distance epsilon. So we start at some point x naught, move over to x naught plus epsilon, evaluate the function, take the difference from the function value at x naught, divide by epsilon and then take the limit as epsilon goes to 0."`,
    images: ["image_1771970353123_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    num: 32,
    timestamp: `37:03`,
    question: `When is a function not differentiable at a point?`,
    options: [`When its value at that point is zero`, `When the left and right limits of the derivative don't agree`, `When the function is constant around that point`, `When the function has a local maximum at that point`],
    answer: 1,
    explanation: `The lecturer explains at [37:03]: "In this case we say the function is not differentiable at x naught, or that it is differentiable if f plus is the same as f minus."`,
    images: ["image_1771970359791_0.png"],
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

export default function Lec3Part1Quiz() {
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
      <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem' }}>Lecture 3: Vector Calculus — Part 1</h1>
      <p style={{ color: '#94a3b8', marginBottom: '0.25rem' }}>Gradient, Divergence, Curl, Laplacian, Hessian</p>
      <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Q1–Q32 · 32 questions</p>
      <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
        <a href="/lec3/1" style={{ color: ACCENT }}>Part 1</a> · <a href="/lec3/2" style={{ color: "#64748b" }}>Part 2</a> · <a href="/lec3/3" style={{ color: "#64748b" }}>Part 3</a>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}><Sigma size={20} color={ACCENT} /><h1 style={{ color: ACCENT, fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Lecture 3: Vector Calculus — Part 1 — Results</h1></div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Sigma size={18} color={ACCENT} /><span style={{ color: ACCENT, fontWeight: 600, fontSize: '0.95rem' }}>Lecture 3: Vector Calculus — Part 1</span></div>
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

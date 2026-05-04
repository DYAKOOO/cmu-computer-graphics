'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Grid } from 'lucide-react'

// Source: lectures/cg-02-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 2: Linear Algebra — Part 1 · QQF1–QQ29 · 32 questions (29 MCQ, 3 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-02-lecture-quiz.md 2

const quizData = [
  {
    id: 1,
    qid: `QF1`,
    qtype: `FLOW`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `The lecture opens with "why is linear algebra important for computer graphics?" and answers it before covering any formulas. Why does this framing — starting from applications rather than axioms — shape what the lecture covers and in what order?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `Linear algebra is useful in graphics because, once a problem is expressed as Ax=b, the computer can solve it efficiently. This shapes the lecture to focus on the tools that appear most in graphics: norms (measuring size/error), inner products (measuring alignment, projections), linear maps (transformations), and eigenvalues (principal directions of deformation). The application-first framing also explains why the formal vector space axioms are shown but not drilled — the intuition matters more than the proof.`,
    intuition: `"Once it's linear algebra, the computer handles it" — that promise justifies everything that follows.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 2,
    qid: `QF2`,
    qtype: `FLOW`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `The lecture introduces vectors geometrically ("a little arrow") before introducing coordinate representations. Why does separating the geometric concept from its coordinate encoding matter for graphics?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `A geometric vector (direction + magnitude) exists independently of any coordinate system. Its coordinates depend on the chosen basis — the same arrow has different numbers in different coordinate frames. Graphics constantly changes frames (model → world → camera → screen), so operations defined geometrically (dot product, cross product, norm) are guaranteed to give the same answer in any frame, while coordinate arithmetic is not. Starting from geometry prevents a common bug: applying coordinate-specific shortcuts in the wrong frame.`,
    intuition: `The arrow doesn't change when you rotate the ruler. The numbers do.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 3,
    qid: `QF3`,
    qtype: `ORDER`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `Put these linear algebra topics in the order lecture 2 introduces them: eigenvalues and eigenvectors / Gram-Schmidt orthogonalization / inner product and norm / linear maps and matrices / vector spaces (abstract definition)`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `Vector spaces (abstract definition) → Inner product and norm → Linear maps and matrices → Gram-Schmidt orthogonalization → Eigenvalues and eigenvectors`,
    intuition: `Each layer adds structure to the previous: sets → measurable sets → structure-preserving maps → orthonormal structure → intrinsic directions.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 1,
    qid: `Q1`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `00:10`,
    question: `What does Professor Crane describe as the "bread and butter of math that shows up in all areas of computer graphics"?`,
    options: [`Linear algebra`, `Vector calculus`, `Number theory`, `Differential equations`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [00:23]: "Linear algebra really is kind of the bread and butter of math that shows up in all areas of computer graphics."`,
    code: ``,
    images: ["image_1771892100776_0.png"],
    tags: [],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 2,
    qid: `Q2`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `00:42`,
    question: `According to the lecture, what is a key computational advantage of expressing a problem in terms of linear algebra?`,
    options: [`It makes the code easier to read`, `You can hand it off to an existing numerical linear algebra package`, `It automatically parallelizes the computation`, `It requires less computer memory`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [00:42]: "Once you can express the solution to a problem in terms of linear algebra you're really in good shape you can now just hand off your linear system to a computer to an existing numerical linear algebra package and it does a lot of the work for you."`,
    code: ``,
    images: ["image_1771892139107_0.png"],
    tags: [],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 3,
    qid: `Q3`,
    qtype: `PHILOSOPHY`,
    format: `mcq`,
    timestamp: `02:37`,
    question: `What approach does Professor Crane advocate when learning mathematical definitions?`,
    options: [`Never accept rules handed to you by an authority; understand why they're true`, `Focus only on the rules that seem intuitive`, `Skip the details and focus only on applications`, `Memorize all rules precisely as given by authorities`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer emphasizes at [02:37]: "You should just never accept a set of rules handed to you by an authority you shouldn't just let somebody say okay here's the definition here's all the properties let's move on and use it."`,
    code: ``,
    images: ["image_1771892181205_0.png"],
    tags: ["philosophy", "definition"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 4,
    qid: `Q4`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `04:08`,
    question: `What intuitive representation of a vector does the professor describe as a "really really good cartoon"?`,
    options: [`A sequence of numbers`, `A point in space`, `A little arrow`, `A mathematical function`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [04:08]: "For a lot of people the image that pops into your head maybe is that a vector is a little arrow right and this is kind of a cartoon of what a vector is but it's a really really good cartoon."`,
    code: ``,
    images: ["image_1771892256568_0.png"],
    tags: [],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 5,
    qid: `Q5`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `05:32`,
    question: `What two fundamental pieces of information does a vector encode?`,
    options: [`Position and velocity`, `Origin and endpoint`, `Direction and magnitude`, `Force and acceleration`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [05:32]: "A vector fundamentally encodes a direction and a magnitude."

vectors with base points appear in differential geometry and are not important in linear algebra.`,
    code: ``,
    images: ["image_1771892445191_0.png"],
    tags: ["ddg"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 6,
    qid: `Q6`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `06:22`,
    question: `In linear algebra, what is NOT typically associated with a vector according to the lecture?`,
    options: [`Base point (starting point)`, `Orientation`, `Magnitude`, `Direction`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [06:22]: "In this class and actually in all of linear algebra this is not really a piece of information we associate with a vector this is kind of like a sort of base point for the vector. Its more related to differential geometry"`,
    code: ``,
    images: ["image_1771892466621_0.png"],
    tags: ["ddg"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 7,
    qid: `Q7`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `07:38`,
    question: `Why must we be cautious when using measurements of vectors in different coordinate systems?`,
    options: [`Some measurements are only meaningful relative to a particular coordinate system`, `Vectors cannot be compared across different coordinate systems`, `Different coordinate systems produce different vector magnitudes`, `All coordinate systems measure vectors incorrectly`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer warns at [07:38]: "You have to be really careful when talking about measurements to realize that some measurements are only meaningful relative to some particular coordinate system."`,
    code: ``,
    images: ["image_1771892522863_0.png"],
    tags: ["System/Coordinate"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 8,
    qid: `Q8`,
    qtype: `HISTORICAL`,
    format: `mcq`,
    timestamp: `09:09`,
    question: `According to the lecture, who is credited with developing Cartesian coordinates?`,
    options: [`René Descartes`, `Carl Friedrich Gauss`, `Isaac Newton`, `Leonhard Euler`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer mentions at [09:09]: "The reason these are called cartesian coordinates is that they were kind of cooked up or or started to be used by somebody named renee dickhardt [Descartes]."`,
    code: ``,
    images: ["image_1771892590919_0.png"],
    tags: ["History", "Descartes", "Cartesian"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 9,
    qid: `Q9`,
    qtype: `OPERATION`,
    format: `mcq`,
    timestamp: `11:05`,
    question: `What is the geometric meaning of vector addition as described in the lecture?`,
    options: [`Finding the average of two vectors`, `Placing vectors end to end`, `Doubling the length of a vector`, `Rotating a vector by 90 degrees`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer defines at [11:05]: "One thing we can do is we can add them end to end so if i have two vectors u and v then i can lay out the first vector u and then the vector v and i get some new vector which i'll just give a name to i'll call that u plus v."`,
    code: ``,
    images: ["image_1771892653900_0.png"],
    tags: ["Operation", "Addition"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 10,
    qid: `Q10`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `11:39`,
    question: `What property of vector addition is demonstrated when the order of addition doesn't affect the result?`,
    options: [`Associativity`, `Commutativity`, `Transitivity`, `Distributivity`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [12:02]: "Now we can get really fancy about that and and say oh well whenever we have an operation like this where exchanging the order of the operands doesn't make a difference we could call that commutative."`,
    code: ``,
    images: ["image_1771892660377_0.png"],
    tags: ["Property"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 11,
    qid: `Q11`,
    qtype: `OPERATION`,
    format: `mcq`,
    timestamp: `12:52`,
    question: `What is the second basic operation with vectors discussed in the lecture?`,
    options: [`Division`, `Projection`, `Scaling`, `Rotation`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [12:52]: "What else can we do with a vector so i said they're two basic operations the other basic one would be scaling."`,
    code: ``,
    images: ["image_1771892724350_0.png"],
    tags: ["Operation", "Scaling"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 12,
    qid: `Q12`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `15:35`,
    question: `What property is illustrated when a(u+v) = au+av?`,
    options: [`Linearity`, `Commutativity`, `Associativity`, `Distributivity`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [15:35]: "So it's it's interesting it seems we really do get the same result either way we get that a times u plus v is equal to a u plus a v." This is the distributive property of scalar multiplication over vector addition.`,
    code: ``,
    images: ["image_1771892830394_0.png"],
    tags: ["Property"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 13,
    qid: `Q13`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `16:38`,
    question: `According to the lecture, where do the rules of vector spaces come from?`,
    options: [`Geometric pictures and behavior of arrows`, `Physical laws of nature`, `Computer science algorithms`, `Abstract mathematical theory`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer emphasizes at [16:38]: "And again these rules didn't fall out of the sky each one comes from some geometric picture that we can draw."`,
    code: ``,
    images: ["image_1771892884491_0.png"],
    tags: ["Concept"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 14,
    qid: `Q14`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `17:16`,
    question: `Why is it important to formulate a formal list of vector space properties?`,
    options: [`To avoid drawing geometric pictures`, `To identify when objects that don't look like arrows still behave like vector spaces`, `To create unnecessary abstractions`, `To make mathematics more difficult for students`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [17:16]: "The point the purpose of formulating this very formal list of properties is that we're going to encounter in our exploration of computer graphics other objects that obey this same set of rules but is not the same as just a little arrow."`,
    code: ``,
    images: ["image_1771892918019_0.png"],
    tags: [],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 15,
    qid: `Q15`,
    qtype: `EXAMPLE`,
    format: `mcq`,
    timestamp: `18:33`,
    question: `In the lecture, R³ is described as:`,
    options: [`A matrix with three rows`, `A space of three-dimensional functions`, `A list of three real numbers`, `A collection of 3D shapes`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [18:33]: "It's a pretty fancy way of saying we have a list of n real numbers for some for some choice of n." For R³, this means a list of three real numbers.`,
    code: ``,
    images: ["image_1771892988103_0.png"],
    tags: ["FloatingPoint"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 16,
    qid: `Q16`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `19:52`,
    question: `What kinds of graphics data can be treated as functions in a vector space according to the lecture?`,
    options: [`Only animation sequences`, `Many things including image intensity, geometry shape, and vibration amplitude`, `Only 2D images`, `Only 3D models`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [20:12]: "These functions could describe all sorts of things a function could be the intensity of an image the function could be something describing the shape of a piece of geometry or the amplitude of vibration on a surface that makes sound all sorts of things."`,
    code: ``,
    images: ["image_1771893024719_0.png"],
    tags: [],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 17,
    qid: `Q17`,
    qtype: `OPERATION`,
    format: `mcq`,
    timestamp: `21:30`,
    question: `How is function addition defined in the lecture?`,
    options: [`By adding the domains of the functions`, `By adding the values of each function at each point`, `By finding the average of two functions`, `By concatenating the functions sequentially`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [21:30]: "F plus g at any point x is the value i get by just evaluating f at x evaluating g at x and taking their sum."`,
    code: ``,
    images: ["image_1771893152491_0.png"],
    tags: ["Addition", "Function", "Operation"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 18,
    qid: `Q18`,
    qtype: `OPERATION`,
    format: `mcq`,
    timestamp: `22:24`,
    question: `How is function scaling defined in the lecture?`,
    options: [`By finding the derivative of the function`, `By stretching the domain of the function`, `By evaluating the function at a scaled input`, `By evaluating the function and scaling the resulting value`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [22:24]: "I would say af of x is well i evaluate f at x and then i scale the resulting number by a."`,
    code: ``,
    images: ["image_1771893299196_0.png"],
    tags: [],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 19,
    qid: `Q19`,
    qtype: `COMPUTATION`,
    format: `mcq`,
    timestamp: `24:34`,
    question: `When adding two vectors in coordinates, what operation is performed on their components?`,
    options: [`Multiplication`, `The larger component is selected`, `Component-wise addition`, `Cross product`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer demonstrates at [24:34]: "I replace u with this list 4 1 and v with the list 1 3 and i add four to one and three to one to get one plus four three plus one is five four." This shows component-wise addition.`,
    code: ``,
    images: ["image_1771893489533_0.png"],
    tags: ["computation", "Addition"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 20,
    qid: `Q20`,
    qtype: `VERIFICATION`,
    format: `mcq`,
    timestamp: `26:01`,
    question: `According to the lecture, why is it important to verify that coordinate-wise operations correspond to vector space properties?`,
    options: [`It's not important; the professor just mentions it in passing`, `To make computations more complicated`, `As examples become more complex, intuition alone may not be sufficient`, `To discover new vector spaces`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer emphasizes at [26:48]: "But the point here is it is important especially as examples get more and more complicated to take a step back from time to time and say okay even though this seems intuitively obvious that this is a correct notion of vector addition that this is a vector space i should probably check."
- ## Linear Algebra in Computer Graphics - Quiz Questions (Continued)`,
    code: ``,
    images: [],
    tags: ["Intution"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 21,
    qid: `Q21`,
    qtype: `CALCULATION`,
    format: `mcq`,
    timestamp: `28:33`,
    question: `If u = (4,2) and we want to compute (3/2)u, what is the result?`,
    options: [`(6,3)`, `(6,4)`, `(7,3.5)`, `(8,4)`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer calculates at [28:45]: "I have four times three halves and two times three halves which works out to 12 halves and six halves or in other words six and three not too hard."`,
    code: ``,
    images: ["image_1771893790120_0.png"],
    tags: ["computation"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 22,
    qid: `Q22`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `29:36`,
    question: `What common operation in computer graphics involves finding (a+b)/2?`,
    options: [`Matrix inversion`, `Vector normalization`, `Calculating a cross product`, `Finding a midpoint`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [29:24]: "Really simple one that comes up all the time is i have two points in space a and b and i want to know where the midpoint is i'm doing some kind of interpolation or subdivision or all sorts of things we'll see later on."`,
    code: ``,
    images: ["image_1771901165292_0.png"],
    tags: ["midpoint"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 23,
    qid: `Q23`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `31:27`,
    question: `What term is used interchangeably with "length" and "magnitude" of a vector?`,
    options: [`Amplitude`, `Norm`, `Scalar`, `Dimension`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [31:27]: "All of these words by the way are synonyms if i say i want the norm of a vector that's the same as i want the length is the same as i want the magnitude."`,
    code: ``,
    images: ["image_1771901220813_0.png"],
    tags: ["definition", "Norm"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 24,
    qid: `Q24`,
    qtype: `VISUAL`,
    format: `mcq`,
    timestamp: `32:58`,
    question: `In the image example given by the professor, which would have the larger L2 norm?`,
    options: [`A dark cave`, `The bright sun`, `It depends on the color spectrum`, `Both would have equal norms`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer suggests at [33:25]: "You might say i think that brighter is bigger the sun somehow has a lot more stuff coming out of it light coming out of it than the cave so i'm going to guess that the sun has a large norm the cave has a small norm."`,
    code: ``,
    images: ["image_1771901364805_0.png"],
    tags: [],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 25,
    qid: `Q25`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `34:15`,
    question: `What key property must a norm have regarding its sign?`,
    options: [`It can be any real number`, `It must always be positive`, `It must be non-negative`, `It must be negative for vectors pointing downward`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [34:47]: "So one thing we can say about any norm is it really should be a positive or at least a non-negative quantity."`,
    code: ``,
    images: ["image_1771901403572_0.png"],
    tags: ["Property", "Norm"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 26,
    qid: `Q26`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `35:04`,
    question: `When is the norm of a vector equal to zero?`,
    options: [`When the vector is very small`, `If and only if the vector is the zero vector`, `When the vector is horizontal`, `When the vector points in a negative direction`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [35:04]: "There's a very very special case where the length of a vector should be equal to zero and that's really if and only if that vector is the zero vector."`,
    code: ``,
    images: ["image_1771901443420_0.png"],
    tags: ["Property", "norm"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 27,
    qid: `Q27`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `36:15`,
    question: `If a vector is scaled by a factor c, how does its norm change?`,
    options: [`It increases by c`, `It remains unchanged`, `It increases by c²`, `It is multiplied by |c|`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [36:15]: "One thing that we can also see pretty easily is if we take a vector and we scale it by a factor c if we scale for instance all the components by a factor c its norm really should change by the same amount the norm of cu should be the absolute value of c times the norm of u."`,
    code: ``,
    images: [],
    tags: ["Property", "Norm"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 28,
    qid: `Q28`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `36:47`,
    question: `What geometric principle is illustrated by the triangle inequality?`,
    options: [`Angles in a triangle sum to 180 degrees`, `The shortest path between two points is a straight line`, `Similar triangles have proportional sides`, `Parallel lines never meet`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [36:47]: "One thing we know very intuitively is that the shortest path between two points is always along a straight line."`,
    code: ``,
    images: ["image_1771901543758_0.png"],
    tags: ["Property", "Norm", "Inequality"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 29,
    qid: `Q29`,
    qtype: `FORMULA`,
    format: `mcq`,
    timestamp: `39:09`,
    question: `What is the formula for the Euclidean norm of a vector with components u₁ through uₙ?`,
    options: [`The largest component value`, `The average of all components`, `The square root of the sum of squares of all components`, `The sum of all components`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer defines at [39:09]: "If i have a vector u that has components u 1 through u n then the euclidean norm is the square root of the sum over all components of the square of that component."`,
    code: ``,
    images: ["image_1771901753185_0.png"],
    tags: ["Formula"],
    source: `lectures/cg-02-lecture-quiz.md`,
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

export default function Lec2Part1Quiz() {
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

  const STORE = 'quiz_lec2'
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
    const p = Math.round(s / (29 || 1) * 100)
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
          <Grid size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 2: Linear Algebra — Part 1</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Vectors, inner products, Gram-Schmidt, Fourier</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-02-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec2/1`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec2/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
          <a key={3} href={`${BASE}/lec2/3`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 3</a>
          </div>
          <p style={{ color: C.accent, fontWeight: 600 }}>QQF1–QQ29 · 32 questions (29 graded + 3 open)</p>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>29</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Graded MCQ</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>3</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Open / Reveal</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>~10min</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Est. Time</div></div>
          </div>
        </div>

        <button style={btn({ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' })}
          onClick={() => { setScreen('quiz'); start() }}>
          <Grid size={20} /> Start Quiz
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
          <div style={{ fontSize: '1.2rem', color: C.muted, marginBottom: '0.75rem' }}>{score} / 29 MCQ correct</div>
          <div style={{ color: '#475569', fontSize: '0.875rem' }}>+ 3 open questions (self-assessed)</div>
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
              <Grid size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 2: Linear Algebra — Part 1</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-02-lecture-quiz.md.</p>
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
              {qIdx < 32-1 ? 'Next Question' : 'View Results'} <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
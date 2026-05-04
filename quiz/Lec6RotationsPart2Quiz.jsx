'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, RotateCw } from 'lucide-react'

// Source: lectures/cg-06-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 6: 3D Rotations — Part 2 · QQ33–QQ60 · 28 questions (28 MCQ, 0 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-06-lecture-quiz.md 6

const quizData = [
  {
    id: 33,
    qid: `Q33`,
    qtype: `HISTORICAL`,
    format: `mcq`,
    timestamp: `40:09`,
    question: `According to the lecture, who discovered quaternions?`,
    options: [`Euler`, `Hamilton`, `Gauss`, `Lagrange`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [40:03]: "The person who figured this out is a mathematician named hamilton" and continues with the story of Hamilton's discovery.`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 34,
    qid: `Q34`,
    qtype: `HISTORICAL`,
    format: `mcq`,
    timestamp: `40:50`,
    question: `What was Hamilton's key insight about representing 3D rotations?`,
    options: [`That 4 components, not 3, are needed to represent 3D rotations like complex numbers`, `That 3D rotations can be reduced to a series of 2D rotations`, `That 3D rotations can be represented by 3×3 matrices`, `That Euler angles are the best representation`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [40:50], the lecturer explains Hamilton's insight: "In order to represent rotations like complex numbers i actually need four components and not just three."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 35,
    qid: `Q35`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `41:37`,
    question: `How should the four components of a quaternion be conceptualized according to the lecturer?`,
    options: [`As the four corners of a tetrahedron`, `As homogeneous coordinates in projective space`, `As one real component and three imaginary components that encode points in 3D space`, `As four separate rotation angles`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [41:37]: "The right way to think about these if you want to get your head around using quaternions for three-dimensional geometry is to imagine that the last three components the so-called imaginary components are used to encode points in three-dimensional space."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 36,
    qid: `Q36`,
    qtype: `ALGEBRAIC`,
    format: `mcq`,
    timestamp: `43:44`,
    question: `What are the basic algebraic rules for quaternion multiplication presented in the lecture?`,
    options: [`i² = -1, j² = 1, k² = -1, ijk = 1`, `i² = j² = k² = ijk = -1`, `i² = j² = k² = 1, ijk = -1`, `i² = j² = k² = ijk = 1`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [43:44], the lecturer states: "We have this rule i squared is equal to minus 1 j squared is equal to minus 1 k squared is equal to -1 and then the interesting part i times j times k is also going to give us back this minus one direction."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 37,
    qid: `Q37`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `44:23`,
    question: `What important property of quaternion multiplication distinguishes it from complex multiplication?`,
    options: [`Quaternion multiplication is not associative`, `Quaternion multiplication does not preserve norms`, `Quaternion multiplication is not distributive`, `Quaternion multiplication is not commutative`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explicitly states at [44:23]: "With quaternions not the case if i have two quaternions q and p then qp is not generally equal to pq."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 38,
    qid: `Q38`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `45:28`,
    question: `Why does it make sense that quaternion multiplication is not commutative?`,
    options: [`Because quaternions use three imaginary units`, `Because quaternions represent four-dimensional objects`, `Because Hamilton defined them that way`, `Because 3D rotations are not commutative`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [45:28]: "Rotations are not commutative and so if the whole point is that quaternions are supposed to represent rotations boy they had better not be commutative either right so it's it's really natural that this this happens."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 39,
    qid: `Q39`,
    qtype: `FORMULA`,
    format: `mcq`,
    timestamp: `48:54`,
    question: `What simplified form does the quaternion product take when applied to two vectors in R³?`,
    options: [`The cross product minus the dot product (as a quaternion)`, `The cross product plus the dot product (as a quaternion)`, `Only the dot product of the vectors`, `Only the cross product of the vectors`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [48:54], the lecturer states: "For vectors in r3 this gets even simpler... the quaternion product of u and v is u cross v minus u dot v."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 40,
    qid: `Q40`,
    qtype: `FORMULA`,
    format: `mcq`,
    timestamp: `50:33`,
    question: `How does the lecture express a 3D rotation using quaternions?`,
    options: [`q̄ × x × q`, `q × x × q̄`, `q⁻¹ × x × q`, `q × x × q⁻¹`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [50:33], the lecturer states: "Consider a vector x from r3 a vector that just has these three imaginary components and a unit quaternion q meaning a quaternion where the four components a b c d have norm one... then we can express a rotation as q bar x q."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 41,
    qid: `Q41`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `51:29`,
    question: `What does q̄ (q bar) represent for a quaternion?`,
    options: [`The quaternion with unchanged real part and negated imaginary parts`, `The quaternion with negated real part and unchanged imaginary parts`, `The transpose of the quaternion matrix`, `The multiplicative inverse of the quaternion`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [51:29]: "Q bar means i keep the real component as is and i negate the three imaginary components another kind of reflection."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 42,
    qid: `Q42`,
    qtype: `FORMULA`,
    format: `mcq`,
    timestamp: `52:14`,
    question: `How do you construct a quaternion that represents a rotation around axis u by angle θ?`,
    options: [`sin(θ/2)·u`, `cos(θ) + sin(θ)·u`, `cos(θ) + u`, `cos(θ/2) + sin(θ/2)·u`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [52:14], the lecturer provides the formula: "The quaternion q representing rotation around the axis u by the angle theta is nothing more than q is equal to cosine theta over two plus sine theta over two times the axis u."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 43,
    qid: `Q43`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `54:01`,
    question: `What does SLERP stand for in the context of quaternions?`,
    options: [`Spherical Linear Interpolation`, `Spherical Linear Extrapolation`, `Special Linear Representation`, `Smooth Linear Rotation Procedure`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [54:01]: "What we can do instead with our quaternions is use the formula which for some reason has become known as slurp spherical linear interpolation."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 44,
    qid: `Q44`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `55:30`,
    question: `What advantage does the lecturer highlight about quaternion interpolation using SLERP?`,
    options: [`It requires less memory than matrix interpolation`, `It can represent rotations larger than 360 degrees`, `It's computationally faster than other methods`, `It provides nice smooth interpolation with minimal wiggling between poses`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [55:30], the lecturer states: "If you do this you'll get nice smooth interpolation kind of the interpolation between the two poses that wiggles the least as you rotate from one to the other."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 45,
    qid: `Q45`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `55:55`,
    question: `What graphics application of complex numbers does the lecturer highlight?`,
    options: [`Animation of 2D characters`, `Rendering transparent objects`, `Lighting calculations`, `Texture mapping on curved surfaces`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [55:55], the lecturer explains: "One that they show up over and over and over again is generating coordinates for texture maps so if you have a curved surface and you want to map a image onto it a texture or a pattern what you need to do is find some way of laying it out and it's flattening it out in the plane."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 46,
    qid: `Q46`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `56:12`,
    question: `What property makes complex numbers particularly useful for texture mapping?`,
    options: [`They minimize distortion of straight lines`, `They guarantee no overlap in the mapping`, `They preserve areas during mapping`, `They preserve angles (conformal mapping)`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [56:35], the lecturer states: "Complex numbers are the natural language for talking about these kinds of conformal texture maps" after explaining at [56:18] that: "You'd like things like okay if i have two right angles on my pattern on my texture those should also show up as right angles on my curved surface."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 47,
    qid: `Q47`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `57:19`,
    question: `What mathematical visualization technique involving complex numbers does the lecturer describe as "beautiful"?`,
    options: [`Fractal generation through iterative processes`, `Phase portraits of differential equations`, `Streamline visualization of vector fields`, `Contour plots of complex functions`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [57:19], the lecturer describes: "The classic version of this is to use complex numbers you iterate some process on a complex number to determine is that initial point in the plane inside or outside the fractal set."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 48,
    qid: `Q48`,
    qtype: `ADVANCED`,
    format: `mcq`,
    timestamp: `58:13`,
    question: `What advanced representation of rotations does the lecturer mention but not cover in detail?`,
    options: [`Dual quaternions`, `Homogeneous matrices`, `Lie algebras and Lie groups`, `Spin groups`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [58:13]: "One that we won't cover today because it takes a while to really get into is the perspective of lead algebras and lead groups."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 49,
    qid: `Q49`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `58:42`,
    question: `What capability do Lie algebras have that quaternions don't, according to the lecture?`,
    options: [`They can encode very large angles (much larger than 2π)`, `They can represent rotations in dimensions higher than 3`, `They don't suffer from gimbal lock`, `They require fewer parameters`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [58:42], the lecturer explains: "Something that is different from quaternions is it lets you encode very large angles angles much larger than 2 pi."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 50,
    qid: `Q50`,
    qtype: `STATISTICAL`,
    format: `mcq`,
    timestamp: `58:48`,
    question: `What statistical application of rotation representations does the lecturer mention?`,
    options: [`Clustering rotations into similar groups`, `Finding the most likely rotation given noisy data`, `Calculating the standard deviation of rotations`, `Computing the mean or average of multiple rotations`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [58:54], the lecturer asks: "Let's say i've taken a measurement of some object and i have some noise i have several different candidates for what its rotation look like what does it even mean to talk about the mean rotation."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 51,
    qid: `Q51`,
    qtype: `IMPLEMENTATION`,
    format: `mcq`,
    timestamp: `59:20`,
    question: `What operations does the lecture mention are used to convert between rotation representations?`,
    options: [`Exponential and logarithmic maps`, `Congruency and similarity transformations`, `Projection and embedding`, `Factorization and normalization`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [59:20]: "You have something called the exponential map that takes you from basically an axis angle rotation to a rotation matrix and you have an inverse operation called the logarithmic map that takes you from a rotation matrix to its axis angle form."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 52,
    qid: `Q52`,
    qtype: `PHILOSOPHICAL`,
    format: `mcq`,
    timestamp: `1:00:40`,
    question: `What is the lecturer's position on the "right" way to represent rotations?`,
    options: [`Quaternions are always the best representation`, `Euler angles should be avoided at all costs`, `There is no single right or best way to work with rotations`, `Matrices are more fundamental and should be preferred`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:00:40], the lecturer emphasizes: "The most important thing is to acknowledge that there is no right or best way to work with rotations or honestly anything else people can get really really religious about this."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 53,
    qid: `Q53`,
    qtype: `ADVICE`,
    format: `mcq`,
    timestamp: `1:00:51`,
    question: `What advice does the lecturer give regarding different rotation representations?`,
    options: [`Only use quaternions for professional graphics work`, `Learn about all of them to increase your capabilities`, `Focus only on the one representation that makes most sense to you`, `Avoid complex representations unless absolutely necessary`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer advises at [1:00:51]: "The answer is you want to know about all of them the more you know the more you'll be able to do the more viewpoints you have the more people you'll be able to talk to plus all this stuff is super cool and really fun to learn about."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 54,
    qid: `Q54`,
    qtype: `PREVIEW`,
    format: `mcq`,
    timestamp: `1:01:11`,
    question: `What topic does the lecturer preview for the next lecture?`,
    options: [`Perspective and texture mapping`, `Quaternion algebras`, `Ray tracing algorithms`, `Mesh generation techniques`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:01:11], the lecturer states: "Next time we will talk about perspective and texture mapping which is kind of the next chapter in our saga of the rasterization pipeline."`,
    code: ``,
    images: ["lec6_slide_33.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 55,
    qid: `Q55`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `47:15`,
    question: `How does the lecturer suggest encoding a 3D point as a quaternion?`,
    options: [`As x + yi + zj + k`, `As 1 + xi + yj + zk`, `As xi + yj + zk`, `As 0 + xi + yj + zk`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [47:15], the lecturer specifies: "If i start out with a point in three-dimensional space just x y z to encode that as a quaternion i'm just going to write 0 plus x i plus yj plus zk i'm not going to have any component in the real direction in the direction 1."`,
    code: ``,
    images: ["lec6_slide_33.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 56,
    qid: `Q56`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `47:45`,
    question: `How does the lecturer suggest conceptualizing quaternions for simplicity?`,
    options: [`As a scalar-vector pair`, `As a point in 4D space`, `As an angle and a direction vector`, `As four separate components`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [47:45]: "Rather than writing out the three components every time i could just imagine that a quaternion is a pair involving a scalar and a three-dimensional vector."`,
    code: ``,
    images: ["lec6_slide_33.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 57,
    qid: `Q57`,
    qtype: `RELATIONSHIP`,
    format: `mcq`,
    timestamp: `49:32`,
    question: `What relationship between standard vector operations does the quaternion product reveal?`,
    options: [`It combines the dot product and cross product`, `It combines vector projection and rejection`, `It combines addition and subtraction`, `It combines scalar multiplication and vector addition`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [49:32], the lecturer points out: "What that means is that the quaternion product actually includes or subsumes both the dot product and the cross product."`,
    code: ``,
    images: ["lec6_slide_33.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 58,
    qid: `Q58`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `59:56`,
    question: `How does the lecturer characterize the difference between 2D and 3D rotations?`,
    options: [`2D rotations are unique while 3D rotations are ambiguous`, `2D rotations are continuous while 3D rotations are discrete`, `2D rotations are trivial while 3D rotations are extremely rich`, `2D rotations are linear while 3D rotations are non-linear`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [59:56], the lecturer states: "You hopefully get the feeling that rotations are surprisingly complicated once we go from 2d to 3d 2d is pretty trivial 3d is extremely rich."`,
    code: ``,
    images: ["lec6_slide_33.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 59,
    qid: `Q59`,
    qtype: `INVARIANT`,
    format: `mcq`,
    timestamp: `01:21`,
    question: `What distinguishes a rotation from a reflection according to the lecturer?`,
    options: [`Rotations preserve orientation while reflections reverse it`, `Rotations preserve the origin while reflections don't`, `Rotations preserve lengths but reflections don't`, `Rotations preserve angles but reflections don't`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [01:21], the lecturer explains: "Also orientation is preserved so text remains readable i can still read the text from left to right and it makes sense this is different from what happens if i hold up the book in the mirror right if i hold it in a mirror the text is flipped around this is a reflection in the mirror."`,
    code: ``,
    images: ["lec6_slide_33.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 60,
    qid: `Q60`,
    qtype: `EXAMPLE`,
    format: `mcq`,
    timestamp: `26:02`,
    question: `What happens when the imaginary unit i is applied four times in sequence?`,
    options: [`The result is a 360° rotation, returning to the original vector`, `The result becomes undefined`, `The result becomes a pure imaginary number`, `The result is a diagonal reflection`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [26:02], the lecturer states: "If we apply i again then we get i cubed is equal to minus i and if we do it again we get back to one and around and around we go."`,
    code: ``,
    images: ["lec6_slide_33.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
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

export default function Lec6Part2Quiz() {
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
    accent: '#f472b6', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec6'
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
    const p = Math.round(s / (28 || 1) * 100)
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
          <RotateCw size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 6: 3D Rotations — Part 2</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Euler angles, rotation matrices, quaternions, exponential maps</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-06-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec6/1`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec6/2`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 2</a>
          </div>
          <p style={{ color: C.accent, fontWeight: 600 }}>QQ33–QQ60 · 28 questions (28 graded + 0 open)</p>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>28</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Graded MCQ</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>0</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Open / Reveal</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>~9min</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Est. Time</div></div>
          </div>
        </div>

        <button style={btn({ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' })}
          onClick={() => { setScreen('quiz'); start() }}>
          <RotateCw size={20} /> Start Quiz
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
          <div style={{ fontSize: '1.2rem', color: C.muted, marginBottom: '0.75rem' }}>{score} / 28 MCQ correct</div>
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
              <RotateCw size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 6: 3D Rotations — Part 2</span>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', color: C.muted, fontSize: '0.875rem', alignItems: 'center' }}>
              <span><Clock size={14} style={{ display:'inline', verticalAlign:'middle', marginRight:'0.25rem' }} />{formatTime(t)}</span>
              <span>{qIdx+1}/28</span>
              <span style={{ color: C.accent }}>✓ {score}</span>
            </div>
          </div>
          <div style={{ height: '5px', background: C.border, borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.round((qIdx+1)/28*100)}%`, background: C.accent, transition: 'width 0.3s' }} />
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-06-lecture-quiz.md.</p>
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
              {qIdx < 28-1 ? 'Next Question' : 'View Results'} <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
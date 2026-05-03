'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Search } from 'lucide-react'

// Source: lectures/cg-12-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 12: Geometric Queries — Part 1 · Q1–Q32 · 32 questions
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-12-lecture-quiz.md 12

const quizData = [
  {
    id: 1,
    timestamp: `00:00`,
    question: `What is the primary focus of this lecture on geometric queries?`,
    options: [`Creating new geometric objects in space`, `Finding relationships between geometric objects such as closest points and intersections`, `Different ways to render geometric objects`, `Mathematical proofs about geometric objects`],
    answer: 1,
    intuition: ``,
    explanation: `At [00:24] the lecturer explains: "Today we want to talk more about how do we answer specific queries about geometry things like the distance to a point or the intersection with array."`,
    code: ``,
    images: ["lec12_slide_10.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 2,
    timestamp: `01:04`,
    question: `What problem in geometry processing motivates the study of closest point queries?`,
    options: [`The need to reduce polygon count`, `The desire to create smoother surfaces`, `Signal degradation during mesh processing operations`, `Converting between different file formats`],
    answer: 2,
    intuition: ``,
    explanation: `At [01:24] the lecturer states: "Even if we're very careful about how we implement each of these operations what happens over time is that the signal degrades so it becomes something that looks very different from what we started with we get aliasing."`,
    code: ``,
    images: ["lec12_slide_16.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 3,
    timestamp: `01:56`,
    question: `What solution is proposed to help preserve shape fidelity after mesh processing?`,
    options: [`Storing higher-resolution versions of the mesh`, `Using implicit instead of explicit surfaces`, `Pushing processed vertices back onto the original surface via closest point projection`, `Using specialized file formats that preserve geometric information`],
    answer: 2,
    intuition: ``,
    explanation: `At [02:16] the lecturer describes: "What I could try doing is taking every vertex of my newly processed mesh right the one where I'm starting to lose signal fidelity and I could take each vertex and I could try to push it back onto the original surface."`,
    code: ``,
    images: ["lec12_slide_17.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 4,
    timestamp: `03:02`,
    question: `What is the core problem of closest point queries?`,
    options: [`How to determine if a point is inside or outside a surface`, `How to find the point on a surface that is closest to a given query point`, `How to measure the surface area of a mesh`, `How to determine if two meshes intersect`],
    answer: 1,
    intuition: ``,
    explanation: `At [03:02] the lecturer states: "Given a point in space let's say we have a sample point P how do we find the closest point on the surface."`,
    code: ``,
    images: ["lec12_slide_09.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 5,
    timestamp: `04:45`,
    question: `What types of geometric queries beyond closest point are mentioned in the lecture?`,
    options: [`Only triangulation queries`, `Only surface smoothing queries`, `Only mesh simplification queries`, `Intersection, inside/outside, and containment queries`],
    answer: 3,
    intuition: ``,
    explanation: `At [04:51] the lecturer mentions: "We might like to know other things like do two triangles intersect and if they do intersect where and how do they intersect we might want to know are we inside of an object or outside the object we might want to know does one object contain another."`,
    code: ``,
    images: ["lec12_slide_10.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 6,
    timestamp: `06:07`,
    question: `In the "closest point on point" warm-up exercise, what is the answer to finding the closest point to P on point A?`,
    options: [`The midpoint between P and A`, `Point A itself`, `There is no unique answer`, `The origin of the coordinate system`],
    answer: 1,
    intuition: ``,
    explanation: `At [06:38] the lecturer states: "This is a vacuous question right the obviously the only point there is is the point a so the closest point to P is a."`,
    code: ``,
    images: ["lec12_slide_06.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 7,
    timestamp: `07:28`,
    question: `How is a line described implicitly in the lecture?`,
    options: [`As a set of two endpoints`, `As a parametric equation`, `As an equation n^T x = C, where n is the unit normal`, `As a set of connected vertices`],
    answer: 2,
    intuition: ``,
    explanation: `At [07:35] the lecturer describes a line as: "A line described by the implicit equation and transpose x equals C where n is the unit normal vector for this line."`,
    code: ``,
    images: ["lec12_slide_20.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 8,
    timestamp: `09:19`,
    question: `What is the key insight used to derive the closest point on a line?`,
    options: [`Moving in the normal direction from the query point until hitting the line`, `Computing the intersection of two lines`, `Finding the midpoint between the query point and the line`, `Applying the cross product between vectors`],
    answer: 0,
    intuition: ``,
    explanation: `At [09:41] the lecturer explains: "If I start at P and I move in the normal direction by some distance or I move in - the normal direction by some distance T then eventually I'll get to the line."`,
    code: ``,
    images: ["lec12_slide_18.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 9,
    timestamp: `11:06`,
    question: `What is the expression for the closest point on a line to a given point P?`,
    options: [`P + (C - n^T P)n`, `P - (C - n^T P)n`, `P + Cn`, `n^T P`],
    answer: 0,
    intuition: ``,
    explanation: `At [11:06] the lecturer gives the final formula: "Start at P move this particular distance T in the direction N and I get P plus C minus n transpose P n."`,
    code: ``,
    images: ["lec12_slide_09.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 10,
    timestamp: `11:36`,
    question: `When finding the closest point on a line segment, what two problems is this broken down into?`,
    options: [`Finding closest points to the two endpoints only`, `Finding closest point to the line and checking if it's on the segment`, `Finding whether the point is above or below the line`, `Checking if the point is collinear with the segment`],
    answer: 1,
    intuition: ``,
    explanation: `At [12:24] the lecture explains: "We know how to find the closest point to a point like the end points we know how to find the closest point to a line okay and we just have to do a little more work to combine these two steps."`,
    code: ``,
    images: ["lec12_slide_13.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 11,
    timestamp: `13:30`,
    question: `What are the two main cases identified when finding the closest point on a line segment?`,
    options: [`Points above the line and points below the line`, `Points closer to the start of the segment and points closer to the end`, `Points where the closest point is an endpoint and points where it's on the interior`, `Points with positive parameter values and points with negative parameter values`],
    answer: 2,
    intuition: ``,
    explanation: `At [13:30] the lecture identifies: "What you notice is there really are these two different cases points that are kind of off one end of the line segment or the other for those query points it's pretty clear the closest point is an end point of the line for points in the middle the closest point is some interior point of the segment."`,
    code: ``,
    images: ["lec12_slide_13.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 12,
    timestamp: `15:49`,
    question: `What does the parameter T represent when used for testing whether a point on a line is within a segment?`,
    options: [`The angle between the line and the x-axis`, `The distance from the query point to the line`, `How far along the line we walk from point A toward point B`, `The normal distance to the line`],
    answer: 2,
    intuition: ``,
    explanation: `At [15:49] the lecturer clarifies: "T in this case is just a parameter that tells us how far along the line do we walk from A to B or from a toward B."`,
    code: ``,
    images: ["lec12_slide_15.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 13,
    timestamp: `16:01`,
    question: `What range of T values indicates that a point is contained within a line segment?`,
    options: [`T < 0`, `T > 1`, `0 ≤ T ≤ 1`, `-1 ≤ T ≤ 1`],
    answer: 2,
    intuition: ``,
    explanation: `At [16:01] the lecturer states: "What we know is that as long as T is between 0 and 1 this point is inside the segment right if the closest point on the line has a T value between 0 and 1 it's inside the segment."`,
    code: ``,
    images: ["lec12_slide_13.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 14,
    timestamp: `16:53`,
    question: `What strategy does the lecture use to build up complexity in geometric queries?`,
    options: [`Starting with complex 3D cases and simplifying to 2D`, `Starting with simple elements (points) and building up to more complex ones (triangles, meshes)`, `Starting with ray tracing and moving to closest point problems`, `Beginning with meshes and breaking them down into components`],
    answer: 1,
    intuition: ``,
    explanation: `At [16:53] the lecturer explains: "We're going to keep building this up more and more and more basically you start to see the strategy that we answer a very very stupidly simple question what is the closest point to a point then we say what's the closest point to an edge and we use our closest point to a point and line to figure out that and then we can say well what's the closest point to a triangle."`,
    code: ``,
    images: ["lec12_slide_30.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 15,
    timestamp: `17:37`,
    question: `What are the possible locations for the closest point on a triangle to a query point in 2D?`,
    options: [`Only at the vertices of the triangle`, `Only on the edges of the triangle`, `Only in the interior of the triangle`, `On a vertex, on an edge, or in the interior if the query point is inside the triangle`],
    answer: 3,
    intuition: ``,
    explanation: `At [17:54] and [18:16] the lecturer identifies all cases: "The closest point on the triangle might be a vertex of the triangle or it might be an edge of the triangle... we could have a query point that is actually inside the triangle."`,
    code: ``,
    images: ["lec12_slide_10.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 16,
    timestamp: `19:01`,
    question: `What connection does the lecturer make between the point-in-triangle test and earlier assignments?`,
    options: [`It's identical to the mesh simplification algorithm`, `It's the inverse of the ray-tracing algorithm`, `It's the same test used in the rasterization assignment`, `It's unrelated to previous assignments`],
    answer: 2,
    intuition: ``,
    explanation: `At [19:01] the lecturer states: "How would I check if a points inside of a triangle hopefully you have a pretty good answer to that question because it's exactly what you implemented in a1 right every time you rasterized a triangle you were checking if sample points were inside a triangle."`,
    code: ``,
    images: ["lec12_slide_09.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 17,
    timestamp: `19:44`,
    question: `What is the first step in finding the closest point on a triangle in 3D?`,
    options: [`Checking if the query point is one of the triangle vertices`, `Computing the distance to each edge`, `Projecting the query point onto the plane of the triangle`, `Transforming the triangle into 2D coordinates`],
    answer: 2,
    intuition: ``,
    explanation: `At [20:36] the lecturer explains: "First I'm gonna do something that's very similar to how I found the closest point on a line segment I'm gonna first take that point and I'm gonna project it on to the plane of the triangle."`,
    code: ``,
    images: ["lec12_slide_15.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 18,
    timestamp: `21:24`,
    question: `What method does the lecturer suggest for testing if a projected point is inside a 3D triangle?`,
    options: [`Using a 2D coordinate transformation`, `Using half-space tests`, `Using the Möller–Trumbore algorithm`, `Using a specialized triangle-point distance formula`],
    answer: 1,
    intuition: ``,
    explanation: `At [21:36] the lecturer states: "Rather than doing half plane tests like you did in your rasterizer I can now do half space tests alright so given the the query point I can see if is it on the intersection of three half spaces whose intersection is this solid wedge that looks like the triangle kind of extruded up and down."`,
    code: ``,
    images: ["lec12_slide_09.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 19,
    timestamp: `22:28`,
    question: `How does the closest point on a plane calculation relate to the closest point on a line?`,
    options: [`They use completely different formulas`, `The plane case requires a complex 3D transformation`, `The expression is exactly the same, just with 3D vectors instead of 2D`, `The plane case is a special case of the line calculation`],
    answer: 2,
    intuition: ``,
    explanation: `At [23:41] the lecturer notes: "From then on all the calculations we did for the line immediately generalize to the plane right the line was just a linear subspace of the plane the plane in this case is a linear subspace of three-dimensional space they're both one dimension smaller than the space they sit in everything works out the same."`,
    code: ``,
    images: ["lec12_slide_15.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 20,
    timestamp: `24:23`,
    question: `What is the naive algorithm for finding the closest point on a triangle mesh?`,
    options: [`Use a binary search tree to find the closest triangle`, `Project the point onto each triangle and keep track of the closest result`, `Only check triangles in the approximate region of the query point`, `Use a specialized data structure to avoid checking all triangles`],
    answer: 1,
    intuition: ``,
    explanation: `At [25:12] the lecture explains: "For each closest point on each triangle we compute the distance from P to the closest point if the new distance is smaller than the previous distance then that becomes our new closest point."`,
    code: ``,
    images: ["lec12_slide_16.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 21,
    timestamp: `25:38`,
    question: `What is the computational complexity of the naive closest point on mesh algorithm?`,
    options: [`O(log n) where n is the number of triangles`, `O(n) where n is the number of triangles`, `O(n²) where n is the number of triangles`, `O(1) constant time`],
    answer: 1,
    intuition: ``,
    explanation: `At [25:44] the lecturer states: "If I have n triangles in my mesh how much computation am i doing well hopefully it's pretty clear that it's order n right it's big o of n I have to check every single triangle in this algorithm."`,
    code: ``,
    images: ["lec12_slide_10.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 22,
    timestamp: `26:52`,
    question: `What alternative representation does the lecturer suggest for closest point queries?`,
    options: [`Octrees`, `Implicit surfaces, particularly distance fields`, `Point clouds`, `Bounding volume hierarchies`],
    answer: 1,
    intuition: ``,
    explanation: `At [27:49] the lecturer explains: "Now actually we're going to be a little more specialized here and we're going to say the value at any point is not just one or zero the value is actually going to give us the distance to the surface."`,
    code: ``,
    images: ["lec12_slide_17.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 23,
    timestamp: `28:50`,
    question: `What method does the lecturer suggest for finding the closest point on an implicit surface?`,
    options: [`Bisection search`, `Gradient descent using the distance field`, `Marching cubes`, `Monte Carlo sampling`],
    answer: 1,
    intuition: ``,
    explanation: `At [29:17] the lecturer describes: "I'm going to compute the gradient of the distance or minus the gradient of the distance I could do this using any technique like I could use finite differences on my grid and then I could take a little step in the gradient direction that'll bring me closer to the surface."`,
    code: ``,
    images: ["lec12_slide_17.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 24,
    timestamp: `30:30`,
    question: `What trade-off does the lecturer discuss regarding closest point queries on distance fields?`,
    options: [`Accuracy versus speed`, `Speed versus memory (precomputation)`, `Robustness versus complexity`, `Implementation difficulty versus quality`],
    answer: 1,
    intuition: ``,
    explanation: `At [30:30] the lecturer says: "So we can make a trade-off between speed and memory do we just want to store the Distin values and run a little algorithm to get the closest point or do we want to just store the cached result directly but now we have to store more data."`,
    code: ``,
    images: ["lec12_slide_17.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 25,
    timestamp: `31:52`,
    question: `What is a ray in the context of geometric queries?`,
    options: [`A line without any particular direction`, `A line segment with a specific length`, `An oriented line or oriented line segment with a starting point and direction`, `A light source with a specific intensity`],
    answer: 2,
    intuition: ``,
    explanation: `At [32:13] the lecturer defines: "When I say array I just mean an oriented line or oriented line segment starting at a point so you could really think about a ray of light traveling from the Sun it's not like a line but a line is this whole infinite line that goes in both directions whereas array has a definite starting point and a definite direction."`,
    code: ``,
    images: ["lec12_slide_18.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 26,
    timestamp: `33:33`,
    question: `What is one way ray-mesh intersection can be used for inside-outside testing?`,
    options: [`By measuring the total distance traveled by the ray`, `By counting the number of intersections with the surface (even vs. odd)`, `By measuring the angle between the ray and the surface`, `By determining if the ray is reflected or refracted`],
    answer: 1,
    intuition: ``,
    explanation: `At [33:50] the lecturer explains: "If I'm inside a surface the Ray has to pierce the surface an odd number of times to leave it if I'm outside the surface it has to pierce an even number of times."`,
    code: ``,
    images: ["lec12_slide_10.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 27,
    timestamp: `34:31`,
    question: `How are ray-mesh intersections used for shadow testing?`,
    options: [`By measuring the intensity of light at the intersection point`, `By counting the number of surfaces between light and a point`, `By determining if a ray from a point to a light source hits anything along the way`, `By tracking the reflections off multiple surfaces`],
    answer: 2,
    intuition: ``,
    explanation: `At [34:37] the lecturer explains: "If I want to see is a point in shadow or is it visible from the Sun well I just have to shoot a ray to the Sun or from the Sun to the point and see did it hit anything or not if it didn't hit anything then there's a lot of light shining on that point if it hits something that that point is in shadow."`,
    code: ``,
    images: ["lec12_slide_18.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 28,
    timestamp: `36:02`,
    question: `How is a ray mathematically expressed in the lecture?`,
    options: [`R(t) = O + tD where D is a unit vector`, `R(t) = O × D where × is the cross product`, `R(t) = O · D where · is the dot product`, `R(t) = |O - D| where | | is the magnitude`],
    answer: 0,
    intuition: ``,
    explanation: `At [36:24] the lecturer gives the equation: "What is R of T well it's we start at the origin and for time T we walk in the direction D o plus TD okay so that's our Ray equation."`,
    code: ``,
    images: ["lec12_slide_19.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 29,
    timestamp: `37:22`,
    question: `What is the general strategy for finding where a ray intersects an implicit surface?`,
    options: [`Convert the implicit surface to an explicit representation first`, `Substitute the ray equation into the implicit surface equation and solve for t`, `Use numerical integration along the ray path`, `Apply the closest point algorithm repeatedly`],
    answer: 1,
    intuition: ``,
    explanation: `At [37:22] the lecturer explains: "What we can do is just replace our with X and then solve for T values such that f of X is equal to zero right our implicit function f is a test that asks is the point x on the surface."`,
    code: ``,
    images: ["lec12_slide_20.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 30,
    timestamp: `38:15`,
    question: `What is the implicit equation for a unit sphere?`,
    options: [`|x|² = 1`, `|x|² - 1 = 0`, `|x| = 1`, `|x| - 1 = 0`],
    answer: 1,
    intuition: ``,
    explanation: `At [38:22] the lecturer states: "The function f is just f of X is the norm of x squared minus 1 any point that has unit norm will evaluate to 0 those points are on the sphere."`,
    code: ``,
    images: ["lec12_slide_20.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 31,
    timestamp: `39:32`,
    question: `What type of equation results from finding the intersection of a ray with a sphere?`,
    options: [`Linear equation`, `Quadratic equation`, `Cubic equation`, `Exponential equation`],
    answer: 1,
    intuition: ``,
    explanation: `At [39:32] the lecturer states: "If we call norm of d squared a to OD is B and norm of o squared minus one is C then we have a quadratic equation for T we just have a T squared plus BT plus C is equal to zero."`,
    code: ``,
    images: ["lec12_slide_20.png"],
    tags: [],
    source: `lectures/cg-12-lecture-quiz.md`,
  },
  {
    id: 32,
    timestamp: `40:47`,
    question: `When considering ray-sphere intersection, what is the geometric meaning of having two solutions to the quadratic equation?`,
    options: [`The ray completely misses the sphere`, `The ray is tangent to the sphere`, `The ray pierces the sphere twice (entering and exiting)`, `There's an error in the calculation`],
    answer: 2,
    intuition: ``,
    explanation: `At [41:29] the lecturer explains: "In the case that we show here on the bottom right it's pretty clear that the Ray pierces the sphere twice it goes into the sphere and then back out of the sphere ah those must be the two solutions to the quadratic equation."`,
    code: ``,
    images: ["lec12_slide_20.png"],
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

export default function Lec12Part1Quiz() {
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
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 12: Geometric Queries — Part 1</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>BVH, ray-triangle intersection, closest point queries</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-12-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec12/1`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec12/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
          </div>
          <p style={{ color: C.accent, fontWeight: 600 }}>Q1–Q32 · 32 questions</p>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>32</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Questions</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>~10min</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Est. Time</div></div>
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
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 12: Geometric Queries — Part 1</span>
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
              {qIdx < 32-1 ? 'Next Question' : 'View Results'} <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Layers } from 'lucide-react'

// Source: lectures/cg-11-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 11: Geometry Processing · Q1–Q27 · 27 questions
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-11-lecture-quiz.md 11

const quizData = [
  {
    id: 1,
    timestamp: `00:19`,
    question: `What was the main simplifying assumption about shapes discussed at the beginning of the lecture?`,
    options: [`That all shapes can be represented as quadrilaterals`, `That shapes are manifold and can be locally stretched into the Euclidean plane`, `That all shapes must have regular vertex degree`, `That shapes must be convex`],
    answer: 1,
    intuition: ``,
    explanation: `The lecturer states at [00:40]: "Our main assumption was to assume that the shapes we're working with are manifold that in some sense each little tiny piece of our shape can be stretched out into the euclidean plane."`,
    code: ``,
    images: ["lec11_slide_21.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 2,
    timestamp: `00:58`,
    question: `What defines a manifold polygon mesh in terms of its connectivity?`,
    options: [`It has exactly six edges per vertex`, `It has no boundary edges`, `It has fans but not fins`, `It consists only of triangular faces`],
    answer: 2,
    intuition: ``,
    explanation: `The lecturer explains at [00:58]: "The connectivity of a polygon mesh is manifold if it has fans but not fins. So if we have just a single loop of polygons around every vertex and for every interior edge we just have two polygons containing that edge..."`,
    code: ``,
    images: ["lec11_slide_02.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 3,
    timestamp: `03:08`,
    question: `What technological developments make digital geometry processing particularly relevant now, according to the lecture?`,
    options: [`Decreasing computational costs and cloud computing`, `New visualization techniques for scientific data`, `Affordable hardware for 3D scanning and printing`, `Advancements in virtual reality interfaces`],
    answer: 2,
    intuition: ``,
    explanation: `The lecturer highlights at [03:08]: "Right now is an especially exciting time for geometry and geometry processing because we're starting to see all sorts of interesting and affordable hardware for dealing with geometry. So both bringing it into the computer and also taking digital geometry and turning it into real physical geometry."`,
    code: ``,
    images: ["lec11_slide_04.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 4,
    timestamp: `04:43`,
    question: `What are the main stages of the geometry processing pipeline as described in the lecture?`,
    options: [`Modeling, rendering, and animation`, `Acquisition, processing, and fabrication`, `Subdivision, simplification, and remeshing`, `Scanning, filtering, and visualization`],
    answer: 1,
    intuition: ``,
    explanation: `The lecturer describes at [04:55]: "Acquire it sample it turn it into a digital representation then process it in an algorithmic way and so edit it transform it analyze it. And then when we're happy with the changes we've made we print it back out again to give it some new function."`,
    code: ``,
    images: ["lec11_slide_03.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 5,
    timestamp: `06:01`,
    question: `According to the lecture, what distinguishes geometry reconstruction from image reconstruction?`,
    options: [`Geometry reconstruction only works on manifold shapes`, `Geometry reconstruction has more diverse input types, including point clouds, normals, and line density integrals`, `Geometry reconstruction produces only triangular meshes`, `Geometry reconstruction is only concerned with surface appearance`],
    answer: 1,
    intuition: ``,
    explanation: `The lecturer explains at [06:14]: "What are samples could be points or quite often what you have is a little richer information you might have points and normals at that point...You might have yet richer information...or line density integrals so in medical imaging if you're trying to image bone and tissue you have let's say MRI or CT scans which measure things like what is the total density of that material along a line through space."`,
    code: ``,
    images: ["lec11_slide_07.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 6,
    timestamp: `07:53`,
    question: `How does the lecture relate upsampling in geometry processing to a similar concept in image processing?`,
    options: [`Both use the same algorithms for implementation`, `Both focus on noise reduction first`, `Both are forms of increasing resolution, like zooming in on a texture map`, `Both produce artifacts that cannot be removed`],
    answer: 2,
    intuition: ``,
    explanation: `The lecturer states at [08:11]: "We've already looked at this a little bit for images right if I have a low resolution image and I want to up sample it that's kind of the same as zooming in on a texture map right."`,
    code: ``,
    images: ["lec11_slide_26.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 7,
    timestamp: `08:49`,
    question: `What is the goal of downsampling in geometry processing according to the lecture?`,
    options: [`To create simplified meshes for faster rendering that still preserve appearance`, `To remove noise from scanned geometry`, `To flatten irregular surfaces for texture mapping`, `To create a uniform triangle distribution`],
    answer: 0,
    intuition: ``,
    explanation: `The lecturer explains at [08:54]: "You want to find a coarser simpler mesh that's stored in a smaller file but in that process you still want to preserve the basic shape and appearance of the model."`,
    code: ``,
    images: ["lec11_slide_09.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 8,
    timestamp: `10:09`,
    question: `How does the lecture distinguish resampling from upsampling and downsampling?`,
    options: [`Resampling focuses on surface reconstruction`, `Resampling maintains the same number of elements but improves their quality`, `Resampling applies only to quad meshes`, `Resampling is used exclusively for texture coordinates`],
    answer: 1,
    intuition: ``,
    explanation: `The lecturer states at [10:23]: "We do this not to decrease the file size or increase the resolution but rather to improve the quality of individual polygons individual elements."`,
    code: ``,
    images: ["lec11_slide_10.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 9,
    timestamp: `10:59`,
    question: `According to the lecture, when does the shape of individual triangles matter most?`,
    options: [`During subdivision`, `When doing texture mapping`, `When solving equations on surfaces (like PDEs or simulations)`, `When visualizing the mesh`],
    answer: 2,
    intuition: ``,
    explanation: `The lecturer explains at [10:59]: "If I want to do rendering if I just want to visualize the surface then I want to use those polygons to get as much geometric detail as possible I don't really care so much about how the individual triangles in a mesh are shaped for instance but if I'm solving equations on a surface again if I'm solving partial differential equations for instance I'm doing simulation of some kind then I care very very much about what the shape of each polygon looks like."`,
    code: ``,
    images: ["lec11_slide_34.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 10,
    timestamp: `11:41`,
    question: `What filtering operations are available for polygon meshes as mentioned in the lecture?`,
    options: [`Only Gaussian blurring`, `Only edge-preserving filters`, `Curvature flow, bilateral filters, and spectral filtering`, `Only median filtering`],
    answer: 2,
    intuition: ``,
    explanation: `The lecturer states at [12:10]: "We have things like curvature flow there are generalizations of things like bilateral filters we can do spectral filterings to enhance features."`,
    code: ``,
    images: ["lec11_slide_11.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 11,
    timestamp: `12:27`,
    question: `According to the lecture, why is mesh compression more complicated than image compression?`,
    options: [`Meshes cannot be compressed without loss`, `Meshes have both position data and connectivity data`, `Meshes require specialized hardware for decompression`, `Meshes are always larger than images`],
    answer: 1,
    intuition: ``,
    explanation: `The lecturer explains at [13:24]: "Now for geometry say for polygon meshes compression gets a little more complicated because it's not just that we have to compress the positions right where things are in space but we also have this connectivity data that we don't have with images."`,
    code: ``,
    images: ["lec11_slide_12.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 12,
    timestamp: `14:34`,
    question: `What challenge of shape analysis did the lecturer highlight?`,
    options: [`Identifying which parts of a mesh correspond to specific real-world features`, `Converting between different mesh formats`, `Finding algorithms that work on non-manifold meshes`, `Determining the optimal compression rate`],
    answer: 0,
    intuition: ``,
    explanation: `The lecturer states at [15:13]: "I might take a raw list of polygons and try to break it up into meaningful pieces like oh these polygons correspond to the legs of the chair these correspond to the back of the chair."`,
    code: ``,
    images: ["lec11_slide_13.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 13,
    timestamp: `16:34`,
    question: `What is aliasing in the context of geometry as described in the lecture?`,
    options: [`When mesh elements have incorrect materials assigned`, `When a bad sampling and reconstruction makes a signal appear different than it actually is`, `When polygons have incorrect normal vectors`, `When vertex colors don't match the original model`],
    answer: 1,
    intuition: ``,
    explanation: `The lecturer defines at [16:34]: "It means that a bad sampling and then reconstruction of a signal can make it appear different than it actually is."`,
    code: ``,
    images: ["lec11_slide_15.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 14,
    timestamp: `17:56`,
    question: `According to the lecture, why is approximation of position alone insufficient for a good mesh?`,
    options: [`It causes rendering artifacts when using GPU acceleration`, `It prevents proper texture mapping`, `Even with perfect vertex positions, you can get wrong appearance, normals, surface area, and curvatures`, `It makes animation impossible`],
    answer: 2,
    intuition: ``,
    explanation: `The lecturer explains at [19:14]: "What can happen is we get even though we have these perfect vertex positions we get the wrong appearance the wrong surface area the wrong normals the wrong curvatures we can get everything wrong about the geometry even if the vertices are on the surface."
- QUESTIONS (continued):`,
    code: ``,
    images: ["lec11_slide_17.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 15,
    timestamp: `20:53`,
    question: `What property, beyond position approximation, does the lecturer emphasize as being important to preserve in a mesh?`,
    options: [`The number of triangles`, `The regularity of vertex degree`, `The normal vectors of the smooth surface`, `The triangle aspect ratio`],
    answer: 2,
    intuition: ``,
    explanation: `The lecturer states at [20:53]: "When we think about getting a good approximation of geometry we really need to consider other factors beyond the basic question of are the positions close for instance we'd like it to be the case that the normals of our polygon mesh are also close to the normals of the smooth surface."`,
    code: ``,
    images: ["lec11_slide_17.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 16,
    timestamp: `22:24`,
    question: `What is the Delaunay property of a triangle mesh as described in the lecture?`,
    options: [`Every vertex has exactly six neighbors`, `Each triangle's circumcircle contains no other vertices inside it`, `All triangles have equal area`, `All edges have equal length`],
    answer: 1,
    intuition: ``,
    explanation: `The lecturer explains at [22:30]: "If I have a triangle mesh in the plane then I can look at the circum circle of every triangle so for each triangle I have a unique circle passing through the three vertices and a mesh is delaunay if the circles are empty meaning they have no vertices on their interior."`,
    code: ``,
    images: ["lec11_slide_18.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 17,
    timestamp: `23:23`,
    question: `What property does Rippa's theorem state about Delaunay triangulations according to the lecture?`,
    options: [`They maximize the minimum angle in the mesh`, `They provide the smoothest interpolation of data on vertices`, `They contain the minimum number of triangles possible`, `They guarantee manifold connectivity`],
    answer: 1,
    intuition: ``,
    explanation: `The lecturer states at [23:35]: "They're going to provide the smoothest interpolation of data on vertices so if I use barycentric coordinates or linear functions to interpolate data at vertices a delaunay mesh is going to give me the smoothest interpolation of any triangulation of those points that's something called Rippa's theorem."`,
    code: ``,
    images: ["lec11_slide_18.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 18,
    timestamp: `24:59`,
    question: `What does the lecturer define as "regular vertex degree" for a triangle mesh?`,
    options: [`When all vertices have the same degree`, `When most vertices have degree 6`, `When the vertex degree distribution follows a power law`, `When no vertex has degree greater than 12`],
    answer: 1,
    intuition: ``,
    explanation: `The lecturer defines at [24:59]: "The degree of a vertex is the number of edges touching that vertex what does it mean for that degree to be regular well if I have a triangle mesh we're going to say I have a regular vertex degree if all the vertices are degree 6."`,
    code: ``,
    images: ["lec11_slide_42.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 19,
    timestamp: `27:28`,
    question: `What problem arises during subdivision when starting with high-degree vertices?`,
    options: [`The subdivision process becomes too slow`, `The mesh cannot be subdivided further`, `The limit surface develops wrinkles and shading artifacts`, `The resulting mesh is no longer manifold`],
    answer: 2,
    intuition: ``,
    explanation: `The lecturer explains at [27:28]: "If on the other hand I start with a really high degree vertex degree 20 and I run my subdivision I'll often get nasty artifacts like this so rather than having this smooth bump I get these little wrinkles all over the surface... In general what I'm going to get is shading artifacts normals are going to look wrong reflections are going to look wrong and so forth."`,
    code: ``,
    images: ["lec11_slide_19.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 20,
    timestamp: `28:23`,
    question: `What are the two aspects of subdivision that need to be addressed according to the lecture?`,
    options: [`Vertex position and edge length`, `Material properties and texture coordinates`, `Connectivity updates and vertex position updates`, `Polygon type and mesh boundary`],
    answer: 2,
    intuition: ``,
    explanation: `The lecturer states at [28:23]: "The basic idea of subdivision is we're going to repeatedly split each element into smaller pieces so that's a statement about the connectivity of the mesh once we've subdivided the connectivity we're going to replace the vertex positions with a weighted average of the neighboring vertex positions."`,
    code: ``,
    images: ["lec11_slide_21.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 21,
    timestamp: `30:22`,
    question: `What is Catmull-Clark subdivision primarily designed for, according to the lecture?`,
    options: [`Triangle meshes`, `Point clouds`, `Quadrilateral meshes`, `Tetrahedral meshes`],
    answer: 2,
    intuition: ``,
    explanation: `The lecturer explains at [30:09]: "The most common for quadrilateral meshes is something called Catmull-Clark subdivision perhaps the most common for triangle meshes is something called Loop subdivision but there are other schemes like butterfly square root three and so forth."`,
    code: ``,
    images: ["lec11_slide_21.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 22,
    timestamp: `31:51`,
    question: `In Catmull-Clark subdivision, what is the formula for updating an original vertex of degree n?`,
    options: [`The average of all neighboring vertices`, `The average of all face points`, `(Q + 2R + (n-3)S) / n, where Q is the average of face points, R is the average of edge midpoints, and S is the original position`, `(Q + R + (n-2)S) / n, where Q is the average of face points, R is the average of edge midpoints, and S is the original position`],
    answer: 2,
    intuition: ``,
    explanation: `The lecturer gives the formula at [32:12]: "The new vertex coordinate is q plus 2r plus n minus 3 times s over n." Where Q is the average of face points, R is the average of edge coordinates, and S is the original vertex position.`,
    code: ``,
    images: ["lec11_slide_22.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 23,
    timestamp: `34:21`,
    question: `Why does Catmull-Clark subdivision produce artifacts when applied to triangle meshes?`,
    options: [`Triangle meshes are not manifold`, `Triangles are not flexible enough to be subdivided`, `Triangle vertices typically have degree 6, which is irregular for quad meshes that expect degree 4`, `The formulas were derived only for quadrilaterals`],
    answer: 2,
    intuition: ``,
    explanation: `The lecturer explains at [34:21]: "Because all of our vertices are degree 6 they're not regular from the perspective of a quad mesh a quad mesh wants to have vertices of degree four so when we subdivide this mesh with catmull clark we get irregular vertices all over the place."`,
    code: ``,
    images: ["lec11_slide_21.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 24,
    timestamp: `35:46`,
    question: `What important property of Loop subdivision vertex rules did the lecturer highlight?`,
    options: [`They always preserve sharp features`, `They form a convex combination, keeping points within the convex hull`, `They result in a C3 continuous surface`, `They work equally well on quad meshes`],
    answer: 1,
    intuition: ``,
    explanation: `The lecturer states at [35:46]: "You notice something interesting here 1/8 plus 1/8 plus 3/8 plus 3/8 is equal to 1. So that means this new vertex is a convex combination of the neighboring vertices in general points on the subdivision surface are going to be in the convex hull of the points used to generate them."`,
    code: ``,
    images: ["lec11_slide_19.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 25,
    timestamp: `38:51`,
    question: `What approach does the lecture describe for mesh simplification?`,
    options: [`Randomly removing vertices until reaching the target count`, `Using a greedy algorithm based on edge collapses with a quadric error metric`, `Uniform subdivision followed by clustering`, `Remeshing the entire surface with fewer elements`],
    answer: 1,
    intuition: ``,
    explanation: `The lecturer explains at [39:01]: "We're going to do a greedy algorithm we're going to give some kind of cost to each edge then we're going to just figure out of all edges which one has the smallest cost which one basically changes our surface the least okay and then we're going to keep on collapsing edges until we reach some target number of mesh elements."`,
    code: ``,
    images: ["lec11_slide_28.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 26,
    timestamp: `40:35`,
    question: `What is the quadric error metric measuring in the context of mesh simplification?`,
    options: [`The distance from a vertex to the center of the mesh`, `The distance to a collection of triangles (or their planes)`, `The change in surface area after an operation`, `The maximum edge length in the mesh`],
    answer: 1,
    intuition: ``,
    explanation: `The lecturer states at [40:35]: "The basic idea is to store keep track of something called a quadric which intuitively keeps track of the distance to some collection of triangles so for instance we might have a quadratic that tells us how far are we from all the triangles around a point."`,
    code: ``,
    images: ["lec11_slide_36.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
  },
  {
    id: 27,
    timestamp: `1:17:35`,
    question: `What solution does the lecture propose for preventing signal degradation during repeated mesh processing?`,
    options: [`Using higher-order numerical methods`, `Limiting the number of operations to three`, `Projecting processed vertices back onto the original surface`, `Using a different mesh representation entirely`],
    answer: 2,
    intuition: ``,
    explanation: `The lecturer explains at [1:17:35]: "We might have changed the triangulation and then connectivity and all this stuff but we still have the original input mesh right so we could play a trick we could do all our processing and then we could say at the end we still want maybe these vertices to sit on the original surface so why don't we just take the vertices of the process mesh and project them back onto the closest point on the original mesh."
-`,
    code: ``,
    images: ["lec11_slide_46.png"],
    tags: [],
    source: `lectures/cg-11-lecture-quiz.md`,
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

export default function Lec11Quiz() {
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
    accent: '#e879f9',
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
          <Layers size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 11: Geometry Processing</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Mesh smoothing, subdivision, remeshing, simplification</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-11-lecture-quiz.md</p>
          <p style={{ color: C.accent, fontWeight: 600 }}>Q1–Q27 · 27 questions</p>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>27</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Questions</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>~9min</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Est. Time</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>1</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Part</div></div>
          </div>
        </div>

        <button style={btn({ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' })}
          onClick={() => { setScreen('quiz'); start() }}>
          <Layers size={20} /> Start Quiz
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
              <Layers size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 11: Geometry Processing</span>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', color: C.muted, fontSize: '0.875rem', alignItems: 'center' }}>
              <span><Clock size={14} style={{ display:'inline', verticalAlign:'middle', marginRight:'0.25rem' }} />{formatTime(t)}</span>
              <span>{qIdx+1}/27</span>
              <span style={{ color: C.accent }}>✓ {score}</span>
            </div>
          </div>
          <div style={{ height: '5px', background: C.border, borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.round((qIdx+1)/27*100)}%`, background: C.accent, transition: 'width 0.3s' }} />
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition written yet. Add a <code style={{ color: C.accent }}>- INTUITION:</code> block under this question in <code style={{ color: C.accent }}>lectures/cg-11-lecture-quiz.md</code>.</p>
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
              {qIdx < 27-1 ? 'Next Question' : 'View Results'} <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Image } from 'lucide-react'

// Source: lectures/cg-07-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 7: Texture Mapping — Part 1 · QQ1–QQ32 · 32 questions (32 MCQ, 0 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-07-lecture-quiz.md 7

const quizData = [
  {
    id: 1,
    qid: `Q1`,
    qtype: `INTRODUCTION`,
    format: `mcq`,
    timestamp: `00:00`,
    question: `What are the two main topics covered in this lecture?`,
    options: [`Rasterization and ray tracing`, `Textures and colors`, `Lighting and shading`, `Perspective projection and texture mapping`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [00:06]: "Welcome back to computer graphics. Today we're going to talk about perspective projection and texture mapping."`,
    code: ``,
    images: ["lec7_slide_01.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 2,
    qid: `Q2`,
    qtype: `RELATIONSHIP`,
    format: `mcq`,
    timestamp: `00:29`,
    question: `How does the lecturer describe the relationship between the two main topics of the lecture?`,
    options: [`They are sequential steps in the graphics pipeline`, `They are two approaches that solve the same problem`, `They are two ideas that "come crashing together"`, `They are completely separate techniques`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [00:29], the lecturer says: "Today we're going to see where these two ideas, these two perspectives, kind of come crashing together."`,
    code: ``,
    images: ["lec7_slide_02.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 3,
    qid: `Q3`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `00:55`,
    question: `What is perspective projection primarily concerned with?`,
    options: [`How lighting affects object appearance`, `How pixels are drawn on screen`, `How textures are mapped onto 3D surfaces`, `How objects appear smaller as they get farther away`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [01:00], the lecturer explains: "Perspective is this effect that we're all familiar with, distant objects in the world appear smaller as they get further away from us."`,
    code: ``,
    images: ["lec7_slide_04.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 4,
    qid: `Q4`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `01:07`,
    question: `What happens to parallel lines in perspective projection?`,
    options: [`They remain parallel`, `They diverge at the horizon`, `They converge at the horizon`, `They become curved`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [01:07], the lecturer states: "We notice especially in this image that parallel lines converge at the horizon."`,
    code: ``,
    images: ["lec7_slide_04.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 5,
    qid: `Q5`,
    qtype: `HISTORICAL`,
    format: `mcq`,
    timestamp: `01:24`,
    question: `According to the lecture, what challenge did early painters face with perspective?`,
    options: [`They lacked proper materials to create depth`, `They only used orthographic projection`, `They struggled to get accurate perspective`, `They intentionally rejected perspective`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [01:24], the lecturer notes: "If we go back for instance and look through the history of painting, we can see that people really struggled to get accurate perspective."`,
    code: ``,
    images: ["lec7_slide_05.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 6,
    qid: `Q6`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `02:08`,
    question: `What did artists do after mastering perspective, according to the lecturer?`,
    options: [`They focused exclusively on orthographic projections`, `They only created photorealistic art`, `They rejected perspective to play with perception`, `They abandoned painting altogether`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [02:08], the lecturer explains: "Later on as people mastered perspective, they said well actually we can reject perspective now that we can understand it, we can play all sorts of games with it."`,
    code: ``,
    images: ["lec7_slide_07.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 7,
    qid: `Q7`,
    qtype: `COMPARISON`,
    format: `mcq`,
    timestamp: `02:46`,
    question: `What is a primary advantage of orthographic projection according to the lecture?`,
    options: [`It's easier to implement in a graphics pipeline`, `It preserves sizes regardless of distance`, `It creates more realistic images`, `It adds artistic style to renderings`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [02:57], the lecturer states: "Like an orthographic projection where sizes are more predictable or more preserved."`,
    code: ``,
    images: ["lec7_slide_16.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 8,
    qid: `Q8`,
    qtype: `SEQUENCE`,
    format: `mcq`,
    timestamp: `03:10`,
    question: `In the graphics transformation pipeline, what is the first stage described in the lecture?`,
    options: [`World coordinates`, `Screen transformation`, `Camera transformation`, `Clipping`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [03:21], the lecturer states: "We'll start out with some object described in world coordinates, like you might remember from our first lecture we specified a cube by just giving the location of its vertices in some absolute global coordinate system."`,
    code: ``,
    images: ["lec7_slide_38.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 9,
    qid: `Q9`,
    qtype: `TRANSFORMATION`,
    format: `mcq`,
    timestamp: `03:42`,
    question: `What transformation is applied to input coordinates to effectively position the camera?`,
    options: [`Orthographic projection`, `The inverse of the camera transformation`, `The forward camera transformation`, `The identity transformation`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [03:42], the lecturer explains: "If our camera is positioned and rotated in a certain way, we actually are going to apply the inverse translation and rotation to our input coordinates to effectively position the camera."`,
    code: ``,
    images: ["lec7_slide_40.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 10,
    qid: `Q10`,
    qtype: `PURPOSE`,
    format: `mcq`,
    timestamp: `03:54`,
    question: `What is the purpose of mapping coordinates into clip coordinates?`,
    options: [`To make calculations easier`, `To make throwing out objects that shouldn't be drawn easier`, `To reduce memory usage`, `To apply lighting calculations`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [03:54], the lecturer states: "These coordinates are often then mapped into what are called clip coordinates, so into a sort of standard cube that's going to make it easy to throw out things that shouldn't get drawn."`,
    code: ``,
    images: ["lec7_slide_45.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 11,
    qid: `Q11`,
    qtype: `CAMERA`,
    format: `mcq`,
    timestamp: `05:06`,
    question: `In the camera transform example, what is the position of the camera?`,
    options: [`(0,0,0)`, `(0,0,-1)`, `(4,2,0)`, `(1,1,1)`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [05:06], the lecturer states: "As a concrete example, let's imagine we have a camera centered at the position (4,2,0) and it's looking down the x-axis."`,
    code: ``,
    images: ["lec7_slide_48.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 12,
    qid: `Q12`,
    qtype: `TRANSFORMATION`,
    format: `mcq`,
    timestamp: `06:09`,
    question: `To transform object coordinates relative to a camera at position (4,2,0), what translation should be applied?`,
    options: [`(+2,+4,0)`, `(+4,+2,0)`, `(-4,-2,0)`, `(0,0,0)`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [06:09], the lecturer explains: "One way of thinking about this is that we subtract the camera center (4,2,0) from the coordinates describing our object. In other words we translate the object vertex positions by (-4,-2,0)."`,
    code: ``,
    images: ["lec7_slide_48.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 13,
    qid: `Q13`,
    qtype: `ROTATION`,
    format: `mcq`,
    timestamp: `06:42`,
    question: `If a camera is looking down the x-axis, what rotation aligns it with the standard convention (looking down the -z axis)?`,
    options: [`Rotation about z-axis by π/2`, `Rotation about y-axis by π/2`, `Rotation about y-axis by π`, `Rotation about x-axis by π/2`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [06:42], the lecturer states: "In this case we can do this by just a simple rotation. We can rotate about the y-axis by π/2 and now we'll effectively have aligned the camera's view direction with the minus z-axis."`,
    code: ``,
    images: ["lec7_slide_66.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 14,
    qid: `Q14`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `07:47`,
    question: `What property of rotation matrices makes them particularly easy to invert?`,
    options: [`They are always lower triangular`, `Their inverse is the same as their transpose`, `They are always symmetric`, `They always have determinant 1`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [10:48], the lecturer explains: "There's something very special about rotation matrices that makes them particularly nice to invert, which is that the inverse of a rotation matrix is just its transpose."`,
    code: ``,
    images: ["lec7_slide_66.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 15,
    qid: `Q15`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `11:24`,
    question: `What is the view frustum?`,
    options: [`The range of colors visible in the scene`, `The amount of distortion in the image`, `The region the camera can see`, `The boundary of what the user can see on screen`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [11:24], the lecturer defines: "The view frustum is the region this final camera can see."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 16,
    qid: `Q16`,
    qtype: `CONVENTION`,
    format: `mcq`,
    timestamp: `11:37`,
    question: `What is the standard convention for camera orientation in the rasterization pipeline?`,
    options: [`Camera at origin looking down +x axis`, `Camera at origin looking down +y axis`, `Camera at origin looking down +z axis`, `Camera at origin looking down -z axis`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [11:37], the lecturer states: "Just to keep things simple we always imagine that the camera is sitting at the origin and pointed down the minus z axis."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 17,
    qid: `Q17`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `12:04`,
    question: `What do the sides of the view frustum correspond to?`,
    options: [`Different rendering priorities`, `The four sides of the image to be drawn`, `Different processing threads`, `Different levels of detail`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [12:04], the lecturer explains: "We can think of the top, bottom, left, and right sides/planes of this box as the four sides of the image that we want to draw."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 18,
    qid: `Q18`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `12:55`,
    question: `What is clipping in the context of the graphics pipeline?`,
    options: [`Reducing the resolution of distant objects`, `Removing parts of objects that are too small`, `Removing objects that are too complex`, `Eliminating triangles not inside the view frustum`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [12:55], the lecturer states: "Clipping is the process of eliminating triangles not inside this view frustum."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 19,
    qid: `Q19`,
    qtype: `EFFICIENCY`,
    format: `mcq`,
    timestamp: `13:19`,
    question: `Why is clipping at the triangle level more efficient than at the pixel level?`,
    options: [`It uses less memory`, `It enables better anti-aliasing`, `It avoids wasting computation on primitives that won't be visible`, `It improves image quality`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [13:13], the lecturer explains: "Why do we even bother with this clipping process? Well one answer is that we don't want to waste time rasterizing primitives that we can't see."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 20,
    qid: `Q20`,
    qtype: `STRATEGY`,
    format: `mcq`,
    timestamp: `14:11`,
    question: `What general graphics strategy does the lecturer highlight when discussing clipping?`,
    options: [`Avoid using specialized hardware`, `Always optimize for quality over performance`, `Always perform operations in screen space`, `Use coarse-to-fine testing to save effort`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [14:11], the lecturer states: "This is generally a really useful strategy in computer graphics: try to go coarse to fine. Any time you can do a quick and dirty check to see if something's even worth doing, you've saved yourself a whole lot of effort."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 21,
    qid: `Q21`,
    qtype: `IMPLEMENTATION`,
    format: `mcq`,
    timestamp: `14:54`,
    question: `How does a real rasterization pipeline handle triangles that are partially inside the view frustum?`,
    options: [`It draws the entire triangle`, `It splits the triangle into sub-triangles`, `It rejects the entire triangle`, `It reduces the triangle's resolution`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [14:54], the lecturer explains: "Generally the way that clipping is done in a real rasterization pipeline is we take any partial triangle and we split it up into several sub-triangles."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 22,
    qid: `Q22`,
    qtype: `PIPELINE`,
    format: `mcq`,
    timestamp: `15:33`,
    question: `Why does the rasterization pipeline focus on triangles specifically?`,
    options: [`Triangles are more realistic for modeling`, `Triangles require less memory than other primitives`, `Triangles are always convex`, `The pipeline is built to do one thing very well - draw triangles`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [15:33], the lecturer states: "The reason goes back to something very important that we've discussed with the rasterization pipeline, which is that we're really trying to build a pipeline that does one thing really really well and really really fast, which is to draw triangles onto the screen."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 23,
    qid: `Q23`,
    qtype: `REASONING`,
    format: `mcq`,
    timestamp: `16:28`,
    question: `What is one reason for having a near clipping plane?`,
    options: [`To reduce memory usage`, `To handle triangles with vertices both in front of and behind the eye`, `To fix texture mapping issues`, `To improve image quality`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [16:28], the lecturer explains: "One reason is that you could easily imagine primitives that have vertices both in front of and behind the eye. You get really close to an object and some of these triangles are going to be spanning positive and negative z values."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 24,
    qid: `Q24`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `17:05`,
    question: `What is z-buffering (depth buffering)?`,
    options: [`A technique for compressing depth values`, `A technique for tracking the closest depth seen so far for occlusion`, `A technique for anti-aliasing`, `A technique for improving texture mapping`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [17:12], the lecturer describes: "The idea is if I want to draw many primitives on the screen and have them occlude each other, I'm going to keep track in an additional image of the closest depth I've seen so far."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 25,
    qid: `Q25`,
    qtype: `ARTIFACT`,
    format: `mcq`,
    timestamp: `18:32`,
    question: `What causes z-fighting in rendering?`,
    options: [`Poor triangle mesh quality`, `Incorrect lighting calculations`, `Insufficient precision in depth values`, `Problems with texture coordinates`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [18:50], the lecturer explains: "It's happening because the z values, the depth values that I'm storing in this buffer really are fighting because I don't have enough precision."
- QUESTIONS (continued):`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 26,
    qid: `Q26`,
    qtype: `SITUATION`,
    format: `mcq`,
    timestamp: `19:13`,
    question: `What visual problem occurs with z-fighting?`,
    options: [`Objects appear transparent`, `Objects appear inside out`, `Ugly jaggy artifacts appear as surfaces intersect`, `All colors become monochromatic`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [19:13], the lecturer states: "From frame to frame I get these ugly jaggy artifacts. Actually even within a single frame I might have two planes overlapping and get this zigzag back and forth across where they meet."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 27,
    qid: `Q27`,
    qtype: `TRANSFORMATION`,
    format: `mcq`,
    timestamp: `19:49`,
    question: `What transformation is applied to the view frustum before 2D projection?`,
    options: [`Scaling to screen coordinates`, `Rotation to align with axes`, `Translation to origin`, `Mapping to a standard cube from -1 to 1`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [19:49], the lecturer explains: "Before we go ahead and do the 2D projection, what we're going to do is map the view frustum, this gray box, to a standard cube, the cube between -1 and 1 in all three components."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 28,
    qid: `Q28`,
    qtype: `BENEFIT`,
    format: `mcq`,
    timestamp: `20:04`,
    question: `What benefit does mapping the view frustum to a standard cube provide?`,
    options: [`It improves image quality`, `It makes clipping easier`, `It reduces memory requirements`, `It makes rendering faster`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [20:04], the lecturer states: "Why do we do this? Well for one thing it makes clipping a lot easier. We can just toss out any points that are outside the range minus one to one."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 29,
    qid: `Q29`,
    qtype: `MATHEMATICAL`,
    format: `mcq`,
    timestamp: `21:07`,
    question: `How can the mapping between the view frustum and standard cube be expressed?`,
    options: [`As a quaternion`, `As a Taylor series`, `As a matrix`, `As a nonlinear function`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [21:07], the lecturer confirms: "Yes, so we can set up a linear transformation that maps vertices of the view frustum to a cube."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 30,
    qid: `Q30`,
    qtype: `APPROACH`,
    format: `mcq`,
    timestamp: `22:36`,
    question: `When solving the matrix equation for the view frustum transformation, what unusual aspect does the lecturer point out?`,
    options: [`The matrix must be inverted first`, `We're solving for the matrix entries, not the vector`, `The determinant must be calculated differently`, `The matrix is always singular`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [22:36], the lecturer explains: "In this case I'm not solving for x. Normally with a matrix equation Ax = y you solve for x. In this case I'm actually solving for the unknown entries of the matrix A."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 31,
    qid: `Q31`,
    qtype: `COMPONENTS`,
    format: `mcq`,
    timestamp: `23:42`,
    question: `What are the two main components of the orthographic projection matrix?`,
    options: [`Shearing and scaling`, `Scaling and translation`, `Translation and rotation`, `Reflection and rotation`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [23:42], the lecturer states: "We can break it up into kind of two pieces. One is that it applies a non-uniform scale to turn our original box into a box of size two, and then in the upper right we have this translation."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 32,
    qid: `Q32`,
    qtype: `HOMOGENEOUS`,
    format: `mcq`,
    timestamp: `23:58`,
    question: `What benefit do homogeneous coordinates provide for spatial transformations?`,
    options: [`They simplify perspective division`, `They use less memory`, `They make rotation matrices orthogonal`, `They allow expressing translations as linear transformations`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [23:58], the lecturer explains: "That was the whole idea behind using homogeneous coordinates for spatial transformations, is that we can express translations as linear transformations in homogeneous coordinates."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
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

export default function Lec7Part1Quiz() {
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
    accent: '#a3e635', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec7'
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
    const p = Math.round(s / (32 || 1) * 100)
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
          <Image size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 7: Texture Mapping — Part 1</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>UV mapping, mipmaps, filtering, environment maps, bump mapping</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-07-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec7/1`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec7/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
          <a key={3} href={`${BASE}/lec7/3`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 3</a>
          </div>
          <p style={{ color: C.accent, fontWeight: 600 }}>QQ1–QQ32 · 32 questions (32 graded + 0 open)</p>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>32</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Graded MCQ</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>0</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Open / Reveal</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>~10min</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Est. Time</div></div>
          </div>
        </div>

        <button style={btn({ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' })}
          onClick={() => { setScreen('quiz'); start() }}>
          <Image size={20} /> Start Quiz
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
          <div style={{ fontSize: '1.2rem', color: C.muted, marginBottom: '0.75rem' }}>{score} / 32 MCQ correct</div>
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
              <Image size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 7: Texture Mapping — Part 1</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-07-lecture-quiz.md.</p>
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
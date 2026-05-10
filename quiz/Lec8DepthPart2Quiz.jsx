'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Layers } from 'lucide-react'

// Source: lectures/cg-08-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 8: Depth & Transparency — Part 2 · QQ30–QQ50 · 21 questions (21 MCQ, 0 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-08-lecture-quiz.md 8

const quizData = [
  {
    id: 30,
    qid: `Q30`,
    qtype: `ADVANTAGE`,
    format: `mcq`,
    timestamp: `32:56`,
    question: `What does pre-multiplied alpha preserve that non-premultiplied compositing distorts?`,
    options: [`The depth value — pre-mult keeps depth consistent during compositing`, `The original color — blending two bright red things still gives bright red; only the alpha increases`, `The alpha value — pre-mult keeps alpha fixed at 1.0`, `The texture coordinates — pre-mult avoids UV distortion at edges`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [32:56], the lecturer states: "I blended together two bright red things the color itself hasn't changed it's still bright red it's only the alpha that's changed it's increased to become more opaque." Pre-multiplied alpha separates color blending from opacity blending.`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 31,
    qid: `Q31`,
    qtype: `CALCULATION`,
    format: `mcq`,
    timestamp: `32:41`,
    question: `When compositing two identical 50%-opaque bright red primitives using pre-multiplied alpha, what is the final recovered RGB color?`,
    options: [`(1.0, 0, 0)`, `(0.75, 0, 0)`, `(0.5, 0, 0)`, `(0.25, 0, 0)`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [32:41], the lecturer explains: "But remember that to recover the original color i'm going to actually divide by alpha so the color i get is bright red 1 0 0 and the alpha i get is still that .75." Pre-multiplied alpha recovers the original bright red, while non-premultiplied gives the distorted dark red (0.75, 0, 0).`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 32,
    qid: `Q32`,
    qtype: `SUMMARY`,
    format: `mcq`,
    timestamp: `33:22`,
    question: `Which of the following is NOT listed as an advantage of pre-multiplied alpha in the lecture?`,
    options: [`Fewer arithmetic operations for the "over" operation`, `Better representation for filtering (upsampling and downsampling)`, `Improved depth testing accuracy for transparent surfaces`, `Treating all channels (RGB and alpha) the same way`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [33:22–33:48], the lecturer lists advantages: treating all channels the same, fewer arithmetic operations, closure under composition, and better filtering. Improved depth testing is not mentioned as an advantage of pre-multiplied alpha.`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 33,
    qid: `Q33`,
    qtype: `ADVANTAGE`,
    format: `mcq`,
    timestamp: `34:02`,
    question: `Why does pre-multiplied alpha "fit naturally into the rasterization pipeline"?`,
    options: [`The pipeline already uses homogeneous coordinates and 4×4 matrices, and pre-mult color is just a 4-vector in the same space`, `It reduces the number of triangles that need to be drawn`, `It eliminates the need for a depth buffer when rendering transparent objects`, `It allows texture coordinates to be omitted for transparent surfaces`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [34:02], the lecturer states: "And also it fits naturally into the rasterization pipeline we've already built so we've already said homogeneous coordinates are a good idea we're going to work with 4x4 matrices our graphics card is built that way so it's pretty cool that our color blending works out the same way."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 34,
    qid: `Q34`,
    qtype: `CHALLENGE`,
    format: `mcq`,
    timestamp: `35:04`,
    question: `What fundamental question arises when trying to use the depth buffer with semi-transparent triangles?`,
    options: [`Should a semi-transparent triangle update the depth buffer, given that objects behind it should still be visible?`, `Should transparent triangles be rendered at a lower resolution to save time?`, `Should the depth buffer store a list of all depths at each sample instead of just the minimum?`, `Should the alpha value be stored in the depth buffer instead of a separate buffer?`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [35:04], the lecturer poses: "But what about depth if i draw a semi-transparent triangle should i change the depth value is that the closest thing i've seen now can't i still see triangles that i've already drawn through that triangle and shouldn't i care about their depth."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 35,
    qid: `Q35`,
    qtype: `REQUIREMENT`,
    format: `mcq`,
    timestamp: `35:57`,
    question: `What ordering assumption must hold for the "over" operator to produce correct compositing results?`,
    options: [`Primitives must be drawn front-to-back so closer surfaces are composited first`, `Primitives must be sorted by color brightness before compositing`, `Primitives must be drawn back-to-front so the operator correctly places each new layer on top`, `Primitives can be drawn in any order — the "over" operator handles reordering internally`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [35:57], the lecturer states: "The key word here is the word over because we're compositing our colors using this over operation we're assuming that a is over b right that we're drawing things in the right order and we're not worrying about occlusion only if things are drawn in back to front order."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 36,
    qid: `Q36`,
    qtype: `CHALLENGE`,
    format: `mcq`,
    timestamp: `36:35`,
    question: `Why does sorting transparent triangles back-to-front remain difficult on real GPUs?`,
    options: [`The sort must be redone at every mipmap level`, `GPUs cannot store depth values at higher than 16-bit precision`, `Transparent triangles must be tessellated before sorting`, `Sorting is annoying, GPUs are not well-suited to it, and intersecting triangles have no valid sort order`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [36:35], the lecturer explains: "This is annoying for a couple reasons for one thing it's just annoying to have to do this sort all the time it's not something actually that's very easy to do on a on a graphics card and also we have to deal with these issues of primitives intersecting each other if we have two triangles intersecting each other there may be no ordering that gives us the right answer."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 37,
    qid: `Q37`,
    qtype: `ALGORITHM`,
    format: `mcq`,
    timestamp: `38:05`,
    question: `What two-pass approach handles scenes with both opaque and transparent primitives?`,
    options: [`Render transparent first, then opaque — so transparent surfaces always composite over the opaque ones`, `Render each primitive independently into a separate buffer and composite them all at the end`, `First render opaque primitives in any order using the depth buffer; then disable depth writes and render transparent primitives back-to-front`, `Render all primitives in one pass using a combined depth-and-alpha test`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [38:23–38:52], the lecturer describes: "We can first render our opaque primitives in any order we want using the depth buffer... After we're done drawing all of our opaque triangles we're going to disable the depth buffer update we're no longer going to change the depth values we're just going to go ahead and render semi-transparent surfaces in back to front order we're still going to check if we pass the depth test."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 38,
    qid: `Q38`,
    qtype: `TECHNIQUE`,
    format: `mcq`,
    timestamp: `38:46`,
    question: `In the two-pass approach, what happens to the depth buffer when rendering the transparent pass?`,
    options: [`It is preserved from the opaque pass, but depth writes are disabled — only depth reads occur`, `It is cleared completely so transparent triangles can write fresh depth values`, `It is replaced with a separate transparency depth buffer`, `It is inverted so that transparency appears in front of all opaque geometry`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [38:46], the lecturer states: "After we're done drawing all of our opaque triangles we're going to disable the depth buffer update we're no longer going to change the depth values." Transparent triangles still test against opaque depth values to detect correct occlusion, but do not overwrite them.`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 39,
    qid: `Q39`,
    qtype: `GOAL`,
    format: `mcq`,
    timestamp: `40:03`,
    question: `What is the most fundamental goal of the rasterization pipeline according to the lecture summary?`,
    options: [`To simulate physically accurate lighting in real time`, `To match the visual quality of offline ray tracing`, `To maximize GPU utilization by processing millions of triangles per second`, `To turn a list of triangles and associated data into a final bitmap image`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [40:03], the lecturer states: "So the most important thing to remember is what is our goal what are we trying to do here we're trying to turn some inputs into a final image."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 40,
    qid: `Q40`,
    qtype: `INPUT`,
    format: `mcq`,
    timestamp: `40:54`,
    question: `Which of the following is NOT mentioned as an input to the rasterization pipeline?`,
    options: [`Texture coordinates (UV) per vertex`, `Lighting equations and light source positions`, `Perspective transform matrix`, `Triangle vertex positions (in homogeneous coordinates)`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `Between [40:14] and [41:12], the lecturer lists: triangle positions, UV coordinates, texture map, object-to-camera transform, perspective transform, and output image dimensions. Lighting equations are not listed as a pipeline input at this stage.`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 41,
    qid: `Q41`,
    qtype: `PROCESS`,
    format: `mcq`,
    timestamp: `41:51`,
    question: `What is the first transformation applied to each triangle in the rasterization pipeline?`,
    options: [`Homogeneous divide to convert from 4D to 3D`, `Perspective projection to normalized device coordinates`, `Clipping against the view frustum`, `Transformation into camera space using the inverse camera transform`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [41:51], the lecturer states: "Okay what do we do first to each triangle we transform the triangles into camera space by applying the inverse of the camera transform."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 42,
    qid: `Q42`,
    qtype: `PROCESS`,
    format: `mcq`,
    timestamp: `42:17`,
    question: `What happens during the clipping stage of the pipeline?`,
    options: [`Alpha values are quantized to 0 or 1 to simplify depth testing`, `Triangles are stretched to fill the screen boundaries`, `Triangles outside the normalized unit cube are discarded; partially visible triangles are cut into smaller triangles that fit inside`, `RGB color values are clamped to the [0,1] range`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [42:17], the lecturer explains: "We perform clipping so we discard triangles that lie outside the unit cube if they're completely inside the unit cube we keep them and if they are partially contained in this cube well we have to do a little work to cut them up into smaller triangles that are contained inside the cube."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 43,
    qid: `Q43`,
    qtype: `OPTIMIZATION`,
    format: `mcq`,
    timestamp: `43:44`,
    question: `What is the purpose of "triangle setup" before iterating over individual sample points?`,
    options: [`To determine whether the triangle should be drawn at all`, `To compute the final pixel color once for the whole triangle`, `To compute the texture LOD level for the entire triangle`, `To pull computations out of the per-sample loop that only need to be done once per triangle — edge equations, barycentric coefficient setup, etc.`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [43:44], the lecturer explains: "Basically look at our code that does the rasterization and say is there something that's getting recomputed over and over and over again for every sample that we could just pull out of that loop and compute once ahead of time."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 44,
    qid: `Q44`,
    qtype: `DECISION`,
    format: `mcq`,
    timestamp: `44:39`,
    question: `What determines whether a sample's color is written to the color buffer?`,
    options: [`Whether the sample's UV coordinates are within the valid texture range`, `Whether the sample falls within the center half of the triangle`, `Whether the sample has a non-zero alpha value`, `Whether the sample passes the depth test (its depth is less than what is stored in the Z-buffer)`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [44:39–45:01], the lecturer states: "Once we know what color the sample should be we actually have to figure out should we even bother writing it into the color buffer so we perform a depth test if the thing that we're drawing is closer than anything we've seen before we write the new depth into the depth buffer we write the color into the color buffer otherwise we do nothing. Right so we update the color buffer if the depth buffer test passed."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 45,
    qid: `Q45`,
    qtype: `HARDWARE`,
    format: `mcq`,
    timestamp: `47:24`,
    question: `Why are real-world rasterizers implemented in hardware rather than software?`,
    options: [`Software rasterizers produce lower quality images due to floating-point limitations`, `Software rasterizers cannot support pre-multiplied alpha`, `Real-time rasterization demands — millions of triangles, complex shaders, 10+ megapixel output, hundreds of frames per second for VR — are far beyond what CPU software can deliver`, `Hardware is required by the OpenGL specification`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [46:52–47:24], the lecturer explains: "The goal of these rasterization pipelines is to render scenes with extremely high complexity they need to render thousands and millions of triangles with complex transforms and shaders and you have really high resolution outputs right 10 megapixels with super sampling... And so these rasterizers are not going to be implemented in software people aren't writing them on their you know cpus like you're doing for this class but they've actually been baked into hardware these days."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 46,
    qid: `Q46`,
    qtype: `HARDWARE`,
    format: `mcq`,
    timestamp: `48:08`,
    question: `How does the lecturer describe a GPU architecturally?`,
    options: [`A heterogeneous multi-core processor with both programmable cores and highly specialized fixed-function hardware`, `A single very fast processor optimized for floating-point operations`, `A collection of many identical CPU cores running in parallel`, `A purely software-based parallel compute system`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [48:08], the lecturer states: "A gpu is really a heterogeneous multi-core processor so it's not just a big bunch of cpus glued onto a single chip it also has some highly highly specialized hardware that does some of the operations that you now know and love."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 47,
    qid: `Q47`,
    qtype: `HARDWARE`,
    format: `mcq`,
    timestamp: `48:27`,
    question: `What specific fixed-function hardware units does the lecturer say GPUs contain?`,
    options: [`Hardware for bilinear texture filtering, triangle clipping, and blending operations like the "over" operator`, `Hardware for mesh tessellation and level-of-detail selection`, `Hardware neural network accelerators and SIMD vector units`, `Hardware for shadow map generation and ambient occlusion`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [48:27], the lecturer specifically lists: "It has hardware for doing bilinear filtering of textures it has hardware for clipping triangles it has hardware for doing blending operations like the over operation and so forth."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 48,
    qid: `Q48`,
    qtype: `EVOLUTION`,
    format: `mcq`,
    timestamp: `49:07`,
    question: `How has GPU pipeline design evolved over time, according to the lecturer?`,
    options: [`From parallel to sequential processing to simplify debugging`, `From large discrete chips toward fully integrated CPU designs`, `From fixed-function stages toward increasingly programmable, flexible stages — while still retaining specialized hardware components`, `From flexible programmable designs toward fixed-function hardware for maximum efficiency`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [49:07], the lecturer explains: "Okay so although gpus have gone more and more toward programmability toward flexibility they still benefit from having some very specialized components okay and so that's kind of the evolution of the modern rasterization pipeline there's been a trend toward more generic but still highly parallel computation the different stages have become more and more programmable."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 49,
    qid: `Q49`,
    qtype: `COMPARISON`,
    format: `mcq`,
    timestamp: `51:05`,
    question: `What advantage of ray tracing over rasterization does the NVIDIA real-time demo illustrate?`,
    options: [`Ray tracing produces physically accurate lighting, shadows, and reflections in real time — effects that rasterization can only approximate with tricks`, `Ray tracing is significantly faster than rasterization for all scene types`, `Ray tracing requires less GPU memory than rasterization`, `Ray tracing eliminates the need for texture mapping`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [51:05–51:22], the lecturer states: "The thing to realize is that all of these lighting effects all these shadows and the light bouncing off various surfaces is all being done in real time. And this is stuff that you really can't pull off very easily with rasterization you can pull various tricks to kind of get these effects but to get the true physically based appearance you really need this ray tracing technology."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 50,
    qid: `Q50`,
    qtype: `ROADMAP`,
    format: `mcq`,
    timestamp: `52:28`,
    question: `In what order does the lecturer say the remaining course topics will be covered?`,
    options: [`Geometry → materials and lighting and photorealistic rendering → animation`, `Materials and lighting → geometry → animation`, `Ray tracing → animation → geometry`, `Animation → geometry → materials and lighting`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [52:28], the lecturer outlines: "Next time we're going to start talking about geometry and then we're going to move on to materials and lighting and photorealistic rendering and finally near the end of the course we'll talk about animation."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
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

export default function Lec8Part2Quiz() {
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
    accent: '#67e8f9', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec8'
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
    const p = Math.round(s / (21 || 1) * 100)
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
          <Layers size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 8: Depth & Transparency — Part 2</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Z-buffer, painter's algorithm, alpha blending, order-independent</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-08-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec8/1`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec8/2`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 2</a>
          </div>
          <p style={{ color: C.accent, fontWeight: 600 }}>QQ30–QQ50 · 21 questions (21 graded + 0 open)</p>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>21</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Graded MCQ</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>0</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Open / Reveal</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>~7min</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Est. Time</div></div>
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
          <div style={{ fontSize: '1.2rem', color: C.muted, marginBottom: '0.75rem' }}>{score} / 21 MCQ correct</div>
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
              <Layers size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 8: Depth & Transparency — Part 2</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-08-lecture-quiz.md.</p>
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
              {qIdx < 21-1 ? 'Next Question' : 'View Results'} <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
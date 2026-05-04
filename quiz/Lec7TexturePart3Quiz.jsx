'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Image } from 'lucide-react'

// Source: lectures/cg-07-lecture-quiz.md.md  (symlinked → Logseq pages)
// Lecture 7: Texture Mapping — Part 3 · QQ62–QQ85 · 24 questions (24 MCQ, 0 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-07-lecture-quiz.md.md 7

const quizData = [
  {
    id: 62,
    qid: `Q62`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `54:15`,
    question: `What are texture coordinates?`,
    options: [`The position of textures in memory`, `What define a mapping from the surface to points in the texture domain`, `The file paths to texture images`, `The resolution of texture images`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [54:15], the lecturer states: "Texture coordinates are what we use to define a mapping from the surface to points in the texture domain."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
  },
  {
    id: 63,
    qid: `Q63`,
    qtype: `PROCESS`,
    format: `mcq`,
    timestamp: `54:22`,
    question: `How are texture coordinates typically handled across a triangle?`,
    options: [`They are computed from the triangle normal`, `They are linearly interpolated from the vertices`, `They are constant across each triangle`, `They are randomly generated for each pixel`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [54:22], the lecturer explains: "Most commonly if we're working with triangle mesh, we might linearly interpolate texture coordinates at the triangle vertices over the interior of the triangle."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
  },
  {
    id: 64,
    qid: `Q64`,
    qtype: `VISUALIZATION`,
    format: `mcq`,
    timestamp: `55:54`,
    question: `How can texture coordinates be visualized using colors?`,
    options: [`By using a gradient from dark to light`, `By using a checkerboard pattern`, `By assigning u to red and v to green`, `By using random colors for each coordinate`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [55:54], the lecturer states: "One nice way to visualize texture coordinates is to associate them with colors. So if we think of u as red and v as green, then we get kind of a color map that looks like this."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
  },
  {
    id: 65,
    qid: `Q65`,
    qtype: `TECHNIQUE`,
    format: `mcq`,
    timestamp: `57:42`,
    question: `Why would you want periodic texture coordinates in a scene like a building?`,
    options: [`To cover the scene with a repeating pattern like bricks`, `To create geometric detail`, `To save memory by making all sides identical`, `To create a random pattern`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [58:20], the lecturer explains: "One natural thing we might like to do with a building is to cover it with some regular pattern like bricks."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
  },
  {
    id: 66,
    qid: `Q66`,
    qtype: `ALGORITHM`,
    format: `mcq`,
    timestamp: `58:59`,
    question: `What is the basic algorithm for texture mapping a triangle?`,
    options: [`Pre-compute texels for every possible triangle`, `Apply the texture to each vertex and interpolate`, `For each pixel, interpolate UV coordinates, sample texture, set pixel color`, `Compute one texture sample per triangle and apply it uniformly`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [59:05], the lecturer outlines: "For each pixel in the rasterized image, for each pixel on the screen, we're going to interpolate uv coordinates from vertices onto whatever pixel we're currently looking at."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
  },
  {
    id: 67,
    qid: `Q67`,
    qtype: `CHALLENGE`,
    format: `mcq`,
    timestamp: `59:52`,
    question: `What is the primary challenge in texture mapping according to the lecture?`,
    options: [`Color accuracy`, `Aliasing`, `Processing speed`, `Memory limitations`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [59:52], the lecturer states: "The reason is this adversary that we keep on encountering in this class: aliasing."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
  },
  {
    id: 68,
    qid: `Q68`,
    qtype: `PROBLEM`,
    format: `mcq`,
    timestamp: `1:00:50`,
    question: `What creates irregular sampling patterns in texture mapping?`,
    options: [`Hardware limitations`, `The projection of 3D triangles to 2D creates varying sample spacing`, `Incorrect UV coordinates`, `Poor texture quality`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:00:50], the lecturer explains: "The key idea is that since triangles are projected from three dimensions to two dimensions, pixels in screen space will correspond to regions of varying size and location in the texture itself."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
  },
  {
    id: 69,
    qid: `Q69`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `1:01:51`,
    question: `What is magnification in texture mapping?`,
    options: [`When a single texture pixel covers many screen pixels`, `When a single screen pixel covers many texture pixels`, `When the camera is close to a surface and a screen pixel covers a tiny region of texture`, `When textures appear larger than expected`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:01:51], the lecturer states: "Magnification is somewhat the easier case. You can imagine that what's happened is the camera has gotten really close to an object... In this case a single pixel on the screen is going to cover just a tiny region of the texture."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
  },
  {
    id: 70,
    qid: `Q70`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `1:02:30`,
    question: `What is minification in texture mapping?`,
    options: [`When textures appear smaller than expected`, `When a texture is compressed to save memory`, `When texture detail is lost`, `When the object is far away and a screen pixel covers a large region of texture`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:02:30], the lecturer explains: "Minification is much harder. The example here is that the object is really really far away so that a single pixel on the screen covers a very large region in the texture."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
  },
  {
    id: 71,
    qid: `Q71`,
    qtype: `TECHNIQUE`,
    format: `mcq`,
    timestamp: `1:03:38`,
    question: `What is the simplest approach to texture sampling in magnification?`,
    options: [`Trilinear filtering`, `Anisotropic filtering`, `Bilinear filtering`, `Nearest neighbor (grabbing the nearest texel)`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:03:38], the lecturer states: "The fast, simple but ugly solution is just grab the value of the nearest pixel, the nearest texture pixel or what's called a texel."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
  },
  {
    id: 72,
    qid: `Q72`,
    qtype: `QUALITY`,
    format: `mcq`,
    timestamp: `1:03:50`,
    question: `What is the visual result of nearest neighbor sampling?`,
    options: [`Very smooth transitions`, `Blurry appearance`, `Distorted perspective`, `Blocky appearance as you get closer to the surface`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:03:50], the lecturer explains: "As we get closer and closer to the wall, the image gets blockier and blockier until we're really staring at these big color blocks. Doesn't look very nice."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
  },
  {
    id: 73,
    qid: `Q73`,
    qtype: `TECHNIQUE`,
    format: `mcq`,
    timestamp: `1:04:08`,
    question: `What improved technique is commonly used for magnification?`,
    options: [`Bilinear interpolation`, `Supersampling`, `Pre-filtering`, `Nearest neighbor`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:04:08], the lecturer states: "We'd like to do something just a little bit better, and a very common idea is to use bilinear interpolation."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
  },
  {
    id: 74,
    qid: `Q74`,
    qtype: `PROCESS`,
    format: `mcq`,
    timestamp: `1:05:22`,
    question: `What does bilinear interpolation do first?`,
    options: [`Average all four texels`, `Choose the best texel`, `Interpolate in the vertical direction`, `Interpolate in the horizontal direction`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:05:22], the lecturer explains: "I'm going to first do linear interpolation in the horizontal direction just as we did before for our 1D function."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
  },
  {
    id: 75,
    qid: `Q75`,
    qtype: `PROBLEM`,
    format: `mcq`,
    timestamp: `1:07:35`,
    question: `Why is texture aliasing a problem in minification?`,
    options: [`It creates textures that are too dark`, `It makes textures appear too shiny`, `It distorts the shape of objects`, `A single pixel covers many texture pixels, causing sampling issues`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:07:35], the lecturer states: "The thing to realize is that texture aliasing often occurs because a single pixel on the screen covers many pixels of the texture."
- QUESTIONS (continued):`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
  },
  {
    id: 76,
    qid: `Q76`,
    qtype: `ISSUE`,
    format: `mcq`,
    timestamp: `1:08:00`,
    question: `Why is using a single sample from the center of a screen pixel problematic in minification?`,
    options: [`It prevents the use of hardware acceleration`, `It produces colors that are too bright`, `It essentially grabs one random color from a region that might contain many colors`, `It's too computationally expensive`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:08:14], the lecturer explains: "If we have lots of different colors covered by that screen pixel, we're essentially just grabbing one random color out of that region."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
  },
  {
    id: 77,
    qid: `Q77`,
    qtype: `SOLUTION`,
    format: `mcq`,
    timestamp: `1:09:26`,
    question: `What is the solution to the minification problem?`,
    options: [`Using nearest neighbor sampling`, `Using higher resolution textures`, `Pre-computing averages and looking them up at runtime`, `Disabling texture filtering entirely`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:09:26], the lecturer states: "What we're going to do instead is pre-compute some of these averages just once and look up these averages at runtime. We're going to do a lot of the work ahead of time."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
  },
  {
    id: 78,
    qid: `Q78`,
    qtype: `TECHNIQUE`,
    format: `mcq`,
    timestamp: `1:11:06`,
    question: `What technique stores pre-filtered images at multiple scales?`,
    options: [`Mipmapping`, `Anisotropic filtering`, `Bilinear filtering`, `Supersampling`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:11:06], the lecturer explains: "What we're really going to do is use a technique called mipmapping where the rough idea is to store a pre-filtered image at sort of every possible scale."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
  },
  {
    id: 79,
    qid: `Q79`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `1:11:13`,
    question: `How are mipmaps organized in terms of resolution?`,
    options: [`In random order for better cache coherence`, `In powers of two, starting from the original image`, `Based on viewing distance`, `In linear steps for smoother transitions`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:11:13], the lecturer states: "Actually we're gonna do this in powers of two. We're gonna start out with our original image at level zero, get the next smallest image, we're going to average four pixels together to get the next smallest one."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
  },
  {
    id: 80,
    qid: `Q80`,
    qtype: `STORAGE`,
    format: `mcq`,
    timestamp: `1:12:50`,
    question: `What is the approximate storage overhead of a mipmap?`,
    options: [`50% more than the original image`, `Doubles the storage of the original image`, `Ten times the original image`, `About a third of the storage of the original image`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:12:50], the lecturer notes: "The entire storage cost of the mipmap is something like a third of the storage cost of the original image."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
  },
  {
    id: 81,
    qid: `Q81`,
    qtype: `SELECTION`,
    format: `mcq`,
    timestamp: `1:14:33`,
    question: `Which pixels should sample from a coarser mipmap level?`,
    options: [`Pixels that cover a larger region in texture space`, `Pixels near the edge of the screen`, `Pixels in shadow regions`, `Pixels that appear brighter`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:14:33], the lecturer explains: "The red pixel is going to cover a bigger region in texture space, so we want to effectively take an average over a larger region, which means we want to grab something from a coarser level of the mipmap hierarchy."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
  },
  {
    id: 82,
    qid: `Q82`,
    qtype: `CALCULATION`,
    format: `mcq`,
    timestamp: `1:15:35`,
    question: `How is the rate of change in texture coordinates calculated?`,
    options: [`By multiplying texture coordinates by the viewing angle`, `By computing differences between texture coordinate values in neighboring samples`, `By measuring the average color difference`, `By counting the number of pixels in the texture`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:15:35], the lecturer states: "What we can do is ask how quickly are the uv coordinates changing as we go along the horizontal direction and along the vertical direction."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
  },
  {
    id: 83,
    qid: `Q83`,
    qtype: `FORMULA`,
    format: `mcq`,
    timestamp: `1:16:57`,
    question: `What formula determines the mipmap level to use?`,
    options: [`The average of all texture coordinates`, `The log base 2 of the longer length L`, `The square root of the texture area`, `The sum of the u and v coordinates`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:16:57], the lecturer explains: "In particular we're going to let our mipmap level d be the log base 2 of the longer length capital L."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
  },
  {
    id: 84,
    qid: `Q84`,
    qtype: `REASON`,
    format: `mcq`,
    timestamp: `1:17:12`,
    question: `Why is a logarithm used in determining the mipmap level?`,
    options: [`Because each mipmap level divides the image size by two`, `To make calculations faster`, `To correct for gamma in the image`, `To match the sensitivity of human vision`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:17:12], the lecturer states: "Why are we taking a logarithm here? Well because to generate our mipmaps, each time we divided the image size by two. So we want to know which of those levels we're on, we need to take the log base two."`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
  },
  {
    id: 85,
    qid: `Q85`,
    qtype: `PROBLEM`,
    format: `mcq`,
    timestamp: `1:19:10`,
    question: `What artifact appears when using only the nearest mipmap level?`,
    options: [`Incorrect colors`, `Texture bleeding`, `Visible boundaries where the level jumps`, `Texture swimming`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:19:10], the lecturer explains: "If we just use the nearest mipmap level, so if we take that number d and we just clamp it to the closest integer, then we're going to get artifacts where this level jumps."
-`,
    code: ``,
    images: ["lec7_slide_68.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md.md`,
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

export default function Lec7Part3Quiz() {
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
    const p = Math.round(s / (24 || 1) * 100)
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
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 7: Texture Mapping — Part 3</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>UV mapping, mipmaps, filtering, environment maps, bump mapping</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-07-lecture-quiz.md.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec7/1`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec7/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
          <a key={3} href={`${BASE}/lec7/3`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 3</a>
          </div>
          <p style={{ color: C.accent, fontWeight: 600 }}>QQ62–QQ85 · 24 questions (24 graded + 0 open)</p>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>24</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Graded MCQ</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>0</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Open / Reveal</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>~8min</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Est. Time</div></div>
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
          <div style={{ fontSize: '1.2rem', color: C.muted, marginBottom: '0.75rem' }}>{score} / 24 MCQ correct</div>
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
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 7: Texture Mapping — Part 3</span>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', color: C.muted, fontSize: '0.875rem', alignItems: 'center' }}>
              <span><Clock size={14} style={{ display:'inline', verticalAlign:'middle', marginRight:'0.25rem' }} />{formatTime(t)}</span>
              <span>{qIdx+1}/24</span>
              <span style={{ color: C.accent }}>✓ {score}</span>
            </div>
          </div>
          <div style={{ height: '5px', background: C.border, borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.round((qIdx+1)/24*100)}%`, background: C.accent, transition: 'width 0.3s' }} />
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-07-lecture-quiz.md.md.</p>
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
              {qIdx < 24-1 ? 'Next Question' : 'View Results'} <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
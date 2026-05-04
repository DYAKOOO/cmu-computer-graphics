'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Layers } from 'lucide-react'

// Source: lectures/cg-08-lecture-quiz.md.md  (symlinked → Logseq pages)
// Lecture 8: Depth & Transparency — Part 1 · QQF1–QQ29 · 32 questions (29 MCQ, 3 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-08-lecture-quiz.md.md 8

const quizData = [
  {
    id: 1,
    qid: `QF1`,
    qtype: `FLOW`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `Lecture 8 is described as "wrapping up the rasterization pipeline." What two remaining problems does it solve, and why were they deferred until after rasterization and texture mapping were established?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `(1) Depth (occlusion): which of multiple overlapping triangles is visible at each pixel sample? (2) Transparency (alpha blending): how do we composit semi-transparent surfaces? Both were deferred because they depend on earlier stages: depth requires interpolating a per-vertex attribute (depth value) exactly like texture coords; transparency requires per-fragment alpha values that come from textures. Without rasterization and attribute interpolation in place, neither can be implemented.`,
    intuition: `Depth and transparency are the last two entries in the pipeline diagram shown at the start of the lecture.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 2,
    qid: `QF2`,
    qtype: `FLOW`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `The lecture presents two solutions to the occlusion problem: the painter's algorithm and the Z-buffer. What fundamental limitation of the painter's algorithm motivates the Z-buffer?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `The painter's algorithm sorts triangles by depth and draws back-to-front. This fails when triangles intersect or cyclically overlap (A behind B, B behind C, C behind A — no valid sort order exists). It also requires a global sort every frame. The Z-buffer solves this per-sample: for each sample, track the minimum depth seen so far and overwrite only if a new fragment is closer. No sort required, handles intersections naturally.`,
    intuition: `The painter's algorithm is a global ordering problem. The Z-buffer converts it to a local per-pixel problem.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 3,
    qid: `QF3`,
    qtype: `ORDER`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `Put these lecture 8 topics in the order they are covered: alpha compositing for transparency / Z-buffer algorithm / painter's algorithm (and why it fails) / depth interpolation using barycentric coordinates`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `Painter's algorithm → depth interpolation using barycentric coordinates → Z-buffer algorithm → alpha compositing for transparency`,
    intuition: `Establish the problem → how to compute depth → correct algorithmic solution → extend to semi-transparent surfaces.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 1,
    qid: `Q1`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `24:03`,
    question: `What advantage does pre-multiplied alpha provide in terms of channel handling during compositing?`,
    options: [`It treats all channels (RGB and alpha) the same way`, `It requires more arithmetic operations`, `It produces lower quality results at edges`, `It requires separate operations for color and alpha`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `As explained at [24:03], "Notice by the way that this operation composites alpha in exactly the same way as how it composites the red green and blue channels right we don't have separate operations for color and alpha."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 2,
    qid: `Q2`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `25:23`,
    question: `What mathematical framework is pre-multiplied alpha related to according to the lecture?`,
    options: [`Differential equations`, `Calculus`, `Homogeneous coordinates`, `Linear algebra`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [25:10], "Hopefully it reminds you of our discussion of homogeneous coordinates because that's exactly what this is we're expressing our colors and our alpha values in homogeneous coordinates."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 3,
    qid: `Q3`,
    qtype: `VISUAL`,
    format: `mcq`,
    timestamp: `26:51`,
    question: `What visual artifact appears when using non-premultiplied alpha during upsampling and compositing?`,
    options: [`Pixelation along edges`, `Completely transparent edges`, `A green halo around objects`, `A bright halo around objects`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer demonstrates at [26:51], "And i get this result and you notice it looks almost right i have a blue blob on a gray background but there's this green halo around my blue blob that's no good."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 4,
    qid: `Q4`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `28:13`,
    question: `What specific application scenario is mentioned when discussing the need for downsampling textures with alpha?`,
    options: [`Character animation`, `Shadow mapping`, `Tree leaf rendering`, `Terrain visualization`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer specifically mentions at [28:36], "I want to render leaves in my scene i have trees made of polygons i want to draw as just quads with textures on them okay and to do this in a nice way I want to map my textures so I get nice filtering."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 5,
    qid: `Q5`,
    qtype: `PROCESS`,
    format: `mcq`,
    timestamp: `29:38`,
    question: `When downsampling using pre-multiplied alpha, what happens to "darkened" colors when recovering the final color?`,
    options: [`They remain darkened`, `They get completely replaced with new colors`, `They get multiplied by alpha again`, `They get divided by alpha, making them brighter`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [29:57], "So if we divide the dark green by this this medium gray that's actually going to multiply it it's going to make it brighter and then when we composite it over the white background we get this nice light green color."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 6,
    qid: `Q6`,
    qtype: `CALCULATION`,
    format: `mcq`,
    timestamp: `31:17`,
    question: `When compositing a 50% opaque bright red primitive over another 50% opaque bright red primitive using non-premultiplied alpha, what is the resulting alpha value?`,
    options: [`0.75`, `1.0`, `0.5`, `0.25`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer calculates at [31:35], "And our alpha gets blended like this 0.5 plus 1 minus 0.5 times 0.5 is 0.75."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 7,
    qid: `Q7`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `32:56`,
    question: `What key advantage does pre-multiplied alpha provide when blending colors compared to non-premultiplied alpha?`,
    options: [`It only allows changes to alpha values, preserving original colors`, `It applies more complex mathematical operations`, `It changes both color and opacity during blending`, `It produces completely different colors than the originals`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [32:56], "I blended together two bright red things the color itself hasn't changed it's still bright red it's only the alpha that's changed it's increased to become more opaque."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 8,
    qid: `Q8`,
    qtype: `SUMMARY`,
    format: `mcq`,
    timestamp: `33:48`,
    question: `Which of the following is NOT listed as an advantage of pre-multiplied alpha?`,
    options: [`Fewer arithmetic operations`, `Improved depth testing accuracy`, `Better representation for filtering`, `Treating all channels the same`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [33:22-33:48], the lecturer lists advantages including treating all channels the same, fewer operations, closure under composition, and better filtering, but does not mention improved depth testing.`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 9,
    qid: `Q9`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `35:04`,
    question: `What fundamental challenge arises when trying to render semi-transparent primitives with depth testing?`,
    options: [`How to store color values`, `How to perform antialiasing`, `How to update the depth buffer for transparent primitives`, `How to calculate alpha values`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer poses this question at [35:04], "But what about depth if i draw a semi-transparent triangle should i change the depth value is that the closest thing i've seen now can't i still see triangles that i've already drawn through that triangle and shouldn't i care about their depth."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 10,
    qid: `Q10`,
    qtype: `REQUIREMENT`,
    format: `mcq`,
    timestamp: `36:59`,
    question: `Why is drawing transparent primitives described as "a real pain" in the rasterization pipeline?`,
    options: [`It requires complex mathematical operations`, `It requires sorting primitives in back-to-front order`, `It cannot be done in real-time`, `It requires more memory`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [35:57], "Only if things are drawn in back to front order," and later at [36:35] notes the challenges with sorting, including that it's "annoying" and "not something actually that's very easy to do on a graphics card."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 11,
    qid: `Q11`,
    qtype: `ALGORITHM`,
    format: `mcq`,
    timestamp: `38:05`,
    question: `What two-pass approach is described for rendering scenes with both opaque and transparent primitives?`,
    options: [`Render everything in one pass with a specialized shader`, `Render each object individually and composite them at the end`, `First render opaque objects with depth updates, then render transparent objects without depth updates`, `First render only transparent objects, then render opaque objects`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer describes at [38:23], "We can first render our opaque primitives in any order we want using the depth buffer... After we're done drawing all of our opaque triangles we're going to disable the depth buffer update... render semi-transparent surfaces in back to front order."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 12,
    qid: `Q12`,
    qtype: `GOAL`,
    format: `mcq`,
    timestamp: `39:38`,
    question: `According to the lecturer, what is the most important thing to remember about the rasterization pipeline?`,
    options: [`The goal is to maximize GPU utilization`, `It must be extremely fast`, `It must handle thousands of triangles`, `The goal is to turn inputs into a final image`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [40:03], "So the most important thing to remember is what is our goal what are we trying to do here we're trying to turn some inputs into a final image."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 13,
    qid: `Q13`,
    qtype: `INPUT`,
    format: `mcq`,
    timestamp: `40:54`,
    question: `Which of the following is NOT mentioned as an input to the rasterization pipeline?`,
    options: [`Object-to-camera transform`, `Texture coordinates (UV)`, `Lighting equations`, `List of triangle positions`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `Between [40:14] and [41:12], the lecturer lists triangle positions, texture coordinates, camera transform, perspective transform, and image dimensions, but does not mention lighting equations.`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 14,
    qid: `Q14`,
    qtype: `PROCESS`,
    format: `mcq`,
    timestamp: `42:04`,
    question: `What is the first transformation applied to triangles in the rasterization pipeline?`,
    options: [`Clipping to the view frustum`, `Homogeneous divide`, `Transformation to camera space`, `Perspective projection`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [41:51], "Okay what do we do first to each triangle we transform the triangles into camera space by applying the inverse of the camera transform."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 15,
    qid: `Q15`,
    qtype: `OPTIMIZATION`,
    format: `mcq`,
    timestamp: `43:33`,
    question: `What pre-processing step is performed before rasterizing individual samples of a triangle?`,
    options: [`Computing lighting values`, `Computing texture coordinates`, `Computing triangle edge equations and attributes`, `Computing vertex colors`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [43:33], "So we know we're going to need to do lots of checks with the triangle edges are we inside or outside these half planes so we can write down the triangle edge equations and attributes and so forth."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 16,
    qid: `Q16`,
    qtype: `PROCESS`,
    format: `mcq`,
    timestamp: `45:01`,
    question: `What is the final step in processing a triangle in the rasterization pipeline?`,
    options: [`Computing barycentric coordinates`, `Performing texture mapping`, `Applying shaders`, `Updating the color buffer if the depth test passed`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [45:01], "Right so we update the color buffer if the depth buffer test passed and that's it we've written values into our image now we just repeat this process for all the remaining triangles in our list and we're done."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 17,
    qid: `Q17`,
    qtype: `HARDWARE`,
    format: `mcq`,
    timestamp: `46:35`,
    question: `What key difference does the lecturer point out between the implementation of rasterizers in the class versus in real-world applications?`,
    options: [`Real-world rasterizers use different algorithms`, `Real-world rasterizers are slower but more accurate`, `Real-world rasterizers don't use depth buffers`, `Real-world rasterizers are implemented in hardware rather than software`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [47:24], "And so these rasterizers are not going to be implemented in software people aren't writing them on their you know cpus like you're doing for this class but they've actually been baked into hardware these days."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 18,
    qid: `Q18`,
    qtype: `HARDWARE`,
    format: `mcq`,
    timestamp: `48:08`,
    question: `How does the lecturer describe the architecture of a GPU?`,
    options: [`A single powerful processor with high clock speeds`, `A collection of identical CPU cores`, `A purely software-based parallel system`, `A heterogeneous multi-core processor with specialized hardware`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [48:08], "A gpu is really a heterogeneous multi-core processor so it's not just a big bunch of cpus glued onto a single chip it also has some highly highly specialized hardware that does some of the operations that you now know and love."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 19,
    qid: `Q19`,
    qtype: `TREND`,
    format: `mcq`,
    timestamp: `49:43`,
    question: `What trend in GPU pipeline design does the lecturer identify?`,
    options: [`Moving towards less parallelism but higher clock speeds`, `Moving towards fixed-function-only designs`, `Moving towards more flexible scheduling of pipeline stages`, `Moving away from hardware acceleration`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [49:43], "And even more flexible scheduling of stages so rather than just going linear down linearly down the pipeline you can now tell the gpu hey take the data that you computed in this stage and actually feed it back to an earlier stage of the pipeline."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 20,
    qid: `Q20`,
    qtype: `COMPARISON`,
    format: `mcq`,
    timestamp: `51:05`,
    question: `What advantage of ray tracing over rasterization does the lecturer highlight in the NVIDIA demo?`,
    options: [`Ray tracing works better for 2D graphics`, `Ray tracing is much faster than rasterization`, `Ray tracing requires less computational power`, `Ray tracing produces physically accurate lighting effects in real-time`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [51:05], "The thing to realize is that all of these lighting effects all these shadows and the light bouncing off various surfaces is all being done in real time. And this is stuff that you really can't pull off very easily with rasterization."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 21,
    qid: `Q21`,
    qtype: `PREVIEW`,
    format: `mcq`,
    timestamp: `51:53`,
    question: `Which of the following topics does the lecturer NOT mention as upcoming in the course?`,
    options: [`Geometry`, `Animation`, `Materials and lighting`, `Virtual reality`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [52:28], the lecturer previews, "Next time we're going to start talking about geometry and then we're going to move on to materials and lighting and photorealistic rendering and finally near the end of the course we'll talk about animation," but does not mention virtual reality.`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 22,
    qid: `Q22`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `24:03`,
    question: `What does the lecturer compare the alpha channel to when discussing unpremultiplication?`,
    options: [`A color component like RGB`, `The w-component in homogeneous coordinates`, `A depth value in the z-buffer`, `A scaling factor in linear algebra`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer makes this connection around [24:57], asking "Does this division remind you of anything does this division and adding a fourth coordinate onto our vectors does that remind you of anything we've seen before... hopefully it reminds you of our discussion of homogeneous coordinates."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 23,
    qid: `Q23`,
    qtype: `INTERPRETATION`,
    format: `mcq`,
    timestamp: `25:23`,
    question: `In the homogeneous color model, what does the lecturer say different opacities of the same color represent geometrically?`,
    options: [`Different planes in 3D space`, `Different points along a line in that direction`, `Different distances from the origin`, `Different angles in color space`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [25:23], "Right so now we can think of colors as different directions and different opacities of those colors as points along the line in that direction."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 24,
    qid: `Q24`,
    qtype: `PROBLEM`,
    format: `mcq`,
    timestamp: `26:51`,
    question: `In the upsampling example with the blue blob, what was causing the green halo artifact?`,
    options: [`Incorrect perspective projection`, `Improper depth testing`, `A bug in the rendering algorithm`, `Using non-premultiplied alpha with the background color bleeding through`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer demonstrates that when using non-premultiplied alpha, the green background color from the original image bleeds through during upsampling and compositing, creating the green halo effect.`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 25,
    qid: `Q25`,
    qtype: `SCENARIO`,
    format: `mcq`,
    timestamp: `28:13`,
    question: `Why is building mipmaps for textures with alpha values particularly important?`,
    options: [`It eliminates the need for sorting transparent primitives`, `It reduces memory usage`, `It allows proper filtering at texture edges for semi-transparent objects like leaves`, `It improves depth testing`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [28:36] that proper filtering is important for rendering objects like tree leaves with transparent edges, which is why correct mipmapping with alpha values matters.`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 26,
    qid: `Q26`,
    qtype: `PROCESS`,
    format: `mcq`,
    timestamp: `29:38`,
    question: `In the pre-multiplied downsampling approach, what happens to the color values first?`,
    options: [`They are divided by alpha`, `They are converted to grayscale`, `They are multiplied by alpha`, `They are added together then averaged`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [29:38], "If on the other hand we were to pre-multiply the color so we multiply color by alpha right so now we get just green and black."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 27,
    qid: `Q27`,
    qtype: `CALCULATION`,
    format: `mcq`,
    timestamp: `31:17`,
    question: `When compositing two identical 50% opaque bright red primitives using non-premultiplied alpha, what RGB value do you get?`,
    options: [`(0.5, 0, 0)`, `(0.25, 0, 0)`, `(0.75, 0, 0)`, `(1.0, 0, 0)`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer calculates at [31:35], "If we do the arithmetic here we get 0.75 0 0," showing the resulting RGB value is (0.75, 0, 0).`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 28,
    qid: `Q28`,
    qtype: `RESULT`,
    format: `mcq`,
    timestamp: `32:56`,
    question: `What is the final RGB color when compositing two identical 50% opaque bright red primitives using pre-multiplied alpha?`,
    options: [`(1.0, 0, 0)`, `(0.75, 0, 0)`, `(0.25, 0, 0)`, `(0.5, 0, 0)`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [32:41], "But remember that to recover the original color i'm going to actually divide by alpha so the color i get is bright red 1 0 0 and the alpha i get is still that .75."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
  },
  {
    id: 29,
    qid: `Q29`,
    qtype: `ADVANTAGE`,
    format: `mcq`,
    timestamp: `33:48`,
    question: `Which of these is mentioned as an advantage of pre-multiplied alpha for the graphics pipeline?`,
    options: [`It makes depth testing more accurate`, `It allows for faster ray tracing`, `It fits naturally with homogeneous coordinates already used in the pipeline`, `It requires less memory`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [34:02], "And also it fits naturally into the rasterization pipeline we've already built so we've already said homogeneous coordinates are a good idea we're going to work with 4x4 matrices our graphics card is built that way."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md.md`,
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

export default function Lec8Part1Quiz() {
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
          <Layers size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 8: Depth & Transparency — Part 1</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Z-buffer, painter's algorithm, alpha blending, order-independent</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-08-lecture-quiz.md.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec8/1`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec8/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
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
              <Layers size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 8: Depth & Transparency — Part 1</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-08-lecture-quiz.md.md.</p>
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
'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Monitor } from 'lucide-react'

// Source: lectures/cg-04-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 4: Rasterization & Sampling — Part 1 · QQ1–QQ32 · 32 questions (32 MCQ, 0 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-04-lecture-quiz.md 4

const quizData = [
  {
    id: 1,
    qid: `Q1`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `00:35`,
    question: `What is the basic principle of rasterization according to the lecture?`,
    options: [`For each primitive, determine which pixels it covers`, `For each pixel, determine which primitive it contains`, `For each image, determine the viewing frustum`, `For each triangle, compute its barycentric coordinates`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [00:35], the lecturer states: "Rasterization basically says for each primitive we want to draw each triangle or line segment or point which pixels of the image should get lit up."`,
    code: ``,
    images: ["image_1771995310239_0.png"],
    tags: ["rasterization", "RayTracing"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 2,
    qid: `Q2`,
    qtype: `COMPARISON`,
    format: `mcq`,
    timestamp: `00:42`,
    question: `According to the lecture, what is a key advantage of rasterization?`,
    options: [`It handles transparency better`, `It works well with curved surfaces`, `It can be made extremely fast`, `It produces more photorealistic images`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [00:42], the lecturer explains: "This technique is extremely popular extremely valuable because it can be made extremely fast. We can get billions of triangles on the screen every second if we're using modern graphics hardware."`,
    code: ``,
    images: ["image_1771995625008_0.png"],
    tags: ["rasterization"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 3,
    qid: `Q3`,
    qtype: `COMPARISON`,
    format: `mcq`,
    timestamp: `01:35`,
    question: `What is the main difference between rasterization and ray tracing described in the lecture?`,
    options: [`Ray tracing is pixel-centric while rasterization is primitive-centric`, `Rasterization can handle curved surfaces better`, `Rasterization takes longer to compute`, `Ray tracing is more common in video games`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [01:35], the lecturer explains that ray tracing asks "for each pixel which primitives are seen through that pixel," contrasting with rasterization which asks "for each primitive which pixels it covers."`,
    code: ``,
    images: ["image_1771995779127_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 4,
    qid: `Q4`,
    qtype: `LIMITATION`,
    format: `mcq`,
    timestamp: `01:58`,
    question: `What is a significant limitation of ray tracing according to the lecture?`,
    options: [`It cannot handle transparent surfaces`, `It is much slower than rasterization`, `It requires specialized hardware`, `It cannot produce photorealistic images`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [01:58], the lecturer states: "Ray tracing is a lot slower we might have to wait minutes or even hours to generate one image rather than drawing billions of triangles per second or having hundreds of frames per second on the gpu."`,
    code: ``,
    images: ["image_1771995781860_0.png"],
    tags: ["Limitation", "Constraint"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 5,
    qid: `Q5`,
    qtype: `PIPELINE`,
    format: `mcq`,
    timestamp: `02:26`,
    question: `What is a key characteristic of stages in a graphics pipeline?`,
    options: [`They operate independently from each other`, `They are programmed in hardware`, `They all run in parallel`, `They have highly structured input and output data`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [02:38], the lecturer explains that "each one of these stages is going to request data as input in a very structured way, some really simple regular description of the input data, and likewise it's going to have some simple regular structure for the output data."`,
    code: ``,
    images: ["image_1771995841829_0.png"],
    tags: ["Pipeline"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 6,
    qid: `Q6`,
    qtype: `OPTIMIZATION`,
    format: `mcq`,
    timestamp: `02:57`,
    question: `Why is having highly structured data in the graphics pipeline valuable?`,
    options: [`It enables simplified and optimized computation`, `It ensures compatibility with hardware`, `It allows for standardized protocols`, `It makes debugging easier`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [02:57], the lecturer states: "Because this data is highly structured and highly predictable you can really go to town and simplify and optimize the computation within that stage."`,
    code: ``,
    images: ["image_1771995932491_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 7,
    qid: `Q7`,
    qtype: `EXAMPLE`,
    format: `mcq`,
    timestamp: `04:24`,
    question: `What were the two main components used to represent a 3D shape in the first lecture example?`,
    options: [`Triangles and textures`, `Vertices and edges`, `Vertices and colors`, `Points and normals`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [04:24], the lecturer recalls: "We said we could represent the cube or any other kind of three-dimensional shape as two things: a collection of vertices, vertex locations in space, and a collection of edges saying which of those vertices get connected together to make line segments."`,
    code: ``,
    images: ["image_1771995940681_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 8,
    qid: `Q8`,
    qtype: `HARDWARE`,
    format: `mcq`,
    timestamp: `06:59`,
    question: `What specialized hardware is typically used to perform rasterization?`,
    options: [`APU (Accelerated Processing Unit)`, `FPGA (Field-Programmable Gate Array)`, `CPU (Central Processing Unit)`, `GPU (Graphics Processing Unit)`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [06:59], the lecturer explains: "Real rasterization is typically performed by what's called a graphics processing unit or a GPU. So this is a real physical piece of hardware that sits inside your computer and it has a chip on it that's different from your CPU."`,
    code: ``,
    images: ["image_1771995973214_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 9,
    qid: `Q9`,
    qtype: `PRIMITIVE`,
    format: `mcq`,
    timestamp: `08:31`,
    question: `What is one of the key advantages of using triangles for rasterization?`,
    options: [`They are faster to process than points or lines`, `They can represent curved surfaces perfectly`, `They require less memory than other primitives`, `They are always planar (have a well-defined plane)`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [09:16], the lecturer states: "Another thing that's good about triangles is that they're always planar they always have a well-defined plane passing through the three vertices."`,
    code: ``,
    images: ["image_1771995996932_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 10,
    qid: `Q10`,
    qtype: `ADVANTAGE`,
    format: `mcq`,
    timestamp: `09:42`,
    question: `Why is the planarity of triangles particularly important for shading?`,
    options: [`It makes texturing easier`, `It allows for faster processing`, `It simplifies memory storage`, `It ensures a well-defined normal direction`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [09:42], the lecturer explains: "It's extremely important for shading. So if I want to shade a surface I often need to know what is the normal direction what is the direction orthogonal to the surface and so for a triangle that normal is always well defined."`,
    code: ``,
    images: ["image_1771996003755_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 11,
    qid: `Q11`,
    qtype: `ADVANTAGE`,
    format: `mcq`,
    timestamp: `09:56`,
    question: `What advantage of triangles related to data at vertices is mentioned in the lecture?`,
    options: [`They allow for automatic level-of-detail`, `They support complex texturing operations`, `They provide better compression of vertex data`, `They enable easy interpolation of data across the triangle`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [09:56], the lecturer states: "It'll also turn out to be very easy to interpolate data at corners so if I have three color values at the corners of a triangle and I want to smoothly blend those color values across the rest of the triangle, it's going to be really really simple and efficient."`,
    code: ``,
    images: ["image_1771996850703_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 12,
    qid: `Q12`,
    qtype: `PIPELINE`,
    format: `mcq`,
    timestamp: `11:28`,
    question: `What is the first stage in the rasterization pipeline described in the lecture?`,
    options: [`Interpolating attributes at vertices`, `Projection onto the 2D screen`, `Sampling triangle coverage`, `Transformation and positioning in the world`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [11:28], the lecturer states: "The first thing we're going to do once we have our list of triangles is we're going to transform and position these things in the world in the scene where we want them to be."`,
    code: ``,
    images: ["image_1771996856893_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 13,
    qid: `Q13`,
    qtype: `COVERAGE`,
    format: `mcq`,
    timestamp: `13:44`,
    question: `What is the basic question of rasterization according to the lecture?`,
    options: [`For each vertex, which pixels should be affected?`, `For each triangle, which pixels are covered by it?`, `For each image, how many triangles are visible?`, `For each pixel, which triangle is closest to the camera?`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [13:44], the lecturer directly states: "For a given triangle for this red triangle here what pixels does the triangle overlap that's the basic question of rasterization the question of coverage."`,
    code: ``,
    images: ["image_1771996867247_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 14,
    qid: `Q14`,
    qtype: `VISIBILITY`,
    format: `mcq`,
    timestamp: `14:01`,
    question: `What is meant by the "occlusion question" in the lecture?`,
    options: [`When multiple triangles cover a pixel, which one is visible?`, `Which triangles are outside the viewing frustum?`, `Which triangles should be culled?`, `Which triangles are too small to be visible?`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [14:01], the lecturer explains: "We know that the red triangle covers this pixel we might know that another triangle the blue triangle covers this pixel which one is closer to the camera which color value do we finally see and that's the question of occlusion."`,
    code: ``,
    images: ["image_1771997084252_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 15,
    qid: `Q15`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `14:15`,
    question: `What is another name for the occlusion problem mentioned in the lecture?`,
    options: [`The z-buffer problem`, `The visibility problem`, `The hidden surface problem`, `The culling problem`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [14:15], the lecturer states: "This second question this question is called the visibility problem."`,
    code: ``,
    images: ["image_1771997069120_0.png"],
    tags: ["Visibility"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 16,
    qid: `Q16`,
    qtype: `COVERAGE`,
    format: `mcq`,
    timestamp: `16:32`,
    question: `When defining what it means for a pixel to be covered by a triangle, which case is straightforward according to the lecture?`,
    options: [`When the triangle's vertex is inside the pixel`, `When the triangle completely covers the pixel`, `When the triangle partially covers the pixel`, `When the triangle's edge passes through the pixel`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [17:03], the lecturer explains: "Triangle four is also pretty easy, four covers the entire pixel so it's really easy to say yeah for sure the pixel is covered by triangle four."`,
    code: ``,
    images: ["image_1771997185693_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 17,
    qid: `Q17`,
    qtype: `APPROACH`,
    format: `mcq`,
    timestamp: `17:50`,
    question: `What approach does the lecturer suggest for handling partial pixel coverage?`,
    options: [`Always treat partially covered pixels as fully covered`, `Never count partially covered pixels`, `Randomly decide whether to count partial coverage`, `Record the fraction of the pixel area covered by the triangle`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [17:50], the lecturer states: "Instead of just recording a binary value yes or no maybe one option is to say really what we want to know is the fraction of the pixel area covered by the triangle."`,
    code: ``,
    images: ["image_1771997211546_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 18,
    qid: `Q18`,
    qtype: `COMPLEXITY`,
    format: `mcq`,
    timestamp: `18:52`,
    question: `Why is it difficult to compute the exact coverage fraction when multiple triangles are involved?`,
    options: [`Triangles might have different depths`, `Triangles might have different colors`, `The math is too complex to compute in real-time`, `Complex regions of overlap can form non-convex shapes`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [18:57], the lecturer explains the challenge: "We might have non-convex regions where they overlap and so forth."`,
    code: ``,
    images: ["image_1771997219796_0.png"],
    tags: ["Convex", "Complexity"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 19,
    qid: `Q19`,
    qtype: `APPROACH`,
    format: `mcq`,
    timestamp: `20:22`,
    question: `What is the sampling approach to determining coverage?`,
    options: [`Calculate the area of triangle-pixel overlap analytically`, `Approximate the triangle with smaller primitives`, `Test several sample points and use statistics to estimate coverage`, `Use a lookup table for predetermined coverage patterns`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [20:22], the lecturer explains: "We're not going to compute the exact or analytical answer but instead we're going to test a collection of sample points right and we're just going to say for each sample point which triangle do we see."`,
    code: ``,
    images: ["image_1771997254170_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 20,
    qid: `Q20`,
    qtype: `SAMPLING`,
    format: `mcq`,
    timestamp: `21:09`,
    question: `What is the basic definition of sampling given in the lecture?`,
    options: [`Removing high-frequency components from a signal`, `Converting analog signals to digital values`, `Reducing the resolution of an image`, `Selecting values of a function at specific points`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [21:09], the lecturer states: "Sampling all that means is I pick some values x naught x1 x2 x3 and so on and I ask what is the value of the function at those points."`,
    code: ``,
    images: ["image_1771997323964_0.png"],
    tags: ["Sampling"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 21,
    qid: `Q21`,
    qtype: `EXAMPLE`,
    format: `mcq`,
    timestamp: `21:33`,
    question: `What example of a common sampled signal is given in the lecture?`,
    options: [`Digital photographs`, `Vector graphics`, `Audio files`, `3D models`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [21:33], the lecturer gives this example: "A great example of this would be an audio file so an audio file that you use to listen to music stores samples of a one-dimensional signal what is that signal it's the amplitude."`,
    code: ``,
    images: ["image_1771997334974_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 22,
    qid: `Q22`,
    qtype: `RATE`,
    format: `mcq`,
    timestamp: `21:52`,
    question: `According to the lecture, at what rate is most consumer audio sampled?`,
    options: [`48,000 times per second`, `22,000 times per second`, `44,000 times per second`, `32,000 times per second`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [21:52], the lecturer states: "In fact most consumer audio is sampled 44,000 times a second to get a realistic reproduction of sound."`,
    code: ``,
    images: ["image_1771997342659_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 23,
    qid: `Q23`,
    qtype: `RECONSTRUCTION`,
    format: `mcq`,
    timestamp: `22:33`,
    question: `What is the reconstruction problem in signal processing?`,
    options: [`Creating a continuous function from discrete samples`, `Converting a digital signal back to analog form`, `Removing noise from a sampled signal`, `Finding the original signal from a degraded version`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [22:33], the lecturer defines the problem: "How do you turn those numbers back into a continuous signal that you can listen to and that's the problem of reconstruction... given a set of samples how can we cook up some continuous function some function where we know the value at every point in time rather than just at the sample times."`,
    code: ``,
    images: ["image_1771997354506_0.png"],
    tags: ["Reconstruction"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 24,
    qid: `Q24`,
    qtype: `METHOD`,
    format: `mcq`,
    timestamp: `23:21`,
    question: `What is the most basic reconstruction approach described in the lecture?`,
    options: [`Linear interpolation`, `Piecewise constant approximation`, `Sine wave interpolation`, `Cubic splines`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [23:21], the lecturer explains: "One really basic idea would be to use a piecewise constant approximation. I don't know what the function is equal to for every value of x so what I'm going to do is just say okay find the closest value of x where I do know the function value and just use that one."`,
    code: ``,
    images: ["image_1771997377787_0.png"],
    tags: ["Reconstruction"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 25,
    qid: `Q25`,
    qtype: `PROBLEM`,
    format: `mcq`,
    timestamp: `24:27`,
    question: `What issue with piecewise linear reconstruction is highlighted in the lecture?`,
    options: [`It uses too much memory`, `It requires too much computation`, `It can miss significant features between sample points`, `It creates artificial high frequencies`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [24:27], the lecturer points out: "I've completely missed some of these big bumps in the function especially near the end I have these two huge bumps between x2 and x3 that don't show up at all in my piecewise linear approximation."`,
    code: ``,
    images: ["image_1771997414620_0.png"],
    tags: ["Approximation", "Linear"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 26,
    qid: `Q26`,
    qtype: `SOLUTION`,
    format: `mcq`,
    timestamp: `24:56`,
    question: `What is the most basic solution to improve reconstruction quality?`,
    options: [`Use a more sophisticated interpolation method`, `Use frequency domain techniques`, `Apply a smoothing filter`, `Increase the sampling rate`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [24:56], the lecturer explains: "The most basic thing we could do is we could just say how about we sample the signal more densely how about we just take more sample points if we missed certain features then we should just sample more frequently and we'll capture those features."

The next question skips this sldie`,
    code: ``,
    images: ["image_1771997426297_0.png", "image_1771997568372_0.png"],
    tags: ["Reconstruction"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 27,
    qid: `Q27`,
    qtype: `COVERAGE`,
    format: `mcq`,
    timestamp: `28:14`,
    question: `How does the lecture define the coverage function for rasterization?`,
    options: [`A function that returns the depth of each pixel`, `A function that calculates triangle area`, `A binary function that indicates whether a point is inside a triangle (1) or not (0)`, `A function that determines pixel color based on triangle properties`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [28:14], the lecturer explains: "The coverage function is a function defined at every single point in the entire plane... and it's equal to one if that point is contained inside the triangle and it's equal to zero otherwise."`,
    code: ``,
    images: ["image_1771997491695_0.png"],
    tags: ["coverage", "rasterization", "Function"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 28,
    qid: `Q28`,
    qtype: `CHALLENGE`,
    format: `mcq`,
    timestamp: `29:06`,
    question: `What challenge arises when an edge passes directly through a sample point?`,
    options: [`The pixel appears darker than it should`, `It's ambiguous which triangle covers the pixel`, `The algorithm fails completely`, `The computation becomes too slow`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [29:06], the lecturer asks: "I have two triangles meeting at an edge and that edge passes exactly through my sample point. So what do I do? Is this sample point covered by triangle one or is it covered by triangle two or is it in some sense covered by both of them?"`,
    code: ``,
    images: ["image_1771997713972_0.png", "image_1771997770145_0.png", "image_1771997762595_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 29,
    qid: `Q29`,
    qtype: `SOLUTION`,
    format: `mcq`,
    timestamp: `29:53`,
    question: `What is one approach mentioned for handling edge cases when a sample point falls exactly on a triangle edge?`,
    options: [`Classify based on whether it's a top edge or left edge`, `Move the sample point slightly`, `Never count points exactly on edges`, `Always count both triangles sharing the edge`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [29:53], the lecturer explains: "If an edge falls directly on a screen sample point for instance you could say the sample is classified within the triangle if the edge is a top edge or a left edge."`,
    code: ``,
    images: ["image_1771997805702_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 30,
    qid: `Q30`,
    qtype: `DISPLAY`,
    format: `mcq`,
    timestamp: `31:46`,
    question: `In the context of displaying sampled image values, what does a pixel represent according to the lecture?`,
    options: [`A weighted average of surrounding points`, `A square of light with uniform color`, `A mathematical point with no area`, `A triangular region on screen`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [31:46], the lecturer states: "Each image sample sent to the display is converted into roughly speaking a little square of light and maybe you get to specify the color of that light."`,
    code: ``,
    images: ["image_1771997934002_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 31,
    qid: `Q31`,
    qtype: `TERM`,
    format: `mcq`,
    timestamp: `31:57`,
    question: `According to the lecture, what does the term "pixel" stand for?`,
    options: [`Pixelated image`, `Picture element`, `Picture cell`, `Point index location`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [31:57], the lecturer explains: "The word pixel is just an abbreviation for picture element right you have a picture it's your entire screen one little element of that is a pixel."`,
    code: ``,
    images: ["image_1771998071836_0.png"],
    tags: ["pixel"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 32,
    qid: `Q32`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `33:47`,
    question: `What is aliasing in the context of computer graphics?`,
    options: [`When colors look different on different displays`, `When one triangle is rendered on top of another`, `When triangles are too small to be visible`, `When a mismatch occurs between sampling and reconstruction`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [33:47], the lecturer introduces: "This leads us into a discussion of something that's really core to computer graphics which is the phenomenon of aliasing," and throughout the lecture explains it as a mismatch between sampling and reconstruction causing misrepresentation of the original signal.`,
    code: ``,
    images: ["image_1771998130102_0.png", "image_1771998135778_0.png"],
    tags: ["Aliasing", "definition"],
    source: `lectures/cg-04-lecture-quiz.md`,
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

export default function Lec4Part1Quiz() {
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
    accent: '#34d399', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec4'
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
          <Monitor size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 4: Rasterization & Sampling — Part 1</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Pipeline, Coverage, Aliasing, SSAA, Nyquist</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-04-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec4/1`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec4/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
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
          <Monitor size={20} /> Start Quiz
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
              <Monitor size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 4: Rasterization & Sampling — Part 1</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-04-lecture-quiz.md.</p>
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
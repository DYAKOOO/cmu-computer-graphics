'use client'
import { useState, useEffect, useRef } from 'react'
import { Monitor } from 'lucide-react'

// Source: lectures/cg-04-lecture-quiz.md  (symlinked from Logseq pages)
// Lecture 4: Rasterization & Sampling — Part 1 — Q1–Q32 (32 questions)
// Re-generate: python3 scripts/gen_quiz.py lectures/cg-04-lecture-quiz.md 4

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
    timestamp: `00:35`,
    question: `What is the basic principle of rasterization according to the lecture?`,
    options: [`For each pixel, determine which primitive it contains`, `For each primitive, determine which pixels it covers`, `For each triangle, compute its barycentric coordinates`, `For each image, determine the viewing frustum`],
    answer: 1,
    explanation: `At [00:35], the lecturer states: "Rasterization basically says for each primitive we want to draw each triangle or line segment or point which pixels of the image should get lit up."`,
    images: ["image_1771995310239_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 2,
    timestamp: `00:42`,
    question: `According to the lecture, what is a key advantage of rasterization?`,
    options: [`It produces more photorealistic images`, `It works well with curved surfaces`, `It can be made extremely fast`, `It handles transparency better`],
    answer: 2,
    explanation: `At [00:42], the lecturer explains: "This technique is extremely popular extremely valuable because it can be made extremely fast. We can get billions of triangles on the screen every second if we're using modern graphics hardware."`,
    images: ["image_1771995625008_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 3,
    timestamp: `01:35`,
    question: `What is the main difference between rasterization and ray tracing described in the lecture?`,
    options: [`Ray tracing is more common in video games`, `Rasterization takes longer to compute`, `Ray tracing is pixel-centric while rasterization is primitive-centric`, `Rasterization can handle curved surfaces better`],
    answer: 2,
    explanation: `At [01:35], the lecturer explains that ray tracing asks "for each pixel which primitives are seen through that pixel," contrasting with rasterization which asks "for each primitive which pixels it covers."`,
    images: ["image_1771995779127_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 4,
    timestamp: `01:58`,
    question: `What is a significant limitation of ray tracing according to the lecture?`,
    options: [`It cannot handle transparent surfaces`, `It is much slower than rasterization`, `It requires specialized hardware`, `It cannot produce photorealistic images`],
    answer: 1,
    explanation: `At [01:58], the lecturer states: "Ray tracing is a lot slower we might have to wait minutes or even hours to generate one image rather than drawing billions of triangles per second or having hundreds of frames per second on the gpu."`,
    images: ["image_1771995781860_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 5,
    timestamp: `02:26`,
    question: `What is a key characteristic of stages in a graphics pipeline?`,
    options: [`They operate independently from each other`, `They all run in parallel`, `They have highly structured input and output data`, `They are programmed in hardware`],
    answer: 2,
    explanation: `At [02:38], the lecturer explains that "each one of these stages is going to request data as input in a very structured way, some really simple regular description of the input data, and likewise it's going to have some simple regular structure for the output data."`,
    images: ["image_1771995841829_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 6,
    timestamp: `02:57`,
    question: `Why is having highly structured data in the graphics pipeline valuable?`,
    options: [`It makes debugging easier`, `It allows for standardized protocols`, `It enables simplified and optimized computation`, `It ensures compatibility with hardware`],
    answer: 2,
    explanation: `At [02:57], the lecturer states: "Because this data is highly structured and highly predictable you can really go to town and simplify and optimize the computation within that stage."`,
    images: ["image_1771995932491_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 7,
    timestamp: `04:24`,
    question: `What were the two main components used to represent a 3D shape in the first lecture example?`,
    options: [`Vertices and colors`, `Triangles and textures`, `Vertices and edges`, `Points and normals`],
    answer: 2,
    explanation: `At [04:24], the lecturer recalls: "We said we could represent the cube or any other kind of three-dimensional shape as two things: a collection of vertices, vertex locations in space, and a collection of edges saying which of those vertices get connected together to make line segments."`,
    images: ["image_1771995940681_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 8,
    timestamp: `06:59`,
    question: `What specialized hardware is typically used to perform rasterization?`,
    options: [`CPU (Central Processing Unit)`, `GPU (Graphics Processing Unit)`, `APU (Accelerated Processing Unit)`, `FPGA (Field-Programmable Gate Array)`],
    answer: 1,
    explanation: `At [06:59], the lecturer explains: "Real rasterization is typically performed by what's called a graphics processing unit or a GPU. So this is a real physical piece of hardware that sits inside your computer and it has a chip on it that's different from your CPU."`,
    images: ["image_1771995973214_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 9,
    timestamp: `08:31`,
    question: `What is one of the key advantages of using triangles for rasterization?`,
    options: [`They require less memory than other primitives`, `They are always planar (have a well-defined plane)`, `They can represent curved surfaces perfectly`, `They are faster to process than points or lines`],
    answer: 1,
    explanation: `At [09:16], the lecturer states: "Another thing that's good about triangles is that they're always planar they always have a well-defined plane passing through the three vertices."`,
    images: ["image_1771995996932_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 10,
    timestamp: `09:42`,
    question: `Why is the planarity of triangles particularly important for shading?`,
    options: [`It makes texturing easier`, `It allows for faster processing`, `It ensures a well-defined normal direction`, `It simplifies memory storage`],
    answer: 2,
    explanation: `At [09:42], the lecturer explains: "It's extremely important for shading. So if I want to shade a surface I often need to know what is the normal direction what is the direction orthogonal to the surface and so for a triangle that normal is always well defined."`,
    images: ["image_1771996003755_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 11,
    timestamp: `09:56`,
    question: `What advantage of triangles related to data at vertices is mentioned in the lecture?`,
    options: [`They allow for automatic level-of-detail`, `They enable easy interpolation of data across the triangle`, `They provide better compression of vertex data`, `They support complex texturing operations`],
    answer: 1,
    explanation: `At [09:56], the lecturer states: "It'll also turn out to be very easy to interpolate data at corners so if I have three color values at the corners of a triangle and I want to smoothly blend those color values across the rest of the triangle, it's going to be really really simple and efficient."`,
    images: ["image_1771996850703_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 12,
    timestamp: `11:28`,
    question: `What is the first stage in the rasterization pipeline described in the lecture?`,
    options: [`Projection onto the 2D screen`, `Sampling triangle coverage`, `Transformation and positioning in the world`, `Interpolating attributes at vertices`],
    answer: 2,
    explanation: `At [11:28], the lecturer states: "The first thing we're going to do once we have our list of triangles is we're going to transform and position these things in the world in the scene where we want them to be."`,
    images: ["image_1771996856893_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 13,
    timestamp: `13:44`,
    question: `What is the basic question of rasterization according to the lecture?`,
    options: [`For each pixel, which triangle is closest to the camera?`, `For each triangle, which pixels are covered by it?`, `For each vertex, which pixels should be affected?`, `For each image, how many triangles are visible?`],
    answer: 1,
    explanation: `At [13:44], the lecturer directly states: "For a given triangle for this red triangle here what pixels does the triangle overlap that's the basic question of rasterization the question of coverage."`,
    images: ["image_1771996867247_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 14,
    timestamp: `14:01`,
    question: `What is meant by the "occlusion question" in the lecture?`,
    options: [`Which triangles are too small to be visible?`, `Which triangles are outside the viewing frustum?`, `Which triangles should be culled?`, `When multiple triangles cover a pixel, which one is visible?`],
    answer: 3,
    explanation: `At [14:01], the lecturer explains: "We know that the red triangle covers this pixel we might know that another triangle the blue triangle covers this pixel which one is closer to the camera which color value do we finally see and that's the question of occlusion."`,
    images: ["image_1771997084252_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 15,
    timestamp: `14:15`,
    question: `What is another name for the occlusion problem mentioned in the lecture?`,
    options: [`The culling problem`, `The hidden surface problem`, `The visibility problem`, `The z-buffer problem`],
    answer: 2,
    explanation: `At [14:15], the lecturer states: "This second question this question is called the visibility problem."`,
    images: ["image_1771997069120_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 16,
    timestamp: `16:32`,
    question: `When defining what it means for a pixel to be covered by a triangle, which case is straightforward according to the lecture?`,
    options: [`When the triangle partially covers the pixel`, `When the triangle's edge passes through the pixel`, `When the triangle completely covers the pixel`, `When the triangle's vertex is inside the pixel`],
    answer: 2,
    explanation: `At [17:03], the lecturer explains: "Triangle four is also pretty easy, four covers the entire pixel so it's really easy to say yeah for sure the pixel is covered by triangle four."`,
    images: ["image_1771997185693_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 17,
    timestamp: `17:50`,
    question: `What approach does the lecturer suggest for handling partial pixel coverage?`,
    options: [`Always treat partially covered pixels as fully covered`, `Record the fraction of the pixel area covered by the triangle`, `Never count partially covered pixels`, `Randomly decide whether to count partial coverage`],
    answer: 1,
    explanation: `At [17:50], the lecturer states: "Instead of just recording a binary value yes or no maybe one option is to say really what we want to know is the fraction of the pixel area covered by the triangle."`,
    images: ["image_1771997211546_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 18,
    timestamp: `18:52`,
    question: `Why is it difficult to compute the exact coverage fraction when multiple triangles are involved?`,
    options: [`Triangles might have different colors`, `The math is too complex to compute in real-time`, `Complex regions of overlap can form non-convex shapes`, `Triangles might have different depths`],
    answer: 2,
    explanation: `At [18:57], the lecturer explains the challenge: "We might have non-convex regions where they overlap and so forth."`,
    images: ["image_1771997219796_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 19,
    timestamp: `20:22`,
    question: `What is the sampling approach to determining coverage?`,
    options: [`Calculate the area of triangle-pixel overlap analytically`, `Test several sample points and use statistics to estimate coverage`, `Use a lookup table for predetermined coverage patterns`, `Approximate the triangle with smaller primitives`],
    answer: 1,
    explanation: `At [20:22], the lecturer explains: "We're not going to compute the exact or analytical answer but instead we're going to test a collection of sample points right and we're just going to say for each sample point which triangle do we see."`,
    images: ["image_1771997254170_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 20,
    timestamp: `21:09`,
    question: `What is the basic definition of sampling given in the lecture?`,
    options: [`Converting analog signals to digital values`, `Selecting values of a function at specific points`, `Reducing the resolution of an image`, `Removing high-frequency components from a signal`],
    answer: 1,
    explanation: `At [21:09], the lecturer states: "Sampling all that means is I pick some values x naught x1 x2 x3 and so on and I ask what is the value of the function at those points."`,
    images: ["image_1771997323964_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 21,
    timestamp: `21:33`,
    question: `What example of a common sampled signal is given in the lecture?`,
    options: [`Digital photographs`, `Audio files`, `Vector graphics`, `3D models`],
    answer: 1,
    explanation: `At [21:33], the lecturer gives this example: "A great example of this would be an audio file so an audio file that you use to listen to music stores samples of a one-dimensional signal what is that signal it's the amplitude."`,
    images: ["image_1771997334974_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 22,
    timestamp: `21:52`,
    question: `According to the lecture, at what rate is most consumer audio sampled?`,
    options: [`22,000 times per second`, `32,000 times per second`, `44,000 times per second`, `48,000 times per second`],
    answer: 2,
    explanation: `At [21:52], the lecturer states: "In fact most consumer audio is sampled 44,000 times a second to get a realistic reproduction of sound."`,
    images: ["image_1771997342659_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 23,
    timestamp: `22:33`,
    question: `What is the reconstruction problem in signal processing?`,
    options: [`Finding the original signal from a degraded version`, `Converting a digital signal back to analog form`, `Creating a continuous function from discrete samples`, `Removing noise from a sampled signal`],
    answer: 2,
    explanation: `At [22:33], the lecturer defines the problem: "How do you turn those numbers back into a continuous signal that you can listen to and that's the problem of reconstruction... given a set of samples how can we cook up some continuous function some function where we know the value at every point in time rather than just at the sample times."`,
    images: ["image_1771997354506_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 24,
    timestamp: `23:21`,
    question: `What is the most basic reconstruction approach described in the lecture?`,
    options: [`Linear interpolation`, `Piecewise constant approximation`, `Cubic splines`, `Sine wave interpolation`],
    answer: 1,
    explanation: `At [23:21], the lecturer explains: "One really basic idea would be to use a piecewise constant approximation. I don't know what the function is equal to for every value of x so what I'm going to do is just say okay find the closest value of x where I do know the function value and just use that one."`,
    images: ["image_1771997377787_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 25,
    timestamp: `24:27`,
    question: `What issue with piecewise linear reconstruction is highlighted in the lecture?`,
    options: [`It requires too much computation`, `It can miss significant features between sample points`, `It creates artificial high frequencies`, `It uses too much memory`],
    answer: 1,
    explanation: `At [24:27], the lecturer points out: "I've completely missed some of these big bumps in the function especially near the end I have these two huge bumps between x2 and x3 that don't show up at all in my piecewise linear approximation."`,
    images: ["image_1771997414620_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 26,
    timestamp: `24:56`,
    question: `What is the most basic solution to improve reconstruction quality?`,
    options: [`Use a more sophisticated interpolation method`, `Apply a smoothing filter`, `Increase the sampling rate`, `Use frequency domain techniques`],
    answer: 2,
    explanation: `At [24:56], the lecturer explains: "The most basic thing we could do is we could just say how about we sample the signal more densely how about we just take more sample points if we missed certain features then we should just sample more frequently and we'll capture those features."

The next question skips this sldie`,
    images: ["image_1771997426297_0.png", "image_1771997568372_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 27,
    timestamp: `28:14`,
    question: `How does the lecture define the coverage function for rasterization?`,
    options: [`A function that returns the depth of each pixel`, `A binary function that indicates whether a point is inside a triangle (1) or not (0)`, `A function that determines pixel color based on triangle properties`, `A function that calculates triangle area`],
    answer: 1,
    explanation: `At [28:14], the lecturer explains: "The coverage function is a function defined at every single point in the entire plane... and it's equal to one if that point is contained inside the triangle and it's equal to zero otherwise."`,
    images: ["image_1771997491695_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 28,
    timestamp: `29:06`,
    question: `What challenge arises when an edge passes directly through a sample point?`,
    options: [`The computation becomes too slow`, `It's ambiguous which triangle covers the pixel`, `The pixel appears darker than it should`, `The algorithm fails completely`],
    answer: 1,
    explanation: `At [29:06], the lecturer asks: "I have two triangles meeting at an edge and that edge passes exactly through my sample point. So what do I do? Is this sample point covered by triangle one or is it covered by triangle two or is it in some sense covered by both of them?"`,
    images: ["image_1771997713972_0.png", "image_1771997770145_0.png", "image_1771997762595_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 29,
    timestamp: `29:53`,
    question: `What is one approach mentioned for handling edge cases when a sample point falls exactly on a triangle edge?`,
    options: [`Always count both triangles sharing the edge`, `Never count points exactly on edges`, `Classify based on whether it's a top edge or left edge`, `Move the sample point slightly`],
    answer: 2,
    explanation: `At [29:53], the lecturer explains: "If an edge falls directly on a screen sample point for instance you could say the sample is classified within the triangle if the edge is a top edge or a left edge."`,
    images: ["image_1771997805702_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 30,
    timestamp: `31:46`,
    question: `In the context of displaying sampled image values, what does a pixel represent according to the lecture?`,
    options: [`A mathematical point with no area`, `A square of light with uniform color`, `A triangular region on screen`, `A weighted average of surrounding points`],
    answer: 1,
    explanation: `At [31:46], the lecturer states: "Each image sample sent to the display is converted into roughly speaking a little square of light and maybe you get to specify the color of that light."`,
    images: ["image_1771997934002_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 31,
    timestamp: `31:57`,
    question: `According to the lecture, what does the term "pixel" stand for?`,
    options: [`Picture cell`, `Picture element`, `Pixelated image`, `Point index location`],
    answer: 1,
    explanation: `At [31:57], the lecturer explains: "The word pixel is just an abbreviation for picture element right you have a picture it's your entire screen one little element of that is a pixel."`,
    images: ["image_1771998071836_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 32,
    timestamp: `33:47`,
    question: `What is aliasing in the context of computer graphics?`,
    options: [`When one triangle is rendered on top of another`, `When a mismatch occurs between sampling and reconstruction`, `When colors look different on different displays`, `When triangles are too small to be visible`],
    answer: 1,
    explanation: `At [33:47], the lecturer introduces: "This leads us into a discussion of something that's really core to computer graphics which is the phenomenon of aliasing," and throughout the lecture explains it as a mismatch between sampling and reconstruction causing misrepresentation of the original signal.`,
    images: ["image_1771998130102_0.png", "image_1771998135778_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
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

export default function Lec4Part1Quiz() {
  const [screen, setScreen] = useState('welcome')
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [history, setHistory] = useState([])
  const timer = useTimer()
  const q = quizData[idx]
  const ACCENT = '#34d399'
  const card = { background: '#1e293b', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid #334155' }

  if (screen === 'welcome') return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'system-ui,sans-serif' }}>
      <Monitor size={48} color={ACCENT} style={{ marginBottom: '1.5rem' }} />
      <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem' }}>Lecture 4: Rasterization & Sampling — Part 1</h1>
      <p style={{ color: '#94a3b8', marginBottom: '0.25rem' }}>Pipeline, Coverage, Aliasing, SSAA, Nyquist</p>
      <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Q1–Q32 · 32 questions</p>
      <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
        <a href="/lec4/1" style={{ color: ACCENT }}>Part 1</a> · <a href="/lec4/2" style={{ color: "#64748b" }}>Part 2</a>
      </p>
      <p style={{ color: ACCENT, fontWeight: 600, fontSize: '0.85rem', marginBottom: '2rem', fontFamily: 'monospace' }}>lectures/cg-04-lecture-quiz.md</p>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}><Monitor size={20} color={ACCENT} /><h1 style={{ color: ACCENT, fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Lecture 4: Rasterization & Sampling — Part 1 — Results</h1></div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Monitor size={18} color={ACCENT} /><span style={{ color: ACCENT, fontWeight: 600, fontSize: '0.95rem' }}>Lecture 4: Rasterization & Sampling — Part 1</span></div>
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
            <span style={{ color: '#475569', fontSize: '0.72rem', fontFamily: 'monospace' }}>lectures/cg-04-lecture-quiz.md</span>
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

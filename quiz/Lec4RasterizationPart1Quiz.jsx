'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Monitor } from 'lucide-react'

// Source: lectures/cg-04-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 4: Rasterization & Sampling — Part 1 · Q1–Q32 · 32 questions
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-04-lecture-quiz.md 4

const quizData = [
  {
    id: 1,
    timestamp: `00:35`,
    question: `What is the basic principle of rasterization according to the lecture?`,
    options: [`For each pixel, determine which primitive it contains`, `For each primitive, determine which pixels it covers`, `For each triangle, compute its barycentric coordinates`, `For each image, determine the viewing frustum`],
    answer: 1,
    intuition: `Rasterization basically says for each primitive we want to draw each triangle or line segment or point which pixels of the image should get lit up.`,
    explanation: `At [00:35], the lecturer states: "Rasterization basically says for each primitive we want to draw each triangle or line segment or point which pixels of the image should get lit up."`,
    code: ``,
    images: ["image_1771995310239_0.png"],
    tags: ["rasterization", "RayTracing"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 2,
    timestamp: `00:42`,
    question: `According to the lecture, what is a key advantage of rasterization?`,
    options: [`It produces more photorealistic images`, `It works well with curved surfaces`, `It can be made extremely fast`, `It handles transparency better`],
    answer: 2,
    intuition: `This technique is extremely popular extremely valuable because it can be made extremely fast. We can get billions of triangles on the screen every second if we're using modern graphics hardware.`,
    explanation: `At [00:42], the lecturer explains: "This technique is extremely popular extremely valuable because it can be made extremely fast. We can get billions of triangles on the screen every second if we're using modern graphics hardware."`,
    code: ``,
    images: ["image_1771995625008_0.png"],
    tags: ["rasterization"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 3,
    timestamp: `01:35`,
    question: `What is the main difference between rasterization and ray tracing described in the lecture?`,
    options: [`Ray tracing is more common in video games`, `Rasterization takes longer to compute`, `Ray tracing is pixel-centric while rasterization is primitive-centric`, `Rasterization can handle curved surfaces better`],
    answer: 2,
    intuition: `for each pixel which primitives are seen through that pixel,`,
    explanation: `At [01:35], the lecturer explains that ray tracing asks "for each pixel which primitives are seen through that pixel," contrasting with rasterization which asks "for each primitive which pixels it covers."`,
    code: ``,
    images: ["image_1771995779127_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 4,
    timestamp: `01:58`,
    question: `What is a significant limitation of ray tracing according to the lecture?`,
    options: [`It cannot handle transparent surfaces`, `It is much slower than rasterization`, `It requires specialized hardware`, `It cannot produce photorealistic images`],
    answer: 1,
    intuition: `Ray tracing is a lot slower we might have to wait minutes or even hours to generate one image rather than drawing billions of triangles per second or having hundreds of frames per second on the gpu.`,
    explanation: `At [01:58], the lecturer states: "Ray tracing is a lot slower we might have to wait minutes or even hours to generate one image rather than drawing billions of triangles per second or having hundreds of frames per second on the gpu."`,
    code: ``,
    images: ["image_1771995781860_0.png"],
    tags: ["Limitation", "Constraint"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 5,
    timestamp: `02:26`,
    question: `What is a key characteristic of stages in a graphics pipeline?`,
    options: [`They operate independently from each other`, `They all run in parallel`, `They have highly structured input and output data`, `They are programmed in hardware`],
    answer: 2,
    intuition: `each one of these stages is going to request data as input in a very structured way, some really simple regular description of the input data, and likewise it's going to have some simple regular structure for the output data.`,
    explanation: `At [02:38], the lecturer explains that "each one of these stages is going to request data as input in a very structured way, some really simple regular description of the input data, and likewise it's going to have some simple regular structure for the output data."`,
    code: ``,
    images: ["image_1771995841829_0.png"],
    tags: ["Pipeline"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 6,
    timestamp: `02:57`,
    question: `Why is having highly structured data in the graphics pipeline valuable?`,
    options: [`It makes debugging easier`, `It allows for standardized protocols`, `It enables simplified and optimized computation`, `It ensures compatibility with hardware`],
    answer: 2,
    intuition: `Because this data is highly structured and highly predictable you can really go to town and simplify and optimize the computation within that stage.`,
    explanation: `At [02:57], the lecturer states: "Because this data is highly structured and highly predictable you can really go to town and simplify and optimize the computation within that stage."`,
    code: ``,
    images: ["image_1771995932491_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 7,
    timestamp: `04:24`,
    question: `What were the two main components used to represent a 3D shape in the first lecture example?`,
    options: [`Vertices and colors`, `Triangles and textures`, `Vertices and edges`, `Points and normals`],
    answer: 2,
    intuition: `We said we could represent the cube or any other kind of three-dimensional shape as two things: a collection of vertices, vertex locations in space, and a collection of edges saying which of those vertices get connected together to make line segments.`,
    explanation: `At [04:24], the lecturer recalls: "We said we could represent the cube or any other kind of three-dimensional shape as two things: a collection of vertices, vertex locations in space, and a collection of edges saying which of those vertices get connected together to make line segments."`,
    code: ``,
    images: ["image_1771995940681_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 8,
    timestamp: `06:59`,
    question: `What specialized hardware is typically used to perform rasterization?`,
    options: [`CPU (Central Processing Unit)`, `GPU (Graphics Processing Unit)`, `APU (Accelerated Processing Unit)`, `FPGA (Field-Programmable Gate Array)`],
    answer: 1,
    intuition: `Real rasterization is typically performed by what's called a graphics processing unit or a GPU. So this is a real physical piece of hardware that sits inside your computer and it has a chip on it that's different from your CPU.`,
    explanation: `At [06:59], the lecturer explains: "Real rasterization is typically performed by what's called a graphics processing unit or a GPU. So this is a real physical piece of hardware that sits inside your computer and it has a chip on it that's different from your CPU."`,
    code: ``,
    images: ["image_1771995973214_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 9,
    timestamp: `08:31`,
    question: `What is one of the key advantages of using triangles for rasterization?`,
    options: [`They require less memory than other primitives`, `They are always planar (have a well-defined plane)`, `They can represent curved surfaces perfectly`, `They are faster to process than points or lines`],
    answer: 1,
    intuition: `Another thing that's good about triangles is that they're always planar they always have a well-defined plane passing through the three vertices.`,
    explanation: `At [09:16], the lecturer states: "Another thing that's good about triangles is that they're always planar they always have a well-defined plane passing through the three vertices."`,
    code: ``,
    images: ["image_1771995996932_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 10,
    timestamp: `09:42`,
    question: `Why is the planarity of triangles particularly important for shading?`,
    options: [`It makes texturing easier`, `It allows for faster processing`, `It ensures a well-defined normal direction`, `It simplifies memory storage`],
    answer: 2,
    intuition: `It's extremely important for shading. So if I want to shade a surface I often need to know what is the normal direction what is the direction orthogonal to the surface and so for a triangle that normal is always well defined.`,
    explanation: `At [09:42], the lecturer explains: "It's extremely important for shading. So if I want to shade a surface I often need to know what is the normal direction what is the direction orthogonal to the surface and so for a triangle that normal is always well defined."`,
    code: ``,
    images: ["image_1771996003755_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 11,
    timestamp: `09:56`,
    question: `What advantage of triangles related to data at vertices is mentioned in the lecture?`,
    options: [`They allow for automatic level-of-detail`, `They enable easy interpolation of data across the triangle`, `They provide better compression of vertex data`, `They support complex texturing operations`],
    answer: 1,
    intuition: `It'll also turn out to be very easy to interpolate data at corners so if I have three color values at the corners of a triangle and I want to smoothly blend those color values across the rest of the triangle, it's going to be really really simple and efficient.`,
    explanation: `At [09:56], the lecturer states: "It'll also turn out to be very easy to interpolate data at corners so if I have three color values at the corners of a triangle and I want to smoothly blend those color values across the rest of the triangle, it's going to be really really simple and efficient."`,
    code: ``,
    images: ["image_1771996850703_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 12,
    timestamp: `11:28`,
    question: `What is the first stage in the rasterization pipeline described in the lecture?`,
    options: [`Projection onto the 2D screen`, `Sampling triangle coverage`, `Transformation and positioning in the world`, `Interpolating attributes at vertices`],
    answer: 2,
    intuition: `The first thing we're going to do once we have our list of triangles is we're going to transform and position these things in the world in the scene where we want them to be.`,
    explanation: `At [11:28], the lecturer states: "The first thing we're going to do once we have our list of triangles is we're going to transform and position these things in the world in the scene where we want them to be."`,
    code: ``,
    images: ["image_1771996856893_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 13,
    timestamp: `13:44`,
    question: `What is the basic question of rasterization according to the lecture?`,
    options: [`For each pixel, which triangle is closest to the camera?`, `For each triangle, which pixels are covered by it?`, `For each vertex, which pixels should be affected?`, `For each image, how many triangles are visible?`],
    answer: 1,
    intuition: `For a given triangle for this red triangle here what pixels does the triangle overlap that's the basic question of rasterization the question of coverage.`,
    explanation: `At [13:44], the lecturer directly states: "For a given triangle for this red triangle here what pixels does the triangle overlap that's the basic question of rasterization the question of coverage."`,
    code: ``,
    images: ["image_1771996867247_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 14,
    timestamp: `14:01`,
    question: `What is meant by the "occlusion question" in the lecture?`,
    options: [`Which triangles are too small to be visible?`, `Which triangles are outside the viewing frustum?`, `Which triangles should be culled?`, `When multiple triangles cover a pixel, which one is visible?`],
    answer: 3,
    intuition: `We know that the red triangle covers this pixel we might know that another triangle the blue triangle covers this pixel which one is closer to the camera which color value do we finally see and that's the question of occlusion.`,
    explanation: `At [14:01], the lecturer explains: "We know that the red triangle covers this pixel we might know that another triangle the blue triangle covers this pixel which one is closer to the camera which color value do we finally see and that's the question of occlusion."`,
    code: ``,
    images: ["image_1771997084252_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 15,
    timestamp: `14:15`,
    question: `What is another name for the occlusion problem mentioned in the lecture?`,
    options: [`The culling problem`, `The hidden surface problem`, `The visibility problem`, `The z-buffer problem`],
    answer: 2,
    intuition: `This second question this question is called the visibility problem.`,
    explanation: `At [14:15], the lecturer states: "This second question this question is called the visibility problem."`,
    code: ``,
    images: ["image_1771997069120_0.png"],
    tags: ["Visibility"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 16,
    timestamp: `16:32`,
    question: `When defining what it means for a pixel to be covered by a triangle, which case is straightforward according to the lecture?`,
    options: [`When the triangle partially covers the pixel`, `When the triangle's edge passes through the pixel`, `When the triangle completely covers the pixel`, `When the triangle's vertex is inside the pixel`],
    answer: 2,
    intuition: `Triangle four is also pretty easy, four covers the entire pixel so it's really easy to say yeah for sure the pixel is covered by triangle four.`,
    explanation: `At [17:03], the lecturer explains: "Triangle four is also pretty easy, four covers the entire pixel so it's really easy to say yeah for sure the pixel is covered by triangle four."`,
    code: ``,
    images: ["image_1771997185693_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 17,
    timestamp: `17:50`,
    question: `What approach does the lecturer suggest for handling partial pixel coverage?`,
    options: [`Always treat partially covered pixels as fully covered`, `Record the fraction of the pixel area covered by the triangle`, `Never count partially covered pixels`, `Randomly decide whether to count partial coverage`],
    answer: 1,
    intuition: `Instead of just recording a binary value yes or no maybe one option is to say really what we want to know is the fraction of the pixel area covered by the triangle.`,
    explanation: `At [17:50], the lecturer states: "Instead of just recording a binary value yes or no maybe one option is to say really what we want to know is the fraction of the pixel area covered by the triangle."`,
    code: ``,
    images: ["image_1771997211546_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 18,
    timestamp: `18:52`,
    question: `Why is it difficult to compute the exact coverage fraction when multiple triangles are involved?`,
    options: [`Triangles might have different colors`, `The math is too complex to compute in real-time`, `Complex regions of overlap can form non-convex shapes`, `Triangles might have different depths`],
    answer: 2,
    intuition: `We might have non-convex regions where they overlap and so forth.`,
    explanation: `At [18:57], the lecturer explains the challenge: "We might have non-convex regions where they overlap and so forth."`,
    code: ``,
    images: ["image_1771997219796_0.png"],
    tags: ["Convex", "Complexity"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 19,
    timestamp: `20:22`,
    question: `What is the sampling approach to determining coverage?`,
    options: [`Calculate the area of triangle-pixel overlap analytically`, `Test several sample points and use statistics to estimate coverage`, `Use a lookup table for predetermined coverage patterns`, `Approximate the triangle with smaller primitives`],
    answer: 1,
    intuition: `We're not going to compute the exact or analytical answer but instead we're going to test a collection of sample points right and we're just going to say for each sample point which triangle do we see.`,
    explanation: `At [20:22], the lecturer explains: "We're not going to compute the exact or analytical answer but instead we're going to test a collection of sample points right and we're just going to say for each sample point which triangle do we see."`,
    code: ``,
    images: ["image_1771997254170_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 20,
    timestamp: `21:09`,
    question: `What is the basic definition of sampling given in the lecture?`,
    options: [`Converting analog signals to digital values`, `Selecting values of a function at specific points`, `Reducing the resolution of an image`, `Removing high-frequency components from a signal`],
    answer: 1,
    intuition: `Sampling all that means is I pick some values x naught x1 x2 x3 and so on and I ask what is the value of the function at those points.`,
    explanation: `At [21:09], the lecturer states: "Sampling all that means is I pick some values x naught x1 x2 x3 and so on and I ask what is the value of the function at those points."`,
    code: ``,
    images: ["image_1771997323964_0.png"],
    tags: ["Sampling"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 21,
    timestamp: `21:33`,
    question: `What example of a common sampled signal is given in the lecture?`,
    options: [`Digital photographs`, `Audio files`, `Vector graphics`, `3D models`],
    answer: 1,
    intuition: `A great example of this would be an audio file so an audio file that you use to listen to music stores samples of a one-dimensional signal what is that signal it's the amplitude.`,
    explanation: `At [21:33], the lecturer gives this example: "A great example of this would be an audio file so an audio file that you use to listen to music stores samples of a one-dimensional signal what is that signal it's the amplitude."`,
    code: ``,
    images: ["image_1771997334974_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 22,
    timestamp: `21:52`,
    question: `According to the lecture, at what rate is most consumer audio sampled?`,
    options: [`22,000 times per second`, `32,000 times per second`, `44,000 times per second`, `48,000 times per second`],
    answer: 2,
    intuition: `In fact most consumer audio is sampled 44,000 times a second to get a realistic reproduction of sound.`,
    explanation: `At [21:52], the lecturer states: "In fact most consumer audio is sampled 44,000 times a second to get a realistic reproduction of sound."`,
    code: ``,
    images: ["image_1771997342659_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 23,
    timestamp: `22:33`,
    question: `What is the reconstruction problem in signal processing?`,
    options: [`Finding the original signal from a degraded version`, `Converting a digital signal back to analog form`, `Creating a continuous function from discrete samples`, `Removing noise from a sampled signal`],
    answer: 2,
    intuition: `How do you turn those numbers back into a continuous signal that you can listen to and that's the problem of reconstruction... given a set of samples how can we cook up some continuous function some function where we know the value at every point in time rather than just at the sample times.`,
    explanation: `At [22:33], the lecturer defines the problem: "How do you turn those numbers back into a continuous signal that you can listen to and that's the problem of reconstruction... given a set of samples how can we cook up some continuous function some function where we know the value at every point in time rather than just at the sample times."`,
    code: ``,
    images: ["image_1771997354506_0.png"],
    tags: ["Reconstruction"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 24,
    timestamp: `23:21`,
    question: `What is the most basic reconstruction approach described in the lecture?`,
    options: [`Linear interpolation`, `Piecewise constant approximation`, `Cubic splines`, `Sine wave interpolation`],
    answer: 1,
    intuition: `One really basic idea would be to use a piecewise constant approximation. I don't know what the function is equal to for every value of x so what I'm going to do is just say okay find the closest value of x where I do know the function value and just use that one.`,
    explanation: `At [23:21], the lecturer explains: "One really basic idea would be to use a piecewise constant approximation. I don't know what the function is equal to for every value of x so what I'm going to do is just say okay find the closest value of x where I do know the function value and just use that one."`,
    code: ``,
    images: ["image_1771997377787_0.png"],
    tags: ["Reconstruction"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 25,
    timestamp: `24:27`,
    question: `What issue with piecewise linear reconstruction is highlighted in the lecture?`,
    options: [`It requires too much computation`, `It can miss significant features between sample points`, `It creates artificial high frequencies`, `It uses too much memory`],
    answer: 1,
    intuition: `I've completely missed some of these big bumps in the function especially near the end I have these two huge bumps between x2 and x3 that don't show up at all in my piecewise linear approximation.`,
    explanation: `At [24:27], the lecturer points out: "I've completely missed some of these big bumps in the function especially near the end I have these two huge bumps between x2 and x3 that don't show up at all in my piecewise linear approximation."`,
    code: ``,
    images: ["image_1771997414620_0.png"],
    tags: ["Approximation", "Linear"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 26,
    timestamp: `24:56`,
    question: `What is the most basic solution to improve reconstruction quality?`,
    options: [`Use a more sophisticated interpolation method`, `Apply a smoothing filter`, `Increase the sampling rate`, `Use frequency domain techniques`],
    answer: 2,
    intuition: `The most basic thing we could do is we could just say how about we sample the signal more densely how about we just take more sample points if we missed certain features then we should just sample more frequently and we'll capture those features.`,
    explanation: `At [24:56], the lecturer explains: "The most basic thing we could do is we could just say how about we sample the signal more densely how about we just take more sample points if we missed certain features then we should just sample more frequently and we'll capture those features."

The next question skips this sldie`,
    code: ``,
    images: ["image_1771997426297_0.png", "image_1771997568372_0.png"],
    tags: ["Reconstruction"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 27,
    timestamp: `28:14`,
    question: `How does the lecture define the coverage function for rasterization?`,
    options: [`A function that returns the depth of each pixel`, `A binary function that indicates whether a point is inside a triangle (1) or not (0)`, `A function that determines pixel color based on triangle properties`, `A function that calculates triangle area`],
    answer: 1,
    intuition: `The coverage function is a function defined at every single point in the entire plane... and it's equal to one if that point is contained inside the triangle and it's equal to zero otherwise.`,
    explanation: `At [28:14], the lecturer explains: "The coverage function is a function defined at every single point in the entire plane... and it's equal to one if that point is contained inside the triangle and it's equal to zero otherwise."`,
    code: ``,
    images: ["image_1771997491695_0.png"],
    tags: ["coverage", "rasterization", "Function"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 28,
    timestamp: `29:06`,
    question: `What challenge arises when an edge passes directly through a sample point?`,
    options: [`The computation becomes too slow`, `It's ambiguous which triangle covers the pixel`, `The pixel appears darker than it should`, `The algorithm fails completely`],
    answer: 1,
    intuition: `I have two triangles meeting at an edge and that edge passes exactly through my sample point. So what do I do? Is this sample point covered by triangle one or is it covered by triangle two or is it in some sense covered by both of them?`,
    explanation: `At [29:06], the lecturer asks: "I have two triangles meeting at an edge and that edge passes exactly through my sample point. So what do I do? Is this sample point covered by triangle one or is it covered by triangle two or is it in some sense covered by both of them?"`,
    code: ``,
    images: ["image_1771997713972_0.png", "image_1771997770145_0.png", "image_1771997762595_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 29,
    timestamp: `29:53`,
    question: `What is one approach mentioned for handling edge cases when a sample point falls exactly on a triangle edge?`,
    options: [`Always count both triangles sharing the edge`, `Never count points exactly on edges`, `Classify based on whether it's a top edge or left edge`, `Move the sample point slightly`],
    answer: 2,
    intuition: `If an edge falls directly on a screen sample point for instance you could say the sample is classified within the triangle if the edge is a top edge or a left edge.`,
    explanation: `At [29:53], the lecturer explains: "If an edge falls directly on a screen sample point for instance you could say the sample is classified within the triangle if the edge is a top edge or a left edge."`,
    code: ``,
    images: ["image_1771997805702_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 30,
    timestamp: `31:46`,
    question: `In the context of displaying sampled image values, what does a pixel represent according to the lecture?`,
    options: [`A mathematical point with no area`, `A square of light with uniform color`, `A triangular region on screen`, `A weighted average of surrounding points`],
    answer: 1,
    intuition: `Each image sample sent to the display is converted into roughly speaking a little square of light and maybe you get to specify the color of that light.`,
    explanation: `At [31:46], the lecturer states: "Each image sample sent to the display is converted into roughly speaking a little square of light and maybe you get to specify the color of that light."`,
    code: ``,
    images: ["image_1771997934002_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 31,
    timestamp: `31:57`,
    question: `According to the lecture, what does the term "pixel" stand for?`,
    options: [`Picture cell`, `Picture element`, `Pixelated image`, `Point index location`],
    answer: 1,
    intuition: `The word pixel is just an abbreviation for picture element right you have a picture it's your entire screen one little element of that is a pixel.`,
    explanation: `At [31:57], the lecturer explains: "The word pixel is just an abbreviation for picture element right you have a picture it's your entire screen one little element of that is a pixel."`,
    code: ``,
    images: ["image_1771998071836_0.png"],
    tags: ["pixel"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 32,
    timestamp: `33:47`,
    question: `What is aliasing in the context of computer graphics?`,
    options: [`When one triangle is rendered on top of another`, `When a mismatch occurs between sampling and reconstruction`, `When colors look different on different displays`, `When triangles are too small to be visible`],
    answer: 1,
    intuition: `This leads us into a discussion of something that's really core to computer graphics which is the phenomenon of aliasing,`,
    explanation: `At [33:47], the lecturer introduces: "This leads us into a discussion of something that's really core to computer graphics which is the phenomenon of aliasing," and throughout the lecture explains it as a mismatch between sampling and reconstruction causing misrepresentation of the original signal.`,
    code: ``,
    images: ["image_1771998130102_0.png", "image_1771998135778_0.png"],
    tags: ["Aliasing", "definition"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
]

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
        <img key={i} src={`/assets/${img}`} alt={`slide-${i+1}`}
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
  const [reviewMode, setReviewMode] = useState(false)
  const [expTab, setExpTab] = useState('explanation')
  const [codeCopied, setCodeCopied] = useState(false)
  const { t, start, pause, reset: resetTimer } = useTimer()
  const q = quizData[qIdx]

  const C = {
    bg: '#0a0a0f',
    surface: '#111118',
    border: '#2a2a3a',
    accent: '#34d399',
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
          <Monitor size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 4: Rasterization & Sampling — Part 1</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Pipeline, Coverage, Aliasing, SSAA, Nyquist</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-04-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href="/lec4/1" style={{ color: C.accent, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href="/lec4/2" style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
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
          <Monitor size={20} /> Start Quiz
        </button>
        <a href='/' style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', color: C.muted, fontSize: '0.875rem' }}>← All quizzes</a>
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
        <a href='/' style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', color: C.muted, fontSize: '0.875rem' }}>← All quizzes</a>
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
                    <p style={{ margin: '0 0 0.25rem', fontSize: '0.72rem', fontWeight: 700, color: C.accent, letterSpacing: '0.06em' }}>KEY INSIGHT FROM LECTURE</p>
                    <p style={{ margin: 0, lineHeight: 1.75, color: C.text, fontSize: '1rem', fontStyle: 'italic' }}>"{q.intuition}"</p>
                  </div>
                )
                : <p style={{ color: '#475569', margin: 0 }}>No intuition extracted.</p>
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
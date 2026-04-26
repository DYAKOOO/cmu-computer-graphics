'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Monitor } from 'lucide-react'

// Source: lectures/cg-04-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 4: Rasterization & Sampling — Part 2 · Q33–Q64 · 32 questions
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-04-lecture-quiz.md 4

const quizData = [
  {
    id: 33,
    timestamp: `35:34`,
    question: `How does the lecture suggest we can understand signals like audio?`,
    options: [`As a sequence of amplitudes over time`, `As a superposition or sum of different frequencies`, `As a set of discrete events`, `As a series of waveforms`],
    answer: 1,
    intuition: `A 1D signal like audio can be expressed as a superposition or a sum of different frequencies.`,
    explanation: `At [35:34], the lecturer states: "A 1D signal like audio can be expressed as a superposition or a sum of different frequencies."`,
    code: ``,
    images: ["image_1771998186382_0.png"],
    tags: ["Reconstruction"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 34,
    timestamp: `38:30`,
    question: `In the pitch-rising experiment, what unexpected phenomenon was observed?`,
    options: [`The audio became distorted`, `The frequency remained constant`, `The pitch appeared to rise and fall repeatedly`, `The sound became inaudible`],
    answer: 2,
    intuition: `Rather than just going from low to high and higher and higher and higher it went from low to high back down to low back up to high back down to low what is going on there?`,
    explanation: `At [38:30], the lecturer describes: "Rather than just going from low to high and higher and higher and higher it went from low to high back down to low back up to high back down to low what is going on there?"`,
    code: ``,
    images: ["image_1771998301424_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 35,
    timestamp: `38:50`,
    question: `What explains the unexpected result in the pitch experiment?`,
    options: [`A bug in the audio playback system`, `Interference between multiple sound waves`, `Undersampling of the high-frequency signal`, `Incorrect frequency generation`],
    answer: 2,
    intuition: `If we under sample if we have too few points to capture all of the little wiggles in that sound wave then we're going to get aliasing we're going to get a sound that doesn't actually represent the original continuous signal.`,
    explanation: `At [38:50], the lecturer explains: "If we under sample if we have too few points to capture all of the little wiggles in that sound wave then we're going to get aliasing we're going to get a sound that doesn't actually represent the original continuous signal."`,
    code: ``,
    images: ["image_1771998474964_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 36,
    timestamp: `40:22`,
    question: `How does the lecturer define aliasing in the audio example?`,
    options: [`When audio frequencies exceed human hearing range`, `When high frequencies masquerade as low frequencies after reconstruction`, `When digital audio cannot reproduce analog sounds`, `When sound becomes too distorted to recognize`],
    answer: 1,
    intuition: `In this case this is what we mean by aliasing high frequencies in the original signal quickly oscillating waves masquerade as low frequencies after we perform the reconstruction because we've under sampled.`,
    explanation: `At [40:22], the lecturer states: "In this case this is what we mean by aliasing high frequencies in the original signal quickly oscillating waves masquerade as low frequencies after we perform the reconstruction because we've under sampled.""`,
    code: ``,
    images: ["image_1771998452042_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 37,
    timestamp: `41:44`,
    question: `In the image frequency domain representation shown in the lecture, where are the low frequencies located?`,
    options: [`At the edges of the representation`, `At the dead center`, `Uniformly distributed throughout`, `At the corners only`],
    answer: 1,
    intuition: `This image that we see on the right is kind of like the analyzer the spectral analyzer for the image that we see on the left except this time all the low frequencies are dead center and as we go out in any direction... we're looking at higher and higher frequencies.`,
    explanation: `At [41:44], the lecturer explains: "This image that we see on the right is kind of like the analyzer the spectral analyzer for the image that we see on the left except this time all the low frequencies are dead center and as we go out in any direction... we're looking at higher and higher frequencies."`,
    code: ``,
    images: ["image_1771998501567_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 38,
    timestamp: `44:10`,
    question: `What function was used to create the synthetic aliasing example in the lecture?`,
    options: [`sin(x) + sin(y)`, `sin(x² + y²)`, `sin(x) * sin(y)`, `cos(x² - y²)`],
    answer: 1,
    intuition: `We're going to build a function intentionally that has crazy high frequencies in it and that function is sine of x squared plus y squared.`,
    explanation: `At [44:10], the lecturer describes: "We're going to build a function intentionally that has crazy high frequencies in it and that function is sine of x squared plus y squared."`,
    code: ``,
    images: ["image_1771998552981_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 39,
    timestamp: `45:32`,
    question: `What real-world example of temporal aliasing is described in the lecture?`,
    options: [`Motion blur in photographs`, `Spinning wagon wheels appearing to rotate backwards`, `Lens flare effects`, `Image pixelation when zooming`],
    answer: 1,
    intuition: `If it's ever been nighttime you're looking out the car window at a car next to you and you stare at the hubcaps you'll see an effect like this. Maybe as the car leaves through the stop light the wheels start spinning faster and faster and rather than looking like they're spinning forward they start spinning backward.`,
    explanation: `At [45:32], the lecturer explains: "If it's ever been nighttime you're looking out the car window at a car next to you and you stare at the hubcaps you'll see an effect like this. Maybe as the car leaves through the stop light the wheels start spinning faster and faster and rather than looking like they're spinning forward they start spinning backward."`,
    code: ``,
    images: ["image_1771998614239_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 40,
    timestamp: `46:41`,
    question: `What theorem establishes when a signal can be perfectly reconstructed from samples?`,
    options: [`The Fourier Transform Theorem`, `The Sampling Law`, `The Nyquist-Shannon Theorem`, `The Signal Processing Theorem`],
    answer: 2,
    intuition: `So how can we be precise about when this phenomenon occurs this is something called the nyquist shannon theorem okay really important theorem in signal processing.`,
    explanation: `At [46:41], the lecturer states: "So how can we be precise about when this phenomenon occurs this is something called the nyquist shannon theorem okay really important theorem in signal processing."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 41,
    timestamp: `47:36`,
    question: `According to the Nyquist-Shannon theorem, what condition allows perfect signal reconstruction?`,
    options: [`The signal must be continuous`, `The signal must be sampled at least twice as frequently as its highest frequency`, `The signal must have limited amplitude`, `The signal must be perfectly periodic`],
    answer: 1,
    intuition: `If your signal happens to be band limited then it can be perfectly reconstructed as long as you take samples at a rate that's twice as frequent as the highest frequency in the signal.`,
    explanation: `At [47:36], the lecturer explains: "If your signal happens to be band limited then it can be perfectly reconstructed as long as you take samples at a rate that's twice as frequent as the highest frequency in the signal."`,
    code: ``,
    images: ["image_1771998665800_0.png"],
    tags: ["Nyquist"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 42,
    timestamp: `47:56`,
    question: `What filter is used for perfect reconstruction according to the Nyquist-Shannon theorem?`,
    options: [`Gaussian filter`, `Box filter`, `Sync filter`, `Triangle filter`],
    answer: 2,
    intuition: `Once you have those samples you can reconstruct exactly the original signal by using something called a sync filter.`,
    explanation: `At [47:56], the lecturer states: "Once you have those samples you can reconstruct exactly the original signal by using something called a sync filter."`,
    code: ``,
    images: ["image_1771998802412_0.png"],
    tags: ["Filter"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 43,
    timestamp: `48:38`,
    question: `Why can't most graphics signals be perfectly reconstructed using the Nyquist-Shannon approach?`,
    options: [`The sampling rate is too low`, `The signals aren't band-limited due to features like hard edges`, `The reconstruction filters are too complex`, `There's too much noise in the signals`],
    answer: 1,
    intuition: `Here's our triangle our coverage function how do I express something like a hard edge as a sum of sinusoids? Well actually it turns out that what I have to do is add an infinite series of higher and higher and higher frequencies until I can eventually approximate something like a piecewise constant function.`,
    explanation: `At [48:57], the lecturer explains: "Here's our triangle our coverage function how do I express something like a hard edge as a sum of sinusoids? Well actually it turns out that what I have to do is add an infinite series of higher and higher and higher frequencies until I can eventually approximate something like a piecewise constant function."`,
    code: ``,
    images: ["image_1771998941026_0.png"],
    tags: ["Limitation"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 44,
    timestamp: `50:39`,
    question: `What common aliasing artifact appears in static images with straight lines?`,
    options: [`Moire patterns`, `Jaggies (jagged edges)`, `Banding`, `Pixel bleeding`],
    answer: 1,
    intuition: `Really really common artifacts in graphics or you have let's say jaggies in a in a static image if I draw a line segment it has these jagged edges.`,
    explanation: `At [50:39], the lecturer describes: "Really really common artifacts in graphics or you have let's say jaggies in a in a static image if I draw a line segment it has these jagged edges."`,
    code: ``,
    images: ["image_1771998975218_0.png"],
    tags: ["Aliasing"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 45,
    timestamp: `51:39`,
    question: `What is the ideal goal when trying to reduce aliasing in pixel coverage?`,
    options: [`To remove all high frequencies from the scene`, `To match the total light in a pixel with the total light in the original signal`, `To use the minimum number of samples possible`, `To randomize the sampling pattern`],
    answer: 1,
    intuition: `If we think of a pixel as a little square of light then what we want is that the total light emitted from that pixel to be the same as the total light that we had in our original continuous signal in other words we want to integrate the input signal over the pixel to get the sample value.`,
    explanation: `At [51:39], the lecturer explains: "If we think of a pixel as a little square of light then what we want is that the total light emitted from that pixel to be the same as the total light that we had in our original continuous signal in other words we want to integrate the input signal over the pixel to get the sample value."`,
    code: ``,
    images: ["image_1771999074308_0.png"],
    tags: ["Light"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 46,
    timestamp: `53:02`,
    question: `What anti-aliasing technique is described in the lecture?`,
    options: [`Adaptive sampling`, `Super sampling`, `Anisotropic filtering`, `Gaussian blur`],
    answer: 1,
    intuition: `So what we're really going to do is use a technique called super sampling rather than just taking one sample of the signal the coverage signal at each pixel we're going to take several samples.`,
    explanation: `At [53:02], the lecturer explains: "So what we're really going to do is use a technique called super sampling rather than just taking one sample of the signal the coverage signal at each pixel we're going to take several samples."`,
    code: ``,
    images: ["image_1771999129670_0.png"],
    tags: ["AntiAliasing", "Supersampling"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 47,
    timestamp: `53:54`,
    question: `How are the multiple samples used in super sampling anti-aliasing?`,
    options: [`The brightest sample is selected`, `The samples are averaged to determine the pixel's coverage`, `The median value is used`, `The samples are combined using a weighted formula`],
    answer: 1,
    intuition: `If some fraction of the samples are covered let's say half of them are covered well then we say okay 50% of that pixel is covered right so we just use the fraction of sample values that are covered to get an approximation of the fraction of the pixel that's covered.`,
    explanation: `At [53:54], the lecturer explains: "If some fraction of the samples are covered let's say half of them are covered well then we say okay 50% of that pixel is covered right so we just use the fraction of sample values that are covered to get an approximation of the fraction of the pixel that's covered."`,
    code: ``,
    images: ["image_1771999227390_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 48,
    timestamp: `55:16`,
    question: `What improvement was observed when increasing from 4 samples per pixel to 16 samples per pixel?`,
    options: [`The image became perfectly aliasing-free`, `There was no visible difference`, `The image became smoother but still had some artifacts`, `The image became darker`],
    answer: 2,
    intuition: `So now in each pixel we have 4x4 or 16 samples things get a little bit smoother okay still not perfect.`,
    explanation: `At [55:16], the lecturer observes: "So now in each pixel we have 4x4 or 16 samples things get a little bit smoother okay still not perfect."`,
    code: ``,
    images: ["image_1771999256302_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 49,
    timestamp: `55:42`,
    question: `Even with 1024 samples per pixel, what was observed about the anti-aliasing result?`,
    options: [`It became perfect with no visible artifacts`, `It still wasn't perfect`, `It became too blurry`, `It introduced new artifacts`],
    answer: 1,
    intuition: `So now we do 32 by 32 we have 1024 samples taken for every single pixel and we average them back down so even though this looks a lot better you notice it's still not perfect.`,
    explanation: `At [55:30], the lecturer states: "So now we do 32 by 32 we have 1024 samples taken for every single pixel and we average them back down so even though this looks a lot better you notice it's still not perfect."

-`,
    code: ``,
    images: ["image_1775353040809_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 50,
    timestamp: `55:54`,
    question: `What special case for perfect anti-aliasing is mentioned in the lecture?`,
    options: [`Straight line segments`, `Checkerboard patterns`, `Circular shapes`, `Uniform color regions`],
    answer: 1,
    intuition: `In this very very special case of the checkerboard there happens to be an exact solution you can analytically integrate the checkerboard over a pixel and get this beautifully smooth image.`,
    explanation: `At [55:54], the lecturer notes: "In this very very special case of the checkerboard there happens to be an exact solution you can analytically integrate the checkerboard over a pixel and get this beautifully smooth image."`,
    code: ``,
    images: ["image_1771999301034_0.png"],
    tags: ["Analysis", "Integration"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 51,
    timestamp: `57:10`,
    question: `What is the most basic operation needed for triangle rasterization?`,
    options: [`Computing triangle area`, `Testing if a point is inside a triangle`, `Finding the closest point on a triangle`, `Calculating triangle perimeter`],
    answer: 1,
    intuition: `The most basic thing that we need to do is say okay we have this triangle we have this pixel grid we want to know which pixels are covered by the triangle we can just break this down into an atomic query which is how do we check if a given point q is inside a triangle with vertices p0 p1 p2.`,
    explanation: `At [57:10], the lecturer explains: "The most basic thing that we need to do is say okay we have this triangle we have this pixel grid we want to know which pixels are covered by the triangle we can just break this down into an atomic query which is how do we check if a given point q is inside a triangle with vertices p0 p1 p2."`,
    code: ``,
    images: ["image_1771999356654_0.png"],
    tags: ["Algorithm"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 52,
    timestamp: `58:12`,
    question: `How is the point-in-triangle test typically implemented?`,
    options: [`Using barycentric coordinates`, `Computing distance to each edge`, `Testing if the point is inside the three half-planes defined by the edges`, `Calculating angle sums`],
    answer: 2,
    intuition: `How do you test if a point's inside of a triangle? Well I know that if it's contained in the half plane made by the bottom edge and the right edge and the left edge then it must be inside the triangle.`,
    explanation: `At [58:12], the lecturer explains: "How do you test if a point's inside of a triangle? Well I know that if it's contained in the half plane made by the bottom edge and the right edge and the left edge then it must be inside the triangle."`,
    code: ``,
    images: ["image_1771999387129_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 53,
    timestamp: `59:36`,
    question: `What optimization is mentioned for incremental point-in-triangle testing?`,
    options: [`Using graphics hardware acceleration`, `Reusing calculations between adjacent pixels`, `Pre-computing lookup tables`, `Approximating triangles with rectangles`],
    answer: 1,
    intuition: `I can make this a little bit faster by noticing that the half plane check looks very similar for nearby points so I can save myself some arithmetic by not going through these points in a random order but by marching let's say along rows of the triangle and incrementally updating my calculations.`,
    explanation: `At [59:36], the lecturer describes: "I can make this a little bit faster by noticing that the half plane check looks very similar for nearby points so I can save myself some arithmetic by not going through these points in a random order but by marching let's say along rows of the triangle and incrementally updating my calculations."`,
    code: ``,
    images: ["image_1771999404785_0.png"],
    tags: ["optimization"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 54,
    timestamp: `1:00:04`,
    question: `What does the lecturer identify as the primary bottleneck in modern hardware?`,
    options: [`Arithmetic computations`, `Memory access`, `Cache size`, `Power consumption`],
    answer: 1,
    intuition: `In real modern hardware the bottleneck is typically not doing arithmetic doing math but the bottleneck is reading or writing to memory.`,
    explanation: `At [1:00:04], the lecturer states: "In real modern hardware the bottleneck is typically not doing arithmetic doing math but the bottleneck is reading or writing to memory."`,
    code: ``,
    images: ["image_1771999436931_0.png"],
    tags: ["BottleNeck"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 55,
    timestamp: `1:00:46`,
    question: `What approach does modern hardware take to triangle rasterization?`,
    options: [`Sequential processing of each pixel`, `Testing all samples in the triangle's bounding box in parallel`, `Using a lookup table for common triangle shapes`, `Processing one scan line at a time`],
    answer: 1,
    intuition: `What we're going to do instead is just test all the samples in the bounding box around the triangles so it's kind of the tightest fitting box around the triangle we're going to test all those samples in parallel.`,
    explanation: `At [1:00:46], the lecturer explains: "What we're going to do instead is just test all the samples in the bounding box around the triangles so it's kind of the tightest fitting box around the triangle we're going to test all those samples in parallel."`,
    code: ``,
    images: ["image_1771999512661_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 56,
    timestamp: `1:02:09`,
    question: `What shape of triangle was identified as problematic for the parallel bounding box approach?`,
    options: [`Very small triangles`, `Triangles with obtuse angles`, `Long, skinny triangles`, `Triangles with curved edges`],
    answer: 2,
    intuition: `You can imagine for instance that I had just one long skinny triangle that stretched all the way across the screen right and so now if I'm testing all the points in the bounding box almost none of them are going to be covered I'm wasting a lot of time.`,
    explanation: `At [1:02:09], the lecturer describes: "You can imagine for instance that I had just one long skinny triangle that stretched all the way across the screen right and so now if I'm testing all the points in the bounding box almost none of them are going to be covered I'm wasting a lot of time."`,
    code: ``,
    images: ["image_1771999527981_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 57,
    timestamp: `1:02:40`,
    question: `What optimization technique tests larger blocks before individual pixels?`,
    options: [`Hierarchical decomposition`, `Scan conversion`, `Block-based optimization`, `Stochastic sampling`],
    answer: 2,
    intuition: `I can take kind of a hybrid or course define approach and first ask if large blocks of pixels intersect the triangle so before testing any individual pixel I draw some kind of medium size square.`,
    explanation: `At [1:02:33], the lecturer introduces: "I can take kind of a hybrid or course define approach and first ask if large blocks of pixels intersect the triangle so before testing any individual pixel I draw some kind of medium size square."`,
    code: ``,
    images: ["image_1771999609505_0.png"],
    tags: ["CG-Lecture-Question", "optimization"],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 58,
    timestamp: `1:03:00`,
    question: `What is the benefit of the early-out test with blocks?`,
    options: [`It improves cache coherence`, `It allows hardware acceleration`, `It avoids unnecessary work on pixels not covered by the triangle`, `It simplifies the triangle intersection test`],
    answer: 2,
    intuition: `If I know that this gray box in the upper left doesn't intersect the triangle at all then I don't need to do any more work none of those none of those pixels are covered.`,
    explanation: `At [1:03:00], the lecturer explains: "If I know that this gray box in the upper left doesn't intersect the triangle at all then I don't need to do any more work none of those none of those pixels are covered."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 59,
    timestamp: `1:04:49`,
    question: `What important graphics concept is introduced with the recursive block testing approach?`,
    options: [`Dynamic programming`, `Hierarchical strategy`, `Backtracking`, `Divide and conquer`],
    answer: 1,
    intuition: `This leads to another really really important idea in all of computer graphics which is to take a hierarchical strategy.`,
    explanation: `At [1:04:49], the lecturer states: "This leads to another really really important idea in all of computer graphics which is to take a hierarchical strategy."`,
    code: ``,
    images: ["image_1771999662712_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 60,
    timestamp: `1:06:16`,
    question: `Why isn't hierarchical rasterization commonly used in real graphics hardware?`,
    options: [`It produces visual artifacts`, `It requires too much memory`, `The overhead of traversal is too high`, `It's patented and requires licensing`],
    answer: 2,
    intuition: `This is actually not what happens in real graphics hardware because there's still quite a bit of overhead to doing this hierarchical traversal so having just one course to find level is kind of a nice sweet spot.`,
    explanation: `At [1:06:16], the lecturer explains: "This is actually not what happens in real graphics hardware because there's still quite a bit of overhead to doing this hierarchical traversal so having just one course to find level is kind of a nice sweet spot."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 61,
    timestamp: `1:07:20`,
    question: `What is one of the key frameworks mentioned in the summary for understanding graphics problems?`,
    options: [`Object-oriented programming`, `Sampling and reconstruction`, `Linear algebra`, `Calculus of variations`],
    answer: 1,
    intuition: `Overall today what we saw is that we can frame a lot of problems in computer graphics in terms of sampling and reconstruction.`,
    explanation: `At [1:07:20], the lecturer summarizes: "Overall today what we saw is that we can frame a lot of problems in computer graphics in terms of sampling and reconstruction."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 62,
    timestamp: `1:08:27`,
    question: `What does the lecturer describe as the basic strategy for reducing aliasing in rasterization?`,
    options: [`Blurring the image`, `Using super sampling`, `Decreasing the resolution`, `Using different primitive shapes`],
    answer: 1,
    intuition: `Our basic strategy for reducing aliasing at least for rasterization was to use super sampling.`,
    explanation: `At [1:08:27], the lecturer concludes: "Our basic strategy for reducing aliasing at least for rasterization was to use super sampling."`,
    code: ``,
    images: ["image_1775353150954_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 63,
    timestamp: `1:08:57`,
    question: `According to the summary, what is the "basic building block" for the graphics pipeline?`,
    options: [`Pixel shading`, `Vertex transformation`, `Triangle rasterization`, `Texture mapping`],
    answer: 2,
    intuition: `From a more system point of view we saw that triangle rasterization is the basic building block for the graphics pipeline.`,
    explanation: `At [1:08:57], the lecturer states: "From a more system point of view we saw that triangle rasterization is the basic building block for the graphics pipeline."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    id: 64,
    timestamp: `1:09:51`,
    question: `What topic will be covered in the next lecture according to the professor?`,
    options: [`Texture mapping`, `Animation`, `3D transformations`, `Lighting models`],
    answer: 2,
    intuition: `Next time we're going to talk about another important stage of the pipeline was how we actually do these 3D transformations.`,
    explanation: `At [1:09:51], the lecturer concludes: "Next time we're going to talk about another important stage of the pipeline was how we actually do these 3D transformations."

-
-`,
    code: ``,
    images: ["image_1775353176771_0.png"],
    tags: [],
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

export default function Lec4Part2Quiz() {
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
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 4: Rasterization & Sampling — Part 2</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Pipeline, Coverage, Aliasing, SSAA, Nyquist</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-04-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href="/lec4/1" style={{ color: C.muted, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href="/lec4/2" style={{ color: C.accent, fontSize: "0.85rem" }}>Part 2</a>
          </div>
          <p style={{ color: C.accent, fontWeight: 600 }}>Q33–Q64 · 32 questions</p>
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
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 4: Rasterization & Sampling — Part 2</span>
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
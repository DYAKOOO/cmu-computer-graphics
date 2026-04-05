'use client'
import { useState, useEffect, useRef } from 'react'
import { Monitor } from 'lucide-react'

// Source: lectures/cg-04-lecture-quiz.md  (symlinked from Logseq pages)
// Lecture 4: Rasterization & Sampling — Part 2 — Q33–Q64 (32 questions)
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
    num: 33,
    timestamp: `35:34`,
    question: `How does the lecture suggest we can understand signals like audio?`,
    options: [`As a sequence of amplitudes over time`, `As a superposition or sum of different frequencies`, `As a set of discrete events`, `As a series of waveforms`],
    answer: 1,
    explanation: `At [35:34], the lecturer states: "A 1D signal like audio can be expressed as a superposition or a sum of different frequencies."`,
    images: ["image_1771998186382_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 34,
    timestamp: `38:30`,
    question: `In the pitch-rising experiment, what unexpected phenomenon was observed?`,
    options: [`The audio became distorted`, `The frequency remained constant`, `The pitch appeared to rise and fall repeatedly`, `The sound became inaudible`],
    answer: 2,
    explanation: `At [38:30], the lecturer describes: "Rather than just going from low to high and higher and higher and higher it went from low to high back down to low back up to high back down to low what is going on there?"`,
    images: ["image_1771998301424_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 35,
    timestamp: `38:50`,
    question: `What explains the unexpected result in the pitch experiment?`,
    options: [`A bug in the audio playback system`, `Interference between multiple sound waves`, `Undersampling of the high-frequency signal`, `Incorrect frequency generation`],
    answer: 2,
    explanation: `At [38:50], the lecturer explains: "If we under sample if we have too few points to capture all of the little wiggles in that sound wave then we're going to get aliasing we're going to get a sound that doesn't actually represent the original continuous signal."`,
    images: ["image_1771998474964_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 36,
    timestamp: `40:22`,
    question: `How does the lecturer define aliasing in the audio example?`,
    options: [`When audio frequencies exceed human hearing range`, `When high frequencies masquerade as low frequencies after reconstruction`, `When digital audio cannot reproduce analog sounds`, `When sound becomes too distorted to recognize`],
    answer: 1,
    explanation: `At [40:22], the lecturer states: "In this case this is what we mean by aliasing high frequencies in the original signal quickly oscillating waves masquerade as low frequencies after we perform the reconstruction because we've under sampled.""`,
    images: ["image_1771998452042_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 37,
    timestamp: `41:44`,
    question: `In the image frequency domain representation shown in the lecture, where are the low frequencies located?`,
    options: [`At the edges of the representation`, `At the dead center`, `Uniformly distributed throughout`, `At the corners only`],
    answer: 1,
    explanation: `At [41:44], the lecturer explains: "This image that we see on the right is kind of like the analyzer the spectral analyzer for the image that we see on the left except this time all the low frequencies are dead center and as we go out in any direction... we're looking at higher and higher frequencies."`,
    images: ["image_1771998501567_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 38,
    timestamp: `44:10`,
    question: `What function was used to create the synthetic aliasing example in the lecture?`,
    options: [`sin(x) + sin(y)`, `sin(x² + y²)`, `sin(x) * sin(y)`, `cos(x² - y²)`],
    answer: 1,
    explanation: `At [44:10], the lecturer describes: "We're going to build a function intentionally that has crazy high frequencies in it and that function is sine of x squared plus y squared."`,
    images: ["image_1771998552981_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 39,
    timestamp: `45:32`,
    question: `What real-world example of temporal aliasing is described in the lecture?`,
    options: [`Motion blur in photographs`, `Spinning wagon wheels appearing to rotate backwards`, `Lens flare effects`, `Image pixelation when zooming`],
    answer: 1,
    explanation: `At [45:32], the lecturer explains: "If it's ever been nighttime you're looking out the car window at a car next to you and you stare at the hubcaps you'll see an effect like this. Maybe as the car leaves through the stop light the wheels start spinning faster and faster and rather than looking like they're spinning forward they start spinning backward."`,
    images: ["image_1771998614239_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 40,
    timestamp: `46:41`,
    question: `What theorem establishes when a signal can be perfectly reconstructed from samples?`,
    options: [`The Fourier Transform Theorem`, `The Sampling Law`, `The Nyquist-Shannon Theorem`, `The Signal Processing Theorem`],
    answer: 2,
    explanation: `At [46:41], the lecturer states: "So how can we be precise about when this phenomenon occurs this is something called the nyquist shannon theorem okay really important theorem in signal processing."`,
    images: [],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 41,
    timestamp: `47:36`,
    question: `According to the Nyquist-Shannon theorem, what condition allows perfect signal reconstruction?`,
    options: [`The signal must be continuous`, `The signal must be sampled at least twice as frequently as its highest frequency`, `The signal must have limited amplitude`, `The signal must be perfectly periodic`],
    answer: 1,
    explanation: `At [47:36], the lecturer explains: "If your signal happens to be band limited then it can be perfectly reconstructed as long as you take samples at a rate that's twice as frequent as the highest frequency in the signal."`,
    images: ["image_1771998665800_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 42,
    timestamp: `47:56`,
    question: `What filter is used for perfect reconstruction according to the Nyquist-Shannon theorem?`,
    options: [`Gaussian filter`, `Box filter`, `Sync filter`, `Triangle filter`],
    answer: 2,
    explanation: `At [47:56], the lecturer states: "Once you have those samples you can reconstruct exactly the original signal by using something called a sync filter."`,
    images: ["image_1771998802412_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 43,
    timestamp: `48:38`,
    question: `Why can't most graphics signals be perfectly reconstructed using the Nyquist-Shannon approach?`,
    options: [`The sampling rate is too low`, `The signals aren't band-limited due to features like hard edges`, `The reconstruction filters are too complex`, `There's too much noise in the signals`],
    answer: 1,
    explanation: `At [48:57], the lecturer explains: "Here's our triangle our coverage function how do I express something like a hard edge as a sum of sinusoids? Well actually it turns out that what I have to do is add an infinite series of higher and higher and higher frequencies until I can eventually approximate something like a piecewise constant function."`,
    images: ["image_1771998941026_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 44,
    timestamp: `50:39`,
    question: `What common aliasing artifact appears in static images with straight lines?`,
    options: [`Moire patterns`, `Jaggies (jagged edges)`, `Banding`, `Pixel bleeding`],
    answer: 1,
    explanation: `At [50:39], the lecturer describes: "Really really common artifacts in graphics or you have let's say jaggies in a in a static image if I draw a line segment it has these jagged edges."`,
    images: ["image_1771998975218_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 45,
    timestamp: `51:39`,
    question: `What is the ideal goal when trying to reduce aliasing in pixel coverage?`,
    options: [`To remove all high frequencies from the scene`, `To match the total light in a pixel with the total light in the original signal`, `To use the minimum number of samples possible`, `To randomize the sampling pattern`],
    answer: 1,
    explanation: `At [51:39], the lecturer explains: "If we think of a pixel as a little square of light then what we want is that the total light emitted from that pixel to be the same as the total light that we had in our original continuous signal in other words we want to integrate the input signal over the pixel to get the sample value."`,
    images: ["image_1771999074308_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 46,
    timestamp: `53:02`,
    question: `What anti-aliasing technique is described in the lecture?`,
    options: [`Adaptive sampling`, `Super sampling`, `Anisotropic filtering`, `Gaussian blur`],
    answer: 1,
    explanation: `At [53:02], the lecturer explains: "So what we're really going to do is use a technique called super sampling rather than just taking one sample of the signal the coverage signal at each pixel we're going to take several samples."`,
    images: ["image_1771999129670_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 47,
    timestamp: `53:54`,
    question: `How are the multiple samples used in super sampling anti-aliasing?`,
    options: [`The brightest sample is selected`, `The samples are averaged to determine the pixel's coverage`, `The median value is used`, `The samples are combined using a weighted formula`],
    answer: 1,
    explanation: `At [53:54], the lecturer explains: "If some fraction of the samples are covered let's say half of them are covered well then we say okay 50% of that pixel is covered right so we just use the fraction of sample values that are covered to get an approximation of the fraction of the pixel that's covered."`,
    images: ["image_1771999227390_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 48,
    timestamp: `55:16`,
    question: `What improvement was observed when increasing from 4 samples per pixel to 16 samples per pixel?`,
    options: [`The image became perfectly aliasing-free`, `There was no visible difference`, `The image became smoother but still had some artifacts`, `The image became darker`],
    answer: 2,
    explanation: `At [55:16], the lecturer observes: "So now in each pixel we have 4x4 or 16 samples things get a little bit smoother okay still not perfect."`,
    images: ["image_1771999256302_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 49,
    timestamp: `55:42`,
    question: `Even with 1024 samples per pixel, what was observed about the anti-aliasing result?`,
    options: [`It became perfect with no visible artifacts`, `It still wasn't perfect`, `It became too blurry`, `It introduced new artifacts`],
    answer: 1,
    explanation: `At [55:30], the lecturer states: "So now we do 32 by 32 we have 1024 samples taken for every single pixel and we average them back down so even though this looks a lot better you notice it's still not perfect."

-`,
    images: ["image_1775353040809_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 50,
    timestamp: `55:54`,
    question: `What special case for perfect anti-aliasing is mentioned in the lecture?`,
    options: [`Straight line segments`, `Checkerboard patterns`, `Circular shapes`, `Uniform color regions`],
    answer: 1,
    explanation: `At [55:54], the lecturer notes: "In this very very special case of the checkerboard there happens to be an exact solution you can analytically integrate the checkerboard over a pixel and get this beautifully smooth image."`,
    images: ["image_1771999301034_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 51,
    timestamp: `57:10`,
    question: `What is the most basic operation needed for triangle rasterization?`,
    options: [`Computing triangle area`, `Testing if a point is inside a triangle`, `Finding the closest point on a triangle`, `Calculating triangle perimeter`],
    answer: 1,
    explanation: `At [57:10], the lecturer explains: "The most basic thing that we need to do is say okay we have this triangle we have this pixel grid we want to know which pixels are covered by the triangle we can just break this down into an atomic query which is how do we check if a given point q is inside a triangle with vertices p0 p1 p2."`,
    images: ["image_1771999356654_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 52,
    timestamp: `58:12`,
    question: `How is the point-in-triangle test typically implemented?`,
    options: [`Using barycentric coordinates`, `Computing distance to each edge`, `Testing if the point is inside the three half-planes defined by the edges`, `Calculating angle sums`],
    answer: 2,
    explanation: `At [58:12], the lecturer explains: "How do you test if a point's inside of a triangle? Well I know that if it's contained in the half plane made by the bottom edge and the right edge and the left edge then it must be inside the triangle."`,
    images: ["image_1771999387129_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 53,
    timestamp: `59:36`,
    question: `What optimization is mentioned for incremental point-in-triangle testing?`,
    options: [`Using graphics hardware acceleration`, `Reusing calculations between adjacent pixels`, `Pre-computing lookup tables`, `Approximating triangles with rectangles`],
    answer: 1,
    explanation: `At [59:36], the lecturer describes: "I can make this a little bit faster by noticing that the half plane check looks very similar for nearby points so I can save myself some arithmetic by not going through these points in a random order but by marching let's say along rows of the triangle and incrementally updating my calculations."`,
    images: ["image_1771999404785_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 54,
    timestamp: `1:00:04`,
    question: `What does the lecturer identify as the primary bottleneck in modern hardware?`,
    options: [`Arithmetic computations`, `Memory access`, `Cache size`, `Power consumption`],
    answer: 1,
    explanation: `At [1:00:04], the lecturer states: "In real modern hardware the bottleneck is typically not doing arithmetic doing math but the bottleneck is reading or writing to memory."`,
    images: ["image_1771999436931_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 55,
    timestamp: `1:00:46`,
    question: `What approach does modern hardware take to triangle rasterization?`,
    options: [`Sequential processing of each pixel`, `Testing all samples in the triangle's bounding box in parallel`, `Using a lookup table for common triangle shapes`, `Processing one scan line at a time`],
    answer: 1,
    explanation: `At [1:00:46], the lecturer explains: "What we're going to do instead is just test all the samples in the bounding box around the triangles so it's kind of the tightest fitting box around the triangle we're going to test all those samples in parallel."`,
    images: ["image_1771999512661_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 56,
    timestamp: `1:02:09`,
    question: `What shape of triangle was identified as problematic for the parallel bounding box approach?`,
    options: [`Very small triangles`, `Triangles with obtuse angles`, `Long, skinny triangles`, `Triangles with curved edges`],
    answer: 2,
    explanation: `At [1:02:09], the lecturer describes: "You can imagine for instance that I had just one long skinny triangle that stretched all the way across the screen right and so now if I'm testing all the points in the bounding box almost none of them are going to be covered I'm wasting a lot of time."`,
    images: ["image_1771999527981_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 57,
    timestamp: `1:02:40`,
    question: `What optimization technique tests larger blocks before individual pixels?`,
    options: [`Hierarchical decomposition`, `Scan conversion`, `Block-based optimization`, `Stochastic sampling`],
    answer: 2,
    explanation: `At [1:02:33], the lecturer introduces: "I can take kind of a hybrid or course define approach and first ask if large blocks of pixels intersect the triangle so before testing any individual pixel I draw some kind of medium size square."`,
    images: ["image_1771999609505_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 58,
    timestamp: `1:03:00`,
    question: `What is the benefit of the early-out test with blocks?`,
    options: [`It improves cache coherence`, `It allows hardware acceleration`, `It avoids unnecessary work on pixels not covered by the triangle`, `It simplifies the triangle intersection test`],
    answer: 2,
    explanation: `At [1:03:00], the lecturer explains: "If I know that this gray box in the upper left doesn't intersect the triangle at all then I don't need to do any more work none of those none of those pixels are covered."`,
    images: [],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 59,
    timestamp: `1:04:49`,
    question: `What important graphics concept is introduced with the recursive block testing approach?`,
    options: [`Dynamic programming`, `Hierarchical strategy`, `Backtracking`, `Divide and conquer`],
    answer: 1,
    explanation: `At [1:04:49], the lecturer states: "This leads to another really really important idea in all of computer graphics which is to take a hierarchical strategy."`,
    images: ["image_1771999662712_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 60,
    timestamp: `1:06:16`,
    question: `Why isn't hierarchical rasterization commonly used in real graphics hardware?`,
    options: [`It produces visual artifacts`, `It requires too much memory`, `The overhead of traversal is too high`, `It's patented and requires licensing`],
    answer: 2,
    explanation: `At [1:06:16], the lecturer explains: "This is actually not what happens in real graphics hardware because there's still quite a bit of overhead to doing this hierarchical traversal so having just one course to find level is kind of a nice sweet spot."`,
    images: [],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 61,
    timestamp: `1:07:20`,
    question: `What is one of the key frameworks mentioned in the summary for understanding graphics problems?`,
    options: [`Object-oriented programming`, `Sampling and reconstruction`, `Linear algebra`, `Calculus of variations`],
    answer: 1,
    explanation: `At [1:07:20], the lecturer summarizes: "Overall today what we saw is that we can frame a lot of problems in computer graphics in terms of sampling and reconstruction."`,
    images: [],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 62,
    timestamp: `1:08:27`,
    question: `What does the lecturer describe as the basic strategy for reducing aliasing in rasterization?`,
    options: [`Blurring the image`, `Using super sampling`, `Decreasing the resolution`, `Using different primitive shapes`],
    answer: 1,
    explanation: `At [1:08:27], the lecturer concludes: "Our basic strategy for reducing aliasing at least for rasterization was to use super sampling."`,
    images: ["image_1775353150954_0.png"],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 63,
    timestamp: `1:08:57`,
    question: `According to the summary, what is the "basic building block" for the graphics pipeline?`,
    options: [`Pixel shading`, `Vertex transformation`, `Triangle rasterization`, `Texture mapping`],
    answer: 2,
    explanation: `At [1:08:57], the lecturer states: "From a more system point of view we saw that triangle rasterization is the basic building block for the graphics pipeline."`,
    images: [],
    tags: [],
    source: `lectures/cg-04-lecture-quiz.md`,
  },
  {
    num: 64,
    timestamp: `1:09:51`,
    question: `What topic will be covered in the next lecture according to the professor?`,
    options: [`Texture mapping`, `Animation`, `3D transformations`, `Lighting models`],
    answer: 2,
    explanation: `At [1:09:51], the lecturer concludes: "Next time we're going to talk about another important stage of the pipeline was how we actually do these 3D transformations."

-
-`,
    images: ["image_1775353176771_0.png"],
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

export default function Lec4Part2Quiz() {
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
      <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem' }}>Lecture 4: Rasterization & Sampling — Part 2</h1>
      <p style={{ color: '#94a3b8', marginBottom: '0.25rem' }}>Pipeline, Coverage, Aliasing, SSAA, Nyquist</p>
      <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Q33–Q64 · 32 questions</p>
      <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
        <a href="/lec4/1" style={{ color: "#64748b" }}>Part 1</a> · <a href="/lec4/2" style={{ color: ACCENT }}>Part 2</a>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}><Monitor size={20} color={ACCENT} /><h1 style={{ color: ACCENT, fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Lecture 4: Rasterization & Sampling — Part 2 — Results</h1></div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Monitor size={18} color={ACCENT} /><span style={{ color: ACCENT, fontWeight: 600, fontSize: '0.95rem' }}>Lecture 4: Rasterization & Sampling — Part 2</span></div>
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

'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Zap } from 'lucide-react'

// Source: lectures/cg-15-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 15: Radiometry — Part 1 · QQ1–QQ32 · 32 questions (32 MCQ, 0 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-15-lecture-quiz.md 15

const quizData = [
  {
    id: 1,
    qid: `Q1`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `00:00`,
    question: `What is radiometry in the context of computer graphics?`,
    options: [`The measurement of light and illumination in a physically accurate way`, `The study of how computers process images`, `A mathematical method for rendering shadows`, `A technique for creating computer-generated lighting effects`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [00:07], the lecturer defines radiometry as "quite literally measurement of light. So if we want to generate photorealistic images, we really want to make them indistinguishable from a photograph, it's going to be important that we quantify light and illumination in a physically accurate way."`,
    code: ``,
    images: ["lec15_slide_07.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 2,
    qid: `Q2`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `01:05`,
    question: `Why is measuring light intensity important in rendering?`,
    options: [`It's primarily used for shadow calculations`, `It helps determine the processing power needed`, `It enables us to determine both color and brightness at every point`, `It's only important for artistic effects`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [01:18], the lecturer explains, "These two components together in some sense make our final image what color of light and how intense or bright is it at every point."`,
    code: ``,
    images: ["lec15_slide_16.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 3,
    qid: `Q3`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `01:59`,
    question: `What is the "geometric optics model" of light?`,
    options: [`A macroscopic model appropriate for human perception`, `A model focusing on diffraction and interference`, `A model showing how light bends around large masses`, `A quantum mechanical model focusing on wave properties`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [01:59], the lecturer states, "For the purposes of generating an image we really only need a macroscopic model, one that is tuned or modeled in a way that's appropriate for human perception and this is what's called the geometric optics model of light."`,
    code: ``,
    images: ["lec15_slide_62.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 4,
    qid: `Q4`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `02:17`,
    question: `In the geometric optics model, how do photons travel through space?`,
    options: [`In a wave-like pattern`, `In curved paths around objects`, `In straight lines`, `In quantum jumps between energy states`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [02:17], the lecturer explains, "Photons travel in straight lines through space, so little particles of light are just gonna travel straight through space and so we can represent those geometrically as rays."`,
    code: ``,
    images: ["lec15_slide_62.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 5,
    qid: `Q5`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `02:50`,
    question: `According to the lecturer, what approach should be taken when learning radiometry terms?`,
    options: [`Memorize all terms before understanding concepts`, `Focus only on the mathematical formulas`, `Understand the concepts first, then learn the terminology`, `Skip the terminology completely`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [03:18], the lecturer advises, "First we're gonna look at what these quantities mean and then we're gonna give the names to them," emphasizing understanding concepts before focusing on terminology.`,
    code: ``,
    images: ["lec15_slide_62.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 6,
    qid: `Q6`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `03:31`,
    question: `What is the main point of the Richard Feynman story shared by the lecturer?`,
    options: [`That birds should be studied in nature, not in books`, `That different languages have different names for objects`, `That names don't constitute knowledge; understanding the thing is more important`, `That memorizing scientific terminology is essential`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [03:31], the lecturer states the key point from Feynman: "Really knowing the thing is more important than knowing the name of the thing."`,
    code: ``,
    images: ["lec15_slide_62.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 7,
    qid: `Q7`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `05:24`,
    question: `Why do we need to measure light in computer graphics?`,
    options: [`Only for shadow calculations`, `To understand how much energy photons are carrying at each point in the scene`, `Only to create special visual effects`, `To reduce computational complexity`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [05:50], the lecturer explains, "All photons are in the end essentially the same, they each carry a small amount of energy and what we want to do is we want to some way of just recording how much energy do we have total."`,
    code: ``,
    images: ["lec15_slide_62.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 8,
    qid: `Q8`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `06:54`,
    question: `What is meant by "steady state" when discussing light transport?`,
    options: [`Light always has the same wavelength`, `Light travels only in straight paths`, `Light only travels at a constant speed`, `Light distribution reaches an equilibrium quickly that doesn't change over time`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [07:13], the lecturer states, "Initially there's some light traveling from the light sources and then bouncing off the walls and so forth, but very quickly things kind of settle down and we get this steady state."`,
    code: ``,
    images: ["lec15_slide_62.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 9,
    qid: `Q9`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `07:36`,
    question: `Why can't we normally see the phenomenon of light propagating through objects?`,
    options: [`The effect only happens in transparent objects`, `Light travels far too quickly for the naked eye to observe`, `Light is invisible`, `Our eyes can only see the final state`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [07:36], the lecturer explains, "This is something you couldn't possibly see with the naked eye because it goes way way too fast."`,
    code: ``,
    images: ["lec15_slide_62.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 10,
    qid: `Q10`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `09:13`,
    question: `What is radiant energy?`,
    options: [`The energy contained in a light source`, `The total number of photon hits on surfaces in a scene`, `The color of light at different wavelengths`, `The rate at which photons are emitted`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [09:20], the lecturer defines radiant energy as "nothing more than the total number of hits that in total number of times any ball hits any surface."`,
    code: ``,
    images: ["lec15_slide_62.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 11,
    qid: `Q11`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `10:23`,
    question: `What is radiant flux?`,
    options: [`The brightness of a light source`, `The color intensity of light`, `The total number of photon hits per second`, `The total energy over all time`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [10:23], the lecturer states, "Radiant flux similarly is the total number of hits per second."`,
    code: ``,
    images: ["lec15_slide_62.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 12,
    qid: `Q12`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `11:45`,
    question: `What is irradiance?`,
    options: [`The distance light travels before being absorbed`, `The total energy in a scene`, `The number of hits per second per unit area`, `The color of light at a point`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [11:45], the lecturer defines irradiance as "the number of hits per second per unit area."`,
    code: ``,
    images: ["lec15_slide_62.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 13,
    qid: `Q13`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `13:40`,
    question: `In the hierarchy of radiometric quantities, how are radiant energy, radiant flux, and irradiance related?`,
    options: [`Irradiance is multiplied by area to get radiant flux, which is multiplied by time to get radiant energy`, `Radiant energy is divided by time to get radiant flux, which is divided by area to get irradiance`, `They are all measured in the same units`, `They represent completely different physical phenomena`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [13:52], the lecturer explains, "We can then break that information down into space and time... If we break things down over time we get the radiant flux... If we break it down over space we get the radiant energy density... What we really care about is the energy per unit area per time [irradiance]."`,
    code: ``,
    images: ["lec15_slide_62.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 14,
    qid: `Q14`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `15:31`,
    question: `How does the energy of a photon relate to its wavelength?`,
    options: [`Energy and wavelength are unrelated`, `All photons have the same energy regardless of wavelength`, `Shorter wavelength (bluer) photons have more energy`, `Longer wavelength (redder) photons have more energy`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [16:01], the lecturer states, "If we have smaller wavelengths, blue or light, then it's more energy. If we have a longer wavelength, redder light, than it's less energy."`,
    code: ``,
    images: ["lec15_slide_62.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 15,
    qid: `Q15`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `17:02`,
    question: `According to the lecturer, why is tracking units useful when implementing rendering code?`,
    options: [`It helps organize the code better`, `It's required for all physics simulations`, `It's a powerful debugging tool to check calculations`, `It makes the code run faster`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [17:02], the lecturer explains, "Units it turns out are a really really powerful tool for debugging your rendering code... A good way to check is oh well if I track the units throughout this calculation do they give me what I expect."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 16,
    qid: `Q16`,
    qtype: `UNITS`,
    format: `mcq`,
    timestamp: `18:17`,
    question: `What are the units of radiant flux?`,
    options: [`Joules per meter squared`, `Watts per square meter`, `Joules`, `Watts (joules per second)`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [18:17], the lecturer states that radiant flux is measured in "joules per second otherwise known as watts."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 17,
    qid: `Q17`,
    qtype: `UNITS`,
    format: `mcq`,
    timestamp: `19:50`,
    question: `What are the units of irradiance?`,
    options: [`Joules`, `Watts per square meter`, `Steradians`, `Watts (joules per second)`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [19:50], the lecturer specifies that irradiance "has units watts per meter squared."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 18,
    qid: `Q18`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `21:29`,
    question: `What is the spectral power distribution?`,
    options: [`The pattern of shadows created by different wavelengths`, `The total energy across all wavelengths`, `Irradiance per unit wavelength`, `The distribution of light sources in a scene`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [21:29], the lecturer defines it as "the spectral power distribution. This is going to be irradiance per unit wavelength."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 19,
    qid: `Q19`,
    qtype: `UNITS`,
    format: `mcq`,
    timestamp: `22:30`,
    question: `What are the units of spectral power distribution?`,
    options: [`Watts per cubic meter`, `Watts per square meter`, `Joules`, `Watts`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [22:30], the lecturer states, "Our total unit for spectral power distribution will be watts per meters cubed, right? Watts per meter squared divided by meters."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 20,
    qid: `Q20`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `23:32`,
    question: `The lecturer uses Earth's seasons as an analogy to explain what concept in radiometry?`,
    options: [`Why shadows change length during the day`, `How different wavelengths of light create different colors`, `How light travels at different speeds through media`, `Why surfaces appear darker when tilted away from the light source`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [25:22], the lecturer explains, "When it's tilting toward the Sun the normal at a given point looks different from when it's tilting away from the Sun," setting up the explanation for why surfaces appear brighter or darker based on their orientation to the light.`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 21,
    qid: `Q21`,
    qtype: `MATHEMATICAL`,
    format: `mcq`,
    timestamp: `26:33`,
    question: `In Lambert's Law, how does irradiance change as a surface tilts away from a light source?`,
    options: [`It increases proportionally to the cosine of the angle`, `It remains constant regardless of the angle`, `It decreases proportionally to the cosine of the angle`, `It decreases with the square of the cosine of the angle`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [27:23], the lecturer derives, "The irradiance is equal to Φ over A prime... which is equal to Φ cosine theta over A. What that means is the more we tilt this plane away from the beam of light the smaller the irradiance becomes."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 22,
    qid: `Q22`,
    qtype: `IMPLEMENTATION`,
    format: `mcq`,
    timestamp: `28:20`,
    question: `What is the most basic way to shade a surface in computer graphics according to the lecture?`,
    options: [`Calculate the inverse square of the distance to the light`, `Calculate the distance from each point to the light source`, `Use the cross product of the normal and view direction`, `Take the dot product of the unit normal vector and the unit direction to the light`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [28:32], the lecturer explains the most basic approach: "Go to that point grab it's unit normal N and the direction L to the light, let's say those are both unit vectors and then you just take the dot product between those."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 23,
    qid: `Q23`,
    qtype: `IMPLEMENTATION`,
    format: `mcq`,
    timestamp: `29:43`,
    question: `What modification should be made to the basic N·L shading when the dot product becomes negative?`,
    options: [`Return zero (clamp to zero)`, `Use the absolute value of the dot product`, `Add a constant ambient term`, `Invert the normal`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [29:54], the lecturer suggests, "We might return the maximum of zero and that dot product. If it goes negative we just return zero."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 24,
    qid: `Q24`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `30:18`,
    question: `What is a directional light in computer graphics?`,
    options: [`A light that changes direction over time`, `A light that has different intensities in different directions`, `A light with a cone-shaped distribution`, `An infinitely bright light source at infinity with identical light directions`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [30:18], the lecturer describes it as "a strange abstraction we imagine we have an infinitely bright light source all the way off at infinity and the thing that's nice about this is because it's so far off in the distance all light directions are identical."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 25,
    qid: `Q25`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `30:42`,
    question: `What is an isotropic light source?`,
    options: [`A light that changes color based on viewing angle`, `A light that only emits in one direction`, `A light that emits with varying intensity in different directions`, `A light bulb shining in all directions with equal strength`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [30:42], the lecturer defines it as "an isotropic light source, it's just kind of just like a light bulb shining in all directions with equal strength."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 26,
    qid: `Q26`,
    qtype: `MATHEMATICAL`,
    format: `mcq`,
    timestamp: `30:54`,
    question: `What is the relationship between intensity (I) and total radiant flux (Φ) for an isotropic point light source?`,
    options: [`I = Φ/2π`, `I = Φ × π`, `I = Φ/4π`, `I = Φ × 4π`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [31:26], the lecturer states, "In other words the intensity is the total radiant flux divided by four pi," which corresponds to the formula I = Φ/4π.`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 27,
    qid: `Q27`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `31:56`,
    question: `Why does light appear dimmer as you move away from a point light source, even though photons don't lose energy as they travel?`,
    options: [`Photons actually do lose energy over distance`, `The viewer's sensitivity decreases with distance`, `The same amount of energy gets spread over a larger area as distance increases`, `Air absorbs some photons over distance`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [33:44], the lecturer explains, "Since the same amount of energy is distributed over the larger and smaller spheres it has to get darker, what we see has to get darker quadratically with distance."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 28,
    qid: `Q28`,
    qtype: `MATHEMATICAL`,
    format: `mcq`,
    timestamp: `32:41`,
    question: `The inverse square law for light states that irradiance (E) falls off with distance (r) according to what relationship?`,
    options: [`E ∝ 1/r³`, `E ∝ 1/r²`, `E ∝ 2πr`, `E ∝ 1/r`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [33:37], the lecturer derives, "E₂/E₁ meaning how bright is the bigger sphere divided by how bright is the smaller sphere is equal to R₁ squared over R₂ squared, or equivalently r₁ over r₂ squared," demonstrating the inverse square relationship.`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 29,
    qid: `Q29`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `34:35`,
    question: `Why is it challenging to light large rooms with point lights in both real and virtual environments?`,
    options: [`Point lights have a local influence due to quadratic falloff, requiring many lights`, `Point lights cannot produce the necessary spectrum of light`, `Point light shadows are too complex to calculate`, `Point lights are too expensive computationally`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [34:35], the lecturer notes, "This is the same as if you try to light your house. If you have a really big room in your house and you try to light it with little light bulbs, you'll find you have to put a lot of them all over the room to get a nice distribution of light. That's true also when you're lighting virtual scenes."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 30,
    qid: `Q30`,
    qtype: `CREATIVE`,
    format: `mcq`,
    timestamp: `34:55`,
    question: `What aspect of physically-based lighting do graphics artists sometimes modify for practical reasons?`,
    options: [`They make shadows darker than physically accurate`, `They change the light's color based on distance`, `They increase the speed of light`, `They adjust the inverse square falloff to be less steep (e.g., linear)`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [35:01], the lecturer states, "What people will do sometimes is say, you know, it's really a pain in the butt that things are falling off quadratically, I'm just gonna make them fall off linearly instead, or fall off in some other way that's easier to light."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 31,
    qid: `Q31`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `35:52`,
    question: `How is an angle mathematically defined?`,
    options: [`As the slope of a line`, `As the ratio of an arc length on a circle to the radius of that circle`, `As the difference between two directions`, `As a measure of rotation in three dimensions`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [35:52], the lecturer defines an angle as "the ratio of an arc on the circle to the radius of that circle."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
  },
  {
    id: 32,
    qid: `Q32`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `36:33`,
    question: `What is a solid angle?`,
    options: [`The ratio of a patch of area on a sphere to the squared radius`, `The angle between two solid objects`, `A three-dimensional wedge`, `An angle that doesn't change over time`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [36:33], the lecturer defines solid angle as "the ratio of this area to the squared radius."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md`,
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

export default function Lec15Part1Quiz() {
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
    accent: '#facc15', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec15'
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
          <Zap size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 15: Radiometry — Part 1</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Radiance, irradiance, BRDFs, rendering equation basics</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-15-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec15/1`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec15/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
          <a key={3} href={`${BASE}/lec15/3`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 3</a>
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
          <Zap size={20} /> Start Quiz
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
              <Zap size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 15: Radiometry — Part 1</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-15-lecture-quiz.md.</p>
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
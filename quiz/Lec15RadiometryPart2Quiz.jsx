'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Zap } from 'lucide-react'

// Source: lectures/cg-15-lecture-quiz.md.md  (symlinked → Logseq pages)
// Lecture 15: Radiometry — Part 2 · QQ30–QQ61 · 32 questions (32 MCQ, 0 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-15-lecture-quiz.md.md 15

const quizData = [
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
    source: `lectures/cg-15-lecture-quiz.md.md`,
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
    source: `lectures/cg-15-lecture-quiz.md.md`,
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
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 33,
    qid: `Q33`,
    qtype: `UNITS`,
    format: `mcq`,
    timestamp: `36:46`,
    question: `What is the unit of solid angle?`,
    options: [`Steradian`, `Degree`, `Radian`, `Sphere`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [36:46], the lecturer states, "The total sphere has 4 pi what are called steradians."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 34,
    qid: `Q34`,
    qtype: `FACTUAL`,
    format: `mcq`,
    timestamp: `37:37`,
    question: `According to the lecturer, what interesting fact relates the Sun and Moon as seen from Earth?`,
    options: [`They both have the same mass`, `They both rotate at the same speed`, `They both emit the same wavelengths of light`, `They both subtend approximately the same solid angle`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [37:37], the lecturer mentions, "A cute fact is that the Sun and the moon actually have a projection that's almost the same size on earth, which is pretty surprising."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 35,
    qid: `Q35`,
    qtype: `MATHEMATICAL`,
    format: `mcq`,
    timestamp: `39:14`,
    question: `How is differential solid angle (dω) expressed in spherical coordinates?`,
    options: [`dω = sin θ dθ dφ`, `dω = 4π r² dθ dφ`, `dω = r² sin θ dθ dφ`, `dω = dθ dφ`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [40:17], the lecturer states, "The differential solid angle is just that same tiny area projected on to the unit sphere, it's dA divided by R squared, or in other words we just kill that R squared factor, it's sine theta D theta D Phi."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 36,
    qid: `Q36`,
    qtype: `INTEGRATION`,
    format: `mcq`,
    timestamp: `40:43`,
    question: `What is the total solid angle when integrating the differential solid angle over the entire sphere?`,
    options: [`1`, `2π`, `4π`, `π`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [40:55], the lecturer confirms, "It's equal to integrating from 0 to 2 pi so all the way around the latitude and then integrating from 0 to PI all the way along the longitude of sine theta D theta D Phi which is 4 pi."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 37,
    qid: `Q37`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `41:36`,
    question: `What is radiance?`,
    options: [`The total energy of light in a scene`, `The color of light at a point`, `The brightness of a light source`, `The solid angle density of irradiance`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [41:57], the lecturer defines, "Radiance is the solid angle density of irradiance and we're gonna use the letter capital L."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 38,
    qid: `Q38`,
    qtype: `UNITS`,
    format: `mcq`,
    timestamp: `42:37`,
    question: `What are the units of radiance?`,
    options: [`Watts per meter squared`, `Watts`, `Watts per meter squared per steradian`, `Watts per steradian`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [42:37], the lecturer specifies that radiance "has units of watts per meter squared same as irradiance per steradian."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 39,
    qid: `Q39`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `42:46`,
    question: `What physical entity is radiance most closely associated with?`,
    options: [`A ray`, `A light source`, `A point in space`, `A surface`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [42:46], the lecturer states, "Radiance is the energy along a ray defined by some origin point P and some Direction Omega."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 40,
    qid: `Q40`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `44:10`,
    question: `What is spectral radiance?`,
    options: [`Radiant energy per unit time per unit area per solid angle`, `Radiant energy per unit time per unit area per solid angle per unit wavelength`, `The distribution of light across different angles`, `Radiant energy per unit time`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [44:25], the lecturer defines it as "Radiant energy per unit time per unit area per solid angle per unit wavelength."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 41,
    qid: `Q41`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `45:17`,
    question: `What is the light field?`,
    options: [`The distribution of light sources in a scene`, `A special effect used in movies`, `A type of photography that captures depth`, `The complete description of radiance at every point in space in every direction`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [45:17], the lecturer states, "This information of what is the radiance or the spectral radiance at every point in space in every direction is something called the light field."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 42,
    qid: `Q42`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `45:36`,
    question: `What important property does radiance have along a ray in a vacuum?`,
    options: [`It oscillates`, `It increases with distance`, `It remains constant`, `It decreases with distance`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [45:36], the lecturer states, "Radiance is, at least in a vacuum, radiance is constant along straight rays."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 43,
    qid: `Q43`,
    qtype: `TECHNOLOGY`,
    format: `mcq`,
    timestamp: `45:56`,
    question: `What is a spherical gantry used for?`,
    options: [`Capturing the four-dimensional light field leaving an object`, `Creating 3D models of objects`, `Testing gravitational effects`, `Measuring the weight of spherical objects`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [45:56], the lecturer describes it as "a spherical gantry which captures the four dimensional light field leaving an object."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 44,
    qid: `Q44`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `46:22`,
    question: `How does a standard camera relate to the light field?`,
    options: [`It creates a light field artificially`, `It modifies the light field through its lens`, `It captures the complete light field`, `It captures a small slice of the light field`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [46:22], the lecturer explains, "If you take a step back and think about what a camera is doing, a standard camera is just capturing a small slice of the light field."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 45,
    qid: `Q45`,
    qtype: `TECHNOLOGY`,
    format: `mcq`,
    timestamp: `47:00`,
    question: `What is special about a light field camera compared to a standard camera?`,
    options: [`It has a higher resolution sensor`, `It takes pictures faster`, `It uses an array of micro lenses to capture different slices of the light field`, `It captures infrared light in addition to visible light`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [47:07], the lecturer describes, "Maybe you turn your ordinary single lens into an array of these little what are called micro lenses... each of these little lenses is going to capture the scene from a very slightly different position and orientation."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 46,
    qid: `Q46`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `47:47`,
    question: `What can be done with the information captured by a light field camera?`,
    options: [`Refocus the image or change the viewpoint after taking the photo`, `Add special color effects`, `Only generate standard 2D images`, `Only create stereoscopic 3D images`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [47:47], the lecturer explains, "Maybe initially you had your photo focused on the flower and the foreground but you've really meant to photograph the person in the background, well this light field has enough information about it that you can refocus the image and get this sharper image in the back. Or maybe you can move the camera or move the viewpoint slightly to the left or to the right."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 47,
    qid: `Q47`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `48:36`,
    question: `What is the difference between incident radiance and exitant radiance?`,
    options: [`Incident is from far away sources while exitant is from nearby sources`, `They are different names for the same quantity`, `Incident is brighter than exitant`, `Incident is light coming in while exitant is light going out`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [48:44], the lecturer states, "We'll use L sub I to denote incident radiance, radiance coming in, and L sub O radiance going out, exiting radiance."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 48,
    qid: `Q48`,
    qtype: `EXAMPLE`,
    format: `mcq`,
    timestamp: `48:56`,
    question: `According to the lecturer, what is a good example of an object where incident radiance differs significantly from exitant radiance?`,
    options: [`A white wall`, `A black surface`, `A light bulb`, `A mirror`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [48:56], the lecturer states, "A great example would be a light bulb. There's a lot more like going out than light coming in."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 49,
    qid: `Q49`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `49:46`,
    question: `What does a pinhole camera directly measure?`,
    options: [`Radiant flux`, `Irradiance`, `Radiance`, `Solid angle`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [49:46], the lecturer explains, "A pinhole camera that camera model that we talked about on the very first day is really directly measuring radiance."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 50,
    qid: `Q50`,
    qtype: `MATHEMATICAL`,
    format: `mcq`,
    timestamp: `50:46`,
    question: `How do you calculate the irradiance at a point from incident radiance?`,
    options: [`By integrating the incident radiance weighted by the cosine of the angle over the hemisphere`, `By multiplying the incident radiance by π`, `By dividing the incident radiance by the distance squared`, `By adding all the incident radiance values`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [50:46], the lecturer states, "We're gonna integrate over the hemisphere H - H squared over that point of all incoming directions Omega, we're gonna integrate the incident radiance L sub i of P, Omega times cosine theta D Omega."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 51,
    qid: `Q51`,
    qtype: `SPECIAL_CASE`,
    format: `mcq`,
    timestamp: `51:14`,
    question: `What is a uniform hemispherical light source?`,
    options: [`A light source with uniform color across its surface`, `A light source that only illuminates the upper half of objects`, `A light source with a hemisphere shape`, `A light source equally distributed over half a sphere, like an overcast day`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [51:20], the lecturer explains it as "rather than thinking about a light bulb or a light source that's in some direction at infinity, you just imagine that you have light coming in from all directions by the same amount. A good example of this would be like a cloudy day, an overcast day."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 52,
    qid: `Q52`,
    qtype: `MATHEMATICAL`,
    format: `mcq`,
    timestamp: `52:02`,
    question: `What is the irradiance from a uniform hemispherical light source of radiance L?`,
    options: [`L`, `2Lπ`, `Lπ`, `L/π`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [52:02], the lecturer states, "Integral cosine theta sine theta D theta D Phi is equal to L pi."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 53,
    qid: `Q53`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `52:35`,
    question: `Despite having mathematically uniform irradiance, why don't objects under a hemispherical light source appear with uniform brightness?`,
    options: [`Occlusion from geometry blocks some of the light rays`, `Human perception distorts the appearance`, `The light source actually varies in intensity across the hemisphere`, `The assumptions in the mathematical model are incorrect`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [52:47], the lecturer explains, "The reason is because of occlusion, right? The one thing that we didn't really write explicitly into that equation is that actually some of the rays that are coming into our hemisphere are actually blocked."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 54,
    qid: `Q54`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `53:04`,
    question: `Why is ray-scene intersection so important in rendering?`,
    options: [`It's used to detect when rays are blocked by geometry`, `It's only needed for shadow calculation`, `It's primarily for reflections`, `It's only important for realistic materials`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [53:11], the lecturer states, "That's why we spent so much time trying to find intersections between rays and scenes so we can do this binary check: did it hit something or didn't it?"`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 55,
    qid: `Q55`,
    qtype: `TECHNIQUE`,
    format: `mcq`,
    timestamp: `53:48`,
    question: `What is ambient occlusion in computer graphics?`,
    options: [`A method for improving color accuracy`, `A technique that only works with ambient light sources`, `An algorithm for calculating shadow maps`, `A pre-computed approximation of how objects self-shadow under a uniform light`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [53:48], the lecturer describes it as "I'm just going to do an approximation and say well I kind of at least know that the object is gonna occlude itself, it's gonna cause some kind of self shadowing" and at [54:07] continues, "The irradiance is now completely rotation and translation invariant... that's nice because it means we can pre-compute."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 56,
    qid: `Q56`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `54:07`,
    question: `What property of ambient occlusion makes it particularly useful for real-time applications?`,
    options: [`It works with any light source`, `It's faster to compute in real-time than other lighting`, `It's rotation and translation invariant, allowing pre-computation`, `It produces more realistic shadows than other methods`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [54:07], the lecturer states, "The irradiance is now completely rotation and translation invariant. It doesn't matter if the model moves around, if it gets translated, and that's nice because it means we can pre-compute."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 57,
    qid: `Q57`,
    qtype: `IMPLEMENTATION`,
    format: `mcq`,
    timestamp: `54:19`,
    question: `How is ambient occlusion typically stored for real-time rendering?`,
    options: [`In a texture map`, `As vertex colors`, `In a special data structure`, `As a set of equations`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [54:19], the lecturer explains, "We can bake these irradiance values into the surface... and we can store those values in a texture map."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 58,
    qid: `Q58`,
    qtype: `TECHNIQUE`,
    format: `mcq`,
    timestamp: `55:31`,
    question: `What is screen-space ambient occlusion (SSAO)?`,
    options: [`A technique that only works on flat surfaces`, `A technique that calculates occlusion in 3D space`, `A pre-computed ambient occlusion technique`, `An approximation method that uses depth buffer information to estimate occlusion`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [55:36], the lecturer describes, "The observation here is that actually you have a little bit of information about the geometry just in the depth buffer... Just by looking at a given sample in the depth buffer and the depths of the samples in a nearby vicinity you can guess or kind of approximate what would be this irradiance value."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 59,
    qid: `Q59`,
    qtype: `EFFECT`,
    format: `mcq`,
    timestamp: `56:14`,
    question: `According to the lecturer, what visual effect does screen-space ambient occlusion provide?`,
    options: [`Darkening around corners and in crevices`, `Blurring of distant objects`, `Bright highlights at edges`, `More saturated colors`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [56:06], the lecturer states, "When you do this trick you get something like this. You get this kind of darkening around corners and and so forth."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 60,
    qid: `Q60`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `56:39`,
    question: `What is an area light source?`,
    options: [`A light source that covers an entire scene`, `Multiple point lights arranged in a pattern`, `A light that only illuminates a specific area`, `A light source with a specific area shape emitting light uniformly`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [56:39], the lecturer defines it as "a little patch of area floating in space like this blob on the upper right that's emitting light uniformly."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
  },
  {
    id: 61,
    qid: `Q61`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `56:46`,
    question: `Why are area lights considered more realistic than point lights?`,
    options: [`They more closely resemble real-world light sources like fluorescent tubes`, `They produce brighter illumination`, `They consume less computational power`, `They don't produce shadows`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [56:46], the lecturer explains, "This starts to be a little more realistic model for how real, let's say, light bulbs look. If you imagine you have a fluorescent tube, maybe your patch is a cylinder."`,
    code: ``,
    images: ["lec15_slide_63.png"],
    tags: [],
    source: `lectures/cg-15-lecture-quiz.md.md`,
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

export default function Lec15Part2Quiz() {
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
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 15: Radiometry — Part 2</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Radiance, irradiance, BRDFs, rendering equation basics</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-15-lecture-quiz.md.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec15/1`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec15/2`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 2</a>
          <a key={3} href={`${BASE}/lec15/3`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 3</a>
          </div>
          <p style={{ color: C.accent, fontWeight: 600 }}>QQ30–QQ61 · 32 questions (32 graded + 0 open)</p>
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
              <Zap size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 15: Radiometry — Part 2</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-15-lecture-quiz.md.md.</p>
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
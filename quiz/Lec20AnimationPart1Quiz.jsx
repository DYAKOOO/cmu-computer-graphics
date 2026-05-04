'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Film } from 'lucide-react'

// Source: lectures/cg-20-lecture-quiz.md.md  (symlinked → Logseq pages)
// Lecture 20: Introduction to Animation — Part 1 · QQF1–QQ29 · 32 questions (29 MCQ, 3 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-20-lecture-quiz.md.md 20

const quizData = [
  {
    id: 1,
    qid: `QF1`,
    qtype: `FLOW`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `The lecture begins with animation history spanning 5000 years (ancient Iran, Egypt, da Vinci, Monet, phenakistoscope). What does this detour accomplish for the technical content that follows?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `It establishes animation as the fundamental human desire to represent motion — not a modern technology trick. More importantly, it reveals the core principle: animation creates an illusion of motion by showing a sequence of still images faster than the human visual system can distinguish them (~24 fps). This frames the technical challenge: how to efficiently specify and interpolate between keyframes so the illusion is convincing. All the splines, skinning, and IK that follow are answers to "how do we author that sequence with less manual work per frame?"`,
    intuition: `Animation = tricking the brain with still frames. The whole lecture is about making that trick cheaper to produce.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 2,
    qid: `QF2`,
    qtype: `FLOW`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `The lecture evaluates Hermite → Catmull-Rom → B-splines as animation curve representations. What specific failure of each motivates the next?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `Hermite splines: animator must explicitly specify tangent vectors at every keyframe — extra labor and unnatural. Catmull-Rom: tangents computed automatically from neighboring keyframes (tangent = (p_{i+1} - p_{i-1})/2), removing tangent editing. But it passes through all control points, so unexpected overshoots can appear between keyframes. B-splines: approximating splines that don't pass through control points, giving smoother, more predictable motion at the cost of the curve no longer hitting the animator's exact keyframe positions.`,
    intuition: `Each step trades interpolation constraint for smoothness: forced-tangent → auto-tangent → approximate.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 3,
    qid: `QF3`,
    qtype: `ORDER`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `Put these animation topics in the order lecture 20 introduces them: inverse kinematics (IK) / B-spline approximating curves / keyframe interpolation and splines / skeletal animation and linear blend skinning`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `Keyframe interpolation and splines → B-spline approximating curves → Skeletal animation and linear blend skinning → Inverse kinematics (IK)`,
    intuition: `Curves first (how to interpolate scalars over time) → skeletons (how to interpolate rigid body poses) → IK (how to compute poses from end-effector goals rather than specifying them directly).`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 1,
    qid: `Q1`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `00:00`,
    question: `- [Course Introduction] → [Transitioning from rendering to animation]`,
    options: [`Motion`, `Which topic does Professor Crane identify as missing from the course discussion up to this point?`, `Polygon meshes`, `Materials and lighting`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At timestamp [00:57], Professor Crane explicitly states "But so far one thing that we haven't really talked at all about is adding motion something that's very much a part of the world we live in."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 2,
    qid: `Q2`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `01:28`,
    question: `- [Ancient Animation History] → [Earliest depictions of motion]`,
    options: [`Egyptian hieroglyphics showing movement`, `Cave paintings from prehistoric times`, `A drawing on the side of an ancient vase`, `What does Professor Crane identify as "perhaps the oldest animation or one of the oldest known animations"?`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At timestamp [01:34], Professor Crane states: "This is perhaps what you might call the oldest animation or one of the oldest known animations this is actually not originally animated but just a drawing that's found on the side of an ancient vase."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 3,
    qid: `Q3`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `02:12`,
    question: `- [Renaissance to Impressionist Motion] → [Artistic depictions]`,
    options: [`The mechanics of bird flight`, `The relationship between force and motion`, `Secondary motion of muscles bulging and swelling`, `According to the lecture, what did Leonardo da Vinci capture in his drawings related to motion?`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At timestamp [02:12], Professor Crane explains: "Here's a drawing by Leonardo da Vinci kind of picking up on the fact that as the body moves there's also kind of secondary motion bulging and swelling of the the shape and size of muscle may be to preserve volume."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 4,
    qid: `Q4`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `02:53`,
    question: `- [Phenakistoscope] → [Early animation device]`,
    options: [`What optical principle does the phenakistoscope take advantage of to create the illusion of motion?`, `Aliasing`, `Color theory`, `Stereoscopic vision`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [03:18], the professor explains: "The idea is that you're essentially taking advantage of aliasing to trick the eye to trick a human observer into believing that motion occurs."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 5,
    qid: `Q5`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `03:44`,
    question: `- [Muybridge's Horse] → [First scientific motion analysis]`,
    options: [`What scientific question was Muybridge trying to answer with his pioneering motion photography?`, `How do a horse's muscles work during movement?`, `What is the optimal gait for horse racing?`, `Whether a horse's four legs ever all leave the ground simultaneously during a gallop`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [03:44], Professor Crane states: "The first real film that was developed was this one done by Muybridge who is trying to resolve a very simple question which is when a horse gallops do all four legs ever leave the ground at the same time."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 6,
    qid: `Q6`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `04:24`,
    question: `- [Early Film Animation] → [Pre-Disney developments]`,
    options: [`That it was in black and white`, `That it was based on a comic strip`, `That it was done by Walt Disney`, `According to the lecture, what is a common misconception about the first animation created on film?`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [04:32], Professor Crane notes this misconception: "Probably if I asked you what is the first animation that was ever done on film there's a natural impulse to say oh yeah that was probably Walt Disney right. Well actually if you go back digging through the the annals of history you'll find lots of crazy interesting examples of animation that happened before Disney came out."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 7,
    qid: `Q7`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `05:21`,
    question: `- [Prince Achmed] → [First feature-length animation]`,
    options: [`Stop-motion clay animation`, `Puppet-like rigid pieces projected onto film`, `What technique was used to create "The Adventures of Prince Achmed," the first feature-length animation?`, `Computer-generated imagery`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [05:32], Professor Crane explains: "This was done in a completely different way than animation we know today this is actually almost kind of a puppet and so a bunch of rigid pieces that can be moved by an animator and then projected onto the film with all sorts of other wild effects going on here."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 8,
    qid: `Q8`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `06:12`,
    question: `- [Modern Hand-Drawn Animation] → [Contemporary techniques]`,
    options: [`The elimination of key frames`, `The switch to 3D rendering`, `According to the lecture, what has changed in modern hand-drawn animation compared to traditional techniques?`, `The use of digital technology for matting and coloring`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [06:30], Professor Crane states: "But now starting to see probably a lot more digital technology coming into play doing things like matting and coloring and so forth."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 9,
    qid: `Q9`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `06:37`,
    question: `- [Early Computer Animation] → [Before Pixar]`,
    options: [`Academic research`, `New technology`, `What does the professor identify as enabling new modes of animation before Pixar?`, `More skilled animators`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [07:07], Professor Crane explains: "It was really that there was some new technology that came out that enabled new modes of animation right so computers were really something that gave us new ways of thinking about how to animate."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 10,
    qid: `Q10`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `07:24`,
    question: `- [Sketchpad] → [Ivan Sutherland's innovation]`,
    options: [`Who developed Sketchpad, which the professor identifies as the first digital computer animation?`, `Ivan Sutherland`, `Pixar Studios`, `Ed Catmull`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [07:24], Professor Crane states: "The first digital computer animation again was not not yet Toy Story but this is something called sketchpad developed by Ivan Sutherland."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 11,
    qid: `Q11`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `08:15`,
    question: `- [ASCII Art Animation] → [Text-based animation]`,
    options: [`What material was used to capture one of the earliest examples of ASCII art animation mentioned in the lecture?`, `Magnetic tape`, `Paper printouts captured with film`, `Photographic film`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [08:15], Professor Crane explains: "This is an animation that was essentially one of the earliest examples of ASCII art so this is a animation of a cat that's a bunch of printouts this is paper that was printed out and captured with with ordinary film."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 12,
    qid: `Q12`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `08:29`,
    question: `- [University of Utah] → [Early CG research center]`,
    options: [`John Lasseter`, `Who mentioned in the lecture was both involved in early computer animation at the University of Utah and later co-founded Pixar?`, `Walt Disney`, `Ed Catmull`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [08:29], Professor Crane mentions: "University of Utah in the 70s was doing a huge amount of work on early computer animation this is done by Edie Catmull and Fred Park at Catmull was one of the cofounders of Pixar."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 13,
    qid: `Q13`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `09:09`,
    question: `- [The Works] → [First attempted CG feature]`,
    options: [`Poor script development`, `Insufficient compute power`, `Funding issues`, `What was the main obstacle that prevented the completion of "The Works," the first attempted computer-animated feature film?`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [09:32], Professor Crane states: "But still we're at the point where compute power was holding them back it just wasn't feasible to render all the frames of this animation."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 14,
    qid: `Q14`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `10:41`,
    question: `- [Modern CG Animation] → [Current techniques]`,
    options: [`Simpler animation techniques`, `More realistic lighting with global illumination`, `Fewer frames per second`, `According to the lecture, what has changed in modern computer graphics animation compared to early CG films?`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [10:48], Professor Crane explains: "So a lot more now global illumination things that used to be faked in early computer graphics movies are really physically based."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 15,
    qid: `Q15`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `11:04`,
    question: `- [Zoetrope] → [3D physical animation device]`,
    options: [`Virtual reality`, `3D printing`, `Motion sensors`, `What technology has allowed for new and remarkable zoetrope creations according to the lecture?`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [11:41], Professor Crane states: "Now that we have sophisticated it's freaking printers people are taking this same idea of this spinning solid animation and using using 3d printers to make some truly remarkable stuff."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 16,
    qid: `Q16`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `12:24`,
    question: `- [Technology and Animation] → [Evolution of methods]`,
    options: [`Who will have access to the technology?`, `How do we generate it, design it, and do the computation needed to build animation?`, `According to the professor, what is the fundamental question that must be addressed when a new animation technology emerges?`, `What is the cost-benefit ratio of the technology?`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [12:36], Professor Crane states: "And whenever we have a new technology we have to answer the question of look a great there's this amazing technology for showing motion for showing animation how do we generate it how do we design it how do we do the computation needed to build animation."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 17,
    qid: `Q17`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `12:53`,
    question: `- [Motion Perception] → [How humans perceive movement]`,
    options: [`What early theory of motion perception has been debunked according to the lecture?`, `The phi phenomenon`, `The motion parallax theory`, `The persistence of vision`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [13:09], Professor Crane states: "One of the earliest theories which has subsequently been debunked is the idea that perception emotion comes from persistence of vision."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 18,
    qid: `Q18`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `13:54`,
    question: `- [Beta Phenomenon] → [Brain-based motion perception]`,
    options: [`The blurring effect caused by rapid eye movement`, `According to the lecture, what is the beta phenomenon?`, `The anticipation of motion based on visual cues`, `The persistence of motion kept in the brain rather than the eyeball`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [13:54], Professor Crane explains: "More modern psychological explanations are things like the beta phenomenon that you do have this kind of persistence of motion but that that record of what was happening is kept not in the eyeball but in the brain."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 19,
    qid: `Q19`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `14:25`,
    question: `- [Phi Phenomenon] → [Motion anticipation]`,
    options: [`What does the professor say is happening in the phi phenomenon?`, `The brain ignores certain visual stimuli`, `The brain anticipates motion based on visual cues`, `The peripheral vision detects motion more effectively`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [14:25], Professor Crane states: "There's also something called the five phenomenon which is that the brain anticipates emotion that things that there are visual cues that you see in nature that makes you feel like motion is going to occur."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 20,
    qid: `Q20`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `15:29`,
    question: `- [Art and Perception] → [Artistic use of motion phenomena]`,
    options: [`By using special paints that shift appearance over time`, `According to the lecture, how did artists like Monet and Duchamp use motion phenomena in their static art?`, `By painting multiple overlapping images`, `By using different visual cues to suggest or cause the mind to anticipate motion`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [15:49], Professor Crane explains: "And in even static art like Monet or in Duchamp there's this way of using different visual cues to suggest or cause the the mind to anticipate what's gonna happen and give a sense of emotion."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 21,
    qid: `Q21`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `16:03`,
    question: `- [Traditional Animation] → [Key frames and in-betweens]`,
    options: [`In traditional hand-drawn animation, what is the role of the senior artist versus the apprentice?`, `The senior artist designs characters while the apprentice animates them`, `The senior artist draws key frames while the apprentice draws in-betweens`, `The senior artist creates storyboards while the apprentice draws all frames`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [16:16] and [16:36], Professor Crane describes this relationship: "To generate this motion the senior are a senior artist maybe a disney is going to sit down and draw some key frames... And an apprentice will then sit down after the senior artist has drawn the key frames and fill in the rest draw in betweens."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 22,
    qid: `Q22`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `17:15`,
    question: `- [Computer Animation] → [Three fundamental approaches]`,
    options: [`Simulation-based animation`, `What fundamental approach to computer animation is described as being similar to traditional hand-drawn animation?`, `Procedural animation`, `Digital keyframing`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [17:26], Professor Crane explains: "One of them looks very much like traditional hand-drawn animation this idea of key framing so we have rather than a drawing now we have a 3d model or a rig."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 23,
    qid: `Q23`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `18:02`,
    question: `- [Motion Capture] → [Data-driven animation]`,
    options: [`Laser scanners and pressure pads`, `A dark garment with bright white balls and multiple cameras`, `Virtual reality headsets and controllers`, `What equipment is described in the lecture as being used for motion capture at the CMU studio?`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [18:14], Professor Crane describes: "This is a photograph from the CMU motion capture studio and what's going on here is somebody's wearing this this dark garment with these bright white balls glued to various locations and their cameras in various locations around the room that pick up on these these balls."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 24,
    qid: `Q24`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `19:09`,
    question: `- [Procedural Animation] → [Algorithm-based motion]`,
    options: [`What example of procedural animation does Professor Crane provide in the lecture?`, `Motion capture`, `Character key-framing`, `Physically based simulation using Newton's laws`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [19:21], Professor Crane states: "So a really good example would be physically based simulation I write down Newton's laws of motion into the computer and I tell the computer to solve this this system of equations and out pops is very interesting and beautiful motion."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 25,
    qid: `Q25`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `19:48`,
    question: `- [Digital Keyframing] → [Computer implementation]`,
    options: [`Digital keyframing requires more skilled artists`, `What does the professor identify as the main difference between traditional hand-drawn animation and digital keyframing?`, `Digital keyframing only works for 3D models`, `The computer does the interpolation between keyframes in digital keyframing`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [19:54], Professor Crane explains: "The basic idea is we specify just the important events the computer goes in and fills the rest via interpolation or approximation."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 26,
    qid: `Q26`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `20:57`,
    question: `- [Interpolation Question] → [Mathematical approach]`,
    options: [`What does Professor Crane identify as the key question related to keyframing in computer animation?`, `How to market animation effectively`, `How to interpolate data between keyframes`, `How to optimize rendering speed`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [20:57], Professor Crane directly states: "OK so the key question then is how do we interpolate data how do we do interpolation between keyframes."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 27,
    qid: `Q27`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `21:10`,
    question: `- [Physical Spline] → [Historical tool]`,
    options: [`What physical object was historically used to draw smooth curves before digital methods existed?`, `A thin strip of wood or metal that resists bending`, `A compass`, `A protractor`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [21:10], Professor Crane explains: "A very long time ago if you wanted to draw a nice curve let's say you were trying to do architecture design a ship or something like this and you want to draw a nice curve you would use a physical object called a spline which is maybe a thin strip of wood or thin strip of metal that resists bending."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 28,
    qid: `Q28`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `22:02`,
    question: `- [Mathematical Interpolation] → [Fundamental concept]`,
    options: [`It requires too many control points`, `It results in infinite acceleration at the sharp points`, `It can't represent curved paths`, `What problem does Professor Crane identify with piecewise linear interpolation for animation?`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [22:41], Professor Crane states: "If we ask how quickly is this curve accelerating over time what does that look like well the velocity is the derivative of the curve the acceleration is the second derivative the curve so there's at these sharp points we're getting kind of infinite acceleration and this looks really unnatural."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
  },
  {
    id: 29,
    qid: `Q29`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `23:23`,
    question: `- [Spline Definition] → [Mathematical formulation]`,
    options: [`A continuous function with continuous derivatives`, `A curve defined by control points`, `A piecewise polynomial function`, `In mathematics or computer graphics, what is the definition of a spline according to the lecture?`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [23:23], Professor Crane provides this definition: "In general a spline once I'm going to use the word spline in mathematics or or computer graphics they mean any piecewise pollen function okay."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md.md`,
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

export default function Lec20Part1Quiz() {
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

  const STORE = 'quiz_lec20'
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
          <Film size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 20: Introduction to Animation — Part 1</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Keyframing, Splines, Hermite/Catmull-Rom/B-Splines, Skeletal Animation</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-20-lecture-quiz.md.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec20/1`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec20/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
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
          <Film size={20} /> Start Quiz
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
              <Film size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 20: Introduction to Animation — Part 1</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-20-lecture-quiz.md.md.</p>
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
'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Globe } from 'lucide-react'

// Source: lectures/cg-16-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 16: The Rendering Equation — Part 1 · QQ1–QQ32 · 32 questions (32 MCQ, 0 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-16-lecture-quiz.md 16

const quizData = [
  {
    id: 1,
    qid: `Q1`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `00:00`,
    question: `What is the primary goal of the rendering equation in computer graphics?`,
    options: [`To calculate the memory requirements for storing scene geometry`, `To optimize GPU performance for real-time rendering`, `To determine the most efficient data structures for 3D models`, `To model the behavior of light to generate photorealistic images`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer introduces the topic at [00:00] stating: "Today we're gonna bring together a bunch of ideas that we've been talking about for a few lectures now about color and measurement of light and so forth into the equation that's gonna let us render photorealistic images."`,
    code: ``,
    images: ["lec16_slide_01.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 2,
    qid: `Q2`,
    qtype: `RELATIONSHIP`,
    format: `mcq`,
    timestamp: `00:53`,
    question: `What is the key difference between incident and exitant radiance?`,
    options: [`Incident radiance is measured in watts while exitant radiance is measured in lumens`, `Exitant radiance refers to light coming from a source while incident radiance refers to light arriving at a point`, `Incident radiance refers to light coming in while exitant radiance refers to light going out`, `Incident radiance has higher energy than exitant radiance`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [00:53], the lecturer explains that "incident radiance means light coming in... whereas if I'm talking about exit in radiance I might be thinking about a light source and depending on which direction I'm looking out of the light source I'm shooting light of different amounts in different colors in different directions."`,
    code: ``,
    images: ["lec16_slide_07.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 3,
    qid: `Q3`,
    qtype: `RELATIONSHIP`,
    format: `mcq`,
    timestamp: `02:08`,
    question: `How is irradiance mathematically related to radiance?`,
    options: [`Irradiance is the derivative of radiance with respect to time`, `Irradiance equals radiance divided by the surface area`, `Irradiance is the integral of radiance over the hemisphere`, `Irradiance equals radiance multiplied by distance squared`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [02:08], the lecturer states: "Irradiance e is always going to be the integral of radiance. For instance if I want to know the total light coming in in that hemisphere looking up at the sky then I'm going to integrate over the hemisphere H to the incident radiance L of Omega, Omega being the incoming direction, cosine theta D Omega."`,
    code: ``,
    images: ["lec16_slide_07.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 4,
    qid: `Q4`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `02:52`,
    question: `In radiometry, what is radiance precisely?`,
    options: [`The total amount of light energy in a scene`, `The radiant energy per unit time per solid angle per unit area perpendicular to the direction`, `The brightness of a light source measured in candela`, `The direct lighting component excluding indirect illumination`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [02:52], the lecturer defines radiance as "the radiant energy per unit time per solid angle per unit area perpendicular to n" where n is the normal direction.`,
    code: ``,
    images: ["lec16_slide_07.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 5,
    qid: `Q5`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `03:44`,
    question: `What are the "two cosines" that the lecturer discusses as potentially confusing?`,
    options: [`Cosines in the incident and exitant directions`, `Cosines in diffuse and specular reflection models`, `Cosines in the real and imaginary parts of light`, `Lambert's cosine law and the cosine from spherical integration`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [03:44], the lecturer explains the "tale of two cosines" as being: "One is for a physical reason due to Lambert's cosine law... the other cosine is coming purely from the way that we write down spherical integrals from the way we parameterize the sphere."`,
    code: ``,
    images: ["lec16_slide_46.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 6,
    qid: `Q6`,
    qtype: `EQUATION`,
    format: `mcq`,
    timestamp: `05:00`,
    question: `What are the two main components of the rendering equation?`,
    options: [`Emitted radiance and reflected radiance (integral term)`, `Direct lighting and ambient occlusion`, `Reflection and refraction`, `Absorption and transmission`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [05:00], the lecturer describes the rendering equation as having two parts: "The radiance that's observed or that's leaving a point P in a direction Omega naught is equal to the emitted radiance at that point... plus the integral over all incoming directions of the incident radiance."`,
    code: ``,
    images: ["lec16_slide_46.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 7,
    qid: `Q7`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `06:52`,
    question: `What makes the rendering equation particularly challenging to solve?`,
    options: [`It has too many variables to track efficiently`, `It is recursive in nature`, `It requires specialized hardware accelerators`, `It's an NP-hard problem in computer science`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [06:52], the lecturer explains: "The key challenge with the equation that the thing is so hard about solving or evaluating this expression is that it's recursive. So what you notice is we want on the left side to evaluate the outgoing radiance and in order to do that we need to be able to evaluate on the right-hand side the incoming radiance."`,
    code: ``,
    images: ["lec16_slide_51.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 8,
    qid: `Q8`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `07:26`,
    question: `How does recursive raytracing terminate?`,
    options: [`When a ray hits an emissive surface`, `When the scene boundary is reached`, `When a predetermined depth limit is reached`, `When the contribution becomes too small`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [07:26], the lecturer explains: "How does this recurrence terminate? Well eventually I have to hit something that's emitting. Remember that the ray tracing or the rendering equation has two terms it has the emissive term and this scattering a reflection term our base case is when we just have something emitting like a light bulb."`,
    code: ``,
    images: ["lec16_slide_55.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 9,
    qid: `Q9`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `08:38`,
    question: `Why is ray tracing necessary for the rendering equation instead of rasterization?`,
    options: [`Rasterization only works for specular materials`, `Ray tracing allows precise control over which rays to evaluate for the recursive equation`, `Ray tracing is faster for most scenes`, `Rasterization cannot handle shadows correctly`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [08:38], the lecturer states: "The fact that this equation is so hard to evaluate and it has to be done recursively and so forth this is why we need to do this by ray tracing. We couldn't easily do this by running a rasterizer a rasterizer gives us very little control for essentially which rays are we evaluating."`,
    code: ``,
    images: ["lec16_slide_55.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 10,
    qid: `Q10`,
    qtype: `DIRECTION`,
    format: `mcq`,
    timestamp: `09:15`,
    question: `In the context of ray tracing for the rendering equation, why do we trace rays backward from the camera rather than forward from light sources?`,
    options: [`It's more mathematically elegant`, `Backward tracing requires less memory`, `It's more efficient since we only compute paths that contribute to the final image`, `Forward tracing is physically incorrect`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [09:15], the lecturer explains: "It's kind of a little counterintuitive you'd think oh we should start at the light and trace particles until they hit the camera but since we know where we want our path of light to end up we wanted to end up at a particular pixel... It really kind of makes sense to do things in the opposite direction trace rays backward through the scene until we hit a light."`,
    code: ``,
    images: ["lec16_slide_55.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 11,
    qid: `Q11`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `09:55`,
    question: `In the geometric optics model, what is scattering?`,
    options: [`The bending of light as it passes from one medium to another`, `The process of light hitting a surface and bouncing off without changing frequency`, `The diffraction of light around small obstacles`, `The absorption of light by opaque materials`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [09:55], the lecturer defines: "At least in our geometric optics model of light transport reflection or scattering is the process by which light that's incident on a surface that's coming in and hitting a surface interacts with the surface... It leaves the same side of the surface meaning it kind of bounces off the surface without changing frequency."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 12,
    qid: `Q12`,
    qtype: `RELATIONSHIP`,
    format: `mcq`,
    timestamp: `11:21`,
    question: `What aspect of light transport is the geometric optics model most appropriate for?`,
    options: [`Diffraction through very small apertures`, `Quantum effects at the atomic level`, `Interference patterns in thin films`, `Human-level vision of macroscopic objects`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [11:21], the lecturer notes: "We want to pick a model for light transport that is suitable or is appropriate for human level vision of a scene. I'm talking about macroscopic objects I'm talking about the way that humans see things I'm not going to account for effects like diffraction very small scale effects."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 13,
    qid: `Q13`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `11:54`,
    question: `What characterizes specular reflection?`,
    options: [`Light gets partially absorbed and partially reflected`, `Light bounces off in the direction determined by reflecting around the surface normal`, `Light bounces back in the direction it came from`, `Light scatters equally in all directions regardless of incoming direction`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [11:54], the lecturer describes specular reflection: "The light comes in and it bounces off the surface in a very particular direction the direction that you get by reflecting around the surface normal."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 14,
    qid: `Q14`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `12:25`,
    question: `What is the key characteristic of diffuse reflection?`,
    options: [`Light is reflected only in a narrow cone of directions`, `Light is reflected more strongly at grazing angles`, `The outgoing direction has no relationship to the incoming direction`, `The outgoing direction depends strongly on the incoming direction`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [12:25], the lecturer states: "Another very kind of important case is diffuse reflection which means light comes in from some direction but the direction that it goes out has nothing to do with the direction that I came in it gets scattered equally in all directions."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 15,
    qid: `Q15`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `12:51`,
    question: `What type of material exhibits glossy specular reflection?`,
    options: [`Perfect mirrors`, `Plastic materials`, `Matte wall paint`, `Perfectly polished metals`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [12:51], the lecturer explains: "You might have a glassy specular reflection which means light comes in in a particular direction and rather than bouncing exactly off the normal it kind of gets smeared or scattered out in on bunch of directions around that specular reflected direction. This slightly glossy appearance shows up in things like plastic."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 16,
    qid: `Q16`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `13:24`,
    question: `What is retro-reflection?`,
    options: [`When light bounces back in roughly the same direction it came from`, `When light bounces off a surface in a random direction`, `When light is absorbed and later re-emitted`, `When light passes through a surface without changing direction`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [13:24], the lecturer describes: "If you have a reflector on the back of your bicycle this is really designed so that if a headlight of a car is shining on the reflector it actually bounces back in the direction that it came from or almost perfectly in the direction that it came from."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 17,
    qid: `Q17`,
    qtype: `EXAMPLE`,
    format: `mcq`,
    timestamp: `14:25`,
    question: `According to the lecture, what causes the appearance of diffuse materials like a clay pot?`,
    options: [`Complete absorption of all incident light`, `Reflection only in the specular direction`, `Light being transmitted through the material`, `Equal scattering of incoming light in all directions`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [14:25], when discussing material examples, the lecturer explains: "Here we have a teapot and we're showing just two diffuse reflectance functions so the incoming light gets equally scattered in all directions it looks very kind of rough." This is consistent with the earlier definition of diffuse materials.`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 18,
    qid: `Q18`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `15:15`,
    question: `In the lecture, what material is described as exhibiting "perfect specular reflection"?`,
    options: [`Gold`, `Plastic`, `Clay`, `Mirror`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [15:15], the lecturer states: "If we use a perfect specular reflection we get this mirrored kind of surface this super polished surface."
- QUESTIONS (continued):`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 19,
    qid: `Q19`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `15:41`,
    question: `What microscopic explanation does the lecturer give for why materials have different appearances?`,
    options: [`Variations in electron configurations cause different color absorption`, `Electromagnetic fields around atoms determine reflection patterns`, `Surface temperatures affect how light is processed`, `Materials with glossy appearance might have many tiny perfect mirrors oriented in random directions`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [15:41], the lecturer explains: "Why does a surface look the way it does why do we have glossy materials well maybe at a microscopic level you might have imagined lots of little tiny reflectors that are almost perfect mirrors but they're oriented in kind of random or unpredictable ways."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 20,
    qid: `Q20`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `16:18`,
    question: `Beyond simple reflection, what other interaction types does the lecturer mention can happen with light?`,
    options: [`Only reflection, absorption and phase shifts`, `Only reflection and absorption`, `Just reflection and refraction`, `Reflection, transmission, subsurface scattering, and phosphorescence`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [16:18], the lecturer describes: "The thing that we've been talking about so far is we imagine okay it comes in in some direction just bounces off the surface but it could also get transmitted through the surface... it might bounce around inside the surface for a short amount of time... in more exotic materials it could be absorbed and re-emitted after some amount of time and this is the phenomenon of phosphorescence."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 21,
    qid: `Q21`,
    qtype: `PRINCIPLE`,
    format: `mcq`,
    timestamp: `17:13`,
    question: `What fundamental physical principle constrains all scattering functions?`,
    options: [`The uncertainty principle`, `The equivalence principle`, `Conservation of energy`, `The second law of thermodynamics`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [17:13], the lecturer states: "One thing that should always be true is that what goes in must come out total energy must be conserved right."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 22,
    qid: `Q22`,
    qtype: `VISUALIZATION`,
    format: `mcq`,
    timestamp: `18:05`,
    question: `What mental model does the lecturer use to help visualize incident radiance?`,
    options: [`A satellite view looking down at Earth`, `A laser beam hitting different surfaces`, `A camera with different exposure settings`, `A bug on the ground looking up at the world`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [18:05], the lecturer suggests: "If I imagine that I'm a little bug on the ground I can consider the view of the scene from this point I can look up and here's what I see."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 23,
    qid: `Q23`,
    qtype: `TRANSFORMATION`,
    format: `mcq`,
    timestamp: `18:43`,
    question: `How does a diffuse reflection transform incident radiance?`,
    options: [`It uniformly averages and blurs it in all outgoing directions`, `It absorbs all the incident radiance`, `It selectively filters certain wavelengths`, `It reflects it perfectly with no changes`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [18:43], the lecturer explains: "If we have a perfectly diffuse reflection then this incident radiance is going to get sent out uniformly across all outgoing directions it's going to kind of get averaged or blurred into all these outgoing directions."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 24,
    qid: `Q24`,
    qtype: `TRANSFORMATION`,
    format: `mcq`,
    timestamp: `19:00`,
    question: `How does specular reflection transform the incident radiance?`,
    options: [`It blurs it in all directions`, `It flips the image while preserving the distribution`, `It concentrates all light in a single direction`, `It completely randomizes the distribution`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [19:00], the lecturer states: "If we have a specular direction a specular reflection we get a name is like this right the incident radiance in a particular direction goes out in a very special direction the reflected direction and so the only thing you notice that happens here is the image kind of gets flipped right just due to bouncing off the mirror."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 25,
    qid: `Q25`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `19:48`,
    question: `What does the acronym BRDF stand for?`,
    options: [`Basic Radiance Direction Function`, `Basic Reflectance Distribution Function`, `Bidirectional Radiance Distribution Factor`, `Bidirectional Reflectance Distribution Function`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [19:48], the lecturer states: "We have something called the brdf or the bi-directional reflectance distribution function."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 26,
    qid: `Q26`,
    qtype: `FUNCTION`,
    format: `mcq`,
    timestamp: `20:18`,
    question: `How is the BRDF visualized in the lecture?`,
    options: [`As a 2D graph with incoming and outgoing angles`, `As a histogram of reflection intensities`, `As a 3D lobe showing outgoing directions for a given incoming direction`, `As a color wheel representing different wavelengths`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [20:18], the lecturer describes: "If we have a green incoming direction then we have a lobe of possible outgoing directions so these are all the different directions that that incoming radiance might get scattered out and you can see that in different directions it has bigger or smaller magnitudes."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 27,
    qid: `Q27`,
    qtype: `CONSTRAINT`,
    format: `mcq`,
    timestamp: `20:55`,
    question: `What upper bound must a physically correct BRDF satisfy?`,
    options: [`It must integrate to exactly 1 over the hemisphere`, `Its maximum value cannot exceed the incident radiance`, `It must integrate to no more than 1 over the hemisphere`, `It must be symmetric for all pairs of directions`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [20:55], the lecturer specifies: "We describe this as a distribution which is non-negative at every for every pair of incoming and outgoing directions and which integrates to no bigger than one over the whole hemisphere."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 28,
    qid: `Q28`,
    qtype: `PHYSICAL`,
    format: `mcq`,
    timestamp: `21:21`,
    question: `When light is absorbed by a material rather than reflected, what happens to the energy?`,
    options: [`It is stored indefinitely`, `It is converted to heat`, `It is transmitted through the material`, `It is destroyed`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [21:21], the lecturer explains: "Some of that light doesn't leave as light it might get translated into heat. Heat is really just kinetic energy of little particles jiggling at an atomic scale."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 29,
    qid: `Q29`,
    qtype: `PRINCIPLE`,
    format: `mcq`,
    timestamp: `22:09`,
    question: `What is Helmholtz reciprocity in the context of BRDFs?`,
    options: [`The rule that all BRDFs must be continuous functions`, `The law that reflection angles equal incidence angles`, `The property that a BRDF is symmetric when swapping incoming and outgoing directions`, `The principle that energy is conserved in all scattering events`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [22:09], the lecturer describes: "If I know the kind of amount of light that gets scattered in the direction Omega oh from coming in in the direction Omega I well then that's gonna be equal to how much light gets scattered out in the direction Omega I if it came in from the direction Omega oh."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 30,
    qid: `Q30`,
    qtype: `EXAMPLE`,
    format: `mcq`,
    timestamp: `23:13`,
    question: `What mathematical simplification is possible when calculating the outgoing radiance for a Lambertian reflection?`,
    options: [`The integral reduces to a simple multiplication`, `The scattering function can be pulled outside the integral because it's constant`, `The integral can be evaluated using the Dirac delta function`, `The cosine term can be eliminated completely`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [23:13], the lecturer explains: "Because a lambertian reflection is uniform because it has the same amount of scattering in every direction this function f R doesn't depend on Omega I or Omega Oh so we can just pull it out of the integral."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 31,
    qid: `Q31`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `24:11`,
    question: `In the context of Lambertian reflection, what does the term "albedo" refer to?`,
    options: [`The roughness of the material surface`, `The brightness factor or reflection coefficient of the surface`, `The angular distribution of reflected light`, `The rate at which energy is converted to heat`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [24:11], the lecturer states: "There's a common name for the brightness factor which is the albedo."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
  },
  {
    id: 32,
    qid: `Q32`,
    qtype: `GEOMETRY`,
    format: `mcq`,
    timestamp: `24:57`,
    question: `What geometric relationship characterizes perfect specular reflection?`,
    options: [`The outgoing angle is always perpendicular to the incoming angle`, `The outgoing angle equals twice the incoming angle`, `The sum of incoming and outgoing angles equals 90 degrees`, `The incoming and outgoing angles with the normal are equal`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [24:57], the lecturer states: "For a specular reflection in this side view theta I and theta oh the incoming and outgoing angle are going to be the same we want them to make the same angle with a normal."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md`,
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

export default function Lec16Part1Quiz() {
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
    accent: '#4ade80', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec16'
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
          <Globe size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 16: The Rendering Equation — Part 1</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Light transport, global illumination, Monte Carlo basics</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-16-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec16/1`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec16/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
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
          <Globe size={20} /> Start Quiz
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
              <Globe size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 16: The Rendering Equation — Part 1</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-16-lecture-quiz.md.</p>
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
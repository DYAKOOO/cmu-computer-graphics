'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Globe } from 'lucide-react'

// Source: lectures/cg-16-lecture-quiz.md.md  (symlinked → Logseq pages)
// Lecture 16: The Rendering Equation — Part 2 · QQ30–QQ61 · 32 questions (32 MCQ, 0 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-16-lecture-quiz.md.md 16

const quizData = [
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
    source: `lectures/cg-16-lecture-quiz.md.md`,
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
    source: `lectures/cg-16-lecture-quiz.md.md`,
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
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 33,
    qid: `Q33`,
    qtype: `FORMULA`,
    format: `mcq`,
    timestamp: `25:52`,
    question: `What is the vector formula for calculating the reflected direction in specular reflection?`,
    options: [`Ωo = -Ωi + 2(Ωi·n)n`, `Ωo = Ωi - 2(Ωi·n)n`, `Ωo = Ωi + 2(Ωi·n)n`, `Ωo = -Ωi - 2(Ωi·n)n`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [25:52], the lecturer gives the formula: "Omega o is equal to minus Omega I plus 2 times Omega I dot n times n."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 34,
    qid: `Q34`,
    qtype: `MATHEMATICAL`,
    format: `mcq`,
    timestamp: `26:51`,
    question: `What mathematical construct is used to represent the specular BRDF?`,
    options: [`A Gaussian distribution`, `A linear function`, `A cosine function`, `The Dirac delta function`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [26:51], the lecturer explains: "In terms of the actual scattering function f sub R we could write the specular reflection brdf down like this... something involving the Dirac Delta."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 35,
    qid: `Q35`,
    qtype: `PHENOMENON`,
    format: `mcq`,
    timestamp: `28:13`,
    question: `What happens to light when it passes from one medium to another?`,
    options: [`It refracts, changing direction based on the indices of refraction`, `It increases in intensity proportional to the density difference`, `It always splits into reflected and transmitted components equally`, `It maintains its direction perfectly`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [28:13], the lecturer explains: "In addition to reflecting off a surface light might also be transmitted through a surface which is what happens with glass and water and so forth. One important thing that happens is that it doesn't go straight through but it generally refract when it enters the new medium."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 36,
    qid: `Q36`,
    qtype: `PRINCIPLE`,
    format: `mcq`,
    timestamp: `28:38`,
    question: `Which physical law governs refraction when light passes between different media?`,
    options: [`Brewster's law`, `Fermat's principle`, `The law of reflection`, `Snell's law`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [28:38], the lecturer states: "The transmitted angle depends on the relative index of refraction of the materials the Rays entering or leaving. So basically different materials have different densities air is not as dense as water right and so as I go from one medium into the other I get this refraction event."
- QUESTIONS (continued):`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 37,
    qid: `Q37`,
    qtype: `PHENOMENON`,
    format: `mcq`,
    timestamp: `30:10`,
    question: `What is total internal reflection?`,
    options: [`When light is completely absorbed inside a medium`, `When light passes through a medium without any refraction`, `When light is scattered in all directions inside a material`, `When light from a denser medium hits the boundary at a large angle and is reflected instead of refracted`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [30:10], the lecturer explains: "If we're traveling from a more optically dense medium to a less optically dense medium right from water back into air then it's possible that light incident on the surface from a large enough angle might not exit the medium. In other words instead of getting refracted or transmitted through the surface it's going to bounce off it's going to behave more like a specular reflection."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 38,
    qid: `Q38`,
    qtype: `EXAMPLE`,
    format: `mcq`,
    timestamp: `31:08`,
    question: `What natural example does the lecturer give to illustrate multiple optical phenomena including Fresnel effects?`,
    options: [`Mirages in the desert`, `Rainbows in the sky`, `Crystals refracting light`, `The ocean surface viewed from different angles`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [31:08], the lecturer states: "A great example where all these different phenomena they come together is again if you're out on the ocean and you kind of see look on the horizon it looks like you have a perfect mirror that's reflecting the sky or the trees up close where you don't have this grazing angle you have something that looks just like ordinary kind of transmitted light."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 39,
    qid: `Q39`,
    qtype: `EFFECT`,
    format: `mcq`,
    timestamp: `32:07`,
    question: `What visual difference is demonstrated between glass spheres rendered with and without Fresnel effects?`,
    options: [`The sphere with Fresnel effects has a different color`, `The sphere without Fresnel effects doesn't cast shadows`, `The sphere without Fresnel effects is completely transparent`, `The sphere with Fresnel effects shows increased reflectivity at grazing angles`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [32:07], the lecturer shows an example of glass spheres with and without Fresnel effects. Though not directly quoted in the timestamp, the implication is that the sphere with Fresnel effects shows the characteristic angle-dependent reflectivity that's the hallmark of Fresnel effects.`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 40,
    qid: `Q40`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `32:32`,
    question: `What is anisotropic reflection?`,
    options: [`Reflection that is stronger in certain azimuthal directions`, `Reflection that changes with time`, `Reflection that is wavelength-dependent`, `Reflection that depends only on the incoming direction`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [32:32], the lecturer defines: "Another thing that's extremely common in real materials is that reflection is anisotropic so it depends on the azimuthal angle this angle P."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 41,
    qid: `Q41`,
    qtype: `EXAMPLE`,
    format: `mcq`,
    timestamp: `32:39`,
    question: `What real-world materials exhibit strong anisotropic reflection?`,
    options: [`Clear glass and water`, `Matte paint and clay`, `Plastic and rubber`, `Brushed metals like doorknobs and tea kettles`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [32:39], the lecturer provides examples: "You see this really strongly in things like brushed metals so if you look at a polished doorknob or a tea kettle you see this kind of orientation of features on the surface."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 42,
    qid: `Q42`,
    qtype: `PHENOMENON`,
    format: `mcq`,
    timestamp: `33:15`,
    question: `What key limitation of standard scattering models does jade demonstrate?`,
    options: [`It fails to model metallic reflections correctly`, `It cannot capture retroreflection properly`, `It cannot represent blurring of light as it passes through translucent materials`, `It cannot model anisotropic materials`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [33:15], the lecturer explains: "Here for instance is some thin Jade kind of sculpture and you notice there's this kind of blurring of light as it passes through the surface," illustrating that simple reflection/transmission models don't capture translucent materials well.`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 43,
    qid: `Q43`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `34:01`,
    question: `What is subsurface scattering?`,
    options: [`Light being absorbed and converted to heat`, `Light entering a material, bouncing around inside, and exiting at a different point`, `Light scattering in the atmosphere above a surface`, `Light reflecting perfectly from a smooth surface`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [34:01], the lecturer defines: "The visual characteristics of many surfaces is caused by light entering at some point and then bouncing around inside the material and then leaving at a different point."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 44,
    qid: `Q44`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `34:43`,
    question: `How does subsurface scattering violate a fundamental assumption of the BRDF?`,
    options: [`It assumes that light entering at a point leaves from that same point`, `It assumes uniform scattering in all directions`, `It violates energy conservation`, `It doesn't follow Helmholtz reciprocity`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [34:43], the lecturer states: "This idea so far violates a fundamental assumption about our bi-directional reflectance distribution function namely that light coming in at that point goes out at that same point."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 45,
    qid: `Q45`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `34:55`,
    question: `What does BSSRDF stand for?`,
    options: [`Bidirectional Surface Scattering Reflectance Distribution Function`, `Basic Subsurface Scattering Reflectance Distribution Function`, `Bidirectional Subsurface Scattering Reflection Distribution Function`, `Bidirectional Scattering Surface Reflection Distribution Function`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [34:55], the lecturer introduces "a BSS RDF a bi-directional subsurface reflection distribution function."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 46,
    qid: `Q46`,
    qtype: `MATHEMATICAL`,
    format: `mcq`,
    timestamp: `35:05`,
    question: `How many parameters does a BSSRDF have compared to a BRDF?`,
    options: [`Twice as many (4)`, `Four times as many (8)`, `The same number (2)`, `One more (3)`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [35:05], the lecturer explains: "We have a function s now instead of F sub R that has four arguments instead of two it has now the input or the incident point X sub I the incident Direction Omega sub I the incident or the outgoing point X sub o and the outgoing Direction Omega sub o."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 47,
    qid: `Q47`,
    qtype: `COMPUTATIONAL`,
    format: `mcq`,
    timestamp: `36:10`,
    question: `What makes computing with BSSRDFs particularly challenging?`,
    options: [`They need multidimensional integrals over complicated geometries`, `They only work with specific material types`, `They require special hardware that isn't widely available`, `They aren't physically accurate in most situations`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [36:10], the lecturer notes: "That sounds really hard right we have to do this really you know multi-dimensional integral over very complicated geometries or things just if you start to think about what it would take to compute this things started to get really expensive."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 48,
    qid: `Q48`,
    qtype: `VISUAL`,
    format: `mcq`,
    timestamp: `36:26`,
    question: `What visual improvement does the BSSRDF model provide over BRDF for the marble statue example?`,
    options: [`More realistic translucent appearance`, `More saturated colors`, `Better reflection of the environment`, `More accurate shadows`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [36:26], the lecturer shows a comparison: "Here's a side-by-side example of what happens if you have a brdf we're trying to capture the appearance of in this case a marble statue and this is lit strongly from the side and here's our BSS rdf. You notice the second one really this is a synthesized image of course you notice the second one is much more realistic than the first."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 49,
    qid: `Q49`,
    qtype: `EQUATION`,
    format: `mcq`,
    timestamp: `37:23`,
    question: `What is the reflection equation essentially?`,
    options: [`The integral over all outgoing directions`, `The rendering equation without the emission term`, `The scattering function multiplied by the incident light`, `The differential form of the rendering equation`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [37:23], the lecturer states: "Let's go back to our reflection equation so basically the rendering equation without emissivity."`,
    code: ``,
    images: ["lec16_slide_56.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 50,
    qid: `Q50`,
    qtype: `METHOD`,
    format: `mcq`,
    timestamp: `38:00`,
    question: `What numerical technique is used to solve the reflection equation?`,
    options: [`Runge-Kutta method`, `Monte Carlo integration`, `Gauss-Seidel iteration`, `Finite element analysis`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [38:00], the lecturer states: "The way we're gonna approximate this numerically or computationally is to use a technique called Monte Carlo integration."`,
    code: ``,
    images: ["lec16_slide_58.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 51,
    qid: `Q51`,
    qtype: `PRINCIPLE`,
    format: `mcq`,
    timestamp: `38:44`,
    question: `In Monte Carlo integration for the rendering equation, what is the basic approach?`,
    options: [`Randomly sampling directions, evaluating the integrand at those points, and averaging the results`, `Dividing the hemisphere into equal-sized patches and evaluating the integral at the center of each`, `Using a series expansion to approximate the integral`, `Analytically solving the equation using calculus techniques`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [38:44], the lecturer explains: "We're gonna do the sum from J equals 1 up to n of the scattering function applied to our random Direction times the incident radiance coming from our random Direction times cosine theta divided by probability and then take the average divided by n."`,
    code: ``,
    images: ["lec16_slide_58.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 52,
    qid: `Q52`,
    qtype: `ALGORITHM`,
    format: `mcq`,
    timestamp: `39:43`,
    question: `In the pseudocode for estimating reflected light, what is the first step in the Monte Carlo process?`,
    options: [`Evaluating the scattering function`, `Computing the cosine weighting factor`, `Generating a random direction sample`, `Tracing a ray in a random direction`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [39:43], the lecturer describes: "The first thing that we do is we generate a sample a random Direction to represent the incoming direction."`,
    code: ``,
    images: ["lec16_slide_58.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 53,
    qid: `Q53`,
    qtype: `RECURSIVE`,
    format: `mcq`,
    timestamp: `40:31`,
    question: `What creates the recursive structure in the reflected light estimation algorithm?`,
    options: [`Having to trace a ray to determine the incident radiance, which itself requires the same estimation process`, `Repetitive sampling of the same scattering function`, `The need to calculate multiple bounces of light`, `Multiple levels of Monte Carlo integration`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [40:31], the lecturer explains: "How do we get this term L I the incident radiance? We have no idea how much light this random incoming ray is carrying other than to recursively call the subroutine that does the same estimation."
- QUESTIONS (continued):`,
    code: ``,
    images: ["lec16_slide_58.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 54,
    qid: `Q54`,
    qtype: `STRATEGY`,
    format: `mcq`,
    timestamp: `42:18`,
    question: `What key strategy does path tracing use to tackle the rendering equation?`,
    options: [`Breaking the equation into direct and indirect illumination terms`, `Solving the equation analytically for simple scenes`, `Ignoring all but the first bounce of light`, `Using specialized hardware to accelerate calculations`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [42:18], the lecturer explains: "A key idea in rendering is to take advantage of special knowledge to break up integration into easier components... The basic idea is to partition the rendering equation into direct and indirect illumination and indirect illumination meaning light that we get from many many bounces whereas direct illumination is the illumination we get from light hitting the surface and then that's what we see from the eye."`,
    code: ``,
    images: ["lec16_slide_58.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 55,
    qid: `Q55`,
    qtype: `IMPLEMENTATION`,
    format: `mcq`,
    timestamp: `43:19`,
    question: `How does path tracing deal with paths that could potentially bounce forever?`,
    options: [`By ignoring all paths that bounce more than once`, `By simulating only a fixed maximum number of bounces`, `By cutting paths short after a certain point in a way that preserves correctness on average`, `By using special hardware that computes infinite series`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [43:19], the lecturer states: "We're also gonna have to think about well what about paths that never terminate what about light that just keeps bouncing around forever and never hits a light source we can deal with that by just kind of cutting it short at some point. We can do that in a careful way so that we still get on average the right image."`,
    code: ``,
    images: ["lec16_slide_58.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 56,
    qid: `Q56`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `43:52`,
    question: `What are the two main components shown in the example scene with two spheres?`,
    options: [`Diffuse and specular components`, `Explicit and implicit light paths`, `Primary rays and shadow rays`, `Direct illumination plus reflection/transparency and indirect illumination`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [43:52], the lecturer describes: "Here's an image of two spheres... what we're visualizing here is just the direct illumination plus reflect and transparency. We can now add in pads that come from our recursive rendering equation from following the light around the scene or the array around the scene until it hits a light source."`,
    code: ``,
    images: ["lec16_slide_58.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 57,
    qid: `Q57`,
    qtype: `VISUAL`,
    format: `mcq`,
    timestamp: `44:25`,
    question: `According to the lecturer, what is the impact of adding indirect illumination to a rendered scene?`,
    options: [`It adds special effects like lens flares`, `It only makes a small visual difference`, `It makes the scene appear brighter but less realistic`, `It dramatically increases realism, making the image look more like a photograph`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [44:25], the lecturer states: "What you see is this indirect illumination really really is important for capturing the realism of the scene. If you don't have this in there it looks way too dark it looks really synthetic it looks like computer graphics if you add all these pads in it looks more like a photograph it becomes easier to fool the eye."`,
    code: ``,
    images: ["lec16_slide_58.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 58,
    qid: `Q58`,
    qtype: `COMPARISON`,
    format: `mcq`,
    timestamp: `44:56`,
    question: `What limitation of rasterization does the lecturer highlight in comparison to ray tracing?`,
    options: [`Rasterization requires specialized hardware`, `Rasterization cannot handle high-resolution images`, `Rasterization is much slower than ray tracing`, `Rasterization cannot achieve the level of realism that ray tracing provides`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [44:56], the lecturer concludes: "That's why we go to all the trouble of adding these secondary and tertiary paths into the equation and why it's really important to say well you know rasterization is cool it's really fast but it doesn't get us this level of realism."`,
    code: ``,
    images: ["lec16_slide_58.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 59,
    qid: `Q59`,
    qtype: `PREVIEW`,
    format: `mcq`,
    timestamp: `45:08`,
    question: `What topic does the lecturer mention will be covered in the next lecture?`,
    options: [`Material modeling`, `Graphics hardware`, `Rasterization techniques`, `Monte Carlo integration`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [45:08], the lecturer states: "Next time we're gonna talk in greater detail about this process of Monte Carlo integration how do we estimate an integral by adding up a bunch of random samples and how do we apply that to our rendering equation."`,
    code: ``,
    images: ["lec16_slide_58.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 60,
    qid: `Q60`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `00:00`,
    question: `What is the ultimate goal of the rendering equation in the context of the full lecture?`,
    options: [`To optimize code for GPU acceleration`, `To develop new data structures for scene representation`, `To create more efficient algorithms for triangle rasterization`, `To provide a mathematical foundation for photorealistic image generation`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `From the entire lecture context, particularly the introduction at [00:00], the rendering equation is presented as the mathematical foundation that enables photorealistic rendering by modeling light transport accurately.`,
    code: ``,
    images: ["lec16_slide_58.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
  },
  {
    id: 61,
    qid: `Q61`,
    qtype: `INTEGRATION`,
    format: `mcq`,
    timestamp: `28:38`,
    question: `How is the principle of Snell's Law integrated into the rendering pipeline?`,
    options: [`It's applied when calculating how light refracts through transparent materials`, `It's primarily used for optimizing shadow calculations`, `It's used only for real-time preview rendering`, `It's applied only to water surfaces in outdoor scenes`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `Throughout the lecture, particularly at [28:38], Snell's Law is described as the physical law governing how light changes direction when passing between media with different refractive indices, which is essential for rendering glass, water, and other transparent materials.`,
    code: ``,
    images: ["lec16_slide_58.png"],
    tags: [],
    source: `lectures/cg-16-lecture-quiz.md.md`,
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

export default function Lec16Part2Quiz() {
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
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 16: The Rendering Equation — Part 2</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Light transport, global illumination, Monte Carlo basics</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-16-lecture-quiz.md.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec16/1`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec16/2`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 2</a>
          <a key={3} href={`${BASE}/lec16/3`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 3</a>
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
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 16: The Rendering Equation — Part 2</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-16-lecture-quiz.md.md.</p>
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
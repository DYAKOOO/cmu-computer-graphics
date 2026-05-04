'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Box } from 'lucide-react'

// Source: lectures/cg-09-lecture-quiz.md.md  (symlinked → Logseq pages)
// Lecture 9: Introduction to Geometry — Part 1 · QQF1–QQ29 · 32 questions (29 MCQ, 3 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-09-lecture-quiz.md.md 9

const quizData = [
  {
    id: 1,
    qid: `QF1`,
    qtype: `FLOW`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `The lecture opens with a broad taxonomy of geometry representations (implicit, explicit, parametric, discrete, linguistic, ...) before teaching any single one. Why does establishing this taxonomy first matter for understanding all the representations that follow?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `No single representation is best for all operations. Implicit surfaces (F(x)=0) excel at inside/outside tests and Boolean operations. Parametric surfaces (r(u,v)) excel at surface sampling. Discrete meshes excel at local editing and simulation. The taxonomy prevents the false impression that there is one "right" way to represent geometry and helps you choose the right tool for each operation throughout the course.`,
    intuition: `The map of the territory is more valuable than any single path through it.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 2,
    qid: `QF2`,
    qtype: `FLOW`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `The lecture evaluates implicit and explicit representations before introducing discrete geometry. What operation is easy with implicit surfaces but hard with explicit, and vice versa?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `Implicit surfaces make inside/outside testing trivial (evaluate F(x): negative = inside, positive = outside) and Boolean operations (union = min, intersection = max for SDFs) natural. But generating surface samples is hard (must find the zero level set). Explicit/parametric surfaces make sampling trivial (evaluate r(u,v)) but inside/outside tests require costly ray casting. Discrete meshes inherit the explicit trade-offs and add connectivity for simulation.`,
    intuition: `The representation you choose determines which operations are O(1) and which are expensive.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 3,
    qid: `QF3`,
    qtype: `ORDER`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `Put these geometry representation types in the order the lecture introduces them: subdivision surfaces / signed distance fields (implicit) / point clouds / parametric spline curves`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `Signed distance fields (implicit) → point clouds → parametric spline curves → subdivision surfaces`,
    intuition: `The lecture moves from continuous (implicit, then parametric) to discrete (point clouds, then meshes), ending with a hybrid (subdivision surfaces that start discrete but converge to a smooth limit).`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 1,
    qid: `Q1`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `00:00`,
    question: `What is the primary goal of the geometric processing and modeling section of the course?`,
    options: [`To understand ray tracing algorithms`, `To learn how to draw 3D objects on the screen`, `To optimize rendering performance for complex scenes`, `To add geometric complexity to models beyond simple shapes`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [00:19], the lecturer states: "In the long term in this course what we want to do is work on increasing the complexity of our models going from very simplistic models like our cube creature that we can make by just applying simple linear transformations to a cube to things that look a lot more like people in the real world things that have a lot of complexity and richness and interesting materials and so forth."`,
    code: ``,
    images: ["lec9_slide_02.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 2,
    qid: `Q2`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `00:52`,
    question: `What is the etymological meaning of "geometry" according to the lecture?`,
    options: [`The drawing of geometric shapes`, `The measuring of the earth`, `The proof of mathematical theorems`, `The study of angles and triangles`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [01:36], the lecturer explains: "Geometry really means well geo is like the earth and metry is measure so really geometry came from people trying to make measurements of the earth trying to figure out where they are how to make maps and so forth."`,
    code: ``,
    images: ["lec9_slide_04.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 3,
    qid: `Q3`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `02:42`,
    question: `Which of the following statements best describes the core challenge in connecting geometry to computer science?`,
    options: [`Inventing new geometric primitives`, `Optimizing graphics hardware for geometric calculations`, `Creating digital representations to encode shapes`, `Developing ray tracing algorithms for curved surfaces`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [02:48]: "How can we describe geometry? This is really at the core of connecting geometry to computer science. We need to talk about how to come up with digital representations, how can we use digital data to encode shape."`,
    code: ``,
    images: ["lec9_slide_06.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 4,
    qid: `Q4`,
    qtype: `COMPARISON`,
    format: `mcq`,
    timestamp: `02:42`,
    question: `Which of the following is NOT mentioned as a way to describe a circle?`,
    options: [`x² + y² = 1 (implicit form)`, `(cos θ, sin θ) for θ from 0 to 2π (parametric form)`, `As a shape preserved by rotations (symmetry)`, `As a polygon with infinite sides`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `Although the lecture mentions approximating a circle with a polygon (discrete representation) at [05:27], it doesn't specifically describe a circle as "a polygon with infinite sides." The lecture mentions implicit formula, parametric formula, differential equations, discrete representation, symmetry, and curvature descriptions.`,
    code: ``,
    images: ["lec9_slide_37.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 5,
    qid: `Q5`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `06:57`,
    question: `Why does the lecture argue there is no single "best way" to encode geometry on a computer?`,
    options: [`Because geometric representations are always changing`, `Because rendering requirements always outweigh modeling concerns`, `Because some representations are inherently better than others`, `Because there are many different kinds of shapes with different requirements`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [07:10], the lecturer explains: "I think what you'll discover if we start to look at a bunch of different shapes is there doesn't really seem to be one best way to do it. And the reason is because if we go out into the world and look at all the different kinds of shapes we might want to represent or model, boy there are a lot of different kinds, a lot of different things going on."`,
    code: ``,
    images: ["lec9_slide_46.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 6,
    qid: `Q6`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `08:44`,
    question: `What unique challenge does representing dynamic cloth present according to the lecture?`,
    options: [`Cloth requires balancing simplifying assumptions with handling changing shape over time`, `Cloth can only be represented using volumetric methods`, `Cloth must be represented with implicit surfaces`, `Cloth has a particularly complex geometry`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [08:49], the lecturer states: "If I'm trying to simulate dynamic cloth blowing in the wind, then on the one hand there are some simplifying assumptions we can make based on the constraints so for instance cloth doesn't stretch very much, but on the other hand I somehow have to be able to handle the fact that the shape of this thing is changing a lot over time."`,
    code: ``,
    images: ["lec9_slide_46.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 7,
    qid: `Q7`,
    qtype: `QUOTE`,
    format: `mcq`,
    timestamp: `10:53`,
    question: `According to the quote from David Barrow of Pixar, what is hard about geometry?`,
    options: [`Meshes`, `Texturing`, `Creating realistic lighting`, `Animation`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [11:12], the lecturer quotes: "This is a great quote from David Barrow who's a senior research scientist at Pixar Animation Studios he says 'I hate meshes. I cannot believe how hard this is. Geometry is hard' and that is true."`,
    code: ``,
    images: ["lec9_slide_48.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 8,
    qid: `Q8`,
    qtype: `CATEGORIZATION`,
    format: `mcq`,
    timestamp: `11:38`,
    question: `How does the lecture categorize digital representations of geometry?`,
    options: [`Surface vs volumetric representations`, `Regular vs irregular representations`, `2D vs 3D representations`, `Implicit vs explicit representations`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [11:46], the lecturer states: "Today we're going to kind of break them down into two big categories. One is explicit representations... the other major category is implicit descriptions of geometry."`,
    code: ``,
    images: ["lec9_slide_48.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 9,
    qid: `Q9`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `13:23`,
    question: `What is the defining characteristic of an implicit representation of geometry?`,
    options: [`It is always represented as a polynomial`, `It uses vectors to describe the shape`, `It directly gives you points on the surface`, `It provides a test to determine if a point is in the shape or not`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [12:34], the lecturer explains: "In contrast to explicit representations, implicit ones don't actually tell you where any particular point is in the shape. They simply give you a test to say am I in the shape or not."`,
    code: ``,
    images: ["lec9_slide_48.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 10,
    qid: `Q10`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `14:56`,
    question: `What challenge does the "mind reading game" demonstrate about implicit surfaces?`,
    options: [`Implicit surfaces are always more complex than explicit ones`, `Implicit surfaces cannot represent all shapes`, `Implicit surfaces require more storage than explicit ones`, `Finding points on an implicit surface can be difficult`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `After the game at [16:34], the lecturer concludes: "Working with implicit surfaces makes some tasks hard. If I just have a black box function f and I know nothing else about it, it's really really hard to even find or name a single point on the surface."`,
    code: ``,
    images: ["lec9_slide_65.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 11,
    qid: `Q11`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `17:04`,
    question: `What task does the second game demonstrate is easy with implicit surfaces?`,
    options: [`Finding points on the surface`, `Rendering the surface`, `Calculating the surface area`, `Determining if a point is inside or outside the shape`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `After the second game at [18:30], the lecturer states: "Really really easy so implicit surfaces make other tasks like checking if we're inside or outside the surface incredibly easy. That's nice that seems like a useful basic operation to be able to do right."`,
    code: ``,
    images: ["lec9_slide_65.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 12,
    qid: `Q12`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `18:46`,
    question: `What defines an explicit representation of geometry according to the lecture?`,
    options: [`Points are determined by boolean operations`, `Points are given indirectly through mathematical formulas`, `Points are generated through subdivision`, `Points are given directly, often through parameterization`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [18:52], the lecturer explains: "In this case all points are given directly in some way. So for instance if we look at again at the sphere...we'd have a formula like this: for all values u and v where used between 0 and 2 pi and v is between 0 and pi cosine u sine v sine u sine v and cosine v is a point on the sphere."`,
    code: ``,
    images: ["lec9_slide_66.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 13,
    qid: `Q13`,
    qtype: `COMPARISON`,
    format: `mcq`,
    timestamp: `20:24`,
    question: `What task does the "point sampling game" demonstrate is easy with explicit surfaces?`,
    options: [`Calculating the surface normal`, `Finding the distance to the surface`, `Sampling points on the surface`, `Testing if a point is inside the surface`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `After the point sampling game at [21:19], the lecturer concludes: "So we can see that explicit surfaces really make some tasks very very easy. If I just want to sample points on the surface to plot it, no problem. I plug in some parameter values, I get those points, I draw them on the screen."`,
    code: ``,
    images: ["lec9_slide_66.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 14,
    qid: `Q14`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `21:36`,
    question: `What challenge does the second inside-outside test demonstrate with explicit surfaces?`,
    options: [`Explicit surfaces cannot be rendered efficiently`, `Checking if a point is inside an explicit surface is difficult`, `Explicit surfaces require more storage`, `Explicit surfaces cannot represent complex shapes`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `After the test at [23:09], the lecturer states: "Okay it's pretty hard to see and so what we get from this is that explicit surfaces make other tasks hard like inside outside tests."`,
    code: ``,
    images: ["lec9_slide_66.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 15,
    qid: `Q15`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `23:31`,
    question: `What is the key conclusion the lecture draws from comparing implicit and explicit representations?`,
    options: [`All representations ultimately provide the same functionality`, `Some representations work better than others depending on the task`, `Explicit representations are generally better than implicit ones`, `Implicit representations are generally better than explicit ones`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [23:31], the lecturer concludes: "And so the conclusion that we can draw from this little thought experiment is that well some representations work better than others depending on the task right. Also different representations will be better suited to different types of geometry."`,
    code: ``,
    images: ["lec9_slide_66.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 16,
    qid: `Q16`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `23:44`,
    question: `What are algebraic surfaces in the context of implicit geometry?`,
    options: [`Surfaces defined using grid-based approximations`, `Surfaces constructed using boolean operations`, `Surfaces defined using parametric equations`, `Surfaces defined as the zero set of a polynomial in x, y, and z`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [23:50], the lecturer explains: "One of our most basic ideas we've seen a couple times now is to think of a surface as a zero set of a polynomial in the three coordinates x y and z."`,
    code: ``,
    images: ["lec9_slide_66.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 17,
    qid: `Q17`,
    qtype: `TECHNIQUE`,
    format: `mcq`,
    timestamp: `25:10`,
    question: `What is the core idea behind constructive solid geometry (CSG)?`,
    options: [`Building complex shapes using differential equations`, `Building complex shapes using boolean operations on simple shapes`, `Building complex shapes using fractal patterns`, `Building complex shapes using grid-based approximations`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [25:16], the lecturer explains: "The idea is to build up more complicated shapes using boolean operations. So let's say we already have some very basic shapes like spheres and cylinders and tori and so forth, we're going to take those shapes and do things like take a union or an intersection or a difference."`,
    code: ``,
    images: ["lec9_slide_66.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 18,
    qid: `Q18`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `26:23`,
    question: `How do blobby surfaces differ from constructive solid geometry in their approach to combining shapes?`,
    options: [`Blobby surfaces use explicit representations while CSG uses implicit`, `Blobby surfaces use level sets while CSG uses polynomials`, `Blobby surfaces use gradual blending while CSG uses hard boolean operations`, `Blobby surfaces work only in 2D while CSG works in 3D`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [26:29], the lecturer contrasts: "If we want to make things a little more organic a little softer then instead of booleans we can gradually blend surfaces together."`,
    code: ``,
    images: ["lec9_slide_66.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 19,
    qid: `Q19`,
    qtype: `IMPLEMENTATION`,
    format: `mcq`,
    timestamp: `28:33`,
    question: `When creating a boolean union of shapes using distance functions, what mathematical operation is used?`,
    options: [`Addition of the distance functions`, `Minimum of the distance functions`, `Multiplication of the distance functions`, `Maximum of the distance functions`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [30:05], the lecturer explains: "One simple thing you could do is you could just take at each point x the minimum distance to either of the two shapes right so f(x) is min of d1 of x d2 of x."`,
    code: ``,
    images: ["lec9_slide_66.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 20,
    qid: `Q20`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `31:35`,
    question: `What are level set methods in the context of implicit geometry?`,
    options: [`Using parametric equations to define surfaces`, `Using a grid of values to approximate an implicit function`, `Using boolean operations to combine simple shapes`, `Using fractals to create complex surfaces`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [32:00], the lecturer describes: "So an alternative is rather than using a formula to describe our implicit function we're going to use a grid of values that approximate the function that we want to draw."`,
    code: ``,
    images: ["lec9_slide_66.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 21,
    qid: `Q21`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `34:08`,
    question: `What optimization technique is commonly used to reduce the storage cost of level sets?`,
    options: [`Using lower precision values`, `Compressing the grid values with lossy compression`, `Storing only a narrow band of grid cells around the surface`, `Converting the level set to an explicit representation`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [34:44], the lecturer states: "So a common thing to do is to dramatically reduce the cost by storing just a narrow band of grid cells around the surface so you use some kind of sparse data structure that doesn't actually need to store values everywhere in space."`,
    code: ``,
    images: ["lec9_slide_68.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 22,
    qid: `Q22`,
    qtype: `CHARACTERISTIC`,
    format: `mcq`,
    timestamp: `34:52`,
    question: `What key characteristic defines fractals according to the lecture?`,
    options: [`They must be generated using complex numbers`, `They are always based on the Mandelbrot set`, `They are only used for natural phenomena`, `They have self-similarity and details at all different scales`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [35:10], the lecturer explains: "What people noticed over time if you look especially at nature a lot of the geometry that we see that we want to model might have self-similarity and lots and lots of detail at all different scales."`,
    code: ``,
    images: ["lec9_slide_69.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 23,
    qid: `Q23`,
    qtype: `PROCESS`,
    format: `mcq`,
    timestamp: `36:24`,
    question: `How is a point determined to be in the Mandelbrot set?`,
    options: [`If iterating z² + c remains bounded (doesn't go to infinity)`, `If it has a rational coordinate representation`, `If it's on the imaginary axis`, `If it's located within the unit circle`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [37:54], the lecturer states: "How do I know if a point is in the mandelbrot set or not? Well here's the criterion we just say if the magnitude remains bounded, if this point doesn't zip off to infinity as we keep iterating this process, then the point is in the mandelbrot set."`,
    code: ``,
    images: ["lec9_slide_69.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 24,
    qid: `Q24`,
    qtype: `PRO_CON`,
    format: `mcq`,
    timestamp: `40:24`,
    question: `Which of the following is NOT mentioned as a pro of implicit representations?`,
    options: [`They can be very compact for some shapes`, `They make it easy to determine if a point is inside or outside`, `They handle changes in topology well`, `They make it easy to find all points on the surface`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `In fact, at [41:45], the lecturer lists this as a con: "Well for one thing as we saw it's very expensive very very difficult to find all the points in the shape if we want to draw it on the screen."`,
    code: ``,
    images: ["lec9_slide_69.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 25,
    qid: `Q25`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `42:09`,
    question: `What is a point cloud according to the lecture?`,
    options: [`A set of points arranged in a regular grid`, `A set of points with no connectivity information`, `A set of points connected by edges`, `A triangulated surface representation`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [42:14], the lecturer defines: "A point cloud is the most dead simple thing you could do when you're trying to communicate a shape to somebody. You just say here's a list of points that are in the shape."`,
    code: ``,
    images: ["lec9_slide_69.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 26,
    qid: `Q26`,
    qtype: `ADVANTAGE`,
    format: `mcq`,
    timestamp: `43:50`,
    question: `What advantage do polygon meshes have over point clouds?`,
    options: [`They require less storage`, `They can only represent simple shapes`, `They store connectivity information making processing and simulation easier`, `They always have higher visual quality`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [44:21], the lecturer explains: "It's a lot easier to do processing and simulation. Every point, every vertex knows kind of where its neighboring points are. We don't have to do any additional work to figure that out."`,
    code: ``,
    images: ["lec9_slide_70.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 27,
    qid: `Q27`,
    qtype: `IMPLEMENTATION`,
    format: `mcq`,
    timestamp: `45:39`,
    question: `How is a triangle mesh typically represented in a computer?`,
    options: [`As a list of vertices and a separate list of triangles containing vertex indices`, `As a regular grid of height values`, `As a collection of equations defining planes`, `As a collection of implicit functions`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [45:39], the lecturer describes: "We store the vertices as triples of coordinates x y and z and so we really just again have a point cloud of vertices but then we also have triangles which we store as triples of indices into our vertex list."`,
    code: ``,
    images: ["lec9_slide_70.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 28,
    qid: `Q28`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `47:55`,
    question: `How does the lecture interpret a triangle mesh in terms of interpolation?`,
    options: [`As a cubic spline interpolation`, `As a linear interpolation of a point cloud`, `As a discrete sampling with no interpolation`, `As a quadratic interpolation of vertices`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [47:38], the lecturer states: "In some very loose sense you can imagine that a triangle mesh is kind of a linear interpolation of a point cloud. We have these points, we know those are on the surface, how do we get the surface while we linearly interpolate."`,
    code: ``,
    images: ["lec9_slide_70.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
  },
  {
    id: 29,
    qid: `Q29`,
    qtype: `ADVANTAGE`,
    format: `mcq`,
    timestamp: `49:16`,
    question: `What advantage do Bernstein basis functions have over the standard polynomial basis (1, x, x², x³)?`,
    options: [`They provide local control over different regions of the curve`, `They are faster to evaluate computationally`, `They are more mathematically elegant`, `They require fewer coefficients`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [50:33], the lecturer explains: "If I want to adjust the height of my function at the left endpoint I just adjust the coefficient for B₀³. If I want to adjust the height of the function at the far right I adjust the coefficient for B₃₃, and similarly the other basis functions really kind of control the height in some region of the interval."`,
    code: ``,
    images: ["lec9_slide_70.png"],
    tags: [],
    source: `lectures/cg-09-lecture-quiz.md.md`,
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

export default function Lec9Part1Quiz() {
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
    accent: '#fbbf24', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec9'
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
          <Box size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 9: Introduction to Geometry — Part 1</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Implicit/explicit surfaces, point clouds, splines, level sets</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-09-lecture-quiz.md.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec9/1`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec9/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
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
          <Box size={20} /> Start Quiz
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
              <Box size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 9: Introduction to Geometry — Part 1</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-09-lecture-quiz.md.md.</p>
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
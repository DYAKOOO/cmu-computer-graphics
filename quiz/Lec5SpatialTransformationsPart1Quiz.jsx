'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Move } from 'lucide-react'

// Source: lectures/cg-05-lecture-quiz.md.md  (symlinked → Logseq pages)
// Lecture 5: Spatial Transformations — Part 1 · QQF1–QQ29 · 32 questions (29 MCQ, 3 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-05-lecture-quiz.md.md 5

const quizData = [
  {
    id: 1,
    qid: `QF1`,
    qtype: `FLOW`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `The lecture lists many uses of spatial transformations in graphics: positioning objects, moving the camera, animating, projecting to 2D, mapping textures, casting shadows. What single mathematical property makes one framework cover all of these?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `Linearity — and its consequence, composability. Each stage of the graphics pipeline is a linear map (a matrix), so the entire pipeline from model space to screen space is also a linear map (the product of all matrices). An entire sequence of transforms — model→world→camera→clip→NDC→screen — can be pre-multiplied into a single matrix applied once per vertex. This is why transformations are everywhere in graphics: any stage that can be expressed as a matrix gets this "bake everything together" efficiency for free.`,
    intuition: `Composing linear transforms = multiplying matrices. One multiplication instead of N sequential operations per vertex.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 2,
    qid: `QF2`,
    qtype: `FLOW`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `The lecture derives the 2D rotation matrix from first principles (where do basis vectors land?) rather than just stating the formula. Why is this derivation approach important beyond just getting the formula?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `The derivation reveals the general principle: any linear map is fully determined by where it sends the basis vectors. The columns of a matrix are exactly the images of the input basis vectors. This means: to build any linear transform from scratch, ask "where does e₁ go? where does e₂ go?" and read off the matrix columns. This technique works for reflections, scaling, shearing, and all composed transforms — and generalizes to 3D and non-standard bases.`,
    intuition: `A linear map has no memory, so knowing where the basis goes determines everything. The formula is just a side effect of that principle.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 3,
    qid: `QF3`,
    qtype: `ORDER`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `Put these transformation topics in the order lecture 5 introduces them: affine transformations and homogeneous coordinates / 3D rotation matrices / 2D rotation matrix derivation from first principles / scaling, reflection, and shear`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `2D rotation matrix derivation → Scaling, reflection, and shear → 3D rotation matrices → Affine transformations and homogeneous coordinates`,
    intuition: `Build from the simplest case (2D rotation) → generalize within 2D → extend to 3D → add translation via homogeneous trick.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 1,
    qid: `Q1`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `00:00`,
    question: `- [Introduction] → [Course context and transformation overview]`,
    options: [`A function that assigns a new location to each point`, `A function that modifies the color of objects`, `A function that maps 3D objects to 2D images`, `A function that preserves the distance between every pair of points`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `As stated at [0:19]: "When we talk about a spatial transformation what we really mean is basically any function that assigns a new location to each point so we could think of that for instance as a function f that takes points in rn to points in rn."

-
-  #rasterization #Pipeline we need to position it  before we go to the rest of the pipeline .`,
    code: ``,
    images: ["image_1771298936879_0.png", "image_1771298965374_0.png", "image_1771298994477_0.png"],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 2,
    qid: `Q2`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `01:47`,
    question: `- [Linear Maps] → [Definition and mathematical properties]`,
    options: [`Maps circles to ellipses and preserves volume`, `Maps lines to lines and preserves the origin`, `Preserves the distance between all points`, `Preserves angles and areas`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `As defined at [1:59]: "==Geometrically== a linear map is one that maps lines to lines so every line becomes a new line and also preserves the origin that's very important the origin remains fixed."`,
    code: ``,
    images: ["image_1771299073294_0.png"],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 3,
    qid: `Q3`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `03:19`,
    question: `- [Linear Transformations in Graphics] → [Importance and advantages]`,
    options: [`Their composition is also linear, allowing multiple transformations to be combined into a single matrix`, `They require less memory than other transformations #Representation`, `They always preserve the appearance of objects`, `They're the only transformations that can be represented as matrices`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `As explained at [3:19]: "A big reason why linear transformations are used in a graphics pipeline is that the composition of linear transformations is linear... if i have a bunch of different matrices each of which represents a linear transformation then i can just multiply them all together to bake all of those different transformations into a single transformation matrix." #composition`,
    code: ``,
    images: ["image_1771299154167_0.png"],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 4,
    qid: `Q4`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `04:14`,
    question: `- [Types of Transformations] → [Visual identification exercise]`,
    options: [`The speed at which they're applied`, `The color changes they produce`, `The invariants they preserve`, `The starting shape they're applied to`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `As Professor Crane explains at [5:33]: "Transformations at their core are not defined by formulas or matrix properties or anything like that but each type of transformation is really determined by the invariance it preserves."

#invariant`,
    code: ``,
    images: ["image_1771299302158_0.png", "image_1771299285236_0.png"],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 5,
    qid: `Q5`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `05:27`,
    question: `- [Invariants of Transformation] → [Defining characteristics]`,
    options: [`The origin`, `The angles between lines`, `The differences between any two pairs of points`, `The length of all vectors`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `As mentioned at [6:11]: "Likewise we could say a translation is a transformation that preserves the differences between any two pair of points."`,
    code: ``,
    images: ["image_1771299371552_0.png"],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 6,
    qid: `Q6`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `06:42`,
    question: `- [Rotations] → [Defining properties and characteristics]`,
    options: [`Maps straight lines to straight lines, preserves parallelism, and preserves the origin`, `Preserves volumes, preserves connectivity, and preserves symmetry`, `Preserves angles, preserves areas, and preserves the origin`, `Preserves the origin, preserves distances, and preserves orientation`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `As listed at [6:49]: "Rotations fundamentally are defined by just three basic properties. First they keep the origin fixed... A rotation will also preserve distances... And finally very important a rotation also preserves orientation."`,
    code: ``,
    images: ["image_1771299460515_0.png"],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 7,
    qid: `Q7`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `08:06`,
    question: `- [2D Rotations—Matrix Representation] → [Mathematical derivation]`,
    options: [`It becomes (sin θ, cos θ)`, `It becomes (-sin θ, cos θ)`, `It becomes (cos θ, sin θ)`, `It becomes (cos θ, -sin θ)`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `As stated at [9:20]: "Hopefully you remember that if i go an angle theta around the circle i get to cosine theta sine theta."

instead of thinking cos and sine as this osciliatary functions , its better to think of them as x and y of circles. #Fourier`,
    code: ``,
    images: ["image_1771299798491_0.png"],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 8,
    qid: `Q8`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `11:39`,
    question: `- [General 2D Rotation] → [Extending to arbitrary vectors]`,
    options: [`[[sin θ, cos θ], [-cos θ, sin θ]]`, `[[cos θ, sin θ], [sin θ, -cos θ]]`, `[[cos θ, -sin θ], [sin θ, cos θ]]`, `[[cos θ, sin θ], [-sin θ, cos θ]]`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `As given at [13:09]: "So i can write a 2d rotation as a matrix cosine theta minus sine theta sine theta cosine theta."
#DotProduct is zero`,
    code: ``,
    images: ["image_1771300035675_0.png"],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 9,
    qid: `Q9`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `13:28`,
    question: `- [3D Rotations] → [Extending to three dimensions]`,
    options: [`By using quaternions instead of matrices`, `By applying three separate rotations around each axis`, `By placing the 2D rotation in the upper-left 2×2 corner and adding 0,0,1 for the z-axis`, `By creating a completely new 3×3 matrix with different formulas`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `As explained at [14:10]: "The key idea is that to rotate around an axis i want to keep that axis fixed... so we're just going to apply the same transformation of x1 and x2 that we did in two dimensions and keep x3 fixed."`,
    code: ``,
    images: ["image_1771300344268_0.png"],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 10,
    qid: `Q10`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `15:04`,
    question: `- [Rotations—Transpose as Inverse] → [Key matrix property]`,
    options: [`R^T = -R`, `R^T × R = I (identity matrix)`, `R^T = det(R) × R`, `R^T = R`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `As stated at [16:55]: "R transpose r is equal to the identity or equivalently our transpose is our inverse."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 11,
    qid: `Q11`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `17:09`,
    question: `- [Orthogonal Transformations] → [Rotations vs. reflections]`,
    options: [`Rotation matrices have larger determinants than reflection matrices`, `Rotation matrices are diagonal, reflection matrices are not`, `Rotation matrices are symmetric, reflection matrices are not`, `Rotation matrices have determinant +1, reflection matrices have determinant -1`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `As explained at [19:19]: "Rotations additionally preserve orientation so we can say that the determinant of the matrix is positive and reflections reverse orientation so the determinant is negative."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 12,
    qid: `Q12`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `19:35`,
    question: `- [Scaling] → [Definition and properties]`,
    options: [`The angle between vectors`, `The length of vectors`, `The direction of all vectors`, `The distance between points`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `As stated at [20:01]: "What is the basic invariant of scaling well it preserves the direction of all vectors."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 13,
    qid: `Q13`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `22:06`,
    question: `- [Scaling - Matrix Representation] → [Mathematical form]`,
    options: [`[[1, 0, 0], [0, a, 0], [0, 0, a]]`, `[[a, 0, 0], [0, 1, 0], [0, 0, 1]]`, `[[a, a, a], [0, 0, 0], [0, 0, 0]]`, `[[a, 0, 0], [0, a, 0], [0, 0, a]]`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `As described at [22:21]: "It's pretty straightforward we can just build a diagonal matrix d with the number a all along the diagonal."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 14,
    qid: `Q14`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `23:21`,
    question: `- [Negative Scaling] → [Dimensionality effects]`,
    options: [`It's a reflection in 2D but a rotation in 3D`, `It's a rotation in both 2D and 3D`, `It's a rotation in 2D but a reflection in 3D`, `It's a reflection in both 2D and 3D`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `As explained at [25:18]: "This is a little bit surprising and counter-intuitive when you first start working with two and three-dimensional vectors that just negating the vector is a rotation in even dimensions and a reflection in odd dimensions."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 15,
    qid: `Q15`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `25:42`,
    question: `- [Nonuniform Scaling (Axis-Aligned)] → [Different scaling factors]`,
    options: [`[a, b, c]`, `[[a, 0, 0], [0, 0, 0], [0, 0, 0]] +`, `[[a, b, c], [0, 0, 0], [0, 0, 0]]`, `[[a, 0, 0], [0, b, 0], [0, 0, c]]`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `As stated at [26:06]: "What's the matrix representation of this operation well what we're going to do is just go ahead and put a b and c on the diagonal."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 16,
    qid: `Q16`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `26:27`,
    question: `- [Nonuniform Scaling (Arbitrary Axes)] → [Rotation-based approach]`,
    options: [`Convert to polar coordinates, scale, then convert back`, `Apply the scaling directly using a specialized non-diagonal matrix`, `Apply a shear first, then scale, then apply the inverse shear`, `Rotate to the desired axes, apply scaling, then rotate back`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `As described at [26:38]: "Let's first rotate to the new axes to the new coordinate system where we want to do the stretching then apply a diagonal scaling like we just did and then rotate back to the original axes the original coordinate system."
- # Spatial Transformations Quiz - Part 2`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 17,
    qid: `Q17`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `28:28`,
    question: `- [Spectral Theorem] → [Symmetric matrices as scaling operations]`,
    options: [`A rotation around some axis`, `A combination of rotation and translation`, `A shear in some arbitrary direction`, `A non-uniform scaling along some set of orthogonal axes`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `As explained at [29:51]: "In other words every symmetric matrix indeed performs a non-uniform scaling along some set of orthogonal axes this is really nice because it gives us a geometric interpretation to symmetric matrices."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 18,
    qid: `Q18`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `30:40`,
    question: `- [Shear] → [Definition and representation]`,
    options: [`It rotates different parts of space by different amounts`, `It displaces points proportionally to their distance from the origin`, `It displaces each point in direction u proportional to its distance along direction v`, `It maps parallel lines to parallel lines while preserving areas`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `As defined at [30:46]: "A shear is going to displace each point x in some given direction u and the amount by which it's going to displace it is equal to its distance the distance of x along a fixed vector v."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 19,
    qid: `Q19`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `32:21`,
    question: `- [Shear Example] → [Time-varying displacement]`,
    options: [`I + uv^T`, `uv`, `uu^T`, `I * (u·v)`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `As given at [31:33]: "We can represent it as a matrix which is i plus u v transpose."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 20,
    qid: `Q20`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `33:13`,
    question: `- [Composite Transformations] → [Combining basic operations]`,
    options: [`In order of increasing determinant`, `Left to right`, `Top to bottom`, `Right to left`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `As stated at [33:50]: "By the way something to always remember is the last matrix gets applied first right because we're going to take the matrix on the left and hit the vector on the right."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 21,
    qid: `Q21`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `34:38`,
    question: `- [Decomposition of Linear Transformations] → [Breaking into simpler parts]`,
    options: [`Yes, there is exactly one way to decompose any transformation`, `Yes, but only for rotation and scaling transformations`, `No, there are many different ways to decompose a given transformation`, `No, only for shear transformations`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `As stated at [34:38]: "In general there is no unique way to write a given linear transformation as a composition of basic transformations." The lecturer gives the example that a 90° rotation could be composed of two 45° rotations or ninety 1° rotations.`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 22,
    qid: `Q22`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `36:27`,
    question: `- [Polar & Singular Value Decomposition] → [Matrix factorizations]`,
    options: [`A = QR where Q is orthogonal and R is upper triangular`, `A = UDV^T where U and V are orthogonal and D is diagonal`, `A = QP where Q is orthogonal and P is symmetric positive semi-definite`, `A = LU where L is lower triangular and U is upper triangular`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `As defined at [36:27]: "One really nice decomposition is the so-called polar decomposition which writes any matrix a as an orthogonal matrix q and a symmetric positive semi-definite matrix p so i can write a is equal to q times p."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 23,
    qid: `Q23`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `39:42`,
    question: `- [Interpolating Transformations—Linear] → [Basic interpolation approach]`,
    options: [`It requires too much computation`, `It produces unintuitive, distorted intermediate transformations`, `It only works for rotation matrices`, `The determinant changes unpredictably`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `As demonstrated at [41:02]: "The good news is we did hit the start and end points right we started with the transformation we wanted and ended with the other transformation we wanted but it looks awful in between this is really not giving us good animation."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 24,
    qid: `Q24`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `41:21`,
    question: `- [Interpolating Transformations—Polar] → [Improved approach]`,
    options: [`Use quaternions instead of matrices`, `Separately interpolate the components of a polar decomposition`, `Apply the transformations sequentially instead of interpolating`, `Use spherical linear interpolation (SLERP)`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `As explained at [41:21]: "Let's consider for instance our polar decomposition and then separately interpolate these different components."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 25,
    qid: `Q25`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `43:39`,
    question: `- [Example: Linear Blend Skinning] → [Character animation application]`,
    options: [`Z-fighting`, `Candy wrapper artifact`, `Gimbal lock`, `Texture stretching`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `As mentioned at [43:45]: "If i do a naive interpolation of transformations let's say along the arm of such a character i can get some pretty nasty artifacts here something called the candy wrapper artifact where the interpolated transformation in the middle shrinks everything to zero."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 26,
    qid: `Q26`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `44:35`,
    question: `- [Translations] → [Non-linear transformation]`,
    options: [`It cannot be represented as a matrix`, `It distorts shapes too much`, `It does not preserve the origin`, `It cannot be applied multiple times`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `As stated at [46:35]: "Another way we can see this is to just notice that the origin is not preserved by translation the translation is going to move the origin to the point u."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 27,
    qid: `Q27`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `46:46`,
    question: `- [Composition Challenges] → [Mixing transformation types]`,
    options: [`They cannot be composed at all`, `They lose precision when combined`, `They require a more complex representation than just matrices and vectors`, `They require converting to a different coordinate system first`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `As explained at [47:25]: "We might say okay we could keep track of a matrix and a vector and that might work but we're going to see later on that this encoding of just working with a matrix and a vector isn't going to work out so well for other important cases like prospective transformations."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 28,
    qid: `Q28`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `48:07`,
    question: `- [Homogeneous Coordinates] → [Introduction and origins]`,
    options: [`Studying perspective in drawing and painting`, `Linear algebra studies in the 20th century`, `3D modeling software development`, `Computer graphics research in the 1970s`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `As explained at [48:07]: "Homogeneous coordinates came from the efforts of people to study really study perspective to study perspective in drawing and painting and the homogeneous coordinates themselves were introduced by a mathematician named mobius as a way of assigning coordinates to lines."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
  },
  {
    id: 29,
    qid: `Q29`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `49:20`,
    question: `- [Homogeneous Coordinates—Basic Idea] → [Geometric intuition]`,
    options: [`Converting between different coordinate systems more easily`, `Representing points at infinity with finite coordinates`, `Any point along a line through the origin can represent the same projected point`, `Using four coordinates instead of three to represent 3D points`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `As described at [50:06]: "The basic basic idea of homogeneous coordinates is that any point p hat along this line can be used to represent the point p."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-05-lecture-quiz.md.md`,
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

export default function Lec5Part1Quiz() {
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
    accent: '#f59e0b', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec5'
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
          <Move size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 5: Spatial Transformations — Part 1</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Linear maps, homogeneous coords, rotation, translation</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-05-lecture-quiz.md.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec5/1`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec5/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
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
          <Move size={20} /> Start Quiz
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
              <Move size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 5: Spatial Transformations — Part 1</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-05-lecture-quiz.md.md.</p>
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
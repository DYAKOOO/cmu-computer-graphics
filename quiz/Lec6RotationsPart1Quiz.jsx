'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, RotateCw } from 'lucide-react'

// Source: lectures/cg-06-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 6: 3D Rotations — Part 1 · QQ1–QQ32 · 32 questions (32 MCQ, 0 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-06-lecture-quiz.md 6

const quizData = [
  {
    id: 1,
    qid: `Q1`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `00:41`,
    question: `What defines a transformation as a rotation according to the lecture?`,
    options: [`The invariants that are preserved by the transformation`, `The specific matrix properties that form a rotation matrix`, `The mathematical formula used to compute the rotation`, `The axis of rotation and the angle of rotation`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [00:41]: "What is a rotation intuitively how do you know a rotation when you see it... transformations are not defined by some formula or matrix property but really they're defined by the invariants that are preserved by a transformation which quantities stay the same."`,
    code: ``,
    images: ["lec6_slide_02.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 2,
    qid: `Q2`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `01:08`,
    question: `What properties are preserved when applying a rotation?`,
    options: [`Coordinates of all points in the space`, `Lengths, distances, but not orientation`, `Orientation, but not lengths or distances`, `Lengths, distances, and orientation`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [01:08], the lecturer explains: "For rotations we said what we said that you know something is a rotation like this spinning book because for one thing lengths and distances are preserved... also orientation is preserved so text remains readable i can still read the text from left to right and it makes sense."`,
    code: ``,
    images: ["lec6_slide_02.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 3,
    qid: `Q3`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `01:47`,
    question: `What distinguishes a pure rotation from a rotation combined with a translation?`,
    options: [`A pure rotation fixes the origin (a center point remains fixed)`, `A pure rotation must occur around one of the principal axes`, `The angle of rotation must be less than 180 degrees`, `The speed at which the transformation is applied`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [01:47]: "When we use the word rotation we really mean something that fixes the origin right some center point remains fixed otherwise what we're doing is performing a rotation and a translation."`,
    code: ``,
    images: ["lec6_slide_02.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 4,
    qid: `Q4`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `02:15`,
    question: `How many degrees of freedom are there in 3D rotations?`,
    options: [`2 degrees of freedom`, `3 degrees of freedom`, `6 degrees of freedom`, `9 degrees of freedom`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [05:08], the lecturer concludes: "Hence we must have three degrees of freedom we have two degrees of freedom to take any point on the sphere to any other and for any such motion we have a whole family of rotations a third number we can specify."`,
    code: ``,
    images: ["lec6_slide_03.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 5,
    qid: `Q5`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `02:32`,
    question: `Why might someone initially think 3D rotations have three degrees of freedom?`,
    options: [`Because there are three coordinates (x, y, z) in 3D space`, `Because a rotation vector has three components`, `Because you can specify the angle of rotation around the x-axis, y-axis, and z-axis`, `Because a rotation matrix has three rows`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [02:32]: "One really natural idea that i think a lot of people gravitate toward is to say well it's got to be 3 because you specify the angle of rotation around the x-axis and around the y-axis and around the z-axis."`,
    code: ``,
    images: ["lec6_slide_03.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 6,
    qid: `Q6`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `03:22`,
    question: `What analogy does the lecturer use to explain the degrees of freedom in 3D rotations?`,
    options: [`Rotating the Earth to move cities to different positions`, `A gyroscope in motion`, `Rotating a cube in your hands`, `A spinning top on a table`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [03:22], the lecturer presents the analogy: "Let's imagine that we want to perform a rotation of the earth that takes our beautiful city of pittsburgh to another city let's say sao paulo."`,
    code: ``,
    images: ["lec6_slide_03.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 7,
    qid: `Q7`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `05:32`,
    question: `What is the relationship between 2D rotations regarding their order of application?`,
    options: [`2D rotations are commutative`, `2D rotations must be applied in a specific order to work correctly`, `2D rotations are associative but not commutative`, `2D rotations cannot be combined`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [06:43]: "We'd say that 2D rotations commute or if you want to be really fancy you could say 2D rotations are a billion [abelian]." This is after demonstrating that rotating by 40° then 20° gives the same result as rotating by 20° then 40°.`,
    code: ``,
    images: ["lec6_slide_04.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 8,
    qid: `Q8`,
    qtype: `RELATIONSHIP`,
    format: `mcq`,
    timestamp: `06:50`,
    question: `How do 3D rotations behave regarding their order of application?`,
    options: [`3D rotations do not commute; the order matters`, `3D rotations commute only when applied around the same axis`, `3D rotations always commute, like 2D rotations`, `3D rotations sometimes commute, depending on the angle`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [09:36], after the water bottle experiment, the lecturer confirms: "In 3D rotations really do not commute same rotations different order different result."`,
    code: ``,
    images: ["lec6_slide_04.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 9,
    qid: `Q9`,
    qtype: `IMPLEMENTATION`,
    format: `mcq`,
    timestamp: `07:13`,
    question: `What physical experiment does the lecturer suggest to demonstrate the non-commutativity of 3D rotations?`,
    options: [`Observing a rotating bicycle wheel`, `Throwing a ball in the air with spin`, `Spinning a toy gyroscope`, `Rotating a water bottle around different axes`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer describes at [07:19]: "Grab a water bottle then what we're going to do is associate a coordinate system with this water bottle" and then proceeds to describe rotating it around different axes in different orders.`,
    code: ``,
    images: ["lec6_slide_05.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 10,
    qid: `Q10`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `09:49`,
    question: `Why is understanding the non-commutativity of 3D rotations important in practical applications?`,
    options: [`It makes mathematical computations more elegant`, `It's required for computer graphics rendering`, `It's only relevant for theoretical physics`, `It can lead to serious errors in fields like aircraft control systems`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer warns at [09:49]: "If you imagine you're designing a control system for an aircraft or writing code involving rotations for some other thing that really happens in the world this can be a big deal you can get things very very wrong and cause a lot of trouble just by putting your rotations out of order."`,
    code: ``,
    images: ["lec6_slide_05.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 11,
    qid: `Q11`,
    qtype: `DERIVATION`,
    format: `mcq`,
    timestamp: `10:52`,
    question: `In deriving the 2D rotation matrix, what function does the lecturer define to help with the derivation?`,
    options: [`A function that takes a vector and returns its rotated version`, `A function that converts between coordinate systems`, `A function that computes the sine and cosine of an angle`, `A function s(θ) that gives the point on the circle after rotating counterclockwise by θ`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [10:52], the lecturer defines: "Let's imagine i have a function which for now i'll just call s of theta s of theta takes as input and angle theta and as output gives me the point x y on the circle that i get by going counterclockwise around the circle by theta starting at the x axis starting at e1."`,
    code: ``,
    images: ["lec6_slide_06.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 12,
    qid: `Q12`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `13:24`,
    question: `How are the columns of a 2D rotation matrix determined?`,
    options: [`They represent the sine and cosine of the rotation angle`, `They are arbitrary as long as they are orthogonal`, `They represent the rotated versions of the standard basis vectors`, `They are the eigenvectors of the rotation`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [13:24]: "The columns of the matrix must be equal to s of theta and s of theta plus [pi/2] because the columns are telling me what happened to the basis vectors e1 and e2."`,
    code: ``,
    images: ["lec6_slide_06.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 13,
    qid: `Q13`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `14:24`,
    question: `What are Euler angles as described in the lecture?`,
    options: [`A method that uses quaternions for 3D rotations`, `A way to represent rotations using complex numbers`, `A system that uses four parameters to represent rotations`, `A scheme where rotations are applied around the three principal axes x, y, and z`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer describes at [14:24]: "How do you think we express rotations in 3d well one idea is we know how to do rotations in 2d already so why don't we just simply apply rotations around the three axes x y and z and this is a scheme called euler angles."`,
    code: ``,
    images: ["lec6_slide_07.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 14,
    qid: `Q14`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `14:52`,
    question: `What is the primary advantage of Euler angles according to the lecture?`,
    options: [`They allow for smooth interpolation between rotations`, `They avoid all singularities in representing rotations`, `They're conceptually easy to understand`, `They provide the most efficient computations`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [14:52]: "The good things about euler angles are they're really really conceptually easy to understand that's it that's basically the only good thing about euler angles."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 15,
    qid: `Q15`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `15:18`,
    question: `What is gimbal lock as described in the lecture?`,
    options: [`When two rotation axes become perfectly aligned`, `When a rotation causes the system to lock up computationally`, `A phenomenon where changing certain Euler angles has no effect`, `A hardware failure in mechanical gyroscopes`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [15:31], the lecturer explains: "You're adjusting theta x theta y and theta z and then you reach a moment where everything locks up meaning you change the value of theta y and nothing happens or you change the value of theta z and nothing happens."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 16,
    qid: `Q16`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `16:02`,
    question: `What is the fundamental cause of gimbal lock?`,
    options: [`Approximation errors in floating-point calculations`, `The fundamental way rotations are parameterized by three Euler angles`, `A computational error in the rotation matrix calculation`, `The loss of a degree of freedom due to alignment of rotation axes`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [15:49]: "Actually gimple lock has to do with the fundamental way we've parameterized the rotations by these three euler angles." Further adding at [16:02]: "When you're using euler angles you might reach a configuration where there is no way to actually rotate around one of the three axes."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 17,
    qid: `Q17`,
    qtype: `ANALYSIS`,
    format: `mcq`,
    timestamp: `17:03`,
    question: `In the gimbal lock analysis, what special case does the lecturer examine?`,
    options: [`When all three Euler angles are equal`, `When all three Euler angles are zero`, `When theta x equals theta z`, `When theta y equals 90 degrees (π/2)`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [17:03], the lecturer states: "Let's consider a very special case where theta y is pi over 2 so we've rotated by a quarter turn around the y axis."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 18,
    qid: `Q18`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `18:46`,
    question: `What problematic situation arises in the gimbal lock example?`,
    options: [`The rotation becomes undefined mathematically`, `The rotation matrix becomes singular and cannot be inverted`, `The system requires more than three parameters to define the rotation`, `Two different parameters (theta x and theta z) only allow rotation around a single axis`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [18:46]: "Only the angles theta x and theta z show up right so this is a really funny situation we have these two different parameters these two different angles of rotation theta x and theta z but we only are able to rotate in one plane around one axis."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 19,
    qid: `Q19`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `19:20`,
    question: `What practical example does the lecturer give where gimbal lock could be problematic?`,
    options: [`Virtual reality headset tracking`, `Robot arm movement`, `Control of an airplane or fighter jet`, `Satellite orientation systems`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [19:20], the lecturer states: "This would be a really poor design for uh control of an airplane or or maybe some i don't know fighter jet or vehicle that really is supposed to be able to rotate in every possible direction."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 20,
    qid: `Q20`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `20:02`,
    question: `What alternative representation for 3D rotations does the lecturer mention after discussing Euler angles?`,
    options: [`Direction cosine matrices`, `Quaternions`, `Axis-angle representation`, `Rotation vectors`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [20:02], the lecturer introduces: "There is a general expression for a matrix that performs a rotation around a given axis u by an angle theta."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 21,
    qid: `Q21`,
    qtype: `MOTIVATION`,
    format: `mcq`,
    timestamp: `20:47`,
    question: `Why does the lecturer introduce complex numbers in the context of rotations?`,
    options: [`To make the mathematics more complicated`, `To prepare for quaternion algebra`, `As a way to encode geometric transformations in two dimensions`, `Because they're computationally faster than matrices`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [20:47]: "We want to use complex numbers not because we're doing algebra but because they're going to be a really nice way to encode geometric transformations in two dimensions."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 22,
    qid: `Q22`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `22:19`,
    question: `How does the lecturer ask students to think about complex numbers?`,
    options: [`As extensions of real numbers`, `As abstract mathematical objects defined by the square root of -1`, `As points on the complex plane`, `As ordinary two-dimensional vectors with additional operations`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [22:19], the lecturer emphasizes: "I really really want you to not think of these numbers as complex they're not special entities that are weird and different they're just ordinary two-dimensional vectors and we happen to be defining additional operations on these vectors."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 23,
    qid: `Q23`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `23:39`,
    question: `What approach to understanding complex numbers does the lecturer explicitly reject?`,
    options: [`The algebraic approach`, `The idea of i as the square root of -1`, `The vector space approach`, `The geometric approach`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states strongly at [23:39]: "I want you to completely forget this idea about i being the square root of negative one this is just gonna mess with your brain and more importantly it completely obscures the fact that the imaginary unit and complex numbers have a very very simple and very very intuitive geometric meaning."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 24,
    qid: `Q24`,
    qtype: `GEOMETRIC`,
    format: `mcq`,
    timestamp: `24:20`,
    question: `What geometric interpretation does the lecturer give for the imaginary unit i?`,
    options: [`A reflection across the x-axis`, `A scaling operation that doubles the length`, `A projection onto the y-axis`, `A quarter turn (90°) in the counterclockwise direction`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer defines at [24:20]: "The imaginary unit is just another name for a quarter turn in the counterclockwise direction."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 25,
    qid: `Q25`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `25:13`,
    question: `Why is i² equal to -1 according to the lecturer's geometric interpretation?`,
    options: [`Because the Euler formula dictates this relationship`, `Because of a fundamental algebraic property`, `Because applying the imaginary unit twice makes a half turn (180°)`, `Because complex numbers have special mathematical properties`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [25:55]: "I squared is equal to negative one why well because two quarter turns make a flip that's it."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 26,
    qid: `Q26`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `26:25`,
    question: `How does the lecturer describe complex numbers in terms of vector spaces?`,
    options: [`As one-dimensional vectors over the complex field`, `As two-dimensional vectors using bases named 1 and i instead of e₁ and e₂`, `As four-dimensional vectors with special properties`, `As extensions of real numbers with imaginary components`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [26:25], the lecturer states: "The only change we're going to make is that instead of using bases like i don't know e1 and e2 we're just going to give those bases different names we're just going to call them 1 and i they're literally just different names 1 is a pseudonym for e1 and i is a pseudonym for e2."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 27,
    qid: `Q27`,
    qtype: `GEOMETRIC`,
    format: `mcq`,
    timestamp: `28:28`,
    question: `What does complex multiplication do geometrically according to the lecture?`,
    options: [`It adds the angles and multiplies the magnitudes of the complex numbers`, `It reflects one vector across the other`, `It adds the real parts and multiplies the imaginary parts`, `It rotates one vector around the other`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [28:28]: "If i have two vectors in the plane z1 and z2 and i take their complex product then what's going to happen is the angles are going to add... and magnitudes multiply."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 28,
    qid: `Q28`,
    qtype: `FORMULA`,
    format: `mcq`,
    timestamp: `31:22`,
    question: `What is the formula for the product of two complex numbers z₁ = a + bi and z₂ = c + di in Cartesian coordinates?`,
    options: [`(ac + bd) + (ad - bc)i`, `(ac - bd) + (ad + bc)i`, `(a + c) + (b + d)i`, `(ac) + (bd)i`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [31:22], the lecturer derives: "We can write our final expression as ac minus bd that's the magnitude in the horizontal direction plus ad plus bci the magnitude in the vertical direction."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 29,
    qid: `Q29`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `33:09`,
    question: `What is Euler's formula as presented in the lecture?`,
    options: [`sin²(θ) + cos²(θ) = 1`, `e^(iθ) = i·sin(θ) - cos(θ)`, `e^(iθ) = cos(θ) + i·sin(θ)`, `e^(iπ) + 1 = 0`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [33:09], the lecturer states: "Euler's formula because it's named after this funny looking guy oiler by the way this is pronounced euler not euler which says that e to the i theta equals cosine theta plus i sine theta."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 30,
    qid: `Q30`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `34:04`,
    question: `How should e^(iθ) be interpreted according to the lecturer?`,
    options: [`As a rotation matrix in disguise`, `As a power series expansion`, `As a complex exponential function`, `As the point on the unit circle at angle θ from the x-axis`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer advises at [34:04]: "Whenever you see e to the i theta don't think about exponentials don't think about some power series you can just think about this as please give me the point on the circle theta away from the x-axis."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 31,
    qid: `Q31`,
    qtype: `COMPARISON`,
    format: `mcq`,
    timestamp: `38:20`,
    question: `What advantage does the lecturer highlight when comparing complex number representation with matrices for 2D rotations?`,
    options: [`Complex numbers lead to simpler expressions without trig identities`, `Complex numbers produce more accurate results`, `Complex numbers are computationally faster`, `Complex numbers work in higher dimensions`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [38:00], the lecturer states: "This was easier to do on pen and paper it's somehow easier conceptually there's no trig identities involved it's a much more compact expression."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
  },
  {
    id: 32,
    qid: `Q32`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `39:02`,
    question: `What is the lecturer's key principle regarding different mathematical representations?`,
    options: [`Matrices are generally better than other representations`, `Always use the simplest representation`, `Complex numbers should always be used for 2D problems`, `Identify which representation will help simplify and solve the problem at hand`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [39:02], the lecturer emphasizes: "The point is to be able to identify at any given moment which representation should you use which representation is going to really help you simplify and solve the problem at hand."`,
    code: ``,
    images: ["lec6_slide_32.png"],
    tags: [],
    source: `lectures/cg-06-lecture-quiz.md`,
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

export default function Lec6Part1Quiz() {
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
    accent: '#f472b6', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec6'
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
          <RotateCw size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 6: 3D Rotations — Part 1</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Euler angles, rotation matrices, quaternions, exponential maps</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-06-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec6/1`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec6/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
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
          <RotateCw size={20} /> Start Quiz
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
              <RotateCw size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 6: 3D Rotations — Part 1</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-06-lecture-quiz.md.</p>
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
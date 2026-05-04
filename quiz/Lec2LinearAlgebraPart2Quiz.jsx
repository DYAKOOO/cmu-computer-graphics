'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Grid } from 'lucide-react'

// Source: lectures/cg-02-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 2: Linear Algebra — Part 2 · QQ30–QQ61 · 32 questions (32 MCQ, 0 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-02-lecture-quiz.md 2

const quizData = [
  {
    id: 30,
    qid: `Q30`,
    qtype: `CALCULATION`,
    format: `mcq`,
    timestamp: `39:22`,
    question: `What is the Euclidean norm of the vector (4,2)?`,
    options: [`20`, `4.47...`, `6`, `2√5`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer calculates at [39:22]: "If i have the vector u equals 4 2 its norm is the square root of 4 squared plus 2 squared which we can simplify to 2 root 5."`,
    code: ``,
    images: ["image_1771901728304_0.png"],
    tags: [],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 31,
    qid: `Q31`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `40:22`,
    question: `What domain restriction is placed on functions when defining the L² norm?`,
    options: [`The functions must be defined over the unit interval [0,1]`, `The functions must be continuous`, `The functions must be periodic`, `The functions must be polynomials`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer specifies at [40:22]: "Just to keep things simple let's consider real valued functions over the unit interval 0 1. okay so by that i mean we have a function and we only know its values between 0 and 1 it doesn't exist outside of this interval."`,
    code: ``,
    images: ["image_1771901960791_0.png"],
    tags: ["Norm/L2", "definition"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 32,
    qid: `Q32`,
    qtype: `FORMULA`,
    format: `mcq`,
    timestamp: `40:59`,
    question: `What is the formula for the L² norm of a function f(x) on the unit interval?`,
    options: [`The maximum value of f(x) on [0,1]`, `The integral of f(x) from 0 to 1`, `The average value of f(x) on [0,1]`, `The square root of the integral of [f(x)]² from 0 to 1`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer defines at [40:59]: "The l2 norm is defined as the norm of f is equal to the square root of the integral from 0 to 1 of f of x squared dx."`,
    code: ``,
    images: ["image_1771901960791_0.png"],
    tags: [],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 33,
    qid: `Q33`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `41:14`,
    question: `How does the L² norm of a function relate to the Euclidean norm?`,
    options: [`The L² norm is a continuous analog of the Euclidean norm`, `The L² norm applies only to periodic functions`, `They are fundamentally different concepts`, `The Euclidean norm is always larger`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [41:14]: "The first thing to notice here is this really doesn't look much different from our definition of the euclidean norm for vectors in rn we have a square root we're squaring the value at each point and we're integrating over the interval."`,
    code: ``,
    images: ["image_1771902139443_0.png"],
    tags: [],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 34,
    qid: `Q34`,
    qtype: `NOTATION`,
    format: `mcq`,
    timestamp: `44:33`,
    question: `What notation convention does the lecture use to distinguish between the norm of a function and the norm of a vector?`,
    options: [`Double bars for both norms`, `Parentheses for vectors, brackets for functions`, `Single bars for both norms`, `Single bars for vectors, double bars for functions`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [44:33]: "Just as a note on notation for clarity we're going to use double bars for the norm of a function and single bars for the norm of a vector in rn."`,
    code: ``,
    images: ["image_1771902149002_0.png"],
    tags: ["Notation"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 35,
    qid: `Q35`,
    qtype: `PRACTICAL`,
    format: `mcq`,
    timestamp: `45:35`,
    question: `According to the lecture, how are most integrals in graphics actually calculated?`,
    options: [`Using numerical integration performed by a computer`, `By avoiding integration entirely`, `By simplifying to elementary functions`, `By hand using symbolic integration`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [45:35]: "You spend all this time i'm sorry to say learning how to do integrals by hand in your calculus classes and the reality is you're going to throw a lot of that away and let the computer do some kind of numerical integration for you."`,
    code: ``,
    images: ["image_1771902337361_0.png"],
    tags: [],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 36,
    qid: `Q36`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `46:16`,
    question: `What operation measures the relative direction or alignment between two vectors?`,
    options: [`Scalar multiplication`, `The Euclidean norm`, `The inner product`, `Vector addition`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [46:16]: "Just as the norm was the thing that measured length or magnitude the inner product is going to be the basic operation we're going to use to get our hands on direction or maybe relative direction how much does one vector line up with another vector in terms of orientation."`,
    code: ``,
    images: ["image_1771902353305_0.png"],
    tags: [],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 37,
    qid: `Q37`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `48:50`,
    question: `What key property of inner products means that ⟨u,v⟩ = ⟨v,u⟩?`,
    options: [`Transitivity`, `Associativity`, `Symmetry`, `Commutativity`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [48:50]: "One seemingly obvious property is that order shouldn't matter right that u inner product v should be the same as v inner product u." This is the symmetry property of inner products.`,
    code: ``,
    images: ["image_1771902497630_0.png"],
    tags: ["InnerProduct", "Property", "Symmetry"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 38,
    qid: `Q38`,
    qtype: `INTERPRETATION`,
    format: `mcq`,
    timestamp: `49:52`,
    question: `What geometric interpretation of the inner product is given for unit vectors u and v?`,
    options: [`The sine of the angle between them`, `The cosine of the angle between them`, `The area of the parallelogram they form`, `The length of the projection of v onto u`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [49:52]: "A geometric interpretation of the inner product is that it measures the extent of one vector along another the inner product of u and v is the length of the projection of v onto the vector u."`,
    code: ``,
    images: ["image_1771902587888_0.png"],
    tags: [],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 39,
    qid: `Q39`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `52:35`,
    question: `For a general vector u, what is the value of ⟨u,u⟩ in terms of its norm?`,
    options: [`The square root of the norm of u`, `Twice the norm of u`, `The norm of u`, `The square of the norm of u`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer concludes at [53:12]: "So we end up with just the norm of the vector squared."`,
    code: ``,
    images: ["image_1771905263430_0.png"],
    tags: ["Property"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 40,
    qid: `Q40`,
    qtype: `FORMULA`,
    format: `mcq`,
    timestamp: `54:49`,
    question: `What is the formula for the Euclidean inner product between two vectors u and v?`,
    options: [`The product of their norms`, `The sum of their norms`, `The maximum of their component products`, `The sum of the products of corresponding components`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer defines at [54:49]: "We're going to define the euclidean inner product as the sum over all the components of the product of corresponding components."

- ## Linear Algebra in Computer Graphics - Quiz Questions (Continued)`,
    code: ``,
    images: ["image_1771905251543_0.png"],
    tags: [],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 41,
    qid: `Q41`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `55:49`,
    question: `How is the L² inner product of two functions f and g defined?`,
    options: [`∫₀¹ [f(x) + g(x)] dx`, `∫₀¹ f(x)·g(x) dx`, `∫₀¹ |f(x) - g(x)| dx`, `∫₀¹ max(f(x), g(x)) dx`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer defines at [55:49]: "The l2 inner product of f and g denoted by these double angle brackets is the integral from 0 to 1 of f of x times g of x."
The fucntions are pointing in different direction`,
    code: ``,
    images: ["image_1771905297997_0.png"],
    tags: ["Function"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 42,
    qid: `Q42`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `57:33`,
    question: `Why is the choice of norm important in computer graphics applications?`,
    options: [`The choice of norm has little practical impact`, `It affects computation speed only`, `Most applications only work with the Euclidean norm`, `Different norms may capture different aspects that are relevant to specific applications`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [57:33]: "When it comes to things like computer graphics there are often many different completely reasonable ways to measure the norm and inner product for functions and the choice of inner product or the choice of norm is going to depend on the application."`,
    code: ``,
    images: ["image_1771905416860_0.png"],
    tags: ["Norm"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 43,
    qid: `Q43`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `58:31`,
    question: `What alternative measure might be better than the L² norm for finding "interesting" images?`,
    options: [`A norm based on image derivatives (edges)`, `The average pixel value`, `The L¹ norm`, `The maximum pixel value`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer suggests at [1:00:09]: "One thing we could do is we could look at the derivatives of the image...what we're measuring or what we're looking at here is from one pixel to the next how much does the value change. So we take the derivative in space of the image and then we take the l2 norm of that derivative."`,
    code: ``,
    images: ["image_1771905471888_0.png"],
    tags: ["Derivatives"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 44,
    qid: `Q44`,
    qtype: `COMPUTATIONAL`,
    format: `mcq`,
    timestamp: `1:02:16`,
    question: `Why are linear equations computationally appealing according to the lecture?`,
    options: [`They're easy to solve compared to nonlinear equations`, `They're always faster than quadratic equations`, `They require less memory`, `They're easier to debug`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [1:02:16]: "Computationally it's really easy to solve systems of linear equations as soon as you get to more sophisticated equations even quadratic equations things get computationally really really hard."`,
    code: ``,
    images: ["image_1771905532212_0.png"],
    tags: ["computation"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 45,
    qid: `Q45`,
    qtype: `GEOMETRIC`,
    format: `mcq`,
    timestamp: `1:04:02`,
    question: `Which transformation preserves straight lines according to the lecture?`,
    options: [`Affine transformation`, `Quadratic transformation`, `Linear transformation`, `Projective transformation`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:04:52], the lecturer identifies the linear map as the one where "the one on the top took took lines to line straight lines remain straight lines even if the image got skewed a little bit."`,
    code: ``,
    images: ["image_1771905578550_0.png"],
    tags: ["Transformation"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 46,
    qid: `Q46`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `1:05:31`,
    question: `What additional constraint must a linear map satisfy beyond preserving straight lines?`,
    options: [`It must fix the origin (send zero to zero)`, `It must preserve distances`, `It must be invertible`, `It must preserve angles`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer specifies at [1:05:24]: "That's almost a perfect definition of a linear map except for one important qualifier which is that a linear map has to fix the origin it has to send zero to zero."`,
    code: ``,
    images: ["image_1771905611884_0.png"],
    tags: ["Property", "Constraint"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 47,
    qid: `Q47`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `1:06:16`,
    question: `What are the two defining properties of a linear map?`,
    options: [`It preserves addition and scalar multiplication`, `It's differentiable and smooth`, `It preserves distances and angles`, `It's invertible and continuous`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [1:06:16]: "It has to be true that for all vectors u v and all scalars a we have f of u plus v is f of u plus f of v so the linear map distributes over addition f of a u is equal to a f u right and actually that's it it's just that those two properties." If it preserves vector space operations , if it preserves the structure of our vector space.`,
    code: ``,
    images: ["image_1771905943931_0.png"],
    tags: ["Abstract"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 48,
    qid: `Q48`,
    qtype: `VISUAL`,
    format: `mcq`,
    timestamp: `1:08:12`,
    question: `In the geometric picture of a linear map from R² to R³, how does the professor describe where a point u ends up?`,
    options: [`By projecting u onto the nearest point in R³`, `By multiplying u by a constant`, `By walking along a₁ by distance u₁ and along a₂ by distance u₂`, `By rotating u around the origin`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [1:08:12]: "I have my vector u in r2 it has components u1 u2 what is the linear map going to do well i have these two fixed vectors a1 and a2 and r3 and to see where u ends up i'm just going to walk along a1 by a distance u1 and i'm going to then walk along a2 by a distance u2."`,
    code: ``,
    images: ["image_1771906087371_0.png"],
    tags: [],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 49,
    qid: `Q49`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `1:09:47`,
    question: `Why is the function f(x) = ax + b NOT a linear function despite appearing as a line when graphed?`,
    options: [`Because a must equal 1 for linearity`, `Because it doesn't pass through the origin when b ≠ 0`, `Because it doesn't preserve vector operations`, `Because it's not defined for all real numbers`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer demonstrates at [1:10:13]: "A function like this ax plus b does not preserve the operations that we do on vectors for instance it's not going to preserve a sum." He then shows how f(x₁+x₂) ≠ f(x₁) + f(x₂).`,
    code: ``,
    images: ["image_1771906232801_0.png"],
    tags: ["Concept", "affine", "Operation"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 50,
    qid: `Q50`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `1:11:27`,
    question: `What is the term for a function f(x) = ax + b that shifts the origin?`,
    options: [`Quadratic function`, `Affine function`, `Homogeneous function`, `Linear function`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [1:11:27]: "This has a special name this form of function it's called an affine function rather than a linear function an affine function is like a linear function except it can shift the origin."

we can turn affine into linear using homogeneous coordinate.`,
    code: ``,
    images: ["image_1771906337124_0.png"],
    tags: ["definition", "affine"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 51,
    qid: `Q51`,
    qtype: `GEOMETRIC`,
    format: `mcq`,
    timestamp: `1:13:12`,
    question: `What is the geometric meaning of the span of two vectors u and v in R³?`,
    options: [`The entire 3D space`, `A line through the origin`, `A sphere with radius |u| + |v|`, `A plane through the origin containing u and v`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [1:13:12]: "Well what should really come to mind is a plane that contains u and v but doesn't contain the rest of three-dimensional space right a two-dimensional space in three-dimensional space containing u and v."`,
    code: ``,
    images: ["image_1771906776479_0.png"],
    tags: ["Geometry"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 52,
    qid: `Q52`,
    qtype: `RELATIONSHIP`,
    format: `mcq`,
    timestamp: `1:14:17`,
    question: `How does the concept of span relate to linear maps?`,
    options: [`The image of a linear map is the span of some collection of (fixed?) vectors`, `Linear maps can only be applied to spans of vectors`, `The span of vectors can only be calculated using linear maps`, `The span of vectors is unrelated to linear maps`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [1:14:17]: "We can say the image of any linear map is the span of some collection of vectors some fixed collection of vectors."`,
    code: ``,
    images: ["image_1771906873184_0.png"],
    tags: ["Relationship"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 53,
    qid: `Q53`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `1:15:36`,
    question: `What is a basis for Rⁿ?`,
    options: [`At least n vectors that span Rⁿ`, `Exactly n vectors that span Rⁿ`, `Any collection of n vectors`, `Any set of linearly independent vectors`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer defines at [1:15:36]: "If we have exactly n vectors e1 through en such that the span of all those vectors covers all of rn then we say that these vectors are a basis for rn. E is not valid becuase of linear independence"`,
    code: ``,
    images: ["image_1771907585425_0.png"],
    tags: ["Basis", "definition"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 54,
    qid: `Q54`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `1:19:01`,
    question: `What makes a basis orthonormal?`,
    options: [`The vectors are all unit length and mutually orthogonal`, `The vectors have different lengths`, `The vectors are all parallel`, `The vectors form right angles with the coordinate axes`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer defines at [1:19:01]: "More precisely an orthonormal basis means that you have a basis and all the vectors have unit length and they're all mutually orthogonal."
orthonormal basis is an additional requirement of a basis.

make sure you have an Orthonormal basis.`,
    code: ``,
    images: ["image_1771907823138_0.png"],
    tags: ["Property", "Orthonormal", "Basis"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 55,
    qid: `Q55`,
    qtype: `ALGORITHM`,
    format: `mcq`,
    timestamp: `1:21:28`,
    question: `What is the first step in the Gram-Schmidt process?`,
    options: [`Find the cross product of the vectors`, `Find the determinant of the matrix`, `Take the first vector and normalize it`, `Subtract any component of the first vector from the second one`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [1:21:28]: "What i'm going to do is i'm going to start with the first vector and just normalize it right so i take u1 and divide by its length to get e1."

There are better algorithm for floating points , one could be  .`,
    code: ``,
    images: ["image_1771907983116_0.png"],
    tags: ["GramSchmidt", "QRdecomposition", "FloatingPoint"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 56,
    qid: `Q56`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `1:24:38`,
    question: `What kind of functions can be expressed as a linear combination of sinusoids according to the lecture?`,
    options: [`2π-periodic functions`, `Exponential functions`, `Rational functions`, `Polynomial functions`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [1:24:38]: "Functions on the real line but that have a very very special property that they repeat at intervals of 2 pi so f of x is always going to be the same as f of x plus 2 pi is going to be the same as f of x plus 4 pi and so forth for these kinds of functions we can always express them as a linear combination of a special set of basis functions the sinusoids."`,
    code: ``,
    images: ["image_1771910523630_0.png"],
    tags: ["Fourier", "Transformation"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 57,
    qid: `Q57`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `1:27:15`,
    question: `How does the professor describe the Fourier transform in terms of linear algebra concepts?`,
    options: [`As projecting a function onto an orthonormal basis`, `As computing a determinant`, `As a matrix multiplication`, `As a vector decomposition`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [1:27:15]: "This is really the same as projecting a vector into rn onto an orthonormal basis that's all i'm doing when i'm decomposing an audio signal into different frequencies so this is the basic idea of a fourier decomposition or a fourier transform."

fourier transformation is a linear mapping from one basis to another.`,
    code: ``,
    images: ["image_1771910646476_0.png"],
    tags: ["Orthonormal", "map", "Linear"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 58,
    qid: `Q58`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `1:28:50`,
    question: `What is a system of linear equations?`,
    options: [`A basis for a vector space`, `A collection of vectors`, `A set of equations where the left side is a linear function and right side is a constant`, `A matrix with its eigenvalues`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer defines at [1:28:50]: "A system of linear equations is exactly what it sounds like it's a bunch of equations where the left hand side is a linear function and the right hand side is a constant."`,
    code: ``,
    images: ["image_1771910817273_0.png"],
    tags: ["Linear", "Equation", "DOF", "Constraint"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 59,
    qid: `Q59`,
    qtype: `EXISTENCE`,
    format: `mcq`,
    timestamp: `1:32:53`,
    question: `What geometric situation would lead to a linear system having no solution?`,
    options: [`When the system includes parallel lines that don't intersect`, `When the system has complex coefficients`, `When the system has more variables than equations`, `When all equations describe the same line`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [1:32:53]: "So if i have two parallel lines i want to find a point that's on both of those parallel lines sorry i'm out of luck no solution."`,
    code: ``,
    images: ["image_1771910990705_0.png"],
    tags: ["Model/Mental"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 60,
    qid: `Q60`,
    qtype: `UNIQUENESS`,
    format: `mcq`,
    timestamp: `1:33:48`,
    question: `When might a system of linear equations have many solutions?`,
    options: [`When it has more equations than variables`, `When the system is inconsistent`, `When the system includes non-linear terms`, `When some equations are redundant (describe the same constraint)`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [1:33:48]: "The other thing that you notice here is there could be examples where there are many solutions so it could be that two of my equations actually describe the same thing and i don't actually have a full set of equations that uniquely characterizes a solution."
, you need both uniqueness and existence properties.`,
    code: ``,
    images: ["image_1771911166794_0.png"],
    tags: ["uniqueness", "Existence", "Property"],
    source: `lectures/cg-02-lecture-quiz.md`,
  },
  {
    id: 61,
    qid: `Q61`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `1:36:11`,
    question: `According to the lecture, why can matrices interfere with understanding linear algebra?`,
    options: [`They obscure the geometric meaning with numerical procedures`, `They are too abstract for beginners`, `Matrices are too computationally intensive`, `They can't represent important linear algebra concepts`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [1:36:34]: "Matrices can really interfere with your understanding about what's going on geometrically you have these little blocks of numbers you have some rules for pushing the numbers around you have little algorithms for doing multiplication or computing a determinant or whatever it is but a lot gets lost in the fact that you have this numerical procedure but no real picture that it's associated with."`,
    code: ``,
    images: ["image_1771911672248_0.png"],
    tags: ["Concept", "System/Coordinate"],
    source: `lectures/cg-02-lecture-quiz.md`,
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

export default function Lec2Part2Quiz() {
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
    accent: '#818cf8', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec2'
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
          <Grid size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 2: Linear Algebra — Part 2</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Vectors, inner products, Gram-Schmidt, Fourier</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-02-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec2/1`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec2/2`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 2</a>
          <a key={3} href={`${BASE}/lec2/3`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 3</a>
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
          <Grid size={20} /> Start Quiz
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
              <Grid size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 2: Linear Algebra — Part 2</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-02-lecture-quiz.md.</p>
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
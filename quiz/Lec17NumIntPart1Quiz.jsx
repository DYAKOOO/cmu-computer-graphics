'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Hash } from 'lucide-react'

// Source: lectures/cg-17-lecture-quiz.md.md  (symlinked → Logseq pages)
// Lecture 17: Numerical Integration — Part 1 · QQF1–QQ29 · 32 questions (29 MCQ, 3 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-17-lecture-quiz.md.md 17

const quizData = [
  {
    id: 1,
    qid: `QF1`,
    qtype: `FLOW`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `The lecture opens by asking "how can we possibly evaluate the rendering equation?" What two properties of the rendering equation make analytical evaluation impossible, and what is the solution the lecture builds toward?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `(1) The integrand involves the rendering equation itself (recursive) — the radiance arriving from direction ωᵢ depends on another surface, which requires evaluating the rendering equation again. (2) The BRDF and scene geometry are arbitrary — no closed-form antiderivative exists. The solution is Monte Carlo integration: randomly sample the hemisphere of incoming directions, evaluate the integrand at those samples, average. The Central Limit Theorem guarantees convergence as sample count grows.`,
    intuition: `"Area under curve" becomes "average value of random samples." Randomness is a feature, not a bug.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 2,
    qid: `QF2`,
    qtype: `FLOW`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `The lecture introduces both deterministic quadrature (midpoint/trapezoid/Simpson's rule) and Monte Carlo integration. What fundamental advantage does Monte Carlo have for high-dimensional integrals like the rendering equation?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `Deterministic quadrature in d dimensions requires n^d function evaluations to achieve n-point accuracy per dimension — exponential in d. Monte Carlo converges at O(1/√n) regardless of dimension. The rendering equation integrates over a hemisphere (2D), but accounting for recursive bounces and participating media, the effective dimensionality is very high. Monte Carlo's dimension-independence makes it the only scalable approach.`,
    intuition: `"Curse of dimensionality" kills quadrature; Monte Carlo is immune to dimension count.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 3,
    qid: `QF3`,
    qtype: `ORDER`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `Put these numerical integration ideas in the order lecture 17 introduces them: importance sampling / Monte Carlo with uniform random samples / deterministic quadrature rules / fundamental theorem of calculus (why analytical integration is hard here)`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `Fundamental theorem of calculus → Deterministic quadrature rules → Monte Carlo with uniform random samples → Importance sampling`,
    intuition: `The lecture starts by showing why the easy solution (calculus) doesn't work, proposes a structured but limited approach (quadrature), then replaces it with randomness (Monte Carlo), then improves that (importance sampling).`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 1,
    qid: `Q1`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `00:00`,
    question: `What is Professor Keenan Crane describing when he says this is "an extremely important subject not only in computer graphics but across lots of different areas of computer science and scientific computing"?`,
    options: [`Numerical integration`, `Differential equations`, `Machine learning algorithms`, `Computer architecture`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [00:06], the professor states: "Today we're going to talk about a extremely important subject not only in computer graphics but across lots of different areas of computer science and scientific computing which is numerical integration."`,
    code: ``,
    images: ["lec17_slide_01.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 2,
    qid: `Q2`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `00:30`,
    question: `What is the primary motivation for studying numerical integration in this lecture?`,
    options: [`Creating procedural animation systems`, `Solving the rendering equation for photorealistic rendering`, `Developing new hardware architectures`, `Improving computational speed in big data applications`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [00:40], the professor explains: "Our motivation of course is going to come from an important problem in computer graphics that we've been talking about those last few lectures which is photorealistic rendering. So last time we talked specifically about the rendering equation."`,
    code: ``,
    images: ["lec17_slide_01.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 3,
    qid: `Q3`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `00:49`,
    question: `How does Professor Crane describe the rendering equation?`,
    options: [`A combinatorial optimization problem`, `A system of linear equations`, `A recursive integral equation`, `A differential equation with boundary conditions`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [00:49], the professor characterizes the rendering equation as "a recursive integral equation" which is why numerical integration techniques are necessary to solve it.`,
    code: ``,
    images: ["lec17_slide_02.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 4,
    qid: `Q4`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `01:13`,
    question: `According to the lecture, which of the following is NOT mentioned as a quantity in graphics that is expressed as an integral?`,
    options: [`Total brightness in rendering`, `Brightness hitting a pixel`, `Total area`, `Pixel color saturation`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [01:13], the professor lists: "In general in graphics many of the quantities who are interested in are naturally expressed as integrals we might be talking about the total brightness as we do in rendering we might be talking about even in imaging the total brightness hitting a pixel we might be talking about total area total curvature." Pixel color saturation is not mentioned.`,
    code: ``,
    images: ["lec17_slide_03.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 5,
    qid: `Q5`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `01:40`,
    question: `Why do we need numerical methods for integration in computer graphics?`,
    options: [`They provide exact solutions for all integrals`, `They're required by graphics hardware`, `They're easier to understand than analytical methods`, `Many integrals in graphics cannot be integrated analytically`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [01:57], the professor explains: "What you discover very quickly when you start doing real problems in computer graphics computer vision in scientific computing simulation and so forth you'll f==ind that most integrals cannot be integrated in this way [analytically].== There either are no closed-form expressions for the integral or there so ridiculously hard to come up with or write down that it's not worth the trouble."
-`,
    code: ``,
    images: ["image_1745943567576_0.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 6,
    qid: `Q6`,
    qtype: `IMPLEMENTATION`,
    format: `mcq`,
    timestamp: `02:38`,
    question: `What is the basic approach to numerical integration described in the lecture?`,
    options: [`Using symbolic computation to derive exact solutions`, `Applying Fourier transforms to simplify the problem`, `Sampling the function at points and taking a weighted sum`, `Converting integrals to differential equations`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [03:27], the professor describes the approach: "We're going to sample the function that we want to integrate at a bunch of points and then Express the integral as a weighted sum of these columns by the values of the function at each point."`,
    code: ``,
    images: ["lec17_slide_03.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 7,
    qid: `Q7`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `04:00`,
    question: `In the context of rendering, what does integration represent?`,
    options: [`The depth buffer calculation`, `The total light arriving from all directions`, `The rotation of 3D objects`, `The texture mapping process`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [04:12], the professor explains the integration in rendering: "We can come back instead to this picture of sitting at a point on the ground here we're sitting at a point underneath this car and looking up and seeing that there's light coming in from different directions in different quantities and we just want to know what is the total arriving light."
-`,
    code: ``,
    images: ["image_1745943516851_0.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 8,
    qid: `Q8`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `04:48`,
    question: `What are the two primary ways to interpret an integral as presented in the lecture?`,
    options: [`As a convergent series and as a differential equation`, `As a polynomial approximation and as a Taylor series`, `As a power series and as a Fourier transform`, `As area under a curve and as average value times domain size`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [04:55] and [05:21], the professor presents two interpretations: "The integral is the area under the curve" and "Another helpful way of thinking about an integral just slightly different rather than thinking about these this as the area under the curve we could think about this as the average value of the function over the interval from A to B times the size of the domain."`,
    code: ``,
    images: ["lec17_slide_03.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 9,
    qid: `Q9`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `06:12`,
    question: `What does the fundamental theorem of calculus state according to the lecture?`,
    options: [`All continuous functions are integrable`, `If you integrate the derivative of a function, you get the ending value minus the beginning value`, `The integral is the limit of a Riemann sum`, `Integration and differentiation are inverse operations`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [06:19], the professor states: "What is the fundamental theorem of calculus say it just says in essence if I integrate the derivative of a function then the value at the end minus the value at the beginning is the integral."
-`,
    code: ``,
    images: ["image_1745945014999_0.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 10,
    qid: `Q10`,
    qtype: `CALCULATION`,
    format: `mcq`,
    timestamp: `07:25`,
    question: `What is the integral of a constant function C from A to B equal to?`,
    options: [`C(B - A)`, `C/2(B - A)`, `C(B² - A²)`, `C²(B - A)`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [07:39], the professor states: "What is this integral equal to? Well just the area of this rectangle right B minus a times C."
-`,
    code: ``,
    images: ["image_1745944811489_0.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 11,
    qid: `Q11`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `07:47`,
    question: `What is an affine function as described in the lecture?`,
    options: [`A function of the form f(x) = x²`, `A function of the form f(x) = e^x`, `A function of the form f(x) = cx + d`, `A function of the form f(x) = sin(x)`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [07:47], the professor defines: "Little more interesting is an affine function f of X equals CX plus D."`,
    code: ``,
    images: ["lec17_slide_03.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 12,
    qid: `Q12`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `08:46`,
    question: `What special property of affine functions makes them easy to integrate?`,
    options: [`They have zero second derivatives`, `They can always be differentiated`, `They can be integrated by sampling at just a single point`, `They are always bounded`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [08:46], the professor explains: "One thing that's really nice about affine functions is that we can compute the integral by just sampling the function at a single point we only need to know the value of the function at a single point if we know it's a fine."
-`,
    code: ``,
    images: ["image_1745945576592_0.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 13,
    qid: `Q13`,
    qtype: `FORMULA`,
    format: `mcq`,
    timestamp: `09:17`,
    question: `What formula does the professor give for the integral of an affine function from a to b?`,
    options: [`f((a + b)/2)(b - a)`, `(f(a) + f(b))/2 × (b - a)`, `(f(b) - f(a))/(b - a)`, `(f(a) + f(b))(b - a)`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [09:17], the professor gives the formula: "The average value of f between a and B is just 1/2 F of a plus F of B which means our integral is equal to 1/2 F of a plus F of B times B minus a."
-`,
    code: ``,
    images: ["image_1745945220575_0.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 14,
    qid: `Q14`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `10:17`,
    question: `What is Gauss quadrature as described in the lecture?`,
    options: [`A technique for differentiating complex functions`, `A strategy for exactly integrating polynomials by sampling at special points`, `A method for solving differential equations`, `A technique for approximating functions as polynomials`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [10:30], the professor explains: "For a polynomial of any degree n we can always obtain the exact integral of the polynomial by sampling the function at a special set of endpoints and taking a weighted combination."
- {:height 383, :width 535}`,
    code: ``,
    images: ["image_1745943229545_0.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 15,
    qid: `Q15`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `11:10`,
    question: `What is a quadrature rule as defined in the lecture?`,
    options: [`A technique for interpolating between data points`, `A method for solving partial differential equations`, `A strategy for approximating an integral by sampling at points and taking a weighted combination`, `A rule for differentiating functions`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [11:10], the professor defines: "This is our first instance of what's called a quadrature rule a strategy for approximating a function by sampling it at a finite set of points taking a weighted combination of those sample values and adding them up."`,
    code: ``,
    images: ["lec17_slide_11.png"],
    tags: ["Rule/Quadrature"],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 16,
    qid: `Q16`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `11:51`,
    question: `What is a piecewise affine function according to the lecture?`,
    options: [`A function with an infinite number of discontinuities`, `A function that is affine when restricted to sub-intervals`, `A function that is always continuous`, `A function composed of multiple polynomial pieces`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [11:51], the professor defines: "Piecewise affine just means over little sub intervals the function is afline." Gauss quadrature doesn't work.
-`,
    code: ``,
    images: ["image_1745943955511_0.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 17,
    qid: `Q17`,
    qtype: `STRATEGY`,
    format: `mcq`,
    timestamp: `12:52`,
    question: `What is the strategy for integrating a piecewise affine function?`,
    options: [`Convert it to a continuous function first`, `Sum up the integral of each piece separately`, `Use a Taylor series expansion`, `Apply the trapezoidal rule to the entire domain`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [12:58], the professor explains: "For a piecewise function for a piecewise defined function we can just sum up the integral of each piece just think of these in this case as four separate integrals."
-`,
    code: ``,
    images: ["image_1745945458082_0.png"],
    tags: ["function/affine"],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 18,
    qid: `Q18`,
    qtype: `FORMULA`,
    format: `mcq`,
    timestamp: `13:17`,
    question: `What formula is used to integrate a single affine piece of a piecewise affine function?`,
    options: [`(f(xi) × f(xi+1)) × (xi+1 - xi)`, `(f(xi) + f(xi+1))/2 × (xi+1 - xi)`, `f(xi) × (xi+1 - xi)`, `(f(xi+1) - f(xi))/(xi+1 - xi)`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [13:17], the professor gives the formula: "F of X I plus f of X I plus 1 / 2 and we multiply by the size of that little interval X I plus 1 - X I."
-`,
    code: ``,
    images: ["image_1745945088993_0.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 19,
    qid: `Q19`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `14:20`,
    question: `According to the lecture, what two pieces of information are needed to approximate an integral?`,
    options: [`The domain and range of the function`, `The error bounds and convergence rate`, `The function's derivative and second derivative`, `The quadrature points and the associated weights`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [14:26], the professor states: "The key idea so far is that whenever we want to approximate an integral we're gonna need two pieces of information we need to know what are the quadrature points where do we want to sample the function and two what are the weights that we associate with these sample values."
-`,
    code: ``,
    images: ["image_1745944949377_0.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 20,
    qid: `Q20`,
    qtype: `IMPLEMENTATION`,
    format: `mcq`,
    timestamp: `16:17`,
    question: `What is the trapezoid rule as described in the lecture?`,
    options: [`An approach that requires evaluating the function at its critical points`, `A method that requires knowing the function's derivative`, `A technique that uses second-order Taylor expansions`, `An approximation that uses a piecewise affine function to interpolate sample points`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [16:23], the professor explains: "We can say well I don't know exactly how to integrate this function but I can always approximate it by a piecewise affine function I can always pretend that the function I'm integrating is piecewise affine. How do I do that well I just pick some intervals and I sample the function at the end points of the intervals I connect those sample values by straight lines."`,
    code: ``,
    images: ["lec17_slide_16.png"],
    tags: ["Rule/Trapezoid"],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 21,
    qid: `Q21`,
    qtype: `ANALYSIS`,
    format: `mcq`,
    timestamp: `17:54`,
    question: `What is the computational cost (work) of the trapezoid rule as a function of the number of intervals n?`,
    options: [`O(log n)`, `O(n²)`, `O(n)`, `O(n log n)`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [18:28], the professor states: "In this case it's pretty easy to see that the work required is order n for every interval that we use in our approximation we have to evaluate the function f once."`,
    code: ``,
    images: ["lec17_slide_17.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 22,
    qid: `Q22`,
    qtype: `ERROR`,
    format: `mcq`,
    timestamp: `19:05`,
    question: `What is the error rate of the trapezoid rule as a function of the interval size h?`,
    options: [`O(h⁴)`, `O(h)`, `O(h³)`, `O(h²)`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [19:05], the professor explains: "The error in our integral if we assume that F is a pretty nice function a pretty nice smooth function no pathological behavior then without much work you can show that the error in the approximation is order H squared."
- #+BEGIN_IMPORTANT
as the number of samples or inputs  grows , how quikcly the error goes to zero . this is opposite of o(n) rotation for algorithms.
#+END_IMPORTANT
-`,
    code: ``,
    images: ["image_1745944212062_0.png"],
    tags: ["Rule/Trapezoid"],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 23,
    qid: `Q23`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `19:37`,
    question: `How does the professor describe the relationship between work and error in the trapezoid rule?`,
    options: [`Quadratic work gives a linear decrease in error`, `Linear work gives a quadratic decrease in error`, `Quadratic work gives a quadratic decrease in error`, `Linear work gives a linear decrease in error`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [19:37], the professor states: "So we did a linear amount of work we got a quadratic decrease in error."`,
    code: ``,
    images: ["lec17_slide_17.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 24,
    qid: `Q24`,
    qtype: `IMPLEMENTATION`,
    format: `mcq`,
    timestamp: `20:30`,
    question: `How does the lecture describe the approach to integrating a function of two variables?`,
    options: [`Converting it to a single variable function first`, `Using a specialized 2D quadrature rule`, `Using Monte Carlo integration`, `Applying the trapezoid rule twice, once in each dimension`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [21:08], the professor explains: "We can just apply the same rule we did before twice right we can think of if we think of the function f of XY as actually a function where we can fix one of the arguments."
-`,
    code: ``,
    images: ["image_1745943642705_0.png", "image_1745943653679_0.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 25,
    qid: `Q25`,
    qtype: `COMPUTATIONAL`,
    format: `mcq`,
    timestamp: `23:41`,
    question: `What is the computational cost of applying the trapezoid rule to a 2D function?`,
    options: [`O(n log n)`, `O(n)`, `O(n²)`, `O(n³)`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [23:41], the professor states: "The work that we're doing is of course much larger rather than just taking a bunch of samples along a line where we have order n samples we're taking n samples in one direction times n samples in another direction gives us order N squared work."`,
    code: ``,
    images: ["lec17_slide_20.png"],
    tags: ["Rule/Trapezoid"],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 26,
    qid: `Q26`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `29:22`,
    question: `What is the convergence rate of Monte Carlo integration error according to the lecture?`,
    options: [`O(n⁻¹)`, `O(log n)`, `O(n⁻¹/²)`, `O(n⁻²)`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [29:22], the professor explains: "The amount of error is going to depend only on the number the total number of random samples that we use it's going to go like 1 over square root of n so this should say order n to the minus 1/2."
-`,
    code: ``,
    images: ["image_1745945397236_0.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 27,
    qid: `Q27`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `30:22`,
    question: `How does the professor define a random variable in the lecture?`,
    options: [`As a variable with unknown value`, `As an input to a stochastic process`, `As a distribution of possible values that a variable could take`, `As a function that returns unpredictable results`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [30:22], the professor defines: "A random variable which in this case we'll call X represents in some sense a distribution of possible or potential values that that variable could take."
-`,
    code: ``,
    images: ["image_1745943713032_0.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 28,
    qid: `Q28`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `31:49`,
    question: `What characterizes a discrete probability distribution according to the lecture?`,
    options: [`It must follow a normal distribution`, `It has a finite number of possible values`, `It must be uniformly distributed`, `It has an infinite number of possible values`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [31:57], the professor explains: "This example of the die is an example of what's called a discrete probability distribution it means we have a finite number of possible values that our random variable can take and we'll call those little X sub I and we say that little X sub I is gonna occur with probability little P sub I."`,
    code: ``,
    images: ["lec17_slide_23.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
  },
  {
    id: 29,
    qid: `Q29`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `33:39`,
    question: `What example does the lecture use to illustrate a discrete probability distribution?`,
    options: [`An unbiased die`, `Pixel positions`, `Light intensity values`, `Temperature measurements`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [31:01], the professor gives this example: "A very simple example is I have a single unbiased die right so little cube with numbers 1 through 6 on it there's no funny waiting nothing tricky going on here if I roll that die then it's gonna randomly take one of the six values one through six all with equal probability."`,
    code: ``,
    images: ["lec17_slide_24.png"],
    tags: [],
    source: `lectures/cg-17-lecture-quiz.md.md`,
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

export default function Lec17Part1Quiz() {
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

  const STORE = 'quiz_lec17'
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
          <Hash size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 17: Numerical Integration — Part 1</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Quadrature, Monte Carlo integration, importance sampling</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-17-lecture-quiz.md.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec17/1`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec17/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
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
          <Hash size={20} /> Start Quiz
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
              <Hash size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 17: Numerical Integration — Part 1</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-17-lecture-quiz.md.md.</p>
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
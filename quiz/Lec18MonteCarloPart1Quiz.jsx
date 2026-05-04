'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Crosshair } from 'lucide-react'

// Source: lectures/cg-18-lecture-quiz.md.md  (symlinked → Logseq pages)
// Lecture 18: Monte Carlo Ray Tracing — Part 1 · QQF1–QQ29 · 32 questions (29 MCQ, 3 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-18-lecture-quiz.md.md 18

const quizData = [
  {
    id: 1,
    qid: `QF1`,
    qtype: `FLOW`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `The lecture identifies two key differences between ray tracing and rasterization. What are they, and why do those differences make ray tracing better for photorealism but worse for real-time performance?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `(1) Loop order: rasterization iterates primitives → samples (easy to batch-process geometry on GPU); ray tracing iterates samples → primitives (each ray independently queries all geometry). (2) Illumination model: rasterization uses local shading (one primitive at a time, hard to access other geometry); ray tracing uses global shading (each ray knows the full scene, enabling shadows, reflections, indirect light). The global nature requires expensive BVH traversal per ray — orders of magnitude slower than rasterization for the same scene.`,
    intuition: `Ray tracing trades speed for the ability to ask "what does the rest of the scene look like from here?"`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 2,
    qid: `QF2`,
    qtype: `FLOW`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `Lecture 18 claims to "put together many ideas we've studied." Trace the chain: which prior-lecture topics does a single path-traced pixel sample depend on?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `(1) Spatial data structures (BVH, lecture 13) — to find which geometry the ray hits. (2) Geometry / transformations (lec 5-9) — to represent and transform the scene. (3) Color + radiometry (lec 14-15) — to define what "light" means and what quantity to track. (4) The rendering equation (lec 16) — to know what integral to estimate at each surface. (5) Numerical integration / Monte Carlo (lec 17) — to estimate that integral with random samples. (6) BRDFs — to scatter the ray at surfaces and importance-sample directions.`,
    intuition: `Monte Carlo ray tracing is not one algorithm — it's the combination of every prior algorithm in the course.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 3,
    qid: `QF3`,
    qtype: `ORDER`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `Put these steps of a single path-traced sample in execution order: evaluate BRDF and scatter the ray to the next bounce / generate primary ray from camera through pixel / test ray against scene geometry using BVH / evaluate direct illumination via shadow ray to a light source`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `Generate primary ray from camera through pixel → Test ray against scene geometry using BVH → Evaluate direct illumination via shadow ray → Evaluate BRDF and scatter ray to next bounce`,
    intuition: `Camera → scene → light → scatter. Each step builds on the intersection point found by the previous step.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 1,
    qid: `Q1`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `00:10`,
    question: `What is the primary goal of Monte Carlo rendering according to the lecture?`,
    options: [`To generate photorealistic images`, `To generate images as quickly as possible`, `To simulate camera optics`, `To optimize mesh geometry`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [00:10]: "Welcome to computer graphics today we're gonna talk about Monte Carlo rendering so we're really getting to this final core question of how do we render how do we generate photorealistic images."`,
    code: ``,
    images: ["lec18_slide_02.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 2,
    qid: `Q2`,
    qtype: `COMPARISON`,
    format: `mcq`,
    timestamp: `01:36`,
    question: `What is the main trade-off of Monte Carlo rendering compared to rasterization?`,
    options: [`Simplicity versus scalability`, `Image quality versus speed`, `Flexibility versus portability`, `Memory usage versus computation time`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [01:36], the lecturer explains: "The benefit of doing Monte Carlo rendering is we can generate things that are a lot more realistic a lot more like a photograph usually at much greater cost right so we have a big quality versus speed trade-off."`,
    code: ``,
    images: ["lec18_slide_02.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 3,
    qid: `Q3`,
    qtype: `INPUT`,
    format: `mcq`,
    timestamp: `01:56`,
    question: `What are the required inputs for a photorealistic rendering algorithm?`,
    options: [`Only a scene description file`, `Mesh geometry, animation, and shader code`, `Only mesh geometry and a camera`, `Geometry, materials, lights, and a camera`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer describes at [01:56]: "The inputs are going to be a complete description of the scene so not just the geometry of the scene not just where things are but also what material each object is made out of also a set of light sources and some description of how they emit light right in which directions in which colors and so forth and also a camera."`,
    code: ``,
    images: ["lec18_slide_03.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 4,
    qid: `Q4`,
    qtype: `ALGORITHM`,
    format: `mcq`,
    timestamp: `03:27`,
    question: `What fundamental algorithmic difference exists between rasterization and ray tracing?`,
    options: [`Ray tracing simulates physical light, rasterization doesn't`, `Rasterization is always hardware accelerated, ray tracing isn't`, `The order in which they process samples (primitives first vs. samples first)`, `Ray tracing operates only on triangles, rasterization works with any primitive`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [03:27]: "From an algorithmic point of view one basic difference is the order in which we do our computation the order in which we process samples." He then explains that rasterization loops over primitives first, while ray tracing loops over samples (pixels) first.`,
    code: ``,
    images: ["lec18_slide_04.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 5,
    qid: `Q5`,
    qtype: `VISUAL`,
    format: `mcq`,
    timestamp: `07:19`,
    question: `Which visual effect is notably missing in the rasterized image compared to the ray traced image?`,
    options: [`Motion blur`, `Texture mapping`, `Shadows`, `Color correction`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [07:19], the lecturer points out: "There are no shadows in the image on the left and that makes it really hard to determine for instance how far above the plane these objects are."`,
    code: ``,
    images: ["lec18_slide_05.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 6,
    qid: `Q6`,
    qtype: `ILLUMINATION`,
    format: `mcq`,
    timestamp: `07:48`,
    question: `Besides shadows, reflections, and transparency, what other illumination effect is present in ray tracing but not basic rasterization?`,
    options: [`Depth of field`, `Lens flare`, `Indirect illumination`, `Ambient occlusion`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer mentions at [07:48]: "There are other more subtle things going on we'll talk about indirect illumination the image on the right is just slightly brighter than the one on the left due to light bouncing around the scene and eventually entering the camera."`,
    code: ``,
    images: ["lec18_slide_05.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 7,
    qid: `Q7`,
    qtype: `INTEGRATION`,
    format: `mcq`,
    timestamp: `09:25`,
    question: `What mathematical technique must be applied to the rendering equation to develop a full-blown photorealistic ray tracer?`,
    options: [`Singular value decomposition`, `Monte Carlo integration`, `Numerical differentiation`, `Finite element analysis`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [09:25], the lecturer states: "To develop a full-blown photorealistic ray tracer, will need to apply Monte Carlo integration to the rendering equation."`,
    code: ``,
    images: ["lec18_slide_06.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 8,
    qid: `Q8`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `10:12`,
    question: `In the context of Monte Carlo rendering, what constitutes a "sample"?`,
    options: [`A whole path of light from source to camera`, `A point on a 3D model's surface`, `A single pixel in the output image`, `A single ray shot from the camera`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [10:12]: "When we talk about a sample in this context if we're really thinking about this whole picture of light traveling from light sources to the camera a single sample is actually a whole path of light."`,
    code: ``,
    images: ["lec18_slide_06.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 9,
    qid: `Q9`,
    qtype: `EQUATION`,
    format: `mcq`,
    timestamp: `10:30`,
    question: `In the rendering equation, what does the left side of the equation represent?`,
    options: [`The amount of light being absorbed by a point`, `The amount of light leaving a point in a certain direction`, `The amount of light being emitted from a point`, `The amount of light being reflected off a point`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [10:42], the lecturer explains: "This something on the left is how much illumination how much radiance is leaving the point P in the direction of Omega naught."`,
    code: ``,
    images: ["lec18_slide_06.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 10,
    qid: `Q10`,
    qtype: `COMPONENTS`,
    format: `mcq`,
    timestamp: `10:56`,
    question: `What are the two terms on the right side of the rendering equation?`,
    options: [`Reflection and refraction`, `Emission and reflection`, `Direct and indirect illumination`, `Specular and diffuse components`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [10:56]: "The two terms on the right are how much light is being emitted from that point plus how much light was getting reflected off that point."`,
    code: ``,
    images: ["lec18_slide_51.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 11,
    qid: `Q11`,
    qtype: `ADVANTAGE`,
    format: `mcq`,
    timestamp: `12:51`,
    question: `What are two advantages of Monte Carlo integration mentioned in the lecture?`,
    options: [`Mathematical elegance and analytical solutions`, `Low memory usage and parallelization potential`, `Fast convergence and deterministic results`, `Works in any scenario and avoids the curse of dimensionality`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [12:51], the lecturer explains: "The cool thing about Monte Carlo is it works in basically any scenario you can throw at it the other cool thing that we saw about Monte Carlo is it gets around the so-called curse of dimensionality."`,
    code: ``,
    images: ["lec18_slide_51.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 12,
    qid: `Q12`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `14:52`,
    question: `What is the "expected value" of a random variable?`,
    options: [`The median of all possible values`, `The most common value it takes`, `The highest possible value it can take`, `The value it takes on average`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [14:52]: "Basic concept in probability is the expected value the intuitive idea to remember whenever somebody says expected value is what value does the random variable take on average if I keep getting values out of this random variable what will the average value be."`,
    code: ``,
    images: ["lec18_slide_51.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 13,
    qid: `Q13`,
    qtype: `CALCULATION`,
    format: `mcq`,
    timestamp: `16:22`,
    question: `What is the expected value of a fair coin flip where heads=1 and tails=0?`,
    options: [`1`, `0.5`, `2`, `0`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer calculates at [16:22]: "The expected value is then going to be just the sum of the probability of landing heads times 1 plus the probability of landing tails times 0 1/2 times 1 plus 1/2 times 0 is 1/2."`,
    code: ``,
    images: ["lec18_slide_51.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 14,
    qid: `Q14`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `16:41`,
    question: `Which of the following is a property of expected value?`,
    options: [`The expected value is always the median value`, `The expected value of a sum equals the sum of the expected values`, `The expected value is always positive`, `The expected value of a product equals the product of the expected values`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [16:41], the lecturer states: "Important properties of expectation one is that it's linear so if I take the expected value of a sum of random variables that's the same as the sum of the expected values of those random variables."`,
    code: ``,
    images: ["lec18_slide_51.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 15,
    qid: `Q15`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `17:32`,
    question: `What does the "variance" of a random variable measure?`,
    options: [`How much the random variable is affected by other variables`, `How much the random variable changes over time`, `How much the random variable deviates from its average value`, `How much the random variable deviates from zero`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [17:32]: "The intuition the thing to remember when somebody says variance is how far off is our random variable from its average on average how much does it deviate from average."
- # Monte Carlo Rendering Quiz - Part 2
- ## QUESTIONS (continued):`,
    code: ``,
    images: ["lec18_slide_51.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 16,
    qid: `Q16`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `19:22`,
    question: `When comparing two probability distributions, which typically has higher variance?`,
    options: [`The distribution with the most values`, `The distribution with the highest peak`, `The distribution with more uniform probabilities`, `The distribution with less uniform probabilities`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [21:13]: "On the other hand in the example on the right the probabilities are nearly uniform so the values that are coming up are spread out all over the place and so on average they're going to be far from their average so the distribution on the right the random variable on the right has higher variance."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 17,
    qid: `Q17`,
    qtype: `FORMULA`,
    format: `mcq`,
    timestamp: `21:42`,
    question: `What alternative formula can be used to calculate the variance of a random variable Y?`,
    options: [`E[Y²] - (E[Y])²`, `E[Y] - (E[Y²])`, `E[Y] × E[Y²]`, `E[Y²] + (E[Y])²`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [21:42], the lecturer states: "The variance of a random variable Y is equal to the expected value of the square of that variable minus the square of its expected value."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 18,
    qid: `Q18`,
    qtype: `THEOREM`,
    format: `mcq`,
    timestamp: `22:32`,
    question: `According to the Law of Large Numbers, what happens as we take more and more samples?`,
    options: [`The probability distribution becomes more uniform`, `The variance increases linearly`, `The expected value approaches the median`, `The average value approaches the expected value`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [22:32]: "For any random variable, the average value of all random variables that you ever encounter as we do more and more trials as we look at more and more values of this random variable the average value that we get approaches the expected value."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 19,
    qid: `Q19`,
    qtype: `RELATIONSHIP`,
    format: `mcq`,
    timestamp: `22:55`,
    question: `How does variance decrease as the number of samples n increases?`,
    options: [`Quadratically (1/n²)`, `Exponentially (e^-n)`, `Linearly (1/n)`, `Logarithmically (1/log(n))`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [22:55]: "The just the decrease in variance is always linear in n" and calculates: "that's equal to one over N squared times the sum of the variances... so that's just n times the variance of Y times 1 over N squared or 1 over n times the variance of Y."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 20,
    qid: `Q20`,
    qtype: `EXAMPLE`,
    format: `mcq`,
    timestamp: `24:22`,
    question: `In the coconut island example, what mathematical constant is being estimated?`,
    options: [`γ (Euler-Mascheroni constant)`, `e (Euler's number)`, `φ (golden ratio)`, `π (pi)`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [25:01]: "And that fraction because you know that the area of a unit circle is while it's PI R squared but R is one so it's just pi so you're gonna get a good estimate of Pi as you drop more and more and more coconuts into this square."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 21,
    qid: `Q21`,
    qtype: `METHOD`,
    format: `mcq`,
    timestamp: `24:47`,
    question: `In the coconut island example, how is π estimated?`,
    options: [`By counting the ratio of coconuts in the circle to those in the square`, `By calculating the diagonal of the square`, `By measuring the circumference and diameter of coconuts`, `By counting the total number of coconuts`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [25:01], the lecturer describes: "What you're going to do is count what fraction of the coconuts lands that land in the square also land in the circle right and that fraction because you know that the area of a unit circle is while it's PI R squared but R is one so it's just pi."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 22,
    qid: `Q22`,
    qtype: `CONVERGENCE`,
    format: `mcq`,
    timestamp: `26:21`,
    question: `What is the primary advantage of Monte Carlo rendering for complex scenes?`,
    options: [`It is always faster than rasterization`, `It always produces the most artistically pleasing results`, `It will always converge to the correct image with enough samples`, `It requires less memory than other methods`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [26:21]: "No matter how hard the integrals are if you have crazy lighting you have crazy weird geometry strange materials it might take you a while to get there but you know you'll always get the right image by just taking more and more samples."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 23,
    qid: `Q23`,
    qtype: `ACCELERATION`,
    format: `mcq`,
    timestamp: `27:19`,
    question: `What is the main challenge with Monte Carlo integration that needs to be addressed?`,
    options: [`It cannot model certain physical phenomena`, `It is slow to converge and requires many samples`, `It requires too much memory`, `It cannot handle scenes with transparency`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [27:19], the lecturer states: "We've talked a little bit about how Monte Carlo can be slow to converge you have to take a lot of samples to get an accurate estimate so how can we do a better job how can we accelerate this estimation strategy."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 24,
    qid: `Q24`,
    qtype: `STRATEGY`,
    format: `mcq`,
    timestamp: `27:42`,
    question: `What sampling strategy does the lecture first discuss to improve Monte Carlo estimation?`,
    options: [`Stratified sampling`, `Biased sampling (non-uniform distribution)`, `Multiple importance sampling`, `Quasi-Monte Carlo sampling`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer introduces at [27:42]: "So far we've done something very simple we've picked samples uniformly from the entire domain every point is equally likely. Now suppose we play a little game suppose that we pick samples from some other distribution other than the uniform distribution."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 25,
    qid: `Q25`,
    qtype: `ESTIMATOR`,
    format: `mcq`,
    timestamp: `28:36`,
    question: `When using a non-uniform distribution P for sampling, how must the Monte Carlo estimator be modified?`,
    options: [`No modification is needed`, `The function value must be multiplied by P`, `The function value must be divided by P`, `The function value must be added to P`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [28:36], the lecturer explains: "The integral of F over the whole domain is approximated by 1 over the number of samples times the sum over all samples of the function value at sample I divided by the probability that we picked that sample point X I."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 26,
    qid: `Q26`,
    qtype: `INTUITION`,
    format: `mcq`,
    timestamp: `29:26`,
    question: `In the red and blue square example, why do we divide by P rather than multiply?`,
    options: [`To ensure we get the correct expected value`, `To simplify the calculations`, `To minimize variance`, `To compensate for regions being sampled more or less frequently`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [30:15]: "Because we know we have so many more in the red region they're going to overwhelm our average if we don't do anything we really need to divide by this bigger factor in the red region and divide by this smaller factor in the blue region. Every sample that lands in the blue region should count for more because we know we're gonna have fewer of them."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 27,
    qid: `Q27`,
    qtype: `CONCEPT`,
    format: `mcq`,
    timestamp: `30:59`,
    question: `What is the goal of importance sampling?`,
    options: [`To sample more from regions where the function is large`, `To eliminate all variance in the estimator`, `To sample equally from all regions`, `To minimize the number of samples needed`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [33:00]: "Another way maybe simpler way of looking at that is to just say we want to take more samples where the function is large because large values are going to contribute more to the integral."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 28,
    qid: `Q28`,
    qtype: `PRINCIPLE`,
    format: `mcq`,
    timestamp: `32:41`,
    question: `What property should the quotient f(x)/p(x) ideally have for good importance sampling?`,
    options: [`It should be relatively uniform`, `It should be as small as possible`, `It should be proportional to x`, `It should be as large as possible`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [32:41], the lecturer explains: "One way of thinking about this is we want to find a P that makes the quotient look relatively uniform we're putting about the same amount of work into all the different areas under the curve."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
  },
  {
    id: 29,
    qid: `Q29`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `33:33`,
    question: `What is a BRDF in computer graphics?`,
    options: [`A binary representation of differential functions`, `A brightness reduction density formula`, `A bi-directional reflectance distribution function that describes how light reflects`, `A basic rendering data format`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [33:33]: "If we think about the scattering function the bi-directional reflectance distribution function or brdf remember that's a function that says if I have light coming in from a certain direction how much of it gets reflected out in a different direction."`,
    code: ``,
    images: ["lec18_slide_52.png"],
    tags: [],
    source: `lectures/cg-18-lecture-quiz.md.md`,
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

export default function Lec18Part1Quiz() {
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
    accent: '#fb7185', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec18'
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
          <Crosshair size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 18: Monte Carlo Ray Tracing — Part 1</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Path tracing, direct/indirect lighting, BRDF sampling</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-18-lecture-quiz.md.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec18/1`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec18/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
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
          <Crosshair size={20} /> Start Quiz
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
              <Crosshair size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 18: Monte Carlo Ray Tracing — Part 1</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-18-lecture-quiz.md.md.</p>
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
'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, TrendingDown } from 'lucide-react'

// Source: lectures/cg-22-lecture-quiz.md.md  (symlinked → Logseq pages)
// Lecture 22: Introduction to Optimization — Part 1 · QQ1–QQ32 · 32 questions (32 MCQ, 0 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-22-lecture-quiz.md.md 22

const quizData = [
  {
    id: 1,
    qid: `Q1`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `0:00`,
    question: `What connection did the professor make between the current lecture on optimization and the previous lecture?`,
    options: [`Both involve solving systems of linear equations`, `Both topics involve rendering algorithms`, `Both involve hardware acceleration techniques`, `Both involve numerical approaches to animation`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [0:12], the professor states: "Last time we started talking about physically-based animation and saying that if we use dynamics to just to drive motion then we can get a lot of complexity... Today in very much the same way we're gonna see another very general powerful tool that lets us do various kinds of animation and that's numerical optimization."

"From f=ma , we can get complexity"`,
    code: ``,
    images: ["image_1777601876104_0.png", "lec22_slide_02.png"],
    tags: ["Complexity"],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 2,
    qid: `Q2`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `2:27`,
    question: `How does the professor define an optimization problem?`,
    options: [`Finding a way to approximate an otherwise intractable problem`, `Finding the most efficient algorithm for a given task`, `Finding the best possible solution among all possibilities, possibly subject to constraints`, `Finding any possible solution to a set of equations`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [2:35], the professor explains: "Before getting ahead of ourselves we have to really say what what is an optimization problem... you have some task at hand some problem you want to solve and what you'd like to do is get the best possible solution among all possibilities. In reality you typically also have some kind of constraints."`,
    code: ``,
    images: ["image_1777602016902_0.png", "lec22_slide_03.png"],
    tags: ["Constraint"],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 3,
    qid: `Q3`,
    qtype: `HISTORICAL`,
    format: `mcq`,
    timestamp: `3:14`,
    question: `What was the solution to the isoperimetric problem faced by Princess Dido?`,
    options: [`A circular shape`, `An elliptical shape`, `A triangular shape`, `A square shape`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [4:48], the professor confirms: "This is indeed what what princess Dido did she made a circular path with this strip and closed a bunch of land and really made out well... in general if you want the most land encircled by a curve of fixed length that would be a circle."`,
    code: ``,
    images: ["image_1777602022098_0.png", "lec22_slide_03.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 4,
    qid: `Q4`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `5:36`,
    question: `What example of optimization in character animation did the professor discuss?`,
    options: [`Facial expression generation`, `Character balancing and placing hands for support`, `Cloth simulation`, `Hair dynamics`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [5:36], the professor describes: "Bipedal characters can be easily made to balance on one side... when receiving a strong pleasure use the character decide lay some hand on the wall for a consultant's about yourself kind of not when the wall is too far she has to take a step before."`,
    code: ``,
    images: ["image_1777602081641_0.png", "lec22_slide_02.png"],
    tags: ["Robotics"],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 5,
    qid: `Q5`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `6:27`,
    question: `In the dragon mesh example, what property was being optimized?`,
    options: [`Texture quality`, `Vertex count`, `Rendering speed`, `Symmetry`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [6:27], the professor explains: "In geometry you know very natural thing is to say I want a model that has a lot of symmetry so here we start with this dragon model right that's just a triangle mesh with no clear notion of symmetry and you do some computation to figure out kind of where not only where the symmetries are but how to deform the model to make it more and more symmetrical."

- what are the  next two examples in optimizatoin? #card
-`,
    code: ``,
    images: ["image_1777602143106_0.png", "image_1777602194616_0.png", "image_1777602200466_0.png", "lec22_slide_02.png"],
    tags: ["Symmetry"],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 6,
    qid: `Q6`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `8:25`,
    question: `What defines a discrete optimization problem according to the professor?`,
    options: [`When the constraints are discrete`, `When only integer solutions are acceptable`, `When the domain is a discrete set (finite or countable)`, `When the objective function is discontinuous`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [8:40], the professor states: "In a discrete optimization problem the domain is a discrete set what does that word mean discrete well to be precise about it a set that's discrete either has finitely many elements right or at least elements that can be put into correspondence with the integers."`,
    code: ``,
    images: ["image_1777602351211_0.png", "lec22_slide_08.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 7,
    qid: `Q7`,
    qtype: `EXAMPLE`,
    format: `mcq`,
    timestamp: `9:07`,
    question: `What simple example of discrete optimization did the professor mention?`,
    options: [`Determining the best vegetable for a stew`, `Minimizing the cost of a manufacturing process`, `Finding the shortest path between cities`, `Finding the optimal number of processors`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [9:07], the professor offers: "A concrete kind of silly example is what's the best vegetable to put in a stew right the the set of possible vegetables is a discrete set what is an optimization strategy that might work here."

- what is the optimization problem in standard form?
- you have a function that you need a minimize (satisfy) and that it has to satisfy the constraints as well, it means the minimized function has to been less the constraint.

- Philosophical question , does a local minimum "solve" the problem? #card
-  The reason local minimum work is because it satisfies some conditions on the derivative that will get you a good behaviour , not the best but good enough.`,
    code: ``,
    images: ["image_1777602389117_0.png", "image_1777602717629_0.png", "image_1777602966736_0.png", "lec22_slide_19.png"],
    tags: ["ProteinFolding"],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 8,
    qid: `Q8`,
    qtype: `ALGORITHMIC`,
    format: `mcq`,
    timestamp: `10:22`,
    question: `What graph optimization problem did the professor describe that has efficient algorithms like Prim's and Kruskal's?`,
    options: [`Minimum spanning tree`, `Maximum clique`, `Shortest path`, `Maximum flow`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [10:42], the professor explains: "Maybe if you've heard of a minimal spanning tree I have a graph and I want to pick a set of edges that touch all vertices a tree of edges that touch all vertices and such that the sum of all those edge weights is as small as possible that's a minimal spanning tree... for this problem people have figured out clever algorithms prims algorithm kruskal's algorithm."`,
    code: ``,
    images: ["image_1777603072991_0.png", "lec22_slide_09.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 9,
    qid: `Q9`,
    qtype: `COMPLEXITY`,
    format: `mcq`,
    timestamp: `11:20`,
    question: `Which optimization problem did the professor specifically identify as NP-hard?`,
    options: [`Minimum spanning tree`, `Traveling Salesman Problem`, `Linear programming`, `Convex quadratic programming`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [11:33], the professor states: "More often when somebody throws a just completely new and arbitrary discrete optimization problem at you chances are it's gonna be pretty hard a lot of discrete optimization problems like the Traveling Salesman problem is our np-hard."`,
    code: ``,
    images: ["image_1777603082785_0.png", "lec22_slide_08.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 10,
    qid: `Q10`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `12:16`,
    question: `What characterizes continuous optimization problems?`,
    options: [`The variables can only take discrete values`, `The variables can take any real value within the domain`, `The constraints must be linear`, `The objective function must be differentiable`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [12:16], the professor explains: "What about continuous optimization problems what does that mean well that now means that the domain is no longer a discrete set so rather than values or variables that take values in a discrete set and you might have something like real numbers they can take any real value."`,
    code: ``,
    images: ["image_1777603100893_0.png", "lec22_slide_09.png"],
    tags: ["definition"],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 11,
    qid: `Q11`,
    qtype: `EXAMPLE`,
    format: `mcq`,
    timestamp: `12:36`,
    question: `What example did the professor give to illustrate a continuous optimization problem?`,
    options: [`Finding the best three vegetables for a stew`, `Finding the cheapest flight`, `Finding the shortest route through cities`, `Finding the best temperature to cook an egg`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [12:36], the professor provides this example: "A kind of again silly example would be what's the best temperature to cook an egg right so there I can't try all the possibilities I simply can't write there's an infinitely many or uncountably many different temperatures I could try to cook the egg at and check which one is the best."`,
    code: ``,
    images: ["image_1777603151969_0.png", "lec22_slide_03.png"],
    tags: ["vs/continuousvsDiscrete"],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 12,
    qid: `Q12`,
    qtype: `TRACTABILITY`,
    format: `mcq`,
    timestamp: `13:28`,
    question: `Which class of optimization problems did the professor identify as typically solvable in polynomial time?`,
    options: [`All NP-hard problems`, `All linear programming problems`, `All quadratic programming problems`, `All convex optimization problems`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [13:28], the professor states: "One good example is so-called convex problems so most convex optimization problems are things that you can reasonably solve you can solve in polynomial time and get the optimal answer."`,
    code: ``,
    images: ["image_1777603202379_0.png", "lec22_slide_20.png"],
    tags: ["ConvexOptimization"],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 13,
    qid: `Q13`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `14:39`,
    question: `In the standard form of optimization problems, what is the general structure presented by the professor?`,
    options: [`Find the roots of a function subject to boundary conditions`, `Minimize a function subject to inequality constraints`, `Solve a system of equations with unknown variables`, `Maximize a function subject to equality constraints`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [14:39], the professor describes: "This standard form looks something like this it says I want to minimize a function f not with respect to a set of parameters X so if we have n distinct parameters we could think of that as a point in RN and we also have some constraints that need to be satisfied. The functions F sub I of X need to always evaluate to less than or equal to B sub I for any X that we consider."

you have a function that you need a minimize (satisfy) and that it has to satisfy the constraints as well, it means the minimized function has to been less the constraint.`,
    code: ``,
    images: ["image_1777603299473_0.png", "lec22_slide_09.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 14,
    qid: `Q14`,
    qtype: `OBJECTIVE`,
    format: `mcq`,
    timestamp: `15:54`,
    question: `According to the professor, what does the objective function in an optimization problem represent?`,
    options: [`The time required to reach the solution`, `The computational cost of solving the problem`, `How "bad" the solution is or how much it costs`, `The physical energy of the system`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [15:54], the professor explains: "What does this objective represent it represents basically how much does the solution cost or maybe another way of saying this is how bad is X all right we want the best X given  how bad is this X."`,
    code: ``,
    images: ["image_1777603344978_0.png", "lec22_slide_09.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 15,
    qid: `Q15`,
    qtype: `TRANSFORMATION`,
    format: `mcq`,
    timestamp: `17:29`,
    question: `How can a maximization problem be converted to a minimization problem?`,
    options: [`By applying the KKT conditions`, `By using the dual of the problem`, `By flipping the sign of the objective function`, `By taking the reciprocal of the objective function`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [17:55], the professor says: "It's pretty straightforward all who do you have to do is change the definition of f not we just flip the sign on the definition of f naught and now we've turned our maximization problem into a minimization problem."`,
    code: ``,
    images: ["image_1777603483434_0.png", "lec22_slide_09.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 16,
    qid: `Q16`,
    qtype: `EQUALITY`,
    format: `mcq`,
    timestamp: `18:13`,
    question: `How can equality constraints be represented using inequality constraints?`,
    options: [`By introducing slack variables`, `By introducing complementary constraints (≤ c and ≤ -c)`, `By replacing each equality with a quadratic inequality`, `By using the KKT conditions`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [18:43], the professor explains: "One answer is we could just add equality constraints to our list but actually we don't need to do that we can just include two complementary constraints... G of X is less than or equal to C and G of X is also less than or equal to minus C if both of these constraints are satisfied then we've satisfied something with equality right."`,
    code: ``,
    images: ["image_1777603488641_0.png", "lec22_slide_09.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 17,
    qid: `Q17`,
    qtype: `SOFTWARE`,
    format: `mcq`,
    timestamp: `19:27`,
    question: `According to the lecture, how do optimization packages typically handle problems that aren't in standard form?`,
    options: [`They reject the problem and ask for reformulation`, `They solve each constraint separately`, `They use machine learning to determine the best approach`, `They transform the problem into standard form and hand it to a solver`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [19:27], the professor explains: "This is how some optimization packages will work you'll state an optimization problem and it'll transform that problem into a standard form and then hand that transformed problem off to a solver that can handle any problem in standard form."`,
    code: ``,
    images: ["image_1777603503106_0.png", "lec22_slide_09.png"],
    tags: ["mindset"],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 18,
    qid: `Q18`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `19:54`,
    question: `What is the difference between a global minimum and a local minimum?`,
    options: [`Global minima require constraints while local minima don't`, `Global minima are always unique while local minima can be multiple`, `Global minima are always harder to compute than local minima`, `A global minimum is the absolute best among all possibilities, while a local minimum is the best among immediate neighbors`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [20:17], the professor states: "The global minimum is something that's absolutely the best among all possibilities right... In contrast a local minimum is the best among immediate neighbors or maybe another way of saying that is a local minimum is something where I can't improve the solution by just perturbing it a little bit I would have to make a big jump to ever find a better solution."

- QUESTIONS (continued):`,
    code: ``,
    images: ["image_1777603591210_0.png", "lec22_slide_10.png"],
    tags: ["definition"],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 19,
    qid: `Q19`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `21:09`,
    question: `In what situations might local minima be preferred over global minima according to the lecture?`,
    options: [`When computation time is limited`, `When working with convex functions`, `When the global minimum is difficult to find`, `When the local minimum has better physical meaning for the system`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [21:49], the professor explains this with a protein example: "The proteins that you end up producing are often local minima rather than global minima they're in some configuration that's a local minimum and it's actually really important that they're in that local minimum because that shape is what causes healthy cell function if you went to a global minimum you might get a different shape that would behave in a different way."`,
    code: ``,
    images: ["image_1777603665568_0.png", "lec22_slide_17.png"],
    tags: ["Concept"],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 20,
    qid: `Q20`,
    qtype: `EXAMPLE`,
    format: `mcq`,
    timestamp: `22:52`,
    question: `What example did the professor give of when a local minimum could be "really bad"?`,
    options: [`Numerical weather prediction`, `Designing machine learning models`, `Protein folding simulations`, `Plotting a path through a city that gets caught on obstacles`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [23:16], the professor states: "In some cases local minima can be really bad alright if you're trying to plot a path through the city and you take some crazy crazy route... when you end up at your destination you might say okay I could make that path a little bit shorter by pulling the string tight... then I'm kind of at a local minimum for that path I took... if I take a crazy route through the city right I wind around every city block to get to my destination this local minimum could be really awful."`,
    code: ``,
    images: ["lec22_slide_10.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 21,
    qid: `Q21`,
    qtype: `VISUALIZATION`,
    format: `mcq`,
    timestamp: `24:15`,
    question: `What mathematical function was being visualized in the 2D optimization example with a "potato chip" shape?`,
    options: [`x₁² + x₂²`, `sin(x₁) + x₂²`, `x₁² - x₂²`, `x₁⁴ - x₂⁴`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [24:15], the professor describes: "Let's think about this problem I want to just minimize over two parameters X1 and X2 the function X1 squared minus X2 squared subject to the condition that X1 squared plus X2 squared minus 1 is less than or equal to 0."`,
    code: ``,
    images: ["image_1777603817734_0.png", "lec22_slide_09.png"],
    tags: ["Visualization"],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 22,
    qid: `Q22`,
    qtype: `CONSTRAINT`,
    format: `mcq`,
    timestamp: `25:54`,
    question: `In the 2D optimization example, what shape was described by the constraint x₁² + x₂² - 1 ≤ 0?`,
    options: [`An ellipse`, `A line`, `A unit disk`, `A parabola`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [25:54], the professor states: "The constraint I can think of as a set of allowable points a set of points over which I want to plot this graph so what shape does this describe all the points such that x1 squared plus x2 squared minus 1 is less than or equal to 0 this is an implicit description of a shape and that shape is of course a circle or really the unit disk."`,
    code: ``,
    images: ["image_1777603839672_0.png", "lec22_slide_09.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 23,
    qid: `Q23`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `27:17`,
    question: `What notable property of global minima did the "potato chip" example demonstrate?`,
    options: [`Global minima always occur at boundary points`, `Global minima can be non-unique (multiple points with same minimum value)`, `Global minima only exist for convex functions`, `Global minima can sometimes be saddle points`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [27:17], the professor notes: "Even for this simple problem we see something interesting there can be more than one global minimum here there are two both the point 0 1 and the point 0 -1 both have the smallest value they're both at the point where this potato chip touches the ground."`,
    code: ``,
    images: ["image_1777603885743_0.png", "lec22_slide_17.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 24,
    qid: `Q24`,
    qtype: `EXISTENCE`,
    format: `mcq`,
    timestamp: `29:29`,
    question: `What simple optimization problem did the professor use to demonstrate that not all problems have global minimizers?`,
    options: [`Minimize e^x`, `Minimize x`, `Minimize log(x)`, `Minimize 1/x`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [29:29], the professor gives this example: "Let's think about minimizing the function X that's it right I have one variable in my problem it's X X is a real value can take any value on the real line and I want to find the point X that minimizes the objective function f of x equals x where's the global minimum... I could keep moving X further and further to the left and the value will go down and down and down and down right."`,
    code: ``,
    images: ["image_1777604253779_0.png", "lec22_slide_12.png"],
    tags: ["uniqueness"],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 25,
    qid: `Q25`,
    qtype: `BOUNDED`,
    format: `mcq`,
    timestamp: `30:31`,
    question: `Why doesn't the function f(x) = x have a minimizer on the real line?`,
    options: [`Because the domain is not compact`, `Because the function is not differentiable`, `Because the function is not bounded from below`, `Because the constraints are not feasible`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [30:31], the professor explains: "We set up a perfectly reasonable optimization problem it doesn't involve any crazy objective functions or any crazy constraints but it clearly has no solution we can always pick a smaller X right so we cannot always find a global minimizer we can't always just take the smallest value or the smallest input because not all objective functions are bounded from below."`,
    code: ``,
    images: ["image_1777604307270_0.png", "lec22_slide_12.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 26,
    qid: `Q26`,
    qtype: `FEASIBILITY`,
    format: `mcq`,
    timestamp: `31:29`,
    question: `In an optimization problem where the objective function is simply f(x) = 0, what does the problem reduce to?`,
    options: [`Finding the point closest to the origin`, `Finding the maximum entropy solution`, `Finding the global minimum`, `Finding any point that satisfies all the constraints`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [32:40], the professor states: "So what the objective doesn't depend at all on the choice of X any feasible solution is equally good our problem now reduces to simply finding points actually any point at all that satisfies all the constraints."`,
    code: ``,
    images: ["image_1777604427812_0.png", "lec22_slide_13.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 27,
    qid: `Q27`,
    qtype: `EXAMPLE`,
    format: `mcq`,
    timestamp: `34:32`,
    question: `What simple example did the professor give of an optimization problem with no feasible points?`,
    options: [`Minimizing x² + y² subject to x = 1 and x = 2`, `Minimizing e^(-x) over all real numbers`, `Minimizing 0 subject to x = 1 and x = -1`, `Maximizing x subject to x ≤ 0`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [34:32], the professor provides: "A stupidly simple example of this would be minimize 0 subject to x equals 1 and x equals minus 1 okay that is a problem in standard form it doesn't have a solution and so therefore it doesn't have a globally optimal solution."
"I hope you remember that you can't always solve ax=b , if the matrix is not full rank."`,
    code: ``,
    images: ["image_1777604435276_0.png", "lec22_slide_09.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 28,
    qid: `Q28`,
    qtype: `GEOMETRIC`,
    format: `mcq`,
    timestamp: `35:37`,
    question: `In the geometric example with a shifted disk and half-plane, why was the problem infeasible?`,
    options: [`The two constraint regions had no common points (no overlap)`, `The constraints were contradictory`, `The objective function had no minimum on the domain`, `The objective function was unbounded`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [37:18], the professor concludes: "So it looks like this ok so is this problem feasible what's it asking us to do it's asking us to minimize this interesting-looking objective function over points that are both in the blue disc and in the blue half plane are there any such points? No right these two sets what I'm gonna call sublevel sets have no common points they don't overlap."`,
    code: ``,
    images: ["image_1777604519223_0.png", "lec22_slide_14.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 29,
    qid: `Q29`,
    qtype: `BOUNDED`,
    format: `mcq`,
    timestamp: `39:03`,
    question: `Why doesn't the function f(x) = e^(-x) have a minimizer on the real line?`,
    options: [`Because the domain is not compact`, `Because the function has multiple local minima`, `Because the function approaches 0 as x approaches infinity but never reaches it`, `Because the function is not continuous`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [39:25], the professor explains: "No matter how big X gets we never actually achieve the lower bound of the function we never actually achieved the value 0 which is the value we approach as X goes to infinity and so this function does not have a minimizer on the real line."`,
    code: ``,
    images: ["image_1777604628525_0.png", "lec22_slide_15.png"],
    tags: ["BoundaryConditions"],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 30,
    qid: `Q30`,
    qtype: `SUFFICIENT`,
    format: `mcq`,
    timestamp: `40:49`,
    question: `What does the extreme value theorem require to guarantee existence of a minimizer?`,
    options: [`A coercive objective function with no constraints`, `A continuous objective function and a compact domain`, `A convex objective function and convex constraints`, `A differentiable objective function with bounded derivatives`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [40:49], the professor states: "We want to have a continuous objective an objective that doesn't jump in value as we change X by a small amount and a compact domain meaning the set of feasible points is a closed and bounded set closed and bounded subset of RN."`,
    code: ``,
    images: ["image_1777604639814_0.png", "lec22_slide_09.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 31,
    qid: `Q31`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `41:21`,
    question: `What does "coercivity" mean for an objective function?`,
    options: [`The function has unique minima`, `The function approaches infinity as variables get farther from the origin`, `The function is bounded from below`, `The function is continuously differentiable`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [41:21], the professor explains: "Coercivity means that the objective function loosely speaking goes to positive infinity as we travel far far away in any direction right... coercivity is kind of saying there's gonna be a global minimum because if you allow yourself to get too big too far from the origin things are just gonna keep going up."

e(x) is not because its not going to positive infinity.`,
    code: ``,
    images: ["image_1777604881232_0.png", "lec22_slide_12.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md.md`,
  },
  {
    id: 32,
    qid: `Q32`,
    qtype: `TESTING`,
    format: `mcq`,
    timestamp: `43:22`,
    question: `According to the professor, which is typically harder to verify?`,
    options: [`Whether a point is a global minimum`, `Whether a function is convex`, `Whether a function is coercive`, `Whether a point is a local minimum`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [43:22], the professor states: "In general I'll actually say that checking if a point is a global minimizer is typically hard if I just hand you a point X and I say I claim this is the global minimum and you want to go check is it or isn't it the global minimum do I believe that this is actually the optimal solution that's usually hard actually checking that a given point is the global minimum maybe as hard as solving the original problem."`,
    code: ``,
    images: ["image_1777604944073_0.png", "lec22_slide_16.png"],
    tags: [],
    source: `lectures/cg-22-lecture-quiz.md.md`,
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

export default function Lec22Part1Quiz() {
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

  const STORE = 'quiz_lec22'
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
          <TrendingDown size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 22: Introduction to Optimization — Part 1</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Gradient descent, Newton's method, convex optimization, inverse kinematics</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-22-lecture-quiz.md.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec22/1`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec22/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
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
          <TrendingDown size={20} /> Start Quiz
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
              <TrendingDown size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 22: Introduction to Optimization — Part 1</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-22-lecture-quiz.md.md.</p>
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
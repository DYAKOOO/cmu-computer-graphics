'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Waves } from 'lucide-react'

// Source: lectures/cg-23-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 23: PDEs & Physical Animation — Part 1 · QQ1–QQ32 · 32 questions (32 MCQ, 0 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-23-lecture-quiz.md 23

const quizData = [
  {
    id: 1,
    qid: `Q1`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `00:06`,
    question: `What is the primary focus of the lecture?`,
    options: [`Physically based animation through PDEs`, `Optimization techniques for animation`, `Real-time rendering algorithms`, `Machine learning for computer graphics`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [00:06]: "Welcome back to computer graphics so today we're talking about physically based animation and how we can do that by solving partial differential equations."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 2,
    qid: `Q2`,
    qtype: `RELATIONSHIP`,
    format: `mcq`,
    timestamp: `01:02`,
    question: `How does the lecturer relate optimization to today's topic?`,
    options: [`PDEs are always easier to solve than optimization problems`, `Optimization problems use PDEs but PDEs don't use optimization`, `Gradient descent is an example of an ordinary differential equation`, `They are completely unrelated topics`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [01:02], the lecturer explains: "If we think back even one lecture earlier what we realize is that gradient descent and other descent strategies are really just examples of ordinary differential equations right and so today we're going to return to our discussion of differential equations."  ,`,
    code: ``,
    images: ["image_1777200197368_0.png"],
    tags: ["optimization", "PDEs", "ODE"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 3,
    qid: `Q3`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `02:05`,
    question: `What is the key distinction between ordinary differential equations (ODEs) and partial differential equations (PDEs)?`,
    options: [`ODEs are always easier to solve than PDEs`, `ODEs describe explicit functions while PDEs are only used for implicit surfaces`, `ODEs involve derivatives in time while PDEs involve derivatives in both time and space`, `ODEs describe static phenomena while PDEs describe dynamic phenomena`],
    answer: 2,
    answerText: ``,
    intuition: `An ODE tracks one thing over time — like a ball's position x(t). A PDE tracks a whole field over time AND space — like temperature u(t,x) at every point in a room simultaneously. More independent variables = more partial derivatives = PDE. Whenever you care about HOW something varies spatially (not just temporally), you need a PDE.`,
    explanation: `At [02:05], the lecturer defines: "An ordinary differential equation is that we're going to implicitly describe a function in terms of its time derivatives... likewise a partial differential equation is going to be an implicit description of some phenomenon but now involving both time derivatives and spatial derivatives."`,
    code: ``,
    images: ["image_1777200288107_0.png"],
    tags: [],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 4,
    qid: `Q4`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `03:59`,
    question: `According to the lecturer, how is solving a PDE similar to solving an ODE?`,
    options: [`Both require exact analytical solutions`, `Both use marching forward in time with velocities, but PDEs use weighted combinations of neighbors`, `Both are impossible to solve with numerical methods`, `Both require specialized hardware for computation`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [03:59], the lecturer explains: "The most basic strategy for solving an ODE is to sort of add a little velocity at each time step... Solving a PDE doesn't look so different we're still going to be marching forward in time but now our velocity function is going to do something like take some weighted combination of neighboring values."`,
    code: ``,
    images: ["image_1777200374004_0.png"],
    tags: ["PDEs"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 5,
    qid: `Q5`,
    qtype: `CODE`,
    format: `mcq`,
    timestamp: `06:16`,
    question: `In the simple wave equation code example, what two values does the lecturer track at every grid point?`,
    options: [`Position and acceleration`, `Pressure and temperature`, `Height and velocity`, `Force and momentum`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [06:16], the lecturer states: "We're going to keep track of just two values at every grid point we're going to keep track of the height of the wave so how far it is from a flat surface we'll call that u and a velocity v how quickly is that height changing over time."`,
    code: ``,
    images: ["image_1777200915491_0.png"],
    tags: [],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 6,
    qid: `Q6`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `07:52`,
    question: `What does the core velocity update formula measure in the simple wave simulation?`,
    options: [`The deviation of height at a point from the average height of neighboring points`, `The maximum amplitude of the wave`, `The rate of energy dissipation in the system`, `The absolute height at each point`],
    answer: 0,
    answerText: ``,
    intuition: `This IS the Laplacian. The Laplacian at a point = (average of neighbors) - (value at point). If you're on a flat surface, this is zero — no force, no acceleration. If you're on a sharp peak, your neighbors are all lower, so you get a strong restoring force pushing you down. Waves propagate because every bump creates forces that smooth it out — but momentum overshoots, creating the next bump.`,
    explanation: `At [07:52], the lecturer explains: "It's measuring the deviation of the height at the current point from the average height of the neighboring points... if I'm flat then there's no velocity nothing interesting is happening if I have a big bump I'm going to add a lot of velocity."`,
    code: ``,
    images: ["image_1777200985820_0.png"],
    tags: [],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 7,
    qid: `Q7`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `09:33`,
    question: `What special effect was demonstrated in the liquid simulation example that wouldn't be possible in physical reality?`,
    options: [`Artificially changing the density of one liquid to make it float`, `Making the liquid glow in the dark`, `Creating water from nothing`, `Freezing the liquid instantly`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [09:38], the lecturer points out: "At this moment the density of one of the liquids is changed artificially so this is something you couldn't do in physical reality so now it floats to the top."`,
    code: ``,
    images: ["image_1777201009584_0.png"],
    tags: ["Simulation"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 8,
    qid: `Q8`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `10:42`,
    question: `How does the lecturer describe hair in terms of elastic bodies?`,
    options: [`Hair is a one-dimensional elastic body that can bend and twist`, `Hair is a non-elastic material that cannot be simulated`, `Hair is a fully rigid body that doesn't deform`, `Hair is a two-dimensional elastic sheet`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [10:42], the lecturer describes: "Hair is you could think of it as another elastic body but it's kind of one-dimensional you have these strands maybe they're able to bend and twist a little bit but they want to restore their their shape."`,
    code: ``,
    images: ["image_1777201093885_0.png"],
    tags: ["definition"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 9,
    qid: `Q9`,
    qtype: `FACTUAL`,
    format: `mcq`,
    timestamp: `11:22`,
    question: `What technique did Disney use for snow simulation in the movie Frozen according to the lecturer?`,
    options: [`Smoothed particle hydrodynamics`, `Lattice Boltzmann methods`, `Finite element methods`, `Material point methods`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [11:22], the lecturer states: "Recently there's been a lot of interest in what are called material point methods this was one of the early examples used in in film for doing snow simulation by disney for frozen."`,
    code: ``,
    images: ["image_1777201136248_0.png"],
    tags: [],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 10,
    qid: `Q10`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `12:09`,
    question: `In the mathematical definition of PDEs, what does u(t,x) represent?`,
    options: [`The uncertainty in the system over time`, `The universal constant of physics`, `The upper bound of the algorithm's complexity`, `The function we want to solve for, depending on time and space`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [12:09], the lecturer says: "We could call that u of t and x where x could be any number of spatial variables," referring to the function they're trying to solve for that depends on both time and space.`,
    code: ``,
    images: ["image_1777201185381_0.png"],
    tags: ["definition", "PDEs"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 11,
    qid: `Q11`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `12:52`,
    question: `What is an example of a non-linear PDE given by the lecturer?`,
    options: [`The heat equation`, `The Laplace equation`, `Burgers' equation`, `The wave equation`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [12:52], the lecturer presents: "Burgers' equation which says that the time derivative of u plus the value of u times the space derivative of u equals some constant alpha times the second spatial derivative of u." Later he identifies this as non-linear because "we have this non-linearity of u times u prime."`,
    code: ``,
    images: ["image_1777201254600_0.png"],
    tags: ["Diffusion"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 12,
    qid: `Q12`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `14:08`,
    question: `According to the lecturer, what makes a PDE non-linear?`,
    options: [`When the equation contains constants`, `When it involves time derivatives`, `When it involves spatial derivatives`, `When the function is multiplied by itself or its derivatives`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [14:08], the lecturer explains: "If we have things like the function being multiplied by itself or multiplied by one of its derivatives or you push the function through some function like sine or cosine or or whatever then this is a non-linear equation."`,
    code: ``,
    images: ["image_1777201316666_0.png"],
    tags: ["Linear", "Nonlinearity"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 13,
    qid: `Q13`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `15:29`,
    question: `What rule of thumb does the lecturer provide about the difficulty of solving PDEs?`,
    options: [`Non-linear and higher-order PDEs are harder to solve`, `Linear PDEs are always harder to solve than non-linear PDEs`, `All PDEs have the same level of difficulty`, `PDEs with boundary conditions are always easier to solve`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [15:29], the lecturer states: "The rule of thumb is that if an equation is non-linear it's harder to solve also if it's higher order it tends to be harder to solve."`,
    code: ``,
    images: ["image_1777201582293_0.png"],
    tags: [],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 14,
    qid: `Q14`,
    qtype: `CLASSIFICATION`,
    format: `mcq`,
    timestamp: `16:15`,
    question: `Which of the following correctly describes the Laplace equation?`,
    options: [`A stochastic PDE that models random processes`, `A hyperbolic PDE that models wave propagation`, `An elliptic PDE that finds the smoothest function interpolating boundary data`, `A parabolic PDE that models heat diffusion`],
    answer: 2,
    answerText: ``,
    intuition: `Think of a soap film stretched across a wire frame — it takes the shape that minimizes surface area. That shape is exactly a solution to Laplace's equation. Every interior point is the average of its neighbors, so there are no unnecessary bumps. Given boundary values (the wire frame), Laplace finds the smoothest possible surface that hits those values — no more, no less.`,
    explanation: `At [16:15], the lecturer says: "One of the most basic equations is the laplace equation which says that if i apply the laplacian to my function u it's equal to zero at every point and this is the canonical example of what's called an elliptic equation." He then explains it as finding "the smoothest function that interpolates these known values."`,
    code: ``,
    images: ["image_1777201589975_0.png"],
    tags: ["Laplace", "Eliptic"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 15,
    qid: `Q15`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `17:04`,
    question: `What is the heat equation and what type of PDE is it?`,
    options: [`The laplacian of u equals zero; a parabolic PDE`, `The third time derivative of u equals the laplacian of u; an elliptic PDE`, `The time derivative of u equals the laplacian of u; a parabolic PDE`, `The second time derivative of u equals the laplacian of u; a hyperbolic PDE`],
    answer: 2,
    answerText: ``,
    intuition: `Hot regions spread heat to cooler neighbors. The Laplacian measures "how much hotter am I than my average neighbor" — so du/dt = Δu says: change proportional to how much you stand out from your surroundings. This is also why smoothing algorithms in image processing (Gaussian blur) are the same math — both are about averaging you toward your neighbors over time.`,
    explanation: `At [17:04], the lecturer defines: "We can change this equation just a little bit into something that now depends on time something that says the change in time of the function u is equal to its laplacian that is called the heat equation which is the canonical example of a parabolic equation."`,
    code: ``,
    images: ["image_1777201623002_0.png"],
    tags: ["Equation/CG", "Parabolic", "Equation/Heat"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 16,
    qid: `Q16`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `17:28`,
    question: `What is the wave equation and what type of PDE is it?`,
    options: [`The gradient of u equals zero; a hyperbolic PDE`, `The second time derivative of u equals the laplacian of u; a hyperbolic PDE`, `The time derivative of u equals the laplacian of u; a parabolic PDE`, `The laplacian of u equals zero; an elliptic PDE`],
    answer: 1,
    answerText: ``,
    intuition: `Heat equation has ONE time derivative (first-order in time) → it dissipates/smooths, losing energy. Wave equation has TWO time derivatives (second-order in time) → it conserves energy, things oscillate. The second derivative in time means position is driven by acceleration (F=ma), not velocity — so bumps don't just decay, they overshoot and come back forever.`,
    explanation: `At [17:28], the lecturer states: "The wave equation says that the second time derivative of u is equal to the laplacian of u. This is the classic example of a hyperbolic equation."`,
    code: ``,
    images: ["image_1777201817379_0.png"],
    tags: ["definition", "Equation/Wave", "Hyperbolic"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 17,
    qid: `Q17`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `19:28`,
    question: `According to the lecturer, what is a key property of solutions to the Laplace equation?`,
    options: [`Every value is equal to the average of its neighbors`, `Every value is randomly distributed`, `Every value is proportional to time`, `Every value is exactly twice the average of its neighbors`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [19:28], the lecturer explains: "Conceptually it's saying that every value should be in some sense the average of its neighbors," when discussing the property of solutions to the Laplace equation.`,
    code: ``,
    images: ["image_1777201837572_0.png"],
    tags: ["Laplace"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 18,
    qid: `Q18`,
    qtype: `RELATIONSHIP`,
    format: `mcq`,
    timestamp: `20:49`,
    question: `How does the lecturer relate the heat equation to the Laplace equation?`,
    options: [`The heat equation is just the Laplace equation with a negative sign`, `They are completely unrelated equations`, `The heat equation is always harder to solve than the Laplace equation`, `In the long run (steady state), the solution to the heat equation is the same as the solution to the Laplace equation`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [20:49], the lecturer explains: "How is this related to the laplace equation well if i keep letting this heat flow longer and longer and longer really interesting point the solution is the same as the solution to the laplace equation."`,
    code: ``,
    images: ["image_1777202867537_0.png"],
    tags: ["Relationship", "Laplace", "Diffusion"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 19,
    qid: `Q19`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `22:24`,
    question: `Why might the wave equation be harder to solve numerically than the Laplace equation?`,
    options: [`Because it requires more memory`, `Because it can only be solved with quantum computers`, `Because numerical errors propagate along the wave for a long time`, `Because it always has complex-valued solutions`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [22:24], the lecturer explains: "Why might this equation be a little bit harder to solve well one thing you notice even from looking at this this movie of a real swimming pool is that little bumps in the surface kind of get carried along the wave for a long long time and so what that means is if you make any kind of numerical error when you're solving the wave equation those errors also will be propagated in kind of a nasty way forward through time."`,
    code: ``,
    images: ["image_1777202890474_0.png"],
    tags: ["Equation/Wave"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 20,
    qid: `Q20`,
    qtype: `DISCRETIZATION`,
    format: `mcq`,
    timestamp: `35:36`,
    question: `In discretizing the first derivative, what basic approach does the lecturer present?`,
    options: [`Looking up derivatives in a pre-computed table`, `Using the chain rule to find the derivative analytically`, `Using Fourier transforms to compute derivatives`, `Approximating the derivative using a limit definition with differences between neighboring values`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [35:54], the lecturer describes approximating the first derivative: "We can approximate the derivative using values that we know we can say all right i want to know the derivative at x i i know the value at x i and i don't know a value infinitesimally close but i can at least just look at my closest neighbor u i plus 1 take a difference divide by h the spacing the distance between these."`,
    code: ``,
    images: ["image_1777211105275_0.png"],
    tags: [],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 21,
    qid: `Q21`,
    qtype: `NUMERICAL`,
    format: `mcq`,
    timestamp: `37:34`,
    question: `How does the lecturer suggest approximating the second derivative?`,
    options: [`By using the first derivative approximation twice`, `By always using central differences`, `By using Lagrange multipliers`, `By using Monte Carlo integration`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [37:50], the lecturer explains: "One idea is to say hey we know how to take a first derivative we know how to approximate a first derivative so why don't we approximate the first derivative of our approximate first derivative."

-`,
    code: ``,
    images: ["image_1777211148400_0.png"],
    tags: ["Approximation"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 22,
    qid: `Q22`,
    qtype: `IMPLEMENTATION`,
    format: `mcq`,
    timestamp: `39:46`,
    question: `What are two approaches mentioned for discretizing the Laplacian on different geometries?`,
    options: [`Particle systems and procedural generation`, `Finite element method and boundary element method`, `Finite difference on grids and cotangent formula on triangle meshes`, `Monte Carlo method and simulated annealing`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [40:05], the lecturer describes the grid approach: "One is to stick with this finite difference idea... i add up my four immediate neighbors i subtract four times myself and i divide by the square of the spacing the grid spacing." Then at [40:38], he describes the mesh approach: "Here there's a well-known formula for the laplacian called the cotan formula."`,
    code: ``,
    images: ["image_1777211252493_0.png"],
    tags: ["pointcloud"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 23,
    qid: `Q23`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `41:37`,
    question: `What is the approach described for numerically solving the Laplace equation?`,
    options: [`Solving the wave equation and letting time go to infinity`, `Setting the finite difference approximation of the Laplacian to zero at every grid cell`, `Using symbolic differentiation software`, `Using complex contour integration`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [41:56], the lecturer states: "We know now that the laplacian can be approximated by this finite difference formula we just set that finite difference to zero at every grid cell."
#jacobi`,
    code: ``,
    images: ["image_1777211333635_0.png"],
    tags: ["Laplace"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 24,
    qid: `Q24`,
    qtype: `METHOD`,
    format: `mcq`,
    timestamp: `44:01`,
    question: `What approach does the lecturer suggest for solving the system of equations arising from the discretized Laplace equation?`,
    options: [`Solving the system by hand`, `Converting it to a matrix equation and using sparse linear solvers`, `Using gradient descent`, `Using the Newton-Raphson method`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [44:01], the lecturer explains: "What we want to do generally is turn a PD like this turn the system of equations into some matrix equation that we can hand off to a linear solver."

- what are two "basic" boundary condition for discrete laplace ? #Laplace #BoundaryConditions
-  #Dirichlet #neumann , there is also robin.`,
    code: ``,
    images: ["image_1777211476986_0.png", "image_1777211651120_0.png"],
    tags: [],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 25,
    qid: `Q25`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `23:00`,
    question: `What is the key conceptual difference between Lagrangian and Eulerian simulation approaches?`,
    options: [`Lagrangian is only for fluids; Eulerian is only for solids`, `Lagrangian tracks individual particles while Eulerian observes fixed points in space`, `Lagrangian is faster to compute; Eulerian is more accurate`, `Lagrangian uses grids; Eulerian uses point clouds`],
    answer: 1,
    answerText: ``,
    intuition: `Lagrangian = you follow the material (like attaching a GPS to every water molecule). Eulerian = you sit at fixed sensors and measure what flows past (like a weather station). Lagrangian is natural for solid objects (they have identity), Eulerian is natural for fluids (you don't care which molecule is where). The tradeoff: Lagrangian handles large deformations well but needs neighbor-finding; Eulerian handles topology changes (splashing, merging) well but needs advection.`,
    explanation: `In Eulerian simulation you are like a bear waiting for salmon to come to you — you observe at fixed points in space. In Lagrangian simulation you are a control freak keeping track of every particle. Lagrangian is associated with point clouds.  #pointcloud`,
    code: ``,
    images: ["image_1777203645522_0.png", "image_1777203756379_0.png"],
    tags: ["vs/langrangianvsEulerian"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 26,
    qid: `Q26`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `26:00`,
    question: `Can Lagrangian and Eulerian simulation approaches be mixed, and how does this relate to PDE formulation?`,
    options: [`No, they are mutually exclusive frameworks that cannot be combined`, `Only when using finite element methods on triangle meshes`, `Yes, and the choice also relates to how you first formulate the PDEs on continuous domains`, `Only in fluid simulations, not solid body simulations`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `You can mix the two approaches. Another angle is how to formulate the #PDEs in the first place — starting with continuous PDE thinking makes it easier to switch between Lagrangian and Eulerian representations.`,
    code: ``,
    images: ["image_1777203884392_0.png", "image_1777203938182_0.png"],
    tags: ["vs/langrangianvsEulerian"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 27,
    qid: `Q27`,
    qtype: `STRATEGY`,
    format: `mcq`,
    timestamp: `35:00`,
    question: `What is the general strategy for numerically solving PDEs in computer graphics?`,
    options: [`Convert to ODEs then solve analytically using closed-form expressions`, `Apply symbolic integration techniques to find exact analytical solutions`, `Discretize the domain, approximate derivatives with finite differences, set up Ax=b, and solve with a sparse linear solver`, `Use machine learning to approximate solutions from training data`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The general strategy involves discretizing the domain (into a grid or mesh), approximating derivatives with finite differences or cotangent weights, assembling a sparse system of equations Ax=b, and solving it efficiently with a linear solver. #strategy #PDEs`,
    code: ``,
    images: ["image_1777204000145_0.png"],
    tags: [],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 28,
    qid: `Q28`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `47:00`,
    question: `What does a Dirichlet boundary condition specify?`,
    options: [`The value of the function itself at the boundary (prescribed values)`, `The rate of change of the function perpendicular to the boundary`, `The flux of the function through the boundary surface`, `The normal derivative of the function at the boundary`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `A Dirichlet boundary condition simply means prescribing (specifying) the values of the function at the boundary — it just means prescribe values. The boundary data are the values you want to interpolate: height values, color values, whatever you like.`,
    code: ``,
    images: ["image_1777211776507_0.png"],
    tags: ["BoundaryConditions/Dirichlet"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 29,
    qid: `Q29`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `48:00`,
    question: `What does a Neumann boundary condition specify?`,
    options: [`The second derivative of the function at the boundary`, `The integral of the function over the boundary`, `The normal derivative — how quickly the function changes perpendicular to the boundary`, `The value of the function at the boundary`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `A Neumann boundary condition specifies the normal derivative of the function at the boundary — how quickly the function changes perpendicular to the boundary (the outward flux condition).`,
    code: ``,
    images: ["image_1777211852618_0.png"],
    tags: ["BoundaryConditions/Neumann"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 30,
    qid: `Q30`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `49:00`,
    question: `Can we always satisfy the 1D Laplace equation given Dirichlet boundary conditions?`,
    options: [`Only if the domain length is less than 1 unit`, `Yes — in 1D it simply finds a linear function between the two boundary values`, `No — there may be no smooth function connecting the two endpoint values`, `Only if both boundary values are equal to zero`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The answer is yes because it is easy to do for a point — in 1D the Laplace equation has a unique solution: a straight line between the two prescribed boundary values. Satisfying boundary conditions is not the hard part; satisfying every value in the interior is what matters.`,
    code: ``,
    images: ["image_1777212043598_0.png"],
    tags: ["BoundaryConditions/Dirichlet", "Laplace"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 31,
    qid: `Q31`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `50:00`,
    question: `Can we always satisfy the Laplace equation given Neumann boundary conditions?`,
    options: [`Yes, but only in 2D or higher dimensions`, `No — the second derivative is a rate of change of the first derivative; if the first derivative is not changing, the second derivative cannot be nonzero`, `Yes, always — any Neumann conditions can always be satisfied`, `No, because Neumann conditions are always mathematically inconsistent`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `No — the second derivative is a rate of change of the first derivative. If the first derivative (normal derivative at the boundary) is not changing, then the second derivative is not working. There is a compatibility condition that must be satisfied for a solution to exist.`,
    code: ``,
    images: ["image_1777212242234_0.png"],
    tags: ["BoundaryConditions/Neumann", "Laplace"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 32,
    qid: `Q32`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `52:00`,
    question: `Can we satisfy the 2D Laplace equation with Dirichlet boundary conditions?`,
    options: [`Only if the domain is convex`, `No — the 2D case is fundamentally different from 1D and has no general solution`, `Only for rectangular or triangular domains`, `Yes — with appropriate boundary data a unique smooth solution exists interpolating those values`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `Yes — the 2D Laplace equation with Dirichlet boundary conditions has a unique solution given appropriate boundary data. It finds the smoothest function that interpolates the prescribed boundary values over the interior.`,
    code: ``,
    images: ["image_1777212531236_0.png"],
    tags: ["BoundaryConditions/Dirichlet", "Laplace"],
    source: `lectures/cg-23-lecture-quiz.md`,
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

export default function Lec23Part1Quiz() {
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
    accent: '#f87171', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec23'
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
          <Waves size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 23: PDEs & Physical Animation — Part 1</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Elliptic/Parabolic/Hyperbolic PDEs, Laplacian, Wave/Heat Equations</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-23-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec23/1`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec23/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
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
          <Waves size={20} /> Start Quiz
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
              <Waves size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 23: PDEs & Physical Animation — Part 1</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-23-lecture-quiz.md.</p>
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
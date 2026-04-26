'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Waves } from 'lucide-react'

// Source: lectures/cg-23-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 23: PDEs & Physical Animation · Q1–Q24 · 24 questions
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-23-lecture-quiz.md 23

const quizData = [
  {
    id: 1,
    timestamp: `00:06`,
    question: `What is the primary focus of the lecture?`,
    options: [`Optimization techniques for animation`, `Physically based animation through PDEs`, `Machine learning for computer graphics`, `Real-time rendering algorithms`],
    answer: 1,
    intuition: `Welcome back to computer graphics so today we're talking about physically based animation and how we can do that by solving partial differential equations.`,
    explanation: `The lecturer states at [00:06]: "Welcome back to computer graphics so today we're talking about physically based animation and how we can do that by solving partial differential equations."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 2,
    timestamp: `01:02`,
    question: `How does the lecturer relate optimization to today's topic?`,
    options: [`They are completely unrelated topics`, `Optimization problems use PDEs but PDEs don't use optimization`, `Gradient descent is an example of an ordinary differential equation`, `PDEs are always easier to solve than optimization problems`],
    answer: 2,
    intuition: `If we think back even one lecture earlier what we realize is that gradient descent and other descent strategies are really just examples of ordinary differential equations right and so today we're going to return to our discussion of differential equations.`,
    explanation: `At [01:02], the lecturer explains: "If we think back even one lecture earlier what we realize is that gradient descent and other descent strategies are really just examples of ordinary differential equations right and so today we're going to return to our discussion of differential equations."  ,`,
    code: ``,
    images: ["image_1777200197368_0.png"],
    tags: ["optimization", "PDEs", "ODE"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 3,
    timestamp: `02:05`,
    question: `What is the key distinction between ordinary differential equations (ODEs) and partial differential equations (PDEs)?`,
    options: [`ODEs describe static phenomena while PDEs describe dynamic phenomena`, `ODEs involve derivatives in time while PDEs involve derivatives in both time and space`, `ODEs are always easier to solve than PDEs`, `ODEs describe explicit functions while PDEs are only used for implicit surfaces`],
    answer: 1,
    intuition: `An ordinary differential equation is that we're going to implicitly describe a function in terms of its time derivatives... likewise a partial differential equation is going to be an implicit description of some phenomenon but now involving both time derivatives and spatial derivatives.`,
    explanation: `At [02:05], the lecturer defines: "An ordinary differential equation is that we're going to implicitly describe a function in terms of its time derivatives... likewise a partial differential equation is going to be an implicit description of some phenomenon but now involving both time derivatives and spatial derivatives."`,
    code: ``,
    images: ["image_1777200288107_0.png"],
    tags: [],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 4,
    timestamp: `03:59`,
    question: `According to the lecturer, how is solving a PDE similar to solving an ODE?`,
    options: [`Both require exact analytical solutions`, `Both use marching forward in time with velocities, but PDEs use weighted combinations of neighbors`, `Both are impossible to solve with numerical methods`, `Both require specialized hardware for computation`],
    answer: 1,
    intuition: `The most basic strategy for solving an ODE is to sort of add a little velocity at each time step... Solving a PDE doesn't look so different we're still going to be marching forward in time but now our velocity function is going to do something like take some weighted combination of neighboring values.`,
    explanation: `At [03:59], the lecturer explains: "The most basic strategy for solving an ODE is to sort of add a little velocity at each time step... Solving a PDE doesn't look so different we're still going to be marching forward in time but now our velocity function is going to do something like take some weighted combination of neighboring values."`,
    code: ``,
    images: ["image_1777200374004_0.png"],
    tags: ["PDEs"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 5,
    timestamp: `06:16`,
    question: `In the simple wave equation code example, what two values does the lecturer track at every grid point?`,
    options: [`Position and acceleration`, `Height and velocity`, `Force and momentum`, `Pressure and temperature`],
    answer: 1,
    intuition: `We're going to keep track of just two values at every grid point we're going to keep track of the height of the wave so how far it is from a flat surface we'll call that u and a velocity v how quickly is that height changing over time.`,
    explanation: `At [06:16], the lecturer states: "We're going to keep track of just two values at every grid point we're going to keep track of the height of the wave so how far it is from a flat surface we'll call that u and a velocity v how quickly is that height changing over time."`,
    code: ``,
    images: ["image_1777200915491_0.png"],
    tags: [],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 6,
    timestamp: `07:52`,
    question: `What does the core velocity update formula measure in the simple wave simulation?`,
    options: [`The absolute height at each point`, `The rate of energy dissipation in the system`, `The deviation of height at a point from the average height of neighboring points`, `The maximum amplitude of the wave`],
    answer: 2,
    intuition: `It's measuring the deviation of the height at the current point from the average height of the neighboring points... if I'm flat then there's no velocity nothing interesting is happening if I have a big bump I'm going to add a lot of velocity.`,
    explanation: `At [07:52], the lecturer explains: "It's measuring the deviation of the height at the current point from the average height of the neighboring points... if I'm flat then there's no velocity nothing interesting is happening if I have a big bump I'm going to add a lot of velocity."`,
    code: ``,
    images: ["image_1777200985820_0.png"],
    tags: [],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 7,
    timestamp: `09:33`,
    question: `What special effect was demonstrated in the liquid simulation example that wouldn't be possible in physical reality?`,
    options: [`Creating water from nothing`, `Artificially changing the density of one liquid to make it float`, `Making the liquid glow in the dark`, `Freezing the liquid instantly`],
    answer: 1,
    intuition: `At this moment the density of one of the liquids is changed artificially so this is something you couldn't do in physical reality so now it floats to the top.`,
    explanation: `At [09:38], the lecturer points out: "At this moment the density of one of the liquids is changed artificially so this is something you couldn't do in physical reality so now it floats to the top."`,
    code: ``,
    images: ["image_1777201009584_0.png"],
    tags: ["Simulation"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 8,
    timestamp: `10:42`,
    question: `How does the lecturer describe hair in terms of elastic bodies?`,
    options: [`Hair is a fully rigid body that doesn't deform`, `Hair is a two-dimensional elastic sheet`, `Hair is a one-dimensional elastic body that can bend and twist`, `Hair is a non-elastic material that cannot be simulated`],
    answer: 2,
    intuition: `Hair is you could think of it as another elastic body but it's kind of one-dimensional you have these strands maybe they're able to bend and twist a little bit but they want to restore their their shape.`,
    explanation: `At [10:42], the lecturer describes: "Hair is you could think of it as another elastic body but it's kind of one-dimensional you have these strands maybe they're able to bend and twist a little bit but they want to restore their their shape."`,
    code: ``,
    images: ["image_1777201093885_0.png"],
    tags: ["definition"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 9,
    timestamp: `11:22`,
    question: `What technique did Disney use for snow simulation in the movie Frozen according to the lecturer?`,
    options: [`Finite element methods`, `Material point methods`, `Lattice Boltzmann methods`, `Smoothed particle hydrodynamics`],
    answer: 1,
    intuition: `Recently there's been a lot of interest in what are called material point methods this was one of the early examples used in in film for doing snow simulation by disney for frozen.`,
    explanation: `At [11:22], the lecturer states: "Recently there's been a lot of interest in what are called material point methods this was one of the early examples used in in film for doing snow simulation by disney for frozen."`,
    code: ``,
    images: ["image_1777201136248_0.png"],
    tags: [],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 10,
    timestamp: `12:09`,
    question: `In the mathematical definition of PDEs, what does u(t,x) represent?`,
    options: [`The uncertainty in the system over time`, `The universal constant of physics`, `The function we want to solve for, depending on time and space`, `The upper bound of the algorithm's complexity`],
    answer: 2,
    intuition: `We could call that u of t and x where x could be any number of spatial variables,`,
    explanation: `At [12:09], the lecturer says: "We could call that u of t and x where x could be any number of spatial variables," referring to the function they're trying to solve for that depends on both time and space.`,
    code: ``,
    images: ["image_1777201185381_0.png"],
    tags: ["definition", "PDEs"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 11,
    timestamp: `12:52`,
    question: `What is an example of a non-linear PDE given by the lecturer?`,
    options: [`The heat equation`, `The wave equation`, `Burgers' equation`, `The Laplace equation`],
    answer: 2,
    intuition: `Burgers' equation which says that the time derivative of u plus the value of u times the space derivative of u equals some constant alpha times the second spatial derivative of u.`,
    explanation: `At [12:52], the lecturer presents: "Burgers' equation which says that the time derivative of u plus the value of u times the space derivative of u equals some constant alpha times the second spatial derivative of u." Later he identifies this as non-linear because "we have this non-linearity of u times u prime."`,
    code: ``,
    images: ["image_1777201254600_0.png"],
    tags: ["Diffusion"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 12,
    timestamp: `14:08`,
    question: `According to the lecturer, what makes a PDE non-linear?`,
    options: [`When it involves time derivatives`, `When it involves spatial derivatives`, `When the function is multiplied by itself or its derivatives`, `When the equation contains constants`],
    answer: 2,
    intuition: `If we have things like the function being multiplied by itself or multiplied by one of its derivatives or you push the function through some function like sine or cosine or or whatever then this is a non-linear equation.`,
    explanation: `At [14:08], the lecturer explains: "If we have things like the function being multiplied by itself or multiplied by one of its derivatives or you push the function through some function like sine or cosine or or whatever then this is a non-linear equation."`,
    code: ``,
    images: ["image_1777201316666_0.png"],
    tags: ["Linear", "Nonlinearity"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 13,
    timestamp: `15:29`,
    question: `What rule of thumb does the lecturer provide about the difficulty of solving PDEs?`,
    options: [`PDEs with boundary conditions are always easier to solve`, `Linear PDEs are always harder to solve than non-linear PDEs`, `Non-linear and higher-order PDEs are harder to solve`, `All PDEs have the same level of difficulty`],
    answer: 2,
    intuition: `The rule of thumb is that if an equation is non-linear it's harder to solve also if it's higher order it tends to be harder to solve.`,
    explanation: `At [15:29], the lecturer states: "The rule of thumb is that if an equation is non-linear it's harder to solve also if it's higher order it tends to be harder to solve."`,
    code: ``,
    images: ["image_1777201582293_0.png"],
    tags: [],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 14,
    timestamp: `16:15`,
    question: `Which of the following correctly describes the Laplace equation?`,
    options: [`A parabolic PDE that models heat diffusion`, `A hyperbolic PDE that models wave propagation`, `An elliptic PDE that finds the smoothest function interpolating boundary data`, `A stochastic PDE that models random processes`],
    answer: 2,
    intuition: `One of the most basic equations is the laplace equation which says that if i apply the laplacian to my function u it's equal to zero at every point and this is the canonical example of what's called an elliptic equation.`,
    explanation: `At [16:15], the lecturer says: "One of the most basic equations is the laplace equation which says that if i apply the laplacian to my function u it's equal to zero at every point and this is the canonical example of what's called an elliptic equation." He then explains it as finding "the smoothest function that interpolates these known values."`,
    code: ``,
    images: ["image_1777201589975_0.png"],
    tags: ["Laplace", "Eliptic"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 15,
    timestamp: `17:04`,
    question: `What is the heat equation and what type of PDE is it?`,
    options: [`The second time derivative of u equals the laplacian of u; a hyperbolic PDE`, `The time derivative of u equals the laplacian of u; a parabolic PDE`, `The third time derivative of u equals the laplacian of u; an elliptic PDE`, `The laplacian of u equals zero; a parabolic PDE`],
    answer: 1,
    intuition: `We can change this equation just a little bit into something that now depends on time something that says the change in time of the function u is equal to its laplacian that is called the heat equation which is the canonical example of a parabolic equation.`,
    explanation: `At [17:04], the lecturer defines: "We can change this equation just a little bit into something that now depends on time something that says the change in time of the function u is equal to its laplacian that is called the heat equation which is the canonical example of a parabolic equation."`,
    code: ``,
    images: ["image_1777201623002_0.png"],
    tags: ["Equation/CG", "Parabolic", "Equation/Heat"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 16,
    timestamp: `17:28`,
    question: `What is the wave equation and what type of PDE is it?`,
    options: [`The time derivative of u equals the laplacian of u; a parabolic PDE`, `The laplacian of u equals zero; an elliptic PDE`, `The second time derivative of u equals the laplacian of u; a hyperbolic PDE`, `The gradient of u equals zero; a hyperbolic PDE`],
    answer: 2,
    intuition: `The wave equation says that the second time derivative of u is equal to the laplacian of u. This is the classic example of a hyperbolic equation.`,
    explanation: `At [17:28], the lecturer states: "The wave equation says that the second time derivative of u is equal to the laplacian of u. This is the classic example of a hyperbolic equation."`,
    code: ``,
    images: ["image_1777201817379_0.png"],
    tags: ["definition", "Equation/Wave", "Hyperbolic"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 17,
    timestamp: `19:28`,
    question: `According to the lecturer, what is a key property of solutions to the Laplace equation?`,
    options: [`Every value is equal to the average of its neighbors`, `Every value is exactly twice the average of its neighbors`, `Every value is randomly distributed`, `Every value is proportional to time`],
    answer: 0,
    intuition: `Conceptually it's saying that every value should be in some sense the average of its neighbors,`,
    explanation: `At [19:28], the lecturer explains: "Conceptually it's saying that every value should be in some sense the average of its neighbors," when discussing the property of solutions to the Laplace equation.`,
    code: ``,
    images: ["image_1777201837572_0.png"],
    tags: ["Laplace"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 18,
    timestamp: `20:49`,
    question: `How does the lecturer relate the heat equation to the Laplace equation?`,
    options: [`They are completely unrelated equations`, `The heat equation is always harder to solve than the Laplace equation`, `In the long run (steady state), the solution to the heat equation is the same as the solution to the Laplace equation`, `The heat equation is just the Laplace equation with a negative sign`],
    answer: 2,
    intuition: `How is this related to the laplace equation well if i keep letting this heat flow longer and longer and longer really interesting point the solution is the same as the solution to the laplace equation.`,
    explanation: `At [20:49], the lecturer explains: "How is this related to the laplace equation well if i keep letting this heat flow longer and longer and longer really interesting point the solution is the same as the solution to the laplace equation."`,
    code: ``,
    images: ["image_1777202867537_0.png"],
    tags: ["Relationship", "Laplace", "Diffusion"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 19,
    timestamp: `22:24`,
    question: `Why might the wave equation be harder to solve numerically than the Laplace equation?`,
    options: [`Because it requires more memory`, `Because numerical errors propagate along the wave for a long time`, `Because it always has complex-valued solutions`, `Because it can only be solved with quantum computers`],
    answer: 1,
    intuition: `Why might this equation be a little bit harder to solve well one thing you notice even from looking at this this movie of a real swimming pool is that little bumps in the surface kind of get carried along the wave for a long long time and so what that means is if you make any kind of numerical error when you're solving the wave equation those errors also will be propagated in kind of a nasty way forward through time.`,
    explanation: `At [22:24], the lecturer explains: "Why might this equation be a little bit harder to solve well one thing you notice even from looking at this this movie of a real swimming pool is that little bumps in the surface kind of get carried along the wave for a long long time and so what that means is if you make any kind of numerical error when you're solving the wave equation those errors also will be propagated in kind of a nasty way forward through time."

-  what are the difference between the two ? #card
- for eulerian , you are like a bear waiting for salmon to come to you whereas in langrangian you are a control freak keeping track of every particle. langragian is #pointcloud .

-  how to pick the right tool for the job? can you mix the two?  #card
- you can mix it.

Another angle is how to formulate the #PDEs in the first.

- What is the strategy on solving #PDEs ? #strategy #card
-`,
    code: ``,
    images: ["image_1777202890474_0.png", "image_1777203645522_0.png", "image_1777203756379_0.png", "image_1777203884392_0.png", "image_1777203938182_0.png", "image_1777204000145_0.png"],
    tags: ["Equation/Wave", "vs/langrangianvsEulerian"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 20,
    timestamp: `35:36`,
    question: `In discretizing the first derivative, what basic approach does the lecturer present?`,
    options: [`Using the chain rule to find the derivative analytically`, `Approximating the derivative using a limit definition with differences between neighboring values`, `Using Fourier transforms to compute derivatives`, `Looking up derivatives in a pre-computed table`],
    answer: 1,
    intuition: `We can approximate the derivative using values that we know we can say all right i want to know the derivative at x i i know the value at x i and i don't know a value infinitesimally close but i can at least just look at my closest neighbor u i plus 1 take a difference divide by h the spacing the distance between these.`,
    explanation: `At [35:54], the lecturer describes approximating the first derivative: "We can approximate the derivative using values that we know we can say all right i want to know the derivative at x i i know the value at x i and i don't know a value infinitesimally close but i can at least just look at my closest neighbor u i plus 1 take a difference divide by h the spacing the distance between these."`,
    code: ``,
    images: ["image_1777211105275_0.png"],
    tags: [],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 21,
    timestamp: `37:34`,
    question: `How does the lecturer suggest approximating the second derivative?`,
    options: [`By using the first derivative approximation twice`, `By using Lagrange multipliers`, `By always using central differences`, `By using Monte Carlo integration`],
    answer: 0,
    intuition: `One idea is to say hey we know how to take a first derivative we know how to approximate a first derivative so why don't we approximate the first derivative of our approximate first derivative.`,
    explanation: `At [37:50], the lecturer explains: "One idea is to say hey we know how to take a first derivative we know how to approximate a first derivative so why don't we approximate the first derivative of our approximate first derivative."

-`,
    code: ``,
    images: ["image_1777211148400_0.png"],
    tags: ["Approximation"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 22,
    timestamp: `39:46`,
    question: `What are two approaches mentioned for discretizing the Laplacian on different geometries?`,
    options: [`Finite element method and boundary element method`, `Monte Carlo method and simulated annealing`, `Finite difference on grids and cotangent formula on triangle meshes`, `Particle systems and procedural generation`],
    answer: 2,
    intuition: `One is to stick with this finite difference idea... i add up my four immediate neighbors i subtract four times myself and i divide by the square of the spacing the grid spacing.`,
    explanation: `At [40:05], the lecturer describes the grid approach: "One is to stick with this finite difference idea... i add up my four immediate neighbors i subtract four times myself and i divide by the square of the spacing the grid spacing." Then at [40:38], he describes the mesh approach: "Here there's a well-known formula for the laplacian called the cotan formula."`,
    code: ``,
    images: ["image_1777211252493_0.png"],
    tags: ["pointcloud"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 23,
    timestamp: `41:37`,
    question: `What is the approach described for numerically solving the Laplace equation?`,
    options: [`Using complex contour integration`, `Setting the finite difference approximation of the Laplacian to zero at every grid cell`, `Solving the wave equation and letting time go to infinity`, `Using symbolic differentiation software`],
    answer: 1,
    intuition: `We know now that the laplacian can be approximated by this finite difference formula we just set that finite difference to zero at every grid cell.`,
    explanation: `At [41:56], the lecturer states: "We know now that the laplacian can be approximated by this finite difference formula we just set that finite difference to zero at every grid cell."
#jacobi`,
    code: ``,
    images: ["image_1777211333635_0.png"],
    tags: ["Laplace"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
  {
    id: 24,
    timestamp: `44:01`,
    question: `What approach does the lecturer suggest for solving the system of equations arising from the discretized Laplace equation?`,
    options: [`Solving the system by hand`, `Converting it to a matrix equation and using sparse linear solvers`, `Using the Newton-Raphson method`, `Using gradient descent`],
    answer: 1,
    intuition: `What we want to do generally is turn a PD like this turn the system of equations into some matrix equation that we can hand off to a linear solver.`,
    explanation: `At [44:01], the lecturer explains: "What we want to do generally is turn a PD like this turn the system of equations into some matrix equation that we can hand off to a linear solver."

- what are two "basic" boundary condition for discrete laplace ? #Laplace #BoundaryConditions
-  #Dirichlet #neumann , there is also robin.
- what does  tell you? #card
-  it just means prescribe values.
- what does  tell you? #card
-
- satisfying boundary conditions are no big matter , what's important is to satisfy every value in the interior. can we always satisfy 1D laplace given Dirichlet coundary conditions? #card
- {:height 578, :width 716} - The answer is yes becauase it's easy to do it for a point
- satisfying boundary conditions are no big matter , what's important is to satisfy every value in the interior. can we always satisfy laplace given Neumann coundary conditions? #card
- No because second derviative is a rate of change of first derivative . if first derivative is not changing , than second derivative is not working.

- 2D #Laplace #BoundaryConditions
- can we satisfy 2d laplace w/ Dirichet bc ? #card
-
- can we satisfy 2d laplace w/ Neumann bc ? #card
- short answer yes because of what goes in must come out.

#Verification is important because numerlcal libraries won't tell you if you have made a mistake, after solving AX=b  , compute ||b-AX||.
- how to solve the heat equation?  #card
-
- Solving the wave equation ?  #card
-
- what's a powerway of developing algorithms? #AlgorithmDesignTechnique #Algorithm  #card
- if you can formulate your graphic , simulation problems as PDES rather in terms of discrete data , it's easier to port those algorithms to different context. If you start by thinking in terms of graphs  or grid , it won't be clear to convert from one domain to another.`,
    code: ``,
    images: ["image_1777211476986_0.png", "image_1777211651120_0.png", "image_1777211776507_0.png", "image_1777211852618_0.png", "image_1777212043598_0.png", "image_1777212242234_0.png", "image_1777212531236_0.png", "image_1777212731913_0.png", "image_1777212918312_0.png", "image_1777212992447_0.png"],
    tags: ["BoundaryConditions/Dirichlet", "BoundaryConditions/Neumann", "Equation/Heat", "Equation/Wave", "mindset"],
    source: `lectures/cg-23-lecture-quiz.md`,
  },
]

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
        <img key={i} src={`/assets/${img}`} alt={`slide-${i+1}`}
          onError={e => { e.target.style.display='none' }}
          style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid #2a2a3a', display: 'block' }} />
      ))}
    </div>
  )
}

export default function Lec23Quiz() {
  const [screen, setScreen] = useState('welcome')
  const [qIdx, setQIdx] = useState(0)
  const [answers, setAnswers] = useState(Array(quizData.length).fill(null))
  const [selected, setSelected] = useState(null)
  const [showExp, setShowExp] = useState(false)
  const [reviewMode, setReviewMode] = useState(false)
  const [expTab, setExpTab] = useState('explanation')
  const [codeCopied, setCodeCopied] = useState(false)
  const { t, start, pause, reset: resetTimer } = useTimer()
  const q = quizData[qIdx]

  const C = {
    bg: '#0a0a0f',
    surface: '#111118',
    border: '#2a2a3a',
    accent: '#f87171',
    text: '#e2e8f0',
    muted: '#94a3b8',
    ok: '#10b981',
    err: '#ef4444',
    warn: '#f59e0b',
  }

  const base = { fontFamily: 'system-ui,sans-serif', margin: 0, padding: 0, minHeight: '100vh',
    background: `linear-gradient(135deg, ${C.bg} 0%, #0f0f1a 100%)`, color: C.text,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }
  const box = { maxWidth: '900px', width: '100%', background: C.surface, borderRadius: '16px',
    border: `1px solid ${C.border}`, padding: '2.5rem', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }
  const btn = (extra={}) => ({ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none',
    background: C.accent, color: C.text, fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', ...extra })
  const tag = (color=C.accent) => ({ padding: '0.25rem 0.75rem', borderRadius: '6px',
    background: `${color}22`, color, fontSize: '0.8rem', fontWeight: '600' })

  useEffect(() => { if (screen==='quiz' && !showExp && !reviewMode) start(); else pause() }, [screen,showExp,reviewMode,qIdx])

  const isCorrect = useCallback((question, ans) => {
    if (ans === null || ans === undefined) return false
    return ans === question.answer
  }, [])

  const handleSubmit = () => {
    const a = [...answers]; a[qIdx] = selected; setAnswers(a); setShowExp(true); setExpTab('explanation')
  }
  const handleNext = () => {
    if (qIdx < quizData.length - 1) { setQIdx(q => q+1); setSelected(null); setShowExp(false) }
    else { setScreen('results'); pause() }
  }
  const handlePrev = () => {
    if (qIdx > 0) { setQIdx(q => q-1); setSelected(null); setShowExp(false) }
  }
  const handleRestart = () => {
    setScreen('welcome'); setQIdx(0); setAnswers(Array(quizData.length).fill(null))
    setSelected(null); setShowExp(false); setReviewMode(false); resetTimer()
  }
  const handleReview = () => { setScreen('quiz'); setQIdx(0); setShowExp(false); setReviewMode(true) }

  const score = answers.filter((a,i) => isCorrect(quizData[i],a)).length
  const pct = Math.round(score / quizData.length * 100)

  if (screen === 'welcome') return (
    <div style={base}>
      <div style={box}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Waves size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 23: PDEs & Physical Animation</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Elliptic/Parabolic/Hyperbolic PDEs, Laplacian, Wave/Heat Equations</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-23-lecture-quiz.md</p>
          <p style={{ color: C.accent, fontWeight: 600 }}>Q1–Q24 · 24 questions</p>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>24</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Questions</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>~8min</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Est. Time</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>1</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Part</div></div>
          </div>
        </div>

        <button style={btn({ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' })}
          onClick={() => { setScreen('quiz'); start() }}>
          <Waves size={20} /> Start Quiz
        </button>
        <a href='/' style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', color: C.muted, fontSize: '0.875rem' }}>← All quizzes</a>
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
          <div style={{ fontSize: '1.2rem', color: C.muted, marginBottom: '0.75rem' }}>{score} / {quizData.length} correct</div>
          <div style={{ color: C.muted }}>{pct>=90?'Excellent!':pct>=70?'Great work!':pct>=50?'Good progress!':'Keep studying!'}</div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={btn({ flex: 1, justifyContent: 'center' })} onClick={handleReview}>
            <BookOpen size={20} /> Review Answers
          </button>
          <button style={btn({ flex: 1, justifyContent: 'center' })} onClick={handleRestart}>
            <RefreshCw size={20} /> Restart
          </button>
        </div>
        <a href='/' style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', color: C.muted, fontSize: '0.875rem' }}>← All quizzes</a>
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
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 23: PDEs & Physical Animation</span>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', color: C.muted, fontSize: '0.875rem', alignItems: 'center' }}>
              <span><Clock size={14} style={{ display:'inline', verticalAlign:'middle', marginRight:'0.25rem' }} />{formatTime(t)}</span>
              <span>{qIdx+1}/24</span>
              <span style={{ color: C.accent }}>✓ {score}</span>
            </div>
          </div>
          <div style={{ height: '5px', background: C.border, borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.round((qIdx+1)/24*100)}%`, background: C.accent, transition: 'width 0.3s' }} />
          </div>
        </div>

        {/* Question */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem', alignItems: 'center' }}>
            <span style={tag()}>Q{q.id}</span>
            <span style={tag()}>[{q.timestamp}]</span>
            <span style={{ color: '#475569', fontSize: '0.72rem', fontFamily: 'monospace', marginLeft: 'auto' }}>{q.source}</span>
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, lineHeight: 1.55, marginBottom: '1.25rem' }}>{q.question}</h2>
        </div>

        {/* Options */}
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

        {/* Explanation (shown after submit) */}
        {(showExp || reviewMode) && (
          <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: `1px solid ${C.border}` }}>
            {/* Tab switcher */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {['intuition','explanation','images','tags'].map(tab => {
                return (
                  <button key={tab} onClick={() => setExpTab(tab)}
                    style={{ padding: '0.3rem 0.85rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                      background: expTab===tab ? C.accent : '#1e1e2e', color: expTab===tab ? '#0a0a0f' : C.muted,
                      outline: expTab===tab ? 'none' : `1px solid ${C.border}` }}>
                    {tab==='intuition' ? '💡 Intuition' : tab==='explanation' ? '📖 Explanation' : tab==='images' ? '🖼 Slides' : '🔗 Tags'}
                  </button>
                )
              })}
            </div>
            {expTab === 'intuition' && (
              q.intuition
                ? (
                  <div style={{ borderLeft: `3px solid ${C.accent}`, paddingLeft: '1rem' }}>
                    <p style={{ margin: '0 0 0.25rem', fontSize: '0.72rem', fontWeight: 700, color: C.accent, letterSpacing: '0.06em' }}>KEY INSIGHT FROM LECTURE</p>
                    <p style={{ margin: 0, lineHeight: 1.75, color: C.text, fontSize: '1rem', fontStyle: 'italic' }}>"{q.intuition}"</p>
                  </div>
                )
                : <p style={{ color: '#475569', margin: 0 }}>No intuition extracted.</p>
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
            {expTab === 'tags' && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {q.tags.length > 0
                  ? q.tags.map((tg,i) => <span key={i} style={tag()}>{tg}</span>)
                  : <span style={{ color: '#475569' }}>No tags.</span>}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handlePrev} disabled={qIdx===0}
            style={btn({ background: C.border, opacity: qIdx===0?0.4:1, cursor: qIdx===0?'not-allowed':'pointer' })}>
            <ChevronLeft size={20} /> Prev
          </button>
          {!(showExp||reviewMode) && (
            <button onClick={handleSubmit} disabled={selected===null}
              style={btn({ flex:1, justifyContent:'center', opacity: selected===null?0.4:1, cursor: selected===null?'not-allowed':'pointer' })}>
              Submit Answer
            </button>
          )}
          {(showExp||reviewMode) && (
            <button onClick={handleNext} style={btn({ flex:1, justifyContent:'center' })}>
              {qIdx < 24-1 ? 'Next Question' : 'View Results'} <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
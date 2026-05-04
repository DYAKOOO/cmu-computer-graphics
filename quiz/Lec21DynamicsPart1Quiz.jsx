'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Activity } from 'lucide-react'

// Source: lectures/cg-21-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 21: Dynamics & Time Integration — Part 1 · QQF1–QQ29 · 32 questions (29 MCQ, 3 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-21-lecture-quiz.md 21

const quizData = [
  {
    id: 1,
    qid: `QF1`,
    qtype: `FLOW`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `The lecture opens by contrasting keyframe animation (lecture 20) with physically-based animation. What specific limitation of keyframing does physics-based simulation address, and at what cost?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `Keyframe animation requires an animator to manually specify every joint pose at every keyframe. For complex secondary motion (hair, cloth jiggling, splashing water) this requires thousands of keyframes and expert judgment. Physics-based simulation generates motion automatically from Newton's laws — given initial conditions and forces, the trajectory follows. The cost: far more computation (solving ODEs/PDEs every frame), less direct artistic control (you set up the physics, not the path), and numerical instability risks if timesteps are too large or forces too stiff.`,
    intuition: `Keyframe = "tell the computer what to draw." Physics = "tell the computer the rules and let it figure out what to draw."`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 2,
    qid: `QF2`,
    qtype: `FLOW`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `The lecture introduces three time integrators: Forward Euler, Backward Euler, and Symplectic Euler. What failure of Forward Euler motivates each alternative, and what is the key trade-off of each?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `Forward Euler (explicit): uses current force/velocity to update. Simple and fast, but adds energy to the system over time — unstable with large timesteps or stiff forces. Backward Euler (implicit): solves for the next state using the next force — requires a linear system solve each step but is unconditionally stable. Symplectic Euler: update velocity with current force (explicit), then use the *new* velocity to update position. No linear solve needed (cheap), and it exactly conserves energy for harmonic oscillators (unlike Forward Euler). It's the practical sweet spot for most animation simulations.`,
    intuition: `Forward Euler adds energy → unstable. Backward Euler removes energy → stable but expensive. Symplectic Euler conserves energy → stable and cheap.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 3,
    qid: `QF3`,
    qtype: `ORDER`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `Put these dynamics topics in the order lecture 21 introduces them: particle systems and mass-spring networks / Symplectic Euler integrator / Newton's 2nd law as the "animation equation" / Forward Euler and stability analysis`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `Newton's 2nd law as the animation equation → Forward Euler and stability analysis → Symplectic Euler integrator → Particle systems and mass-spring networks`,
    intuition: `Establish the physics (Newton) → naively integrate it (Euler) → show the failure mode → fix it (Symplectic) → apply to complex systems (particles, springs).`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 1,
    qid: `Q1`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `04:15`,
    question: `What is the key difference between kinematics and dynamics?`,
    options: [`Kinematics describes motion without reference to causes; dynamics studies forces and their effect on motion`, `Kinematics uses differential equations; dynamics uses algebraic equations`, `Kinematics requires numerical simulation; dynamics has closed-form solutions`, `Kinematics applies only to rigid bodies; dynamics applies to deformable bodies`],
    answer: 0,
    answerText: ``,
    intuition: `Think of kinematics as a movie script that just says "the ball goes here, then there" — no explanation needed. Dynamics is the physics engine that asks "WHY does it go there?" — what forces pushed it. Spline interpolation is kinematic: you just specify where things should be, not why they move there.`,
    explanation: `At [04:15], the lecturer states: "Dynamics is concerned with the study of forces and their effect on motion, as opposed to kinematics, which studies the motion of objects without reference to its causes." Spline/keyframe interpolation is a kinematic description because you specify positions without modeling the forces that would produce them.`,
    code: ``,
    images: ["lec21_slide_02.png"],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 2,
    qid: `Q2`,
    qtype: `CLASSIFICATION`,
    format: `mcq`,
    timestamp: `05:26`,
    question: `Is spline/keyframe interpolation a dynamic or kinematic description of motion?`,
    options: [`Kinematic only for 2D scenes; dynamic for 3D scenes`, `Dynamic, because it requires solving differential equations`, `Kinematic, because it describes motion purely as spline curves without modeling forces`, `Dynamic, because it uses time derivatives to describe motion`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [05:26], the lecturer explains: "We just said, oh, well, we want the motion to go here and then here and then here at these different moments in time... That's not a very dynamic description. We're not really understanding what forces would cause an object to move toward those points. So keyframe interpolation, spline interpolation is a kinematic description of motion."`,
    code: ``,
    images: ["lec21_slide_02.png"],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 3,
    qid: `Q3`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `05:46`,
    question: `What does the lecturer call "the animation equation"?`,
    options: [`The Euler-Lagrange equation: d/dt(∂L/∂q̇) = ∂L/∂q`, `The wave equation: ∂²u/∂t² = c²∂²u/∂x²`, `Newton's second law: F = ma`, `The rendering equation: L_o = L_e + ∫ f_r L_i cos θ dω`],
    answer: 2,
    answerText: ``,
    intuition: `Just as the rendering equation is THE equation for light transport, F = ma is THE equation for animation. Everything else — Lagrangian mechanics, numerical integration schemes, particle systems — is just machinery to solve this one equation for different scenarios.`,
    explanation: `At [05:46], the lecturer says: "In rendering, we had the rendering equation. It's only natural that in computer animation, we have the animation equation. The animation equation is just F equals ma, right? Force equals mass times acceleration." This second-order differential equation governs all physically-based animation.`,
    code: ``,
    images: ["lec21_slide_03.png", "image_1777615949421_0.png"],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 4,
    qid: `Q4`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `07:18`,
    question: `In the generalized-coordinates framework, what does Q(t) represent?`,
    options: [`The total kinetic energy of the system at time t`, `The vector of all variables describing the complete state of the system at time t`, `The constraint forces acting on the system at time t`, `The quaternion rotation of the primary rigid body at time t`],
    answer: 1,
    answerText: ``,
    intuition: `Think of Q as one giant zip-file of the entire scene state. For 6 billiard balls in 2D, Q has 12 numbers (x,y for each ball). For a pendulum, Q is just the angle θ. Every problem maps to "where does this point travel in Q-space over time?"`,
    explanation: `At [07:18], the lecturer explains: "Any system has a configuration, Q, that's a function of time. And that configuration is just basically a big long list of all the variables that describe what the system looks like at the current moment in time."`,
    code: ``,
    images: ["image_1777616083648_0.png"],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 5,
    qid: `Q5`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `07:45`,
    question: `What is "generalized velocity" Q̇?`,
    options: [`The average speed of all particles in the scene`, `The velocity of the object with the largest mass in the system`, `The rotational velocity of the center of mass`, `The time derivative of the generalized coordinates Q`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [07:45], the lecturer states: "The system also has a velocity. The velocity is just the time derivative of all those quantities." The dot notation Q̇ means taking one time derivative of every coordinate in Q simultaneously.`,
    code: ``,
    images: ["image_1777616137808_0.png"],
    tags: ["lifemeaning"],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 6,
    qid: `Q6`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `08:27`,
    question: `What is a constraint g(q, q̇, t) = 0 used for in the equations of motion?`,
    options: [`It specifies the rendering parameters for the animation`, `It sets the initial conditions for the simulation`, `It describes rules that objects must obey at all times, such as staying on a track`, `It defines the kinetic energy of the system`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [08:27], the lecturer explains: "There also will be typically some kind of constraints, something that says what rules must the objects obey at all time? For instance, if our configuration is the position of a roller coaster, we might have a constraint that says that roller coaster remains on the track... We will be able to express a lot of these constraints with a function g that's equal to zero if the constraint is satisfied."`,
    code: ``,
    images: ["image_1777616486733_0.png"],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 7,
    qid: `Q7`,
    qtype: `REFORMULATION`,
    format: `mcq`,
    timestamp: `19:08`,
    question: `What is the advantage of splitting Newton's second law Q̈ = F/M into two first-order ODEs?`,
    options: [`It doubles the number of equations but halves the computation time`, `It makes numerical solution easier by expressing each update in terms of known quantities`, `It makes the equations analytically solvable for all systems`, `It eliminates the need for constraint handling in the simulation`],
    answer: 1,
    answerText: ``,
    intuition: `A second-order ODE says "I need two previous values to step forward." But a pair of first-order ODEs says "I only need the current value to step forward." This is exactly what numerical solvers need: given current state, compute next state. Introducing v = Q̇ as a separate variable converts "update Q using Q and Q̇" into two clean steps.`,
    explanation: `At [19:08], the lecturer explains: "We can split this up by introducing a new dummy variable for velocity. We can say Q dot is equal to V... Why do this? Mathematically, it's equivalent, right? We didn't really change what the equation means, but splitting things up this way will make it easy to talk about solving these kinds of equations numerically."`,
    code: ``,
    images: ["image_1777616554178_0.png"],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 8,
    qid: `Q8`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `20:01`,
    question: `For a rock thrown upward under gravity (only force), what is the solution Q(t)?`,
    options: [`Q(t) = Q₀ cos(√(g/m)t) (oscillatory, like a pendulum)`, `Q(t) = Q₀ e^(gt/m) (exponential growth)`, `Q(t) = Q₀ + tV₀ (linear in time, no gravity term)`, `Q(t) = Q₀ + tV₀ + t²g/(2m) (quadratic, from integrating constant acceleration)`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [20:01]–[22:29], the lecturer derives: "Q dot equals V and V dot equals g over m... The velocity V(t) = V₀ + t·g/m... Q(t) = Q₀ + t·V₀ + t²·g/(2m)." Since the force (gravity) is constant, acceleration is constant, velocity is linear in time, and position is quadratic.`,
    code: ``,
    images: ["image_1777616697456_0.png"],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 9,
    qid: `Q9`,
    qtype: `FACTUAL`,
    format: `mcq`,
    timestamp: `13:40`,
    question: `What is the general form of an ordinary differential equation (ODE) in generalized coordinates?`,
    options: [`F = -∇U(Q) (gradient of potential)`, `∂u/∂t = α∇²u (heat equation)`, `∇²u = 0 (Laplace equation)`, `Q̇ = f(Q, Q̇, t), a function relating the rate of change of Q to its current state`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [13:40], the lecturer defines: "The equation that we're interested in is the one that says the change in time of the positions of the generalized coordinates is just equal to some velocity function f evaluated for the current position, current velocities, and time." An ODE involves only time derivatives (no spatial derivatives), distinguishing it from a PDE.`,
    code: ``,
    images: ["lec21_slide_08.png"],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 10,
    qid: `Q10`,
    qtype: `ANALYSIS`,
    format: `mcq`,
    timestamp: `14:44`,
    question: `For the scalar ODE u̇ = au, what is the exact solution and what does the sign of a determine?`,
    options: [`u(t) = u₀ + at; sign of a determines whether u grows or shrinks linearly`, `u(t) = Be^(at); a > 0 gives exponential growth, a < 0 gives exponential decay`, `u(t) = B/t; a determines the rate of hyperbolic decay`, `u(t) = B cos(at); a determines the oscillation frequency`],
    answer: 1,
    answerText: ``,
    intuition: `The derivative equals the function itself (up to a constant). What function IS its own derivative? The exponential. This is why e^x is so fundamental in physics — it's the natural solution to any system where growth rate is proportional to current size (bacteria, radioactive decay, charging capacitors, and many ODE approximations).`,
    explanation: `At [15:36]–[16:34], the lecturer states: "u(t) = Be^(at) is a solution to this differential equation." If a > 0, u grows exponentially; if a < 0, u decays toward zero. This is important: the exact same equation with different sign of a describes completely opposite behaviors.`,
    code: ``,
    images: ["image_1777616926016_0.png"],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 11,
    qid: `Q11`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `17:37`,
    question: `Why is the pendulum harder to simulate than a ballistic trajectory (rock thrown through air)?`,
    options: [`The pendulum requires tracking more particles`, `The pendulum requires a 3D coordinate system while the ballistic trajectory is 2D`, `The pendulum has a constraint (stays on a circle), and there is no closed-form solution`, `Gravity has a different magnitude for the pendulum`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [23:19]–[24:02], the lecturer explains: "This is exactly the same as the problem we just looked at, the problem of throwing a rock through the air, except that now we've added a constraint... We now have a constraint that says the end of the pendulum has to sit on a unit circle." Adding even this simple constraint means no closed-form analytical solution exists.`,
    code: ``,
    images: ["lec21_slide_11.png"],
    tags: ["Constraint"],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 12,
    qid: `Q12`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `24:46`,
    question: `What is Lagrangian mechanics and what is its central object L?`,
    options: [`A constraint-force approach; L is the Lagrange multiplier vector`, `A way to discretize PDEs on a mesh; L is the mesh Laplacian`, `A technique using L = K - U (kinetic minus potential energy); Euler-Lagrange equations then give the dynamics`, `A method for solving ODEs numerically using L as the step-size parameter`],
    answer: 2,
    answerText: ``,
    intuition: `Instead of drawing force diagrams and reasoning about directions, you just write down two scalars: K (how fast things move) and U (how much potential energy is stored). No vectors, no coordinate system confusion. The Lagrangian L = K - U captures everything. The Euler-Lagrange equations then automatically crank out the equations of motion.`,
    explanation: `At [24:46]–[25:44], the lecturer says: "Write down the kinetic energy K... Write down the potential energy U... And then write down the Lagrangian L, which is just the difference, kinetic minus potential energy. Once you know the Lagrangian, no matter what system you're looking at, the dynamics are then given by the Euler-Lagrange equations."`,
    code: ``,
    images: ["image_1777617235014_0.png", "lec21_slide_13.png"],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 13,
    qid: `Q13`,
    qtype: `FORMULA`,
    format: `mcq`,
    timestamp: `25:44`,
    question: `What are the Euler-Lagrange equations?`,
    options: [`∂L/∂t = ∂L/∂q + ∂L/∂q̇ (total time derivative identity)`, `d/dt(∂L/∂q̇) = ∂L/∂q (time derivative of velocity-gradient equals position-gradient)`, `L = 0 at all times (Lagrangian is always zero at equilibrium)`, `d²L/dt² = ∂L/∂q (second time derivative equals spatial gradient)`],
    answer: 1,
    answerText: ``,
    intuition: `The left side d/dt(∂L/∂q̇) generalizes "mass × acceleration" — it's basically momentum (∂L/∂q̇) changing over time. The right side ∂L/∂q generalizes "force" — how much L changes when you shift position. So Euler-Lagrange is really just F = ma in disguise, but expressed through energies instead of vectors.`,
    explanation: `At [25:44], the lecturer states: "The dynamics are then given by the Euler-Lagrange equations, which say this: the time derivative of the derivative of the Lagrangian with respect to velocity is equal to the derivative of Lagrangian with respect to the configuration." The left term becomes generalized mass×acceleration; the right becomes generalized force.`,
    code: ``,
    images: ["lec21_slide_13.png"],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 14,
    qid: `Q14`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `28:33`,
    question: `For a pendulum of mass m and length L, what are the generalized coordinates?`,
    options: [`The (x, y, θ) triple: position and orientation`, `The angle θ the pendulum makes with vertical (one degree of freedom)`, `The arc length traveled along the circular path`, `The xy Cartesian position of the pendulum bob`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [28:50], the lecturer explains: "A pretty natural thing to do would be to say rather than bothering with xy and then worrying that x² + y² has to equal length squared, why don't we just describe the state of the system by the angle theta that the pendulum makes with the vertical direction? That's a perfectly good encoding of the state and we know it always respects the constraint."`,
    code: ``,
    images: ["image_1777617491824_0.png", "image_1777617646153_0.png"],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 15,
    qid: `Q15`,
    qtype: `DERIVATION`,
    format: `mcq`,
    timestamp: `30:47`,
    question: `For the pendulum, what is the potential energy U in terms of θ?`,
    options: [`U = ½k(L - L₀)² (spring potential)`, `U = mgL cos(θ) (height = L cos θ from pivot)`, `U = mgL sin(θ) (horizontal component)`, `U = ½mL²θ̇² (kinetic-like term)`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [30:47], the lecturer derives: "Our potential energy is just MGH, mass times gravity times height, which in terms of theta we can write as MGL cos theta. We're just getting the vertical component of the vector from the center of the circle to the end of the pendulum multiplied by mg."`,
    code: ``,
    images: ["image_1777617646153_0.png"],
    tags: ["Derivation"],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 16,
    qid: `Q16`,
    qtype: `DERIVATION`,
    format: `mcq`,
    timestamp: `34:00`,
    question: `What is the pendulum equation of motion derived via Euler-Lagrange?`,
    options: [`θ̈ = -gL sin(θ) (wrong length factor)`, `θ̈ = (g/L) cos(θ) (cosine rather than sine)`, `θ̈ = -(g/L) θ (small-angle approximation only)`, `θ̈ = -(g/L) sin(θ) (exact equation of motion)`],
    answer: 3,
    answerText: ``,
    intuition: `The Euler-Lagrange machinery automatically produces: angular acceleration = -(gravity/length) × sin(angle). The sine makes physical sense: when θ = 0 (hanging straight down), no restoring force. When θ = 90°, maximum restoring force. The minus sign says the force opposes displacement — it pulls back toward equilibrium.`,
    explanation: `At [34:00], the lecturer derives from L = m(½L²θ̇² + gL cos θ): "All right, just equate those two quantities... we get theta double dot equals minus G over L sine theta. The acceleration, the angular acceleration, theta double dot, is equal to minus this constant G over the length of the rod L times the sine of the angle theta."`,
    code: ``,
    images: ["image_1777617491824_0.png", "image_1777617646153_0.png"],
    tags: ["Derivation", "Approximation"],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 17,
    qid: `Q17`,
    qtype: `APPROXIMATION`,
    format: `mcq`,
    timestamp: `35:49`,
    question: `For small angles θ, what approximation simplifies the pendulum equation?`,
    options: [`cos(θ) ≈ 1 - θ²/2, leading to a constant-force equation`, `sin(θ) ≈ 0, giving θ̈ ≈ 0 (no acceleration at small angles)`, `e^(iθ) ≈ 1 + iθ, converting the equation to complex exponentials`, `sin(θ) ≈ θ, converting θ̈ = -(g/L)sin(θ) into the harmonic oscillator θ̈ = -(g/L)θ`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [35:49]–[36:18], the lecturer explains: "I could just consider very, very small angles... for small angles theta, then we can approximate sine theta as just theta... so we could pretend that this equation was instead theta double dot equals minus g over L theta." This converts the nonlinear pendulum into a linear harmonic oscillator.`,
    code: ``,
    images: ["image_1777617491824_0.png", "image_1777617646153_0.png"],
    tags: ["Approximation"],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 18,
    qid: `Q18`,
    qtype: `SOLUTION`,
    format: `mcq`,
    timestamp: `37:27`,
    question: `What is the solution to the small-angle pendulum (harmonic oscillator) θ̈ = -(g/L)θ?`,
    options: [`θ(t) = A/t (hyperbolic decay)`, `θ(t) = A e^(-g/L · t) (exponential decay)`, `θ(t) = A cos(√(g/L) t + φ) (sinusoidal oscillation)`, `θ(t) = A + Bt (linear drift)`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [37:27], the lecturer derives: "If theta of t is equal to a cosine t times root g over l plus b, then if I differentiate this twice I get g over l minus times cosine of the same argument. I've solved this second order differential equation." This is the harmonic oscillator — cosine oscillation at frequency √(g/L).`,
    code: ``,
    images: ["image_1777617491824_0.png", "image_1777617646153_0.png"],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 19,
    qid: `Q19`,
    qtype: `FACTUAL`,
    format: `mcq`,
    timestamp: `39:14`,
    question: `Does the pendulum equation θ̈ = -(g/L)sin(θ) have a closed-form solution for large angles?`,
    options: [`Yes: θ(t) = 2 arctan(tanh(√(g/L) t/2))`, `Yes, but only for L = 1 (unit length pendulum)`, `Yes, by converting to complex exponentials`, `No — there is no closed-form solution; numerical approximation is required`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [39:14], the lecturer states: "In general, there is no closed form solution to this equation. Meaning there is simply no function you can just write down that gives you the solution to the equations of motion for all time." Even this simple system — one mass, one constraint, one degree of freedom — requires numerical methods for accurate simulation.`,
    code: ``,
    images: ["image_1777617491824_0.png", "image_1777617646153_0.png"],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 20,
    qid: `Q20`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `42:55`,
    question: `Why is the double pendulum a famous example in dynamics?`,
    options: [`It demonstrates perfectly periodic motion regardless of initial conditions`, `It is the simplest system with a closed-form solution`, `It can be solved analytically using Lagrangian mechanics`, `It is a chaotic system: tiny changes in initial conditions produce completely different trajectories`],
    answer: 3,
    answerText: ``,
    intuition: `Adding ONE extra pendulum to the original converts a predictable oscillator into pure chaos. This is the butterfly effect made visible — a millimeter difference in starting angle leads to completely different behavior within seconds. It's a visceral demonstration of why real-world simulation needs numerical methods.`,
    explanation: `At [42:55], the lecturer explains: "This is now completely different from what it did the first time. And in fact, if you study this system a little bit, what you discover is it's a chaotic system, meaning that even extremely small changes to the initial conditions can result in extremely large changes to the trajectory."`,
    code: ``,
    images: ["image_1777617857864_0.png"],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 21,
    qid: `Q21`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `43:52`,
    question: `What is the "N-body problem" in the context of dynamics?`,
    options: [`Simulating a system of N rigid bodies with no gravity`, `Solving a system with N algebraic constraints`, `Simulating N particles each subject to pairwise forces (e.g., gravity), which becomes chaotic for N ≥ 3`, `Finding the N eigenvalues of the mass matrix`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [43:52]–[45:02], the lecturer describes the solar system analogy: "For two bodies... we can just solve for the position of the earth. That's really easy. But as soon as we add that third body in, we again get chaotic solutions. We get dynamics that have no closed form." Galaxy simulations extend this to millions/billions of particles.`,
    code: ``,
    images: ["image_1777617912287_0.png"],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 22,
    qid: `Q22`,
    qtype: `MODEL`,
    format: `mcq`,
    timestamp: `47:53`,
    question: `What are the three forces in Craig Reynolds' flocking (boid) model?`,
    options: [`Spring force, damping force, and collision response`, `Gravity, drag, and buoyancy`, `Attraction, repulsion, and random noise`, `Cohesion (toward neighbor center), separation (repulsion from too-close neighbors), alignment (match neighbor velocities)`],
    answer: 3,
    answerText: ``,
    intuition: `Think of it from a single bird's perspective: (1) don't get isolated — move toward the crowd center; (2) don't collide — push away from anyone too close; (3) don't swim upstream — match the direction your neighbors are going. Three simple rules, emergent murmuration behavior.`,
    explanation: `At [47:53]–[48:52], the lecturer describes: "All the birds want to be attracted, they want to move toward sort of the average of their nearest neighbors... Another force is repulsion. A bird doesn't want to get too close to another bird... They also want some kind of force of alignment... go roughly in the same direction they're going in."

-`,
    code: ``,
    images: ["image_1777618046011_0.png", "image_1777618061371_0.png", "image_1777622146304_0.png", "image_1777622158188_0.png", "image_1777622213202_0.png"],
    tags: ["Model", "Darkmatter"],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 23,
    qid: `Q23`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `58:12`,
    question: `What is the potential energy of a spring with stiffness k, rest length L₀, and current length L?`,
    options: [`U = k/L (inverse distance potential)`, `U = ½k(L - L₀)² (quadratic deviation from rest length)`, `U = ½kL₀² (constant, independent of deformation)`, `U = kL (linear potential)`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [58:12]–[58:38], the lecturer states: "You might remember the potential energy of a spring is given by U equals one half K times L minus L naught squared. K is the stiffness of the spring... L is the current length of the spring, and L0 is the rest length. The more we pull on this, the bigger the potential energy gets, the more we compress it, the bigger the potential energy gets."`,
    code: ``,
    images: ["image_1777622246376_0.png"],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 24,
    qid: `Q24`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `1:00:44`,
    question: `How can cloth be modeled using a mass-spring system?`,
    options: [`Each triangle of the mesh is a rigid body; cloth is modeled as articulated joints`, `Every mesh vertex is a particle; every mesh edge is a spring; some vertices are pinned to the character`, `Cloth is modeled as a fluid with high viscosity`, `The cloth is a single particle with a large mass and many constraints`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:00:44]–[1:00:54], the lecturer explains: "Here again, we can imagine every vertex of the mesh making up the dress is a particle. Every edge in that mesh is a spring. And we have these spring forces that are keeping them close to each other, but not too close. How do we get it to work together with a character? We pin some of the vertices to points on the character model."`,
    code: ``,
    images: ["image_1777622277620_0.png", "image_1777622271859_0.png"],
    tags: ["Hair"],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 25,
    qid: `Q25`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `1:03:06`,
    question: `What is the key idea behind numerical integration of ODEs?`,
    options: [`Use random sampling (Monte Carlo) to estimate the solution`, `Replace continuous functions with Fourier series expansions`, `Replace time derivatives with finite differences; replace continuous Q(t) with discrete time samples Q_k`, `Convert ODEs to PDEs to apply spatial discretization`],
    answer: 2,
    answerText: ``,
    intuition: `A derivative asks "what is the instantaneous rate of change?" We can't compute that directly — but we CAN compute a finite difference: (Q_{k+1} - Q_k) / τ. This is literally the definition of a derivative, just with a finite τ instead of τ→0. Numerical integration = replace continuous calculus with computable arithmetic.`,
    explanation: `At [1:03:06]–[1:03:28], the lecturer states: "The key idea is that every time we see a derivative in our differential equation, we're going to replace it with differences... We're going to replace our time-continuous function q(t) with samples q_k in time. So basically we're gonna have a bunch of little snapshots."

In continuous function , derivative is evaluted at current time but in discerte case , we can chooose when to evaulate.`,
    code: ``,
    images: ["image_1777622399410_0.png"],
    tags: ["Derivatives", "vs/continuousvsDiscrete"],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 26,
    qid: `Q26`,
    qtype: `ALGORITHM`,
    format: `mcq`,
    timestamp: `1:05:56`,
    question: `What is the Forward Euler update rule?`,
    options: [`q_{k+1} = q_k - τ·f(q_{k+1}) (implicit, uses future state)`, `q_{k+1} = q_k + τ·∇²f(q_k) (uses Laplacian of velocity)`, `q_{k+1} = q_k + τ·f(q_k) (explicit, uses current state velocity)`, `q_{k+1} = ½(q_k + q_{k-1}) + τ·f(q_k) (uses two past states)`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:05:56]–[1:06:25], the lecturer derives: "The configuration q at the next time k+1 is equal to the current configuration q_k plus the time step times the velocity at the current time. All I did was shuffle around the equation and was careful to evaluate f at q_k." It is explicit because the right-hand side contains only known quantities.`,
    code: ``,
    images: ["image_1777622516653_0.png", "image_1777622708030_0.png"],
    tags: ["Euler"],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 27,
    qid: `Q27`,
    qtype: `ANALYSIS`,
    format: `mcq`,
    timestamp: `1:08:03`,
    question: `For the linear ODE u̇ = -au (a > 0), under what condition is Forward Euler stable?`,
    options: [`τ > 2/a (large time steps required)`, `τ = 1/a exactly (must match the decay constant)`, `τ < 2/a (time step must be smaller than 2 divided by a)`, `Any τ > 0 (unconditionally stable)`],
    answer: 2,
    answerText: ``,
    intuition: `Forward Euler multiplies the current value by (1 - τa) each step. If |1 - τa| > 1, the value oscillates and grows instead of decaying. The critical threshold is τa = 2 (giving factor -1, which oscillates but doesn't grow). So τ must be less than 2/a. Larger a (stiffer system) demands even smaller time steps — this is why stiff springs are expensive to simulate.`,
    explanation: `At [1:10:25]–[1:11:07], the lecturer derives: "After n steps we have (1 - τa)^n × u₀... It's going to decay only if |1 - τa| < 1. In particular, we want to make sure that tau is less than 2 over a." Stiff systems (large a) force tiny time steps.`,
    code: ``,
    images: ["image_1777622696881_0.png"],
    tags: ["Analysis", "Stability"],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 28,
    qid: `Q28`,
    qtype: `CONSEQUENCE`,
    format: `mcq`,
    timestamp: `1:11:38`,
    question: `Why does stiffness (e.g., hair, stiff springs) cause problems for Forward Euler?`,
    options: [`Stiff systems violate energy conservation, so Forward Euler gives wrong forces`, `Large stiffness constant a forces very small time steps (τ < 2/a) to maintain stability`, `Forward Euler cannot handle spring forces at all; only gravity`, `Stiff systems require non-linear solvers that Forward Euler cannot handle`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:11:38]–[1:12:06], the lecturer explains: "Think about our stiff spring. The bigger that constant k is on our spring, the smaller steps we're going to have to take with Forward Euler. Hair doesn't really stretch. So it's like a really stiff spring. So if I'm trying to simulate hair, I'm not going to take these tiny, tiny time steps. I want to generate animation at a rate of 30 times a second, but I might have to take time steps thousands of times per second to avoid my simulation from blowing up."`,
    code: ``,
    images: ["image_1777622732112_0.png"],
    tags: [],
    source: `lectures/cg-21-lecture-quiz.md`,
  },
  {
    id: 29,
    qid: `Q29`,
    qtype: `ALGORITHM`,
    format: `mcq`,
    timestamp: `1:12:32`,
    question: `What is the Backward Euler update rule and why is it called "implicit"?`,
    options: [`q_{k+1} = 2q_k - q_{k-1} + τ²·f(q_k); it is implicit because it uses two past states`, `q_{k+1} = q_k·exp(τ·a); it is implicit because the exponential cannot be computed directly`, `q_{k+1} = q_k + τ·f(q_{k+1}); it is implicit because q_{k+1} appears on both sides`, `q_{k+1} = q_k + τ·f(q_k); it is implicit because f depends on the past`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:12:32]–[1:13:00], the lecturer states: "Let's try evaluating the velocity at the next configuration rather than at the current configuration. In this case we no longer have an explicit equation for our new configuration, we have an implicit equation... the new configuration equals the current configuration plus the time step times the velocity at the next time. We don't know yet what the configuration is at the next time, so how could we evaluate the right-hand side? We can't do it directly. We have to solve this whole equation simultaneously."
"Implicit gives us a test have we satisfied the relationship , explicit tells us how to solve it "  ,`,
    code: ``,
    images: ["image_1777622900231_0.png"],
    tags: ["Equation/Implicit", "Relationship", "vs/implicitvsexplicit"],
    source: `lectures/cg-21-lecture-quiz.md`,
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

export default function Lec21Part1Quiz() {
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
    accent: '#a78bfa', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec21'
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
          <Activity size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 21: Dynamics & Time Integration — Part 1</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>ODEs, Lagrangian Mechanics, Euler Integrators, Particle Systems</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-21-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec21/1`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec21/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
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
          <Activity size={20} /> Start Quiz
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
              <Activity size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 21: Dynamics & Time Integration — Part 1</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-21-lecture-quiz.md.</p>
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
'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Film } from 'lucide-react'

// Source: lectures/cg-20-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 20: Introduction to Animation — Part 1 · Q1–Q32 · 32 questions
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-20-lecture-quiz.md 20

const quizData = [
  {
    id: 1,
    timestamp: `01:28`,
    question: `What is considered one of the earliest known examples of animation?`,
    options: [`Leonardo da Vinci's sketches of birds in flight (1510)`, `The Phenakistoscope spinning disc device (1831)`, `A pottery bowl from Shahr-e Sukhteh, Iran (~3200 BCE) showing a goat leaping`, `Muybridge's photographic sequence of a galloping horse (1878)`],
    answer: 2,
    intuition: ``,
    explanation: `At [01:28], the lecturer explains that people have always been interested in depicting motion. The Shahr-e Sukhteh pottery bowl (~3200 BCE) is one of the oldest known animations — a sequence of images painted around the bowl showing a goat leaping toward a tree. When the bowl spins, the images animate.`,
    code: ``,
    images: ["lec20_slide_04.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 2,
    timestamp: `03:44`,
    question: `What scientific question motivated Muybridge's 1878 photographic film "Sallie Gardner"?`,
    options: [`Whether the human eye could perceive motion at more than 12 frames per second`, `Whether all four legs of a galloping horse ever leave the ground simultaneously`, `Whether a camera could capture motion faster than the human hand could draw it`, `Whether animals moved differently when observed versus unobserved`],
    answer: 1,
    intuition: ``,
    explanation: `At [03:44], the lecturer states: "The first real film was done by Muybridge who was trying to resolve a very simple question: when a horse gallops, do all four legs ever leave the ground at the same time?" He set up a series of cameras triggered by trip wires to capture the motion — and yes, all four legs do leave the ground.`,
    code: ``,
    images: ["lec20_slide_09.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 3,
    timestamp: `07:24`,
    question: `What was historically significant about Ivan Sutherland's "Sketchpad" (1963)?`,
    options: [`It was the first use of ray tracing in computer graphics`, `It was the first feature-length computer-animated film`, `It was the first digital computer animation and a landmark in human-computer interaction`, `It introduced the first physically-based simulation for character animation`],
    answer: 2,
    intuition: ``,
    explanation: `At [07:24], the lecturer says: "The first digital computer animation was something called Sketchpad developed by Ivan Sutherland, and this was a really landmark development in not only computer graphics but also human-computer interaction." Like Muybridge's film, it started as a scientific/technical tool rather than entertainment.`,
    code: ``,
    images: ["lec20_slide_15.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 4,
    timestamp: `05:21`,
    question: `What was historically notable about Lotte Reiniger's "Die Abenteuer des Prinzen Achmed" (1926)?`,
    options: [`First use of computer-generated imagery in a film`, `First feature-length animation film`, `First film to use motion capture for character animation`, `First animation to use spline interpolation for smooth movement`],
    answer: 1,
    intuition: ``,
    explanation: `At [05:21], the lecturer describes Reiniger's film as "the first feature-length animation" — made using silhouette cut-out puppet technique, predating Disney's Snow White by over a decade. It demonstrates that animation as an art form preceded digital tools by many decades.`,
    code: ``,
    images: ["lec20_slide_11.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 5,
    timestamp: `13:54`,
    question: `What is the "beta phenomenon" in the perception of motion?`,
    options: [`The eye retains an afterimage on the retina for ~1/24 second, creating perceived motion`, `The brain keeps a visual memory of recent motion, not the eyeball — creating perceived continuity`, `High frame rates cause the brain to interpret motion as unnaturally smooth ("soap opera effect")`, `The phi phenomenon where the brain fills in missing frames between sparse keyframes`],
    answer: 1,
    intuition: `The old "persistence of vision" theory said the eye itself acts like a slow camera with motion blur. That's wrong. The eye resets almost instantly. It's the BRAIN that holds the record of recent motion and uses it to create a sense of continuity — which is why movies work at 24fps even though real motion is continuous.`,
    explanation: `At [13:54], the lecturer states: "More modern psychological explanations are things like the beta phenomenon — you do have this kind of persistence of motion but that record of what was happening is kept not in the eyeball but in the brain." The original "persistence of vision" theory has been debunked.`,
    code: ``,
    images: ["lec20_slide_24.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 6,
    timestamp: `14:25`,
    question: `What is the "phi phenomenon" in motion perception?`,
    options: [`The minimum frame rate required for smooth motion perception (phi ≈ 24 fps)`, `The brain anticipates motion based on visual cues, giving a sense that motion is about to occur`, `The optical illusion where two adjacent static images appear to move toward each other`, `The perceived increase in brightness when objects move rapidly across the visual field`],
    answer: 1,
    intuition: ``,
    explanation: `At [14:25], the lecturer explains: "There's also something called the phi phenomenon, which is that the brain anticipates motion — there are visual cues that you see in nature that make you feel like motion is going to occur." Together, beta and phi explain why animation works: the brain actively constructs the sense of motion rather than passively recording it.`,
    code: ``,
    images: ["lec20_slide_24.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 7,
    timestamp: `16:03`,
    question: `What is the traditional hand-drawn animation workflow?`,
    options: [`Every animator draws every frame independently; no collaboration is used`, `A senior artist draws keyframes; an apprentice draws the inbetweens ("tweening")`, `All frames are drawn by one artist in sequence from start to finish`, `Keyframes are drawn by computer; only inbetweens require human artists`],
    answer: 1,
    intuition: ``,
    explanation: `At [16:03], the lecturer describes: "To generate this motion, a senior artist sits down and draws keyframes — frames that highlight key events. Then an apprentice fills in the rest, drawing inbetweens." This is the origin of the word "tweening" and directly motivates computer animation: the inbetween work is tedious and perfect for automation.`,
    code: ``,
    images: ["lec20_slide_26.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 8,
    timestamp: `17:15`,
    question: `What are the three basic techniques in computer animation?`,
    options: [`Rasterization, ray tracing, and path tracing`, `Forward kinematics, inverse kinematics, and physics simulation`, `Artist-directed (keyframing), data-driven (motion capture), and procedural (simulation)`, `Spline interpolation, particle systems, and skeletal rigging`],
    answer: 2,
    intuition: ``,
    explanation: `At [17:15], the lecturer outlines: "There are a lot of different basic techniques for computer animation: artist-directed (e.g., keyframing), data-driven (e.g., motion capture), and procedural (e.g., simulation)." These map roughly to how much human artistic input vs. automated computation is involved.`,
    code: ``,
    images: ["lec20_slide_28.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 9,
    timestamp: `18:30`,
    question: `What is the core idea of keyframing in computer animation?`,
    options: [`Capturing real motion data from actors using reflective markers`, `Specifying only important events; the computer fills in the rest via interpolation`, `Physically simulating all forces so the computer generates motion automatically`, `Drawing every frame by hand and scanning them into the computer`],
    answer: 1,
    intuition: ``,
    explanation: `At [18:30], the lecturer explains: "Basic idea: specify important events only — computer fills in the rest via interpolation/approximation. 'Events' don't have to be position — could be color, light intensity, camera zoom..." This is the digital version of the senior artist drawing keyframes, with the computer doing the apprentice's tweening work.`,
    code: ``,
    images: ["lec20_slide_29.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 10,
    timestamp: `22:10`,
    question: `What is the problem with piecewise linear interpolation for animation?`,
    options: [`It requires too many keyframes to specify a smooth path`, `It produces infinite acceleration at keyframe joints, causing jerky motion`, `It cannot interpolate rotations, only positions`, `It is computationally too expensive for real-time applications`],
    answer: 1,
    intuition: `Velocity is the derivative of position. Piecewise linear means position has sharp corners at keyframes — the derivative (velocity) has discontinuous jumps there. A discontinuous velocity means infinite acceleration at that instant. Physically and visually, this is a sudden jerk — not smooth motion.`,
    explanation: `At [22:10], from the slide: "Piecewise linear interpolation: simple, but yields rather rough motion (infinite acceleration)." The slope (velocity) changes instantaneously at each keyframe knot, which means infinite acceleration at those points. This motivates using smooth polynomial splines instead.`,
    code: ``,
    images: ["lec20_slide_32.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 11,
    timestamp: `20:57`,
    question: `What is a spline, and what is its historical origin?`,
    options: [`A mathematical function defined by Fourier series; originated in signal processing`, `Any piecewise polynomial function; originated from thin flexible strips of wood/metal used by draftsmen`, `A recursive subdivision curve; originated from de Casteljau's algorithm at Citroën`, `A parametric curve defined by control points; originated from Bézier's work at Renault`],
    answer: 1,
    intuition: ``,
    explanation: `At [20:57], the lecturer states: "Mathematical theory of interpolation arose from study of thin strips of wood or metal ('splines') under various forces." A spline is any piecewise polynomial function. The physical spline — a flexible strip bent by ducks (weights) placed along a drawing board — naturally produces the minimum-curvature curve that passes through the specified points.`,
    code: ``,
    images: ["lec20_slide_31.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 12,
    timestamp: `24:00`,
    question: `What does it mean for a spline to "interpolate" data?`,
    options: [`The spline approximates the data with minimum error but doesn't pass through the points exactly`, `The spline passes exactly through all specified data values at the knot locations`, `The spline smoothly blends between data values using weighted averages`, `The spline uses the data only to determine tangent directions, not positions`],
    answer: 1,
    intuition: ``,
    explanation: `From slide 34: "Interpolates just means that the function exactly passes through those values." This is the key distinction: interpolation (exact pass-through) vs. approximation (close but not exact, as in B-splines). Keyframe animation typically needs interpolation — the character must be in the exact specified pose at the specified time.`,
    code: ``,
    images: ["lec20_slide_34.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 13,
    timestamp: `28:20`,
    question: `Why are cubic polynomials (degree 3) the most common choice for splines?`,
    options: [`They are the highest degree polynomials that can be evaluated in real time on a GPU`, `They are the lowest degree polynomials that can match position and derivative at both endpoints`, `Among all interpolating curves, cubics minimize the norm of the second derivative (bending energy)`, `They are the only polynomials that guarantee C2 continuity across multiple segments`],
    answer: 2,
    intuition: `A physical spline (flexible wood strip) takes the shape that minimizes elastic bending energy — which mathematically is the integral of (curvature)² ≈ integral of (second derivative)². The exact solution under small-displacement assumptions is a piecewise cubic. Nature chose cubics to minimize bending; we choose them for the same reason.`,
    explanation: `From slide 35: "Piecewise cubics give the exact solution to the elastic spline problem under assumption of small displacements. More precisely: among all curves interpolating a set of data points, cubics minimize the norm of the second derivative." They also have 4 DOFs — exactly enough to match position and derivative at both endpoints of each segment.`,
    code: ``,
    images: ["lec20_slide_35.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 14,
    timestamp: `27:52`,
    question: `What is the Runge phenomenon?`,
    options: [`A high-frequency oscillation that appears when using high-degree polynomials to interpolate data`, `The tendency of splines to overshoot between keyframes due to high tangent magnitudes`, `Numerical instability in spline evaluation caused by floating-point cancellation`, `The visual artifact where B-splines fail to interpolate their control points`],
    answer: 0,
    intuition: ``,
    explanation: `At [27:52], the lecturer warns: "It's really tempting to use a higher-degree polynomial for higher continuity, but this can lead to oscillation — ultimately a worse approximation." Slide 36 illustrates this: a high-degree polynomial fitted to uniformly spaced points oscillates wildly near the edges. This is why piecewise low-degree (cubic) splines are preferred over one high-degree polynomial.`,
    code: ``,
    images: ["lec20_slide_36.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 15,
    timestamp: `31:00`,
    question: `How many degrees of freedom does a cubic polynomial have, and what does that mean for fitting?`,
    options: [`2 DOFs — enough to match only one endpoint position and one derivative`, `3 DOFs — enough to match position and derivative at one end plus position at the other`, `4 DOFs — the four coefficients (a, b, c, d); matching both endpoint positions uses only 2, leaving 2 free`, `6 DOFs — matching positions and derivatives at both ends is exactly determined`],
    answer: 2,
    intuition: ``,
    explanation: `From slide 38: "Cubic polynomial has four degrees of freedom (DOFs), namely four coefficients (a,b,c,d). Only need two degrees of freedom to specify endpoints. Overall, four unknowns but only two equations — hence many solutions." The two remaining DOFs can be pinned by also specifying derivatives at the endpoints (Hermite) or by additional smoothness conditions (natural spline).`,
    code: ``,
    images: ["lec20_slide_38.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 16,
    timestamp: `40:19`,
    question: `What is a natural spline and how does it fix the remaining degrees of freedom?`,
    options: [`It constrains the tangents at endpoints to point toward the nearest neighbor keyframe`, `It sets the second derivative (curvature) to zero at both endpoints`, `It uses the physical catenary curve (hanging chain) as its shape model`, `It requires the first and last segments to be linear rather than cubic`],
    answer: 1,
    intuition: ``,
    explanation: `At [40:19], the lecturer explains: "One thing I could do is pin down the remaining degrees of freedom by setting the curvature to zero at the endpoints — just saying when I enter or exit the curve I'm going straight. Curvature here really means the second derivative, and that's why we call this a natural spline." Setting d²p/dt² = 0 at both ends adds 2 equations to close the system.`,
    code: ``,
    images: ["lec20_slide_41.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 17,
    timestamp: `42:00`,
    question: `What are the three desirable properties of a spline, and how does the natural spline perform?`,
    options: [`Speed, accuracy, simplicity — natural splines excel at all three`, `Interpolation, continuity, locality — natural splines have interpolation and continuity but NOT locality`, `Interpolation, continuity, locality — natural splines have continuity and locality but NOT interpolation`, `Interpolation, differentiability, efficiency — natural splines fail only at efficiency`],
    answer: 1,
    intuition: `"Locality" means moving one keyframe only affects the nearby curve. Natural splines solve one global linear system for all segments simultaneously — so moving one keyframe reshapes the entire curve. That's nonlocal. This matters in animation: if you adjust a pose at frame 100, you don't want poses at frames 1-99 to change.`,
    explanation: `From slide 42: "INTERPOLATION: spline passes exactly through data points ✓. CONTINUITY: at least twice differentiable everywhere ✓. LOCALITY: moving one control point doesn't affect whole curve ✗." Natural splines solve a global system, so every segment is coupled — non-local behavior.`,
    code: ``,
    images: ["lec20_slide_42.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 18,
    timestamp: `45:26`,
    question: `What is a Hermite spline and how is it specified?`,
    options: [`Specified by knot positions only; tangents are computed automatically from neighbors`, `Specified by four control points per segment; passes through only the first and last`, `Specified by endpoint positions AND endpoint tangents; each cubic piece is fully determined by these four values`, `Specified by curvature values at endpoints; tangents are derived by integration`],
    answer: 2,
    intuition: ``,
    explanation: `From slide 43: "Each cubic 'piece' specified by endpoints and tangents (Hermite form). Equivalently: by four points (Bézier form) — just take the difference!" The artist explicitly controls tangent directions at each keyframe, giving precise control over how the curve enters and exits each pose. 4 values (p0, p1, v0, v1) exactly determine the 4 cubic coefficients.`,
    code: ``,
    images: ["lec20_slide_43.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 19,
    timestamp: `47:00`,
    question: `How does the Hermite spline differ from the natural spline at joints between segments?`,
    options: [`Hermite enforces C2 continuity (matching curvature) at joints; natural spline only enforces C1`, `Natural spline enforces C2 continuity at joints automatically; Hermite only enforces C1 if tangents happen to match`, `Hermite enforces C0 continuity (position only) at joints; natural enforces C2`, `Both enforce exactly C1 continuity — they differ only in how endpoint tangents are set`],
    answer: 1,
    intuition: ``,
    explanation: `From slide 44: "How is this different from our natural spline's tangent condition? There, tangents didn't have to match any prescribed value — they merely had to be the same on both sides (C1). Here, tangents must match given data." Natural splines additionally enforce C2 (curvature continuity) across joints; Hermite splines enforce only C1 (tangent continuity) since the user specifies potentially inconsistent tangents.`,
    code: ``,
    images: ["lec20_slide_44.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 20,
    timestamp: `52:46`,
    question: `What is a Catmull-Rom spline and what problem does it solve?`,
    options: [`A spline that sacrifices interpolation for C2 continuity and local control`, `A Hermite spline where tangents are automatically computed as differences of neighboring values`, `A B-spline variant that always passes through its control points`, `A spline defined recursively via de Casteljau subdivision`],
    answer: 1,
    intuition: `Hermite splines require the animator to specify both positions AND tangent directions at every keyframe — that's twice the work. Catmull-Rom removes that burden: it computes the tangent at each keyframe automatically as (next_value - prev_value)/2. The artist only specifies where to be; the algorithm figures out how fast to get there.`,
    explanation: `At [52:46], the lecturer explains: "Sometimes specifying tangents is annoying. Catmull-Rom: specialization of Hermite spline, determined by values alone. Basic idea: use difference of neighbors to define tangent." The tangent at point p_i is set to (p_{i+1} - p_{i-1})/2. This gives interpolation and C1 continuity with no extra input from the artist.`,
    code: ``,
    images: ["lec20_slide_45.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 21,
    timestamp: `1:00:07`,
    question: `What property does a B-spline sacrifice compared to natural and Hermite splines, and what does it gain?`,
    options: [`Sacrifices continuity; gains exact interpolation through control points`, `Sacrifices exact interpolation (curve passes near but not through control points); gains better continuity and local control`, `Sacrifices computational efficiency; gains C3 continuity at all joints`, `Sacrifices locality; gains exact interpolation and C2 continuity`],
    answer: 1,
    intuition: ``,
    explanation: `From slide 47: "Get better continuity and local control by sacrificing interpolation." B-splines don't pass through their control points — the curve is merely attracted to them. In exchange, they provide local control (moving one control point only affects nearby segments) and higher continuity. The tradeoff table on slide 48 shows: natural (interp ✓, continuity ✓, local ✗), Hermite (interp ✓, continuity ✗, local ✓), B-splines (interp ✗, continuity ✓, local ✓).`,
    code: ``,
    images: ["lec20_slide_47.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 22,
    timestamp: `1:00:07`,
    question: `What does the "no free lunch" principle mean for splines?`,
    options: [`Every spline type requires the same computational cost regardless of its properties`, `No single spline type achieves all three desiderata (interpolation, continuity, locality) simultaneously`, `Adding more control points always increases the computational cost superlinearly`, `Higher-degree splines are never worth using because of the Runge phenomenon`],
    answer: 1,
    intuition: ``,
    explanation: `From slide 46/48, the comparison table shows: natural splines (interp ✓, continuity ✓, local ✗), Hermite (interp ✓, continuity ✓ only if tangents match, local ✓), B-splines (interp ✗, continuity ✓, local ✓). No row has all three checkmarks. The right choice depends on the application — illustration vs. animation vs. real-time rendering.`,
    code: ``,
    images: ["lec20_slide_46.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 23,
    timestamp: `1:02:10`,
    question: `What is being interpolated in a simple camera animation?`,
    options: [`Only the camera position; direction is always computed to look at a fixed target`, `The camera's position, view direction, and "up" direction — each as a separate spline`, `The camera's projection matrix directly, as a 4×4 matrix spline`, `Only the camera's focal length; position is fixed`],
    answer: 1,
    intuition: ``,
    explanation: `From slide 50: "Animate position, direction, 'up' direction of camera — each path is a function f(t) = (x(t), y(t), z(t)) — each component (x,y,z) is a spline." Each scalar component is independently spline-interpolated. This is the most direct application of keyframing: the animator sets camera pose at key moments, splines fill in the continuous path.`,
    code: ``,
    images: ["lec20_slide_50.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 24,
    timestamp: `1:03:30`,
    question: `What is a kinematic chain (scene graph) and how is it used in character animation?`,
    options: [`A chain of physics constraints linking rigid bodies; used for ragdoll simulation`, `A tree of transformations where child transformations are defined relative to parents; animated by interpolating each joint's rotation`, `A sequence of keyframes linked by splines; the "chain" refers to temporal ordering`, `A linked list of bones where each bone's position is independent of its neighbors`],
    answer: 1,
    intuition: `Think of your arm: your forearm rotation is defined relative to your upper arm, which is relative to your shoulder, which is relative to your torso. The scene graph encodes exactly this hierarchy. To animate a waving hand, you only need to specify shoulder and elbow rotations — the hand position is automatically computed by chaining those transforms.`,
    explanation: `From slide 51: "Scene graph/kinematic chain: scene as tree of transformations. E.g., in 'cube man,' configuration of a leg might be expressed as rotation relative to body. Animate by interpolating transformations." The animator keyframes joint rotations; the character's full pose is then computed by traversing the transformation tree.`,
    code: ``,
    images: ["lec20_slide_51.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 25,
    timestamp: `1:05:00`,
    question: `What is inverse kinematics (IK) and how does it differ from forward kinematics?`,
    options: [`Forward kinematics: set joint angles → compute end-effector position. IK: set end-effector goal → algorithm computes joint angles`, `Forward kinematics: physics drives joint motion. IK: artist specifies joint angles directly`, `Forward kinematics: works in 2D. IK: extends kinematics to 3D`, `Forward kinematics: used for rigid bodies. IK: used only for deformable bodies`],
    answer: 0,
    intuition: ``,
    explanation: `From slide 52: "Rather than adjust individual transformations, set 'goal' and use algorithm to come up with plausible motion. Many algorithms — basic idea: numerical optimization/descent." IK solves the inverse problem: given where you want the hand to be, find the shoulder/elbow/wrist angles that put it there. This is a numerical optimization problem (often nonlinear, with multiple solutions).`,
    code: ``,
    images: ["lec20_slide_52.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 26,
    timestamp: `1:06:00`,
    question: `What is skeletal animation and what problem does it solve?`,
    options: [`Animating rigid skeleton pieces directly without any surface mesh`, `Using a skeleton of bones to drive the deformation of a continuous surface mesh, with each vertex weighted by nearby bone influences`, `Capturing motion from a real actor's skeleton using reflective markers`, `Procedurally generating skeleton structures from muscle simulation`],
    answer: 1,
    intuition: ``,
    explanation: `From slide 53: "Often use 'skeleton' to drive deformation of continuous surface mesh. Influence of each bone determined by, e.g., weighting function." Instead of animating every vertex of a mesh directly, the artist animates a sparse skeleton of bones. Each skin vertex moves as a weighted blend of its nearby bones' transformations — giving smooth, realistic deformation with far fewer controls.`,
    code: ``,
    images: ["lec20_slide_53.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 27,
    timestamp: `1:07:00`,
    question: `What are blend shapes and when are they used instead of skeletal animation?`,
    options: [`Procedural noise functions blended together to create organic surface textures`, `Directly interpolating between a set of pre-modeled surface shapes (e.g., facial expressions) using spline-controlled blend weights`, `Physics-based blending of rigid body and soft body simulations`, `Blending motion capture data from multiple actors to create new animations`],
    answer: 1,
    intuition: ``,
    explanation: `From slide 54: "Instead of skeleton, interpolate directly between surfaces. E.g., model a collection of facial expressions. Simplest scheme: take linear combination of vertex positions. Spline used to control choice of blending weights." Blend shapes are commonly used for facial animation where the deformations are too complex for a skeletal rig — an artist models "happy," "sad," "surprised," etc., and the animator mixes between them.`,
    code: ``,
    images: ["lec20_slide_54.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 28,
    timestamp: `33:00`,
    question: `In a spline system, how does each constraint (e.g., matching a keyframe value) translate into a solvable system?`,
    options: [`Each constraint adds a nonlinear equation; solved by Newton's method iteratively`, `Each constraint adds one linear equality; m constraints with m DOFs yield an m×m linear system`, `Constraints are encoded as penalty terms in an optimization objective function`, `Each constraint reduces the polynomial degree by one; enough constraints give a linear function`],
    answer: 1,
    intuition: ``,
    explanation: `From slide 40: "Each condition on the spline leads to a linear equality. If we have m degrees of freedom, we need m (linearly independent) conditions. We can express this as a matrix equation Ax = b." This is the key insight: spline fitting is just linear algebra. Each keyframe position, tangent match, or curvature condition is one row in a linear system.`,
    code: ``,
    images: ["lec20_slide_40.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 29,
    timestamp: `22:50`,
    question: `Why is piecewise polynomial interpolation preferred over using one single high-degree polynomial?`,
    options: [`High-degree polynomials can only be evaluated at integer time steps`, `A single high-degree polynomial risks the Runge phenomenon — wild oscillations between data points`, `High-degree polynomials cannot satisfy C2 continuity conditions`, `The rendering pipeline only supports polynomials up to degree 3`],
    answer: 1,
    intuition: ``,
    explanation: `From slides 33 and 36: "Common interpolant: piecewise polynomial 'spline' — basic motivation: get better continuity than piecewise linear." And on Runge: "Tempting to use higher-degree polynomials for higher continuity, but can lead to oscillation — ultimately worse approximation." Piecewise cubics achieve C2 continuity with local, stable behavior.`,
    code: ``,
    images: ["lec20_slide_33.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 30,
    timestamp: `11:04`,
    question: `What is a zoetrope and what principle does it demonstrate?`,
    options: [`A hand-cranked camera that captures motion at 24 frames per second`, `A spinning cylinder with sequential images viewed through slits, creating the illusion of motion from static frames`, `An early computer monitor that displayed animation by scanning electron beams`, `A 3D printer that creates solid objects by layering cross-sections`],
    answer: 1,
    intuition: ``,
    explanation: `At [11:04], the lecturer describes: "Here we have a solid object with pieces arranged on a spinning plate. A strobe light flashes, and you see the different stages of motion frozen in time, creating an animation." The zoetrope exploits the beta phenomenon — successive static images, presented quickly enough, are perceived as continuous motion by the brain.`,
    code: ``,
    images: ["lec20_slide_22.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 31,
    timestamp: `09:45`,
    question: `What pattern appears repeatedly in the history of both film and computer animation?`,
    options: [`New animation technologies are always developed by entertainment studios first`, `Each new animation technology first emerged as a scientific tool, then was adopted for entertainment`, `Advances in animation technology always follow advances in hardware capability`, `Animation techniques invented in Europe always took decades to reach the United States`],
    answer: 1,
    intuition: ``,
    explanation: `From slides 9 and 14: Film — "Originally used as scientific tool rather than for entertainment. Critical technology that accelerated development of animation." Computer animation — "New technology, also developed as a scientific tool. Again turbo-charged the development of animation." Muybridge was settling a scientific bet; Sutherland was studying human-computer interaction; both tools became the foundation of modern animation.`,
    code: ``,
    images: ["lec20_slide_14.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
  },
  {
    id: 32,
    timestamp: `48:00`,
    question: `What distinguishes a Bézier spline from a Hermite spline, mathematically?`,
    options: [`Bézier uses trigonometric basis functions; Hermite uses polynomial basis functions`, `Bézier specifies the curve by four control points (two endpoints + two "pull" points); Hermite specifies by endpoints and explicit tangent vectors — they encode the same information differently`, `Bézier enforces C2 continuity; Hermite enforces only C0 continuity`, `Bézier interpolates all four control points; Hermite interpolates only the endpoints`],
    answer: 1,
    intuition: ``,
    explanation: `From slide 43: "Each cubic piece specified by endpoints and tangents (Hermite). Equivalently: by four points (Bézier form) — just take the difference!" The Bézier "handle" control points encode the tangent direction and magnitude. Hermite tangent vector = 3 × (Bézier control point − endpoint). They're the same mathematical object, just written in different bases.`,
    code: ``,
    images: ["lec20_slide_43.png"],
    tags: [],
    source: `lectures/cg-20-lecture-quiz.md`,
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

export default function Lec20Part1Quiz() {
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
    accent: '#34d399',
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
          <Film size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 20: Introduction to Animation — Part 1</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Keyframing, Splines, Hermite/Catmull-Rom/B-Splines, Skeletal Animation</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-20-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec20/1`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec20/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
          </div>
          <p style={{ color: C.accent, fontWeight: 600 }}>Q1–Q32 · 32 questions</p>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>32</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Questions</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>~10min</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Est. Time</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>2</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Parts</div></div>
          </div>
        </div>

        <button style={btn({ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' })}
          onClick={() => { setScreen('quiz'); start() }}>
          <Film size={20} /> Start Quiz
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
              <Film size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 20: Introduction to Animation — Part 1</span>
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
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.72rem', fontWeight: 700, color: C.accent, letterSpacing: '0.06em' }}>FIRST PRINCIPLES</p>
                    <p style={{ margin: 0, lineHeight: 1.8, color: C.text, fontSize: '0.95rem' }}>{q.intuition}</p>
                  </div>
                )
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition written yet. Add a <code style={{ color: C.accent }}>- INTUITION:</code> block under this question in <code style={{ color: C.accent }}>lectures/cg-20-lecture-quiz.md</code>.</p>
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
              {qIdx < 32-1 ? 'Next Question' : 'View Results'} <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
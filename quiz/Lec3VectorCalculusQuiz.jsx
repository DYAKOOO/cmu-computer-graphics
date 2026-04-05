'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Sigma } from 'lucide-react';

/**
 * CMU 15-462/662 Computer Graphics — Lecture 3
 * Vector Calculus in Computer Graphics
 *
 * Images served from /assets/ (Next.js public/assets/).
 * SVG concept diagrams generated inline for key visual concepts.
 */

<style>
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
</style>

// ─────────────────────────────────────────────────────────────
// INLINE SVG CONCEPT DIAGRAMS
// ─────────────────────────────────────────────────────────────

const DiagramParallelogram = () => (
  <svg viewBox="0 0 260 160" width="260" height="160" style={{ display: 'block' }}>
    <defs>
      <marker id="ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#38bdf8" />
      </marker>
    </defs>
    <polygon points="40,120 160,120 220,40 100,40" fill="#38bdf815" stroke="#38bdf8" strokeWidth="1.5" />
    <line x1="40" y1="120" x2="158" y2="120" stroke="#4ade80" strokeWidth="2.5" markerEnd="url(#ah)" />
    <line x1="40" y1="120" x2="98" y2="42" stroke="#f472b6" strokeWidth="2.5" markerEnd="url(#ah)" />
    <line x1="40" y1="120" x2="40" y2="40" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3" />
    <line x1="40" y1="40" x2="100" y2="40" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3" />
    <text x="100" y="138" fill="#4ade80" fontSize="13" fontFamily="Rajdhani" fontWeight="600">u</text>
    <text x="60" y="90" fill="#f472b6" fontSize="13" fontFamily="Rajdhani" fontWeight="600">v</text>
    <text x="125" y="88" fill="#38bdf8" fontSize="12" fontFamily="Rajdhani">Area = ‖u × v‖</text>
    <text x="155" y="50" fill="#94a3b8" fontSize="11" fontFamily="Rajdhani">h</text>
  </svg>
);

const DiagramCrossProduct3D = () => (
  <svg viewBox="0 0 260 180" width="260" height="180" style={{ display: 'block' }}>
    <defs>
      <marker id="ah2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#38bdf8" />
      </marker>
      <marker id="ah3" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#4ade80" />
      </marker>
      <marker id="ah4" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#f472b6" />
      </marker>
      <marker id="ah5" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#fbbf24" />
      </marker>
    </defs>
    {/* Origin */}
    <circle cx="80" cy="130" r="3" fill="#e2e8f0" />
    {/* u vector */}
    <line x1="80" y1="130" x2="178" y2="130" stroke="#4ade80" strokeWidth="2.5" markerEnd="url(#ah3)" />
    <text x="185" y="135" fill="#4ade80" fontSize="13" fontFamily="Rajdhani" fontWeight="600">u</text>
    {/* v vector */}
    <line x1="80" y1="130" x2="130" y2="60" stroke="#f472b6" strokeWidth="2.5" markerEnd="url(#ah4)" />
    <text x="135" y="55" fill="#f472b6" fontSize="13" fontFamily="Rajdhani" fontWeight="600">v</text>
    {/* u×v — out of plane */}
    <line x1="80" y1="130" x2="80" y2="22" stroke="#fbbf24" strokeWidth="2.5" markerEnd="url(#ah5)" />
    <text x="86" y="18" fill="#fbbf24" fontSize="12" fontFamily="Rajdhani" fontWeight="600">u × v</text>
    {/* Right-angle mark */}
    <polyline points="90,130 90,120 80,120" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
    {/* Labels */}
    <text x="8" y="90" fill="#94a3b8" fontSize="11" fontFamily="Rajdhani">⊥ to both u, v</text>
    <text x="8" y="165" fill="#38bdf8" fontSize="11" fontFamily="Rajdhani">Right-hand rule</text>
  </svg>
);

const DiagramGradientField = () => (
  <svg viewBox="0 0 260 200" width="260" height="200" style={{ display: 'block' }}>
    <defs>
      <radialGradient id="heatmap" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#0a0a0f" stopOpacity="0.2" />
      </radialGradient>
      <marker id="gah" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
        <polygon points="0 0, 6 2.5, 0 5" fill="#38bdf8" />
      </marker>
    </defs>
    <ellipse cx="130" cy="100" rx="110" ry="85" fill="url(#heatmap)" />
    {/* Gradient arrows pointing outward from centre */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
      const r = deg * Math.PI / 180;
      const x1 = 130 + 35 * Math.cos(r); const y1 = 100 + 30 * Math.sin(r);
      const x2 = 130 + 70 * Math.cos(r); const y2 = 100 + 55 * Math.sin(r);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#38bdf8" strokeWidth="1.8" markerEnd="url(#gah)" />;
    })}
    <circle cx="130" cy="100" r="5" fill="#fbbf24" />
    <text x="110" y="95" fill="#fbbf24" fontSize="11" fontFamily="Rajdhani">x₀</text>
    <text x="96" y="190" fill="#94a3b8" fontSize="11" fontFamily="Rajdhani">∇f points uphill (steepest ascent)</text>
  </svg>
);

const DiagramDivergenceCurl = () => (
  <svg viewBox="0 0 260 120" width="260" height="120" style={{ display: 'block' }}>
    <defs>
      <marker id="dah" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
        <polygon points="0 0, 6 2.5, 0 5" fill="#f472b6" />
      </marker>
      <marker id="cah" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
        <polygon points="0 0, 6 2.5, 0 5" fill="#4ade80" />
      </marker>
    </defs>
    {/* Divergence — source */}
    <text x="12" y="18" fill="#f472b6" fontSize="12" fontFamily="Rajdhani" fontWeight="600">Divergence (source)</text>
    <circle cx="65" cy="70" r="4" fill="#f472b6" />
    {[0, 60, 120, 180, 240, 300].map((deg, i) => {
      const r = deg * Math.PI / 180;
      return <line key={i} x1={65 + 8 * Math.cos(r)} y1={70 + 8 * Math.sin(r)}
        x2={65 + 28 * Math.cos(r)} y2={70 + 28 * Math.sin(r)}
        stroke="#f472b6" strokeWidth="1.8" markerEnd="url(#dah)" />;
    })}
    <text x="40" y="110" fill="#94a3b8" fontSize="10" fontFamily="Rajdhani">∇·X {'>'} 0</text>
    {/* Curl — rotation */}
    <text x="148" y="18" fill="#4ade80" fontSize="12" fontFamily="Rajdhani" fontWeight="600">Curl (rotation)</text>
    <circle cx="195" cy="70" r="4" fill="#4ade80" />
    {[0, 60, 120, 180, 240, 300].map((deg, i) => {
      const r = deg * Math.PI / 180;
      const tang = r + Math.PI / 2;
      return <line key={i} x1={195 + 22 * Math.cos(r)} y1={70 + 22 * Math.sin(r)}
        x2={195 + 22 * Math.cos(r) + 14 * Math.cos(tang)}
        y2={70 + 22 * Math.sin(r) + 14 * Math.sin(tang)}
        stroke="#4ade80" strokeWidth="1.8" markerEnd="url(#cah)" />;
    })}
    <text x="172" y="110" fill="#94a3b8" fontSize="10" fontFamily="Rajdhani">∇×X ≠ 0</text>
  </svg>
);

const DiagramLaplacian = () => (
  <svg viewBox="0 0 260 160" width="260" height="160" style={{ display: 'block' }}>
    <defs>
      <marker id="lah" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
        <polygon points="0 0, 6 2.5, 0 5" fill="#fbbf24" />
      </marker>
    </defs>
    {/* 5-point stencil */}
    <rect x="30" y="20" width="200" height="120" rx="8" fill="#1e2a3a" />
    {/* Centre */}
    <circle cx="130" cy="80" r="14" fill="#fbbf2430" stroke="#fbbf24" strokeWidth="1.5" />
    <text x="124" y="85" fill="#fbbf24" fontSize="12" fontFamily="JetBrains Mono" fontWeight="600">-4</text>
    {/* 4 neighbours */}
    {[[-50, 0], [50, 0], [0, -40], [0, 40]].map(([dx, dy], i) => (
      <g key={i}>
        <circle cx={130 + dx} cy={80 + dy} r="12" fill="#38bdf820" stroke="#38bdf8" strokeWidth="1.2" />
        <text x={130 + dx - 5} y={80 + dy + 5} fill="#38bdf8" fontSize="12" fontFamily="JetBrains Mono">+1</text>
        <line x1={130 + dx * 0.35} y1={80 + dy * 0.35}
              x2={130 + dx * 0.65} y2={80 + dy * 0.65}
              stroke="#94a3b8" strokeWidth="1.5" />
      </g>
    ))}
    <text x="38" y="152" fill="#94a3b8" fontSize="10" fontFamily="Rajdhani">Δf ≈ Σneighbours − 4·centre (discrete 5-pt stencil)</text>
  </svg>
);

const DiagramSkewSymmetric = () => (
  <svg viewBox="0 0 260 120" width="260" height="120" style={{ display: 'block' }}>
    <rect x="10" y="10" width="240" height="100" rx="8" fill="#1e2a3a" />
    <text x="20" y="35" fill="#94a3b8" fontSize="12" fontFamily="JetBrains Mono">[u]ₓ =</text>
    <text x="85" y="35" fill="#e2e8f0" fontSize="12" fontFamily="JetBrains Mono">⎡  0   -u₃   u₂ ⎤</text>
    <text x="85" y="58" fill="#e2e8f0" fontSize="12" fontFamily="JetBrains Mono">⎢  u₃   0   -u₁ ⎥</text>
    <text x="85" y="81" fill="#e2e8f0" fontSize="12" fontFamily="JetBrains Mono">⎣ -u₂   u₁   0  ⎦</text>
    <text x="20" y="105" fill="#38bdf8" fontSize="11" fontFamily="Rajdhani">[u]ₓ v = u × v  •  [u]ₓ = −[u]ₓᵀ</text>
  </svg>
);

// ─────────────────────────────────────────────────────────────
// QUIZ DATA  (25 questions, all with real slide images)
// ─────────────────────────────────────────────────────────────
const quizData = [
  // ─── NORMS & INNER PRODUCTS ─────────────────────────────
  {
    id: 1,
    question: "Why is vector calculus important for computer graphics, according to the opening of the lecture?",
    questionType: "single-choice",
    options: [
      "It provides the mathematical foundation for color theory",
      "It offers a language for talking about spatial relationships, rates of change, and transformations",
      "It is essential for GPU programming",
      "It simplifies shader development"
    ],
    answer: 1,
    explanation: {
      intuition: "Vector calculus gives graphics a vocabulary. Without it you cannot describe how light reflects off a surface, how cloth deforms, or how a mesh smooths — all of these involve rates of change in space.",
      reference: "[01:23] 'The basic reason is that it gives us a language for talking about spatial relationships rates of change transformations and so forth.'",
      computation: `# Everything in graphics involves spatial rates of change:
# • Normal vectors  →  cross product of tangent vectors
# • Shading         →  dot product (N·L)
# • Simulation      →  ∂u/∂t = ν∇²u  (diffusion PDE)
# • Optimisation    →  gradient descent on energy functions`,
      connection: "[01:48] PDE-based physically-based animation was the first application mentioned."
    },
    slideImages: ["image_1771911982856_0.png"],
    diagram: null,
  },
  {
    id: 2,
    question: "What is the defining characteristic of the Euclidean norm?",
    questionType: "single-choice",
    options: [
      "It always yields a positive value for non-zero vectors",
      "It is the notion of length preserved by rigid motions — rotations, translations, and reflections",
      "It only works correctly in 3-dimensional space",
      "It measures the angle between two vectors"
    ],
    answer: 1,
    explanation: {
      intuition: "The Euclidean norm is defined geometrically, not algebraically. A ruler reads the same length regardless of how you orient it — that invariance under rigid motion is the definition.",
      reference: "[02:23–03:18] 'We can say the euclidean norm is the notion of length preserved by rigid motions of space, so rotations translations and reflections.'",
      computation: `import numpy as np

u = np.array([3.0, 4.0])

# Geometric definition: length invariant under rigid motion
# Coordinate formula (orthonormal basis only):
norm = np.sqrt(np.sum(u**2))   # 5.0
print(norm)                     # 5.0`,
      connection: "This coordinate-free definition motivates why orthonormal bases matter — without them, the formula √Σuᵢ² gives the wrong answer."
    },
    slideImages: ["image_1771912248659_0.png"],
    diagram: null,
  },
  {
    id: 3,
    question: "When must you be careful using the coordinate formula ‖u‖ = √(u₁²+…+uₙ²)?",
    questionType: "single-choice",
    options: [
      "When the vector has more than 3 components",
      "When the vector is not normalised",
      "Whenever the basis is not orthonormal — the formula gives geometric length only in an orthonormal basis",
      "When performing floating-point arithmetic"
    ],
    answer: 2,
    explanation: {
      intuition: "The formula squares and sums components. This only measures true geometric length when the basis vectors are perpendicular and unit length. Skewed or stretched axes distort the result.",
      reference: "[04:30] 'Whenever we work in coordinates we have to be careful because this expression does not give us the geometric length unless the vector u happens to be encoded in an orthonormal basis.'",
      computation: `import numpy as np

# Skewed basis B = [[1,1],[0,1]] — NOT orthonormal
B = np.array([[1., 1.], [0., 1.]])
coords = np.array([1., 1.])          # coordinates in skewed basis
geometric = B @ coords               # actual vector = [2, 1]

print("Coord formula:", np.linalg.norm(coords))    # √2 — WRONG
print("True norm:    ", np.linalg.norm(geometric))  # √5 — correct`,
      connection: "The same warning applies to the dot product formula Σuᵢvᵢ — it only equals ⟨u,v⟩ geometrically in an orthonormal basis."
    },
    slideImages: ["image_1771912292087_0.png", "image_1771912295116_0.png"],
    diagram: null,
  },
  {
    id: 4,
    question: "What is the geometric definition of the Euclidean inner product for n-dimensional vectors?",
    questionType: "single-choice",
    options: [
      "Σuᵢvᵢ  (sum of component-wise products)",
      "‖u‖ · ‖v‖ · cos θ, where θ is the angle between them",
      "The projection of u onto v scaled by ‖v‖",
      "The reciprocal of the distance between u and v"
    ],
    answer: 1,
    explanation: {
      intuition: "The inner product measures alignment. Parallel vectors (θ=0) give maximum value; perpendicular vectors (θ=90°) give zero. This geometric view generalises to infinite dimensions.",
      reference: "[05:41] 'For n-dimensional vectors the euclidean inner product is ‖u‖‖v‖cos θ.'",
      computation: `import numpy as np
u = np.array([1., 0., 0.])
v = np.array([0., 1., 0.])

print(np.dot(u, v))                         # 0.0  (90° apart)
print(np.linalg.norm(u) * np.linalg.norm(v) * np.cos(np.pi/2))  # 0.0`,
      connection: "The coordinate formula Σuᵢvᵢ is a consequence when using an orthonormal basis."
    },
    slideImages: ["image_1771912310455_0.png", "image_1771912379439_0.png"],
    diagram: null,
  },
  // ─── CROSS PRODUCT ──────────────────────────────────────
  {
    id: 5,
    question: "What two geometric properties fully characterise the cross product u × v?",
    questionType: "single-choice",
    options: [
      "Magnitude = dot product of u and v; direction = their sum",
      "Magnitude = area of the parallelogram formed by u and v; direction = orthogonal to both",
      "Magnitude = product of vector lengths; direction = average of their directions",
      "Magnitude = sum of vector lengths; direction = their difference"
    ],
    answer: 1,
    explanation: {
      intuition: "Two arrows glued at their tails span a parallelogram. The cross product is an arrow sticking straight out of that parallelogram whose length equals the parallelogram's area.",
      reference: "[07:52] 'The magnitude is equal to the area of the parallelogram made by the two vectors and the direction of the cross product is orthogonal to both vectors.'",
      computation: `import numpy as np
u = np.array([1., 0., 0.])
v = np.array([0., 1., 0.])
c = np.cross(u, v)
print("cross:", c)                    # [0, 0, 1]
print("‖c‖:", np.linalg.norm(c))     # 1.0 = area of unit square
print("c·u:", np.dot(c, u))          # 0.0 — perpendicular to u
print("c·v:", np.dot(c, v))          # 0.0 — perpendicular to v`,
      connection: "The area interpretation is used to compute face normals and surface area in mesh processing."
    },
    slideImages: ["image_1771913321064_0.png"],
    diagram: <DiagramParallelogram />,
  },
  {
    id: 6,
    question: "Why does the cross product make sense only in three dimensions?",
    questionType: "single-choice",
    options: [
      "Because in 2D there is no vector orthogonal to both u and v within the plane, and in 4D+ there are infinitely many such vectors — no unique answer",
      "Because cross products are mathematically undefined outside 3D",
      "Because geometric operations only make sense in our physical 3D world",
      "Because the parallelogram area property only works in 3D"
    ],
    answer: 0,
    explanation: {
      intuition: "2D: any perpendicular vector would leave the plane, giving 3D. 4D: the null space of [u;v] has dimension 2 — infinitely many unit vectors are perpendicular to both. Only in 3D is there exactly one (up to sign).",
      reference: "[09:25] 'In 2D there is no vector orthogonal to both u and v.' [09:45] 'In 4D we have many different vectors that could be orthogonal to both u and v.'",
      computation: `import numpy as np
# In 4D: any [0, 0, a, b] with a²+b²=1 is ⊥ to both [1,0,0,0] and [0,1,0,0]
u4 = np.array([1., 0., 0., 0.])
v4 = np.array([0., 1., 0., 0.])
# [0,0,1,0] and [0,0,0,1] are both valid — no unique cross product`,
      connection: "A 7D generalised cross product exists as a curiosity, but 3D is the graphics-relevant case."
    },
    slideImages: ["image_1771913464398_0.png", "image_1771913472308_0.png"],
    diagram: <DiagramCrossProduct3D />,
  },
  // ─── MATRIX REPRESENTATIONS ─────────────────────────────
  {
    id: 7,
    question: "How can the dot product u·v be expressed as a matrix operation?",
    questionType: "single-choice",
    options: [
      "As det([u, v])",
      "As trace(uvᵀ)",
      "As uᵀv",
      "As the eigenvalue of the outer product uvᵀ"
    ],
    answer: 2,
    explanation: {
      intuition: "uᵀ is a row vector. Multiplying a row by a column yields a scalar — the dot product. This matrix form generalises to weighted inner products uᵀAv.",
      reference: "[16:06] 'It's often convenient to express a dot product using a matrix product: u dot v is no different from u transpose v.'",
      computation: `import numpy as np
u = np.array([[3.], [4.]])   # column
v = np.array([[1.], [2.]])
print(float(u.T @ v))        # 11.0 = 3*1 + 4*2`,
      connection: "Generalises to general inner product ⟨u,v⟩_A = uᵀAv used in metric tensors and anisotropic smoothing."
    },
    slideImages: ["image_1771968934443_0.png"],
    diagram: null,
  },
  {
    id: 8,
    question: "What structural property must the matrix A in the general inner product ⟨u,v⟩_A = uᵀAv always have?",
    questionType: "single-choice",
    options: [
      "Invertible (full rank)",
      "Symmetric (A = Aᵀ)",
      "Diagonal",
      "Positive definite"
    ],
    answer: 1,
    explanation: {
      intuition: "An inner product requires ⟨u,v⟩ = ⟨v,u⟩. In matrix form: uᵀAv = vᵀAu = (uᵀAv)ᵀ. This holds for all u,v only if A = Aᵀ.",
      reference: "[19:04] 'Why is the matrix that I got symmetric? If I take the matrix A and apply its transpose I again get the same matrix.'",
      computation: `import numpy as np
A = np.array([[2., 1.], [1., 3.]])   # symmetric
u, v = np.array([1., 2.]), np.array([3., 1.])
print(u @ A @ v, v @ A @ u)   # must be equal → 14.0  14.0`,
      connection: "Symmetric positive-definite matrices are the foundation of mass matrices, metric tensors, and Gauss–Newton optimisation."
    },
    slideImages: ["image_1771968987949_0.png", "image_1771969001254_0.png"],
    diagram: null,
  },
  {
    id: 9,
    question: "How is u × v represented as a matrix-vector product?",
    questionType: "single-choice",
    options: [
      "As I₃ u applied to v",
      "As a skew-symmetric matrix [u]× constructed from the components of u, applied to v",
      "As a symmetric matrix applied to v",
      "As the eigendecomposition of [u, v]"
    ],
    answer: 1,
    explanation: {
      intuition: "The skew-symmetric 'hat' matrix encodes the cross product linearly. Its anti-symmetry ([u]× = −[u]×ᵀ) mirrors the anti-commutativity u×v = −v×u.",
      reference: "[19:40] 'This matrix is anti-symmetric or skew-symmetric … it has the three components of the vector in it but half of them are negated.'",
      computation: `import numpy as np
def hat(u):
    return np.array([[ 0,   -u[2],  u[1]],
                     [ u[2],  0,   -u[0]],
                     [-u[1],  u[0],  0  ]])
u = np.array([1., 2., 3.])
v = np.array([4., 5., 6.])
print(hat(u) @ v)          # [-3,  6, -3]
print(np.cross(u, v))      # [-3,  6, -3]  ← same`,
      connection: "The hat operator appears in angular velocity kinematics, rotation derivatives, and the Lie algebra so(3) — fundamental to 3D animation."
    },
    slideImages: [],
    diagram: <DiagramSkewSymmetric />,
  },
  {
    id: 10,
    question: "What does the sign of the determinant of a linear map represent geometrically?",
    questionType: "single-choice",
    options: [
      "Whether the transformed volume is larger or smaller than before",
      "Whether the vectors are linearly independent",
      "Whether the map preserved or reversed orientation",
      "Whether the map has an inverse"
    ],
    answer: 2,
    explanation: {
      intuition: "A right-handed frame (x right, y up, z towards you) flipped to left-handed by the map means orientation reversed → det < 0. Preserved handedness → det > 0.",
      reference: "[31:21] 'The sign of the determinant tells us whether the orientation was reversed.'",
      computation: `import numpy as np
R = np.array([[0, -1], [1, 0]])   # 90° rotation
F = np.array([[-1, 0], [0, 1]])   # reflection
print("Rotation det:", np.linalg.det(R))    # +1.0
print("Reflection det:", np.linalg.det(F))  # -1.0`,
      connection: "Triangle winding order (front vs back face) is determined by the sign of det — used in back-face culling."
    },
    slideImages: ["image_1771969392356_0.png", "image_1771969197614_0.png",
                  "image_1771969597588_0.png", "image_1771969755550_0.png"],
    diagram: null,
  },
  {
    id: 11,
    question: "What is Lagrange's identity (BAC-CAB rule) for a triple cross product?",
    questionType: "single-choice",
    options: [
      "u × (v × w) = (u × v) × w",
      "u × (v × w) + v × (w × u) + w × (u × v) = 0",
      "u × (v × w) = v(u·w) − w(u·v)",
      "(u × v)·w = u·(v × w)"
    ],
    answer: 2,
    explanation: {
      intuition: "BAC-CAB linearises a double cross product into scalar-scaled vectors. It's a useful algebraic shortcut that appears when deriving curl-of-curl identities.",
      reference: "[33:21] 'Lagrange's identity: u cross v cross w equals v times u dot w minus w times u dot v.'",
      computation: `import numpy as np
u = np.array([1., 2., 3.])
v = np.array([4., 5., 6.])
w = np.array([7., 8., 9.])
lhs = np.cross(u, np.cross(v, w))
rhs = v * np.dot(u, w) - w * np.dot(u, v)
print(np.allclose(lhs, rhs))   # True`,
      connection: "Used to derive ∇×(∇×F) = ∇(∇·F) − ∇²F, appearing in electromagnetic rendering and fluid simulation."
    },
    slideImages: ["image_1771969698655_0.png", "image_1771969766622_0.png"],
    diagram: null,
  },
  // ─── DERIVATIVES ─────────────────────────────────────────
  {
    id: 12,
    question: "What is the best mental model for the derivative, as emphasised by the lecturer?",
    questionType: "single-choice",
    options: [
      "The area under the function curve up to a point",
      "The best linear approximation of the function at a point",
      "The second-order curvature of the function",
      "The inverse of integration"
    ],
    answer: 1,
    explanation: {
      intuition: "Near any smooth point, f looks like a straight line. That line IS the derivative. 'Replace complicated things with simple linear models' is the engine behind gradient descent, Newton's method, and linearisation throughout graphics.",
      reference: "[37:45] 'Another important view of the derivative is that it's the best linear approximation of the function.'",
      computation: `import numpy as np
x0, fp = 1.0, np.cos(1.0)         # f(x)=sin(x), f'(x₀)=cos(x₀)
approx = lambda x: np.sin(x0) + fp*(x-x0)
print("Error at x₀+0.01:", abs(np.sin(1.01) - approx(1.01)))  # very small`,
      connection: "[39:22] 'Replacing complicated functions with linear or quadratic approximations is a powerful trick we'll see over and over in graphics algorithms.'"
    },
    slideImages: ["image_1771970359791_0.png", "image_1771970380896_0.png",
                  "image_1771970397841_0.png", "image_1771970433285_0.png"],
    diagram: null,
  },
  {
    id: 13,
    question: "What is the formal definition of the directional derivative of f at x₀ along direction u?",
    questionType: "single-choice",
    options: [
      "The gradient ∇f(x₀) dotted with u",
      "lim_{ε→0} [f(x₀ + εu) − f(x₀)] / ε",
      "The Laplacian of f at x₀",
      "The divergence of ∇f in direction u"
    ],
    answer: 1,
    explanation: {
      intuition: "Pick direction u, walk a tiny step ε, measure how much f changed, divide by ε. That is the slope of f in direction u — the directional derivative.",
      reference: "[41:31] 'The directional derivative along direction u is the limit as ε→0 of [f(x₀+εu) − f(x₀)] / ε.'",
      computation: `import numpy as np
f  = lambda x: x[0]**2 + x[1]**2
x0 = np.array([1., 1.])
u  = np.array([1., 0.])
eps = 1e-7
print((f(x0 + eps*u) - f(x0)) / eps)   # ≈ 2.0  (∂f/∂x = 2x at x=1)`,
      connection: "The gradient is then defined as the unique vector such that ⟨∇f, u⟩ = D_u f for all u."
    },
    slideImages: ["image_1771970503059_0.png", "image_1771987890560_0.png"],
    diagram: null,
  },
  // ─── GRADIENT ────────────────────────────────────────────
  {
    id: 14,
    question: "The gradient ∇f(x) is the unique vector such that, for ALL directions u:",
    questionType: "single-choice",
    options: [
      "‖∇f‖ · ‖u‖ = D_u f",
      "⟨∇f, u⟩ = D_u f  (inner product with ∇f equals the directional derivative)",
      "∇f + u = D_u f",
      "∇f × u = D_u f"
    ],
    answer: 1,
    explanation: {
      intuition: "The gradient encodes all directional derivatives at once. To find the slope in direction u, just take the dot product of u with ∇f.",
      reference: "[50:39] 'At each point x the gradient is the unique vector ∇f(x) such that ⟨∇f, u⟩ = D_u f for all u.'",
      computation: `import numpy as np
f      = lambda x: x[0]**2 + 2*x[1]**2
grad_f = lambda x: np.array([2*x[0], 4*x[1]])
x0 = np.array([1., 2.])
u  = np.array([1., 1.]) / np.sqrt(2)
eps = 1e-7
D_num = (f(x0+eps*u) - f(x0)) / eps
D_grad = np.dot(grad_f(x0), u)
print(D_num, D_grad)   # both ≈ 4.243`,
      connection: "This coordinate-free definition also works on manifolds where global coordinates may not exist."
    },
    slideImages: ["image_1771987937211_0.png", "image_1771988003515_0.png",
                  "image_1771988006149_0.png", "image_1771988089566_0.png",
                  "image_1771988289666_0.png"],
    diagram: <DiagramGradientField />,
  },
  {
    id: 15,
    question: "What is the first-order Taylor approximation of a multivariable function f around x₀?",
    questionType: "single-choice",
    options: [
      "f(x) ≈ f(x₀)  (constant)",
      "f(x) ≈ f(x₀) + ∇f(x₀)·(x − x₀)  (linear)",
      "f(x) ≈ f(x₀) + ‖x − x₀‖²",
      "f(x) ≈ ∇f(x₀)"
    ],
    answer: 1,
    explanation: {
      intuition: "The multivariable Taylor expansion replaces scalar f'(x₀)(x−x₀) with the dot product ∇f(x₀)·(x−x₀). This is the tangent hyperplane to the graph of f.",
      reference: "[48:08] 'f(x) ≈ f(x₀) + ⟨∇f(x₀), x−x₀⟩.'",
      computation: `import numpy as np
f     = lambda x: x[0]**2 + x[1]**2
grad  = lambda x: 2*x
x0    = np.array([1., 2.])
x     = np.array([1.1, 2.1])
approx = f(x0) + np.dot(grad(x0), x - x0)
print("True:", f(x), " Linear:", approx)  # 5.62  5.60`,
      connection: "Foundation of gradient descent, linearised Euler steps in simulation, and adjoint methods in differentiable rendering."
    },
    slideImages: ["image_1771988120283_0.png", "image_1771988163054_0.png",
                  "image_1771988197698_0.png", "image_1771988213030_0.png",
                  "image_1771988229711_0.png"],
    diagram: null,
  },
  {
    id: 16,
    question: "What is the gradient of the dot product f(u) = u·v with respect to u (v is constant)?",
    questionType: "single-choice",
    options: [
      "u",
      "v",
      "u + v",
      "u − v"
    ],
    answer: 1,
    explanation: {
      intuition: "In the scalar analogy, d/dx (xy) = y. The multivariable version replaces x with u, y with the vector v, and d/dx with the gradient. Result: just v.",
      reference: "[53:46] 'The gradient with respect to u of uᵀv is equal to v.'",
      computation: `import numpy as np
v  = np.array([3., 5., 7.])
u0 = np.array([1., 2., 3.])
eps = 1e-6
f  = lambda u: np.dot(u, v)
grad_numerical = [(f(u0 + eps*np.eye(3)[i]) - f(u0))/eps for i in range(3)]
print(grad_numerical)   # [3.0, 5.0, 7.0] == v`,
      connection: "Matrix cookbook pattern: ∇_x(xᵀy) = y; ∇_x(xᵀAx) = 2Ax (symmetric A). [55:04–55:44]"
    },
    slideImages: ["image_1771988372388_0.png", "image_1771988432424_0.png",
                  "image_1771988467336_0.png"],
    diagram: null,
  },
  {
    id: 17,
    question: "The gradient of Big F[f] = ⟨f, g⟩₂ (L² inner product of functions f and g) with respect to f is:",
    questionType: "single-choice",
    options: [
      "The function f",
      "The derivative of g",
      "The function g",
      "The zero function"
    ],
    answer: 2,
    explanation: {
      intuition: "The inner product measures alignment. The function best aligned with g is g itself — so the gradient (direction of steepest increase) is g.",
      reference: "[1:00:44] 'The gradient of big F is just little g. The little f falls away and we're left with just g.' Mirrors the vector pattern: ∇_u(u·v) = v.",
      computation: `# Functional gradient — analogous to vector gradient
# F[f] = ∫₀¹ f(x)g(x)dx
# δF/δf = g   (same pattern as ∇_u(u·v) = v)

# Gradient of ‖f‖² = ⟨f,f⟩ → 2f  [1:04:42]
# Mirrors: ∇_u(‖u‖²) = 2u`,
      connection: "[1:05:09] 'The way we differentiate functions of functions really doesn't look different at all from ordinary differentiation.'"
    },
    slideImages: ["image_1771988539060_0.png", "image_1771988651688_0.png",
                  "image_1771988662637_0.png", "image_1771988670464_0.png",
                  "image_1771988738747_0.png", "image_1771988786536_0.png"],
    diagram: null,
  },
  // ─── VECTOR FIELDS: DIVERGENCE & CURL ───────────────────
  {
    id: 18,
    question: "How many fundamental derivatives for vector fields does the lecturer identify, and what are they?",
    questionType: "single-choice",
    options: [
      "One — the gradient",
      "Two — divergence and curl",
      "Three — gradient, divergence, and curl",
      "Four — gradient, divergence, curl, and Laplacian"
    ],
    answer: 1,
    explanation: {
      intuition: "Scalar fields have one derivative (gradient). Vector fields have two: divergence measures expansion/contraction; curl measures rotation.",
      reference: "[1:07:25] 'Actually there are two basic derivatives for vector fields.'",
      computation: `# 2D vector field X: ℝ² → ℝ²
# Divergence: ∇·X = ∂X₁/∂x₁ + ∂X₂/∂x₂   (scalar output)
# Curl:       ∇×X = ∂X₂/∂x₁ - ∂X₁/∂x₂   (scalar in 2D, vector in 3D)`,
      connection: "In 3D the curl is a vector; in 2D it degenerates to a scalar measuring out-of-plane rotation."
    },
    slideImages: ["image_1771988827100_0.png", "image_1771988874726_0.png",
                  "image_1771988926877_0.png"],
    diagram: null,
  },
  {
    id: 19,
    question: "What does the divergence ∇·X of a vector field X measure?",
    questionType: "single-choice",
    options: [
      "The circulation or rotational swirling of the field",
      "The average direction vectors point",
      "How much the field acts as a source (flow outward) or sink (flow inward) — rate of expansion/contraction",
      "The total energy density of the field"
    ],
    answer: 2,
    explanation: {
      intuition: "Imagine the vector field as water velocity. High divergence = water erupting from a source. Negative divergence = water draining into a sink. Zero divergence = incompressible flow.",
      reference: "[1:08:01] 'The divergence measures how much the field is shrinking or expanding, how much it looks like a sink or a source.'",
      computation: `import numpy as np
# Radial field X = (x,y): source at origin
# div X = ∂x/∂x + ∂y/∂y = 1 + 1 = 2  (positive everywhere)

# Incompressible fluid enforces div v = 0  (pressure projection step)`,
      connection: "Fluid simulation enforces div v = 0 at every step. Poisson equation ∇²φ = div F appears in rendering and geometry processing."
    },
    slideImages: ["image_1771988951848_0.png"],
    diagram: null,
  },
  {
    id: 20,
    question: "What does the curl ∇×X of a vector field X measure?",
    questionType: "single-choice",
    options: [
      "The rate of expansion or contraction",
      "How much the vector field is spinning or rotating at each point",
      "The magnitude of the vectors in the field",
      "The gradient of the field's energy"
    ],
    answer: 1,
    explanation: {
      intuition: "Drop a tiny paddle wheel in a fluid. If the velocity field has nonzero curl, the wheel spins. Zero curl → irrotational flow.",
      reference: "[1:09:03] 'What is the curl measuring about this vector field? It's kind of measuring how much this field is spinning.'",
      computation: `# 2D curl: curl X = ∂X₂/∂x₁ - ∂X₁/∂x₂
# Rotation field X = (-y, x):  curl = ∂(x)/∂x - ∂(-y)/∂y = 1+1 = 2
# Gradient field X = ∇f:       curl = 0  (always irrotational)`,
      connection: "[1:14:47] div X = curl(R₉₀ X): divergence and curl are the same operation rotated 90°."
    },
    slideImages: ["image_1771989024001_0.png", "image_1771989058728_0.png",
                  "image_1771989089559_0.png"],
    diagram: <DiagramDivergenceCurl />,
  },
  {
    id: 21,
    question: "What elegant relationship does the lecturer identify between divergence and curl in 2D?",
    questionType: "single-choice",
    options: [
      "They are completely independent operations",
      "div X = curl(R₉₀ X), where R₉₀ rotates each vector by 90° — they are the same operation up to a rotation",
      "The curl always equals the divergence for physical fields",
      "The sum of curl and divergence is always zero"
    ],
    answer: 1,
    explanation: {
      intuition: "Sources/sinks and vortices are the same phenomenon rotated 90°. A radially-expanding field looks like a pure vortex if you rotate every arrow 90°.",
      reference: "[1:14:47] 'The divergence of X is the same as the curl of the 90 degree rotation of X.'",
      computation: `import numpy as np
def num_div(X, x, h=1e-6):
    return ((X(x+[h,0])-X(x-[h,0]))[0] + (X(x+[0,h])-X(x-[0,h]))[1])/(2*h)
def num_curl(X, x, h=1e-6):
    return ((X(x+[h,0])-X(x-[h,0]))[1] - (X(x+[0,h])-X(x-[0,h]))[0])/(2*h)

X   = lambda p: np.array([p[0], p[1]])           # radial
R90 = lambda p: np.array([-p[1], p[0]])          # rotate 90°
x = np.array([1., 2.])
print(num_div(X, x))                              # 2.0
print(num_curl(lambda p: R90(X(p)), x))           # 2.0  ← same!`,
      connection: "This duality underlies Helmholtz decomposition — any field = irrotational + divergence-free — used in fluid simulation and spectral geometry."
    },
    slideImages: ["image_1771989199368_0.png", "image_1771989224011_0.png",
                  "image_1771989278643_0.png"],
    diagram: null,
  },
  {
    id: 22,
    question: "In the fluid simulation example, what simple change of variable leads to qualitatively different simulation results?",
    questionType: "single-choice",
    options: [
      "Changing from 2D to 3D simulation",
      "Switching from velocity field u to stream function ψ",
      "Changing from laminar to turbulent flow",
      "Switching from Eulerian to Lagrangian coordinates"
    ],
    answer: 1,
    explanation: {
      intuition: "Two descriptions of the same fluid — velocity u and stream function ψ — differ mathematically by a 90° rotation. Yet numerically, they produce strikingly different simulations because of how divergence and curl interact with discretisation.",
      reference: "[1:16:52] 'In one case you might use the fluid velocity u, in the other the stream function ψ. Just this mathematically simple change really changes the behaviour of the simulation.'",
      computation: `# Incompressible flow in 2D:
# Method 1: velocity u = (u₁, u₂),   enforce div u = 0 explicitly
# Method 2: stream function ψ,        u = R₉₀ ∇ψ  → div u = 0 automatically
# The stream function satisfies the biharmonic equation Δ²ψ = f`,
      connection: "This motivates careful choice of degrees of freedom in fluid and cloth simulation — the 'right' variables can encode constraints automatically."
    },
    slideImages: ["image_1771989335272_0.png"],
    diagram: null,
  },
  // ─── LAPLACIAN & HESSIAN ─────────────────────────────────
  {
    id: 23,
    question: "Why does the lecturer say the Laplacian is 'unbelievably important' for computer graphics?",
    questionType: "single-choice",
    options: [
      "It only appears in specialised rendering algorithms",
      "It appears across geometry processing, rendering, simulation, and imaging — virtually everywhere in graphics",
      "It is only useful for color space conversions",
      "It is the only operator computable in real time"
    ],
    answer: 1,
    explanation: {
      intuition: "The Laplacian measures how much a function differs from its local average. Smooth functions have Δf ≈ 0. This 'averaging' property makes it ideal for mesh smoothing, heat diffusion, harmonic maps, and spectral analysis.",
      reference: "[1:17:34] 'This is unbelievably important for graphics, it shows up across geometry, across rendering, simulation, imaging, everywhere.'",
      computation: `# Graphics applications of the Laplacian:
# • Mesh smoothing:    Δx_i = Σ_j w_ij (x_j - x_i)
# • Heat equation:     ∂u/∂t = κ Δu
# • Fluid pressure:    ∇²p = div(v/Δt)
# • Poisson editing:   Δf = div g  (image blending)
# • Spectral geometry: eigenfunctions of Δ ↔ Fourier modes on mesh`,
      connection: "[1:21:19] Δf = ∇·(∇f) — divergence of the gradient."
    },
    slideImages: ["image_1771989366312_0.png"],
    diagram: <DiagramLaplacian />,
  },
  {
    id: 24,
    question: "How can the Laplacian Δf be written in terms of divergence and gradient?",
    questionType: "single-choice",
    options: [
      "Δf = gradient of the divergence of f",
      "Δf = curl of the gradient of f",
      "Δf = divergence of the gradient of f: ∇·(∇f)",
      "Δf = divergence of the curl of f"
    ],
    answer: 2,
    explanation: {
      intuition: "Gradient gives vector-valued slopes. Divergence of that vector field measures how the slopes spread. The result is the Laplacian — net curvature as a scalar.",
      reference: "[1:21:19] 'Laplacian of f is the divergence of the gradient of f.' Δf = ∇·(∇f) = Σᵢ ∂²f/∂xᵢ².",
      computation: `import numpy as np
# Analytic: f(x,y) = x² + y²
# ∇f = (2x, 2y);   div(∇f) = ∂(2x)/∂x + ∂(2y)/∂y = 2 + 2 = 4

# Discrete 5-point stencil (h = grid spacing):
def lap5(f, i, j, h):
    return (f[i+1,j]+f[i-1,j]+f[i,j+1]+f[i,j-1] - 4*f[i,j]) / h**2`,
      connection: "Δf = 0 defines harmonic functions — equilibrium of heat. Discrete Laplacians on meshes drive Laplacian editing, shape segmentation, and neural shape representations."
    },
    slideImages: ["image_1771989413169_0.png"],
    diagram: null,
  },
  {
    id: 25,
    question: "How does the lecturer define the Hessian in terms of the gradient?",
    questionType: "single-choice",
    options: [
      "The Hessian is the determinant of the gradient",
      "The Hessian is the transpose of the gradient",
      "The Hessian applied to direction u gives the directional derivative of the gradient along u",
      "The Hessian is the integral of the gradient"
    ],
    answer: 2,
    explanation: {
      intuition: "The gradient is a vector field of first derivatives. The Hessian is its derivative — a matrix of second derivatives. Applying it to direction u tells you how the gradient changes as you move in direction u.",
      reference: "[1:27:25] 'If I take the Hessian of f and apply it to the vector u, I get the directional derivative of the gradient in direction u.'",
      computation: `import numpy as np
# f(x,y) = x² + 2y²
# ∇f = (2x, 4y)
# H = [[∂²f/∂x², ∂²f/∂x∂y],    =  [[2, 0],
#      [∂²f/∂y∂x, ∂²f/∂y²]]        [0, 4]]

H = np.array([[2., 0.], [0., 4.]])
u = np.array([1., 0.])
# H @ u = directional derivative of ∇f along u
print(H @ u)   # [2, 0]  ← how gradient changes in x-direction`,
      connection: "The Hessian appears in the second-order Taylor expansion f(x) ≈ f(x₀) + ∇f·Δx + ½ ΔxᵀHΔx — used in Newton's method, L-BFGS, and curvature-aware optimisation."
    },
    slideImages: ["image_1771989791144_0.png"],
    diagram: null,
  },
];

// ─────────────────────────────────────────────────────────────
// TIMER HOOK
// ─────────────────────────────────────────────────────────────
const useTimer = () => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    let iv = null;
    if (isActive) iv = setInterval(() => setTimeSpent(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [isActive]);
  return {
    timeSpent,
    start: () => setIsActive(true),
    pause: () => setIsActive(false),
    reset: () => { setTimeSpent(0); setIsActive(false); }
  };
};
const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
const Quiz = () => {
  const [screen, setScreen] = useState('welcome');
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState(Array(quizData.length).fill(null));
  const [selected, setSelected] = useState([]);
  const [showExp, setShowExp] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const { timeSpent, start, pause, reset: resetTimer } = useTimer();

  const q = quizData[qIdx];

  useEffect(() => {
    if (screen === 'quiz' && !showExp && !reviewMode) start(); else pause();
  }, [screen, showExp, reviewMode, qIdx]);

  const isCorrect = useCallback((q, ans) => ans !== null && ans === q.answer, []);

  const handleSubmit = () => {
    const newAns = [...answers];
    newAns[qIdx] = selected[0];
    setAnswers(newAns);
    setShowExp(true);
  };
  const handleNext = () => {
    if (qIdx < quizData.length - 1) { setQIdx(qIdx + 1); setSelected([]); setShowExp(false); }
    else { setScreen('results'); pause(); }
  };
  const handlePrev = () => {
    if (qIdx > 0) {
      setQIdx(qIdx - 1);
      setSelected(answers[qIdx - 1] !== null ? [answers[qIdx - 1]] : []);
      setShowExp(answers[qIdx - 1] !== null);
    }
  };
  const handleReview = () => {
    setQIdx(0);
    setSelected(answers[0] !== null ? [answers[0]] : []);
    setShowExp(answers[0] !== null);
    setReviewMode(true);
    setScreen('quiz');
  };
  const handleRestart = () => {
    setScreen('welcome'); setQIdx(0);
    setAnswers(Array(quizData.length).fill(null));
    setSelected([]); setShowExp(false); setReviewMode(false); resetTimer();
  };

  const score = answers.filter((a, i) => isCorrect(quizData[i], a)).length;
  const pct   = Math.round((score / quizData.length) * 100);

  // ─── Styles ────────────────────────────────────────────
  const C = {
    bg: '#0a0a0f', surface: '#111118', border: '#1e2a3a',
    accent: '#38bdf8', accentHover: '#0ea5e9',
    success: '#22c55e', error: '#ef4444', warning: '#f59e0b',
    text: '#e2e8f0', muted: '#94a3b8', code: '#1e2a3a',
  };
  const base   = { minHeight: '100vh', background: `linear-gradient(135deg,${C.bg} 0%,#0a1628 100%)`, color: C.text, fontFamily: "'Rajdhani',sans-serif", padding: '2rem 1rem' };
  const wrap   = { maxWidth: '820px', margin: '0 auto', background: C.surface, borderRadius: '16px', padding: '2rem', border: `1px solid ${C.border}` };
  const btn    = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: C.accent, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontFamily: "'Rajdhani',sans-serif", fontWeight: '600', transition: 'background 0.2s' };
  const code   = { background: C.code, padding: '1rem', borderRadius: '8px', fontSize: '0.82rem', fontFamily: "'JetBrains Mono',monospace", overflowX: 'auto', whiteSpace: 'pre', color: '#93c5fd', lineHeight: '1.6' };

  // ─── Slide images ───────────────────────────────────────
  const SlideImages = ({ images }) => {
    if (!images || images.length === 0) return null;
    return (
      <div style={{ marginTop: '1rem' }}>
        <h4 style={{ fontSize: '0.9rem', color: C.accent, marginBottom: '0.5rem' }}>📸 Lecture Slides</h4>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {images.map((img, i) => (
            <img key={i} src={`/assets/${img}`} alt={`slide ${i + 1}`}
              onError={e => { e.target.style.display = 'none'; }}
              style={{ maxWidth: '100%', flex: '1 1 300px', borderRadius: '8px', border: `1px solid ${C.border}`, objectFit: 'contain' }}
            />
          ))}
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────
  // WELCOME
  // ─────────────────────────────────────────────────────────
  if (screen === 'welcome') return (
    <div style={base}>
      <div style={wrap}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Sigma size={64} color={C.accent} />
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: C.accent, margin: '1rem 0 0.5rem' }}>Lecture 3 Quiz</h1>
          <p style={{ color: C.muted, fontSize: '1.1rem' }}>Vector Calculus in Computer Graphics</p>
          <p style={{ color: C.muted, fontSize: '0.9rem', fontStyle: 'italic' }}>CMU 15-462 • 1:30:13 • Norms · Products · Gradient · Divergence · Curl · Laplacian</p>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <h3 style={{ fontSize: '1.1rem', color: C.accent, marginBottom: '1rem' }}>Topics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: '0.6rem', fontSize: '0.95rem' }}>
            {['Euclidean Norm & Inner Products','Cross Product & Geometry','Matrix Representations','Derivatives & Taylor','Gradient & Optimisation','Divergence & Curl','Laplacian & Hessian'].map(t => (
              <div key={t}><span style={{ color: C.accent }}>• </span>{t}</div>
            ))}
          </div>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', textAlign: 'center' }}>
            {[['25','Questions'],['40%','Easy'],['44%','Medium'],['16%','Hard']].map(([v, l]) => (
              <div key={l}><div style={{ fontSize: '1.8rem', fontWeight: '700', color: C.accent }}>{v}</div><div style={{ fontSize: '0.85rem', color: C.muted }}>{l}</div></div>
            ))}
          </div>
        </div>

        <button style={{ ...btn, width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' }}
          onMouseEnter={e => e.target.style.background = C.accentHover}
          onMouseLeave={e => e.target.style.background = C.accent}
          onClick={() => { setScreen('quiz'); start(); }}>
          <Sigma size={20} /> Start Quiz
        </button>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────
  // RESULTS
  // ─────────────────────────────────────────────────────────
  if (screen === 'results') return (
    <div style={base}>
      <div style={wrap}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Trophy size={64} color={pct >= 70 ? C.success : pct >= 50 ? C.warning : C.error} />
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', margin: '1rem 0 0.5rem' }}>Quiz Complete!</h1>
          <p style={{ color: C.muted }}><Clock size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.4rem' }} />{fmt(timeSpent)}</p>
        </div>
        <div style={{ background: '#0d0d12', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', textAlign: 'center', border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: '4rem', fontWeight: '700', color: pct >= 70 ? C.success : pct >= 50 ? C.warning : C.error }}>{pct}%</div>
          <div style={{ color: C.muted, fontSize: '1.2rem', marginBottom: '0.5rem' }}>{score} / {quizData.length} correct</div>
          <div style={{ color: C.muted }}>{pct >= 90 ? '∇ Vector Calculus Master!' : pct >= 70 ? '∫ Strong Foundations!' : pct >= 50 ? 'Δ Keep Reviewing!' : '≠ Back to Lecture 3!'}</div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {[['Review Answers', handleReview, BookOpen], ['Restart', handleRestart, RefreshCw]].map(([label, fn, Icon]) => (
            <button key={label} style={{ ...btn, flex: 1, justifyContent: 'center' }}
              onMouseEnter={e => e.target.style.background = C.accentHover}
              onMouseLeave={e => e.target.style.background = C.accent}
              onClick={fn}><Icon size={18} />{label}</button>
          ))}
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────
  // QUIZ SCREEN
  // ─────────────────────────────────────────────────────────
  return (
    <div style={base}>
      <div style={wrap}>
        {/* Progress */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem', color: C.muted }}>
            <span>Question {qIdx + 1} of {quizData.length}</span>
            <span><Clock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.3rem' }} />{fmt(timeSpent)}</span>
          </div>
          <div style={{ height: '5px', background: C.border, borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((qIdx + 1) / quizData.length) * 100}%`, background: C.accent, transition: 'width 0.3s' }} />
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {[q.difficulty, (q.section || '').split('[')[0].trim(), q.topic].filter(Boolean).map(t => (
            <span key={t} style={{ padding: '0.2rem 0.65rem', borderRadius: '5px', background: `${C.accent}20`, color: C.accent, fontSize: '0.82rem', fontWeight: '600' }}>{t}</span>
          ))}
        </div>

        {/* Question */}
        <h2 style={{ fontSize: '1.35rem', fontWeight: '600', lineHeight: '1.5', marginBottom: '1.5rem' }}>{q.question}</h2>

        {/* Options */}
        <div style={{ marginBottom: '2rem' }}>
          {q.options.map((opt, i) => (
            <div key={i} onClick={() => !showExp && !reviewMode && setSelected([i])}
              style={{
                padding: '0.9rem 1rem', borderRadius: '8px', marginBottom: '0.6rem', cursor: showExp || reviewMode ? 'default' : 'pointer', transition: 'all 0.2s',
                border: `2px solid ${showExp || reviewMode ? i === q.answer ? C.success : selected[0] === i ? C.error : C.border : selected[0] === i ? C.accent : C.border}`,
                background: showExp || reviewMode ? i === q.answer ? `${C.success}15` : selected[0] === i ? `${C.error}15` : C.surface : selected[0] === i ? `${C.accent}15` : C.surface,
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {(showExp || reviewMode) && (i === q.answer ? <CheckCircle size={18} color={C.success} /> : selected[0] === i ? <XCircle size={18} color={C.error} /> : null)}
                <span>{opt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Explanation */}
        {showExp && q.explanation && (
          <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
            <h3 style={{ color: C.accent, fontSize: '1.1rem', marginBottom: '1rem' }}>Explanation</h3>

            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: C.accent, fontSize: '0.95rem', marginBottom: '0.4rem' }}>💡 Intuition</h4>
              <p style={{ color: C.muted, lineHeight: '1.6' }}>{q.explanation.intuition}</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: C.accent, fontSize: '0.95rem', marginBottom: '0.4rem' }}>📖 Lecture Reference</h4>
              <p style={{ color: C.muted, lineHeight: '1.6' }}>{q.explanation.reference}</p>
            </div>

            {/* Slide images from Logseq */}
            {q.slideImages && q.slideImages.length > 0 && (
              <SlideImages images={q.slideImages} />
            )}

            {/* Inline diagram if any */}
            {q.diagram && (
              <div style={{ margin: '1rem 0' }}>
                <h4 style={{ color: C.accent, fontSize: '0.95rem', marginBottom: '0.5rem' }}>📊 Visual</h4>
                <div style={{ background: '#0a0a14', padding: '1rem', borderRadius: '8px', border: `1px solid ${C.border}`, display: 'inline-block' }}>
                  {q.diagram}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
              <h4 style={{ color: C.accent, fontSize: '0.95rem', marginBottom: '0.4rem' }}>💻 Code</h4>
              <pre style={code}>{q.explanation.computation}</pre>
            </div>

            <div>
              <h4 style={{ color: C.accent, fontSize: '0.95rem', marginBottom: '0.4rem' }}>🔗 Connection</h4>
              <p style={{ color: C.muted, lineHeight: '1.6' }}>{q.explanation.connection}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handlePrev} disabled={qIdx === 0}
            style={{ ...btn, background: C.border, opacity: qIdx === 0 ? 0.5 : 1, cursor: qIdx === 0 ? 'not-allowed' : 'pointer' }}
            onMouseEnter={e => qIdx !== 0 && (e.target.style.background = '#2a3a4a')}
            onMouseLeave={e => qIdx !== 0 && (e.target.style.background = C.border)}>
            <ChevronLeft size={18} /> Prev
          </button>

          {!showExp && !reviewMode && (
            <button onClick={handleSubmit} disabled={selected.length === 0}
              style={{ ...btn, flex: 1, justifyContent: 'center', opacity: selected.length === 0 ? 0.5 : 1 }}
              onMouseEnter={e => selected.length > 0 && (e.target.style.background = C.accentHover)}
              onMouseLeave={e => selected.length > 0 && (e.target.style.background = C.accent)}>
              Submit Answer
            </button>
          )}

          {(showExp || reviewMode) && (
            <button onClick={handleNext}
              style={{ ...btn, flex: 1, justifyContent: 'center' }}
              onMouseEnter={e => e.target.style.background = C.accentHover}
              onMouseLeave={e => e.target.style.background = C.accent}>
              {qIdx < quizData.length - 1 ? <><span>Next</span><ChevronRight size={18} /></> : <><span>Results</span><Trophy size={18} /></>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;

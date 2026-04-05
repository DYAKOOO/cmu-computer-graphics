'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Grid } from 'lucide-react';

/**
 * CMU 15-462/662 Computer Graphics — Lecture 2
 * Linear Algebra Review
 * Topics: Vectors, Vector Spaces, Linear Maps, Inner Products,
 *         Norms, Orthogonality, Gram-Schmidt, Fourier Decomposition
 */

<style>
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
</style>

// ─── SVG Diagrams ────────────────────────────────────────────

const DiagramVectorAdd = () => (
  <svg viewBox="0 0 260 160" width="260" height="160">
    <defs>
      {['u','v','uv'].map((id, i) => (
        <marker key={id} id={`a${id}`} markerWidth="7" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0,7 3,0 6" fill={['#4ade80','#f472b6','#38bdf8'][i]} />
        </marker>
      ))}
    </defs>
    <circle cx="50" cy="120" r="3" fill="#e2e8f0" />
    {/* u */}
    <line x1="50" y1="120" x2="148" y2="120" stroke="#4ade80" strokeWidth="2.5" markerEnd="url(#au)" />
    <text x="95" y="137" fill="#4ade80" fontSize="13" fontFamily="Rajdhani" fontWeight="600">u</text>
    {/* v starting from tip of u */}
    <line x1="150" y1="120" x2="208" y2="52" stroke="#f472b6" strokeWidth="2.5" markerEnd="url(#av)" />
    <text x="192" y="92" fill="#f472b6" fontSize="13" fontFamily="Rajdhani" fontWeight="600">v</text>
    {/* u+v */}
    <line x1="50" y1="120" x2="206" y2="54" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6,3" markerEnd="url(#auv)" />
    <text x="100" y="72" fill="#38bdf8" fontSize="12" fontFamily="Rajdhani">u + v</text>
    <text x="10" y="152" fill="#94a3b8" fontSize="10" fontFamily="Rajdhani">Tip-to-tail: lay u then v</text>
  </svg>
);

const DiagramLinearMap = () => (
  <svg viewBox="0 0 260 160" width="260" height="160">
    <defs>
      <marker id="lm1" markerWidth="7" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0,7 3,0 6" fill="#fbbf24" />
      </marker>
    </defs>
    {/* Pentagon before */}
    <polygon points="50,50 80,30 110,50 100,80 60,80" fill="#38bdf820" stroke="#38bdf8" strokeWidth="1.5" />
    <text x="60" y="100" fill="#38bdf8" fontSize="11" fontFamily="Rajdhani">input V</text>
    {/* Arrow */}
    <line x1="120" y1="60" x2="148" y2="60" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#lm1)" />
    <text x="124" y="52" fill="#fbbf24" fontSize="10" fontFamily="Rajdhani">f(·)</text>
    {/* Rotated/scaled pentagon */}
    <polygon points="170,80 185,40 215,45 220,85 185,95" fill="#f472b620" stroke="#f472b6" strokeWidth="1.5" />
    <text x="178" y="110" fill="#f472b6" fontSize="11" fontFamily="Rajdhani">output W</text>
    <text x="30" y="148" fill="#94a3b8" fontSize="10" fontFamily="Rajdhani">f(u+v)=f(u)+f(v),  f(αu)=αf(u)</text>
  </svg>
);

const DiagramGramSchmidt = () => (
  <svg viewBox="0 0 260 160" width="260" height="160">
    <defs>
      {['g1','g2','g3','g4'].map((id, i) => (
        <marker key={id} id={id} markerWidth="7" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0,7 3,0 6" fill={['#f472b6','#94a3b8','#4ade80','#38bdf8'][i]} />
        </marker>
      ))}
    </defs>
    <circle cx="80" cy="120" r="3" fill="#e2e8f0" />
    {/* u1 — original */}
    <line x1="80" y1="120" x2="200" y2="120" stroke="#f472b6" strokeWidth="2" markerEnd="url(#g1)" />
    <text x="207" y="124" fill="#f472b6" fontSize="12" fontFamily="Rajdhani">u₁</text>
    {/* e1 — normalised */}
    <line x1="80" y1="120" x2="140" y2="120" stroke="#4ade80" strokeWidth="2.5" markerEnd="url(#g3)" />
    <text x="107" y="112" fill="#4ade80" fontSize="12" fontFamily="Rajdhani" fontWeight="700">e₁</text>
    {/* u2 — original */}
    <line x1="80" y1="120" x2="140" y2="40" stroke="#94a3b8" strokeWidth="1.8" markerEnd="url(#g2)" />
    <text x="143" y="38" fill="#94a3b8" fontSize="12" fontFamily="Rajdhani">u₂</text>
    {/* projection */}
    <line x1="140" y1="40" x2="140" y2="120" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3" />
    <text x="144" y="82" fill="#94a3b8" fontSize="10" fontFamily="Rajdhani">proj</text>
    {/* e2 — orthogonal part */}
    <line x1="140" y1="120" x2="140" y2="42" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#g4)" />
    <text x="145" y="80" fill="#38bdf8" fontSize="12" fontFamily="Rajdhani" fontWeight="700">e₂</text>
    <polyline points="140,120 130,120 130,110" fill="none" stroke="#94a3b8" strokeWidth="1" />
  </svg>
);

const DiagramFourier = () => (
  <svg viewBox="0 0 260 140" width="260" height="140">
    <rect x="5" y="5" width="250" height="130" rx="6" fill="#1e2a3a" />
    <text x="14" y="24" fill="#94a3b8" fontSize="11" fontFamily="Rajdhani">f(x) ≈  a₀ + Σ aₖ cos(kx) + bₖ sin(kx)</text>
    {/* Wave components */}
    {[0,1,2].map(k => {
      const y0 = 50 + k * 28, amp = 12 / (k+1), freq = k+1;
      const pts = Array.from({length:40},(_,i)=>{
        const x = 14 + i*5.8;
        const y = y0 - amp * Math.sin(freq * i * 0.4);
        return `${x},${y}`;
      }).join(' ');
      const colors = ['#4ade80','#f472b6','#fbbf24'];
      return <polyline key={k} points={pts} fill="none" stroke={colors[k]} strokeWidth="1.8" />;
    })}
    <text x="225" y="57" fill="#4ade80" fontSize="10" fontFamily="JetBrains Mono">k=1</text>
    <text x="225" y="85" fill="#f472b6" fontSize="10" fontFamily="JetBrains Mono">k=2</text>
    <text x="225" y="113" fill="#fbbf24" fontSize="10" fontFamily="JetBrains Mono">k=3</text>
  </svg>
);

const DiagramOrthonormal = () => (
  <svg viewBox="0 0 200 160" width="200" height="160">
    <defs>
      {['o1','o2','o3'].map((id,i) => (
        <marker key={id} id={id} markerWidth="7" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0,7 3,0 6" fill={['#4ade80','#f472b6','#fbbf24'][i]} />
        </marker>
      ))}
    </defs>
    <circle cx="90" cy="100" r="3" fill="#e2e8f0" />
    <line x1="90" y1="100" x2="168" y2="100" stroke="#4ade80" strokeWidth="2.5" markerEnd="url(#o1)" />
    <text x="172" y="105" fill="#4ade80" fontSize="13" fontFamily="Rajdhani" fontWeight="700">e₁</text>
    <line x1="90" y1="100" x2="90" y2="22" stroke="#f472b6" strokeWidth="2.5" markerEnd="url(#o2)" />
    <text x="95" y="18" fill="#f472b6" fontSize="13" fontFamily="Rajdhani" fontWeight="700">e₂</text>
    <polyline points="90,100 102,100 102,88" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
    <text x="20" y="100" fill="#94a3b8" fontSize="10" fontFamily="Rajdhani">‖eᵢ‖=1</text>
    <text x="20" y="115" fill="#94a3b8" fontSize="10" fontFamily="Rajdhani">eᵢ·eⱼ=0, i≠j</text>
    <text x="20" y="130" fill="#38bdf8" fontSize="10" fontFamily="Rajdhani">v = Σ(v·eᵢ)eᵢ</text>
  </svg>
);

// ─── Quiz Data ────────────────────────────────────────────────
const quizData = [
  // ─── LINEAR ALGEBRA FOUNDATIONS ─────────────────────────
  {
    id: 1,
    question: "Why is linear algebra described as 'the bread and butter' of computer graphics?",
    questionType: "single-choice",
    options: [
      "It is the only mathematics needed for rendering",
      "It bridges geometry and physics to actual computation — once a problem is expressed as a linear system, a computer can solve it efficiently",
      "It enables GPU programming directly",
      "It provides the theory behind color spaces"
    ],
    answer: 1,
    explanation: {
      intuition: "Linear algebra turns geometric or physical problems into numbers a computer can crunch. Once your problem is Ax=b, you hand it to a numerical solver and it runs blazing fast.",
      reference: "[00:42] 'Once you can express the solution to a problem in terms of linear algebra you're really in good shape you can hand off your linear system to a computer and it does that very efficiently.'",
      computation: `import numpy as np
# Virtually every graphics operation becomes linear algebra:
# • 3D transform:    x' = A @ x   (matrix-vector)
# • Least squares:   A.T @ A @ x = A.T @ b
# • Mesh smoothing:  L @ x = b    (sparse linear system)
A = np.array([[2.,1.],[1.,3.]])
b = np.array([5.,10.])
x = np.linalg.solve(A, b)   # instant
print(x)`,
      connection: "[01:29] 'Under the hood you're really running a high-performance linear solver' — fluid simulation, geometry processing, and neural rendering all rely on this."
    },
    section: "Introduction [00:42]", topic: "MOTIVATION", difficulty: "Easy",
    slideImages: [], diagram: null,
  },
  {
    id: 2,
    question: "What fundamental information does a vector encode, according to the lecture?",
    questionType: "single-choice",
    options: [
      "A position in space and a time stamp",
      "A direction and a magnitude",
      "A set of coordinates in a fixed reference frame",
      "A starting point and an ending point"
    ],
    answer: 1,
    explanation: {
      intuition: "A vector is a little arrow. The arrow has a length (magnitude) and points somewhere (direction). Crucially, it does NOT have a fixed location — in linear algebra all vectors share the same origin.",
      reference: "[05:32] 'A vector fundamentally encodes a direction and a magnitude.' [06:22] 'In linear algebra, vectors don't have different base points — they're all based at the origin.'",
      computation: `import numpy as np
v = np.array([3., 4.])
magnitude  = np.linalg.norm(v)   # 5.0
direction  = v / magnitude        # [0.6, 0.8]
print("mag:", magnitude, "dir:", direction)`,
      connection: "[07:51] Length is coordinate-invariant; angle (direction) needs a reference frame. This distinction matters when changing coordinate systems."
    },
    section: "Vectors [05:32]", topic: "VECTORS", difficulty: "Easy",
    slideImages: [], diagram: <DiagramVectorAdd />,
  },
  {
    id: 3,
    question: "Vector addition is commutative: u + v = v + u. Where does this rule come from?",
    questionType: "single-choice",
    options: [
      "It is an axiom handed down by mathematicians",
      "It follows geometrically from the tip-to-tail construction — going u then v ends at the same point as going v then u",
      "It is a consequence of the dot product",
      "It only holds for unit vectors"
    ],
    answer: 1,
    explanation: {
      intuition: "Draw u and then v tip-to-tail. Now draw v and then u. Both paths end at the same destination — you land at the same arrow. The rule isn't arbitrary; it's a picture.",
      reference: "[11:39] 'If we do that we'll end up in exactly the same place so u+v is the same as v+u.' [12:20] 'This property doesn't fall out of the sky — it comes from thinking about how little arrows behave when we lay them out in the plane.'",
      computation: `import numpy as np
u = np.array([2., 3.])
v = np.array([-1., 4.])
print(u + v)   # [1. 7.]
print(v + u)   # [1. 7.]  — same`,
      connection: "[15:43] The lecturer walks through each vector space axiom and shows it comes from a natural geometric picture, not from an arbitrary rule."
    },
    section: "Vector Addition [11:05]", topic: "VECTOR_OPERATIONS", difficulty: "Easy",
    slideImages: [], diagram: null,
  },
  {
    id: 4,
    question: "Why do we need scalar multiplication as a separate operation from addition?",
    questionType: "single-choice",
    options: [
      "Because computers can multiply faster than they add",
      "Because you can only add vectors that point in the same direction",
      "Because non-integer scaling (e.g. 2.5u) cannot be expressed by repeated addition alone",
      "Because scalar multiplication changes the direction of a vector"
    ],
    answer: 2,
    explanation: {
      intuition: "2u = u + u works. But 2.5u means 'go 2.5 times as far as u' — you can't express that with a finite sum of copies of u. Scalar multiplication fills this gap.",
      reference: "[13:27] 'It doesn't quite work if I want to multiply by something other than an integer — if I want 2.5 times u I have to think about going in the direction of u 2.5 times its length.'",
      computation: `import numpy as np
u = np.array([4., 2.])
print(2.5 * u)       # [10.  5.] — can't do with addition alone
print(u + u + 0.5*u) # [10.  5.] — need scalar mult for the 0.5`,
      connection: "[14:22] Drawing a(bu) = (ab)u as a picture shows the rule emerges from geometry, not from abstract axioms."
    },
    section: "Scalar Multiplication [12:52]", topic: "VECTOR_OPERATIONS", difficulty: "Easy",
    slideImages: [], diagram: null,
  },
  {
    id: 5,
    question: "What is the purpose of the formal vector space axiom list (commutativity, associativity, zero vector, etc.)?",
    questionType: "single-choice",
    options: [
      "To give mathematicians a set of rules to memorise",
      "To identify when non-arrow objects (functions, images, polynomials) obey the same structure as arrows and can be treated as vectors",
      "To distinguish between 2D and 3D vectors",
      "To define the dot product"
    ],
    answer: 1,
    explanation: {
      intuition: "The axiom list isn't about arrows — it's a checklist. If images or functions pass every item on the list, they ARE vectors and you can use all of linear algebra on them.",
      reference: "[16:56] 'Any collection of objects satisfying all these properties is then a vector space, even if they don't look like little arrows.' [17:16] 'We're going to encounter other objects that obey this same set of rules but are not the same as just a little arrow.'",
      computation: `# Functions on [0,1] form a vector space:
# • (f+g)(x) = f(x)+g(x)         ✓ addition
# • (αf)(x) = α·f(x)              ✓ scalar mult
# • zero vector = zero function 0(x)=0  ✓
# All axioms check out → functions are vectors!`,
      connection: "[19:52] Functions describing image intensity, geometry, or sound vibration all qualify — this is why Fourier analysis and PDE methods are 'linear algebra in disguise.'"
    },
    section: "Vector Spaces [16:08]", topic: "VECTOR_SPACES", difficulty: "Medium",
    slideImages: [], diagram: null,
  },
  {
    id: 6,
    question: "How are functions treated as vectors in graphics?",
    questionType: "single-choice",
    options: [
      "They are converted to arrays of samples and treated as finite-dimensional vectors",
      "They are genuine infinite-dimensional vectors — you can add and scale them pointwise, and all vector space properties hold",
      "They are not vectors; functions need a separate mathematical framework",
      "Only piecewise-linear functions qualify as vectors"
    ],
    answer: 1,
    explanation: {
      intuition: "f + g is defined as (f+g)(x) = f(x)+g(x). αf means (αf)(x) = α·f(x). All eight vector space axioms hold — so the space of all such functions IS a vector space, just infinite-dimensional.",
      reference: "[21:30] 'f+g at any point x: evaluate f at x, evaluate g at x, take their sum. Because the real numbers are a vector space, this defines addition of functions.'",
      computation: `import numpy as np
x  = np.linspace(0, 1, 1000)
f  = np.sin(2*np.pi*x)
g  = np.cos(2*np.pi*x)
h  = f + g                  # pointwise addition — still a function
h2 = 3.0 * f               # scalar multiplication`,
      connection: "[20:12] 'A function could be the intensity of an image, describing the shape of geometry, or the amplitude of vibration.' All of these are vectors."
    },
    section: "Functions as Vectors [19:52]", topic: "VECTOR_SPACES", difficulty: "Medium",
    slideImages: [], diagram: null,
  },
  // ─── INNER PRODUCTS & NORMS ──────────────────────────────
  {
    id: 7,
    question: "What does the L² norm of a function measure, and what is its formula?",
    questionType: "single-choice",
    options: [
      "The maximum value of the function; ‖f‖ = max|f(x)|",
      "The 'energy' or 'size' of the function; ‖f‖₂ = √∫f(x)² dx",
      "The number of zeros of the function",
      "The derivative of the function at its peak"
    ],
    answer: 1,
    explanation: {
      intuition: "Just like ‖v‖ = √Σvᵢ² sums squared components, ‖f‖₂ = √∫f² integrates the squared values. The integral generalises the sum to infinitely many 'components'.",
      reference: "[41:14] 'This really doesn't look much different from our definition of the Euclidean norm for vectors in Rⁿ — we have a square root, we're squaring the value at each point, and we're integrating.'",
      computation: `import numpy as np
x  = np.linspace(0, 1, 10000)
dx = x[1]-x[0]
f  = np.sin(np.pi*x)
L2_norm = np.sqrt(np.sum(f**2) * dx)   # ≈ √(1/2) ≈ 0.707
print(L2_norm)`,
      connection: "[41:39] 'Integration and sums are very similar — an integral is the limit of Riemann sums.' This is why discrete (vectors) and continuous (functions) share the same linear algebra."
    },
    section: "L² Norm [41:14]", topic: "NORMS", difficulty: "Medium",
    slideImages: [], diagram: null,
  },
  {
    id: 8,
    question: "What does the inner product ⟨u, v⟩ measure geometrically?",
    questionType: "single-choice",
    options: [
      "The distance between the tips of u and v",
      "How well aligned (similar in direction) the two vectors are",
      "The area of the triangle formed by u and v",
      "The projection of u onto the orthogonal complement of v"
    ],
    answer: 1,
    explanation: {
      intuition: "⟨u,v⟩ = ‖u‖‖v‖cosθ. When θ=0 (same direction) it's maximised; when θ=90° it's zero (orthogonal = 'nothing in common'). It measures alignment.",
      reference: "[58:31] The lecturer uses inner products to measure 'interesting content' in images — a high inner product with a detector template means the image is aligned with that feature.",
      computation: `import numpy as np
u = np.array([1., 0.])   # points right
v = np.array([1., 0.])   # same
w = np.array([0., 1.])   # points up
print(np.dot(u, v))   # 1.0  — perfect alignment
print(np.dot(u, w))   # 0.0  — orthogonal`,
      connection: "[36:47] Triangle inequality: ‖u+v‖ ≤ ‖u‖+‖v‖ — follows from the inner product structure and is visualised by the tip-to-tail picture."
    },
    section: "Inner Products [36:47]", topic: "INNER_PRODUCTS", difficulty: "Easy",
    slideImages: [], diagram: null,
  },
  {
    id: 9,
    question: "What does it mean for two vectors to be orthogonal?",
    questionType: "single-choice",
    options: [
      "They have the same magnitude",
      "Their inner product is zero — they share no common component",
      "One is a scalar multiple of the other",
      "They point in opposite directions"
    ],
    answer: 1,
    explanation: {
      intuition: "Orthogonal means 90° apart — the arrows are perpendicular. The inner product measures alignment, so zero alignment = zero inner product = orthogonal.",
      reference: "Geometrically: ⟨u,v⟩ = ‖u‖‖v‖cos(90°) = 0. The lecturer uses orthogonality throughout as the basis for decompositions and the Gram-Schmidt process.",
      computation: `import numpy as np
u = np.array([1., 2., 3.])
v = np.array([1., 1., -1.])
print(np.dot(u, v))   # 1+2-3 = 0 — orthogonal!`,
      connection: "[1:21:28] Gram-Schmidt builds an orthonormal basis by repeatedly subtracting out projections — the result is a set of mutually orthogonal, unit-length vectors."
    },
    section: "Orthogonality [1:21:28]", topic: "INNER_PRODUCTS", difficulty: "Easy",
    slideImages: [], diagram: <DiagramOrthonormal />,
  },
  {
    id: 10,
    question: "What is an orthonormal basis, and why is it especially useful?",
    questionType: "single-choice",
    options: [
      "A basis where all vectors point in the same direction",
      "A set of mutually orthogonal unit vectors; coordinates are simply inner products, and the norm formula √Σcᵢ² works without correction",
      "A basis with the fewest possible vectors",
      "A basis that is fixed to world-space coordinates"
    ],
    answer: 1,
    explanation: {
      intuition: "With an orthonormal basis {e₁,…,eₙ}, to find how much of eᵢ is in v, just compute v·eᵢ. No matrix inversion needed. And ‖v‖² = Σ(v·eᵢ)² — Pythagoras generalised.",
      reference: "[1:26:06] 'Just like I can project a vector in Rⁿ onto an orthonormal basis to write it in components, I can also project functions onto a basis of sinusoids — that is the Fourier transform.'",
      computation: `import numpy as np
e1 = np.array([1.,0.,0.])
e2 = np.array([0.,1.,0.])
e3 = np.array([0.,0.,1.])
v  = np.array([3.,4.,5.])
# Coordinates = inner products (only works because orthonormal)
coords = [np.dot(v, e) for e in [e1,e2,e3]]
print(coords)          # [3.0, 4.0, 5.0]
print(np.linalg.norm(v)**2, sum(c**2 for c in coords))  # same`,
      connection: "[1:21:28] Gram-Schmidt converts any linearly independent set into an orthonormal basis, enabling these convenient properties."
    },
    section: "Orthonormal Bases [1:21:28]", topic: "ORTHOGONALITY", difficulty: "Medium",
    slideImages: [], diagram: null,
  },
  // ─── GRAM-SCHMIDT ────────────────────────────────────────
  {
    id: 11,
    question: "What does the Gram-Schmidt algorithm do, and what is its first step?",
    questionType: "single-choice",
    options: [
      "It finds the eigenvalues of a matrix; first step: compute the determinant",
      "It converts any set of linearly independent vectors into an orthonormal set; first step: normalise the first vector",
      "It computes the QR decomposition numerically; first step: Householder reflection",
      "It orthogonalises a matrix by row reduction; first step: pivot selection"
    ],
    answer: 1,
    explanation: {
      intuition: "Start with u₁ — just normalise it to get e₁. For each subsequent vector, subtract its projections onto all previous eᵢ (to remove shared components), then normalise. The result is mutually perpendicular unit vectors.",
      reference: "[1:21:28] 'One simple algorithm is Gram-Schmidt: start with the first vector and normalise it — take u₁ and divide by its length to get e₁.'",
      computation: `import numpy as np
def gram_schmidt(vecs):
    basis = []
    for v in vecs:
        w = v.copy()
        for e in basis:
            w -= np.dot(w, e) * e   # subtract projection
        w /= np.linalg.norm(w)      # normalise
        basis.append(w)
    return basis
u1 = np.array([1., 1., 0.])
u2 = np.array([1., 0., 1.])
e1, e2 = gram_schmidt([u1, u2])
print(np.dot(e1, e2))   # ≈ 0.0  (orthogonal)`,
      connection: "QR decomposition (used in least-squares solvers throughout graphics) is essentially Gram-Schmidt applied to matrix columns."
    },
    section: "Gram-Schmidt [1:21:28]", topic: "ORTHOGONALITY", difficulty: "Medium",
    slideImages: [], diagram: <DiagramGramSchmidt />,
  },
  // ─── LINEAR MAPS ─────────────────────────────────────────
  {
    id: 12,
    question: "What two properties define a linear map f: V → W?",
    questionType: "single-choice",
    options: [
      "f is continuous and differentiable",
      "f(u + v) = f(u) + f(v)  AND  f(αu) = αf(u)  for all u,v,α",
      "f preserves distances and angles",
      "f has an inverse and a determinant"
    ],
    answer: 1,
    explanation: {
      intuition: "Linear maps respect vector operations: adding then mapping = mapping then adding. Scaling then mapping = mapping then scaling. They are 'structure-preserving' — they don't break the vector-space rules.",
      reference: "[1:06:16] 'f(u+v) = f(u)+f(v) and f(αu) = αf(u) — and actually that's it, it's just those two properties.'",
      computation: `import numpy as np
A = np.array([[2., 1.], [0., 3.]])    # any matrix IS a linear map
u = np.array([1., 2.])
v = np.array([3., 1.])
alpha = 4.0
print(np.allclose(A @ (u+v), A@u + A@v))     # True — additivity
print(np.allclose(A @ (alpha*u), alpha*(A@u))) # True — homogeneity`,
      connection: "[1:03:08] 'All kinds of functions and maps can be approximated by linear maps over short distances' — this is why linearisation and Taylor approximation work so well."
    },
    section: "Linear Maps [1:06:16]", topic: "LINEAR_MAPS", difficulty: "Medium",
    slideImages: [], diagram: <DiagramLinearMap />,
  },
  {
    id: 13,
    question: "Why can every linear map between finite-dimensional vector spaces be represented as a matrix?",
    questionType: "single-choice",
    options: [
      "Because matrices are the only objects computers can store",
      "Because linearity means the map is fully determined by where it sends each basis vector, and those images form the columns of the matrix",
      "Because every linear map is invertible",
      "Because linear maps always preserve the dimension of the space"
    ],
    answer: 1,
    explanation: {
      intuition: "If you know f(e₁), f(e₂), …, f(eₙ), you know everything — because any v = Σcᵢeᵢ, so f(v) = Σcᵢf(eᵢ). Stack the images as columns → you have the matrix.",
      reference: "[1:06:16] The linear map definition leads directly to the matrix representation: columns are images of basis vectors.",
      computation: `import numpy as np
# e₁=[1,0], e₂=[0,1]. Suppose f(e₁)=[2,0], f(e₂)=[1,3]
A = np.column_stack([[2,0],[1,3]])  # columns = images of basis
v = np.array([5., 7.])
print(A @ v)   # 5*[2,0] + 7*[1,3] = [17, 21]`,
      connection: "This is why the lecturer says 'the columns of A are the images of the standard basis vectors' — it follows directly from the definition of linearity."
    },
    section: "Linear Maps [1:06:16]", topic: "LINEAR_MAPS", difficulty: "Medium",
    slideImages: [], diagram: null,
  },
  {
    id: 14,
    question: "According to the lecture, what is a key practical benefit of approximating functions and maps as linear near a given point?",
    questionType: "single-choice",
    options: [
      "The approximation is always exact",
      "Linear systems are easy to solve numerically, so you can hand the problem to a computer",
      "Linear maps preserve all higher-order features of the original function",
      "Linear approximations work at any scale, not just locally"
    ],
    answer: 1,
    explanation: {
      intuition: "Near any smooth point, every function looks linear. That linearisation can be solved instantly by a computer. This is why Newton's method and gradient descent are so powerful in graphics.",
      reference: "[1:03:08] 'All kinds of functions and maps can be approximated by linear maps over short distances. If you've seen Taylor series, you know that at least in the vicinity of some point you can always use a linear function to give a reasonable approximation.'",
      computation: `import numpy as np
# Linearise f(x) = x³ near x₀=2
x0 = 2.0
f   = lambda x: x**3
fp  = lambda x: 3*x**2    # derivative = slope of linear approx
approx = lambda x: f(x0) + fp(x0)*(x - x0)
print(f(2.1), approx(2.1))   # 9.261  vs  9.2  — close!`,
      connection: "[00:42] The reason numerical linear algebra 'makes modern computer graphics possible' — you linearise the problem, then solve the linear system."
    },
    section: "Linear Approximation [1:03:08]", topic: "LINEAR_MAPS", difficulty: "Medium",
    slideImages: [], diagram: null,
  },
  // ─── FOURIER & FUNCTION SPACES ───────────────────────────
  {
    id: 15,
    question: "The Fourier transform is described in the lecture as 'linear algebra on function spaces'. What does that mean?",
    questionType: "single-choice",
    options: [
      "The Fourier transform multiplies every frequency by the same constant",
      "Expressing a function in the Fourier basis (sinusoids) is exactly like expressing a vector in an orthonormal basis — the coefficients are inner products",
      "The Fourier transform computes the eigenvalues of a differential operator",
      "It converts discrete signals to continuous ones"
    ],
    answer: 1,
    explanation: {
      intuition: "In Rⁿ: the coordinate of v in direction eᵢ is v·eᵢ. For a periodic function: the Fourier coefficient at frequency k is ⟨f, sin(kx)⟩ or ⟨f, cos(kx)⟩. Same idea, infinite dimensions.",
      reference: "[1:26:06] 'Just like I can project a vector in Rⁿ onto an orthonormal basis to write it in components, I can also project a 2π-periodic function onto a basis of sinusoids — that is the Fourier transform.'",
      computation: `import numpy as np
x  = np.linspace(0, 2*np.pi, 1000)
f  = np.sin(x) + 0.5*np.cos(2*x)   # a function

# Inner products with basis functions (discrete approximation)
dx = x[1]-x[0]
a1 = np.sum(f * np.cos(1*x)) * dx / np.pi   # ≈ 0
b1 = np.sum(f * np.sin(1*x)) * dx / np.pi   # ≈ 1.0
a2 = np.sum(f * np.cos(2*x)) * dx / np.pi   # ≈ 0.5
print(b1, a2)   # recovers original coefficients`,
      connection: "[1:28:12] Fourier decomposition of a 3D mesh separates smooth large-scale features from fine bumps — used in spectral geometry processing."
    },
    section: "Fourier [1:26:06]", topic: "FOURIER", difficulty: "Hard",
    slideImages: [], diagram: <DiagramFourier />,
  },
  {
    id: 16,
    question: "What does a high inner product ⟨f, g⟩ between an image f and a template g indicate?",
    questionType: "single-choice",
    options: [
      "The images have the same resolution",
      "The image and template are strongly aligned — the image contains the pattern described by g",
      "The image has high contrast",
      "The template g is an eigenvector of f"
    ],
    answer: 1,
    explanation: {
      intuition: "The inner product measures alignment. If f 'looks like' g (same bright spots in the same places), their pointwise product integrates to a large value. This is the foundation of convolution and matched filtering.",
      reference: "[58:31] 'Suppose we want to measure images that have interesting stuff in them — we don't care how bright the image is, we want to know if there is interesting stuff going on.' The inner product with a feature template answers this.",
      computation: `import numpy as np
# 1D analogy: find where a pattern (template) occurs in a signal
signal   = np.zeros(100); signal[40:50] = 1.0   # feature at position 40
template = np.ones(10)                            # box detector
# Slide template, compute inner products:
scores = np.correlate(signal, template, mode='full')
peak = np.argmax(scores)
print("Feature found near index:", peak - len(template) + 1)  # ≈ 40`,
      connection: "This principle underlies matched filtering, convolution neural networks, and frequency-domain rendering kernels."
    },
    section: "Image Analysis [58:31]", topic: "INNER_PRODUCTS", difficulty: "Hard",
    slideImages: [], diagram: null,
  },
  // ─── COORDINATES & BASES ─────────────────────────────────
  {
    id: 17,
    question: "Why must you never directly compare coordinates from two different coordinate systems?",
    questionType: "single-choice",
    options: [
      "Because different systems use different units of length",
      "Because the same physical vector gets different numbers in different systems — comparing the numbers directly is meaningless without conversion",
      "Because computers cannot store coordinates from mixed systems",
      "Because only orthonormal bases yield valid coordinates"
    ],
    answer: 1,
    explanation: {
      intuition: "If you describe a city as '60° north, 1km' (polar) and I describe it as '(0.5, 0.866)' (Cartesian), these represent the same point — but '60 ≠ 0.5' doesn't mean the cities differ.",
      reference: "[10:19] 'We can't directly compare coordinates expressed in different coordinate systems.' [10:44] 'We should definitely not compare polar coordinates to Cartesian coordinates to check if two points are the same.'",
      computation: `import numpy as np
# Same vector in two coordinate systems
v_cartesian = np.array([1., 1.])
r, theta = np.sqrt(2), np.pi/4    # polar representation
v_polar_coords = np.array([r, theta])
# v_cartesian != v_polar_coords numerically — but they ARE the same vector
print(v_cartesian)        # [1. 1.]
print(v_polar_coords)     # [1.414, 0.785]  — different numbers, same vector`,
      connection: "[08:04] 'When writing code, be very careful to keep your coordinate system straight — don't use numbers from one system in another.' A classic source of graphics bugs."
    },
    section: "Coordinates [07:38]", topic: "COORDINATES", difficulty: "Medium",
    slideImages: [], diagram: null,
  },
  {
    id: 18,
    question: "The Triangle Inequality states ‖u + v‖ ≤ ‖u‖ + ‖v‖. What geometric fact does this capture?",
    questionType: "single-choice",
    options: [
      "The sum of two vectors is always longer than either alone",
      "The straight-line distance between two points is always shorter than any detour — the shortest path is a straight line",
      "The norms of u and v must be equal for the inequality to hold",
      "Vector addition always produces a vector with a larger norm"
    ],
    answer: 1,
    explanation: {
      intuition: "Going directly from A to C (‖u+v‖) is never longer than going A→B→C (‖u‖+‖v‖). The direct path is always at most as long as any two-leg detour.",
      reference: "[36:47] 'The shortest path between two points is always along a straight line — the norm of u plus v is always ≤ the norm of u plus the norm of v.'",
      computation: `import numpy as np
u = np.array([3., 1.])
v = np.array([-1., 4.])
lhs = np.linalg.norm(u + v)
rhs = np.linalg.norm(u) + np.linalg.norm(v)
print(lhs, "≤", rhs, ":", lhs <= rhs)   # True`,
      connection: "The triangle inequality is fundamental to metric spaces and appears in error bounds for numerical methods throughout graphics."
    },
    section: "Triangle Inequality [36:47]", topic: "NORMS", difficulty: "Easy",
    slideImages: [], diagram: null,
  },
  // ─── APPLICATIONS ────────────────────────────────────────
  {
    id: 19,
    question: "How does the lecturer connect 'integration as summation' to the L² inner product of functions?",
    questionType: "single-choice",
    options: [
      "Integration and summation are completely different operations",
      "The L² inner product ∫f(x)g(x)dx is the limit of Σf(xᵢ)g(xᵢ)Δx — integration IS a sum, just in the limit as intervals shrink to zero",
      "Integration is only valid for smooth functions, unlike summation",
      "Summation is used for discrete graphics data while integration is for rendering"
    ],
    answer: 1,
    explanation: {
      intuition: "A Riemann sum Σf(xᵢ)g(xᵢ)Δx is already an inner product of sampled vectors. Taking the limit Δx→0 gives ∫f(x)g(x)dx. They're the same idea at different resolutions.",
      reference: "[41:39] 'Integration and sums are very similar concepts — in fact you may remember that an integral is sometimes defined as taking Riemann sums, the limit of breaking your function up into little columns.'",
      computation: `import numpy as np
x  = np.linspace(0, 1, 10000); dx = x[1]-x[0]
f  = np.sin(np.pi*x); g = np.cos(np.pi*x)
inner_discrete  = np.sum(f * g) * dx          # Riemann sum
inner_exact     = 0.0                          # ∫sin(πx)cos(πx)dx on [0,1] = 0
print(inner_discrete, inner_exact)   # ≈ 0.0  both`,
      connection: "[1:26:06] Fourier coefficients = L² inner products with sinusoids = sums in the limit — one unified concept spanning discrete and continuous."
    },
    section: "Integration as Summation [41:39]", topic: "FUNCTION_SPACES", difficulty: "Hard",
    slideImages: [], diagram: null,
  },
  {
    id: 20,
    question: "The lecturer describes audio decomposition using Fourier analysis. What practical use does this have in graphics?",
    questionType: "single-choice",
    options: [
      "It allows graphics cards to process audio files",
      "Decomposing signals into frequencies lets you separate smooth (low-freq) from detail (high-freq) components — the same technique is used for mesh smoothing, image filtering, and spectral geometry",
      "It is used only for sound design in game engines",
      "Fourier analysis has no application in visual computer graphics"
    ],
    answer: 1,
    explanation: {
      intuition: "Audio: separate bass from treble. Mesh: separate coarse shape from fine bumps. Image: separate blurry background from sharp edges. All are frequency decompositions — the math is identical.",
      reference: "[1:26:24] 'Audio is a membrane vibrating — I can decompose that sound into low, middle, and high frequencies.' [1:28:12] 'A 3D model can be broken up into smooth features or lots of little small-scale bumps' — same idea applied to geometry.",
      computation: `import numpy as np
# Mesh smoothing via spectral decomposition:
# 1. Compute discrete Laplacian eigenfunctions (analogous to sinusoids)
# 2. Project mesh onto eigenfunctions (inner products)
# 3. Attenuate high-frequency components
# 4. Reconstruct — mesh is smoother
# This is exactly Fourier analysis on the mesh`,
      connection: "Spectral mesh processing, neural radiance field compression, and texture filtering all use this unifying idea of 'linear algebra in function space.'"
    },
    section: "Audio Analysis [1:26:24]", topic: "FOURIER", difficulty: "Hard",
    slideImages: [], diagram: null,
  },
];

// ─── Timer ───────────────────────────────────────────────────
const useTimer = () => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    let iv = null;
    if (isActive) iv = setInterval(() => setTimeSpent(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [isActive]);
  return { timeSpent, start: () => setIsActive(true), pause: () => setIsActive(false), reset: () => { setTimeSpent(0); setIsActive(false); } };
};
const fmt = s => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

// ─── Main Component ───────────────────────────────────────────
const Quiz = () => {
  const [screen, setScreen] = useState('welcome');
  const [qIdx, setQIdx]     = useState(0);
  const [answers, setAnswers] = useState(Array(quizData.length).fill(null));
  const [selected, setSelected] = useState([]);
  const [showExp, setShowExp]   = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const { timeSpent, start, pause, reset: resetTimer } = useTimer();

  const q = quizData[qIdx];
  useEffect(() => { if (screen==='quiz' && !showExp && !reviewMode) start(); else pause(); }, [screen,showExp,reviewMode,qIdx]);
  const isCorrect = useCallback((q, a) => a !== null && a === q.answer, []);

  const handleSubmit = () => { const a=[...answers]; a[qIdx]=selected[0]; setAnswers(a); setShowExp(true); };
  const handleNext = () => { if (qIdx<quizData.length-1){setQIdx(qIdx+1);setSelected([]);setShowExp(false);} else {setScreen('results');pause();} };
  const handlePrev = () => { if (qIdx>0){setQIdx(qIdx-1);setSelected(answers[qIdx-1]!==null?[answers[qIdx-1]]:[]);setShowExp(answers[qIdx-1]!==null);} };
  const handleReview = () => { setQIdx(0);setSelected(answers[0]!==null?[answers[0]]:[]);setShowExp(answers[0]!==null);setReviewMode(true);setScreen('quiz'); };
  const handleRestart = () => { setScreen('welcome');setQIdx(0);setAnswers(Array(quizData.length).fill(null));setSelected([]);setShowExp(false);setReviewMode(false);resetTimer(); };

  const score = answers.filter((a,i)=>isCorrect(quizData[i],a)).length;
  const pct = Math.round(score/quizData.length*100);

  const C = { bg:'#0a0a0f', surface:'#111118', border:'#1a2535', accent:'#818cf8', accentHover:'#6366f1', success:'#22c55e', error:'#ef4444', warning:'#f59e0b', text:'#e2e8f0', muted:'#94a3b8', code:'#1a2535' };
  const base = { minHeight:'100vh', background:`linear-gradient(135deg,${C.bg} 0%,#0d0f1f 100%)`, color:C.text, fontFamily:"'Rajdhani',sans-serif", padding:'2rem 1rem' };
  const wrap = { maxWidth:'820px', margin:'0 auto', background:C.surface, borderRadius:'16px', padding:'2rem', border:`1px solid ${C.border}` };
  const btn  = { display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.75rem 1.5rem', background:C.accent, color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'1rem', fontFamily:"'Rajdhani',sans-serif", fontWeight:'600', transition:'background 0.2s' };
  const code = { background:C.code, padding:'1rem', borderRadius:'8px', fontSize:'0.82rem', fontFamily:"'JetBrains Mono',monospace", overflowX:'auto', whiteSpace:'pre', color:'#a5b4fc', lineHeight:'1.6' };

  if (screen==='welcome') return (
    <div style={base}><div style={wrap}>
      <div style={{textAlign:'center',marginBottom:'2rem'}}>
        <Grid size={64} color={C.accent} />
        <h1 style={{fontSize:'2.5rem',fontWeight:'700',color:C.accent,margin:'1rem 0 0.5rem'}}>Lecture 2 Quiz</h1>
        <p style={{color:C.muted,fontSize:'1.1rem'}}>Linear Algebra for Computer Graphics</p>
        <p style={{color:C.muted,fontSize:'0.9rem',fontStyle:'italic'}}>CMU 15-462 • 1:43:07 • Vectors · Vector Spaces · Linear Maps · Inner Products · Gram-Schmidt · Fourier</p>
      </div>
      <div style={{background:'#0d0d12',padding:'1.5rem',borderRadius:'12px',marginBottom:'2rem',border:`1px solid ${C.border}`}}>
        <h3 style={{fontSize:'1.1rem',color:C.accent,marginBottom:'1rem'}}>Topics</h3>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:'0.6rem',fontSize:'0.95rem'}}>
          {['Vectors & Vector Spaces','Linear Maps & Matrices','Inner Products & Norms','Orthogonality','Gram-Schmidt','Functions as Vectors','Fourier Decomposition'].map(t=>(
            <div key={t}><span style={{color:C.accent}}>• </span>{t}</div>
          ))}
        </div>
      </div>
      <div style={{background:'#0d0d12',padding:'1.5rem',borderRadius:'12px',marginBottom:'2rem',border:`1px solid ${C.border}`}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',textAlign:'center'}}>
          {[['20','Questions'],['40%','Easy'],['45%','Medium'],['15%','Hard']].map(([v,l])=>(
            <div key={l}><div style={{fontSize:'1.8rem',fontWeight:'700',color:C.accent}}>{v}</div><div style={{fontSize:'0.85rem',color:C.muted}}>{l}</div></div>
          ))}
        </div>
      </div>
      <button style={{...btn,width:'100%',justifyContent:'center',fontSize:'1.1rem',padding:'1rem'}}
        onMouseEnter={e=>e.target.style.background=C.accentHover} onMouseLeave={e=>e.target.style.background=C.accent}
        onClick={()=>{setScreen('quiz');start();}}><Grid size={20}/> Start Quiz</button>
    </div></div>
  );

  if (screen==='results') return (
    <div style={base}><div style={wrap}>
      <div style={{textAlign:'center',marginBottom:'2rem'}}>
        <Trophy size={64} color={pct>=70?C.success:pct>=50?C.warning:C.error}/>
        <h1 style={{fontSize:'2.5rem',fontWeight:'700',margin:'1rem 0 0.5rem'}}>Quiz Complete!</h1>
        <p style={{color:C.muted}}><Clock size={16} style={{display:'inline',verticalAlign:'middle',marginRight:'0.4rem'}}/>{fmt(timeSpent)}</p>
      </div>
      <div style={{background:'#0d0d12',padding:'2rem',borderRadius:'12px',marginBottom:'2rem',textAlign:'center',border:`1px solid ${C.border}`}}>
        <div style={{fontSize:'4rem',fontWeight:'700',color:pct>=70?C.success:pct>=50?C.warning:C.error}}>{pct}%</div>
        <div style={{color:C.muted,fontSize:'1.2rem',marginBottom:'0.5rem'}}>{score} / {quizData.length} correct</div>
        <div style={{color:C.muted}}>{pct>=90?'Ax=b Linear Algebra Master!':pct>=70?'Strong Matrix Foundations!':pct>=50?'Keep Reviewing!':'Back to Lecture 2!'}</div>
      </div>
      <div style={{display:'flex',gap:'1rem'}}>
        {[['Review',handleReview,BookOpen],['Restart',handleRestart,RefreshCw]].map(([l,fn,Icon])=>(
          <button key={l} style={{...btn,flex:1,justifyContent:'center'}}
            onMouseEnter={e=>e.target.style.background=C.accentHover} onMouseLeave={e=>e.target.style.background=C.accent}
            onClick={fn}><Icon size={18}/>{l}</button>
        ))}
      </div>
    </div></div>
  );

  return (
    <div style={base}><div style={wrap}>
      <div style={{marginBottom:'2rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.75rem',fontSize:'0.9rem',color:C.muted}}>
          <span>Question {qIdx+1} of {quizData.length}</span>
          <span><Clock size={14} style={{display:'inline',verticalAlign:'middle',marginRight:'0.3rem'}}/>{fmt(timeSpent)}</span>
        </div>
        <div style={{height:'5px',background:C.border,borderRadius:'3px',overflow:'hidden'}}>
          <div style={{height:'100%',width:`${((qIdx+1)/quizData.length)*100}%`,background:C.accent,transition:'width 0.3s'}}/>
        </div>
      </div>

      <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'1rem'}}>
        {[q.difficulty,(q.section||'').split('[')[0].trim(),q.topic].filter(Boolean).map(t=>(
          <span key={t} style={{padding:'0.2rem 0.65rem',borderRadius:'5px',background:`${C.accent}20`,color:C.accent,fontSize:'0.82rem',fontWeight:'600'}}>{t}</span>
        ))}
      </div>

      <h2 style={{fontSize:'1.35rem',fontWeight:'600',lineHeight:'1.5',marginBottom:'1.5rem'}}>{q.question}</h2>

      <div style={{marginBottom:'2rem'}}>
        {q.options.map((opt,i)=>(
          <div key={i} onClick={()=>!showExp&&!reviewMode&&setSelected([i])}
            style={{padding:'0.9rem 1rem',borderRadius:'8px',marginBottom:'0.6rem',cursor:showExp||reviewMode?'default':'pointer',transition:'all 0.2s',
              border:`2px solid ${showExp||reviewMode?i===q.answer?C.success:selected[0]===i?C.error:C.border:selected[0]===i?C.accent:C.border}`,
              background:showExp||reviewMode?i===q.answer?`${C.success}15`:selected[0]===i?`${C.error}15`:C.surface:selected[0]===i?`${C.accent}15`:C.surface}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
              {(showExp||reviewMode)&&(i===q.answer?<CheckCircle size={18} color={C.success}/>:selected[0]===i?<XCircle size={18} color={C.error}/>:null)}
              <span>{opt}</span>
            </div>
          </div>
        ))}
      </div>

      {showExp && q.explanation && (
        <div style={{background:'#0d0d12',padding:'1.5rem',borderRadius:'12px',marginBottom:'2rem',border:`1px solid ${C.border}`}}>
          <h3 style={{color:C.accent,fontSize:'1.1rem',marginBottom:'1rem'}}>Explanation</h3>
          <div style={{marginBottom:'1rem'}}>
            <h4 style={{color:C.accent,fontSize:'0.95rem',marginBottom:'0.4rem'}}>💡 Intuition</h4>
            <p style={{color:C.muted,lineHeight:'1.6'}}>{q.explanation.intuition}</p>
          </div>
          <div style={{marginBottom:'1rem'}}>
            <h4 style={{color:C.accent,fontSize:'0.95rem',marginBottom:'0.4rem'}}>📖 Lecture Reference</h4>
            <p style={{color:C.muted,lineHeight:'1.6'}}>{q.explanation.reference}</p>
          </div>
          {q.diagram && (
            <div style={{margin:'1rem 0'}}>
              <h4 style={{color:C.accent,fontSize:'0.95rem',marginBottom:'0.5rem'}}>📊 Visual</h4>
              <div style={{background:'#0a0a14',padding:'1rem',borderRadius:'8px',border:`1px solid ${C.border}`,display:'inline-block'}}>{q.diagram}</div>
            </div>
          )}
          <div style={{marginBottom:'1rem',marginTop:'1rem'}}>
            <h4 style={{color:C.accent,fontSize:'0.95rem',marginBottom:'0.4rem'}}>💻 Code</h4>
            <pre style={code}>{q.explanation.computation}</pre>
          </div>
          <div>
            <h4 style={{color:C.accent,fontSize:'0.95rem',marginBottom:'0.4rem'}}>🔗 Connection</h4>
            <p style={{color:C.muted,lineHeight:'1.6'}}>{q.explanation.connection}</p>
          </div>
        </div>
      )}

      <div style={{display:'flex',gap:'1rem'}}>
        <button onClick={handlePrev} disabled={qIdx===0}
          style={{...btn,background:C.border,opacity:qIdx===0?0.5:1,cursor:qIdx===0?'not-allowed':'pointer'}}
          onMouseEnter={e=>qIdx!==0&&(e.target.style.background='#2a3a4a')} onMouseLeave={e=>qIdx!==0&&(e.target.style.background=C.border)}>
          <ChevronLeft size={18}/>Prev
        </button>
        {!showExp&&!reviewMode&&(
          <button onClick={handleSubmit} disabled={selected.length===0}
            style={{...btn,flex:1,justifyContent:'center',opacity:selected.length===0?0.5:1}}
            onMouseEnter={e=>selected.length>0&&(e.target.style.background=C.accentHover)} onMouseLeave={e=>selected.length>0&&(e.target.style.background=C.accent)}>
            Submit Answer
          </button>
        )}
        {(showExp||reviewMode)&&(
          <button onClick={handleNext} style={{...btn,flex:1,justifyContent:'center'}}
            onMouseEnter={e=>e.target.style.background=C.accentHover} onMouseLeave={e=>e.target.style.background=C.accent}>
            {qIdx<quizData.length-1?<><span>Next</span><ChevronRight size={18}/></>:<><span>Results</span><Trophy size={18}/></>}
          </button>
        )}
      </div>
    </div></div>
  );
};

export default Quiz;

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, GripVertical, Sigma } from 'lucide-react';

/**
 * CMU 15-462 Computer Graphics — Lecture 3
 * Vector Calculus in Computer Graphics
 * Interactive Comprehension Quiz
 *
 * Topics: Euclidean norm, dot/cross products, determinants, matrix representations,
 *         derivatives, gradient, divergence, curl, Laplacian, Hessian
 * Duration: 1:30:13
 * Questions: 25 — Easy 40% | Medium 44% | Hard 16%
 *
 * Images reference lecture slide screenshots stored in /assets/.
 * Push the Logseq assets/ folder to repo root to make them appear.
 */

<style>
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
</style>

const quizData = [
  // ============================================================
  // NORMS & INNER PRODUCTS — 20%
  // ============================================================
  {
    id: 1,
    question: "What is the defining characteristic of the Euclidean norm, according to the lecture?",
    questionType: "single-choice",
    options: [
      "It always yields positive values for non-zero vectors",
      "It is the notion of length preserved by rigid motions of space — rotations, translations, and reflections",
      "It only works correctly in 3-dimensional space",
      "It measures the angle between two vectors"
    ],
    answer: 1,
    explanation: {
      intuition: "The Euclidean norm is geometric, not algebraic. It describes the length that stays the same when you rotate or reflect the space — like how a ruler reads the same length no matter which direction you hold it.",
      math: "[02:23–03:18] 'We can say the euclidean norm is the notion of length preserved by rigid motions of space, so rotations translations and reflections.' This coordinate-free definition is more fundamental than the formula √(u₁²+u₂²+…).",
      computation: `# Euclidean norm — coordinate formula (requires orthonormal basis)
import numpy as np

u = np.array([3.0, 4.0])

# Geometric (always valid)
norm_geometric = np.linalg.norm(u)          # 5.0

# Coordinate formula — ONLY valid in orthonormal basis
norm_coord = np.sqrt(np.sum(u**2))          # 5.0 (same here because standard basis IS orthonormal)

# In a non-orthonormal basis the coordinate formula would give the WRONG answer
print(norm_geometric, norm_coord)`,
      connection: "This definition motivates why using an orthonormal basis matters: without it, the coordinate formula √Σuᵢ² does NOT give geometric length."
    },
    topic: "EUCLIDEAN_NORM",
    section: "Norms [02:23]",
    difficulty: "Easy",
    category: "conceptual",
    slideImages: ["image_1771912248659_0.png"],
  },
  {
    id: 2,
    question: "When computing the Euclidean norm using the coordinate formula √(u₁²+u₂²+…), what critical condition must hold?",
    questionType: "single-choice",
    options: [
      "The vector must have integer components",
      "The vector must be normalised to unit length first",
      "The coordinates must come from an orthonormal basis",
      "The vector must live in 3D space"
    ],
    answer: 2,
    explanation: {
      intuition: "The coordinate formula squares and adds components. This only measures true geometric length when the basis vectors are perpendicular and all unit length (orthonormal). Skewed or stretched basis vectors distort the result.",
      math: "[04:30] 'A little warning, whenever we work in coordinates we have to be careful because this expression does not give us the geometric length unless the vector u happens to be encoded in an orthonormal basis.'",
      computation: `import numpy as np

# Skewed basis: e1=(1,0), e2=(1,1) — NOT orthonormal
# A vector with coordinates (1,0) in this basis IS (1,0) geometrically → norm=1 ✓
# A vector with coordinates (1,1) in this basis IS (2,1) geometrically → norm=√5
# But coordinate formula gives √(1²+1²) = √2  ← WRONG

B = np.array([[1, 1], [0, 1]])   # columns = basis vectors
coords = np.array([1.0, 1.0])   # coordinates in skewed basis
geometric = B @ coords           # actual vector in standard coords

print("Coord formula:", np.linalg.norm(coords))    # √2 — wrong
print("True norm:    ", np.linalg.norm(geometric))  # √5 — correct`,
      connection: "This warning reappears for the dot product: u·v = Σuᵢvᵢ also requires an orthonormal basis to have geometric meaning."
    },
    topic: "EUCLIDEAN_NORM",
    section: "Norms [04:30]",
    difficulty: "Easy",
    category: "conceptual",
    slideImages: ["image_1771912295116_0.png"],
  },
  {
    id: 3,
    question: "How is the Euclidean inner product defined geometrically for n-dimensional vectors u and v?",
    questionType: "single-choice",
    options: [
      "The sum of component-wise products Σuᵢvᵢ",
      "‖u‖ · ‖v‖ · cos θ, where θ is the angle between them",
      "The projection of u onto v scaled by ‖v‖",
      "The reciprocal of the distance between u and v"
    ],
    answer: 1,
    explanation: {
      intuition: "The inner product measures alignment. When θ=0 the vectors point the same way → cos(0)=1 → maximum. When θ=90° → cos(90°)=0 → orthogonal, zero inner product. This geometric view works in any dimension.",
      math: "[05:41] 'For n-dimensional vectors the euclidean inner product can be defined as ⟨u,v⟩ = ‖u‖‖v‖cos θ.' The coordinate formula Σuᵢvᵢ follows as a consequence when using an orthonormal basis.",
      computation: `import numpy as np

u = np.array([1.0, 0.0, 0.0])
v = np.array([0.0, 1.0, 0.0])

# Geometric definition
theta = np.pi / 2
inner_geo = np.linalg.norm(u) * np.linalg.norm(v) * np.cos(theta)  # 0.0

# Coordinate formula (works here since standard basis is orthonormal)
inner_coord = np.dot(u, v)                                           # 0.0

print(inner_geo, inner_coord)  # both 0.0 — orthogonal`,
      connection: "The coordinate dot product formula Σuᵢvᵢ requires orthonormal coordinates; this mirrors the warning for the Euclidean norm."
    },
    topic: "INNER_PRODUCT",
    section: "Inner Products [05:10]",
    difficulty: "Easy",
    category: "conceptual",
    slideImages: ["image_1771912310455_0.png"],
  },
  {
    id: 4,
    question: "What two geometric properties fully characterise the cross product u × v?",
    questionType: "single-choice",
    options: [
      "Its magnitude is the dot product of u and v; its direction is along their sum",
      "Its magnitude equals the area of the parallelogram formed by u and v; its direction is orthogonal to both",
      "Its magnitude is the product of the vector lengths; its direction is the average of their directions",
      "Its magnitude equals the sum of the vector lengths; its direction is their difference"
    ],
    answer: 1,
    explanation: {
      intuition: "Imagine two arrows glued at their tails. They span a parallelogram. The cross product is an arrow sticking straight out of that parallelogram, whose length equals the parallelogram's area.",
      math: "[07:52] 'The magnitude is equal to the area of the parallelogram made by the two vectors and the direction of the cross product is orthogonal to both vectors.' Formally: ‖u×v‖ = ‖u‖‖v‖sin θ and (u×v)·u = (u×v)·v = 0.",
      computation: `import numpy as np

u = np.array([1.0, 0.0, 0.0])
v = np.array([0.0, 1.0, 0.0])

cross = np.cross(u, v)                          # [0, 0, 1]
area  = np.linalg.norm(u) * np.linalg.norm(v)  # 1.0 (unit square)

print("cross:", cross)          # [0, 0, 1] — perpendicular to both
print("‖cross‖:", np.linalg.norm(cross))  # 1.0 = area of parallelogram
print("orthogonal to u:", np.dot(cross, u))  # 0.0`,
      connection: "The area interpretation is key for computing surface normals and areas in mesh processing throughout graphics."
    },
    topic: "CROSS_PRODUCT",
    section: "Cross Products [07:24]",
    difficulty: "Easy",
    category: "conceptual",
    slideImages: ["image_1771913321064_0.png"],
  },
  {
    id: 5,
    question: "Why does the cross product make sense only in three dimensions?",
    questionType: "single-choice",
    options: [
      "Because in 2D there is no vector orthogonal to both vectors within the plane, and in 4D+ there are infinitely many such vectors — no unique answer",
      "Because cross products are mathematically undefined outside 3D",
      "Because geometric operations only make sense in our physical 3D world",
      "Because the parallelogram area property only works in 3D"
    ],
    answer: 0,
    explanation: {
      intuition: "In 2D: two arrows in the plane — any vector perpendicular to both would have to leave the plane, giving 3D. In 4D: there's an entire plane of vectors perpendicular to both u and v — no single one is canonical. Only in 3D is there exactly one (up to sign).",
      math: "[09:25] 'In 2D there is no vector in the plane that is orthogonal to both u and v.' [09:45] 'When we go into 4D or any higher dimension we actually have many different vectors that could be orthogonal to both u and v and have the desired magnitude.'",
      computation: `# In 3D: cross product is unique (up to sign)
# In 4D: the 'null space' of [u; v] has dimension 4-2=2
# → infinitely many unit vectors perpendicular to both u and v

import numpy as np
u4 = np.array([1., 0., 0., 0.])
v4 = np.array([0., 1., 0., 0.])

# Any vector of the form [0, 0, a, b] with a²+b²=1 is perpendicular to both
# e.g. [0,0,1,0] and [0,0,0,1] are both valid — no unique cross product`,
      connection: "The 7D generalised cross product exists as a curiosity, but 3D is the graphics-relevant case for surface normals and angular velocity."
    },
    topic: "CROSS_PRODUCT",
    section: "Cross Products [08:34]",
    difficulty: "Medium",
    category: "conceptual",
    slideImages: ["image_1771913464398_0.png"],
  },
  // ============================================================
  // MATRIX REPRESENTATIONS — 24%
  // ============================================================
  {
    id: 6,
    question: "How does the lecturer express the dot product u·v using matrix notation?",
    questionType: "single-choice",
    options: [
      "As the determinant of the matrix whose columns are u and v",
      "As the trace of the matrix uvᵀ",
      "As uᵀv (u transpose times v)",
      "As the eigenvalue of the outer product uᵀv"
    ],
    answer: 2,
    explanation: {
      intuition: "Writing u as a column vector, uᵀ is a row vector. Multiplying a row by a column gives a scalar — exactly the dot product. This matrix form lets us generalise to weighted inner products.",
      math: "[16:06] 'It's often convenient to express a dot product using a matrix product: u dot v is no different from u transpose v.'",
      computation: `import numpy as np

u = np.array([[3.], [4.]])  # column vector
v = np.array([[1.], [2.]])

dot_classical  = float(u.T @ v)          # uᵀv = 3*1 + 4*2 = 11
dot_numpy      = float(np.dot(u.flatten(), v.flatten()))  # 11

print(dot_classical, dot_numpy)  # both 11`,
      connection: "This view leads directly to the general inner product ⟨u,v⟩_A = uᵀAv for a symmetric positive-definite matrix A, used in metric tensors and anisotropic smoothing."
    },
    topic: "MATRIX_REPRESENTATION",
    section: "Matrix Representations [15:47]",
    difficulty: "Medium",
    category: "mathematical",
    slideImages: ["image_1771968934443_0.png"],
  },
  {
    id: 7,
    question: "What important structural property must the matrix A representing a general inner product ⟨u,v⟩_A = uᵀAv always have?",
    questionType: "single-choice",
    options: [
      "It must be invertible (full rank)",
      "It must be symmetric (A = Aᵀ)",
      "It must be diagonal",
      "It must be positive definite (all eigenvalues > 0)"
    ],
    answer: 1,
    explanation: {
      intuition: "An inner product must satisfy ⟨u,v⟩ = ⟨v,u⟩ (symmetry). In matrix form: uᵀAv = vᵀAu = (uᵀAv)ᵀ = uᵀAᵀv. For this to hold for all u,v we need A = Aᵀ.",
      math: "[19:04] 'Question: why is the matrix that I got symmetric? If I take the matrix A and apply its transpose I again get the same matrix.' Proof: ⟨u,v⟩ = ⟨v,u⟩ ⟹ uᵀAv = vᵀAu ⟹ A = Aᵀ.",
      computation: `import numpy as np

# A general inner product with coefficients
# ⟨u,v⟩ = 2u₁v₁ + u₁v₂ + u₂v₁ + 3u₂v₂
A = np.array([[2., 1.],
              [1., 3.]])   # symmetric by construction

print("Symmetric:", np.allclose(A, A.T))   # True

u = np.array([1., 2.])
v = np.array([3., 1.])
print("<u,v>:", u @ A @ v)   # uᵀAv
print("<v,u>:", v @ A @ u)   # must be equal → 14.0`,
      connection: "Symmetric positive-definite matrices are the foundation of mass matrices in FEM, metric tensors, and Gauss–Newton optimisation in graphics."
    },
    topic: "MATRIX_REPRESENTATION",
    section: "Matrix Representations [17:17]",
    difficulty: "Medium",
    category: "mathematical",
    slideImages: ["image_1771969001254_0.png"],
  },
  {
    id: 8,
    question: "How is the cross product u × v represented as a matrix-vector product?",
    questionType: "single-choice",
    options: [
      "As a 3×3 identity matrix multiplied by u",
      "As a skew-symmetric (anti-symmetric) matrix [u]× constructed from the components of u, applied to v",
      "As a symmetric matrix multiplied by v",
      "As the eigendecomposition of the matrix formed by u and v"
    ],
    answer: 1,
    explanation: {
      intuition: "The skew-symmetric matrix [u]× encodes the cross product linearly: [u]×v = u×v. Its anti-symmetry ([u]× = −[u]×ᵀ) mirrors the anti-commutativity of the cross product.",
      math: "[19:40] 'This matrix has an interesting structure … half of [the components] are negated … this matrix is anti-symmetric or skew-symmetric.' For u=(u₁,u₂,u₃):\n[u]× = [[0,−u₃,u₂],[u₃,0,−u₁],[−u₂,u₁,0]]",
      computation: `import numpy as np

def hat(u):
    """Skew-symmetric matrix for cross product: hat(u) @ v == np.cross(u, v)"""
    return np.array([[   0, -u[2],  u[1]],
                     [ u[2],    0, -u[0]],
                     [-u[1],  u[0],    0]])

u = np.array([1., 2., 3.])
v = np.array([4., 5., 6.])

print("Via hat matrix:", hat(u) @ v)        # [-3, 6, -3]
print("Via np.cross:  ", np.cross(u, v))   # [-3, 6, -3]`,
      connection: "The hat operator [·]× appears constantly in robotics and 3D graphics for angular velocity, rotation derivatives, and the exponential map on SO(3)."
    },
    topic: "MATRIX_REPRESENTATION",
    section: "Matrix Representations [19:21]",
    difficulty: "Medium",
    category: "mathematical",
    slideImages: [],
  },
  {
    id: 9,
    question: "What happens to the cross product when the order of the two vectors is swapped (v × u instead of u × v)?",
    questionType: "single-choice",
    options: [
      "The result is the same vector",
      "The result is the negation of the original cross product: v × u = −(u × v)",
      "The result is a vector orthogonal to the original cross product",
      "The result is rotated by 90 degrees"
    ],
    answer: 1,
    explanation: {
      intuition: "The cross product encodes orientation: u×v points 'up' via the right-hand rule. Swapping the inputs flips the hand — the result points the other way.",
      math: "[21:11] 'v cross u is minus u cross v. So the cross product is an anti-symmetric operation: exchanging the order of the operands gives minus the result.' In matrix form: [v]× = −[u]×ᵀ is consistent with this.",
      computation: `import numpy as np

u = np.array([1., 0., 0.])
v = np.array([0., 1., 0.])

print("u×v:", np.cross(u, v))   # [0, 0,  1]
print("v×u:", np.cross(v, u))   # [0, 0, -1]
print("Sum:", np.cross(u, v) + np.cross(v, u))  # [0, 0, 0] — sum is zero`,
      connection: "This anti-commutativity means the Lie bracket of rotation vector fields has the cross product structure, fundamental to Lie algebra computations in animation."
    },
    topic: "CROSS_PRODUCT",
    section: "Matrix Representations [21:11]",
    difficulty: "Easy",
    category: "conceptual",
    slideImages: ["image_1771969154783_0.png"],
  },
  {
    id: 10,
    question: "What does the determinant of three vectors u, v, w represent geometrically?",
    questionType: "single-choice",
    options: [
      "The angle between the three vectors",
      "The projection of one vector onto the plane spanned by the other two",
      "The volume of the parallelepiped (box) formed by the three vectors",
      "The sum of the magnitudes of the three vectors"
    ],
    answer: 2,
    explanation: {
      intuition: "Stack three edge-vectors of a box. The determinant equals the volume of that box — base area times height. The sign tells you whether the triple forms a right-handed or left-handed frame.",
      math: "[23:54] 'The determinant of three vectors u v and w gives me the volume of a little parallelepiped, a little box with edges u, v, and w.' It equals (u×v)·w: cross product gives base area and normal, dot with w gives height.",
      computation: `import numpy as np

u = np.array([1., 0., 0.])
v = np.array([0., 2., 0.])
v = np.array([0., 2., 0.])
w = np.array([0., 0., 3.])

det = np.linalg.det(np.column_stack([u, v, w]))
triple_product = np.dot(np.cross(u, v), w)

print("det:   ", det)           # 6.0 = 1×2×3
print("triple:", triple_product)  # 6.0`,
      connection: "Volume = |det| is used in mesh quality metrics, Jacobian-based distortion measures, and integration change-of-variables in rendering."
    },
    topic: "DETERMINANT",
    section: "Determinants [23:54]",
    difficulty: "Easy",
    category: "conceptual",
    slideImages: ["image_1771969392356_0.png", "image_1771969197614_0.png"],
  },
  {
    id: 11,
    question: "What does the SIGN of the determinant of a linear map represent geometrically?",
    questionType: "single-choice",
    options: [
      "Whether the volume after transformation is larger or smaller than before",
      "Whether the vectors are linearly independent",
      "Whether the map preserved or reversed orientation",
      "Whether the map has an inverse"
    ],
    answer: 2,
    explanation: {
      intuition: "Imagine a right-handed coordinate frame (x right, y up, z towards you). If a map flips it to left-handed, orientation is reversed and det < 0. If it keeps the same handedness, det > 0.",
      math: "[31:21] 'What does the sign of the determinant tell us? Well, it's basically telling us whether the orientation was reversed.' Reflections have det = −1; pure rotations have det = +1.",
      computation: `import numpy as np

# Rotation by 90° — preserves orientation
R = np.array([[0, -1], [1, 0]])
print("Rotation det:", np.linalg.det(R))   # +1.0

# Reflection — reverses orientation
F = np.array([[-1, 0], [0, 1]])
print("Reflection det:", np.linalg.det(F))  # -1.0

# Scaling by 2 — positive but non-unit
S = 2 * np.eye(2)
print("Scale-2 det:", np.linalg.det(S))    # +4.0 (area multiplied by 4)`,
      connection: "Triangle mesh winding order (front vs back face) is determined by the sign of the 2D cross product (=det), used in backface culling and normal computation."
    },
    topic: "DETERMINANT",
    section: "Determinants [27:01]",
    difficulty: "Medium",
    category: "conceptual",
    slideImages: ["image_1771969597588_0.png"],
  },
  {
    id: 12,
    question: "According to the lecturer, what is the best mental model for matrix-vector multiplication Av?",
    questionType: "single-choice",
    options: [
      "Rotating and scaling the vector v",
      "Performing a sequence of dot products",
      "Taking a linear combination of the columns of A, with the components of v as coefficients",
      "Transforming the coordinate system rather than the vector"
    ],
    answer: 2,
    explanation: {
      intuition: "Each component of v tells you 'how much' of the corresponding column to add up. If A = [a₁|a₂|a₃] and v = (v₁,v₂,v₃), then Av = v₁a₁ + v₂a₂ + v₃a₃.",
      math: "[29:29] 'I can think of matrix-vector multiplication as taking linear combinations of the columns using the components of the vector I'm multiplying by as the coefficients.' This is why columns of A are the images of basis vectors.",
      computation: `import numpy as np

A = np.array([[1., 2.], [3., 4.]])   # columns: a1=[1,3], a2=[2,4]
v = np.array([5., 6.])               # coefficients

# Two equivalent ways:
method1 = A @ v                                   # standard matmul
method2 = v[0]*A[:, 0] + v[1]*A[:, 1]            # column combination

print(method1)  # [17. 39.]
print(method2)  # [17. 39.]`,
      connection: "This column view is essential for understanding linear maps as basis-vector transformations, used throughout the lecture in building matrix reps of dot/cross products."
    },
    topic: "MATRIX_REPRESENTATION",
    section: "Linear Maps [29:29]",
    difficulty: "Medium",
    category: "conceptual",
    slideImages: ["image_1771969739386_0.png"],
  },
  {
    id: 13,
    question: "What does the determinant of a linear map tell us about volumes?",
    questionType: "single-choice",
    options: [
      "The angle of rotation caused by the map",
      "The multiplicative change in volume caused by the map",
      "The additive change in distance between points",
      "The sum of the eigenvalues of the map"
    ],
    answer: 1,
    explanation: {
      intuition: "A unit cube has volume 1. After the map it becomes a parallelepiped with volume |det(A)|. So det = 2 means all volumes doubled; det = 0.5 means they halved; det = 0 means the space collapsed.",
      math: "[30:48] 'Determinant of the matrix is telling us the change in volume. We had something that had unit volume one times one times one and we got something that has some other volume … determinant is always telling you about the multiplicative change in volume.'",
      computation: `import numpy as np

# Non-uniform scale
A = np.diag([2., 3., 4.])
print("det:", np.linalg.det(A))   # 24.0 = 2×3×4

# Unit cube vertices
cube_vols = 1.0   # initial volume = 1
print("New volume:", abs(np.linalg.det(A)) * cube_vols)  # 24.0`,
      connection: "The Jacobian determinant is the change-of-variables factor in integration (used in path-space rendering and importance sampling)."
    },
    topic: "DETERMINANT",
    section: "Determinants [30:11]",
    difficulty: "Medium",
    category: "conceptual",
    slideImages: ["image_1771969755550_0.png"],
  },
  {
    id: 14,
    question: "What does Lagrange's identity for triple cross products state?",
    questionType: "single-choice",
    options: [
      "u × (v × w) = (u × v) × w  (associativity)",
      "u × (v × w) + v × (w × u) + w × (u × v) = 0  (Jacobi)",
      "u × (v × w) = v(u·w) − w(u·v)  (BAC-CAB rule)",
      "(u × v)·w = u·(v × w)  (scalar triple product)"
    ],
    answer: 2,
    explanation: {
      intuition: "The BAC-CAB rule lets you expand a double cross product into simpler dot-product scalings: the 'middle' vector (v) is scaled by one dot product, the 'last' vector (w) by the other. This linearises a nonlinear expression.",
      math: "[33:21] 'Lagrange's identity says that u cross v cross w is equal to v times u dot w minus w times u dot v — you take the dot product and then use that scalar to multiply the vector.'",
      computation: `import numpy as np

u = np.array([1., 2., 3.])
v = np.array([4., 5., 6.])
w = np.array([7., 8., 9.])

lhs = np.cross(u, np.cross(v, w))
rhs = v * np.dot(u, w) - w * np.dot(u, v)

print("LHS:", lhs)   # same vector
print("RHS:", rhs)   # same vector
print("Match:", np.allclose(lhs, rhs))  # True`,
      connection: "BAC-CAB is used in deriving the curl of a curl (∇×(∇×F) = ∇(∇·F) − ∇²F), appearing in electromagnetic rendering and fluid simulation."
    },
    topic: "CROSS_PRODUCT",
    section: "Identities [33:21]",
    difficulty: "Hard",
    category: "mathematical",
    slideImages: ["image_1771969766622_0.png"],
  },
  // ============================================================
  // DERIVATIVES — 20%
  // ============================================================
  {
    id: 15,
    question: "What alternative interpretation of the derivative does the lecturer emphasise as most useful for graphics?",
    questionType: "single-choice",
    options: [
      "The area under the function curve up to a point",
      "The best linear approximation of the function at that point",
      "The second-order curvature of the function",
      "The inverse of the integral"
    ],
    answer: 1,
    explanation: {
      intuition: "Near any smooth point, the function looks like a straight line. That line IS the derivative. This 'replace complicated things with simple linear models' idea is the engine behind gradient descent, Newton's method, and linearisation throughout graphics.",
      math: "[37:45] 'Another important view of the derivative is that it's the best linear approximation of the function.' Taylor: f(x) ≈ f(x₀) + f'(x₀)(x−x₀). 'Best' means it minimises the error among all linear functions through (x₀, f(x₀)).",
      computation: `import numpy as np, matplotlib.pyplot as plt

def f(x): return np.sin(x)

x0 = 1.0
fp  = np.cos(x0)   # f'(x₀)

x  = np.linspace(0.5, 1.5, 200)
fx = f(x)
linear_approx = f(x0) + fp * (x - x0)

# Near x0 the linear approximation is excellent
print("Error at x0+0.01:", abs(f(x0+0.01) - (f(x0) + fp*0.01)))  # very small`,
      connection: "[39:22] 'Replacing complicated functions with a linear or quadratic approximation is a powerful trick we'll see over and over in graphics algorithms.'"
    },
    topic: "DERIVATIVES",
    section: "Derivatives [37:45]",
    difficulty: "Easy",
    category: "conceptual",
    slideImages: ["image_1771970380896_0.png", "image_1772585164993_0.png"],
  },
  {
    id: 16,
    question: "How is the directional derivative of f at x₀ along direction u formally defined?",
    questionType: "single-choice",
    options: [
      "The gradient ∇f(x₀) dotted with u",
      "The limit as ε→0 of [f(x₀ + εu) − f(x₀)] / ε",
      "The Laplacian of f evaluated at x₀",
      "The divergence of the gradient of f in direction u"
    ],
    answer: 1,
    explanation: {
      intuition: "Pick a direction u, walk a tiny step ε in that direction, measure how much f changed, divide by ε. That's the slope of f in direction u — the directional derivative.",
      math: "[41:31] 'The directional derivative along direction u of the function f is just the usual derivative: the limit as ε→0 of [f(x₀+εu) − f(x₀)] / ε.' Note: the gradient property says this equals ∇f(x₀)·u — but the DEFINITION doesn't require knowing the gradient first.",
      computation: `import numpy as np

def f(x): return x[0]**2 + x[1]**2   # f(x,y) = x² + y²

x0 = np.array([1.0, 1.0])
u  = np.array([1.0, 0.0]) / np.linalg.norm([1.0, 0.0])  # unit direction

eps = 1e-7
dir_deriv_numerical = (f(x0 + eps*u) - f(x0)) / eps
dir_deriv_exact     = 2*x0[0]*u[0] + 2*x0[1]*u[1]  # ∇f·u

print(dir_deriv_numerical)  # ≈ 2.0
print(dir_deriv_exact)      # 2.0`,
      connection: "The directional derivative links to the gradient: D_u f = ∇f·u for all unit u, which is the lecturer's definition of the gradient."
    },
    topic: "DERIVATIVES",
    section: "Directional Derivatives [40:19]",
    difficulty: "Medium",
    category: "mathematical",
    slideImages: ["image_1771970503059_0.png"],
  },
  // ============================================================
  // GRADIENT — 24%
  // ============================================================
  {
    id: 17,
    question: "The gradient ∇f(x) is defined as the unique vector such that for all directions u:",
    questionType: "single-choice",
    options: [
      "‖∇f‖ · ‖u‖ = D_u f  (magnitude product equals directional derivative)",
      "⟨∇f, u⟩ = D_u f  (inner product with ∇f equals directional derivative)",
      "∇f + u = D_u f  (sum equals directional derivative)",
      "∇f × u = D_u f  (cross product equals directional derivative)"
    ],
    answer: 1,
    explanation: {
      intuition: "The gradient is a vector that encodes all directional derivatives at once. To get the slope in any direction u, just dot u with ∇f. The gradient 'points uphill' and its magnitude tells you the steepest slope.",
      math: "[50:39] 'At each point x the gradient is the unique vector ∇f(x) such that ⟨∇f, u⟩ = D_u f for all u.' In coordinates (orthonormal basis): ∇f = (∂f/∂x₁, ∂f/∂x₂, …, ∂f/∂xₙ).",
      computation: `import numpy as np

def f(x): return x[0]**2 + 2*x[1]**2

def grad_f(x): return np.array([2*x[0], 4*x[1]])

x0 = np.array([1.0, 2.0])
u  = np.array([1.0, 1.0]) / np.sqrt(2)   # unit direction

# Directional derivative via definition
eps = 1e-7
D_u_numerical = (f(x0 + eps*u) - f(x0)) / eps

# Via gradient
D_u_gradient = np.dot(grad_f(x0), u)

print(D_u_numerical)   # ≈ 5.657
print(D_u_gradient)    # = 5.657`,
      connection: "This is the coordinate-free definition — it works on manifolds too, where partial derivatives may not be globally defined."
    },
    topic: "GRADIENT",
    section: "Gradient [42:41]",
    difficulty: "Medium",
    category: "mathematical",
    slideImages: ["image_1771988289666_0.png"],
  },
  {
    id: 18,
    question: "In coordinate form, the gradient is described as 'the list of all directional derivatives along the coordinate axes'. What is this list called?",
    questionType: "single-choice",
    options: [
      "The sum of all partial derivatives",
      "The partial derivative vector — the list (∂f/∂x₁, ∂f/∂x₂, …, ∂f/∂xₙ)",
      "The product of all partial derivatives",
      "The maximum partial derivative in each direction"
    ],
    answer: 1,
    explanation: {
      intuition: "The gradient is the vector of partial derivatives. Each component tells you the slope of f along one coordinate axis. Together they fully encode the local linear behaviour of f.",
      math: "[44:56] 'What is the gradient? It's the list of the directional derivatives along all the coordinate axes x₁, x₂, x₃, and so on.' ∇f = (∂f/∂x₁, ∂f/∂x₂, …, ∂f/∂xₙ). Requires orthonormal coordinates.",
      computation: `import numpy as np

def f(x): return x[0]**2 + x[1]**2   # f(x,y) = x² + y²

# Gradient: (∂f/∂x, ∂f/∂y) = (2x, 2y)
x = np.array([3.0, 4.0])
grad = np.array([2*x[0], 2*x[1]])   # [6, 8]

# Check: [44:56] example → ∇f(x) = 2x
print(grad)               # [6. 8.]
print(2 * x)              # [6. 8.]  — same!`,
      connection: "[46:31] Worked example: ∇(x₁²+x₂²) = (2x₁, 2x₂) = 2x — the gradient of the squared norm points radially outward."
    },
    topic: "GRADIENT",
    section: "Gradient [44:30]",
    difficulty: "Easy",
    category: "mathematical",
    slideImages: ["image_1771988089566_0.png"],
  },
  {
    id: 19,
    question: "What geometric role does the gradient play when used for optimisation?",
    questionType: "single-choice",
    options: [
      "It points in the direction of quickest decrease (downhill)",
      "It points perpendicular to the level sets, in the direction of steepest ascent (uphill)",
      "It points tangent to the level sets of the function",
      "It points toward the nearest local minimum"
    ],
    answer: 1,
    explanation: {
      intuition: "Standing on a hillside, the gradient arrow points straight uphill (perpendicular to the contour lines). To descend (minimise), you walk in the opposite direction — hence gradient descent.",
      math: "[49:18] 'The gradient is giving us the direction of steepest ascent. If we're standing at some point on the map, what direction should we travel to increase our altitude as quickly as possible?' Moving x ← x + η·∇f increases f; x ← x − η·∇f decreases it.",
      computation: `import numpy as np

# Gradient descent on f(x,y) = x² + y²  (minimum at origin)
x = np.array([3.0, 4.0])
lr = 0.1

for i in range(20):
    grad = 2 * x       # ∇f
    x = x - lr * grad  # steepest descent step
    if i % 5 == 0:
        print(f"step {i:2d}: x={x}, f={np.sum(x**2):.4f}")
# Converges to [0,0]`,
      connection: "[50:01] 'We start at some initial guess x₀, evaluate the gradient, take a little step in the gradient direction and repeat.' This is the foundation of SGD, Adam, L-BFGS used throughout neural rendering."
    },
    topic: "GRADIENT",
    section: "Gradient [49:18]",
    difficulty: "Easy",
    category: "conceptual",
    slideImages: ["image_1771988213030_0.png", "image_1771988229711_0.png"],
  },
  {
    id: 20,
    question: "The first-order Taylor approximation of a multivariable function f around x₀ is:",
    questionType: "single-choice",
    options: [
      "f(x) ≈ f(x₀)  (constant approximation)",
      "f(x) ≈ f(x₀) + ∇f(x₀)·(x − x₀)  (linear approximation)",
      "f(x) ≈ f(x₀) + ‖x−x₀‖²  (quadratic approximation)",
      "f(x) ≈ ∇f(x₀)  (gradient only)"
    ],
    answer: 1,
    explanation: {
      intuition: "The multivariable first-order Taylor expansion replaces the scalar derivative f'(x₀) with the gradient ∇f(x₀) and the scalar displacement (x−x₀) with the vector displacement. The dot product gives the directional scaling.",
      math: "[48:08] 'f(x) ≈ f(x₀) + ⟨∇f(x₀), x−x₀⟩.' This is the hyperplane tangent to the graph of f at x₀. Moving in direction ∇f increases f at rate ‖∇f‖².",
      computation: `import numpy as np

def f(x): return x[0]**2 + x[1]**2

x0   = np.array([1.0, 2.0])
grad = np.array([2*x0[0], 2*x0[1]])  # [2, 4]

# First-order Taylor at nearby point
x = np.array([1.1, 2.1])
f_true   = f(x)
f_approx = f(x0) + np.dot(grad, x - x0)

print(f"True:   {f_true:.4f}")    # 5.62
print(f"Linear: {f_approx:.4f}")  # 5.60  (close!)`,
      connection: "This first-order expansion is the foundation of gradient descent, the linearised Euler step in simulation, and adjoint methods in differentiable rendering."
    },
    topic: "GRADIENT",
    section: "Gradient [48:08]",
    difficulty: "Medium",
    category: "mathematical",
    slideImages: ["image_1771988163054_0.png"],
  },
  // ============================================================
  // DIVERGENCE & CURL — 16%
  // ============================================================
  {
    id: 21,
    question: "What physical phenomenon does the divergence of a vector field measure?",
    questionType: "single-choice",
    options: [
      "The circulation or rotational swirling of the field",
      "The average direction vectors in the field point",
      "How much the field acts as a source (flow outward) or sink (flow inward) — its rate of expansion/contraction",
      "The total energy density of the field"
    ],
    answer: 2,
    explanation: {
      intuition: "Imagine the vector field as water velocity. High divergence means water is erupting from a source (like a faucet). Negative divergence means water is draining into a sink. Zero divergence means water is incompressible.",
      math: "[1:08:01] 'The divergence measures basically how much the field is shrinking or expanding, how much it looks like a sink or a source.' div X = ∇·X = Σᵢ ∂Xᵢ/∂xᵢ.",
      computation: `import numpy as np

# Radial field X(x,y) = (x,y) — diverging from origin
# div X = ∂x/∂x + ∂y/∂y = 1 + 1 = 2 everywhere

# Constant field X(x,y) = (1,0) — no sources or sinks
# div X = ∂(1)/∂x + ∂(0)/∂y = 0

# Incompressible fluid: div v = 0 (mass conservation)
print("Radial divergence: 2 (source at origin)")
print("Constant field divergence: 0 (incompressible)")`,
      connection: "Incompressible fluid simulation enforces div v = 0 at every step (pressure projection). Poisson equation ∇²φ = div F appears in rendering and geometry processing."
    },
    topic: "DIVERGENCE",
    section: "Vector Field Derivatives [1:08:01]",
    difficulty: "Easy",
    category: "conceptual",
    slideImages: ["image_1771988951848_0.png"],
  },
  {
    id: 22,
    question: "What does the curl of a vector field measure?",
    questionType: "single-choice",
    options: [
      "The rate of expansion or contraction of the field",
      "How much the vector field is spinning or rotating at each point",
      "The magnitude of the vectors in the field",
      "The gradient of the field's energy"
    ],
    answer: 1,
    explanation: {
      intuition: "Drop a tiny paddle wheel in a fluid. If the fluid's velocity field has nonzero curl, the wheel spins. High curl means strong local rotation. A straight laminar flow has zero curl.",
      math: "[1:09:03] 'What is the curl measuring about this vector field? Hopefully it's not too hard to see that it's kind of measuring how much this field is spinning.' curl X = ∇×X. In 2D: curl X = ∂X₂/∂x₁ − ∂X₁/∂x₂.",
      computation: `import numpy as np

# Rotation field: X(x,y) = (-y, x) — pure spinning
# curl X = ∂(x)/∂x − ∂(-y)/∂y = 1 − (-1) = 2  (constant nonzero curl)

# Gradient field: X = ∇f for some scalar f
# curl(∇f) = 0 always  (irrotational)

print("Rotation field curl: 2 (constant spinning)")
print("Any gradient field curl: 0 (irrotational)")`,
      connection: "[1:14:47] The lecturer shows div X = curl(R₉₀ X) where R₉₀ is 90° rotation — linking divergence and curl as 'the same operation up to rotation.'"
    },
    topic: "CURL",
    section: "Vector Field Derivatives [1:09:03]",
    difficulty: "Easy",
    category: "conceptual",
    slideImages: ["image_1771989024001_0.png"],
  },
  {
    id: 23,
    question: "What elegant relationship does the lecturer identify between divergence and curl in 2D?",
    questionType: "single-choice",
    options: [
      "They are completely independent operations with no relation",
      "div X = curl(R₉₀ X), where R₉₀ is a 90° rotation of the field — they are the same operation up to a rotation",
      "The curl of X always equals the divergence of X",
      "The sum of curl and divergence is always zero for physical fields"
    ],
    answer: 1,
    explanation: {
      intuition: "Sources/sinks and swirls are 'the same phenomenon rotated 90°'. A field that expands radially looks exactly like a rotating vortex if you rotate every arrow by 90°. This symmetry is why Cauchy-Riemann equations link real and imaginary parts of holomorphic functions.",
      math: "[1:14:47] 'Hopefully what you are kind of picking up on is that the divergence of X is the same as the curl of the 90 degree rotation of X.' If R₉₀(a,b) = (−b,a), then div X = curl(R₉₀ X).",
      computation: `import numpy as np

def div2d(X, x, eps=1e-7):
    """Numerical 2D divergence."""
    return ((X(x + [eps,0]) - X(x - [eps,0]))[0] +
            (X(x + [0,eps]) - X(x - [0,eps]))[1]) / (2*eps)

def curl2d(X, x, eps=1e-7):
    """Numerical 2D curl (scalar)."""
    return ((X(x + [eps,0]) - X(x - [eps,0]))[1] -
            (X(x + [0,eps]) - X(x - [0,eps]))[0]) / (2*eps)

X  = lambda p: np.array([p[0], p[1]])   # radial field
R90 = lambda p: np.array([-p[1], p[0]])

x = np.array([1., 2.])
print("div X:", div2d(X, x))                    # 2.0
print("curl R90X:", curl2d(lambda p: R90(X(p)), x))  # 2.0  ← same!`,
      connection: "This duality underlies Helmholtz decomposition (any field = irrotational part + divergence-free part), fundamental in fluid simulation and spectral geometry processing."
    },
    topic: "CURL",
    section: "Vector Field Derivatives [1:14:47]",
    difficulty: "Hard",
    category: "mathematical",
    slideImages: ["image_1771989278643_0.png"],
  },
  // ============================================================
  // LAPLACIAN & HESSIAN — 16%
  // ============================================================
  {
    id: 24,
    question: "Why does the lecturer say the Laplacian is 'unbelievably important' for computer graphics?",
    questionType: "single-choice",
    options: [
      "It only appears in highly specialised rendering algorithms",
      "It shows up across geometry processing, rendering, simulation, imaging, and more — virtually everywhere",
      "It is only useful for color space conversions",
      "It is the only differential operator that can be computed in real time"
    ],
    answer: 1,
    explanation: {
      intuition: "The Laplacian measures how much a function differs from its local average. Smooth functions have Laplacian ≈ 0. This 'averaging' property makes it ideal for smoothing meshes, solving heat equations, computing harmonic maps, and much more.",
      math: "[1:17:34] 'This is unbelievably important for graphics, it shows up across geometry, across rendering, simulation, imaging, everywhere … it encodes all sorts of rich information about the geometry.'",
      computation: `# Applications of the Laplacian in graphics:
# 1. Geometry: Laplacian smoothing (mesh denoising)
#    Δx_i = Σ_j (x_j - x_i) / valence_i  → moves vertices toward neighbourhood average
# 2. Rendering: Diffusion / heat equation ∂u/∂t = κΔu
# 3. Simulation: Pressure Poisson ∇²p = div(v/Δt)
# 4. Imaging: Laplacian pyramid, edge detection
# 5. Geometry processing: spectral mesh analysis (eigenfunctions of Δ)
print("Laplacian appears in every sub-field of graphics.")`,
      connection: "[1:17:28] 'The Laplacian is … the divergence of the gradient.' Its eigenfunctions define the 'Fourier basis' on a mesh — used in shape analysis, texture synthesis, and neural shape representations."
    },
    topic: "LAPLACIAN",
    section: "Laplacian [1:17:28]",
    difficulty: "Easy",
    category: "conceptual",
    slideImages: ["image_1771989366312_0.png"],
  },
  {
    id: 25,
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
      intuition: "First take the gradient — that gives you a vector field of slopes. Then take the divergence of that field — that measures how much those slopes are 'spreading out'. The result is the Laplacian: a scalar measuring net curvature.",
      math: "[1:21:19] 'Laplacian of f is the divergence of the gradient of f.' Δf = ∇·(∇f) = Σᵢ ∂²f/∂xᵢ². This equals the sum of all pure second partial derivatives.",
      computation: `import numpy as np
from scipy.ndimage import laplace   # discrete Laplacian

# Analytic example: f(x,y) = x² + y²
# ∇f = (2x, 2y)
# div(∇f) = ∂(2x)/∂x + ∂(2y)/∂y = 2 + 2 = 4  (constant Laplacian)

def laplacian_analytic(x):
    return 4.0   # for f = x² + y²

# Discrete (5-point stencil on a grid)
def laplacian_5pt(f, i, j, h):
    return (f[i+1,j] + f[i-1,j] + f[i,j+1] + f[i,j-1] - 4*f[i,j]) / h**2

print("Laplacian of x²+y² everywhere:", laplacian_analytic(None))  # 4.0`,
      connection: "Δf = 0 defines harmonic functions — solutions to the heat equation at equilibrium. Discrete Laplacians on meshes are used in Laplacian editing, shape segmentation, and spectral geometry."
    },
    topic: "LAPLACIAN",
    section: "Laplacian [1:21:19]",
    difficulty: "Medium",
    category: "mathematical",
    slideImages: ["image_1771989413169_0.png"],
  },
];

// ─────────────────────────────────────────────────────────────
// TIMER HOOK
// ─────────────────────────────────────────────────────────────
const useTimer = () => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => setTimeSpent(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  return {
    timeSpent,
    start: () => setIsActive(true),
    pause: () => setIsActive(false),
    reset: () => { setTimeSpent(0); setIsActive(false); }
  };
};

const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

// ─────────────────────────────────────────────────────────────
// MAIN QUIZ COMPONENT
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
    if (screen === 'quiz' && !showExp && !reviewMode) start();
    else pause();
  }, [screen, showExp, reviewMode, qIdx]);

  const isCorrect = useCallback((question, ans) => {
    if (ans === null || ans === undefined) return false;
    return ans === question.answer;
  }, []);

  const handleSubmit = () => {
    const newAns = [...answers];
    newAns[qIdx] = selected[0];
    setAnswers(newAns);
    setShowExp(true);
  };

  const handleNext = () => {
    if (qIdx < quizData.length - 1) {
      setQIdx(qIdx + 1);
      setSelected([]);
      setShowExp(false);
    } else {
      setScreen('results');
      pause();
    }
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
    setScreen('welcome');
    setQIdx(0);
    setAnswers(Array(quizData.length).fill(null));
    setSelected([]);
    setShowExp(false);
    setReviewMode(false);
    resetTimer();
  };

  const score = answers.filter((ans, i) => isCorrect(quizData[i], ans)).length;
  const percentage = Math.round((score / quizData.length) * 100);

  // ─── Colours ───────────────────────────────────────────────
  const colors = {
    bg: '#0a0a0f',
    surface: '#111118',
    border: '#1e2a3a',
    accent: '#38bdf8',        // sky-blue — vector calculus theme
    accentHover: '#0ea5e9',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    text: '#e2e8f0',
    textMuted: '#94a3b8',
    code: '#1e2a3a',
  };

  const baseStyles = {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${colors.bg} 0%, #0a1628 100%)`,
    color: colors.text,
    fontFamily: "'Rajdhani', sans-serif",
    padding: '2rem 1rem',
  };

  const containerStyles = {
    maxWidth: '800px',
    margin: '0 auto',
    background: colors.surface,
    borderRadius: '16px',
    padding: '2rem',
    border: `1px solid ${colors.border}`,
  };

  const buttonStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: colors.accent,
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: '600',
    transition: 'background 0.2s',
  };

  const codeStyles = {
    background: colors.code,
    padding: '1rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontFamily: "'JetBrains Mono', monospace",
    overflowX: 'auto',
    whiteSpace: 'pre',
    color: '#93c5fd',
    lineHeight: '1.6',
  };

  // ─── Lecture slide image renderer ─────────────────────────
  const SlideImages = ({ images }) => {
    if (!images || images.length === 0) return null;
    return (
      <div style={{ marginTop: '1rem' }}>
        <h4 style={{ fontSize: '0.9rem', color: colors.accent, marginBottom: '0.5rem' }}>
          📸 Lecture Slides
        </h4>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {images.map((img, idx) => (
            <img
              key={idx}
              src={`/assets/${img}`}
              alt={`Lecture slide ${idx + 1}`}
              onError={(e) => { e.target.style.display = 'none'; }}
              style={{
                maxWidth: '100%',
                borderRadius: '8px',
                border: `1px solid ${colors.border}`,
                objectFit: 'contain',
                flex: '1 1 300px',
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────
  // WELCOME SCREEN
  // ─────────────────────────────────────────────────────────
  if (screen === 'welcome') {
    return (
      <div style={baseStyles}>
        <div style={containerStyles}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Sigma size={64} color={colors.accent} style={{ display: 'inline-block' }} />
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem', color: colors.accent, marginTop: '1rem' }}>
              Lecture 3 Quiz
            </h1>
            <p style={{ fontSize: '1.1rem', color: colors.textMuted, marginBottom: '0.5rem' }}>
              Vector Calculus in Computer Graphics
            </p>
            <p style={{ fontSize: '0.95rem', color: colors.textMuted, fontStyle: 'italic' }}>
              CMU 15-462/662 • 1:30:13 • Norms · Products · Derivatives · Gradient · Divergence · Curl · Laplacian
            </p>
          </div>

          <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${colors.border}` }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: colors.accent }}>
              <BookOpen size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Topics Covered
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.95rem' }}>
              <div><span style={{ color: colors.accent }}>•</span> Euclidean Norm &amp; Inner Products</div>
              <div><span style={{ color: colors.accent }}>•</span> Cross Product &amp; Determinants</div>
              <div><span style={{ color: colors.accent }}>•</span> Matrix Representations</div>
              <div><span style={{ color: colors.accent }}>•</span> Derivatives &amp; Gradient</div>
              <div><span style={{ color: colors.accent }}>•</span> Divergence &amp; Curl</div>
              <div><span style={{ color: colors.accent }}>•</span> Laplacian &amp; Hessian</div>
            </div>
          </div>

          <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${colors.border}` }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: colors.accent }}>Quiz Stats</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: colors.accent }}>{quizData.length}</div>
                <div style={{ fontSize: '0.9rem', color: colors.textMuted }}>Questions</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#4ade80' }}>40%</div>
                <div style={{ fontSize: '0.9rem', color: colors.textMuted }}>Easy</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#fbbf24' }}>44%</div>
                <div style={{ fontSize: '0.9rem', color: colors.textMuted }}>Medium</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f87171' }}>16%</div>
                <div style={{ fontSize: '0.9rem', color: colors.textMuted }}>Hard</div>
              </div>
            </div>
          </div>

          <div style={{ background: '#0d0d12', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', border: `1px solid ${colors.border}`, fontSize: '0.9rem', color: colors.textMuted }}>
            <strong style={{ color: colors.accent }}>Note on slide images:</strong> Each explanation includes lecture slide references. Images load from <code style={{ fontFamily: 'monospace', color: '#93c5fd' }}>/assets/</code> — push your Logseq assets folder to the repo root to display them.
          </div>

          <button
            style={{ ...buttonStyles, width: '100%', fontSize: '1.1rem', padding: '1rem', justifyContent: 'center' }}
            onMouseEnter={(e) => e.target.style.background = colors.accentHover}
            onMouseLeave={(e) => e.target.style.background = colors.accent}
            onClick={() => { setScreen('quiz'); start(); }}
          >
            <Sigma size={20} />
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // RESULTS SCREEN
  // ─────────────────────────────────────────────────────────
  if (screen === 'results') {
    return (
      <div style={baseStyles}>
        <div style={containerStyles}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Trophy size={64} color={percentage >= 70 ? colors.success : percentage >= 50 ? colors.warning : colors.error} />
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginTop: '1rem', marginBottom: '0.5rem' }}>
              Quiz Complete!
            </h1>
            <p style={{ fontSize: '1.1rem', color: colors.textMuted }}>
              <Clock size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} />
              Time: {formatTime(timeSpent)}
            </p>
          </div>

          <div style={{ background: '#0d0d12', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', textAlign: 'center', border: `1px solid ${colors.border}` }}>
            <div style={{ fontSize: '4rem', fontWeight: '700', color: percentage >= 70 ? colors.success : percentage >= 50 ? colors.warning : colors.error, marginBottom: '0.5rem' }}>
              {percentage}%
            </div>
            <div style={{ fontSize: '1.2rem', color: colors.textMuted, marginBottom: '1rem' }}>
              {score} / {quizData.length} correct
            </div>
            <div style={{ fontSize: '1rem', color: colors.textMuted }}>
              {percentage >= 90 ? '∇ Vector Calculus Master!' :
               percentage >= 70 ? '∫ Strong Foundations!' :
               percentage >= 50 ? 'Δ Keep Reviewing!' :
               '≠ Back to Lecture 3!'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              style={{ ...buttonStyles, flex: 1, justifyContent: 'center' }}
              onMouseEnter={(e) => e.target.style.background = colors.accentHover}
              onMouseLeave={(e) => e.target.style.background = colors.accent}
              onClick={handleReview}
            >
              <BookOpen size={20} />
              Review Answers
            </button>
            <button
              style={{ ...buttonStyles, flex: 1, justifyContent: 'center' }}
              onMouseEnter={(e) => e.target.style.background = colors.accentHover}
              onMouseLeave={(e) => e.target.style.background = colors.accent}
              onClick={handleRestart}
            >
              <RefreshCw size={20} />
              Restart
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // QUIZ SCREEN
  // ─────────────────────────────────────────────────────────
  return (
    <div style={baseStyles}>
      <div style={containerStyles}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.95rem', color: colors.textMuted }}>
              Question {qIdx + 1} of {quizData.length}
            </div>
            <div style={{ fontSize: '0.95rem', color: colors.textMuted }}>
              <Clock size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} />
              {formatTime(timeSpent)}
            </div>
          </div>
          <div style={{ height: '6px', background: colors.border, borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((qIdx + 1) / quizData.length) * 100}%`, background: colors.accent, transition: 'width 0.3s' }} />
          </div>
        </div>

        {/* Question metadata */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', background: `${colors.accent}20`, color: colors.accent, fontSize: '0.85rem', fontWeight: '600' }}>
              {q.difficulty}
            </span>
            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', background: `${colors.accent}20`, color: colors.accent, fontSize: '0.85rem' }}>
              {q.section}
            </span>
            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', background: `${colors.accent}20`, color: colors.accent, fontSize: '0.85rem' }}>
              {q.topic}
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            {q.question}
          </h2>
        </div>

        {/* Options */}
        <div style={{ marginBottom: '2rem' }}>
          {q.options.map((opt, i) => (
            <div
              key={i}
              onClick={() => !showExp && !reviewMode && setSelected([i])}
              style={{
                padding: '1rem',
                borderRadius: '8px',
                border: `2px solid ${
                  showExp || reviewMode
                    ? i === q.answer ? colors.success : selected[0] === i ? colors.error : colors.border
                    : selected[0] === i ? colors.accent : colors.border
                }`,
                background: showExp || reviewMode
                  ? i === q.answer ? `${colors.success}15` : selected[0] === i ? `${colors.error}15` : colors.surface
                  : selected[0] === i ? `${colors.accent}15` : colors.surface,
                cursor: showExp || reviewMode ? 'default' : 'pointer',
                transition: 'all 0.2s',
                marginBottom: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {(showExp || reviewMode) && (i === q.answer
                  ? <CheckCircle size={20} color={colors.success} />
                  : selected[0] === i ? <XCircle size={20} color={colors.error} /> : null
                )}
                <span>{opt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Explanation */}
        {showExp && q.explanation && (
          <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${colors.border}` }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: colors.accent }}>Explanation</h3>
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1rem', color: colors.accent, marginBottom: '0.5rem' }}>💡 Intuition</h4>
              <p style={{ lineHeight: '1.6', color: colors.textMuted }}>{q.explanation.intuition}</p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1rem', color: colors.accent, marginBottom: '0.5rem' }}>📐 Lecture Reference</h4>
              <p style={{ lineHeight: '1.6', color: colors.textMuted }}>{q.explanation.math}</p>
            </div>
            {q.slideImages && q.slideImages.length > 0 && (
              <SlideImages images={q.slideImages} />
            )}
            <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
              <h4 style={{ fontSize: '1rem', color: colors.accent, marginBottom: '0.5rem' }}>💻 Code</h4>
              <pre style={codeStyles}>{q.explanation.computation}</pre>
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', color: colors.accent, marginBottom: '0.5rem' }}>🔗 Connection</h4>
              <p style={{ lineHeight: '1.6', color: colors.textMuted }}>{q.explanation.connection}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={handlePrev}
            disabled={qIdx === 0}
            style={{
              ...buttonStyles,
              opacity: qIdx === 0 ? 0.5 : 1,
              cursor: qIdx === 0 ? 'not-allowed' : 'pointer',
              background: colors.border,
            }}
            onMouseEnter={(e) => qIdx !== 0 && (e.target.style.background = colors.accentHover)}
            onMouseLeave={(e) => qIdx !== 0 && (e.target.style.background = colors.border)}
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          {!showExp && !reviewMode && (
            <button
              onClick={handleSubmit}
              disabled={selected.length === 0}
              style={{
                ...buttonStyles,
                flex: 1,
                justifyContent: 'center',
                opacity: selected.length === 0 ? 0.5 : 1,
              }}
              onMouseEnter={(e) => selected.length > 0 && (e.target.style.background = colors.accentHover)}
              onMouseLeave={(e) => selected.length > 0 && (e.target.style.background = colors.accent)}
            >
              Submit Answer
            </button>
          )}

          {(showExp || reviewMode) && (
            <button
              onClick={handleNext}
              style={{ ...buttonStyles, flex: 1, justifyContent: 'center' }}
              onMouseEnter={(e) => e.target.style.background = colors.accentHover}
              onMouseLeave={(e) => e.target.style.background = colors.accent}
            >
              {qIdx < quizData.length - 1 ? (
                <>Next Question <ChevronRight size={20} /></>
              ) : (
                <>View Results <Trophy size={20} /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;

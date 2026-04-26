'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Sigma } from 'lucide-react'

// Source: lectures/cg-03-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 3: Vector Calculus — Part 1 · Q1–Q32 · 32 questions
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-03-lecture-quiz.md 3

const quizData = [
  {
    id: 1,
    timestamp: `01:05`,
    question: `Why is vector calculus important for computer graphics according to the lecturer?`,
    options: [`It provides the mathematical foundation for color theory`, `It offers a language for spatial relationships and rates of change`, `It's essential for GPU programming`, `It simplifies shader development`],
    answer: 1,
    intuition: `The basic reason is that it gives us a language for talking about spatial relationships rates of change transformations and so forth.`,
    explanation: `The lecturer explains at [01:23]: "The basic reason is that it gives us a language for talking about spatial relationships rates of change transformations and so forth." df`,
    code: ``,
    images: ["image_1771911982856_0.png"],
    tags: ["motivation", "PDEs"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 2,
    timestamp: `01:37`,
    question: `What specific application area in graphics does the lecturer mention that relies on partial differential equations?`,
    options: [`File compression algorithms`, `Color grading`, `Physically based animation`, `Hardware acceleration`],
    answer: 2,
    intuition: `This lets us do all sorts of things from physically based animation and geometry processing and image processing using the language of rates of change.`,
    explanation: `The lecturer states at [01:48]: "This lets us do all sorts of things from physically based animation and geometry processing and image processing using the language of rates of change." df`,
    code: ``,
    images: [],
    tags: ["Animation"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 3,
    timestamp: `02:23`,
    question: `What is the defining characteristic of the Euclidean norm according to the lecture?`,
    options: [`It always yields positive values`, `It is the length preserved by rigid motions of space`, `It works only in 3D space`, `It measures angles between vectors`],
    answer: 1,
    intuition: `We can say the euclidean norm is the notion of length preserved by rigid motions of space, so rotations translations and reflections.`,
    explanation: `The lecturer defines at [03:18]: "We can say the euclidean norm is the notion of length preserved by rigid motions of space, so rotations translations and reflections."`,
    code: ``,
    images: ["image_1771912248659_0.png"],
    tags: ["Norm/Euclidean", "definition", "rotation", "translation", "reflections"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 4,
    timestamp: `03:53`,
    question: `What is the coordinate formula for the Euclidean norm when using orthonormal coordinates?`,
    options: [`The sum of the components`, `The maximum of the absolute values of the components`, `The square root of the sum of the squares of the components`, `The average of the components`],
    answer: 2,
    intuition: `If we have orthonormal coordinates then we can write the euclidean norm of a vector u as the square root of the sum of the squares of all the components.`,
    explanation: `The lecturer states at [03:53]: "If we have orthonormal coordinates then we can write the euclidean norm of a vector u as the square root of the sum of the squares of all the components."`,
    code: ``,
    images: ["image_1771912292087_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 5,
    timestamp: `04:30`,
    question: `What important warning does the lecturer give about computing the Euclidean norm in coordinates?`,
    options: [`It can lead to floating-point errors`, `It only works in two dimensions`, `It doesn't give the geometric length unless using an orthonormal basis`, `It's computationally expensive`],
    answer: 2,
    intuition: `A little warning, whenever we work in coordinates we have to be careful because this expression does not give us the geometric length unless the vector u happens to be encoded in an orthonormal basis.`,
    explanation: `The lecturer warns at [04:30]: "A little warning, whenever we work in coordinates we have to be careful because this expression does not give us the geometric length unless the vector u happens to be encoded in an orthonormal basis."`,
    code: ``,
    images: ["image_1771912295116_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 6,
    timestamp: `05:10`,
    question: `How does the lecturer define the Euclidean inner product in geometric terms?`,
    options: [`As the sum of component-wise products`, `As the norm of u times norm of v times cosine of the angle between them`, `As the projection of one vector onto another`, `As the reciprocal of the distance between vectors`],
    answer: 1,
    intuition: `For n-dimensional vectors the euclidean inner product can be defined as inner product of uv is equal to the norm of u times the norm of v times the cosine of the angle theta between the vectors u and v.`,
    explanation: `The lecturer defines at [05:41]: "For n-dimensional vectors the euclidean inner product can be defined as inner product of uv is equal to the norm of u times the norm of v times the cosine of the angle theta between the vectors u and v."`,
    code: ``,
    images: ["image_1771912310455_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 7,
    timestamp: `06:44`,
    question: `What condition must be met for the dot product formula to have geometric meaning?`,
    options: [`The vectors must be normalized`, `The vectors must have the same dimension`, `The coordinates must come from an orthonormal basis`, `The vectors must be perpendicular`],
    answer: 2,
    intuition: `Again we have our warning as with the euclidean norm, this expression this sum of component-wise products has no geometric meaning unless the coordinates come from an orthonormal basis.`,
    explanation: `The lecturer states at [06:44]: "Again we have our warning as with the euclidean norm, this expression this sum of component-wise products has no geometric meaning unless the coordinates come from an orthonormal basis."`,
    code: ``,
    images: ["image_1771912379439_0.png"],
    tags: ["Orthonormal", "Basis"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 8,
    timestamp: `07:24`,
    question: `What does the cross product of two vectors produce, according to the lecture?`,
    options: [`A scalar value`, `A vector`, `A matrix`, `A tensor`],
    answer: 1,
    intuition: `The inner product took two vectors and produced a scalar. The cross product is going to do something a little different. It's going to take two vectors and produce a vector as output.`,
    explanation: `The lecturer states at [07:32]: "The inner product took two vectors and produced a scalar. The cross product is going to do something a little different. It's going to take two vectors and produce a vector as output."`,
    code: ``,
    images: [],
    tags: ["InnerProducts"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 9,
    timestamp: `07:52`,
    question: `What two properties define the cross product geometrically?`,
    options: [`Its magnitude is the dot product of the vectors and its direction is along their sum`, `Its magnitude is the area of the parallelogram and its direction is orthogonal to both vectors`, `Its magnitude is the product of vector lengths and its direction is the average of their directions`, `Its magnitude is the sum of the vectors and its direction is their difference`],
    answer: 1,
    intuition: `I can say that the magnitude is equal to the area of the parallelogram made by the two vectors and I can say that the direction of the cross product is orthogonal to both vectors.`,
    explanation: `The lecturer explains at [07:52]: "I can say that the magnitude is equal to the area of the parallelogram made by the two vectors and I can say that the direction of the cross product is orthogonal to both vectors."`,
    code: ``,
    images: ["image_1771913321064_0.png"],
    tags: ["Property", "Geometry"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 10,
    timestamp: `08:34`,
    question: `Why does the cross product make sense only in three dimensions?`,
    options: [`Because in 2D there is no vector orthogonal to both vectors within the plane, and in 4D+ there are too many possible orthogonal vectors`, `Because cross products are only defined for 3D space mathematically`, `Because geometric operations only make sense in our physical 3D world`, `Because the parallelogram area property only works in 3D`],
    answer: 0,
    intuition: `I have two vectors u v in the plane and I'm looking for a vector that's orthogonal to both of them. Well unless those vectors are parallel there is no vector in 2D that is orthogonal to both u and v.`,
    explanation: `The lecturer explains at [09:25]: "I have two vectors u v in the plane and I'm looking for a vector that's orthogonal to both of them. Well unless those vectors are parallel there is no vector in 2D that is orthogonal to both u and v." And at [09:45]: "When we go into 4D or any higher dimension we're going to actually have many different vectors that could be orthogonal to both u and v and have the desired magnitude." The 4D+ Problem: In four dimensions or higher, there are actually too many directions that are perpendicular to both u and v, so the cross product wouldn't give you a unique, single answer.`,
    code: ``,
    images: ["image_1771913464398_0.png"],
    tags: ["Concept"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 11,
    timestamp: `10:19`,
    question: `What is the "abusive notation" the lecturer mentions for the 2D cross product?`,
    options: [`Using quaternions instead of vectors`, `Reporting just the signed area of the parallelogram`, `Ignoring the cross product entirely for 2D`, `Using complex numbers instead of vectors`],
    answer: 1,
    intuition: `A word of warning. Sometimes I and other people will use the cross product in 2D to just refer to this signed area of this parallelogram. So the area of the parallelogram and make it positive if it's sort of pointing out of the plane and negative if it's pointing into the plane.`,
    explanation: `The lecturer mentions at [10:19]: "A word of warning. Sometimes I and other people will use the cross product in 2D to just refer to this signed area of this parallelogram. So the area of the parallelogram and make it positive if it's sort of pointing out of the plane and negative if it's pointing into the plane."`,
    code: ``,
    images: ["image_1771913472308_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 12,
    timestamp: `11:46`,
    question: `What is the precise mathematical definition of the cross product using determinants?`,
    options: [`It is the vector that makes the determinant of the three vectors equal to zero`, `It is the unique vector that makes the determinant of the matrix with columns u, v, and u×v equal to the product of their norms times sine of the angle`, `It is the vector that makes the determinant of the matrix equal to one`, `It is the unique vector that makes the determinant of the matrix negative`],
    answer: 1,
    intuition: `The cross product is the unique vector u cross v that satisfies this relationship that says the square root of the determinant of the matrix with columns u v and u cross v is equal to the norm of u times the norm of v times sine theta.`,
    explanation: `The lecturer defines at [11:46]: "The cross product is the unique vector u cross v that satisfies this relationship that says the square root of the determinant of the matrix with columns u v and u cross v is equal to the norm of u times the norm of v times sine theta."`,
    code: ``,
    images: ["image_1771968532356_0.png"],
    tags: ["definition", "determinant", "CrossProduct"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 13,
    timestamp: `13:48`,
    question: `What geometric interpretation of the cross product does the lecturer describe as "really useful"?`,
    options: [`That it represents the normal vector to the plane containing both vectors`, `That it gives the volume of the parallelepiped formed by three vectors`, `That a cross product with a unit normal vector is equivalent to a quarter rotation in the plane`, `That it represents the projection of one vector onto another`],
    answer: 2,
    intuition: `A simple but useful observation is that a cross product with a unit normal vector n is equivalent to a quarter rotation in the plane with normal n.`,
    explanation: `The lecturer states at [14:00]: "A simple but useful observation is that a cross product with a unit normal vector n is equivalent to a quarter rotation in the plane with normal n."
{:height 547, :width 658}`,
    code: ``,
    images: ["image_1771968664365_0.png"],
    tags: ["Property", "Geometry", "CG-Lecture-Question", "Rotation"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 14,
    timestamp: `14:30`,
    question: `What is the result of n cross (n cross u) according to the lecture?`,
    options: [`u`, `-u`, `n`, `A vector perpendicular to both n and u`],
    answer: 1,
    intuition: `Hopefully not too hard you see that n cross n cross u is another 90 degree rotation which means it's a 180 degree rotation of the original vector u which means it's actually equal to minus u.`,
    explanation: `The lecturer explains at [14:46]: "Hopefully not too hard you see that n cross n cross u is another 90 degree rotation which means it's a 180 degree rotation of the original vector u which means it's actually equal to minus u."`,
    code: ``,
    images: ["image_1771968737924_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 15,
    timestamp: `15:47`,
    question: `How can the dot product be expressed using matrix operations?`,
    options: [`As the determinant of a matrix containing both vectors`, `As the trace of the matrix formed by the vectors`, `As u transpose times v`, `As the eigenvalue of the vectors' outer product`],
    answer: 2,
    intuition: `It's often convenient for instance to express a dot product using a matrix product so if I wanted to represent u dot v that's no different from saying I write u transpose v.`,
    explanation: `The lecturer states at [16:06]: "It's often convenient for instance to express a dot product using a matrix product so if I wanted to represent u dot v that's no different from saying I write u transpose v."`,
    code: ``,
    images: ["image_1771968934443_0.png"],
    tags: ["matrix", "DotProduct", "Representation"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 16,
    timestamp: `17:17`,
    question: `How does the lecturer represent a general inner product with coefficients using matrices?`,
    options: [`By constructing a matrix of coefficients and using u^T A v`, `By using the trace of a coefficient matrix`, `By constructing a diagonal matrix of coefficients`, `By using the determinant of a coefficient matrix`],
    answer: 0,
    intuition: `What I'm going to do is build a little in this case two by two matrix because we're in two dimensions that has encoded in it all the constants all the coefficients in my expression for the inner product... And then I'm going to do something that looks just like what I did before u transpose v but I'm going to stick this matrix a in the middle. So I'm going to do u transpose a v.`,
    explanation: `The lecturer explains at [17:56]: "What I'm going to do is build a little in this case two by two matrix because we're in two dimensions that has encoded in it all the constants all the coefficients in my expression for the inner product... And then I'm going to do something that looks just like what I did before u transpose v but I'm going to stick this matrix a in the middle. So I'm going to do u transpose a v."`,
    code: ``,
    images: ["image_1771968987949_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 17,
    timestamp: `19:04`,
    question: `What important property does the matrix representing a general inner product have?`,
    options: [`It must be invertible`, `It must be symmetric`, `It must be diagonal`, `It must be positive definite`],
    answer: 1,
    intuition: `Question why is the matrix that I got symmetric if I take the matrix a and apply its transpose I again get 2 1 1 3.`,
    explanation: `The lecturer points out at [19:04]: "Question why is the matrix that I got symmetric if I take the matrix a and apply its transpose I again get 2 1 1 3."

- What`,
    code: ``,
    images: ["image_1771969001254_0.png"],
    tags: ["CG-Lecture-Question", "Property", "Symmetry"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 18,
    timestamp: `19:21`,
    question: `How can the cross product be represented using a matrix?`,
    options: [`As a 3×3 identity matrix multiplied by the vector`, `As a skew-symmetric matrix constructed from the vector components`, `As a symmetric matrix multiplied by the vector`, `As the eigenvalues of the vector's components`],
    answer: 1,
    intuition: `This matrix has an interesting structure. It has the three components of the vector in it but half of them are negated... And you notice that this matrix now instead of being symmetric it's anti-symmetric or skew-symmetric.`,
    explanation: `The lecturer explains at [19:40]: "This matrix has an interesting structure. It has the three components of the vector in it but half of them are negated... And you notice that this matrix now instead of being symmetric it's anti-symmetric or skew-symmetric."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 19,
    timestamp: `21:11`,
    question: `What happens when you swap the order of vectors in a cross product?`,
    options: [`The result is the same`, `The result is the negative of the original cross product`, `The result is orthogonal to the original cross product`, `The result is rotated by 90 degrees`],
    answer: 1,
    intuition: `It's useful to notice here that v cross u is minus u cross v. So the cross product is kind of a anti-symmetric operation if I exchange the order of the operands I get minus the result.`,
    explanation: `The lecturer states at [21:11]: "It's useful to notice here that v cross u is minus u cross v. So the cross product is kind of a anti-symmetric operation if I exchange the order of the operands I get minus the result."`,
    code: ``,
    images: ["image_1771969154783_0.png"],
    tags: ["Property", "matrix", "Representation", "CrossProduct"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 20,
    timestamp: `23:54`,
    question: `What geometric interpretation does the lecturer give for the determinant of three vectors?`,
    options: [`The angle between the vectors`, `The projection of one vector onto another`, `The volume of the parallelepiped formed by the vectors`, `The sum of the vector magnitudes`],
    answer: 2,
    intuition: `The determinant of three vectors u v and w gives me the volume of a little parallel pipet, a little box with edges u v and w.`,
    explanation: `The lecturer explains at [23:54]: "The determinant of three vectors u v and w gives me the volume of a little parallel pipet, a little box with edges u v and w."
**signed volume**`,
    code: ``,
    images: ["image_1771969392356_0.png", "image_1771969197614_0.png"],
    tags: ["Geometry", "definition"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 21,
    timestamp: `24:56`,
    question: `How does the lecturer geometrically calculate the volume of the parallelepiped formed by three vectors?`,
    options: [`By computing the triple integral of the vectors`, `By taking the dot product of one vector with the cross product of the other two`, `By summing the magnitudes of all three vectors`, `By calculating the eigenvalues of the matrix formed by the vectors`],
    answer: 1,
    intuition: `So now if I take the dot product of u cross v with w, what am I measuring? I'm measuring the height of the box times the area of the base and guess what that gives me the volume of this box.`,
    explanation: `The lecturer states at [24:56]: "So now if I take the dot product of u cross v with w, what am I measuring? I'm measuring the height of the box times the area of the base and guess what that gives me the volume of this box."   - it recovers original mapping.`,
    code: ``,
    images: ["image_1771969487599_0.png"],
    tags: ["Mapping"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 22,
    timestamp: `27:01`,
    question: `What does the sign of the determinant represent geometrically?`,
    options: [`Whether the volume is positive or negative`, `Whether the vectors are linearly independent`, `Whether the orientation was preserved or reversed`, `Whether the vectors are orthogonal`],
    answer: 2,
    intuition: `What does the sign of the determinant tell us in this case? Well, it's basically telling us whether the orientation was reversed.`,
    explanation: `The lecturer explains at [31:21]: "What does the sign of the determinant tell us in this case? Well, it's basically telling us whether the orientation was reversed."`,
    code: ``,
    images: ["image_1771969597588_0.png"],
    tags: ["Geometry", "Orientation"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 23,
    timestamp: `28:08`,
    question: `What is the relationship between a linear map and its matrix representation?`,
    options: [`The matrix columns are the images of the standard basis vectors`, `The matrix rows are the images of the standard basis vectors`, `The matrix diagonal contains the eigenvalues of the linear map`, `The matrix determinant equals the linear map's trace`],
    answer: 0,
    intuition: `This is pretty easy, the a vectors become the columns of the matrix. Right I put a 1 x a 1 y a 1 z down the first column and so forth.`,
    explanation: `The lecturer states at [28:48]: "This is pretty easy, the a vectors become the columns of the matrix. Right I put a 1 x a 1 y a 1 z down the first column and so forth."
{:height 621, :width 748}`,
    code: ``,
    images: ["image_1771969732773_0.png"],
    tags: ["definition"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 24,
    timestamp: `29:29`,
    question: `According to the lecturer, what's a good mental model for matrix-vector multiplication?`,
    options: [`Rotating and scaling the vector`, `Performing a sequence of dot products`, `Taking linear combinations of the columns using the vector components as coefficients`, `Transforming the coordinate system`],
    answer: 2,
    intuition: `So I can think of matrix vector multiplication again as taking linear combinations of the columns using the components of the vector I'm multiplying by as the coefficients.`,
    explanation: `The lecturer states at [29:29]: "So I can think of matrix vector multiplication again as taking linear combinations of the columns using the components of the vector I'm multiplying by as the coefficients."`,
    code: ``,
    images: ["image_1771969739386_0.png"],
    tags: ["Concept"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 25,
    timestamp: `30:11`,
    question: `What geometric interpretation does the lecturer give for the determinant of a linear map?`,
    options: [`The angle of rotation caused by the map`, `The multiplicative change in volume caused by the map`, `The change in distance between points`, `The sum of the eigenvalues of the map`],
    answer: 1,
    intuition: `Because the determinant of the matrix gives us the volume of the parallel pipette, the determinant of the linear map is telling us the change in volume. We had something that had unit volume one times one times one and we got something that has some other volume... so determinant is always telling you about the multiplicative change in volume.`,
    explanation: `The lecturer explains at [30:48]: "Because the determinant of the matrix gives us the volume of the parallel pipette, the determinant of the linear map is telling us the change in volume. We had something that had unit volume one times one times one and we got something that has some other volume... so determinant is always telling you about the multiplicative change in volume."
- QUESTIONS (continued):`,
    code: ``,
    images: ["image_1771969755550_0.png"],
    tags: ["interpretation", "determinant"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 26,
    timestamp: `32:39`,
    question: `What is the Jacobi identity for cross products?`,
    options: [`u × (v × w) = (u × v) × w`, `u × (v × w) + v × (w × u) + w × (u × v) = 0`, `u × (v × w) = v(u·w) - w(u·v)`, `u × v = -v × u`],
    answer: 1,
    intuition: `There's something called the Jacobi identity which just involves the cross product and that says something similar but different. It says that u cross v cross w plus v cross w cross u plus w cross u cross v is equal to zero.`,
    explanation: `The lecturer states at [32:39]: "There's something called the Jacobi identity which just involves the cross product and that says something similar but different. It says that u cross v cross w plus v cross w cross u plus w cross u cross v is equal to zero."
{:height 556, :width 669}`,
    code: ``,
    images: ["image_1771969698655_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 27,
    timestamp: `33:21`,
    question: `What is Lagrange's identity for cross products?`,
    options: [`u × (v × w) = (u × v) × w`, `u × (v × w) + v × (w × u) + w × (u × v) = 0`, `u × (v × w) = v(u·w) - w(u·v)`, `(u × v)·w = u·(v × w)`],
    answer: 2,
    intuition: `Another triple product is something called Lagrange's identity which says that u cross v cross w is equal to v times u dot w minus w times u dot v, meaning you take the dot product and then you just use that scalar to multiply the vector.`,
    explanation: `The lecturer explains at [33:21]: "Another triple product is something called Lagrange's identity which says that u cross v cross w is equal to v times u dot w minus w times u dot v, meaning you take the dot product and then you just use that scalar to multiply the vector."`,
    code: ``,
    images: ["image_1771969766622_0.png"],
    tags: ["identity", "Lagrange"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 28,
    timestamp: `34:05`,
    question: `What are differential operators according to the lecture?`,
    options: [`Operators that calculate differences between vectors`, `Operators that represent integration of functions`, `Derivatives that act on vector fields`, `Operators that perform discrete approximations`],
    answer: 2,
    intuition: `Differential operators are basically derivatives that act on vector fields.`,
    explanation: `The lecturer defines at [34:05]: "Differential operators are basically derivatives that act on vector fields."`,
    code: ``,
    images: ["image_1771970129032_0.png"],
    tags: ["definition", "Operator"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 29,
    timestamp: `34:37`,
    question: `What application of differential operators in graphics does the lecture mention?`,
    options: [`Texture compression`, `User interface design`, `Numerical optimization by following gradients`, `Memory management`],
    answer: 2,
    intuition: `These tools, differential operators, also provide the foundations for numerical optimization. So something that shows up a lot in computer graphics is that you want to find the best solution, you want to minimize cost by for instance following the gradient of some objective or energy function.`,
    explanation: `The lecturer explains at [34:37]: "These tools, differential operators, also provide the foundations for numerical optimization. So something that shows up a lot in computer graphics is that you want to find the best solution, you want to minimize cost by for instance following the gradient of some objective or energy function."`,
    code: ``,
    images: ["image_1771970183463_0.png"],
    tags: ["Operator", "Differential", "optimization", "Numericalization"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 30,
    timestamp: `35:30`,
    question: `What is the most basic definition of a derivative according to the lecture?`,
    options: [`The second-order approximation of a function`, `The change in a function with respect to time`, `The slope or rise over run of a function`, `The limit of a difference quotient`],
    answer: 2,
    intuition: `Perhaps the most basic definition, one that you might have learned first, is that it gives the slope. It gives the rise over run of the function for a short distance.`,
    explanation: `The lecturer states at [35:30]: "Perhaps the most basic definition, one that you might have learned first, is that it gives the slope. It gives the rise over run of the function for a short distance."`,
    code: ``,
    images: ["image_1771970280186_0.png"],
    tags: ["definition", "Derivatives"],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 31,
    timestamp: `35:41`,
    question: `What is the formal definition of the derivative?`,
    options: [`The integral of the function's rate of change`, `The limit as epsilon goes to zero of [f(x₀+ε)-f(x₀)]/ε`, `The second derivative of the function`, `The area under the function's curve`],
    answer: 1,
    intuition: `We look at how much the function is changing over a little distance epsilon. So we start at some point x naught, move over to x naught plus epsilon, evaluate the function, take the difference from the function value at x naught, divide by epsilon and then take the limit as epsilon goes to 0.`,
    explanation: `The lecturer gives the definition at [35:41]: "We look at how much the function is changing over a little distance epsilon. So we start at some point x naught, move over to x naught plus epsilon, evaluate the function, take the difference from the function value at x naught, divide by epsilon and then take the limit as epsilon goes to 0."`,
    code: ``,
    images: ["image_1771970353123_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
  },
  {
    id: 32,
    timestamp: `37:03`,
    question: `When is a function not differentiable at a point?`,
    options: [`When its value at that point is zero`, `When the left and right limits of the derivative don't agree`, `When the function is constant around that point`, `When the function has a local maximum at that point`],
    answer: 1,
    intuition: `In this case we say the function is not differentiable at x naught, or that it is differentiable if f plus is the same as f minus.`,
    explanation: `The lecturer explains at [37:03]: "In this case we say the function is not differentiable at x naught, or that it is differentiable if f plus is the same as f minus."`,
    code: ``,
    images: ["image_1771970359791_0.png"],
    tags: [],
    source: `lectures/cg-03-lecture-quiz.md`,
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

export default function Lec3Part1Quiz() {
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
    accent: '#38bdf8',
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
          <Sigma size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 3: Vector Calculus — Part 1</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Gradient, Divergence, Curl, Laplacian, Hessian</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-03-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec3/1`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec3/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
          <a key={3} href={`${BASE}/lec3/3`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 3</a>
          </div>
          <p style={{ color: C.accent, fontWeight: 600 }}>Q1–Q32 · 32 questions</p>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>32</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Questions</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>~10min</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Est. Time</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>3</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Parts</div></div>
          </div>
        </div>

        <button style={btn({ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' })}
          onClick={() => { setScreen('quiz'); start() }}>
          <Sigma size={20} /> Start Quiz
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
              <Sigma size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 3: Vector Calculus — Part 1</span>
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
              {qIdx < 32-1 ? 'Next Question' : 'View Results'} <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
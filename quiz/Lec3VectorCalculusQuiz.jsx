'use client'
import { useState, useEffect, useRef } from 'react'
import { Sigma } from 'lucide-react'

// Lecture 3: Vector Calculus — 70 questions

function SlideImages({ images }) {
  if (!images || images.length === 0) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', margin: '1rem 0' }}>
      {images.map((img, i) => (
        <img key={i} src={`/assets/${img}`}
          alt={`Slide ${i+1}`}
          onError={e => { e.target.style.display = 'none' }}
          style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid #334155' }} />
      ))}
    </div>
  )
}

const quizData = [
  {
    num: 1,
    timestamp: `01:05`,
    question: `Why is vector calculus important for computer graphics according to the lecturer?`,
    options: [`It provides the mathematical foundation for color theory`, `It offers a language for spatial relationships and rates of change`, `It's essential for GPU programming`, `It simplifies shader development`],
    answer: 1,
    explanation: `The lecturer explains at [01:23]: "The basic reason is that it gives us a language for talking about spatial relationships rates of change transformations and so forth."`,
    images: ["image_1771911982856_0.png"],
  },
  {
    num: 2,
    timestamp: `01:37`,
    question: `What specific application area in graphics does the lecturer mention that relies on partial differential equations?`,
    options: [`File compression algorithms`, `Color grading`, `Physically based animation`, `Hardware acceleration`],
    answer: 2,
    explanation: `The lecturer states at [01:48]: "This lets us do all sorts of things from physically based animation and geometry processing and image processing using the language of rates of change."`,
    images: [],
  },
  {
    num: 3,
    timestamp: `02:23`,
    question: `What is the defining characteristic of the Euclidean norm according to the lecture?`,
    options: [`It always yields positive values`, `It is the length preserved by rigid motions of space`, `It works only in 3D space`, `It measures angles between vectors`],
    answer: 1,
    explanation: `The lecturer defines at [03:18]: "We can say the euclidean norm is the notion of length preserved by rigid motions of space, so rotations translations and reflections."`,
    images: ["image_1771912248659_0.png"],
  },
  {
    num: 4,
    timestamp: `03:53`,
    question: `What is the coordinate formula for the Euclidean norm when using orthonormal coordinates?`,
    options: [`The sum of the components`, `The maximum of the absolute values of the components`, `The square root of the sum of the squares of the components`, `The average of the components`],
    answer: 2,
    explanation: `The lecturer states at [03:53]: "If we have orthonormal coordinates then we can write the euclidean norm of a vector u as the square root of the sum of the squares of all the components."`,
    images: ["image_1771912292087_0.png"],
  },
  {
    num: 5,
    timestamp: `04:30`,
    question: `What important warning does the lecturer give about computing the Euclidean norm in coordinates?`,
    options: [`It can lead to floating-point errors`, `It only works in two dimensions`, `It doesn't give the geometric length unless using an orthonormal basis`, `It's computationally expensive`],
    answer: 2,
    explanation: `The lecturer warns at [04:30]: "A little warning, whenever we work in coordinates we have to be careful because this expression does not give us the geometric length unless the vector u happens to be encoded in an orthonormal basis."`,
    images: ["image_1771912295116_0.png"],
  },
  {
    num: 6,
    timestamp: `05:10`,
    question: `How does the lecturer define the Euclidean inner product in geometric terms?`,
    options: [`As the sum of component-wise products`, `As the norm of u times norm of v times cosine of the angle between them`, `As the projection of one vector onto another`, `As the reciprocal of the distance between vectors`],
    answer: 1,
    explanation: `The lecturer defines at [05:41]: "For n-dimensional vectors the euclidean inner product can be defined as inner product of uv is equal to the norm of u times the norm of v times the cosine of the angle theta between the vectors u and v."`,
    images: ["image_1771912310455_0.png"],
  },
  {
    num: 7,
    timestamp: `06:44`,
    question: `What condition must be met for the dot product formula to have geometric meaning?`,
    options: [`The vectors must be normalized`, `The vectors must have the same dimension`, `The coordinates must come from an orthonormal basis`, `The vectors must be perpendicular`],
    answer: 2,
    explanation: `The lecturer states at [06:44]: "Again we have our warning as with the euclidean norm, this expression this sum of component-wise products has no geometric meaning unless the coordinates come from an orthonormal basis."`,
    images: ["image_1771912379439_0.png"],
  },
  {
    num: 8,
    timestamp: `07:24`,
    question: `What does the cross product of two vectors produce, according to the lecture?`,
    options: [`A scalar value`, `A vector`, `A matrix`, `A tensor`],
    answer: 1,
    explanation: `The lecturer states at [07:32]: "The inner product took two vectors and produced a scalar. The cross product is going to do something a little different. It's going to take two vectors and produce a vector as output."`,
    images: [],
  },
  {
    num: 9,
    timestamp: `07:52`,
    question: `What two properties define the cross product geometrically?`,
    options: [`Its magnitude is the dot product of the vectors and its direction is along their sum`, `Its magnitude is the area of the parallelogram and its direction is orthogonal to both vectors`, `Its magnitude is the product of vector lengths and its direction is the average of their directions`, `Its magnitude is the sum of the vectors and its direction is their difference`],
    answer: 1,
    explanation: `The lecturer explains at [07:52]: "I can say that the magnitude is equal to the area of the parallelogram made by the two vectors and I can say that the direction of the cross product is orthogonal to both vectors."`,
    images: ["image_1771913321064_0.png"],
  },
  {
    num: 10,
    timestamp: `08:34`,
    question: `Why does the cross product make sense only in three dimensions?`,
    options: [`Because in 2D there is no vector orthogonal to both vectors within the plane, and in 4D+ there are too many possible orthogonal vectors`, `Because cross products are only defined for 3D space mathematically`, `Because geometric operations only make sense in our physical 3D world`, `Because the parallelogram area property only works in 3D`],
    answer: 0,
    explanation: `The lecturer explains at [09:25]: "I have two vectors u v in the plane and I'm looking for a vector that's orthogonal to both of them. Well unless those vectors are parallel there is no vector in 2D that is orthogonal to both u and v." And at [09:45]: "When we go into 4D or any higher dimension we're going to actually have many different vectors that could be orthogonal to both u and v and have the desired magnitude." The 4D+ Problem: In four dimensions or higher, there are actually too many directions that are perpendicular to both u and v, so the cross product wouldn't give you a unique, single answer.`,
    images: ["image_1771913464398_0.png"],
  },
  {
    num: 11,
    timestamp: `10:19`,
    question: `What is the "abusive notation" the lecturer mentions for the 2D cross product?`,
    options: [`Using quaternions instead of vectors`, `Reporting just the signed area of the parallelogram`, `Ignoring the cross product entirely for 2D`, `Using complex numbers instead of vectors`],
    answer: 1,
    explanation: `The lecturer mentions at [10:19]: "A word of warning. Sometimes I and other people will use the cross product in 2D to just refer to this signed area of this parallelogram. So the area of the parallelogram and make it positive if it's sort of pointing out of the plane and negative if it's pointing into the plane."`,
    images: ["image_1771913472308_0.png"],
  },
  {
    num: 12,
    timestamp: `11:46`,
    question: `What is the precise mathematical definition of the cross product using determinants?`,
    options: [`It is the vector that makes the determinant of the three vectors equal to zero`, `It is the unique vector that makes the determinant of the matrix with columns u, v, and u×v equal to the product of their norms times sine of the angle`, `It is the vector that makes the determinant of the matrix equal to one`, `It is the unique vector that makes the determinant of the matrix negative`],
    answer: 1,
    explanation: `The lecturer defines at [11:46]: "The cross product is the unique vector u cross v that satisfies this relationship that says the square root of the determinant of the matrix with columns u v and u cross v is equal to the norm of u times the norm of v times sine theta."`,
    images: ["image_1771968532356_0.png"],
  },
  {
    num: 13,
    timestamp: `13:48`,
    question: `What geometric interpretation of the cross product does the lecturer describe as "really useful"?`,
    options: [`That it represents the normal vector to the plane containing both vectors`, `That it gives the volume of the parallelepiped formed by three vectors`, `That a cross product with a unit normal vector is equivalent to a quarter rotation in the plane`, `That it represents the projection of one vector onto another`],
    answer: 2,
    explanation: `The lecturer states at [14:00]: "A simple but useful observation is that a cross product with a unit normal vector n is equivalent to a quarter rotation in the plane with normal n." {:height 547, :width 658}`,
    images: ["image_1771968664365_0.png"],
  },
  {
    num: 14,
    timestamp: `14:30`,
    question: `What is the result of n cross (n cross u) according to the lecture?`,
    options: [`u`, `-u`, `n`, `A vector perpendicular to both n and u`],
    answer: 1,
    explanation: `The lecturer explains at [14:46]: "Hopefully not too hard you see that n cross n cross u is another 90 degree rotation which means it's a 180 degree rotation of the original vector u which means it's actually equal to minus u."`,
    images: ["image_1771968737924_0.png"],
  },
  {
    num: 15,
    timestamp: `15:47`,
    question: `How can the dot product be expressed using matrix operations?`,
    options: [`As the determinant of a matrix containing both vectors`, `As the trace of the matrix formed by the vectors`, `As u transpose times v`, `As the eigenvalue of the vectors' outer product`],
    answer: 2,
    explanation: `The lecturer states at [16:06]: "It's often convenient for instance to express a dot product using a matrix product so if I wanted to represent u dot v that's no different from saying I write u transpose v."`,
    images: ["image_1771968934443_0.png"],
  },
  {
    num: 16,
    timestamp: `17:17`,
    question: `How does the lecturer represent a general inner product with coefficients using matrices?`,
    options: [`By constructing a matrix of coefficients and using u^T A v`, `By using the trace of a coefficient matrix`, `By constructing a diagonal matrix of coefficients`, `By using the determinant of a coefficient matrix`],
    answer: 0,
    explanation: `The lecturer explains at [17:56]: "What I'm going to do is build a little in this case two by two matrix because we're in two dimensions that has encoded in it all the constants all the coefficients in my expression for the inner product... And then I'm going to do something that looks just like what I did before u transpose v but I'm going to stick this matrix a in the middle. So I'm going to do u transpose a v."`,
    images: ["image_1771968987949_0.png"],
  },
  {
    num: 17,
    timestamp: `19:04`,
    question: `What important property does the matrix representing a general inner product have?`,
    options: [`It must be invertible`, `It must be symmetric`, `It must be diagonal`, `It must be positive definite`],
    answer: 1,
    explanation: `The lecturer points out at [19:04]: "Question why is the matrix that I got symmetric if I take the matrix a and apply its transpose I again get 2 1 1 3." - What`,
    images: ["image_1771969001254_0.png"],
  },
  {
    num: 18,
    timestamp: `19:21`,
    question: `How can the cross product be represented using a matrix?`,
    options: [`As a 3×3 identity matrix multiplied by the vector`, `As a skew-symmetric matrix constructed from the vector components`, `As a symmetric matrix multiplied by the vector`, `As the eigenvalues of the vector's components`],
    answer: 1,
    explanation: `The lecturer explains at [19:40]: "This matrix has an interesting structure. It has the three components of the vector in it but half of them are negated... And you notice that this matrix now instead of being symmetric it's anti-symmetric or skew-symmetric."`,
    images: [],
  },
  {
    num: 19,
    timestamp: `21:11`,
    question: `What happens when you swap the order of vectors in a cross product?`,
    options: [`The result is the same`, `The result is the negative of the original cross product`, `The result is orthogonal to the original cross product`, `The result is rotated by 90 degrees`],
    answer: 1,
    explanation: `The lecturer states at [21:11]: "It's useful to notice here that v cross u is minus u cross v. So the cross product is kind of a anti-symmetric operation if I exchange the order of the operands I get minus the result."`,
    images: ["image_1771969154783_0.png"],
  },
  {
    num: 20,
    timestamp: `23:54`,
    question: `What geometric interpretation does the lecturer give for the determinant of three vectors?`,
    options: [`The angle between the vectors`, `The projection of one vector onto another`, `The volume of the parallelepiped formed by the vectors`, `The sum of the vector magnitudes`],
    answer: 2,
    explanation: `The lecturer explains at [23:54]: "The determinant of three vectors u v and w gives me the volume of a little parallel pipet, a little box with edges u v and w." **signed volume**`,
    images: ["image_1771969392356_0.png", "image_1771969197614_0.png"],
  },
  {
    num: 21,
    timestamp: `24:56`,
    question: `How does the lecturer geometrically calculate the volume of the parallelepiped formed by three vectors?`,
    options: [`By computing the triple integral of the vectors`, `By taking the dot product of one vector with the cross product of the other two`, `By summing the magnitudes of all three vectors`, `By calculating the eigenvalues of the matrix formed by the vectors`],
    answer: 1,
    explanation: `The lecturer states at [24:56]: "So now if I take the dot product of u cross v with w, what am I measuring? I'm measuring the height of the box times the area of the base and guess what that gives me the volume of this box." - it recovers original mapping.`,
    images: ["image_1771969487599_0.png"],
  },
  {
    num: 22,
    timestamp: `27:01`,
    question: `What does the sign of the determinant represent geometrically?`,
    options: [`Whether the volume is positive or negative`, `Whether the vectors are linearly independent`, `Whether the orientation was preserved or reversed`, `Whether the vectors are orthogonal`],
    answer: 2,
    explanation: `The lecturer explains at [31:21]: "What does the sign of the determinant tell us in this case? Well, it's basically telling us whether the orientation was reversed."`,
    images: ["image_1771969597588_0.png"],
  },
  {
    num: 23,
    timestamp: `28:08`,
    question: `What is the relationship between a linear map and its matrix representation?`,
    options: [`The matrix columns are the images of the standard basis vectors`, `The matrix rows are the images of the standard basis vectors`, `The matrix diagonal contains the eigenvalues of the linear map`, `The matrix determinant equals the linear map's trace`],
    answer: 0,
    explanation: `The lecturer states at [28:48]: "This is pretty easy, the a vectors become the columns of the matrix. Right I put a 1 x a 1 y a 1 z down the first column and so forth."{:height 621, :width 748}`,
    images: ["image_1771969732773_0.png"],
  },
  {
    num: 24,
    timestamp: `29:29`,
    question: `According to the lecturer, what's a good mental model for matrix-vector multiplication?`,
    options: [`Rotating and scaling the vector`, `Performing a sequence of dot products`, `Taking linear combinations of the columns using the vector components as coefficients`, `Transforming the coordinate system`],
    answer: 2,
    explanation: `The lecturer states at [29:29]: "So I can think of matrix vector multiplication again as taking linear combinations of the columns using the components of the vector I'm multiplying by as the coefficients."`,
    images: ["image_1771969739386_0.png"],
  },
  {
    num: 25,
    timestamp: `30:11`,
    question: `What geometric interpretation does the lecturer give for the determinant of a linear map?`,
    options: [`The angle of rotation caused by the map`, `The multiplicative change in volume caused by the map`, `The change in distance between points`, `The sum of the eigenvalues of the map`],
    answer: 1,
    explanation: `The lecturer explains at [30:48]: "Because the determinant of the matrix gives us the volume of the parallel pipette, the determinant of the linear map is telling us the change in volume. We had something that had unit volume one times one times one and we got something that has some other volume... so determinant is always telling you about the multiplicative change in volume." - QUESTIONS (continued):`,
    images: ["image_1771969755550_0.png"],
  },
  {
    num: 26,
    timestamp: `32:39`,
    question: `What is the Jacobi identity for cross products?`,
    options: [`u × (v × w) = (u × v) × w`, `u × (v × w) + v × (w × u) + w × (u × v) = 0`, `u × (v × w) = v(u·w) - w(u·v)`, `u × v = -v × u`],
    answer: 1,
    explanation: `The lecturer states at [32:39]: "There's something called the Jacobi identity which just involves the cross product and that says something similar but different. It says that u cross v cross w plus v cross w cross u plus w cross u cross v is equal to zero."{:height 556, :width 669}`,
    images: ["image_1771969698655_0.png"],
  },
  {
    num: 27,
    timestamp: `33:21`,
    question: `What is Lagrange's identity for cross products?`,
    options: [`u × (v × w) = (u × v) × w`, `u × (v × w) + v × (w × u) + w × (u × v) = 0`, `u × (v × w) = v(u·w) - w(u·v)`, `(u × v)·w = u·(v × w)`],
    answer: 2,
    explanation: `The lecturer explains at [33:21]: "Another triple product is something called Lagrange's identity which says that u cross v cross w is equal to v times u dot w minus w times u dot v, meaning you take the dot product and then you just use that scalar to multiply the vector."`,
    images: ["image_1771969766622_0.png"],
  },
  {
    num: 28,
    timestamp: `34:05`,
    question: `What are differential operators according to the lecture?`,
    options: [`Operators that calculate differences between vectors`, `Operators that represent integration of functions`, `Derivatives that act on vector fields`, `Operators that perform discrete approximations`],
    answer: 2,
    explanation: `The lecturer defines at [34:05]: "Differential operators are basically derivatives that act on vector fields."`,
    images: ["image_1771970129032_0.png"],
  },
  {
    num: 29,
    timestamp: `34:37`,
    question: `What application of differential operators in graphics does the lecture mention?`,
    options: [`Texture compression`, `User interface design`, `Numerical optimization by following gradients`, `Memory management`],
    answer: 2,
    explanation: `The lecturer explains at [34:37]: "These tools, differential operators, also provide the foundations for numerical optimization. So something that shows up a lot in computer graphics is that you want to find the best solution, you want to minimize cost by for instance following the gradient of some objective or energy function."`,
    images: ["image_1771970183463_0.png"],
  },
  {
    num: 30,
    timestamp: `35:30`,
    question: `What is the most basic definition of a derivative according to the lecture?`,
    options: [`The second-order approximation of a function`, `The change in a function with respect to time`, `The slope or rise over run of a function`, `The limit of a difference quotient`],
    answer: 2,
    explanation: `The lecturer states at [35:30]: "Perhaps the most basic definition, one that you might have learned first, is that it gives the slope. It gives the rise over run of the function for a short distance."`,
    images: ["image_1771970280186_0.png"],
  },
  {
    num: 31,
    timestamp: `35:41`,
    question: `What is the formal definition of the derivative?`,
    options: [`The integral of the function's rate of change`, `The limit as epsilon goes to zero of [f(x₀+ε)-f(x₀)]/ε`, `The second derivative of the function`, `The area under the function's curve`],
    answer: 1,
    explanation: `The lecturer gives the definition at [35:41]: "We look at how much the function is changing over a little distance epsilon. So we start at some point x naught, move over to x naught plus epsilon, evaluate the function, take the difference from the function value at x naught, divide by epsilon and then take the limit as epsilon goes to 0."`,
    images: ["image_1771970353123_0.png"],
  },
  {
    num: 32,
    timestamp: `37:03`,
    question: `When is a function not differentiable at a point?`,
    options: [`When its value at that point is zero`, `When the left and right limits of the derivative don't agree`, `When the function is constant around that point`, `When the function has a local maximum at that point`],
    answer: 1,
    explanation: `The lecturer explains at [37:03]: "In this case we say the function is not differentiable at x naught, or that it is differentiable if f plus is the same as f minus."`,
    images: ["image_1771970359791_0.png"],
  },
  {
    num: 33,
    timestamp: `37:45`,
    question: `What alternative interpretation of the derivative does the lecturer provide?`,
    options: [`As the area under the curve`, `As the best linear approximation of the function`, `As the second-order derivative`, `As the inverse of integration`],
    answer: 1,
    explanation: `The lecturer states at [37:45]: "Another important view of the derivative is that it's sort of the best linear approximation of the function."`,
    images: ["image_1771970380896_0.png", "image_1772585164993_0.png"],
  },
  {
    num: 34,
    timestamp: `38:58`,
    question: `In terms of a Taylor series, how is a function approximated beyond the constant and linear terms?`,
    options: [`By adding logarithmic terms`, `By adding exponential terms`, `By adding higher degree terms like quadratic, cubic, etc.`, `By adding periodic functions`],
    answer: 2,
    explanation: `The lecturer explains at [38:58]: "I've done constant, I've done linear, what can I do next? Well just keep going up in degree. I do a quadratic term so I say what is the parabola that's the best fit at this point."`,
    images: ["image_1771970397841_0.png"],
  },
  {
    num: 35,
    timestamp: `39:22`,
    question: `Why does the lecturer say approximating functions with linear or quadratic terms is useful in graphics?`,
    options: [`Because it creates more realistic visualizations`, `Because it reduces memory usage`, `Because it makes computation easier`, `Because it improves color accuracy`],
    answer: 2,
    explanation: `The lecturer states at [39:22]: "In general replacing complicated functions with a linear or sometimes quadratic approximation is a powerful trick that we'll see over and over again in graphics algorithms because it makes computation easier."`,
    images: ["image_1771970433285_0.png"],
  },
  {
    num: 36,
    timestamp: `40:19`,
    question: `What is the directional derivative?`,
    options: [`A vector pointing in the direction of steepest ascent`, `The derivative of a multivariable function along a specific direction`, `The change in direction of a vector field`, `The curl of a function at a point`],
    answer: 1,
    explanation: `The lecturer describes at [40:19]: "Perhaps the most basic starting point is to think about the directional derivative because we'll be able to easily connect it to the usual one-dimensional derivative."`,
    images: ["image_1771970503059_0.png"],
  },
  {
    num: 37,
    timestamp: `41:31`,
    question: `How is the directional derivative formally defined?`,
    options: [`As the gradient dotted with the direction vector`, `As the limit of [f(x₀+εu)-f(x₀)]/ε as ε→0`, `As the Laplacian of the function in the given direction`, `As the divergence of the function's gradient`],
    answer: 1,
    explanation: `The lecturer states at [41:31]: "The directional derivative along the direction u of the function f is just the usual derivative... the limit as epsilon goes to zero of f of x naught plus epsilon u minus f of x naught divided by epsilon."`,
    images: ["image_1771987890560_0.png"],
  },
  {
    num: 38,
    timestamp: `42:54`,
    question: `What does the gradient tell us about a function?`,
    options: [`The total volume of the function`, `The second-order approximation of the function`, `The directional derivative in all possible directions`, `The boundary conditions of the function`],
    answer: 2,
    explanation: `The lecturer explains at [42:54]: "Before getting into the details, the gradient is basically something that tells us the directional derivative in all possible directions if we use it the right way." -`,
    images: ["image_1771987937211_0.png", "image_1772584782720_0.png"],
  },
  {
    num: 39,
    timestamp: `43:40`,
    question: `What does the lecturer say the gradient visually represents on a function?`,
    options: [`Arrows pointing in random directions`, `Vectors pointing in the direction of quickest increase (uphill)`, `The level sets of the function`, `The boundary of the function's domain`],
    answer: 1,
    explanation: `The lecturer describes at [43:40]: "Just by looking at this picture you get the sense that the gradient kind of points in the direction of quickest increase if we think of the dark blue colors as being small values in the function and the light blue or white colors being large values in the function, then the arrows are kind of pointing uphill."`,
    images: ["image_1771988006149_0.png"],
  },
  {
    num: 40,
    timestamp: `44:02`,
    question: `What is the proper name of the symbol ∇ used for the gradient?`,
    options: [`Del`, `Nabla`, `Gradient`, `Laplacian`],
    answer: 1,
    explanation: `The lecturer mentions at [44:02]: "By the way just as a piece of language this symbol that we use for the gradient is not really called grad it's actually got its own name it's called nabla."`,
    images: ["image_1771988003515_0.png"],
  },
  {
    num: 41,
    timestamp: `44:30`,
    question: `How is the gradient defined in terms of partial derivatives?`,
    options: [`The sum of all partial derivatives`, `The list of all partial derivatives along coordinate directions`, `The product of all partial derivatives`, `The maximum of all partial derivatives`],
    answer: 1,
    explanation: `The lecturer states at [44:56]: "I think a lot simpler way to think about this is hey, we already understand the directional derivative right? The directional derivative gives us the one dimensional derivative in some direction. So what is the gradient? It's just the list of the directional derivatives along all the coordinate axes x1, x2, x3, and so on."`,
    images: ["image_1771988089566_0.png"],
  },
  {
    num: 42,
    timestamp: `46:31`,
    question: `What is the gradient of the function f(x₁,x₂) = x₁² + x₂²?`,
    options: [`(x₁, x₂)`, `(2x₁, 2x₂)`, `(1, 1)`, `2(x₁ + x₂)`],
    answer: 1,
    explanation: `The lecturer calculates at [47:14]: "We combine these to get our gradient grad f of x is equal to 2x1 2x2 which we could also just write as 2 times bold x."`,
    images: ["image_1771988120283_0.png"],
  },
  {
    num: 43,
    timestamp: `48:08`,
    question: `What is the first-order Taylor approximation of a function f around a point x₀?`,
    options: [`f(x) ≈ f(x₀)`, `f(x) ≈ f(x₀) + ∇f(x₀)·(x-x₀)`, `f(x) ≈ f(x₀) + (x-x₀)²`, `f(x) ≈ ∇f(x₀)`],
    answer: 1,
    explanation: `The lecturer gives the formula at [48:08]: "We can write this as f of x is approximately f of x naught plus the inner product of the gradient of f at x naught with the vector x minus x naught."`,
    images: ["image_1771988163054_0.png"],
  },
  {
    num: 44,
    timestamp: `48:26`,
    question: `What happens to the function value when moving in the direction of the gradient?`,
    options: [`It decreases`, `It remains constant`, `It increases`, `It oscillates`],
    answer: 2,
    explanation: `The lecturer explains at [48:26]: "Starting at x naught we can see pretty easily that this term gets bigger if we move in the direction of the gradient right? Let's say that x minus x naught is equal to grad f, so we're moving uphill as quickly as possible."`,
    images: ["image_1771988197698_0.png"],
  },
  {
    num: 45,
    timestamp: `49:18`,
    question: `What does the gradient represent geometrically, according to the lecturer?`,
    options: [`The level curves of the function`, `The direction of steepest ascent`, `The second derivative of the function`, `The boundary of the function`],
    answer: 1,
    explanation: `The lecturer states at [49:18]: "This is our third important picture of the gradient, is that it's giving us the direction of steepest ascent. Meaning if we're standing at some point on the map, what direction should we travel to increase our altitude or increase the value of our function as quickly as possible."`,
    images: ["image_1771988213030_0.png"],
  },
  {
    num: 46,
    timestamp: `49:46`,
    question: `What optimization algorithm does the lecturer describe that uses the gradient?`,
    options: [`Simulated annealing`, `Genetic algorithms`, `Dynamic programming`, `Gradient descent`],
    answer: 3,
    explanation: `The lecturer describes at [50:01]: "What do we do? We start at some initial guess x naught, we evaluate the gradient at that point, we take a little step in the gradient direction and repeat, evaluate the gradient again, take a step again and so forth." This is gradient descent (or ascent depending on whether minimizing or maximizing).`,
    images: ["image_1771988229711_0.png"],
  },
  {
    num: 47,
    timestamp: `50:39`,
    question: `How is the gradient related to the directional derivative?`,
    options: [`They provide the same information in different forms`, `The directional derivative is the magnitude of the gradient`, `The inner product of the gradient with direction u equals the directional derivative along u`, `The gradient is the sum of all directional derivatives`],
    answer: 2,
    explanation: `The lecturer defines at [50:39]: "We can say that at each point x the gradient is the unique vector nabla f of x such that the inner product of nabla f with u is equal to the directional derivative of f along the direction u for all u."`,
    images: ["image_1771988289666_0.png"],
  },
  {
    num: 48,
    timestamp: `52:23`,
    question: `What is the gradient of the dot product u·v with respect to u?`,
    options: [`u`, `v`, `u + v`, `u - v`],
    answer: 1,
    explanation: `The lecturer concludes at [53:46]: "So the gradient with respect to u is just the list of all the v components. But at this point I think oh that's interesting, I could have written that a lot more simply. I could have just written the gradient of u transpose v with respect to u is equal to v."`,
    images: ["image_1771988372388_0.png"],
  },
  {
    num: 49,
    timestamp: `54:50`,
    question: `What pattern does the lecturer identify for the gradient of xᵀy with respect to x?`,
    options: [`It equals x`, `It equals y`, `It equals the transpose of y`, `It equals x + y`],
    answer: 1,
    explanation: `The lecturer states at [54:50]: "For instance if I have two vectors x and y in rn and I have a symmetric matrix a then the derivative of x transpose y with respect to x is equal to y as we've just seen."`,
    images: ["image_1771988432424_0.png"],
  },
  {
    num: 50,
    timestamp: `55:04`,
    question: `What does the gradient of xᵀAx with respect to x equal?`,
    options: [`x`, `Ax`, `2Ax`, `A`],
    answer: 2,
    explanation: `The lecturer states at [55:04]: "If I have the gradient of x transpose a x with respect to x I get 2ax." - QUESTIONS (continued):`,
    images: ["image_1771988467336_0.png"],
  },
  {
    num: 51,
    timestamp: `55:44`,
    question: `What resource does the lecturer recommend for matrix derivatives?`,
    options: [`The professor's lecture notes`, `The Matrix Cookbook`, `Linear Algebra Done Right`, `Matrix Calculus for Machine Learning`],
    answer: 1,
    explanation: `The lecturer mentions at [55:44]: "Beyond this little list here, there's an excellent resource the matrix cookbook that gives all sorts of nice matrix derivatives."`,
    images: [],
  },
  {
    num: 52,
    timestamp: `56:50`,
    question: `What complex mathematical object is the lecturer taking the gradient of in the advanced example?`,
    options: [`A tensor field`, `A quaternion`, `A function of another function`, `A complex-valued function`],
    answer: 2,
    explanation: `The lecturer states at [56:50]: "Let's try taking the gradient of a function of another function. What does that mean? So you could imagine for instance that little f is a function on the real line like sine or cosine or whatever you like, and big f is a function that takes any function little f and assigns it a score or a value."`,
    images: ["image_1771988539060_0.png"],
  },
  {
    num: 53,
    timestamp: `59:40`,
    question: `In the advanced example, what is the function Big F of little f?`,
    options: [`The maximum value of little f`, `The L2 inner product of little f and little g`, `The derivative of little f`, `The integral of little f squared`],
    answer: 1,
    explanation: `The lecturer defines at [59:40]: "Let's consider a concrete function big f of little f which is equal to the l2 inner product of little f and little g for functions little f and little g on the unit interval."`,
    images: ["image_1771988651688_0.png"],
  },
  {
    num: 54,
    timestamp: `1:00:44`,
    question: `What does the lecturer claim is the gradient of Big F(little f) = ⟨little f, little g⟩₂?`,
    options: [`The function little f`, `The derivative of little g`, `The function little g`, `The zero function`],
    answer: 2,
    explanation: `The lecturer states at [1:00:44]: "So likewise this time I'm going to claim the gradient of big f is just little g. If we take the gradient of big f with respect to little f, the little f falls away and we're left with just little g."`,
    images: ["image_1771988662637_0.png"],
  },
  {
    num: 55,
    timestamp: `1:01:26`,
    question: `What intuition does the lecturer use to explain why the gradient of the L2 inner product is the function little g?`,
    options: [`That the derivative of a product is the sum of derivatives`, `That the inner product measures alignment, and the function best aligned with g is g itself`, `That the derivative of the inner product is always zero`, `That any function can be represented as an inner product`],
    answer: 1,
    explanation: `The lecturer explains at [1:01:26]: "Well okay now we really draw on our intuition about the inner product from thinking about little arrows right? The inner product measures how well two little arrows are aligned or how well two functions are aligned. So what is the function that is best aligned with little g? Well it's just little g."`,
    images: ["image_1771988670464_0.png"],
  },
  {
    num: 56,
    timestamp: `1:04:42`,
    question: `What is the gradient of the squared L2 norm of f with respect to f?`,
    options: [`f`, `2f`, `The norm of f`, `The square of f`],
    answer: 1,
    explanation: `The lecturer concludes at [1:04:42]: "The only solution to this equation, the only way for this to hold for all functions u is if nabla f is equal to 2 little f naught."`,
    images: ["image_1771988738747_0.png"],
  },
  {
    num: 57,
    timestamp: `1:05:09`,
    question: `What pattern does the lecturer highlight about differentiating functions of functions?`,
    options: [`It's always more complex than regular differentiation`, `It follows different rules than regular differentiation`, `It follows similar patterns to ordinary differentiation`, `It requires complex transform techniques`],
    answer: 2,
    explanation: `The lecturer observes at [1:05:09]: "The way we differentiate functions of functions really doesn't look different at all from the way we just differentiate ordinary variables. The derivative of x squared with respect to x is 2x, the derivative of norm of f squared with respect to f is just 2f."`,
    images: ["image_1771988786536_0.png"],
  },
  {
    num: 58,
    timestamp: `1:06:32`,
    question: `How does the lecturer define a vector field?`,
    options: [`A collection of vectors in space`, `A mapping from points in space to vectors`, `A derivative of a scalar field`, `A matrix that transforms vectors`],
    answer: 1,
    explanation: `The lecturer defines at [1:06:32]: "For instance we could think of a vector field on the plane as a map from r2 to r2. For each point in r2 we get a vector in r2."`,
    images: ["image_1771988827100_0.png"],
  },
  {
    num: 59,
    timestamp: `1:07:25`,
    question: `How many basic derivatives for vector fields does the lecturer identify?`,
    options: [`One - the gradient`, `Two - the divergence and curl`, `Three - the gradient, divergence, and curl`, `Four - the gradient, divergence, curl, and Laplacian`],
    answer: 1,
    explanation: `The lecturer states at [1:07:25]: "Acturally there are multiple answers. There are two basic derivatives for vector fields."{:height 531, :width 658}`,
    images: ["image_1771988874726_0.png", "image_1771988926877_0.png"],
  },
  {
    num: 60,
    timestamp: `1:08:01`,
    question: `What does the divergence measure about a vector field?`,
    options: [`The circulation or rotational behavior`, `The average vector direction`, `The rate of expansion or contraction (source/sink behavior)`, `The total energy of the field`],
    answer: 2,
    explanation: `The lecturer explains at [1:08:01]: "The divergence measures basically how much the field is shrinking or expanding, how much it looks like a sink or a source where water is flowing out or flowing in."`,
    images: ["image_1771988951848_0.png"],
  },
  {
    num: 61,
    timestamp: `1:09:03`,
    question: `What does the curl measure about a vector field?`,
    options: [`The rate of expansion or contraction`, `How much the field is spinning (rotational behavior)`, `The magnitude of the vectors`, `The gradient of the field's energy`],
    answer: 1,
    explanation: `The lecturer states at [1:09:03]: "What is the curl measuring about this vector field? Hopefully it's not too hard to see that it's kind of measuring how much this field is spinning."`,
    images: ["image_1771989024001_0.png"],
  },
  {
    num: 62,
    timestamp: `1:09:41`,
    question: `How is the divergence written in notation?`,
    options: [`div X`, `∇ × X`, `∇ · X`, `∇² X`],
    answer: 2,
    explanation: `The lecturer notes at [1:09:41]: "We often write the divergence as nabla dot x."`,
    images: ["image_1771989058728_0.png"],
  },
  {
    num: 63,
    timestamp: `1:10:18`,
    question: `What is the coordinate formula for the divergence of a vector field?`,
    options: [`The determinant of the vector field's Jacobian`, `The sum of the partial derivatives of each component with respect to its corresponding coordinate`, `The trace of the vector field's gradient`, `The cross product of the gradient with the vector field`],
    answer: 1,
    explanation: `The lecturer describes at [1:10:18]: "We sum over all the coordinates each partial derivative being applied to each coordinate function. We take the derivative of the first coordinate function along the first direction, add that to the derivative of the second coordinate function along the second direction, and so on."`,
    images: ["image_1771989089559_0.png"],
  },
  {
    num: 64,
    timestamp: `1:12:22`,
    question: `How is the curl written in notation?`,
    options: [`curl X`, `∇ × X`, `∇ · X`, `∇² X`],
    answer: 1,
    explanation: `The lecturer states at [1:12:22]: "We can write curl also with nabla. We can write it as nabla cross x with a cross product."`,
    images: ["image_1771989199368_0.png"],
  },
  {
    num: 65,
    timestamp: `1:13:27`,
    question: `What is the 2D curl formula?`,
    options: [`The determinant of the 2×2 Jacobian matrix`, `∂x₂/∂x₁ - ∂x₁/∂x₂`, `∂x₁/∂x₁ + ∂x₂/∂x₂`, `The divergence of the 2D vector field`],
    answer: 1,
    explanation: `The lecturer gives the formula at [1:13:27]: "The curl of x is equal to the partial derivative of the second coordinate function along the first coordinate direction minus the partial derivative of the first coordinate function along the second coordinate direction."`,
    images: ["image_1771989224011_0.png", "image_1772584933293_0.png", "image_1772584943241_0.png", "image_1772585074709_0.png"],
  },
  {
    num: 66,
    timestamp: `1:14:47`,
    question: `What relationship does the lecturer identify between curl and divergence?`,
    options: [`They are completely independent operations`, `The divergence of X equals the curl of the 90° rotation of X`, `The curl is always perpendicular to the divergence`, `The sum of curl and divergence always equals zero`],
    answer: 1,
    explanation: `The lecturer observes at [1:14:47]: "Do you notice anything about the relationship between curl and divergence? Hopefully you do! Hopefully what you are kind of picking up on is that the divergence of x is the same as the curl of the 90 degree rotation of x."`,
    images: ["image_1771989278643_0.png"],
  },
  {
    num: 67,
    timestamp: `1:16:38`,
    question: `In the fluid simulation example, what change in variables leads to different simulation results?`,
    options: [`Changing from 2D to 3D simulation`, `Changing from velocity field to stream function`, `Changing from laminar to turbulent flow`, `Changing from Eulerian to Lagrangian coordinates`],
    answer: 1,
    explanation: `The lecturer explains at [1:16:52]: "So in one case you might use the fluid velocity u, in the other case you use the so-called stream function psi. And you can see that just this mathematically fairly simple change really changes the behavior of the simulation."`,
    images: ["image_1771989335272_0.png"],
  },
  {
    num: 68,
    timestamp: `1:17:34`,
    question: `Why does the lecturer say the Laplacian is important for graphics?`,
    options: [`It only appears in specialized applications`, `It appears across many domains including geometry, rendering, simulation, and imaging`, `It's only important for color processing`, `It's only useful for physics simulations`],
    answer: 1,
    explanation: `The lecturer emphasizes at [1:17:34]: "This is unbelievably important for graphics, it shows up across geometry, across rendering, simulation, imaging, everywhere."`,
    images: ["image_1771989366312_0.png"],
  },
  {
    num: 69,
    timestamp: `1:21:19`,
    question: `How can the Laplacian be written in terms of other differential operators?`,
    options: [`As the gradient of the divergence`, `As the curl of the gradient`, `As the divergence of the gradient`, `As the divergence of the curl`],
    answer: 2,
    explanation: `The lecturer states at [1:21:19]: "We can write it using the operators we just talked about: divergence and gradient. So Laplacian of f is the divergence of the gradient of f." ]`,
    images: ["image_1771989413169_0.png"],
  },
  {
    num: 70,
    timestamp: `1:27:25`,
    question: `How does the lecturer define the Hessian in terms of the gradient?`,
    options: [`The Hessian is the determinant of the gradient`, `The Hessian is the transpose of the gradient`, `The Hessian gives the directional derivative of the gradient`, `The Hessian is the integral of the gradient`],
    answer: 2,
    explanation: `The lecturer defines at [1:27:25]: "More precisely what I mean by that is if I take the Hessian of the function f and apply it to the vector or direction u, then I get the directional derivative of the gradient in the direction u." -`,
    images: ["image_1771989791144_0.png"],
  },
]

function useTimer() {
  const [elapsed, setElapsed] = useState(0)
  const ref = useRef(null)
  const start = () => { ref.current = setInterval(() => setElapsed(e => e + 1), 1000) }
  const stop = () => clearInterval(ref.current)
  const reset = () => { clearInterval(ref.current); setElapsed(0) }
  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
  return { elapsed, fmt, start, stop, reset }
}

export default function SigmaQuiz() {
  const [screen, setScreen] = useState('welcome')
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const timer = useTimer()
  const q = quizData[idx]
  const ACCENT = '#38bdf8'

  const card = { background: '#1e293b', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid #334155' }

  if (screen === 'welcome') return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'system-ui,sans-serif' }}>
      <Sigma size={48} color={ACCENT} style={{ marginBottom: '1.5rem' }} />
      <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem' }}>Lecture 3: Vector Calculus</h1>
      <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Gradient, Divergence, Curl, Laplacian, Hessian</p>
      <p style={{ color: ACCENT, fontWeight: 600, marginBottom: '2rem' }}>70 questions</p>
      <button onClick={() => { setScreen('quiz'); timer.start() }}
        style={{ background: ACCENT, color: '#0f172a', fontWeight: 700, padding: '0.75rem 2.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
        Start Quiz
      </button>
      <a href='/' style={{ marginTop: '1.5rem', color: '#64748b', fontSize: '0.875rem' }}>← Back to index</a>
    </div>
  )

  if (screen === 'results') {
    const pct = Math.round(score / quizData.length * 100)
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', padding: '2rem', fontFamily: 'system-ui,sans-serif', color: '#f1f5f9' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ color: ACCENT, fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Lecture 3: Vector Calculus — Results</h1>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Time: {timer.fmt(timer.elapsed)}</p>
          <div style={{ ...card, textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: ACCENT }}>{pct}%</div>
            <div style={{ color: '#94a3b8', marginTop: '0.5rem' }}>{score} / {quizData.length} correct</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {answers.map((a, i) => {
              const qq = quizData[i]
              const correct = a === qq.answer
              return (
                <div key={i} style={{ ...card, borderColor: correct ? '#22c55e44' : '#ef444444' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Q{qq.num} [{qq.timestamp}]</div>
                  <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{qq.question}</div>
                  <div style={{ color: correct ? '#22c55e' : '#ef4444', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    Your answer: {qq.options[a]} {correct ? '✓' : '✗'}
                  </div>
                  {!correct && <div style={{ color: '#22c55e', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Correct: {qq.options[qq.answer]}</div>}
                  {qq.explanation && <div style={{ color: '#94a3b8', fontSize: '0.875rem', borderTop: '1px solid #334155', paddingTop: '0.5rem', marginTop: '0.5rem' }}>{qq.explanation}</div>}
                  <SlideImages images={qq.images} />
                </div>
              )
            })}
          </div>
          <button onClick={() => { setScreen('welcome'); setIdx(0); setScore(0); setAnswers([]); timer.reset() }}
            style={{ marginTop: '2rem', background: ACCENT, color: '#0f172a', fontWeight: 700, padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
            Restart
          </button>
          <a href='/' style={{ display: 'block', marginTop: '1rem', color: '#64748b', fontSize: '0.875rem' }}>← Back to index</a>
        </div>
      </div>
    )
  }

  const handleSelect = (i) => { if (!revealed) setSelected(i) }
  const handleReveal = () => {
    if (selected === null) return
    setRevealed(true)
    if (selected === q.answer) setScore(s => s + 1)
  }
  const handleNext = () => {
    setAnswers(a => [...a, selected])
    if (idx + 1 >= quizData.length) { timer.stop(); setScreen('results') }
    else { setIdx(i => i + 1); setSelected(null); setRevealed(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '1.5rem', fontFamily: 'system-ui,sans-serif', color: '#f1f5f9' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Sigma size={20} color={ACCENT} /><span style={{ color: ACCENT, fontWeight: 600 }}>Lecture 3: Vector Calculus</span></div>
          <div style={{ display: 'flex', gap: '1.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
            <span>{timer.fmt(timer.elapsed)}</span>
            <span>{idx+1} / 70</span>
            <span style={{ color: ACCENT }}>Score: {score}</span>
          </div>
        </div>

        {/* Progress */}
        <div style={{ background: '#1e293b', borderRadius: '99px', height: '6px', marginBottom: '1.5rem' }}>
          <div style={{ background: ACCENT, height: '100%', borderRadius: '99px', width: `${((idx+1)/70)*100}%`, transition: 'width 0.3s' }} />
        </div>

        {/* Question card */}
        <div style={card}>
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Q{q.num} · [{q.timestamp}]</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem', lineHeight: 1.6 }}>{q.question}</div>
          <SlideImages images={q.images} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {q.options.map((opt, i) => {
              let bg = '#0f172a', border = '#334155', color = '#cbd5e1'
              if (selected === i && !revealed) { bg = `${ACCENT}22`; border = ACCENT; color = '#f1f5f9' }
              if (revealed && i === q.answer) { bg = '#22c55e22'; border = '#22c55e'; color = '#22c55e' }
              if (revealed && selected === i && i !== q.answer) { bg = '#ef444422'; border = '#ef4444'; color = '#ef4444' }
              return (
                <button key={i} onClick={() => handleSelect(i)}
                  style={{ background: bg, border: `1px solid ${border}`, color, padding: '0.75rem 1rem', borderRadius: '8px', textAlign: 'left', cursor: revealed ? 'default' : 'pointer', fontSize: '0.95rem', transition: 'all 0.15s' }}>
                  <span style={{ fontWeight: 700, marginRight: '0.5rem' }}>{['A','B','C','D'][i]}.</span>{opt}
                </button>
              )
            })}
          </div>
        </div>

        {/* Explanation */}
        {revealed && q.explanation && (
          <div style={{ ...card, borderColor: `${ACCENT}44` }}>
            <div style={{ color: ACCENT, fontWeight: 700, marginBottom: '0.5rem' }}>Explanation</div>
            <div style={{ color: '#cbd5e1', lineHeight: 1.7 }}>{q.explanation}</div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          {!revealed && <button onClick={handleReveal} disabled={selected === null}
            style={{ background: selected !== null ? ACCENT : '#334155', color: selected !== null ? '#0f172a' : '#64748b', fontWeight: 700, padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', cursor: selected !== null ? 'pointer' : 'not-allowed' }}>
            Check Answer
          </button>}
          {revealed && <button onClick={handleNext}
            style={{ background: ACCENT, color: '#0f172a', fontWeight: 700, padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
            {idx + 1 >= 70 ? 'See Results' : 'Next Question →'}
          </button>}
        </div>
      </div>
    </div>
  )
}
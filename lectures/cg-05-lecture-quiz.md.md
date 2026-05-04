tags:: CG/lec5 , CG

- # Spatial Transformations Quiz - Part 1
- #card [QF1] [FLOW] [00:00] The lecture lists many uses of spatial transformations in graphics: positioning objects, moving the camera, animating, projecting to 2D, mapping textures, casting shadows. What single mathematical property makes one framework cover all of these?
	- ANSWER: Linearity — and its consequence, composability. Each stage of the graphics pipeline is a linear map (a matrix), so the entire pipeline from model space to screen space is also a linear map (the product of all matrices). An entire sequence of transforms — model→world→camera→clip→NDC→screen — can be pre-multiplied into a single matrix applied once per vertex. This is why transformations are everywhere in graphics: any stage that can be expressed as a matrix gets this "bake everything together" efficiency for free.
	- INTUITION: Composing linear transforms = multiplying matrices. One multiplication instead of N sequential operations per vertex.

- #card [QF2] [FLOW] [00:00] The lecture derives the 2D rotation matrix from first principles (where do basis vectors land?) rather than just stating the formula. Why is this derivation approach important beyond just getting the formula?
	- ANSWER: The derivation reveals the general principle: any linear map is fully determined by where it sends the basis vectors. The columns of a matrix are exactly the images of the input basis vectors. This means: to build any linear transform from scratch, ask "where does e₁ go? where does e₂ go?" and read off the matrix columns. This technique works for reflections, scaling, shearing, and all composed transforms — and generalizes to 3D and non-standard bases.
	- INTUITION: A linear map has no memory, so knowing where the basis goes determines everything. The formula is just a side effect of that principle.

- #card [QF3] [ORDER] [00:00] Put these transformation topics in the order lecture 5 introduces them: affine transformations and homogeneous coordinates / 3D rotation matrices / 2D rotation matrix derivation from first principles / scaling, reflection, and shear
	- ANSWER: 2D rotation matrix derivation → Scaling, reflection, and shear → 3D rotation matrices → Affine transformations and homogeneous coordinates
	- INTUITION: Build from the simplest case (2D rotation) → generalize within 2D → extend to 3D → add translation via homogeneous trick.

- #card [Q1] [00:00] - [Introduction] → [Course context and transformation overview]
  collapsed:: true
  What is the fundamental definition of a spatial transformation according to Prof. Crane?
  A) A function that modifies the color of objects
  B) A function that assigns a new location to each point
  C) A function that preserves the distance between every pair of points
  D) A function that maps 3D objects to 2D images
	- ANSWER: B
	- EXPLANATION: As stated at [0:19]: "When we talk about a spatial transformation what we really mean is basically any function that assigns a new location to each point so we could think of that for instance as a function f that takes points in rn to points in rn."
	  ![image.png](../assets/image_1771298936879_0.png)
	- ![image.png](../assets/image_1771298965374_0.png)
	- ![image.png](../assets/image_1771298994477_0.png) #rasterization #Pipeline we need to position it  before we go to the rest of the pipeline .
- #card [Q2] [01:47] - [Linear Maps] → [Definition and mathematical properties]
  collapsed:: true
  Which two properties geometrically define a linear map?
  A) Preserves angles and areas
  B) Maps lines to lines and preserves the origin
  C) Preserves the distance between all points
  D) Maps circles to ellipses and preserves volume
  ==Also note the algebraic defintiion.== #Geometry #Algebra
	- ANSWER: B
	- EXPLANATION: As defined at [1:59]: "==Geometrically== a linear map is one that maps lines to lines so every line becomes a new line and also preserves the origin that's very important the origin remains fixed." 
	  ![image.png](../assets/image_1771299073294_0.png)
- #card [Q3] [03:19] - [Linear Transformations in Graphics] → [Importance and advantages]
  collapsed:: true
  Why are linear transformations particularly useful in graphics pipelines?
  A) They're the only transformations that can be represented as matrices
  B) They always preserve the appearance of objects
  C) Their composition is also linear, allowing multiple transformations to be combined into a single matrix
  D) They require less memory than other transformations #Representation
	- ANSWER: C
	- EXPLANATION: As explained at [3:19]: "A big reason why linear transformations are used in a graphics pipeline is that the composition of linear transformations is linear... if i have a bunch of different matrices each of which represents a linear transformation then i can just multiply them all together to bake all of those different transformations into a single transformation matrix." #composition
	  ![image.png](../assets/image_1771299154167_0.png)
- #card [Q4] [04:14] - [Types of Transformations] → [Visual identification exercise]
  collapsed:: true
  What characteristic allows us to visually recognize different transformation types without seeing their mathematical formulas?
  A) The speed at which they're applied
  B) The color changes they produce
  C) The invariants they preserve
  D) The starting shape they're applied to
	- ANSWER: C
	- EXPLANATION: As Professor Crane explains at [5:33]: "Transformations at their core are not defined by formulas or matrix properties or anything like that but each type of transformation is really determined by the invariance it preserves."
	  ![image.png](../assets/image_1771299302158_0.png)
	  ![image.png](../assets/image_1771299285236_0.png) #invariant
- #card [Q5] [05:27] - [Invariants of Transformation] → [Defining characteristics]
  collapsed:: true
  What does a translation transformation preserve according to the lecture?
  A) The origin
  B) The differences between any two pairs of points
  C) The length of all vectors
  D) The angles between lines
	- ANSWER: B
	- EXPLANATION: As mentioned at [6:11]: "Likewise we could say a translation is a transformation that preserves the differences between any two pair of points."
	  ![image.png](../assets/image_1771299371552_0.png)
- #card [Q6] [06:42] - [Rotations] → [Defining properties and characteristics]
  collapsed:: true
  What three properties define a rotation?
  A) Preserves the origin, preserves distances, and preserves orientation
  B) Preserves angles, preserves areas, and preserves the origin
  C) Maps straight lines to straight lines, preserves parallelism, and preserves the origin
  D) Preserves volumes, preserves connectivity, and preserves symmetry
	- ANSWER: A
	- EXPLANATION: As listed at [6:49]: "Rotations fundamentally are defined by just three basic properties. First they keep the origin fixed... A rotation will also preserve distances... And finally very important a rotation also preserves orientation."
	  ![image.png](../assets/image_1771299460515_0.png)
- #card [Q7] [08:06] - [2D Rotations—Matrix Representation] → [Mathematical derivation]
  collapsed:: true
  What happens to a unit vector (1,0) when rotated counterclockwise by angle θ?
  A) It becomes (cos θ, sin θ)
  B) It becomes (sin θ, cos θ)
  C) It becomes (-sin θ, cos θ)
  D) It becomes (cos θ, -sin θ)
	- ANSWER: A
	- EXPLANATION: As stated at [9:20]: "Hopefully you remember that if i go an angle theta around the circle i get to cosine theta sine theta."
	  ![image.png](../assets/image_1771299798491_0.png) 
	  instead of thinking cos and sine as this osciliatary functions , its better to think of them as x and y of circles. #Fourier
- #card [Q8] [11:39] - [General 2D Rotation] → [Extending to arbitrary vectors]
  collapsed:: true
  What is the correct 2×2 matrix for a counterclockwise rotation by angle θ?
  A) [[cos θ, -sin θ], [sin θ, cos θ]]
  B) [[cos θ, sin θ], [-sin θ, cos θ]]
  C) [[sin θ, cos θ], [-cos θ, sin θ]]
  D) [[cos θ, sin θ], [sin θ, -cos θ]]
	- ANSWER: A
	- EXPLANATION: As given at [13:09]: "So i can write a 2d rotation as a matrix cosine theta minus sine theta sine theta cosine theta."
	   #DotProduct is zero
	  ![image.png](../assets/image_1771300035675_0.png)
- #card [Q9] [13:28] - [3D Rotations] → [Extending to three dimensions]
  collapsed:: true
  How do you construct a 3D rotation matrix for rotation around the z-axis?
  A) By placing the 2D rotation in the upper-left 2×2 corner and adding 0,0,1 for the z-axis
  B) By creating a completely new 3×3 matrix with different formulas
  C) By applying three separate rotations around each axis
  D) By using quaternions instead of matrices
	- ANSWER: A
	- EXPLANATION: As explained at [14:10]: "The key idea is that to rotate around an axis i want to keep that axis fixed... so we're just going to apply the same transformation of x1 and x2 that we did in two dimensions and keep x3 fixed."
	  ![image.png](../assets/image_1771300344268_0.png)
- #card [Q10] [15:04] - [Rotations—Transpose as Inverse] → [Key matrix property]
  What important property relates a rotation matrix R to its transpose R^T?
  A) R^T = -R
  B) R^T × R = I (identity matrix)
  C) R^T = R
  D) R^T = det(R) × R
	- ANSWER: B
	- EXPLANATION: As stated at [16:55]: "R transpose r is equal to the identity or equivalently our transpose is our inverse."
- #card [Q11] [17:09] - [Orthogonal Transformations] → [Rotations vs. reflections]
  How can you distinguish between a rotation matrix and a reflection matrix?
  A) Rotation matrices have larger determinants than reflection matrices
  B) Rotation matrices have determinant +1, reflection matrices have determinant -1
  C) Rotation matrices are symmetric, reflection matrices are not
  D) Rotation matrices are diagonal, reflection matrices are not
	- ANSWER: B
	- EXPLANATION: As explained at [19:19]: "Rotations additionally preserve orientation so we can say that the determinant of the matrix is positive and reflections reverse orientation so the determinant is negative."
- #card [Q12] [19:35] - [Scaling] → [Definition and properties]
  What invariant does scaling preserve?
  A) The length of vectors
  B) The direction of all vectors
  C) The distance between points
  D) The angle between vectors
	- ANSWER: B
	- EXPLANATION: As stated at [20:01]: "What is the basic invariant of scaling well it preserves the direction of all vectors."
- #card [Q13] [22:06] - [Scaling - Matrix Representation] → [Mathematical form]
  What is the matrix representation of a uniform scaling by factor a in 3D?
  A) [[a, 0, 0], [0, a, 0], [0, 0, a]]
  B) [[a, 0, 0], [0, 1, 0], [0, 0, 1]]
  C) [[1, 0, 0], [0, a, 0], [0, 0, a]]
  D) [[a, a, a], [0, 0, 0], [0, 0, 0]]
	- ANSWER: A
	- EXPLANATION: As described at [22:21]: "It's pretty straightforward we can just build a diagonal matrix d with the number a all along the diagonal."
- #card [Q14] [23:21] - [Negative Scaling] → [Dimensionality effects]
  What happens when you apply a negative scaling (factor -1) to all coordinates in 2D versus 3D?
  A) It's a reflection in both 2D and 3D
  B) It's a rotation in both 2D and 3D
  C) It's a rotation in 2D but a reflection in 3D
  D) It's a reflection in 2D but a rotation in 3D
	- ANSWER: C
	- EXPLANATION: As explained at [25:18]: "This is a little bit surprising and counter-intuitive when you first start working with two and three-dimensional vectors that just negating the vector is a rotation in even dimensions and a reflection in odd dimensions."
- #card [Q15] [25:42] - [Nonuniform Scaling (Axis-Aligned)] → [Different scaling factors]
  How do you represent a non-uniform scaling that scales x by a, y by b, and z by c?
  A) [[a, 0, 0], [0, b, 0], [0, 0, c]]
  B) [[a, b, c], [0, 0, 0], [0, 0, 0]]
  C) [[a, 0, 0], [0, 0, 0], [0, 0, 0]] + [[0, 0, 0], [0, b, 0], [0, 0, 0]] + [[0, 0, 0], [0, 0, 0], [0, 0, c]]
  D) [a, b, c]
	- ANSWER: A
	- EXPLANATION: As stated at [26:06]: "What's the matrix representation of this operation well what we're going to do is just go ahead and put a b and c on the diagonal."
- #card [Q16] [26:27] - [Nonuniform Scaling (Arbitrary Axes)] → [Rotation-based approach]
  How would you scale an object along non-standard axes?
  A) Apply a shear first, then scale, then apply the inverse shear
  B) Rotate to the desired axes, apply scaling, then rotate back
  C) Apply the scaling directly using a specialized non-diagonal matrix
  D) Convert to polar coordinates, scale, then convert back
	- ANSWER: B
	- EXPLANATION: As described at [26:38]: "Let's first rotate to the new axes to the new coordinate system where we want to do the stretching then apply a diagonal scaling like we just did and then rotate back to the original axes the original coordinate system."
- # Spatial Transformations Quiz - Part 2
- #card [Q17] [28:28] - [Spectral Theorem] → [Symmetric matrices as scaling operations]
  According to the spectral theorem, what does every symmetric matrix represent geometrically?
  A) A rotation around some axis
  B) A non-uniform scaling along some set of orthogonal axes
  C) A combination of rotation and translation
  D) A shear in some arbitrary direction
	- ANSWER: B
	- EXPLANATION: As explained at [29:51]: "In other words every symmetric matrix indeed performs a non-uniform scaling along some set of orthogonal axes this is really nice because it gives us a geometric interpretation to symmetric matrices."
- #card [Q18] [30:40] - [Shear] → [Definition and representation]
  How is a shear transformation defined in the lecture?
  A) It displaces points proportionally to their distance from the origin
  B) It displaces each point in direction u proportional to its distance along direction v
  C) It maps parallel lines to parallel lines while preserving areas
  D) It rotates different parts of space by different amounts
	- ANSWER: B
	- EXPLANATION: As defined at [30:46]: "A shear is going to displace each point x in some given direction u and the amount by which it's going to displace it is equal to its distance the distance of x along a fixed vector v."
- #card [Q19] [32:21] - [Shear Example] → [Time-varying displacement]
  What is the matrix representation of a shear transformation?
  A) I + uv^T
  B) uu^T
  C) I * (u·v)
  D) uv
	- ANSWER: A
	- EXPLANATION: As given at [31:33]: "We can represent it as a matrix which is i plus u v transpose."
- #card [Q20] [33:13] - [Composite Transformations] → [Combining basic operations]
  When multiplying transformation matrices together, in what order are the transformations applied to a point?
  A) Left to right
  B) Right to left
  C) Top to bottom
  D) In order of increasing determinant
	- ANSWER: B
	- EXPLANATION: As stated at [33:50]: "By the way something to always remember is the last matrix gets applied first right because we're going to take the matrix on the left and hit the vector on the right."
- #card [Q21] [34:38] - [Decomposition of Linear Transformations] → [Breaking into simpler parts]
  Is there a unique way to decompose a linear transformation into basic transformations?
  A) Yes, there is exactly one way to decompose any transformation
  B) No, there are many different ways to decompose a given transformation
  C) Yes, but only for rotation and scaling transformations
  D) No, only for shear transformations
	- ANSWER: B
	- EXPLANATION: As stated at [34:38]: "In general there is no unique way to write a given linear transformation as a composition of basic transformations." The lecturer gives the example that a 90° rotation could be composed of two 45° rotations or ninety 1° rotations.
- #card [Q22] [36:27] - [Polar & Singular Value Decomposition] → [Matrix factorizations]
  What is the polar decomposition of a matrix A?
  A) A = UDV^T where U and V are orthogonal and D is diagonal
  B) A = LU where L is lower triangular and U is upper triangular
  C) A = QP where Q is orthogonal and P is symmetric positive semi-definite
  D) A = QR where Q is orthogonal and R is upper triangular
	- ANSWER: C
	- EXPLANATION: As defined at [36:27]: "One really nice decomposition is the so-called polar decomposition which writes any matrix a as an orthogonal matrix q and a symmetric positive semi-definite matrix p so i can write a is equal to q times p."
- #card [Q23] [39:42] - [Interpolating Transformations—Linear] → [Basic interpolation approach]
  What problem arises when linearly interpolating between two transformation matrices?
  A) The determinant changes unpredictably
  B) It produces unintuitive, distorted intermediate transformations
  C) It requires too much computation
  D) It only works for rotation matrices
	- ANSWER: B
	- EXPLANATION: As demonstrated at [41:02]: "The good news is we did hit the start and end points right we started with the transformation we wanted and ended with the other transformation we wanted but it looks awful in between this is really not giving us good animation."
- #card [Q24] [41:21] - [Interpolating Transformations—Polar] → [Improved approach]
  What improved approach does the lecture suggest for interpolating between transformations?
  A) Use quaternions instead of matrices
  B) Separately interpolate the components of a polar decomposition
  C) Use spherical linear interpolation (SLERP)
  D) Apply the transformations sequentially instead of interpolating
	- ANSWER: B
	- EXPLANATION: As explained at [41:21]: "Let's consider for instance our polar decomposition and then separately interpolate these different components."
- #card [Q25] [43:39] - [Example: Linear Blend Skinning] → [Character animation application]
  What artifact can occur when naively interpolating transformations in character animation?
  A) Candy wrapper artifact
  B) Gimbal lock
  C) Texture stretching
  D) Z-fighting
	- ANSWER: A
	- EXPLANATION: As mentioned at [43:45]: "If i do a naive interpolation of transformations let's say along the arm of such a character i can get some pretty nasty artifacts here something called the candy wrapper artifact where the interpolated transformation in the middle shrinks everything to zero."
- #card [Q26] [44:35] - [Translations] → [Non-linear transformation]
  Why is translation not a linear transformation?
  A) It cannot be represented as a matrix
  B) It does not preserve the origin
  C) It cannot be applied multiple times
  D) It distorts shapes too much
	- ANSWER: B
	- EXPLANATION: As stated at [46:35]: "Another way we can see this is to just notice that the origin is not preserved by translation the translation is going to move the origin to the point u."
- #card [Q27] [46:46] - [Composition Challenges] → [Mixing transformation types]
  What challenge arises when trying to compose linear transformations with translations?
  A) They cannot be composed at all
  B) They require a more complex representation than just matrices and vectors
  C) They require converting to a different coordinate system first
  D) They lose precision when combined
	- ANSWER: B
	- EXPLANATION: As explained at [47:25]: "We might say okay we could keep track of a matrix and a vector and that might work but we're going to see later on that this encoding of just working with a matrix and a vector isn't going to work out so well for other important cases like prospective transformations."
- #card [Q28] [48:07] - [Homogeneous Coordinates] → [Introduction and origins]
  Where did homogeneous coordinates originate from?
  A) Computer graphics research in the 1970s
  B) Linear algebra studies in the 20th century
  C) Studying perspective in drawing and painting
  D) 3D modeling software development
	- ANSWER: C
	- EXPLANATION: As explained at [48:07]: "Homogeneous coordinates came from the efforts of people to study really study perspective to study perspective in drawing and painting and the homogeneous coordinates themselves were introduced by a mathematician named mobius as a way of assigning coordinates to lines."
- #card [Q29] [49:20] - [Homogeneous Coordinates—Basic Idea] → [Geometric intuition]
  What is the basic idea behind homogeneous coordinates?
  A) Using four coordinates instead of three to represent 3D points
  B) Any point along a line through the origin can represent the same projected point
  C) Converting between different coordinate systems more easily
  D) Representing points at infinity with finite coordinates
	- ANSWER: B
	- EXPLANATION: As described at [50:06]: "The basic basic idea of homogeneous coordinates is that any point p hat along this line can be used to represent the point p."
- #card [Q30] [50:38] - [Review: Perspective projection] → [Connection to homogeneous coordinates]
  How does perspective projection relate to homogeneous coordinates?
  A) They are unrelated concepts from different fields
  B) Both involve converting between different coordinate systems
  C) Both use the idea that points along the same line project to the same point
  D) Both were developed at the same time for computer graphics
	- ANSWER: C
	- EXPLANATION: As explained at [50:38]: "Hopefully the story is reminding you a little bit of our pinhole camera right we said if we have this pinhole camera looking out at the world through this little hole then objects along the same line through space all project to the same point on the film at the back of the camera."
- #card [Q31] [51:16] - [Homogeneous Coordinates (2D)] → [Mathematical formulation]
  How are 2D points represented using homogeneous coordinates?
  A) By adding a third coordinate that is always 1
  B) By any three numbers (a,b,c) where a/c and b/c give the original 2D coordinates
  C) By converting to polar coordinates (r,θ)
  D) By multiplying both coordinates by a constant
	- ANSWER: B
	- EXPLANATION: As defined at [51:30]: "Any three numbers p hat equals abc such that a divided by c and b divided by c are the same as x and y give us homogeneous coordinates for p."
- #card [Q32] [52:53] - [Translation in Homogeneous Coordinates] → [Making translation linear]
  What 3D transformation corresponds to a 2D translation when using homogeneous coordinates?
  A) 3D rotation
  B) 3D scaling
  C) 3D shear
  D) 3D reflection
	- ANSWER: C
	- EXPLANATION: As described at [53:41]: "Hopefully this reminds you of some three-dimensional transformation that we've already seen if you look at the movie on the right what kind of transformation does that look like well hopefully it reminds you of a shear we're taking this kind of cone made by the triangle and we're shearing it across the xy plane."
- # Spatial Transformations Quiz - Part 3
- #card [Q33] [54:38] - [Translation Verification] → [Mathematical confirmation]
  If (x,y) is translated by (u,v) using homogeneous coordinates, what happens to the homogeneous coordinate representation (cx,cy,c)?
  A) It becomes (cx+cu,cy+cv,c)
  B) It becomes (cx,cy,c+1)
  C) It becomes (cx+c,cy+c,c)
  D) It becomes (cx+u,cy+v,c)
	- ANSWER: A
	- EXPLANATION: As shown at [54:47]: "The homogeneous coordinates p hat from our original point cp1 cp2c then become cp1 plus cu1 cp2 plus cu2 c right for all nonzero c."
- #card [Q34] [55:50] - [Homogeneous Translation—Matrix Representation] → [Matrix form]
  What is the 3×3 matrix for a 2D translation by (u₁,u₂) using homogeneous coordinates?
  A) [[1, 0, u₁], [0, 1, u₂], [0, 0, 1]]
  B) [[1, 0, 0], [0, 1, 0], [u₁, u₂, 1]]
  C) [[u₁, 0, 0], [0, u₂, 0], [0, 0, 1]]
  D) [[1, 0, 0], [0, 1, 0], [0, 0, 1]] + [[0, 0, u₁], [0, 0, u₂], [0, 0, 0]]
	- ANSWER: A
	- EXPLANATION: As described at [56:30]: "So we're going to end up with a matrix that looks like this it looks like well the identity matrix plus some stuff in the upper right which is our displacement vector u1 u2." This corresponds to the matrix [[1, 0, u₁], [0, 1, u₂], [0, 0, 1]].
- #card [Q35] [57:22] - [Other Transformations] → [Converting all transformations to homogeneous]
  How is a 2D rotation represented in homogeneous coordinates?
  A) As a 3D rotation around the origin
  B) As a 3D rotation that fixes the z-axis
  C) As a 2×2 rotation with an added row and column of zeros
  D) As a completely different type of transformation
	- ANSWER: B
	- EXPLANATION: As stated at [57:57]: "So performing a two-dimensional rotation of our original shape is going to be equivalent to rotating that whole collection of shapes around the x3 axis and so we can express a 2d rotation as just a 3d rotation that fixes the vertical axis."
- #card [Q36] [59:09] - [3D Transformations in Homogeneous Coordinates] → [Extension to 3D]
  How are 3D transformations represented in homogeneous coordinates?
  A) By adding new transformation types specific to 3D
  B) By converting to quaternions for all 3D operations
  C) By appending one homogeneous coordinate to the 3D coordinates
  D) By using complex matrices instead of real matrices
	- ANSWER: C
	- EXPLANATION: As explained at [59:09]: "Not much changes in three dimensions or even in more dimensions we're always just going to append one homogeneous coordinate to the first three to the first n."
- #card [Q37] [1:00:15] - [Points vs. Vectors] → [Homogeneous coordinate choice]
  How are points and vectors distinguished in homogeneous coordinates?
  A) Points use integer coordinates, vectors use fractional coordinates
  B) Points have positive homogeneous coordinate, vectors have negative
  C) Points have non-zero homogeneous coordinate, vectors have zero
  D) Points use Cartesian coordinates, vectors use polar coordinates
	- ANSWER: C
	- EXPLANATION: As stated at [1:03:01]: "In general a point will have a non-zero homogeneous coordinate for instance c equal to one and a vector will have a zero homogeneous coordinate for instance c equal to zero."
- #card [Q38] [1:03:08] - [Infinity Interpretation] → [Zero homogeneous coordinates]
  What happens as the homogeneous coordinate c approaches zero?
  A) The point moves toward the origin
  B) The point approaches infinity in the direction of the other coordinates
  C) The point becomes undefined
  D) The point's coordinates become unstable
	- ANSWER: B
	- EXPLANATION: As explained at [1:03:33]: "If we divide by a much much smaller number then they start shooting off toward infinity right and kind of the limit is that these vectors become points at infinity or what are sometimes called ideal points."
- #card [Q39] [1:04:42] - [Perspective Projection] → [Using homogeneous coordinates]
  How is perspective projection implemented using homogeneous coordinates?
  A) By setting the homogeneous coordinate to 1
  B) By copying the z-coordinate into the homogeneous coordinate
  C) By zeroing out the z-coordinate
  D) By multiplying all coordinates by the z value
	- ANSWER: B
	- EXPLANATION: As described at [1:05:27]: "We can build a matrix that just copies the z coordinate into the homogeneous coordinates something like this."
- #card [Q40] [1:06:20] - [Rasterization Pipeline] → [Transforming to screen coordinates]
  What final transformation is needed after perspective projection to display an image on screen?
  A) Converting to polar coordinates
  B) Converting projected coordinates to pixel coordinates, including y-axis flip
  C) Normalizing all coordinates to the range [0,1]
  D) Applying gamma correction to the coordinates
	- ANSWER: B
	- EXPLANATION: As explained at [1:07:19]: "You should be careful by the way that in one coordinate system y points up and in another coordinate system y points down... in computer graphics images are often indexed in a way where you start at the top left and go down as y increases." This means converting to pixel coordinates includes a y-axis flip.
- #card [Q41] [1:08:12] - [Scene Graph] → [Organizing hierarchical transformations]
  What is the primary benefit of using a scene graph?
  A) It reduces the number of transformations needed
  B) It allows transformations on parent objects to automatically affect their children
  C) It makes rendering faster
  D) It ensures all transformations are linear
	- ANSWER: B
	- EXPLANATION: As explained at [1:09:21]: "The good thing about this is now if we go back and we transform the body right we want to just move the body left and right well then the upper arm and lower arm are going to go along with it we don't have to go and figure out what the new transformations for those parts of the body are."
- #card [Q42] [1:09:34] - [Scene Graph Implementation] → [Structure and operation]
  What information does each edge in a scene graph store?
  A) The geometric mesh data
  B) A linear transformation as a matrix
  C) The rendering properties like materials
  D) Collision detection information
	- ANSWER: B
	- EXPLANATION: As stated at [1:09:34]: "A scene graph in general stores relative transformations in a directed graph right so each edge of this graph and the root node stores some linear transformation as a four by four matrix."
- #card [Q43] [1:11:32] - [Scene Graph Content] → [Models, lights, and instancing]
  What does instancing in a scene graph allow for?
  A) Creating animated transformations
  B) Adding lighting effects to objects
  C) Efficiently representing many copies of the same object with different transformations
  D) Reducing the complexity of individual objects
	- ANSWER: C
	- EXPLANATION: As explained at [1:11:54]: "Rather than actually having literally multiple copies of the geometry in memory in your in your computer what you can do is you can just put a pointer in the scene graph that says okay i want to draw a copy of this object but i'm going to do it with a different transformation than i did before."
- #card [Q44] [1:13:02] - [Order of Operations] → [Transformation sequence importance]
  What happens when you change the order of scaling and translation operations?
  A) Nothing, they commute with each other
  B) The final position changes because the translation gets scaled in one case
  C) Only the orientation changes
  D) The scale factor is affected but not the position
	- ANSWER: B
	- EXPLANATION: As demonstrated at [1:13:20]: "If i first scale it by a half and then translate it by 3 1 i end up with a square that's size 1 on each side and has its lower left corner at the point 3 1. if on the other hand i reverse these operations and i first translate by 3 1 and then scale by one half well i get a square that has the same size it's still size 1 on each side but the lower left corner is now at 1.5 0.5." The lecturer explains at [1:13:53]: "By putting the scale second i kind of scaled my initial translation down."
- #card [Q45] [1:14:49] - [Rotation Around Center] → [Common transformation pattern]
  What is the correct sequence of operations to rotate an object around a center point x that is not the origin?
  A) Rotate directly using a specialized matrix
  B) Translate to origin, rotate, translate back
  C) Scale by half, rotate, scale by two
  D) Apply shear, rotate, apply inverse shear
	- ANSWER: B
	- EXPLANATION: As described at [1:15:16]: "What i'm going to do is i'm going to first translate it by minus x so that it's centered at the origin then i'm going to rotate by some angle theta and then i'm going to put it back i'm going to translate back by x to its original center."
- #card [Q46] [1:15:52] - [Putting It All Together] → [Complete transformation pipeline]
  How is camera movement typically simulated in computer graphics?
  A) By directly moving the camera through the scene
  B) By applying the inverse transformation to the objects in the scene
  C) By changing the field of view of the camera
  D) By modifying the perspective projection matrix
	- ANSWER: B
	- EXPLANATION: As explained at [1:16:16]: "We're going to apply additional 3d transformations to position our camera actually what we're going to do is we're going to simulate the motion of the camera by applying the inverse transformation to the cube creature if we want the camera to move left we translate the creature right and so forth."
- #card [Q47] [1:17:33] - [Summary] → [Key concepts review]
  What is the main advantage of using homogeneous coordinates according to the lecture summary?
  A) They make all calculations faster
  B) They allow clearly distinguishing between points and vectors
  C) They simplify the implementation of perspective projection
  D) They reduce the memory needed for transformations
	- ANSWER: B
	- EXPLANATION: As summarized at [1:18:01]: "We also saw that homogeneous coordinates are super cool and useful because they let us clearly distinguish between points and vectors."
	-
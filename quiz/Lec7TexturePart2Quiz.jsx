'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Image } from 'lucide-react'

// Source: lectures/cg-07-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 7: Texture Mapping — Part 2 · QQ30–QQ61 · 32 questions (32 MCQ, 0 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-07-lecture-quiz.md 7

const quizData = [
  {
    id: 30,
    qid: `Q30`,
    qtype: `APPROACH`,
    format: `mcq`,
    timestamp: `22:36`,
    question: `When solving the matrix equation for the view frustum transformation, what unusual aspect does the lecturer point out?`,
    options: [`The matrix must be inverted first`, `We're solving for the matrix entries, not the vector`, `The determinant must be calculated differently`, `The matrix is always singular`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [22:36], the lecturer explains: "In this case I'm not solving for x. Normally with a matrix equation Ax = y you solve for x. In this case I'm actually solving for the unknown entries of the matrix A."`,
    code: ``,
    images: ["image_1777878799982_0.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 31,
    qid: `Q31`,
    qtype: `COMPONENTS`,
    format: `mcq`,
    timestamp: `23:42`,
    question: `What are the two main components of the orthographic projection matrix?`,
    options: [`Shearing and scaling`, `Scaling and translation`, `Translation and rotation`, `Reflection and rotation`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [23:42], the lecturer states: "We can break it up into kind of two pieces. One is that it applies a non-uniform scale to turn our original box into a box of size two, and then in the upper right we have this translation."`,
    code: ``,
    images: ["image_1777878859438_0.png"],
    tags: ["Scaling", "translation"],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 32,
    qid: `Q32`,
    qtype: `HOMOGENEOUS`,
    format: `mcq`,
    timestamp: `23:58`,
    question: `What benefit do homogeneous coordinates provide for spatial transformations?`,
    options: [`They simplify perspective division`, `They use less memory`, `They make rotation matrices orthogonal`, `They allow expressing translations as linear transformations`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [23:58], the lecturer explains: "That was the whole idea behind using homogeneous coordinates for spatial transformations, is that we can express translations as linear transformations in homogeneous coordinates."

- our full perspective matrix takes geometry of view frustum into account.`,
    code: ``,
    images: ["image_1777878891870_0.png"],
    tags: ["Homogeneous", "disclaimer"],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 33,
    qid: `Q33`,
    qtype: `PERSPECTIVE`,
    format: `mcq`,
    timestamp: `25:22`,
    question: `How is perspective division implemented in a perspective projection matrix?`,
    options: [`By copying z into the homogeneous coordinate`, `By setting the determinant to zero`, `By adding a row of ones at the bottom`, `By using quaternions`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [25:22], the lecturer states: "If in the end I want to divide by z, then I'm going to construct a matrix that copies z into the homogeneous coordinate."`,
    code: ``,
    images: ["image_1777878941002_0.png"],
    tags: ["Homogeneous"],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 34,
    qid: `Q34`,
    qtype: `RESULT`,
    format: `mcq`,
    timestamp: `25:47`,
    question: `After applying the perspective projection matrix and homogeneous divide, what happens to the coordinates (x,y,z,w)?`,
    options: [`They become (x/z,y/z,1,1)`, `They become (x,y,0,w)`, `They become (x,y,z,1)`, `They become (x/w,y/w,z/w,1)`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [25:47], the lecturer states: "When we go to turn our vector (x,y,z,w) into the final vector by dividing, we just get (x/z, y/z, 1, 1)."`,
    code: ``,
    images: ["image_1777878985726_0.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 35,
    qid: `Q35`,
    qtype: `COORDINATES`,
    format: `mcq`,
    timestamp: `27:00`,
    question: `After projection, what is the range of normalized device coordinates?`,
    options: [`-1 to 1 in x and y`, `0 to width/height in x and y`, `-10 to 10 in x and y`, `0 to 1 in x and y`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [27:00], the lecturer explains: "Our projection from 3D to 2D will always give us points in the square from minus one to one sitting on the z equals one plane."`,
    code: ``,
    images: ["image_1777879005679_0.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 36,
    qid: `Q36`,
    qtype: `DIFFERENCE`,
    format: `mcq`,
    timestamp: `27:29`,
    question: `What key difference must be addressed when converting from mathematical to image coordinates?`,
    options: [`Mathematical coordinates are always positive while image coordinates can be negative`, `Mathematical coordinates use radians while image coordinates use degrees`, `Mathematical coordinates use floating point while image coordinates use integers`, `Mathematical coordinates have y pointing up while image coordinates have y pointing down`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [27:29], the lecturer states: "In mathematics usually x points to the right and y points up. In image coordinate systems, for historical reasons, x points to the right and y points down."`,
    code: ``,
    images: ["image_1777879036856_0.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 37,
    qid: `Q37`,
    qtype: `SEQUENCE`,
    format: `mcq`,
    timestamp: `28:35`,
    question: `What is the correct sequence of coordinate transformations in the rasterization pipeline?`,
    options: [`World → View → Screen → Clip`, `View → World → Clip → Screen`, `World → View → Clip → Screen`, `World → Clip → View → Screen`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [28:46-30:19], the lecturer explains the complete pipeline: from world coordinates, to view coordinates (via the inverse camera transform), to clip coordinates (mapping to a standard cube), and finally to screen coordinates.`,
    code: ``,
    images: ["image_1777879135721_0.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 38,
    qid: `Q38`,
    qtype: `BENEFIT`,
    format: `mcq`,
    timestamp: `29:32`,
    question: `What are the two benefits of clip coordinates according to the lecture?`,
    options: [`They improve performance and image quality`, `They make it easy to toss out primitives and they encode the projection type`, `They simplify rotation and lighting calculations`, `They save memory and processing time`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [29:32-29:58], the lecturer explains that clip coordinates make it easy to toss out primitives we don't want to see, and they also encode the type of projection we're going to see (perspective or orthogonal).`,
    code: ``,
    images: ["image_1777879154543_0.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 39,
    qid: `Q39`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `30:52`,
    question: `In the context of drawing primitives, what is a basic test to determine if a point is inside a triangle?`,
    options: [`Angle measurement`, `Texture coordinate check`, `Distance from point to triangle centroid`, `Half-plane tests`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [30:52], the lecturer mentions: "We do a few half plane tests, pretty straightforward, but this doesn't give us very interesting triangles."`,
    code: ``,
    images: ["image_1777879186478_0.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 40,
    qid: `Q40`,
    qtype: `PURPOSE`,
    format: `mcq`,
    timestamp: `31:24`,
    question: `What is the purpose of interpolation in the context of triangle rendering?`,
    options: [`To blend attribute values across the triangle interior`, `To reduce the number of vertices`, `To implement anti-aliasing`, `To make triangles render faster`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [31:24], the lecturer explains: "A standard strategy is to interpolate somehow the color values at vertices to get a smooth blend or smooth gradation of color or any other attribute that we might have stored at vertices."`,
    code: ``,
    images: ["image_1777879244352_0.png"],
    tags: ["Interpolation"],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 41,
    qid: `Q41`,
    qtype: `PARAMETER`,
    format: `mcq`,
    timestamp: `32:49`,
    question: `In 1D linear interpolation, what parameter is created to blend between sample points?`,
    options: [`A parameter that is 0 at the first point and 1 at the second point`, `A parameter that is the distance between sample points`, `A parameter based on the viewing angle`, `A parameter that represents the slope between points`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [32:49], the lecturer explains: "One way to do this is to cook up a parameter t that is zero when we're at x_i and one when we're at x_(i+1)."`,
    code: ``,
    images: ["image_1777879302571_0.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 42,
    qid: `Q42`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `34:35`,
    question: `What type of function is used to interpolate values across a triangle?`,
    options: [`Logarithmic`, `Quadratic`, `Affine (linear plus constant)`, `Exponential`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [34:35], the lecturer states: "What we want to do really is fit a linear or really affine function to these three values. Any such function has three unknown coefficients a, b, and c."`,
    code: ``,
    images: ["image_1777879329890_0.png"],
    tags: ["affine"],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 43,
    qid: `Q43`,
    qtype: `APPROACH`,
    format: `mcq`,
    timestamp: `36:43`,
    question: `How does the lecturer reframe 1D linear interpolation?`,
    options: [`As a system of differential equations`, `As a Taylor series expansion`, `As a matrix multiplication`, `As a combination of basis functions`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [36:43], the lecturer explains: "We can really think of this as a linear combination of two functions, of two sort of basis functions."`,
    code: ``,
    images: ["image_1777879496989_0.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 44,
    qid: `Q44`,
    qtype: `METHOD`,
    format: `mcq`,
    timestamp: `38:05`,
    question: `What is one way to construct basis functions for a triangle?`,
    options: [`Calculating the triangle's perimeter`, `Using the angle at each vertex`, `Using the triangle's area`, `Measuring distance from a point to each edge, divided by the height`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [38:05], the lecturer states: "One way is given a point x, we can measure the distance from x to each of the three edges and then divide those distances by the height of the triangle."`,
    code: ``,
    images: ["image_1777879550363_0.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 45,
    qid: `Q45`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `39:02`,
    question: `What happens to basis functions as you approach a vertex of the triangle?`,
    options: [`All basis functions go to zero`, `The basis function for that vertex approaches zero, others approach one`, `All basis functions go to one`, `The basis function for that vertex approaches one, others approach zero`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [39:27], the lecturer explains: "As we approach vertex i, two of the basis functions fade away and go to zero, one of the basis functions φ_i gets towards one, and we just recover the sample value at i."`,
    code: ``,
    images: ["image_1777879661784_0.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 46,
    qid: `Q46`,
    qtype: `ALTERNATIVE`,
    format: `mcq`,
    timestamp: `42:03`,
    question: `What alternative method for computing barycentric coordinates uses triangle areas?`,
    options: [`The product of the areas of all subtriangles`, `The difference between the overall triangle area and the subtriangle`, `The ratio of the areas of the whole triangle to a subtriangle`, `The ratio of the area of a subtriangle to the overall triangle`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [42:15], the lecturer explains: "We're going to define the basis function φ_i as just the ratio of the area of this little subtriangle (x, x_j, x_k) divided by the overall area (x_i, x_j, x_k)."`,
    code: ``,
    images: ["image_1777879642343_0.png"],
    tags: ["CG-Lecture-Question"],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 47,
    qid: `Q47`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `43:30`,
    question: `What are barycentric coordinates?`,
    options: [`The values of the three basis functions φ_i, φ_j, φ_k for a point x`, `The normalized coordinates of triangle vertices`, `The distances from a point to each triangle vertex`, `The angles formed at each vertex of a triangle`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [43:30], the lecturer defines: "No matter how you compute them, the values of the three functions φ_i, φ_j, φ_k for a given point x are called the barycentric coordinates of x."`,
    code: ``,
    images: ["image_1777879752322_0.png"],
    tags: ["definition"],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 48,
    qid: `Q48`,
    qtype: `CONNECTION`,
    format: `mcq`,
    timestamp: `44:09`,
    question: `How do barycentric coordinates relate to rasterization?`,
    options: [`They fall out of the half-plane tests already done in rasterization`, `They are only used for special effects in rasterization`, `They require extra computation that slows down rasterization`, `They make rasterization slower but more accurate`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [44:09], the lecturer states: "Importantly, these same three values conveniently enough fall out of the half plane tests that you're already doing for triangle rasterization."`,
    code: ``,
    images: ["image_1777879791424_0.png"],
    tags: ["Coordinate/barycenteric", "halfplane"],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 49,
    qid: `Q49`,
    qtype: `CHALLENGE`,
    format: `mcq`,
    timestamp: `45:41`,
    question: `What issue arises when interpolating values on 3D triangles using perspective projection?`,
    options: [`The colors become too saturated`, `Barycentric interpolation in screen coordinates is not the same as in 3D space`, `The calculations become too complex for real-time rendering`, `The triangles change their orientation`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [45:41], the lecturer explains: "Due to the fact that we're doing perspective projection, barycentric interpolation of values on a triangle with different depths is not an affine function of screen coordinates."`,
    code: ``,
    images: ["image_1777879995584_0.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 50,
    qid: `Q50`,
    qtype: `ARTIFACT`,
    format: `mcq`,
    timestamp: `47:11`,
    question: `What visual artifact appears when using incorrect interpolation on a projected quadrilateral?`,
    options: [`A derivative discontinuity (bend) appears in the mapped pattern`, `The quadrilateral disappears at certain angles`, `The quadrilateral becomes transparent`, `The quadrilateral has incorrect colors`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [47:35], the lecturer describes: "We wanted to map a checkerboard onto this quad, but because the rates of change are not quite right when we use the 2D coordinates rather than the 3D ones, we get this funky sort of bend in our checkerboard in this middle picture."`,
    code: ``,
    images: ["image_1777880031286_0.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 51,
    qid: `Q51`,
    qtype: `SOLUTION`,
    format: `mcq`,
    timestamp: `47:53`,
    question: `What technique corrects improper interpolation across triangles in 3D?`,
    options: [`Anisotropic filtering`, `Bilinear filtering`, `Z-buffer correction`, `Perspective-correct interpolation`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [47:53], the lecturer states: "So how do we correct this? Well we can do a perspective correct interpolation."`,
    code: ``,
    images: ["image_1777880068619_0.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 52,
    qid: `Q52`,
    qtype: `PROCESS`,
    format: `mcq`,
    timestamp: `48:05`,
    question: `What values need to be computed for perspective-correct interpolation?`,
    options: [`1/z (capital Z) and φ/z (capital P) at each vertex`, `The screen-space coordinates and depth`, `The triangle normal and viewing angle`, `The depth value z and the attribute φ`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [48:05], the lecturer explains: "The basic recipe is we're going to compute the depth value z at each vertex, we're going to evaluate 1/z (call that capital Z) and φ/z (call that capital P) at each vertex."`,
    code: ``,
    images: ["image_1777880087243_0.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 53,
    qid: `Q53`,
    qtype: `RECIPE`,
    format: `mcq`,
    timestamp: `48:37`,
    question: `What is the final step in perspective-correct interpolation?`,
    options: [`Add the interpolated Z to the interpolated P`, `Divide the interpolated attribute P by the interpolated Z`, `Multiply the interpolated attribute by the depth`, `Use the interpolated values directly`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [48:37], the lecturer states: "Finally to display the final result, we can divide the interpolated P by the interpolated Z and that gives us our final value."`,
    code: ``,
    images: ["image_1777880100265_0.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 54,
    qid: `Q54`,
    qtype: `ANALOGY`,
    format: `mcq`,
    timestamp: `49:19`,
    question: `What analogy does the lecturer use to explain texture mapping?`,
    options: [`Wrapping a gift`, `Painting a picture`, `Applying wallpaper`, `Decorating a cake`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [49:19], the lecturer states: "A really good analogy for texture mapping is wrapping a gift."`,
    code: ``,
    images: ["image_1777880126283_0.png"],
    tags: ["Analogy", "TextureMapping"],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 55,
    qid: `Q55`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `49:38`,
    question: `At its most basic, what is texture mapping?`,
    options: [`Projecting 3D objects onto a 2D screen`, `Creating textures with a painting program`, `Generating procedural textures for different materials`, `Having 2D images and finding ways to wrap them around 3D surfaces`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [49:38], the lecturer explains: "Essentially that's all texture mapping is. We're going to have two dimensional images and we want to find ways to wrap them around three-dimensional surfaces."`,
    code: ``,
    images: ["image_1777880163977_0.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 56,
    qid: `Q56`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `50:19`,
    question: `Besides color, what other surface property can be described using a texture map?`,
    options: [`Wetness/dryness`, `HTML content`, `Sound characteristics`, `Weight`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [50:19], the lecturer states: "We might have a texture map that describes where the surface is wet and where the surface is dry, and that wet versus dry attribute will subsequently affect how we shade the surface."`,
    code: ``,
    images: ["image_1777880251014_0.png"],
    tags: ["Application"],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 57,
    qid: `Q57`,
    qtype: `TECHNIQUE`,
    format: `mcq`,
    timestamp: `50:57`,
    question: `What technique uses textures to create the appearance of geometric detail without changing the actual geometry?`,
    options: [`Environment mapping`, `Ambient occlusion`, `Displacement mapping`, `Normal mapping`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [50:57], the lecturer explains: "One common technique is something called normal mapping where the texture isn't describing color at all, it's actually telling us how to perturb the normal of the surface so that when we go to shade it it looks like there's actually geometric detail that's not there."`,
    code: ``,
    images: ["image_1777880326948_0.png"],
    tags: ["Technique", "Mapping"],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 58,
    qid: `Q58`,
    qtype: `LIMITATION`,
    format: `mcq`,
    timestamp: `51:48`,
    question: `What are two limitations of normal mapping mentioned in the lecture?`,
    options: [`The implementation is complex and requires special hardware`, `The silhouette remains smooth and the shadow remains smooth`, `The colors are incorrect and the surface appears shiny`, `The texture resolution is limited and memory usage is high`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [51:48], the lecturer points out: "One is that the silhouette of the object is perfectly smooth even though it looks like it should be wrinkled and the other is that the shadow is perfectly smooth."`,
    code: ``,
    images: ["image_1777880338139_0.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 59,
    qid: `Q59`,
    qtype: `TECHNIQUE`,
    format: `mcq`,
    timestamp: `52:08`,
    question: `What technique actually modifies geometry based on texture values?`,
    options: [`Displacement mapping`, `Environment mapping`, `Normal mapping`, `Bump mapping`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [52:08], the lecturer states: "Displacement mapping is a technique that takes this idea all the way. We take that texture that's been wrapped around the surface and we use the values in that texture to actually displace or move the surface in different directions."`,
    code: ``,
    images: ["image_1777880350315_0.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 60,
    qid: `Q60`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `52:54`,
    question: `What does ambient occlusion represent in a scene?`,
    options: [`The view of the camera from each point`, `The amount of light directly hitting each point`, `The shadow patterns from specific light sources`, `The fraction of view that is sky versus surface at each point`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [52:54], the lecturer explains: "We can imagine if we're a little bug sitting at any point on the surface, the ambient occlusion tells us what fraction of our view is of the sky and what fraction is of the surface itself."`,
    code: ``,
    images: ["image_1777880408930_0.png"],
    tags: ["definition"],
    source: `lectures/cg-07-lecture-quiz.md`,
  },
  {
    id: 61,
    qid: `Q61`,
    qtype: `TECHNIQUE`,
    format: `mcq`,
    timestamp: `53:39`,
    question: `In environment mapping, what is used to determine the texture lookup direction?`,
    options: [`The camera direction`, `The reflected direction`, `The surface position`, `The surface normal`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [53:50], the lecturer states: "We're not using the position of the surface, something more like the reflected direction - which direction did light bounce and where does that land in our texture map."`,
    code: ``,
    images: ["image_1777883536580_0.png"],
    tags: [],
    source: `lectures/cg-07-lecture-quiz.md`,
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

export default function Lec7Part2Quiz() {
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
    accent: '#a3e635', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec7'
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
          <Image size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 7: Texture Mapping — Part 2</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>UV mapping, mipmaps, filtering, environment maps, bump mapping</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-07-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec7/1`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec7/2`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 2</a>
          <a key={3} href={`${BASE}/lec7/3`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 3</a>
          </div>
          <p style={{ color: C.accent, fontWeight: 600 }}>QQ30–QQ61 · 32 questions (32 graded + 0 open)</p>
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
          <Image size={20} /> Start Quiz
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
              <Image size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 7: Texture Mapping — Part 2</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-07-lecture-quiz.md.</p>
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
'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Database } from 'lucide-react'

// Source: lectures/cg-13-lecture-quiz.md.md  (symlinked → Logseq pages)
// Lecture 13: Spatial Data Structures — Part 1 · QQF1–QQ29 · 32 questions (29 MCQ, 3 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-13-lecture-quiz.md.md 13

const quizData = [
  {
    id: 1,
    qid: `QF1`,
    qtype: `FLOW`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `The lecture motivates all spatial data structures with a single problem. What is the "first hit" problem, and why does brute-force O(n) ray-triangle intersection not scale to real scenes?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `The first-hit problem: given n primitives and a ray, find the closest intersection point. Brute-force is O(n) per ray. Real scenes have millions of triangles, millions of pixels, and multiple bounces per pixel — total cost is O(n × pixels × bounces) which is completely infeasible. Spatial data structures reduce per-ray cost to O(log n) by pruning large parts of the scene without testing individual primitives.`,
    intuition: `The first-hit problem is the algorithmic bottleneck of ray tracing. Every data structure in this lecture is an answer to "how do we avoid testing all n triangles?"`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 2,
    qid: `QF2`,
    qtype: `FLOW`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `The lecture evaluates: simple bounding box → BVH → KD-tree → uniform grid. What failure of a single bounding box motivates the hierarchical BVH?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `A single bounding box wrapping all geometry provides only one binary decision per ray: does the ray intersect the box? If yes, we must still test all n primitives inside. If the ray hits the scene at all (the common case), no work is saved. A BVH recursively subdivides: a ray that misses a node's bounding box prunes the entire subtree. This turns the worst-case O(n) into O(log n) for well-balanced scenes.`,
    intuition: `One level of hierarchy saves almost nothing. The speedup comes from many levels of hierarchy compounding.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 3,
    qid: `QF3`,
    qtype: `ORDER`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `Put these spatial acceleration structures in the order lecture 13 introduces them: KD-tree / uniform grid / bounding volume hierarchy (BVH) / single bounding box (no hierarchy)`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `Single bounding box → Bounding volume hierarchy (BVH) → KD-tree → Uniform grid`,
    intuition: `The lecture starts with the simplest structure and adds complexity: object-space splitting (BVH) → space-splitting (KD-tree) → regular space subdivision (grid).`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 1,
    qid: `Q1`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `00:36`,
    question: `What is the primary motivation for studying spatial data structures according to the lecture?`,
    options: [`To handle extremely complex geometry with details at different scales`, `To reduce memory usage when storing geometric data`, `To enable more realistic rendering of simple scenes`, `To improve the accuracy of geometric computations`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [00:36]: "And the motivation here is that if you go out into the world and look at real geometry it can be extremely complex it can have detail at all different scales it can be massive and so the question is how do we deal with this level of complexity from a computational point of view."`,
    code: ``,
    images: ["lec13_slide_01.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 2,
    qid: `Q2`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `01:12`,
    question: `What are the two main questions when intersecting a ray with a triangle?`,
    options: [`What is the normal of the triangle and what is its reflectance property`, `What is the size of the triangle and how many triangles are in the scene`, `Does the ray hit the triangle and where/how far along the ray is the intersection`, `Where does the ray start and in what direction does it travel`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [01:12]: "I want to figure out first of all does the ray hit the triangle and second of all if it if it does hit the triangle where or how far do I have to travel along the Ray from the origin to get to that intersection point."`,
    code: ``,
    images: ["lec13_slide_33.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 3,
    qid: `Q3`,
    qtype: `METHODOLOGY`,
    format: `mcq`,
    timestamp: `02:30`,
    question: `What additional test is required after determining that a ray pierces the plane of a triangle?`,
    options: [`Computing the texture coordinates at the hit point`, `Verifying that the intersection point is inside the triangle`, `Checking if the triangle is visible from the camera`, `Testing if the ray origin is in front of the plane`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [02:30]: "That doesn't completely do it that really is only testing does the Ray pierce the plane of the triangle. If we want to test if the point of intersection is actually inside the triangle we still have to do a standard triangle inside outside test."`,
    code: ``,
    images: ["lec13_slide_33.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 4,
    qid: `Q4`,
    qtype: `BARYCENTRIC`,
    format: `mcq`,
    timestamp: `03:02`,
    question: `How are barycentric coordinates used in ray-triangle intersection?`,
    options: [`To compute the lighting at the intersection point`, `To determine the color of the triangle`, `To parameterize positions on the triangle for testing intersection`, `To accelerate intersection tests with multiple triangles`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer describes at [03:02]: "We could parameterize the triangle with vertices p0 p1 p2 using our barycentric coordinates" and later explains how this parameterization can be used to solve for the intersection point.`,
    code: ``,
    images: ["lec13_slide_33.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 5,
    qid: `Q5`,
    qtype: `MATRIX`,
    format: `mcq`,
    timestamp: `05:48`,
    question: `In the barycentric approach to ray-triangle intersection, what do the three columns of matrix M represent?`,
    options: [`The three vertices of the triangle`, `The three barycentric coordinates`, `P1-P0, P2-P0, and -D`, `The normal vector, ray direction, and ray origin`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [05:48]: "We have the matrix M and it's columns are P1 minus p0 P2 minus P0 and minus D and we can solve simultaneously for all three variables u v and T at the same time."`,
    code: ``,
    images: ["lec13_slide_33.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 6,
    qid: `Q6`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `07:27`,
    question: `What is the "first hit problem" in ray tracing?`,
    options: [`Finding the closest point where a ray intersects the scene`, `Identifying which object was first created in the scene`, `Determining which ray to cast first from the camera`, `Finding the first triangle in memory that a ray might hit`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer defines at [07:27]: "One version of the ray tracing problem is this first hit problem which says given a scene defined by a set of n primitives and array R we want to find not just any point where the ray hits the scene but we want to find the closest point of intersection with the scene."`,
    code: ``,
    images: ["lec13_slide_47.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 7,
    qid: `Q7`,
    qtype: `COMPLEXITY`,
    format: `mcq`,
    timestamp: `08:47`,
    question: `What is the computational complexity of the naive algorithm for finding the first hit in a scene with n triangles?`,
    options: [`O(n)`, `O(n²)`, `O(log n)`, `O(n log n)`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [08:47]: "We're doing the same amount of work for every single triangle in our list we have opportunity to bypass any of that work so the complexity is just order n linear complexity."`,
    code: ``,
    images: ["lec13_slide_47.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 8,
    qid: `Q8`,
    qtype: `ACCELERATION`,
    format: `mcq`,
    timestamp: `09:49`,
    question: `What is the first acceleration strategy proposed for ray-scene intersection?`,
    options: [`Putting a bounding box around the mesh`, `Building a KD-tree for spatial subdivision`, `Sorting the triangles by distance`, `Using a uniform grid to partition space`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer introduces at [09:49]: "One thing we could do for instance is put a bounding box around the match we could find sort of the smallest cube that encloses all the primitives."`,
    code: ``,
    images: ["lec13_slide_47.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 9,
    qid: `Q9`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `10:42`,
    question: `What is the benefit of using a bounding box for ray-scene intersection?`,
    options: [`It automatically handles transparent objects`, `It enables early termination when the ray misses the box`, `It reduces the memory needed to store the scene`, `It allows the scene to be rendered with better quality`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [10:42]: "There's a chance that the Ray actually doesn't hit the box at all and in that case we know that we're done because if the rate doesn't enter the box there's no way that it could possibly pass through any of the primitives that are contained inside the box."`,
    code: ``,
    images: ["lec13_slide_47.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 10,
    qid: `Q10`,
    qtype: `ANALYSIS`,
    format: `mcq`,
    timestamp: `11:48`,
    question: `What is the asymptotic complexity of ray-scene intersection when using just a single bounding box?`,
    options: [`O(1)`, `O(log n)`, `O(n log n)`, `O(n)`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer points out at [11:48]: "Asymptotically or in the worst-case sense we're not doing any better we're still using order n work to do an intersection query."`,
    code: ``,
    images: ["lec13_slide_47.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 11,
    qid: `Q11`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `13:40`,
    question: `Why is ray-box intersection computation simpler than general ray-plane intersection?`,
    options: [`Boxes have fewer triangles than general geometry`, `There's no need to compute barycentric coordinates`, `Box intersection doesn't require inside-outside testing`, `The planes of the box are axis-aligned, simplifying the normal vectors`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [13:40]: "The math is going to simplify greatly because the planes are always access aligned so in 2d for instance the normal is always going to look something like 1 0 or 0 1 or 0 negative 1."`,
    code: ``,
    images: ["lec13_slide_47.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 12,
    qid: `Q12`,
    qtype: `INTERVAL`,
    format: `mcq`,
    timestamp: `14:42`,
    question: `How is the final ray-box intersection determined after computing intersections with all box planes?`,
    options: [`By taking the intersection of t-min/t-max intervals along each axis`, `By checking if the ray hits any of the planes`, `By taking the average of all intersection points`, `By finding the closest intersection to the ray origin`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer describes at [14:42]: "We want to take the intersections of T min T max intervals we know the extent of the box along each direction and we can see if the time that the Ray spends inside the box in x y&z if those coincide."`,
    code: ``,
    images: ["lec13_slide_47.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 13,
    qid: `Q13`,
    qtype: `ANALOGY`,
    format: `mcq`,
    timestamp: `15:49`,
    question: `What simpler problem does the lecturer use as an analogy to spatial acceleration structures?`,
    options: [`Finding the closest value in an array of integers`, `Finding the closest point in 2D`, `Implementing a hash table`, `Sorting a list of points`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer introduces at [15:49]: "Let's consider a simple problem where I just have now instead of some geometric scene I just have a set of integers or let's say I have a list of integers right there in some array and the task is given some query integer K let's say K is 18 I want to find the element of myarray s that is closest to K closest in value to K."`,
    code: ``,
    images: ["lec13_slide_47.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 14,
    qid: `Q14`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `16:35`,
    question: `What is the naive approach to finding the closest value to K in an array?`,
    options: [`Divide-and-conquer by splitting the array in half`, `Using a hash table to look up exact matches`, `Walking through the entire list and tracking the closest value seen`, `Binary search on the sorted array`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer describes at [16:35]: "The most naive algorithm the simplest thing I could possibly do is just walk through the whole list for each entry of the list I compare the value that I have the query value K to the value in the list I take the difference and then keep track of the smallest difference."
- QUESTIONS (continued):`,
    code: ``,
    images: ["lec13_slide_47.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 15,
    qid: `Q15`,
    qtype: `OPTIMIZATION`,
    format: `mcq`,
    timestamp: `18:11`,
    question: `What is the optimized approach for finding the closest value in an array?`,
    options: [`Caching previously seen values`, `Using a heap data structure`, `Sorting the array first, then using binary search`, `Using a hash table for instant lookup`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [18:11]: "A pretty natural idea is to sort the integers first so just sort them according to their value from lowest to highest. Now I can do a binary search so I can cut the array roughly in half and I can say okay is the value in the middle of the array bigger or smaller than my query value."`,
    code: ``,
    images: ["lec13_slide_48.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 16,
    qid: `Q16`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `20:12`,
    question: `What is the overall cost of the optimized (sort + binary search) approach to find a single closest value?`,
    options: [`O(1)`, `O(n log n)`, `O(n)`, `O(log n)`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer calculates at [20:12]: "The overall cost is order n log order n log n," which accounts for the initial sorting cost. The binary search itself is faster at O(log n), but the sorting dominates the total cost.`,
    code: ``,
    images: ["lec13_slide_48.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 17,
    qid: `Q17`,
    qtype: `AMORTIZED`,
    format: `mcq`,
    timestamp: `21:00`,
    question: `When does the optimized (sort + binary search) approach become more efficient than the naive approach?`,
    options: [`When the array is already sorted`, `When performing many lookups on the same data`, `When the elements are evenly distributed`, `When there are more than n² elements`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [21:00]: "If we imagine we have lots and lots and lots of queries K we do a million queries K well we only had to eat the cost of doing that sort once. So that cost that order n log n cost of sorting gets spread out over all our subsequent queries."`,
    code: ``,
    images: ["lec13_slide_48.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 18,
    qid: `Q18`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `22:43`,
    question: `What is the amortized cost of ray-scene intersection when the ray misses a bounding box?`,
    options: [`O(n log n)`, `O(n)`, `O(log n)`, `O(1)`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [22:51]: "If we amortize the cost over mini-mini raise the amortized cost is again just order one so that's good news the amortized cost for not finding an intersection is constant time about as good as we could possibly imagine doing."`,
    code: ``,
    images: ["lec13_slide_48.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 19,
    qid: `Q19`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `23:16`,
    question: `What is the amortized cost of ray-scene intersection when the ray hits a single bounding box?`,
    options: [`O(1)`, `O(n log n)`, `O(log n)`, `O(n)`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer confirms at [23:29]: "That's again an order n cost our amortized cost is order and even over many many rate queries still know better than then I naive algorithm we're still testing all the triangles."`,
    code: ``,
    images: ["lec13_slide_48.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 20,
    qid: `Q20`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `24:15`,
    question: `What are the two types of nodes in a bounding volume hierarchy (BVH)?`,
    options: [`Visible nodes and invisible nodes`, `Root nodes and branch nodes`, `Primary nodes and secondary nodes`, `Leaf nodes and interior nodes`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer identifies at [24:15]: "A bounding volume hierarchy means we have a collection of boxes arranged in a tree like structure and there are two types of nodes. There are leaf nodes at the bottom of the tree those nodes actually contain primitives... All other nodes in the tree are interior nodes."`,
    code: ``,
    images: ["lec13_slide_48.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 21,
    qid: `Q21`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `24:27`,
    question: `What do interior nodes in a BVH represent?`,
    options: [`Individual triangles in the scene`, `Empty spaces in the scene`, `Proxies for large subsets of primitives`, `Camera positions for rendering`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer describes at [24:27]: "An interior node you can imagine it's sort of a proxy for a large subset of primitives it's kind of pretending to capture the geometry of all the primitives that it contains."`,
    code: ``,
    images: ["lec13_slide_48.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 22,
    qid: `Q22`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `26:55`,
    question: `According to the lecturer, what makes a "better" BVH?`,
    options: [`Having deeper tree structures`, `Having more balanced tree structures`, `Having tighter fitting bounding boxes with less empty space`, `Having fewer total nodes`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [26:55]: "The further I go down the tree the tighter fitting these are these these nodes really tightly fit around the geometry" and at [27:11] points out the problem with the alternative: "On the left for instance I have bounding boxes B and C that have a lot of empty space in them so I might easily hit B or C thinking that I'm gonna hit a primitive but discover most of the time that I'm not."`,
    code: ``,
    images: ["lec13_slide_48.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 23,
    qid: `Q23`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `27:43`,
    question: `How are primitives partitioned in a BVH?`,
    options: [`Primitives are duplicated across all relevant leaf nodes`, `Primitives are in disjoint sets where each primitive belongs to only one leaf node`, `Primitives are stored only in the root node`, `Primitives can be in multiple leaf nodes at once`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [27:43]: "It's gonna partition the primitives into disjoint sets always we're gonna put a triangle or a primitive in one node or another it doesn't belong to two leaf nodes for instance."`,
    code: ``,
    images: ["lec13_slide_48.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 24,
    qid: `Q24`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `27:54`,
    question: `What is true about the bounding boxes of interior nodes in a BVH?`,
    options: [`They must never overlap in space`, `They must be the same size`, `They must all be cubes`, `They can overlap in space`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer points out at [27:54]: "The bounding boxes themselves right the interior nodes or the the bounding boxes can overlap in space so array might hit both bounding boxes."`,
    code: ``,
    images: ["lec13_slide_48.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 25,
    qid: `Q25`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `28:53`,
    question: `What data does a BVH node typically store?`,
    options: [`Camera position and ray directions`, `Only a bounding box`, `A boolean "isLeaf", a bounding box, and pointers to child nodes`, `Triangle meshes and material properties`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer describes at [28:53]: "We have this struct or class BVH node that stores some basic data one is a boolean variable that leaf that says is this a leaf node does this contain primitives or is it something that contains other bounding boxes. We have a bounding box which just describes the actual shape of that bounding box... We have two pointers to other BVH nodes that point to the left child and the right child."`,
    code: ``,
    images: ["lec13_slide_48.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 26,
    qid: `Q26`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `30:13`,
    question: `What information is stored in the "hit info" structure?`,
    options: [`The ray origin and direction`, `The surface normal and material properties`, `All triangles the ray intersects`, `A pointer to the hit primitive and the distance t along the ray`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [30:19]: "This just stores a couple pieces of information the pointer to the primitive that was hit so which triangle was hit by the Ray and the T value how far along the Ray did that hit occur."`,
    code: ``,
    images: ["lec13_slide_48.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 27,
    qid: `Q27`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `30:49`,
    question: `What is the first step in the BVH traversal algorithm?`,
    options: [`Check if the ray intersects each primitive in the scene`, `Compute the surface area of the bounding boxes`, `Check if the ray intersects the bounding box of the current node`, `Sort the primitives by distance from the ray`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [30:49]: "The first thing we have to do is just check does the given ray intersect the given bounding box node so we just do an intersection a box Ray intersection test."
- QUESTIONS (continued):`,
    code: ``,
    images: ["lec13_slide_48.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 28,
    qid: `Q28`,
    qtype: `TRAVERSAL`,
    format: `mcq`,
    timestamp: `32:48`,
    question: `What optimization strategy improves BVH traversal performance?`,
    options: [`Front-to-back traversal visiting the closest child node first`, `Testing primitives in random order`, `Back-to-front traversal visiting the farthest child node first`, `Always testing leaf nodes before interior nodes`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer describes at [32:48]: "There's lots of ways we can improve the performance of this traversal and generally the strategy for improving improving performance is to do traversal in a way that's likely to terminate early" and explains the front-to-back approach where the closest child node is visited first.`,
    code: ``,
    images: ["lec13_slide_48.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
  },
  {
    id: 29,
    qid: `Q29`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `36:06`,
    question: `Why is front-to-back traversal beneficial even though we might have to test both children?`,
    options: [`It's likely to allow early termination by finding a closer hit first`, `It's more cache-friendly`, `It uses less memory`, `It's easier to implement`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [36:06]: "Even though we can miss everything in the closer node still a lot of the time we kind of expect that for most reasonable scenes for most reasonable rays if we hit this if we traverse this this closer box first then it's very likely then we can terminate early."`,
    code: ``,
    images: ["lec13_slide_48.png"],
    tags: [],
    source: `lectures/cg-13-lecture-quiz.md.md`,
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

export default function Lec13Part1Quiz() {
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
    accent: '#c084fc', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec13'
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
          <Database size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 13: Spatial Data Structures — Part 1</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>BVH, KD-trees, octrees, uniform grids, spatial hashing</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-13-lecture-quiz.md.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec13/1`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec13/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
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
          <Database size={20} /> Start Quiz
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
              <Database size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 13: Spatial Data Structures — Part 1</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-13-lecture-quiz.md.md.</p>
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
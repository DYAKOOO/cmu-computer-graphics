'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Box } from 'lucide-react'

// Source: lectures/cg-10-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 10: Meshes & Manifolds · QQF1–QQ29 · 32 questions (27 MCQ, 5 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-10-lecture-quiz.md 10

const quizData = [
  {
    id: 1,
    qid: `QF1`,
    qtype: `SHORT`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `In your own words: what is the overarching narrative arc of Lecture 10 — what problem does it open with, and what solution does it converge on?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `The lecture opens by asking "what is a surface?" and uses the bitmap image analogy (a regular (i,j) grid is simple, efficient, and general enough) to motivate the manifold assumption for surfaces. It then evaluates four data structures — polygon soup, adjacency list, incidence matrices, halfedge — each motivated by a specific limitation of the previous. The lecture ends with halfedge as the canonical structure: O(1) local traversal, and any valid halfedge mesh is automatically manifold.`,
    intuition: `Follow the "what can't this do cheaply?" thread through each section. The whole lecture is one coherent argument where every upgrade answers the inadequacy of the last.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 2,
    qid: `QF2`,
    qtype: `SHORT`,
    format: `reveal`,
    timestamp: `03:00`,
    question: `Why does the lecture open with bitmap images and square grids before mentioning polygon meshes? What analogy is being drawn, and why does it hold?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `The bitmap (i,j) grid is simple (always exactly 4 neighbors), efficient (constant-time index lookup), and general enough for most images. The lecture then says "same story for surfaces" — the manifold (u,v) coordinate grid at every surface point is the analogous choice, buying the same three benefits. Slides 3–7 are not review; they are the motivation for the manifold assumption stated in terms the student already understands.`,
    intuition: `Any time you see "why a regular structure instead of something more flexible?" the answer is always: simplicity + efficiency + enough generality for the cases we care about. The bitmap is the prototype of this argument.`,
    explanation: ``,
    code: ``,
    images: ["lec10_slide_04.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 3,
    qid: `QF3`,
    qtype: `ORDER`,
    format: `reveal`,
    timestamp: `15:59`,
    question: `Put these four mesh representations in the order the lecture introduces them (simplest → most powerful) and name the one key failure of each that motivates the next: Halfedge / Polygon Soup / Incidence Matrices / Adjacency List`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `Polygon Soup → Adjacency List → Incidence Matrices → Halfedge
1. Polygon Soup: no connectivity info at all — can't find neighbors without scanning every triangle.
2. Adjacency List: separates geometry from connectivity, but finding all faces around a vertex is still O(n).
3. Incidence Matrices: O(1) neighbor lookup, but for large meshes the matrices become billion×billion and mostly zeros — needs sparse data structures.
4. Halfedge: small fixed set of pointers, O(1) local traversal in all directions, and valid halfedge connectivity is manifold-by-construction.`,
    intuition: `Each step adds exactly the one operation the previous structure made expensive. Know the one failure per step and the staircase is memorable forever.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 1,
    qid: `Q1`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `00:00`,
    question: `What was the primary focus of the previous lecture according to Professor Crane?`,
    options: [`Different types of geometry in nature`, `Rasterization pipeline implementation`, `Mesh subdivision algorithms`, `Array-based data structures`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [00:12], the professor states: "Last time we started talking about geometry, today we're going to dive in and talk about some of the real nuts and bolts of working with meshes."`,
    code: ``,
    images: ["lec10_slide_02.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 2,
    qid: `Q2`,
    qtype: `CONCEPT`,
    format: `mcq`,
    timestamp: `00:35`,
    question: `What are the two major categories of geometry representation mentioned at the beginning of the lecture?`,
    options: [`Sparse and dense representations`, `Polygon meshes and subdivision surfaces`, `Implicit and explicit representations`, `Manifold and non-manifold geometry`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [00:35]: "We looked at two major categories. One was implicit descriptions of geometry... the other big category were explicit representations."`,
    code: ``,
    images: ["lec10_slide_02.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 3,
    qid: `Q3`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `01:54`,
    question: `What is the key characteristic of a manifold surface according to the lecture?`,
    options: [`You can zoom in and draw a nice coordinate grid with two distinct directions`, `It must be representable as a halfedge data structure`, `It must have no boundaries`, `It must be composed of triangles`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [02:26], the professor defines: "If you pick any point on your shape and you zoom in far enough, then if it's manifold you should be able to draw a nice coordinate grid with two distinct directions."`,
    code: ``,
    images: ["lec10_slide_09.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 4,
    qid: `Q4`,
    qtype: `CONCEPT`,
    format: `mcq`,
    timestamp: `09:44`,
    question: `Why is the center point of a star-shaped junction considered non-manifold?`,
    options: [`Because it contains too many vertices`, `Because the surface is not smooth at that point`, `Because you cannot place a coordinate grid with only two directions at that point`, `Because it involves more than two faces`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [09:55]: "If I keep zooming in and zooming in and zooming in, it never really changes the way it looks. I can never put a nice little grid on that center place... There's not just two directions to go, there's a more complicated way in which this shape is arranged."`,
    code: ``,
    images: ["lec10_slide_24.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 5,
    qid: `Q5`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `12:05`,
    question: `What is the mnemonic given for determining if a polygon mesh has manifold connectivity?`,
    options: [`"Loops, not links"`, `"Edges, not vertices"`, `"Circles, not stars"`, `"Fans, not fins"`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [12:17], the professor explicitly states: "A manifold polygon mesh has fans, not fins."`,
    code: ``,
    images: ["lec10_slide_12.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 6,
    qid: `Q6`,
    qtype: `CONCEPT`,
    format: `mcq`,
    timestamp: `12:32`,
    question: `What is the first condition for a polygon mesh to have manifold connectivity?`,
    options: [`Every edge must be contained in only two polygons`, `Every vertex must be contained in at most one face`, `Every face must be a triangle`, `Every vertex must be connected to exactly three edges`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [12:32]: "Every edge of our mesh is contained in only two polygons."`,
    code: ``,
    images: ["lec10_slide_12.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 7,
    qid: `Q7`,
    qtype: `CONCEPT`,
    format: `mcq`,
    timestamp: `13:28`,
    question: `What is the second condition for a polygon mesh to have manifold connectivity?`,
    options: [`Every vertex must be contained in a single fan or loop of polygons`, `Every edge must connect exactly two vertices`, `Every face must be convex`, `The mesh must be orientable`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [13:34], the professor states: "Every vertex in a manifold mesh or a mesh with manifold connectivity should be contained in a single fan or a single loop of polygons."`,
    code: ``,
    images: ["lec10_slide_12.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 8,
    qid: `Q8`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `14:22`,
    question: `What defines a boundary on a surface according to the lecture?`,
    options: [`Where two surfaces intersect`, `Where the normal vector changes direction`, `Where the surface has holes`, `Where the surface ends`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [14:22], the lecturer defines: "What is the boundary of a surface? Intuitively the boundaries where the surface kind of ends. So for instance if I have a pair of pants then the waist and the ankles of the pants are what I'm going to call the boundary."`,
    code: ``,
    images: ["lec10_slide_13.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 9,
    qid: `Q9`,
    qtype: `CONCEPT`,
    format: `mcq`,
    timestamp: `15:02`,
    question: `What important property do boundaries have according to the lecture?`,
    options: [`They can never intersect themselves`, `They must be composed of straight line segments`, `They always form a single closed loop`, `They always have sharp corners`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [15:02]: "An important fact about boundaries: every boundary forms a single closed loop. So if I find any one boundary point and keep following it along the boundary, I'll always come back to where I started by making a single loop."`,
    code: ``,
    images: ["lec10_slide_13.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 10,
    qid: `Q10`,
    qtype: `CONCEPT`,
    format: `mcq`,
    timestamp: `15:59`,
    question: `Why is the manifold assumption useful according to the lecture?`,
    options: [`Because manifold meshes render faster`, `Because it makes data structures and algorithms simpler and more efficient`, `Because manifold shapes are more aesthetically pleasing`, `Because manifold geometry is easier to animate`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [16:18]: "We want to make some assumptions about our geometry to keep our data structures and our algorithms simple and efficient."`,
    code: ``,
    images: ["lec10_slide_15.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 11,
    qid: `Q11`,
    qtype: `COMPARISON`,
    format: `mcq`,
    timestamp: `17:13`,
    question: `What are the two basic data structures compared in the "warmup" section of the lecture?`,
    options: [`Trees and graphs`, `Hash tables and dictionaries`, `Stacks and queues`, `Arrays and linked lists`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [18:00] and [19:21], the professor discusses arrays and linked lists as the two basic data structures being compared as a warmup to mesh data structures.`,
    code: ``,
    images: ["lec10_slide_21.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 12,
    qid: `Q12`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `20:06`,
    question: `What is "polygon soup" in the context of mesh representations?`,
    options: [`A technique for simplifying complex meshes`, `A rendering algorithm for smooth surfaces`, `A mixture of different polygon types in one mesh`, `The simplest representation where each triangle's three vertex coordinates are stored independently`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer defines at [20:14]: "What's the simplest thing we could do to store a triangle mesh? We could just store for each triangle it's three vertex coordinates."`,
    code: ``,
    images: ["lec10_slide_18.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 13,
    qid: `Q13`,
    qtype: `CONCEPT`,
    format: `mcq`,
    timestamp: `22:49`,
    question: `What is the key improvement of the adjacency list representation over polygon soup?`,
    options: [`It requires less memory`, `It splits the geometry (vertices) from the connectivity (indices)`, `It supports animation`, `It supports non-manifold meshes`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The professor explains at [24:13]: "This is the first time we're doing something very important, something we'll do for all remaining data structures: we're splitting up our mesh into the geometry, the vertices that tell us about shape, and the connectivity, this list of indices that just tells us how things are connected up."`,
    code: ``,
    images: ["lec10_slide_30.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 14,
    qid: `Q14`,
    qtype: `EFFICIENCY`,
    format: `mcq`,
    timestamp: `26:20`,
    question: `What is the time complexity of finding all polygons touching a specific vertex using the adjacency list representation for a large mesh?`,
    options: [`O(n²) - quadratic time`, `O(log n) - logarithmic time`, `O(n) - linear time with the number of polygons`, `O(1) - constant time`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [27:22], the lecturer points out: "This is something that's now like linear in the input even though it's kind of constant size output. So there has to be a better way to do this."`,
    code: ``,
    images: ["lec10_slide_17.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 15,
    qid: `Q15`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `27:34`,
    question: `What are incidence matrices in the context of mesh representations?`,
    options: [`Matrices that transform mesh vertices into screen space`, `Probability distributions of element connections`, `Tables representing which mesh elements are connected to which other elements`, `Mathematical tools for calculating surface curvature`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The professor describes at [27:42]: "Another really nice data structure for storing connectivity is the idea of incidence matrices... if we want to know who our neighbors are why don't we just store a list of neighbors."`,
    code: ``,
    images: ["lec10_slide_18.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 16,
    qid: `Q16`,
    qtype: `CONCEPT`,
    format: `mcq`,
    timestamp: `36:05`,
    question: `What problem arises when using incidence matrices for large meshes?`,
    options: [`They require specialized hardware`, `They would require storing huge matrices with mostly zeros`, `They don't support non-manifold meshes`, `They are too slow for rendering`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [32:15]: "If I have a billion polygons and you know roughly a billion edges then my edge face matrix is going to be roughly a billion times a billion." And at [32:44]: "Most of the entries of our matrices are going to be zero. So instead of storing all those zeros, it's kind of stupid to store them."`,
    code: ``,
    images: ["lec10_slide_20.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 17,
    qid: `Q17`,
    qtype: `IMPLEMENTATION`,
    format: `mcq`,
    timestamp: `37:44`,
    question: `What is the row-based approach to sparse matrix storage?`,
    options: [`Storing rows as continuous blocks of memory`, `Compressing each row using a hash function`, `Using a binary tree to represent each row`, `For each row, storing a list of non-zero entries with their column indices and values`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [37:53], the professor explains: "For each row I'm going to store the first non-zero entry in the matrix, so I'm going to store not only its value but also the index of its column and then a pointer to the next non-zero entry."`,
    code: ``,
    images: ["lec10_slide_21.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 18,
    qid: `Q18`,
    qtype: `CONCEPT`,
    format: `mcq`,
    timestamp: `39:02`,
    question: `What is the main advantage of the compressed column format for sparse matrices?`,
    options: [`It supports parallel processing`, `It uses less memory than any other format`, `It's the easiest format to implement`, `It's really fast for actual matrix math operations`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [41:30]: "On the other hand it's really really fast for doing actual matrix math operations. If I'm doing matrix vector multiplies or anything with sparse matrices, this is a really good thing to have."`,
    code: ``,
    images: ["lec10_slide_21.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 19,
    qid: `Q19`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `42:18`,
    question: `What is the key concept of the halfedge data structure?`,
    options: [`Storing only half of the mesh data to save memory`, `Maintaining exact half of the vertices as control points`, `Splitting each edge into two directed halfedges pointing in opposite directions`, `Using arrays to store mesh elements for faster access`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The professor explains at [42:50]: "What we're going to do is we're going to split every edge into two so called half edges that point the two opposite directions along the edge, and those half edges are going to be the glue that connects up all the rest of our elements."`,
    code: ``,
    images: ["lec10_slide_22.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 20,
    qid: `Q20`,
    qtype: `IMPLEMENTATION`,
    format: `mcq`,
    timestamp: `43:02`,
    question: `What information does each halfedge store according to the lecture?`,
    options: [`Only its twin halfedge`, `Only its vertices and the face it belongs to`, `A list of all vertices in the mesh`, `Its twin, the next halfedge, its source vertex, its edge, and its face`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [43:02], the lecturer states: "Each half edge knows about a bunch of things: a half edge knows its twin so it knows the other half edge along the same edge, it knows the next half edge within the same polygon, it knows the vertex that it comes from... It stores the edge that it belongs to and it stores the face that it belongs to."`,
    code: ``,
    images: ["lec10_slide_22.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 21,
    qid: `Q21`,
    qtype: `ALGORITHM`,
    format: `mcq`,
    timestamp: `44:35`,
    question: `How do you traverse all vertices of a face using the halfedge data structure?`,
    options: [`Use a breadth-first search starting from any vertex`, `Start with the face's halfedge and keep following the next pointer until you return to the start`, `Look up the vertex indices in an adjacency list`, `Use a vertex-face incidence matrix`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer describes at [44:56]: "I have a little loop where I replace the half edge with the next half edge and the next half edge and the next half edge until I get back around to the half edge I started with. I just go around essentially a linked list except this linked list makes a loop."`,
    code: ``,
    images: ["lec10_slide_22.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 22,
    qid: `Q22`,
    qtype: `CONCEPT`,
    format: `mcq`,
    timestamp: `47:24`,
    question: `What is the relationship between halfedge data structures and manifold meshes?`,
    options: [`Halfedge structures can efficiently represent both manifold and non-manifold meshes`, `Halfedge data structures can only represent a subset of manifold meshes`, `If a mesh has valid halfedge connectivity, it will always describe a manifold polygon mesh`, `Manifold meshes require more complex data structures than halfedge`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [47:24], the professor states: "Not that we have to have a manifold mesh in order to work with the half-edged data structure but the other way around: if I have valid half-edge connectivity then it will always describe a manifold polygon mesh."`,
    code: ``,
    images: ["lec10_slide_24.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 23,
    qid: `Q23`,
    qtype: `UNDERSTANDING`,
    format: `mcq`,
    timestamp: `50:48`,
    question: `What is the key distinction between connectivity and geometry in meshes?`,
    options: [`Connectivity is only relevant for manifold meshes while geometry applies to all meshes`, `Connectivity relates to how mesh elements are connected while geometry relates to vertex positions`, `Connectivity is a 2D property while geometry is 3D`, `Connectivity is about the number of vertices while geometry is about the number of faces`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [51:28]: "The critical thing to notice about these conditions is they say nothing about the vertex positions. Neither of these conditions is a condition on the x y z coordinates of your vertices. So you can have a perfectly good correct valid manifold connectivity for your mesh even if the geometry is totally awful."`,
    code: ``,
    images: ["lec10_slide_25.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 24,
    qid: `Q24`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `55:15`,
    question: `Why are halfedge meshes particularly good for editing operations?`,
    options: [`Because they use less memory than other representations`, `Because they render faster`, `Because they enforce non-manifold connections`, `Because they're like linked lists, making it easy to insert and delete elements`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [55:15], the professor states: "Why do we like half edge meshes? Why why are they good thing? Why are we going to use them for this class? Well for one thing remember a key feature of linked lists: linked lists we liked them because we could insert and delete elements, right?... Same story with a half edge mesh."`,
    code: ``,
    images: ["lec10_slide_26.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 25,
    qid: `Q25`,
    qtype: `OPERATION`,
    format: `mcq`,
    timestamp: `56:55`,
    question: `What does an edge flip operation do to a mesh?`,
    options: [`It connects all unpaired boundary edges`, `It reverses the direction of all halfedges`, `It changes the coordinates of the mesh vertices`, `It replaces two triangles sharing an edge with two different triangles connecting the opposite vertices`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer describes at [56:55]: "I have two triangles a with vertices a b c and d right sharing this edge c b, I'm going to replace those with the two kind of opposite triangles sharing the edge a d."`,
    code: ``,
    images: ["lec10_slide_27.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 26,
    qid: `Q26`,
    qtype: `COMPARISON`,
    format: `mcq`,
    timestamp: `58:17`,
    question: `How does the edge split operation differ from the edge flip operation?`,
    options: [`Edge split requires creating new elements while edge flip just reassigns pointers`, `Edge split is irreversible while edge flip is reversible`, `Edge split only works on boundary edges while edge flip works on interior edges`, `Edge split always creates triangular faces while edge flip can create any polygon`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [58:34], the professor explains: "This time I actually do have to go and add new elements. What do I have to add? I guess I need to add three new edges and three new faces and a new vertex and a bunch of new half edges." This contrasts with the edge flip which at [57:18] he notes: "No elements are created or destroyed."`,
    code: ``,
    images: ["lec10_slide_28.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 27,
    qid: `Q27`,
    qtype: `CONCEPT`,
    format: `mcq`,
    timestamp: `1:07:16`,
    question: `What connection does the professor make between geometry processing and signal processing at the end of the lecture?`,
    options: [`Both require specialized hardware for efficient computation`, `Signal processing is being replaced by geometry processing`, `Both deal with continuous functions that need to be sampled`, `Digital geometry processing generalizes traditional digital signal processing`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:07:30], the lecturer concludes: "This is the field of digital geometry processing which kind of generalizes traditional digital signal processing."`,
    code: ``,
    images: ["lec10_slide_36.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 28,
    qid: `Q28`,
    qtype: `FILL`,
    format: `reveal`,
    timestamp: `43:02`,
    question: `Complete the halfedge struct. Each halfedge stores exactly five pointers: its ___ (the other halfedge along the same edge), the ___ halfedge within the same polygon, the ___ it originates from, the ___ it belongs to, and the ___ it belongs to.`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `twin / next / vertex / edge / face`,
    intuition: `Two navigation pointers (twin crosses the edge, next goes around the face) plus three ownership pointers (vertex, edge, face) that let you jump to any mesh element from any halfedge. If you can recite these five cold, you can reconstruct every traversal algorithm.`,
    explanation: ``,
    code: ``,
    images: ["lec10_slide_22.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
  },
  {
    id: 29,
    qid: `Q29`,
    qtype: `DEBUG`,
    format: `reveal`,
    timestamp: `50:48`,
    question: `Identify the error: "Manifold conditions verify that vertex positions form a smooth, non-self-intersecting shape."`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `Wrong. The manifold conditions (fans not fins) check only connectivity — which vertices, edges, and faces are adjacent. They say nothing about vertex positions (x,y,z). A mesh with all vertices at the origin can have perfectly valid manifold connectivity. Topology and geometry are independent: manifold = a property of the graph structure, not the embedding in space.`,
    intuition: `Topology ≠ geometry. This is one of the most important distinctions in the whole lecture — the manifold conditions are purely combinatorial (who is next to whom), while geometry is about where vertices actually sit in 3D space.`,
    explanation: ``,
    code: ``,
    images: ["lec10_slide_25.png"],
    tags: [],
    source: `lectures/cg-10-lecture-quiz.md`,
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

export default function Lec10Quiz() {
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
    accent: '#fb923c', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec10'
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
    const p = Math.round(s / (27 || 1) * 100)
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
          <Box size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 10: Meshes & Manifolds</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Manifold surfaces, halfedge data structure, mesh operations</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-10-lecture-quiz.md</p>
          <p style={{ color: C.accent, fontWeight: 600 }}>QQF1–QQ29 · 32 questions (27 graded + 5 open)</p>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>27</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Graded MCQ</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>5</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Open / Reveal</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>~10min</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Est. Time</div></div>
          </div>
        </div>

        <button style={btn({ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' })}
          onClick={() => { setScreen('quiz'); start() }}>
          <Box size={20} /> Start Quiz
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
          <div style={{ fontSize: '1.2rem', color: C.muted, marginBottom: '0.75rem' }}>{score} / 27 MCQ correct</div>
          <div style={{ color: '#475569', fontSize: '0.875rem' }}>+ 5 open questions (self-assessed)</div>
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
              <Box size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 10: Meshes & Manifolds</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-10-lecture-quiz.md.</p>
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
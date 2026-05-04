tags:: cg/lec8 , cg

- LECTURE: Depth and Transparency in Computer Graphics (Keenan Crane)
  DURATION: 52:40
  TOPICS COVERED: Depth buffer, transparency, alpha blending, pre-multiplied alpha, rasterization pipeline
  QUIZ LENGTH: 41 questions
  DIFFICULTY: Mixed
  
  KEY CONCEPTS TESTED:
- "Depth Buffer (Z-buffer)" [04:36] - "The solution to this is a very nice idea called the depth buffer or the z buffer so the idea of the depth buffer is that at each sample point in addition to a color we're also going to keep track of the depth of the closest triangle or the closest primitive seen so far."
- "Alpha Opacity Model" [16:21] - "What is our model for semi-transparent surfaces the basic idea is that we're going to represent the opacity or transparency of a surface by a value alpha so just a real value between 0 and 1 that describes how opaque we are."
- "Pre-multiplied Alpha" [22:42] - "Rather than working with the color values directly, we're going to multiply or pre-multiply those color values by the alpha value."
  
  QUESTIONS:
- #card [QF1] [FLOW] [00:00] Lecture 8 is described as "wrapping up the rasterization pipeline." What two remaining problems does it solve, and why were they deferred until after rasterization and texture mapping were established?
	- ANSWER: (1) Depth (occlusion): which of multiple overlapping triangles is visible at each pixel sample? (2) Transparency (alpha blending): how do we composit semi-transparent surfaces? Both were deferred because they depend on earlier stages: depth requires interpolating a per-vertex attribute (depth value) exactly like texture coords; transparency requires per-fragment alpha values that come from textures. Without rasterization and attribute interpolation in place, neither can be implemented.
	- INTUITION: Depth and transparency are the last two entries in the pipeline diagram shown at the start of the lecture.

- #card [QF2] [FLOW] [00:00] The lecture presents two solutions to the occlusion problem: the painter's algorithm and the Z-buffer. What fundamental limitation of the painter's algorithm motivates the Z-buffer?
	- ANSWER: The painter's algorithm sorts triangles by depth and draws back-to-front. This fails when triangles intersect or cyclically overlap (A behind B, B behind C, C behind A — no valid sort order exists). It also requires a global sort every frame. The Z-buffer solves this per-sample: for each sample, track the minimum depth seen so far and overwrite only if a new fragment is closer. No sort required, handles intersections naturally.
	- INTUITION: The painter's algorithm is a global ordering problem. The Z-buffer converts it to a local per-pixel problem.

- #card [QF3] [ORDER] [00:00] Put these lecture 8 topics in the order they are covered: alpha compositing for transparency / Z-buffer algorithm / painter's algorithm (and why it fails) / depth interpolation using barycentric coordinates
	- ANSWER: Painter's algorithm → depth interpolation using barycentric coordinates → Z-buffer algorithm → alpha compositing for transparency
	- INTUITION: Establish the problem → how to compute depth → correct algorithmic solution → extend to semi-transparent surfaces.

- #card [Q1] [DEFINITION] [24:03] What advantage does pre-multiplied alpha provide in terms of channel handling during compositing?
  A) It requires more arithmetic operations
  B) It treats all channels (RGB and alpha) the same way
  C) It requires separate operations for color and alpha
  D) It produces lower quality results at edges
	- ANSWER: B
	- EXPLANATION: As explained at [24:03], "Notice by the way that this operation composites alpha in exactly the same way as how it composites the red green and blue channels right we don't have separate operations for color and alpha."
- #card [Q2] [CONCEPTUAL] [25:23] What mathematical framework is pre-multiplied alpha related to according to the lecture?
  A) Linear algebra
  B) Calculus
  C) Homogeneous coordinates
  D) Differential equations
	- ANSWER: C
	- EXPLANATION: The lecturer states at [25:10], "Hopefully it reminds you of our discussion of homogeneous coordinates because that's exactly what this is we're expressing our colors and our alpha values in homogeneous coordinates."
- #card [Q3] [VISUAL] [26:51] What visual artifact appears when using non-premultiplied alpha during upsampling and compositing?
  A) A bright halo around objects
  B) A green halo around objects
  C) Pixelation along edges
  D) Completely transparent edges
	- ANSWER: B
	- EXPLANATION: The lecturer demonstrates at [26:51], "And i get this result and you notice it looks almost right i have a blue blob on a gray background but there's this green halo around my blue blob that's no good."
- #card [Q4] [APPLICATION] [28:13] What specific application scenario is mentioned when discussing the need for downsampling textures with alpha?
  A) Character animation
  B) Shadow mapping
  C) Tree leaf rendering
  D) Terrain visualization
	- ANSWER: C
	- EXPLANATION: The lecturer specifically mentions at [28:36], "I want to render leaves in my scene i have trees made of polygons i want to draw as just quads with textures on them okay and to do this in a nice way I want to map my textures so I get nice filtering."
- #card [Q5] [PROCESS] [29:38] When downsampling using pre-multiplied alpha, what happens to "darkened" colors when recovering the final color?
  A) They remain darkened
  B) They get multiplied by alpha again
  C) They get divided by alpha, making them brighter
  D) They get completely replaced with new colors
	- ANSWER: C
	- EXPLANATION: The lecturer explains at [29:57], "So if we divide the dark green by this this medium gray that's actually going to multiply it it's going to make it brighter and then when we composite it over the white background we get this nice light green color."
- #card [Q6] [CALCULATION] [31:17] When compositing a 50% opaque bright red primitive over another 50% opaque bright red primitive using non-premultiplied alpha, what is the resulting alpha value?
  A) 0.25
  B) 0.5
  C) 0.75
  D) 1.0
	- ANSWER: C
	- EXPLANATION: The lecturer calculates at [31:35], "And our alpha gets blended like this 0.5 plus 1 minus 0.5 times 0.5 is 0.75."
- #card [Q7] [CONCEPTUAL] [32:56] What key advantage does pre-multiplied alpha provide when blending colors compared to non-premultiplied alpha?
  A) It changes both color and opacity during blending
  B) It only allows changes to alpha values, preserving original colors
  C) It applies more complex mathematical operations
  D) It produces completely different colors than the originals
	- ANSWER: B
	- EXPLANATION: The lecturer states at [32:56], "I blended together two bright red things the color itself hasn't changed it's still bright red it's only the alpha that's changed it's increased to become more opaque."
- #card [Q8] [SUMMARY] [33:48] Which of the following is NOT listed as an advantage of pre-multiplied alpha?
  A) Better representation for filtering
  B) Treating all channels the same
  C) Fewer arithmetic operations
  D) Improved depth testing accuracy
	- ANSWER: D
	- EXPLANATION: At [33:22-33:48], the lecturer lists advantages including treating all channels the same, fewer operations, closure under composition, and better filtering, but does not mention improved depth testing.
- #card [Q9] [CONCEPTUAL] [35:04] What fundamental challenge arises when trying to render semi-transparent primitives with depth testing?
  A) How to update the depth buffer for transparent primitives
  B) How to calculate alpha values
  C) How to perform antialiasing
  D) How to store color values
	- ANSWER: A
	- EXPLANATION: The lecturer poses this question at [35:04], "But what about depth if i draw a semi-transparent triangle should i change the depth value is that the closest thing i've seen now can't i still see triangles that i've already drawn through that triangle and shouldn't i care about their depth."
- #card [Q10] [REQUIREMENT] [36:59] Why is drawing transparent primitives described as "a real pain" in the rasterization pipeline?
  A) It requires complex mathematical operations
  B) It requires sorting primitives in back-to-front order
  C) It requires more memory
  D) It cannot be done in real-time
	- ANSWER: B
	- EXPLANATION: The lecturer explains at [35:57], "Only if things are drawn in back to front order," and later at [36:35] notes the challenges with sorting, including that it's "annoying" and "not something actually that's very easy to do on a graphics card."
- #card [Q11] [ALGORITHM] [38:05] What two-pass approach is described for rendering scenes with both opaque and transparent primitives?
  A) Render everything in one pass with a specialized shader
  B) First render only transparent objects, then render opaque objects
  C) First render opaque objects with depth updates, then render transparent objects without depth updates
  D) Render each object individually and composite them at the end
	- ANSWER: C
	- EXPLANATION: The lecturer describes at [38:23], "We can first render our opaque primitives in any order we want using the depth buffer... After we're done drawing all of our opaque triangles we're going to disable the depth buffer update... render semi-transparent surfaces in back to front order."
- #card [Q12] [GOAL] [39:38] According to the lecturer, what is the most important thing to remember about the rasterization pipeline?
  A) It must be extremely fast
  B) It must handle thousands of triangles
  C) The goal is to turn inputs into a final image
  D) The goal is to maximize GPU utilization
	- ANSWER: C
	- EXPLANATION: The lecturer states at [40:03], "So the most important thing to remember is what is our goal what are we trying to do here we're trying to turn some inputs into a final image."
- #card [Q13] [INPUT] [40:54] Which of the following is NOT mentioned as an input to the rasterization pipeline?
  A) List of triangle positions
  B) Texture coordinates (UV)
  C) Object-to-camera transform
  D) Lighting equations
	- ANSWER: D
	- EXPLANATION: Between [40:14] and [41:12], the lecturer lists triangle positions, texture coordinates, camera transform, perspective transform, and image dimensions, but does not mention lighting equations.
- #card [Q14] [PROCESS] [42:04] What is the first transformation applied to triangles in the rasterization pipeline?
  A) Perspective projection
  B) Homogeneous divide
  C) Transformation to camera space
  D) Clipping to the view frustum
	- ANSWER: C
	- EXPLANATION: The lecturer explains at [41:51], "Okay what do we do first to each triangle we transform the triangles into camera space by applying the inverse of the camera transform."
- #card [Q15] [OPTIMIZATION] [43:33] What pre-processing step is performed before rasterizing individual samples of a triangle?
  A) Computing vertex colors
  B) Computing triangle edge equations and attributes
  C) Computing texture coordinates
  D) Computing lighting values
	- ANSWER: B
	- EXPLANATION: The lecturer explains at [43:33], "So we know we're going to need to do lots of checks with the triangle edges are we inside or outside these half planes so we can write down the triangle edge equations and attributes and so forth."
- #card [Q16] [PROCESS] [45:01] What is the final step in processing a triangle in the rasterization pipeline?
  A) Applying shaders
  B) Updating the color buffer if the depth test passed
  C) Performing texture mapping
  D) Computing barycentric coordinates
	- ANSWER: B
	- EXPLANATION: The lecturer states at [45:01], "Right so we update the color buffer if the depth buffer test passed and that's it we've written values into our image now we just repeat this process for all the remaining triangles in our list and we're done."
- #card [Q17] [HARDWARE] [46:35] What key difference does the lecturer point out between the implementation of rasterizers in the class versus in real-world applications?
  A) Real-world rasterizers use different algorithms
  B) Real-world rasterizers are implemented in hardware rather than software
  C) Real-world rasterizers are slower but more accurate
  D) Real-world rasterizers don't use depth buffers
	- ANSWER: B
	- EXPLANATION: The lecturer explains at [47:24], "And so these rasterizers are not going to be implemented in software people aren't writing them on their you know cpus like you're doing for this class but they've actually been baked into hardware these days."
- #card [Q18] [HARDWARE] [48:08] How does the lecturer describe the architecture of a GPU?
  A) A collection of identical CPU cores
  B) A purely software-based parallel system
  C) A heterogeneous multi-core processor with specialized hardware
  D) A single powerful processor with high clock speeds
	- ANSWER: C
	- EXPLANATION: The lecturer states at [48:08], "A gpu is really a heterogeneous multi-core processor so it's not just a big bunch of cpus glued onto a single chip it also has some highly highly specialized hardware that does some of the operations that you now know and love."
- #card [Q19] [TREND] [49:43] What trend in GPU pipeline design does the lecturer identify?
  A) Moving towards less parallelism but higher clock speeds
  B) Moving towards more flexible scheduling of pipeline stages
  C) Moving away from hardware acceleration
  D) Moving towards fixed-function-only designs
	- ANSWER: B
	- EXPLANATION: The lecturer explains at [49:43], "And even more flexible scheduling of stages so rather than just going linear down linearly down the pipeline you can now tell the gpu hey take the data that you computed in this stage and actually feed it back to an earlier stage of the pipeline."
- #card [Q20] [COMPARISON] [51:05] What advantage of ray tracing over rasterization does the lecturer highlight in the NVIDIA demo?
  A) Ray tracing is much faster than rasterization
  B) Ray tracing produces physically accurate lighting effects in real-time
  C) Ray tracing requires less computational power
  D) Ray tracing works better for 2D graphics
	- ANSWER: B
	- EXPLANATION: The lecturer explains at [51:05], "The thing to realize is that all of these lighting effects all these shadows and the light bouncing off various surfaces is all being done in real time. And this is stuff that you really can't pull off very easily with rasterization."
- #card [Q21] [PREVIEW] [51:53] Which of the following topics does the lecturer NOT mention as upcoming in the course?
  A) Geometry
  B) Materials and lighting
  C) Animation
  D) Virtual reality
	- ANSWER: D
	- EXPLANATION: At [52:28], the lecturer previews, "Next time we're going to start talking about geometry and then we're going to move on to materials and lighting and photorealistic rendering and finally near the end of the course we'll talk about animation," but does not mention virtual reality.
- #card [Q22] [CONCEPTUAL] [24:03] What does the lecturer compare the alpha channel to when discussing unpremultiplication?
  A) The w-component in homogeneous coordinates
  B) A scaling factor in linear algebra
  C) A depth value in the z-buffer
  D) A color component like RGB
	- ANSWER: A
	- EXPLANATION: The lecturer makes this connection around [24:57], asking "Does this division remind you of anything does this division and adding a fourth coordinate onto our vectors does that remind you of anything we've seen before... hopefully it reminds you of our discussion of homogeneous coordinates."
- #card [Q23] [INTERPRETATION] [25:23] In the homogeneous color model, what does the lecturer say different opacities of the same color represent geometrically?
  A) Different angles in color space
  B) Different points along a line in that direction
  C) Different planes in 3D space
  D) Different distances from the origin
	- ANSWER: B
	- EXPLANATION: The lecturer explains at [25:23], "Right so now we can think of colors as different directions and different opacities of those colors as points along the line in that direction."
- #card [Q24] [PROBLEM] [26:51] In the upsampling example with the blue blob, what was causing the green halo artifact?
  A) Incorrect perspective projection
  B) Improper depth testing
  C) Using non-premultiplied alpha with the background color bleeding through
  D) A bug in the rendering algorithm
	- ANSWER: C
	- EXPLANATION: The lecturer demonstrates that when using non-premultiplied alpha, the green background color from the original image bleeds through during upsampling and compositing, creating the green halo effect.
- #card [Q25] [SCENARIO] [28:13] Why is building mipmaps for textures with alpha values particularly important?
  A) It reduces memory usage
  B) It allows proper filtering at texture edges for semi-transparent objects like leaves
  C) It improves depth testing
  D) It eliminates the need for sorting transparent primitives
	- ANSWER: B
	- EXPLANATION: The lecturer explains at [28:36] that proper filtering is important for rendering objects like tree leaves with transparent edges, which is why correct mipmapping with alpha values matters.
- #card [Q26] [PROCESS] [29:38] In the pre-multiplied downsampling approach, what happens to the color values first?
  A) They are divided by alpha
  B) They are multiplied by alpha
  C) They are added together then averaged
  D) They are converted to grayscale
	- ANSWER: B
	- EXPLANATION: The lecturer states at [29:38], "If on the other hand we were to pre-multiply the color so we multiply color by alpha right so now we get just green and black."
- #card [Q27] [CALCULATION] [31:17] When compositing two identical 50% opaque bright red primitives using non-premultiplied alpha, what RGB value do you get?
  A) (0.5, 0, 0)
  B) (0.75, 0, 0)
  C) (1.0, 0, 0)
  D) (0.25, 0, 0)
	- ANSWER: B
	- EXPLANATION: The lecturer calculates at [31:35], "If we do the arithmetic here we get 0.75 0 0," showing the resulting RGB value is (0.75, 0, 0).
- #card [Q28] [RESULT] [32:56] What is the final RGB color when compositing two identical 50% opaque bright red primitives using pre-multiplied alpha?
  A) (0.5, 0, 0)
  B) (0.75, 0, 0)
  C) (1.0, 0, 0)
  D) (0.25, 0, 0)
	- ANSWER: C
	- EXPLANATION: The lecturer explains at [32:41], "But remember that to recover the original color i'm going to actually divide by alpha so the color i get is bright red 1 0 0 and the alpha i get is still that .75."
- #card [Q29] [ADVANTAGE] [33:48] Which of these is mentioned as an advantage of pre-multiplied alpha for the graphics pipeline?
  A) It requires less memory
  B) It fits naturally with homogeneous coordinates already used in the pipeline
  C) It makes depth testing more accurate
  D) It allows for faster ray tracing
	- ANSWER: B
	- EXPLANATION: The lecturer states at [34:02], "And also it fits naturally into the rasterization pipeline we've already built so we've already said homogeneous coordinates are a good idea we're going to work with 4x4 matrices our graphics card is built that way."
- #card [Q30] [CHALLENGE] [35:04] What fundamental assumption does compositing with the "over" operator make that creates challenges for handling depth?
  A) That all primitives are fully opaque
  B) That all primitives are the same color
  C) That primitives are drawn in back-to-front order
  D) That primitives never intersect
	- ANSWER: C
	- EXPLANATION: The lecturer explains at [35:57], "The key word here is the word over because we're compositing our colors using this over operation we're assuming that a is over b right that we're drawing things in the right order and we're not worrying about occlusion only if things are drawn in back to front order."
- #card [Q31] [PROBLEM] [36:59] What makes sorting transparent triangles particularly difficult?
  A) They require special shaders
  B) There may be no valid ordering when triangles intersect each other
  C) They have too many vertices
  D) They don't work with the depth buffer
	- ANSWER: B
	- EXPLANATION: The lecturer explains at [36:35], "We have to deal with these issues of primitives intersecting each other if we have two triangles intersecting each other there may be no ordering that gives us the right answer."
- #card [Q32] [TECHNIQUE] [38:05] In the two-pass approach for rendering mixed opaque and transparent primitives, what happens to the depth buffer between passes?
  A) It's cleared completely
  B) It's preserved but updates are disabled
  C) It's inverted
  D) It's replaced with a different buffer
	- ANSWER: B
	- EXPLANATION: The lecturer states at [38:46], "After we're done drawing all of our opaque triangles we're going to disable the depth buffer update we're no longer going to change the depth values."
- #card [Q33] [INPUT] [40:54] What format does the lecturer mention the positions are stored in?
  A) Cartesian coordinates
  B) Polar coordinates
  C) Homogeneous coordinates
  D) Barycentric coordinates
	- ANSWER: C
	- EXPLANATION: The lecturer states at [40:54], "By the way all of these positions are also in homogeneous coordinates."
- #card [Q34] [STAGE] [42:04] What happens during the "clipping" stage of the pipeline?
  A) Triangles are stretched to fit the screen
  B) Colors are clipped to a valid range
  C) Triangles outside the view are discarded, and partially visible triangles are cut into smaller ones
  D) Alpha values are set to zero or one
	- ANSWER: C
	- EXPLANATION: The lecturer explains at [42:17], "We perform clipping so we discard triangles that lie outside the unit cube if they're completely inside the unit cube we keep them and if they are partially contained in this cube well we have to do a little work to cut them up into smaller triangles."
- #card [Q35] [OPTIMIZATION] [43:33] What is the purpose of triangle setup in the rasterization pipeline?
  A) To position triangles on the screen
  B) To compute data once that will be reused for every sample point
  C) To determine triangle color
  D) To check if triangles are visible
	- ANSWER: B
	- EXPLANATION: The lecturer explains at [43:44], "Basically look at our code that does the rasterization and say is there something that's getting recomputed over and over and over again for every sample that we could just pull out of that loop and compute once ahead of time."
- #card [Q36] [DECISION] [45:01] What determines whether a sample's color is written to the color buffer?
  A) If it passes the alpha test
  B) If it passes the depth test
  C) If it has a non-zero alpha value
  D) If it's inside the triangle
	- ANSWER: B
	- EXPLANATION: The lecturer states at [45:01], "We update the color buffer if the depth buffer test passed."
- #card [Q37] [REQUIREMENT] [46:35] What requirement of modern rasterization pipelines necessitates hardware implementation?
  A) The need to support ray tracing
  B) The need to handle extremely high complexity and performance
  C) The need to use pre-multiplied alpha
  D) The need to support multiple monitors
	- ANSWER: B
	- EXPLANATION: The lecturer explains at [46:52], "The goal of these rasterization pipelines is to render scenes with extremely high complexity they need to render thousands and millions of triangles with complex transforms and shaders and you have really high resolution outputs right 10 megapixels with super sampling."
- #card [Q38] [HARDWARE] [48:08] What specific hardware components does the lecturer mention GPUs have for graphics operations?
  A) Ray tracing cores and tensor cores
  B) Hardware for bilinear filtering, clipping triangles, and blending operations
  C) Neural network accelerators
  D) Specialized SIMD units
	- ANSWER: B
	- EXPLANATION: The lecturer specifically mentions at [48:27], "It has hardware for doing bilinear filtering of textures it has hardware for clipping triangles it has hardware for doing blending operations like the over operation."
- #card [Q39] [EVOLUTION] [49:43] How has GPU design evolved according to the lecturer?
  collapsed:: true
  A) From specialized hardware to completely general-purpose processors
  B) From parallel to sequential processing
  C) From fixed function to more programmable stages while maintaining specialized hardware
  D) From large chips to smaller ones
	- ANSWER: C
	- EXPLANATION: The lecturer explains at [49:07], "Okay so although gpus have gone more and more toward programmability toward flexibility they still benefit from having some very specialized components."
- #card [Q40] [LIMITATION] [51:05] What limitation of rasterization does the ray tracing demo highlight?
  collapsed:: true
  A) Rasterization cannot handle high polygon counts
  B) Rasterization cannot easily produce realistic lighting, shadows and reflections
  C) Rasterization is too slow for real-time applications
  D) Rasterization uses too much memory
	- ANSWER: B
	- EXPLANATION: The lecturer states at [51:10], "And this is stuff that you really can't pull off very easily with rasterization you can pull various tricks to kind of get these effects but to get the true physically based appearance you really need this ray tracing technology."
- #card [Q41] [ROADMAP] [51:53] In what order does the lecturer say the remaining topics will be covered in the course?
  collapsed:: true
  A) Animation, geometry, materials and lighting
  B) Materials and lighting, geometry, animation
  C) Geometry, materials and lighting, animation
  D) Ray tracing, animation, geometry
	- ANSWER: C
	- EXPLANATION: The lecturer outlines at [52:28], "Next time we're going to start talking about geometry and then we're going to move on to materials and lighting and photorealistic rendering and finally near the end of the course we'll talk about animation."
-
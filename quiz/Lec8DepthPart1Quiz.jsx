'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Layers } from 'lucide-react'

// Source: lectures/cg-08-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 8: Depth & Transparency — Part 1 · QQF1–QQ29 · 32 questions (29 MCQ, 3 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-08-lecture-quiz.md 8

const quizData = [
  {
    id: 1,
    qid: `QF1`,
    qtype: `FLOW`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `Lecture 8 is described as "wrapping up the rasterization pipeline." What two remaining problems does it solve, and why were they deferred until after rasterization and texture mapping were established?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `(1) Depth (occlusion): which of multiple overlapping triangles is visible at each pixel sample? (2) Transparency (alpha blending): how do we composite semi-transparent surfaces? Both were deferred because they depend on earlier stages: depth requires interpolating a per-vertex attribute (depth value) using barycentric coordinates; transparency requires per-fragment alpha values that come from textures. Without rasterization and attribute interpolation in place, neither can be implemented.`,
    intuition: `Depth and transparency are the last two entries in the pipeline diagram — they cap the rasterization unit, not start it.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 2,
    qid: `QF2`,
    qtype: `FLOW`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `The lecture presents two solutions to the occlusion problem: the painter's algorithm and the Z-buffer. What fundamental limitation of the painter's algorithm motivates the Z-buffer?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `The painter's algorithm sorts triangles by depth and draws back-to-front. This fails when triangles intersect or cyclically overlap — no valid sort order exists. It also requires a global sort every frame. The Z-buffer solves this per-sample: for each sample, track the minimum depth seen so far and overwrite only if the new fragment is closer. No sort is required, and intersecting triangles are handled naturally because depth is compared sample-by-sample, not triangle-by-triangle.`,
    intuition: `The painter's algorithm is a global ordering problem. The Z-buffer converts it to a local per-pixel comparison.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 3,
    qid: `QF3`,
    qtype: `ORDER`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `Put these lecture 8 topics in the order they are covered: alpha compositing for transparency / Z-buffer algorithm / depth interpolation using barycentric coordinates / pre-multiplied alpha and its advantages`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `Depth interpolation using barycentric coordinates → Z-buffer algorithm → alpha compositing for transparency → pre-multiplied alpha and its advantages`,
    intuition: `The lecture builds from "how do we compute depth at a sample?" to "which triangle wins?" to "what about transparent things?" to "how do we store colors to composite correctly?"`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 1,
    qid: `Q1`,
    qtype: `INTRODUCTION`,
    format: `mcq`,
    timestamp: `01:38`,
    question: `What does lecture 8 cover to complete the rasterization pipeline?`,
    options: [`Depth (occlusion) and transparency (alpha blending)`, `Shading and antialiasing`, `Normal mapping and displacement mapping`, `Texture mapping and perspective projection`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [01:38], the lecturer states: "The thing we want to do today is talk about how we take those samples generated from each individual primitive and combine them into the final image while taking into account effects like depth and transparency."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 2,
    qid: `Q2`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `01:59`,
    question: `What is the occlusion problem in rasterization?`,
    options: [`How to handle light bouncing between surfaces`, `Which of multiple overlapping triangles is visible at each sample point`, `How to make objects appear semi-transparent`, `How to remove objects that are behind the camera`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [01:59], the lecturer explains: "The question of occlusion is okay we're rendering a bunch of different triangles into our image which of those triangles is visible at each sample point."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 3,
    qid: `Q3`,
    qtype: `PROCESS`,
    format: `mcq`,
    timestamp: `03:27`,
    question: `How is the depth value computed at interior sample points of a triangle?`,
    options: [`By interpolating vertex depths using barycentric coordinates`, `By using the depth of the nearest vertex`, `By shooting a ray from the camera through the pixel`, `By taking the average of the three vertex depths`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [03:27], the lecturer explains: "Well something we discussed a lot in our last lecture was interpolating attributes using barycentric coordinates and that's exactly the right thing to do here because depth varies linearly over the triangle."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 4,
    qid: `Q4`,
    qtype: `CHALLENGE`,
    format: `mcq`,
    timestamp: `03:57`,
    question: `Why does the one-triangle-at-a-time nature of the rasterization pipeline make occlusion challenging?`,
    options: [`It requires too much memory to store all triangles simultaneously`, `Once a triangle is processed and forgotten, there is no direct way to compare it with later triangles`, `Triangles cannot be projected without knowing all other triangles first`, `Texture coordinates are undefined without all triangles`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [03:57–04:16], the lecturer explains: "A triangle comes down the pipeline we do some computation projection rasterization and so forth and then we forget about it we don't have to keep a list of all triangles in the scene... On the other hand that makes it challenging to figure out okay which thing should go in front if i only know about the current triangle how could i possibly figure out which ones should get drawn."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 5,
    qid: `Q5`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `04:36`,
    question: `What does the depth buffer (Z-buffer) store at each sample point?`,
    options: [`The color of the nearest surface`, `The surface normal of the nearest triangle`, `The depth of the closest triangle seen so far at that sample`, `The number of triangles that cover that sample`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [04:36–04:42], the lecturer explains: "The solution to this is a very nice idea called the depth buffer or the z buffer... at each sample point in addition to a color we're also going to keep track of the depth of the closest triangle or the closest primitive seen so far."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 6,
    qid: `Q6`,
    qtype: `INITIALIZATION`,
    format: `mcq`,
    timestamp: `05:02`,
    question: `What value is the depth buffer initialized to before any triangles are drawn?`,
    options: [`Infinity (or the maximum representable depth value)`, `The average depth of the scene`, `The depth of the nearest expected object`, `Zero`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [05:02], the lecturer states: "So you might imagine that initially we initialized the depth buffer to have very very large values you can imagine you set these all to infinity or the maximum possible value that you can represent."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 7,
    qid: `Q7`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `05:52`,
    question: `What key property of the Z-buffer does the lecturer emphasize regarding triangle drawing order?`,
    options: [`Triangles must be drawn front-to-back for correct results`, `The order in which triangles are drawn does not matter`, `Triangles must be drawn back-to-front for correct results`, `Only the first triangle drawn at each pixel is kept`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [05:52], the lecturer states: "And as we'll see very importantly it doesn't matter which one we pick," referring to which triangle to rasterize first.`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 8,
    qid: `Q8`,
    qtype: `ALGORITHM`,
    format: `mcq`,
    timestamp: `09:13`,
    question: `What does the depth test check when rasterizing a new fragment?`,
    options: [`Whether the new fragment's texture coordinates are valid`, `Whether the new fragment falls inside the view frustum`, `Whether the new fragment's color is brighter than the stored color`, `Whether the new fragment's depth is less than the depth stored in the Z-buffer at that sample`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [09:13–09:32], the lecturer explains: "The first thing we do is we check does this new sample pass the depth test so we compare the new depth d to the depth stored in the z buffer at x y... What does this depth test do it's very simple it just says if d1 is less than d2 return true otherwise return false."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 9,
    qid: `Q9`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `10:49`,
    question: `Why does the Z-buffer handle intersecting (interpenetrating) triangles correctly?`,
    options: [`It averages the colors of intersecting triangles`, `It makes occlusion decisions per-sample rather than per-triangle, so relative depth is evaluated exactly where it matters`, `It sorts triangles before rasterizing them`, `It splits intersecting triangles at their intersection line`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [10:49], the lecturer explains: "This occlusion test is based on the depth of the triangles at a given sample point right so the relative depth of triangles can be different at different sample points we're considering things only on a sample by sample basis not on a triangle by triangle basis."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 10,
    qid: `Q10`,
    qtype: `COMPARISON`,
    format: `mcq`,
    timestamp: `11:52`,
    question: `What geometric complexity does the Z-buffer avoid compared to sorting-based approaches?`,
    options: [`Computing triangle normals`, `Finding and splitting triangles at their intersection lines before sorting`, `Projecting triangles into screen space`, `Computing barycentric coordinates`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [11:34–11:52], the lecturer explains: "Probably what i'd have to do is actually find where these two triangles intersect each other split them up at that intersection point into other funky polygons right and then draw those polygons in sorted order actually do a sort. So the depth buffer avoids all of that complexity by just treating things on a sample by sample basis rather than a primitive by primitive basis."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 11,
    qid: `Q11`,
    qtype: `INTERACTION`,
    format: `mcq`,
    timestamp: `12:51`,
    question: `How does depth buffering interact with supersampling for antialiasing?`,
    options: [`Depth buffering is incompatible with supersampling and must be disabled`, `Supersampling requires doubling the depth buffer size separately from the color buffer`, `Depth is only stored at pixel centers, not at supersamples`, `It works correctly as long as there is one depth value per supersample in the buffer`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [12:51], the lecturer states: "Well the key idea here is yeah this will work fine it'll work fine to do depth buffering with super sampling as long as we have one depth sample per sample in our super sample buffer again if we're doing things on a sample by sample basis well then we should have one depth sample for every color sample."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 12,
    qid: `Q12`,
    qtype: `EFFICIENCY`,
    format: `mcq`,
    timestamp: `14:20`,
    question: `What is the memory overhead of adding a Z-buffer compared to a color-only image?`,
    options: [`It requires a sorted list of depths at each sample`, `It doubles storage because depth and color are the same size`, `It adds one additional value per sample — constant space regardless of how many triangles overlap`, `It requires O(n) extra space proportional to the number of triangles`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [14:20–14:36], the lecturer explains: "We used to be storing a color value which might be three values red green blue now we're adding just one additional value a depth so what that means is overall we're just adding constant space for our depth buffer this doesn't depend at all on the number of overlapping primitives there's no fancy data structure to keep track of ordering right just one value the minimum depth value at each sample point."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 13,
    qid: `Q13`,
    qtype: `EFFICIENCY`,
    format: `mcq`,
    timestamp: `14:49`,
    question: `What is the time complexity of the depth test per sample?`,
    options: [`O(1) — just read the buffer, compare, and possibly write a new value`, `O(n) — must compare against all previously drawn triangles`, `O(n²) — requires comparing every pair of triangles`, `O(log n) — requires a binary search through stored depth values`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [14:49], the lecturer states: "We're also adding something that only takes constant time to do an occlusion test per sample right we just read from the depth buffer we do a little check we might modify it and write back a new value or if the depth pass depth check fails we just read."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 14,
    qid: `Q14`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `16:21`,
    question: `In the alpha opacity model, what does the value alpha represent?`,
    options: [`The roughness of a surface for shading`, `The opacity of a surface — a value from 0 (fully transparent) to 1 (fully opaque)`, `The color saturation of a surface`, `The reflectivity of a surface`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [16:21], the lecturer defines: "What is our model for semi-transparent surfaces the basic idea is that we're going to represent the opacity or transparency of a surface by a value alpha so just a real value between 0 and 1 that describes how opaque we are."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 15,
    qid: `Q15`,
    qtype: `ARTIFACT`,
    format: `mcq`,
    timestamp: `18:25`,
    question: `What common artifact arises when color and alpha are not handled correctly during compositing?`,
    options: [`Texture swimming as the camera moves`, `Fringing — dark or colored halos around semi-transparent objects`, `Z-fighting between overlapping surfaces`, `Aliased triangle edges`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [18:25], the lecturer explains: "One of the most common ones is this thing called fringing so if you don't treat your color and alpha just right you get these nasty dark halos around the image... if you watch movies and tv especially if you watch older movies you'll often see this kind of artifact."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 16,
    qid: `Q16`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `19:40`,
    question: `What is the "over" operator?`,
    options: [`An operator that selects the brighter of two pixel colors`, `An operator that multiplies two color values together`, `An operator that blends two images by averaging pixel colors`, `An operator that composites a foreground image B over a background image A using their alpha values`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [19:40], the lecturer defines: "Our basic operation is going to be something called the over operator so the idea of the over operator is to composite an image b that has opacity alpha b over or on top of an image a that has opacity alpha sub a."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 17,
    qid: `Q17`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `20:24`,
    question: `Is the "over" compositing operator commutative?`,
    options: [`Yes — "B over A" always equals "A over B"`, `It is commutative only when both images have alpha = 0.5`, `It is commutative only when both images have the same color`, `No — the order matters, and compositing in the wrong order produces incorrect colors`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [20:24], the lecturer states: "Now what that tells you is that this over operator is not commutative right a over b is not in general the same as b over a and it's really important that you blend things in the right order to get the right color."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 18,
    qid: `Q18`,
    qtype: `FORMULA`,
    format: `mcq`,
    timestamp: `21:20`,
    question: `Using non-premultiplied alpha, what is the formula for the output color when compositing image B (opacity α_B) over image A (opacity α_A)?`,
    options: [`C_out = (C_A + C_B) / 2`, `C_out = C_B + C_A`, `C_out = α_B × C_B + (1 − α_B) × α_A × C_A`, `C_out = α_B × C_B × C_A`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [21:20], the lecturer derives: "Then a simple way to composite would be to say the new color c is alpha b times b... plus 1 minus alpha b times alpha a times a." B contributes its color scaled by α_B; whatever light passes through B (1 − α_B) then sees A scaled by α_A.`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 19,
    qid: `Q19`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `22:42`,
    question: `What is "pre-multiplied alpha," and how does it change how colors are stored?`,
    options: [`Alpha is computed ahead of time and cached in a lookup table`, `The alpha value is squared to increase dynamic range in bright regions`, `The RGB color values are multiplied by alpha before storage, so transparent pixels store darker (attenuated) colors`, `Alpha is always set to 1 before compositing to avoid fringing`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [22:42], the lecturer defines: "Rather than working with the color values directly, we're going to multiply or pre-multiply those color values by the alpha value so we're going to construct a new color a prime which is equal to alpha a a_r alpha a a_g alpha a a_b and we're going to tack on to the end of that the alpha value alpha a." A 50%-transparent bright red (1,0,0,0.5) becomes (0.5,0,0,0.5) in pre-multiplied form.`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 20,
    qid: `Q20`,
    qtype: `ADVANTAGE`,
    format: `mcq`,
    timestamp: `24:03`,
    question: `What advantage does pre-multiplied alpha provide in terms of channel handling during compositing?`,
    options: [`It produces lower quality results at edges but is faster`, `It requires more arithmetic operations but produces higher quality results`, `It requires separate dedicated passes for color and alpha`, `It treats all channels — RGB and alpha — the same way, with no separate operations`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [24:03], the lecturer states: "Notice by the way that this operation composites alpha in exactly the same way as how it composites the red green and blue channels right we don't have separate operations for color and alpha."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 21,
    qid: `Q21`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `25:10`,
    question: `What mathematical framework from earlier in the course is pre-multiplied alpha related to?`,
    options: [`Taylor series expansion`, `Homogeneous coordinates`, `Barycentric coordinates`, `Fourier analysis`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [25:10], the lecturer states: "Hopefully it reminds you of our discussion of homogeneous coordinates because that's exactly what this is we're expressing our colors and our alpha values in homogeneous coordinates."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 22,
    qid: `Q22`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `25:23`,
    question: `In the homogeneous color model, what do different opacities of the same color represent geometrically?`,
    options: [`Different distances from the white point`, `Different angles in color space`, `Different planes in 3D color space`, `Different points along a ray through the origin in the direction of that color`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [25:23], the lecturer explains: "Right so now we can think of colors as different directions and different opacities of those colors as points along the line in that direction."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 23,
    qid: `Q23`,
    qtype: `VISUAL`,
    format: `mcq`,
    timestamp: `26:51`,
    question: `What visual artifact appears when using non-premultiplied alpha during upsampling and compositing a blue blob on a gray background?`,
    options: [`Pixelation and blocky edges along the boundary`, `A green halo around the blob`, `The blob becomes completely transparent`, `A bright white halo around the blob`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [26:51], the lecturer demonstrates: "And i get this result and you notice it looks almost right i have a blue blob on a gray background but there's this green halo around my blue blob that's no good."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 24,
    qid: `Q24`,
    qtype: `PROBLEM`,
    format: `mcq`,
    timestamp: `26:51`,
    question: `Why does non-premultiplied upsampling produce a colored halo at transparent edges?`,
    options: [`The depth buffer incorrectly clips edge pixels`, `The background color from the original image bleeds into the transparent border during filtering, before alpha is applied`, `The perspective projection distorts UV coordinates near edges`, `Bilinear filtering cannot handle alpha values below 0.5`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `When using non-premultiplied alpha, filtering blends raw color values (including transparent pixels that store the green background color) without regard to alpha. The background color bleeds into the border, producing a colored halo in the final composite.`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 25,
    qid: `Q25`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `28:13`,
    question: `What practical rendering scenario motivates the need to correctly downsample textures that contain alpha?`,
    options: [`Terrain height-map displacement mapping`, `Character skin shading with subsurface scattering`, `Shadow map generation for point lights`, `Rendering tree leaves mapped as textured quads, where correct mipmap filtering of alpha edges matters`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [28:36], the lecturer explains: "I want to render leaves in my scene i have trees made of polygons i want to draw as just quads with textures on them okay and to do this in a nice way i want to map my textures so i get nice filtering so i'd like to build mint maps like this."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 26,
    qid: `Q26`,
    qtype: `PROCESS`,
    format: `mcq`,
    timestamp: `29:38`,
    question: `When downsampling using pre-multiplied alpha, what happens to the colors at transparent pixels before averaging?`,
    options: [`They are set to white (1,1,1) to avoid color contamination`, `They are replaced with the background color of the scene`, `They are multiplied by alpha, making them dark/black at fully transparent regions`, `They are averaged with adjacent opaque pixels before premultiplying`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [29:38], the lecturer explains: "If on the other hand we were to pre-multiply the color so we multiply color by alpha right so now we get just green and black," showing that fully transparent pixels become black, preventing their color from contaminating the average.`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 27,
    qid: `Q27`,
    qtype: `PROCESS`,
    format: `mcq`,
    timestamp: `29:57`,
    question: `After downsampling pre-multiplied colors, how is the final color recovered before compositing?`,
    options: [`By multiplying the averaged color by alpha again`, `By subtracting the background color from the result`, `By dividing the averaged pre-multiplied color by the averaged alpha`, `By clamping the color to the [0,1] range`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [29:57], the lecturer explains: "So if we divide the dark green by this this medium gray that's actually going to multiply it it's going to make it brighter and then when we composite it over the white background we get this nice light green color kind of what we would expect to see at the edge of our composited leaf."`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 28,
    qid: `Q28`,
    qtype: `CALCULATION`,
    format: `mcq`,
    timestamp: `31:17`,
    question: `When compositing a 50%-opaque bright red primitive over another 50%-opaque bright red primitive using non-premultiplied alpha, what is the resulting alpha?`,
    options: [`0.75`, `0.5`, `1.0`, `0.25`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [31:35], the lecturer calculates: "And our alpha gets blended like this 0.5 plus 1 minus 0.5 times 0.5 is 0.75." Using α_B + (1 − α_B) × α_A = 0.5 + 0.5 × 0.5 = 0.75.`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
  },
  {
    id: 29,
    qid: `Q29`,
    qtype: `CALCULATION`,
    format: `mcq`,
    timestamp: `31:17`,
    question: `When compositing two identical 50%-opaque bright red primitives using non-premultiplied alpha, what RGB value do you get before un-premultiplying?`,
    options: [`(0.75, 0, 0)`, `(1.0, 0, 0)`, `(0.5, 0, 0)`, `(0.25, 0, 0)`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [31:17], the lecturer calculates: α_B × C_B + (1 − α_B) × α_A × C_A = 0.5 × 1 + 0.5 × 0.5 × 1 = 0.75. The result is (0.75, 0, 0) — a dark red — which does not look like bright red even though both inputs were bright red.`,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-08-lecture-quiz.md`,
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

export default function Lec8Part1Quiz() {
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
    accent: '#67e8f9', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec8'
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
          <Layers size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 8: Depth & Transparency — Part 1</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Z-buffer, painter's algorithm, alpha blending, order-independent</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-08-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec8/1`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec8/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
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
          <Layers size={20} /> Start Quiz
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
              <Layers size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 8: Depth & Transparency — Part 1</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-08-lecture-quiz.md.</p>
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
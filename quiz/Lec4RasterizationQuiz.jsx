'use client'
import { useState, useEffect, useRef } from 'react'
import { Monitor } from 'lucide-react'

// Lecture 4: Rasterization & Sampling — 64 questions

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
    timestamp: `00:35`,
    question: `What is the basic principle of rasterization according to the lecture?`,
    options: [`For each pixel, determine which primitive it contains`, `For each primitive, determine which pixels it covers`, `For each triangle, compute its barycentric coordinates`, `For each image, determine the viewing frustum`],
    answer: 1,
    explanation: `At [00:35], the lecturer states: "Rasterization basically says for each primitive we want to draw each triangle or line segment or point which pixels of the image should get lit up."`,
    images: ["image_1771995310239_0.png"],
  },
  {
    num: 2,
    timestamp: `00:42`,
    question: `According to the lecture, what is a key advantage of rasterization?`,
    options: [`It produces more photorealistic images`, `It works well with curved surfaces`, `It can be made extremely fast`, `It handles transparency better`],
    answer: 2,
    explanation: `At [00:42], the lecturer explains: "This technique is extremely popular extremely valuable because it can be made extremely fast. We can get billions of triangles on the screen every second if we're using modern graphics hardware."`,
    images: ["image_1771995625008_0.png"],
  },
  {
    num: 3,
    timestamp: `01:35`,
    question: `What is the main difference between rasterization and ray tracing described in the lecture?`,
    options: [`Ray tracing is more common in video games`, `Rasterization takes longer to compute`, `Ray tracing is pixel-centric while rasterization is primitive-centric`, `Rasterization can handle curved surfaces better`],
    answer: 2,
    explanation: `At [01:35], the lecturer explains that ray tracing asks "for each pixel which primitives are seen through that pixel," contrasting with rasterization which asks "for each primitive which pixels it covers."`,
    images: ["image_1771995779127_0.png"],
  },
  {
    num: 4,
    timestamp: `01:58`,
    question: `What is a significant limitation of ray tracing according to the lecture?`,
    options: [`It cannot handle transparent surfaces`, `It is much slower than rasterization`, `It requires specialized hardware`, `It cannot produce photorealistic images`],
    answer: 1,
    explanation: `At [01:58], the lecturer states: "Ray tracing is a lot slower we might have to wait minutes or even hours to generate one image rather than drawing billions of triangles per second or having hundreds of frames per second on the gpu."`,
    images: ["image_1771995781860_0.png"],
  },
  {
    num: 5,
    timestamp: `02:26`,
    question: `What is a key characteristic of stages in a graphics pipeline?`,
    options: [`They operate independently from each other`, `They all run in parallel`, `They have highly structured input and output data`, `They are programmed in hardware`],
    answer: 2,
    explanation: `At [02:38], the lecturer explains that "each one of these stages is going to request data as input in a very structured way, some really simple regular description of the input data, and likewise it's going to have some simple regular structure for the output data."`,
    images: ["image_1771995841829_0.png"],
  },
  {
    num: 6,
    timestamp: `02:57`,
    question: `Why is having highly structured data in the graphics pipeline valuable?`,
    options: [`It makes debugging easier`, `It allows for standardized protocols`, `It enables simplified and optimized computation`, `It ensures compatibility with hardware`],
    answer: 2,
    explanation: `At [02:57], the lecturer states: "Because this data is highly structured and highly predictable you can really go to town and simplify and optimize the computation within that stage."`,
    images: ["image_1771995932491_0.png"],
  },
  {
    num: 7,
    timestamp: `04:24`,
    question: `What were the two main components used to represent a 3D shape in the first lecture example?`,
    options: [`Vertices and colors`, `Triangles and textures`, `Vertices and edges`, `Points and normals`],
    answer: 2,
    explanation: `At [04:24], the lecturer recalls: "We said we could represent the cube or any other kind of three-dimensional shape as two things: a collection of vertices, vertex locations in space, and a collection of edges saying which of those vertices get connected together to make line segments."`,
    images: ["image_1771995940681_0.png"],
  },
  {
    num: 8,
    timestamp: `06:59`,
    question: `What specialized hardware is typically used to perform rasterization?`,
    options: [`CPU (Central Processing Unit)`, `GPU (Graphics Processing Unit)`, `APU (Accelerated Processing Unit)`, `FPGA (Field-Programmable Gate Array)`],
    answer: 1,
    explanation: `At [06:59], the lecturer explains: "Real rasterization is typically performed by what's called a graphics processing unit or a GPU. So this is a real physical piece of hardware that sits inside your computer and it has a chip on it that's different from your CPU."`,
    images: ["image_1771995973214_0.png"],
  },
  {
    num: 9,
    timestamp: `08:31`,
    question: `What is one of the key advantages of using triangles for rasterization?`,
    options: [`They require less memory than other primitives`, `They are always planar (have a well-defined plane)`, `They can represent curved surfaces perfectly`, `They are faster to process than points or lines`],
    answer: 1,
    explanation: `At [09:16], the lecturer states: "Another thing that's good about triangles is that they're always planar they always have a well-defined plane passing through the three vertices."`,
    images: ["image_1771995996932_0.png"],
  },
  {
    num: 10,
    timestamp: `09:42`,
    question: `Why is the planarity of triangles particularly important for shading?`,
    options: [`It makes texturing easier`, `It allows for faster processing`, `It ensures a well-defined normal direction`, `It simplifies memory storage`],
    answer: 2,
    explanation: `At [09:42], the lecturer explains: "It's extremely important for shading. So if I want to shade a surface I often need to know what is the normal direction what is the direction orthogonal to the surface and so for a triangle that normal is always well defined."`,
    images: ["image_1771996003755_0.png"],
  },
  {
    num: 11,
    timestamp: `09:56`,
    question: `What advantage of triangles related to data at vertices is mentioned in the lecture?`,
    options: [`They allow for automatic level-of-detail`, `They enable easy interpolation of data across the triangle`, `They provide better compression of vertex data`, `They support complex texturing operations`],
    answer: 1,
    explanation: `At [09:56], the lecturer states: "It'll also turn out to be very easy to interpolate data at corners so if I have three color values at the corners of a triangle and I want to smoothly blend those color values across the rest of the triangle, it's going to be really really simple and efficient."`,
    images: ["image_1771996850703_0.png"],
  },
  {
    num: 12,
    timestamp: `11:28`,
    question: `What is the first stage in the rasterization pipeline described in the lecture?`,
    options: [`Projection onto the 2D screen`, `Sampling triangle coverage`, `Transformation and positioning in the world`, `Interpolating attributes at vertices`],
    answer: 2,
    explanation: `At [11:28], the lecturer states: "The first thing we're going to do once we have our list of triangles is we're going to transform and position these things in the world in the scene where we want them to be."`,
    images: ["image_1771996856893_0.png"],
  },
  {
    num: 13,
    timestamp: `13:44`,
    question: `What is the basic question of rasterization according to the lecture?`,
    options: [`For each pixel, which triangle is closest to the camera?`, `For each triangle, which pixels are covered by it?`, `For each vertex, which pixels should be affected?`, `For each image, how many triangles are visible?`],
    answer: 1,
    explanation: `At [13:44], the lecturer directly states: "For a given triangle for this red triangle here what pixels does the triangle overlap that's the basic question of rasterization the question of coverage."`,
    images: ["image_1771996867247_0.png"],
  },
  {
    num: 14,
    timestamp: `14:01`,
    question: `What is meant by the "occlusion question" in the lecture?`,
    options: [`Which triangles are too small to be visible?`, `Which triangles are outside the viewing frustum?`, `Which triangles should be culled?`, `When multiple triangles cover a pixel, which one is visible?`],
    answer: 3,
    explanation: `At [14:01], the lecturer explains: "We know that the red triangle covers this pixel we might know that another triangle the blue triangle covers this pixel which one is closer to the camera which color value do we finally see and that's the question of occlusion."`,
    images: ["image_1771997084252_0.png"],
  },
  {
    num: 15,
    timestamp: `14:15`,
    question: `What is another name for the occlusion problem mentioned in the lecture?`,
    options: [`The culling problem`, `The hidden surface problem`, `The visibility problem`, `The z-buffer problem`],
    answer: 2,
    explanation: `At [14:15], the lecturer states: "This second question this question is called the visibility problem."`,
    images: ["image_1771997069120_0.png"],
  },
  {
    num: 16,
    timestamp: `16:32`,
    question: `When defining what it means for a pixel to be covered by a triangle, which case is straightforward according to the lecture?`,
    options: [`When the triangle partially covers the pixel`, `When the triangle's edge passes through the pixel`, `When the triangle completely covers the pixel`, `When the triangle's vertex is inside the pixel`],
    answer: 2,
    explanation: `At [17:03], the lecturer explains: "Triangle four is also pretty easy, four covers the entire pixel so it's really easy to say yeah for sure the pixel is covered by triangle four."`,
    images: ["image_1771997185693_0.png"],
  },
  {
    num: 17,
    timestamp: `17:50`,
    question: `What approach does the lecturer suggest for handling partial pixel coverage?`,
    options: [`Always treat partially covered pixels as fully covered`, `Record the fraction of the pixel area covered by the triangle`, `Never count partially covered pixels`, `Randomly decide whether to count partial coverage`],
    answer: 1,
    explanation: `At [17:50], the lecturer states: "Instead of just recording a binary value yes or no maybe one option is to say really what we want to know is the fraction of the pixel area covered by the triangle."`,
    images: ["image_1771997211546_0.png"],
  },
  {
    num: 18,
    timestamp: `18:52`,
    question: `Why is it difficult to compute the exact coverage fraction when multiple triangles are involved?`,
    options: [`Triangles might have different colors`, `The math is too complex to compute in real-time`, `Complex regions of overlap can form non-convex shapes`, `Triangles might have different depths`],
    answer: 2,
    explanation: `At [18:57], the lecturer explains the challenge: "We might have non-convex regions where they overlap and so forth."`,
    images: ["image_1771997219796_0.png"],
  },
  {
    num: 19,
    timestamp: `20:22`,
    question: `What is the sampling approach to determining coverage?`,
    options: [`Calculate the area of triangle-pixel overlap analytically`, `Test several sample points and use statistics to estimate coverage`, `Use a lookup table for predetermined coverage patterns`, `Approximate the triangle with smaller primitives`],
    answer: 1,
    explanation: `At [20:22], the lecturer explains: "We're not going to compute the exact or analytical answer but instead we're going to test a collection of sample points right and we're just going to say for each sample point which triangle do we see."`,
    images: ["image_1771997254170_0.png"],
  },
  {
    num: 20,
    timestamp: `21:09`,
    question: `What is the basic definition of sampling given in the lecture?`,
    options: [`Converting analog signals to digital values`, `Selecting values of a function at specific points`, `Reducing the resolution of an image`, `Removing high-frequency components from a signal`],
    answer: 1,
    explanation: `At [21:09], the lecturer states: "Sampling all that means is I pick some values x naught x1 x2 x3 and so on and I ask what is the value of the function at those points."`,
    images: ["image_1771997323964_0.png"],
  },
  {
    num: 21,
    timestamp: `21:33`,
    question: `What example of a common sampled signal is given in the lecture?`,
    options: [`Digital photographs`, `Audio files`, `Vector graphics`, `3D models`],
    answer: 1,
    explanation: `At [21:33], the lecturer gives this example: "A great example of this would be an audio file so an audio file that you use to listen to music stores samples of a one-dimensional signal what is that signal it's the amplitude."`,
    images: ["image_1771997334974_0.png"],
  },
  {
    num: 22,
    timestamp: `21:52`,
    question: `According to the lecture, at what rate is most consumer audio sampled?`,
    options: [`22,000 times per second`, `32,000 times per second`, `44,000 times per second`, `48,000 times per second`],
    answer: 2,
    explanation: `At [21:52], the lecturer states: "In fact most consumer audio is sampled 44,000 times a second to get a realistic reproduction of sound."`,
    images: ["image_1771997342659_0.png"],
  },
  {
    num: 23,
    timestamp: `22:33`,
    question: `What is the reconstruction problem in signal processing?`,
    options: [`Finding the original signal from a degraded version`, `Converting a digital signal back to analog form`, `Creating a continuous function from discrete samples`, `Removing noise from a sampled signal`],
    answer: 2,
    explanation: `At [22:33], the lecturer defines the problem: "How do you turn those numbers back into a continuous signal that you can listen to and that's the problem of reconstruction... given a set of samples how can we cook up some continuous function some function where we know the value at every point in time rather than just at the sample times."`,
    images: ["image_1771997354506_0.png"],
  },
  {
    num: 24,
    timestamp: `23:21`,
    question: `What is the most basic reconstruction approach described in the lecture?`,
    options: [`Linear interpolation`, `Piecewise constant approximation`, `Cubic splines`, `Sine wave interpolation`],
    answer: 1,
    explanation: `At [23:21], the lecturer explains: "One really basic idea would be to use a piecewise constant approximation. I don't know what the function is equal to for every value of x so what I'm going to do is just say okay find the closest value of x where I do know the function value and just use that one."`,
    images: ["image_1771997377787_0.png"],
  },
  {
    num: 25,
    timestamp: `24:27`,
    question: `What issue with piecewise linear reconstruction is highlighted in the lecture?`,
    options: [`It requires too much computation`, `It can miss significant features between sample points`, `It creates artificial high frequencies`, `It uses too much memory`],
    answer: 1,
    explanation: `At [24:27], the lecturer points out: "I've completely missed some of these big bumps in the function especially near the end I have these two huge bumps between x2 and x3 that don't show up at all in my piecewise linear approximation."`,
    images: ["image_1771997414620_0.png"],
  },
  {
    num: 26,
    timestamp: `24:56`,
    question: `What is the most basic solution to improve reconstruction quality?`,
    options: [`Use a more sophisticated interpolation method`, `Apply a smoothing filter`, `Increase the sampling rate`, `Use frequency domain techniques`],
    answer: 2,
    explanation: `At [24:56], the lecturer explains: "The most basic thing we could do is we could just say how about we sample the signal more densely how about we just take more sample points if we missed certain features then we should just sample more frequently and we'll capture those features." The next question skips this sldie`,
    images: ["image_1771997426297_0.png", "image_1771997568372_0.png"],
  },
  {
    num: 27,
    timestamp: `28:14`,
    question: `How does the lecture define the coverage function for rasterization?`,
    options: [`A function that returns the depth of each pixel`, `A binary function that indicates whether a point is inside a triangle (1) or not (0)`, `A function that determines pixel color based on triangle properties`, `A function that calculates triangle area`],
    answer: 1,
    explanation: `At [28:14], the lecturer explains: "The coverage function is a function defined at every single point in the entire plane... and it's equal to one if that point is contained inside the triangle and it's equal to zero otherwise."`,
    images: ["image_1771997491695_0.png"],
  },
  {
    num: 28,
    timestamp: `29:06`,
    question: `What challenge arises when an edge passes directly through a sample point?`,
    options: [`The computation becomes too slow`, `It's ambiguous which triangle covers the pixel`, `The pixel appears darker than it should`, `The algorithm fails completely`],
    answer: 1,
    explanation: `At [29:06], the lecturer asks: "I have two triangles meeting at an edge and that edge passes exactly through my sample point. So what do I do? Is this sample point covered by triangle one or is it covered by triangle two or is it in some sense covered by both of them?"`,
    images: ["image_1771997713972_0.png", "image_1771997770145_0.png", "image_1771997762595_0.png"],
  },
  {
    num: 29,
    timestamp: `29:53`,
    question: `What is one approach mentioned for handling edge cases when a sample point falls exactly on a triangle edge?`,
    options: [`Always count both triangles sharing the edge`, `Never count points exactly on edges`, `Classify based on whether it's a top edge or left edge`, `Move the sample point slightly`],
    answer: 2,
    explanation: `At [29:53], the lecturer explains: "If an edge falls directly on a screen sample point for instance you could say the sample is classified within the triangle if the edge is a top edge or a left edge."`,
    images: ["image_1771997805702_0.png"],
  },
  {
    num: 30,
    timestamp: `31:46`,
    question: `In the context of displaying sampled image values, what does a pixel represent according to the lecture?`,
    options: [`A mathematical point with no area`, `A square of light with uniform color`, `A triangular region on screen`, `A weighted average of surrounding points`],
    answer: 1,
    explanation: `At [31:46], the lecturer states: "Each image sample sent to the display is converted into roughly speaking a little square of light and maybe you get to specify the color of that light."`,
    images: ["image_1771997934002_0.png"],
  },
  {
    num: 31,
    timestamp: `31:57`,
    question: `According to the lecture, what does the term "pixel" stand for?`,
    options: [`Picture cell`, `Picture element`, `Pixelated image`, `Point index location`],
    answer: 1,
    explanation: `At [31:57], the lecturer explains: "The word pixel is just an abbreviation for picture element right you have a picture it's your entire screen one little element of that is a pixel."`,
    images: ["image_1771998071836_0.png"],
  },
  {
    num: 32,
    timestamp: `33:47`,
    question: `What is aliasing in the context of computer graphics?`,
    options: [`When one triangle is rendered on top of another`, `When a mismatch occurs between sampling and reconstruction`, `When colors look different on different displays`, `When triangles are too small to be visible`],
    answer: 1,
    explanation: `At [33:47], the lecturer introduces: "This leads us into a discussion of something that's really core to computer graphics which is the phenomenon of aliasing," and throughout the lecture explains it as a mismatch between sampling and reconstruction causing misrepresentation of the original signal.`,
    images: ["image_1771998130102_0.png", "image_1771998135778_0.png"],
  },
  {
    num: 33,
    timestamp: `35:34`,
    question: `How does the lecture suggest we can understand signals like audio?`,
    options: [`As a sequence of amplitudes over time`, `As a superposition or sum of different frequencies`, `As a set of discrete events`, `As a series of waveforms`],
    answer: 1,
    explanation: `At [35:34], the lecturer states: "A 1D signal like audio can be expressed as a superposition or a sum of different frequencies."`,
    images: ["image_1771998186382_0.png"],
  },
  {
    num: 34,
    timestamp: `38:30`,
    question: `In the pitch-rising experiment, what unexpected phenomenon was observed?`,
    options: [`The audio became distorted`, `The frequency remained constant`, `The pitch appeared to rise and fall repeatedly`, `The sound became inaudible`],
    answer: 2,
    explanation: `At [38:30], the lecturer describes: "Rather than just going from low to high and higher and higher and higher it went from low to high back down to low back up to high back down to low what is going on there?"`,
    images: ["image_1771998301424_0.png"],
  },
  {
    num: 35,
    timestamp: `38:50`,
    question: `What explains the unexpected result in the pitch experiment?`,
    options: [`A bug in the audio playback system`, `Interference between multiple sound waves`, `Undersampling of the high-frequency signal`, `Incorrect frequency generation`],
    answer: 2,
    explanation: `At [38:50], the lecturer explains: "If we under sample if we have too few points to capture all of the little wiggles in that sound wave then we're going to get aliasing we're going to get a sound that doesn't actually represent the original continuous signal."`,
    images: ["image_1771998474964_0.png"],
  },
  {
    num: 36,
    timestamp: `40:22`,
    question: `How does the lecturer define aliasing in the audio example?`,
    options: [`When audio frequencies exceed human hearing range`, `When high frequencies masquerade as low frequencies after reconstruction`, `When digital audio cannot reproduce analog sounds`, `When sound becomes too distorted to recognize`],
    answer: 1,
    explanation: `At [40:22], the lecturer states: "In this case this is what we mean by aliasing high frequencies in the original signal quickly oscillating waves masquerade as low frequencies after we perform the reconstruction because we've under sampled.""`,
    images: ["image_1771998452042_0.png"],
  },
  {
    num: 37,
    timestamp: `41:44`,
    question: `In the image frequency domain representation shown in the lecture, where are the low frequencies located?`,
    options: [`At the edges of the representation`, `At the dead center`, `Uniformly distributed throughout`, `At the corners only`],
    answer: 1,
    explanation: `At [41:44], the lecturer explains: "This image that we see on the right is kind of like the analyzer the spectral analyzer for the image that we see on the left except this time all the low frequencies are dead center and as we go out in any direction... we're looking at higher and higher frequencies."`,
    images: ["image_1771998501567_0.png"],
  },
  {
    num: 38,
    timestamp: `44:10`,
    question: `What function was used to create the synthetic aliasing example in the lecture?`,
    options: [`sin(x) + sin(y)`, `sin(x² + y²)`, `sin(x) * sin(y)`, `cos(x² - y²)`],
    answer: 1,
    explanation: `At [44:10], the lecturer describes: "We're going to build a function intentionally that has crazy high frequencies in it and that function is sine of x squared plus y squared."`,
    images: ["image_1771998552981_0.png"],
  },
  {
    num: 39,
    timestamp: `45:32`,
    question: `What real-world example of temporal aliasing is described in the lecture?`,
    options: [`Motion blur in photographs`, `Spinning wagon wheels appearing to rotate backwards`, `Lens flare effects`, `Image pixelation when zooming`],
    answer: 1,
    explanation: `At [45:32], the lecturer explains: "If it's ever been nighttime you're looking out the car window at a car next to you and you stare at the hubcaps you'll see an effect like this. Maybe as the car leaves through the stop light the wheels start spinning faster and faster and rather than looking like they're spinning forward they start spinning backward."`,
    images: ["image_1771998614239_0.png"],
  },
  {
    num: 40,
    timestamp: `46:41`,
    question: `What theorem establishes when a signal can be perfectly reconstructed from samples?`,
    options: [`The Fourier Transform Theorem`, `The Sampling Law`, `The Nyquist-Shannon Theorem`, `The Signal Processing Theorem`],
    answer: 2,
    explanation: `At [46:41], the lecturer states: "So how can we be precise about when this phenomenon occurs this is something called the nyquist shannon theorem okay really important theorem in signal processing."`,
    images: [],
  },
  {
    num: 41,
    timestamp: `47:36`,
    question: `According to the Nyquist-Shannon theorem, what condition allows perfect signal reconstruction?`,
    options: [`The signal must be continuous`, `The signal must be sampled at least twice as frequently as its highest frequency`, `The signal must have limited amplitude`, `The signal must be perfectly periodic`],
    answer: 1,
    explanation: `At [47:36], the lecturer explains: "If your signal happens to be band limited then it can be perfectly reconstructed as long as you take samples at a rate that's twice as frequent as the highest frequency in the signal."`,
    images: ["image_1771998665800_0.png"],
  },
  {
    num: 42,
    timestamp: `47:56`,
    question: `What filter is used for perfect reconstruction according to the Nyquist-Shannon theorem?`,
    options: [`Gaussian filter`, `Box filter`, `Sync filter`, `Triangle filter`],
    answer: 2,
    explanation: `At [47:56], the lecturer states: "Once you have those samples you can reconstruct exactly the original signal by using something called a sync filter."`,
    images: ["image_1771998802412_0.png"],
  },
  {
    num: 43,
    timestamp: `48:38`,
    question: `Why can't most graphics signals be perfectly reconstructed using the Nyquist-Shannon approach?`,
    options: [`The sampling rate is too low`, `The signals aren't band-limited due to features like hard edges`, `The reconstruction filters are too complex`, `There's too much noise in the signals`],
    answer: 1,
    explanation: `At [48:57], the lecturer explains: "Here's our triangle our coverage function how do I express something like a hard edge as a sum of sinusoids? Well actually it turns out that what I have to do is add an infinite series of higher and higher and higher frequencies until I can eventually approximate something like a piecewise constant function."`,
    images: ["image_1771998941026_0.png"],
  },
  {
    num: 44,
    timestamp: `50:39`,
    question: `What common aliasing artifact appears in static images with straight lines?`,
    options: [`Moire patterns`, `Jaggies (jagged edges)`, `Banding`, `Pixel bleeding`],
    answer: 1,
    explanation: `At [50:39], the lecturer describes: "Really really common artifacts in graphics or you have let's say jaggies in a in a static image if I draw a line segment it has these jagged edges."`,
    images: ["image_1771998975218_0.png"],
  },
  {
    num: 45,
    timestamp: `51:39`,
    question: `What is the ideal goal when trying to reduce aliasing in pixel coverage?`,
    options: [`To remove all high frequencies from the scene`, `To match the total light in a pixel with the total light in the original signal`, `To use the minimum number of samples possible`, `To randomize the sampling pattern`],
    answer: 1,
    explanation: `At [51:39], the lecturer explains: "If we think of a pixel as a little square of light then what we want is that the total light emitted from that pixel to be the same as the total light that we had in our original continuous signal in other words we want to integrate the input signal over the pixel to get the sample value."`,
    images: ["image_1771999074308_0.png"],
  },
  {
    num: 46,
    timestamp: `53:02`,
    question: `What anti-aliasing technique is described in the lecture?`,
    options: [`Adaptive sampling`, `Super sampling`, `Anisotropic filtering`, `Gaussian blur`],
    answer: 1,
    explanation: `At [53:02], the lecturer explains: "So what we're really going to do is use a technique called super sampling rather than just taking one sample of the signal the coverage signal at each pixel we're going to take several samples."`,
    images: ["image_1771999129670_0.png"],
  },
  {
    num: 47,
    timestamp: `53:54`,
    question: `How are the multiple samples used in super sampling anti-aliasing?`,
    options: [`The brightest sample is selected`, `The samples are averaged to determine the pixel's coverage`, `The median value is used`, `The samples are combined using a weighted formula`],
    answer: 1,
    explanation: `At [53:54], the lecturer explains: "If some fraction of the samples are covered let's say half of them are covered well then we say okay 50% of that pixel is covered right so we just use the fraction of sample values that are covered to get an approximation of the fraction of the pixel that's covered."`,
    images: ["image_1771999227390_0.png"],
  },
  {
    num: 48,
    timestamp: `55:16`,
    question: `What improvement was observed when increasing from 4 samples per pixel to 16 samples per pixel?`,
    options: [`The image became perfectly aliasing-free`, `There was no visible difference`, `The image became smoother but still had some artifacts`, `The image became darker`],
    answer: 2,
    explanation: `At [55:16], the lecturer observes: "So now in each pixel we have 4x4 or 16 samples things get a little bit smoother okay still not perfect."`,
    images: ["image_1771999256302_0.png"],
  },
  {
    num: 49,
    timestamp: `55:42`,
    question: `Even with 1024 samples per pixel, what was observed about the anti-aliasing result?`,
    options: [`It became perfect with no visible artifacts`, `It still wasn't perfect`, `It became too blurry`, `It introduced new artifacts`],
    answer: 1,
    explanation: `At [55:30], the lecturer states: "So now we do 32 by 32 we have 1024 samples taken for every single pixel and we average them back down so even though this looks a lot better you notice it's still not perfect."`,
    images: [],
  },
  {
    num: 50,
    timestamp: `55:54`,
    question: `What special case for perfect anti-aliasing is mentioned in the lecture?`,
    options: [`Straight line segments`, `Checkerboard patterns`, `Circular shapes`, `Uniform color regions`],
    answer: 1,
    explanation: `At [55:54], the lecturer notes: "In this very very special case of the checkerboard there happens to be an exact solution you can analytically integrate the checkerboard over a pixel and get this beautifully smooth image."`,
    images: ["image_1771999301034_0.png"],
  },
  {
    num: 51,
    timestamp: `57:10`,
    question: `What is the most basic operation needed for triangle rasterization?`,
    options: [`Computing triangle area`, `Testing if a point is inside a triangle`, `Finding the closest point on a triangle`, `Calculating triangle perimeter`],
    answer: 1,
    explanation: `At [57:10], the lecturer explains: "The most basic thing that we need to do is say okay we have this triangle we have this pixel grid we want to know which pixels are covered by the triangle we can just break this down into an atomic query which is how do we check if a given point q is inside a triangle with vertices p0 p1 p2."`,
    images: ["image_1771999356654_0.png"],
  },
  {
    num: 52,
    timestamp: `58:12`,
    question: `How is the point-in-triangle test typically implemented?`,
    options: [`Using barycentric coordinates`, `Computing distance to each edge`, `Testing if the point is inside the three half-planes defined by the edges`, `Calculating angle sums`],
    answer: 2,
    explanation: `At [58:12], the lecturer explains: "How do you test if a point's inside of a triangle? Well I know that if it's contained in the half plane made by the bottom edge and the right edge and the left edge then it must be inside the triangle."`,
    images: ["image_1771999387129_0.png"],
  },
  {
    num: 53,
    timestamp: `59:36`,
    question: `What optimization is mentioned for incremental point-in-triangle testing?`,
    options: [`Using graphics hardware acceleration`, `Reusing calculations between adjacent pixels`, `Pre-computing lookup tables`, `Approximating triangles with rectangles`],
    answer: 1,
    explanation: `At [59:36], the lecturer describes: "I can make this a little bit faster by noticing that the half plane check looks very similar for nearby points so I can save myself some arithmetic by not going through these points in a random order but by marching let's say along rows of the triangle and incrementally updating my calculations."`,
    images: ["image_1771999404785_0.png"],
  },
  {
    num: 54,
    timestamp: `1:00:04`,
    question: `What does the lecturer identify as the primary bottleneck in modern hardware?`,
    options: [`Arithmetic computations`, `Memory access`, `Cache size`, `Power consumption`],
    answer: 1,
    explanation: `At [1:00:04], the lecturer states: "In real modern hardware the bottleneck is typically not doing arithmetic doing math but the bottleneck is reading or writing to memory."`,
    images: ["image_1771999436931_0.png"],
  },
  {
    num: 55,
    timestamp: `1:00:46`,
    question: `What approach does modern hardware take to triangle rasterization?`,
    options: [`Sequential processing of each pixel`, `Testing all samples in the triangle's bounding box in parallel`, `Using a lookup table for common triangle shapes`, `Processing one scan line at a time`],
    answer: 1,
    explanation: `At [1:00:46], the lecturer explains: "What we're going to do instead is just test all the samples in the bounding box around the triangles so it's kind of the tightest fitting box around the triangle we're going to test all those samples in parallel."`,
    images: ["image_1771999512661_0.png"],
  },
  {
    num: 56,
    timestamp: `1:02:09`,
    question: `What shape of triangle was identified as problematic for the parallel bounding box approach?`,
    options: [`Very small triangles`, `Triangles with obtuse angles`, `Long, skinny triangles`, `Triangles with curved edges`],
    answer: 2,
    explanation: `At [1:02:09], the lecturer describes: "You can imagine for instance that I had just one long skinny triangle that stretched all the way across the screen right and so now if I'm testing all the points in the bounding box almost none of them are going to be covered I'm wasting a lot of time."`,
    images: ["image_1771999527981_0.png"],
  },
  {
    num: 57,
    timestamp: `1:02:40`,
    question: `What optimization technique tests larger blocks before individual pixels?`,
    options: [`Hierarchical decomposition`, `Scan conversion`, `Block-based optimization`, `Stochastic sampling`],
    answer: 2,
    explanation: `At [1:02:33], the lecturer introduces: "I can take kind of a hybrid or course define approach and first ask if large blocks of pixels intersect the triangle so before testing any individual pixel I draw some kind of medium size square."`,
    images: ["image_1771999609505_0.png"],
  },
  {
    num: 58,
    timestamp: `1:03:00`,
    question: `What is the benefit of the early-out test with blocks?`,
    options: [`It improves cache coherence`, `It allows hardware acceleration`, `It avoids unnecessary work on pixels not covered by the triangle`, `It simplifies the triangle intersection test`],
    answer: 2,
    explanation: `At [1:03:00], the lecturer explains: "If I know that this gray box in the upper left doesn't intersect the triangle at all then I don't need to do any more work none of those none of those pixels are covered."`,
    images: [],
  },
  {
    num: 59,
    timestamp: `1:04:49`,
    question: `What important graphics concept is introduced with the recursive block testing approach?`,
    options: [`Dynamic programming`, `Hierarchical strategy`, `Backtracking`, `Divide and conquer`],
    answer: 1,
    explanation: `At [1:04:49], the lecturer states: "This leads to another really really important idea in all of computer graphics which is to take a hierarchical strategy."`,
    images: ["image_1771999662712_0.png"],
  },
  {
    num: 60,
    timestamp: `1:06:16`,
    question: `Why isn't hierarchical rasterization commonly used in real graphics hardware?`,
    options: [`It produces visual artifacts`, `It requires too much memory`, `The overhead of traversal is too high`, `It's patented and requires licensing`],
    answer: 2,
    explanation: `At [1:06:16], the lecturer explains: "This is actually not what happens in real graphics hardware because there's still quite a bit of overhead to doing this hierarchical traversal so having just one course to find level is kind of a nice sweet spot."`,
    images: [],
  },
  {
    num: 61,
    timestamp: `1:07:20`,
    question: `What is one of the key frameworks mentioned in the summary for understanding graphics problems?`,
    options: [`Object-oriented programming`, `Sampling and reconstruction`, `Linear algebra`, `Calculus of variations`],
    answer: 1,
    explanation: `At [1:07:20], the lecturer summarizes: "Overall today what we saw is that we can frame a lot of problems in computer graphics in terms of sampling and reconstruction."`,
    images: [],
  },
  {
    num: 62,
    timestamp: `1:08:27`,
    question: `What does the lecturer describe as the basic strategy for reducing aliasing in rasterization?`,
    options: [`Blurring the image`, `Using super sampling`, `Decreasing the resolution`, `Using different primitive shapes`],
    answer: 1,
    explanation: `At [1:08:27], the lecturer concludes: "Our basic strategy for reducing aliasing at least for rasterization was to use super sampling."`,
    images: [],
  },
  {
    num: 63,
    timestamp: `1:08:57`,
    question: `According to the summary, what is the "basic building block" for the graphics pipeline?`,
    options: [`Pixel shading`, `Vertex transformation`, `Triangle rasterization`, `Texture mapping`],
    answer: 2,
    explanation: `At [1:08:57], the lecturer states: "From a more system point of view we saw that triangle rasterization is the basic building block for the graphics pipeline."`,
    images: [],
  },
  {
    num: 64,
    timestamp: `1:09:51`,
    question: `What topic will be covered in the next lecture according to the professor?`,
    options: [`Texture mapping`, `Animation`, `3D transformations`, `Lighting models`],
    answer: 2,
    explanation: `At [1:09:51], the lecturer concludes: "Next time we're going to talk about another important stage of the pipeline was how we actually do these 3D transformations." -`,
    images: [],
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

export default function MonitorQuiz() {
  const [screen, setScreen] = useState('welcome')
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const timer = useTimer()
  const q = quizData[idx]
  const ACCENT = '#34d399'

  const card = { background: '#1e293b', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid #334155' }

  if (screen === 'welcome') return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'system-ui,sans-serif' }}>
      <Monitor size={48} color={ACCENT} style={{ marginBottom: '1.5rem' }} />
      <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem' }}>Lecture 4: Rasterization & Sampling</h1>
      <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Pipeline, Coverage, Aliasing, SSAA, Nyquist</p>
      <p style={{ color: ACCENT, fontWeight: 600, marginBottom: '2rem' }}>64 questions</p>
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
          <h1 style={{ color: ACCENT, fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Lecture 4: Rasterization & Sampling — Results</h1>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Monitor size={20} color={ACCENT} /><span style={{ color: ACCENT, fontWeight: 600 }}>Lecture 4: Rasterization & Sampling</span></div>
          <div style={{ display: 'flex', gap: '1.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
            <span>{timer.fmt(timer.elapsed)}</span>
            <span>{idx+1} / 64</span>
            <span style={{ color: ACCENT }}>Score: {score}</span>
          </div>
        </div>

        {/* Progress */}
        <div style={{ background: '#1e293b', borderRadius: '99px', height: '6px', marginBottom: '1.5rem' }}>
          <div style={{ background: ACCENT, height: '100%', borderRadius: '99px', width: `${((idx+1)/64)*100}%`, transition: 'width 0.3s' }} />
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
            {idx + 1 >= 64 ? 'See Results' : 'Next Question →'}
          </button>}
        </div>
      </div>
    </div>
  )
}
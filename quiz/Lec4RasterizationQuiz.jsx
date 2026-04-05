'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Monitor } from 'lucide-react';

/**
 * CMU 15-462/662 Computer Graphics — Lecture 4
 * Drawing a Triangle and an Intro to Sampling
 * Topics: Rasterization, Graphics Pipeline, Triangle Primitives,
 *         Coverage, Sampling Theory, Aliasing, Anti-Aliasing (SSAA)
 */

<style>
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
</style>

// ─── SVG Diagrams ─────────────────────────────────────────────

const DiagramRasterVsRay = () => (
  <svg viewBox="0 0 260 140" width="260" height="140">
    <rect x="5" y="5" width="120" height="130" rx="6" fill="#1e2a3a"/>
    <rect x="135" y="5" width="120" height="130" rx="6" fill="#1e2a3a"/>
    <text x="45" y="22" fill="#4ade80" fontSize="11" fontFamily="Rajdhani" fontWeight="700" textAnchor="middle">RASTERIZATION</text>
    <text x="195" y="22" fill="#f472b6" fontSize="11" fontFamily="Rajdhani" fontWeight="700" textAnchor="middle">RAY TRACING</text>
    {/* Rasterization: for each triangle → pixels */}
    <polygon points="20,50 80,35 90,90" fill="#4ade8020" stroke="#4ade80" strokeWidth="1.5"/>
    <text x="55" y="75" fill="#4ade80" fontSize="9" fontFamily="Rajdhani" textAnchor="middle">triangle</text>
    {[35,55,75].map((y,i)=>[40,60,80,100].map((x,j)=>(
      <rect key={`${i}${j}`} x={x-7} y={y-7} width="12" height="12" rx="2"
        fill={(i===1&&j===1)||(i===1&&j===2)||(i===2&&j===1)?'#4ade8040':'none'} stroke="#4ade8030" strokeWidth="0.5"/>
    )))}
    <text x="65" y="118" fill="#94a3b8" fontSize="9" fontFamily="Rajdhani" textAnchor="middle">for each tri → pixels</text>
    {/* Ray tracing: for each pixel → triangles */}
    {[35,55,75,95].map((y,i)=>[148,168,188,208].map((x,j)=>(
      <rect key={`r${i}${j}`} x={x-7} y={y-7} width="12" height="12" rx="2" fill="none" stroke="#f472b630" strokeWidth="0.5"/>
    )))}
    <line x1="168" y1="28" x2="220" y2="75" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4,2"/>
    <polygon points="215,55 235,90 225,95" fill="#f472b620" stroke="#f472b6" strokeWidth="1"/>
    <text x="195" y="118" fill="#94a3b8" fontSize="9" fontFamily="Rajdhani" textAnchor="middle">for each pixel → tris</text>
  </svg>
);

const DiagramCoverage = () => (
  <svg viewBox="0 0 240 160" width="240" height="160">
    <defs>
      <marker id="cv1" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
        <polygon points="0 0,6 2.5,0 5" fill="#fbbf24"/>
      </marker>
    </defs>
    {/* Pixel grid */}
    {[0,1,2,3].map(row=>[0,1,2,3].map(col=>{
      const x=20+col*50, y=20+row*35;
      const inside=(row===1&&col>=1)||(row===2&&col>=0&&col<=2);
      return <rect key={`${row}${col}`} x={x} y={y} width="48" height="33" rx="3"
        fill={inside?'#22c55e20':'#1e2a3a'} stroke={inside?'#22c55e':'#2a3a4a'} strokeWidth={inside?1.5:0.8}/>;
    }))}
    {/* Triangle overlay */}
    <polygon points="65,25 195,25 115,130" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="5,3"/>
    {/* Sample points */}
    {[0,1,2,3].map(row=>[0,1,2,3].map(col=>{
      const cx=44+col*50, cy=37+row*35;
      const inside=(row===1&&col>=1)||(row===2&&col>=0&&col<=2);
      return <circle key={`p${row}${col}`} cx={cx} cy={cy} r="3" fill={inside?'#22c55e':'#94a3b8'}/>;
    }))}
    <text x="10" y="150" fill="#94a3b8" fontSize="10" fontFamily="Rajdhani">coverage(p) = 1 inside triangle, 0 outside</text>
  </svg>
);

const DiagramAliasing = () => (
  <svg viewBox="0 0 260 130" width="260" height="130">
    <rect x="5" y="5" width="250" height="120" rx="6" fill="#1e2a3a"/>
    <text x="130" y="22" fill="#ef4444" fontSize="11" fontFamily="Rajdhani" fontWeight="700" textAnchor="middle">Aliasing — High Freq Masquerades as Low Freq</text>
    {/* Original high-freq signal */}
    {Array.from({length:100},(_,i)=>{
      const x=15+i*2.3, y=60-18*Math.sin(i*0.6);
      return i===0?`M${x},${y}`:`L${x},${y}`;
    }).join(' ')}
    <path d={Array.from({length:100},(_,i)=>{const x=15+i*2.3,y=60-18*Math.sin(i*0.6);return i===0?`M${x},${y}`:`L${x},${y}`;}).join(' ')} fill="none" stroke="#4ade80" strokeWidth="1.5"/>
    {/* Sample points (sparse) */}
    {Array.from({length:10},(_,i)=>{
      const x=25+i*23, y=60-18*Math.sin(i*6);
      return <circle key={i} cx={x} cy={y} r="3.5" fill="#fbbf24" stroke="#0a0a0f" strokeWidth="1"/>;
    })}
    {/* Reconstructed low-freq alias */}
    <path d={Array.from({length:100},(_,i)=>{const x=15+i*2.3,y=60-18*Math.sin(i*0.06);return i===0?`M${x},${y}`:`L${x},${y}`;}).join(' ')} fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,3"/>
    <text x="15" y="118" fill="#4ade80" fontSize="9" fontFamily="Rajdhani">original signal</text>
    <text x="100" y="118" fill="#fbbf24" fontSize="9" fontFamily="Rajdhani">samples</text>
    <text x="175" y="118" fill="#ef4444" fontSize="9" fontFamily="Rajdhani">alias (reconstructed)</text>
  </svg>
);

const DiagramSSAA = () => (
  <svg viewBox="0 0 260 130" width="260" height="130">
    <rect x="5" y="5" width="120" height="120" rx="6" fill="#1e2a3a"/>
    <rect x="135" y="5" width="120" height="120" rx="6" fill="#1e2a3a"/>
    <text x="65" y="20" fill="#94a3b8" fontSize="10" fontFamily="Rajdhani" textAnchor="middle">1 sample/pixel</text>
    <text x="195" y="20" fill="#38bdf8" fontSize="10" fontFamily="Rajdhani" textAnchor="middle">4×4 = 16 samples/pixel</text>
    {/* Left: 1 sample — jagged edge */}
    {[0,1,2,3].map(row=>[0,1,2,3].map(col=>{
      const x=15+col*25, y=25+row*25, inside=col+row>=4;
      return <rect key={`l${row}${col}`} x={x} y={y} width="23" height="23" rx="1"
        fill={inside?'#4ade8060':'none'} stroke="#2a3a4a" strokeWidth="0.8"/>;
    }))}
    {/* Right: 16 samples — smooth */}
    {[0,1,2,3].map(row=>[0,1,2,3].map(col=>{
      const x=145+col*25, y=25+row*25;
      const frac = Math.max(0,Math.min(1,(col+row-3.5)*0.4));
      return <rect key={`r${row}${col}`} x={x} y={y} width="23" height="23" rx="1"
        fill={`rgba(74,222,128,${frac*0.7})`} stroke="#2a3a4a" strokeWidth="0.8"/>;
    }))}
    <text x="65" y="118" fill="#94a3b8" fontSize="9" fontFamily="Rajdhani" textAnchor="middle">binary — jaggies</text>
    <text x="195" y="118" fill="#38bdf8" fontSize="9" fontFamily="Rajdhani" textAnchor="middle">averaged — smooth</text>
  </svg>
);

const DiagramPointInTriangle = () => (
  <svg viewBox="0 0 260 160" width="260" height="160">
    <defs>
      {['h1','h2','h3'].map((id,i)=>(
        <marker key={id} id={id} markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0,6 2.5,0 5" fill={['#4ade80','#f472b6','#fbbf24'][i]}/>
        </marker>
      ))}
    </defs>
    <polygon points="50,130 210,130 130,20" fill="#38bdf810" stroke="#38bdf8" strokeWidth="2"/>
    {/* Half-plane normals */}
    <line x1="130" y1="130" x2="130" y2="100" stroke="#4ade80" strokeWidth="1.8" markerEnd="url(#h1)"/>
    <line x1="175" y1="80" x2="155" y2="90" stroke="#f472b6" strokeWidth="1.8" markerEnd="url(#h2)"/>
    <line x1="85" y1="80" x2="100" y2="90" stroke="#fbbf24" strokeWidth="1.8" markerEnd="url(#h3)"/>
    {/* Test point inside */}
    <circle cx="128" cy="95" r="5" fill="#22c55e"/>
    <text x="134" y="93" fill="#22c55e" fontSize="10" fontFamily="Rajdhani">inside ✓</text>
    {/* Test point outside */}
    <circle cx="30" cy="80" r="5" fill="#ef4444"/>
    <text x="38" y="78" fill="#ef4444" fontSize="10" fontFamily="Rajdhani">outside ✗</text>
    <text x="10" y="152" fill="#94a3b8" fontSize="10" fontFamily="Rajdhani">Point inside ↔ on correct side of ALL 3 edges</text>
  </svg>
);

// ─── Quiz Data ─────────────────────────────────────────────────
const quizData = [
  // ─── RASTERIZATION BASICS ────────────────────────────────
  {
    id: 1,
    question: "What is the core principle of rasterization?",
    questionType: "single-choice",
    options: [
      "For each pixel, determine which primitives are visible through it",
      "For each primitive, determine which pixels it covers",
      "For each triangle, compute its barycentric coordinates first",
      "For each frame, sort all primitives by depth"
    ],
    answer: 1,
    explanation: {
      intuition: "Rasterization is primitive-centric: grab a triangle, ask 'which pixels does this triangle light up?' — then move to the next triangle. Ray tracing is the opposite: grab a pixel, ask which triangle it sees.",
      reference: "[00:35] 'Rasterization basically says for each primitive we want to draw — each triangle, line segment, or point — which pixels of the image should get lit up.'",
      computation: `# Rasterization loop (conceptual)
for triangle in scene:
    for pixel in bounding_box(triangle):
        if point_in_triangle(pixel.center, triangle):
            framebuffer[pixel] = shade(triangle, pixel)`,
      connection: "[01:35] Ray tracing asks 'for each pixel which primitive is seen' — the dual question. Rasterization wins on speed; ray tracing wins on global lighting."
    },
    section: "Rasterization [00:35]", topic: "RASTERIZATION", difficulty: "Easy",
    slideImages: ["image_1771995310239_0.png","image_1771995625008_0.png"],
    diagram: <DiagramRasterVsRay />,
  },
  {
    id: 2,
    question: "What is the key speed advantage of rasterization over ray tracing?",
    questionType: "single-choice",
    options: [
      "It produces more photorealistic images",
      "It handles transparency better",
      "Modern GPUs can rasterise billions of triangles per second vs minutes/hours per frame for ray tracing",
      "It requires no projection step"
    ],
    answer: 2,
    explanation: {
      intuition: "Rasterization has highly regular, predictable memory access patterns that GPUs are optimised for. Ray tracing shoots rays in arbitrary directions, causing cache misses and irregular computation.",
      reference: "[00:42] 'This technique is extremely popular because it can be made extremely fast — billions of triangles per second on modern graphics hardware.' [01:58] 'Ray tracing might take minutes or even hours per image.'",
      computation: `# Typical throughput (2024 hardware):
# GPU rasterisation: ~10 billion triangles/second
# Path tracing (offline): ~0.1–1 frame/second at 4K
# Hardware ray tracing (RTX): 1–120 fps (scene dependent)`,
      connection: "[06:59] 'Real rasterization is performed by a GPU — a physical chip different from your CPU with specialised rasterization circuitry.'"
    },
    section: "Rasterization [00:42]", topic: "RASTERIZATION", difficulty: "Easy",
    slideImages: ["image_1771995779127_0.png","image_1771995781860_0.png"],
    diagram: null,
  },
  {
    id: 3,
    question: "What are the two main stages the graphics pipeline performs, according to the lecture?",
    questionType: "single-choice",
    options: [
      "Lighting and shading",
      "Coverage (which pixels a triangle covers) and occlusion (which triangle is visible when multiple cover a pixel)",
      "Projection and clipping",
      "Vertex transformation and texture mapping"
    ],
    answer: 1,
    explanation: {
      intuition: "Every rasteriser must answer two questions: (1) Which pixels does this triangle touch? (coverage) and (2) When two triangles touch the same pixel, which one wins? (occlusion / visibility).",
      reference: "[13:44] 'For a given triangle, what pixels does it overlap? That's the basic question of rasterization — coverage.' [14:01] 'Which one is closer to the camera, which color do we finally see? That's the question of occlusion — the visibility problem.'",
      computation: `# Z-buffer solves occlusion:
for triangle in scene:
    for pixel in covered_pixels(triangle):
        depth = triangle.depth_at(pixel)
        if depth < z_buffer[pixel]:      # closer?
            z_buffer[pixel]     = depth
            framebuffer[pixel]  = shade(triangle, pixel)`,
      connection: "[14:15] 'This second question is called the visibility problem' — solved by the depth (Z) buffer, a key piece of GPU hardware."
    },
    section: "Pipeline [13:44]", topic: "PIPELINE", difficulty: "Easy",
    slideImages: ["image_1771996856893_0.png","image_1771996867247_0.png","image_1771997069120_0.png","image_1771997084252_0.png"],
    diagram: null,
  },
  // ─── WHY TRIANGLES ───────────────────────────────────────
  {
    id: 4,
    question: "Why are triangles chosen as the fundamental primitive in the graphics pipeline?",
    questionType: "multi-select",
    options: [
      "Triangles are always planar — three points uniquely define a plane",
      "Triangles can represent curved surfaces perfectly",
      "Data at vertices (color, normals, UVs) interpolates smoothly across the triangle",
      "Triangles are the fastest primitive for ray tracing"
    ],
    answers: [0, 2],
    explanation: {
      intuition: "Any three points define exactly one plane (never ambiguous like a quad). Barycentric interpolation over a triangle is simple and GPU-hardware-accelerated. Every other polygon can be split into triangles.",
      reference: "[09:16] 'Triangles are always planar — a well-defined plane passes through the three vertices.' [09:56] 'It'll be very easy to interpolate data at corners — three color values blend smoothly across the triangle.'",
      computation: `# Barycentric interpolation across a triangle:
def lerp_triangle(p, p0, p1, p2, v0, v1, v2):
    # weights (λ0, λ1, λ2) with λ0+λ1+λ2=1
    w = barycentric(p, p0, p1, p2)
    return w[0]*v0 + w[1]*v1 + w[2]*v2  # any vertex attribute`,
      connection: "[09:42] 'For shading I need the normal direction — for a triangle the normal is always well-defined, unlike a curved quad.'"
    },
    section: "Triangles [07:39]", topic: "PRIMITIVES", difficulty: "Medium",
    slideImages: ["image_1771995996932_0.png","image_1771996003755_0.png","image_1771996850703_0.png"],
    diagram: null,
  },
  // ─── COVERAGE ────────────────────────────────────────────
  {
    id: 5,
    question: "How is the coverage function defined mathematically?",
    questionType: "single-choice",
    options: [
      "It returns the depth of the nearest triangle at each point",
      "A binary function equal to 1 if a point is inside the triangle, 0 otherwise — defined at every point in the plane",
      "A function that returns the triangle's color at each pixel",
      "A function that returns the fraction of a pixel covered by all triangles"
    ],
    answer: 1,
    explanation: {
      intuition: "The coverage function is a mathematical 0/1 map defined everywhere, not just at pixel centres. Sampling it at pixel centres gives a binary yes/no per pixel. Sampling at multiple sub-pixel locations gives anti-aliased estimates.",
      reference: "[28:14] 'The coverage function is defined at every single point in the plane — equal to 1 if that point is inside the triangle, 0 otherwise.'",
      computation: `def coverage(point, triangle):
    """Returns 1 inside triangle, 0 outside."""
    return 1 if point_in_triangle(point, triangle) else 0

# Sample at pixel centre (1 sample):
c = coverage(pixel_centre, tri)   # binary

# Sample at 4 sub-pixel locations (SSAA 2×2):
c = sum(coverage(s, tri) for s in subsamples) / 4  # 0, 0.25, 0.5, 0.75, or 1`,
      connection: "[20:22] 'We're going to test a collection of sample points and say for each sample point which triangle do we see.' This connects coverage to the general sampling framework."
    },
    section: "Coverage [28:14]", topic: "COVERAGE", difficulty: "Medium",
    slideImages: ["image_1771997254170_0.png","image_1771997491695_0.png"],
    diagram: <DiagramCoverage />,
  },
  {
    id: 6,
    question: "When a triangle edge passes exactly through a sample point, what is a standard rule for resolving the ambiguity?",
    questionType: "single-choice",
    options: [
      "Always count the point as covered by both triangles",
      "Always ignore points on edges",
      "Classify the sample as inside the triangle only if the edge is a top edge or a left edge (top-left rule)",
      "Move the sample point slightly away from the edge"
    ],
    answer: 2,
    explanation: {
      intuition: "When two triangles share an edge and a sample point falls exactly on it, we need a consistent rule so each pixel is counted exactly once. The top-left rule does this — edges pointing left or upward 'claim' the sample point.",
      reference: "[29:53] 'If an edge falls directly on a screen sample point you could say the sample is classified within the triangle if the edge is a top edge or a left edge.'",
      computation: `def is_top_or_left(edge_start, edge_end):
    """Returns True if edge is top (horizontal, going left) or left (going down)."""
    dx = edge_end[0] - edge_start[0]
    dy = edge_end[1] - edge_start[1]
    return (dy == 0 and dx < 0) or (dy < 0)   # top or left`,
      connection: "[29:06] 'Two triangles meeting at an edge — that edge passes exactly through a sample point. Is it covered by triangle 1, 2, or both?' The top-left rule ensures no double-counting and no gaps."
    },
    section: "Coverage [29:06]", topic: "COVERAGE", difficulty: "Hard",
    slideImages: ["image_1771997713972_0.png","image_1771997762595_0.png","image_1771997770145_0.png","image_1771997805702_0.png"],
    diagram: null,
  },
  // ─── SAMPLING THEORY ─────────────────────────────────────
  {
    id: 7,
    question: "What is the basic definition of sampling?",
    questionType: "single-choice",
    options: [
      "Converting analog signals to digital values by measuring at specific points",
      "Picking specific x values and asking what the value of a function is at those points",
      "Reducing the resolution of an image",
      "Removing high-frequency components from a signal"
    ],
    answer: 1,
    explanation: {
      intuition: "Sampling is simply evaluation: choose some inputs, evaluate the function there, record the outputs. The function is continuous; you make it discrete by sampling.",
      reference: "[21:09] 'Sampling all that means is I pick some values x₀, x₁, x₂, x₃ and I ask what is the value of the function at those points.'",
      computation: `import numpy as np
# Continuous function (we can only sample it)
f  = lambda x: np.sin(2*np.pi*x) + 0.5*np.sin(6*np.pi*x)
# Sampling: pick locations and evaluate
x_samples = np.linspace(0, 1, 44100)   # 44100 Hz audio
y_samples  = f(x_samples)              # the samples`,
      connection: "[21:33] Audio: 44,100 samples/second for music. Rasterization: one (or more) coverage sample per pixel. Same concept, different domain."
    },
    section: "Sampling [21:09]", topic: "SAMPLING", difficulty: "Easy",
    slideImages: ["image_1771997323964_0.png","image_1771997334974_0.png","image_1771997342659_0.png"],
    diagram: null,
  },
  {
    id: 8,
    question: "What is the reconstruction problem in signal processing?",
    questionType: "single-choice",
    options: [
      "Finding the original signal from a noisy degraded version",
      "Creating a continuous function from a finite set of discrete samples",
      "Converting a continuous signal to a digital format",
      "Removing aliasing from an existing image"
    ],
    answer: 1,
    explanation: {
      intuition: "You sampled a song at 44,100 points per second. Now the speaker needs a continuous voltage waveform. How do you go from the discrete numbers back to a continuous signal? That's reconstruction.",
      reference: "[22:33] 'How do you turn those numbers back into a continuous signal that you can listen to — that's reconstruction. Given a set of samples, how can we cook up some continuous function?'",
      computation: `# Simplest reconstruction: nearest-neighbour (piecewise constant)
def reconstruct_constant(x_samples, y_samples, x_query):
    idx = np.argmin(np.abs(x_samples - x_query))
    return y_samples[idx]

# Better: linear interpolation
def reconstruct_linear(x_samples, y_samples, x_query):
    return np.interp(x_query, x_samples, y_samples)`,
      connection: "[24:27] Piecewise linear reconstruction can 'miss significant features between sample points' — the motivation for sampling more densely."
    },
    section: "Reconstruction [22:33]", topic: "SAMPLING", difficulty: "Easy",
    slideImages: ["image_1771997354506_0.png","image_1771997377787_0.png","image_1771997414620_0.png"],
    diagram: null,
  },
  {
    id: 9,
    question: "What is aliasing in the context of sampling?",
    questionType: "single-choice",
    options: [
      "When one triangle is rendered on top of another",
      "High-frequency content in the original signal masquerading as low-frequency content after undersampling and reconstruction",
      "When colors look different on different displays",
      "When triangles are too small to be individually visible"
    ],
    answer: 1,
    explanation: {
      intuition: "Sample too infrequently, and a fast wiggle looks like a slow wiggle after reconstruction. The high-frequency signal 'pretends' to be low-frequency — its true identity is hidden by undersampling.",
      reference: "[40:22] 'High frequencies in the original signal — quickly oscillating waves — masquerade as low frequencies after reconstruction because we've undersampled.'",
      computation: `import numpy as np
# High-frequency signal: 10 cycles
f_high = lambda t: np.sin(2*np.pi*10*t)
# Sample at only 12 points (undersampled)
t = np.linspace(0, 1, 12, endpoint=False)
samples = f_high(t)
# Reconstruct → appears as low-frequency alias!
# The aliased frequency = |10 - 12| = 2 cycles`,
      connection: "[45:32] Real-world example: spinning wagon wheels appearing to rotate backward at certain speeds — temporal aliasing."
    },
    section: "Aliasing [40:22]", topic: "ALIASING", difficulty: "Medium",
    slideImages: ["image_1771998130102_0.png","image_1771998135778_0.png","image_1771998452042_0.png","image_1771998474964_0.png"],
    diagram: <DiagramAliasing />,
  },
  {
    id: 10,
    question: "What does the Nyquist-Shannon theorem guarantee?",
    questionType: "single-choice",
    options: [
      "Any signal can be perfectly reconstructed from any set of samples",
      "A band-limited signal can be perfectly reconstructed if sampled at least twice the highest frequency it contains",
      "Aliasing can be completely eliminated with enough samples",
      "The minimum number of samples equals the number of frequencies in the signal"
    ],
    answer: 1,
    explanation: {
      intuition: "If your signal has nothing above frequency f_max, you only need 2·f_max samples per second to capture it perfectly. Sample faster and you're wasting data; sample slower and aliasing appears.",
      reference: "[47:36] 'If your signal happens to be band-limited, it can be perfectly reconstructed as long as you take samples at a rate at least twice as frequent as the highest frequency in the signal.'",
      computation: `# Nyquist rate = 2 * highest_frequency
f_max = 20000   # Hz (human hearing limit)
nyquist_rate = 2 * f_max   # 40,000 Hz minimum
cd_rate      = 44100       # standard — safely above Nyquist

# Reconstruction kernel: sinc filter
import numpy as np
sinc = lambda t: np.sinc(t)   # = sin(πt)/(πt)`,
      connection: "[47:56] 'Once you have those samples you can reconstruct exactly the original signal by using a sinc filter.' This is the theoretical ideal."
    },
    section: "Nyquist-Shannon [46:41]", topic: "SAMPLING_THEORY", difficulty: "Medium",
    slideImages: ["image_1771998665800_0.png","image_1771998802412_0.png"],
    diagram: null,
  },
  {
    id: 11,
    question: "Why can't most graphics signals be perfectly reconstructed using the Nyquist approach?",
    questionType: "single-choice",
    options: [
      "GPUs cannot implement the sinc filter",
      "The sampling rate of a display is always too low",
      "Graphics signals like triangle edges have infinite bandwidth — hard edges require an infinite sum of sinusoids to represent",
      "The Nyquist theorem only applies to 1D audio, not 2D images"
    ],
    answer: 2,
    explanation: {
      intuition: "A perfectly sharp edge jumps from 0 to 1 instantly. To represent that jump as a sum of smooth sinusoids, you need infinitely many high-frequency terms — the signal is not band-limited.",
      reference: "[48:57] 'How do I express a hard edge as a sum of sinusoids? I have to add an infinite series of higher and higher frequencies until I can approximate a piecewise constant function.'",
      computation: `import numpy as np
# Fourier series of a step function (Gibbs phenomenon)
x = np.linspace(-np.pi, np.pi, 1000)
approx = sum(np.sin(k*x)/k for k in range(1, 101, 2)) * 4/np.pi
# Even with 50 terms, ringing (Gibbs) appears at the edge`,
      connection: "[50:39] 'Very common artifact: jaggies on a line segment.' These are the visual consequence of undersampling an infinite-bandwidth signal."
    },
    section: "Aliasing [48:38]", topic: "ALIASING", difficulty: "Hard",
    slideImages: ["image_1771998941026_0.png","image_1771998975218_0.png"],
    diagram: null,
  },
  // ─── ANTI-ALIASING ───────────────────────────────────────
  {
    id: 12,
    question: "What is the ideal goal of anti-aliasing for pixel coverage?",
    questionType: "single-choice",
    options: [
      "Remove all high frequencies from the scene before rasterising",
      "Match each pixel's emitted light to the integral of the original signal over the pixel area",
      "Use the minimum number of samples possible for performance",
      "Randomise the sampling pattern to avoid visible patterns"
    ],
    answer: 1,
    explanation: {
      intuition: "Think of a pixel as a tiny light bulb. Its brightness should equal the average light it would receive from the scene — i.e., ∫f(x,y)dA over the pixel. Integration = averaging = anti-aliasing.",
      reference: "[51:39] 'What we want is that the total light emitted from that pixel should be the same as the total light in the original continuous signal — we want to integrate the input signal over the pixel.'",
      computation: `# Ideal: integrate coverage over pixel area
def ideal_coverage(pixel, triangle):
    # = area of (pixel ∩ triangle) / pixel_area
    intersection_area = clip_triangle_to_pixel(triangle, pixel).area
    return intersection_area / pixel.area   # [0,1]

# Super-sampling approximates this integral`,
      connection: "[53:02] 'We're going to use super-sampling — rather than one sample per pixel, we take several and average them.' The average approximates the integral."
    },
    section: "Anti-Aliasing [51:39]", topic: "ANTI_ALIASING", difficulty: "Medium",
    slideImages: ["image_1771999074308_0.png","image_1771999129670_0.png"],
    diagram: null,
  },
  {
    id: 13,
    question: "How does super-sampling anti-aliasing (SSAA) work?",
    questionType: "single-choice",
    options: [
      "It selects the brightest of multiple samples",
      "It takes multiple sub-pixel samples and averages them to estimate fractional pixel coverage",
      "It blurs the final image with a Gaussian filter",
      "It uses the median of multiple samples"
    ],
    answer: 1,
    explanation: {
      intuition: "Instead of one coin-flip (inside/outside) per pixel, take 16 sub-pixel coin-flips and count how many land inside. If 12 out of 16 are inside, coverage = 75%. More samples → better approximation of the integral.",
      reference: "[53:54] 'If some fraction of the samples are covered, we say that fraction of the pixel is covered — we use the fraction of sample values that are covered to approximate the fraction of the pixel covered.'",
      computation: `def ssaa_coverage(pixel, triangle, n=4):
    """n×n super-sampling."""
    count = 0
    for i in range(n):
        for j in range(n):
            sx = pixel.x + (i + 0.5) / n * pixel.width
            sy = pixel.y + (j + 0.5) / n * pixel.height
            count += point_in_triangle((sx, sy), triangle)
    return count / (n * n)   # fractional coverage`,
      connection: "[55:16] '16 samples per pixel — things get smoother, but still not perfect.' [55:30] 'Even 1024 samples per pixel isn't perfect for infinite-bandwidth signals.'"
    },
    section: "SSAA [53:02]", topic: "ANTI_ALIASING", difficulty: "Medium",
    slideImages: ["image_1771999227390_0.png","image_1771999256302_0.png","image_1771999301034_0.png"],
    diagram: <DiagramSSAA />,
  },
  // ─── POINT-IN-TRIANGLE ────────────────────────────────────
  {
    id: 14,
    question: "How is the point-in-triangle test implemented efficiently?",
    questionType: "single-choice",
    options: [
      "By computing barycentric coordinates and checking all three are positive",
      "By testing if the point lies on the correct side of all three half-planes defined by the triangle edges",
      "By computing the distance from the point to each edge",
      "By checking if the sum of distances to vertices equals the perimeter"
    ],
    answer: 1,
    explanation: {
      intuition: "A triangle is the intersection of three half-planes (one per edge). If a point is on the 'inside' of all three edges simultaneously, it must be inside the triangle.",
      reference: "[58:12] 'If the point is inside the half-plane made by the bottom edge AND the right edge AND the left edge, then it must be inside the triangle.'",
      computation: `import numpy as np

def edge_function(a, b, p):
    """Positive if p is to the left of edge a→b."""
    return (b[0]-a[0])*(p[1]-a[1]) - (b[1]-a[1])*(p[0]-a[0])

def point_in_triangle(p, v0, v1, v2):
    d0 = edge_function(v0, v1, p)
    d1 = edge_function(v1, v2, p)
    d2 = edge_function(v2, v0, p)
    return (d0>=0 and d1>=0 and d2>=0) or (d0<=0 and d1<=0 and d2<=0)`,
      connection: "[59:36] 'I can make this faster by noticing the half-plane check looks very similar for nearby pixels — marching along rows and incrementally updating saves arithmetic.'"
    },
    section: "Point-in-Triangle [57:10]", topic: "ALGORITHM", difficulty: "Medium",
    slideImages: ["image_1771999356654_0.png","image_1771999387129_0.png","image_1771999404785_0.png"],
    diagram: <DiagramPointInTriangle />,
  },
  {
    id: 15,
    question: "What is the bottleneck in modern GPU triangle rasterisation, and what optimisation addresses it?",
    questionType: "single-choice",
    options: [
      "Arithmetic is the bottleneck; reduce the number of multiply operations",
      "Memory access is the bottleneck; test all samples in the triangle's bounding box in parallel to maximise cache coherence",
      "Power consumption is the bottleneck; use fixed-point arithmetic",
      "Triangle submission rate is the bottleneck; batch triangles before sending to GPU"
    ],
    answer: 1,
    explanation: {
      intuition: "GPUs have massive arithmetic throughput. The slow part is fetching and writing data from memory. Testing a bounding box's samples in parallel keeps everything in cache and hides memory latency.",
      reference: "[1:00:04] 'In real modern hardware the bottleneck is typically not doing arithmetic — it's reading or writing to memory.' [1:00:46] 'We test all the samples in the bounding box in parallel.'",
      computation: `# Modern rasterization strategy:
# 1. Compute axis-aligned bounding box (AABB) of triangle
# 2. Subdivide AABB into 8×8 or 16×16 tiles
# 3. Test all sample points in a tile simultaneously (SIMD)
# 4. Memory accesses within a tile are contiguous → cache-friendly

# Problem: long skinny triangles waste work (large bbox, few covered pixels)
# Solution: hierarchical tile testing (see next question)`,
      connection: "[1:02:09] 'A long skinny triangle stretching across the screen — testing all bbox points wastes time since almost none are covered.'"
    },
    section: "Hardware [1:00:04]", topic: "HARDWARE", difficulty: "Medium",
    slideImages: ["image_1771999436931_0.png","image_1771999512661_0.png","image_1771999527981_0.png"],
    diagram: null,
  },
  {
    id: 16,
    question: "What is the hierarchical rasterisation strategy, and why isn't it used in practice?",
    questionType: "single-choice",
    options: [
      "Test large blocks before individual pixels — skip blocks that don't intersect the triangle; not used because it produces visual artifacts",
      "Test large blocks first; if the block doesn't touch the triangle skip it entirely — not used because hierarchical traversal overhead outweighs savings vs. a single coarse level",
      "Sort triangles by size and rasterise largest first; not used because sorting is expensive",
      "Subdivide the triangle recursively; not used because recursion is slow on GPUs"
    ],
    answer: 1,
    explanation: {
      intuition: "A recursive quadtree: test a big tile, if it misses the triangle skip everything inside it. Elegant, but the traversal itself has overhead. One level of coarse tiles is a 'sweet spot' in practice.",
      reference: "[1:02:33] 'I can first ask if large blocks of pixels intersect the triangle.' [1:04:49] 'This leads to an important idea in all of graphics: take a hierarchical strategy.' [1:06:16] 'Not what happens in real hardware because there's quite a bit of overhead to hierarchical traversal.'",
      computation: `# One-level block test (practical sweet spot):
for tile in tiles_in_bbox(triangle):
    if triangle_intersects_tile(triangle, tile):
        for pixel in tile:
            if point_in_triangle(pixel.center, triangle):
                framebuffer[pixel] = shade(...)
    # else: skip entire tile — early out`,
      connection: "[1:04:49] The hierarchical strategy is a key recurring idea in graphics: bounding volume hierarchies (BVH), mip-maps, and octrees all use the same principle."
    },
    section: "Hardware [1:02:33]", topic: "HARDWARE", difficulty: "Hard",
    slideImages: ["image_1771999609505_0.png","image_1771999662712_0.png"],
    diagram: null,
  },
  // ─── SIGNAL PROCESSING ───────────────────────────────────
  {
    id: 17,
    question: "A signal is expressed as a superposition of sinusoids. Why is this useful for understanding aliasing?",
    questionType: "single-choice",
    options: [
      "Because sinusoids are the only signals GPUs can process",
      "Because aliasing affects each frequency independently — you can analyse which frequencies are correctly captured and which are aliased",
      "Because sinusoids are band-limited by definition",
      "Because the Fourier transform is faster than spatial-domain analysis"
    ],
    answer: 1,
    explanation: {
      intuition: "Once you decompose a signal into frequencies, aliasing analysis is simple: any frequency above the Nyquist limit folds back and appears as a lower frequency. You can pinpoint exactly which frequencies cause problems.",
      reference: "[35:34] 'A 1D signal like audio can be expressed as a superposition of different frequencies.' Understanding aliasing then becomes: which frequencies survive sampling intact?",
      computation: `import numpy as np
fs = 100       # sampling rate (Hz)
nyquist = fs/2 # = 50 Hz

# Frequency 30 Hz: below Nyquist → correctly sampled ✓
# Frequency 70 Hz: above Nyquist → aliases to |70-100|=30 Hz ✗
# Both appear as 30 Hz in the sampled signal — indistinguishable!`,
      connection: "[38:50] The pitch-rising audio experiment: the signal rose above Nyquist, aliased back down, producing the eerie up-down cycling pitch effect."
    },
    section: "Frequencies [35:34]", topic: "SIGNAL_THEORY", difficulty: "Medium",
    slideImages: ["image_1771998186382_0.png","image_1771998301424_0.png","image_1771998501567_0.png"],
    diagram: null,
  },
  {
    id: 18,
    question: "What is the primary framework the lecturer says underpins many computer graphics problems?",
    questionType: "single-choice",
    options: [
      "Object-oriented design",
      "Sampling and reconstruction",
      "Recursive ray tracing",
      "Linear algebra and matrix operations"
    ],
    answer: 1,
    explanation: {
      intuition: "Rasterization, texturing, image filtering, audio, animation — all are instances of sample a signal, then reconstruct it. The quality of a graphics system is often determined by how well it handles this sampling–reconstruction cycle.",
      reference: "[1:07:20] 'Overall today we saw that we can frame a lot of problems in computer graphics in terms of sampling and reconstruction.'",
      computation: `# Sampling and reconstruction across graphics:
# Rasterisation:  sample coverage at pixel centres → display pixels
# Texturing:      sample texture at UV coords → filter/reconstruct
# Shadow maps:    sample depth at light → reconstruct shadow test
# Animation:      sample keyframes at time t → interpolated pose
# Image resize:   sample at new grid → reconstruct at new resolution`,
      connection: "[1:08:57] 'Triangle rasterisation is the basic building block for the graphics pipeline.' [1:08:27] 'Our basic anti-aliasing strategy for rasterisation was super-sampling.'"
    },
    section: "Summary [1:07:20]", topic: "FRAMEWORK", difficulty: "Easy",
    slideImages: [],
    diagram: null,
  },
  // ─── DISPLAY & PIXELS ────────────────────────────────────
  {
    id: 19,
    question: "What does the word 'pixel' stand for and how is it physically displayed?",
    questionType: "single-choice",
    options: [
      "Picture kernel — a weighted region of the screen",
      "Picture element — each image sample is converted into a small square of light on the display",
      "Pixel index location — the (x,y) address of a screen position",
      "Pixelated image — the result of downsampling"
    ],
    answer: 1,
    explanation: {
      intuition: "A pixel is a tiny physical light source on your screen. Its colour is set by the image sample value you computed. It glows uniformly over its small square area — that's why you see the grid of squares when you zoom in on a low-resolution image.",
      reference: "[31:46] 'Each image sample sent to the display is converted into roughly speaking a little square of light.' [31:57] 'Pixel is just an abbreviation for picture element.'",
      computation: `# What a GPU pipeline produces:
# framebuffer[x, y] = (R, G, B) value  ← this is the "sample"
# Display hardware converts that sample to a physical square of light
# at position (x,y) on the screen with the specified RGB colour.`,
      connection: "[33:47] This is why aliasing is visible as jagged staircase patterns — each pixel is a square, and squares are axis-aligned. Diagonal edges can only be approximated in a square grid."
    },
    section: "Display [31:46]", topic: "DISPLAY", difficulty: "Easy",
    slideImages: ["image_1771997934002_0.png","image_1771998071836_0.png"],
    diagram: null,
  },
  {
    id: 20,
    question: "What does sin(x² + y²) illustrate about aliasing in 2D images?",
    questionType: "single-choice",
    options: [
      "It shows that all 2D functions can be perfectly sampled",
      "It demonstrates how a function with increasing spatial frequency naturally aliases near its centre, showing concentric ring aliasing artifacts",
      "It shows that aliasing only affects diagonal edges",
      "It demonstrates that anti-aliasing is only needed for audio signals"
    ],
    answer: 1,
    explanation: {
      intuition: "sin(x²+y²) creates concentric rings that get tighter and tighter as you move outward. Near the centre the frequency is low (resolved fine); further out the frequency exceeds Nyquist (aliased into fake low-frequency rings).",
      reference: "[44:10] 'We're going to build a function intentionally that has crazy high frequencies — sin(x²+y²) — and sample it on a 2D grid to see aliasing.'",
      computation: `import numpy as np, matplotlib.pyplot as plt
x = np.linspace(-10, 10, 200)
X, Y = np.meshgrid(x, x)
Z = np.sin(X**2 + Y**2)
# Near centre: rings are wide (low freq) → sampled correctly
# Far from centre: rings are dense (high freq) → aliased
plt.imshow(Z, cmap='gray'); plt.title('sin(x²+y²) aliasing'); plt.show()`,
      connection: "[44:10] This function's frequency grows as r = √(x²+y²), so aliasing radius can be predicted from Nyquist: rings start aliasing where 2r > sampling_rate."
    },
    section: "Aliasing Example [44:10]", topic: "ALIASING", difficulty: "Hard",
    slideImages: ["image_1771998552981_0.png","image_1771998614239_0.png"],
    diagram: null,
  },
];

// ─── Timer ───────────────────────────────────────────────────
const useTimer = () => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    let iv = null;
    if (isActive) iv = setInterval(()=>setTimeSpent(t=>t+1),1000);
    return ()=>clearInterval(iv);
  },[isActive]);
  return { timeSpent, start:()=>setIsActive(true), pause:()=>setIsActive(false), reset:()=>{setTimeSpent(0);setIsActive(false);} };
};
const fmt = s => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

// ─── Main Component ───────────────────────────────────────────
const Quiz = () => {
  const [screen, setScreen]       = useState('welcome');
  const [qIdx, setQIdx]           = useState(0);
  const [answers, setAnswers]     = useState(Array(quizData.length).fill(null));
  const [selected, setSelected]   = useState([]);
  const [showExp, setShowExp]     = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const { timeSpent, start, pause, reset: resetTimer } = useTimer();

  const q = quizData[qIdx];
  useEffect(()=>{if(screen==='quiz'&&!showExp&&!reviewMode)start();else pause();},[screen,showExp,reviewMode,qIdx]);

  const isCorrect = useCallback((q, a) => {
    if (a === null) return false;
    if (q.questionType === 'multi-select') return JSON.stringify([...(a||[])].sort()) === JSON.stringify([...q.answers].sort());
    return a === q.answer;
  }, []);

  const handleSubmit = () => {
    const a=[...answers];
    a[qIdx] = q.questionType==='multi-select' ? selected : selected[0];
    setAnswers(a); setShowExp(true);
  };
  const handleNext    = () => { if(qIdx<quizData.length-1){setQIdx(qIdx+1);setSelected([]);setShowExp(false);}else{setScreen('results');pause();} };
  const handlePrev    = () => { if(qIdx>0){setQIdx(qIdx-1);setSelected(answers[qIdx-1]!==null?(Array.isArray(answers[qIdx-1])?answers[qIdx-1]:[answers[qIdx-1]]):[]);setShowExp(answers[qIdx-1]!==null);} };
  const handleReview  = () => { setQIdx(0);setSelected([]);setShowExp(false);setReviewMode(true);setScreen('quiz'); };
  const handleRestart = () => { setScreen('welcome');setQIdx(0);setAnswers(Array(quizData.length).fill(null));setSelected([]);setShowExp(false);setReviewMode(false);resetTimer(); };

  const score = answers.filter((a,i)=>isCorrect(quizData[i],a)).length;
  const pct   = Math.round(score/quizData.length*100);

  const C = { bg:'#0a0a0f', surface:'#111118', border:'#1a2a1a', accent:'#34d399', accentHover:'#10b981', success:'#22c55e', error:'#ef4444', warning:'#f59e0b', text:'#e2e8f0', muted:'#94a3b8', code:'#0d1f0d' };
  const base = { minHeight:'100vh', background:`linear-gradient(135deg,${C.bg} 0%,#061206 100%)`, color:C.text, fontFamily:"'Rajdhani',sans-serif", padding:'2rem 1rem' };
  const wrap = { maxWidth:'820px', margin:'0 auto', background:C.surface, borderRadius:'16px', padding:'2rem', border:`1px solid ${C.border}` };
  const btn  = { display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.75rem 1.5rem', background:C.accent, color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'1rem', fontFamily:"'Rajdhani',sans-serif", fontWeight:'600', transition:'background 0.2s' };
  const code = { background:C.code, padding:'1rem', borderRadius:'8px', fontSize:'0.82rem', fontFamily:"'JetBrains Mono',monospace", overflowX:'auto', whiteSpace:'pre', color:'#6ee7b7', lineHeight:'1.6' };

  const SlideImages = ({images}) => {
    if(!images||images.length===0) return null;
    return (
      <div style={{marginTop:'1rem'}}>
        <h4 style={{color:C.accent,fontSize:'0.9rem',marginBottom:'0.5rem'}}>📸 Lecture Slides</h4>
        <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
          {images.map((img,i)=>(
            <img key={i} src={`/assets/${img}`} alt={`slide ${i+1}`}
              onError={e=>{e.target.style.display='none';}}
              style={{maxWidth:'100%',flex:'1 1 300px',borderRadius:'8px',border:`1px solid ${C.border}`,objectFit:'contain'}}/>
          ))}
        </div>
      </div>
    );
  };

  if(screen==='welcome') return (
    <div style={base}><div style={wrap}>
      <div style={{textAlign:'center',marginBottom:'2rem'}}>
        <Monitor size={64} color={C.accent}/>
        <h1 style={{fontSize:'2.5rem',fontWeight:'700',color:C.accent,margin:'1rem 0 0.5rem'}}>Lecture 4 Quiz</h1>
        <p style={{color:C.muted,fontSize:'1.1rem'}}>Drawing a Triangle & Intro to Sampling</p>
        <p style={{color:C.muted,fontSize:'0.9rem',fontStyle:'italic'}}>CMU 15-462 • 1:08:59 • Rasterization · Coverage · Sampling · Aliasing · Anti-Aliasing</p>
      </div>
      <div style={{background:'#0d0d12',padding:'1.5rem',borderRadius:'12px',marginBottom:'2rem',border:`1px solid ${C.border}`}}>
        <h3 style={{fontSize:'1.1rem',color:C.accent,marginBottom:'1rem'}}>Topics</h3>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:'0.6rem',fontSize:'0.95rem'}}>
          {['Rasterization vs Ray Tracing','Graphics Pipeline','Why Triangles','Coverage Function','Sampling Theory','Aliasing & Nyquist','Super-Sampling Anti-Aliasing','Point-in-Triangle'].map(t=>(
            <div key={t}><span style={{color:C.accent}}>• </span>{t}</div>
          ))}
        </div>
      </div>
      <div style={{background:'#0d0d12',padding:'1.5rem',borderRadius:'12px',marginBottom:'2rem',border:`1px solid ${C.border}`}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',textAlign:'center'}}>
          {[['20','Questions'],['40%','Easy'],['45%','Medium'],['15%','Hard']].map(([v,l])=>(
            <div key={l}><div style={{fontSize:'1.8rem',fontWeight:'700',color:C.accent}}>{v}</div><div style={{fontSize:'0.85rem',color:C.muted}}>{l}</div></div>
          ))}
        </div>
      </div>
      <button style={{...btn,width:'100%',justifyContent:'center',fontSize:'1.1rem',padding:'1rem'}}
        onMouseEnter={e=>e.target.style.background=C.accentHover} onMouseLeave={e=>e.target.style.background=C.accent}
        onClick={()=>{setScreen('quiz');start();}}><Monitor size={20}/> Start Quiz</button>
    </div></div>
  );

  if(screen==='results') return (
    <div style={base}><div style={wrap}>
      <div style={{textAlign:'center',marginBottom:'2rem'}}>
        <Trophy size={64} color={pct>=70?C.success:pct>=50?C.warning:C.error}/>
        <h1 style={{fontSize:'2.5rem',fontWeight:'700',margin:'1rem 0 0.5rem'}}>Quiz Complete!</h1>
        <p style={{color:C.muted}}><Clock size={16} style={{display:'inline',verticalAlign:'middle',marginRight:'0.4rem'}}/>{fmt(timeSpent)}</p>
      </div>
      <div style={{background:'#0d0d12',padding:'2rem',borderRadius:'12px',marginBottom:'2rem',textAlign:'center',border:`1px solid ${C.border}`}}>
        <div style={{fontSize:'4rem',fontWeight:'700',color:pct>=70?C.success:pct>=50?C.warning:C.error}}>{pct}%</div>
        <div style={{color:C.muted,fontSize:'1.2rem',marginBottom:'0.5rem'}}>{score} / {quizData.length} correct</div>
        <div style={{color:C.muted}}>{pct>=90?'GPU Rasterisation Master!':pct>=70?'Strong Pipeline Knowledge!':pct>=50?'Keep Reviewing!':'Back to Lecture 4!'}</div>
      </div>
      <div style={{display:'flex',gap:'1rem'}}>
        {[['Review',handleReview,BookOpen],['Restart',handleRestart,RefreshCw]].map(([l,fn,Icon])=>(
          <button key={l} style={{...btn,flex:1,justifyContent:'center'}}
            onMouseEnter={e=>e.target.style.background=C.accentHover} onMouseLeave={e=>e.target.style.background=C.accent}
            onClick={fn}><Icon size={18}/>{l}</button>
        ))}
      </div>
    </div></div>
  );

  const renderOptions = () => {
    if(q.questionType==='multi-select') {
      return q.options.map((opt,i)=>{
        const isSelected=selected.includes(i);
        const isAnswer=(q.answers||[]).includes(i);
        return (
          <div key={i} onClick={()=>!showExp&&!reviewMode&&setSelected(prev=>prev.includes(i)?prev.filter(x=>x!==i):[...prev,i])}
            style={{padding:'0.9rem 1rem',borderRadius:'8px',marginBottom:'0.6rem',cursor:showExp||reviewMode?'default':'pointer',transition:'all 0.2s',
              border:`2px solid ${showExp||reviewMode?isAnswer?C.success:isSelected?C.error:C.border:isSelected?C.accent:C.border}`,
              background:showExp||reviewMode?isAnswer?`${C.success}15`:isSelected?`${C.error}15`:C.surface:isSelected?`${C.accent}15`:C.surface}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
              <input type="checkbox" readOnly checked={isSelected} style={{width:'16px',height:'16px'}}/>
              {(showExp||reviewMode)&&(isAnswer?<CheckCircle size={18} color={C.success}/>:isSelected?<XCircle size={18} color={C.error}/>:null)}
              <span>{opt}</span>
            </div>
          </div>
        );
      });
    }
    return q.options.map((opt,i)=>(
      <div key={i} onClick={()=>!showExp&&!reviewMode&&setSelected([i])}
        style={{padding:'0.9rem 1rem',borderRadius:'8px',marginBottom:'0.6rem',cursor:showExp||reviewMode?'default':'pointer',transition:'all 0.2s',
          border:`2px solid ${showExp||reviewMode?i===q.answer?C.success:selected[0]===i?C.error:C.border:selected[0]===i?C.accent:C.border}`,
          background:showExp||reviewMode?i===q.answer?`${C.success}15`:selected[0]===i?`${C.error}15`:C.surface:selected[0]===i?`${C.accent}15`:C.surface}}>
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
          {(showExp||reviewMode)&&(i===q.answer?<CheckCircle size={18} color={C.success}/>:selected[0]===i?<XCircle size={18} color={C.error}/>:null)}
          <span>{opt}</span>
        </div>
      </div>
    ));
  };

  const canSubmit = q.questionType==='multi-select' ? selected.length>0 : selected.length>0;

  return (
    <div style={base}><div style={wrap}>
      <div style={{marginBottom:'2rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.75rem',fontSize:'0.9rem',color:C.muted}}>
          <span>Question {qIdx+1} of {quizData.length}</span>
          <span><Clock size={14} style={{display:'inline',verticalAlign:'middle',marginRight:'0.3rem'}}/>{fmt(timeSpent)}</span>
        </div>
        <div style={{height:'5px',background:C.border,borderRadius:'3px',overflow:'hidden'}}>
          <div style={{height:'100%',width:`${((qIdx+1)/quizData.length)*100}%`,background:C.accent,transition:'width 0.3s'}}/>
        </div>
      </div>

      <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'1rem'}}>
        {[q.difficulty,(q.section||'').split('[')[0].trim(),q.questionType==='multi-select'?'multi-select':null,q.topic].filter(Boolean).map(t=>(
          <span key={t} style={{padding:'0.2rem 0.65rem',borderRadius:'5px',background:`${C.accent}20`,color:C.accent,fontSize:'0.82rem',fontWeight:'600'}}>{t}</span>
        ))}
      </div>

      <h2 style={{fontSize:'1.35rem',fontWeight:'600',lineHeight:'1.5',marginBottom:'1.5rem'}}>{q.question}</h2>
      {q.questionType==='multi-select'&&!showExp&&!reviewMode&&(
        <p style={{fontSize:'0.85rem',color:C.muted,marginBottom:'1rem',fontStyle:'italic'}}>Select all that apply</p>
      )}

      <div style={{marginBottom:'2rem'}}>{renderOptions()}</div>

      {showExp&&q.explanation&&(
        <div style={{background:'#0d0d12',padding:'1.5rem',borderRadius:'12px',marginBottom:'2rem',border:`1px solid ${C.border}`}}>
          <h3 style={{color:C.accent,fontSize:'1.1rem',marginBottom:'1rem'}}>Explanation</h3>
          <div style={{marginBottom:'1rem'}}>
            <h4 style={{color:C.accent,fontSize:'0.95rem',marginBottom:'0.4rem'}}>💡 Intuition</h4>
            <p style={{color:C.muted,lineHeight:'1.6'}}>{q.explanation.intuition}</p>
          </div>
          <div style={{marginBottom:'1rem'}}>
            <h4 style={{color:C.accent,fontSize:'0.95rem',marginBottom:'0.4rem'}}>📖 Lecture Reference</h4>
            <p style={{color:C.muted,lineHeight:'1.6'}}>{q.explanation.reference}</p>
          </div>
          <SlideImages images={q.slideImages}/>
          {q.diagram&&(
            <div style={{margin:'1rem 0'}}>
              <h4 style={{color:C.accent,fontSize:'0.95rem',marginBottom:'0.5rem'}}>📊 Visual</h4>
              <div style={{background:'#0a0a14',padding:'1rem',borderRadius:'8px',border:`1px solid ${C.border}`,display:'inline-block'}}>{q.diagram}</div>
            </div>
          )}
          <div style={{marginBottom:'1rem',marginTop:'1rem'}}>
            <h4 style={{color:C.accent,fontSize:'0.95rem',marginBottom:'0.4rem'}}>💻 Code</h4>
            <pre style={code}>{q.explanation.computation}</pre>
          </div>
          <div>
            <h4 style={{color:C.accent,fontSize:'0.95rem',marginBottom:'0.4rem'}}>🔗 Connection</h4>
            <p style={{color:C.muted,lineHeight:'1.6'}}>{q.explanation.connection}</p>
          </div>
        </div>
      )}

      <div style={{display:'flex',gap:'1rem'}}>
        <button onClick={handlePrev} disabled={qIdx===0}
          style={{...btn,background:C.border,opacity:qIdx===0?0.5:1,cursor:qIdx===0?'not-allowed':'pointer'}}
          onMouseEnter={e=>qIdx!==0&&(e.target.style.background='#2a3a2a')} onMouseLeave={e=>qIdx!==0&&(e.target.style.background=C.border)}>
          <ChevronLeft size={18}/>Prev
        </button>
        {!showExp&&!reviewMode&&(
          <button onClick={handleSubmit} disabled={!canSubmit}
            style={{...btn,flex:1,justifyContent:'center',opacity:canSubmit?1:0.5}}
            onMouseEnter={e=>canSubmit&&(e.target.style.background=C.accentHover)} onMouseLeave={e=>canSubmit&&(e.target.style.background=C.accent)}>
            Submit Answer
          </button>
        )}
        {(showExp||reviewMode)&&(
          <button onClick={handleNext} style={{...btn,flex:1,justifyContent:'center'}}
            onMouseEnter={e=>e.target.style.background=C.accentHover} onMouseLeave={e=>e.target.style.background=C.accent}>
            {qIdx<quizData.length-1?<><span>Next</span><ChevronRight size={18}/></>:<><span>Results</span><Trophy size={18}/></>}
          </button>
        )}
      </div>
    </div></div>
  );
};

export default Quiz;

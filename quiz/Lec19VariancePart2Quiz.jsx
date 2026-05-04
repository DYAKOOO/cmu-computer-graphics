'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, TrendingDown } from 'lucide-react'

// Source: lectures/cg-19-lecture-quiz.md.md  (symlinked → Logseq pages)
// Lecture 19: Variance Reduction — Part 2 · QQ30–QQ58 · 29 questions (29 MCQ, 0 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-19-lecture-quiz.md.md 19

const quizData = [
  {
    id: 30,
    qid: `Q30`,
    qtype: `PRACTICAL`,
    format: `mcq`,
    timestamp: `39:21`,
    question: `Why can't we use the ideal importance sampling distribution in practice?`,
    options: [`It would make the algorithm inconsistent`, `It would make the estimator biased`, `It would require too much computation`, `It creates a chicken-and-egg problem as we need to know the integral we're trying to compute`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [39:21]: "So this would be a perfect important sampling strategy just sample proportional to the integrand itself as you might guess that's not something we could do in practice it's a little bit of a chicken and egg problem." To create this distribution, we would need to know the integral we're trying to compute.`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 31,
    qid: `Q31`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `40:09`,
    question: `What are the two important classes of local importance sampling strategies in rendering?`,
    options: [`Sampling according to camera position and sampling according to object complexity`, `Sampling according to materials and sampling according to lights`, `Sampling according to image brightness and sampling according to scene geometry`, `Sampling according to color and sampling according to depth`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [40:09]: "There's two important classes of local important sampling strategies we talked a little bit about last time one is too important sample according to materials... We can also do important sampling of lights."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 32,
    qid: `Q32`,
    qtype: `EXAMPLE`,
    format: `mcq`,
    timestamp: `40:45`,
    question: `For what type of material should you only sample the reflection direction?`,
    options: [`Perfect mirror`, `Diffuse material`, `Rough material`, `Translucent material`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [40:45]: "An important special case kind of a limit case is a perfect mirror right if we if we know that the only light that gets reflected is along this reflection direction then we should really only sample that direction."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 33,
    qid: `Q33`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `41:43`,
    question: `What is the path space formulation of light transport?`,
    options: [`A perspective that considers the entire space of possible light paths as the domain of integration`, `A technique for visualizing light paths in 3D space`, `A method for optimizing the recursive rendering equation`, `A mathematical model for simulating light refraction`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [41:43]: "Here's a really valuable perspective on rendering is to think about things rather than in terms of sampling the current Hemisphere around our point we can think about the whole space of all possible paths of light through our scene we think about that as the domain that we're integrating over."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 34,
    qid: `Q34`,
    qtype: `REPRESENTATION`,
    format: `mcq`,
    timestamp: `43:31`,
    question: `How are paths represented in the unit hypercube view of path space?`,
    options: [`As vectors pointing from the light to the eye`, `As trees showing ray splitting at each bounce`, `As points in a unit cube with dimension equal to the number of random decisions`, `As matrices describing light interactions`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [43:31]: "Here's a nice way to visualize this path space is to say well look no matter how we're doing our our paths however however parameterizing our paths at the end they're always determined by a sequence of random values in zero one... A little more geometrically we can think about those that sequence of points as describing points in a unit cube of dimension K."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 35,
    qid: `Q35`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `46:58`,
    question: `What is bidirectional path tracing?`,
    options: [`A method that combines paths traced from both the eye and the light source`, `An approach that separates direct and indirect illumination`, `A strategy that uses two different integration techniques simultaneously`, `A technique that traces paths from two different camera positions`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer defines at [46:58]: "So one nice idea is the idea of bi-directional path tracing so far we've been always tracing paths from the AI hoping that we'll hit a light source now we're gonna go D we're gonna think about going the other way... Well what about starting from the light source and and seeing if we hit the eye well what about combining those two strategies somehow."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 36,
    qid: `Q36`,
    qtype: `ADVANTAGE`,
    format: `mcq`,
    timestamp: `49:31`,
    question: `What advantage does bidirectional path tracing have over standard path tracing?`,
    options: [`It produces less noisy images with the same number of samples`, `It's always faster computationally`, `It can capture light paths that standard path tracing would miss`, `It requires less memory`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [49:31]: "And these upper left and bottom right strategies correspond to two kind of important failure cases one is well if I just do this to bounce thing I'm gonna fail always to see point light sources there's just no chance this balance actually bounces into a point light source likewise if I do this backward path tracing it's gonna fail completely for a pinhole camera." By combining strategies, bidirectional path tracing can handle cases where either forward or backward tracing alone would fail.`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 37,
    qid: `Q37`,
    qtype: `CHALLENGE`,
    format: `mcq`,
    timestamp: `51:21`,
    question: `What makes the "door crack" example particularly challenging for path tracing methods?`,
    options: [`The door material is difficult to simulate`, `The crack changes position over time`, `Finding the tiny crack that lets light through is extremely improbable with random sampling`, `The crack is too small to be represented in the scene geometry`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [51:44]: "So we shoot out a path from the ayat bounces our on-the-scene even after multiple bounces it fails to find this little crack this little place where the door is just barely open and the light is shining from the other room right so in this scene there's no light anywhere except in that other room."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 38,
    qid: `Q38`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `52:50`,
    question: `What is Metropolis Light Transport (MLT)?`,
    options: [`A method that perturbs good paths slightly to find nearby good paths`, `A technique that models light as particles with mass`, `A strategy that traces paths from multiple light sources simultaneously`, `An approach that uses physics-based simulation of light waves`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [53:01]: "So what we're gonna do is once we find a good path rather than throwing it away and starting over again we're gonna perturb it a little bit we're gonna just move our degrees of freedom a little bit maybe change the angles ever so slightly to find nearby good paths and that's the idea behind something called metropolis light transport."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 39,
    qid: `Q39`,
    qtype: `ALGORITHM`,
    format: `mcq`,
    timestamp: `54:21`,
    question: `In the Metropolis-Hastings algorithm, what determines whether to accept a move to a new point?`,
    options: [`The distance between the new point and the old point`, `The derivative of the function at the current point`, `The absolute value of the function at the new point`, `The ratio of the function value at the new point to the function value at the old point`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [54:39]: "I could say that alpha is the ratio of the function value the integrand value at the new point divided by the integrand value at the previous point that value is something I'm going to call the transition probability." This ratio determines the probability of accepting the move.`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 40,
    qid: `Q40`,
    qtype: `REQUIREMENT`,
    format: `mcq`,
    timestamp: `55:55`,
    question: `What property must mutations in the Metropolis-Hastings algorithm have to ensure correct results?`,
    options: [`They must be ergodic, allowing the algorithm to reach everywhere in the domain`, `They must decrease in size as the algorithm runs`, `They must be symmetric around the current point`, `They must be large enough to cover the entire domain`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [55:55]: "One thing we have to be very careful about is to make sure that the mutations are air ghatak which is just a fancy way of saying make sure that our paths can actually reach everywhere in the domain of integration."
- QUESTIONS (continued):`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 41,
    qid: `Q41`,
    qtype: `STRATEGY`,
    format: `mcq`,
    timestamp: `57:26`,
    question: `In the Metropolis-Hastings algorithm, what strategy is used to ensure ergodicity?`,
    options: [`Occasionally jumping to a completely random new point`, `Increasing the step size over time`, `Using a predetermined path through the domain`, `Always accepting moves to regions with zero value`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [57:26]: "Every once in a while I'm also gonna jump to a completely random new point to make sure I'm exploring the whole space so that is a really simple strategy for making sure that my random walk is ergodic is just every once in a while I'll say okay I do kind of more like the original Monte Carlo thing just pick a completely random sample."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 42,
    qid: `Q42`,
    qtype: `VISUAL`,
    format: `mcq`,
    timestamp: `58:44`,
    question: `What image gradually appears in the Metropolis-Hastings demonstration?`,
    options: [`The probability density function graph`, `A portrait of a famous mathematician`, `A cityscape of Pittsburgh with bridges`, `A fractal pattern`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer identifies at [59:35]: "So what is this well you see a lot of bridges so this must be downtown Pittsburgh."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 43,
    qid: `Q43`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `1:01:01`,
    question: `What example is used to demonstrate the effectiveness of Metropolis Light Transport compared to path tracing?`,
    options: [`A disco ball with caustics`, `A mirror-filled room`, `A forest scene with complex shadows`, `A swimming pool with light refractions`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer describes at [1:01:01]: "But just to show the payoff this is a example of a swimming pool you know light coming into the swimming pool it has to hit the surface refract in hit the bottom bounce out refract out hit the eye right and with path tracing it's super noisy with metropolis light transport for the same amount of time you get a much clearer image of what's going on."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 44,
    qid: `Q44`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `1:01:21`,
    question: `What is Multiple Importance Sampling?`,
    options: [`Using multiple images to improve sampling accuracy`, `Taking samples in multiple rendering passes`, `Taking multiple samples from the same distribution`, `A technique to automatically combine different importance sampling strategies to preserve the strengths of all`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [1:02:15]: "So there's this idea of multiple importance sampling which is a automatic way to combine different important sampling strategies to preserve the strengths of all of them."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 45,
    qid: `Q45`,
    qtype: `FORMULA`,
    format: `mcq`,
    timestamp: `1:02:50`,
    question: `In the balanced heuristic for Multiple Importance Sampling, how are samples weighted?`,
    options: [`By the value of the integrand at that sample`, `By the inverse of the total number of samples`, `By the probability density of all strategies at that sample point`, `Equally regardless of which strategy generated them`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer describes at [1:03:02]: "I'm going to divide by the sum over all strategies of the fraction of samples taken with a cait strategy times the Kate importance density." This weighting mechanism balances the contributions from different strategies.`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 46,
    qid: `Q46`,
    qtype: `EXAMPLE`,
    format: `mcq`,
    timestamp: `1:04:07`,
    question: `What scene features were used to demonstrate Multiple Importance Sampling?`,
    options: [`Different sizes of light sources and materials ranging from mirror-like to diffuse`, `Water and glass with different refraction indices`, `Different camera angles and exposures`, `Various tree models with different leaf densities`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer describes at [1:04:07]: "So we have this really kind of clever scene where we have lights of different sizes at the top going from small to large and on the bottom we have these four panels that have different materials on them going from really really almost perfectly mirror like at the top to almost a few Slyke at the bottom these kind of glossy materials in between."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 47,
    qid: `Q47`,
    qtype: `PROBLEM`,
    format: `mcq`,
    timestamp: `1:06:17`,
    question: `What problem occurs with uniformly random samples?`,
    options: [`They require too much computation`, `They cannot handle discontinuous functions`, `They create patterns that are too regular`, `They tend to clump up and create gaps`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer points out at [1:06:17]: "So I believe that in this array of three by two boxes in the bottom left the bottom right most one is actually uniformly random and what you notice is that samples kind of clump up in an ugly way if you call R and many times you'll see this kind of behavior."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 48,
    qid: `Q48`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `1:07:53`,
    question: `What is stratified sampling?`,
    options: [`Using multiple different sampling techniques`, `Sampling according to a predefined pattern`, `Dividing the domain into bins and sampling uniformly within each bin`, `Sampling more frequently in important regions`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [1:07:53]: "A different idea is to say no no I want these to be nicely spread out so I'm gonna split the domain into n bins and then pick uniformly in each bin."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 49,
    qid: `Q49`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `1:08:19`,
    question: `What can be proven about the variance of stratified sampling compared to uniform sampling?`,
    options: [`It is always exactly the same`, `It is always higher`, `It is never larger and typically lower`, `It depends entirely on the function being integrated`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [1:08:19]: "The stratified estimate can never have larger variance than the original estimator and typically lower often much lower."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 50,
    qid: `Q50`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `1:09:49`,
    question: `What is discrepancy as a measure of sample quality?`,
    options: [`The deviation from an ideal distribution where the number of samples in a region is proportional to its area`, `The variance of the sample distribution`, `The maximum distance between any two samples`, `The average distance between samples`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [1:10:14]: "And discrepancy the notion of discrepancy is the measurement of a deviation from this ideal distribution of samples." Further at [1:09:49] he clarifies the ideal: "The number of samples in a given region should be proportional to the area of that region."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 51,
    qid: `Q51`,
    qtype: `THEOREM`,
    format: `mcq`,
    timestamp: `1:12:06`,
    question: `What does Koksma's theorem state about quasi-Monte Carlo methods?`,
    options: [`The error is bounded by the product of the discrepancy and the total variation of the function`, `They always have higher variance than regular Monte Carlo methods`, `They only work in two dimensions or fewer`, `They cannot be used for discontinuous functions`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [1:12:20]: "The deviation of our estimator from the true integral is bounded from above by the discrepancy of the sample X and the total variation of the function or integrating."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 52,
    qid: `Q52`,
    qtype: `TECHNIQUE`,
    format: `mcq`,
    timestamp: `1:14:09`,
    question: `What is the radical inverse function used for?`,
    options: [`Finding the maximum value of the integrand`, `Determining the optimal bin size for stratified sampling`, `Computing the gradient of the function`, `Generating low discrepancy sample points`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [1:14:09]: "So just to sketch this out I won't go into gross detail about everything but first what we're gonna do is define something called the radical inverse," and then at [1:14:50]: "So I can get a certain kind of low discrepancy sample called Halton points x1 through xn in K dimensions by taking this radical inverse function."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 53,
    qid: `Q53`,
    qtype: `PROBLEM`,
    format: `mcq`,
    timestamp: `1:16:50`,
    question: `What problem can occur with regular grid sampling patterns?`,
    options: [`They cannot handle 3D integrals`, `They can miss entire features of the function if aligned with certain frequencies`, `They are too computationally intensive`, `They introduce too much bias into the estimator`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer demonstrates at [1:16:50]: "So just to really put the finger where it hurts let's consider this function this kind of sinusoidal function and let's say we want to integrate that over the square well if I put down a regular grid of samples in just the wrong place... depending on exactly how the grid lines up with the function I could get completely different estimates on the left I'm get one if the grid shifts a little bit or the function shifts a little bit on the right I get zero."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 54,
    qid: `Q54`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `1:18:01`,
    question: `What is blue noise sampling inspired by?`,
    options: [`The distribution of cells on the retina of mammals`, `Ocean wave patterns`, `Atmospheric interference patterns`, `Quantum mechanical phenomena`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [1:18:01]: "One type of sampling pattern that does a pretty good job at this is something called blue noise and this is got some biological motivation that if you look at the retina of a mammal like a rhesus monkey then you'll see that the cells on the retina have a nice distribution."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 55,
    qid: `Q55`,
    qtype: `ANALYSIS`,
    format: `mcq`,
    timestamp: `1:19:12`,
    question: `How is the quality of sampling patterns analyzed in the Fourier domain?`,
    options: [`By calculating the entropy of the pattern`, `By measuring the maximum amplitude`, `By comparing the pattern to a Gaussian distribution`, `By checking for preferred frequencies or directions in the pattern`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [1:19:56]: "If we look at the Fourier transform for the regular pattern what we see is that the Fourier transform looks really kind of ugly there's some frequencies that really line up really well with the pattern... If we look at this blue noise pattern on the right it looks a lot more uniform... we notice especially for higher frequencies there's not much of a preference in direction or in frequency."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 56,
    qid: `Q56`,
    qtype: `ALGORITHM`,
    format: `mcq`,
    timestamp: `1:23:02`,
    question: `What is the basic idea behind Poisson disk sampling?`,
    options: [`Iteratively adding random non-overlapping disks until there's no space left`, `Using the Poisson probability distribution to determine sample locations`, `Placing samples on a slightly jittered grid`, `Randomly adding samples anywhere in the domain`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [1:23:02]: "Well one of the earliest algorithms is something called poisson disk sampling and the basic idea is to just iteratively add random non-overlapping disks of some fixed size until there's no space left."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 57,
    qid: `Q57`,
    qtype: `TECHNIQUE`,
    format: `mcq`,
    timestamp: `1:27:39`,
    question: `What is the basic concept behind alias tables?`,
    options: [`Sorting the domain into regions of equal probability`, `Using multiple probability distributions simultaneously`, `Creating a lookup table to speed up function evaluation`, `"Robbing from the rich and giving to the poor" to make the distribution more uniform`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [1:27:39]: "The basic idea is rather than build a inverse CDF or rather than building a CDF and inverting it we're going to Rob from the rich and give to the poor we're going to turn our probability distribution into something in some sense more uniform."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
  },
  {
    id: 58,
    qid: `Q58`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `1:32:07`,
    question: `According to the lecture, photon mapping is:`,
    options: [`Neither consistent nor unbiased`, `Consistent and unbiased`, `Consistent but biased`, `Unbiased but not consistent`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [1:32:07]: "Photon mapping interestingly enough is consistent but biased so as we add more and more and more photons to the scene will approach the correct answer but for a given set of photons the expected image we generate is not the same as the true image."

#MonteCarloIntegration #VarianceReduction #ImportanceSampling #PathTracing #MetropolisLightTransport #BidirectionalPathTracing #StratifiedSampling #LowDiscrepancy #BlueNoise #PhotonMapping`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md.md`,
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

export default function Lec19Part2Quiz() {
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
    accent: '#2dd4bf', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec19'
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
          <TrendingDown size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 19: Variance Reduction — Part 2</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Stratified sampling, MIS, next-event estimation, photon mapping</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-19-lecture-quiz.md.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec19/1`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec19/2`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 2</a>
          </div>
          <p style={{ color: C.accent, fontWeight: 600 }}>QQ30–QQ58 · 29 questions (29 graded + 0 open)</p>
        </div>

        <div style={{ background: '#0d0d12', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>29</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Graded MCQ</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>0</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Open / Reveal</div></div>
            <div><div style={{ fontSize: '2rem', fontWeight: 700, color: C.accent }}>~9min</div><div style={{ color: C.muted, fontSize: '0.9rem' }}>Est. Time</div></div>
          </div>
        </div>

        <button style={btn({ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' })}
          onClick={() => { setScreen('quiz'); start() }}>
          <TrendingDown size={20} /> Start Quiz
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
              <TrendingDown size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 19: Variance Reduction — Part 2</span>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', color: C.muted, fontSize: '0.875rem', alignItems: 'center' }}>
              <span><Clock size={14} style={{ display:'inline', verticalAlign:'middle', marginRight:'0.25rem' }} />{formatTime(t)}</span>
              <span>{qIdx+1}/29</span>
              <span style={{ color: C.accent }}>✓ {score}</span>
            </div>
          </div>
          <div style={{ height: '5px', background: C.border, borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.round((qIdx+1)/29*100)}%`, background: C.accent, transition: 'width 0.3s' }} />
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-19-lecture-quiz.md.md.</p>
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
              {qIdx < 29-1 ? 'Next Question' : 'View Results'} <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
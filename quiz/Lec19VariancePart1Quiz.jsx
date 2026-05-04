'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, TrendingDown } from 'lucide-react'

// Source: lectures/cg-19-lecture-quiz.md  (symlinked → Logseq pages)
// Lecture 19: Variance Reduction — Part 1 · QQ1–QQ32 · 32 questions (32 MCQ, 0 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-19-lecture-quiz.md 19

const quizData = [
  {
    id: 1,
    qid: `Q1`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `00:00`,
    question: `What is the main focus of the lecture on variance reduction in Monte Carlo rendering?`,
    options: [`Reducing noise in rendered images by applying variance reduction techniques`, `Improving the speed of ray tracing algorithms`, `Exploring how to create more detailed 3D models`, `Creating new ray tracing algorithms from scratch`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [00:07]: "Today we're going to wrap up our discussion of physically based rendering with a discussion of techniques to reduce variance." The entire lecture focuses on methods to reduce noise (variance) in rendered images.`,
    code: ``,
    images: ["lec19_slide_02.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 2,
    qid: `Q2`,
    qtype: `RELATIONSHIP`,
    format: `mcq`,
    timestamp: `01:42`,
    question: `In Monte Carlo integration, what is the relationship between the number of samples and the accuracy of the estimate?`,
    options: [`The accuracy is only affected by the choice of domain, not the number of samples`, `The accuracy increases with more samples`, `The number of samples has no effect on accuracy`, `The accuracy decreases with more samples`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [02:44]: "Of course in practice we stopped at some point and the more samples we use the more accurate our estimate of the integral will be."`,
    code: ``,
    images: ["lec19_slide_03.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 3,
    qid: `Q3`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `03:02`,
    question: `What is the expected value of a discrete random variable?`,
    options: [`The weighted average of all possible values, with weights being the probability of each value`, `The median of all possible values`, `The minimum possible value the variable can take`, `The maximum possible value the variable can take`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer defines at [03:31]: "The expected value e of X is the sum over all the events of the probability of that event occurring times the value of that event essentially just the weighted average of all the events by their probabilities."`,
    code: ``,
    images: ["lec19_slide_04.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 4,
    qid: `Q4`,
    qtype: `CALCULATION`,
    format: `mcq`,
    timestamp: `04:13`,
    question: `If a fair coin (with probability 1/2 for heads and tails) gives a value of 1 for heads and 0 for tails, what is the expected value of a coin toss?`,
    options: [`0`, `1`, `0.5`, `0.25`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer calculates at [04:13]: "What is the expected value for the coin toss? Okay hopefully this is pretty simple it's just 1/2 times 1 plus 1/2 times 0 is 1/2." This equals 0.5.`,
    code: ``,
    images: ["lec19_slide_04.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 5,
    qid: `Q5`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `04:36`,
    question: `What is a key difference between discrete and continuous random variables?`,
    options: [`Continuous random variables can only take a finite number of values`, `Continuous random variables cannot have an expected value`, `Discrete random variables have no probability density function`, `For a continuous random variable, the probability of any single exact value is zero`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer points out at [05:46]: "One really important thing to appreciate about continuous random variables is that the probability that you fall asleep exactly at one given time T is 0." This is a fundamental property of continuous random variables.`,
    code: ``,
    images: ["lec19_slide_05.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 6,
    qid: `Q6`,
    qtype: `CALCULATION`,
    format: `mcq`,
    timestamp: `06:24`,
    question: `How do you calculate the probability of a continuous random variable taking a value in a specific interval?`,
    options: [`By multiplying the length of the interval by the maximum value of the function`, `By taking the average of the probabilities at the endpoints`, `By integrating the probability density function over that interval`, `By counting the number of values in that interval`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [06:24]: "In this example if I want to know what chance is there that I fall asleep between T0 and T1 then I should integrate from T0 to T1 this probability density to get the probability."`,
    code: ``,
    images: ["lec19_slide_05.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 7,
    qid: `Q7`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `06:42`,
    question: `How is the expected value of a continuous random variable defined?`,
    options: [`As the most frequently occurring value`, `As the integral of the probability density times the value over the entire domain`, `As the midpoint of the domain`, `As the maximum value of the probability density function`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer defines at [06:54]: "We could say that the expected value of a random variable X is the integral over the domain Omega of the probability density at each point times the event value."`,
    code: ``,
    images: ["lec19_slide_06.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 8,
    qid: `Q8`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `08:49`,
    question: `What does the "flaw of averages" refer to in the context of probability distributions?`,
    options: [`That averages are mathematically incorrect for non-normal distributions`, `That the average is affected by outliers more than other statistics`, `The fact that the average is always higher than the median`, `That looking at just the average discards important information about the distribution's shape`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [08:49]: "Looking at the average of a quantity is really throwing away a lot of information about that quantity if you just know about the average of a probability distribution it really doesn't tell you oh is that distribution fairly uniform or does it have lots of peaks and valleys."`,
    code: ``,
    images: ["lec19_slide_35.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 9,
    qid: `Q9`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `09:18`,
    question: `What does the variance of a random variable measure?`,
    options: [`The range of possible values`, `How far the values tend to be from the expected value`, `The rate at which the random variable changes`, `The average value of the random variable`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer defines at [09:18]: "Another important quantity when talking about random variables was the variance so if the expected value is the average value then the variance is how far we are from the average on average."`,
    code: ``,
    images: ["lec19_slide_35.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 10,
    qid: `Q10`,
    qtype: `RELATIONSHIP`,
    format: `mcq`,
    timestamp: `10:30`,
    question: `What is the relationship between variance and standard deviation?`,
    options: [`They are completely different measures with no relationship`, `The standard deviation is the square of the variance`, `The standard deviation is the log of the variance`, `The standard deviation is the square root of the variance`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [10:30]: "There's a quantity very closely related to the variance which is the standard deviation the standard deviation which we usually write as Sigma is just the square root of the variance."`,
    code: ``,
    images: ["lec19_slide_61.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 11,
    qid: `Q11`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `11:28`,
    question: `Why is variance reduction important in photorealistic rendering?`,
    options: [`To increase the speed of the rendering process`, `To simplify the mathematics of light transport`, `To reduce the amount of noise in the rendered image`, `To reduce the memory requirements of the rendering algorithm`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [11:34]: "Different amounts of variants equate to different amounts of noise in the image because we're doing independent estimates at every different pixel of our image we're gonna have different random error at every pixel which shows up as this this noise."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 12,
    qid: `Q12`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `14:25`,
    question: `When trying to reduce variance in Monte Carlo integration, which of the following can be reduced?`,
    options: [`Neither the integrand variance nor the estimator variance`, `The variance of the integrand (the function being integrated)`, `The variance of the estimator (the method used to approximate the integral)`, `Both the integrand variance and the estimator variance`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer emphasizes at [14:53]: "It's really really important to realize you cannot reduce the variance of the integrand you can't reduce the variance of the function you're trying to integrate... The only thing we can do is reduce the variance of our estimate of the integral we can reduce the variance of the estimator."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 13,
    qid: `Q13`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `15:33`,
    question: `What is an estimator in the context of numerical integration?`,
    options: [`A function that reduces the complexity of an integral`, `A formula used to approximate an integral`, `A method to simplify the domain of integration`, `A hardware device that measures integration speed`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer defines at [15:33]: "An estimator in general is a formula used to approximate an integral our key example is a Monte Carlo estimate."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 14,
    qid: `Q14`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `16:38`,
    question: `What does it mean for an estimator to be consistent?`,
    options: [`It is unbiased for any number of samples`, `It has a low computational cost`, `It converges to the correct answer as the number of samples increases`, `It gives the same result every time it's used`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer defines at [16:56]: "Consistency means it converges to the correct answer if I have a consistent estimator I know that as I add more and more samples to my estimate I'll eventually get the right result."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 15,
    qid: `Q15`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `18:17`,
    question: `What does it mean for an estimator to be unbiased?`,
    options: [`It always gives a result below the true value`, `It uses random sampling techniques`, `It is correct on average for any number of samples`, `It eventually converges to the correct result`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer defines at [18:17]: "Bias is a different concept that a estimator is unbiased is saying that it is correct on average." He elaborates that "an estimator is unbiased if the expected difference between the true integral and our estimator for any number of samples is equal to zero."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 16,
    qid: `Q16`,
    qtype: `RELATIONSHIP`,
    format: `mcq`,
    timestamp: `18:54`,
    question: `What is the relationship between consistency and unbiasedness?`,
    options: [`Consistency does not imply unbiasedness, and vice versa`, `Consistency and unbiasedness are the same property`, `All consistent estimators are unbiased`, `All unbiased estimators are consistent`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [18:54]: "Importantly consistent does not imply on bias just because you're approaching the right value doesn't mean that at any moment your expected value for your estimate is the true value." The examples given later in the lecture further demonstrate this independence.`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 17,
    qid: `Q17`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `19:18`,
    question: `In the example of estimating the total brightness of an image using a fixed grid of points, this estimator is:`,
    options: [`Consistent and unbiased`, `Unbiased but not consistent`, `Neither consistent nor unbiased`, `Consistent but not unbiased`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer concludes at [21:27]: "Is it unbiased? ... Well no pretty clearly not right if I just keep M equals 4 and never increase M my first estimate will never be equal to the true value not even on average." But he had already established that it was consistent since as the grid gets finer, it converges to the correct value.`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 18,
    qid: `Q18`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `21:50`,
    question: `In the example of estimating the total brightness of an image using a single random sample, this estimator is:`,
    options: [`Neither consistent nor unbiased`, `Consistent and unbiased`, `Consistent but not unbiased`, `Unbiased but not consistent`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [24:19]: "So weirdly enough this is a strategy that is not consistent but is unbiased." This is because a single sample can never give the correct overall brightness, but on average (if the experiment is repeated many times), it gives the right result.`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 19,
    qid: `Q19`,
    qtype: `BENEFIT`,
    format: `mcq`,
    timestamp: `25:03`,
    question: `What is a key advantage of using unbiased estimators in rendering?`,
    options: [`They are always faster than biased estimators`, `They are easier to implement than biased estimators`, `They have more predictable behavior and error reduction rates`, `They require less memory than biased estimators`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [25:15]: "Unbiased estimator tend to have more predictable behavior and you know especially with Monte Carlo estimator you really know that the error is decreasing at some predictable rate so you really know how much computation you need to do to get a result of a certain quality."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 20,
    qid: `Q20`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `26:04`,
    question: `According to the lecture, which rendering algorithm is neither consistent nor unbiased?`,
    options: [`Metropolis light transport`, `Path tracing`, `Rasterization`, `Bidirectional path tracing`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [26:09]: "One that we talked about a long time ago was rasterization or a really common way of generating images and rasterization is neither consistent nor unbiased why is that? Well, there's just no way for it to ever generate the correct image because it ignores all sorts of effects like shadows and reflections and so forth."
- QUESTIONS (continued):`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 21,
    qid: `Q21`,
    qtype: `CHALLENGE`,
    format: `mcq`,
    timestamp: `27:35`,
    question: `What phenomenon makes it challenging for naive path tracing to render a caustic pattern created by a shiny coffee cup?`,
    options: [`The variance in the surface reflectivity`, `The limited number of available ray bounces`, `The extremely low probability of randomly sampling the correct reflection path`, `The computational complexity of simulating liquid in the cup`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [29:25]: "What's the chance that in that process we just happened to find a ray from the mirrored surface to the point light that had an equal and opposite angle to the ray from the mirrored surface to the floor? Well it's basically zero right we picked this diffuse bounce completely randomly there's just no chance we got so lucky that we came in at the reflected direction."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 22,
    qid: `Q22`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `30:26`,
    question: `According to the lecture, naive path tracing is:`,
    options: [`Neither consistent nor unbiased`, `Consistent and unbiased`, `Unbiased but not consistent`, `Consistent but biased`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [30:26]: "So formally the result of path tracing is biased it's not correct, ok?" He had previously mentioned that path tracing is "more or less consistent" though it may miss certain types of light paths.`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 23,
    qid: `Q23`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `30:51`,
    question: `Why is the disco ball example used to illustrate challenges in path tracing?`,
    options: [`Because it demonstrates color bleeding effects`, `Because it involves complex light behavior with small light sources and highly reflective surfaces`, `Because it shows how different materials interact with each other`, `Because disco balls are particularly difficult to model geometrically`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [30:51]: "Let's think about this scenario we have a disco ball lit by a small directional light source and a near perfect mirror it's not a point source and it's not a perfect mirror but it's pretty close to the situation we described." This is challenging because of the small probability of finding relevant light paths.`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 24,
    qid: `Q24`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `31:38`,
    question: `In the disco ball example, why does the probability of finding important light paths get worse with more bounces?`,
    options: [`Because the disco ball absorbs most of the light`, `Because the camera doesn't have sufficient resolution`, `Because the rendering equation becomes unstable with many bounces`, `Because each bounce requires finding an increasingly small percentage of directions that carry light`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [33:19]: "The light that ultimately arrives at the camera is a very small percentage of a very small percentage of the light source and you can imagine this gets worse the more bounces we take you can have a very small percentage of a very small percentage of a very small percentage if you're naive about how you sample."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 25,
    qid: `Q25`,
    qtype: `COMPUTATION`,
    format: `mcq`,
    timestamp: `34:03`,
    question: `In the brute force approach to rendering the disco ball scene, approximately how many samples per pixel were required to start seeing the caustics clearly?`,
    options: [`8,192 samples`, `16 samples`, `128 samples`, `1,024 samples`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [34:56]: "So now I'm gonna do 8,192 samples per pixel holy this is a lot of work this is a lot of sampling and finally I start to see okay there's this ball this kind of noisy disco ball and it looks like it's shining kind of caustics on the walls."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 26,
    qid: `Q26`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `35:46`,
    question: `What is importance sampling in Monte Carlo integration?`,
    options: [`Using more important pixels in the image for sampling`, `Biasing the estimator to focus on important features`, `Sampling the domain according to how much the integrand is expected to contribute to the integral`, `Taking more samples in areas with high computational complexity`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer defines at [35:46]: "Just try to sample the integrand according to how much we expected to contribute to the integral." This means concentrating samples in regions where the function value is large.`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 27,
    qid: `Q27`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `36:14`,
    question: `Why is uniform sampling inefficient for functions with large variations?`,
    options: [`It requires more computational resources`, `It makes the algorithm inconsistent`, `It places many samples in regions that contribute little to the integral`, `It introduces bias into the estimator`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [36:14]: "As we do this what we notice is there's really not much reason to put samples in this flat region of the integrand or at least not many samples because most of the time they're not contributing much I mean I'm putting lots and lots of samples in this flat region they're just adding 0 0 0 or some small epsilon to my estimate."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 28,
    qid: `Q28`,
    qtype: `PROPERTY`,
    format: `mcq`,
    timestamp: `37:16`,
    question: `In importance sampling, how are samples from regions with higher probability density weighted?`,
    options: [`They are weighted the same as all other samples`, `They are given less weight to compensate for their higher sampling frequency`, `Their weight depends on the total number of samples taken`, `They are given more weight to emphasize their importance`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [37:16]: "We say if this region was sampled more often we're gonna wait it less if this region was sampled less often we're gonna wait it more so that everything balances out. If I sample X more frequently each sample should count for less if I sample X less frequently each sample should account for more."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
  {
    id: 29,
    qid: `Q29`,
    qtype: `IDEAL`,
    format: `mcq`,
    timestamp: `37:50`,
    question: `What would be the ideal importance sampling distribution?`,
    options: [`Distribution proportional to the integrand itself`, `Distribution that concentrates all samples at the maximum of the integrand`, `Distribution proportional to the derivative of the integrand`, `Uniform distribution across the domain`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer asks at [37:50] what happens if the probability distribution P is proportional to the function F directly, and explains that with just one sample you would get the exact right answer. Later at [39:33] he states: "The closer and closer P gets to F the closer and closer this quotient just looks like the integral that we're looking for."`,
    code: ``,
    images: ["lec19_slide_63.png"],
    tags: [],
    source: `lectures/cg-19-lecture-quiz.md`,
  },
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
    source: `lectures/cg-19-lecture-quiz.md`,
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
    source: `lectures/cg-19-lecture-quiz.md`,
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
    source: `lectures/cg-19-lecture-quiz.md`,
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

export default function Lec19Part1Quiz() {
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
          <TrendingDown size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 19: Variance Reduction — Part 1</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Stratified sampling, MIS, next-event estimation, photon mapping</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-19-lecture-quiz.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec19/1`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec19/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
          </div>
          <p style={{ color: C.accent, fontWeight: 600 }}>QQ1–QQ32 · 32 questions (32 graded + 0 open)</p>
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
        <a href={`${BASE}/`} style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', color: C.muted, fontSize: '0.875rem' }}>← All quizzes</a>
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
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 19: Variance Reduction — Part 1</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-19-lecture-quiz.md.</p>
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
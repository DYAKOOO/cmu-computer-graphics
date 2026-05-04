'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Sun } from 'lucide-react'

// Source: lectures/cg-14-lecture-quiz.md.md  (symlinked → Logseq pages)
// Lecture 14: Color — Part 2 · QQ30–QQ61 · 32 questions (32 MCQ, 0 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-14-lecture-quiz.md.md 14

const quizData = [
  {
    id: 30,
    qid: `Q30`,
    qtype: `EXPERIMENTAL`,
    format: `mcq`,
    timestamp: `34:15`,
    question: `What does the peripheral vision color experiment described in the lecture demonstrate?`,
    options: [`Peripheral vision is more accurate for certain colors than others`, `The brain often incorrectly guesses colors in the peripheral vision`, `People can see colors more vividly in their peripheral vision`, `Color vision improves with practice in the periphery`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [35:38], the lecturer predicts: "You will do a very poor job of guessing what the color is you'll get signals from your brain that say oh it's it's definitely a color and it's blue and then you'll turn around and look at it and it'll actually be yellow" and explains at [35:51] that "your brain is very good at filling in the gaps."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 31,
    qid: `Q31`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `35:25`,
    question: `Why is it important to use objects of the same shape in the peripheral vision experiment?`,
    options: [`To ensure the objects reflect light in similar ways`, `To prevent identifying objects by their shape rather than color`, `To make the experiment more aesthetically pleasing`, `To make the experiment easier to conduct`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [35:25]: "For this for this reason that's actually pretty important that all these objects have the same shape you don't want to be distinguishing which one it is based on how they're shaped."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 32,
    qid: `Q32`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `36:48`,
    question: `Why does the lecturer say color is hard to deal with in computer graphics?`,
    options: [`Because monitors can't display the full range of visible colors`, `Because there are too many colors to represent digitally`, `Because color theory is still poorly understood scientifically`, `Because color perception involves non-linear relationships and complex brain processing`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [36:48], the lecturer states: "That is one of the reasons why color is so hard to deal with in computer graphics because it's not a linear relationship it's not a very simple mathematical relationship the brain and the mind are doing a lot to turn the data that it gets into a color image in a very unpredictable way."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 33,
    qid: `Q33`,
    qtype: `BIOLOGICAL`,
    format: `mcq`,
    timestamp: `38:08`,
    question: `Why do two of the three cone types (M and L) have similar response curves that cluster in the green part of the spectrum?`,
    options: [`Green light is most important for survival`, `The Sun emits more strongly in the green region, making it efficient for the eye to prioritize green light`, `It's a random evolutionary accident`, `It helps humans better distinguish plant matter`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [38:41]: "If you look at the spectrum of the Sun the emission spectrum of the Sun it shines a lot stronger in the green region so just as a matter of efficiency the eye wants to pick up on the light that it's most likely to see in a in a daylight and an outdoor scenario."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 34,
    qid: `Q34`,
    qtype: `LIMITATION`,
    format: `mcq`,
    timestamp: `39:48`,
    question: `What fundamental limitation of the human visual system is described in the lecture?`,
    options: [`The eye cannot measure the full spectrum of incoming light, instead reducing it to three values`, `The eye cannot detect ultraviolet radiation`, `The eye cannot perceive colors in dim lighting`, `The eye cannot focus on near and far objects simultaneously`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [39:54], the lecturer states: "The human eye simply can't measure the full spectrum of incoming light" and at [40:17] adds: "A spectrum in a sense contains infinitely many values... the eye knows only about three values it knows the integral of the spectrum times the response function and those integrals give just three numerical values SML."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 35,
    qid: `Q35`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `41:33`,
    question: `What are metamers?`,
    options: [`Different spectra that integrate to the same physical response in the eye`, `Colors that appear different under different lighting conditions`, `Different types of cone cells in the retina`, `Different brands of color measurement devices`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer defines this term at [42:28]: "Meta Mers are two different spectra two different incoming incident illumination that integrate to the same physical response in the eyeball."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 36,
    qid: `Q36`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `43:18`,
    question: `How does metamerism benefit color reproduction?`,
    options: [`It enables better color calibration between devices`, `It makes colors appear more vibrant`, `It enhances our ability to perceive subtle color differences`, `It allows different spectra to produce the same perceived color, enabling simpler reproduction`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [43:41], the lecturer explains: "The fact that the eyeball is kind of a crude measurement device when it comes to color is actually is actually helpful it means we can we can cheat right we can find mixtures of inks that produce the same perceived color even though it doesn't produce the same spectrum."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 37,
    qid: `Q37`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `44:38`,
    question: `How is metamerism exploited for counterfeit detection?`,
    options: [`By making money appear to change color when tilted`, `By using magnetic inks that can be detected electronically`, `By printing microscopic patterns that can't be reproduced`, `By using inks that have the same color to the naked eye but different spectra under special light`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [44:52]: "If you're trying to counterfeit the money you might think you're getting away with it because you've produced a good metamer" and at [45:10] adds the solution: "We're gonna print a very special spectrum of ink so that if you look at it using a more sophisticated device or in a different setting that's not the usual setting of the naked eye you actually see these spectral differences."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 38,
    qid: `Q38`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `45:57`,
    question: `What advantage do hyperspectral cameras have over human vision?`,
    options: [`They have more precise color measurements with many narrow response bands`, `They can see in complete darkness`, `They can see through solid objects`, `They have better resolution than the human eye`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [45:30], the lecturer describes: "A camera that was much more precise in color measurements than the human eye something that had instead of three responses maybe it has a dozen responses these are called hyperspectral cameras things that have very kind of narrow bands of spectral responses around a lot of different frequencies."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 39,
    qid: `Q39`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `47:08`,
    question: `According to the lecture, how can hyperspectral imaging be used to identify plant types from space?`,
    options: [`By measuring plant heights with radar`, `By detecting moisture content in plants`, `By detecting the shape of leaves from orbit`, `By identifying unique spectral signatures of different plant types`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [47:08]: "You can have a more precise spectral camera that picks up on oh well this is green and that's green to the naked eye but this green is very different from that green if I look at the spectrum. And if I know ahead of time which kind of plants give up which kind of spectra I can make some good inferences about what kind of plant growth are in a forest."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 40,
    qid: `Q40`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `48:00`,
    question: `What is the distinction between a color space and a color model?`,
    options: [`Color spaces are the full range of available colors while color models are ways to identify points in that space`, `Color spaces are three-dimensional while color models are two-dimensional`, `Color spaces are used by artists while color models are used by scientists`, `Color spaces are limited to digital systems while color models apply to all media`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [48:28]: "We can think about a color space like an artist's palette it's the full range of colors that we could possibly choose from" and at [48:48] adds: "The color model is the way we give names or the way we identify points in the color space."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 41,
    qid: `Q41`,
    qtype: `EXAMPLE`,
    format: `mcq`,
    timestamp: `49:23`,
    question: `How does an RGB color model identify a specific color?`,
    options: [`Using three numbers that specify red, green, and blue intensities`, `Using a descriptive name like "yellow ochre"`, `Using wavelength measurements`, `Using a hexadecimal value`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [49:23], the lecturer explains that in the "RGB color model where we give three numbers" such as "two oh four one nineteen thirty-four that also specifies this same color yellow ocher."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 42,
    qid: `Q42`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `50:20`,
    question: `What is an additive color model?`,
    options: [`A mathematical technique for adding new colors to a palette`, `A system where colors are created by adding pigments together`, `A way to enhance color brightness by adding white`, `A model used for combining different colored lights`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer defines this at [50:20]: "Additive is used for combining illumination right let's say we have colored lights we want to combine different colored lights and talk about their color the prototypical example of this would be red green and blue."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 43,
    qid: `Q43`,
    qtype: `EXAMPLE`,
    format: `mcq`,
    timestamp: `51:30`,
    question: `Why does the CMYK color model include black (K) when theoretically cyan, magenta, and yellow should produce black when combined?`,
    options: [`To achieve deeper blacks than CMY alone and for efficiency in printing common black text`, `To save money on colored inks`, `Because K stands for "kontrast" in the original German model`, `Because printers cannot accurately align the three colors`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [51:53], the lecturer explains: "The reason is basically efficiency it's really hard to get deep blacks by mixing together magenta yellow and cyan paint or ink black is a really obviously common color that we want to print so we're gonna actually inject some black ink into the picture as well."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 44,
    qid: `Q44`,
    qtype: `VISUAL`,
    format: `mcq`,
    timestamp: `52:22`,
    question: `In the additive color model demonstration, what color is produced when red and green lights overlap?`,
    options: [`Blue`, `White`, `Brown`, `Yellow`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [52:42]: "You see that if red and green light combine we get yellow if blue and red light combine we get magenta and so forth."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 45,
    qid: `Q45`,
    qtype: `PROCESS`,
    format: `mcq`,
    timestamp: `53:13`,
    question: `When white light passes through both yellow and magenta filters, what color results?`,
    options: [`Green`, `Black`, `Blue`, `Red`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [53:37]: "The magenta filter all turns things magenta the yellow thing turns things yellow but if we look at the region that's absorbing both yellow and magenta all that's left is a red light."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 46,
    qid: `Q46`,
    qtype: `USABILITY`,
    format: `mcq`,
    timestamp: `54:28`,
    question: `Why is HSV often preferred over RGB for user interfaces where people select colors?`,
    options: [`HSV requires less memory to store`, `HSV is the industry standard for all applications`, `HSV produces more vibrant colors on screen`, `HSV is more intuitive for humans to specify colors than RGB`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer notes at [54:11] that RGB is "really not that intuitive" and at [54:35] explains: "For that reason a more popular way to specify a color or another popular way to specify a color is HSV."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 47,
    qid: `Q47`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `55:09`,
    question: `What does the "S" represent in the SML color model?`,
    options: [`Spectrum`, `Sensitivity`, `Saturation`, `Short wavelength (cones)`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [37:32], the lecturer explains: "There are three different types of cones and we can actually call these instead of RGB we can call these SML short medium and long wavelength cones."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 48,
    qid: `Q48`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `56:12`,
    question: `What is the key feature of the Lab color model?`,
    options: [`It provides perceptual uniformity where equal parameter changes give roughly equal perceived color changes`, `It requires less computational power than other models`, `It's designed for print applications specifically`, `It represents colors as humans naturally perceive them`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [56:28], the lecturer states: "The idea is as I tweak these parameters x y and z I'd really like it if a constant change in my parameters gives me roughly a constant change in the perceived color and that's what lab and other color spaces try to do."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 49,
    qid: `Q49`,
    qtype: `TECHNICAL`,
    format: `mcq`,
    timestamp: `57:05`,
    question: `What is the purpose of using hexadecimal notation for RGB colors?`,
    options: [`To efficiently pack 8 bits per channel using just 2 characters per channel`, `To make colors look more professional in code`, `To confuse beginners learning about colors`, `Because hexadecimal is faster for computers to process`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [57:41], the lecturer explains: "We extend our usual number system to this hexadecimal system why do we do that well now a single character encodes sixteen values and two characters in code sixteen by sixteen values" and at [58:05] concludes: "that lets us pack these eight bits per channel descriptions of color into this hexadecimal number."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 50,
    qid: `Q50`,
    qtype: `DECODE`,
    format: `mcq`,
    timestamp: `58:17`,
    question: `What color would the hexadecimal code #FF6600 represent?`,
    options: [`Red`, `Orange`, `White`, `Yellow`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer analyzes at [58:38]: "The first two characters FF that's how much red we have six six is how much green we have and zero zero is how much blue we have" and at [58:55] concludes this is "somewhere between red and yellow we get this orange color."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 51,
    qid: `Q51`,
    qtype: `SYSTEM`,
    format: `mcq`,
    timestamp: `59:30`,
    question: `What is the Pantone matching system?`,
    options: [`A collection of colored filters for photography`, `A standardized color calibration method for monitors`, `A technique for matching colors between different printers`, `An industry standard with 1114 reference colors for specifying paints and materials`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [59:42], the lecturer describes: "There's this industry standard for specifying colors that might be used in construction you're painting the walls in a building so you have this industry standard of 1114 colors."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 52,
    qid: `Q52`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `1:00:31`,
    question: `According to the lecture, why do operating systems sometimes use "crayon box" style color selection?`,
    options: [`It takes less screen space than other color pickers`, `It's more technically precise than HSV or RGB pickers`, `It's convenient for users to choose colors by name`, `It's required by law for accessibility reasons`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:00:31], the lecturer explains: "Why do we have these different color models well one why do we do it with crayons for convenience right is it easy for a user to choose the color that they want."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 53,
    qid: `Q53`,
    qtype: `COMPOSITING`,
    format: `mcq`,
    timestamp: `1:01:44`,
    question: `What happens when colors are blended in different color models?`,
    options: [`A point halfway between two colors in RGB looks different than a point halfway between those same colors in HSV`, `RGB blending is more accurate than HSV blending`, `The result is always identical regardless of color model`, `Blending only works properly in the Lab color space`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [1:01:44]: "A point that's halfway between two points in RGB won't look anything like a point halfway between two points in HSV."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 54,
    qid: `Q54`,
    qtype: `TECHNICAL`,
    format: `mcq`,
    timestamp: `1:03:11`,
    question: `In the Y'CbCr color model, what does the Y' component represent?`,
    options: [`Luminance or brightness`, `Yellow content`, `Youthfulness of the color`, `Y-axis position in a color space`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:02:40], the lecturer explains: "Y prime here is the luma the perceived luminance so just how bright the image is."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 55,
    qid: `Q55`,
    qtype: `PERCEPTUAL`,
    format: `mcq`,
    timestamp: `1:04:30`,
    question: `In the color compression example shown in the lecture, why does the reconstructed image look good despite massive color downsampling?`,
    options: [`Modern displays automatically correct for color compression`, `The human visual system is more sensitive to brightness than color`, `The lecturer used a special algorithm to enhance the colors`, `The colors weren't actually downsampled that much`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:04:47], the lecturer states: "This really shows that the human perception system is much more attuned to brightness than it is to color you really don't pick up with the naked eye very much on these blocky artifacts in the color channels."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 56,
    qid: `Q56`,
    qtype: `TECHNICAL`,
    format: `mcq`,
    timestamp: `1:05:46`,
    question: `What simple technique does the lecturer suggest to reduce blocky artifacts in color-downsampled images?`,
    options: [`Adding a slight blur to the entire image`, `Adjusting the gamma curve of the display`, `Using bilinear filtering instead of nearest-neighbor filtering`, `Increasing the resolution of the color channels`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:06:15], the lecturer suggests: "What I would probably do is simply use bilinear filtering rather than nearest-neighbor filtering right that's gonna at least smooth out the edges on that block of color even if it doesn't completely give you the correct color."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 57,
    qid: `Q57`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `1:07:07`,
    question: `What is "gamut" in the context of color reproduction?`,
    options: [`The range of colors that can be expressed by a device or in a color space`, `The brightness level of a display`, `A measure of color accuracy`, `The process of converting between color models`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:06:55], the lecturer frames gamut as: "Another question is which colors can be expressed using a given model" and at [1:07:14] explains how it relates to output devices: "If we're trying to encode colors for a display we might use a different model than we use for a printer because we know that the range of values that our display can show will be different from the range of values that our printer can show."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 58,
    qid: `Q58`,
    qtype: `FUNCTION`,
    format: `mcq`,
    timestamp: `1:08:19`,
    question: `What is the purpose of the CIE 1931 color space?`,
    options: [`To enhance color perception for people with color blindness`, `To define colors for web browsers`, `To serve as a standard reference encompassing all colors visible to average human observers`, `To define colors for printing standards`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:08:39], the lecturer describes it as: "A kind of reference color space called the CIE 1931 color space this is a standard reference that encompasses basically all the colors that are visible by most human observers."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 59,
    qid: `Q59`,
    qtype: `VISUAL`,
    format: `mcq`,
    timestamp: `1:09:49`,
    question: `What does a chromaticity diagram show?`,
    options: [`The intensity-independent component of color (the "color" part without brightness)`, `The relationship between RGB and CMYK`, `How colors change over time`, `The historical development of color theory`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:09:27], the lecturer explains: "This diagram this funny-looking picture or shape is called a chromaticity diagram so chromaticity is the intensity independent component of a color it's it's saying okay for the moment let's not think about brightness."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 60,
    qid: `Q60`,
    qtype: `LIMITATION`,
    format: `mcq`,
    timestamp: `1:11:26`,
    question: `According to the lecture, why don't digital photos of sunsets look as vivid as they do to the naked eye?`,
    options: [`Camera sensors have lower resolution than the human eye`, `People naturally exaggerate their memories of sunset colors`, `Digital displays don't support high enough contrast ratios`, `The sRGB color space used in digital displays covers a smaller range of colors than the human eye can see`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [1:11:04], the lecturer explains: "That explains by the way a little bit why it is that pictures of sunsets don't look as beautiful on your you know when you take a digital photo as they did to the naked eye you're really cutting out a huge set of the space of colors these really rich reds and greens and blues."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 61,
    qid: `Q61`,
    qtype: `PERCEPTUAL`,
    format: `mcq`,
    timestamp: `1:12:38`,
    question: `According to the lecture, why is it important to understand that different people perceive colors differently?`,
    options: [`To design interfaces that are accessible to people with various types of color vision`, `To help people choose better clothing colors`, `To respect cultural differences in color naming`, `To identify which people have superior color vision`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [1:13:19]: "People have designed all sorts of alternative chromaticity diagrams which help to visualize the color gamut the range of colors that are visible for people with different kinds of color vision and this is super important for designing interfaces that are accessible by lots of different people."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
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

export default function Lec14Part2Quiz() {
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
    accent: '#f97316', text: '#e2e8f0', muted: '#94a3b8',
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

  const STORE = 'quiz_lec14'
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
          <Sun size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 14: Color — Part 2</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Radiometry, color spaces, tone mapping, gamma correction</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-14-lecture-quiz.md.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec14/1`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec14/2`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 2</a>
          <a key={3} href={`${BASE}/lec14/3`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 3</a>
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
          <Sun size={20} /> Start Quiz
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
              <Sun size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 14: Color — Part 2</span>
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
                : <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>No intuition yet — add a <code style={{ color: C.accent }}>- INTUITION:</code> block in lectures/cg-14-lecture-quiz.md.md.</p>
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
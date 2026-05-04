'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, BookOpen, Trophy, Clock, CheckCircle, XCircle, Eye, Sun } from 'lucide-react'

// Source: lectures/cg-14-lecture-quiz.md.md  (symlinked → Logseq pages)
// Lecture 14: Color — Part 1 · QQF1–QQ29 · 32 questions (29 MCQ, 3 reveal)
// Regenerate: python3 scripts/gen_quiz.py lectures/cg-14-lecture-quiz.md.md 14

const quizData = [
  {
    id: 1,
    qid: `QF1`,
    qtype: `FLOW`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `The lecture opens with images that appear different on screen vs. print vs. in nature. What underlying mismatch motivates the precise framework the lecture builds?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `Color is device-dependent: the same physical surface appears differently on different displays (different primaries), in print (CMYK inks), and under different lighting. Without a device-independent color model, faithful color reproduction across media is impossible. The lecture builds the psychophysical framework — human cone responses and CIE color matching — that provides a device-independent standard all devices can reference.`,
    intuition: `Color isn't in objects or in light alone — it's in the interaction between light and human perception. Any system that ignores perception will produce mismatched colors.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 2,
    qid: `QF2`,
    qtype: `FLOW`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `Why does the lecture introduce CIE XYZ rather than just working directly with RGB values from displays?`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `RGB is device-dependent — different monitors use different primaries (different red, green, blue wavelengths). CIE XYZ is derived from human cone response functions (color matching experiments from the 1920s) and is device-independent. Any device-specific color space (sRGB, Adobe RGB, CMYK) is a linear transform of XYZ. XYZ is the universal hub: to convert from device A to device B, convert A→XYZ→B. Without this hub, each pair of devices would need a direct conversion table.`,
    intuition: `XYZ encodes what the human eye sees; RGB encodes what a particular display produces. Only XYZ is universal.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 3,
    qid: `QF3`,
    qtype: `ORDER`,
    format: `reveal`,
    timestamp: `00:00`,
    question: `Put these color concepts in the order lecture 14 introduces them: tone mapping and gamma correction / CIE XYZ color space / cone cell response functions (trichromacy) / physical EM spectrum of light`,
    options: [``, ``, ``, ``],
    answer: -1,
    answerText: `Physical EM spectrum of light → Cone cell response functions (trichromacy) → CIE XYZ color space → Tone mapping and gamma correction`,
    intuition: `The lecture follows the causal chain: physics of light → biology of perception → mathematical model of perception → engineering of displays.`,
    explanation: ``,
    code: ``,
    images: [],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 1,
    qid: `Q1`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `00:00`,
    question: `Why does the lecturer argue that we need precise ways of talking about color?`,
    options: [`Because color representation is standardized across all industries`, `Because it's a mandatory topic on the computer graphics exam`, `Because artists requested more rigorous color definitions`, `Because everyday experiences with color often lead to unexpected results`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [00:07], the lecturer introduces the topic by noting "there are actually a lot of different reasons that you'll really start to recognize after going through this lecture that show up even in your daily life," and then gives examples like paint looking different at home than in the store.`,
    code: ``,
    images: ["lec14_slide_31.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 2,
    qid: `Q2`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `01:06`,
    question: `What practical challenge occurs when transitioning from digital media to print media?`,
    options: [`Printers add colors that weren't in the original digital file`, `The printed output often looks duller than the digital version`, `Print media can display a wider range of colors than digital media`, `Digital colors are always more vibrant than print colors`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [01:48]: "If I have color on my screen but I'm using that to design something that's being printed... you're gonna get a very different output from the printer than you will from the display" and notes how a "very vivid rainbow colored umbrellas" can look "really dull" when printed.`,
    code: ``,
    images: ["lec14_slide_54.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 3,
    qid: `Q3`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `02:23`,
    question: `How is color used in scientific applications?`,
    options: [`To distinguish between different scientific disciplines`, `Only in astronomy, not in other scientific fields`, `To encode important information about the phenomenon being studied`, `Only for aesthetic purposes in visualization`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [02:23], the lecturer states: "Understanding color is also extremely important if we want to do science if I have images that are being used for a scientific purpose the colors can indicate really important or really interesting things about the phenomenon being studied."`,
    code: ``,
    images: ["lec14_slide_54.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 4,
    qid: `Q4`,
    qtype: `RELATIONSHIP`,
    format: `mcq`,
    timestamp: `03:03`,
    question: `According to the lecture, why might a sunset photo appear less impressive than seeing it in person?`,
    options: [`Cameras have limited resolution compared to the human eye`, `The perceptual experience of color is not fully captured by the camera`, `Sunsets are always enhanced by human memory`, `Digital displays can't show sunset colors at all`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [03:34], the lecturer references this common experience: "Many of you have probably had the experience of going out seeing this beautiful sunset taking a photo... and your friend gets the photo and thinks well that's okay it's not that exciting right what was lost there," suggesting the perceptual experience isn't fully captured.`,
    code: ``,
    images: ["lec14_slide_58.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 5,
    qid: `Q5`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `03:58`,
    question: `From a physical perspective, what is color?`,
    options: [`A property of materials that changes how they reflect light`, `A combination of RGB values that produces visual effects`, `The frequency at which electromagnetic fields oscillate`, `A subjective experience unique to each individual`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer directly states at [04:31]: "Color is just the frequency at which this field is oscillating, the frequency of this oscillating field determines the color of the light."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 6,
    qid: `Q6`,
    qtype: `RELATIONSHIP`,
    format: `mcq`,
    timestamp: `05:03`,
    question: `What is the relationship between frequency and wavelength of light?`,
    options: [`They are inversely related (frequency = 1/wavelength)`, `They are the same thing, just different terms`, `They are directly proportional (frequency increases as wavelength increases)`, `They are completely unrelated properties of light`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `At [05:30], the lecturer clearly states: "Frequency is 1 over wavelength, wavelength is 1 over frequency."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 7,
    qid: `Q7`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `05:51`,
    question: `Why does a stove element turn red as it heats up?`,
    options: [`Heat causes particles to move, generating electromagnetic radiation at visible frequencies`, `Red is always the first color to appear in any heated object`, `The metal is oxidizing and changing its chemical composition`, `The metal contains compounds that specifically emit red light when heated`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [06:32]: "Heat generates light" and at [07:35]: "Since these particles have some charge to them right they are gonna create an electromagnetic field in other words anything that's moving will generate light."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 8,
    qid: `Q8`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `07:00`,
    question: `According to the lecture, what happens at an atomic level when objects heat up?`,
    options: [`Atoms lose their electrons and become ionized`, `The object changes its chemical composition`, `Atoms become perfectly still and arranged in rigid structures`, `Particles begin to vibrate and jiggle more intensely`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [07:06], the lecturer states: "If we think about what do things look like at an atomic scale really even solid objects are jiggling around a little bit and then definitely as things heat up... the things are jiggling more and more and more."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 9,
    qid: `Q9`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `08:14`,
    question: `What principle allows thermal imaging to detect people through walls?`,
    options: [`Special thermal cameras use x-rays to see through barriers`, `Thermal cameras can detect sound waves through walls`, `People emit visible light that passes through walls`, `Bodies emit infrared radiation because they're warm`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `At [08:14], the lecturer explains: "This is why for instance you can build devices that that do thermal imaging you want to see somebody through a wall okay maybe you get their thermal signature you're seeing the light that's given off just by the fact that their bodies are warm."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 10,
    qid: `Q10`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `09:04`,
    question: `Why don't we see everything glowing at night even though all warm objects emit some light?`,
    options: [`Objects at normal temperatures don't emit any light at all`, `Most objects emit light outside the narrow range of human visible spectrum`, `Air molecules absorb all the light emitted by objects`, `The human brain filters out this constant glow`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [09:04]: "Actually the frequencies of light that human beings can see are limited to a very very narrow range of wavelengths and that's what we call the visible spectrum," and at [08:50]: "Most light is not visible to the human eye."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 11,
    qid: `Q11`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `10:11`,
    question: `What is white light composed of?`,
    options: [`Only the three primary colors: red, green, and blue`, `The absence of any color or frequency`, `A single frequency that appears white to the human eye`, `A mixture of all visible colors/frequencies`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [10:17]: "When we talk about white light when we turn on a really nice light bulb and it shines this beautiful white light that's really not one particular color of light white is not a color of light white is really a mixture of all colors."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 12,
    qid: `Q12`,
    qtype: `COMPARISON`,
    format: `mcq`,
    timestamp: `11:29`,
    question: `What is the difference between emission spectra and absorption spectra?`,
    options: [`Emission spectra are theoretical while absorption spectra are actually measurable`, `Emission spectra show color while absorption spectra only show black and white`, `Emission spectra measure how much light is emitted at each frequency; absorption spectra measure how much light is absorbed at each frequency`, `Emission spectra are used for scientific purposes; absorption spectra are only used for art`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [11:29], the lecturer explains emission spectra as "how much light is produced by whatever source" and at [12:36] describes absorption spectra as "saying for each frequency if I shine white light on it what fraction of that light is absorbed."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 13,
    qid: `Q13`,
    qtype: `VISUAL`,
    format: `mcq`,
    timestamp: `12:58`,
    question: `According to the lecture, why does fluorescent light often feel "sickly" compared to natural sunlight?`,
    options: [`Fluorescent light flickers at a frequency that disturbs the eye`, `The spectral distribution of fluorescent light is "spiky" rather than smooth`, `Fluorescent light contains harmful UV radiation that affects perception`, `Fluorescent light is much brighter than sunlight`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `At [13:40], the lecturer notes: "Fluorescent light looks very different it looks very spiky" and at [14:00] explains: "Part of the reason is it really is not like sitting outside in the sunshine the distribution of light even though it might appear roughly the same color it might appear kind of white to you the distribution of frequencies is very different it feels very unnatural and very icky."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 14,
    qid: `Q14`,
    qtype: `MCQ`,
    format: `mcq`,
    timestamp: `14:00`,
    question: `What trade-off exists between incandescent and fluorescent lightbulbs?`,
    options: [`Fluorescent bulbs have better color but are more expensive`, `Fluorescent bulbs are cheaper but less durable`, `Incandescent bulbs are brighter but generate too much heat`, `Incandescent bulbs have better color distribution but are less energy efficient`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [15:05]: "Incandescent lights are good because they kind of pump out light in all different frequencies but they're more power-hungry they suck up a lot of power to do so," contrasting with fluorescent bulbs that are more power efficient but have a "choppy spectrum."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 15,
    qid: `Q15`,
    qtype: `VISUAL`,
    format: `mcq`,
    timestamp: `15:16`,
    question: `What perceptual trick do compact fluorescent bulbs rely on?`,
    options: [`They create the illusion of brighter light with less energy`, `They make the room appear larger than it actually is`, `They fool the eye into believing the light has the same color despite having a different spectrum`, `They create the illusion of continuous illumination through rapid flashing`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [15:16], the lecturer states: "You can kind of trick the eye you can fool people into believing that a light bulbs showing the same color of light but with a very different spectrum."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 16,
    qid: `Q16`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `17:22`,
    question: `Why do plants appear green?`,
    options: [`Because the human eye is most sensitive to green wavelengths`, `Because plants absorb red and blue light, reflecting mostly green light`, `Because plants emit green light`, `Because plants absorb green light and reflect other colors`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [17:22]: "Chlorophyll is going to absorb the Reds it's gonna absorb the Blues but it's not gonna absorb the greens meaning if I shine white light on a plant what's gonna bounce back at me is just the green light that's why it appears green."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 17,
    qid: `Q17`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `18:48`,
    question: `According to the lecture, what should be your fundamental mental model for understanding color?`,
    options: [`The RGB color model used in digital displays`, `The spectral description of light's intensity or absorption as a function of frequency`, `The HSV model that separates hue, saturation, and value`, `The CMYK model used in printing`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer emphasizes at [18:48]: "If you remember to use this spectral description as a starting point if you always use this as your mental model for good what's going on with color then all these other issues surrounding color theory and practical encodings digital encodings of color will make a lot more sense."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 18,
    qid: `Q18`,
    qtype: `MATHEMATICAL`,
    format: `mcq`,
    timestamp: `19:59`,
    question: `When light reflects off an object, how is the resulting color determined?`,
    options: [`By selecting the dominant frequency from either the emission or reflection spectrum`, `By adding the emission spectrum to the reflection spectrum`, `By multiplying the emission spectrum and the reflection spectrum for each frequency`, `By taking the average of the emission and reflection spectra`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [22:06], the lecturer states: "The resulting intensity is going to be a product for each frequency nu the final intensity of this reflected off the object is how much light got emitted times how much got reflected."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 19,
    qid: `Q19`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `21:13`,
    question: `If a green light shines on an object that primarily reflects red light, what color will you see?`,
    options: [`A bright yellow color`, `Very little light (appearing nearly black)`, `A vibrant green color`, `A deep red color`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains this scenario at [22:32]: "We shown some green light on something that absorbs most green light so we don't see much green the light still does have a little bit of red in it so we see a little bit of red." The result would be very little light reflected back.`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 20,
    qid: `Q20`,
    qtype: `APPLICATION`,
    format: `mcq`,
    timestamp: `22:24`,
    question: `Why is color reproduction challenging when going from one medium to another?`,
    options: [`Because most people are at least partially colorblind`, `Because different cultures perceive colors differently`, `Because the interaction between light sources, surfaces, and eyes creates a complex chain`, `Because the color names are inconsistent across media`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [22:51], the lecturer explains: "Color clearly starts to get complicated as we start combining emission and absorption or reflection" and at [23:05] elaborates on the complex chain: "We have this light it has some interesting spectrum we have some paint we're putting on our wall the light bounces off the paint and then also something that's challenging is that light goes into the eye."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 21,
    qid: `Q21`,
    qtype: `EXAMPLE`,
    format: `mcq`,
    timestamp: `23:53`,
    question: `What does "The Dress" controversy demonstrate about color perception?`,
    options: [`That cameras cannot accurately capture color`, `That color perception is psychological and context-dependent`, `That people have different numbers of cone types in their eyes`, `That blue and gold are particularly difficult colors to distinguish`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer points out at [24:26]: "The really important thing here is to realize that color perception is very psychological perception of color has a lot to do with what people think the context is what people think is going on beyond just the raw spectrum that's entering their eye."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 22,
    qid: `Q22`,
    qtype: `ANALOGY`,
    format: `mcq`,
    timestamp: `24:58`,
    question: `How is the human eye similar to a pinhole camera?`,
    options: [`Both use digital sensors to detect light`, `Both can record images for later viewing`, `Light enters through a small opening and projects an inverted image on the back`, `Both have mechanical shutters that control exposure`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer makes this comparison at [25:36]: "This is not so different from our pinhole camera that we talked about before remember we talked about a pinhole camera is like a cardboard box you poke a hole in it and put a piece of film on the back I mean the eye is just a much more sophisticated version of the pinhole camera."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 23,
    qid: `Q23`,
    qtype: `CONCEPTUAL`,
    format: `mcq`,
    timestamp: `26:27`,
    question: `What phenomenon demonstrates the brain's ability to adapt to inverted visual input?`,
    options: [`People eventually seeing normal colors when wearing special glasses that invert the world`, `The brain turning upside-down images right-side up`, `Color blindness compensation over time`, `The ability to read mirrored text after practice`],
    answer: 0,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer describes at [26:27]: "It's pretty remarkable actually you've done experiments where they'll give people sort of special glasses that turn the world upside down and the brain will again adjust it so that it's right side up right so the brains are pretty amazing double piece of machinery."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 24,
    qid: `Q24`,
    qtype: `MATHEMATICAL`,
    format: `mcq`,
    timestamp: `27:41`,
    question: `What determines how strongly a photosensor responds to different wavelengths of light?`,
    options: [`The power of the light source only`, `The type of lens used with the sensor`, `The ambient temperature of the environment`, `The spectral response function of the sensor`],
    answer: 3,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [27:41]: "That device is going to respond more strongly or more weakly to different wavelengths of light" and "that's encoded by this spectral response function f of lambda" which "describes the sensitivity of the sensor to a given wavelength of light."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 25,
    qid: `Q25`,
    qtype: `DEFINITION`,
    format: `mcq`,
    timestamp: `29:26`,
    question: `What are the two main types of photoreceptors in the human eye?`,
    options: [`Sensors and detectors`, `Cones and pyramids`, `Rods and cones`, `Spheres and cylinders`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [29:35], the lecturer clearly states: "There are two kinds of receptors there are rods and there are cones which kind of describe roughly the the geometry or the morphology of these different types of cells and they serve two different functions."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 26,
    qid: `Q26`,
    qtype: `FUNCTIONAL`,
    format: `mcq`,
    timestamp: `30:35`,
    question: `What is the primary function of rod cells in human vision?`,
    options: [`Detecting colors in bright light`, `Blocking excessive light from damaging the retina`, `Capturing intensity in dim light conditions`, `Distinguishing between colors in the peripheral vision`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer states at [29:53]: "Rods are things that can help us see things when we have very dim illumination okay so what they're doing is they're just capturing intensity they don't really care so much about is it red light is it green light is it blue light they're just gonna integrate whatever light they can get because it's it's dark outside."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 27,
    qid: `Q27`,
    qtype: `COMPARISON`,
    format: `mcq`,
    timestamp: `30:35`,
    question: `How many different types of cone cells are found in the typical human eye?`,
    options: [`Two types`, `Five types`, `Three types`, `Four types`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [30:35], the lecturer states: "There are three different types of cones that respond to different colors of light."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 28,
    qid: `Q28`,
    qtype: `FACT`,
    format: `mcq`,
    timestamp: `31:48`,
    question: `According to the lecture, how does the distribution of photoreceptors vary across the retina?`,
    options: [`Rods are concentrated in the center, while cones are more numerous in the periphery`, `Cones are concentrated in the center, while rods are more numerous in the periphery`, `Both rods and cones are most concentrated in the periphery`, `Rods and cones are evenly distributed throughout the retina`],
    answer: 1,
    answerText: ``,
    intuition: ``,
    explanation: `The lecturer explains at [32:03]: "As we get closer and closer to the center... we actually have more cones the cones are going up but there's also this dip in rods" and adds at [32:57]: "These cones they fall off so fast as we get away from the center that really your color vision in your periphery your peripheral color vision is really quite poor."`,
    code: ``,
    images: ["lec14_slide_65.png"],
    tags: [],
    source: `lectures/cg-14-lecture-quiz.md.md`,
  },
  {
    id: 29,
    qid: `Q29`,
    qtype: `ANATOMICAL`,
    format: `mcq`,
    timestamp: `33:17`,
    question: `What causes the blind spot in human vision?`,
    options: [`A region of the retina that becomes damaged over time`, `A psychological phenomenon rather than a physical one`, `The point where the optic nerve connects to the retina lacks photoreceptors`, `A developmental defect in the eye`],
    answer: 2,
    answerText: ``,
    intuition: ``,
    explanation: `At [33:24], the lecturer explains: "That's the place where your eye your eyeball is hooked up to the rest of your brain right you essentially this cable called the optic nerve that connects your eye to the rest of the brain and at that place well there's you can't put it in any photo receptors there."`,
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

export default function Lec14Part1Quiz() {
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
          <Sun size={64} color={C.accent} style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: C.accent, margin: '0 0 0.5rem' }}>Lecture 14: Color — Part 1</h1>
          <p style={{ color: C.muted, marginBottom: '0.25rem' }}>Radiometry, color spaces, tone mapping, gamma correction</p>
          <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>lectures/cg-14-lecture-quiz.md.md</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <a key={1} href={`${BASE}/lec14/1`} style={{ color: C.accent, fontSize: "0.85rem" }}>Part 1</a>
          <a key={2} href={`${BASE}/lec14/2`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 2</a>
          <a key={3} href={`${BASE}/lec14/3`} style={{ color: C.muted, fontSize: "0.85rem" }}>Part 3</a>
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
              <Sun size={18} color={C.accent} />
              <span style={{ color: C.accent, fontWeight: 600 }}>Lecture 14: Color — Part 1</span>
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
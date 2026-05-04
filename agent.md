# Agent Process: Generating Lecture Quizzes

Repeatable workflow for turning a CMU 15-462 lecture PDF + Logseq card file into
a fully-linked quiz with slide images.

---

## 1. Extract slide text

```bash
pdftotext -layout lecture_N.pdf - | python3 scripts/split_slides.py > /tmp/lecN_slides.json
```

Use `pdftotext`, not OCR or marker-pdf. CMU slides are generated from Keynote/PowerPoint
and have embedded text — `pdftotext` is fast, accurate, and requires no GPU.

---

## 2. Convert slides to images

```bash
pdftoppm -r 150 -png lecture_N.pdf /tmp/lecN_slide
for f in /tmp/lecN_slide-*.png; do mv "$f" "${f/-/_}"; done   # hyphen → underscore
cp /tmp/lecN_slide_*.png public/assets/
cp /tmp/lecN_slide_*.png /home/diako/csRobotics/logseq3/assets/
```

Naming convention: `lecN_slide_NN.png` (zero-padded, underscore).
Images must go to BOTH `public/assets/` (Next.js web) AND `logseq3/assets/` (Logseq display).

---

## 3. Identify slide types

Before writing questions, classify each slide:

| Type | Description | Write a question? |
|------|-------------|-------------------|
| **Content** | Introduces a concept, definition, algorithm, formula | Yes |
| **Example/demo** | Works through a specific case | Yes |
| **Comparison/table** | Contrasts two or more approaches | Yes |
| **Transition/hook** | "Ok but why is X useful?", "How do we encode this?" — pure rhetorical bridge to the next topic | **No** |
| **Title slide** | Lecture title only | No |
| **"Next time"** | Closing preview slide | Optional (one summary question max) |
| **Topic spacer** | Visual break / section divider with no new content | No |

**Key rule:** You do NOT need one question per slide. Transition slides, hooks, and
spacers exist to pace the lecture, not to convey testable content. Skip them.
A good target is roughly one question per *content* slide, which is usually
60–80% of total slides.

---

## 4. Map questions to slides (temporal ordering)

1. For each question, score slides by keyword overlap (question text + explanation text vs. slide text).
2. **Enforce monotonic ordering**: questions follow the lecture slide order. It is very rare for a lecturer to jump back to an earlier slide. Apply a monotonicity constraint — a question's slide number must be ≥ the previous question's slide number.
3. **Always verify by reading the slide content**, not just the number. A common failure mode: keyword scoring assigns Q_flip → slide_29 and Q_split → slide_27 when the correct mapping is Q_flip → slide_27, Q_split → slide_28. If two adjacent questions' slides are out of numerical order, stop and re-read both slide texts to find the correct mapping.
4. Double-check the final sequence by printing `[QN] → slide_NN: <first line of slide text>` for every question and scanning for any slide number that decreases.

---

## 5. Edit the existing Logseq file in-place

**CRITICAL**: Always edit the EXISTING `.md.md` file in `logseq3/pages/`. Never create a
new file. The file already has questions — you are adding slide image references and
possibly new questions.

File path pattern: `/home/diako/csRobotics/logseq3/pages/cg-NN-<name>-quiz.md.md`

Image reference format (Logseq):
```
\t  ![lecN_slide_NN.png](../assets/lecN_slide_NN.png)
```
Add this line after the `- EXPLANATION:` block of each card.

---

## 6. Regenerate the JSX

```bash
python3 scripts/gen_quiz.py lectures/cg-NN-lecture-quiz.md NN
```

The symlink in `lectures/` points to the Logseq original. Regenerating picks up all edits.

---

## 7. Build and deploy

```bash
pnpm build
git add -A && git commit -m "Add lecN quiz with slide images"
git push
```

GitHub Actions runs `BASE_PATH=/cmu-computer-graphics pnpm build` and deploys to Pages.

---

## Question formats

Multiple choice is not always the best format. Use the format that matches what the question is actually testing.

| Format | Type tag | Best for | Weakness |
|--------|----------|----------|----------|
| **Multiple choice** | `MCQ` | Recognizing correct definitions; distinguishing common misconceptions | Guessable; doesn't test ability to produce the answer |
| **Short answer** | `SHORT` | Explaining a concept in your own words; synthesis across lecture sections | Requires self-grading (reveal model) |
| **Fill in the blank** | `FILL` | Formulas, struct field names, algorithm steps with precise vocabulary | Needs exact wording in answer |
| **Ordering** | `ORDER` | Algorithm steps, data structure upgrade staircase, lecture flow | Hard to randomize meaningfully |
| **True / False + justify** | `TF` | Correcting common misconceptions; boundary cases | Bare T/F is too easy — always require justification |
| **Spot the error** | `DEBUG` | Subtle invariants, wrong code/pseudocode, misconception traps | Needs a well-crafted wrong statement |
| **Derive / trace** | `DERIVE` | Mathematical progressions, traversal algorithms, pointer updates | Long to write; best for key algorithms only |

### Guidance on when to use each

- **FLOW questions**: prefer `SHORT` — synthesis questions that ask "explain why" are poorly served by MCQ.
- **Definitions** (what is X?): `MCQ` is fine; distractors do useful work.
- **Algorithm steps** (halfedge traversal, edge flip pointer updates): `ORDER` or `DERIVE` — actually tracing is more valuable than picking the right description.
- **Formulas / struct fields**: `FILL` — having to recall "twin, next, vertex, edge, face" is harder and more useful than picking it from a list.
- **Misconceptions** (fans not fins, connectivity vs. geometry): `TF` + justify or `DEBUG`.

### Non-MCQ card format

```
- #card [QN] [SHORT] [MM:SS] In your own words, explain why X implies Y.
	- ANSWER: [model answer — a few sentences]
	- INTUITION: [one sentence core insight]

- #card [QN] [FILL] [MM:SS] Each halfedge stores five pointers: ___, ___, ___, ___, and ___.
	- ANSWER: twin, next, vertex, edge, face
	- INTUITION: ...

- #card [QN] [ORDER] [MM:SS] Put these mesh representations in the order the lecture introduces them, from simplest to most powerful: halfedge / adjacency list / incidence matrices / polygon soup.
	- ANSWER: polygon soup → adjacency list → incidence matrices → halfedge
	- INTUITION: Each upgrade adds exactly the one operation the previous structure made expensive.

- #card [QN] [DEBUG] [MM:SS] What is wrong with this statement: "A valid halfedge mesh can represent non-manifold geometry."
	- ANSWER: False — valid halfedge connectivity guarantees manifold topology by construction.
	- INTUITION: ...
```

The quiz renderer needs to handle these formats. `SHORT`, `FILL`, `ORDER`, `DEBUG` all use a **reveal model** (student attempts, then flips to see the answer) rather than auto-grading.

---

## Card format reference (MCQ)

```
- #card [QN] [TYPE] [MM:SS] Question text?
  A) ...
  B) ...
  C) ...
  D) ...
	- ANSWER: X
	- EXPLANATION: ...
	  ![lecN_slide_NN.png](../assets/lecN_slide_NN.png)
	- INTUITION: First-principles or geometric intuition — NOT a restatement of the explanation.
```

Types: `DEFINITION`, `CONCEPT`, `ALGORITHM`, `IMPLEMENTATION`, `COMPARISON`, `EFFICIENCY`, `APPLICATION`, `UNDERSTANDING`, `OPERATION`.

---

## Flow questions

Every quiz should begin with **2–3 FLOW questions** (type `FLOW`, id prefix `QF`) placed before Q1.

Flow questions test understanding of the lecture *as a narrative*, not as isolated facts. They are the questions a student needs to answer before isolated facts make sense.

### The four flow question types

| Type | What it tests | Example stem |
|------|---------------|--------------|
| **PROGRESSION** | Why does the lecture move from concept A to concept B? What limitation of A motivates B? | "The lecture evaluates representations in order: X → Y → Z. What specific failure of each motivates the next?" |
| **MOTIVATION** | Why is this topic being introduced at all? What problem does the whole lecture solve? | "What is the overarching problem the lecture sets out to solve, and what answer does it arrive at?" |
| **ANALOGY** | What familiar concept does the lecturer map onto the new one, and why does the analogy hold? | "Why does the lecture open with bitmap images before discussing surfaces?" |
| **CONNECTION** | How do two concepts from different sections of the lecture relate? | "How does the manifold assumption connect to the halfedge data structure?" |

### Rules for flow questions

- Write them from the perspective of someone re-reading the lecture after the fact — "now that I've seen all of this, why did it go in this order?"
- Correct answer must synthesize at least two sections of the lecture.
- Distractors should be plausible (e.g., "uses less memory" is a tempting but wrong reason for many choices).
- Place all FLOW questions at the very top of the QUESTIONS section, before Q1.

---

## Lectures completed

| Lecture | Slides | Questions | Status |
|---------|--------|-----------|--------|
| Lec10: Meshes & Manifolds | 36 | 27 | Images added, slide mapping needs review |
| Lec11: Geometry Processing | 47 | 27 | Images added |
| Lec12: Geometric Queries | 31 | 41 | Images added |
| Lec20: Introduction to Animation | ~46 | 36 | Done |
| Lec21: Dynamics & Time Integration | ~46 | 36 | Done (user corrected some images manually) |
| Lec22: Introduction to Optimization | 32 | 62 | Done |
| Lec23: PDEs & Physical Animation | — | ~36 | Done |

## Lectures remaining

Lec13–Lec19 (not yet started)

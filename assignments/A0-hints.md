# A0 - Thinking Pointers (No Answers Here)

---

## A0T1 — Build Your Scotty3D

**Questions to ask yourself:**
- What OS are you on? The assignment mentions Visual Studio 2022 (Windows) — does that apply to you?
- What build system does this project use? Look at the root of the repo — is there a `CMakeLists.txt`? A `Makefile`? Something else?
- Have you confirmed all dependencies are present before trying to build?
- Can you run the app in **both** modes? (GUI and test/CLI) — they are different launch commands.

**Things to try:**
- Read the `README.md` at the root of the repo carefully — build instructions live there.
- If the build fails, work **top-to-bottom** through the error output (same principle as A0T2).
- Verify your screenshots match what the writeup template asks for, not just "something ran."

---

## A0T2 — Debugging in CLI

> General strategy: read each function carefully, understand its *intended* behavior first, then compare that to what the code actually does.

---

### Problem 1 — `test_a0_task2_problems_print`

The assignment already tells you there are **3 things to fix** and walks you through the first one (namespaces).

**Questions to ask yourself:**
- After fixing the namespace issue, what other compiler errors remain?
- Read each remaining error line: location → error code → description. What is each one telling you?
- Look very carefully at the code character by character — is every symbol exactly right?
- Does every statement end properly in C++?

---

### Problem 2 — `test_a0_task2_problems_numerical`

**Questions to ask yourself:**
- Read the comment in the code that gives an example: `y / 3 = 4 / 3 = 1.333`. Does your C++ code actually produce `1.333` when you divide two `int`s?
- What is the type of `factor`? What does that mean for the division `y / factor`?
- Manually trace through a few values using the *intended* math (from the comment) vs. what the code actually computes. Where do they diverge?
- What is the minimal change you can make to preserve the approach but get the correct numeric behavior?

---

### Problem 3 — `test_a0_task2_problems_vector`

**Questions to ask yourself:**
- Look up (or recall) what `std::vector::end()` actually returns. Is it the last element, or something else?
- If the iterator points somewhere unexpected, what value does dereferencing it give you?
- The hint says "befriend C++ documentation websites" — `cppreference.com` is your friend here.
- What iterator-based way exists to get the *actual* last element?

---

### Problem 4 — `test_a0_task2_problems_boolean`

**Questions to ask yourself:**
- The comment says "check if the numbers at indices i, j, k are the same." Does the code actually express that?
- What does the `==` operator return in C++? What *type* is the result of `vec1.at(i) == vec2.at(j)`?
- What happens when you then compare *that result* to `vec3.at(k)` (which is an `int`)?
- Try evaluating the condition by hand for a few values — does it match the intent?
- Think about operator precedence and how to correctly chain equality checks.

---

## A0T3 — Debugging in GUI

**The setup:** Scotty3D crashes when you load a Pentagon mesh, with the assertion:
> `Vertex with id 5 references past-the-end halfedge.`

**Questions to ask yourself:**
- What does a **halfedge mesh** structure require? Every vertex must reference a valid halfedge — what does "past-the-end" mean here?
- A pentagon has how many vertices? How many halfedges does a single polygon face with N sides need?
- The assignment says to use the **VSCode debugger** and inspect the **call stack**. What sequence of function calls led to the crash? Which one is responsible for building the Pentagon mesh data?
- Once you find that function/data, look at the indices carefully — do they cover all vertices correctly?

**Debugging workflow to follow:**
1. Run with debugger attached.
2. Reproduce the crash (Create Object → Mesh Instance → Pentagon → Replace).
3. When the breakpoint fires, open the **Call Stack** panel.
4. Walk up the stack — find the frame that is *constructing* the pentagon geometry.
5. Inspect the data there. Count the vertices vs. the halfedge assignments.

---

## General C++ Debugging Tips (for this whole assignment)

- Always read error messages top-to-bottom; fix the first error and recompile before tackling the rest.
- When behavior is wrong (not a compile error), *trace the logic manually* with pen and paper for a few concrete values.
- `cppreference.com` is the authoritative C++ reference — use it freely.
- The debugger call stack is not just for crashes; it tells you the *story* of how you got there.

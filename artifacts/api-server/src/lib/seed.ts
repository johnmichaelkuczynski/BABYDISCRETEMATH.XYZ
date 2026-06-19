import { db } from "@workspace/db";
import {
  topicsTable,
  lecturesTable,
  assignmentsTable,
  problemsTable,
  seedMetaTable,
} from "@workspace/db";
import { eq, sql, and, like, notInArray } from "drizzle-orm";
import { logger } from "./logger";

// Content version of the seeded curriculum. BUMP THIS whenever the TOPICS or
// ASSIGNMENTS content below changes. On boot, seedIfEmpty compares this against
// the value stored in seed_meta; a mismatch forces a full re-seed, so content
// edits self-heal in every environment (including a republished production)
// without a manual database wipe.
const SEED_CONTENT_VERSION = "2026-06-18-baby-discrete-math-v1";

type SeedTopic = {
  slug: string;
  title: string;
  weekNumber: number;
  blurb: string;
  lectureTitle: string;
  body: string;
};

const TOPICS: SeedTopic[] = [
  // Unit 1 — Baby Discrete Math: the math of distinct things
  {
    slug: "what-discrete-math-is",
    title: "What discrete math is",
    weekNumber: 1,
    blurb: "Discrete math is the mathematics of separate, countable things — whole numbers, statements, sets, networks — rather than the smooth, continuous quantities of calculus. It is the native language of computers.",
    lectureTitle: "1.1 What discrete math is: the math of distinct things",
    body: `# What discrete math is

Most people's idea of "math" is the math of smooth, continuous things — curves, areas, speeds that blend from one value into the next, the world of calculus. **Discrete mathematics** comes at it from the opposite direction. It is the math of things that are **separate and distinct**: whole numbers you can count, true-or-false statements, individual items in a collection, dots joined by lines. There is nothing in between one and two, no halfway point between a statement being true and false. That focus on distinct, countable things turns out to be exactly the math that computers — and clear reasoning itself — are built on.

## Discrete versus continuous

The dividing line is whether the things you study come in separate pieces or flow smoothly. **Continuous** math deals with quantities that can take any value and slide gradually — temperature, distance, time — and it leans on limits and the infinitely small. **Discrete** math deals with quantities that come in indivisible units — the number of people in a room, the steps in a procedure, the nodes in a network — where "a little bit more" means jumping to the next whole thing. A dimmer switch is continuous; a light that is simply on or off is discrete. This course lives entirely on the discrete side.

## The toolkit

Discrete math isn't one idea but a small family of closely related tools, and this unit visits each: **logic**, the rules of valid reasoning; **proof**, how you establish something beyond doubt; **sets, relations, and functions**, the grammar for describing structure; **counting**, the art of knowing how many without listing them all; **graphs**, dots-and-lines models of networks; **modular arithmetic**, the clock-style number system behind modern cryptography; and **recursion and induction**, the way to define and reason about things built in stages. Together they form the mathematical backbone of computer science.

## Why computers love it

This is no accident. A computer is a fundamentally **discrete** machine: it stores information as distinct bits, takes one step at a time, and never deals in true infinities or infinitely fine measurements. So the math that describes what computers can do, how long they take, and whether a program is correct is discrete math, not calculus. Counting tells you how long an algorithm runs; logic tells you whether a circuit or a program is right; graphs model the networks data travels through. If you want to understand computing, this is the math underneath it.

## A different kind of thinking

Discrete math also asks for a different mental habit than the math you may be used to. There is less emphasis on calculation and formula-crunching and far more on **careful reasoning**: defining things precisely, arguing why something must be true, and counting possibilities without missing or double-counting any. It rewards clear thinking over memorized procedures. That is why it is often a student's first taste of "real" mathematics — the kind where you *prove* things rather than just compute them — and why it sharpens reasoning you can use far beyond math.

## In the real world

Discrete math is quietly everywhere in technology. Every time a message is encrypted, a route is found on a map, a database answers a query, or a schedule is built without conflicts, discrete math is doing the work. Logic underlies the circuits in every chip and the conditions in every program. Counting underlies probability, passwords, and the analysis of how long computations take. Graphs underlie social networks, the internet's routing, and GPS. For a subject about "separate, countable things," discrete math turns out to shape an enormous amount of the connected world you use every day.`,
  },
  {
    slug: "logic",
    title: "Logic",
    weekNumber: 1,
    blurb: "Logic turns vague arguments into precise statements that are simply true or false, combined by a handful of connectives — and, or, not, if-then — that behave by exact rules. It is the foundation of all proof and all computation.",
    lectureTitle: "1.2 Logic: the machine code of reasoning",
    body: `# Logic

Before you can prove anything or trust any reasoning, you need a precise language for **statements** and how they combine. That language is **logic**. Ordinary language is slippery — words like "or" and "if" carry shades of meaning that shift with context. Logic strips that away, treating a statement as something that is simply **true or false**, and giving exact rules for combining statements. It is, in a real sense, the machine code of reasoning: the lowest-level, unambiguous layer that every careful argument — and every digital circuit — is built on top of.

## Statements and truth values

A **statement** (or proposition) is a sentence that is definitely either **true** or **false** — not both, not neither. "Seven is a prime number" is a statement (true); "It is raining" is a statement (its truth depends on the situation); "Close the door" is not a statement at all, because it can't be true or false. This insistence that every statement carries a single **truth value** is the whole starting point. Discrete math doesn't deal in "sort of true" — a statement's value is one of exactly two things, which is precisely what makes logic mechanical and reliable.

## The connectives

You build complex statements from simple ones using a few **connectives**, each with an exact meaning. **NOT** flips a statement's truth: "not true" is false. **AND** is true only when *both* parts are true. **OR** is true when *at least one* part is true (including both — logic's "or" is inclusive, unlike everyday speech). **IF…THEN** ("implication") claims that whenever the first part holds, so does the second. Each connective is defined not by intuition but by a **truth table** — a complete list of what it yields for every combination of inputs — so there is never any ambiguity about what a compound statement means.

## Implication: the tricky one

The connective people stumble on is **if-then**. "If it rains, the ground gets wet" only makes a promise about the case where it *does* rain; it says nothing about dry days. So logicians treat the implication as **false in exactly one situation** — when the "if" part is true but the "then" part is false (the promise was broken) — and true otherwise, even when the "if" part is false. This is why "if pigs fly, then I'm a millionaire" counts as *true*: the premise never holds, so the promise is never broken. Getting implication right is essential, because nearly every theorem is an if-then.

## Quantifiers: "all" and "some"

Real statements often talk about *many* things at once, and for that logic adds **quantifiers**. "**For all**" claims something holds of *every* item ("every prime greater than two is odd"); "**there exists**" claims it holds of *at least one* ("some number is both even and prime"). The power here is in how they interact with NOT: the opposite of "all swans are white" is not "no swans are white" but "**there exists** a swan that is not white." Recognizing that the negation of "all" is "some…not" — and vice versa — is one of the most useful reasoning skills logic teaches.

## In the real world

Logic isn't an abstraction off in a textbook — it is wired into the machines around you. Every digital circuit is built from **logic gates** that physically compute AND, OR, and NOT on electrical signals, so a processor is, at bottom, a vast tower of these connectives. Every \`if\` statement, every \`&&\` and \`||\`, and every database query you write is applied logic. And precise reasoning about "for all" and "there exists" is exactly what lets engineers *prove* a program or a chip behaves correctly. The unambiguous true/false discipline of logic is what makes both computers and rigorous arguments possible.`,
  },
  {
    slug: "proof",
    title: "Proof",
    weekNumber: 1,
    blurb: "A proof is an airtight chain of logic from things you accept to the thing you want to establish — the tool that lets mathematics claim certainty that no amount of examples can provide.",
    lectureTitle: "1.3 Proof: how you know something for certain",
    body: `# Proof

In most of life, "evidence" means examples: you believe something because you've seen it happen a lot. Mathematics is different — it deals in **certainty**, and the tool that delivers it is the **proof**. A proof is an airtight chain of reasoning that takes you from statements you already accept to the statement you want to establish, with every step justified. Checking a thousand cases can make a claim *likely*; a proof makes it *certain*, true for every case at once, with no exceptions hiding somewhere you didn't look. Learning to read and write proofs is the heart of discrete math.

## Why examples aren't enough

It is tempting to think that if a pattern holds for the first many cases, it must always hold — but mathematics is littered with patterns that fail much later. A famous example: the expression *n² + n + 41* produces a prime number for every *n* from 0 up to 39, which looks like an ironclad rule — until *n = 40*, where it suddenly isn't prime. Examples can *suggest* a truth and can *disprove* a false one, but they can never *guarantee* a "for all" claim, because you cannot check infinitely many cases. That gap between "always so far" and "always" is exactly what proof exists to close.

## Direct proof

The most straightforward kind is a **direct proof**: assume the "if" part of a claim, then reason step by step until you reach the "then" part. To show "if *n* is even then *n²* is even," you start from what "even" means — *n* is two times some whole number — do the algebra, and arrive at *n²* also being two times a whole number. Each step follows from definitions and facts already established. A direct proof is just honest, careful unpacking: take the assumption seriously, apply what you know, and walk in a straight line to the conclusion.

## Proof by contradiction

Sometimes the cleverer route is to **assume the opposite** of what you want and show it leads to nonsense. If assuming a statement is *false* forces a logical impossibility, then the statement must be *true*. This is how one proves the square root of two is irrational: suppose it *were* a neat fraction, follow the consequences, and you are forced into a number being both even and odd at once — impossible, so the original supposition was wrong. Proof by contradiction is powerful precisely because you get to assume the very thing you are trying to rule out, then watch it collapse.

## Counterexamples and disproof

Proving something *false* is gloriously easier than proving it true. To demolish a "for all" claim, you need just **one counterexample** — a single case where it fails. The claim "all prime numbers are odd" falls instantly to the number two: prime, but even. There is no need to survey the rest. This asymmetry is worth internalizing: a universal claim demands a general proof to establish but only one stubborn example to destroy, which is why hunting for a counterexample is always the first thing to try before attempting a full proof.

## In the real world

Proof isn't confined to mathematics — it's how we get *guarantees* in computing. Showing that an algorithm always gives the correct answer, or always finishes, is a proof, not a matter of testing a few inputs and hoping. Security systems rest on proofs that breaking them is infeasible; safety-critical software in planes and medical devices is **formally verified** by machine-checked proofs because testing alone can never cover every case. The same gap that separates "it worked on my examples" from "it always works" separates ordinary code from code you can truly trust — and proof is the bridge across it.`,
  },
  {
    slug: "sets-relations-functions",
    title: "Sets, relations, and functions",
    weekNumber: 1,
    blurb: "Sets (collections of distinct things), relations (how their members are connected), and functions (rules pairing each input with one output) are the basic vocabulary for describing almost any structure in math and computing.",
    lectureTitle: "1.4 Sets, relations, and functions: the grammar of structure",
    body: `# Sets, relations, and functions

If logic is the grammar of *reasoning*, then **sets, relations, and functions** are the grammar of *structure* — the basic vocabulary for describing collections of things and how they relate. Almost every idea in discrete math, and a huge amount of computer science, is ultimately expressed in this language. A database, a type system, the very idea of a "mapping" from inputs to outputs — all of it is sets, relations, and functions wearing different clothes. Master this small vocabulary and an enormous range of structures suddenly speak the same tongue.

## Sets: collections of distinct things

A **set** is simply a collection of **distinct** objects, considered as a whole — the prime numbers, the students in a class, the letters of the alphabet. Two things define a set's character: its members are all *different* (no duplicates), and **order doesn't matter** ({1, 2, 3} is the same set as {3, 2, 1}). You can combine sets with **union** (everything in either), **intersection** (only what is in both), and **difference** (what is in one but not the other). These simple operations, together with the idea of a **subset** (a set entirely contained in another), are enough to describe a startling variety of collections precisely.

## Relations: how members connect

A **relation** captures *how* the members of sets are connected — it is a set of linked pairs. "Is a friend of," "is less than," "is a prerequisite for" are all relations: each one picks out which pairs of things stand in that connection. Relations can have telling properties — "is less than" is never true of a thing and itself, while "has the same birthday as" always is — and these properties are exactly what let us classify structures. The idea is deceptively general: a relation is just a precise way of saying *which things go with which*, which is most of what data is.

## Functions: one output per input

A **function** is a special, especially useful relation: a rule that assigns to **each input exactly one output**. "Double it," "the first letter of a word," "each person's birth year" are functions — give one input, get one and only one output. That single-valued discipline is what makes functions the workhorses of math and programming. Two qualities matter often: a function is **one-to-one** if different inputs never collide on the same output, and **onto** if every possible output is actually hit. These notions quietly decide when a process can be reversed or when two collections have the same size.

## Why this is the grammar of structure

The reason these three ideas recur everywhere is that they are the minimal kit for describing *organized information*. A set says **what things exist**; a relation says **how they're connected**; a function says **how one thing determines another**. Nearly any structure — a family tree, a spreadsheet, a road map, a program's type signatures — can be taken apart into exactly these pieces. That is why this vocabulary, once learned, keeps reappearing: it isn't one more topic but the connective tissue running through logic, counting, graphs, and the rest of the unit.

## In the real world

This vocabulary is the backbone of computing. A relational **database** is, quite literally, built from relations — tables of linked records — and its queries are set operations: union, intersection, difference. **Functions** are the central abstraction of programming, every routine being a mapping from inputs to an output, and the one-to-one idea is exactly what a good password hash or a lookup key needs. Sets power everything from spell-checkers to access permissions. When you search, filter, join, or map data, you are doing sets, relations, and functions — the quiet grammar underneath nearly all software.`,
  },
  {
    slug: "counting-and-pigeonhole",
    title: "Counting and the pigeonhole principle",
    weekNumber: 1,
    blurb: "Combinatorics is the art of counting possibilities without listing them, and the pigeonhole principle — more items than boxes forces a shared box — is a deceptively simple idea with surprisingly powerful consequences.",
    lectureTitle: "1.5 Counting and the pigeonhole principle: small idea, big consequences",
    body: `# Counting and the pigeonhole principle

"How many?" sounds like the simplest question in mathematics, but answering it for large or intricate possibilities — without actually listing them all — is a genuine art called **combinatorics**. How many passwords of a given length exist? How many ways can a team be chosen? How long might an algorithm take in the worst case? All are counting questions, and they are everywhere in computing. Alongside the counting techniques sits one almost absurdly simple principle — the **pigeonhole principle** — whose consequences are anything but simple.

## The two basic rules

Almost all counting rests on two ideas. The **product rule**: if you make a sequence of independent choices, you *multiply* the number of options — three shirts and four pants give twelve outfits, and a 4-digit PIN gives 10 × 10 × 10 × 10 = 10,000 possibilities. The **sum rule**: if you are choosing among separate, non-overlapping options, you *add* them. The whole skill is recognizing whether a situation is "this *and* then this" (multiply) or "this *or* that" (add). Most complicated counts are just these two rules applied in layers, carefully, without missing or double-counting any case.

## Permutations and combinations

Two refinements handle the most common counting tasks. **Permutations** count arrangements where **order matters** — the number of ways to line people up, or to award gold, silver, and bronze. **Combinations** count selections where **order doesn't matter** — the number of ways to pick a committee of three, where who is named first is irrelevant. The crucial habit is asking *does order matter here?* before counting, because the same-looking problem has very different answers depending on the answer. Mixing the two up is the single most common counting mistake.

## The pigeonhole principle

Now the deceptively tiny idea: if you put more pigeons than pigeonholes, **some hole must hold at least two pigeons**. That is it — more items than containers forces a shared container. It sounds too obvious to be useful, yet it proves striking things with no calculation at all. In any group of 13 people, at least two share a birth *month* (13 people, 12 months). Among any 367 people, two must share a birthday. It even guarantees that somewhere in a large city two strangers have the exact same number of hairs on their heads. The principle gives certainty about *existence* without ever pointing to the specific case.

## Why a small idea has big consequences

The pigeonhole principle matters because it converts a simple count into a *guarantee*. Many deep results — in computer science, number theory, and beyond — boil down to setting up the right "pigeons" and "holes" so that a collision is forced. It explains why **lossless compression can't shrink every file** (there are more possible files than shorter ones, so some must stay the same size or grow), and why **hash collisions are unavoidable** when you map many keys into fewer slots. A principle a child can understand turns out to draw hard limits on what algorithms can do.

## In the real world

Counting is the heart of measuring difficulty and risk in computing. **Probability** is built on it, and the strength of a password or encryption key is just a count of how many possibilities an attacker must try — which is why one more character matters so much. Counting possible inputs tells you how long an algorithm could run, and the pigeonhole principle sets unavoidable limits, from compression to the inevitability of hash collisions that every database and caching system must handle. Knowing how to count — and when a collision is forced — is knowing what is feasible and what is impossible.`,
  },
  {
    slug: "graphs",
    title: "Graphs",
    weekNumber: 1,
    blurb: "A graph is just dots (things) joined by lines (connections), yet this minimal model captures social networks, maps, the web, and countless other systems — and lets one algorithm solve problems across all of them.",
    lectureTitle: "1.6 Graphs: the hidden networks in everything",
    body: `# Graphs

Many of the most important things in the world are really **networks**: people linked by friendships, cities linked by roads, web pages linked by hyperlinks, tasks linked by dependencies. Discrete math captures all of them with one strikingly simple model — the **graph**. A graph is nothing more than a set of **dots** (called vertices or nodes) joined by **lines** (called edges). That is the entire definition, yet because so many different systems share this dots-and-lines shape, a single way of thinking — and a single algorithm — can solve problems across all of them at once.

## Vertices and edges

The two ingredients are **vertices** (the things) and **edges** (the connections between them). A friendship network has people as vertices and friendships as edges; a road map has intersections as vertices and roads as edges. Edges can be **undirected** (the connection goes both ways, like a mutual friendship) or **directed** (one-way, like a hyperlink from one page to another, or "is a prerequisite for"). They can also carry **weights** — a number on each edge, such as the distance of a road or the cost of a flight. Choosing what the dots and lines *mean* is how you model a real system as a graph.

## Paths, cycles, and connection

Once you have a graph, the interesting questions are about *getting around* it. A **path** is a route along edges from one vertex to another; a **cycle** is a path that loops back to where it started. A graph is **connected** if you can reach every vertex from every other. These notions answer real questions directly: *Is there any route between these two cities? What is the shortest one? Can I finish all these tasks without a circular dependency?* The vocabulary of paths and cycles turns vague questions about a network into precise ones a computer can answer.

## Famous graph problems

A few classic problems show the model's range. The **shortest-path** problem — find the quickest route between two points — is exactly what GPS navigation solves on a graph of roads. **Graph coloring** asks for the fewest colors so no two connected vertices share one, which is secretly the problem of scheduling exams so no student has two at once, or assigning radio frequencies without interference. The **traveling salesman** problem — find the shortest tour visiting every city once — is famous for being easy to state yet brutally hard to solve, a touchstone for the limits of efficient computation.

## Why one model fits so much

The reason graphs appear everywhere is that they capture the *bare essence* of "things and their connections," throwing away every irrelevant detail. A social network and a circuit board and a subway map have nothing in common physically — but as graphs they are the same kind of object, so an algorithm that finds shortest paths works on *all* of them without caring what the dots and lines stand for. This is the payoff of a good abstraction: solve the dots-and-lines problem once, and you have solved it for every system that wears that shape.

## In the real world

Graphs may be the most widely applied idea in all of computing. Social networks store and analyze friendships as graphs; **GPS and mapping** apps run shortest-path algorithms on road graphs millions of times a second; the internet itself is a graph of routers, and packets are routed across it by graph algorithms. Search engines famously ranked the web by treating links as a graph. Project schedules, dependency managers, recommendation systems, and even how the brain's neurons are studied all lean on graphs. Learn to see the dots and lines, and hidden networks appear in nearly everything.`,
  },
  {
    slug: "modular-arithmetic",
    title: "Modular arithmetic",
    weekNumber: 1,
    blurb: "Modular arithmetic is arithmetic that wraps around a fixed number, like a clock — and this humble 'clock math' is the engine behind the cryptography that secures nearly every online transaction.",
    lectureTitle: "1.7 Modular arithmetic: clock math that secures the internet",
    body: `# Modular arithmetic

You already do a kind of arithmetic that "wraps around" without thinking about it: on a clock, 5 hours after 10 o'clock is 3, not 15, because the numbers loop back at 12. **Modular arithmetic** is exactly this idea made general — arithmetic where numbers wrap around after reaching a fixed value called the **modulus**. It looks like a quaint curiosity, the math of clocks and calendars, but it is one of the most consequential ideas in the whole unit: this humble "clock math" is the engine running underneath the cryptography that protects nearly everything you do online.

## Arithmetic that wraps around

The core notion is the **remainder**. Working "modulo 12," you only care about a number's remainder after dividing by 12: the hours 3, 15, and 27 are all "the same" because they leave the same remainder. We say two numbers are **congruent mod n** when they leave the same remainder upon division by *n*. So modular arithmetic doesn't deal with numbers themselves but with their *remainders*, which is why it stays trapped in a finite range — 0 up to one less than the modulus — no matter how big the numbers you start with. Addition, subtraction, and multiplication all still work; you just wrap around at the end.

## Clocks, days, and cycles

The everyday version is all around you. Clocks are arithmetic **mod 12** (or 24); days of the week are **mod 7**, which is how you can figure out what day of the week a date far in the future lands on. Anything that **cycles** — the hours, the seasons, your position in a repeating pattern — is naturally modular. This is also why it is so useful in computing, where things constantly cycle: wrapping an index back to the start of an array, distributing items evenly into a fixed number of buckets, or generating repeating sequences are all modular arithmetic in disguise.

## The one-way trick

Here is the property that changes the world: some modular operations are **easy to do but extremely hard to undo**. Multiplying two large prime numbers together is quick; but given only their product, *finding* those primes again is so slow that all the world's computers couldn't do it in a lifetime for big enough numbers. Likewise, raising a number to a power modulo a large number is fast, while reversing it is believed to be infeasible. This lopsidedness — easy one way, practically impossible the other — is the rare and precious feature that secure cryptography is built from.

## How it secures the internet

Modern encryption turns that one-way trick into security. In systems like **RSA**, your computer and a website agree on numbers using modular exponentiation; anyone eavesdropping sees the results but would have to perform the infeasible "undo" — factoring a huge number — to break in. So when you see the padlock in your browser, modular arithmetic is what is protecting your password and credit card. The astonishing part is the lineage: a system you first met as the math of clocks, with no hint of importance, turns out to be exactly what keeps online banking, messaging, and commerce safe.

## In the real world

Beyond cryptography, modular arithmetic quietly does everyday work. **Hash functions**, which spread data across a fixed number of slots in databases and caches, rely on it. **Checksums and error-detecting codes** — the digits that catch a mistyped credit-card or ISBN number — are modular calculations. Random-number generators, calendar computations, and the cyclic counters inside countless programs all use it. But its crown is cryptography: nearly every secure connection, digital signature, and cryptocurrency transaction rests on the simple, surprising fact that clock-style arithmetic can be easy forward and impossible backward.`,
  },
  {
    slug: "recursion-and-induction",
    title: "Recursion and induction (capstone)",
    weekNumber: 1,
    blurb: "Recursion defines things in terms of smaller copies of themselves; induction proves things true for infinitely many cases by the same logic — two sides of one powerful idea that ties the whole unit together.",
    lectureTitle: "1.8 Recursion and induction: climbing the infinite ladder (Capstone)",
    body: `# Recursion and induction (capstone)

We end where the deepest ideas of the unit converge. Throughout the course we've met things built in **stages** — numbers from counting, proofs from steps, structures from smaller structures. **Recursion** and **induction** are the twin tools for *defining* and *reasoning about* exactly such things, and they are really two faces of one idea: solve a problem by relating it to a smaller version of itself. Recursion uses this to *build*; induction uses it to *prove*. Together they let finite minds get a complete grip on the infinite — climbing a ladder of infinitely many rungs by trusting just two facts about it.

## Recursion: defining a thing by smaller copies

A **recursive definition** describes something in terms of *smaller instances of itself*, plus a stopping point. The factorial is the classic case: the factorial of *n* is *n* times the factorial of *n−1*, with the base case that the factorial of 0 is 1. Each step leans on a smaller version until it bottoms out at the base case. The two ingredients are always the same: a **base case** that doesn't recurse (so the process ends) and a **recursive case** that reduces toward it. This "solve it in terms of a smaller self" pattern shows up in countless definitions and algorithms.

## Induction: proving by the same logic

**Mathematical induction** is the proof technique that mirrors recursion. To prove a statement holds for *all* whole numbers, you show just two things: the **base case** — it holds for the starting number — and the **inductive step** — *if* it holds for some number, *then* it holds for the next one. From those two, it follows for *every* number, infinitely many cases, in one stroke. The reason it works is precisely the recursive structure of the numbers: every number is reached by starting at the base and stepping up one at a time, so a fact that survives each step survives all the way up.

## The ladder metaphor

The cleanest way to feel why induction works is a ladder reaching infinitely high. If you can **step onto the bottom rung** (the base case), and you know that **from any rung you can always reach the next** (the inductive step), then you can climb to *every* rung, no matter how high — even though there are infinitely many. You never check each rung individually; you check that you can start and that each step is always possible, and the infinite climb follows for free. That is the whole magic of induction: a finite argument that nails down an infinite truth.

## Two sides of one idea

Recursion and induction are the same insight pointed in opposite directions. Recursion **builds** from the base case upward — to compute factorial of 5, you keep reducing to smaller factorials until the base case, then assemble the answer on the way back. Induction **proves** along the very same chain — establish the base case, then ride the inductive step upward. This is why a recursive algorithm is so often *proved correct by induction*: the structure that defines it is exactly the structure that justifies it. Defining and reasoning, building and proving, turn out to be one move.

## In the real world

Recursion is everywhere in computing: algorithms that sort by splitting a list in half, structures like trees and the file system on your computer, and the way a function can call itself are all recursion in action. Induction is the standard way to **prove an algorithm correct** — that it works for inputs of every size, not just the ones you tested. Together they capture the unit's deepest lesson: that you can master infinitely many cases with a finite, well-structured argument. From counting to logic to graphs, the recurring move of this whole course has been to tame something vast by understanding how it is built one step at a time.`,
  },
];

type SeedAssignment = {
  kind: "homework" | "test" | "midterm" | "final";
  title: string;
  weekNumber: number;
  isTimed: boolean;
  timeLimitMinutes: number | null;
  instructions: string;
  problems: Array<{
    topicSlug: string;
    prompt: string;
    correctAnswer: string;
    explanation: string;
    hint?: string;
  }>;
};

const ASSIGNMENTS: SeedAssignment[] = [
  {
    kind: "homework",
    title: "Homework 1.1 — Discrete math, logic, proof, and structure",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions:
      "Untimed practice covering sections 1.1–1.4. Answer each question in a few sentences (about 3–5) in your own words. You don't need to write out heavy formal derivations — just explain the reasoning clearly. One-word answers won't receive credit.",
    problems: [
      {
        topicSlug: "what-discrete-math-is",
        prompt:
          "A friend says, 'Discrete math is just easier calculus — same kind of math, smaller numbers.' Using what discrete math is, explain why this is wrong: what distinguishes discrete from continuous math, and why discrete math is the natural math of computers. (3–5 sentences.)",
        correctAnswer:
          "Discrete math isn't a watered-down calculus; it studies a fundamentally different kind of object — things that are separate and distinct (whole numbers, true/false statements, sets, networks) rather than the smooth, continuous quantities calculus is about. Where continuous math relies on limits and values that slide gradually, discrete math deals with indivisible units where the only move is to the next whole thing. It is the natural math of computers because a computer is itself discrete: it stores distinct bits and takes one step at a time, never dealing in true infinities or infinitely fine measurements. So questions of what a program does, whether it is correct, and how long it takes are discrete-math questions, not calculus ones. It also emphasizes careful reasoning and proof over formula-crunching.",
        explanation:
          "Full credit: distinguishes discrete (separate/distinct things) from continuous (smooth quantities, limits), explains computers are discrete machines, and notes discrete math underlies correctness/running time and reasoning.",
      },
      {
        topicSlug: "logic",
        prompt:
          "Someone insists, 'In logic, ‘or’ means one or the other but not both, and ‘if it rains, the ground is wet’ must be false on a sunny day since it didn't rain.' Explain what logic actually says about inclusive OR and about when an if-then statement is false. (3–5 sentences.)",
        correctAnswer:
          "Both claims misread logic's exact definitions. Logic's OR is inclusive: it is true when at least one part is true, including the case where both are — it is not the exclusive 'one but not both' of casual speech. For if-then (implication), the statement makes a promise only about the case where the 'if' part holds, so it is counted false in exactly one situation: when the 'if' part is true but the 'then' part is false. On a sunny day the 'if' part (it rains) is false, so the promise was never tested and the implication is considered true, not false. These precise truth-table definitions are what make logic unambiguous.",
        explanation:
          "Full credit: explains inclusive OR (true if at least one, including both), and that an implication is false only when the premise is true and the conclusion false (so a false premise makes it true).",
        hint: "When exactly is an if-then broken? And does logic's OR exclude the 'both' case?",
      },
      {
        topicSlug: "proof",
        prompt:
          "A friend says, 'I checked the rule for the first 100 numbers and it always worked, so it's definitely true for all numbers.' Explain why checking examples can't establish a 'for all' claim, and what a proof provides that examples cannot. (3–5 sentences.)",
        correctAnswer:
          "Checking examples, however many, can only show a claim holds so far — it can never cover the infinitely many cases a 'for all' statement makes, and mathematics is full of patterns that hold for a long time then suddenly fail (for instance n² + n + 41 is prime for n up to 39 but not at 40). A proof is different: it is an airtight chain of reasoning from accepted facts to the conclusion, establishing the claim for every case at once with no exceptions. That is the certainty examples can't give — examples can suggest a truth or disprove a false one, but only a proof guarantees a universal claim. A single counterexample, by contrast, is enough to disprove such a claim.",
        explanation:
          "Full credit: explains examples can't cover infinitely many cases (patterns can fail late), that a proof establishes a claim for all cases with certainty, and may note one counterexample suffices to disprove.",
      },
      {
        topicSlug: "sets-relations-functions",
        prompt:
          "Explain the difference between a relation and a function, using the idea that a function assigns exactly one output to each input. Give a quick example of a relation that is not a function. (3–5 sentences.)",
        correctAnswer:
          "A relation is any set of linked pairs — it just records which things are connected to which (like 'is a friend of' or 'is less than'). A function is a special relation with one extra discipline: it assigns to each input exactly one output, with no input mapped to two different results. So 'each person's birth year' is a function (one year per person), but 'is a sibling of' is a relation that is not a function, since a person can have several siblings — one input, many outputs. That single-valued requirement is exactly what makes functions reliable rules and the workhorses of math and programming.",
        explanation:
          "Full credit: defines a relation as linked pairs / which things connect, a function as assigning exactly one output per input, and gives a valid non-function relation example (an input with multiple outputs).",
      },
    ],
  },
  {
    kind: "homework",
    title: "Homework 1.2 — Counting, graphs, modular arithmetic, and induction",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions:
      "Untimed practice covering sections 1.5–1.8. Answer each question in a few sentences (about 3–5) in your own words. No formal derivations are required — explain your reasoning. One-word answers won't receive credit.",
    problems: [
      {
        topicSlug: "counting-and-pigeonhole",
        prompt:
          "A friend claims, 'The pigeonhole principle is too obvious to be useful — of course more pigeons than holes means some hole has two.' Explain the principle precisely and give an example showing it proves something genuinely surprising or certain. (3–5 sentences.)",
        correctAnswer:
          "The pigeonhole principle says that if you place more items than containers, at least one container must hold two or more items — simple to state, but it yields certainty with no calculation. Its power is that it guarantees a collision must exist without ever pointing to which one: in any group of 13 people at least two share a birth month (13 people, 12 months), and among 367 people two must share a birthday. It even guarantees that two people in a large city have exactly the same number of hairs on their heads. In computing it explains why lossless compression can't shrink every file and why hash collisions are unavoidable when mapping many keys into fewer slots. So the 'obvious' idea draws hard, surprising limits.",
        explanation:
          "Full credit: states the principle (more items than containers forces a shared container), and gives a valid example of a forced/surprising conclusion (birthdays, hairs, compression limits, or hash collisions).",
      },
      {
        topicSlug: "graphs",
        prompt:
          "Explain what a graph is in discrete math and why one graph model can apply to systems as different as a road map, a social network, and the web. Mention one classic graph problem. (3–5 sentences.)",
        correctAnswer:
          "A graph is just a set of dots (vertices) joined by lines (edges) representing things and the connections between them — nothing more. It applies to wildly different systems because all of them share that 'things and their connections' shape: a road map (intersections joined by roads), a social network (people joined by friendships), and the web (pages joined by links) are physically nothing alike but are the same kind of object as graphs. That is the payoff of the abstraction — an algorithm written for dots and lines works on all of them without caring what they represent. A classic example is the shortest-path problem, finding the quickest route between two vertices, which is exactly what GPS navigation solves.",
        explanation:
          "Full credit: defines a graph as vertices (dots) and edges (lines / connections), explains the shared abstraction lets one model/algorithm fit many systems, and names a classic problem (shortest path, coloring, traveling salesman).",
      },
      {
        topicSlug: "modular-arithmetic",
        prompt:
          "Modular arithmetic is often introduced as 'clock math,' yet it secures the internet. Explain what modular arithmetic is and the one-way property that makes it useful for cryptography. (3–5 sentences.)",
        correctAnswer:
          "Modular arithmetic is arithmetic that wraps around after a fixed value called the modulus, exactly like a clock where 5 hours after 10 is 3 — you work with remainders, so everything stays in a finite range. What makes it the engine of cryptography is that some modular operations are easy to do but extremely hard to undo: multiplying two big primes is fast, but recovering those primes from only their product is infeasible for large enough numbers, and modular exponentiation is similarly easy forward and believed impossible to reverse. Cryptosystems like RSA build security on this lopsidedness, since an eavesdropper would have to perform the infeasible 'undo.' So the same clock-style arithmetic protects your password and credit card behind the browser padlock.",
        explanation:
          "Full credit: explains modular arithmetic wraps around a modulus / uses remainders, and describes the one-way property (easy forward, infeasible to reverse, e.g. multiplying primes vs factoring) that cryptography like RSA relies on.",
        hint: "What operation is quick to do but practically impossible to reverse, and how does a clock 'wrap around'?",
      },
      {
        topicSlug: "recursion-and-induction",
        prompt:
          "Explain how recursion and induction are 'two sides of one idea,' covering what a recursive definition needs (a base case and a recursive case) and how induction uses the same structure to prove something for all whole numbers. (3–5 sentences.)",
        correctAnswer:
          "Both rest on relating a problem to a smaller version of itself. A recursive definition builds something from smaller copies plus a stopping point: it needs a base case that doesn't recurse (so it ends, like factorial of 0 being 1) and a recursive case that reduces toward it (factorial of n is n times factorial of n−1). Induction proves along that very same chain: show the base case (the statement holds for the starting number) and the inductive step (if it holds for some number, it holds for the next), and the claim follows for every number at once. Recursion builds upward from the base while induction proves upward from it, which is why recursive algorithms are so often proved correct by induction — the structure that defines them is the structure that justifies them.",
        explanation:
          "Full credit: notes both relate a problem to a smaller self, that recursion needs a base case and a recursive case, and that induction proves via base case + inductive step, covering all whole numbers — two sides of one idea.",
      },
    ],
  },
  {
    kind: "test",
    title: "Unit Test — Baby Discrete Math: The Math of Distinct Things",
    weekNumber: 1,
    isTimed: true,
    timeLimitMinutes: 30,
    instructions:
      "Timed. 30 minutes. Covers sections 1.1–1.8. Answer each question in a few sentences (about 4–6) in your own words. No formal derivations are required. Pasting is disabled; keystrokes are screened for AI use.",
    problems: [
      {
        topicSlug: "what-discrete-math-is",
        prompt:
          "Explain what discrete math is. Cover how it differs from continuous math, name several of the tools it includes, why it's the natural math of computers, and the kind of thinking it emphasizes. (4–6 sentences.)",
        correctAnswer:
          "Discrete math is the mathematics of separate, distinct things — whole numbers, true/false statements, sets, networks — as opposed to continuous math, which studies smooth quantities that slide gradually and relies on limits and the infinitely small. Its tools form a small family: logic, proof, sets/relations/functions, counting, graphs, modular arithmetic, and recursion/induction. It is the natural math of computers because a computer is itself discrete: it stores distinct bits, takes one step at a time, and never deals in true infinities or infinitely fine measurements, so questions of correctness, running time, and what's computable are discrete-math questions. Rather than emphasizing calculation, it rewards careful reasoning — defining things precisely, proving why something must be true, and counting possibilities without error. That is why it is often a student's first taste of 'real,' proof-based mathematics.",
        explanation:
          "Full credit: contrasts discrete (distinct things) vs continuous (smooth, limits), names several tools, explains computers are discrete machines, and notes the emphasis on reasoning/proof over calculation.",
      },
      {
        topicSlug: "logic",
        prompt:
          "Explain the basics of logic. Cover what a statement is, what the connectives AND/OR/NOT do, when an if-then statement is false, and what the quantifiers 'for all' and 'there exists' mean (including how negation flips them). (4–6 sentences.)",
        correctAnswer:
          "A statement is a sentence that is definitely either true or false — never both or neither — and that single truth value is what makes logic mechanical. The connectives combine statements by exact rules: NOT flips true and false, AND is true only when both parts are true, and OR is true when at least one part is true (inclusively, so 'both' counts). An if-then (implication) makes a promise only about the case where the 'if' holds, so it is false in exactly one situation — the 'if' true but the 'then' false — and true otherwise, even when the 'if' is false. The quantifiers extend this to many things: 'for all' claims something holds of every item, 'there exists' that it holds of at least one. Negation swaps them — the opposite of 'all swans are white' is 'there exists a swan that is not white,' so the negation of 'all' is 'some…not.'",
        explanation:
          "Full credit: defines a statement (true/false), the connectives (NOT flips, AND both, OR inclusive), implication false only when premise true & conclusion false, and the quantifiers plus how NOT turns 'all' into 'some…not.'",
      },
      {
        topicSlug: "proof",
        prompt:
          "Explain what a proof is and why it's needed. Cover why checking examples isn't enough, describe direct proof and proof by contradiction, and explain how a single counterexample relates to disproving a claim. (4–6 sentences.)",
        correctAnswer:
          "A proof is an airtight chain of reasoning from accepted facts to a conclusion, giving certainty that the claim holds for every case at once. It is needed because checking examples can only show a claim holds so far and never covers the infinitely many cases of a 'for all' statement — patterns can hold for a long time and then fail (n² + n + 41 is prime up to n = 39 but not at 40). A direct proof assumes the 'if' part and reasons step by step to the 'then' part, as in showing an even n makes n² even by unpacking the definition of even. Proof by contradiction instead assumes the opposite of the claim and derives an impossibility, forcing the claim to be true — the classic proof that √2 is irrational works this way. Disproving is far easier: a single counterexample (two is prime but even) destroys a universal claim outright.",
        explanation:
          "Full credit: defines proof as airtight reasoning giving certainty, explains examples can't cover all cases, describes direct proof and proof by contradiction, and notes one counterexample disproves a 'for all' claim.",
      },
      {
        topicSlug: "sets-relations-functions",
        prompt:
          "Explain sets, relations, and functions and why they're called the grammar of structure. Cover what a set is (and that order/duplicates don't matter), what a relation captures, and what makes a function special. (4–6 sentences.)",
        correctAnswer:
          "A set is a collection of distinct objects considered as a whole, where duplicates don't count and order doesn't matter ({1,2,3} equals {3,2,1}); sets combine by union, intersection, and difference. A relation captures how members are connected — a set of linked pairs, like 'is less than' or 'is a friend of' — recording which things go with which. A function is a special relation with one added discipline: it assigns to each input exactly one output, which is what makes it a reliable rule (it can also be one-to-one or onto). They are called the grammar of structure because together they are the minimal kit for describing organized information: a set says what things exist, a relation says how they connect, and a function says how one thing determines another. Almost any structure — a database, a family tree, a program's types — decomposes into exactly these pieces.",
        explanation:
          "Full credit: defines a set (distinct, order/duplicates irrelevant), a relation (linked pairs / connections), and a function (exactly one output per input), and explains why the trio describes nearly any structure.",
      },
      {
        topicSlug: "counting-and-pigeonhole",
        prompt:
          "Explain the basics of counting and the pigeonhole principle. Cover the product and sum rules, the difference between permutations and combinations, and what the pigeonhole principle guarantees with an example. (4–6 sentences.)",
        correctAnswer:
          "Counting rests on two rules: the product rule (for a sequence of independent choices, multiply the options — a 4-digit PIN has 10×10×10×10 = 10,000 possibilities) and the sum rule (for separate, non-overlapping options, add them). The key habit is asking whether a situation is 'this and then this' (multiply) or 'this or that' (add). Permutations count arrangements where order matters (lining people up), while combinations count selections where order doesn't (picking a committee) — so you must always ask whether order matters before counting. The pigeonhole principle says that more items than containers forces at least one container to hold two or more, guaranteeing a collision without calculation. For example, any 13 people include two who share a birth month, and it even forces two people in a large city to have the same number of hairs.",
        explanation:
          "Full credit: states product (multiply) and sum (add) rules, distinguishes permutations (order matters) from combinations (order doesn't), and states the pigeonhole principle with a valid forced-collision example.",
      },
      {
        topicSlug: "graphs",
        prompt:
          "Explain graphs in discrete math. Cover what vertices and edges are (including directed vs undirected and weighted edges), what paths and connectedness mean, and why one graph model applies to so many different systems. (4–6 sentences.)",
        correctAnswer:
          "A graph is a set of vertices (dots, the things) joined by edges (lines, the connections). Edges can be undirected (two-way, like a mutual friendship) or directed (one-way, like a hyperlink), and they can carry weights — numbers such as a road's distance or a flight's cost. A path is a route along edges from one vertex to another, a cycle is a path that loops back, and a graph is connected if every vertex is reachable from every other, which turns vague questions ('is there a route? what's the shortest?') into precise ones. One model fits so many systems because graphs capture only the bare essence of 'things and their connections,' discarding every other detail. So a social network, a road map, and a circuit are the same kind of object as graphs, and a single algorithm — like shortest path — works on all of them regardless of what the dots and lines mean.",
        explanation:
          "Full credit: defines vertices and edges (directed/undirected, weighted), explains paths/connectedness, and explains the shared abstraction lets one model/algorithm apply to many different systems.",
      },
      {
        topicSlug: "modular-arithmetic",
        prompt:
          "Explain modular arithmetic and why it matters. Cover the wrap-around/remainder idea with an everyday example, the one-way property behind cryptography, and how that secures online communication. (4–6 sentences.)",
        correctAnswer:
          "Modular arithmetic is arithmetic that wraps around after a fixed value called the modulus, so you work only with remainders and stay within a finite range — exactly like a clock, where 5 hours after 10 o'clock is 3, not 15 (mod 12). Two numbers are congruent mod n when they leave the same remainder, and everyday cycles like days of the week (mod 7) work the same way. Its deep importance comes from a one-way property: some modular operations are easy to do but infeasible to undo, such as multiplying two large primes (fast) versus factoring their product back (practically impossible), and modular exponentiation versus reversing it. Cryptosystems like RSA build security on this lopsidedness, since an attacker would have to perform the infeasible reverse. That is why the same 'clock math' protects your passwords and payments behind the browser's padlock.",
        explanation:
          "Full credit: explains wrap-around/remainder (with a clock-style example), the one-way property (easy forward, infeasible to reverse, e.g. primes vs factoring), and how cryptography like RSA uses it to secure communication.",
      },
      {
        topicSlug: "recursion-and-induction",
        prompt:
          "Explain recursion and induction and how they relate. Cover what a recursive definition needs, how a proof by induction works (base case and inductive step), the ladder metaphor, and why they're called two sides of one idea. (4–6 sentences.)",
        correctAnswer:
          "Recursion defines a thing in terms of smaller copies of itself plus a stopping point: it needs a base case that doesn't recurse (factorial of 0 is 1) and a recursive case that reduces toward it (factorial of n is n times factorial of n−1). Induction proves a statement for all whole numbers using the same structure: establish the base case (it holds for the starting number) and the inductive step (if it holds for some number, it holds for the next), and the claim follows for every number at once. The ladder metaphor captures why: if you can step onto the bottom rung and can always reach the next rung from any rung, you can climb the whole infinite ladder. They are two sides of one idea because recursion builds upward from the base case while induction proves upward along the very same chain — which is why recursive algorithms are typically proved correct by induction.",
        explanation:
          "Full credit: describes a recursive definition (base case + recursive case), induction (base case + inductive step for all whole numbers), the ladder metaphor, and why recursion (builds) and induction (proves) are two sides of one idea.",
      },
    ],
  },
  {
    kind: "final",
    title: "Final — Baby Discrete Math: The Math of Distinct Things",
    weekNumber: 1,
    isTimed: true,
    timeLimitMinutes: 45,
    instructions:
      "Timed cumulative final. 45 minutes. Covers the whole course (sections 1.1–1.8). Answer each question in a paragraph (about 5–7 sentences) in your own words. No formal derivations are required. Pasting is disabled; keystrokes are screened for AI use.",
    problems: [
      {
        topicSlug: "recursion-and-induction",
        prompt:
          "Using ideas from across the whole course, explain how discrete math forms a single connected toolkit for reasoning about distinct things and computation. Show how at least four different ideas fit together (for example: logic, proof, sets/relations/functions, counting and the pigeonhole principle, graphs, modular arithmetic, recursion and induction). (5–7 sentences.)",
        correctAnswer:
          "Discrete math begins with logic, the precise language of true/false statements and connectives, which gives reasoning an unambiguous foundation. On top of logic sits proof, the airtight chains of reasoning — direct, by contradiction, or by induction — that turn 'true so far' into 'true for certain.' Sets, relations, and functions supply the grammar for describing structure: what things exist, how they connect, and how one determines another, which is the vocabulary the rest of the subject speaks. Counting and the pigeonhole principle measure how many possibilities exist and force guarantees like unavoidable hash collisions, while graphs model 'things and their connections' so one algorithm serves road maps, networks, and the web alike. Modular arithmetic — clock-style wrap-around — turns an easy-forward, hard-to-reverse operation into the cryptography that secures the internet. Finally recursion and induction tie it together, defining and proving things built in stages, which is how we master infinitely many cases with a finite argument. Each tool hands the next its foundation, and together they are the mathematical backbone of computing.",
        explanation:
          "Full credit: traces a coherent path through at least four ideas (e.g. logic → proof → sets/relations/functions → counting/pigeonhole → graphs → modular arithmetic → recursion/induction), correctly describing each one's role and how they connect.",
      },
      {
        topicSlug: "proof",
        prompt:
          "Someone says, 'Proof is a waste of time — if I test something on lots of examples and it always works, that's just as good as proving it.' Using the course's ideas, argue why proof gives something testing cannot, using a concrete example where examples mislead. (5–7 sentences.)",
        correctAnswer:
          "Testing examples and proving are fundamentally different kinds of knowledge. Examples can only show a claim holds for the cases you checked, but a 'for all' statement covers infinitely many cases, so no finite amount of testing can guarantee it. Mathematics is full of patterns that hold for a long time and then fail: n² + n + 41 produces a prime for every n from 0 to 39, which looks like an ironclad rule, until n = 40, where it isn't prime — a tester who stopped at 39 would conclude something false. A proof closes that gap by giving an airtight chain of reasoning that establishes the claim for every case at once, whether by direct argument, contradiction, or induction. This is exactly why we want proofs that an algorithm is always correct or always halts, rather than evidence that it worked on some inputs. The same gap separates 'it passed my tests' from 'it can never fail,' which in safety-critical or security software is the difference that matters. So proof isn't a waste of time; it is the only thing that delivers certainty.",
        explanation:
          "Full credit: explains examples can't cover infinitely many cases, gives a concrete misleading-pattern example (e.g. n²+n+41), contrasts with proof's certainty for all cases, and connects to wanting guarantees (correctness/halting) in computing.",
      },
      {
        topicSlug: "counting-and-pigeonhole",
        prompt:
          "A friend says, 'The pigeonhole principle is too trivial to prove anything real, and counting is just basic arithmetic.' Using the course's ideas, explain why counting is subtle and how the pigeonhole principle forces genuinely important conclusions. Use a concrete example. (5–7 sentences.)",
        correctAnswer:
          "Counting is subtler than basic arithmetic because the hard part is setting it up correctly — recognizing whether choices combine by the product rule ('this and then this,' multiply) or the sum rule ('this or that,' add), and whether order matters, which separates permutations from combinations. Getting that wrong gives answers off by huge factors, and these counts directly measure real things like how many passwords exist or how long an algorithm could run. The pigeonhole principle, though it sounds trivial — more items than containers forces a shared container — yields certainty with no calculation at all. For example, mapping many keys into fewer hash slots guarantees a collision, which is why every database and cache must handle them; and it proves lossless compression can't shrink every file, since there are more possible files than shorter ones. In each case the principle converts a simple count into a hard limit on what is possible. So far from trivial, counting and pigeonholing tell us what is feasible and what is provably impossible.",
        explanation:
          "Full credit: explains counting is subtle (product vs sum rule, order/permutations vs combinations, measures real quantities), states the pigeonhole principle, and gives a concrete forced conclusion (hash collisions, compression limits, shared birthdays).",
      },
      {
        topicSlug: "modular-arithmetic",
        prompt:
          "A friend says, 'Modular arithmetic is just a trick for clocks and calendars — it can't have anything to do with serious things like internet security.' Using the course's ideas, explain why they're wrong and how clock math secures the internet. Use a concrete example. (5–7 sentences.)",
        correctAnswer:
          "Modular arithmetic does start as clock-and-calendar math — arithmetic that wraps around a modulus, working with remainders, so 5 hours after 10 is 3 (mod 12) and days of the week cycle mod 7. But the same idea has a rare and precious property: some modular operations are easy to perform yet infeasible to reverse. Multiplying two large prime numbers is quick, but recovering those primes from only their product — factoring — is so slow that all the world's computers couldn't do it in a lifetime for big enough numbers; modular exponentiation is likewise easy forward and believed impossible to undo. Cryptosystems like RSA build security directly on this lopsidedness: your computer and a website exchange values using modular exponentiation, and an eavesdropper would have to perform the infeasible reverse to break in. So when you see the padlock in your browser protecting a password or payment, clock math is what is guarding it. The astonishing lineage — from a curiosity about clocks to the backbone of online security — is exactly why the friend's dismissal is wrong.",
        explanation:
          "Full credit: explains modular arithmetic (wrap-around/remainders, clock example), the one-way property (easy forward, infeasible reverse, primes vs factoring), and how RSA-style cryptography uses it to secure real communication.",
      },
      {
        topicSlug: "logic",
        prompt:
          "A friend says, 'Logic is just common sense dressed up — ‘or’ obviously means one or the other, and ‘all’ and ‘some’ are simple words that don't need rules.' Using the course's ideas, explain why logic's precision matters, covering inclusive OR, when implication is false, and how negation interacts with quantifiers. Use a concrete example. (5–7 sentences.)",
        correctAnswer:
          "Logic matters precisely because ordinary 'common sense' about these words is slippery and often wrong. Logic's OR is inclusive — true when at least one part is true, including both — unlike the casual 'one but not both,' so 'you may have coffee or tea' in logic doesn't forbid having both. Implication is the famous trap: 'if it rains, the ground is wet' makes a promise only about rainy days, so it is false in exactly one case (the 'if' true but the 'then' false) and counts as true whenever the 'if' is false — which is why 'if pigs fly, then I'm rich' is true. Negation and quantifiers interact in a way intuition gets wrong too: the opposite of 'all swans are white' is not 'no swans are white' but 'there exists a swan that is not white,' so the negation of 'all' is 'some…not.' These exact, truth-table definitions are what make logic unambiguous, and that unambiguity is what lets us build correct circuits and prove programs right. Far from dressed-up common sense, logic fixes the very places common sense quietly fails.",
        explanation:
          "Full credit: explains inclusive OR, implication false only when premise true & conclusion false (false premise → true), negation of 'all' is 'some…not,' with a concrete example, and why this precision matters (circuits/proofs).",
      },
    ],
  },
];

type SeedPrimer = SeedTopic;

const REASONING_PRIMERS: SeedPrimer[] = [
  {
    slug: "reasoning-primer-subject",
    title: "How to reason about discrete-math cases",
    weekNumber: 1,
    blurb:
      "Diagnostic primer: applying the course's ideas to concrete situations about logic, proof, sets, counting, graphs, modular arithmetic, and induction.",
    lectureTitle: "Primer: How to reason about discrete-math cases",
    body: `# How to reason about discrete-math cases

This short primer prepares you for the **Discrete Math** diagnostic. That check is *ungraded practice* — it never affects your course grade. It is drawn from the eight topics of this unit and asks you to *apply* what you have learned to a specific situation, not to recite a definition.

## It tests application, not memorization

A diagnostic question gives you a small, concrete scene — an argument whose validity you must judge, a claim that needs a proof or a counterexample, a count where order may or may not matter, a network modeled as dots and lines, a calculation that wraps around, a statement to prove for all numbers — and asks what the course's ideas tell you about it. Knowing the words "implication" or "pigeonhole principle" is not enough; the question wants you to recognize *which* idea fits and *why* it matters here.

## What the questions reward

- **Reaching for the right idea** — match the situation to the concept that fits it: logic and truth values, proof versus counterexample, sets/relations/functions, the counting rules and the pigeonhole principle, graphs and paths, modular wrap-around, or recursion and induction.
- **Using evidence from the scene** — point to the detail that decides it (is this OR inclusive? is the premise even true? does order matter here? is there a forced collision? is there a base case?), rather than answering from a general impression.
- **Avoiding the lazy guess** — discrete math replaces reflexes like "lots of examples prove it" or "the pigeonhole principle is too obvious to matter" with careful reasoning. The best answers resist those reflexes and stay grounded in what the situation actually says.

## How to do this activity well

1. **Read the situation first**, then ask which topic it belongs to.
2. **Find the detail that decides it** — the truth value, the counterexample, the order-matters question, the forced collision, the base case — that makes one answer better than another.
3. For written items, **give the core idea in a sentence or two** — clear and correct beats long and padded.

Take it as often as you like; the questions are freshly generated every time, and there is no penalty for any answer.`,
  },
  {
    slug: "reasoning-primer-general",
    title: "Core reasoning skills",
    weekNumber: 1,
    blurb:
      "Diagnostic primer: analysis, inference, evaluation, deduction, and induction.",
    lectureTitle: "Primer: Core reasoning skills",
    body: `# Core reasoning skills

This short primer prepares you for the **General Reasoning** diagnostic — an *ungraded* check that tests five genuine reasoning skills. These are the same skills you use to decide what a set of facts really shows, so they matter directly for thinking clearly about discrete math.

## The five skills

- **Analysis** — break an argument into parts: find its **point** (the conclusion), the **reasons** given for it, and any hidden assumption it leans on. Ask: "What is this trying to convince me of, and what does it take for granted?"
- **Inference** — work out what *follows* from what you're told, and how strongly. Tell apart what *must* be true, what is *likely*, and what is only *possible*.
- **Evaluation** — judge how much the reasons actually support the point. Notice when evidence is beside the point, a source isn't trustworthy, or a step doesn't really connect.
- **Deduction** — reasoning where true starting facts *guarantee* the conclusion. If the starting facts are true, the conclusion can't be false. Watch for sneaky forms that only *look* airtight.
- **Induction** — reasoning from a few examples to a *probable* general rule or prediction. Strong induction uses many fair examples; weak induction over-generalizes from too few.

## A recurring trap: things that move together

Most wrong answers are statements that *sound* reasonable but are **not actually backed up by what you were told**. The discipline this check rewards is the same one careful formal thinking demands: keep apart what the facts **show**, what you're **assuming**, and what only *sounds* right. Two things happening together does not prove one causes the other.

## How to do this activity well

1. Find the **point** (conclusion) first, then the reasons.
2. Ask which of the five skills the question is testing (a hidden-assumption question is analysis; a "what follows" question is inference or deduction; a "how good is this reasoning" question is evaluation).
3. Pick the option that follows **only** from what you were given — not the one that merely sounds true or appealing.

Take it as often as you like; the questions are freshly generated every time, and it never affects your grade.`,
  },
];

// Insert any teaching-to-the-test primer lectures whose slug is not yet present.
// Safe to run on every boot: it only adds what is missing.
export async function seedReasoningPrimersIfMissing(): Promise<void> {
  const currentSlugs = REASONING_PRIMERS.map((p) => p.slug);
  // Remove any obsolete primer topics from earlier diagnostic models (their
  // lectures cascade-delete), so renamed/retired primers self-heal instead of
  // stranding stale content in existing or republished databases.
  const stale = await db
    .delete(topicsTable)
    .where(
      and(
        like(topicsTable.slug, "reasoning-primer-%"),
        notInArray(topicsTable.slug, currentSlugs),
      ),
    )
    .returning({ slug: topicsTable.slug });
  if (stale.length > 0) {
    logger.info(
      { removed: stale.map((s) => s.slug) },
      "Reasoning primers: removed obsolete primers",
    );
  }
  let added = 0;
  for (let i = 0; i < REASONING_PRIMERS.length; i++) {
    const t = REASONING_PRIMERS[i]!;
    const existing = await db
      .select({ id: topicsTable.id })
      .from(topicsTable)
      .where(eq(topicsTable.slug, t.slug));
    if (existing.length > 0) continue;
    const [inserted] = await db
      .insert(topicsTable)
      .values({
        slug: t.slug,
        title: t.title,
        weekNumber: t.weekNumber,
        blurb: t.blurb,
        position: 900 + i,
      })
      .returning();
    if (!inserted) throw new Error(`Failed to insert primer ${t.slug}`);
    await db.insert(lecturesTable).values({
      topicId: inserted.id,
      weekNumber: t.weekNumber,
      title: t.lectureTitle,
      body: t.body,
    });
    added += 1;
  }
  if (added > 0) {
    logger.info({ added }, "Reasoning primers seeded");
  } else {
    logger.info("Reasoning primers: already present, skipping");
  }
}

export async function seedIfEmpty(): Promise<void> {
  // The course was migrated to the Baby Discrete Math syllabus. Detect the
  // marker topic; if present and the content version matches, the content is
  // current and we skip. This makes the seed self-healing across environments: a
  // database that still holds older content (e.g. a previous curriculum) is
  // detected and replaced on boot.
  const markerTopic = await db
    .select({ id: topicsTable.id })
    .from(topicsTable)
    .where(eq(topicsTable.slug, "what-discrete-math-is"));
  // Read the stored content version. Tolerate the seed_meta table not yet
  // existing (e.g. a boot that races ahead of schema migration): treat that as
  // "no version recorded", which forces a reseed once the table is present.
  let currentVersion: string | null = null;
  try {
    const storedVersion = await db
      .select({ value: seedMetaTable.value })
      .from(seedMetaTable)
      .where(eq(seedMetaTable.key, "content_version"));
    currentVersion = storedVersion[0]?.value ?? null;
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "Seed: seed_meta unavailable, treating version as unset");
    currentVersion = null;
  }
  if (markerTopic.length > 0 && currentVersion === SEED_CONTENT_VERSION) {
    logger.info("Seed: course content present and current, skipping");
    return;
  }
  if (markerTopic.length > 0) {
    logger.warn(
      { storedVersion: currentVersion, expected: SEED_CONTENT_VERSION },
      "Seed: course content present but out of date — re-seeding with the current curriculum",
    );
  }

  // No current content. Either the database is empty (fresh) or it still holds
  // an older curriculum. Do the (optional) wipe and the full reseed in a SINGLE
  // transaction so the marker topic only ever becomes visible once the entire
  // curriculum has committed. A crash mid-seed rolls back, so the next boot
  // retries instead of leaving partial content that the marker check would
  // wrongly treat as healthy. TRUNCATE also takes an ACCESS EXCLUSIVE lock, so
  // concurrent readers never observe a half-empty course during the replace
  // window. The diagnostic tables are truncated here too so the (non
  // version-gated) diagnostic seed repopulates them with the current content on
  // the same boot.
  await db.transaction(async (tx) => {
    const existing = await tx.execute(sql`select count(*)::int as n from topics`);
    const row = (existing.rows[0] ?? {}) as { n?: number };
    if ((row.n ?? 0) > 0) {
      logger.warn(
        "Seed: stale course content detected — replacing with the Baby Discrete Math curriculum",
      );
      await tx.execute(
        sql`TRUNCATE TABLE answers, attempts, practice_attempts, practice_problems, practice_sessions, problems, assignments, lectures, topics, diagnostic_responses, diagnostic_attempts, diagnostic_items, diagnostic_assessments RESTART IDENTITY CASCADE`,
      );
    } else {
      logger.info("Seed: populating course content");
    }

    // Topics + lectures
    const slugToTopicId = new Map<string, number>();
    for (let i = 0; i < TOPICS.length; i++) {
      const t = TOPICS[i]!;
      const [inserted] = await tx
        .insert(topicsTable)
        .values({
          slug: t.slug,
          title: t.title,
          weekNumber: t.weekNumber,
          blurb: t.blurb,
          position: i,
        })
        .returning();
      if (!inserted) throw new Error(`Failed to insert topic ${t.slug}`);
      slugToTopicId.set(t.slug, inserted.id);
      await tx.insert(lecturesTable).values({
        topicId: inserted.id,
        weekNumber: t.weekNumber,
        title: t.lectureTitle,
        body: t.body,
      });
    }

    // Assignments + problems
    for (let i = 0; i < ASSIGNMENTS.length; i++) {
      const a = ASSIGNMENTS[i]!;
      const [inserted] = await tx
        .insert(assignmentsTable)
        .values({
          kind: a.kind,
          title: a.title,
          weekNumber: a.weekNumber,
          position: i,
          isTimed: a.isTimed,
          timeLimitMinutes: a.timeLimitMinutes,
          instructions: a.instructions,
        })
        .returning();
      if (!inserted) throw new Error(`Failed to insert assignment ${a.title}`);
      for (let p = 0; p < a.problems.length; p++) {
        const prob = a.problems[p]!;
        const topicId = slugToTopicId.get(prob.topicSlug);
        if (!topicId) throw new Error(`Unknown topic slug ${prob.topicSlug}`);
        await tx.insert(problemsTable).values({
          assignmentId: inserted.id,
          topicId,
          position: p,
          prompt: prob.prompt,
          correctAnswer: prob.correctAnswer,
          explanation: prob.explanation,
          hint: prob.hint ?? null,
        });
      }
    }

    // Stamp the content version last, inside the same transaction, so the
    // marker check on the next boot only treats the course as "current" once
    // the entire curriculum has committed.
    await tx
      .insert(seedMetaTable)
      .values({ key: "content_version", value: SEED_CONTENT_VERSION })
      .onConflictDoUpdate({
        target: seedMetaTable.key,
        set: { value: SEED_CONTENT_VERSION, updatedAt: new Date() },
      });
  });

  logger.info(
    { topics: TOPICS.length, assignments: ASSIGNMENTS.length, version: SEED_CONTENT_VERSION },
    "Seed complete",
  );
}

// ---------------------------------------------------------------------------
// Original content for the embedded diagnostic reasoning assessments.
//
// Two instruments, each offered at FOUR time-points (phases) so a student can
// gauge themselves before, during, and after the course:
//   - subject  — Discrete Math subject-specific reasoning. Realistic short
//     cases about the course material (discrete math); the best-supported
//     answer is keyed first.
//   - general  — General Reasoning. Genuine reasoning items spanning analysis,
//     inference, evaluation, deduction, and induction (NOT a "docility"/agree-
//     with-authority test).
//
// Each (instrument, phase) is offered in THREE selectable answer formats that
// share the same kind of questions:
//   - mcq     — pick the single best option.
//   - hybrid  — pick the best option AND (optionally) write a short note.
//   - written — no options shown; write a short answer in your own words.
//
// These diagnostics are UNGRADED practice: takeable anytime, unlimited times,
// and they never affect the course grade. Every time a test is started, fresh
// questions are generated (see reasoning.ts) so questions never repeat. The
// items below are the structural BLUEPRINT (style + fallback) for that
// generation, grounded per phase by GEN_SPECS.
//
// All items are ORIGINAL. For every item the correct option is written FIRST;
// at seed time options are rotated so the correct answer lands at a varied
// index (see seedDiagnostics.ts). `modelAnswer` is the ideal short written
// response used to grade the written/hybrid formats.
// ---------------------------------------------------------------------------

export type SkillArea =
  | "analysis"
  | "inference"
  | "evaluation"
  | "deduction"
  | "induction";

export type Instrument = "subject" | "general";

export type Phase = "before" | "third" | "twothirds" | "after";

export type DiagFormat = "mcq" | "hybrid" | "written";

// A single unified diagnostic item. The correct option is listed FIRST and is
// rotated to a random index at seed time. `modelAnswer` is the reference answer
// for grading the written/hybrid formats.
export type DiagItem = {
  prompt: string;
  options: string[];
  modelAnswer: string;
  skillArea?: SkillArea;
};

export type DiagnosticSeed = {
  instrument: Instrument;
  phase: Phase;
  format: DiagFormat;
  title: string;
  subtitle: string;
  instructions: string;
  items: DiagItem[];
};

// ===========================================================================
// Phase metadata
// ===========================================================================

export const PHASE_ORDER: Phase[] = ["before", "third", "twothirds", "after"];

export const PHASE_LABEL: Record<Phase, string> = {
  before: "Before the course",
  third: "One-third of the way through",
  twothirds: "Two-thirds of the way through",
  after: "After the course",
};

// ===========================================================================
// Per-(instrument, phase) generation specs
// Used by reasoning.ts to generate fresh, never-repeating questions grounded in
// the right scope for the chosen time-point. `topicFocus` describes WHAT to ask
// about; `level` nudges difficulty for the time-point.
// ===========================================================================

export type GenSpec = { topicFocus: string; level: string };

const SUBJECT_SPECS: Record<Phase, GenSpec> = {
  before: {
    level:
      "Intro level: answerable by a thoughtful newcomer reasoning carefully, BEFORE any lessons. Do not assume prior course knowledge or technical terms. No heavy formal derivations — reward plain-language reasoning.",
    topicFocus:
      "What discrete math is and how to think about it: that it is the mathematics of separate, distinct things — whole numbers, true/false statements, sets, networks — rather than the smooth, continuous quantities of calculus, where 'a little more' means jumping to the next whole thing; that its toolkit is logic, proof, sets/relations/functions, counting, graphs, modular arithmetic, and recursion/induction; and that because a computer is itself a discrete machine (distinct bits, one step at a time, no true infinities), discrete math is the natural language for what computers do, whether they are correct, and how long they take — rewarding careful reasoning and proof over formula-crunching.",
  },
  third: {
    level:
      "Early course level: covers roughly the first third of the unit. Plain language, short realistic cases, no heavy formal derivations.",
    topicFocus:
      "Topics 1.1-1.3: what discrete math is (the math of distinct, countable things, the natural math of computers); logic (a statement is simply true or false; the connectives NOT/AND/OR — OR is inclusive — and if-then, which is false only when the 'if' is true but the 'then' is false; the quantifiers 'for all' and 'there exists,' where the negation of 'all' is 'some…not'); and proof (an airtight chain of reasoning giving certainty no pile of examples can — direct proof, proof by contradiction, and disproof by a single counterexample, since examples can never establish a 'for all' claim).",
  },
  twothirds: {
    level:
      "Mid course level: covers roughly the first two-thirds of the unit. Realistic short cases requiring a step of reasoning, no heavy formal derivations.",
    topicFocus:
      "Topics 1.1-1.6: what discrete math is, logic, and proof, PLUS sets/relations/functions (a set is a collection of distinct things where order and duplicates don't matter; a relation is a set of linked pairs saying which things connect; a function is a relation assigning each input exactly one output), counting and the pigeonhole principle (the product rule multiplies independent choices and the sum rule adds non-overlapping ones; permutations count order-matters arrangements, combinations count order-doesn't selections; and more items than containers forces a shared container — guaranteeing collisions like unavoidable hash collisions), and graphs (dots/vertices joined by lines/edges, directed or weighted; paths, cycles, and connectedness; one dots-and-lines model fits road maps, social networks, and the web, so one algorithm like shortest path serves them all).",
  },
  after: {
    level:
      "End-of-course level: covers the whole unit. Integrative short cases that apply more than one idea, no heavy formal derivations.",
    topicFocus:
      "The full unit, topics 1.1-1.8: what discrete math is, logic, proof, sets/relations/functions, counting and the pigeonhole principle, and graphs, PLUS modular arithmetic (arithmetic that wraps around a modulus like a clock, working with remainders; the one-way property — easy forward like multiplying primes, infeasible to reverse like factoring — is what cryptosystems such as RSA use to secure the internet) and recursion and induction (recursion defines a thing by smaller copies plus a base case; induction proves a statement for all whole numbers via a base case and an inductive step, like climbing an infinite ladder; they are two sides of one idea, which is why recursive algorithms are proved correct by induction).",
  },
};

const GENERAL_SPECS: Record<Phase, GenSpec> = {
  before: {
    level: "Everyday, accessible reasoning. One step of inference per item.",
    topicFocus:
      "General reasoning on everyday, neutral topics: identifying assumptions and conclusions, what evidence does and does not support, judging the strength of sources, valid vs. invalid deduction, and the strength of generalizations.",
  },
  third: {
    level: "Everyday reasoning, slightly more demanding than the baseline.",
    topicFocus:
      "General reasoning on everyday, neutral topics: assumptions/conclusions, supported inferences, source quality, deductive validity, and inductive strength.",
  },
  twothirds: {
    level: "Moderately demanding reasoning, sometimes two steps.",
    topicFocus:
      "General reasoning on everyday, neutral topics: assumptions/conclusions, supported inferences, source quality, deductive validity, and inductive strength.",
  },
  after: {
    level: "More demanding, multi-step reasoning where appropriate.",
    topicFocus:
      "General reasoning on everyday, neutral topics: assumptions/conclusions, supported inferences, source quality, deductive validity, and inductive strength.",
  },
};

export function genSpecFor(instrument: Instrument, phase: Phase): GenSpec {
  return instrument === "subject"
    ? SUBJECT_SPECS[phase]
    : GENERAL_SPECS[phase];
}

// ===========================================================================
// Format-specific instructions
// ===========================================================================

const FORMAT_LABEL: Record<DiagFormat, string> = {
  mcq: "Multiple Choice",
  hybrid: "Hybrid",
  written: "Written",
};

function instructionsFor(instrument: Instrument, format: DiagFormat): string {
  const subject =
    instrument === "subject"
      ? "Answer each question about discrete math — these reward careful reasoning about realistic cases (no heavy formal derivations), not memorized facts"
      : "Answer each reasoning question — these measure how you think, not what you recall";
  const body =
    format === "mcq"
      ? `${subject} by selecting the single best option.`
      : format === "hybrid"
        ? `${subject} by selecting the best option. You can add a quick note on your reasoning if you like — it's optional and a few words is plenty.`
        : `${subject}. No answer options are shown — just jot a brief answer in your own words. One or two sentences is plenty; there's no need to write a lot.`;
  return `${body} This is ungraded practice — take it anytime, as many times as you like; it never affects your course grade. Submitting shows your results with written feedback.`;
}

// ===========================================================================
// SUBJECT — Discrete Math blueprint cases (best answer keyed FIRST)
// ===========================================================================

const SUBJECT_BEFORE: DiagItem[] = [
  {
    prompt:
      "A friend says, 'Discrete math is just calculus with smaller numbers — same kind of math.' How would someone who understands what this course is about most likely respond?",
    options: [
      "Not really — discrete math studies separate, distinct things (whole numbers, statements, sets, networks) rather than the smooth, continuous quantities calculus is about, which is exactly why it's the natural math of computers",
      "That's correct; the only real difference is that the numbers are smaller",
      "Discrete math is just an easier version of calculus with the same goals",
      "It's true, because all math is ultimately the same subject",
    ],
    modelAnswer:
      "Discrete math is about distinct, countable things — not the smooth, continuous quantities of calculus — so it relies on careful reasoning rather than limits, and because computers are themselves discrete machines it is the natural math of computing.",
  },
  {
    prompt:
      "A computer stores information as distinct bits and takes one step at a time. Which statement best captures why this makes discrete math, not calculus, its natural language?",
    options: [
      "Because a computer is itself a discrete machine — no true infinities or infinitely fine measurements — so the math describing what it does, whether it's correct, and how long it takes is the math of distinct things",
      "Because calculus is too difficult for computers to run",
      "Because computers only ever work with very small numbers",
      "Because discrete math is faster to calculate than calculus",
    ],
    modelAnswer:
      "Computers deal in distinct, countable steps and bits rather than continuous quantities, so questions about their behavior, correctness, and running time are discrete-math questions — which is why discrete math, not calculus, is computing's natural language.",
  },
  {
    prompt:
      "Discrete math is often a student's first taste of 'real,' proof-based mathematics. Why is reasoning carefully — rather than just calculating — so central to it?",
    options: [
      "Because its goal is to establish things with certainty and count possibilities without error, which rewards defining things precisely and proving why something must be true over crunching formulas",
      "Because there are no numbers in discrete math at all",
      "Because calculation is never useful in any part of mathematics",
      "Because proofs are only there to make the subject harder",
    ],
    modelAnswer:
      "Discrete math emphasizes establishing truths with certainty and counting possibilities exactly, so it rewards precise definitions and proof — careful reasoning about why something must hold — far more than memorized calculation.",
  },
];

const SUBJECT_THIRD: DiagItem[] = [
  {
    prompt:
      "A menu says 'you may have soup or salad.' A student insists that in logic this rules out having both. Using what logic actually says about OR, what's the best correction?",
    options: [
      "In logic, OR is inclusive — it is true when at least one part is true, including the case where both are — so logically 'soup or salad' does not forbid having both",
      "That's right; logic's OR always means exactly one, never both",
      "Logic has no way to combine two statements with 'or'",
      "It depends entirely on the menu, since logic doesn't define 'or'",
    ],
    modelAnswer:
      "Logic's OR is inclusive: it is true whenever at least one part is true, and that includes both being true, so the logical reading of 'soup or salad' allows having both — unlike the casual 'one but not both.'",
    skillArea: "analysis",
  },
  {
    prompt:
      "Consider the claim 'if it rains, the ground gets wet.' On a sunny day it doesn't rain. A student says the statement must be false that day. Which response reasons correctly?",
    options: [
      "It is still true — an if-then is false only when the 'if' part is true but the 'then' part is false, so when it doesn't rain the promise was never tested and the statement holds",
      "Yes, it is false, because the ground didn't get wet from rain",
      "The statement is meaningless whenever it isn't raining",
      "It is false, because both parts have to be true for an if-then to be true",
    ],
    modelAnswer:
      "An implication makes a promise only about the case where the 'if' holds, so it is false in exactly one situation — 'if' true and 'then' false. On a dry day the 'if' is false, the promise is untested, so the statement counts as true.",
    skillArea: "inference",
  },
  {
    prompt:
      "Someone says, 'I checked a rule for the first hundred numbers and it always worked, so it's definitely true for all numbers.' Given the course, why is that reasoning flawed?",
    options: [
      "Because examples can only show a claim holds so far and never cover the infinitely many cases of a 'for all' statement — patterns can hold a long time then fail, so only a proof gives certainty",
      "Because a hundred examples is simply too few; a thousand would settle it",
      "Because checking examples is never useful in mathematics",
      "Because the rule must be false if it needed checking at all",
    ],
    modelAnswer:
      "No finite number of examples can establish a 'for all' claim, since it covers infinitely many cases and patterns can fail late (like n² + n + 41 failing at 40); a proof is the only thing that establishes the claim for every case at once.",
    skillArea: "evaluation",
  },
];

const SUBJECT_TWOTHIRDS: DiagItem[] = [
  {
    prompt:
      "A student says 'is a sibling of' is a function because it pairs people up. Using the idea that a function assigns each input exactly one output, what's the best correction?",
    options: [
      "It's a relation but not a function — a person can have several siblings, so one input maps to many outputs, whereas a function must assign each input exactly one output",
      "It is a function, because it connects pairs of people",
      "It is neither a relation nor a function, since it involves people",
      "It is a function only if everyone has exactly two siblings",
    ],
    modelAnswer:
      "'Is a sibling of' is a relation (a set of linked pairs), but not a function: a single person can have multiple siblings, so one input has many outputs, violating the rule that a function gives each input exactly one output.",
    skillArea: "analysis",
  },
  {
    prompt:
      "A hash table maps a very large set of possible keys into a much smaller number of slots. A student hopes a clever enough design could avoid all collisions. Why does the pigeonhole principle say otherwise?",
    options: [
      "Because there are far more possible keys than slots, so by the pigeonhole principle at least two keys must land in the same slot — collisions are forced no matter how clever the design",
      "Because hash functions are simply written badly",
      "Because collisions only happen when the table is completely full",
      "Because the pigeonhole principle applies only to physical pigeons",
    ],
    modelAnswer:
      "With more items than containers, the pigeonhole principle guarantees some container holds two — so mapping many keys into fewer slots forces a collision. No hash design can avoid collisions entirely; it can only manage them.",
    skillArea: "inference",
  },
  {
    prompt:
      "A road map, a friendship network, and the links between web pages seem to have nothing in common. Why can one graph algorithm, like shortest path, work on all three?",
    options: [
      "Because each is just 'things and their connections' — dots joined by lines — and a graph captures only that bare structure, so an algorithm written for dots and lines works regardless of what they represent",
      "Because all three are secretly the same physical system",
      "Because a separate algorithm is actually needed for each one",
      "Because graphs only work for road maps, not the other two",
    ],
    modelAnswer:
      "A graph captures just the essence of things and their connections, discarding every other detail, so road maps, social networks, and the web are the same kind of object — and one dots-and-lines algorithm like shortest path serves them all.",
    skillArea: "evaluation",
  },
];

const SUBJECT_AFTER: DiagItem[] = [
  {
    prompt:
      "A friend reasons, 'Modular arithmetic is just a trick for clocks and calendars — it can't have anything to do with serious things like internet security.' Drawing on the unit, the strongest correction is:",
    options: [
      "Not so — modular arithmetic has a one-way property (easy forward like multiplying primes, infeasible to reverse like factoring), and cryptosystems such as RSA build internet security directly on that lopsidedness",
      "That's right; clock math has no real-world importance",
      "It's used in security only because it makes calculations faster",
      "There's no connection between modular arithmetic and cryptography",
    ],
    modelAnswer:
      "The same wrap-around arithmetic behind clocks has a crucial one-way property: some operations are easy to do but infeasible to undo (multiplying primes vs. factoring), and RSA-style cryptography turns exactly that into the security behind the browser padlock.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "A friend insists, 'Testing an algorithm on lots of inputs is just as good as proving it always works.' Drawing on the unit, the strongest correction is:",
    options: [
      "Not so — testing only shows the cases you checked, but a 'for all' guarantee covers infinitely many inputs, so only a proof (often by induction) can establish that the algorithm is always correct or always halts",
      "That's right; enough tests are exactly equivalent to a proof",
      "Proofs are unnecessary because computers don't make mistakes",
      "Testing is pointless, so neither approach is any good",
    ],
    modelAnswer:
      "No amount of testing covers the infinitely many possible inputs, and patterns can fail beyond what you tried; a proof — frequently by induction over input size — is what establishes that an algorithm is correct or halts for every case.",
    skillArea: "inference",
  },
  {
    prompt:
      "A friend says, 'Discrete math is a grab-bag of unrelated topics — logic, sets, counting, graphs — with no thread connecting them.' Drawing on the unit, the strongest reply is:",
    options: [
      "They connect tightly — logic grounds reasoning, proof turns it into certainty, sets/relations/functions give the grammar of structure, counting and graphs model possibilities and networks, and recursion/induction tie it together as the backbone of computing",
      "She's right; the topics share nothing in common",
      "They connect only by historical accident, not by ideas",
      "Only logic matters; the rest are optional extras",
    ],
    modelAnswer:
      "The topics form one toolkit: logic and proof supply rigorous reasoning, sets/relations/functions describe structure, counting and graphs handle possibilities and networks, modular arithmetic secures communication, and recursion/induction unify defining and proving — together the mathematical backbone of computing.",
    skillArea: "evaluation",
  },
];

// ===========================================================================
// GENERAL — reasoning blueprint (analysis / inference / evaluation /
// deduction / induction). Shared across phases; difficulty is nudged per phase
// at generation time (see GEN_SPECS.level).
// ===========================================================================

const GENERAL_BLUEPRINT: DiagItem[] = [
  {
    prompt:
      "Consider: 'All students who studied passed the exam. Maria studied. So Maria passed.' Which unstated assumption does the argument rely on?",
    options: [
      "Maria is among the students the first statement describes.",
      "Studying is the only way to pass the exam.",
      "Maria always studies for her exams.",
      "The exam was unusually difficult.",
    ],
    modelAnswer:
      "It assumes Maria is one of the students covered by 'all students who studied' — that her studying puts her in the group described.",
    skillArea: "analysis",
  },
  {
    prompt:
      "A survey finds 70% of people who exercise daily report good sleep, versus 30% of those who never exercise. Which conclusion is best supported?",
    options: [
      "People who exercise daily are more likely to report good sleep than those who never exercise.",
      "Exercise guarantees good sleep for everyone.",
      "Poor sleep is what causes people to stop exercising.",
      "Anyone who wants good sleep must exercise daily.",
    ],
    modelAnswer:
      "Only that daily exercisers are more likely to report good sleep — an association, not a guarantee or a proven cause.",
    skillArea: "inference",
  },
  {
    prompt: "Which source would most strengthen the claim 'this medication is safe'?",
    options: [
      "A large, peer-reviewed clinical trial.",
      "A testimonial from one satisfied customer.",
      "An advertisement produced by the manufacturer.",
      "A popular wellness blog post.",
    ],
    modelAnswer:
      "A large, peer-reviewed clinical trial — independent, systematic evidence is far stronger than a testimonial, an ad, or a blog.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "'If it rained, the streets are wet. The streets are not wet.' What necessarily follows?",
    options: [
      "It did not rain.",
      "It rained.",
      "The streets are dry for some other reason.",
      "Nothing at all follows.",
    ],
    modelAnswer:
      "It did not rain — if rain would have made the streets wet and they are not wet, then it cannot have rained.",
    skillArea: "deduction",
  },
  {
    prompt:
      "Plants given a new fertilizer grew taller than otherwise identical plants without it, all else held equal. The best-supported conclusion is:",
    options: [
      "The fertilizer probably caused the extra growth.",
      "Taller plants attract more fertilizer.",
      "Fertilizer is required for any plant growth at all.",
      "The result was pure coincidence.",
    ],
    modelAnswer:
      "Because everything else was held equal, the fertilizer probably caused the extra growth.",
    skillArea: "induction",
  },
  {
    prompt:
      "A report notes that ice-cream sales and drowning deaths rise in the same months. A careful reader should infer that:",
    options: [
      "Both may be linked to a third factor, such as hot weather.",
      "Eating ice cream causes drowning.",
      "Drowning incidents cause ice-cream sales.",
      "The data must simply be mistaken.",
    ],
    modelAnswer:
      "That both probably rise because of a shared third factor such as hot weather — correlation doesn't mean one causes the other.",
    skillArea: "inference",
  },
];

// ===========================================================================
// Seed expansion — each (instrument, phase) in all three formats
// ===========================================================================

type BaseContent = {
  instrument: Instrument;
  phase: Phase;
  baseTitle: string;
  items: DiagItem[];
};

const BASE_CONTENT: BaseContent[] = PHASE_ORDER.flatMap((phase) => {
  const subjectItems: Record<Phase, DiagItem[]> = {
    before: SUBJECT_BEFORE,
    third: SUBJECT_THIRD,
    twothirds: SUBJECT_TWOTHIRDS,
    after: SUBJECT_AFTER,
  };
  return [
    {
      instrument: "subject" as const,
      phase,
      baseTitle: `Discrete Math Check — ${PHASE_LABEL[phase]}`,
      items: subjectItems[phase],
    },
    {
      instrument: "general" as const,
      phase,
      baseTitle: `General Reasoning Check — ${PHASE_LABEL[phase]}`,
      items: GENERAL_BLUEPRINT,
    },
  ];
});

const FORMATS: DiagFormat[] = ["mcq", "hybrid", "written"];

export const DIAGNOSTIC_SEED: DiagnosticSeed[] = BASE_CONTENT.flatMap((base) =>
  FORMATS.map((format) => ({
    instrument: base.instrument,
    phase: base.phase,
    format,
    title: `${base.baseTitle} · ${FORMAT_LABEL[format]}`,
    subtitle: PHASE_LABEL[base.phase],
    instructions: instructionsFor(base.instrument, format),
    items: base.items,
  })),
);

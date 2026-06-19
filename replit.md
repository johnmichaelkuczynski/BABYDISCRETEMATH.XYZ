# 🔎 Basic Discrete Math

**A Friendly, One-Unit Intro to Discrete Math That Teaches, Tutors, and Proofs Itself — for Adults Entering a New Discipline**

---

## 🧩 Overview

Basic Discrete Math is a self-paced, single-user web course that delivers a friendly, plain-language introduction to discrete mathematics — the math of separate, distinct things (whole numbers, statements, sets, networks), the natural math of computers — taught, tutored, drilled, and graded entirely by AI, with built-in academic-integrity enforcement. Every idea is built up from first principles and explained in plain words rather than heavy formulas, so the subject stays approachable even if it is new to you.

It turns one surprising idea — *that the math behind computers is really the math of distinct, countable things and the airtight reasoning that connects them* — into one product: read each lesson at the depth you want, ask a tutor scoped to the exact section you're on, drill questions whose difficulty adapts to you in real time, and submit homework, a unit test, and a final that are AI-graded with feedback and screened for AI-generated answers. The material is kept approachable and concrete — it shows how a logical "if-then" is false only when the 'if' is true and the 'then' is false, why a hundred examples still don't prove a rule, why {1,2,3} equals {3,2,1}, why 13 people must share a birth month, how a road map and a friendship network are the same dots-and-lines model, how 5 hours after 10 o'clock is 3, and how stepping onto the bottom rung and always reaching the next one lets you climb forever.

The curriculum is organized into **one unit and 8 topics**: 1.1 what discrete math is (the math of distinct things); 1.2 logic (the machine code of reasoning); 1.3 proof (how you know something for certain); 1.4 sets, relations, and functions (the grammar of structure); 1.5 counting and the pigeonhole principle; 1.6 graphs (the hidden networks in everything); 1.7 modular arithmetic (clock math that secures the internet); and 1.8 recursion and induction (the capstone).

Designed for **adults approaching discrete math for the first time — graduate students, researchers, and working professionals entering a new field — instructors evaluating AI-taught coursework, and researchers studying AI academic integrity**, Basic Discrete Math pairs a real curriculum with two layers of AI-authorship detection — surfacing not just *whether* the writing looks AI-generated, but whether the *act of producing it* did.

---

## 🧠 What It Does

- **One-Unit Structured Curriculum** — A complete plain-language intro syllabus across 8 topics, from "what discrete math is" to a real-world capstone. The unit ships with lessons, two homework sets, a timed unit test, and a cumulative final exam.
- **Three-Depth Lessons** — Every lesson is available at **Short / Medium / Long** length, AI-rewritten while preserving the same examples and learning objectives. Skim the concept, expand it on demand, or read the deeper cut.
- **Section-Scoped AI Tutor** — Ask a question about the paragraph you're reading and the answer streams back token-by-token, grounded in that exact lecture section. Suggested starter questions are pre-generated per lecture.
- **Adaptive Topic Practice** — Generated problem sets that move difficulty up after a streak and down after a miss, with explanations on every answer. Per-session difficulty persists, so each drill picks up where the last one left off.
- **AI-Graded Assignments** — Homework, the unit test, and the final are scored by an LLM grader that judges semantic equivalence to a model answer, returns per-problem correctness *plus* a written rationale, then rolls up to a percent score on the attempt.
- **Two-Layer AI Detection on Every Submission** — Each submitted answer is screened by both a static text classifier (GPTZero) and a diachronic keystroke-pattern detector. Each verdict ships with a human-readable rationale.
- **Diagnostic Reasoning Checks** — Two instruments (Discrete Math subject reasoning; and General Reasoning across analysis, inference, evaluation, deduction, and induction), each offered in three formats (multiple choice, hybrid, or written) and three lengths, at four points in the journey (before, one-third, two-thirds, and after the course). They are ungraded practice — takeable anytime, unlimited, with freshly generated questions every attempt — and never affect the grade (coursework is 100%).
- **Live Analytics** — Dashboard KPIs (attempts, accuracy, streak), per-topic mastery percentages, and a recent-activity feed — so progress, weak spots, and momentum are all visible at a glance.
- **Operator Diagnostics** — One-click self-tests (system health and synthetic-student end-to-end run) verify the entire stack — database, OpenAI integration, GPTZero, detection pipeline, and the practice/grade loop — before you trust a session.

---

## ⚙️ Technical Features

- **Two-Layer AI-Authorship Detection** —
  - **Static (GPTZero):** Every submitted answer is sent to GPTZero's `predict/text` endpoint; the per-document AI probability is blended `0.85 × GPTZero + 0.15 × structural-heuristic` for the final score. If GPTZero is unavailable, the system silently falls back to an LLM scorer plus heuristic — submissions never block.
  - **Diachronic (Keystroke Pattern):** The student textarea captures keystroke count, erase count, bulk-insert events, longest bulk insert, rewrite segments, and total duration. A scorer penalizes paste-then-reword behavior, low keystroke-to-output ratios, and impossibly sustained typing speeds — catching AI use even when the final text is reworded enough to pass GPTZero.
- **Diagnostic Self-Tests** —
  - **System Diagnostic** (`/diagnostics/system`): Ordered checks — environment, database round-trip, course-seed integrity, OpenAI chat completion, OpenAI JSON mode, detection pipeline, AI-positive control sample, and GPTZero connectivity. Each step returns pass/fail, timing, and a raw error string.
  - **Synthetic-Student Diagnostic** (`/diagnostics/synthetic-run`): Spins up a fake student, runs a practice session (wrong → adjust ↓ → right → adjust ↑), takes a full assignment attempt, submits it, and verifies grading + detection + analytics all reflect the run. End-to-end stack proof in one click.
- **Contract-First API** — A single OpenAPI document is the source of truth; React Query hooks for the UI and Zod validators for the server are generated from it. Request and response shapes can't drift between client and server because both come from the same spec.
- **Streaming AI Tutor** — Token-by-token Server-Sent-Event streaming for tutor answers, with a section-scoped system prompt so responses stay grounded in the lecture the student is reading.
- **Adaptive Practice Engine** — Per-session difficulty (1–4 continuous) adjusts after each attempt; the next-problem generator takes the current difficulty and the topic as input, so the question pool is generated on demand instead of pre-baked.
- **Operator Console** — A dedicated Diagnostics page in the student app surfaces both self-tests with one-click execution, per-step pass/fail rows, and raw error output for debugging.
- **Living README** — This README plus a companion `BLUEPRINT.md` architecture document are kept in lock-step with the code — short-form and long-form views of the same truth.

---

## 📊 Designed For

- **Adults Entering a New Field:** A complete, plain-language introduction to discrete math delivered with on-demand tutoring and adaptive practice — self-paced, with no instructor required.
- **Instructors & Curriculum Designers:** A working reference for what AI-taught, AI-graded, AI-detection-screened coursework actually looks like end-to-end.
- **Academic-Integrity Researchers:** A live testbed for layered AI-authorship detection that combines text-based classification with behavioral keystroke evidence.
- **Product & Engineering Teams:** A reference implementation of contract-first full-stack architecture, streaming AI UX, and self-diagnostic operator tooling in a Replit pnpm monorepo.

---

## 💡 Core Idea

Basic Discrete Math reframes an AI-taught course as a *closed accountability loop*.

It doesn't just teach the material and grade the homework — it **teaches**, **tutors**, **drills**, **grades**, **detects misuse**, and **proves the whole pipeline still works** with a single click. The result is a self-paced course that students can actually trust to be fair, and that instructors can actually trust to be honest.

**Basic Discrete Math — where the curriculum, the tutor, the grader, and the integrity check all live in one room.**

---

## 👤 User preferences

- The user prefers to **convert the existing app in place** (e.g. replacing the prior course content/branding with the new subject) rather than create a standalone clone — keep all functionality and format intact when making content/branding changes.
- **YouTube description title format is fixed:** it must ALWAYS be exactly `X — AI-Powered Course` (e.g. `Basic Discrete Math — AI-Powered Course`). No descriptors, taglines, or extra clauses appended (never `… — an AI-Powered Course that teaches and grades!`). One title only, no alternates.
- **App names must be the most literal, utilitarian name possible** — e.g. `Data Analytics`, `Ethics`, `Formal Logic`, `Basic AI`, `Basic Discrete Math`. Never goofy, funny, or cute. The literal name must be used consistently everywhere it appears (README, replit.md, the video, in-app copy).


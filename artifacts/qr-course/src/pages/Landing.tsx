import {
  BarChart3,
  BookOpen,
  MessagesSquare,
  Target,
  ClipboardCheck,
  ShieldCheck,
  Search,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Three-Depth Lessons",
    body: "Read any topic Short, Medium, or Long — same ideas, your pace.",
  },
  {
    icon: MessagesSquare,
    title: "Section-Scoped Tutor",
    body: "Ask about the exact passage you're on and get a live, grounded answer.",
  },
  {
    icon: Target,
    title: "Adaptive Practice",
    body: "Questions that get harder on a streak and ease off after a miss.",
  },
  {
    icon: ClipboardCheck,
    title: "AI-Graded Work",
    body: "Homework, a unit test, and a final — each with written feedback.",
  },
  {
    icon: ShieldCheck,
    title: "Built-In Integrity",
    body: "Every submission is screened for AI authorship, with a clear verdict.",
  },
  {
    icon: BarChart3,
    title: "One Unit, 8 Topics",
    body: "From what discrete math is all the way to recursion and induction.",
  },
];

const topics = [
  { n: "1.1", title: "What discrete math is: the math of distinct things" },
  { n: "1.2", title: "Logic: the machine code of reasoning" },
  { n: "1.3", title: "Proof: how you know something for certain" },
  { n: "1.4", title: "Sets, relations, and functions: the grammar of structure" },
  { n: "1.5", title: "Counting and the pigeonhole principle" },
  { n: "1.6", title: "Graphs: the hidden networks in everything" },
  { n: "1.7", title: "Modular arithmetic: clock math that secures the internet" },
  { n: "1.8", title: "Recursion and induction (Capstone)" },
];

export default function Landing() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
            <Search className="w-4 h-4" />
          </div>
          <span className="font-serif font-semibold text-lg tracking-tight">
            Basic Discrete Math
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a href="/auth/google">
            <button
              className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
              data-testid="button-sign-in"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
          </a>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-6">
            <BarChart3 className="w-3.5 h-3.5" />
            A friendly, one-unit intro to discrete math
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary leading-tight mb-5">
            The math of distinct things — the natural math of computers. Let's understand it together.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            A self-paced course that teaches, tutors, drills, and grades you — the
            foundations of discrete math, built up from first principles in clear,
            plain language. Made for adults approaching the subject for the first time.
          </p>
          <div className="flex items-center justify-center gap-3">
            <a href="/auth/google">
              <button
                className="px-6 py-3 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
                data-testid="button-cta-start"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google to start
              </button>
            </a>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-lg border border-border bg-card p-6 flex flex-col gap-3"
              >
                <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center text-primary">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 pb-24">
          <h2 className="text-center font-serif font-semibold text-xl mb-6">
            The Curriculum
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topics.map((t) => (
              <div
                key={t.n}
                className="flex items-center gap-4 rounded-lg border border-border bg-card p-5"
              >
                <div className="w-10 h-10 shrink-0 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-serif font-bold text-sm">
                  {t.n}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Topic {t.n}
                  </div>
                  <div className="font-medium">{t.title}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-6 text-center text-sm text-muted-foreground">
        Basic Discrete Math — where the curriculum, the tutor, the grader, and the
        integrity check all live in one room.
      </footer>
    </div>
  );
}

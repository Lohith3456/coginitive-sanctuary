import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute left-1/2 top-0 h-[480px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-brand-soft/90 via-sky-50/50 to-transparent blur-3xl" />
      </div>
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-6 inline-flex rounded-full border border-sky-100 bg-brand-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#0c2d5e]">
          Professional Excellence
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Prepare for{" "}
          <span className="text-brand">IELTS</span>
          {", "}
          <span className="text-brand">PTE</span>
          {", "}
          <span className="text-brand">TOEFL</span>
          {", "}
          <span className="text-brand">GRE</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
          Master high-stakes English exams with adaptive practice, timed
          simulations, and clear analytics—so you walk into test day with
          confidence.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/signup"
            className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-lg bg-brand px-8 text-base font-semibold text-white shadow-md transition hover:bg-brand-dark"
          >
            Get Started
          </Link>
          <Link
            href="/exams"
            className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-lg border border-slate-200 bg-white px-8 text-base font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
          >
            View Demo
          </Link>
        </div>
      </div>
    </section>
  );
}

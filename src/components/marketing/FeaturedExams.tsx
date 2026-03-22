"use client";

import Link from "next/link";
import { useState } from "react";
import { EXAMS } from "@/lib/data";

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      {dir === "left" ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      )}
    </svg>
  );
}

export function FeaturedExams() {
  const [start, setStart] = useState(0);
  const visible = 4;
  const maxStart = Math.max(0, EXAMS.length - visible);

  const prev = () => setStart((s) => Math.max(0, s - 1));
  const next = () => setStart((s) => Math.min(maxStart, s + 1));

  const slice = EXAMS.slice(start, start + visible);

  return (
    <section id="exams" className="scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Featured Exams
            </h2>
            <p className="mt-2 max-w-xl text-slate-600">
              Pick your path and unlock section drills, full mocks, and
              performance insights tailored to each test format.
            </p>
          </div>
          <div className="flex gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={prev}
              disabled={start === 0}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
              aria-label="Previous exams"
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              onClick={next}
              disabled={start >= maxStart}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
              aria-label="Next exams"
            >
              <Chevron dir="right" />
            </button>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {slice.map((exam) => (
            <article
              key={exam.id}
              className="flex flex-col rounded-xl border border-slate-100 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.06)] transition hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
                {exam.title.slice(0, 1)}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{exam.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                {exam.description}
              </p>
              <Link
                href={`/exams/${exam.id}/modules`}
                className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand underline decoration-2 underline-offset-2 hover:text-brand-dark"
              >
                Explore Module
                <span aria-hidden>→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { MOCK_RESULTS } from "@/lib/data";

export default function ResultsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">Your results</h1>
      <p className="mt-2 text-slate-600">
        Demo scores based on your last mock attempt.
      </p>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-soft to-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          {MOCK_RESULTS.totalLabel}
        </p>
        <p className="mt-2 text-5xl font-bold text-brand">
          {MOCK_RESULTS.totalScore}
        </p>
      </div>
      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Section performance</h2>
        {MOCK_RESULTS.sections.map((s) => (
          <div
            key={s.name}
            className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-slate-900">{s.name}</p>
              <p className="text-sm text-slate-600">{s.detail}</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{s.score}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/dashboard/mock-test"
          className="inline-flex h-11 items-center rounded-lg bg-brand px-6 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Retake mock
        </Link>
        <Link
          href="/dashboard/practice"
          className="inline-flex h-11 items-center rounded-lg border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          Practice weak areas
        </Link>
      </div>
    </div>
  );
}

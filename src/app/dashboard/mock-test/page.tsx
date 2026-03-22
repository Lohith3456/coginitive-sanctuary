"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MOCK_QUESTIONS } from "@/lib/data";

function formatSeconds(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function MockTestPage() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(60 * 45);
  const [current, setCurrent] = useState(0);
  const [choices, setChoices] = useState<Record<number, number>>({});

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  const q = MOCK_QUESTIONS[current];
  const total = MOCK_QUESTIONS.length;

  const answeredCount = useMemo(
    () => Object.keys(choices).length,
    [choices],
  );

  const submit = useCallback(() => {
    router.push("/dashboard/results");
  }, [router]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Time remaining
          </p>
          <p
            className={`text-3xl font-mono font-bold tabular-nums ${
              secondsLeft < 300 ? "text-red-600" : "text-slate-900"
            }`}
          >
            {formatSeconds(secondsLeft)}
          </p>
        </div>
        <div className="text-sm text-slate-600">
          Question{" "}
          <span className="font-semibold text-slate-900">
            {current + 1} / {total}
          </span>
          <span className="mx-2 text-slate-300">·</span>
          {answeredCount} answered
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-lg font-medium text-slate-900">{q.text}</p>
        <ul className="mt-6 space-y-2">
          {q.options.map((opt, i) => {
            const picked = choices[q.id] === i;
            return (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() =>
                    setChoices((prev) => ({ ...prev, [q.id]: i }))
                  }
                  className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium transition ${
                    picked
                      ? "border-brand bg-brand-soft text-slate-900"
                      : "border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            disabled={current === 0}
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={current >= total - 1}
            onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4">
        <p className="text-xs font-semibold uppercase text-slate-500">
          Jump to question
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {MOCK_QUESTIONS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrent(idx)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold ${
                idx === current
                  ? "bg-brand text-white"
                  : choices[item.id] !== undefined
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-white text-slate-600 ring-1 ring-slate-200"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={submit}
          className="inline-flex h-11 items-center rounded-lg bg-slate-900 px-6 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Submit test
        </button>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-slate-600 hover:text-brand"
        >
          Exit to dashboard
        </Link>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { ExamId } from "@/context/exam-context";
import { useExam } from "@/context/exam-context";
import {
  computeMatcherResults,
  EXAM_MATCHER_QUESTIONS,
} from "@/lib/exam-matcher";

type AfterSelect = "stay" | "modules";

export function ExamRecommendationQuiz({
  afterSelect = "modules",
}: {
  /** `stay` = save exam and remain on exam picker; `modules` = open modules for that exam */
  afterSelect?: AfterSelect;
}) {
  const { setSelectedExam } = useExam();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState<(number | null)[]>(() =>
    EXAM_MATCHER_QUESTIONS.map(() => null),
  );

  const reset = useCallback(() => {
    setStep(0);
    setChoices(EXAM_MATCHER_QUESTIONS.map(() => null));
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    reset();
  }, [reset]);

  const results = useMemo(
    () => computeMatcherResults(choices),
    [choices],
  );

  const isResultStep = step >= EXAM_MATCHER_QUESTIONS.length;
  const currentQ = EXAM_MATCHER_QUESTIONS[step];
  const progressPct =
    ((Math.min(step, EXAM_MATCHER_QUESTIONS.length) + 1) /
      (EXAM_MATCHER_QUESTIONS.length + 1)) *
    100;

  function pickOption(optionIndex: number) {
    setChoices((prev) => {
      const next = [...prev];
      next[step] = optionIndex;
      return next;
    });
  }

  function goNext() {
    if (step < EXAM_MATCHER_QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setStep(EXAM_MATCHER_QUESTIONS.length);
    }
  }

  function goBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  function applyExam(exam: ExamId) {
    setSelectedExam(exam);
    if (afterSelect === "modules") {
      close();
      router.push(`/exams/${exam}/modules`);
      return;
    }
    close();
    requestAnimationFrame(() => {
      document
        .getElementById("exam-cards")
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  return (
    <section className="rounded-2xl border border-[#1D63D1]/20 bg-gradient-to-br from-[#E8F1FC] to-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Not sure which exam to take?
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
            Answer a few questions—we’ll estimate how well each test (IELTS,
            PTE, TOEFL, GRE) fits your goals. This is guidance only, not
            admissions advice.
          </p>
        </div>
        {!open ? (
          <button
            type="button"
            onClick={() => {
              reset();
              setOpen(true);
            }}
            className="shrink-0 rounded-xl bg-[#1D63D1] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#174ea6]"
          >
            Find my exam
          </button>
        ) : null}
      </div>

      {open ? (
        <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
          <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#1D63D1] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {!isResultStep ? (
            <>
              <p className="text-xs font-bold uppercase tracking-wider text-[#1D63D1]">
                Question {step + 1} of {EXAM_MATCHER_QUESTIONS.length}
              </p>
              <h3 className="mt-2 text-base font-bold text-slate-900 sm:text-lg">
                {currentQ.prompt}
              </h3>
              <ul className="mt-5 space-y-2">
                {currentQ.options.map((opt, i) => {
                  const selected = choices[step] === i;
                  return (
                    <li key={opt.label}>
                      <button
                        type="button"
                        onClick={() => pickOption(i)}
                        className={`flex w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition ${
                          selected
                            ? "border-[#1D63D1] bg-[#E8F1FC] text-slate-900"
                            : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 0}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={choices[step] === null}
                  className="rounded-xl bg-[#1D63D1] px-5 py-2 text-sm font-bold text-white hover:bg-[#174ea6] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {step === EXAM_MATCHER_QUESTIONS.length - 1
                    ? "See results"
                    : "Next"}
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="ml-auto text-sm font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-slate-900">
                Your estimated fit
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Higher percentages reflect stronger alignment with your answers
                (demo scoring).
              </p>
              <ul className="mt-6 space-y-5">
                {results.map((row, idx) => (
                  <li key={row.exam}>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
                        {row.exam}
                        {idx === 0 ? (
                          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200">
                            Top match
                          </span>
                        ) : null}
                      </span>
                      <span className="text-sm font-extrabold tabular-nums text-[#1D63D1]">
                        {row.percent}%
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#1D63D1] transition-all"
                        style={{
                          width: `${Math.max(row.percent, 4)}%`,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-8 space-y-4 border-t border-slate-100 pt-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    onClick={() => applyExam(results[0].exam)}
                    className="rounded-xl bg-[#1D63D1] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#174ea6]"
                  >
                    {afterSelect === "stay"
                      ? `Select ${results[0].exam} below`
                      : `Use top match (${results[0].exam})`}
                  </button>
                  {afterSelect === "stay" ? (
                    <a
                      href="#exam-cards"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50"
                    >
                      Browse exams below
                    </a>
                  ) : (
                    <Link
                      href="/exams"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50"
                    >
                      Compare on exam picker
                    </Link>
                  )}
                  <Link
                    href={`/exams/${results[0].exam}/modules`}
                    className="inline-flex items-center justify-center rounded-xl px-1 py-2.5 text-sm font-semibold text-[#1D63D1] hover:underline"
                  >
                    View {results[0].exam} modules →
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setStep(0);
                  }}
                  className="text-sm font-semibold text-slate-500 hover:text-slate-800"
                >
                  Retake questionnaire
                </button>
              </div>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}

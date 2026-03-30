"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useExam } from "@/context/exam-context";
import {
  isExamIdString,
  PRACTICE_SECTIONS,
  practiceQuestionsForExam,
  type PracticeSection,
} from "@/lib/data";

function isPracticeSection(s: string | null): s is PracticeSection {
  return (
    s === "Reading" ||
    s === "Writing" ||
    s === "Listening" ||
    s === "Speaking"
  );
}

function PracticeContent() {
  const searchParams = useSearchParams();
  const { selectedExam, setSelectedExam } = useExam();
  const sectionParam = searchParams.get("section");
  const examParam = searchParams.get("exam");

  const [section, setSection] = useState<PracticeSection>(() =>
    isPracticeSection(sectionParam) ? sectionParam : "Reading",
  );
  const [answers, setAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    if (isExamIdString(examParam)) {
      setSelectedExam(examParam);
    }
  }, [examParam, setSelectedExam]);

  useEffect(() => {
    if (!isPracticeSection(sectionParam)) return;
    setSection(sectionParam);
    setAnswers({});
  }, [sectionParam]);

  const questionBank = useMemo(
    () => practiceQuestionsForExam(selectedExam),
    [selectedExam],
  );

  const questions = useMemo(
    () => questionBank.filter((q) => q.section === section),
    [questionBank, section],
  );

  const examLabel = selectedExam ?? "No exam selected";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Practice</h1>
          <p className="mt-2 text-slate-600">
            Questions match your selected exam. Switch sections below.
          </p>
        </div>
        <p className="shrink-0 rounded-lg bg-brand-soft px-3 py-2 text-sm font-semibold text-brand">
          {examLabel}
        </p>
      </div>
      {!selectedExam ? (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          No exam selected in your profile. Showing IELTS-style practice.{" "}
          <Link href="/exams" className="font-semibold underline">
            Choose your exam
          </Link>{" "}
          to load PTE, TOEFL, or GRE sets.
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-2">
        {PRACTICE_SECTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setSection(s);
              setAnswers({});
            }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              section === s
                ? "bg-brand text-white shadow"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="mt-8 space-y-8">
        {questions.map((q, idx) => (
          <article
            key={q.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">
              {section} · Question {idx + 1}
            </p>
            <p className="mt-3 whitespace-pre-line text-base font-medium text-slate-900">
              {q.prompt}
            </p>
            <ul className="mt-4 space-y-2">
              {q.options.map((opt, i) => {
                const selected = answers[q.id] === i;
                return (
                  <li key={`${q.id}-${i}`}>
                    <label
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition ${
                        selected
                          ? "border-brand bg-brand-soft"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        className="mt-1"
                        checked={selected}
                        onChange={() =>
                          setAnswers((prev) => ({ ...prev, [q.id]: i }))
                        }
                      />
                      <span className="text-slate-700">{opt}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-sm text-slate-600">
          Loading practice…
        </div>
      }
    >
      <PracticeContent />
    </Suspense>
  );
}

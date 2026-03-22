"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ExamId } from "@/context/exam-context";
import { useExam } from "@/context/exam-context";
import { ExamRecommendationQuiz } from "@/components/exams/ExamRecommendationQuiz";
import { EXAMS } from "@/lib/data";

export default function ExamsPage() {
  const { selectedExam, setSelectedExam } = useExam();
  const [local, setLocal] = useState<ExamId | null>(selectedExam);
  const router = useRouter();

  useEffect(() => {
    if (selectedExam) setLocal(selectedExam);
  }, [selectedExam]);

  const active = local ?? selectedExam;

  function handleContinue() {
    if (!active) return;
    setSelectedExam(active);
    router.push("/pricing");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-lg font-bold text-[#0c2d5e]">
            Cognitive Sanctuary
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-brand"
          >
            Login
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">Choose your exam</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Select the test you are preparing for. You can change this later from
          your dashboard.
        </p>
        <div className="mt-8">
          <ExamRecommendationQuiz afterSelect="stay" />
        </div>
        <div
          id="exam-cards"
          className="mt-10 scroll-mt-24 grid gap-6 sm:grid-cols-2"
        >
          {EXAMS.map((exam) => {
            const isSelected = active === exam.id;
            return (
              <button
                key={exam.id}
                type="button"
                onClick={() => {
                  setLocal(exam.id);
                  setSelectedExam(exam.id);
                }}
                className={`rounded-2xl border-2 bg-white p-6 text-left shadow-sm transition hover:shadow-md ${
                  isSelected
                    ? "border-brand ring-4 ring-brand/15"
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-lg font-bold text-white">
                    {exam.title.slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {exam.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {exam.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            disabled={!active}
            onClick={handleContinue}
            className="inline-flex h-12 items-center justify-center rounded-lg bg-brand px-8 text-sm font-semibold text-white shadow-md transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue to pricing
          </button>
          <Link
            href="/dashboard"
            className="text-center text-sm font-medium text-slate-600 hover:text-brand sm:text-left"
          >
            Skip to dashboard (demo)
          </Link>
        </div>
      </main>
    </div>
  );
}

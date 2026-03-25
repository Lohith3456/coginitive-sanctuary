"use client";

import { useState } from "react";
import { LESSON_PLANS, type Lesson, type LessonStatus } from "@/lib/class-sessions";

function StatusDot({ status }: { status: LessonStatus }) {
  if (status === "completed")
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500">
        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  if (status === "active")
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#1D63D1] bg-white">
        <span className="h-2.5 w-2.5 rounded-full bg-[#1D63D1]" />
      </span>
    );
  return <span className="h-5 w-5 shrink-0 rounded-full border-2 border-slate-300 bg-white" />;
}

function LessonCard({ lesson, subTab, setSubTab }: {
  lesson: Lesson;
  subTab: "video" | "practice";
  setSubTab: (t: "video" | "practice") => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900">{lesson.title}</h2>
      <p className="mt-1 text-sm text-slate-500">{lesson.description}</p>

      {/* Sub-tabs */}
      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={() => setSubTab("video")}
          className={`rounded-xl border px-5 py-2 text-sm font-semibold transition ${
            subTab === "video"
              ? "border-slate-900 bg-white text-slate-900 shadow-sm"
              : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
          }`}
        >
          Video Lesson ({lesson.videoCount})
        </button>
        <button
          type="button"
          onClick={() => setSubTab("practice")}
          className={`rounded-xl border px-5 py-2 text-sm font-semibold transition ${
            subTab === "practice"
              ? "border-slate-900 bg-white text-slate-900 shadow-sm"
              : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
          }`}
        >
          Practice Exercises ({lesson.practiceCount})
        </button>
      </div>

      {/* Card */}
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
            <span className="text-sm font-semibold text-slate-800">{lesson.title}</span>
          </div>
          {lesson.status === "completed" && (
            <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600 ring-1 ring-green-200">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              COMPLETED
            </span>
          )}
          {lesson.status === "active" && (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#1D63D1] ring-1 ring-blue-200">
              IN PROGRESS
            </span>
          )}
        </div>

        <p className="mt-1 text-xs text-slate-400">
          {lesson.durationMin} min · by {lesson.instructor}
        </p>

        {/* Video thumbnail */}
        <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#3a3a5c] via-[#4a4a7a] to-[#5a5a9a]">
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              aria-label="Play"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1D63D1] shadow-lg transition hover:scale-105"
            >
              <svg className="ml-1 h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
          {/* Decorative label */}
          <div className="absolute bottom-4 left-4">
            <p className="text-xs font-semibold text-white/60">IELTS Reading</p>
            <p className="text-lg font-bold text-white">{lesson.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClassesPage() {
  const [planId, setPlanId] = useState(LESSON_PLANS[0].id);
  const [lessonId, setLessonId] = useState<string>(() => {
    const active = LESSON_PLANS[0].lessons.find((l) => l.status === "active");
    return active?.id ?? LESSON_PLANS[0].lessons[0].id;
  });
  const [subTab, setSubTab] = useState<"video" | "practice">("video");

  const plan = LESSON_PLANS.find((p) => p.id === planId) ?? LESSON_PLANS[0];
  const lesson = plan.lessons.find((l) => l.id === lessonId) ?? plan.lessons[0];

  function switchPlan(id: string) {
    setPlanId(id);
    const newPlan = LESSON_PLANS.find((p) => p.id === id)!;
    const active = newPlan.lessons.find((l) => l.status === "active");
    setLessonId(active?.id ?? newPlan.lessons[0].id);
    setSubTab("video");
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-0">
      {/* Top plan tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-0">
        {LESSON_PLANS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => switchPlan(p.id)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold capitalize transition ${
              p.id === planId
                ? "border-[#1D63D1] text-[#1D63D1]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {p.id.charAt(0).toUpperCase() + p.id.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-6 flex gap-6">
        {/* Lesson plan sidebar */}
        <aside className="w-56 shrink-0">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {plan.title}
          </p>
          <ul className="relative mt-4 space-y-0">
            {/* Vertical line */}
            <div className="absolute left-[9px] top-0 h-full w-px bg-slate-200" />
            {plan.lessons.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => { setLessonId(l.id); setSubTab("video"); }}
                  className={`relative flex w-full items-center gap-3 rounded-lg py-2 pl-1 pr-2 text-left text-sm transition ${
                    l.id === lesson.id
                      ? "font-semibold text-[#1D63D1]"
                      : l.status === "completed"
                      ? "text-slate-600 hover:text-slate-900"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <StatusDot status={l.status} />
                  <span className="truncate">{l.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <LessonCard lesson={lesson} subTab={subTab} setSubTab={setSubTab} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "cognitive-sanctuary-exam-date";

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export function ExamDateCard() {
  const [examDate, setExamDateState] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setExamDateState(raw);
    } catch { /* ignore */ }
  }, []);

  const save = (date: string) => {
    setExamDateState(date);
    try { localStorage.setItem(STORAGE_KEY, date); } catch { /* ignore */ }
  };

  const clear = () => {
    setExamDateState(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

  const daysLeft = examDate ? daysUntil(examDate) : null;

  // Editing state — card expands to show date input
  if (editing) {
    return (
      <div className="flex min-h-[100px] min-w-[140px] flex-1 flex-col justify-center rounded-2xl bg-slate-100/90 px-5 py-4 shadow-sm ring-1 ring-slate-200/60 sm:flex-initial sm:min-w-[200px]">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Exam date
        </p>
        <input
          type="date"
          min={todayStr()}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 outline-none focus:border-[#1D63D1] focus:ring-2 focus:ring-[#1D63D1]/20"
        />
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            disabled={!draft}
            onClick={() => { save(draft); setEditing(false); }}
            className="flex-1 rounded-lg bg-[#1D63D1] py-1 text-xs font-bold text-white transition hover:brightness-110 disabled:opacity-40"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Date is set — show countdown
  if (examDate && daysLeft !== null) {
    const isPast = daysLeft < 0;
    const isToday = daysLeft === 0;

    return (
      <div className="flex min-h-[100px] min-w-[140px] flex-1 flex-col justify-center rounded-2xl bg-slate-100/90 px-5 py-4 shadow-sm ring-1 ring-slate-200/60 sm:flex-initial sm:min-w-[160px]">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Exam date
        </p>
        {isPast ? (
          <p className="mt-1 text-sm font-bold text-slate-400">Passed</p>
        ) : isToday ? (
          <p className="mt-1 text-sm font-bold text-emerald-600">Today!</p>
        ) : (
          <>
            <p className="mt-1 text-3xl font-extrabold tabular-nums text-[#F59E0B]">
              {daysLeft}
            </p>
            <p className="text-[10px] font-semibold text-slate-500">days left</p>
          </>
        )}
        <p className="mt-1 text-[10px] text-slate-400">
          {new Date(examDate + "T00:00:00").toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          })}
        </p>
        <button
          type="button"
          onClick={() => { setDraft(examDate); setEditing(true); }}
          className="mt-2 text-left text-[10px] font-semibold text-[#1D63D1] hover:underline"
        >
          Change
        </button>
      </div>
    );
  }

  // No date set — prompt card
  return (
    <button
      type="button"
      onClick={() => { setDraft(""); setEditing(true); }}
      className="group flex min-h-[100px] min-w-[140px] flex-1 flex-col justify-center rounded-2xl bg-slate-100/90 px-5 py-4 shadow-sm ring-1 ring-slate-200/60 transition hover:ring-[#1D63D1]/40 sm:flex-initial sm:min-w-[160px]"
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
        Exam date
      </p>
      <p className="mt-1 text-3xl font-extrabold tabular-nums text-slate-300">—</p>
      <p className="mt-1 text-[10px] font-semibold text-[#1D63D1] group-hover:underline">
        Set date →
      </p>
    </button>
  );
}

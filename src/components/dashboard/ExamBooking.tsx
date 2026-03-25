"use client";

import { useState } from "react";
import type { ExamId } from "@/context/exam-context";

type BookingStep = "idle" | "form" | "confirmed";

type Booking = {
  exam: ExamId;
  center: string;
  date: string;
  session: string;
};

const EXAM_OPTIONS: { id: ExamId; label: string; color: string }[] = [
  { id: "IELTS", label: "IELTS Academic", color: "bg-blue-50 text-blue-700 ring-blue-200" },
  { id: "PTE", label: "PTE Academic", color: "bg-violet-50 text-violet-700 ring-violet-200" },
  { id: "TOEFL", label: "TOEFL iBT", color: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  { id: "GRE", label: "GRE General", color: "bg-amber-50 text-amber-700 ring-amber-200" },
];

const TEST_CENTERS: Record<ExamId, string[]> = {
  IELTS: ["British Council – Mumbai", "IDP – Delhi", "British Council – Bangalore", "IDP – Chennai"],
  PTE: ["Pearson VUE – Mumbai", "Pearson VUE – Hyderabad", "Pearson VUE – Pune", "Pearson VUE – Delhi"],
  TOEFL: ["ETS Center – Mumbai", "ETS Center – Bangalore", "ETS Center – Delhi", "ETS Center – Kolkata"],
  GRE: ["Prometric – Mumbai", "Prometric – Delhi", "Prometric – Bangalore", "Prometric – Chennai"],
};

const SESSIONS = ["Morning (09:00)", "Afternoon (13:00)", "Evening (16:00)"];

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export function ExamBooking({ exam: lockedExam }: { exam?: ExamId | null }) {
  const [step, setStep] = useState<BookingStep>("idle");
  const [booking, setBooking] = useState<Partial<Booking>>({});
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  const lockedOption = lockedExam ? EXAM_OPTIONS.find((e) => e.id === lockedExam) : null;

  // When opening the form, pre-fill the locked exam
  const openForm = () => {
    setBooking(lockedExam ? { exam: lockedExam } : {});
    setStep("form");
  };

  const centers = booking.exam ? TEST_CENTERS[booking.exam] : [];
  const canSubmit = booking.exam && booking.center && booking.date && booking.session;

  const handleConfirm = () => {
    if (!canSubmit) return;
    setConfirmed(booking as Booking);
    setStep("confirmed");
  };

  const reset = () => {
    setBooking({});
    setConfirmed(null);
    setStep("idle");
  };

  if (step === "confirmed" && confirmed) {
    const examLabel = EXAM_OPTIONS.find((e) => e.id === confirmed.exam)?.label ?? confirmed.exam;
    const dateFormatted = new Date(confirmed.date + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric",
    });

    return (
      <section className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-900">Booking confirmed</h2>
            <p className="mt-1 text-sm text-slate-600">
              Your {examLabel} exam has been booked. Check your email for the confirmation.
            </p>
            <div className="mt-4 grid gap-2 rounded-xl bg-white p-4 ring-1 ring-emerald-200/60 sm:grid-cols-2">
              <Detail label="Exam" value={examLabel} />
              <Detail label="Test center" value={confirmed.center} />
              <Detail label="Date" value={dateFormatted} />
              <Detail label="Session" value={confirmed.session} />
            </div>
            <button
              type="button"
              onClick={reset}
              className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Book another exam
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (step === "form") {
    return (
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900">Book your exam</h2>
          <button
            type="button"
            onClick={() => setStep("idle")}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Step 1 — Pick exam (hidden when locked to a specific exam) */}
          {lockedExam ? (
            <div className="flex items-center gap-3">
              <span className={`rounded-xl px-4 py-2 text-sm font-bold ring-2 ${lockedOption?.color}`}>
                {lockedOption?.label}
              </span>
              <span className="text-xs text-slate-400">Exam pre-selected from your dashboard</span>
            </div>
          ) : (
            <div>
              <p className="mb-3 text-sm font-semibold text-slate-700">Select exam</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {EXAM_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setBooking((b) => ({ ...b, exam: opt.id, center: undefined }))}
                    className={`rounded-xl px-3 py-3 text-sm font-bold ring-1 transition ${
                      booking.exam === opt.id
                        ? opt.color + " ring-2"
                        : "bg-slate-50 text-slate-600 ring-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Test center */}
          {booking.exam && (
            <div>
              <p className="mb-3 text-sm font-semibold text-slate-700">Test center</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {centers.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setBooking((b) => ({ ...b, center: c }))}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      booking.center === c
                        ? "border-[#1D63D1] bg-[#E8F1FC] text-[#1D63D1]"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Date & session */}
          {booking.center && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Preferred date
                </label>
                <input
                  type="date"
                  min={todayStr()}
                  value={booking.date ?? ""}
                  onChange={(e) => setBooking((b) => ({ ...b, date: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-[#1D63D1] focus:ring-2 focus:ring-[#1D63D1]/20"
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">Session</p>
                <div className="flex flex-col gap-2">
                  {SESSIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setBooking((b) => ({ ...b, session: s }))}
                      className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                        booking.session === s
                          ? "border-[#1D63D1] bg-[#E8F1FC] text-[#1D63D1]"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleConfirm}
            className="rounded-xl bg-[#1D63D1] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110 disabled:opacity-40"
          >
            Confirm booking
          </button>
          <button
            type="button"
            onClick={() => setStep("idle")}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </section>
    );
  }

  // Idle — CTA card
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8F1FC] text-[#1D63D1]">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {lockedOption ? `Book your ${lockedOption.label} exam` : "Book your exam"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {lockedOption
                ? `Reserve a seat at an official ${lockedOption.label} test center.`
                : "Reserve a seat at an official test center for IELTS, PTE, TOEFL, or GRE."}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={openForm}
          className="shrink-0 rounded-xl bg-[#1D63D1] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110"
        >
          Book now
        </button>
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

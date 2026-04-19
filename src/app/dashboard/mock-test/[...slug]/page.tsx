"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

const MOCK_SESSIONS: Record<string, {
  title: string; session: string; duration: string;
  instructor: string; about: string;
}[]> = {
  "ielts/full": [
    { title: "Full IELTS Academic Mock — Test 1", session: "Mock 1 · Full simulation", duration: "2 HR 45 MIN", instructor: "Dr. A. Menon", about: "Complete IELTS Academic simulation: Reading (60 min), Listening (30 min), Writing (60 min), Speaking (15 min)." },
    { title: "Full IELTS Academic Mock — Test 2", session: "Mock 2 · Full simulation", duration: "2 HR 45 MIN", instructor: "Dr. A. Menon", about: "Second full-length mock with new passages and tasks. Timed under real exam conditions." },
  ],
  "ielts/reading": [
    { title: "IELTS Reading Mock — Passages 1–3", session: "Mock 1 · Reading", duration: "60 MIN", instructor: "Dr. A. Menon", about: "Three academic passages with 40 questions. Timed at 60 minutes." },
    { title: "IELTS Reading Mock — Passages 4–6", session: "Mock 2 · Reading", duration: "60 MIN", instructor: "Dr. A. Menon", about: "Second reading mock with different question types including matching headings and sentence completion." },
  ],
  "ielts/writing": [
    { title: "IELTS Writing Mock — Task 1 + Task 2", session: "Mock 1 · Writing", duration: "60 MIN", instructor: "Dr. S. Rao", about: "Full writing mock: Task 1 graph description (20 min) + Task 2 essay (40 min)." },
  ],
  "ielts/listening": [
    { title: "IELTS Listening Mock — Sections 1–4", session: "Mock 1 · Listening", duration: "30 MIN", instructor: "Dr. K. Iyer", about: "Full listening mock with four sections and 40 questions." },
  ],
  "ielts/speaking": [
    { title: "IELTS Speaking Mock — Parts 1, 2 & 3", session: "Mock 1 · Speaking", duration: "15 MIN", instructor: "Dr. P. Nair", about: "Simulated speaking test with sample answers and band score breakdown." },
  ],
  "pte/full": [
    { title: "Full PTE Academic Mock — Test 1", session: "Mock 1 · Full simulation", duration: "3 HR", instructor: "Dr. R. Sharma", about: "Complete PTE Academic mock covering all four skills in computer-delivered format." },
  ],
  "pte/speaking": [
    { title: "PTE Speaking Mock — Read Aloud + Describe Image", session: "Mock 1 · Speaking", duration: "45 MIN", instructor: "Dr. R. Sharma", about: "Timed speaking mock with all PTE speaking task types." },
  ],
  "pte/writing": [
    { title: "PTE Writing Mock — SWT + Essay", session: "Mock 1 · Writing", duration: "40 MIN", instructor: "Dr. R. Sharma", about: "Summarise Written Text and Essay tasks under timed conditions." },
  ],
  "pte/reading": [
    { title: "PTE Reading Mock", session: "Mock 1 · Reading", duration: "32 MIN", instructor: "Dr. R. Sharma", about: "All PTE reading task types including re-order paragraphs and fill in the blanks." },
  ],
  "pte/listening": [
    { title: "PTE Listening Mock", session: "Mock 1 · Listening", duration: "45 MIN", instructor: "Dr. R. Sharma", about: "Full PTE listening mock with summarise spoken text and highlight correct summary." },
  ],
  "toefl/full": [
    { title: "Full TOEFL iBT Mock — Test 1", session: "Mock 1 · Full simulation", duration: "3 HR", instructor: "Dr. M. Patel", about: "Complete TOEFL iBT simulation across all four sections." },
  ],
  "toefl/reading": [{ title: "TOEFL Reading Mock", session: "Mock 1 · Reading", duration: "54 MIN", instructor: "Dr. M. Patel", about: "Three reading passages with 30 questions under timed conditions." }],
  "toefl/listening": [{ title: "TOEFL Listening Mock", session: "Mock 1 · Listening", duration: "41 MIN", instructor: "Dr. M. Patel", about: "Two conversations and three lectures with comprehension questions." }],
  "toefl/speaking": [{ title: "TOEFL Speaking Mock", session: "Mock 1 · Speaking", duration: "17 MIN", instructor: "Dr. M. Patel", about: "Four speaking tasks including independent and integrated responses." }],
  "toefl/writing": [{ title: "TOEFL Writing Mock", session: "Mock 1 · Writing", duration: "50 MIN", instructor: "Dr. M. Patel", about: "Integrated and independent writing tasks under timed conditions." }],
  "gre/full": [
    { title: "Full GRE General Mock — Test 1", session: "Mock 1 · Full simulation", duration: "3 HR 45 MIN", instructor: "Dr. V. Kumar", about: "Complete GRE General Test simulation: Verbal, Quantitative, and AWA sections." },
  ],
  "gre/verbal": [{ title: "GRE Verbal Mock", session: "Mock 1 · Verbal", duration: "60 MIN", instructor: "Dr. V. Kumar", about: "Two verbal sections with text completion, sentence equivalence, and reading comprehension." }],
  "gre/quantitative": [{ title: "GRE Quantitative Mock", session: "Mock 1 · Quant", duration: "70 MIN", instructor: "Dr. V. Kumar", about: "Two quantitative sections with arithmetic, algebra, geometry, and data analysis." }],
  "gre/awa": [{ title: "GRE AWA Mock", session: "Mock 1 · AWA", duration: "60 MIN", instructor: "Dr. V. Kumar", about: "Analyse an Issue and Analyse an Argument essays under timed conditions." }],
};

export default function MockTestModulePage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug.join("/") : params.slug ?? "";
  const sessions = MOCK_SESSIONS[slug] ?? [];
  const [activeIdx, setActiveIdx] = useState(0);
  const [playing, setPlaying] = useState(false);

  const active = sessions[activeIdx];

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg className="h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
        </svg>
        <p className="text-slate-500 font-medium">No mock tests available yet for this module.</p>
        <p className="text-sm text-slate-400 mt-1">Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6 min-h-[600px]">
      {/* Left — session timeline */}
      <aside className="w-64 shrink-0 space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Your Mock Tests</p>
        {sessions.map((s, i) => {
          const isActive = i === activeIdx;
          return (
            <button
              key={i}
              type="button"
              onClick={() => { setActiveIdx(i); setPlaying(false); }}
              className={`w-full rounded-xl border-2 p-4 text-left transition ${
                isActive ? "border-[#1D63D1] bg-white shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <p className={`text-sm font-semibold leading-snug ${isActive ? "text-slate-900" : "text-slate-700"}`}>{s.title}</p>
              <p className="mt-1 text-xs text-slate-400">{s.session}</p>
              <p className={`mt-2 text-[10px] font-bold uppercase tracking-wide ${isActive ? "text-[#1D63D1]" : "text-slate-400"}`}>{s.duration}</p>
            </button>
          );
        })}
      </aside>

      {/* Right — video + info */}
      <div className="flex-1 space-y-4">
        <div
          className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#0c1a2e] to-[#1D3557] overflow-hidden"
          style={{ aspectRatio: "16/9" }}
        >
          {!playing ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition hover:scale-105 hover:bg-white"
              >
                <svg className="h-7 w-7 text-[#1D63D1] ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-300">Mock Test Recording</p>
                <p className="mt-1 text-lg font-bold text-white">{active.title}</p>
                <p className="text-sm text-slate-400">{active.instructor} · {active.duration}</p>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                <svg className="h-8 w-8 text-white animate-pulse" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                </svg>
              </div>
              <p className="text-white font-semibold">Playing: {active.title}</p>
              <button type="button" onClick={() => setPlaying(false)} className="text-xs text-slate-300 hover:text-white underline">Stop</button>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">About this mock test</h2>
          <p className="mt-2 text-sm text-slate-600">{active.about}</p>
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-[#1D63D1]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              {active.instructor}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-[#1D63D1]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {active.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-[#1D63D1]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
              </svg>
              {active.session}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

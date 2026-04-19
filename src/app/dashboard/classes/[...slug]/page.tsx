"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

// Static session data per module
const MODULE_SESSIONS: Record<string, {
  title: string;
  session: string;
  duration: string;
  instructor: string;
  about: string;
  videoLabel: string;
}[]> = {
  // IELTS
  "ielts/reading": [
    { title: "Reading strategies — skimming & scanning", session: "Session 3 · Foundation track", duration: "52 MIN TOTAL", instructor: "Dr. A. Menon", about: "Recorded live session: walkthrough of two academic passages with timed drills.", videoLabel: "Session recording" },
    { title: "True / False / Not Given mastery", session: "Session 4 · Foundation track", duration: "45 MIN TOTAL", instructor: "Dr. A. Menon", about: "Deep dive into the most commonly misunderstood question type in IELTS Reading.", videoLabel: "Session recording" },
    { title: "Matching headings & features", session: "Session 6 · Advanced track", duration: "50 MIN TOTAL", instructor: "Dr. A. Menon", about: "Strategies for matching headings quickly under exam conditions.", videoLabel: "Session recording" },
  ],
  "ielts/writing": [
    { title: "Writing Task 2 — argument structure", session: "Session 5 · Writing intensive", duration: "48 MIN TOTAL", instructor: "Dr. S. Rao", about: "How to build a coherent argument in 40 minutes with band 8+ vocabulary.", videoLabel: "Session recording" },
    { title: "Task 1 — describing graphs & charts", session: "Session 2 · Writing intensive", duration: "40 MIN TOTAL", instructor: "Dr. S. Rao", about: "Techniques for summarising visual data accurately and concisely.", videoLabel: "Session recording" },
    { title: "Cohesion & coherence in writing", session: "Session 7 · Writing intensive", duration: "38 MIN TOTAL", instructor: "Dr. S. Rao", about: "Using linking words and paragraph structure to score higher on coherence.", videoLabel: "Session recording" },
  ],
  "ielts/listening": [
    { title: "Listening — lecture signposting", session: "Session 2 · Listening lab", duration: "45 MIN TOTAL", instructor: "Dr. K. Iyer", about: "Identifying signpost language to predict answers in Section 4.", videoLabel: "Session recording" },
    { title: "Form completion strategies", session: "Session 1 · Listening lab", duration: "35 MIN TOTAL", instructor: "Dr. K. Iyer", about: "How to read ahead and anticipate answers in Sections 1 & 2.", videoLabel: "Session recording" },
  ],
  "ielts/speaking": [
    { title: "Part 2 — cue card fluency", session: "Session 1 · Speaking clinic", duration: "42 MIN TOTAL", instructor: "Dr. P. Nair", about: "How to speak for 2 minutes without hesitation using the IDEA framework.", videoLabel: "Session recording" },
    { title: "Part 3 — abstract discussion", session: "Session 3 · Speaking clinic", duration: "38 MIN TOTAL", instructor: "Dr. P. Nair", about: "Techniques for giving extended, nuanced answers to abstract questions.", videoLabel: "Session recording" },
  ],
  // PTE
  "pte/speaking": [
    { title: "Read Aloud — pronunciation tips", session: "Session 1 · Speaking module", duration: "40 MIN TOTAL", instructor: "Dr. R. Sharma", about: "Mastering pronunciation and fluency for the Read Aloud task.", videoLabel: "Session recording" },
    { title: "Describe Image — structure", session: "Session 2 · Speaking module", duration: "35 MIN TOTAL", instructor: "Dr. R. Sharma", about: "A repeatable template for describing any image in 40 seconds.", videoLabel: "Session recording" },
  ],
  "pte/writing": [
    { title: "Summarise Written Text", session: "Session 1 · Writing module", duration: "38 MIN TOTAL", instructor: "Dr. R. Sharma", about: "How to condense a passage into one sentence under 75 words.", videoLabel: "Session recording" },
    { title: "Essay — opinion structure", session: "Session 2 · Writing module", duration: "44 MIN TOTAL", instructor: "Dr. R. Sharma", about: "Building a high-scoring PTE essay in 20 minutes.", videoLabel: "Session recording" },
  ],
  "pte/reading": [
    { title: "Re-order paragraphs", session: "Session 1 · Reading module", duration: "36 MIN TOTAL", instructor: "Dr. R. Sharma", about: "Logical sequencing strategies for the re-order task.", videoLabel: "Session recording" },
  ],
  "pte/listening": [
    { title: "Summarise Spoken Text", session: "Session 1 · Listening module", duration: "40 MIN TOTAL", instructor: "Dr. R. Sharma", about: "Note-taking and summarising spoken content effectively.", videoLabel: "Session recording" },
  ],
  "pte/vocabulary": [
    { title: "High-frequency PTE word list", session: "Session 1 · Vocabulary", duration: "30 MIN TOTAL", instructor: "Dr. R. Sharma", about: "The 200 most tested words in PTE with usage examples.", videoLabel: "Session recording" },
  ],
  // TOEFL
  "toefl/reading": [
    { title: "Prose summary questions", session: "Session 1 · Reading", duration: "45 MIN TOTAL", instructor: "Dr. M. Patel", about: "How to identify main ideas and eliminate distractors.", videoLabel: "Session recording" },
  ],
  "toefl/listening": [
    { title: "Lecture note-taking", session: "Session 1 · Listening", duration: "42 MIN TOTAL", instructor: "Dr. M. Patel", about: "Efficient note-taking strategies for TOEFL lectures.", videoLabel: "Session recording" },
  ],
  "toefl/speaking": [
    { title: "Integrated speaking tasks", session: "Session 1 · Speaking", duration: "38 MIN TOTAL", instructor: "Dr. M. Patel", about: "How to synthesise reading and listening for Tasks 3 & 4.", videoLabel: "Session recording" },
  ],
  "toefl/writing": [
    { title: "Integrated essay", session: "Session 1 · Writing", duration: "40 MIN TOTAL", instructor: "Dr. M. Patel", about: "Structuring the integrated essay to score 24+.", videoLabel: "Session recording" },
  ],
  // GRE
  "gre/verbal": [
    { title: "Text completion strategies", session: "Session 1 · Verbal", duration: "44 MIN TOTAL", instructor: "Dr. V. Kumar", about: "Tackling 1, 2, and 3-blank text completion questions.", videoLabel: "Session recording" },
  ],
  "gre/quantitative": [
    { title: "Quantitative comparison tips", session: "Session 1 · Quant", duration: "50 MIN TOTAL", instructor: "Dr. V. Kumar", about: "Eliminating answer choices quickly in QC questions.", videoLabel: "Session recording" },
  ],
  "gre/analytical-writing": [
    { title: "Analyse an Issue — structure", session: "Session 1 · AWA", duration: "46 MIN TOTAL", instructor: "Dr. V. Kumar", about: "A proven template for scoring 5+ on the Issue essay.", videoLabel: "Session recording" },
  ],
  "gre/vocabulary": [
    { title: "GRE high-frequency words", session: "Session 1 · Vocabulary", duration: "35 MIN TOTAL", instructor: "Dr. V. Kumar", about: "The 300 most tested GRE words with mnemonics.", videoLabel: "Session recording" },
  ],
};

export default function ClassModulePage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug.join("/") : params.slug ?? "";
  const sessions = MODULE_SESSIONS[slug] ?? [];
  const [activeIdx, setActiveIdx] = useState(0);
  const [playing, setPlaying] = useState(false);

  const active = sessions[activeIdx];
  const moduleTitle = slug.split("/").map((s) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ")).join(" — ");

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg className="h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <p className="text-slate-500 font-medium">No sessions available yet for this module.</p>
        <p className="text-sm text-slate-400 mt-1">Check back soon — content is being added.</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-full min-h-[600px]">
      {/* Left — session timeline */}
      <aside className="w-64 shrink-0 space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Your Sessions</p>
        {sessions.map((s, i) => {
          const isActive = i === activeIdx;
          return (
            <button
              key={i}
              type="button"
              onClick={() => { setActiveIdx(i); setPlaying(false); }}
              className={`w-full rounded-xl border-2 p-4 text-left transition ${
                isActive
                  ? "border-[#1D63D1] bg-white shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <p className={`text-sm font-semibold leading-snug ${isActive ? "text-slate-900" : "text-slate-700"}`}>
                {s.title}
              </p>
              <p className="mt-1 text-xs text-slate-400">{s.session}</p>
              <p className={`mt-2 text-[10px] font-bold uppercase tracking-wide ${isActive ? "text-[#1D63D1]" : "text-slate-400"}`}>
                {s.duration}
              </p>
            </button>
          );
        })}
      </aside>

      {/* Right — video player + info */}
      <div className="flex-1 space-y-4">
        {/* Video player */}
        <div
          className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#0c1a2e] to-[#1D3557] overflow-hidden"
          style={{ aspectRatio: "16/9" }}
        >
          {!playing ? (
            <>
              {/* Overlay */}
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
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-300">{active.videoLabel}</p>
                  <p className="mt-1 text-lg font-bold text-white">{active.title}</p>
                  <p className="text-sm text-slate-400">{active.instructor} · Static demo (no real video file)</p>
                </div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                <svg className="h-8 w-8 text-white animate-pulse" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                </svg>
              </div>
              <p className="text-white font-semibold">Playing: {active.title}</p>
              <button type="button" onClick={() => setPlaying(false)} className="text-xs text-slate-300 hover:text-white underline">
                Stop
              </button>
            </div>
          )}
        </div>

        {/* About */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">About this class</h2>
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

"use client";

import { useMemo, useState } from "react";
import { CLASS_SESSIONS } from "@/lib/class-sessions";

export default function ClassesPage() {
  const [activeId, setActiveId] = useState(CLASS_SESSIONS[0]?.id ?? "");
  const session = useMemo(
    () => CLASS_SESSIONS.find((c) => c.id === activeId) ?? CLASS_SESSIONS[0],
    [activeId],
  );

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl text-slate-600">
        No class sessions configured.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
        Video classes
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Watch session recordings for each class. Playback is a static demo until
        real media is connected.
      </p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
        <aside className="w-full shrink-0 lg:w-72">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Your sessions
          </p>
          <ul className="mt-3 space-y-2">
            {CLASS_SESSIONS.map((c) => {
              const selected = c.id === session.id;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(c.id)}
                    className={`flex w-full flex-col rounded-xl border-2 px-4 py-3 text-left transition ${
                      selected
                        ? "border-[#1D63D1] bg-white shadow-md ring-2 ring-[#1D63D1]/15"
                        : "border-transparent bg-white/80 ring-1 ring-slate-200 hover:bg-white hover:ring-slate-300"
                    }`}
                  >
                    <span className="text-sm font-bold text-slate-900">
                      {c.title}
                    </span>
                    <span className="mt-1 text-xs text-slate-500">
                      {c.subtitle}
                    </span>
                    <span className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-[#1D63D1]">
                      {c.totalDurationMin} min total
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="min-w-0 flex-1">
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
            <div className="aspect-video w-full bg-gradient-to-br from-slate-800 via-slate-900 to-[#0c2d5e]">
              <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                <button
                  type="button"
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-[#1D63D1] shadow-lg transition hover:scale-105"
                  aria-label="Play video (demo)"
                >
                  <svg
                    className="ml-1 h-8 w-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <div>
                  <p className="text-sm font-semibold text-white/90">
                    Session recording
                  </p>
                  <p className="mt-1 text-lg font-bold text-white">
                    {session.title}
                  </p>
                  <p className="mt-2 text-xs text-white/70">
                    {session.instructor} · Static demo (no real video file)
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-100 p-5 sm:p-6">
              <h2 className="text-base font-bold text-slate-900">
                About this class
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {session.videoDescription}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

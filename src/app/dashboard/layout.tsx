"use client";

import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopNav } from "@/components/dashboard/DashboardTopNav";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFB]">
      <DashboardTopNav />
      <div className="relative flex flex-1 min-h-0 items-stretch">
        {menuOpen ? (
          <button
            type="button"
            className="fixed left-0 right-0 top-16 z-40 bottom-0 bg-slate-900/40 lg:hidden"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
        ) : null}
        <aside
          className={`fixed left-0 top-16 z-50 h-[calc(100dvh-4rem)] w-[min(280px,88vw)] -translate-x-full overflow-y-auto border-r border-slate-200/90 bg-[#F3F4F6] shadow-xl transition-transform duration-200 lg:sticky lg:top-16 lg:z-0 lg:h-[calc(100dvh-4rem)] lg:w-[260px] lg:shrink-0 lg:translate-x-0 lg:shadow-none lg:overflow-y-auto ${
            menuOpen ? "translate-x-0" : ""
          }`}
        >
          <div className="flex h-12 items-center justify-end border-b border-slate-200/80 px-3 lg:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg p-2 text-slate-600 hover:bg-white/70"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>
          <DashboardSidebar onNavigate={() => setMenuOpen(false)} />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-16 z-20 flex items-center gap-3 border-b border-slate-200/80 bg-[#F9FAFB]/95 px-4 py-2 backdrop-blur lg:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-200/60"
              aria-label="Open sidebar"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <span className="text-sm font-semibold text-slate-700">
              Study menu
            </span>
          </div>
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-[1200px]">{children}</div>
          </main>
        </div>
      </div>
      <DashboardFooter />
    </div>
  );
}

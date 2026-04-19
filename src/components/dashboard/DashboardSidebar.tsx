"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useExam } from "@/context/exam-context";
import { useAuth } from "@/context/AuthContext";
import type { ExamId } from "@/context/exam-context";

function examPrepLabel(exam: ExamId | null) {
  if (!exam) return "Select your exam";
  if (exam === "IELTS") return "IELTS Preparation";
  return `${exam} Preparation`;
}

const EXAM_MODULES: Record<ExamId, { label: string; href: string }[]> = {
  IELTS: [
    { label: "Reading", href: "/dashboard/classes/ielts/reading" },
    { label: "Writing", href: "/dashboard/classes/ielts/writing" },
    { label: "Listening", href: "/dashboard/classes/ielts/listening" },
    { label: "Speaking", href: "/dashboard/classes/ielts/speaking" },
  ],
  PTE: [
    { label: "Speaking", href: "/dashboard/classes/pte/speaking" },
    { label: "Writing", href: "/dashboard/classes/pte/writing" },
    { label: "Reading", href: "/dashboard/classes/pte/reading" },
    { label: "Listening", href: "/dashboard/classes/pte/listening" },
    { label: "Vocabulary", href: "/dashboard/classes/pte/vocabulary" },
  ],
  TOEFL: [
    { label: "Reading", href: "/dashboard/classes/toefl/reading" },
    { label: "Listening", href: "/dashboard/classes/toefl/listening" },
    { label: "Speaking", href: "/dashboard/classes/toefl/speaking" },
    { label: "Writing", href: "/dashboard/classes/toefl/writing" },
  ],
  GRE: [
    { label: "Verbal Reasoning", href: "/dashboard/classes/gre/verbal" },
    { label: "Quantitative", href: "/dashboard/classes/gre/quantitative" },
    { label: "Analytical Writing", href: "/dashboard/classes/gre/analytical-writing" },
    { label: "Vocabulary", href: "/dashboard/classes/gre/vocabulary" },
  ],
};

const MOCK_MODULES: Record<ExamId, { label: string; href: string }[]> = {
  IELTS: [
    { label: "Full Mock Test", href: "/dashboard/mock-test/ielts/full" },
    { label: "Reading Mock", href: "/dashboard/mock-test/ielts/reading" },
    { label: "Writing Mock", href: "/dashboard/mock-test/ielts/writing" },
    { label: "Listening Mock", href: "/dashboard/mock-test/ielts/listening" },
    { label: "Speaking Mock", href: "/dashboard/mock-test/ielts/speaking" },
  ],
  PTE: [
    { label: "Full Mock Test", href: "/dashboard/mock-test/pte/full" },
    { label: "Speaking Mock", href: "/dashboard/mock-test/pte/speaking" },
    { label: "Writing Mock", href: "/dashboard/mock-test/pte/writing" },
    { label: "Reading Mock", href: "/dashboard/mock-test/pte/reading" },
    { label: "Listening Mock", href: "/dashboard/mock-test/pte/listening" },
  ],
  TOEFL: [
    { label: "Full Mock Test", href: "/dashboard/mock-test/toefl/full" },
    { label: "Reading Mock", href: "/dashboard/mock-test/toefl/reading" },
    { label: "Listening Mock", href: "/dashboard/mock-test/toefl/listening" },
    { label: "Speaking Mock", href: "/dashboard/mock-test/toefl/speaking" },
    { label: "Writing Mock", href: "/dashboard/mock-test/toefl/writing" },
  ],
  GRE: [
    { label: "Full Mock Test", href: "/dashboard/mock-test/gre/full" },
    { label: "Verbal Mock", href: "/dashboard/mock-test/gre/verbal" },
    { label: "Quantitative Mock", href: "/dashboard/mock-test/gre/quantitative" },
    { label: "AWA Mock", href: "/dashboard/mock-test/gre/awa" },
  ],
};

const otherItems = [
  {
    href: "/dashboard/practice",
    label: "Practice",
    match: (p: string) => p === "/dashboard" || p.startsWith("/dashboard/practice"),
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    href: "/dashboard/results",
    label: "Results",
    match: (p: string) => p.startsWith("/dashboard/results"),
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
  },
];

export function DashboardSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { selectedExam } = useExam();
  const { user } = useAuth();
  const classModules = selectedExam ? EXAM_MODULES[selectedExam] : null;
  const mockModules = selectedExam ? MOCK_MODULES[selectedExam] : null;
  const classesActive = pathname.startsWith("/dashboard/classes");
  const mockActive = pathname.startsWith("/dashboard/mock-test");
  const [classesOpen, setClassesOpen] = useState(classesActive);
  const [mockOpen, setMockOpen] = useState(mockActive);

  const displayName = user?.email?.split("@")[0] ?? "Scholar";
  const planLabel = selectedExam ? `${selectedExam} Preparation` : "Premium Tier";

  function DropdownNav({
    label, icon, isActive, isOpen, onToggle, modules, noModuleHref,
  }: {
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    isOpen: boolean;
    onToggle: () => void;
    modules: { label: string; href: string }[] | null;
    noModuleHref: string;
  }) {
    return (
      <div>
        <button
          type="button"
          onClick={onToggle}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
            isActive
              ? "bg-white text-[#1D63D1] shadow-sm ring-1 ring-slate-200/80"
              : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
          }`}
        >
          <span className={isActive ? "text-[#1D63D1]" : "text-slate-400"}>{icon}</span>
          <span className="flex-1 text-left">{label}</span>
          <svg
            className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className="ml-8 mt-1 space-y-0.5">
            {modules ? (
              modules.map((mod) => {
                const active = pathname === mod.href;
                return (
                  <Link
                    key={mod.href}
                    href={mod.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                      active
                        ? "bg-[#EEF3FB] font-semibold text-[#1D63D1]"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                    {mod.label}
                  </Link>
                );
              })
            ) : (
              <p className="px-3 py-2 text-xs text-slate-400">
                <Link href={noModuleHref} className="text-[#1D63D1] hover:underline">Select an exam</Link> to see modules.
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* User profile header */}
      <div className="border-b border-slate-200/80 px-4 py-4 lg:px-5">
        <p className="text-sm font-extrabold text-slate-900">{displayName}</p>
        <p className="mt-0.5 text-xs text-slate-500">{planLabel}</p>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3 lg:p-4">
        {/* Static items */}
        {[
          { href: "/dashboard", label: "Home", exact: true, icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          )},
          { href: "/dashboard/practice", label: "My Learning", exact: false, icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          )},
          { href: "/dashboard/results", label: "Resources", exact: false, icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
          )},
          { href: "/dashboard/profile", label: "Analytics", exact: false, icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          )},
        ].map(({ href, label, exact, icon }) => {
          const active = exact ? pathname === href : pathname.startsWith(href) && href !== "/dashboard";
          const isHome = href === "/dashboard" && pathname === "/dashboard";
          const isActive = isHome || (!exact && pathname.startsWith(href) && href !== "/dashboard");
          const finalActive = exact ? pathname === href : isActive;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                finalActive
                  ? "bg-white text-[#1D63D1] shadow-sm ring-1 ring-slate-200/80"
                  : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
              }`}
            >
              <span className={finalActive ? "text-[#1D63D1]" : "text-slate-400"}>{icon}</span>
              {label}
            </Link>
          );
        })}
        {/* Classes dropdown */}
        <DropdownNav
          label="Classes"
          isActive={classesActive}
          isOpen={classesOpen}
          onToggle={() => setClassesOpen((o) => !o)}
          modules={classModules}
          noModuleHref="/exams"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        {/* Mock Test dropdown */}
        <DropdownNav
          label="Mock Test"
          isActive={mockActive}
          isOpen={mockOpen}
          onToggle={() => setMockOpen((o) => !o)}
          modules={mockModules}
          noModuleHref="/exams"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />

        {/* Other nav items */}
        {otherItems.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-white text-[#1D63D1] shadow-sm ring-1 ring-slate-200/80"
                  : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
              }`}
            >
              <span className={active ? "text-[#1D63D1]" : "text-slate-400"}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

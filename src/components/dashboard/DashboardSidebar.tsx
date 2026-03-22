"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useExam } from "@/context/exam-context";
import type { ExamId } from "@/context/exam-context";

function examPrepLabel(exam: ExamId | null) {
  if (!exam) return "Select your exam";
  if (exam === "IELTS") return "IELTS Preparation";
  return `${exam} Preparation`;
}

const items: {
  href: string;
  label: string;
  icon: React.ReactNode;
  match: (path: string) => boolean;
}[] = [
  {
    href: "/dashboard/classes",
    label: "Classes",
    match: (p) => p.startsWith("/dashboard/classes"),
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/practice",
    label: "Practice",
    match: (p) => p === "/dashboard" || p.startsWith("/dashboard/practice"),
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    href: "/dashboard/mock-test",
    label: "Mock Test",
    match: (p) => p.startsWith("/dashboard/mock-test"),
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/results",
    label: "Results",
    match: (p) => p.startsWith("/dashboard/results"),
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    match: (p) => p.startsWith("/dashboard/profile"),
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export function DashboardSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { selectedExam } = useExam();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start gap-3 border-b border-slate-200/80 px-4 py-5 lg:px-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#1D63D1] shadow-sm ring-1 ring-slate-200/80">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-extrabold text-slate-900">Study Dashboard</p>
          <p className="mt-0.5 text-xs text-slate-500">{examPrepLabel(selectedExam)}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3 lg:p-4">
        {items.map((item) => {
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
      <div className="mt-auto border-t border-slate-200/80 p-4">
        <div className="rounded-2xl bg-[#E8F1FC] p-4 ring-1 ring-[#1D63D1]/10">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#1D63D1]/90">
            Daily goal
          </p>
          <p className="mt-2 text-sm font-medium leading-snug text-slate-800">
            Complete 1 practice section today.
          </p>
          <Link
            href={
              selectedExam
                ? `/dashboard/practice?exam=${encodeURIComponent(selectedExam)}`
                : "/dashboard/practice"
            }
            onClick={onNavigate}
            className="mt-4 flex h-10 w-full items-center justify-center rounded-xl bg-[#1D63D1] text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#174ea6]"
          >
            Start Daily Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}

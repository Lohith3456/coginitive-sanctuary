"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
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
  const router = useRouter();
  const { selectedExam } = useExam();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    router.push("/login");
  };

  return (
    <div className="flex h-full flex-col">
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="flex items-start gap-3 border-b border-slate-200/80 px-4 py-5 transition hover:bg-slate-50/60 lg:px-5"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#1D63D1] shadow-sm ring-1 ring-slate-200/80">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-extrabold text-slate-900">Study Dashboard</p>
          <p className="mt-0.5 text-xs text-slate-500">{examPrepLabel(selectedExam)}</p>
        </div>
      </Link>

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

      {/* User avatar + dropdown */}
      <div className="border-t border-slate-200/80 p-3 lg:p-4" ref={menuRef}>
        <div className="relative">
          {menuOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-48 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-lg ring-1 ring-slate-900/5">
              <Link
                href="/dashboard/profile"
                onClick={() => { setMenuOpen(false); onNavigate?.(); }}
                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </Link>
              <Link
                href="/help"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help
              </Link>
              <div className="mx-3 border-t border-slate-100" />
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/60"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
              N
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-semibold text-slate-900">User</p>
              <p className="truncate text-xs text-slate-500">user@example.com</p>
            </div>
            <svg
              className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${menuOpen ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

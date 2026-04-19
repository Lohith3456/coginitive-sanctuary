"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Enrollment {
  examType: string;
  plan: string;
  status: string;
  startedAt: string | null;
  expiresAt: string | null;
  amountPaid: number | null;
}

export function DashboardTopNav() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch enrollments when profile opens
  useEffect(() => {
    if (!profileOpen) return;
    fetch(`${API}/api/enrollments/me`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setEnrollments(d))
      .catch(() => {});
  }, [profileOpen]);

  const displayName = user?.email?.split("@")[0] ?? "User";
  const initial = displayName[0]?.toUpperCase() ?? "U";

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="text-base font-extrabold tracking-tight text-[#1D3557]">
            Cognitive Sanctuary
          </Link>

          <div className="flex items-center gap-2">
            {/* Bell */}
            <button type="button" className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </button>

            {/* Avatar + dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1D63D1] text-xs font-bold text-white hover:bg-[#1a56b8] transition"
              >
                {initial}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-slate-200 bg-white py-1 shadow-xl z-50">
                  {/* User info */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1D63D1] text-sm font-bold text-white">
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800 capitalize">{displayName}</p>
                      <p className="truncate text-xs text-slate-400">{user?.email}</p>
                    </div>
                  </div>
                  <hr className="border-slate-100" />

                  {/* View Profile */}
                  <button
                    type="button"
                    onClick={() => { setDropdownOpen(false); setProfileOpen(true); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                  >
                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    View Profile
                  </button>

                  <hr className="border-slate-100" />

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Profile slide-over */}
      {profileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setProfileOpen(false)}
          />
          {/* Panel */}
          <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-bold text-slate-800">My Profile</h2>
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1D63D1] text-2xl font-bold text-white">
                  {initial}
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900 capitalize">{displayName}</p>
                  <p className="text-sm text-slate-500">{user?.email}</p>
                </div>
              </div>

              {/* Account details */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Account Details</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email</span>
                    <span className="font-medium text-slate-800 truncate max-w-[180px]">{user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Role</span>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600 capitalize">{user?.role ?? "user"}</span>
                  </div>
                </div>
              </div>

              {/* Enrollments */}
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">My Enrollments</p>
                {enrollments.length === 0 ? (
                  <p className="text-sm text-slate-400">No active enrollments yet.</p>
                ) : (
                  <div className="space-y-3">
                    {enrollments.map((e, i) => (
                      <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-slate-800">{e.examType}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            e.status === "active" ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"
                          }`}>{e.status}</span>
                        </div>
                        <p className="text-xs text-slate-500 capitalize">Plan: {e.plan}</p>
                        {e.expiresAt && (
                          <p className="text-xs text-slate-400 mt-1">
                            Expires: {new Date(e.expiresAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </p>
                        )}
                        {e.amountPaid != null && (
                          <p className="text-xs text-slate-400">Paid: ${Number(e.amountPaid).toFixed(2)}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

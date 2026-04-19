"use client";

import { useEffect, useState } from "react";
import { useExam } from "@/context/exam-context";
import { useAuth } from "@/context/AuthContext";
import { DashboardHome } from "@/components/dashboard/DashboardHome";

function useGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

export default function DashboardPage() {
  const { selectedExam } = useExam();
  const { user } = useAuth();
  const greeting = useGreeting();
  const time = useClock();

  const displayName = user?.email?.split("@")[0] ?? "Scholar";
  const firstName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  const timeStr = time.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: false,
  });

  return (
    <div className="space-y-6">
      {/* Hero greeting banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1D3557] via-[#1D63D1] to-[#6C3FC5] px-8 py-7 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {greeting}, {firstName}!
            </h1>
            <p className="mt-1 text-sm text-blue-200">{dateStr}</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                3 Tasks Pending
              </span>
              <span className="rounded-full bg-emerald-400/90 px-3 py-1 text-xs font-semibold text-emerald-900">
                Next Class: 10:00 AM
              </span>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-5xl font-extrabold tabular-nums tracking-tight">{timeStr}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-blue-200">
              {Intl.DateTimeFormat().resolvedOptions().timeZone.replace("_", " ")}
            </p>
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-purple-400/20 blur-2xl" />
      </div>

      {/* Rest of dashboard */}
      <DashboardHome exam={selectedExam} />
    </div>
  );
}

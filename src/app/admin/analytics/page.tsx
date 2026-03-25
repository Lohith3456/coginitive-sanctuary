"use client";

const monthlySignups = [
  { month: "Oct", value: 68 },
  { month: "Nov", value: 95 },
  { month: "Dec", value: 72 },
  { month: "Jan", value: 110 },
  { month: "Feb", value: 143 },
  { month: "Mar", value: 189 },
];

const sectionCompletion = [
  { section: "Reading", pct: 78 },
  { section: "Listening", pct: 71 },
  { section: "Writing", pct: 63 },
  { section: "Speaking", pct: 55 },
];

const planDist = [
  { plan: "Basic", count: 437, color: "bg-slate-500" },
  { plan: "Professional", count: 298, color: "bg-[#1D63D1]" },
  { plan: "Elite", count: 112, color: "bg-purple-500" },
];

const maxSignup = Math.max(...monthlySignups.map((m) => m.value));

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Monthly signups bar chart */}
        <div className="rounded-2xl border border-slate-700/60 bg-slate-800 p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Monthly Sign-ups</h2>
          <div className="flex items-end gap-3 h-36">
            {monthlySignups.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs text-slate-400">{m.value}</span>
                <div
                  className="w-full rounded-t-md bg-[#1D63D1]"
                  style={{ height: `${(m.value / maxSignup) * 100}%` }}
                />
                <span className="text-xs text-slate-400">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan distribution */}
        <div className="rounded-2xl border border-slate-700/60 bg-slate-800 p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Plan Distribution</h2>
          <div className="space-y-4">
            {planDist.map((p) => {
              const total = planDist.reduce((a, b) => a + b.count, 0);
              const pct = Math.round((p.count / total) * 100);
              return (
                <div key={p.plan}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-semibold text-slate-300">{p.plan}</span>
                    <span className="text-slate-400">{p.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
                    <div className={`h-full rounded-full ${p.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section completion */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-800 p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">Practice Section Completion Rate</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          {sectionCompletion.map((s) => (
            <div key={s.section} className="rounded-xl bg-slate-700/40 p-4 text-center">
              <p className="text-2xl font-bold text-white">{s.pct}%</p>
              <p className="mt-1 text-xs text-slate-400">{s.section}</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-600">
                <div className="h-full rounded-full bg-[#1D63D1]" style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

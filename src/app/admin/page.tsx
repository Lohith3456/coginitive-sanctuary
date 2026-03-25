"use client";

import { useState } from "react";

const stats = [
  {
    label: "Total Users",
    value: "24,892",
    change: "+12.5%",
    up: true,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    iconBg: "bg-blue-50 text-blue-500",
  },
  {
    label: "Active Subscriptions",
    value: "18,204",
    change: "+8.2%",
    up: true,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
    iconBg: "bg-teal-50 text-teal-500",
  },
  {
    label: "Mock Tests Taken",
    value: "142.5k",
    change: "+24%",
    up: true,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
    iconBg: "bg-orange-50 text-orange-500",
  },
  {
    label: "Avg. Band Score",
    value: "7.5",
    change: "Stable",
    up: null,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    iconBg: "bg-slate-100 text-slate-500",
  },
];

const monthlyData = [
  { month: "Jan", newSubs: 320,  renewals: 180 },
  { month: "Feb", newSubs: 410,  renewals: 220 },
  { month: "Mar", newSubs: 380,  renewals: 260 },
  { month: "Apr", newSubs: 520,  renewals: 310 },
  { month: "May", newSubs: 490,  renewals: 340 },
  { month: "Jun", newSubs: 610,  renewals: 390 },
  { month: "Jul", newSubs: 570,  renewals: 420 },
  { month: "Aug", newSubs: 680,  renewals: 460 },
  { month: "Sep", newSubs: 720,  renewals: 500 },
  { month: "Oct", newSubs: 810,  renewals: 540 },
  { month: "Nov", newSubs: 940,  renewals: 610 },
  { month: "Dec", newSubs: 1050, renewals: 680 },
];

const trackDist = [
  { label: "IELTS Preparation", pct: 45, color: "bg-[#1D63D1]" },
  { label: "TOEFL Excellence", pct: 30, color: "bg-emerald-500" },
  { label: "GRE Masterclass", pct: 25, color: "bg-[#1D3557]" },
];

const students = [
  { name: "Amara Okafor", track: "IELTS Academic", trackColor: "bg-blue-100 text-blue-700", status: "Active", statusColor: "text-green-500", joined: "Oct 12, 2023" },
  { name: "Liam Chen", track: "TOEFL iBT", trackColor: "bg-teal-100 text-teal-700", status: "Pending", statusColor: "text-amber-500", joined: "Oct 14, 2023" },
  { name: "Elena Rodriguez", track: "GRE General", trackColor: "bg-orange-100 text-orange-700", status: "Completed", statusColor: "text-blue-500", joined: "Sept 28, 2023" },
  { name: "Arjun Sharma", track: "IELTS Academic", trackColor: "bg-blue-100 text-blue-700", status: "Active", statusColor: "text-green-500", joined: "Mar 24, 2026" },
  { name: "Priya Nair", track: "TOEFL iBT", trackColor: "bg-teal-100 text-teal-700", status: "Active", statusColor: "text-green-500", joined: "Mar 23, 2026" },
];

const maxBar = Math.max(...monthlyData.map((d) => d.newSubs + d.renewals));

export default function AdminOverviewPage() {
  const [search, setSearch] = useState("");
  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 max-w-[1100px]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1D3557]">Platform Insights</h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome back. Your educational ecosystem is performing with high intellectual clarity today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export Report
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-[#1D3557] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#16293f] transition"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Course
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className={`rounded-xl p-2.5 ${s.iconBg}`}>{s.icon}</div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                s.up === true ? "bg-green-50 text-green-600" :
                s.up === false ? "bg-red-50 text-red-500" :
                "bg-slate-100 text-slate-500"
              }`}>
                {s.change}
              </span>
            </div>
            <p className="mt-3 text-xs font-medium text-slate-500">{s.label}</p>
            <p className="mt-0.5 text-2xl font-bold text-[#1D3557]">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Monthly subscriptions chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1D3557]">Monthly Subscriptions</h2>
              <p className="text-xs text-slate-400">No. of users who took a subscription per month</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#1D63D1]" /> New Subscriptions
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-slate-200" /> Renewals
              </span>
            </div>
          </div>

          {/* Y-axis labels + bars */}
          <div className="flex gap-2">
            {/* Y labels */}
            <div className="flex flex-col justify-between pb-5 text-right">
              {[1200, 900, 600, 300, 0].map((v) => (
                <span key={v} className="text-[10px] text-slate-300 leading-none">{v}</span>
              ))}
            </div>

            {/* Chart area */}
            <div className="flex flex-1 flex-col gap-1">
              {/* Gridlines + bars */}
              <div className="relative flex flex-1 items-end gap-1.5" style={{ height: 160 }}>
                {/* Horizontal gridlines */}
                {[0, 25, 50, 75, 100].map((pct) => (
                  <div
                    key={pct}
                    className="pointer-events-none absolute left-0 right-0 border-t border-slate-100"
                    style={{ bottom: `${pct}%` }}
                  />
                ))}
                {monthlyData.map((d) => {
                  const newH  = (d.newSubs  / maxBar) * 100;
                  const renH  = (d.renewals / maxBar) * 100;
                  return (
                    <div key={d.month} className="group relative flex flex-1 items-end gap-0.5">
                      {/* Tooltip */}
                      <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-10">
                        <div className="rounded-lg bg-[#1D3557] px-2.5 py-1.5 text-[10px] text-white whitespace-nowrap shadow-lg">
                          <p className="font-semibold">{d.month}</p>
                          <p>New: {d.newSubs.toLocaleString()}</p>
                          <p>Renewals: {d.renewals.toLocaleString()}</p>
                        </div>
                        <div className="h-1.5 w-1.5 rotate-45 bg-[#1D3557] -mt-1" />
                      </div>
                      <div
                        className="flex-1 rounded-t-sm bg-[#1D63D1] transition-all duration-200 group-hover:bg-[#1a56b8]"
                        style={{ height: `${newH}%` }}
                      />
                      <div
                        className="flex-1 rounded-t-sm bg-slate-200 transition-all duration-200 group-hover:bg-slate-300"
                        style={{ height: `${renH}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              {/* X labels */}
              <div className="flex gap-1.5">
                {monthlyData.map((d) => (
                  <div key={d.month} className="flex-1 text-center">
                    <span className="text-[10px] text-slate-400">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary row */}
          <div className="mt-4 flex items-center gap-6 border-t border-slate-100 pt-3">
            <div>
              <p className="text-xs text-slate-400">Total this year</p>
              <p className="text-base font-bold text-[#1D3557]">
                {monthlyData.reduce((a, d) => a + d.newSubs, 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Renewals this year</p>
              <p className="text-base font-bold text-[#1D3557]">
                {monthlyData.reduce((a, d) => a + d.renewals, 0).toLocaleString()}
              </p>
            </div>
            <div className="ml-auto">
              <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-600">
                ↑ 28% vs last year
              </span>
            </div>
          </div>
        </div>

        {/* Track distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-[#1D3557]">Track Distribution</h2>
          <p className="text-xs text-slate-400">Enrollment by exam type</p>
          <div className="mt-4 space-y-4">
            {trackDist.map((t) => (
              <div key={t.label}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-medium text-slate-700">{t.label}</span>
                  <span className="font-semibold text-slate-600">{t.pct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${t.color}`} style={{ width: `${t.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-around border-t border-slate-100 pt-4">
            <div className="text-center">
              <p className="text-sm font-bold text-[#1D3557]">IELTS</p>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Leading</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-[#1D3557]">GRE</p>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Growing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Student activity table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-bold text-[#1D3557]">Recent Student Activity</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="search"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-36 bg-transparent text-xs text-slate-700 outline-none placeholder-slate-400"
              />
            </div>
            <button type="button" className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-50">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
              </svg>
            </button>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              <th className="px-5 py-3">Student Name</th>
              <th className="px-5 py-3">Exam Track</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Join Date</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((s) => (
              <tr key={s.name} className="hover:bg-slate-50/60 transition">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                      {s.name[0]}
                    </div>
                    <span className="font-semibold text-slate-800">{s.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.trackColor}`}>
                    {s.track}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`flex items-center gap-1.5 text-xs font-semibold ${s.statusColor}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      s.status === "Active" ? "bg-green-500" :
                      s.status === "Pending" ? "bg-amber-400" : "bg-blue-400"
                    }`} />
                    {s.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs text-slate-500">{s.joined}</td>
                <td className="px-5 py-3.5">
                  <button type="button" className="text-slate-400 hover:text-slate-700">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
          <p className="text-xs text-slate-400">Showing {filtered.length} of 1,240 students</p>
          <div className="flex gap-2">
            <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
              Prev
            </button>
            <button type="button" className="rounded-lg bg-[#1D3557] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#16293f] transition">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

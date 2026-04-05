"use client";

import { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui/DatePicker";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function fmt(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

const examSubscriptions = [
  { label: "IELTS", users: "8,210", color: "bg-blue-50 text-blue-600 border-blue-100" },
  { label: "TOEFL", users: "5,490", color: "bg-teal-50 text-teal-600 border-teal-100" },
  { label: "GRE", users: "2,890", color: "bg-orange-50 text-orange-600 border-orange-100" },
  { label: "PTE", users: "1,614", color: "bg-purple-50 text-purple-600 border-purple-100" },
];

// Hourly activity data for the smooth line chart
const hourlyData = [
  { label: "00:00", value: 1200 },
  { label: "04:00", value: 900 },
  { label: "08:00", value: 2800 },
  { label: "12:00", value: 3400 },
  { label: "16:00", value: 5200 },
  { label: "20:00", value: 8200 },
  { label: "23:59", value: 6100 },
];

const trackDist = [
  { label: "IELTS Preparation", pct: 45, color: "bg-[#1D63D1]" },
  { label: "TOEFL Excellence", pct: 30, color: "bg-emerald-500" },
  { label: "GRE Masterclass", pct: 25, color: "bg-[#1D3557]" },
];

const students = [
  { name: "Amara Okafor", email: "amara.o@example.com", track: "IELTS Academic", trackColor: "bg-blue-100 text-blue-700", status: "Active", statusColor: "text-green-500", joined: "2 minutes ago" },
  { name: "Liam Chen", email: "liam.c@example.com", track: "TOEFL iBT", trackColor: "bg-teal-100 text-teal-700", status: "In Progress", statusColor: "text-amber-500", joined: "14 minutes ago" },
  { name: "Elena Rodriguez", email: "elena.r@example.com", track: "GRE General", trackColor: "bg-orange-100 text-orange-700", status: "Subscribed", statusColor: "text-blue-500", joined: "1 hour ago" },
  { name: "Arjun Sharma", email: "arjun.s@example.com", track: "IELTS Academic", trackColor: "bg-blue-100 text-blue-700", status: "Active", statusColor: "text-green-500", joined: "3 hours ago" },
  { name: "Priya Nair", email: "priya.n@example.com", track: "TOEFL iBT", trackColor: "bg-teal-100 text-teal-700", status: "Active", statusColor: "text-green-500", joined: "5 hours ago" },
];
function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const cp1x = points[i].x + (points[i + 1].x - points[i].x) / 3;
    const cp1y = points[i].y;
    const cp2x = points[i + 1].x - (points[i + 1].x - points[i].x) / 3;
    const cp2y = points[i + 1].y;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i + 1].x} ${points[i + 1].y}`;
  }
  return d;
}

export default function AdminOverviewPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("2023-10-01");
  const [dateTo, setDateTo] = useState("2023-10-31");
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; value: number } | null>(null);
  const [liveStats, setLiveStats] = useState<{
    totalUsers: number;
    activeSubscriptions: number;
    mockTestsTaken: number;
    avgBandScore: number | null;
  } | null>(null);
  const [liveStudents, setLiveStudents] = useState<{
    users: {
      id: string; email: string; phone: string | null;
      username: string | null; displayName: string;
      role: string; status: string; joinedAgo: string;
    }[];
    total: number;
  } | null>(null);
  const [activityData, setActivityData] = useState<{ label: string; value: number }[]>(hourlyData);

  useEffect(() => {
    fetch(`${API}/api/admin/stats`)
      .then((r) => r.json())
      .then(setLiveStats)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), limit: "10", search });
    fetch(`${API}/api/admin/users?${params}`)
      .then((r) => r.json())
      .then(setLiveStudents)
      .catch(console.error);
  }, [page, search]);

  useEffect(() => {
    if (!dateFrom || !dateTo) return;
    fetch(`${API}/api/admin/activity?from=${dateFrom}&to=${dateTo}`)
      .then((r) => r.json())
      .then((d) => { if (d.data?.length) setActivityData(d.data); })
      .catch(console.error);
  }, [dateFrom, dateTo]);

  const stats = [
    {
      label: "Total Users",
      value: liveStats ? fmt(liveStats.totalUsers) : "—",
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
      value: liveStats ? fmt(liveStats.activeSubscriptions) : "—",
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
      value: liveStats ? (liveStats.mockTestsTaken > 0 ? fmt(liveStats.mockTestsTaken) : "0") : "—",
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
      value: liveStats?.avgBandScore != null ? String(liveStats.avgBandScore) : "N/A",
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

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  // SVG chart dimensions
  const W = 700, H = 200, PAD = { top: 20, right: 20, bottom: 30, left: 10 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const maxVal = Math.max(...activityData.map((d) => d.value), 1);

  const points = activityData.map((d, i) => ({
    x: PAD.left + (i / (activityData.length - 1)) * chartW,
    y: PAD.top + (1 - d.value / maxVal) * chartH,
    label: d.label,
    value: d.value,
  }));

  const linePath = buildSmoothPath(points);
  // Area fill path: line + close bottom
  const areaPath = linePath
    + ` L ${points[points.length - 1].x} ${PAD.top + chartH}`
    + ` L ${points[0].x} ${PAD.top + chartH} Z`;

  return (
    <div className="space-y-6 max-w-[1100px]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1D3557]">Platform Insights</h1>
          <p className="mt-1 text-sm text-slate-500">
            A comprehensive overview of global student engagement, subscription health, and behavioral trends.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export Report
          </button>
          <button type="button" className="flex items-center gap-2 rounded-lg bg-[#1D3557] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#16293f] transition">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Course
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className={`rounded-xl p-2.5 ${s.iconBg}`}>{s.icon}</div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  s.up === true ? "bg-green-50 text-green-600" :
                  s.up === false ? "bg-red-50 text-red-500" :
                  "bg-slate-100 text-slate-500"
                }`}>{s.change}</span>
              </div>
              <p className="mt-3 text-xs font-medium text-slate-500">{s.label}</p>
              <p className="mt-0.5 text-2xl font-bold text-[#1D3557]">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Exam subscription breakdown */}
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {examSubscriptions.map((e) => (
            <div key={e.label} className={`rounded-xl border px-4 py-3 ${e.color}`}>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{e.label} Subscribers</p>
              <p className="mt-1 text-xl font-bold">{e.users}</p>
            </div>
          ))}
        </div>
      </div>

      {/* User Activity Line Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#1D3557]">User Activity &amp; Growth</h2>
            <p className="text-xs text-slate-400">Real-time engagement telemetry and student acquisition data</p>
          </div>
          <div className="flex items-center gap-2">
            <DatePicker value={dateFrom} onChange={setDateFrom} />
            <span className="text-xs text-slate-400">–</span>
            <DatePicker value={dateTo} onChange={setDateTo} />
          </div>
        </div>

        {/* SVG Line Chart */}
        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            style={{ height: 220 }}
            onMouseLeave={() => setTooltip(null)}
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1D63D1" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#1D63D1" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
              <line
                key={pct}
                x1={PAD.left}
                x2={PAD.left + chartW}
                y1={PAD.top + pct * chartH}
                y2={PAD.top + pct * chartH}
                stroke="#e2e8f0"
                strokeWidth={1}
              />
            ))}

            {/* Area fill */}
            <path d={areaPath} fill="url(#areaGrad)" />

            {/* Line */}
            <path d={linePath} fill="none" stroke="#1D63D1" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

            {/* Data points + hover zones */}
            {points.map((p) => (
              <g key={p.label}>
                <circle cx={p.x} cy={p.y} r={5} fill="white" stroke="#1D63D1" strokeWidth={2} />
                {/* invisible wider hit area */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={18}
                  fill="transparent"
                  onMouseEnter={() => setTooltip(p)}
                />
              </g>
            ))}

            {/* X-axis labels */}
            {points.map((p) => (
              <text key={p.label} x={p.x} y={H - 4} textAnchor="middle" fontSize={10} fill="#94a3b8">
                {p.label}
              </text>
            ))}
          </svg>

          {/* Tooltip */}
          {tooltip && (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-[#1D3557] px-3 py-2 text-xs text-white shadow-lg"
              style={{
                left: `${(tooltip.x / W) * 100}%`,
                top: `${((tooltip.y - PAD.top) / (H - PAD.top - PAD.bottom)) * 85}%`,
              }}
            >
              <p className="font-bold">{tooltip.value.toLocaleString()} Users</p>
              <p className="text-slate-300">{tooltip.label}</p>
            </div>
          )}
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
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-36 bg-transparent text-xs text-slate-700 outline-none placeholder-slate-400"
              />
            </div>
            <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
              View All Students
            </button>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              <th className="px-5 py-3">Student</th>
              <th className="px-5 py-3">Target Course</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Activity Date</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {(liveStudents?.users ?? students).map((s) => {
              const email = s.email;
              const name = 'displayName' in s ? (s as { displayName: string }).displayName : ('name' in s ? (s as { name: string }).name : email.split('@')[0]);
              const joined = 'joinedAgo' in s ? (s as { joinedAgo: string }).joinedAgo : (s as { joined: string }).joined;
              const track = 'track' in s ? (s as { track: string }).track : '—';
              const trackColor = 'trackColor' in s ? (s as { trackColor: string }).trackColor : 'bg-slate-100 text-slate-600';
              const status = s.status;
              const statusColor = status === 'Active' ? 'text-green-500' : status === 'In Progress' ? 'text-amber-500' : 'text-blue-500';
              return (
                <tr key={email} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1D63D1]/10 text-xs font-bold text-[#1D63D1]">
                        {name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{name}</p>
                        <p className="text-[11px] text-slate-400">{email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${trackColor}`}>
                      {track}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`flex items-center gap-1.5 text-xs font-semibold ${statusColor}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        status === "Active" || status === "Subscribed" ? "bg-green-500" :
                        status === "In Progress" ? "bg-amber-400" : "bg-blue-400"
                      }`} />
                      {status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{joined}</td>
                  <td className="px-5 py-3.5">
                    <button type="button" className="text-slate-400 hover:text-slate-700">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
          <p className="text-xs text-slate-400">
            Showing {liveStudents?.users.length ?? students.length} of {liveStudents?.total ?? "1,240"} students
          </p>
          <div className="flex gap-2">
            <button type="button" disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition">Prev</button>
            <button type="button" disabled={liveStudents ? page * 10 >= liveStudents.total : false} onClick={() => setPage(p => p + 1)} className="rounded-lg bg-[#1D3557] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#16293f] disabled:opacity-40 transition">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

const USERS = [
  { id: 1, name: "Arjun Sharma", email: "arjun.s@example.com", exam: "IELTS", plan: "Professional", status: "Active", joined: "Mar 24, 2026" },
  { id: 2, name: "Priya Nair", email: "priya.n@example.com", exam: "PTE", plan: "Basic", status: "Active", joined: "Mar 23, 2026" },
  { id: 3, name: "Wei Zhang", email: "wei.z@example.com", exam: "TOEFL", plan: "Elite", status: "Active", joined: "Mar 22, 2026" },
  { id: 4, name: "Fatima Al-Hassan", email: "fatima.h@example.com", exam: "GRE", plan: "Professional", status: "Active", joined: "Mar 21, 2026" },
  { id: 5, name: "Carlos Mendez", email: "carlos.m@example.com", exam: "IELTS", plan: "Basic", status: "Inactive", joined: "Mar 20, 2026" },
  { id: 6, name: "Aisha Patel", email: "aisha.p@example.com", exam: "PTE", plan: "Elite", status: "Active", joined: "Mar 18, 2026" },
  { id: 7, name: "Liam O'Brien", email: "liam.o@example.com", exam: "IELTS", plan: "Professional", status: "Active", joined: "Mar 15, 2026" },
  { id: 8, name: "Yuki Tanaka", email: "yuki.t@example.com", exam: "TOEFL", plan: "Basic", status: "Inactive", joined: "Mar 10, 2026" },
];

const planColors: Record<string, string> = {
  Basic: "bg-slate-700 text-slate-300",
  Professional: "bg-blue-500/20 text-blue-300",
  Elite: "bg-purple-500/20 text-purple-300",
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const filtered = USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{USERS.length} total users</p>
        <input
          type="search"
          placeholder="Search users…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 outline-none focus:border-[#1D63D1] focus:ring-2 focus:ring-[#1D63D1]/30"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/60 text-left text-xs font-semibold text-slate-400">
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Exam</th>
              <th className="px-5 py-3">Plan</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/40">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-700/30 transition">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-600 text-xs font-bold text-white">
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-300">{u.exam}</td>
                <td className="px-5 py-3.5">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${planColors[u.plan]}`}>
                    {u.plan}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    u.status === "Active" ? "bg-green-500/10 text-green-400" : "bg-slate-700 text-slate-400"
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs text-slate-400">{u.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-500">No users found.</p>
        )}
      </div>
    </div>
  );
}

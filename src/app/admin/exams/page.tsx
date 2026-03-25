"use client";

const EXAMS = [
  {
    id: "IELTS",
    title: "IELTS",
    sections: ["Reading", "Listening", "Writing", "Speaking"],
    activeUsers: 512,
    mocksTaken: 2341,
    avgScore: "7.2",
    status: "Active",
  },
  {
    id: "PTE",
    title: "PTE Academic",
    sections: ["Speaking & Writing", "Reading", "Listening"],
    activeUsers: 321,
    mocksTaken: 1456,
    avgScore: "68",
    status: "Active",
  },
  {
    id: "TOEFL",
    title: "TOEFL iBT",
    sections: ["Reading", "Listening", "Speaking", "Writing"],
    activeUsers: 257,
    mocksTaken: 987,
    avgScore: "94",
    status: "Active",
  },
  {
    id: "GRE",
    title: "GRE",
    sections: ["Verbal", "Quantitative", "Analytical Writing"],
    activeUsers: 194,
    mocksTaken: 847,
    avgScore: "318",
    status: "Active",
  },
];

export default function AdminExamsPage() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {EXAMS.map((exam) => (
        <div key={exam.id} className="rounded-2xl border border-slate-700/60 bg-slate-800 p-5">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-white">{exam.title}</h2>
              <div className="mt-1 flex flex-wrap gap-1">
                {exam.sections.map((s) => (
                  <span key={s} className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-400">
              {exam.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-slate-700/60 pt-4">
            <div>
              <p className="text-xs text-slate-400">Active Users</p>
              <p className="mt-0.5 text-lg font-bold text-white">{exam.activeUsers}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Mocks Taken</p>
              <p className="mt-0.5 text-lg font-bold text-white">{exam.mocksTaken}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Avg. Score</p>
              <p className="mt-0.5 text-lg font-bold text-white">{exam.avgScore}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

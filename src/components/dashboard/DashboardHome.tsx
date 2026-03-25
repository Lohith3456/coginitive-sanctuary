import Link from "next/link";
import type { ExamId } from "@/context/exam-context";
import {
  dashboardContentForExam,
  type RecentItem,
} from "@/lib/dashboard-by-exam";
import { ExamDateCard } from "@/components/dashboard/ExamDatePicker";
import { ExamBooking } from "@/components/dashboard/ExamBooking";

function breadcrumbTrail(exam: ExamId | null) {
  if (exam === "IELTS") return "Exams > IELTS Academic";
  if (exam) return `Exams > ${exam}`;
  return "Exams > Select exam";
}

function headlineFor(exam: ExamId | null) {
  if (exam === "IELTS") return "Mastering IELTS Academic";
  if (exam === "PTE") return "Mastering PTE Academic";
  if (exam === "TOEFL") return "Mastering TOEFL iBT";
  if (exam === "GRE") return "Mastering GRE General";
  return "Your study dashboard";
}

function subheadlineFor(exam: ExamId | null) {
  if (exam === "IELTS") {
    return (
      <>
        Your journey to a Band 8.0 starts here—focus on{" "}
        <span className="font-semibold text-[#C2410C]">
          Complex Writing Structures
        </span>{" "}
        to unlock higher bands.
      </>
    );
  }
  return (
    <>
      Build accuracy and speed with daily practice—prioritize{" "}
      <span className="font-semibold text-[#C2410C]">weak sections</span>{" "}
      first for the fastest gains.
    </>
  );
}

function RecentRow({
  item,
  isLast,
}: {
  item: RecentItem;
  isLast: boolean;
}) {
  const gapClass = isLast ? "" : "pb-6";

  if (item.kind === "words") {
    return (
      <li className={`relative flex gap-4 ${gapClass}`}>
        <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8F1FC] text-[#1D63D1] ring-4 ring-white">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="font-semibold text-slate-900">{item.title}</p>
          <p className="mt-2 text-sm italic text-slate-600">{item.words}</p>
        </div>
      </li>
    );
  }

  const isSuccess = item.tagTone === "success";
  return (
    <li className={`relative flex gap-4 ${gapClass}`}>
      <div
        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-white ${
          isSuccess
            ? "bg-emerald-50 text-emerald-600"
            : "bg-amber-50 text-amber-700"
        }`}
      >
        {isSuccess ? (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="font-semibold text-slate-900">{item.title}</p>
        <span
          className={`mt-1 inline-flex rounded-md px-2 py-0.5 text-xs font-bold ring-1 ${
            isSuccess
              ? "bg-emerald-50 text-[#10B981] ring-emerald-200/60"
              : "bg-slate-100 text-[10px] uppercase tracking-wide text-slate-600 ring-slate-200"
          }`}
        >
          {item.tag}
        </span>
      </div>
    </li>
  );
}

export function DashboardHome({ exam }: { exam: ExamId | null }) {
  const content = dashboardContentForExam(exam);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1D63D1]">
            {breadcrumbTrail(exam)}
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.25rem] lg:leading-tight">
            {headlineFor(exam)}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {content ? (
              <>
                {content.subheadline.before}
                <span className="font-semibold text-[#C2410C]">
                  {content.subheadline.highlight}
                </span>
                {content.subheadline.after}
              </>
            ) : (
              subheadlineFor(exam)
            )}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-4 sm:gap-5">
          <div className="flex min-h-[100px] min-w-[140px] flex-1 flex-col justify-center rounded-2xl bg-slate-100/90 px-5 py-4 shadow-sm ring-1 ring-slate-200/60 sm:flex-initial sm:min-w-[160px]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {content?.avgScoreCaption ?? "Avg score"}
            </p>
            <p className="mt-1 text-3xl font-extrabold tabular-nums text-[#1D63D1]">
              {content?.avgScore ?? "—"}
            </p>
          </div>
          <ExamDateCard />
        </div>
      </div>

      <ExamBooking exam={exam} />

      <div className="grid gap-8 xl:grid-cols-[1fr_minmax(260px,300px)] xl:items-start">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-900">
                Section mastery
              </h2>
              <Link
                href="/dashboard/results"
                className="text-sm font-semibold text-[#1D63D1] hover:underline"
              >
                Full analytics
              </Link>
            </div>
            {content ? (
              <ul className="space-y-5">
                {content.sections.map((row) => (
                  <li key={row.name}>
                    <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
                      <span>{row.name}</span>
                      <span className="tabular-nums text-slate-900">
                        {row.pct}%
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#1D63D1] transition-all"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm leading-relaxed text-slate-600">
                <Link
                  href="/exams"
                  className="font-semibold text-[#1D63D1] hover:underline"
                >
                  Select an exam
                </Link>{" "}
                to see reading, listening, writing, and speaking progress tailored
                to that test.
              </p>
            )}
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            <Link
              href={exam ? `/exams/${exam}/modules` : "/exams"}
              className="group relative flex min-h-[200px] flex-col justify-end overflow-hidden rounded-2xl bg-[#1D63D1] p-6 text-white shadow-lg ring-1 ring-[#1D63D1]/20 transition hover:brightness-105"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                aria-hidden
              >
                <div className="absolute -right-6 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
                <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-sky-300/30 blur-2xl" />
                <div className="absolute right-8 top-8 h-16 w-16 rotate-12 rounded-lg border-2 border-white/25" />
                <div className="absolute bottom-10 right-4 h-10 w-10 rounded-md border border-white/20" />
              </div>
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-white/30">
                  <svg
                    className="ml-0.5 h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Continue practice</h3>
                <p className="mt-2 text-sm leading-relaxed text-blue-100">
                  {content?.continuePractice ??
                    "Choose an exam first, then open modules to practice by skill."}
                </p>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-white/90 group-hover:underline">
                  Explore modules →
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard/mock-test"
              className="group relative flex min-h-[200px] flex-col justify-end overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.06)] transition hover:shadow-md"
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-slate-100/90"
                aria-hidden
              />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F1FC] text-[#1D63D1] ring-1 ring-[#1D63D1]/15">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.75}
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Full mock test
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {content?.mockDuration ??
                    "Simulate the real exam when you’ve selected your test type."}
                </p>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#1D63D1] group-hover:underline">
                  Begin session →
                </p>
              </div>
            </Link>
          </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
            <h2 className="text-sm font-bold text-slate-900">
              Upcoming schedule
            </h2>
            {content ? (
              <ul className="mt-5 space-y-4">
                {content.schedule.map((ev) => (
                  <li key={`${ev.month}-${ev.day}-${ev.title}`} className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-100 text-center ring-1 ring-slate-200/80">
                      <span className="text-[10px] font-bold uppercase text-slate-500">
                        {ev.month}
                      </span>
                      <span className="text-lg font-extrabold leading-none text-slate-900">
                        {ev.day}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{ev.title}</p>
                      <p className="text-sm text-slate-500">{ev.sub}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-600">
                Pick an exam to preview a sample prep calendar.
              </p>
            )}
            <button
              type="button"
              className="mt-6 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              View all schedule
            </button>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
            <h2 className="text-sm font-bold text-slate-900">
              Recent performance
            </h2>
            {content ? (
              <ul className="relative mt-5 space-y-0 pl-2">
                <div
                  className="absolute bottom-2 left-[15px] top-2 w-px bg-slate-200"
                  aria-hidden
                />
                {content.recent.map((item, i) => (
                  <RecentRow
                    key={`${item.kind}-${i}`}
                    item={item}
                    isLast={i === content.recent.length - 1}
                  />
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-600">
                Activity from practice and mocks will appear here for your
                selected exam.
              </p>
            )}
          </section>
        </aside>
      </div>

      {!exam ? (
        <p className="text-center text-sm text-slate-500">
          <Link
            href="/exams"
            className="font-semibold text-[#1D63D1] hover:underline"
          >
            Select an exam
          </Link>{" "}
          to load scores, schedule, and practice copy for that test.
        </p>
      ) : null}
    </div>
  );
}

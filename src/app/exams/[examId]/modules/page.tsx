import Link from "next/link";
import { notFound } from "next/navigation";
import type { ExamId } from "@/context/exam-context";
import { Footer } from "@/components/marketing/Footer";
import { Navbar } from "@/components/marketing/Navbar";
import { EXAMS, EXAM_MODULES } from "@/lib/data";

const EXAM_IDS: ExamId[] = ["IELTS", "PTE", "TOEFL", "GRE"];

function isExamId(x: string): x is ExamId {
  return EXAM_IDS.includes(x as ExamId);
}

export function generateStaticParams() {
  return EXAM_IDS.map((examId) => ({ examId }));
}

export default async function ExamModulesPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId: raw } = await params;
  const examId = decodeURIComponent(raw).toUpperCase();
  if (!isExamId(examId)) notFound();

  const exam = EXAMS.find((e) => e.id === examId);
  if (!exam) notFound();

  const modules = EXAM_MODULES[examId];

  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFB]">
      <Navbar />
      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-6xl">
          <nav className="text-sm text-slate-600">
            <Link href="/" className="hover:text-brand">
              Home
            </Link>
            <span className="mx-2 text-slate-400">/</span>
            <Link href="/#exams" className="hover:text-brand">
              Exams
            </Link>
            <span className="mx-2 text-slate-400">/</span>
            <span className="font-medium text-slate-900">
              {exam.title} modules
            </span>
          </nav>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {exam.title} modules
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
            {exam.description}
          </p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {modules.map((m) => {
              const examQs = new URLSearchParams({ exam: examId });
              if (m.practiceSection) {
                examQs.set("section", m.practiceSection);
              }
              const href = `/dashboard/practice?${examQs.toString()}`;
              return (
                <li key={m.title}>
                  <article className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
                    <h2 className="text-lg font-bold text-slate-900">{m.title}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                      {m.description}
                    </p>
                    <Link
                      href={href}
                      className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand underline decoration-2 underline-offset-2 hover:text-brand-dark"
                    >
                      Start practice
                      <span aria-hidden>→</span>
                    </Link>
                  </article>
                </li>
              );
            })}
          </ul>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/exams"
              className="text-sm font-semibold text-slate-600 hover:text-brand"
            >
              ← Choose a different exam
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-semibold text-brand hover:underline"
            >
              View pricing
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

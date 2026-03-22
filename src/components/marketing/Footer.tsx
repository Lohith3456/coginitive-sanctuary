import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50/80">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-[#0c2d5e]">Cognitive Sanctuary</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-600">
              Structured practice and realistic mocks for English proficiency
              exams—built for focus.
            </p>
            <div className="mt-4 flex gap-3 text-slate-400">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-500"
                aria-hidden
              >
                in
              </span>
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-500"
                aria-hidden
              >
                @
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Resources</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/dashboard/practice" className="hover:text-brand">
                  Practice Tests
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-brand">
                  Study Guides
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-brand">
                  Exam Blogs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Company</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <span className="cursor-default">Careers</span>
              </li>
              <li>
                <span className="cursor-default">Contact Support</span>
              </li>
              <li>
                <span className="cursor-default">Partner Program</span>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Legal</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <span className="cursor-default">Privacy Policy</span>
              </li>
              <li>
                <span className="cursor-default">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-8 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Cognitive Sanctuary. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
              Security Verified
            </span>
            <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
              System Status: Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

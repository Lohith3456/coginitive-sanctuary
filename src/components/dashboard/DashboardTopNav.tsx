import Link from "next/link";

export function DashboardTopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-[#0c2d5e] sm:text-xl"
        >
          Cognitive Sanctuary
        </Link>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 text-sm font-medium text-slate-600 lg:flex">
          <Link
            href="/"
            className="pb-0.5 transition-colors hover:text-[#1D63D1]"
          >
            Home
          </Link>
          <Link
            href="/exams"
            className="border-b-2 border-[#1D63D1] pb-0.5 font-semibold text-[#1D63D1]"
          >
            Exams
          </Link>
          <Link
            href="/pricing"
            className="pb-0.5 transition-colors hover:text-[#1D63D1]"
          >
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:px-3"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-[#1D63D1] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#174ea6]"
          >
            Get Started
          </Link>
        </div>
      </div>
      <nav className="flex justify-center gap-6 border-t border-slate-100 py-2 text-xs font-medium text-slate-600 lg:hidden">
        <Link href="/" className="hover:text-[#1D63D1]">
          Home
        </Link>
        <Link href="/exams" className="font-semibold text-[#1D63D1]">
          Exams
        </Link>
        <Link href="/pricing" className="hover:text-[#1D63D1]">
          Pricing
        </Link>
      </nav>
    </header>
  );
}

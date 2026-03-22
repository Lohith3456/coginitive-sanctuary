import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-[#0c2d5e] sm:text-xl"
        >
          Cognitive Sanctuary
        </Link>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
          <Link href="/" className="hover:text-brand transition-colors">
            Home
          </Link>
          <Link href="/#exams" className="hover:text-brand transition-colors">
            Exams
          </Link>
          <Link href="/pricing" className="hover:text-brand transition-colors">
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
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
          >
            Get Started
          </Link>
        </div>
      </div>
      <nav className="flex justify-center gap-6 border-t border-slate-100 py-2 text-xs font-medium text-slate-600 lg:hidden">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <Link href="/#exams" className="hover:text-brand">
          Exams
        </Link>
        <Link href="/pricing" className="hover:text-brand">
          Pricing
        </Link>
      </nav>
    </header>
  );
}

import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-brand-soft/40 to-white">
      <header className="border-b border-slate-100 bg-white/80 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-[#0c2d5e]"
          >
            Cognitive Sanctuary
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-brand"
          >
            Back to home
          </Link>
        </div>
      </header>
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-[0_8px_40px_rgba(15,23,42,0.08)]">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle ? (
            <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
          ) : null}
          <div className="mt-8">{children}</div>
          {footer ? <div className="mt-8 border-t border-slate-100 pt-6">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

const cols = [
  {
    title: "Platform",
    links: [
      { label: "Practice Exams", href: "/dashboard/practice" },
      { label: "Mock Tests", href: "/dashboard/mock-test" },
      { label: "Study Guides", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "About Us", href: "/" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Support", href: "#" },
      { label: "Help Center", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export function DashboardFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <p className="text-lg font-bold text-[#0c2d5e]">Cognitive Sanctuary</p>
            <p className="mt-3 max-w-xs text-sm text-slate-600">
              Professional English exam preparation with structured practice and
              full-length simulations.
            </p>
            <p className="mt-6 text-xs text-slate-500">
              © {new Date().getFullYear()} Cognitive Sanctuary. All rights reserved.
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="hover:text-[#1D63D1]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

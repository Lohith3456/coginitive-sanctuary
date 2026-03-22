import Link from "next/link";
import { PRICING_PLANS } from "@/lib/data";

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-brand"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function PricingPreview() {
  return (
    <section className="bg-slate-50/50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Transparent Investment
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Simple plans that scale with your prep timeline. Upgrade or cancel
            anytime—no hidden fees.
          </p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm ${
                plan.highlight
                  ? "border-2 border-brand shadow-md ring-4 ring-brand/10"
                  : "border-slate-200"
              }`}
            >
              {plan.badge ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  {plan.badge}
                </span>
              ) : null}
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {plan.name}
              </p>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">
                  ${plan.price}
                </span>
                <span className="text-slate-600">{plan.period}</span>
              </p>
              <ul className="mt-8 flex flex-1 flex-col gap-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-slate-600">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className={`mt-8 inline-flex h-11 items-center justify-center rounded-lg text-center text-sm font-semibold transition ${
                  plan.highlight
                    ? "bg-brand text-white hover:bg-brand-dark"
                    : "border-2 border-slate-200 text-slate-800 hover:bg-slate-50"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

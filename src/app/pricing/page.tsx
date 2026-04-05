"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useExam } from "@/context/exam-context";
import {
  PRICING_PLANS,
  examPriceAdjust,
} from "@/lib/data";

export default function PricingPage() {
  const { selectedExam } = useExam();
  const adjust = examPriceAdjust(selectedExam);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-100">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-lg font-bold text-[#0c2d5e]">
            Cognitive Sanctuary
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link href="/exams" className="text-slate-600 hover:text-brand">
              Change exam
            </Link>
            <Link href="/dashboard" className="text-brand hover:underline">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">Pricing</h1>
        {selectedExam ? (
          <p className="mt-2 text-slate-600">
            Plans for your{" "}
            <span className="font-semibold text-brand">{selectedExam}</span>{" "}
            preparation
            {adjust > 0 ? (
              <span className="text-slate-500">
                {" "}
                (demo: +${adjust}/mo add-on reflected below)
              </span>
            ) : null}
            .
          </p>
        ) : (
          <p className="mt-2 text-slate-600">
            <Link href="/exams" className="font-semibold text-brand hover:underline">
              Select an exam
            </Link>{" "}
            to personalize your checkout summary.
          </p>
        )}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PRICING_PLANS.map((plan) => {
            const price = plan.price + adjust;
            return (
              <div
                key={plan.id}
                className={`flex flex-col rounded-2xl border p-8 ${
                  plan.highlight
                    ? "border-2 border-brand shadow-lg ring-4 ring-brand/10"
                    : "border-slate-200 shadow-sm"
                }`}
              >
                {plan.badge ? (
                  <span className="mb-4 inline-flex w-fit rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
                    {plan.badge}
                  </span>
                ) : null}
                <p className="text-sm font-semibold uppercase text-slate-500">
                  {plan.name}
                </p>
                <p className="mt-2 text-4xl font-bold text-slate-900">
                  ${price}
                  <span className="text-lg font-normal text-slate-600">
                    {plan.period}
                  </span>
                </p>
                <ul className="mt-6 flex flex-1 flex-col gap-2 text-sm text-slate-600">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-brand" aria-hidden>
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={`mt-8 h-11 rounded-lg text-sm font-semibold transition ${
                    plan.highlight
                      ? "bg-brand text-white hover:bg-brand-dark"
                      : "border-2 border-slate-200 text-slate-800 hover:bg-slate-50"
                  }`}
                  onClick={() => {
                    const params = new URLSearchParams({
                      plan: plan.name,
                      price: String(price),
                      ...(selectedExam ? { exam: selectedExam } : {}),
                    });
                    router.push(`/checkout?${params.toString()}`);
                  }}
                >
                  Subscribe
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

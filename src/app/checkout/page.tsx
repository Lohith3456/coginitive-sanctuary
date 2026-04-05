"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const PLATFORM_FEE = 12;
const DISCOUNT = 50;

type PaymentMethod = "upi" | "card" | "netbanking" | null;

const BANKS = [
  { id: "sbi", name: "State Bank of India" },
  { id: "hdfc", name: "HDFC Bank" },
  { id: "icici", name: "ICICI Bank" },
  { id: "axis", name: "Axis Bank" },
  { id: "kotak", name: "Kotak Mahindra" },
  { id: "pnb", name: "Punjab National Bank" },
  { id: "bob", name: "Bank of Baroda" },
  { id: "canara", name: "Canara Bank" },
];

const POPULAR_BANKS = BANKS.slice(0, 4);

const steps = [
  { label: "Course Info", icon: "ℹ" },
  { label: "Billing", icon: "🧾" },
  { label: "Payment", icon: "💳" },
  { label: "Confirmation", icon: "✓" },
];

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const planName = searchParams.get("plan") || "Professional";
  const price = Number(searchParams.get("price") || 64);
  const exam = searchParams.get("exam") || "";

  const total = price + PLATFORM_FEE - DISCOUNT;

  const [method, setMethod] = useState<PaymentMethod>(null);
  const [view, setView] = useState<"select" | "netbanking">("select");
  const [selectedBank, setSelectedBank] = useState("");
  const [referral, setReferral] = useState("");
  const [referralApplied, setReferralApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleComplete() {
    if (!method) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-lg font-extrabold text-[#1D3557]">
            Cognitive Sanctuary
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/exams" className="hover:text-brand">Catalog</Link>
            <Link href="/dashboard" className="hover:text-brand">My Learning</Link>
            <button type="button" className="text-slate-400 hover:text-slate-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </button>
            <button type="button" className="text-slate-400 hover:text-slate-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-[200px_1fr_320px] gap-8">

          {/* Left — stepper sidebar */}
          <aside>
            <p className="mb-1 text-base font-bold text-slate-800">Checkout</p>
            <p className="mb-6 text-xs text-slate-400">Complete your enrollment</p>
            <nav className="space-y-1">
              {steps.map((s, i) => {
                const done = i < 2;
                const active = i === 2;
                return (
                  <div key={s.label} className="flex items-center gap-3 py-2">
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold border-2 ${
                      done
                        ? "border-brand bg-brand text-white"
                        : active
                        ? "border-brand text-brand bg-white"
                        : "border-slate-300 text-slate-400 bg-white"
                    }`}>
                      {done ? "✓" : i + 1}
                    </div>
                    <span className={`text-sm font-medium ${active ? "text-brand font-semibold" : done ? "text-slate-600" : "text-slate-400"}`}>
                      {s.label}
                    </span>
                    {active && <div className="ml-auto h-5 w-1 rounded-full bg-brand" />}
                  </div>
                );
              })}
            </nav>
          </aside>

          {/* Center — payment methods or net banking detail */}
          <main>
            {view === "netbanking" ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <button type="button" onClick={() => { setView("select"); setMethod(null); setSelectedBank(""); }} className="text-slate-400 hover:text-slate-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                  </button>
                  <h1 className="text-2xl font-bold text-slate-900">Secure Net Banking</h1>
                </div>
                <p className="mt-1 text-sm text-slate-500 mb-6">
                  Choose your preferred financial institution to complete the transaction through a highly encrypted portal.
                </p>

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                    </svg>
                    <span className="text-sm font-semibold text-slate-700">Select Your Bank</span>
                  </div>

                  {/* Popular bank grid */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {POPULAR_BANKS.map((bank) => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setSelectedBank(bank.id)}
                        className={`flex items-center justify-center rounded-lg border-2 p-4 h-16 text-xs font-semibold transition ${
                          selectedBank === bank.id
                            ? "border-brand bg-brand/5 text-brand"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {bank.name}
                      </button>
                    ))}
                  </div>

                  {/* Search all banks */}
                  <p className="mb-2 text-xs font-semibold text-slate-500">Search all other banks</p>
                  <div className="relative">
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    >
                      <option value="">Choose from list of banks...</option>
                      {BANKS.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Trust badges */}
                  <div className="mt-5 flex items-center gap-6">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                      Secure SSL Encrypted
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <svg className="h-4 w-4 text-brand" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                      Money-Back Guarantee
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-slate-900">Select Payment Method</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Choose your preferred way to pay. All transactions are encrypted and secure.
                </p>

                <div className="mt-6 space-y-3">
                  {/* UPI */}
                  <button
                    type="button"
                    onClick={() => setMethod("upi")}
                    className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition ${
                      method === "upi" ? "border-brand bg-brand/5" : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                      <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">UPI Payment</p>
                      <p className="text-xs text-slate-500">Instant checkout with Google Pay, PhonePe, or BHIM</p>
                    </div>
                    {method === "upi" && <div className="h-4 w-4 rounded-full border-4 border-brand" />}
                  </button>

                  {/* Card */}
                  <button
                    type="button"
                    onClick={() => setMethod("card")}
                    className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition ${
                      method === "card" ? "border-brand bg-brand/5" : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">Credit / Debit Card</p>
                      <p className="text-xs text-slate-500">Visa, Mastercard, American Express, and more</p>
                    </div>
                    {method === "card" && <div className="h-4 w-4 rounded-full border-4 border-brand" />}
                  </button>

                  {/* Net Banking */}
                  <button
                    type="button"
                    onClick={() => { setMethod("netbanking"); setView("netbanking"); }}
                    className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition ${
                      method === "netbanking" ? "border-brand bg-brand/5" : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                      <svg className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">Net Banking</p>
                      <p className="text-xs text-slate-500">Direct transfer from all major national and private banks</p>
                    </div>
                    {method === "netbanking" && <div className="h-4 w-4 rounded-full border-4 border-brand" />}
                  </button>
                </div>

                {/* Referral */}
                <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <span className="text-sm font-semibold text-slate-700">Referral Code</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={referral}
                      onChange={(e) => setReferral(e.target.value)}
                      placeholder="Enter code here"
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                    <button
                      type="button"
                      onClick={() => referral && setReferralApplied(true)}
                      className="rounded-lg bg-[#1D3557] px-5 py-2 text-sm font-semibold text-white hover:bg-[#162840] transition"
                    >
                      Apply
                    </button>
                  </div>
                  {referralApplied && <p className="mt-2 text-xs text-green-600">Referral code applied!</p>}
                  <p className="mt-2 text-xs text-slate-400">
                    Apply a code to get exclusive discounts on your first course.
                  </p>
                </div>
              </>
            )}
          </main>

          {/* Right — order summary */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-slate-800">Order Summary</h2>

              <div className="flex gap-3">
                <div className="h-16 w-16 shrink-0 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                  <svg className="h-7 w-7 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 leading-snug">
                    {exam ? `${exam.toUpperCase()} — ` : ""}{planName} Plan
                  </p>
                  <span className="mt-1 inline-block rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
                    {view === "netbanking" ? "Advanced Course" : "Premium Course"}
                  </span>
                </div>
              </div>

              {view === "netbanking" ? (
                <>
                  <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Course Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Processing Fee</span>
                      <span>$0.00</span>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-slate-100 pt-4 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-700">Total Amount</span>
                    <span className="text-2xl font-bold text-slate-900">${total.toFixed(2)}</span>
                  </div>
                  <button
                    type="button"
                    disabled={!selectedBank || loading}
                    onClick={handleComplete}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1D3557] py-3 text-sm font-bold text-white transition hover:bg-[#162840] disabled:opacity-50"
                  >
                    {loading ? "Processing…" : "Proceed to Pay"}
                    {!loading && (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    )}
                  </button>
                  <p className="mt-2 text-center text-[10px] text-slate-400">
                    By clicking &apos;Proceed to Pay&apos;, you agree to Cognitive Sanctuary&apos;s Terms of Service and Privacy Policy.
                  </p>
                </>
              ) : (
                <>
                  <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Original Price</span>
                      <span>${price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Platform Fee</span>
                      <span>${PLATFORM_FEE.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-green-600">
                      <span>Special Discount</span>
                      <span>-${DISCOUNT.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Amount</p>
                    <div className="flex items-end justify-between">
                      <span className="text-3xl font-bold text-slate-900">${total.toFixed(2)}</span>
                      <span className="text-xs text-slate-400">Tax included</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={!method || loading}
                    onClick={handleComplete}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1D3557] py-3 text-sm font-bold text-white transition hover:bg-[#162840] disabled:opacity-50"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    {loading ? "Processing…" : "Complete Purchase"}
                  </button>
                  <p className="mt-2 text-center text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Secure SSL Encrypted Checkout
                  </p>
                </>
              )}
            </div>

            {/* Money back */}
            {method !== "netbanking" && view !== "netbanking" && (
              <div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <svg className="h-5 w-5 shrink-0 text-brand mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Money-Back Guarantee</p>
                  <p className="text-xs text-slate-500 mt-0.5">Full refund within 30 days if you&apos;re not satisfied with the course content.</p>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}

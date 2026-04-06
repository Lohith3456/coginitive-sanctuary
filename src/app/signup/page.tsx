"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[1-9]\d{6,14}$/;

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"choose" | "email">("choose");

  // form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!EMAIL_REGEX.test(email)) e.email = "Enter a valid email address";
    if (phone && !PHONE_REGEX.test(phone.replace(/[\s\-()]/g, "")))
      e.phone = "Enter a valid phone number";
    if (password.length < 8) e.password = "Password must be at least 8 characters";
    return e;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) { setErrors(fieldErrors); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: phone || undefined, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.message?.toLowerCase().includes("email")) setErrors({ email: data.message });
        else if (data.message?.toLowerCase().includes("phone")) setErrors({ phone: data.message });
        else setErrors({ form: data.message || "Registration failed" });
        return;
      }
      router.push("/login?registered=1");
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  const inp = (err?: string) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#3B3FE4] focus:ring-4 focus:ring-[#3B3FE4]/10 ${err ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"}`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/" className="text-xl font-extrabold text-[#1D3557] tracking-tight">
            Cognitive Sanctuary
          </Link>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900">
            {step === "choose" ? "Welcome to Cognitive Sanctuary" : "Create your account"}
          </h1>
          <p className="mt-2 text-slate-400">
            {step === "choose" ? "Get started — it's free." : "Fill in your details below."}
          </p>
        </div>

        {step === "choose" ? (
          <div className="space-y-4">
            {/* Sign up with Email */}
            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full rounded-full bg-[#3B3FE4] py-4 text-sm font-extrabold uppercase tracking-widest text-white shadow-md transition hover:bg-[#2f33c8] active:scale-[0.98]"
            >
              Sign up with Email
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-sm text-slate-400">Or</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Sign up with Google */}
            <button
              type="button"
              onClick={() => {/* Google OAuth placeholder */}}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white py-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
            >
              {/* Google G icon */}
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>

            <p className="pt-2 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#3B3FE4] hover:underline">
                Log in
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Back */}
            <button
              type="button"
              onClick={() => { setStep("choose"); setErrors({}); }}
              className="mb-1 flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back
            </button>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label>
              <input type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson" className={inp(errors.name)} />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" className={inp(errors.email)} />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Phone <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210" className={inp(errors.phone)} />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className={`${inp(errors.password)} pr-11`}
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {errors.form && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{errors.form}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#3B3FE4] py-4 text-sm font-extrabold uppercase tracking-widest text-white shadow-md transition hover:bg-[#2f33c8] disabled:opacity-60 active:scale-[0.98]"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#3B3FE4] hover:underline">
                Log in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

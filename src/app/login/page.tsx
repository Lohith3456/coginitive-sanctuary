"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";

const ADMIN_EMAIL = "mothukurilohith2@gmail.com";
const ADMIN_PASSWORD = "Lohith@123";

const DEMO_EMAIL = "mothukurilohith3@gmail.com";
const DEMO_PASSWORD = "Lohith@123";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim().toLowerCase();

    // Admin login
    if (trimmed === ADMIN_EMAIL.toLowerCase()) {
      if (password !== ADMIN_PASSWORD) {
        setError("Invalid email or password.");
        return;
      }
      sessionStorage.setItem("admin-auth", "true");
      router.replace("/admin");
      return;
    }

    // Regular user login
    if (trimmed === DEMO_EMAIL.toLowerCase() && password === DEMO_PASSWORD) {
      router.push("/exams");
      return;
    }

    setError("Invalid email or password.");
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your preparation."
      footer={
        <p className="text-center text-sm text-slate-600">
          No account?{" "}
          <Link href="/signup" className="font-semibold text-brand hover:underline">
            Create one
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error ? (
          <p
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 shadow-sm outline-none ring-brand/20 transition focus:border-brand focus:ring-4"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 shadow-sm outline-none ring-brand/20 transition focus:border-brand focus:ring-4"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-brand py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-dark"
        >
          Sign in
        </button>
      </form>
    </AuthShell>
  );
}

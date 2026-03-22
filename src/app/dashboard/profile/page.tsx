import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-slate-200/80 bg-white p-8 shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
      <h1 className="text-2xl font-extrabold text-slate-900">Profile</h1>
      <p className="mt-2 text-sm text-slate-600">
        Account settings will live here. This is a static placeholder for now.
      </p>
      <dl className="mt-8 space-y-4 text-sm">
        <div>
          <dt className="font-semibold text-slate-500">Display name</dt>
          <dd className="mt-1 text-slate-900">Demo student</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Email</dt>
          <dd className="mt-1 text-slate-900">you@example.com</dd>
        </div>
      </dl>
      <Link
        href="/dashboard"
        className="mt-8 inline-block text-sm font-semibold text-[#1D63D1] hover:underline"
      >
        ← Back to dashboard
      </Link>
    </div>
  );
}

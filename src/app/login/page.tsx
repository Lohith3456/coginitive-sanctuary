'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    try {
      await login(
        fd.get('email') as string,
        fd.get('password') as string,
        fd.get('tenantSlug') as string
      );
      // redirect is handled by AuthContext consumer — check role after login
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/refresh`, {
        method: 'POST', credentials: 'include',
      });
      const data = await res.json();
      router.replace(data.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    } catch {
      setError('Invalid credentials');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input name="tenantSlug" placeholder="Organisation slug" required className="border p-2 rounded" />
        <input name="email" type="email" placeholder="Email" required className="border p-2 rounded" />
        <input name="password" type="password" placeholder="Password" required className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Sign in</button>
      </form>
    </main>
  );
}

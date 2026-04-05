'use client';

import Link from 'next/link';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AuthShell } from '@/components/auth/AuthShell';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+[1-9]\d{6,14}$/;
const ADMIN_EMAIL = 'mothukurilohith3@gmail.com';
const ADMIN_PASSWORD = 'Lohith@123';

type LoginMode = 'email' | 'phone';
type PhoneMethod = 'password' | 'otp';
type OtpStep = 'idle' | 'sent' | 'verified';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<LoginMode>('email');
  const [phoneMethod, setPhoneMethod] = useState<PhoneMethod>('password');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState<OtpStep>('idle');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === '1') {
      setSuccess('Account created! Please sign in.');
    }
  }, [searchParams]);

  function switchMode(m: LoginMode) {
    setMode(m);
    setIdentifier('');
    setPassword('');
    setOtp('');
    setOtpStep('idle');
    setError('');
  }

  function switchPhoneMethod(m: PhoneMethod) {
    setPhoneMethod(m);
    setPassword('');
    setOtp('');
    setOtpStep('idle');
    setError('');
  }

  const cleanPhone = () => identifier.replace(/[\s\-()]/g, '');

  // Send OTP
  async function handleSendOtp() {
    if (!PHONE_REGEX.test(cleanPhone())) {
      setError('Enter phone with country code (e.g. +917288822579)');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); return; }
      setOtpStep('sent');
      setSuccess('OTP sent to your phone.');
    } catch {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Verify OTP
  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) { setError('Enter the 6-digit OTP'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phone: cleanPhone(), otp }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); return; }
      router.replace(data.role === 'admin' ? '/admin/dashboard' : '/exams');
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Password login
  async function handlePasswordLogin(e: FormEvent) {
    e.preventDefault();
    if (mode === 'email' && !EMAIL_REGEX.test(identifier)) {
      setError('Enter a valid email address'); return;
    }
    if (mode === 'phone' && !PHONE_REGEX.test(cleanPhone())) {
      setError('Enter phone with country code (e.g. +917288822579)'); return;
    }
    if (!password) { setError('Password is required'); return; }
    setError('');
    setLoading(true);

    // Check hardcoded admin first
    if (mode === 'email' && identifier.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin-auth', 'true');
      router.replace('/admin');
      return;
    }

    try {
      const id = mode === 'email' ? { email: identifier } : { phone: cleanPhone() };
      const { role } = await login(id, password);
      router.replace(role === 'admin' ? '/admin' : '/exams');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const field = 'mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 shadow-sm outline-none ring-brand/20 transition focus:border-brand focus:ring-4';

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your account to continue."
      footer={
        <p className="text-center text-sm text-slate-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-brand hover:underline">Sign up</Link>
        </p>
      }
    >
      <div className="space-y-5">
        {/* Email / Phone toggle */}
        <div className="flex rounded-lg border border-slate-200 p-1 text-sm font-medium">
          {(['email', 'phone'] as LoginMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={`flex-1 rounded-md py-1.5 capitalize transition ${mode === m ? 'bg-brand text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Phone sub-toggle: Password vs OTP */}
        {mode === 'phone' && (
          <div className="flex rounded-lg border border-slate-200 p-1 text-sm font-medium">
            {(['password', 'otp'] as PhoneMethod[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchPhoneMethod(m)}
                className={`flex-1 rounded-md py-1.5 capitalize transition ${phoneMethod === m ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {m === 'otp' ? 'OTP' : 'Password'}
              </button>
            ))}
          </div>
        )}

        {/* OTP flow */}
        {mode === 'phone' && phoneMethod === 'otp' ? (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Phone number</label>
              <div className="mt-1.5 flex gap-2">
                <input
                  type="tel"
                  value={identifier}
                  onChange={(e) => { setIdentifier(e.target.value); setOtpStep('idle'); }}
                  disabled={otpStep === 'sent'}
                  className={`${field} flex-1`}
                  placeholder="+91 98765 43210"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading || otpStep === 'sent'}
                  className="rounded-lg bg-slate-700 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {otpStep === 'sent' ? 'Sent' : 'Send OTP'}
                </button>
              </div>
            </div>

            {otpStep === 'sent' && (
              <div>
                <label className="block text-sm font-medium text-slate-700">Enter OTP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className={field}
                  placeholder="6-digit code"
                />
                <button
                  type="button"
                  onClick={() => { setOtpStep('idle'); setOtp(''); setSuccess(''); }}
                  className="mt-1 text-xs text-brand hover:underline"
                >
                  Resend OTP
                </button>
              </div>
            )}

            {success && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>}
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

            {otpStep === 'sent' && (
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full rounded-lg bg-brand py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-dark disabled:opacity-60"
              >
                {loading ? 'Verifying…' : 'Verify & Sign in'}
              </button>
            )}
          </form>
        ) : (
          /* Password flow (email or phone) */
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                {mode === 'email' ? 'Email' : 'Phone number'}
              </label>
              <input
                type={mode === 'email' ? 'email' : 'tel'}
                autoComplete={mode === 'email' ? 'email' : 'tel'}
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className={field}
                placeholder={mode === 'email' ? 'you@example.com' : '+91 98765 43210'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 pr-10 text-slate-900 shadow-sm outline-none ring-brand/20 transition focus:border-brand focus:ring-4"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {success && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>}
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-dark disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}
      </div>
    </AuthShell>
  );
}

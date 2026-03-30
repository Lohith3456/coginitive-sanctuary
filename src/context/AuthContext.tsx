'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AuthUser {
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string, tenantSlug: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = useCallback(async (email: string, password: string, tenantSlug: string) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, tenantSlug }),
    });
    if (!res.ok) throw new Error('Invalid credentials');
    const data = await res.json();
    setUser({ email: data.email, role: data.role });
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    setUser(null);
  }, []);

  const refreshAuth = useCallback(async () => {
    const res = await fetch(`${API}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) { setUser(null); return; }
    const data = await res.json();
    setUser({ email: data.email, role: data.role });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

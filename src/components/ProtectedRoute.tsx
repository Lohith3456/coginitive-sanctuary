'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface Props {
  allowedRole: 'admin' | 'user';
  children: React.ReactNode;
}

export default function ProtectedRoute({ allowedRole, children }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.replace('/login');
    } else if (user.role !== allowedRole) {
      router.replace('/unauthorized');
    }
  }, [user, allowedRole, router]);

  if (!user || user.role !== allowedRole) return null;

  return <>{children}</>;
}

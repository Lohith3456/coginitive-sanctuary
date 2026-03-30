'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  return (
    <ProtectedRoute allowedRole="admin">
      <main className="p-8">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Logged in as {user?.email}</p>
        <button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </main>
    </ProtectedRoute>
  );
}

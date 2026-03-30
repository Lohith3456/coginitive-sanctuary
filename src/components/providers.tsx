"use client";

import { ExamProvider } from "@/context/exam-context";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ExamProvider>{children}</ExamProvider>
    </AuthProvider>
  );
}

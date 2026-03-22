"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ExamId = "IELTS" | "PTE" | "TOEFL" | "GRE";

type ExamContextValue = {
  selectedExam: ExamId | null;
  setSelectedExam: (exam: ExamId) => void;
  clearExam: () => void;
};

const STORAGE_KEY = "cognitive-sanctuary-exam";

const ExamContext = createContext<ExamContextValue | null>(null);

export function ExamProvider({ children }: { children: React.ReactNode }) {
  const [selectedExam, setSelectedExamState] = useState<ExamId | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (
        raw === "IELTS" ||
        raw === "PTE" ||
        raw === "TOEFL" ||
        raw === "GRE"
      ) {
        setSelectedExamState(raw);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setSelectedExam = useCallback((exam: ExamId) => {
    setSelectedExamState(exam);
    try {
      localStorage.setItem(STORAGE_KEY, exam);
    } catch {
      /* ignore */
    }
  }, []);

  const clearExam = useCallback(() => {
    setSelectedExamState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ selectedExam, setSelectedExam, clearExam }),
    [selectedExam, setSelectedExam, clearExam],
  );

  return (
    <ExamContext.Provider value={value}>{children}</ExamContext.Provider>
  );
}

export function useExam() {
  const ctx = useContext(ExamContext);
  if (!ctx) {
    throw new Error("useExam must be used within ExamProvider");
  }
  return ctx;
}

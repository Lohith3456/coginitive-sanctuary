"use client";

import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { useExam } from "@/context/exam-context";

export default function DashboardPage() {
  const { selectedExam } = useExam();
  return <DashboardHome exam={selectedExam} />;
}

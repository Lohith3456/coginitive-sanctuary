import type { ExamId } from "@/context/exam-context";

export type DashboardSectionRow = { name: string; pct: number };

export type DashboardScheduleItem = {
  month: string;
  day: string;
  title: string;
  sub: string;
};

export type RecentItem =
  | {
      kind: "tag";
      title: string;
      tag: string;
      tagTone: "success" | "pending";
    }
  | {
      kind: "words";
      title: string;
      words: string;
    };

export type DashboardExamContent = {
  avgScore: string;
  avgScoreCaption: string;
  daysLeft: number;
  sections: DashboardSectionRow[];
  subheadline: { before: string; highlight: string; after: string };
  continuePractice: string;
  mockDuration: string;
  schedule: DashboardScheduleItem[];
  recent: RecentItem[];
};

export const DASHBOARD_BY_EXAM: Record<ExamId, DashboardExamContent> = {
  IELTS: {
    avgScore: "7.5",
    avgScoreCaption: "Avg score (band)",
    daysLeft: 14,
    sections: [
      { name: "Reading", pct: 82 },
      { name: "Listening", pct: 65 },
      { name: "Writing", pct: 48 },
      { name: "Speaking", pct: 74 },
    ],
    subheadline: {
      before: "Your journey to a Band 8.0 starts here—focus on ",
      highlight: "Complex Writing Structures",
      after: " to unlock higher bands.",
    },
    continuePractice:
      "Resume your Writing Task 2 drill from earlier today.",
    mockDuration:
      "Simulate the real exam environment. 2h 45m duration.",
    schedule: [
      {
        month: "Oct",
        day: "14",
        title: "Speaking mock",
        sub: "15:00 · 25 min · Tutor-led",
      },
      {
        month: "Oct",
        day: "21",
        title: "Final full mock test",
        sub: "09:00 · Full length · Proctored",
      },
    ],
    recent: [
      {
        kind: "tag",
        title: "Reading practice #12",
        tag: "8.5 band",
        tagTone: "success",
      },
      {
        kind: "tag",
        title: "Writing Task 1 draft",
        tag: "Feedback pending",
        tagTone: "pending",
      },
      {
        kind: "words",
        title: "New vocabulary mastered",
        words: "“consequently”, “nevertheless”, “predominantly”",
      },
    ],
  },
  TOEFL: {
    avgScore: "102",
    avgScoreCaption: "Est. total (out of 120)",
    daysLeft: 21,
    sections: [
      { name: "Reading", pct: 78 },
      { name: "Listening", pct: 88 },
      { name: "Speaking", pct: 71 },
      { name: "Writing", pct: 69 },
    ],
    subheadline: {
      before: "iBT prep track—double down on ",
      highlight: "integrated speaking templates",
      after: " to lift your weakest subsection.",
    },
    continuePractice:
      "Pick up your integrated writing lecture summary from yesterday.",
    mockDuration:
      "Full TOEFL iBT-style flow. About 3h with break (demo timer).",
    schedule: [
      {
        month: "Oct",
        day: "16",
        title: "Speaking tasks 3–4 review",
        sub: "18:00 · 40 min · Zoom",
      },
      {
        month: "Oct",
        day: "23",
        title: "Complete iBT mock",
        sub: "10:00 · Proctored simulation",
      },
    ],
    recent: [
      {
        kind: "tag",
        title: "Listening set #6 (lectures)",
        tag: "28/30",
        tagTone: "success",
      },
      {
        kind: "tag",
        title: "Independent essay outline",
        tag: "Awaiting review",
        tagTone: "pending",
      },
      {
        kind: "words",
        title: "Academic word list",
        words: "“hypothesis”, “implication”, “framework”",
      },
    ],
  },
  PTE: {
    avgScore: "73",
    avgScoreCaption: "Est. overall (10–90)",
    daysLeft: 10,
    sections: [
      { name: "Speaking & writing", pct: 70 },
      { name: "Reading", pct: 76 },
      { name: "Listening", pct: 81 },
      { name: "Full mock pacing", pct: 64 },
    ],
    subheadline: {
      before: "Computer-delivered scoring rewards consistency—prioritize ",
      highlight: "Describe Image & WFD accuracy",
      after: " this week.",
    },
    continuePractice:
      "Continue Write from Dictation drills from your last session.",
    mockDuration:
      "Single-sitting PTE Academic-style mock. ~3h (demo).",
    schedule: [
      {
        month: "Oct",
        day: "15",
        title: "RA & RS intensive",
        sub: "17:30 · 45 min",
      },
      {
        month: "Oct",
        day: "22",
        title: "Full PTE mock",
        sub: "08:30 · Lab booking",
      },
    ],
    recent: [
      {
        kind: "tag",
        title: "Repeat sentence batch",
        tag: "88/90",
        tagTone: "success",
      },
      {
        kind: "tag",
        title: "Summarize written text",
        tag: "Scores pending",
        tagTone: "pending",
      },
      {
        kind: "words",
        title: "Collocation drills",
        words: "“significant impact”, “key determinant”",
      },
    ],
  },
  GRE: {
    avgScore: "318",
    avgScoreCaption: "Est. combined (V+Q)",
    daysLeft: 30,
    sections: [
      { name: "Verbal reasoning", pct: 72 },
      { name: "Quantitative reasoning", pct: 80 },
      { name: "Analytical writing", pct: 58 },
      { name: "Timed section stamina", pct: 66 },
    ],
    subheadline: {
      before: "Grad admissions path—strengthen ",
      highlight: "text completion & data interpretation",
      after: " before your next diagnostic.",
    },
    continuePractice:
      "Resume quant mixed practice set #4 (timed).",
    mockDuration:
      "GRE General-style mock with AW sections. ~3h 45m (demo).",
    schedule: [
      {
        month: "Oct",
        day: "18",
        title: "Verbal timed block",
        sub: "19:00 · 60 min",
      },
      {
        month: "Nov",
        day: "02",
        title: "Official-style full mock",
        sub: "09:00 · AW + Q + V",
      },
    ],
    recent: [
      {
        kind: "tag",
        title: "Verbal practice test B",
        tag: "162 V",
        tagTone: "success",
      },
      {
        kind: "tag",
        title: "Issue essay draft",
        tag: "Rubric review",
        tagTone: "pending",
      },
      {
        kind: "words",
        title: "High-yield vocab",
        words: "“mitigate”, “ubiquitous”, “paradox”",
      },
    ],
  },
};

export function dashboardContentForExam(
  exam: ExamId | null,
): DashboardExamContent | null {
  if (!exam) return null;
  return DASHBOARD_BY_EXAM[exam];
}

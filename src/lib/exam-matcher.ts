import type { ExamId } from "@/context/exam-context";

export type MatcherOption = {
  label: string;
  scores: Partial<Record<ExamId, number>>;
};

export type MatcherQuestion = {
  id: string;
  prompt: string;
  options: MatcherOption[];
};

const ALL: ExamId[] = ["IELTS", "PTE", "TOEFL", "GRE"];

export const EXAM_MATCHER_QUESTIONS: MatcherQuestion[] = [
  {
    id: "goal",
    prompt: "What is your main reason for taking an English proficiency test?",
    options: [
      {
        label: "University study (undergraduate or general graduate)",
        scores: { IELTS: 3, TOEFL: 3, PTE: 2, GRE: 1 },
      },
      {
        label: "Graduate school in the US (MS, PhD, or research programs)",
        scores: { TOEFL: 4, GRE: 5, IELTS: 2, PTE: 1 },
      },
      {
        label: "Migration, PR, or work visa (e.g. Australia, Canada, NZ)",
        scores: { IELTS: 4, PTE: 4, TOEFL: 2, GRE: 0 },
      },
      {
        label: "Professional registration or employer requirement",
        scores: { IELTS: 4, TOEFL: 2, PTE: 3, GRE: 0 },
      },
    ],
  },
  {
    id: "region",
    prompt: "Where are you mainly planning to study or immigrate?",
    options: [
      {
        label: "United States",
        scores: { TOEFL: 5, GRE: 3, IELTS: 2, PTE: 1 },
      },
      {
        label: "United Kingdom, Ireland, or EU (English-taught)",
        scores: { IELTS: 5, TOEFL: 2, PTE: 1, GRE: 2 },
      },
      {
        label: "Australia or New Zealand",
        scores: { PTE: 5, IELTS: 4, TOEFL: 1, GRE: 0 },
      },
      {
        label: "Canada or still deciding / multiple regions",
        scores: { IELTS: 3, TOEFL: 3, PTE: 2, GRE: 1 },
      },
    ],
  },
  {
    id: "format",
    prompt: "Which test style do you prefer for speaking?",
    options: [
      {
        label: "Live conversation with a human examiner",
        scores: { IELTS: 5, TOEFL: 2, PTE: 1, GRE: 0 },
      },
      {
        label: "Recorded responses into a microphone (computer-based)",
        scores: { PTE: 5, TOEFL: 4, IELTS: 2, GRE: 0 },
      },
      {
        label: "Integrated tasks (listen/read, then speak or write)",
        scores: { TOEFL: 4, PTE: 3, IELTS: 2, GRE: 0 },
      },
      {
        label: "No preference—I’ll adapt to any format",
        scores: { IELTS: 2, TOEFL: 2, PTE: 2, GRE: 1 },
      },
    ],
  },
  {
    id: "timeline",
    prompt: "How quickly do you need official scores?",
    options: [
      {
        label: "Within a few days (fast turnaround matters)",
        scores: { PTE: 5, TOEFL: 3, IELTS: 2, GRE: 2 },
      },
      {
        label: "Within 2–3 weeks",
        scores: { IELTS: 3, TOEFL: 3, PTE: 3, GRE: 3 },
      },
      {
        label: "I have a month or more",
        scores: { GRE: 4, IELTS: 3, TOEFL: 3, PTE: 2 },
      },
      {
        label: "Not sure yet",
        scores: { IELTS: 2, TOEFL: 2, PTE: 2, GRE: 2 },
      },
    ],
  },
  {
    id: "skills",
    prompt: "Where do you feel most confident today?",
    options: [
      {
        label: "Reading long academic texts",
        scores: { GRE: 4, IELTS: 3, TOEFL: 3, PTE: 2 },
      },
      {
        label: "Writing structured essays or arguments",
        scores: { IELTS: 3, TOEFL: 3, GRE: 4, PTE: 2 },
      },
      {
        label: "Listening to lectures or conversations",
        scores: { TOEFL: 4, IELTS: 3, PTE: 3, GRE: 1 },
      },
      {
        label: "Speaking under time pressure",
        scores: { PTE: 4, TOEFL: 3, IELTS: 3, GRE: 0 },
      },
    ],
  },
  {
    id: "gre",
    prompt: "Are you applying to programs that require a graduate admissions test (e.g. GRE)?",
    options: [
      {
        label: "Yes—likely US graduate or competitive STEM/business programs",
        scores: { GRE: 6, TOEFL: 2, IELTS: 1, PTE: 0 },
      },
      {
        label: "Maybe later, but English test is my priority now",
        scores: { IELTS: 3, TOEFL: 3, PTE: 2, GRE: 2 },
      },
      {
        label: "No—only an English proficiency score is required",
        scores: { IELTS: 3, TOEFL: 3, PTE: 3, GRE: 0 },
      },
      {
        label: "I don’t know yet",
        scores: { IELTS: 2, TOEFL: 2, PTE: 2, GRE: 1 },
      },
    ],
  },
];

export type MatcherResultRow = {
  exam: ExamId;
  points: number;
  percent: number;
};

export function computeMatcherResults(
  choiceIndexes: (number | null)[],
): MatcherResultRow[] {
  const totals: Record<ExamId, number> = {
    IELTS: 0,
    PTE: 0,
    TOEFL: 0,
    GRE: 0,
  };

  EXAM_MATCHER_QUESTIONS.forEach((q, qi) => {
    const idx = choiceIndexes[qi];
    if (idx === null || idx === undefined) return;
    const opt = q.options[idx];
    if (!opt) return;
    ALL.forEach((exam) => {
      const add = opt.scores[exam] ?? 0;
      totals[exam] += add;
    });
  });

  const sum = ALL.reduce((s, e) => s + totals[e], 0);
  if (sum <= 0) {
    return ALL.map((exam) => ({
      exam,
      points: 1,
      percent: 25,
    }));
  }

  const rows = ALL.map((exam) => ({
    exam,
    points: totals[exam],
    raw: (totals[exam] / sum) * 100,
  })).sort((a, b) => b.points - a.points);

  const rounded = rows.map((r) => ({ ...r, percent: Math.floor(r.raw) }));
  let drift = 100 - rounded.reduce((s, r) => s + r.percent, 0);
  for (let i = 0; drift > 0 && i < rounded.length; i++) {
    rounded[i].percent += 1;
    drift -= 1;
  }

  return rounded.map(({ exam, points, percent }) => ({
    exam,
    points,
    percent,
  }));
}

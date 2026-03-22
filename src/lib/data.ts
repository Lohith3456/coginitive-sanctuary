import type { ExamId } from "@/context/exam-context";

export const EXAMS: {
  id: ExamId;
  title: string;
  description: string;
}[] = [
  {
    id: "IELTS",
    title: "IELTS",
    description:
      "Academic and General Training paths with full-length mocks, band descriptors, and timed writing feedback.",
  },
  {
    id: "PTE",
    title: "PTE",
    description:
      "Computer-delivered practice aligned to PTE Academic scoring: speaking, writing, reading, and listening.",
  },
  {
    id: "TOEFL",
    title: "TOEFL",
    description:
      "iBT-style tasks, integrated skills, and vocabulary drills built for university admissions readiness.",
  },
  {
    id: "GRE",
    title: "GRE",
    description:
      "Quantitative reasoning, verbal, and analytical writing with adaptive difficulty-style practice sets.",
  },
];

export type PracticeSection = "Reading" | "Writing" | "Listening" | "Speaking";

export type ExamModuleInfo = {
  title: string;
  description: string;
  /** Deep-link to practice tab when applicable */
  practiceSection?: PracticeSection;
};

/** Skills/modules available for each exam (static demo copy). */
export const EXAM_MODULES: Record<ExamId, ExamModuleInfo[]> = {
  IELTS: [
    {
      title: "Reading",
      description:
        "Academic passages, matching headings, T/F/NG, and summary completion with band-aligned explanations.",
      practiceSection: "Reading",
    },
    {
      title: "Listening",
      description:
        "Four sections including conversations and lectures, with note-taking and map/diagram labelling tasks.",
      practiceSection: "Listening",
    },
    {
      title: "Writing",
      description:
        "Task 1 (report/letter) and Task 2 essays with timed prompts, structure guides, and model answers.",
      practiceSection: "Writing",
    },
    {
      title: "Speaking",
      description:
        "Parts 1–3: interview, long turn, and discussion with cue cards and pronunciation checkpoints.",
      practiceSection: "Speaking",
    },
  ],
  PTE: [
    {
      title: "Speaking & writing",
      description:
        "Read aloud, repeat sentence, describe image, retell lecture, and SWOT-style integrated writing.",
      practiceSection: "Speaking",
    },
    {
      title: "Reading",
      description:
        "Multiple-choice, reorder paragraphs, and fill-in blanks with academic and general texts.",
      practiceSection: "Reading",
    },
    {
      title: "Listening",
      description:
        "Summarize spoken text, highlight incorrect words, and write from dictation under timed conditions.",
      practiceSection: "Listening",
    },
    {
      title: "Full mock",
      description:
        "Single-sitting PTE-style flow to build stamina for the computer-delivered test experience.",
    },
  ],
  TOEFL: [
    {
      title: "Reading",
      description:
        "Academic passages with vocabulary, inference, and summary questions in iBT timing.",
      practiceSection: "Reading",
    },
    {
      title: "Listening",
      description:
        "Lectures and campus conversations; note-taking practice for main idea and detail items.",
      practiceSection: "Listening",
    },
    {
      title: "Speaking",
      description:
        "Independent and integrated tasks with prep/beep timing and response planning templates.",
      practiceSection: "Speaking",
    },
    {
      title: "Writing",
      description:
        "Integrated (read/listen/write) and independent essays with rubric-based self-review.",
      practiceSection: "Writing",
    },
  ],
  GRE: [
    {
      title: "Verbal reasoning",
      description:
        "Text completion, sentence equivalence, and reading comprehension with vocab in context.",
      practiceSection: "Reading",
    },
    {
      title: "Quantitative reasoning",
      description:
        "Arithmetic, algebra, geometry, and data interpretation with calculator-aware strategies.",
    },
    {
      title: "Analytical writing",
      description:
        "Analyze an issue and an argument with timed outlines, thesis drills, and sample responses.",
      practiceSection: "Writing",
    },
  ],
};

export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  period: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
  cta: string;
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 29,
    period: "/mo",
    features: [
      "Core practice questions",
      "Section-level analytics",
      "Mobile-friendly study mode",
    ],
    cta: "Choose Basic",
  },
  {
    id: "professional",
    name: "Professional",
    price: 59,
    period: "/mo",
    highlight: true,
    badge: "MOST POPULAR",
    features: [
      "Everything in Basic",
      "Full mock simulations",
      "Personalized study plan",
      "Priority email support",
    ],
    cta: "Go Professional",
  },
  {
    id: "elite",
    name: "Elite",
    price: 99,
    period: "/mo",
    features: [
      "Everything in Professional",
      "1:1 office hours (monthly)",
      "Essay reviews with rubric",
    ],
    cta: "Choose Elite",
  },
];

/** Dummy multiplier so pricing page reflects selected exam */
export function examPriceAdjust(exam: ExamId | null): number {
  if (!exam) return 0;
  const map: Record<ExamId, number> = {
    IELTS: 0,
    PTE: 5,
    TOEFL: 3,
    GRE: 8,
  };
  return map[exam];
}

export const PRACTICE_SECTIONS: PracticeSection[] = [
  "Reading",
  "Writing",
  "Listening",
  "Speaking",
];

export type Question = {
  id: string;
  section: PracticeSection;
  prompt: string;
  options: string[];
  correctIndex: number;
};

export function isExamIdString(s: string | null): s is ExamId {
  return (
    s === "IELTS" || s === "PTE" || s === "TOEFL" || s === "GRE"
  );
}

/** Practice items tailored to each exam (static demo). */
export const PRACTICE_QUESTIONS_BY_EXAM: Record<ExamId, Question[]> = {
  IELTS: [
    {
      id: "ielts-r1",
      section: "Reading",
      prompt:
        "IELTS Academic: What is the writer’s main purpose in paragraph 2?",
      options: [
        "To argue against urban expansion",
        "To explain how green corridors benefit residents",
        "To compare two cities’ transport policies",
        "To define technical terms for specialists only",
      ],
      correctIndex: 1,
    },
    {
      id: "ielts-w1",
      section: "Writing",
      prompt:
        "Which sentence best fits Task 2 academic style for discussing causes?",
      options: [
        "Stuff happens for many reasons lol.",
        "Several factors may contribute to this trend, including economic pressure and policy shifts.",
        "I think maybe it’s because of things.",
        "The graph goes up so people are happy.",
      ],
      correctIndex: 1,
    },
    {
      id: "ielts-l1",
      section: "Listening",
      prompt:
        "(Section 3) The tutor suggests the student should first focus on which skill?",
      options: [
        "Memorising long vocabulary lists",
        "Identifying signpost language in lectures",
        "Skipping difficult questions entirely",
        "Writing full essays under 20 minutes",
      ],
      correctIndex: 1,
    },
    {
      id: "ielts-s1",
      section: "Speaking",
      prompt:
        "Part 2 cue card: Describe a skill you learned. Which opening is most coherent?",
      options: [
        "Um… I forgot the question.",
        "I’d like to talk about learning to swim, which I picked up during a summer course.",
        "Next.",
        "The answer is swimming because B.",
      ],
      correctIndex: 1,
    },
  ],
  PTE: [
    {
      id: "pte-r1",
      section: "Reading",
      prompt:
        "PTE Reading: Choose the word that best fits: \"The findings were largely ___, challenging earlier assumptions.\"",
      options: ["unanimous", "contradictory", "irrelevant", "redundant"],
      correctIndex: 1,
    },
    {
      id: "pte-w1",
      section: "Writing",
      prompt:
        "Summarize written text: Which sentence preserves key ideas without copying phrasing?",
      options: [
        "The passage says exactly the same words again.",
        "The author argues that remote work boosts retention but requires clear communication norms.",
        "There is a text and it is long.",
        "In conclusion, the writer likes words.",
      ],
      correctIndex: 1,
    },
    {
      id: "pte-l1",
      section: "Listening",
      prompt:
        "(Dictation-style) You hear: \"Please submit the revised budget by Friday.\" What is the deadline?",
      options: ["Monday", "Wednesday", "Friday", "Next month"],
      correctIndex: 2,
    },
    {
      id: "pte-s1",
      section: "Speaking",
      prompt:
        "Read aloud: Which delivery best matches clear PTE oral fluency?",
      options: [
        "Mumbling quickly with no pauses",
        "Steady pace, clear stress on content words, natural phrase breaks",
        "Robot monotone with long gaps",
        "Skipping the final sentence",
      ],
      correctIndex: 1,
    },
  ],
  TOEFL: [
    {
      id: "toefl-r1",
      section: "Reading",
      prompt:
        "TOEFL iBT: The word \"inherent\" in paragraph 3 is closest in meaning to:",
      options: ["external", "built-in", "temporary", "unlikely"],
      correctIndex: 1,
    },
    {
      id: "toefl-w1",
      section: "Writing",
      prompt:
        "Integrated writing: What should you prioritise when summarising the lecture?",
      options: [
        "Copying the reading introduction",
        "Showing how the lecture challenges or extends specific reading claims",
        "Giving your personal opinion only",
        "Listing random vocabulary",
      ],
      correctIndex: 1,
    },
    {
      id: "toefl-l1",
      section: "Listening",
      prompt:
        "(Conversation) Why does the student visit the registrar’s office?",
      options: [
        "To drop a major",
        "To request a transcript for an internship application",
        "To complain about dining hall food",
        "To enrol in a closed studio art class without permission",
      ],
      correctIndex: 1,
    },
    {
      id: "toefl-s1",
      section: "Speaking",
      prompt:
        "Independent speaking: Which response best states a clear position with brief support?",
      options: [
        "I have no idea.",
        "I prefer small classes because discussions stay focused and I get faster feedback.",
        "Small big large medium.",
        "Repeat the prompt only.",
      ],
      correctIndex: 1,
    },
  ],
  GRE: [
    {
      id: "gre-r1",
      section: "Reading",
      prompt:
        "GRE Verbal (text completion): \"The professor’s manner was deceptively ___, masking a sharp analytical mind.\"",
      options: ["volatile", "affable", "obtuse", "verbose"],
      correctIndex: 1,
    },
    {
      id: "gre-w1",
      section: "Writing",
      prompt:
        "Analyze an Argument: Which approach strengthens your critique?",
      options: [
        "Attack the author personally",
        "Identify unstated assumptions and question whether evidence supports the conclusion",
        "Agree with every premise",
        "Replace the argument with unrelated statistics",
      ],
      correctIndex: 1,
    },
    {
      id: "gre-l1",
      section: "Listening",
      prompt:
        "GRE Quant (practice item): If x² − 5x + 6 = 0, what is the sum of the solutions?",
      options: ["2", "3", "5", "6"],
      correctIndex: 2,
    },
    {
      id: "gre-s1",
      section: "Speaking",
      prompt:
        "Note: GRE has no speaking section—this tab shows a timed reasoning warm-up. Which pair of numbers has a product of 24 and sum of 10?",
      options: [
        "3 and 8",
        "4 and 6",
        "2 and 12",
        "1 and 24",
      ],
      correctIndex: 1,
    },
  ],
};

export function practiceQuestionsForExam(exam: ExamId | null): Question[] {
  const key = exam ?? "IELTS";
  return PRACTICE_QUESTIONS_BY_EXAM[key];
}

export type MockQuestion = {
  id: number;
  text: string;
  options: string[];
};

export const MOCK_QUESTIONS: MockQuestion[] = Array.from(
  { length: 8 },
  (_, i) => ({
    id: i + 1,
    text: `Question ${i + 1}: Select the best completion for the sentence based on standard ${["reading", "listening", "grammar", "vocabulary"][i % 4]} conventions.`,
    options: ["Option A", "Option B", "Option C", "Option D"],
  }),
);

export const DASHBOARD_PROGRESS = {
  overall: 68,
  sections: [
    { name: "Reading", value: 72 },
    { name: "Writing", value: 61 },
    { name: "Listening", value: 70 },
    { name: "Speaking", value: 58 },
  ],
};

export const MOCK_RESULTS = {
  totalScore: "7.5",
  totalLabel: "Estimated band (demo)",
  sections: [
    { name: "Reading", score: "8.0", detail: "Strong inference skills" },
    { name: "Writing", score: "7.0", detail: "Cohesion could improve" },
    { name: "Listening", score: "7.5", detail: "Accurate on lectures" },
    { name: "Speaking", score: "7.5", detail: "Good fluency" },
  ],
};

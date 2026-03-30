export type ClassSession = {
  id: string;
  title: string;
  subtitle: string;
  instructor: string;
  totalDurationMin: number;
  /** Short line shown under the video frame */
  videoDescription: string;
};

export const CLASS_SESSIONS: ClassSession[] = [
  {
    id: "c1",
    title: "Reading strategies — skimming & scanning",
    subtitle: "Session 3 · Foundation track",
    instructor: "Dr. A. Menon",
    totalDurationMin: 52,
    videoDescription:
      "Recorded live session: walkthrough of two academic passages with timed drills.",
  },
  {
    id: "c2",
    title: "Writing Task 2 — argument structure",
    subtitle: "Session 5 · Writing intensive",
    instructor: "J. Park",
    totalDurationMin: 48,
    videoDescription:
      "Build a clear thesis, body paragraphs, and counter-argument in 40 minutes.",
  },
  {
    id: "c3",
    title: "Listening — lecture signposting",
    subtitle: "Session 2 · Listening lab",
    instructor: "M. Torres",
    totalDurationMin: 45,
    videoDescription:
      "Identify main ideas vs. supporting examples in university-style lectures.",
  },
];

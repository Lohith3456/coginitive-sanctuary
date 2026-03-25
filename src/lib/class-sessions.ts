export type LessonStatus = "completed" | "active" | "upcoming";

export type SubTab = "video" | "practice";

export type Lesson = {
  id: string;
  title: string;
  durationMin: number;
  instructor: string;
  status: LessonStatus;
  badge: string;
  description: string;
  videoCount: number;
  practiceCount: number;
};

export type LessonPlan = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export const LESSON_PLANS: LessonPlan[] = [
  {
    id: "reading",
    title: "Reading Lesson Plan",
    lessons: [
      {
        id: "r1", title: "Reading Introduction", durationMin: 20,
        instructor: "Dr. A. Menon", status: "completed", badge: "MASTERCLASS",
        description: "An overview of the IELTS Reading module, question types, and time management strategies.",
        videoCount: 1, practiceCount: 2,
      },
      {
        id: "r2", title: "Reading Marking & Techniques", durationMin: 25,
        instructor: "Dr. A. Menon", status: "completed", badge: "MASTERCLASS",
        description: "Learn how answers are marked and which techniques consistently score higher bands.",
        videoCount: 1, practiceCount: 3,
      },
      {
        id: "r3", title: "Time Management & Reading", durationMin: 22,
        instructor: "Dr. A. Menon", status: "completed", badge: "WORKSHOP",
        description: "Strategies for allocating time across three passages without losing accuracy.",
        videoCount: 1, practiceCount: 2,
      },
      {
        id: "r4", title: "Short Answer", durationMin: 25,
        instructor: "Priya Trivedi", status: "active", badge: "MASTERCLASS",
        description: "Discover strategies for quickly locating answers to short-answer questions.",
        videoCount: 1, practiceCount: 2,
      },
      {
        id: "r5", title: "Sentence Completion", durationMin: 28,
        instructor: "Priya Trivedi", status: "upcoming", badge: "WORKSHOP",
        description: "Fill-in-the-blank sentence tasks with grammar and word-limit rules.",
        videoCount: 1, practiceCount: 3,
      },
      {
        id: "r6", title: "Summary Completion", durationMin: 30,
        instructor: "Priya Trivedi", status: "upcoming", badge: "MASTERCLASS",
        description: "Complete summaries using words from the passage within strict word limits.",
        videoCount: 1, practiceCount: 2,
      },
      {
        id: "r7", title: "Flow Chart Completion", durationMin: 25,
        instructor: "Dr. A. Menon", status: "upcoming", badge: "WORKSHOP",
        description: "Trace processes and sequences described in academic texts.",
        videoCount: 1, practiceCount: 2,
      },
      {
        id: "r8", title: "MCQ", durationMin: 30,
        instructor: "Priya Trivedi", status: "upcoming", badge: "MASTERCLASS",
        description: "Multiple-choice questions targeting main ideas, details, and writer's views.",
        videoCount: 1, practiceCount: 3,
      },
      {
        id: "r9", title: "Diagram Labelling", durationMin: 22,
        instructor: "Dr. A. Menon", status: "upcoming", badge: "WORKSHOP",
        description: "Label diagrams and maps using information from the reading passage.",
        videoCount: 1, practiceCount: 2,
      },
      {
        id: "r10", title: "Matching Heading", durationMin: 35,
        instructor: "Priya Trivedi", status: "upcoming", badge: "MASTERCLASS",
        description: "Match headings to paragraphs by identifying the main idea of each section.",
        videoCount: 1, practiceCount: 3,
      },
      {
        id: "r11", title: "Global Question", durationMin: 20,
        instructor: "Dr. A. Menon", status: "upcoming", badge: "WORKSHOP",
        description: "Answer questions about the overall purpose or structure of the passage.",
        videoCount: 1, practiceCount: 2,
      },
      {
        id: "r12", title: "Matching Information", durationMin: 28,
        instructor: "Priya Trivedi", status: "upcoming", badge: "MASTERCLASS",
        description: "Locate specific information in paragraphs and match it to given statements.",
        videoCount: 1, practiceCount: 2,
      },
      {
        id: "r13", title: "True/False/Not Given", durationMin: 32,
        instructor: "Dr. A. Menon", status: "upcoming", badge: "MASTERCLASS",
        description: "Distinguish between what the passage states, contradicts, or doesn't mention.",
        videoCount: 1, practiceCount: 3,
      },
    ],
  },
  {
    id: "writing",
    title: "Writing Lesson Plan",
    lessons: [
      {
        id: "w1", title: "Writing Introduction", durationMin: 18,
        instructor: "J. Park", status: "completed", badge: "MASTERCLASS",
        description: "Overview of Task 1 and Task 2, scoring criteria, and common mistakes.",
        videoCount: 1, practiceCount: 2,
      },
      {
        id: "w2", title: "Task 2 Argument Structure", durationMin: 48,
        instructor: "J. Park", status: "active", badge: "WORKSHOP",
        description: "Build a clear thesis, body paragraphs, and counter-argument in 40 minutes.",
        videoCount: 1, practiceCount: 3,
      },
      {
        id: "w3", title: "Task 1 Report Writing", durationMin: 35,
        instructor: "J. Park", status: "upcoming", badge: "MASTERCLASS",
        description: "Describe graphs, charts, and diagrams with accurate language and structure.",
        videoCount: 1, practiceCount: 2,
      },
    ],
  },
  {
    id: "listening",
    title: "Listening Lesson Plan",
    lessons: [
      {
        id: "l1", title: "Listening Introduction", durationMin: 15,
        instructor: "M. Torres", status: "completed", badge: "MASTERCLASS",
        description: "Overview of the four listening sections and question types.",
        videoCount: 1, practiceCount: 2,
      },
      {
        id: "l2", title: "Lecture Signposting", durationMin: 45,
        instructor: "M. Torres", status: "active", badge: "MASTERCLASS",
        description: "Identify structural cues and emphasis markers in academic lectures.",
        videoCount: 1, practiceCount: 2,
      },
      {
        id: "l3", title: "Note-taking Systems", durationMin: 32,
        instructor: "M. Torres", status: "upcoming", badge: "WORKSHOP",
        description: "Develop efficient shorthand and note-taking strategies for fast audio.",
        videoCount: 1, practiceCount: 3,
      },
    ],
  },
];

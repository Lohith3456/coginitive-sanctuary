"use client";

import { useState, useRef } from "react";
import { useParams, notFound } from "next/navigation";
import {
  DndContext, closestCenter, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ── Exam meta ─────────────────────────────────────────────────────────── */
const EXAM_META: Record<string, { label: string; description: string; modules: string[] }> = {
  ielts: {
    label: "IELTS",
    description: "Configure and manage classes, practice exercises, and mock tests for the IELTS track.",
    modules: ["Reading", "Writing", "Listening", "Speaking"],
  },
  pte: {
    label: "PTE",
    description: "Configure and manage classes, practice exercises, and mock tests for the PTE Academic track.",
    modules: ["Speaking & Writing", "Reading", "Listening", "Full Mock"],
  },
  toefl: {
    label: "TOEFL",
    description: "Configure and manage classes, practice exercises, and mock tests for the TOEFL iBT track.",
    modules: ["Reading", "Listening", "Speaking", "Writing"],
  },
  gre: {
    label: "GRE",
    description: "Configure and manage classes, practice exercises, and mock tests for the GRE track.",
    modules: ["Verbal Reasoning", "Quantitative", "Analytical Writing", "Full Mock"],
  },
};

/* ── Types ─────────────────────────────────────────────────────────────── */
type LessonType = "video" | "reading";
type Tab = "Classes" | "Practice" | "Mock Tests";

interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  type: LessonType;
  videoUrl?: string;
  fileName?: string;
}

// moduleKey → tab → lessons
type ModuleData = Record<Tab, Lesson[]>;
type ExamData   = Record<string, ModuleData>;

function emptyModule(): ModuleData {
  return { Classes: [], Practice: [], "Mock Tests": [] };
}

function buildSeed(modules: string[]): ExamData {
  const data: ExamData = {};
  modules.forEach((m) => { data[m] = emptyModule(); });
  // seed first module with sample lessons
  if (modules[0]) {
    data[modules[0]].Classes = [
      { id: "s1", title: `Introduction to ${modules[0]}`, subtitle: "Video Lesson • 15:00 mins", type: "video" },
      { id: "s2", title: `${modules[0]} Core Vocabulary`,  subtitle: "Reading Resource • 10 Pages", type: "reading" },
    ];
  }
  return data;
}

/* ── Sortable lesson card ───────────────────────────────────────────────── */
function SortableLesson({ lesson, index, onDelete, onEdit }: {
  lesson: Lesson; index: number;
  onDelete: (id: string) => void; onEdit: (l: Lesson) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lesson.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className="flex items-center gap-4"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 bg-white text-sm font-bold text-slate-600 select-none">
        {String(index + 1).padStart(2, "0")}
      </div>
      <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <button type="button" {...attributes} {...listeners}
          className="cursor-grab touch-none text-slate-300 hover:text-slate-500 active:cursor-grabbing" aria-label="Drag">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-100">
          {lesson.type === "video" ? (
            <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1D3557] truncate">{lesson.title}</p>
          <p className="text-xs text-slate-400">{lesson.subtitle}</p>
          {lesson.fileName && <p className="text-xs text-teal-600 mt-0.5 truncate">📎 {lesson.fileName}</p>}
        </div>
        <button type="button" onClick={() => onEdit(lesson)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
        </button>
        <button type="button" onClick={() => onDelete(lesson.id)}
          className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ── Lesson modal ───────────────────────────────────────────────────────── */
function LessonModal({ initial, onSave, onClose }: {
  initial?: Lesson; onSave: (l: Lesson) => void; onClose: () => void;
}) {
  const [title, setTitle]     = useState(initial?.title ?? "");
  const [type, setType]       = useState<LessonType>(initial?.type ?? "video");
  const [videoUrl, setVideoUrl] = useState(initial?.videoUrl);
  const [fileName, setFileName] = useState(initial?.fileName);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("video/")) return;
    setVideoUrl(URL.createObjectURL(file));
    setFileName(file.name);
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: initial?.id ?? String(Date.now()),
      title: title.trim(),
      subtitle: type === "video" ? `Video Lesson${fileName ? ` • ${fileName}` : ""}` : "Reading Resource",
      type, videoUrl, fileName,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-[#1D3557]">{initial ? "Edit Lesson" : "Add New Lesson"}</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Lesson Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Introduction to Reading Strategies"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#1D63D1] focus:ring-2 focus:ring-[#1D63D1]/20" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Lesson Type</label>
            <div className="flex gap-2">
              {(["video", "reading"] as LessonType[]).map((t) => (
                <button key={t} type="button" onClick={() => setType(t)}
                  className={`flex-1 rounded-lg border py-2 text-sm font-semibold transition ${
                    type === t ? "border-[#1D63D1] bg-[#EEF3FB] text-[#1D63D1]" : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}>
                  {t === "video" ? "🎬 Video" : "📄 Reading"}
                </button>
              ))}
            </div>
          </div>
          {type === "video" && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Upload Video</label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                onClick={() => fileRef.current?.click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition ${
                  dragOver ? "border-[#1D63D1] bg-[#EEF3FB]" : "border-slate-200 hover:border-[#1D63D1] hover:bg-slate-50"
                }`}
              >
                {videoUrl ? (
                  <video src={videoUrl} controls className="mx-auto max-h-40 rounded-lg" onClick={(e) => e.stopPropagation()} />
                ) : (
                  <>
                    <svg className="mx-auto h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <p className="mt-2 text-sm text-slate-500">Drag & drop or <span className="font-semibold text-[#1D63D1]">browse</span></p>
                    <p className="mt-0.5 text-xs text-slate-400">MP4, MOV, WebM</p>
                  </>
                )}
                <input ref={fileRef} type="file" accept="video/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </div>
              {fileName && <p className="mt-1.5 text-xs text-teal-600">✓ {fileName}</p>}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button type="button" onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={!title.trim()}
            className="rounded-lg bg-[#1D3557] px-4 py-2 text-sm font-semibold text-white hover:bg-[#16293f] disabled:opacity-50 transition">
            {initial ? "Save Changes" : "Add Lesson"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Lesson sequence builder (per module + tab) ─────────────────────────── */
function SequenceBuilder({ lessons, moduleLabel, onUpdate }: {
  lessons: Lesson[]; moduleLabel: string; onUpdate: (lessons: Lesson[]) => void;
}) {
  const [modal, setModal] = useState<{ open: boolean; editing?: Lesson }>({ open: false });
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      const oldIdx = lessons.findIndex((l) => l.id === active.id);
      const newIdx = lessons.findIndex((l) => l.id === over.id);
      onUpdate(arrayMove(lessons, oldIdx, newIdx));
    }
  };

  const handleSave = (lesson: Lesson) => {
    onUpdate(
      modal.editing
        ? lessons.map((l) => (l.id === lesson.id ? lesson : l))
        : [...lessons, lesson],
    );
    setModal({ open: false });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-[#F0F4FA] p-6">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-[#1D3557]">Lesson Sequence Builder</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Module: <span className="font-semibold text-[#1D63D1]">{moduleLabel}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 italic">Drag to reorder</span>
          <button type="button"
            className="flex items-center gap-2 rounded-lg bg-[#1D3557] px-4 py-2 text-sm font-semibold text-white hover:bg-[#16293f] transition">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Save Flow
          </button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={lessons.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {lessons.map((lesson, idx) => (
              <SortableLesson key={lesson.id} lesson={lesson} index={idx}
                onDelete={(id) => onUpdate(lessons.filter((l) => l.id !== id))}
                onEdit={(l) => setModal({ open: true, editing: l })} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-3 flex items-center gap-4">
        <button type="button" onClick={() => setModal({ open: true })}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-white text-slate-400 hover:border-[#1D63D1] hover:text-[#1D63D1] transition">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
        <button type="button" onClick={() => setModal({ open: true })}
          className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white py-4 text-sm text-slate-400 hover:border-[#1D63D1] hover:text-[#1D63D1] transition">
          Click to add next lesson or assessment
        </button>
      </div>

      {modal.open && (
        <LessonModal initial={modal.editing} onSave={handleSave} onClose={() => setModal({ open: false })} />
      )}
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────────── */
export default function ExamManagementPage() {
  const params  = useParams();
  const examId  = (params?.examId as string)?.toLowerCase();
  const meta    = EXAM_META[examId];
  if (!meta) return notFound();

  const [activeModule, setActiveModule] = useState(meta.modules[0]);
  const [activeTab, setActiveTab]       = useState<Tab>("Classes");
  const [examData, setExamData]         = useState<ExamData>(() => buildSeed(meta.modules));

  const updateLessons = (mod: string, tab: Tab, lessons: Lesson[]) => {
    setExamData((prev) => ({
      ...prev,
      [mod]: { ...prev[mod], [tab]: lessons },
    }));
  };

  const lessons = examData[activeModule]?.[activeTab] ?? [];

  return (
    <div className="max-w-[900px] space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1D3557]">{meta.label} Management</h1>
          <p className="mt-1.5 max-w-xl text-sm text-slate-500">{meta.description}</p>
        </div>
        <button type="button"
          className="flex items-center gap-2 rounded-lg bg-[#1D3557] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#16293f] transition">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add New
        </button>
      </div>

      {/* Module selector */}
      <div className="flex gap-2 flex-wrap">
        {meta.modules.map((mod) => (
          <button key={mod} type="button" onClick={() => { setActiveModule(mod); setActiveTab("Classes"); }}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
              activeModule === mod
                ? "border-[#1D63D1] bg-[#1D63D1] text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#1D63D1] hover:text-[#1D63D1]"
            }`}>
            {mod}
          </button>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
        {(["Classes", "Practice", "Mock Tests"] as Tab[]).map((tab) => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
              activeTab === tab
                ? "bg-white text-[#1D3557] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Sequence builder — keyed so it resets scroll on module/tab change */}
      <SequenceBuilder
        key={`${activeModule}-${activeTab}`}
        lessons={lessons}
        moduleLabel={`${activeModule} — ${activeTab}`}
        onUpdate={(updated) => updateLessons(activeModule, activeTab, updated)}
      />
    </div>
  );
}

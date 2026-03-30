"use client";

import { useState, useRef } from "react";
import {
  DndContext, closestCenter, PointerSensor,
  useSensor, useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ── Types ──────────────────────────────────────────────────────────────── */
export type LessonType = "video" | "reading" | "audio";
export type Tab = "Classes" | "Practice" | "Mock Tests" | "Resources";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: LessonType;
  duration?: string;
  videoUrl?: string;
  fileName?: string;
}

export interface ExamManagerProps {
  examLabel: string;
  examDescription: string;
  tabs?: Tab[];
  courseFocus?: string;
}

type TabData = Record<Tab, Lesson[]>;

const DEFAULT_TABS: Tab[] = ["Classes", "Practice", "Mock Tests", "Resources"];

function initTabData(tabs: Tab[]): TabData {
  const d = {} as TabData;
  tabs.forEach((t) => (d[t] = []));
  return d;
}

/* ── Lesson type icon ───────────────────────────────────────────────────── */
function LessonIcon({ type }: { type: LessonType }) {
  const base = "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100";
  if (type === "video")
    return (
      <div className={base}>
        <svg className="h-5 w-5 text-[#1D3557]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125v-5.25A2.25 2.25 0 014.5 11.25h15A2.25 2.25 0 0121.75 13.5v5.25m-18.375.125A1.125 1.125 0 013.375 19.5m0 0h17.25m0 0a1.125 1.125 0 001.125-1.125M21.75 19.5v-5.25m0 5.25a1.125 1.125 0 001.125-1.125M21.75 14.25v-3a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 002.25 11.25v3" />
        </svg>
      </div>
    );
  if (type === "audio")
    return (
      <div className={base}>
        <svg className="h-5 w-5 text-[#1D3557]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
      </div>
    );
  return (
    <div className={base}>
      <svg className="h-5 w-5 text-[#1D3557]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    </div>
  );
}

/* ── Sortable row ───────────────────────────────────────────────────────── */
function SortableRow({ lesson, index, onEdit, onDelete }: {
  lesson: Lesson; index: number;
  onEdit: (l: Lesson) => void; onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lesson.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className="flex items-center gap-4"
    >
      {/* Step bubble */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1D3557] text-xs font-bold text-white select-none">
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Card */}
      <div className="flex flex-1 items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
        {/* Drag handle */}
        <button type="button" {...attributes} {...listeners}
          className="cursor-grab touch-none text-slate-300 hover:text-slate-500 active:cursor-grabbing shrink-0" aria-label="Drag">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <LessonIcon type={lesson.type} />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1D3557]">{lesson.title}</p>
          <p className="text-xs text-slate-400 mt-0.5 truncate">{lesson.description}</p>
        </div>

        <button type="button" onClick={() => onEdit(lesson)}
          className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
        </button>
        <button type="button" onClick={() => onDelete(lesson.id)}
          className="shrink-0 rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ── Add/Edit modal ─────────────────────────────────────────────────────── */
function LessonModal({ initial, onSave, onClose }: {
  initial?: Lesson; onSave: (l: Lesson) => void; onClose: () => void;
}) {
  const [title, setTitle]       = useState(initial?.title ?? "");
  const [desc, setDesc]         = useState(initial?.description ?? "");
  const [duration, setDuration] = useState(initial?.duration ?? "");
  const [type, setType]         = useState<LessonType>(initial?.type ?? "video");
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
    const subtitle = [
      type === "video" ? "Video Lesson" : type === "audio" ? "Interactive Audio" : "Reading Resource",
      duration ? `${duration} mins` : null,
      desc.trim() || null,
    ].filter(Boolean).join(" • ");
    onSave({
      id: initial?.id ?? String(Date.now()),
      title: title.trim(),
      description: subtitle,
      type, duration, videoUrl, fileName,
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
          {/* Title */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Lesson Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Introduction to IELTS Format"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#1D63D1] focus:ring-2 focus:ring-[#1D63D1]/20" />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Description</label>
            <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)}
              placeholder="e.g. Fundamental understanding of the 4 sub-tests."
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#1D63D1] focus:ring-2 focus:ring-[#1D63D1]/20" />
          </div>

          {/* Type + Duration row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-semibold text-slate-600">Type</label>
              <div className="flex gap-1.5">
                {(["video", "reading", "audio"] as LessonType[]).map((t) => (
                  <button key={t} type="button" onClick={() => setType(t)}
                    className={`flex-1 rounded-lg border py-2 text-xs font-semibold capitalize transition ${
                      type === t ? "border-[#1D63D1] bg-[#EEF3FB] text-[#1D63D1]" : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}>
                    {t === "video" ? "🎬" : t === "audio" ? "🎧" : "📄"} {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-28">
              <label className="mb-1 block text-xs font-semibold text-slate-600">Duration (mins)</label>
              <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)}
                placeholder="15:00"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#1D63D1] focus:ring-2 focus:ring-[#1D63D1]/20" />
            </div>
          </div>

          {/* Video upload */}
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
                  <video src={videoUrl} controls className="mx-auto max-h-36 rounded-lg" onClick={(e) => e.stopPropagation()} />
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

/* ── ExamManager (reusable) ─────────────────────────────────────────────── */
export function ExamManager({
  examLabel,
  examDescription,
  tabs = DEFAULT_TABS,
  courseFocus = "ACADEMIC MODULE",
}: ExamManagerProps) {
  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);
  const [tabData, setTabData]     = useState<TabData>(() => initTabData(tabs));
  const [modal, setModal]         = useState<{ open: boolean; editing?: Lesson }>({ open: false });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const lessons = tabData[activeTab] ?? [];

  const updateLessons = (next: Lesson[]) =>
    setTabData((prev) => ({ ...prev, [activeTab]: next }));

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      const oi = lessons.findIndex((l) => l.id === active.id);
      const ni = lessons.findIndex((l) => l.id === over.id);
      updateLessons(arrayMove(lessons, oi, ni));
    }
  };

  const handleSave = (lesson: Lesson) => {
    updateLessons(
      modal.editing
        ? lessons.map((l) => (l.id === lesson.id ? lesson : l))
        : [...lessons, lesson],
    );
    setModal({ open: false });
  };

  const totalDuration = lessons
    .map((l) => {
      const m = l.duration?.match(/(\d+)/);
      return m ? parseInt(m[1]) : 0;
    })
    .reduce((a, b) => a + b, 0);

  const hrs  = Math.floor(totalDuration / 60);
  const mins = totalDuration % 60;
  const durationLabel = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

  return (
    <div className="max-w-[860px] space-y-0">
      {/* Header */}
      <div className="flex items-start justify-between pb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#1D3557]">{examLabel} Management</h1>
          <p className="mt-1.5 max-w-lg text-sm text-slate-500">{examDescription}</p>
        </div>
        <button type="button" onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 rounded-xl bg-[#1D3557] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#16293f] transition">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add New Module
        </button>
      </div>

      {/* Tab bar — underline style */}
      <div className="flex border-b border-slate-200">
        {tabs.map((tab) => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-semibold transition border-b-2 -mb-px ${
              activeTab === tab
                ? "border-[#1D63D1] text-[#1D63D1]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Sequence builder card */}
      <div className="mt-5 rounded-2xl border border-slate-200 bg-[#F5F7FA] p-6">
        {/* Builder header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1D3557]">Lesson Sequence Builder</h2>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            Course Focus:
            <span className="rounded-full bg-teal-400/20 px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-teal-700">
              {courseFocus}
            </span>
          </div>
        </div>

        {/* Sortable list */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={lessons.map((l) => l.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {lessons.map((lesson, idx) => (
                <SortableRow key={lesson.id} lesson={lesson} index={idx}
                  onEdit={(l) => setModal({ open: true, editing: l })}
                  onDelete={(id) => updateLessons(lessons.filter((l) => l.id !== id))} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Add row */}
        <div className="mt-3 flex items-center gap-4">
          <button type="button" onClick={() => setModal({ open: true })}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-white text-slate-400 hover:border-[#1D63D1] hover:text-[#1D63D1] transition">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
          <button type="button" onClick={() => setModal({ open: true })}
            className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white py-6 text-sm text-slate-400 hover:border-[#1D63D1] hover:text-[#1D63D1] transition">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Click to add next lesson or assessment
          </button>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <div>
              <span className="text-xs text-slate-400">Total Duration</span>
              <p className="font-bold text-[#1D3557]">{lessons.length ? durationLabel : "—"}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Resources</span>
              <p className="font-bold text-[#1D3557]">{lessons.length} Assets</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => updateLessons([])}
              className="text-sm font-semibold text-slate-500 hover:text-red-500 transition">
              Discard Draft
            </button>
            <button type="button"
              className="rounded-xl bg-[#1D3557] px-5 py-2 text-sm font-semibold text-white hover:bg-[#16293f] transition">
              Save Sequence
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal.open && (
        <LessonModal initial={modal.editing} onSave={handleSave} onClose={() => setModal({ open: false })} />
      )}
    </div>
  );
}

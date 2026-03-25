"use client";
import { useState, useRef } from "react";

export type LessonType = "video" | "reading" | "audio";

export interface Lesson {
  id: string;
  title: string;
  detail: string;
  type: LessonType;
  videoUrl?: string;
  fileName?: string;
}

export function LessonModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Lesson;
  onSave: (l: Lesson) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [detail, setDetail] = useState(initial?.detail ?? "");
  const [type, setType] = useState<LessonType>(initial?.type ?? "video");
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
      detail: detail.trim() || (type === "video" ? "Video Lesson" : type === "audio" ? "Interactive Audio" : "Reading Resource"),
      type,
      videoUrl,
      fileName,
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
              placeholder="e.g. Introduction to IELTS Format"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#1D63D1] focus:ring-2 focus:ring-[#1D63D1]/20" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Detail / Description</label>
            <input type="text" value={detail} onChange={(e) => setDetail(e.target.value)}
              placeholder="e.g. Video Lesson • 15:00 mins • Fundamental understanding"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#1D63D1] focus:ring-2 focus:ring-[#1D63D1]/20" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Type</label>
            <div className="flex gap-2">
              {(["video", "reading", "audio"] as LessonType[]).map((t) => (
                <button key={t} type="button" onClick={() => setType(t)}
                  className={`flex-1 rounded-lg border py-2 text-xs font-semibold capitalize transition ${
                    type === t ? "border-[#1D63D1] bg-[#EEF3FB] text-[#1D63D1]" : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}>
                  {t === "video" ? "🎬 Video" : t === "audio" ? "🎧 Audio" : "📄 Reading"}
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

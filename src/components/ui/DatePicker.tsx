"use client";

import { useState } from "react";

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  min?: string;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function DatePicker({
  value = "",
  onChange,
  min,
  placeholder = "Select date",
  label,
  className = "",
}: DatePickerProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-600">{label}</label>
      )}
      <div
        className={`flex items-center gap-2 rounded-lg border bg-white px-3 py-2 transition ${
          focused
            ? "border-[#1D63D1] ring-2 ring-[#1D63D1]/20"
            : "border-slate-200"
        }`}
      >
        <svg
          className="h-4 w-4 shrink-0 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.75}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
          />
        </svg>
        <input
          type="date"
          value={value}
          min={min}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder-slate-400"
        />
      </div>
    </div>
  );
}

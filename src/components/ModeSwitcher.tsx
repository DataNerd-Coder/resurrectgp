"use client";

import type { Mode } from "@/lib/gpa";

const MODES: { id: Mode; label: string; domId: string }[] = [
  { id: "semester", label: "Semester", domId: "semBtn" },
  { id: "cgpa", label: "CGPA", domId: "cgpaBtn" },
  { id: "result", label: "Result", domId: "resultBtn" },
  { id: "roadmap", label: "Roadmap", domId: "roadmapBtn" },
];

interface ModeSwitcherProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

export function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
        {MODES.map((item) => (
          <button
            key={item.id}
            id={item.domId}
            onClick={() => onChange(item.id)}
            className={`mode-btn px-4 py-2 text-[10px] font-bold uppercase rounded-lg transition whitespace-nowrap ${
              mode === item.id ? "active" : ""
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

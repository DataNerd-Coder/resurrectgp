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
    <div
      role="tablist"
      aria-label="Planner mode"
      className="border-b border-[#e6e6e6] no-scrollbar overflow-x-auto"
    >
      <div className="flex gap-6 min-w-max">
        {MODES.map((item) => (
          <button
            key={item.id}
            id={item.domId}
            role="tab"
            aria-selected={mode === item.id}
            onClick={() => onChange(item.id)}
            className={`mode-btn pb-2 whitespace-nowrap ${
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

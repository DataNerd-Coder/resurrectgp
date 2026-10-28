"use client";

import { getClass, roadmapVerdict } from "@/lib/gpa";
import type { RoadmapResult, RoadmapStep } from "@/lib/gpa";

interface RoadmapSectionProps {
  steps: RoadmapStep[];
  result: RoadmapResult;
  target: number;
  onStepChange: (index: number, value: string) => void;
}

export function RoadmapSection({
  steps,
  result,
  target,
  onStepChange,
}: RoadmapSectionProps) {
  const classInfo = getClass(result.final);
  const verdict = roadmapVerdict(result.gap);
  const gapText = `${result.gap >= 0 ? "+" : ""}${result.gap.toFixed(2)}`;

  return (
    <div
      id="roadmapSection"
      className="app-panel p-8 rounded-2xl animate-fade shadow-sm"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Your Comeback Trail
        </h2>
        <span
          id="roadmapFinalBadge"
          className={`class-badge ${classInfo.style}`}
        >
          {classInfo.name}
        </span>
      </div>

      <div className="ml-6 space-y-8 relative" id="roadmapContainer">
        {steps.map((step, index) => (
          <div
            key={step.level}
            className="roadmap-step relative pl-4 pb-2 animate-fade"
          >
            <div className="roadmap-dot" />
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
              <label className="text-xs font-bold text-slate-500 uppercase">
                {step.level}
              </label>
              <input
                type="number"
                step="0.01"
                value={step.value}
                onChange={(e) => onStepChange(index, e.target.value)}
                className="roadmap-input w-20 text-right bg-white border border-slate-200 rounded p-1 text-sm font-bold"
              />
            </div>
          </div>
        ))}
      </div>

      <div
        id="roadmapStatusBox"
        className="mt-10 p-8 bg-slate-950 rounded-2xl text-white shadow-2xl border-l-8 border-slate-800"
        style={{ borderLeftColor: verdict.color }}
      >
        <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
          <div>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">
              System Verdict
            </p>
            <h3
              id="roadmapVerdict"
              className="text-xl font-black italic uppercase tracking-tighter"
            >
              {verdict.label}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">
              Point Gap
            </p>
            <p
              id="roadmapGap"
              className="text-sm font-mono font-bold text-slate-300"
            >
              {gapText}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Projected CGPA
            </p>
            <p id="roadmapFinalGpa" className="text-5xl font-black">
              {result.final.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Target
            </p>
            <p
              id="roadmapInitialTargetDisplay"
              className="text-2xl font-bold opacity-30 italic"
            >
              {target.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

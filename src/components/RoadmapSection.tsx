"use client";

import { roadmapVerdict } from "@/lib/gpa";
import type { RoadmapResult, RoadmapStep } from "@/lib/gpa";

interface RoadmapSectionProps {
  steps: RoadmapStep[];
  result: RoadmapResult;
  target: number;
  onStepChange: (index: number, value: string) => void;
}

const VERDICT_PILL: Record<string, { bg: string; ink: string }> = {
  "#2e7d32": { bg: "var(--pill-positive-bg)", ink: "var(--pill-positive-ink)" },
  "#92400e": { bg: "var(--pill-warning-bg)", ink: "var(--pill-warning-ink)" },
  "#c4242a": { bg: "var(--pill-negative-bg)", ink: "var(--pill-negative-ink)" },
};

export function RoadmapSection({
  steps,
  result,
  target,
  onStepChange,
}: RoadmapSectionProps) {
  const verdict = roadmapVerdict(result.gap);
  const pill = VERDICT_PILL[verdict.color] ?? VERDICT_PILL["#92400e"];
  const gapText = `${result.gap >= 0 ? "+" : ""}${result.gap.toFixed(2)}`;
  const gapOk = result.gap >= 0;

  return (
    <div
      id="roadmapSection"
      className="app-panel p-6 animate-fade space-y-6"
    >
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="card-title mb-1">Your comeback trail</h2>
          <p className="text-xs text-[#6b6b6b]">
            One average per semester, from level{" "}
            {steps[0]?.level ?? ""} to {steps[steps.length - 1]?.level ?? ""}. To land on{" "}
            {target.toFixed(2)}, these average{" "}
            <span className="num text-[#3d3d3d]">
              {(
                steps.reduce((sum, s) => sum + (parseFloat(s.value) || 0), 0) /
                (steps.length || 1)
              ).toFixed(2)}
            </span>
            .
          </p>
        </div>
        <span
          id="roadmapFinalBadge"
          className="class-badge"
          style={{ background: pill.bg, color: pill.ink }}
        >
          {verdict.label}
        </span>
      </div>

      <div id="roadmapContainer">
        {steps.map((step, index) => (
          <div
            key={step.level}
            className="roadmap-step relative pl-8 pb-5 last:pb-0 animate-fade"
          >
            <div className="roadmap-dot" />
            <div className="flex justify-between items-center gap-4 border-b border-[#f0f0f0] py-3">
              <span className="mono-label text-sm text-[#3d3d3d]">
                {step.level}
              </span>
              <input
                type="number"
                step="0.01"
                inputMode="decimal"
                aria-label={`Target GPA for ${step.level}`}
                value={step.value}
                onChange={(e) => onStepChange(index, e.target.value)}
                className="roadmap-input w-24 h-9 text-right bg-white border border-[#8f8f8f] rounded-md px-2 text-sm num focus:border-[#1d5fbf] outline-none"
              />
            </div>
          </div>
        ))}
      </div>

      <div
        id="roadmapStatusBox"
        className="border border-[#e6e6e6] rounded-lg p-6 no-shadow"
      >
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1">
            <p className="text-xs text-[#6b6b6b] mb-2">Projected CGPA</p>
            <p
              id="roadmapFinalGpa"
              className="text-[30px] leading-none num text-[#1d5fbf]"
            >
              {result.final.toFixed(2)}
            </p>
          </div>
          <div className="col-span-1">
            <p className="text-xs text-[#6b6b6b] mb-2">Milestone</p>
            <p
              id="roadmapInitialTargetDisplay"
              className="text-[30px] leading-none num"
            >
              {target.toFixed(2)}
            </p>
          </div>
          <div className="col-span-1 text-right">
            <p className="text-xs text-[#6b6b6b] mb-2">
              Point gap vs milestone
            </p>
            <p
              id="roadmapGap"
              className="text-[18px] leading-none num"
              style={{
                color: gapOk ? "var(--positive)" : "var(--negative)",
              }}
            >
              {gapText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

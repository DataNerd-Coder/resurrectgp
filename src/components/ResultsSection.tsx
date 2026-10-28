"use client";

import type { RefObject } from "react";
import { getClass, GRADE_POINTS } from "@/lib/gpa";
import type { ResultPayload } from "@/lib/gpa";

interface ResultsSectionProps {
  result: ResultPayload;
  captureRef: RefObject<HTMLDivElement | null>;
  onDownload: () => void;
  onShare: () => void;
  saving?: boolean;
}

/** Position of a GPA value (0 - 5) along the 5.0 scale track, as a percent. */
const pct = (gpa: number) => `${Math.min(Math.max(gpa, 0), 5) * 20}%`;

export function ResultsSection({
  result,
  captureRef,
  onDownload,
  onShare,
  saving = false,
}: ResultsSectionProps) {
  const classInfo = getClass(result.finalGpa);
  const aCount = result.courses.filter(
    (c) => GRADE_POINTS[c.grade as keyof typeof GRADE_POINTS] === 5,
  ).length;

  return (
    <div id="resultsSection" className="animate-fade space-y-5">
      <div
        id="capture-area"
        ref={captureRef}
        className="app-panel overflow-hidden"
      >
        <div className="flex items-baseline justify-between gap-4 px-6 pt-5 pb-4 border-b border-[#e6e6e6]">
          <div>
            <h2 className="card-title mb-1">Resurrection blueprint</h2>
            <p className="text-xs text-[#6b6b6b]">
              {aCount > 0
                ? `You need ${aCount} A${aCount > 1 ? "s" : ""} to land this plan.`
                : "Every grade the plan assigns is shown on the row."}
            </p>
          </div>
          <span className="mono-label text-xs text-[#3d3d3d]">
            Scale 5.00
          </span>
        </div>

        <table className="w-full table-fixed">
          <thead>
            <tr>
              <th className="px-6 py-3 text-xs font-normal text-[#6b6b6b] text-left w-1/2">
                Course
              </th>
              <th className="px-6 py-3 text-xs font-normal text-[#6b6b6b] text-right w-1/4">
                Units
              </th>
              <th className="px-6 py-3 text-xs font-normal text-[#6b6b6b] text-right w-1/4">
                Grade
              </th>
            </tr>
          </thead>
          <tbody id="roadmapTableBody">
            {result.courses.map((course) => (
              <tr
                key={course.id}
                className="border-t border-[#f0f0f0] first:border-t-0"
              >
                <td className="px-6 py-3">
                  <span className="mono-label text-sm text-[#3d3d3d]">
                    Course {String(course.id).padStart(2, "0")}
                  </span>
                </td>
                <td className="px-6 py-3 text-right num text-sm text-[#6b6b6b]">
                  {course.units}
                </td>
                <td className="px-6 py-3 text-right">
                  <span className="grade-tag num">{course.grade}</span>
                  <span className="ml-2 text-xs text-[#6b6b6b] num">
                    {course.points.toFixed(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-6 py-5 border-t border-[#e6e6e6]">
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-xs text-[#6b6b6b]">
              Projected outcome
            </span>
            <div className="flex items-baseline gap-3">
              <span
                id="projectedGpa"
                className="text-[30px] leading-none font-normal num text-[#1d5fbf]"
              >
                {result.finalGpa.toFixed(2)}
              </span>
              <span
                id="classBadge"
                className="class-badge"
                style={{
                  background: "var(--pill-neutral-bg)",
                  color: "var(--pill-neutral-ink)",
                }}
              >
                {classInfo.name}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex justify-between text-xs text-[#6b6b6b] num mb-2">
              <span>0.00 · Pass</span>
              <span>2.40 · 2:2</span>
              <span>3.50 · 2:1</span>
              <span>4.50 · First class</span>
            </div>
            <div className="scale-track">
              <div
                className="scale-tick bg-[#1d5fbf]"
                style={{ left: pct(result.finalGpa) }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onDownload}
          disabled={saving}
          aria-busy={saving}
          className="flex-1 h-10 bg-[#141414] text-white text-sm font-medium rounded-md hover:bg-[#333333] active:bg-[#0a0a0a] transition bg-color disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save result"}
        </button>
        <button
          onClick={onShare}
          className="h-10 px-4 bg-[#ffffff] text-sm font-medium text-[#0a0a0a] border border-[#8f8f8f] rounded-md hover:border-[#0a0a0a] hover:bg-[#f0f0f0] active:bg-[#eeeeee] transition border-color sm:w-auto flex items-center justify-center gap-2"
        >
          Share on WhatsApp
        </button>
      </div>
    </div>
  );
}

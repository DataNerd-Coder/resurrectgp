"use client";

import type { RefObject } from "react";
import { getClass } from "@/lib/gpa";
import type { ResultPayload } from "@/lib/gpa";

interface ResultsSectionProps {
  result: ResultPayload;
  captureRef: RefObject<HTMLDivElement | null>;
  onDownload: () => void;
  onShare: () => void;
}

export function ResultsSection({
  result,
  captureRef,
  onDownload,
  onShare,
}: ResultsSectionProps) {
  const classInfo = getClass(result.finalGpa);

  return (
    <div id="resultsSection" className="animate-fade space-y-6">
      <div
        id="capture-area"
        ref={captureRef}
        className="space-y-6 bg-[#f1f5f9] p-2 rounded-2xl"
      >
        <div className="app-panel rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left table-fixed">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase w-1/2">
                  Course
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center w-1/4">
                  Unit
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right w-1/4">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody id="roadmapTableBody" className="divide-y divide-slate-100">
              {result.courses.map((course) => {
                const tagStyle =
                  course.grade === "A"
                    ? "bg-slate-900 text-white"
                    : course.grade === "B"
                      ? "bg-slate-600 text-white"
                      : "bg-slate-200 text-slate-800";

                return (
                  <tr key={course.id}>
                    <td className="px-6 py-5 font-semibold text-sm">
                      Course {course.id}
                    </td>
                    <td className="px-6 py-5 text-center text-slate-500 text-sm">
                      {course.units} Units
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className={`grade-tag ${tagStyle}`}>
                        {course.grade}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="bg-slate-50 p-6 flex justify-between items-center border-t border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Projected Outcome
              </span>
              <div className="flex items-center gap-3">
                <span
                  id="projectedGpa"
                  className="text-3xl font-bold text-slate-950"
                >
                  {result.finalGpa.toFixed(2)}
                </span>
                <span id="classBadge" className={`class-badge ${classInfo.style}`}>
                  {classInfo.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onDownload}
          className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition"
        >
          Save Result
        </button>
        <button
          onClick={onShare}
          className="sm:w-auto bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.004 4.008a7.992 7.992 0 00-6.143 2.872.75.75 0 01-1.147-.968A9.492 9.492 0 0112.004 2.508c5.247 0 9.5 4.253 9.5 9.5s-4.253 9.5-9.5 9.5a9.492 9.492 0 01-7.29-3.404.75.75 0 111.147-.968 7.992 7.992 0 106.143-12.628zm-5.636 12.358a.75.75 0 01-.131 1.05 9.467 9.467 0 01-2.031 1.4.75.75 0 11-.643-1.356c.642-.303 1.251-.663 1.815-1.071a.75.75 0 01.99.077zm-2.16-9.734a.75.75 0 111.238-.847c-.452.66-.827 1.373-1.114 2.128a.75.75 0 11-1.408-.517 9.49 9.49 0 011.284-2.764z" />
          </svg>
          Share on WhatsApp
        </button>
      </div>
    </div>
  );
}

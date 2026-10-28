"use client";

import { GRADES, GRADE_POINTS } from "@/lib/gpa";
import type { Course, Mode } from "@/lib/gpa";

interface CourseGridProps {
  mode: Mode;
  courses: Course[];
  onChange: (courses: Course[]) => void;
  onCalculate: () => void;
}

export function CourseGrid({
  mode,
  courses,
  onChange,
  onCalculate,
}: CourseGridProps) {
  const updateUnits = (index: number, raw: string) => {
    const units = parseInt(raw, 10) || 0;
    onChange(courses.map((c, i) => (i === index ? { ...c, units } : c)));
  };

  const updateGrade = (index: number, grade: Course["grade"]) => {
    onChange(
      courses.map((c, i) =>
        i === index ? { ...c, grade, points: GRADE_POINTS[grade] } : c,
      ),
    );
  };

  return (
    <div
      id="courseSection"
      className="app-panel p-6 animate-fade"
    >
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <h2 id="sectionTitle" className="card-title">
          Course ledger
        </h2>
        <span id="courseTotal" className="text-xs text-[#6b6b6b] num">
          {courses.length} courses ·{" "}
          {courses.reduce((sum, c) => sum + c.units, 0)} units
        </span>
      </div>

      <div id="courseGrid">
        <div className="grid grid-cols-[minmax(0,1fr)_80px_72px] gap-2 px-2 pb-2 border-b border-[#e6e6e6] sm:grid-cols-[1fr_112px_88px] sm:gap-3 sm:px-3">
          <span className="text-xs text-[#6b6b6b]">Course</span>
          <span className="text-xs text-[#6b6b6b] text-right">
            Units
          </span>
          <span className="text-xs text-[#6b6b6b] text-right">
            Grade
          </span>
        </div>
        {courses.map((course, index) => (
          <div
            key={course.id}
            className="grid grid-cols-[minmax(0,1fr)_80px_72px] gap-2 px-2 h-11 items-center border-b border-[#f0f0f0] last:border-b-0 sm:grid-cols-[1fr_112px_88px] sm:gap-3 sm:px-3"
          >
            <span className="mono-label text-sm text-[#3d3d3d]">
              Course {String(course.id).padStart(2, "0")}
            </span>
            <input
              type="number"
              inputMode="numeric"
              aria-label={`Units for course ${course.id}`}
              value={course.units}
              onChange={(e) => updateUnits(index, e.target.value)}
              className="course-unit-input h-8 w-full bg-transparent border border-[#8f8f8f] rounded-md px-2 text-sm text-right num focus:border-[#0a0a0a] outline-none"
              data-index={course.id}
            />
            {mode === "result" ? (
              <select
                aria-label={`Grade for course ${course.id}`}
                value={course.grade}
                onChange={(e) =>
                  updateGrade(index, e.target.value as Course["grade"])
                }
                className="course-grade-input h-8 w-full bg-transparent border border-[#8f8f8f] rounded-md px-1.5 text-sm cursor-pointer text-right num focus:border-[#0a0a0a] outline-none"
              >
                {GRADES.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-sm text-[#6b6b6b] text-right pr-2">
                —
              </span>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onCalculate}
        className="mt-6 w-full h-10 bg-[#141414] text-white text-sm font-medium rounded-md hover:bg-[#333333] active:bg-[#0a0a0a] transition bg-color"
      >
        {mode === "result" ? "Compute result" : "Calculate comeback"}
      </button>
    </div>
  );
}

"use client";

import { GRADES, GRADE_POINTS } from "@/lib/gpa";
import type { Course, Grade, Mode } from "@/lib/gpa";

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

  const updateGrade = (index: number, grade: Grade) => {
    onChange(
      courses.map((c, i) =>
        i === index ? { ...c, grade, points: GRADE_POINTS[grade] } : c,
      ),
    );
  };

  return (
    <div
      id="courseSection"
      className="app-panel p-8 rounded-2xl animate-fade shadow-sm"
    >
      <h2
        id="sectionTitle"
        className="text-lg font-semibold text-slate-900 mb-6"
      >
        Unit Configuration
      </h2>
      <div id="courseGrid" className="grid grid-cols-2 gap-3 mb-8">
        {courses.map((course, index) => (
          <div
            key={course.id}
            className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between gap-2 shadow-sm"
          >
            <div className="flex-1 min-w-0">
              <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">
                C{course.id} Units
              </label>
              <input
                type="number"
                value={course.units}
                onChange={(e) => updateUnits(index, e.target.value)}
                className="course-unit-input w-full bg-transparent text-base font-semibold outline-none"
                data-index={course.id}
              />
            </div>
            {mode === "result" && (
              <div className="w-16 flex-shrink-0 border-l border-slate-200 pl-2">
                <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5 text-right">
                  Grade
                </label>
                <select
                  value={course.grade}
                  onChange={(e) =>
                    updateGrade(index, e.target.value as Grade)
                  }
                  className="course-grade-input w-full bg-transparent text-base font-bold outline-none cursor-pointer text-right text-blue-600"
                >
                  {GRADES.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={onCalculate}
        className="w-full bg-slate-950 text-white py-4 rounded-xl font-semibold hover:bg-slate-800 transition"
      >
        Calculate Comeback
      </button>
    </div>
  );
}

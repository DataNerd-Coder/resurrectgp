"use client";

import type { Mode } from "@/lib/gpa";

export interface SetupState {
  numCourses: number;
  targetGpa: string;
  currentGpa: string;
  totalUnitsPassed: string;
  fromLevel: number;
  toLevel: number;
  roadmapCurrentGpa: string;
  roadmapTargetGpa: string;
}

interface SetupPanelProps {
  mode: Mode;
  value: SetupState;
  onChange: (patch: Partial<SetupState>) => void;
  onStart: () => void;
  error?: string | null;
}

export function SetupPanel({
  mode,
  value,
  onChange,
  onStart,
  error,
}: SetupPanelProps) {
  return (
    <div
      id="setupPanel"
      className="app-panel p-6 space-y-5 animate-fade"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="card-title">Setup</h2>
        <span className="text-xs text-[#6b6b6b]">
          {mode === "roadmap"
            ? "Semester-by-semester plan"
            : mode === "cgpa"
              ? "Cumulative recovery"
              : mode === "result"
                ? "Enter your results"
                : "One semester, per-course marks"}
        </span>
      </div>

      {mode !== "roadmap" && (
        <div
          id="standardInputs"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {mode === "cgpa" && (
            <>
              <div id="cgpaInputs">
                <label htmlFor="currentGpa" className="field-label">
                  Current CGPA
                </label>
                <input
                  id="currentGpa"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="3.50"
                  value={value.currentGpa}
                  onChange={(e) => onChange({ currentGpa: e.target.value })}
                  className="input-focus field-input num"
                />
              </div>
              <div>
                <label htmlFor="totalUnitsPassed" className="field-label">
                  Total units taken so far
                </label>
                <input
                  id="totalUnitsPassed"
                  type="number"
                  inputMode="numeric"
                  placeholder="Units before now"
                  value={value.totalUnitsPassed}
                  onChange={(e) =>
                    onChange({ totalUnitsPassed: e.target.value })
                  }
                  className="input-focus field-input num"
                />
              </div>
            </>
          )}

          {mode !== "result" && (
            <div id="targetInputContainer">
              <label
                htmlFor="targetGpa"
                id="targetLabel"
                className="field-label"
              >
                Target GPA
              </label>
              <input
                id="targetGpa"
                type="number"
                step="0.01"
                inputMode="decimal"
                placeholder="(What are you aiming for?)"
                value={value.targetGpa}
                onChange={(e) => onChange({ targetGpa: e.target.value })}
                className="input-focus field-input num"
              />
            </div>
          )}

          <div
            id="courseCountInput"
            className={mode === "result" ? "sm:col-span-2" : ""}
          >
            <label htmlFor="numCourses" className="field-label">
              Number of courses
            </label>
            <input
              id="numCourses"
              type="number"
              inputMode="numeric"
              value={value.numCourses}
              min={1}
              max={15}
              onChange={(e) =>
                onChange({ numCourses: parseInt(e.target.value, 10) || 1 })
              }
              className="input-focus field-input num"
            />
          </div>
        </div>
      )}

      {mode === "roadmap" && (
        <div id="roadmapInputs" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fromLevel" className="field-label">
                From level
              </label>
              <select
                id="fromLevel"
                value={value.fromLevel}
                onChange={(e) =>
                  onChange({ fromLevel: parseInt(e.target.value, 10) })
                }
                className="input-focus field-input"
              >
                <option value={0}>100L - 1st</option>
                <option value={1}>100L - 2nd</option>
                <option value={2}>200L - 1st</option>
                <option value={3}>200L - 2nd</option>
                <option value={4}>300L - 1st</option>
                <option value={5}>300L - 2nd</option>
                <option value={6}>400L - 1st</option>
                <option value={7}>400L - 2nd</option>
                <option value={8}>500L - 1st</option>
                <option value={9}>500L - 2nd</option>
              </select>
            </div>
            <div>
              <label htmlFor="toLevel" className="field-label">
                To level
              </label>
              <select
                id="toLevel"
                value={value.toLevel}
                onChange={(e) =>
                  onChange({ toLevel: parseInt(e.target.value, 10) })
                }
                className="input-focus field-input"
              >
                <option value={1}>100L - 2nd</option>
                <option value={2}>200L - 1st</option>
                <option value={3}>200L - 2nd</option>
                <option value={4}>300L - 1st</option>
                <option value={5}>300L - 2nd</option>
                <option value={6}>400L - 1st</option>
                <option value={7}>400L - 2nd</option>
                <option value={8}>500L - 1st</option>
                <option value={9}>500L - 2nd</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="roadmapCurrentGpa" className="field-label">
                Current CGPA
              </label>
              <input
                id="roadmapCurrentGpa"
                type="number"
                step="0.01"
                inputMode="decimal"
                placeholder="3.00"
                value={value.roadmapCurrentGpa}
                onChange={(e) =>
                  onChange({ roadmapCurrentGpa: e.target.value })
                }
                className="input-focus field-input num"
              />
            </div>
            <div>
              <label htmlFor="roadmapTargetGpa" className="field-label">
                Milestone CGPA
              </label>
              <input
                id="roadmapTargetGpa"
                type="number"
                step="0.01"
                inputMode="decimal"
                placeholder="4.50"
                value={value.roadmapTargetGpa}
                onChange={(e) =>
                  onChange({ roadmapTargetGpa: e.target.value })
                }
                className="input-focus field-input num"
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <p
          id="setupError"
          role="alert"
          className="text-xs text-[#c4242a]"
        >
          {error}
        </p>
      )}

      <button
        onClick={onStart}
        className="w-full h-10 bg-[#141414] text-white text-sm font-medium rounded-md hover:bg-[#333333] active:bg-[#0a0a0a] transition bg-color"
      >
        {mode === "roadmap"
          ? "Build the plan"
          : mode === "result"
            ? "Open the ledger"
            : "Start planning"}
      </button>
    </div>
  );
}

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
}

export function SetupPanel({
  mode,
  value,
  onChange,
  onStart,
}: SetupPanelProps) {
  return (
    <div className="app-panel p-8 rounded-2xl space-y-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 border-b pb-4 border-slate-100">
        Setup
      </h2>

      {mode !== "roadmap" && (
        <div id="standardInputs" className="space-y-4">
          {mode === "cgpa" && (
            <div id="cgpaInputs" className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Current CGPA
                </label>
                <input
                  id="currentGpa"
                  type="number"
                  step="0.01"
                  placeholder="3.50"
                  value={value.currentGpa}
                  onChange={(e) => onChange({ currentGpa: e.target.value })}
                  className="input-focus w-full p-3 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Total Units Taken
                </label>
                <input
                  id="totalUnitsPassed"
                  type="number"
                  placeholder="Units before now"
                  value={value.totalUnitsPassed}
                  onChange={(e) =>
                    onChange({ totalUnitsPassed: e.target.value })
                  }
                  className="input-focus w-full p-3 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          )}

          {mode !== "result" && (
            <div id="targetInputContainer">
              <label
                id="targetLabel"
                className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1"
              >
                Target Semester GPA
              </label>
              <input
                id="targetGpa"
                type="number"
                step="0.01"
                placeholder="(What are you aiming for?)"
                value={value.targetGpa}
                onChange={(e) => onChange({ targetGpa: e.target.value })}
                className="input-focus w-full p-3 border border-slate-300 rounded-lg font-semibold text-slate-950"
              />
            </div>
          )}

          <div id="courseCountInput">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Number of Courses
            </label>
            <input
              id="numCourses"
              type="number"
              value={value.numCourses}
              min={1}
              max={15}
              onChange={(e) =>
                onChange({ numCourses: parseInt(e.target.value, 10) || 1 })
              }
              className="input-focus w-full p-3 bg-white border border-slate-200 rounded-lg mb-4"
            />
          </div>
        </div>
      )}

      {mode === "roadmap" && (
        <div id="roadmapInputs" className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                From Level
              </label>
              <select
                id="fromLevel"
                value={value.fromLevel}
                onChange={(e) =>
                  onChange({ fromLevel: parseInt(e.target.value, 10) })
                }
                className="input-focus w-full p-3 bg-white border border-slate-200 rounded-lg text-sm font-semibold"
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
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                To Level
              </label>
              <select
                id="toLevel"
                value={value.toLevel}
                onChange={(e) =>
                  onChange({ toLevel: parseInt(e.target.value, 10) })
                }
                className="input-focus w-full p-3 bg-white border border-slate-200 rounded-lg text-sm font-semibold"
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
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Current CGPA
            </label>
            <input
              id="roadmapCurrentGpa"
              type="number"
              step="0.01"
              placeholder="3.00"
              value={value.roadmapCurrentGpa}
              onChange={(e) =>
                onChange({ roadmapCurrentGpa: e.target.value })
              }
              className="input-focus w-full p-3 bg-white border border-slate-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Milestone CGPA
            </label>
            <input
              id="roadmapTargetGpa"
              type="number"
              step="0.01"
              placeholder="4.50"
              value={value.roadmapTargetGpa}
              onChange={(e) =>
                onChange({ roadmapTargetGpa: e.target.value })
              }
              className="input-focus w-full p-3 border border-slate-300 rounded-lg font-bold text-slate-950"
            />
          </div>
        </div>
      )}

      <button
        onClick={onStart}
        className="w-full bg-slate-950 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition"
      >
        Start Planning
      </button>
    </div>
  );
}

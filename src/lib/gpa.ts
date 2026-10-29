export type Mode = "semester" | "cgpa" | "result" | "roadmap";
export type Grade = "A" | "B" | "C" | "D" | "E" | "F";

export const GRADES: Grade[] = ["A", "B", "C", "D", "E", "F"];

/** 5-point scale used across the app. */
export const GRADE_POINTS: Record<Grade, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
  F: 0,
};

/** Academic levels, index maps to the select options in the original app. */
export const LEVELS = [
  "100L - 1st",
  "100L - 2nd",
  "200L - 1st",
  "200L - 2nd",
  "300L - 1st",
  "300L - 2nd",
  "400L - 1st",
  "400L - 2nd",
  "500L - 1st",
  "500L - 2nd",
];

export interface Course {
  id: number;
  units: number;
  grade: Grade;
  points: number;
}

export interface ClassInfo {
  name: string;
  style: string;
}

export interface ResultPayload {
  courses: Course[];
  finalGpa: number;
}

export interface RoadmapStep {
  level: string;
  value: string;
}

export interface RoadmapResult {
  final: number;
  gap: number;
}

export function getClass(gpa: number): ClassInfo {
  if (gpa >= 4.5) return { name: "First Class", style: "bg-amber-100 text-amber-700" };
  if (gpa >= 3.5) return { name: "2:1 (Upper)", style: "bg-emerald-100 text-emerald-700" };
  if (gpa >= 2.4) return { name: "2:2 (Lower)", style: "bg-blue-100 text-blue-700" };
  return { name: "Pass", style: "bg-slate-200 text-slate-600" };
}

/**
 * Build the initial course rows.
 * Result mode defaults to an A (matching the original grade <select>),
 * every other mode starts at a C so the simulator can improve it.
 */
export function createCourses(count: number, mode: Mode): Course[] {
  const defaults =
    mode === "result"
      ? { grade: "A" as Grade, points: GRADE_POINTS.A }
      : { grade: "C" as Grade, points: GRADE_POINTS.C };

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    units: 2,
    ...defaults,
  }));
}

/** Compute a real GPA from known course grades (Result mode). */
export function computeResult(courses: Course[]): ResultPayload {
  const totalPoints = courses.reduce((sum, c) => sum + c.units * c.points, 0);
  const totalUnits = courses.reduce((sum, c) => sum + c.units, 0);
  return { courses, finalGpa: totalUnits > 0 ? totalPoints / totalUnits : 0 };
}

/**
 * Greedily (and slightly randomly) raise course grades until the target GPA is
 * reached, mirroring the original simulator (max 100 iterations).
 */
export function simulateTarget(
  courses: Course[],
  target: number,
  mode: "semester" | "cgpa",
  currentGpa = 0,
  totalUnitsPassed = 0,
): Course[] {
  const working = courses.map((c) => ({ ...c }));

  const calc = () => {
    const sessionPoints = working.reduce((sum, c) => sum + c.units * c.points, 0);
    const sessionUnits = working.reduce((sum, c) => sum + c.units, 0);

    if (mode === "semester") {
      return sessionUnits > 0 ? sessionPoints / sessionUnits : 0;
    }

    const denominator = totalUnitsPassed + sessionUnits;
    return denominator > 0
      ? (currentGpa * totalUnitsPassed + sessionPoints) / denominator
      : 0;
  };

  for (let i = 0; i < 100; i += 1) {
    if (calc() >= target) break;
    const course = working[Math.floor(Math.random() * working.length)];
    if (course && course.points < GRADE_POINTS.A) {
      course.points += 1;
      course.grade =
        course.points === GRADE_POINTS.A
          ? "A"
          : course.points === GRADE_POINTS.B
            ? "B"
            : "C";
    }
  }

  return working;
}

/** The band the comeback trail prescribes inside, and the scale cap. */
const TRAIL_FLOOR = 3.7;
const TRAIL_CEIL = 4.8;
const SCALE_MAX = 5.0;

const round2 = (x: number) => Math.round(x * 100) / 100;

/** Interior step indexes of an n-step trail; only those may absorb rounding. */
function interiorIndices(n: number): number[] {
  const out: number[] = [];
  for (let i = 1; i < n - 1; i += 1) out.push(i);
  return out;
}

/**
 * Build the comeback trail: one GPA per remaining semester that reaches the
 * milestone.
 *
 * The remaining semesters must average `need`; the trail spreads that spread
 * across five honest zones:
 *
 * - `need` at or below 3.70 - the milestone already sits inside a 3.7 rhythm,
 *   so the trail holds the floor flat and lands at or above it (crossing is
 *   deliberate; no contorting to land exactly).
 * - `need` up to 4.25 - mirror anchored low: 3.70 out to 2*need-3.70, landing
 *   exactly.
 * - `need` up to 4.50 - the high zone: the trail takes the widest realistic
 *   ramp, 4.20 through 4.80, which crosses the milestone from above.
 * - `need` up to 4.80 - mirror anchored high: 2*need-4.80 through 4.80, landing
 *   exactly, and always starting at or above 4.20.
 * - past 4.80 the band cannot average it, so the ramp climbs toward 5.00, and
 *   past ~4.925 the only honest answer is flat 5.00s (the verdict marks it red).
 *
 * Values quantise to whole hundredths and the rounding spill is absorbed by the
 * interior steps (largest-remainder style), so no step ever pokes a decimal
 * above the zone's ceiling, and the first step sits exactly on the zone's
 * starting figure.
 */
export function buildRoadmapSteps(
  from: number,
  to: number,
  currentGpa: number,
  target: number,
): RoadmapStep[] {
  const n = to - from;
  if (n < 1) return [];

  const doneUnits = (from + 1) * 20;
  const need =
    (target * (doneUnits + 20 * n) - currentGpa * doneUnits) / (20 * n);

  let start: number;
  let end: number;
  let mean: number;
  if (n === 1) {
    // A single semester cannot mix; the figure needed is the figure needed.
    start = end = mean = round2(Math.min(Math.max(need, 0), SCALE_MAX));
  } else if (need <= TRAIL_FLOOR) {
    // Hold the floor: the trail lands at or above the milestone as-is.
    start = end = TRAIL_FLOOR;
    mean = TRAIL_FLOOR;
  } else if (need <= 4.25) {
    // Mirror anchored low, landing exactly on the milestone.
    start = TRAIL_FLOOR;
    end = round2(2 * need - TRAIL_FLOOR);
    mean = need;
  } else if (need <= 4.5) {
    // High but reachable: widest realistic ramp, crossing the milestone.
    start = 4.2;
    end = TRAIL_CEIL;
    mean = 4.5;
  } else if (need <= TRAIL_CEIL) {
    // Mirror anchored high, landing exactly, and starting at or above 4.20.
    start = round2(2 * need - TRAIL_CEIL);
    end = TRAIL_CEIL;
    mean = need;
  } else {
    // Past the band: climb toward a perfect scale; past the cap, hold flat 5s
    // and let the verdict call the trail out of reach.
    end = SCALE_MAX;
    start = round2(2 * need - SCALE_MAX);
    mean = need;
    if (start > SCALE_MAX) start = end = SCALE_MAX;
  }

  const floorEdge = Math.min(start, end);
  const ceilEdge = Math.max(start, end);
  const values: number[] = [];
  for (let i = 0; i < n; i += 1) {
    const raw = n === 1 ? start : start + ((end - start) * i) / (n - 1);
    values.push(round2(raw));
  }
  if (start !== end) {
    // Absorb the quantisation spill in the interior steps so no step crosses
    // the zone edges and the first step keeps its exact anchor figure.
    let residual = Math.round((mean * n - values.reduce((s, v) => s + v, 0)) * 100);
    for (let pass = 0; residual !== 0 && pass < 2 && pass < n; pass += 1) {
      for (const i of interiorIndices(n)) {
        if (residual === 0) break;
        const v = values[i];
        const bumped = round2(v + Math.sign(residual) / 100);
        const room =
          bumped >= floorEdge &&
          bumped <= ceilEdge &&
          bumped >= values[i - 1] &&
          bumped <= values[i + 1];
        if (room) {
          values[i] = bumped;
          residual -= Math.sign(residual);
        }
      }
    }
  }

  return values.map((value, i) => ({
    level: LEVELS[from + 1 + i],
    value: value.toFixed(2),
  }));
}

/**
 * Project the final CGPA from the roadmap inputs and compute the gap to the
 * target. Assumes 20 units per academic level (matching the original logic).
 */
export function computeRoadmapResult(
  from: number,
  currentGpa: number,
  target: number,
  steps: RoadmapStep[],
): RoadmapResult {
  let totalUnits = (from + 1) * 20;
  let totalPoints = currentGpa * totalUnits;

  for (const step of steps) {
    totalUnits += 20;
    totalPoints += parseFloat(step.value || "0") * 20;
  }

  const final = totalUnits > 0 ? totalPoints / totalUnits : 0;
  return { final, gap: final - target };
}

export interface Verdict {
  label: string;
  color: string;
}

export function roadmapVerdict(gap: number): Verdict {
  if (gap >= 0) return { label: "Target secured", color: "#2e7d32" };
  if (gap >= -0.25) return { label: "Almost there", color: "#92400e" };
  return { label: "High risk zone", color: "#c4242a" };
}

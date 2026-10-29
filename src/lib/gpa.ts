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

/**
 * Build the comeback trail: one GPA per remaining semester that reaches the
 * milestone.
 *
 * The remaining semesters must average `need`; the trail is a progressive but
 * irregular climb inside the 3.70-4.80 band (real sessions do not step in
 * fixed +0.10 increments, so each interior step carries a small deterministic
 * wobble):
 *
 * - `need` at or below 3.70 - the milestone already sits inside a 3.7 rhythm:
 *   hold the floor flat and land at or above it (crossing is deliberate).
 * - `need` up to 4.25 - climb from 3.70, ending where the average lands it.
 * - `need` up to 4.50 - the high zone: the full 4.20-4.80 ramp, crossing the
 *   milestone, never leaving the band and never opening below 4.20.
 * - `need` up to 4.80 - a tighter 4.2x-4.80 climb that lands exactly.
 * - past 4.80 the band cannot average it: the strongest honest plan prescribes
 *   at most ONE 5.00 (the summit step) with the rest clamped inside the band,
 *   and the verdict reports the shortfall. Never a trail of straight fives.
 *
 * The trail never emits more than one 5.00, and rounding spill is absorbed by
 * the interior steps only.
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

  if (n === 1) {
    // A single semester cannot mix; the figure needed is the figure needed.
    return [step(LEVELS[from + 1], round2(Math.min(Math.max(need, 0), SCALE_MAX)))];
  }

  let values: number[];
  if (need <= TRAIL_FLOOR) {
    // Hold the band floor; the trail lands at or above the milestone as-is.
    values = Array.from({ length: n }, () => TRAIL_FLOOR);
  } else if (need <= 4.25) {
    values = jitteredRamp(TRAIL_FLOOR, Math.min(TRAIL_CEIL, 2 * need - TRAIL_FLOOR), n, seedFor(n, need));
  } else if (need <= 4.5) {
    // High but reachable: the fullest realistic band ramp, crossing upward.
    values = jitteredRamp(4.2, TRAIL_CEIL, n, seedFor(n, need));
  } else if (need <= TRAIL_CEIL) {
    values = jitteredRamp(Math.max(4.2, 2 * need - TRAIL_CEIL), TRAIL_CEIL, n, seedFor(n, need));
  } else {
    // Past the band: one single 5.00 caps the summit, everything else stays
    // inside 3.70-4.80, and the verdict reports whatever shortfall remains.
    const m = n - 1;
    const meanTarget = Math.min((need * n - 5) / m, TRAIL_CEIL);
    const start = Math.min(TRAIL_CEIL, Math.max(4.2, 2 * meanTarget - TRAIL_CEIL));
    values = [
      ...jitteredRamp(start, TRAIL_CEIL, m, seedFor(n, need)),
      5.0,
    ];
  }

  return values.map((value, i) => step(LEVELS[from + 1 + i], value));
}

/** A RoadmapStep with a two-decimal value. */
function step(level: string, value: number): RoadmapStep {
  return { level, value: value.toFixed(2) };
}

/** Stable per-scenario jitter seed: same inputs always build the same trail. */
function seedFor(n: number, need: number): number {
  return Math.imul(n, 131) + Math.round(need * 100) * 7;
}

/**
 * A progressive climb from `start` to `end` in `count` steps that wobbles like
 * real sessions instead of stepping in fixed +0.10 increments. The first and
 * last steps sit exactly on the anchors, interior steps deviate by a small
 * zero-sum jitter (so the ramp's mean is unchanged), every value rounds to
 * whole hundredths, and any rounding spill is absorbed by the interior steps
 * first, preserving band edges and monotonicity.
 */
function jitteredRamp(
  start: number,
  end: number,
  count: number,
  seed: number,
): number[] {
  const values: number[] = [];
  if (count < 2 || start >= end) {
    for (let i = 0; i < count; i += 1) values.push(round2(start));
    return values;
  }

  const span = end - start;
  const gap = span / (count - 1);
  const amp = Math.min(0.07, 0.6 * gap); // wobble never inverts the climb

  // Deterministic LCG jitter, zero-summed over the interior steps.
  let s = (Math.imul(seed, 2246822519) ^ 0x7feb352d) >>> 0;
  const rnd = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return (s >>> 8) / 16777216;
  };
  const g: number[] = [];
  for (let i = 1; i < count - 1; i += 1) g.push(rnd());
  const gMean = g.length > 0 ? g.reduce((sum, x) => sum + x, 0) / g.length : 0;

  for (let i = 0; i < count; i += 1) {
    const lin = start + gap * i;
    const z = i > 0 && i < count - 1 ? amp * (g[i - 1] - gMean) : 0;
    values.push(round2(lin + z));
  }

  // Absorb quantisation spill in the interior steps only.
  const mean = (start + end) / 2;
  let residual = Math.round((mean * count - values.reduce((sum, v) => sum + v, 0)) * 100);
  for (let pass = 0; residual !== 0 && pass < 2; pass += 1) {
    for (let i = 1; i < count - 1 && residual !== 0; i += 1) {
      const bumped = round2(values[i] + Math.sign(residual) / 100);
      if (
        bumped >= start &&
        bumped <= end &&
        bumped >= values[i - 1] &&
        bumped <= values[i + 1]
      ) {
        values[i] = bumped;
        residual -= Math.sign(residual);
      }
    }
  }
  return values;
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

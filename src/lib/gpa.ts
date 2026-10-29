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
 * Build the comeback trail: one GPA per remaining semester on the way to the
 * milestone.
 *
 * The trail is a scatter, not a ramp. Real sessions swing in any order - a
 * 4.2 here, a 5.0 there, a 4.8, then a 4.5 - so the plan is drawn as a
 * realistic mix first and rescued second:
 *
 * 1. Scatter - values ride a window of 0.60 around `need` (what the remaining
 *    semesters must average), clamped to the 3.70-4.80 band. Two anchor
 *    semesters pin the window edges so the mix truly swings, and a single
 *    5.00 peak may join wherever it lands when the need is high enough to
 *    invite it (never more than one).
 * 2. Rescue - if the drawn mix would fall short of the milestone, the lowest
 *    dropped semesters are stretched back up, capped at 4.80, until the
 *    average lands at or above it. When even that cannot cover the gap the
 *    trail stays as drawn and the verdict reports the distance.
 *
 * Deterministic: the same inputs always draw the same trail.
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

  // Deterministic scatter: same inputs always build the same trail.
  let s = seedFor(n, need) >>> 0;
  const rnd = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return (s >>> 8) / 16777216;
  };

  // Play within 0.60 of the needed average, clamped to the band. When the
  // need itself sits past the ceiling the window slides down to 4.20-4.80 so
  // the mix still swings instead of collapsing into flat top gear.
  const lo = Math.max(TRAIL_FLOOR, Math.min(need - 0.6, TRAIL_CEIL - 0.6));
  const hi = Math.min(TRAIL_CEIL, need + 0.6);

  // Up to one 5.00 peak, at a random spot, only where the need invites it.
  const specials = new Map<number, number>();
  const peakAt = need >= 4.4 ? Math.floor(rnd() * n) : -1;
  if (peakAt >= 0) specials.set(peakAt, SCALE_MAX);

  if (hi > lo) {
    // Pin one semester at each window edge so the mix really swings.
    const freeIndex = (taken: Set<number>) => {
      for (let t = 0; t < 12; t += 1) {
        const i = Math.floor(rnd() * n);
        if (!taken.has(i)) return i;
      }
      for (let i = Math.floor(rnd() * n), t = 0; t < n; i = (i + 1) % n, t += 1) {
        if (!taken.has(i)) return i;
      }
      return -1;
    };
    const taken = new Set(specials.keys());
    const lowAt = freeIndex(taken);
    if (lowAt >= 0) {
      taken.add(lowAt);
      specials.set(lowAt, lo);
      const highAt = freeIndex(taken);
      if (highAt >= 0) specials.set(highAt, hi);
    }
  }

  const values: number[] = [];
  for (let i = 0; i < n; i += 1) {
    const fixed = specials.get(i);
    values.push(fixed !== undefined ? round2(fixed) : round2(lo + rnd() * (hi - lo)));
  }

  // Rescue: stretch the lowest dropped semesters back up until the average
  // meets the milestone. The 5.00 peak is never part of the lifting, and when
  // the band cannot cover the shortfall the drawn mix stands as drawn - the
  // verdict reports the distance.
  let shortfall = Math.round((need * n - values.reduce((sum, v) => sum + v, 0)) * 100);
  if (shortfall > 0) {
    const liftable = values
      .map((v, i) => ({ i, v }))
      .filter(({ i }) => i !== peakAt)
      .sort((a, b) => a.v - b.v);
    const capacity = liftable.reduce(
      (sum, { v }) => sum + Math.max(0, Math.round((TRAIL_CEIL - v) * 100)),
      0,
    );
    if (capacity >= shortfall) {
      let residual = shortfall;
      for (const { i, v } of liftable) {
        if (residual <= 0) break;
        const room = Math.round((TRAIL_CEIL - v) * 100);
        if (room <= 0) continue;
        const lift = Math.min(room, residual);
        values[i] = round2(v + lift / 100);
        residual -= lift;
      }
    }
  }

  return values.map((value, i) => step(LEVELS[from + 1 + i], value));
}

/** A RoadmapStep with a two-decimal value. */
function step(level: string, value: number): RoadmapStep {
  return { level, value: value.toFixed(2) };
}

/** Stable per-scenario scatter seed: same inputs always build the same trail. */
function seedFor(n: number, need: number): number {
  return Math.imul(n, 131) + Math.round(need * 100) * 7;
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

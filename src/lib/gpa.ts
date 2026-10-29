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

/** First-class band the comeback trail prescribes inside, and the scale cap. */
const TRAIL_FLOOR = 4.0;
const TRAIL_CEIL = 4.7;
const SCALE_MAX = 5.0;

const round2 = (x: number) => Math.round(x * 100) / 100;

/**
 * Build the comeback trail: one GPA per remaining semester that lands the
 * cumulative CGPA exactly on the milestone.
 *
 * The remaining semesters must average `need`; the trail spreads that average
 * as the widest ramp the first-class band allows - early semesters take the
 * lighter end and the plan climbs (or, on an easy milestone, banks a strong
 * open and tapers). The band compresses toward 4.70 as `need` rises, past the
 * ceiling the ramp climbs toward 5.00, and past the cap the only honest answer
 * is flat 5.00s, which the verdict then reports as out of reach. When the
 * milestone already sits within reach the ramp descends from 4.00 instead.
 * The last step re-solves the exact figure so the projection lands on target.
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
  if (n === 1) {
    // A single semester cannot mix; the figure needed is the figure needed.
    start = end = round2(Math.min(Math.max(need, 0), SCALE_MAX));
  } else if (need <= 2.4) {
    // The milestone is a coast: hold one modest flat rhythm.
    start = end = round2(Math.min(Math.max(need, 0), SCALE_MAX));
  } else if (need <= TRAIL_FLOOR) {
    // Within reach: open at the first-class floor, taper as the average banks.
    start = TRAIL_FLOOR;
    end = Math.max(round2(2 * need - TRAIL_FLOOR), 2.4);
  } else {
    // Above the floor: mirror `need` across the widest ramp that averages it.
    start = round2(2 * need - TRAIL_CEIL);
    end = TRAIL_CEIL;
    if (start < TRAIL_FLOOR) {
      start = TRAIL_FLOOR;
      end = round2(2 * need - start);
    }
    if (end > SCALE_MAX) {
      end = SCALE_MAX;
      start = round2(2 * need - SCALE_MAX);
    }
    if (start > SCALE_MAX) {
      // Even a perfect scale cannot reach the milestone from here.
      start = end = SCALE_MAX;
    }
  }

  const values: number[] = [];
  for (let i = 0; i < n - 1; i += 1) {
    values.push(round2(start + ((end - start) * i) / (n - 1)));
  }
  // The final step re-solves so the cumulative CGPA lands on the milestone.
  const earlierPoints = values.reduce((sum, v) => sum + v * 20, 0);
  const lastTarget = target * (doneUnits + 20 * n) - currentGpa * doneUnits - earlierPoints;
  values.push(round2(Math.min(Math.max(lastTarget / 20, 0), SCALE_MAX)));

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

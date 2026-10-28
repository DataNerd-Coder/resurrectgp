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

/** Build a roadmap step for every level between `from` and `to` (exclusive of from). */
export function buildRoadmapSteps(from: number, to: number): RoadmapStep[] {
  const steps: RoadmapStep[] = [];
  for (let i = 1; i <= to - from; i += 1) {
    steps.push({ level: LEVELS[from + i], value: "4.00" });
  }
  return steps;
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

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildRoadmapSteps,
  computeResult,
  computeRoadmapResult,
  createCourses,
  simulateTarget,
} from "@/lib/gpa";
import type { Course, Mode, ResultPayload, RoadmapStep } from "@/lib/gpa";
import { Header } from "@/components/Header";
import { ModeSwitcher } from "@/components/ModeSwitcher";
import { SetupPanel } from "@/components/SetupPanel";
import type { SetupState } from "@/components/SetupPanel";
import { CourseGrid } from "@/components/CourseGrid";
import { ResultsSection } from "@/components/ResultsSection";
import { RoadmapSection } from "@/components/RoadmapSection";
import { BlueprintModal } from "@/components/BlueprintModal";
import { Footer } from "@/components/Footer";

const INITIAL_SETUP: SetupState = {
  numCourses: 9,
  targetGpa: "",
  currentGpa: "",
  totalUnitsPassed: "",
  fromLevel: 0,
  toLevel: 7,
  roadmapCurrentGpa: "",
  roadmapTargetGpa: "",
};

const SHARE_TEXT =
  "Omo, I just used *Resurrect My GPA* to plan my academic comeback! \n \nTime to LockIn. Check your path to First Class and plan your comeback: https://resurrectgp.vercel.app";

export function GpaApp() {
  const [mode, setMode] = useState<Mode>("semester");
  const [setup, setSetup] = useState<SetupState>(INITIAL_SETUP);

  const [courses, setCourses] = useState<Course[]>([]);
  const [showCourseSection, setShowCourseSection] = useState(false);

  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);
  const [showRoadmap, setShowRoadmap] = useState(false);

  const [result, setResult] = useState<ResultPayload | null>(null);
  const [modalStrategy, setModalStrategy] = useState<number | null>(null);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const captureRef = useRef<HTMLDivElement>(null);

  const updateSetup = (patch: Partial<SetupState>) => {
    setSetup((prev) => ({ ...prev, ...patch }));
    setSetupError(null);
  };

  const roadmapTarget = parseFloat(setup.roadmapTargetGpa) || 0;
  const roadmapCurrent = parseFloat(setup.roadmapCurrentGpa) || 0;

  const roadmapResult = useMemo(() => {
    if (!showRoadmap) return null;
    return computeRoadmapResult(
      setup.fromLevel,
      roadmapCurrent,
      roadmapTarget,
      roadmapSteps,
    );
  }, [showRoadmap, setup.fromLevel, roadmapCurrent, roadmapTarget, roadmapSteps]);

  // Smooth-scroll to each section once it has actually rendered.
  useEffect(() => {
    if (showCourseSection) {
      document
        .getElementById("courseSection")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [showCourseSection]);

  useEffect(() => {
    if (showRoadmap) {
      document
        .getElementById("roadmapSection")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [showRoadmap]);

  useEffect(() => {
    if (result) {
      document
        .getElementById("resultsSection")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [result]);

  const handleModeChange = (next: Mode) => {
    setMode(next);
    setShowCourseSection(false);
    setShowRoadmap(false);
    setResult(null);
    setSetupError(null);
  };

  const handleStart = () => {
    if (mode === "roadmap") {
      const current = parseFloat(setup.roadmapCurrentGpa);
      const milestone = parseFloat(setup.roadmapTargetGpa);

      if (!setup.roadmapCurrentGpa.trim() || Number.isNaN(current)) {
        setSetupError("Enter your current CGPA to build the trail.");
        document.getElementById("roadmapCurrentGpa")?.focus();
        return;
      }
      if (!setup.roadmapTargetGpa.trim() || Number.isNaN(milestone) || milestone <= 0) {
        setSetupError("Enter the milestone CGPA you're aiming for.");
        document.getElementById("roadmapTargetGpa")?.focus();
        return;
      }
      if (setup.toLevel <= setup.fromLevel) {
        setSetupError("Milestone level must come after the starting level.");
        document.getElementById("toLevel")?.focus();
        return;
      }
      setSetupError(null);
      setRoadmapSteps(buildRoadmapSteps(setup.fromLevel, setup.toLevel));
      setShowRoadmap(true);
      return;
    }

    if (mode !== "result") {
      const target = parseFloat(setup.targetGpa);
      if (!setup.targetGpa.trim() || Number.isNaN(target) || target <= 0) {
        setSetupError("Enter the GPA you're aiming for.");
        document.getElementById("targetGpa")?.focus();
        return;
      }
    }

    setSetupError(null);
    setCourses(createCourses(setup.numCourses, mode));
    setShowCourseSection(true);
    setResult(null);
  };

  const handleCalculate = () => {
    if (mode === "result") {
      setResult(computeResult(courses));
    } else {
      const target = parseFloat(setup.targetGpa) || 0;
      const simulated = simulateTarget(
        courses,
        target,
        mode === "cgpa" ? "cgpa" : "semester",
        parseFloat(setup.currentGpa) || 0,
        parseFloat(setup.totalUnitsPassed) || 0,
      );

      const sessionPoints = simulated.reduce(
        (sum, c) => sum + c.units * c.points,
        0,
      );
      const sessionUnits = simulated.reduce((sum, c) => sum + c.units, 0);

      let finalGpa: number;
      if (mode === "cgpa") {
        const previousUnits = parseFloat(setup.totalUnitsPassed) || 0;
        const previousGpa = parseFloat(setup.currentGpa) || 0;
        const denominator = previousUnits + sessionUnits;
        finalGpa =
          denominator > 0
            ? (previousGpa * previousUnits + sessionPoints) / denominator
            : 0;
      } else {
        finalGpa = sessionUnits > 0 ? sessionPoints / sessionUnits : 0;
      }

      setResult({ courses: simulated, finalGpa });
    }
  };

  const handleDownload = async () => {
    const element = captureRef.current;
    if (!element || saving) return;

    const html2canvas = (
      window as unknown as {
        html2canvas?: (
          el: HTMLElement,
          options?: { backgroundColor?: string; scale?: number },
        ) => Promise<HTMLCanvasElement>;
      }
    ).html2canvas;

    if (!html2canvas) {
      window.alert(
        "Image export is still loading. Please try again in a moment.",
      );
      return;
    }

    setSaving(true);
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = "GP-Plan.png";
      link.href = canvas.toDataURL();
      link.click();
    } finally {
      setSaving(false);
    }
  };

  const handleShare = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT)}`,
      "_blank",
    );
  };

  const handleStepChange = (index: number, value: string) => {
    setRoadmapSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, value } : step)),
    );
  };

  return (
    <>
      <div className="max-w-[1088px] mx-auto px-4 md:px-6 pt-5 pb-16">
        <Header onShare={handleShare} />
        <ModeSwitcher mode={mode} onChange={handleModeChange} />
        <div className="mt-6 space-y-5">
          <SetupPanel
            mode={mode}
            value={setup}
            onChange={updateSetup}
            onStart={handleStart}
            error={setupError}
          />
          {showCourseSection && (
            <CourseGrid
              mode={mode}
              courses={courses}
              onChange={setCourses}
              onCalculate={handleCalculate}
            />
          )}
          {showRoadmap && roadmapResult && (
            <RoadmapSection
              steps={roadmapSteps}
              result={roadmapResult}
              target={roadmapTarget}
              onStepChange={handleStepChange}
            />
          )}
          {result && (
            <ResultsSection
              result={result}
              captureRef={captureRef}
              onDownload={handleDownload}
              onShare={handleShare}
              saving={saving}
            />
          )}
        </div>
        <Footer onOpenStrategy={setModalStrategy} />
      </div>
      <BlueprintModal
        strategyId={modalStrategy}
        onClose={() => setModalStrategy(null)}
      />
    </>
  );
}

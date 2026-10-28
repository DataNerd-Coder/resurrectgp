import type { ReactNode } from "react";

export interface Strategy {
  title: string;
  content: ReactNode;
}

/**
 * Content for the "Resurrection Blueprint" modals.
 * Extracted from the original index.html so it can be rendered as JSX.
 */
export const STRATEGIES: Record<number, Strategy> = {
  1: {
    title: "The Heavy Hitters",
    content: (
      <>
        <h2 className="text-2xl font-black text-slate-900 mb-2 leading-tight uppercase italic tracking-tight">
          The Heavy Hitters — Your GPA Engine
        </h2>
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-6">
          Strategy 01
        </p>
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p className="font-bold text-slate-800">Not all courses are created equal.</p>
          <p>
            3-unit and 4-unit courses are the engine of your GPA. They carry the
            most weight, which means they can either pull your GPA up
            significantly or drag it down faster than you expect.
          </p>
          <p className="font-bold text-slate-800">Top students understand this:</p>
          <ul className="space-y-2 list-disc pl-5">
            <li>
              They don’t distribute their effort equally—they prioritize
              strategically.
            </li>
          </ul>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="font-bold text-slate-900 mb-1">If you score:</p>
            <p>
              • <span className="text-green-600 font-bold">A in a 4-unit course</span>{" "}
              → massive GPA boost
            </p>
            <p>
              • <span className="text-red-600 font-bold">C in a 4-unit course</span>{" "}
              → serious damage
            </p>
          </div>
          <p className="font-bold text-slate-800">
            So instead of treating all courses the same, they:
          </p>
          <ul className="space-y-1 list-disc pl-5">
            <li>Invest more time in heavy-unit courses</li>
            <li>Prepare earlier for them</li>
            <li>Aim for mastery, not just survival</li>
          </ul>
          <p className="italic text-blue-700 font-medium pt-2 border-t border-slate-100">
            &quot;Your GPA doesn’t respond to effort—it responds to weighted
            effort.&quot;
          </p>
        </div>
      </>
    ),
  },
  2: {
    title: "The 0.2 Safety Net",
    content: (
      <>
        <h2 className="text-2xl font-black text-slate-900 mb-2 leading-tight uppercase italic tracking-tight">
          The 0.2 Safety Net
        </h2>
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-6">
          Strategy 02
        </p>
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            Never aim for the bare minimum of your goal. If you need a 4.50 to get
            into First Class,{" "}
            <span className="font-bold text-slate-900">
              your mental target must be 4.70.
            </span>
          </p>
          <p>
            Lecturers might miss a script, marking schemes can be tight, or an
            exam might be exceptionally hard. The 0.2 buffer ensures that even if
            you &quot;fail&quot; your target slightly, you still land on your
            actual goal.
          </p>
        </div>
      </>
    ),
  },
  3: {
    title: "The PQ Protocol",
    content: (
      <>
        <h2 className="text-2xl font-black text-slate-900 mb-2 leading-tight uppercase italic tracking-tight">
          The PQ Protocol — 10 Years of Past Questions
        </h2>
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-6">
          Strategy 03
        </p>
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p className="font-bold text-slate-800">
            There’s a pattern most people ignore:
          </p>
          <ul className="space-y-1">
            <li>• Exams rarely come out of nowhere.</li>
            <li>• Lecturers repeat styles.</li>
            <li>• Topics cycle.</li>
            <li>• Questions evolve—but not randomly.</li>
          </ul>
          <p>
            <span className="font-bold text-slate-900">
              Solving 10 years of past questions
            </span>{" "}
            is not just revision—it’s pattern recognition training.
          </p>
          <p className="font-bold text-slate-800">When you do this consistently:</p>
          <ul className="space-y-1">
            <li>• You begin to predict question formats</li>
            <li>• You identify high-frequency topics</li>
            <li>• You build exam confidence</li>
          </ul>
          <p>
            By the time you enter the exam hall, it doesn’t feel new—it feels
            familiar.
          </p>
          <p className="italic text-blue-700 font-medium pt-2 border-t border-slate-100">
            &quot;Top students don’t just study hard. They study what matters
            most.&quot;
          </p>
        </div>
      </>
    ),
  },
  4: {
    title: "The Comeback Logic",
    content: (
      <>
        <h2 className="text-2xl font-black text-slate-900 mb-2 leading-tight uppercase italic tracking-tight">
          The Comeback Logic — For Students With Carryovers
        </h2>
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-6">
          Strategy 04
        </p>
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p className="font-bold text-slate-800">
            If you have a carryover, understand this first: you are not
            finished—you are simply restarting with more awareness.
          </p>
          <p>
            What hurts most students is not the carryover itself, but how they
            react to it. Panic sets in. They try to “fix everything at once”—
            stacking too many courses, overloading their schedule, and pushing
            beyond what they can realistically handle.
          </p>
          <p className="font-bold text-slate-900">
            Students who successfully bounce back take a different approach:
          </p>
          <p>
            <span className="font-bold">They respect their limits.</span> Instead
            of overloading, they choose a manageable number of units and commit to
            doing them well. They understand that recovery is not about speed—it’s
            about stability.
          </p>
          <p>
            <span className="font-bold">They focus on a strong re-entry.</span>{" "}
            Rather than rushing to catch up, they rebuild their academic rhythm—
            attending classes consistently, studying with structure, and regaining
            control over their performance.
          </p>
          <p>
            <span className="font-bold text-slate-900">
              Most importantly, they rebuild confidence gradually.
            </span>{" "}
            One course at a time. One good result at a time. Each small win
            becomes proof that they are back on track.
          </p>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-900 italic">
            &quot;A carryover is not the end of your story. It’s a point where you
            pause, adjust, and move forward with better strategy.&quot;
          </div>
          <p className="text-sm font-bold mt-2">
            Real comebacks are not driven by pressure or fear. They are built on
            clarity, discipline, and control.
          </p>
        </div>
      </>
    ),
  },
};

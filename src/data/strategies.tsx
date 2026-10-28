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
        <p className="text-sm text-[#6b6b6b] mb-6">
          Your GPA engine: the courses that move the number most.
        </p>
        <div className="space-y-4 text-sm text-[#0a0a0a] leading-relaxed">
          <p className="font-medium">Not all courses are created equal.</p>
          <p>
            3-unit and 4-unit courses are the engine of your GPA. They carry the
            most weight, which means they can either pull your GPA up
            significantly or drag it down faster than you expect.
          </p>
          <p className="font-medium">Top students understand this:</p>
          <div className="bg-[#f2f4f7] p-4 rounded-lg">
            <p className="font-medium mb-1">If you score:</p>
            <p>
              A in a 4-unit course &mdash; massive GPA boost.
            </p>
            <p>
              C in a 4-unit course &mdash; serious damage.
            </p>
          </div>
          <p className="font-medium">
            So instead of treating all courses the same, they:
          </p>
          <ul className="space-y-1 list-disc pl-5">
            <li>Invest more time in heavy-unit courses</li>
            <li>Prepare earlier for them</li>
            <li>Aim for mastery, not just survival</li>
          </ul>
          <p className="text-[#6b6b6b] pt-2 border-t border-[#f0f0f0]">
            Your GPA doesn&rsquo;t respond to effort. It responds to weighted
            effort.
          </p>
        </div>
      </>
    ),
  },
  2: {
    title: "The 0.2 Safety Net",
    content: (
      <>
        <p className="text-sm text-[#6b6b6b] mb-6">
          Never aim for the bare minimum of your goal.
        </p>
        <div className="space-y-4 text-sm text-[#0a0a0a] leading-relaxed">
          <p>
            If you need a 4.50 to get into First Class,{" "}
            <span className="font-medium">your mental target must be 4.70.</span>
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
        <p className="text-sm text-[#6b6b6b] mb-6">
          Ten years of past questions, as pattern training.
        </p>
        <div className="space-y-4 text-sm text-[#0a0a0a] leading-relaxed">
          <p className="font-medium">There&rsquo;s a pattern most people ignore:</p>
          <ul className="space-y-1 list-disc pl-5">
            <li>Exams rarely come out of nowhere.</li>
            <li>Lecturers repeat styles.</li>
            <li>Topics cycle.</li>
            <li>Questions evolve, but not randomly.</li>
          </ul>
          <p>
            <span className="font-medium">
              Solving 10 years of past questions
            </span>{" "}
            is not just revision. It&rsquo;s pattern recognition training.
          </p>
          <p className="font-medium">When you do this consistently:</p>
          <ul className="space-y-1 list-disc pl-5">
            <li>You begin to predict question formats</li>
            <li>You identify high-frequency topics</li>
            <li>You build exam confidence</li>
          </ul>
          <p>
            By the time you enter the exam hall, it doesn&rsquo;t feel new. It
            feels familiar.
          </p>
          <p className="text-[#6b6b6b] pt-2 border-t border-[#f0f0f0]">
            Top students don&rsquo;t just study hard. They study what matters
            most.
          </p>
        </div>
      </>
    ),
  },
  4: {
    title: "The Comeback Logic",
    content: (
      <>
        <p className="text-sm text-[#6b6b6b] mb-6">
          For students with carryovers.
        </p>
        <div className="space-y-4 text-sm text-[#0a0a0a] leading-relaxed">
          <p>
            If you have a carryover, understand this first: you are not finished.
            You are simply restarting with more awareness.
          </p>
          <p>
            What hurts most students is not the carryover itself, but how they
            react to it. Panic sets in. They try to &quot;fix everything at
            once&quot;, stacking too many courses, overloading their schedule,
            and pushing beyond what they can realistically handle.
          </p>
          <p className="font-medium">
            Students who successfully bounce back take a different approach:
          </p>
          <p>
            <span className="font-medium">They respect their limits.</span>{" "}
            Instead of overloading, they choose a manageable number of units and
            commit to doing them well. They understand that recovery is not about
            speed. It&rsquo;s about stability.
          </p>
          <p>
            <span className="font-medium">They focus on a strong re-entry.</span>{" "}
            Rather than rushing to catch up, they rebuild their academic rhythm,
            attending classes consistently, studying with structure, and
            regaining control over their performance.
          </p>
          <p>
            <span className="font-medium">
              Most importantly, they rebuild confidence gradually.
            </span>{" "}
            One course at a time. One good result at a time. Each small win
            becomes proof that they are back on track.
          </p>
          <div className="bg-[#f2f4f7] p-4 rounded-lg">
            A carryover is not the end of your story. It&rsquo;s a point where
            you pause, adjust, and move forward with better strategy.
          </div>
          <p className="font-medium">
            Real comebacks are not driven by pressure or fear. They are built on
            clarity, discipline, and control.
          </p>
        </div>
      </>
    ),
  },
};

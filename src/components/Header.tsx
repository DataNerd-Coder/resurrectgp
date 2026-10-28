"use client";

interface ShareBarProps {
  onShare: () => void;
}

export function ShareBar({ onShare }: ShareBarProps) {
  return (
    <div className="bg-slate-950 text-white py-2 px-4 sticky top-0 z-50 flex justify-center items-center gap-4">
      <span className="text-xs font-medium text-slate-300">
        A friend might need this
      </span>
      <button
        onClick={onShare}
        className="bg-white text-slate-950 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 hover:bg-slate-200 transition"
      >
        SHARE
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </button>
    </div>
  );
}

export function Header() {
  return (
    <header className="mb-10 text-center animate-fade">
      <div className="inline-block bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded mb-2 tracking-tighter uppercase">
        Watchman Edition
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-950 mb-1">
        Resurrect Your GPA
      </h1>
      <p className="text-slate-600 font-normal">
        See the exact grades you need to recover your GPA.
      </p>
    </header>
  );
}

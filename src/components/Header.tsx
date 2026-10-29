"use client";

interface HeaderProps {
  onShare: () => void;
}

export function Header({ onShare }: HeaderProps) {
  return (
    <header className="mb-6 animate-fade flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[26px] leading-tight font-semibold tracking-[-0.02em] text-[#0a0a0a] mb-1 sm:text-[32px] sm:leading-[1.15]">
          Resurrect Your GPA
        </h1>
        <p className="text-xs text-[#6b6b6b] sm:text-sm">
          The exact grades you need to reach your target, on the 5.0 scale.
        </p>
      </div>
      <button
        onClick={onShare}
        className="flex-none h-10 px-4 text-xs font-medium text-[#0a0a0a] border border-[#8f8f8f] rounded-md hover:border-[#0a0a0a] hover:bg-[#f0f0f0] active:bg-[#eeeeee] transition border-color"
      >
        Share plan
      </button>
    </header>
  );
}

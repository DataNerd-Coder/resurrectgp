"use client";

import { useEffect, useRef } from "react";
import { STRATEGIES } from "@/data/strategies";

interface BlueprintModalProps {
  strategyId: number | null;
  onClose: () => void;
}

export function BlueprintModal({ strategyId, onClose }: BlueprintModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = strategyId !== null ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [strategyId]);

  // Focus enters the dialog on open, Tab stays inside, and on close it
  // returns to the element that opened it.
  useEffect(() => {
    if (strategyId === null) return;

    const opener = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const focusable = panel
      ? Array.from(
          panel.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => el.offsetParent !== null)
      : [];

    (focusable[0] ?? panel)?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      opener?.focus();
    };
  }, [strategyId, onClose]);

  if (strategyId === null) return null;

  const strategy = STRATEGIES[strategyId];

  return (
    <div
      id="blueprintModal"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[rgba(10,10,10,0.45)] backdrop-blur-[6px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="blueprintModalHeading"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="bg-white w-full max-w-xl rounded-lg overflow-hidden animate-fade relative max-h-[85vh] flex flex-col"
        style={{
          boxShadow: "var(--shadow-dialog), 0 0 0 1px rgba(21,38,76,0.06)",
          background: "linear-gradient(180deg, #ffffff 0%, #fafbfe 100%)",
        }}
      >
        <div className="flex items-start justify-between gap-4 px-8 pt-7 pb-5 border-b border-[#e6e6e6]">
          <h2
            id="blueprintModalHeading"
            className="text-lg font-semibold text-[#0a0a0a] pr-8"
          >
            {strategy.title}
          </h2>
          <button
            onClick={onClose}
            className="flex-none h-10 w-10 -mr-2 -mt-1 flex items-center justify-center text-[#6b6b6b] hover:text-[#0a0a0a] active:bg-[#f0f0f0] rounded-md transition color z-10"
            aria-label="Close"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div
          id="modalBody"
          className="p-8 overflow-y-auto modal-scroll"
        >
          {strategy.content}
        </div>
        <div className="px-8 py-4 border-t border-[#e6e6e6] flex justify-end">
          <button
            onClick={onClose}
            className="h-10 px-4 bg-[#141414] text-white text-sm font-medium rounded-md hover:bg-[#333333] active:bg-[#0a0a0a] transition bg-color"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

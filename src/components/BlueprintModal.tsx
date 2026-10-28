"use client";

import { useEffect } from "react";
import { STRATEGIES } from "@/data/strategies";

interface BlueprintModalProps {
  strategyId: number | null;
  onClose: () => void;
}

export function BlueprintModal({ strategyId, onClose }: BlueprintModalProps) {
  useEffect(() => {
    document.body.style.overflow = strategyId !== null ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [strategyId]);

  if (strategyId === null) return null;

  const strategy = STRATEGIES[strategyId];

  return (
    <div
      id="blueprintModal"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
    >
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-fade relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 z-10"
          aria-label="Close"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div
          id="modalBody"
          className="p-8 md:p-10 max-h-[80vh] overflow-y-auto modal-scroll"
        >
          {strategy.content}
        </div>
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold uppercase"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

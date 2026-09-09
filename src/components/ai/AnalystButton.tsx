"use client";

import React from "react";
import { Sparkles, Brain } from "lucide-react";
import { Market } from "@/types/market";
import { useAIAnalyst } from "@/store/useAIAnalyst";

interface AIAnalystButtonProps {
  market: Market;
}

export const AIAnalystButton: React.FC<AIAnalystButtonProps> = ({ market }) => {
  const { isOpen, open, close } = useAIAnalyst();

  const toggle = () => {
    if (isOpen) close();
    else open(market);
  };

  return (
    <button
      onClick={toggle}
      aria-expanded={isOpen}
      aria-controls="analyst-drawer"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-colors min-h-[28px] ${
        isOpen
          ? "bg-indigo-600/20 text-indigo-200 border-indigo-500/30 hover:bg-indigo-600/25"
          : "bg-[#111827] text-gray-400 border-[#1F2937] hover:text-gray-200 hover:bg-white/[0.04]"
      }`}
      aria-label={isOpen ? "Close AI Market Analyst" : "Open AI Market Analyst"}
    >
      {isOpen ? <Brain className="w-3.5 h-3.5" aria-hidden="true" /> : <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />}
      <span>{isOpen ? "Analyst open" : "AI Analyst"}</span>
    </button>
  );
};

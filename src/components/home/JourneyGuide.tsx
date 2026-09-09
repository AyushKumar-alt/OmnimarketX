"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type StageId = "discover" | "understand" | "evaluate" | "predict" | "discuss";

type Stage = {
  id: StageId;
  label: string;
  title: string;
  description: string;
  ctas: { label: string; href: string; variant: "primary" | "ghost" }[];
};

const STAGES: Stage[] = [
  {
    id: "discover",
    label: "Discover",
    title: "Find something worth predicting.",
    description: "Explore active markets, see what's trending, and discover what the community is watching.",
    ctas: [
      { label: "Explore Markets", href: "/", variant: "primary" },
      { label: "View Trending", href: "/trending", variant: "ghost" },
      { label: "Explore Social", href: "/social", variant: "ghost" },
    ],
  },
  {
    id: "understand",
    label: "Understand",
    icon: undefined,
    title: "Know exactly what you're predicting.",
    description:
      "Review the market question, deadline, probability, trading activity, and resolution criteria before making a prediction.",
    ctas: [{ label: "Explore Markets", href: "/", variant: "primary" }],
  } as Stage,
  {
    id: "evaluate",
    label: "Evaluate",
    title: "Decide how strong the market signal is.",
    description:
      "Consider probability, volume, traders, liquidity and price history. Use the AI Market Analyst to understand the Bull Case, Bear Case and resolution risk.",
    ctas: [{ label: "Explore a Market", href: "/market/mkt-1", variant: "primary" }],
  },
  {
    id: "predict",
    label: "Predict",
    title: "Make your prediction.",
    description:
      "Choose YES or NO, enter your stake, review the fee and potential payout, and place your demo trade.",
    ctas: [
      { label: "Explore Markets", href: "/", variant: "primary" },
      { label: "View Portfolio", href: "/portfolio", variant: "ghost" },
    ],
  },
  {
    id: "discuss",
    label: "Discuss",
    title: "See what other people think.",
    description: "Join market discussions, compare perspectives, and discover markets through the community.",
    ctas: [{ label: "Explore Social", href: "/social", variant: "primary" }],
  },
];

export const JourneyGuide: React.FC = () => {
  const [active, setActive] = useState<StageId | null>(null);

  const handleClick = (id: StageId) => {
    setActive((prev) => (prev === id ? null : id));
  };

  const stage = active ? STAGES.find((s) => s.id === active)! : null;

  return (
    <section aria-label="Product journey" className="space-y-3">
      {/* Compact horizontal navigation — near discovery area */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Optional discovery hint — keeps layout balanced without adding a full search bar */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
          How it works
        </div>

        <nav
          aria-label="Journey stages"
          className="flex items-center gap-1 sm:gap-3 overflow-x-auto scrollbar-none -mx-1 px-1 py-1 snap-x snap-mandatory"
        >
          {STAGES.map((s, i) => {
            const isActive = active === s.id;
            return (
              <React.Fragment key={s.id}>
                <button
                  onClick={() => handleClick(s.id)}
                  aria-pressed={isActive}
                  aria-expanded={isActive}
                  aria-controls={isActive ? `journey-panel-${s.id}` : undefined}
                  className={`whitespace-nowrap text-[13px] sm:text-[14px] font-bold tracking-tight transition-colors min-h-[44px] px-2.5 sm:px-3 py-2 rounded-lg border snap-start ${
                    isActive
                      ? "text-indigo-600 dark:text-white bg-indigo-600/10 dark:bg-indigo-500/15 border-indigo-500/30 dark:border-indigo-500/30"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border-transparent hover:bg-[#111827] dark:hover:bg-white/[0.04] hover:border-[#1F2937]"
                  }`}
                  style={
                    isActive
                      ? {}
                      : undefined
                  }
                >
                  <span className={isActive ? "underline decoration-2 underline-offset-4 decoration-indigo-500" : ""}>
                    {s.label}
                  </span>
                </button>
                {i < STAGES.length - 1 && (
                  <span aria-hidden="true" className="hidden sm:block text-gray-600 dark:text-gray-600 text-[10px] select-none">
                    ·
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Compact contextual panel — only one or zero open */}
      {stage && (
        <div
          id={`journey-panel-${stage.id}`}
          role="region"
          aria-label={`${stage.label} details`}
          className="omx-card p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 animate-in fade-in"
        >
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="text-[13px] font-bold text-gray-900 dark:text-white leading-snug">{stage.title}</h3>
            <p className="text-[12px] text-gray-600 dark:text-gray-400 leading-relaxed">{stage.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {stage.ctas.map((cta) => (
              <Link
                key={cta.label}
                href={cta.href}
                className={
                  cta.variant === "primary"
                    ? "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-semibold shadow-sm transition-colors min-h-[36px]"
                    : "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1F2937] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.04] text-[12px] font-semibold transition-colors min-h-[36px]"
                }
              >
                {cta.label}
                <ArrowRight className="w-3 h-3 opacity-60" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

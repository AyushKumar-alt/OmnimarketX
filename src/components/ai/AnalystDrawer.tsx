"use client";

import React, { useEffect } from "react";
import { X, Sparkles, TrendingUp, ShieldAlert, Scale, Lightbulb, AlertTriangle, ExternalLink } from "lucide-react";
import { Market } from "@/types/market";
import { useAIAnalyst } from "@/store/useAIAnalyst";

interface Props {
  market: Market;
}

export const AnalystDrawer: React.FC<Props> = ({ market }) => {
  const { isOpen, analysis, close, open } = useAIAnalyst();

  useEffect(() => {
    if (isOpen && analysis) {
      open(market);
    }
  }, [market.id]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, close]);

  if (!isOpen || !analysis) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-labelledby="analyst-title">
      <button
        aria-label="Close analyst overlay"
        onClick={close}
        className="absolute inset-0 bg-[#060A14]/70 backdrop-blur-[2px]"
      />
      <div className="relative w-full sm:w-[440px] sm:max-w-[92vw] h-[100dvh] bg-[#0B0F19] border-l border-[#1F2937] shadow-2xl flex flex-col overflow-hidden">
        <div className="shrink-0 px-4 sm:px-5 py-4 border-b border-[#1F2937] flex items-center justify-between gap-3 bg-[#111827]">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 id="analyst-title" className="text-[13px] font-extrabold tracking-wide text-white leading-none">AI Market Analyst</h2>
              <p className="text-[11px] text-gray-400 leading-none mt-1">Local · deterministic · no external news</p>
            </div>
          </div>
          <button
            onClick={close}
            autoFocus
            className="shrink-0 w-9 h-9 rounded-xl bg-[#0B0F19] border border-[#1F2937] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.04] transition-colors"
            aria-label="Close AI Market Analyst"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-5 space-y-5 scrollbar-none">
          <section aria-labelledby="snap-heading" className="omx-card p-4 space-y-3">
            <h3 id="snap-heading" className="omx-eyebrow flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-300" aria-hidden="true" /> Market Snapshot
            </h3>
            <p className="text-[13px] font-semibold text-gray-200 leading-snug line-clamp-3">{analysis.snapshot.title}</p>
            <dl className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#0B0F19] border border-[#1F2937] p-3">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-gray-500">YES price</dt>
                <dd className={`text-[22px] font-extrabold font-mono omx-num leading-none mt-1 ${analysis.snapshot.isUnseeded ? "text-gray-400" : "text-emerald-300"}`}>{analysis.snapshot.probability}%</dd>
                <dd className="text-[11px] text-gray-500 font-mono omx-num mt-1">{analysis.references.probabilitySource}</dd>
                {analysis.snapshot.isUnseeded && <dd className="text-[11px] font-semibold text-amber-300 mt-1">Unseeded — not consensus</dd>}
              </div>
              <div className="rounded-xl bg-[#0B0F19] border border-[#1F2937] p-3">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Deadline</dt>
                <dd className="text-[18px] font-bold text-white font-mono omx-num leading-none mt-1">{analysis.snapshot.daysLeft}d left</dd>
                <dd className="text-[11px] text-gray-500 mt-1">{new Date(market.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</dd>
              </div>
              <div className="rounded-xl bg-[#0B0F19] border border-[#1F2937] p-3">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Volume</dt>
                <dd className="text-[15px] font-bold text-gray-100 font-mono omx-num mt-1">${analysis.snapshot.volume.toLocaleString()}</dd>
                <dd className="text-[11px] text-gray-500 mt-1">{analysis.references.volumeSource}</dd>
              </div>
              <div className="rounded-xl bg-[#0B0F19] border border-[#1F2937] p-3">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Traders</dt>
                <dd className="text-[15px] font-bold text-gray-100 font-mono omx-num mt-1">{analysis.snapshot.traderCount.toLocaleString()}</dd>
                <dd className="text-[11px] text-gray-500 mt-1">{analysis.references.traderCountSource}</dd>
              </div>
            </dl>
            <p className="text-[11px] text-gray-500 leading-relaxed">Category <span className="text-gray-300 font-semibold">{analysis.snapshot.category}</span> · Liquidity ${market.liquidity.toLocaleString()}</p>
          </section>

          <section aria-labelledby="factors-heading" className="omx-card p-4 space-y-3">
            <h3 id="factors-heading" className="omx-eyebrow flex items-center gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" /> Key Factors
            </h3>
            <ul className="space-y-2.5">
              {analysis.keyFactors.map((f, i) => (
                <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-gray-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" aria-hidden="true" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="grid grid-cols-1 gap-4">
            <section aria-labelledby="bull-heading" className="rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20 p-4 space-y-2">
              <h3 id="bull-heading" className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" /> Bull Case — why YES could win
              </h3>
              <p className="text-[13px] leading-relaxed text-gray-200">{analysis.bullCase}</p>
            </section>
            <section aria-labelledby="bear-heading" className="rounded-2xl bg-rose-500/[0.06] border border-rose-500/20 p-4 space-y-2">
              <h3 id="bear-heading" className="text-[11px] font-extrabold uppercase tracking-wider text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" /> Bear Case — why NO could win
              </h3>
              <p className="text-[13px] leading-relaxed text-gray-200">{analysis.bearCase}</p>
            </section>
          </div>

          <section aria-labelledby="change-heading" className="omx-card p-4 space-y-2">
            <h3 id="change-heading" className="omx-eyebrow flex items-center gap-2">
              <Scale className="w-3.5 h-3.5 text-cyan-300" aria-hidden="true" /> What Could Change the Odds?
            </h3>
            <p className="text-[13px] leading-relaxed text-gray-300">{analysis.whatCouldChange}</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">No live news invented. This is based only on market pricing, participation, deadline and the stated resolution criteria.</p>
          </section>

          <section aria-labelledby="risk-heading" className="rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 p-4 space-y-2">
            <h3 id="risk-heading" className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" /> Resolution Risk
            </h3>
            <p className="text-[13px] leading-relaxed text-gray-200">{analysis.resolutionRisk}</p>
            <div className="pt-3 mt-2 border-t border-amber-500/15 space-y-1.5 text-[12px] leading-relaxed">
              <p className="text-gray-300"><span className="font-semibold text-gray-200">Criteria:</span> {analysis.references.resolutionCriteria}</p>
              <p className="text-gray-400 flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-gray-300">Source:</span> {analysis.references.resolutionSource}
                {market.resolutionSourceUrl && (
                  <a href={market.resolutionSourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-indigo-300 hover:text-indigo-200">
                    open <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                )}
              </p>
            </div>
          </section>

          <p className="text-[11px] text-center text-gray-500 px-2 leading-relaxed">
            Deterministic summary from on-chain market data only. Not financial advice. Market price ≠ certainty.
          </p>
        </div>

        <div className="shrink-0 p-4 border-t border-[#1F2937] bg-[#111827]">
          <button onClick={close} className="w-full omx-btn-ghost justify-center !py-3">
            Close analyst
          </button>
        </div>
      </div>
    </div>
  );
};

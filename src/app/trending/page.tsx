"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/layout/Shell";
import { MOCK_MARKETS } from "@/data/mockMarkets";
import { Market, MarketCategory } from "@/types/market";
import { TrustBadge } from "@/components/trust/TrustBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Flame,
  TrendingUp,
  TrendingDown,
  BarChart3,
  MessageSquare,
  Users,
  Calendar,
  SearchX,
  Info,
  Activity,
} from "lucide-react";

type CategoryFilter = MarketCategory;

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "tech", label: "Tech & AI" },
  { id: "finance", label: "Finance" },
  { id: "crypto", label: "Crypto" },
  { id: "science", label: "Science" },
  { id: "geopolitics", label: "Geopolitics" },
  { id: "popculture", label: "Pop Culture" },
];

function formatCompactUSD(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}

function getMoverDelta(m: Market): number {
  if (m.isUnseeded || m.priceHistory.length < 2) return 0;
  const first = m.priceHistory[0].yesPrice;
  const last = m.priceHistory[m.priceHistory.length - 1].yesPrice;
  return (last - first) * 100; // pp
}

function formatDeadline(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const TrendingCard: React.FC<{ market: Market; rank: number; delta?: number; showDelta?: boolean }> = ({
  market,
  rank,
  delta,
  showDelta,
}) => {
  const yes = market.yesProbability;
  const absDelta = delta !== undefined ? Math.abs(delta) : 0;
  const isUp = delta !== undefined ? delta >= 0 : true;

  return (
    <article className="group relative flex flex-col rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-indigo-500/30 transition-colors overflow-hidden shadow-lg shadow-black/20">
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white/[0.06] text-gray-300 border border-white/10">
              {market.category}
            </span>
            <TrustBadge trustLevel={market.trustLevel} isUnseeded={market.isUnseeded} size="sm" />
          </div>
          <span className="shrink-0 w-6 h-6 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-[11px] font-extrabold text-gray-400 omx-num">
            {rank}
          </span>
        </div>
        <Link href={`/market/${market.id}`} className="block">
          <h3 className="text-[14px] font-semibold text-gray-100 leading-snug line-clamp-2 text-balance group-hover:text-indigo-200 transition-colors">
            {market.title}
          </h3>
        </Link>
        <p className="mt-1 text-[12px] text-gray-400 leading-relaxed line-clamp-2">{market.description}</p>
      </div>

      <div className="px-4 py-3 space-y-2">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-mono text-[15px] font-bold text-emerald-300 omx-num">
            {yes}% <span className="text-[11px] font-sans font-semibold text-gray-400">YES</span>
          </span>
          {showDelta && delta !== undefined && market.priceHistory.length > 1 && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded-md omx-num border ${
                absDelta < 0.5
                  ? "bg-[#1F2937] text-gray-400 border-[#1F2937]"
                  : isUp
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                    : "bg-rose-500/10 text-rose-300 border-rose-500/30"
              }`}
            >
              {absDelta < 0.5 ? (
                "flat"
              ) : isUp ? (
                <>
                  <TrendingUp className="w-3 h-3" aria-hidden="true" />+{absDelta.toFixed(1)}pp
                </>
              ) : (
                <>
                  <TrendingDown className="w-3 h-3" aria-hidden="true" />-{absDelta.toFixed(1)}pp
                </>
              )}
            </span>
          )}
        </div>

        <div className="h-1.5 w-full bg-[#1F2937] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" style={{ width: `${yes}%` }} />
        </div>

        <div className="grid grid-cols-3 gap-2 text-[11px] text-gray-500">
          <span className="omx-num font-mono font-semibold whitespace-nowrap" title={`Volume ${market.volume.toLocaleString()}`}>
            {formatCompactUSD(market.volume)} vol
          </span>
          <span className="flex items-center justify-center gap-1 omx-num whitespace-nowrap" title={`${market.traderCount} traders`}>
            <Users className="w-3 h-3" aria-hidden="true" /> {market.traderCount >= 1000 ? `${(market.traderCount / 1000).toFixed(1)}k` : market.traderCount}
          </span>
          <span className="flex items-center justify-end gap-1 omx-num whitespace-nowrap" title={`${market.commentCount} comments`}>
            <MessageSquare className="w-3 h-3" aria-hidden="true" /> {market.commentCount}
          </span>
        </div>
      </div>

      <div className="mt-auto px-4 pb-4 pt-3 border-t border-[#1F2937]/70 bg-[#0D1320]/60 flex items-center justify-between gap-2 text-[11px] text-gray-400">
        <span className="flex items-center gap-1 shrink-0 whitespace-nowrap" title={`Resolves ${formatDeadline(market.endDate)}`}>
          <Calendar className="w-3 h-3" aria-hidden="true" /> {formatDeadline(market.endDate)}
        </span>
        <Link
          href={`/market/${market.id}`}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-300 hover:text-indigo-200"
        >
          View → 
        </Link>
      </div>
    </article>
  );
};

export default function TrendingPage() {
  const [category, setCategory] = useState<CategoryFilter>("all");

  const filtered = useMemo(() => {
    if (category === "all") return MOCK_MARKETS;
    return MOCK_MARKETS.filter((m) => m.category === category);
  }, [category]);

  const rankable = useMemo(() => filtered.filter((m) => !m.isUnseeded && m.volume > 0 && m.traderCount > 0), [filtered]);
  const unseededCount = useMemo(() => filtered.filter((m) => m.isUnseeded).length, [filtered]);

  const movers = useMemo(() => {
    return rankable
      .map((m) => ({ m, delta: getMoverDelta(m) }))
      .filter((x) => Math.abs(x.delta) >= 0.5)
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
      .slice(0, 3);
  }, [rankable]);

  // fallback if no >0.5pp movers, show top by abs delta anyway
  const moversFallback = useMemo(() => {
    if (movers.length > 0) return movers;
    return rankable
      .map((m) => ({ m, delta: getMoverDelta(m) }))
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
      .slice(0, 3);
  }, [rankable, movers]);

  const mostTraded = useMemo(() => rankable.slice().sort((a, b) => b.volume - a.volume).slice(0, 3), [rankable]);
  const mostDiscussed = useMemo(() => rankable.slice().sort((a, b) => b.commentCount - a.commentCount).slice(0, 3), [rankable]);

  const isEmpty = rankable.length === 0;

  return (
    <Shell>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1.5 min-w-0">
              <h1 className="text-[26px] lg:text-[32px] font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-pink-500 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                  <Flame className="w-5 h-5 text-white" aria-hidden="true" />
                </span>
                Trending
              </h1>
              <p className="text-[13px] text-gray-400 leading-relaxed max-w-2xl">
                Demo activity from mock price history, volume, and comments. Rankings exclude unseeded (0-volume) markets — 50% there is the starting price, not consensus.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#111827] border border-[#1F2937] text-gray-400 shrink-0">
              <Activity className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              Demo data
            </span>
          </div>

          <div className="omx-card p-3 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-300 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-[12px] leading-relaxed text-gray-300">
              <strong className="text-gray-100">How this is ranked:</strong> Movers = absolute YES% change from first to last mock price point. Volume = total mock volume. Discussed = mock comment count. Filter by category — unseeded markets are never ranked as trending.
            </p>
          </div>
        </div>

        {/* Category filters */}
        <div
          aria-label="Filter trending by category"
          className="scroll-x flex items-center gap-2 pb-1 scrollbar-none -mx-1 px-1"
        >
          {CATEGORIES.map((cat) => {
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                aria-pressed={active}
                onClick={() => setCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-colors min-h-[40px] border ${
                  active ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 border-indigo-600" : "bg-[#111827] text-gray-400 hover:text-gray-100 border-[#1F2937] hover:border-gray-600"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {isEmpty ? (
          <EmptyState
            icon={SearchX}
            title={category === "all" ? "No trending demo markets" : `No trending ${category} markets`}
            description={
              unseededCount > 0
                ? `${unseededCount} market${unseededCount > 1 ? "s" : ""} in this category ${unseededCount > 1 ? "are" : "is"} unseeded (0 volume, 50% is not consensus) and excluded from rankings. Try All or another category.`
                : "No rankable demo markets for this filter. Unseeded 0-volume markets are excluded. Try another category."
            }
            actionLabel="Show All"
            onActionClick={() => setCategory("all")}
          />
        ) : (
          <div className="space-y-8">
            {/* Biggest Probability Movers */}
            <section aria-labelledby="movers-heading" className="space-y-3">
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <h2 id="movers-heading" className="text-[15px] font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" aria-hidden="true" />
                  Biggest Probability Movers
                  <span className="text-xs font-medium text-gray-500 omx-num">mock Δ</span>
                </h2>
                <span className="text-[11px] text-gray-500">Abs |YES% last – first| · demo history</span>
              </div>
              {moversFallback.length === 0 ? (
                <p className="text-[13px] text-gray-500">No price history to compare.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {moversFallback.map(({ m, delta }, i) => (
                    <TrendingCard key={m.id} market={m} rank={i + 1} delta={delta} showDelta />
                  ))}
                </div>
              )}
            </section>

            {/* Most Traded */}
            <section aria-labelledby="volume-heading" className="space-y-3">
              <h2 id="volume-heading" className="text-[15px] font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                Most Traded <span className="text-gray-500 font-medium text-xs">· Highest Volume</span>
                <span className="text-xs font-medium text-gray-500 omx-num">demo</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mostTraded.map((m, i) => (
                  <TrendingCard key={m.id} market={m} rank={i + 1} />
                ))}
              </div>
            </section>

            {/* Most Discussed */}
            <section aria-labelledby="discussed-heading" className="space-y-3">
              <h2 id="discussed-heading" className="text-[15px] font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-300" aria-hidden="true" />
                Most Discussed
                <span className="text-xs font-medium text-gray-500 omx-num">mock comments</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mostDiscussed.map((m, i) => (
                  <TrendingCard key={m.id} market={m} rank={i + 1} />
                ))}
              </div>
            </section>

            {unseededCount > 0 && (
              <div className="omx-card p-4 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-[12px] leading-relaxed text-gray-400">
                  <strong className="text-gray-200">{unseededCount} unseeded market{unseededCount > 1 ? "s" : ""} hidden</strong> in this view — {filtered.filter((m) => m.isUnseeded).map((m) => m.title).join(" · ").slice(0, 120)}… 0 volume / 0 traders / 50% starting price is not ranked.{" "}
                  <Link href="/" className="text-indigo-300 hover:text-indigo-200 font-semibold">
                    Browse all →
                  </Link>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Shell>
  );
}

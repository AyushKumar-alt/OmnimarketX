"use client";

import React from "react";
import Link from "next/link";
import { Users, Calendar, Bookmark, AlertCircle, MessageSquare } from "lucide-react";
import { Market } from "@/types/market";
import { TrustBadge } from "@/components/trust/TrustBadge";
import { useMarketStore } from "@/store/useMarketStore";

interface MarketCardProps {
  market: Market;
}

function formatCompactUSD(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market }) => {
  const { watchlist, toggleWatchlist } = useMarketStore();
  const isSaved = watchlist.includes(market.id);

  const formattedEndDate = new Date(market.endDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const yes = market.yesProbability;
  const no = 100 - market.yesProbability;

  return (
    <article className="group relative flex flex-col rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-indigo-500/40 transition-colors duration-200 overflow-hidden shadow-lg shadow-black/20 focus-within:border-indigo-500/50">
      {/* Header: category + trust + save */}
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white/[0.06] text-gray-300 border border-white/10">
              {market.category}
            </span>
            <TrustBadge trustLevel={market.trustLevel} isUnseeded={market.isUnseeded} size="sm" />
          </div>

          <button
            onClick={() => toggleWatchlist(market.id)}
            aria-pressed={isSaved}
            aria-label={isSaved ? `Remove "${market.title}" from watchlist` : `Save "${market.title}" to watchlist`}
            title={isSaved ? "Remove from watchlist" : "Save to watchlist"}
            className={`shrink-0 p-2 rounded-lg transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center ${
              isSaved
                ? "text-indigo-300 bg-indigo-500/15 border border-indigo-500/30"
                : "text-gray-500 hover:text-gray-200 hover:bg-white/5 border border-transparent"
            }`}
          >
            <Bookmark className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} aria-hidden="true" />
          </button>
        </div>

        <Link href={`/market/${market.id}`} className="block rounded-lg">
          <h3 className="text-[15px] font-semibold text-gray-100 leading-snug line-clamp-2 text-balance group-hover:text-indigo-200 transition-colors">
            {market.title}
          </h3>
        </Link>
        <p className="mt-1.5 text-[13px] text-gray-400 leading-relaxed line-clamp-2">
          {market.description}
        </p>
      </div>

      {/* Probability */}
      <div className="px-4 py-3">
        {market.isUnseeded ? (
          <div className="p-3 rounded-xl bg-amber-500/[0.07] border border-amber-500/25 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-amber-300">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                No activity yet
              </span>
              <span className="font-mono text-gray-300 omx-num">50% YES</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-snug">
              Starting price — not trader consensus. Seed it with the first trade.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[15px] font-bold text-emerald-300 omx-num">
                {yes}% <span className="text-[11px] font-sans font-semibold text-gray-400">YES</span>
              </span>
              <span className="font-mono text-[13px] font-semibold text-gray-400 omx-num">
                {no}% <span className="text-[11px] font-sans font-medium text-gray-500">NO</span>
              </span>
            </div>

            <div
              role="img"
              aria-label={`Market consensus: ${yes}% YES, ${no}% NO`}
              className="h-2 w-full bg-[#1F2937] rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                style={{ width: `${yes}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-500">
              <span className="omx-num font-mono">${market.yesPrice.toFixed(2)} / ${market.noPrice.toFixed(2)}</span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" aria-hidden="true" />
                {market.commentCount}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Actions + meta */}
      <div className="mt-auto px-4 pb-4 pt-3 border-t border-[#1F2937]/70 bg-[#0D1320]/60 space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/market/${market.id}?outcome=YES`}
            aria-label={`Buy YES in ${market.title} at $${market.yesPrice.toFixed(2)}`}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/25 active:bg-emerald-500/30 text-emerald-200 border border-emerald-500/30 hover:border-emerald-500/50 transition-colors text-xs font-extrabold min-h-[44px]"
          >
            <span>Yes</span>
            <span className="font-mono omx-num">${market.yesPrice.toFixed(2)}</span>
          </Link>

          <Link
            href={`/market/${market.id}?outcome=NO`}
            aria-label={`Buy NO in ${market.title} at $${market.noPrice.toFixed(2)}`}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 active:bg-rose-500/30 text-rose-200 border border-rose-500/30 hover:border-rose-500/50 transition-colors text-xs font-extrabold min-h-[44px]"
          >
            <span>No</span>
            <span className="font-mono omx-num">${market.noPrice.toFixed(2)}</span>
          </Link>
        </div>

        <div className="flex items-center justify-between gap-2 text-[11px] text-gray-400">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono font-semibold omx-num whitespace-nowrap" title={`Volume ${market.volume.toLocaleString()}`}>
              {formatCompactUSD(market.volume)} vol
            </span>
            <span aria-hidden="true" className="text-gray-600">·</span>
            <span className="flex items-center gap-1 omx-num whitespace-nowrap" title={`${market.traderCount} traders`}>
              <Users className="w-3 h-3 text-gray-500" aria-hidden="true" />
              {market.traderCount >= 1000 ? `${(market.traderCount / 1000).toFixed(1)}k` : market.traderCount}
            </span>
          </div>

          <span className="flex items-center gap-1 text-gray-500 shrink-0 whitespace-nowrap" title={`Resolves ${formattedEndDate}`}>
            <Calendar className="w-3 h-3" aria-hidden="true" />
            {formattedEndDate}
          </span>
        </div>
      </div>
    </article>
  );
};

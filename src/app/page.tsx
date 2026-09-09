"use client";

import React, { useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { MarketFilters } from "@/components/discovery/MarketFilters";
import { MarketGrid } from "@/components/discovery/MarketGrid";
import { MOCK_MARKETS } from "@/data/mockMarkets";
import { useMarketStore } from "@/store/useMarketStore";
import { Flame, ShieldCheck, TrendingUp, Compass, Scale, FlaskConical, MessagesSquare, ArrowRight, Bookmark } from "lucide-react";
import Link from "next/link";
import { JourneyGuide } from "@/components/home/JourneyGuide";

const STEPS = [
  { icon: Compass, label: "Discover" },
  { icon: Scale, label: "Understand" },
  { icon: FlaskConical, label: "Evaluate" },
  { icon: TrendingUp, label: "Predict" },
  { icon: MessagesSquare, label: "Discuss" },
];

export default function DiscoveryPage() {
  const { selectedCategory, searchQuery, sortBy, hideUnseeded, showWatchlistOnly, watchlist } = useMarketStore();

  const filteredMarkets = useMemo(() => {
    return MOCK_MARKETS.filter((market) => {
      if (selectedCategory !== "all" && market.category !== selectedCategory) {
        return false;
      }
      if (
        searchQuery &&
        !market.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !market.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (hideUnseeded && market.isUnseeded) {
        return false;
      }
      if (showWatchlistOnly && !watchlist.includes(market.id)) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "volume") return b.volume - a.volume;
      if (sortBy === "traders") return b.traderCount - a.traderCount;
      if (sortBy === "newest") return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
      if (sortBy === "expiring") return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy, hideUnseeded, showWatchlistOnly, watchlist]);

  const featuredMarket = useMemo(() => {
    return MOCK_MARKETS.find((m) => m.featured && !m.isUnseeded) || MOCK_MARKETS[0];
  }, []);

  const totals = useMemo(() => {
    const live = MOCK_MARKETS.filter((m) => !m.isUnseeded);
    return {
      live: live.length,
      volume: live.reduce((a, m) => a + m.volume, 0),
      traders: live.reduce((a, m) => a + m.traderCount, 0),
    };
  }, []);

  const showFeatured = featuredMarket && !searchQuery && selectedCategory === "all" && !showWatchlistOnly;

  return (
    <Shell>
      <div className="space-y-6">
        {/* Hero — Discover */}
        <section aria-labelledby="discover-heading" className="relative rounded-3xl bg-gradient-to-br from-indigo-950/60 via-[#111827] to-[#111827] border border-indigo-500/20 p-6 lg:p-8 overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-indigo-600/15 blur-3xl" />
          <div className="relative max-w-2xl space-y-4">
            <p className="omx-eyebrow !text-indigo-300">Discover · prediction markets</p>
            <h1 id="discover-heading" className="text-[26px] lg:text-[32px] font-extrabold text-white tracking-tight leading-[1.15] text-balance">
              Trade opinions. Track consensus.{" "}
              <span className="bg-gradient-to-r from-indigo-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                Predict what matters.
              </span>
            </h1>
            <p className="text-sm text-gray-300/90 leading-relaxed max-w-xl">
              Verified sources, honest liquidity signals, and simulated demo trading — so you can evaluate before you predict.
            </p>

            {/* Journey stepper */}
            <ol aria-label="How OmniMarketX works" className="flex items-center gap-1 sm:gap-2 pt-1 flex-wrap">
              {STEPS.map((s, i) => (
                <li key={s.label} className="flex items-center gap-1 sm:gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-[11px] font-semibold text-gray-200">
                    <s.icon className="w-3.5 h-3.5 text-indigo-300" aria-hidden="true" />
                    <span className="hidden sm:inline">{s.label}</span>
                    <span className="sm:hidden">{i + 1}</span>
                  </span>
                  {i < STEPS.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-gray-600" aria-hidden="true" />
                  )}
                </li>
              ))}
            </ol>

            <div className="flex items-center gap-x-4 gap-y-1 pt-1 text-xs text-gray-400 flex-wrap">
              <span className="omx-num"><strong className="text-gray-100 font-bold">{totals.live}</strong> live markets</span>
              <span aria-hidden="true" className="w-1 h-1 rounded-full bg-gray-600" />
              <span className="omx-num"><strong className="text-gray-100 font-bold">${(totals.volume / 1000000).toFixed(1)}M</strong> volume</span>
              <span aria-hidden="true" className="w-1 h-1 rounded-full bg-gray-600" />
              <span className="omx-num"><strong className="text-gray-100 font-bold">{(totals.traders / 1000).toFixed(1)}k</strong> traders</span>
            </div>
          </div>
        </section>

        {/* Interactive Journey — lightweight onboarding guide */}
        <JourneyGuide />

        {/* Featured — Evaluate */}
        {showFeatured && (
          <section aria-labelledby="featured-heading" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 id="featured-heading" className="omx-eyebrow flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" aria-hidden="true" />
                Featured market
              </h2>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[#111827] border border-indigo-500/25 shadow-xl flex flex-col md:flex-row md:items-center gap-5">
              <div className="space-y-2.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-white/[0.06] text-gray-300 border border-white/10 uppercase tracking-wider">
                    {featuredMarket.category}
                  </span>
                  <span className="text-[11px] text-emerald-300 font-semibold inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                    Verified source
                  </span>
                </div>
                <Link href={`/market/${featuredMarket.id}`}>
                  <h3 className="text-[17px] lg:text-lg font-bold text-white hover:text-indigo-200 transition-colors leading-snug text-balance">
                    {featuredMarket.title}
                  </h3>
                </Link>
                <p className="text-[13px] text-gray-400 line-clamp-2 leading-relaxed">
                  {featuredMarket.description}
                </p>
                <p className="text-[11px] text-gray-500 omx-num">
                  ${(featuredMarket.volume).toLocaleString()} volume · {featuredMarket.traderCount.toLocaleString()} traders · {featuredMarket.commentCount} comments
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0 md:pl-5 md:border-l md:border-[#1F2937] md:ml-1 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-[#1F2937] pt-4 md:pt-0">
                <div className="md:text-right min-w-0">
                  <div className="text-[28px] leading-none font-extrabold text-emerald-300 font-mono omx-num whitespace-nowrap">
                    {featuredMarket.yesProbability}%
                  </div>
                  <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-1 whitespace-nowrap">
                    Yes consensus
                  </div>
                </div>
                <Link
                  href={`/market/${featuredMarket.id}`}
                  className="omx-btn-primary !text-[13px] shrink-0"
                >
                  Evaluate & trade
                  <TrendingUp className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Main discovery grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_290px] gap-6 items-start">
          <section aria-labelledby="explore-heading" className="space-y-3 min-w-0">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 id="explore-heading" className="text-[15px] font-bold text-gray-100 flex items-center gap-2">
                {showWatchlistOnly ? (
                  <>
                    <Bookmark className="w-4 h-4 text-indigo-300" aria-hidden="true" />
                    Saved markets
                  </>
                ) : (
                  "Explore markets"
                )}
                <span className="text-xs font-medium text-gray-500 omx-num">
                  {filteredMarkets.length} listed
                </span>
              </h2>
            </div>

            <MarketFilters />
            <MarketGrid markets={filteredMarkets} />
          </section>

          {/* Right rail */}
          <aside className="space-y-4 lg:sticky lg:top-[80px] min-w-0" aria-label="Market context">
            <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-3">
              <h3 className="omx-eyebrow !text-indigo-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                Why trust these odds?
              </h3>
              <ul className="space-y-2.5 text-[13px] text-gray-300 leading-relaxed">
                <li className="flex gap-2">
                  <span aria-hidden="true" className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  Verified sources link every market to its resolution authority.
                </li>
                <li className="flex gap-2">
                  <span aria-hidden="true" className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  Liquidity badges separate real consensus from thin books.
                </li>
                <li className="flex gap-2">
                  <span aria-hidden="true" className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  Unseeded markets are flagged — 50% means “no trades yet.”
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-3">
              <h3 className="omx-eyebrow flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                Most liquid
              </h3>
              <ol className="space-y-1">
                {MOCK_MARKETS.filter((m) => !m.isUnseeded)
                  .sort((a, b) => b.volume - a.volume)
                  .slice(0, 3)
                  .map((m, i) => (
                    <li key={m.id}>
                      <Link
                        href={`/market/${m.id}`}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/10"
                      >
                        <span aria-hidden="true" className="text-[11px] font-extrabold text-gray-500 omx-num w-4">
                          {i + 1}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-[13px] font-medium text-gray-200 line-clamp-1">
                            {m.title}
                          </span>
                          <span className="block text-[11px] text-gray-500 omx-num mt-0.5">
                            ${(m.volume / 1000).toFixed(0)}k vol · {m.traderCount.toLocaleString()} traders
                          </span>
                        </span>
                        <span className="text-[13px] font-mono font-bold text-emerald-300 omx-num shrink-0">
                          {m.yesProbability}%
                        </span>
                      </Link>
                    </li>
                  ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </Shell>
  );
}

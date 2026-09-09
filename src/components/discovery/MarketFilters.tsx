"use client";

import React from "react";
import { SlidersHorizontal, EyeOff, Search, Bookmark } from "lucide-react";
import { MarketCategory } from "@/types/market";
import { useMarketStore } from "@/store/useMarketStore";

export const MarketFilters: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    hideUnseeded,
    setHideUnseeded,
    searchQuery,
    setSearchQuery,
    showWatchlistOnly,
    setShowWatchlistOnly,
    watchlist,
  } = useMarketStore();

  const categories: { id: MarketCategory; label: string }[] = [
    { id: "all", label: "All" },
    { id: "tech", label: "Tech & AI" },
    { id: "finance", label: "Finance" },
    { id: "crypto", label: "Crypto" },
    { id: "science", label: "Science" },
    { id: "geopolitics", label: "Geopolitics" },
  ];

  return (
    <div className="space-y-3">
      {/* Category pills */}
      <div
        role="tablist"
        aria-label="Filter markets by category"
        className="scroll-x flex items-center gap-2 pb-1 scrollbar-none -mx-1 px-1"
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-colors min-h-[40px] border ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 border-indigo-600"
                  : "bg-[#111827] text-gray-400 hover:text-gray-100 border-[#1F2937] hover:border-gray-600"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
        <span aria-hidden="true" className="w-px h-6 bg-[#1F2937] mx-1 shrink-0" />
        <button
          onClick={() => setShowWatchlistOnly(!showWatchlistOnly)}
          aria-pressed={showWatchlistOnly}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-colors min-h-[40px] border shrink-0 ${
            showWatchlistOnly
              ? "bg-indigo-600/15 text-indigo-200 border-indigo-500/40"
              : "bg-[#111827] text-gray-400 hover:text-gray-100 border-[#1F2937]"
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" fill={showWatchlistOnly ? "currentColor" : "none"} aria-hidden="true" />
          Saved ({watchlist.length})
        </button>
      </div>

      {/* Controls bar */}
      <div className="flex flex-col min-[480px]:flex-row min-[480px]:items-center gap-3 p-3 rounded-2xl bg-[#111827]/80 border border-[#1F2937]">
        <div className="relative md:hidden flex-1">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          <label htmlFor="omx-mobile-filter-search" className="sr-only">Search markets</label>
          <input
            id="omx-mobile-filter-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search markets…"
            className="w-full bg-[#0B0F19] text-gray-100 text-[13px] pl-9 pr-3 py-2.5 rounded-xl border border-[#1F2937] placeholder:text-gray-500"
          />
        </div>

        <label className="flex items-center gap-2.5 text-[13px] text-gray-300 cursor-pointer select-none min-h-[40px]">
          <input
            type="checkbox"
            checked={hideUnseeded}
            onChange={(e) => setHideUnseeded(e.target.checked)}
            className="w-4 h-4 rounded border-gray-600 bg-gray-900 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
          />
          <span className="flex items-center gap-1.5 text-gray-400">
            <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
            Hide unseeded
          </span>
        </label>

        <div className="flex items-center gap-2 text-[13px] min-[480px]:ml-auto">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" aria-hidden="true" />
          <label htmlFor="omx-sort" className="text-gray-400 font-medium">
            Sort
          </label>
          <select
            id="omx-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as never)}
            className="bg-[#0B0F19] text-gray-100 text-[13px] px-3 py-2 rounded-xl border border-[#1F2937] focus:outline-none focus:border-indigo-500 font-medium min-h-[40px] max-w-full"
          >
            <option value="volume">Highest volume</option>
            <option value="traders">Most traders</option>
            <option value="newest">Newest</option>
            <option value="expiring">Expiring soon</option>
          </select>
        </div>
      </div>
    </div>
  );
};

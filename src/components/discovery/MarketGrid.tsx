"use client";

import React from "react";
import { Market } from "@/types/market";
import { MarketCard } from "@/components/discovery/MarketCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchX } from "lucide-react";
import { useMarketStore } from "@/store/useMarketStore";

interface MarketGridProps {
  markets: Market[];
}

export const MarketGrid: React.FC<MarketGridProps> = ({ markets }) => {
  const { setSearchQuery, setSelectedCategory, setHideUnseeded, setShowWatchlistOnly } = useMarketStore();

  if (markets.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No markets match your filters"
        description="Try clearing your search, showing unseeded markets, or browsing a different category."
        actionLabel="Reset all filters"
        onActionClick={() => {
          setSearchQuery("");
          setSelectedCategory("all");
          setHideUnseeded(false);
          setShowWatchlistOnly(false);
        }}
      />
    );
  }

  return (
    <div aria-live="polite" className="grid grid-cols-1 min-[560px]:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
      {markets.map((market) => (
        <MarketCard key={market.id} market={market} />
      ))}
    </div>
  );
};

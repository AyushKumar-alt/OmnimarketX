import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MarketCategory, Position, TradeOrder } from "@/types/market";
import { MOCK_MARKETS } from "@/data/mockMarkets";

interface MarketStoreState {
  mode: "demo" | "real";
  demoBalance: number;
  positions: Position[];
  trades: TradeOrder[];
  watchlist: string[];
  selectedCategory: MarketCategory;
  searchQuery: string;
  sortBy: "volume" | "newest" | "expiring" | "traders";
  hideUnseeded: boolean;
  showWatchlistOnly: boolean;

  // Actions
  toggleMode: () => void;
  setMode: (mode: "demo" | "real") => void;
  setSelectedCategory: (category: MarketCategory) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: "volume" | "newest" | "expiring" | "traders") => void;
  setHideUnseeded: (hide: boolean) => void;
  setShowWatchlistOnly: (show: boolean) => void;
  toggleWatchlist: (marketId: string) => void;

  executeTrade: (
    marketId: string,
    outcome: "YES" | "NO",
    amount: number
  ) => { success: boolean; error?: string };

  closePosition: (positionId: string) => { success: boolean; error?: string };
  resetDemoAccount: () => void;
}

export const useMarketStore = create<MarketStoreState>()(
  persist(
    (set, get) => ({
      mode: "demo",
      demoBalance: 10000.00,
      positions: [],
      trades: [],
      watchlist: ["mkt-1", "mkt-2"],
      selectedCategory: "all",
      searchQuery: "",
      sortBy: "volume",
      hideUnseeded: false,
      showWatchlistOnly: false,

      toggleMode: () =>
        set((state) => ({ mode: state.mode === "demo" ? "real" : "demo" })),

      setMode: (mode) => set({ mode }),

      setSelectedCategory: (category) => set({ selectedCategory: category }),

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      setSortBy: (sortBy) => set({ sortBy }),

      setHideUnseeded: (hideUnseeded) => set({ hideUnseeded }),

      setShowWatchlistOnly: (showWatchlistOnly) => set({ showWatchlistOnly }),

      toggleWatchlist: (marketId) =>
        set((state) => {
          const exists = state.watchlist.includes(marketId);
          return {
            watchlist: exists
              ? state.watchlist.filter((id) => id !== marketId)
              : [...state.watchlist, marketId],
          };
        }),

      executeTrade: (marketId, outcome, amount) => {
        const state = get();

        // Validation 1: Positive non-zero amount
        if (isNaN(amount) || amount <= 0) {
          return { success: false, error: "Please enter a valid dollar amount greater than $0." };
        }

        // Validation 2: Check balance in Demo mode
        if (state.mode === "demo" && amount > state.demoBalance) {
          return {
            success: false,
            error: `Insufficient balance. Your available cash balance is $${state.demoBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`,
          };
        }

        // Find target market
        const market = MOCK_MARKETS.find((m) => m.id === marketId);
        if (!market) {
          return { success: false, error: "Target market not found." };
        }

        const price = outcome === "YES" ? market.yesPrice : market.noPrice;
        const feeRate = 0.01; // 1% simulated platform fee
        const fee = Number((amount * feeRate).toFixed(2));
        const netInvestment = amount - fee;
        const shares = Number((netInvestment / price).toFixed(4));
        const timestamp = new Date().toISOString();

        // Create Trade Order
        const newTrade: TradeOrder = {
          id: `trd-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          marketId,
          marketTitle: market.title,
          outcome,
          amount,
          shares,
          price,
          fee,
          timestamp,
          status: "filled",
          mode: state.mode,
        };

        // Update or create Position
        const existingPosIndex = state.positions.findIndex(
          (p) => p.marketId === marketId && p.outcome === outcome
        );

        let updatedPositions = [...state.positions];

        if (existingPosIndex >= 0) {
          const existing = updatedPositions[existingPosIndex];
          const newShares = Number((existing.shares + shares).toFixed(4));
          const newTotalInvested = Number((existing.totalInvested + amount).toFixed(2));
          const newAvgPrice = Number((newTotalInvested / newShares).toFixed(4));
          const currentValue = Number((newShares * price).toFixed(2));
          const pnl = Number((currentValue - newTotalInvested).toFixed(2));
          const pnlPercent = Number(((pnl / newTotalInvested) * 100).toFixed(2));

          updatedPositions[existingPosIndex] = {
            ...existing,
            shares: newShares,
            avgPrice: newAvgPrice,
            currentPrice: price,
            totalInvested: newTotalInvested,
            currentValue,
            pnl,
            pnlPercent,
          };
        } else {
          const currentValue = Number((shares * price).toFixed(2));
          const pnl = Number((currentValue - amount).toFixed(2));
          const pnlPercent = Number(((pnl / amount) * 100).toFixed(2));

          const newPos: Position = {
            id: `pos-${Date.now()}`,
            marketId,
            marketTitle: market.title,
            outcome,
            shares,
            avgPrice: price,
            currentPrice: price,
            totalInvested: amount,
            currentValue,
            pnl,
            pnlPercent,
          };

          updatedPositions.push(newPos);
        }

        const newBalance = Number((state.demoBalance - amount).toFixed(2));

        set({
          demoBalance: newBalance,
          positions: updatedPositions,
          trades: [newTrade, ...state.trades],
        });

        return { success: true };
      },

      closePosition: (positionId) => {
        const state = get();
        const position = state.positions.find((p) => p.id === positionId);
        if (!position) {
          return { success: false, error: "Position not found." };
        }

        const market = MOCK_MARKETS.find((m) => m.id === position.marketId);
        const currentPrice = market
          ? position.outcome === "YES"
            ? market.yesPrice
            : market.noPrice
          : position.currentPrice;

        const returnCash = Number((position.shares * currentPrice).toFixed(2));
        const newBalance = Number((state.demoBalance + returnCash).toFixed(2));
        const updatedPositions = state.positions.filter((p) => p.id !== positionId);

        const newTrade: TradeOrder = {
          id: `trd-close-${Date.now()}`,
          marketId: position.marketId,
          marketTitle: position.marketTitle,
          outcome: position.outcome,
          amount: returnCash,
          shares: position.shares,
          price: currentPrice,
          fee: 0,
          timestamp: new Date().toISOString(),
          status: "filled",
          mode: state.mode,
        };

        set({
          demoBalance: newBalance,
          positions: updatedPositions,
          trades: [newTrade, ...state.trades],
        });

        return { success: true };
      },

      resetDemoAccount: () =>
        set({
          demoBalance: 10000.00,
          positions: [],
          trades: [],
        }),
    }),
    {
      name: "omnimarketx-store-v1",
      partialize: (state) => ({
        mode: state.mode,
        demoBalance: state.demoBalance,
        positions: state.positions,
        trades: state.trades,
        watchlist: state.watchlist,
      }),
    }
  )
);

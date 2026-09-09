"use client";

import { create } from "zustand";
import { Market } from "@/types/market";
import { generateMarketAnalysis } from "@/lib/analyst";

export type AIAnalysis = {
  snapshot: {
    probability: number;
    volume: number;
    traderCount: number;
    daysLeft: number;
    category: string;
    title: string;
    isUnseeded: boolean;
  };
  keyFactors: string[];
  bullCase: string;
  bearCase: string;
  whatCouldChange: string;
  resolutionRisk: string;
  references: {
    probabilitySource: string;
    volumeSource: string;
    traderCountSource: string;
    resolutionCriteria: string;
    resolutionSource: string;
  };
};

interface AIAnalystState {
  isOpen: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  analysis: AIAnalysis | null;
  question: string | null;
  open: (market: Market) => void;
  close: () => void;
  clear: () => void;
  refresh: (market?: Market) => void;
  initialize: (market: Market) => void;
  setQuestion: (question: string) => void;
}

export const useAIAnalyst = create<AIAnalystState>((set) => ({
  isOpen: false,
  isInitialized: false,
  isLoading: false,
  error: null,
  analysis: null,
  question: null,

  open: (market) =>
    set({
      isOpen: true,
      isInitialized: true,
      isLoading: false,
      error: null,
      analysis: generateMarketAnalysis(market),
    }),

  close: () =>
    set({
      isOpen: false,
      isInitialized: false,
      isLoading: false,
      error: null,
      analysis: null,
      question: null,
    }),

  clear: () =>
    set({
      isOpen: false,
      isInitialized: false,
      isLoading: false,
      error: null,
      analysis: null,
      question: null,
    }),

  refresh: (market) => {
    if (!market) {
      set({ isLoading: false, error: null });
      return;
    }
    set({
      isOpen: true,
      isInitialized: true,
      isLoading: false,
      error: null,
      analysis: generateMarketAnalysis(market),
    });
  },

  initialize: (market) =>
    set({
      isInitialized: true,
      isOpen: true,
      isLoading: false,
      analysis: generateMarketAnalysis(market),
    }),

  setQuestion: (question) =>
    set((state) => ({
      question,
      error: null,
      analysis: state.analysis ? { ...state.analysis } : null,
    })),
}));

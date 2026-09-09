export type MarketCategory = 
  | "all"
  | "tech" 
  | "finance" 
  | "crypto" 
  | "geopolitics" 
  | "popculture" 
  | "science";

export type TrustLevel = "verified" | "unseeded" | "community" | "high_activity";

export interface PricePoint {
  timestamp: string;
  yesPrice: number; // 0.00 to 1.00
  noPrice: number;  // 0.00 to 1.00
  volume: number;
}

export interface MarketCreator {
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
}

export interface Market {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: MarketCategory;
  yesProbability: number; // 0 to 100
  yesPrice: number;       // e.g. 0.65
  noPrice: number;        // e.g. 0.35
  volume: number;         // e.g. 142500
  traderCount: number;    // e.g. 1240
  liquidity: number;      // e.g. 45000
  endDate: string;        // ISO date string
  trustLevel: TrustLevel;
  isUnseeded: boolean;    // True if 0 volume & 0 traders
  trustNote?: string;
  resolutionCriteria: string;
  resolutionSource: string;
  resolutionSourceUrl?: string;
  priceHistory: PricePoint[];
  creator: MarketCreator;
  featured?: boolean;
  trending?: boolean;
  commentCount: number;
}

export interface TradeOrder {
  id: string;
  marketId: string;
  marketTitle: string;
  outcome: "YES" | "NO";
  amount: number;         // Dollar amount invested
  shares: number;         // Estimated or filled shares
  price: number;          // Price per share (e.g. 0.65)
  fee: number;            // Fee amount
  timestamp: string;
  status: "filled" | "pending" | "failed";
  mode: "demo" | "real";
}

export interface Position {
  id: string;
  marketId: string;
  marketTitle: string;
  outcome: "YES" | "NO";
  shares: number;
  avgPrice: number;
  currentPrice: number;
  totalInvested: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
}

export interface Comment {
  id: string;
  marketId: string;
  userName: string;
  userHandle: string;
  userAvatar: string;
  timestamp: string;
  content: string;
  likes: number;
  prediction?: "YES" | "NO";
  sharesHeld?: number;
}

export interface TopTrader {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  winRate: number;        // e.g. 78.5
  totalProfit: number;   // e.g. 42150
  badge: string;
  rank: number;
}

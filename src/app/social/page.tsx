"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/layout/Shell";
import { MOCK_MARKETS } from "@/data/mockMarkets";
import { MarketCategory } from "@/types/market";
import { TrustBadge } from "@/components/trust/TrustBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  MessagesSquare,
  Heart,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  SearchX,
  Info,
  Flame,
  Clock,
  BadgeCheck,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Mock social posts — demo only, not real users.
// Each post is tied to a Market via marketId so the market is primary.
// ---------------------------------------------------------------------------
type SocialPost = {
  id: string;
  traderName: string;
  traderHandle: string;
  avatar: string;
  hoursAgo: number; // for sorting Latest
  timestamp: string; // display
  marketId: string;
  content: string;
  likes: number;
  comments: number;
  prediction: "YES" | "NO";
  sharesHeld?: number;
};

const MOCK_POSTS: SocialPost[] = [
  {
    id: "sp-1",
    traderName: "Alex Rivers",
    traderHandle: "arivers",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    hoursAgo: 2,
    timestamp: "2h ago",
    marketId: "mkt-1",
    content:
      "OpenAI's infra spend + research cadence points to late 2026 flagship. Safety eval is real but they’ve built parallel red-team pipelines. 68% feels like rational optimism — I’m long YES because the API changelog is the hard trigger, not a keynote tease.",
    likes: 24,
    comments: 6,
    prediction: "YES",
    sharesHeld: 350,
  },
  {
    id: "sp-2",
    traderName: "Elena Rostova",
    traderHandle: "elena_r",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    hoursAgo: 4,
    timestamp: "4h ago",
    marketId: "mkt-1",
    content:
      "Bear case: frontier eval + 3-6 months of safety holds can easily slip Dec 31 into early Jan. Criteria needs *public API* — not just a blog demo. Holding NO as hedge; timing risk is the whole ballgame here.",
    likes: 12,
    comments: 4,
    prediction: "NO",
    sharesHeld: 150,
  },
  {
    id: "sp-3",
    traderName: "David Chen",
    traderHandle: "dchen_tech",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    hoursAgo: 1,
    timestamp: "1h ago",
    marketId: "mkt-2",
    content:
      "NVIDIA annual cadence → late 2026 consumer arch is almost clockwork. GTC vs Computex vs standalone — one of those stages will host it. YES at 74% with 2.1k traders feels like the market already knows.",
    likes: 19,
    comments: 5,
    prediction: "YES",
    sharesHeld: 400,
  },
  {
    id: "sp-4",
    traderName: "Satoshi Desk",
    traderHandle: "sat_desk",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    hoursAgo: 6,
    timestamp: "6h ago",
    marketId: "mkt-3",
    content:
      "BTC 58% to $150k before Jan 1 2027 — volume $1.25M, 8.4k traders, high liquidity. Bull thesis needs ETF flow + halving momentum to hold; bear says macro risk kills the wick. I’m fading the top — small NO, tight deadline.",
    likes: 31,
    comments: 14,
    prediction: "NO",
  },
  {
    id: "sp-5",
    traderName: "Priya Mehta",
    traderHandle: "priya_m",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    hoursAgo: 8,
    timestamp: "8h ago",
    marketId: "mkt-3",
    content:
      "Why I’m still YES on $150k: CoinGecko aggregate has already wicked $124k in demo history — momentum +12pp since Sep 1. Needs one clean impulse, not a grind. High activity ≠ correctness, but depth helps.",
    likes: 27,
    comments: 9,
    prediction: "YES",
    sharesHeld: 220,
  },
  {
    id: "sp-6",
    traderName: "MacroAlpha",
    traderHandle: "macro_alpha",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    hoursAgo: 5,
    timestamp: "5h ago",
    marketId: "mkt-5",
    content:
      "Fed below 3.75% at 41% YES. FOMC dots keep cutting priced shallow. I’m NO-biased — 59% NO pays if cuts pause on sticky core. Resolution is federalreserve.gov statement, not Powell speech. Read the upper bound.",
    likes: 18,
    comments: 7,
    prediction: "NO",
    sharesHeld: 310,
  },
  {
    id: "sp-7",
    traderName: "Emerging Lens",
    traderHandle: "em_lens",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    hoursAgo: 12,
    timestamp: "12h ago",
    marketId: "mkt-4",
    content:
      "India >7% FY26-27 at 62% YES — MOSPI print is the single source. Bull case: capex cycle + services hold. Bear: base effects fade by Q4. Deadline May 2027 gives time, but print is one number. I’m small YES, 1.48k traders is thin.",
    likes: 14,
    comments: 3,
    prediction: "YES",
  },
  {
    id: "sp-8",
    traderName: "Orbital Observer",
    traderHandle: "orbital_obs",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    hoursAgo: 3,
    timestamp: "3h ago",
    marketId: "mkt-6",
    content:
      "SpaceX propellant transfer at 82% YES — NASA Artemis milestone is the trigger, not a tweet. 7pp jump since Sep 1 (75→82%). If you’re bearish you’re betting NASA slips the demo, not SpaceX. I’m with consensus here.",
    likes: 22,
    comments: 8,
    prediction: "YES",
    sharesHeld: 180,
  },
  {
    id: "sp-9",
    traderName: "QuantumWatch",
    traderHandle: "q_watch",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    hoursAgo: 20,
    timestamp: "20h ago",
    marketId: "mkt-7",
    content:
      "Demo note: This unseeded market (0 vol, 50% start) has no trading signal. My thread is *reasoning only* — 1k logical qubits needs peer-review in Nature/PR. Until first trade, any post here is hypothesis, not market view. Watch the source, not the price.",
    likes: 9,
    comments: 2,
    prediction: "NO",
  },
  {
    id: "sp-10",
    traderName: "CleanEnergy Lab",
    traderHandle: "clean_energy",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    hoursAgo: 24,
    timestamp: "1d ago",
    marketId: "mkt-8",
    content:
      "Also unseeded — CFS net grid. My take leans NO for 2026 because DoE verification is strict (regional grid delivery). But I’m here to learn: if you’re YES, what counts as *net positive* per the criteria? Criteria exactness is the whole market.",
    likes: 7,
    comments: 1,
    prediction: "NO",
  },
];

const CATS: { id: MarketCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "tech", label: "Tech & AI" },
  { id: "finance", label: "Finance" },
  { id: "crypto", label: "Crypto" },
  { id: "science", label: "Science" },
  { id: "geopolitics", label: "Geopolitics" },
  { id: "popculture", label: "Pop Culture" },
];

function formatDeadline(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const PostCard: React.FC<{ post: SocialPost }> = ({ post }) => {
  const market = MOCK_MARKETS.find((m) => m.id === post.marketId);
  if (!market) return null;
  const isYes = post.prediction === "YES";
  const isUnseeded = market.isUnseeded;

  return (
    <article className="flex flex-col rounded-2xl bg-[#111827] border border-[#1F2937] overflow-hidden shadow-lg shadow-black/20 hover:border-indigo-500/30 transition-colors">
      {/* Market strip — visually obvious and clickable */}
      <Link
        href={`/market/${market.id}`}
        className="flex items-center gap-3 px-4 py-3 bg-[#0D1320]/70 border-b border-[#1F2937]/70 hover:bg-white/[0.04] transition-colors"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white/[0.06] text-gray-300 border border-white/10">
              {market.category}
            </span>
            <TrustBadge trustLevel={market.trustLevel} isUnseeded={market.isUnseeded} size="sm" />
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-gray-500">
              <Calendar className="w-3 h-3" aria-hidden="true" /> {formatDeadline(market.endDate)}
            </span>
          </div>
          <p className="text-[13px] font-semibold text-gray-100 leading-snug line-clamp-1 mt-1 hover:text-indigo-200">
            {market.title}
          </p>
          <div className="flex items-center gap-2 mt-1 text-[11px] font-mono">
            <span className={`font-bold omx-num ${isUnseeded ? "text-gray-400" : "text-emerald-300"}`}>{market.yesProbability}% YES</span>
            <span className="text-gray-600" aria-hidden="true">
              ·
            </span>
            <span className="text-gray-500 omx-num">${market.yesPrice.toFixed(2)}/ ${market.noPrice.toFixed(2)}</span>
            <span className="hidden min-[360px]:inline text-gray-500">· {market.traderCount.toLocaleString()} traders</span>
          </div>
        </div>
        <span className="shrink-0 hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-indigo-300 border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1.5 rounded-xl">
          Open market <TrendingUp className="w-3 h-3" aria-hidden="true" />
        </span>
      </Link>

      {/* Author + reasoning */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <img src={post.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0" />
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[13px] font-semibold text-gray-100 truncate">{post.traderName}</span>
                <span className="text-[11px] text-gray-500 truncate">@{post.traderHandle}</span>
                {post.sharesHeld && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-gray-500">
                    <BadgeCheck className="w-3 h-3 text-indigo-300" aria-hidden="true" /> demo
                  </span>
                )}
              </div>
              <span className="flex items-center gap-1 text-[11px] text-gray-500">
                <Clock className="w-3 h-3" aria-hidden="true" /> {post.timestamp}
                <span aria-hidden="true">·</span>
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0 rounded-md text-[11px] font-extrabold border ${
                    isYes ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" : "bg-rose-500/10 text-rose-300 border-rose-500/30"
                  }`}
                >
                  {isYes ? <TrendingUp className="w-3 h-3" aria-hidden="true" /> : <TrendingDown className="w-3 h-3" aria-hidden="true" />}
                  {post.prediction}
                  {post.sharesHeld ? ` · ${post.sharesHeld}` : ""}
                </span>
              </span>
            </div>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500">
            <Users className="w-3 h-3" aria-hidden="true" /> {market.traderCount.toLocaleString()}
          </span>
        </div>

        <p className="text-[13px] leading-relaxed text-gray-300">{post.content}</p>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#1F2937]/70">
          <div className="flex items-center gap-4 text-[12px] text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-300" aria-hidden="true" /> <span className="font-semibold text-gray-300 omx-num">{post.likes}</span>
              <span className="hidden min-[360px]:inline">likes</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" /> <span className="font-semibold text-gray-300 omx-num">{post.comments}</span>
              <span className="hidden min-[360px]:inline">replies</span>
            </span>
          </div>
          <Link
            href={`/market/${post.marketId}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition-colors shadow-md shadow-indigo-600/20 shrink-0"
          >
            Open market
            <TrendingUp className="w-3 h-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default function SocialPage() {
  const [category, setCategory] = useState<MarketCategory>("all");
  const [sort, setSort] = useState<"latest" | "popular">("latest");

  const filteredPosts = useMemo(() => {
    if (category === "all") return MOCK_POSTS;
    return MOCK_POSTS.filter((p) => {
      const m = MOCK_MARKETS.find((mm) => mm.id === p.marketId);
      return m?.category === category;
    });
  }, [category]);

  const sorted = useMemo(() => {
    const arr = filteredPosts.slice();
    if (sort === "popular") return arr.sort((a, b) => b.likes - a.likes);
    return arr.sort((a, b) => a.hoursAgo - b.hoursAgo);
  }, [filteredPosts, sort]);

  const popularTop = useMemo(() => filteredPosts.slice().sort((a, b) => b.likes - a.likes).slice(0, 3), [filteredPosts]);

  // Market-linked: group by marketId count
  const marketGroups = useMemo(() => {
    const map = new Map<string, { market: (typeof MOCK_MARKETS)[number]; count: number; posts: SocialPost[] }>();
    for (const p of filteredPosts) {
      const m = MOCK_MARKETS.find((mm) => mm.id === p.marketId);
      if (!m) continue;
      const g = map.get(p.marketId) || { market: m, count: 0, posts: [] };
      g.count += 1;
      g.posts.push(p);
      map.set(p.marketId, g);
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [filteredPosts]);

  const isEmpty = filteredPosts.length === 0;

  return (
    <Shell>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1.5 min-w-0">
              <h1 className="text-[26px] lg:text-[32px] font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-600/20 shrink-0">
                  <MessagesSquare className="w-5 h-5 text-white" aria-hidden="true" />
                </span>
                Social
              </h1>
              <p className="text-[13px] text-gray-400 leading-relaxed max-w-2xl">
                Market-linked reasoning — demo traders share why they’re bullish or bearish. Every post is tied to a market; the primary action is to open that market.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#111827] border border-[#1F2937] text-gray-400 shrink-0">
              <Info className="w-3.5 h-3.5 text-indigo-300" aria-hidden="true" />
              Demo · mock posts
            </span>
          </div>

          <div className="omx-card p-3 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-[12px] leading-relaxed text-gray-300">
              <strong className="text-gray-100">Not real users.</strong> Avatars/names are mock, reasoning is synthetic and tied to mock price history. Use posts to discover *why* a market moves, then verify via the market’s resolution criteria and source.
            </p>
          </div>
        </div>

        {/* Category filters */}
        <div aria-label="Filter discussions by market category" className="scroll-x flex items-center gap-2 pb-1 scrollbar-none -mx-1 px-1">
          {CATS.map((cat) => {
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

        {/* Sort toggle */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-[#111827] border border-[#1F2937] w-fit">
          <button
            onClick={() => setSort("latest")}
            aria-pressed={sort === "latest"}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors min-h-[36px] inline-flex items-center gap-1.5 ${
              sort === "latest" ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" aria-hidden="true" /> Latest
          </button>
          <button
            onClick={() => setSort("popular")}
            aria-pressed={sort === "popular"}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors min-h-[36px] inline-flex items-center gap-1.5 ${
              sort === "popular" ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Flame className="w-3.5 h-3.5" aria-hidden="true" /> Popular
          </button>
        </div>

        {isEmpty ? (
          <EmptyState
            icon={SearchX}
            title={category === "all" ? "No discussions yet" : `No ${category} discussions`}
            description="No mock posts match this category. Unseeded demo markets have fewer posts — try All or another category, or browse markets directly."
            actionLabel="Show All"
            onActionClick={() => setCategory("all")}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
            {/* Feed */}
            <div className="space-y-4 min-w-0">
              <h2 className="text-[15px] font-bold text-white flex items-center gap-2">
                {sort === "latest" ? <Clock className="w-4 h-4 text-indigo-300" aria-hidden="true" /> : <Flame className="w-4 h-4 text-amber-400" aria-hidden="true" />}
                {sort === "latest" ? "Latest discussions" : "Popular discussions"}
                <span className="text-xs font-medium text-gray-500 omx-num">({sorted.length} demo posts)</span>
              </h2>

              <div className="space-y-4">
                {sorted.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
            </div>

            {/* Right rail — market-linked + popular */}
            <aside className="space-y-4 lg:sticky lg:top-[80px] min-w-0">
              <div className="omx-card p-5 space-y-3">
                <h3 className="omx-eyebrow !text-indigo-300 flex items-center gap-2">
                  <Heart className="w-4 h-4" aria-hidden="true" />
                  Popular discussions
                </h3>
                <ol className="space-y-2">
                  {popularTop.map((p, i) => {
                    const m = MOCK_MARKETS.find((mm) => mm.id === p.marketId)!;
                    return (
                      <li key={p.id}>
                        <Link
                          href={`/market/${p.marketId}`}
                          className="flex gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/10 transition-colors"
                        >
                          <span className="text-[11px] font-extrabold text-gray-500 omx-num w-4 shrink-0">{i + 1}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[13px] font-medium text-gray-200 line-clamp-1">{p.traderName} on {m.title.slice(0, 46)}…</span>
                            <span className="block text-[11px] text-gray-500 truncate">
                              {p.prediction} · {p.likes} likes · {m.category}
                            </span>
                          </span>
                          <Heart className="w-3.5 h-3.5 text-rose-300 shrink-0 mt-0.5" aria-hidden="true" />
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div className="omx-card p-5 space-y-3">
                <h3 className="omx-eyebrow flex items-center gap-2">
                  <MessagesSquare className="w-4 h-4 text-cyan-300" aria-hidden="true" />
                  Market-linked conversations
                </h3>
                <p className="text-[12px] text-gray-500 leading-relaxed">Tap a market to see its detail, consensus, and resolution criteria.</p>
                <ul className="space-y-2">
                  {marketGroups.slice(0, 5).map((g) => (
                    <li key={g.market.id}>
                      <Link
                        href={`/market/${g.market.id}`}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-[#1F2937] hover:border-indigo-500/30 bg-[#0B0F19]/60 hover:bg-white/[0.04] transition-colors"
                      >
                        <span
                          className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                            g.market.isUnseeded
                              ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                              : "bg-white/[0.06] text-gray-300 border-white/10"
                          }`}
                        >
                          {g.market.category}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] font-semibold text-gray-100 line-clamp-1 leading-snug">{g.market.title}</span>
                          <span className="block text-[11px] text-gray-500 omx-num">
                            YES {g.market.yesProbability}% · {g.count} post{g.count > 1 ? "s" : ""} · {g.market.commentCount} comments
                          </span>
                        </span>
                        <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-bold omx-num">
                          {g.count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/" className="block text-center text-xs font-semibold text-indigo-300 hover:text-indigo-200">
                  Browse all markets →
                </Link>
              </div>

              <div className="rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 p-4 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-[12px] leading-relaxed text-gray-400">
                  All posts are <strong className="text-gray-200">demo mock data</strong>. Likes/comments are synthetic. The “Open market” button is the primary action — discuss to understand why someone is bullish/bearish, then verify on the market page.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </Shell>
  );
}

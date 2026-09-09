"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  AlertTriangle,
  ExternalLink,
  Calendar,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Bookmark,
  Share2,
  Heart,
  Check,
  Info,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { Shell } from "@/components/layout/Shell";
import { TrustBadge } from "@/components/trust/TrustBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { MOCK_MARKETS, MOCK_COMMENTS } from "@/data/mockMarkets";
import { useMarketStore } from "@/store/useMarketStore";
import { Comment } from "@/types/market";
import { AIAnalystButton } from "@/components/ai/AnalystButton";
import { AnalystDrawer } from "@/components/ai/AnalystDrawer";

const QUICK_AMOUNTS = [10, 50, 100, 250];

export default function MarketDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const marketId = (params.id as string) || "mkt-1";

  const market = useMemo(() => {
    return MOCK_MARKETS.find((m) => m.id === marketId) || null;
  }, [marketId]);

  const initialOutcome = searchParams.get("outcome") === "NO" ? "NO" : "YES";

  const [outcome, setOutcome] = useState<"YES" | "NO">(initialOutcome);
  const [amountInput, setAmountInput] = useState<string>("50");
  const [tradeStatus, setTradeStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState<Comment[]>(() => (market ? MOCK_COMMENTS[market.id] || [] : []));

  useEffect(() => {
    setComments(market ? MOCK_COMMENTS[market.id] || [] : []);
    setCommentInput("");
    setTradeStatus(null);
  }, [market?.id]);

  const {
    executeTrade,
    demoBalance,
    mode,
    watchlist,
    toggleWatchlist,
  } = useMarketStore();

  const isSaved = market ? watchlist.includes(market.id) : false;

  // Price momentum for Evaluate step
  const momentum = useMemo(() => {
    if (!market) return { delta: 0, up: true };
    const h = market.priceHistory;
    if (h.length < 2) return { delta: 0, up: true };
    const delta = (h[h.length - 1].yesPrice - h[0].yesPrice) * 100;
    return { delta, up: delta >= 0 };
  }, [market]);

  const daysLeft = useMemo(() => {
    if (!market) return 0;
    const ms = new Date(market.endDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }, [market]);

  if (!market) {
    return (
      <Shell>
        <div className="max-w-3xl mx-auto text-center py-16 space-y-4">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Market not found</h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            No market matches &quot;{marketId}&quot;. It may have been removed or the link is incorrect.
          </p>
          <Link href="/" className="omx-btn-primary">
            Back to Markets
          </Link>
        </div>
      </Shell>
    );
  }

  // Trade calculations
  const price = outcome === "YES" ? market.yesPrice : market.noPrice;
  const numAmount = parseFloat(amountInput) || 0;
  const feeRate = 0.01;
  const estimatedFee = Number((numAmount * feeRate).toFixed(2));
  const netAmount = Math.max(0, numAmount - estimatedFee);
  const estimatedShares =
    price > 0 ? Number((netAmount / price).toFixed(2)) : 0;
  const estimatedPayout = Number((estimatedShares * 1.0).toFixed(2));
  const estimatedRoi = numAmount > 0 ? ((estimatedPayout - numAmount) / numAmount) * 100 : 0;
  const amountError =
    amountInput.trim() === ""
      ? "Enter an amount."
      : isNaN(numAmount) || numAmount <= 0
        ? "Enter an amount greater than $0."
        : mode === "demo" && numAmount > demoBalance
          ? `Exceeds your ${demoBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })} demo balance.`
          : null;

  const handleTrade = (e: React.FormEvent) => {
    e.preventDefault();
    setTradeStatus(null);
    if (mode !== "demo") {
      setTradeStatus({ success: false, message: "Real-money trading is disabled in this demo build. Switch back to Demo mode to simulate a trade." });
      return;
    }
    if (amountError) {
      setTradeStatus({ success: false, message: amountError });
      return;
    }
    const result = executeTrade(market.id, outcome, numAmount);
    if (result.success) {
      setTradeStatus({
        success: true,
        message: `Bought ${estimatedShares} ${outcome} @ $${price.toFixed(2)}. Potential payout $${estimatedPayout.toFixed(2)} if ${outcome} wins.`,
      });
    } else {
      setTradeStatus({
        success: false,
        message: result.error || "Trade execution failed.",
      });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const newComment: Comment = {
      id: `c-user-${Date.now()}`,
      marketId: market.id,
      userName: "You",
      userHandle: "trader_you",
      userAvatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      timestamp: "Just now",
      content: commentInput.trim(),
      likes: 0,
      prediction: outcome,
      sharesHeld: estimatedShares > 0 ? estimatedShares : undefined,
    };
    setComments([newComment, ...comments]);
    setCommentInput("");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Shell>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center justify-between gap-3">
          <ol className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
            <li>
              <Link href="/" className="inline-flex items-center gap-1.5 font-semibold hover:text-indigo-300 transition-colors min-h-[36px]">
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden min-[420px]:inline">Discovery</span>
                <span className="min-[420px]:hidden">Back</span>
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="uppercase tracking-wider font-semibold">{market.category}</li>
            <li aria-hidden="true" className="hidden sm:inline">/</li>
            <li aria-current="page" className="hidden sm:block truncate max-w-[320px] text-gray-400">
              {market.title}
            </li>
          </ol>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleWatchlist(market.id)}
              aria-pressed={isSaved}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors min-h-[36px] ${
                isSaved
                  ? "bg-indigo-600/15 text-indigo-200 border-indigo-500/40"
                  : "bg-[#111827] text-gray-400 border-[#1F2937] hover:text-gray-100"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" fill={isSaved ? "currentColor" : "none"} aria-hidden="true" />
              {isSaved ? "Saved" : "Save"}
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#111827] text-gray-400 border border-[#1F2937] hover:text-gray-100 transition-colors min-h-[36px]"
              aria-live="polite"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> : <Share2 className="w-3.5 h-3.5" aria-hidden="true" />}
              {copied ? "Copied" : "Share"}
            </button>
          </div>
        </nav>

        {/* Title block — Understand */}
        <header className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white/[0.06] text-gray-300 border border-white/10">
              {market.category}
            </span>
            <TrustBadge trustLevel={market.trustLevel} isUnseeded={market.isUnseeded} />
            <AIAnalystButton market={market} />
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              Resolves {new Date(market.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              <span aria-hidden="true">·</span> {daysLeft}d left
            </span>
          </div>

          <h1 className="text-[22px] lg:text-[28px] font-extrabold text-white tracking-tight leading-[1.2] text-balance max-w-4xl">
            {market.title}
          </h1>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <img
              src={market.creator.avatar}
              alt=""
              className="w-5 h-5 rounded-full object-cover border border-white/10"
            />
            <span>
              By <strong className="text-gray-200 font-semibold">{market.creator.name}</strong>
              <span className="text-gray-500"> @{market.creator.handle}</span>
            </span>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed max-w-3xl">
            {market.description}
          </p>
        </header>

        {market.isUnseeded && (
          <div role="alert" className="p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-[13px] leading-relaxed">
              <p className="font-bold text-amber-200">Unseeded market — 50% is a starting price, not consensus</p>
              <p className="text-gray-300 mt-0.5">
                $0 volume · 0 traders. Your trade helps discover the first real price.
              </p>
            </div>
          </div>
        )}

        {/* Chart + Trade grid — Evaluate → Predict */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* Chart */}
          <section aria-labelledby="consensus-heading" className="lg:col-span-2 order-1 min-w-0 p-4 sm:p-6 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-4">
            <div className="flex items-start justify-between gap-x-4 gap-y-3 flex-wrap">
              <div className="min-w-0">
                <h2 id="consensus-heading" className="omx-eyebrow">
                  {market.isUnseeded ? "No consensus yet" : "Yes consensus"}
                </h2>
                <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                  <span className={`text-[30px] sm:text-[32px] leading-none font-extrabold font-mono omx-num ${market.isUnseeded ? "text-gray-400" : "text-emerald-300"}`}>
                    {market.yesProbability}%
                  </span>
                  <span className="text-sm text-gray-400 font-mono omx-num">
                    ${market.yesPrice.toFixed(2)}
                  </span>
                  {!market.isUnseeded && market.priceHistory.length > 1 && (
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded-md omx-num ${momentum.up ? "bg-emerald-500/10 text-emerald-300" : "bg-rose-500/10 text-rose-300"}`}>
                      {momentum.up ? <TrendingUp className="w-3 h-3" aria-hidden="true" /> : <TrendingDown className="w-3 h-3" aria-hidden="true" />}
                      {momentum.up ? "+" : ""}{momentum.delta.toFixed(1)}pp
                    </span>
                  )}
                </div>
                {market.isUnseeded && (
                  <p className="text-[11px] text-amber-300/90 mt-1.5">Starting price — not trader consensus.</p>
                )}
              </div>
              <dl className="flex items-center gap-4 text-xs shrink-0">
                <div className="text-right">
                  <dt className="text-gray-500">Volume</dt>
                  <dd className="font-bold text-gray-100 font-mono omx-num whitespace-nowrap">${market.volume.toLocaleString()}</dd>
                </div>
                <div className="text-right">
                  <dt className="text-gray-500">Traders</dt>
                  <dd className="font-bold text-gray-100 font-mono omx-num whitespace-nowrap">{market.traderCount.toLocaleString()}</dd>
                </div>
                <div className="text-right hidden min-[420px]:block">
                  <dt className="text-gray-500">Liquidity</dt>
                  <dd className="font-bold text-gray-100 font-mono omx-num whitespace-nowrap">${market.liquidity.toLocaleString()}</dd>
                </div>
              </dl>
            </div>

            <div className="relative h-52 sm:h-64 w-full min-w-0" role="img" aria-label={market.isUnseeded ? "No price history yet. 50 percent is the starting price, not consensus." : `Price history chart. Yes probability moved ${momentum.up ? "up" : "down"} ${Math.abs(momentum.delta).toFixed(1)} points to ${market.yesProbability} percent.`}>
              <div className={market.isUnseeded ? "absolute inset-0 opacity-40 saturate-50" : "absolute inset-0"}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={market.priceHistory} margin={{ left: -12, right: 8, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorYes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--omx-grid, #1F2937)" vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" stroke="var(--omx-axis, #6B7280)" fontSize={11} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis
                    stroke="var(--omx-axis, #6B7280)"
                    fontSize={11}
                    domain={[0, 1]}
                    tickFormatter={(v: number) => `${Math.round(v * 100)}%`}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as { timestamp: string; yesPrice: number; volume?: number };
                        return (
                          <div className="bg-[var(--omx-tooltip-bg,#0B0F19)] border border-[var(--omx-tooltip-border,#2A3548)] p-2.5 rounded-xl text-xs space-y-0.5 shadow-xl">
                            <p className="font-bold text-gray-300">{data.timestamp}</p>
                            <p className="text-emerald-300 font-mono font-bold omx-num">
                              YES {Math.round(data.yesPrice * 100)}% (${data.yesPrice.toFixed(2)})
                            </p>
                            {typeof data.volume === "number" && (
                              <p className="text-gray-500 font-mono omx-num">${data.volume.toLocaleString()} vol</p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine y={0.5} stroke="var(--omx-grid, #374151)" strokeDasharray="4 4" label={{ value: "50%", fill: "#6B7280", fontSize: 10, position: "insideTopRight" }} />
                  <Area type="monotone" dataKey="yesPrice" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorYes)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
              </div>
              {market.isUnseeded && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="px-3 py-1.5 rounded-full bg-[#0B0F19]/90 border border-amber-500/30 text-[11px] font-bold text-amber-200">
                    Awaiting first trade
                  </span>
                </div>
              )}
            </div>
            {/* Screen-reader data table */}
            <table className="sr-only">
              <caption>Yes price history</caption>
              <tbody>
                {market.priceHistory.map((p) => (
                  <tr key={p.timestamp}>
                    <td>{p.timestamp}</td>
                    <td>{Math.round(p.yesPrice * 100)} percent</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Trade panel — Predict */}
          <section aria-labelledby="trade-heading" className="order-2 min-w-0 lg:sticky lg:top-[80px] rounded-2xl bg-[#111827] border border-[#1F2937] shadow-xl overflow-hidden">
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 id="trade-heading" className="text-[13px] font-bold uppercase tracking-wider text-gray-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-300" aria-hidden="true" />
                  Predict
                </h2>
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full border ${mode === "demo" ? "bg-indigo-500/10 text-indigo-200 border-indigo-500/30" : "bg-emerald-500/10 text-emerald-200 border-emerald-500/30"}`}>
                  <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${mode === "demo" ? "bg-indigo-400" : "bg-emerald-400"}`} />
                  {mode === "demo" ? "Demo · simulated" : "Real · disabled"}
                </span>
              </div>
              <p className="text-xs text-gray-400 -mt-2">
                Balance <strong className="text-emerald-300 font-mono omx-num whitespace-nowrap">${demoBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
                <span className="text-gray-500"> · simulated</span>
              </p>

              {mode !== "demo" && (
                <p role="note" className="p-3 rounded-xl bg-emerald-500/[0.07] border border-emerald-500/25 text-[11px] text-emerald-200/90 leading-relaxed">
                  Real-mode preview — order entry is disabled. Switch to Demo to simulate this trade.
                </p>
              )}

              <div role="radiogroup" aria-label="Choose outcome" className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#0B0F19] border border-[#1F2937]">
                {(["YES", "NO"] as const).map((o) => {
                  const selected = outcome === o;
                  const p = o === "YES" ? market.yesPrice : market.noPrice;
                  return (
                    <button
                      key={o}
                      role="radio"
                      aria-checked={selected}
                      onClick={() => { setOutcome(o); setTradeStatus(null); }}
                      className={`py-2.5 px-1.5 rounded-lg text-xs font-extrabold transition-colors min-h-[56px] flex flex-col items-center justify-center gap-0.5 border ${
                        selected
                          ? o === "YES"
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 border-emerald-500"
                            : "bg-rose-600 text-white shadow-lg shadow-rose-600/25 border-rose-500"
                          : "text-gray-400 hover:text-gray-100 hover:bg-white/[0.04] border-transparent"
                      }`}
                    >
                      <span className="whitespace-nowrap">{o === "YES" ? "Yes" : "No"} · ${(p).toFixed(2)}</span>
                      <span className={`font-mono text-[10px] font-semibold omx-num leading-tight text-center ${selected ? "opacity-90" : "opacity-60"}`}>
                        Pays $1.00 if right
                      </span>
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleTrade} className="space-y-3.5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <label htmlFor="trade-amount" className="text-xs font-semibold text-gray-300 min-h-[32px] inline-flex items-center">
                      Amount
                    </label>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {QUICK_AMOUNTS.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => { setAmountInput(String(q)); setTradeStatus(null); }}
                          aria-pressed={numAmount === q}
                          className={`px-2 py-1.5 rounded-lg text-[11px] font-bold font-mono omx-num border transition-colors min-h-[32px] ${numAmount === q ? "bg-indigo-600/20 text-indigo-200 border-indigo-500/40" : "text-gray-400 border-[#1F2937] hover:text-gray-200 hover:bg-white/5"}`}
                        >
                          ${q}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => { setAmountInput(String(Math.floor(demoBalance))); setTradeStatus(null); }}
                        className="px-2 py-1.5 rounded-lg text-[11px] font-bold border text-gray-400 border-[#1F2937] hover:text-gray-200 hover:bg-white/5 min-h-[32px]"
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <span aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">$</span>
                    <input
                      id="trade-amount"
                      type="number"
                      min="1"
                      step="any"
                      inputMode="decimal"
                      value={amountInput}
                      onChange={(e) => { setAmountInput(e.target.value); setTradeStatus(null); }}
                      placeholder="0.00"
                      aria-invalid={!!amountError}
                      aria-describedby={amountError ? "trade-amount-error" : "trade-amount-hint"}
                      className="w-full bg-[#0B0F19] text-gray-100 font-mono text-[15px] font-bold pl-8 pr-4 py-2.5 rounded-xl border border-[#1F2937] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60 transition-colors omx-num"
                    />
                  </div>
                  {amountError ? (
                    <p id="trade-amount-error" role="alert" className="text-[11px] text-rose-300">{amountError}</p>
                  ) : (
                    <p id="trade-amount-hint" className="text-[11px] text-gray-500">
                      1% simulated fee included · {estimatedShares} shares est.
                    </p>
                  )}
                </div>

                <dl className="p-3.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] space-y-2 text-xs">
                  <div className="flex justify-between gap-2">
                    <dt className="text-gray-500">Shares</dt>
                    <dd className="text-indigo-300 font-bold font-mono omx-num whitespace-nowrap">{estimatedShares}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-gray-500">Fee (1%)</dt>
                    <dd className="text-gray-300 font-mono omx-num whitespace-nowrap">${estimatedFee.toFixed(2)}</dd>
                  </div>
                  <div className="border-t border-[#1F2937] pt-2 flex justify-between gap-2 font-bold">
                    <dt className="text-gray-300 min-w-0">Payout if {outcome} wins</dt>
                    <dd className="text-emerald-300 font-mono omx-num whitespace-nowrap shrink-0">
                      ${estimatedPayout.toFixed(2)}
                      <span className={`ml-1.5 text-[11px] ${estimatedRoi >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        ({estimatedRoi >= 0 ? "+" : ""}{estimatedRoi.toFixed(0)}%)
                      </span>
                    </dd>
                  </div>
                </dl>

                {tradeStatus && (
                  <div
                    role="status"
                    className={`p-3 rounded-xl text-xs border leading-relaxed ${
                      tradeStatus.success
                        ? "bg-emerald-500/10 text-emerald-200 border-emerald-500/30"
                        : "bg-rose-500/10 text-rose-200 border-rose-500/30"
                    }`}
                  >
                    <p className="font-bold mb-0.5">{tradeStatus.success ? "Order filled (simulated)" : "Can’t place order"}</p>
                    <p>{tradeStatus.message}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!!amountError}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-colors min-h-[48px] shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none active:brightness-110 ${
                    outcome === "YES"
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25"
                      : "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/25"
                  }`}
                >
                  {numAmount > 0 ? `Buy ${outcome} · $${numAmount.toFixed(0)}` : `Buy ${outcome}`}
                </button>
                <p className="flex items-start gap-1.5 text-[11px] text-gray-500 leading-relaxed">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-px" aria-hidden="true" />
                  Simulated order. Resolves via {market.resolutionSource}. No real funds move.
                </p>
              </form>
            </div>
          </section>

          {/* Resolution — Understand */}
          <section aria-labelledby="resolution-heading" className="lg:col-span-2 order-3 min-w-0 p-4 sm:p-6 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-3">
            <h2 id="resolution-heading" className="text-[13px] font-bold uppercase tracking-wider text-gray-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-300" aria-hidden="true" />
              How this resolves
            </h2>
            <p className="text-[13px] text-gray-300 leading-relaxed">
              {market.resolutionCriteria}
            </p>
            <div className="flex items-center justify-between gap-3 text-xs pt-3 border-t border-[#1F2937] flex-wrap">
              <span className="text-gray-500">Source of truth</span>
              {market.resolutionSourceUrl ? (
                <a
                  href={market.resolutionSourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-indigo-300 hover:text-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-500/10 transition-colors"
                >
                  {market.resolutionSource}
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              ) : (
                <span className="font-semibold text-gray-200">{market.resolutionSource}</span>
              )}
            </div>
          </section>
        </div>

        {/* Discussion — Discuss */}
        <section aria-labelledby="discussion-heading" className="p-4 sm:p-6 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-5 min-w-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 id="discussion-heading" className="text-[13px] font-bold uppercase tracking-wider text-gray-200 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-300" aria-hidden="true" />
              Discussion
              <span className="text-gray-500 font-semibold normal-case tracking-normal omx-num">({comments.length})</span>
            </h2>
            <p className="text-[11px] text-gray-500">Share reasoning, not just positions.</p>
          </div>

          <form onSubmit={handleAddComment} className="space-y-2.5">
            <label htmlFor="comment-input" className="sr-only">Share your reasoning</label>
            <textarea
              id="comment-input"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder={`Why ${outcome}? Share your reasoning…`}
              rows={2}
              maxLength={500}
              className="w-full bg-[#0B0F19] text-gray-100 text-[13px] p-3.5 rounded-xl border border-[#1F2937] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60 transition-colors placeholder:text-gray-500 resize-y min-h-[72px]"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] text-gray-500 omx-num">{commentInput.length}/500</span>
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="omx-btn-primary !py-2 !text-[13px] disabled:opacity-40"
              >
                Post comment
              </button>
            </div>
          </form>

          {comments.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No discussion yet"
              description="Be the first to share reasoning on this market. Good analysis moves consensus."
            />
          ) : (
            <ul className="space-y-3">
              {comments.map((comment) => (
                <li key={comment.id} className="p-4 rounded-xl bg-[#0B0F19] border border-[#1F2937] space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={comment.userAvatar} alt="" className="w-7 h-7 rounded-full object-cover border border-white/10" />
                      <span className="font-semibold text-[13px] text-gray-100 truncate">{comment.userName}</span>
                      <span className="text-[11px] text-gray-500 truncate">@{comment.userHandle}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {comment.prediction && (
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${comment.prediction === "YES" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" : "bg-rose-500/10 text-rose-300 border-rose-500/30"}`}>
                          {comment.prediction}{comment.sharesHeld ? ` · ${comment.sharesHeld}` : ""}
                        </span>
                      )}
                      <span className="text-[11px] text-gray-500">{comment.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-[13px] text-gray-300 leading-relaxed">{comment.content}</p>
                  <p className="flex items-center gap-1 text-[11px] text-gray-500">
                    <Heart className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="omx-num">{comment.likes} likes</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <AnalystDrawer market={market} />
    </Shell>
  );
}

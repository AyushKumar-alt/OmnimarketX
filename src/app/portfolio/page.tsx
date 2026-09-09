"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/layout/Shell";
import { useMarketStore } from "@/store/useMarketStore";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  PieChart,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  RotateCcw,
  History,
  CheckCircle,
  TrendingDown,
  ReceiptText,
} from "lucide-react";

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function PortfolioPage() {
  const {
    demoBalance,
    positions,
    trades,
    closePosition,
    resetDemoAccount,
    mode,
  } = useMarketStore();

  const [closeStatus, setCloseStatus] = useState<string | null>(null);

  const totalPositionsValue = positions.reduce((acc, p) => acc + p.currentValue, 0);
  const totalInvested = positions.reduce((acc, p) => acc + p.totalInvested, 0);
  const totalPnl = totalPositionsValue - totalInvested;
  const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;
  const totalAccountValue = demoBalance + totalPositionsValue;
  const pnlUp = totalPnl >= 0;

  const handleClose = (positionId: string, marketTitle: string) => {
    const res = closePosition(positionId);
    if (res.success) {
      setCloseStatus(`Closed “${marketTitle}” — proceeds returned to demo cash.`);
      setTimeout(() => setCloseStatus(null), 4000);
    }
  };

  const metrics = [
    {
      label: "Total value",
      hint: "Cash + positions",
      icon: Wallet,
      iconCls: "text-indigo-300",
      value: `$${fmt(totalAccountValue)}`,
      valueCls: "text-white",
      sub: null as React.ReactNode,
    },
    {
      label: "Available cash",
      hint: "Ready to predict",
      icon: PieChart,
      iconCls: "text-emerald-300",
      value: `$${fmt(demoBalance)}`,
      valueCls: "text-emerald-300",
      sub: null,
    },
    {
      label: "In positions",
      hint: `${positions.length} open`,
      icon: TrendingUp,
      iconCls: "text-cyan-300",
      value: `$${fmt(totalPositionsValue)}`,
      valueCls: "text-gray-100",
      sub: null,
    },
    {
      label: "Unrealized P&L",
      hint: `${totalPnlPercent >= 0 ? "+" : ""}${totalPnlPercent.toFixed(2)}% return`,
      icon: pnlUp ? TrendingUp : TrendingDown,
      iconCls: pnlUp ? "text-emerald-300" : "text-rose-300",
      value: `${pnlUp ? "+" : ""}$${fmt(totalPnl)}`,
      valueCls: pnlUp ? "text-emerald-300" : "text-rose-300",
      sub: null,
    },
  ];

  return (
    <Shell>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#1F2937]">
          <div className="space-y-1.5">
            <p>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${mode === "demo" ? "bg-indigo-500/10 text-indigo-200 border-indigo-500/30" : "bg-emerald-500/10 text-emerald-200 border-emerald-500/30"}`}>
                <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${mode === "demo" ? "bg-indigo-400" : "bg-emerald-400"}`} />
                {mode === "demo" ? "Demo portfolio · simulated" : "Real account · preview"}
              </span>
            </p>
            <h1 className="text-[24px] lg:text-[28px] font-extrabold text-white tracking-tight">
              Portfolio
            </h1>
            <p className="text-[13px] text-gray-400">Track conviction, cash, and fills — all simulated.</p>
          </div>

          {mode === "demo" && (
            <button
              onClick={resetDemoAccount}
              className="omx-btn-ghost shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-300" aria-hidden="true" />
              Reset to $10,000
            </button>
          )}
        </header>

        {/* Metrics */}
        <section aria-label="Portfolio summary" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {metrics.map((m) => (
            <div key={m.label} className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-1.5 min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-500 flex items-center justify-between gap-2">
                <span className="truncate">{m.label}</span>
                <m.icon className={`w-4 h-4 shrink-0 ${m.iconCls}`} aria-hidden="true" />
              </p>
              <p className={`text-[19px] xl:text-[22px] font-extrabold font-mono omx-num leading-none truncate ${m.valueCls}`}>
                {m.value}
              </p>
              <p className="text-[11px] text-gray-500 truncate">{m.hint}</p>
            </div>
          ))}
        </section>

        {closeStatus && (
          <div role="status" className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[13px] font-medium text-emerald-200 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            {closeStatus}
          </div>
        )}

        {/* Open Positions */}
        <section aria-labelledby="positions-heading" className="space-y-3">
          <h2 id="positions-heading" className="text-[15px] font-bold text-white flex items-center gap-2">
            Open positions
            <span className="text-xs font-medium text-gray-500 omx-num">({positions.length})</span>
          </h2>

          {positions.length === 0 ? (
            <EmptyState
              icon={PieChart}
              title="No open positions"
              description="You haven't backed an outcome yet. Find a market you understand and make your first demo prediction."
              actionLabel="Explore markets"
              actionHref="/"
            />
          ) : (
            <>
              {/* Mobile cards */}
              <ul className="space-y-3 md:hidden">
                {positions.map((pos) => (
                  <li key={pos.id} className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/market/${pos.marketId}`} className="text-[13px] font-semibold text-gray-100 leading-snug line-clamp-2">
                        {pos.marketTitle}
                      </Link>
                      <span className={`shrink-0 px-2 py-0.5 rounded-md text-[11px] font-extrabold border ${pos.outcome === "YES" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" : "bg-rose-500/10 text-rose-300 border-rose-500/30"}`}>
                        {pos.outcome}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                      <div className="p-2 rounded-xl bg-[#0B0F19] border border-[#1F2937]">
                        <p className="text-gray-500">Shares</p>
                        <p className="font-bold font-mono text-gray-100 omx-num mt-0.5">{pos.shares}</p>
                      </div>
                      <div className="p-2 rounded-xl bg-[#0B0F19] border border-[#1F2937]">
                        <p className="text-gray-500">Value</p>
                        <p className="font-bold font-mono text-emerald-300 omx-num mt-0.5">${pos.currentValue.toFixed(2)}</p>
                      </div>
                      <div className="p-2 rounded-xl bg-[#0B0F19] border border-[#1F2937]">
                        <p className="text-gray-500">P&L</p>
                        <p className={`font-bold font-mono omx-num mt-0.5 ${pos.pnl >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                          {pos.pnl >= 0 ? "+" : ""}${pos.pnl.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleClose(pos.id, pos.marketTitle)}
                      className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors min-h-[40px]"
                    >
                      Close position
                    </button>
                  </li>
                ))}
              </ul>

              {/* Desktop table */}
              <div className="hidden md:block rounded-2xl bg-[#111827] border border-[#1F2937] overflow-hidden">
                <div className="scroll-x overflow-x-auto" role="region" aria-label="Open positions table, scroll horizontally" tabIndex={0}>
                  <table className="w-full text-left text-[13px] text-gray-300 min-w-[760px]">
                    <caption className="sr-only">Open prediction positions</caption>
                    <thead>
                      <tr className="bg-[#0B0F19] text-gray-500 uppercase text-[11px] tracking-wider border-b border-[#1F2937]">
                        <th scope="col" className="p-4 font-semibold">Market</th>
                        <th scope="col" className="p-4 font-semibold">Side</th>
                        <th scope="col" className="p-4 text-right font-semibold">Shares</th>
                        <th scope="col" className="p-4 text-right font-semibold">Avg → now</th>
                        <th scope="col" className="p-4 text-right font-semibold">Value</th>
                        <th scope="col" className="p-4 text-right font-semibold">P&L</th>
                        <th scope="col" className="p-4 text-center font-semibold"><span className="sr-only">Action</span></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1F2937]/70">
                      {positions.map((pos) => (
                        <tr key={pos.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 max-w-[280px]">
                            <Link href={`/market/${pos.marketId}`} className="font-semibold text-gray-100 hover:text-indigo-200 transition-colors line-clamp-1 inline-flex items-center gap-1">
                              {pos.marketTitle}
                              <ArrowUpRight className="w-3.5 h-3.5 text-gray-500 shrink-0" aria-hidden="true" />
                            </Link>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold border ${pos.outcome === "YES" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" : "bg-rose-500/10 text-rose-300 border-rose-500/30"}`}>
                              {pos.outcome}
                            </span>
                          </td>
                          <td className="p-4 text-right font-mono font-semibold omx-num">{pos.shares}</td>
                          <td className="p-4 text-right font-mono text-gray-400 omx-num whitespace-nowrap">
                            ${pos.avgPrice.toFixed(2)} <span aria-hidden="true" className="text-gray-600">→</span> <span className="text-gray-100 font-semibold">${pos.currentPrice.toFixed(2)}</span>
                          </td>
                          <td className="p-4 text-right font-mono font-bold text-emerald-300 omx-num">${pos.currentValue.toFixed(2)}</td>
                          <td className={`p-4 text-right font-mono font-bold omx-num whitespace-nowrap ${pos.pnl >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                            {pos.pnl >= 0 ? "+" : ""}${pos.pnl.toFixed(2)}
                            <span className="block text-[11px] font-semibold opacity-80">({pos.pnlPercent >= 0 ? "+" : ""}{pos.pnlPercent.toFixed(1)}%)</span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleClose(pos.id, pos.marketTitle)}
                              className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold transition-colors min-h-[32px]"
                            >
                              Close
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Trade history */}
        <section aria-labelledby="history-heading" className="space-y-3">
          <h2 id="history-heading" className="text-[15px] font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-300" aria-hidden="true" />
            Trade history
            <span className="text-xs font-medium text-gray-500 omx-num">({trades.length})</span>
          </h2>

          {trades.length === 0 ? (
            <EmptyState
              icon={ReceiptText}
              title="No fills yet"
              description="Executed demo orders will appear here with price, size, and outcome."
            />
          ) : (
            <>
              {/* Mobile cards */}
              <ul className="space-y-3 md:hidden">
                {trades.map((trade) => (
                  <li key={trade.id} className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[13px] font-semibold text-gray-100 leading-snug line-clamp-2 min-w-0">
                        {trade.marketTitle}
                      </span>
                      <span className={`shrink-0 px-2 py-0.5 rounded-md text-[11px] font-extrabold border ${trade.outcome === "YES" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" : "bg-rose-500/10 text-rose-300 border-rose-500/30"}`}>
                        {trade.outcome}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span>
                        {new Date(trade.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-300">
                        <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                        Filled
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#1F2937] text-xs">
                      <span className="font-mono text-gray-400 omx-num">
                        {trade.shares} @ ${trade.price.toFixed(2)}
                      </span>
                      <span className="font-mono font-bold text-gray-100 omx-num">
                        ${trade.amount.toFixed(2)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Desktop table */}
              <div className="hidden md:block rounded-2xl bg-[#111827] border border-[#1F2937] overflow-hidden">
                <div className="scroll-x overflow-x-auto" role="region" aria-label="Trade history table, scroll horizontally" tabIndex={0}>
                <table className="w-full text-left text-[13px] text-gray-300 min-w-[720px]">
                  <caption className="sr-only">Executed trades</caption>
                  <thead>
                    <tr className="bg-[#0B0F19] text-gray-500 uppercase text-[11px] tracking-wider border-b border-[#1F2937]">
                      <th scope="col" className="p-4 font-semibold">Time</th>
                      <th scope="col" className="p-4 font-semibold">Market</th>
                      <th scope="col" className="p-4 font-semibold">Side</th>
                      <th scope="col" className="p-4 text-right font-semibold">Shares @ price</th>
                      <th scope="col" className="p-4 text-right font-semibold">Amount</th>
                      <th scope="col" className="p-4 text-center font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F2937]/70">
                    {trades.map((trade) => (
                      <tr key={trade.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 text-gray-500 text-xs whitespace-nowrap">
                          {new Date(trade.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="p-4 max-w-[260px]">
                          <span className="font-medium text-gray-200 line-clamp-1">{trade.marketTitle}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold border ${trade.outcome === "YES" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" : "bg-rose-500/10 text-rose-300 border-rose-500/30"}`}>
                            {trade.outcome}
                          </span>
                        </td>
                        <td className="p-4 text-right font-mono text-gray-400 omx-num whitespace-nowrap">
                          {trade.shares} @ ${trade.price.toFixed(2)}
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-gray-100 omx-num">
                          ${trade.amount.toFixed(2)}
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
                            <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                            Filled
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </Shell>
  );
}

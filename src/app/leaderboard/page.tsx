"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/layout/Shell";
import { EmptyState } from "@/components/ui/EmptyState";
import { useMarketStore } from "@/store/useMarketStore";
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  Activity,
  Target,
  DollarSign,
  Users,
  Award,
  Info,
  Clock,
  SearchX,
} from "lucide-react";

type TimeFilter = "weekly" | "monthly" | "all";

type LeaderboardEntry = {
  rank: number;
  name: string;
  handle: string;
  avatar: string;
  accuracy: number; // 0-100
  volume: number;
  resolved: number;
  wins: number;
  pnl: number;
  badge: string;
};

const LEADERBOARD_DATA: Record<TimeFilter, LeaderboardEntry[]> = {
  all: [
    { rank: 1, name: "Sarah Lin", handle: "slin_alpha", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", accuracy: 84.2, volume: 342500, resolved: 142, wins: 119, pnl: 68450, badge: "Master Predictor" },
    { rank: 2, name: "Marcus Vance", handle: "mvance_quant", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", accuracy: 79.5, volume: 298000, resolved: 128, wins: 102, pnl: 52100, badge: "Macro Wizard" },
    { rank: 3, name: "Aisha Patel", handle: "aisha_ai", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80", accuracy: 76.8, volume: 276400, resolved: 118, wins: 91, pnl: 41250, badge: "Tech Oracle" },
    { rank: 4, name: "David Chen", handle: "dchen_tech", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", accuracy: 74.1, volume: 251000, resolved: 104, wins: 77, pnl: 33400, badge: "Silicon Scout" },
    { rank: 5, name: "Elena Rostova", handle: "elena_r", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80", accuracy: 71.4, volume: 228500, resolved: 96, wins: 68, pnl: 28900, badge: "Contrarian" },
    { rank: 6, name: "Alex Rivers", handle: "arivers", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80", accuracy: 69.2, volume: 201300, resolved: 88, wins: 61, pnl: 21450, badge: "Frontier" },
    { rank: 7, name: "Priya Mehta", handle: "priya_m", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", accuracy: 68.0, volume: 189000, resolved: 82, wins: 56, pnl: 18200, badge: "Crypto Hawk" },
    { rank: 8, name: "James Park", handle: "jpark_odds", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80", accuracy: 66.5, volume: 172400, resolved: 74, wins: 49, pnl: 12100, badge: "Steady Hand" },
    { rank: 9, name: "Lena Ortiz", handle: "lena_o", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&auto=format&fit=crop&q=80", accuracy: 64.8, volume: 158000, resolved: 68, wins: 44, pnl: 8700, badge: "Newcomer" },
    { rank: 10, name: "Omar Hassan", handle: "omar_h", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", accuracy: 62.3, volume: 142000, resolved: 61, wins: 38, pnl: 4200, badge: "Grinder" },
  ],
  monthly: [
    { rank: 1, name: "Marcus Vance", handle: "mvance_quant", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", accuracy: 82.1, volume: 124000, resolved: 38, wins: 31, pnl: 21400, badge: "Macro Wizard" },
    { rank: 2, name: "Sarah Lin", handle: "slin_alpha", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", accuracy: 80.4, volume: 118500, resolved: 36, wins: 29, pnl: 19800, badge: "Master Predictor" },
    { rank: 3, name: "David Chen", handle: "dchen_tech", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", accuracy: 77.2, volume: 102000, resolved: 31, wins: 24, pnl: 14250, badge: "Silicon Scout" },
    { rank: 4, name: "Aisha Patel", handle: "aisha_ai", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80", accuracy: 75.0, volume: 98000, resolved: 29, wins: 22, pnl: 12800, badge: "Tech Oracle" },
    { rank: 5, name: "Elena Rostova", handle: "elena_r", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80", accuracy: 72.8, volume: 87000, resolved: 26, wins: 19, pnl: 9600, badge: "Contrarian" },
    { rank: 6, name: "Alex Rivers", handle: "arivers", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80", accuracy: 70.5, volume: 81000, resolved: 24, wins: 17, pnl: 7400, badge: "Frontier" },
    { rank: 7, name: "Priya Mehta", handle: "priya_m", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", accuracy: 69.9, volume: 76000, resolved: 22, wins: 15, pnl: 6200, badge: "Crypto Hawk" },
    { rank: 8, name: "James Park", handle: "jpark_odds", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80", accuracy: 67.3, volume: 68000, resolved: 19, wins: 13, pnl: 4100, badge: "Steady Hand" },
    { rank: 9, name: "Lena Ortiz", handle: "lena_o", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&auto=format&fit=crop&q=80", accuracy: 65.1, volume: 59000, resolved: 17, wins: 11, pnl: 2900, badge: "Newcomer" },
    { rank: 10, name: "Omar Hassan", handle: "omar_h", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", accuracy: 63.0, volume: 52000, resolved: 15, wins: 9, pnl: 1500, badge: "Grinder" },
  ],
  weekly: [
    { rank: 1, name: "Aisha Patel", handle: "aisha_ai", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80", accuracy: 88.9, volume: 42000, resolved: 9, wins: 8, pnl: 8200, badge: "Tech Oracle" },
    { rank: 2, name: "Priya Mehta", handle: "priya_m", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", accuracy: 85.7, volume: 38000, resolved: 7, wins: 6, pnl: 6400, badge: "Crypto Hawk" },
    { rank: 3, name: "Sarah Lin", handle: "slin_alpha", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", accuracy: 83.3, volume: 35500, resolved: 6, wins: 5, pnl: 5900, badge: "Master Predictor" },
    { rank: 4, name: "David Chen", handle: "dchen_tech", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", accuracy: 80.0, volume: 31000, resolved: 5, wins: 4, pnl: 4200, badge: "Silicon Scout" },
    { rank: 5, name: "Marcus Vance", handle: "mvance_quant", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", accuracy: 75.0, volume: 29000, resolved: 4, wins: 3, pnl: 3100, badge: "Macro Wizard" },
    { rank: 6, name: "Alex Rivers", handle: "arivers", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80", accuracy: 71.4, volume: 26000, resolved: 7, wins: 5, pnl: 2800, badge: "Frontier" },
    { rank: 7, name: "Elena Rostova", handle: "elena_r", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80", accuracy: 70.0, volume: 24000, resolved: 10, wins: 7, pnl: 2100, badge: "Contrarian" },
    { rank: 8, name: "James Park", handle: "jpark_odds", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80", accuracy: 66.7, volume: 21000, resolved: 6, wins: 4, pnl: 900, badge: "Steady Hand" },
    { rank: 9, name: "Omar Hassan", handle: "omar_h", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", accuracy: 60.0, volume: 18000, resolved: 5, wins: 3, pnl: -400, badge: "Grinder" },
    { rank: 10, name: "Lena Ortiz", handle: "lena_o", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&auto=format&fit=crop&q=80", accuracy: 57.1, volume: 15000, resolved: 7, wins: 4, pnl: -800, badge: "Newcomer" },
  ],
};

function formatVolume(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n.toLocaleString()}`;
}
function formatPnl(n: number) {
  const sign = n >= 0 ? "+" : "";
  return `${sign}$${n.toLocaleString("en-US")}`;
}

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<TimeFilter>("all");
  const { mode } = useMarketStore();
  const entries = useMemo(() => LEADERBOARD_DATA[filter], [filter]);
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const isDemo = mode === "demo";

  // For ordering podium as 2,1,3 on desktop
  const podiumOrder = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3;

  if (entries.length === 0) {
    return (
      <Shell>
        <div className="max-w-6xl mx-auto">
          <EmptyState icon={SearchX} title="No demo traders yet" description="Leaderboard data is mock-only. No rankings to display for this time range." actionLabel="View All Time" onActionClick={() => setFilter("all")} />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1.5 min-w-0">
              <h1 className="text-[26px] lg:text-[32px] font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                  <Trophy className="w-5 h-5 text-white" aria-hidden="true" />
                </span>
                Leaderboard
              </h1>
              <p className="text-[13px] text-gray-400 leading-relaxed max-w-2xl">
                Mock traders ranked by demo prediction performance — accuracy, volume, and P&amp;L from simulated markets. Not live users.
              </p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${isDemo ? "bg-amber-500/10 text-amber-300 border-amber-500/30" : "bg-[#111827] border-[#1F2937] text-gray-400"}`}>
              <Award className="w-3.5 h-3.5" aria-hidden="true" />
              {isDemo ? "DEMO rankings" : "Preview rankings"}
            </span>
          </div>

          {isDemo && (
            <div className="omx-card p-3 flex items-start gap-2.5 border-amber-500/20 bg-amber-500/[0.06]">
              <Info className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-[12px] leading-relaxed text-gray-300">
                <strong className="text-amber-200">Demo rankings — simulated only.</strong> Volume, wins, and P&amp;L below are from mock markets and demo cash (no real money, no live leaderboard). Switch to Real mode preview to hide demo labels.
              </p>
            </div>
          )}

          <div className="omx-card p-3 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-300 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-[12px] leading-relaxed text-gray-300">
              <strong className="text-gray-100">How it’s ranked:</strong> Accuracy (win rate on resolved mock predictions) is primary, then demo volume, then total P&amp;L. Weekly / Monthly / All Time are separate mock snapshots — not real-time.
            </p>
          </div>
        </div>

        {/* Time filters */}
        <div role="tablist" aria-label="Leaderboard time range" className="flex items-center gap-2 p-1 rounded-xl bg-[#111827] border border-[#1F2937] w-fit">
          {(["weekly", "monthly", "all"] as TimeFilter[]).map((t) => {
            const active = filter === t;
            const label = t === "weekly" ? "Weekly" : t === "monthly" ? "Monthly" : "All Time";
            return (
              <button
                key={t}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(t)}
                className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-colors min-h-[36px] inline-flex items-center gap-1.5 ${
                  active ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <Clock className="w-3.5 h-3.5 opacity-70" aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>

        {/* Top 3 podium */}
        <section aria-labelledby="podium-heading" className="space-y-3">
          <h2 id="podium-heading" className="text-[15px] font-bold text-white flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" aria-hidden="true" /> Top 3
            <span className="text-xs font-medium text-gray-500 capitalize omx-num">· {filter === "all" ? "all time" : filter} demo</span>
          </h2>

          {/* Desktop podium */}
          <div className="hidden sm:grid grid-cols-3 gap-4 items-end">
            {podiumOrder.map((e) => {
              const isFirst = e.rank === 1;
              return (
                <div
                  key={e.handle}
                  className={`omx-card p-5 text-center relative overflow-hidden flex flex-col items-center gap-3 ${
                    isFirst ? "border-amber-500/30 shadow-amber-500/10 scale-[1.02] z-10" : e.rank === 2 ? "border-slate-500/20" : "border-amber-700/20"
                  } ${isFirst ? "pb-6" : ""}`}
                >
                  {isFirst && (
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" aria-hidden="true" />
                  )}
                  <div className="relative">
                    <img src={e.avatar} alt="" className={`rounded-full object-cover border-2 ${isFirst ? "w-16 h-16 border-amber-400 shadow-lg" : "w-14 h-14 border-white/10"}`} />
                    <span
                      className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold border shadow ${
                        e.rank === 1
                          ? "bg-amber-400 text-amber-950 border-amber-300"
                          : e.rank === 2
                            ? "bg-slate-400 text-slate-900 border-slate-300"
                            : "bg-amber-700 text-amber-100 border-amber-600"
                      }`}
                    >
                      {e.rank}
                    </span>
                  </div>
                  <div className="space-y-1 min-w-0 w-full">
                    <p className="text-[14px] font-bold text-white truncate">{e.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">@{e.handle} · {e.badge}</p>
                    <p className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-bold omx-num">
                      <Target className="w-3 h-3" aria-hidden="true" /> {e.accuracy.toFixed(1)}% accuracy
                    </p>
                  </div>
                  <dl className="grid grid-cols-3 gap-2 w-full text-[11px] pt-3 border-t border-[#1F2937]/70">
                    <div>
                      <dt className="text-gray-500 uppercase tracking-wider font-bold">Volume</dt>
                      <dd className="font-mono font-bold text-gray-100 omx-num">{formatVolume(e.volume)}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500 uppercase tracking-wider font-bold">Resolved</dt>
                      <dd className="font-mono font-bold text-gray-100 omx-num">
                        {e.wins}/{e.resolved}
                      </dd>
                      <dd className="text-[10px] text-gray-500">{((e.wins / e.resolved) * 100).toFixed(0)}% wins</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500 uppercase tracking-wider font-bold">P&L</dt>
                      <dd className={`font-mono font-bold omx-num ${e.pnl >= 0 ? "text-emerald-300" : "text-rose-300"}`}>{formatPnl(e.pnl)}</dd>
                    </div>
                  </dl>
                </div>
              );
            })}
          </div>

          {/* Mobile stacked */}
          <div className="grid sm:hidden grid-cols-1 gap-3">
            {top3.map((e) => (
              <div key={`m-${e.handle}`} className="omx-card p-4 flex items-center gap-3">
                <div className="relative shrink-0">
                  <img src={e.avatar} alt="" className="w-12 h-12 rounded-full object-cover border border-white/10" />
                  <span
                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold border ${
                      e.rank === 1 ? "bg-amber-400 text-amber-950 border-amber-300" : e.rank === 2 ? "bg-slate-400 text-slate-900 border-slate-300" : "bg-amber-700 text-amber-100 border-amber-600"
                    }`}
                  >
                    {e.rank}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-white truncate flex items-center gap-1.5">
                    {e.name} <span className="text-[11px] font-medium text-gray-500">@{e.handle}</span>
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">
                    {e.accuracy.toFixed(1)}% · {formatVolume(e.volume)} vol · {e.wins}/{e.resolved} wins · <span className={e.pnl >= 0 ? "text-emerald-300" : "text-rose-300"}>{formatPnl(e.pnl)}</span>
                  </p>
                </div>
                <Trophy className={`w-4 h-4 shrink-0 ${e.rank === 1 ? "text-amber-400" : e.rank === 2 ? "text-slate-400" : "text-amber-700"}`} aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>

        {/* Rest of leaderboard */}
        <section aria-labelledby="board-heading" className="space-y-3">
          <h2 id="board-heading" className="text-[15px] font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-300" aria-hidden="true" /> Full board
            <span className="text-xs font-medium text-gray-500">· {rest.length + top3.length} demo traders</span>
          </h2>

          {/* Desktop table */}
          <div className="hidden md:block omx-card overflow-hidden p-0">
            <div className="scroll-x overflow-x-auto" role="region" aria-label="Leaderboard table, scroll horizontally" tabIndex={0}>
              <table className="w-full text-left text-[13px] min-w-[760px]">
                <thead>
                  <tr className="bg-[#0B0F19] text-gray-500 uppercase text-[11px] tracking-wider border-b border-[#1F2937]">
                    <th scope="col" className="p-4 font-semibold w-[64px]">
                      Rank
                    </th>
                    <th scope="col" className="p-4 font-semibold">
                      Trader
                    </th>
                    <th scope="col" className="p-4 text-right font-semibold">
                      Accuracy
                    </th>
                    <th scope="col" className="p-4 text-right font-semibold">
                      Demo volume
                    </th>
                    <th scope="col" className="p-4 text-center font-semibold">
                      Resolved
                    </th>
                    <th scope="col" className="p-4 text-right font-semibold">
                      P&amp;L
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2937]/70">
                  {entries.map((e) => (
                    <tr key={e.handle} className={`hover:bg-white/[0.02] transition-colors ${e.rank <= 3 ? "bg-amber-500/[0.03]" : ""}`}>
                      <td className="p-4">
                        <span className="inline-flex w-7 h-7 rounded-lg bg-white/[0.06] border border-white/10 items-center justify-center text-[12px] font-extrabold text-gray-300 omx-num">
                          {e.rank}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={e.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-white truncate flex items-center gap-1.5">
                              {e.name}
                              {e.rank <= 3 && <Medal className={`w-3.5 h-3.5 ${e.rank === 1 ? "text-amber-400" : e.rank === 2 ? "text-slate-400" : "text-amber-700"}`} aria-hidden="true" />}
                            </p>
                            <p className="text-[11px] text-gray-500 truncate">
                              @{e.handle} · {e.badge}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-bold omx-num">
                          <Target className="w-3 h-3" aria-hidden="true" /> {e.accuracy.toFixed(1)}%
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono font-semibold text-gray-100 omx-num">{formatVolume(e.volume)}</td>
                      <td className="p-4 text-center font-mono text-gray-300 omx-num">
                        <span className="font-bold text-white">{e.wins}</span>
                        <span className="text-gray-500">/{e.resolved}</span>
                      </td>
                      <td className={`p-4 text-right font-mono font-bold omx-num ${e.pnl >= 0 ? "text-emerald-300" : "text-rose-300"}`}>{formatPnl(e.pnl)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <ul className="md:hidden space-y-3">
            {entries.map((e) => (
              <li key={`c-${e.handle}`} className="omx-card p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-[11px] font-extrabold text-gray-400 omx-num shrink-0">
                      {e.rank}
                    </span>
                    <img src={e.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-white truncate">{e.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">
                        @{e.handle} · {e.badge}
                      </p>
                    </div>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full border text-[11px] font-bold omx-num ${e.rank <= 3 ? "bg-amber-500/10 text-amber-300 border-amber-500/30" : "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"}`}>
                    {e.accuracy.toFixed(1)}%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-[#0B0F19] border border-[#1F2937] p-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center justify-center gap-1">
                      <DollarSign className="w-3 h-3" aria-hidden="true" /> Volume
                    </p>
                    <p className="font-mono font-bold text-gray-100 omx-num text-[13px] mt-1">{formatVolume(e.volume)}</p>
                  </div>
                  <div className="rounded-xl bg-[#0B0F19] border border-[#1F2937] p-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Resolved</p>
                    <p className="font-mono font-bold text-white omx-num text-[13px] mt-1">
                      {e.wins}/{e.resolved}
                    </p>
                    <p className="text-[10px] text-gray-500">{((e.wins / e.resolved) * 100).toFixed(0)}% wins</p>
                  </div>
                  <div className="rounded-xl bg-[#0B0F19] border border-[#1F2937] p-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">P&L</p>
                    <p className={`font-mono font-bold omx-num text-[13px] mt-1 ${e.pnl >= 0 ? "text-emerald-300" : "text-rose-300"}`}>{formatPnl(e.pnl)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span className="flex items-center gap-1 omx-num">
                    <Users className="w-3 h-3" aria-hidden="true" /> {e.resolved} resolved
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3 h-3 text-indigo-300" aria-hidden="true" /> {e.badge}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="omx-card p-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-[11px] leading-relaxed text-gray-500">
              Demo leaderboard only — {entries.length} mock traders, P&amp;L and volume from simulated fills. Not a live ranking. Rankings update per mock snapshot (Weekly/Monthly/All Time), not real-time.
            </p>
          </div>
        </section>
      </div>
    </Shell>
  );
}

"use client";

import React, { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useMarketStore } from "@/store/useMarketStore";
import {
  Settings,
  User,
  Palette,
  Wallet,
  Info,
  LogOut,
  ShieldCheck,
  Mail,
  AtSign,
  BadgeCheck,
  Monitor,
  Database,
  FileText,
} from "lucide-react";

export default function SettingsPage() {
  const { demoBalance, positions, trades, mode, resetDemoAccount } = useMarketStore();
  const [logoutMsg, setLogoutMsg] = useState<string | null>(null);

  const totalPositionsValue = positions.reduce((acc, p) => acc + p.currentValue, 0);
  const handleLogout = () => {
    resetDemoAccount();
    setLogoutMsg("Demo session reset — no real account exists. Balance restored to $10,000, positions and trades cleared (local demo state only).");
    setTimeout(() => setLogoutMsg(null), 4000);
  };

  return (
    <Shell>
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="space-y-1.5">
          <h1 className="text-[26px] lg:text-[32px] font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-[#111827] border border-[#1F2937] flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5 text-indigo-300" aria-hidden="true" />
            </span>
            Settings
          </h1>
          <p className="text-[13px] text-gray-400 leading-relaxed max-w-xl">
            Demo preferences for OmniMarketX — no authentication, no backend. Everything here is local.
          </p>
        </div>

        {/* Profile */}
        <section aria-labelledby="profile-heading" className="omx-card p-5 space-y-4">
          <h2 id="profile-heading" className="text-[13px] font-bold uppercase tracking-wider text-gray-200 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-300" aria-hidden="true" />
            Profile
            <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-bold">Demo</span>
          </h2>
          <div className="flex items-center gap-4 p-3 rounded-xl bg-[#0B0F19] border border-[#1F2937]">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
              alt="Demo avatar for Ayush Kumar"
              className="w-14 h-14 rounded-full object-cover border border-white/10 shrink-0"
            />
            <div className="min-w-0 space-y-1">
              <p className="text-[15px] font-bold text-white flex items-center gap-1.5 flex-wrap">
                Ayush Kumar
                <BadgeCheck className="w-4 h-4 text-indigo-300" aria-hidden="true" />
                <span className="text-[11px] font-semibold text-gray-500">Demo profile</span>
              </p>
              <p className="flex items-center gap-1.5 text-[13px] text-gray-300">
                <AtSign className="w-3.5 h-3.5 text-gray-500" aria-hidden="true" />
                <span className="font-mono omx-num">@ayush</span>
                <span className="text-gray-600" aria-hidden="true">·</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-[#111827] border border-[#1F2937] text-gray-400">demo only</span>
              </p>
              <p className="flex items-center gap-1.5 text-[12px] text-gray-400">
                <Mail className="w-3.5 h-3.5 text-gray-500" aria-hidden="true" />
                <span className="font-mono omx-num truncate">ayush@demo.omnimarketx.local</span>
              </p>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 mt-px text-gray-500" aria-hidden="true" />
            This is demo data only. No real user account, Google login, or backend session exists. Shown to make the product feel complete.
          </p>
        </section>

        {/* Appearance */}
        <section aria-labelledby="appearance-heading" className="omx-card p-5 space-y-4">
          <h2 id="appearance-heading" className="text-[13px] font-bold uppercase tracking-wider text-gray-200 flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-300" aria-hidden="true" />
            Appearance
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#0B0F19] border border-[#1F2937]">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                <Monitor className="w-4 h-4 text-gray-300" aria-hidden="true" />
              </span>
              <div className="leading-tight min-w-0">
                <p className="text-[13px] font-semibold text-gray-200">Theme</p>
                <p className="text-[11px] text-gray-500">Light / Dark — saved in localStorage</p>
              </div>
            </div>
            <div className="w-full sm:w-40 shrink-0">
              <ThemeToggle />
            </div>
          </div>
          <p className="text-[11px] text-gray-500">Changing here updates the entire app instantly — Home, Markets, Market Detail, charts, Portfolio, Trending, Social, Leaderboard and both AI features.</p>
        </section>

        {/* Account */}
        <section aria-labelledby="account-heading" className="omx-card p-5 space-y-4">
          <h2 id="account-heading" className="text-[13px] font-bold uppercase tracking-wider text-gray-200 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-300" aria-hidden="true" />
            Account
            <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-bold">Demo Account</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#0B0F19] border border-[#1F2937] space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Database className="w-3 h-3" aria-hidden="true" /> Demo balance
              </p>
              <p className="text-[18px] font-extrabold font-mono text-emerald-300 omx-num">${demoBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
              <p className="text-[11px] text-gray-500">{positions.length} positions · ${totalPositionsValue.toFixed(2)} invested</p>
            </div>
            <div className="p-3 rounded-xl bg-[#0B0F19] border border-[#1F2937] space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Status</p>
              <p className="text-[13px] font-semibold text-gray-100 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                Demo — no auth
              </p>
              <p className="text-[11px] text-gray-500">Local Zustand persist</p>
            </div>
            <div className="p-3 rounded-xl bg-[#0B0F19] border border-[#1F2937] space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Mode</p>
              <p className="text-[13px] font-semibold text-gray-100 capitalize">{mode} · simulated</p>
              <p className="text-[11px] text-gray-500">{trades.length} demo fills</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#111827] hover:bg-[#1A2338] text-gray-300 hover:text-white border border-[#1F2937] text-[13px] font-semibold transition-colors min-h-[44px] w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              Logout — reset demo
            </button>
            <p className="text-[11px] text-gray-500 leading-relaxed flex items-center">
              Clears demo balance, positions and trades locally. No backend session to destroy.
            </p>
          </div>
          {logoutMsg && (
            <div role="status" className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[13px] text-emerald-200 leading-relaxed">
              {logoutMsg}
            </div>
          )}
        </section>

        {/* About */}
        <section aria-labelledby="about-heading" className="omx-card p-5 space-y-3">
          <h2 id="about-heading" className="text-[13px] font-bold uppercase tracking-wider text-gray-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-300" aria-hidden="true" />
            About
          </h2>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0B0F19] border border-[#1F2937]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-[14px] font-bold text-white">OmniMarketX</p>
              <p className="text-[12px] text-gray-400">Prediction Markets / Demo Trading · Version 1.0 — Demo</p>
              <p className="text-[12px] text-gray-300 leading-relaxed">
                Social prediction market foundry with verified resolution sources, simulated trading, and demo-only social/leaderboard. Explore markets, check AI Market Analyst per page, and chat with the local Support assistant. No real money, no backend.
              </p>
            </div>
          </div>
          <p className="text-[11px] text-gray-500">Built with Next.js · Tailwind · Zustand · Recharts. Theme persists in localStorage.</p>
        </section>
      </div>
    </Shell>
  );
}

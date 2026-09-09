"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  TrendingUp,
  PieChart,
  Bookmark,
  Search,
  RotateCcw,
  Menu,
  X,
  Compass,
  MessagesSquare,
  Scale,
  FlaskConical,
  Flame,
  Trophy,
  Home,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { useMarketStore } from "@/store/useMarketStore";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface ShellProps {
  children: React.ReactNode;
}

const JOURNEY = [
  { label: "Discover", icon: Compass, hint: "Browse markets" },
  { label: "Understand", icon: Scale, hint: "Read resolution" },
  { label: "Evaluate", icon: FlaskConical, hint: "Check consensus" },
  { label: "Predict", icon: TrendingUp, hint: "Trade YES / NO" },
  { label: "Discuss", icon: MessagesSquare, hint: "Share reasoning" },
];

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    mode,
    demoBalance,
    toggleMode,
    searchQuery,
    setSearchQuery,
    resetDemoAccount,
    positions,
    watchlist,
    showWatchlistOnly,
    setShowWatchlistOnly,
  } = useMarketStore();

  const formattedBalance = demoBalance.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const totalPositionsValue = positions
    .reduce((acc, p) => acc + p.currentValue, 0)
    .toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Mobile drawer: Escape to close + lock body scroll
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  const goWatchlist = () => {
    setShowWatchlistOnly(true);
    setMobileMenuOpen(false);
    if (pathname !== "/") router.push("/");
  };

  const goMarkets = () => {
    setShowWatchlistOnly(false);
    setMobileMenuOpen(false);
    if (pathname !== "/") router.push("/");
  };

  const isWatchlistActive = pathname === "/" && showWatchlistOnly;

  const isHomeActive = pathname === "/" && !showWatchlistOnly;
  const navItems = [
    { name: "Home", href: "/", icon: Home, active: isHomeActive, onClick: goMarkets },
    { name: "Markets", href: "/", icon: TrendingUp, active: isHomeActive, onClick: goMarkets },
    { name: "Trending", href: "/trending", icon: Flame, active: pathname === "/trending" },
    { name: "Social", href: "/social", icon: MessagesSquare, active: pathname === "/social" },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy, active: pathname === "/leaderboard" },
    { name: "Portfolio", href: "/portfolio", icon: PieChart, count: positions.length, active: pathname === "/portfolio" },
    { name: "Watchlist", icon: Bookmark, count: watchlist.length, active: isWatchlistActive, onClick: goWatchlist },
    { name: "Settings", href: "/settings", icon: Settings, active: pathname === "/settings" },
  ];

  const navGroups = [
    { label: "DISCOVER", items: navItems.slice(0, 3) },
    { label: "PARTICIPATE", items: navItems.slice(3, 5) },
    { label: "YOUR ACTIVITY", items: navItems.slice(5, 7) },
    { label: "SYSTEM", items: navItems.slice(7, 8) },
  ];

  return (
    <div className="min-h-screen bg-[#090D16] text-gray-100 flex flex-col antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Mode status — high-contrast, clearly actionable */}
      <div
        role="status"
        aria-live="polite"
        className={`w-full border-b ${
          mode === "demo" ? "bg-indigo-600 border-indigo-700" : "bg-slate-900 border-amber-500/20"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {mode === "demo" ? (
              <span aria-hidden="true" className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
            )}
            <p className="text-[11px] sm:text-xs font-bold tracking-wider flex items-center gap-2 flex-wrap min-w-0">
              {mode === "demo" ? (
                <>
                  <span className="text-white">DEMO MODE</span>
                  <span className="hidden sm:inline font-medium text-indigo-100">— Practice trading with virtual funds</span>
                  <span className="sm:hidden font-medium text-indigo-100">· Virtual funds</span>
                </>
              ) : (
                <>
                  <span className="text-amber-300">REAL MODE</span>
                  <span className="hidden sm:inline font-medium text-gray-300">— Trading disabled in this demo build</span>
                  <span className="sm:hidden font-medium text-gray-400">· Trading disabled</span>
                </>
              )}
            </p>
          </div>
          <button
            onClick={toggleMode}
            className={`shrink-0 px-3.5 py-1.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wider border transition-colors min-h-[36px] ${
              mode === "demo"
                ? "bg-white text-indigo-700 border-white hover:bg-indigo-50 shadow-sm"
                : "bg-amber-500 text-white border-amber-600 hover:bg-amber-600 shadow-sm"
            }`}
          >
            Switch to {mode === "demo" ? "Real" : "Demo"}
          </button>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-[#1F2937] px-4 lg:px-8 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-[#111827] text-gray-300 hover:text-white border border-[#1F2937] min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" onClick={goMarkets} className="flex items-center gap-2.5 group shrink-0" aria-label="OmniMarketX home">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-[17px] tracking-tight text-white">
                OmniMarket<span className="text-indigo-400">X</span>
              </span>
              <span className="hidden min-[420px]:block text-[10px] font-semibold tracking-[0.18em] text-gray-400 uppercase mt-1">
                Prediction market
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Global Search */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          <label htmlFor="omx-global-search" className="sr-only">Search markets</label>
          <input
            id="omx-global-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search markets, topics, or sources…"
            className="w-full bg-[#0B0F19] text-gray-100 text-sm pl-10 pr-16 py-2.5 rounded-xl border border-[#1F2937] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60 transition-all placeholder:text-gray-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-1 text-[11px] font-semibold text-gray-400 hover:text-gray-200 rounded-lg hover:bg-white/5"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right: Balance + Mode */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111827] border border-[#1F2937]">
            <div className="flex flex-col text-right leading-tight">
              <span className="hidden min-[420px]:block text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                {mode === "demo" ? "Demo cash" : "Real funds"}
              </span>
              <span className="text-sm font-bold text-emerald-300 font-mono omx-num whitespace-nowrap">
                ${formattedBalance}
              </span>
            </div>
            {mode === "demo" && (
              <button
                onClick={resetDemoAccount}
                title="Reset demo balance to $10,000"
                aria-label="Reset demo balance to $10,000"
                className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-indigo-300 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          <button
            onClick={toggleMode}
            aria-pressed={mode === "real"}
            title={mode === "demo" ? "Currently in demo mode" : "Currently in real mode preview"}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-extrabold tracking-wider transition-all border ${
              mode === "demo"
                ? "bg-indigo-600/15 text-indigo-200 border-indigo-500/40 hover:bg-indigo-600/25"
                : "bg-emerald-600/15 text-emerald-200 border-emerald-500/40 hover:bg-emerald-600/25"
            }`}
          >
            <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${mode === "demo" ? "bg-indigo-400" : "bg-emerald-400"}`} />
            {mode === "demo" ? "DEMO" : "REAL"}
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-60 border-r border-[#1F2937] p-4 flex-shrink-0" aria-label="Primary">
          <div className="space-y-5 sticky top-[80px]">
            <nav className="space-y-4" aria-label="Sections">
              {navGroups.map((group) => (
                <div key={group.label} className="space-y-1">
                  <p className="px-3 omx-eyebrow">{group.label}</p>
                  {group.items.map((item) => {
                    const content = (
                      <>
                        <div className="flex items-center gap-3">
                          <item.icon className={`w-4 h-4 ${item.active ? "text-indigo-300" : "text-gray-500"}`} aria-hidden="true" />
                          <span>{item.name}</span>
                        </div>
                        {item.count !== undefined && item.count > 0 && (
                          <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-indigo-500/15 text-indigo-200 omx-num">
                            {item.count}
                          </span>
                        )}
                      </>
                    );
                    const cls = `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                      item.active
                        ? "bg-indigo-600/15 text-indigo-200 border border-indigo-500/30 font-semibold"
                        : "text-gray-400 hover:text-gray-100 hover:bg-[#111827] border border-transparent"
                    }`;
                    return item.href ? (
                      <Link key={item.name} href={item.href} aria-current={item.active ? "page" : undefined} className={cls}>
                        {content}
                      </Link>
                    ) : (
                      <button key={item.name} onClick={item.onClick} aria-current={item.active ? "page" : undefined} className={cls}>
                        {content}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>

            {/* Journey: Discover → Understand → Evaluate → Predict → Discuss */}
            <div className="p-3.5 rounded-2xl bg-[#111827]/80 border border-[#1F2937]">
              <p className="omx-eyebrow !text-indigo-300/90 mb-2.5">How it works</p>
              <ol className="space-y-1">
                {JOURNEY.map((s, i) => (
                  <li key={s.label} className="flex items-center gap-2.5 text-xs py-1">
                    <span className="w-5 h-5 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-[10px] font-bold text-gray-300 shrink-0 omx-num">
                      {i + 1}
                    </span>
                    <div className="leading-tight">
                      <span className="block font-semibold text-gray-200">{s.label}</span>
                      <span className="block text-[11px] text-gray-500">{s.hint}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Portfolio snapshot */}
            <div className="p-3.5 rounded-2xl bg-[#111827]/80 border border-[#1F2937] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Open positions</span>
                <span className="font-bold text-gray-100 omx-num">{positions.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Positions value</span>
                <span className="font-mono font-semibold text-emerald-300 omx-num">${totalPositionsValue}</span>
              </div>
              <Link
                href="/portfolio"
                className="block text-center text-xs font-semibold text-indigo-300 hover:text-indigo-200 pt-1"
              >
                View full portfolio →
              </Link>
            </div>

            <div className="pt-2">
              <ThemeToggle />
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Navigation menu">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />
            <div className="relative w-[300px] max-w-[85vw] bg-[#0B0F19] h-full p-5 border-r border-[#1F2937] flex flex-col overflow-y-auto">
              <div className="space-y-5 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[17px] text-white">OmniMarket<span className="text-indigo-400">X</span></span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 min-w-[40px] min-h-[40px] flex items-center justify-center"
                    aria-label="Close navigation"
                    autoFocus
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                  <label htmlFor="omx-mobile-search" className="sr-only">Search markets</label>
                  <input
                    id="omx-mobile-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search markets…"
                    className="w-full bg-[#111827] text-gray-100 text-sm pl-9 pr-3 py-2.5 rounded-xl border border-[#1F2937] placeholder:text-gray-500"
                  />
                </div>

                <nav className="space-y-4" aria-label="Mobile sections">
                  {navGroups.map((group) => (
                    <div key={group.label} className="space-y-1">
                      <p className="px-3 omx-eyebrow">{group.label}</p>
                      {group.items.map((item) =>
                        item.href ? (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            aria-current={item.active ? "page" : undefined}
                            className={`flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-colors min-h-[48px] ${
                              item.active ? "text-indigo-200 bg-indigo-600/15 border border-indigo-500/30" : "text-gray-300 hover:bg-[#111827] border border-transparent"
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <item.icon className="w-5 h-5 text-indigo-300" aria-hidden="true" />
                              {item.name}
                            </span>
                            {item.count !== undefined && item.count > 0 && (
                              <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-indigo-500/15 text-indigo-200 omx-num">{item.count}</span>
                            )}
                          </Link>
                        ) : (
                          <button
                            key={item.name}
                            onClick={item.onClick}
                            aria-current={item.active ? "page" : undefined}
                            className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-colors min-h-[48px] ${
                              item.active ? "text-indigo-200 bg-indigo-600/15 border border-indigo-500/30" : "text-gray-300 hover:bg-[#111827] border border-transparent"
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <item.icon className="w-5 h-5 text-indigo-300" aria-hidden="true" />
                              {item.name}
                            </span>
                            {item.count !== undefined && item.count > 0 && (
                              <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-indigo-500/15 text-indigo-200 omx-num">{item.count}</span>
                            )}
                          </button>
                        )
                      )}
                    </div>
                  ))}
                </nav>

                <div className="p-3.5 rounded-2xl bg-[#111827] border border-[#1F2937]">
                  <p className="omx-eyebrow !text-indigo-300/90 mb-2">How it works</p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Discover → Understand → Evaluate → Predict → Discuss
                  </p>
                </div>

                <ThemeToggle />
              </div>

              <div className="pt-4 mt-4 border-t border-[#1F2937] text-xs text-gray-500 flex items-center justify-between">
                <span>Demo prototype</span>
                <span className="font-mono omx-num text-emerald-300/80">${formattedBalance}</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0" tabIndex={-1}>
          {children}
        </main>
      </div>

      {/* Mobile bottom nav — thumb-reachable Predict path */}
      <nav aria-label="Mobile quick navigation" className="lg:hidden sticky bottom-0 z-40 bg-[#0B0F19]/95 backdrop-blur-md border-t border-[#1F2937] px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5">
        <div className="grid grid-cols-8 gap-0.5 max-w-md mx-auto">
          {navItems.map((item) =>
            item.href ? (
              <Link
                key={item.name}
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-semibold min-h-[52px] justify-center truncate ${
                  item.active ? "text-indigo-200 bg-indigo-600/15" : "text-gray-400"
                }`}
              >
                <span className="relative">
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                  {item.count !== undefined && item.count > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[14px] h-3.5 sm:min-w-[16px] sm:h-4 px-0.5 sm:px-1 rounded-full bg-indigo-500 text-white text-[8px] sm:text-[9px] font-bold flex items-center justify-center omx-num">
                      {item.count}
                    </span>
                  )}
                </span>
                <span className="truncate max-w-full px-0.5">{item.name}</span>
              </Link>
            ) : (
              <button
                key={item.name}
                onClick={item.onClick}
                aria-current={item.active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-semibold min-h-[52px] justify-center truncate ${
                  item.active ? "text-indigo-200 bg-indigo-600/15" : "text-gray-400"
                }`}
              >
                <span className="relative">
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                  {item.count !== undefined && item.count > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[14px] h-3.5 sm:min-w-[16px] sm:h-4 px-0.5 sm:px-1 rounded-full bg-indigo-500 text-white text-[8px] sm:text-[9px] font-bold flex items-center justify-center omx-num">
                      {item.count}
                    </span>
                  )}
                </span>
                <span className="truncate max-w-full px-0.5">{item.name}</span>
              </button>
            )
          )}
        </div>
      </nav>
    </div>
  );
};

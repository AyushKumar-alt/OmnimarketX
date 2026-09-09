"use client";

import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, RotateCcw, Sparkles, Info } from "lucide-react";

type Msg = { id: string; role: "user" | "assistant"; text: string };

function getResponse(input: string): string {
  const q = input.toLowerCase().trim();

  // Highest priority: exact platform question
  if (q.includes("tell me about this platform") || q === "tell me about this platform") {
    return "OmniMarketX is a Social Prediction Market & Demo Trading Foundry — a demo-only vertical slice where you Discover → Understand → Evaluate → Predict → Discuss. It has 8 mock markets (6 live seeded + 2 unseeded) across Tech, Finance, Crypto, Science, Geopolitics and Pop Culture. Each market shows a YES probability (e.g. 68%), volume, trader count and deadline. You trade YES/NO with simulated $10,000 demo cash (no real money), view consensus charts, read verified resolution criteria, discuss reasoning, and track portfolio. Use left nav: Markets, Trending, Social, Leaderboard, Portfolio, plus per-market AI Market Analyst.";
  }
  if (q.includes("what is omnimarketx") || (q.includes("what is") && q.includes("omnimarket"))) {
    return "OmniMarketX is a demo prediction market. Browse Markets on Home, open any market to see its YES price/probability, chart, volume/traders/liquidity, deadline, and How this resolves (resolutionCriteria + resolutionSource). The 5-step journey is Discover → Understand (criteria/source) → Evaluate (consensus/momentum) → Predict (demo YES/NO) → Discuss (reasoning). No backend — all 8 markets and leaderboards are mock.";
  }
  if (q.includes("how does trading work") || q.includes("how to trade") || q.includes("how do i trade")) {
    return "Open a market (e.g. /market/mkt-1) → choose YES or NO in the Predict panel → enter Amount ($10/$50/$100) → see 1% simulated fee, estimated shares (amount-fee)/price and Payout if wins ($1 per share) → Buy. In Demo mode it deducts from your $10,000 demo cash, creates a position and trade in Portfolio. Real mode is preview only — order entry is disabled. Use MAX to fill balance.";
  }
  if (q === "what does yes mean?" || q.includes("what does yes mean") || (q.includes("what does yes") && !q.includes("68"))) {
    return "YES means you back that the market's resolutionCriteria will happen before the deadline and be confirmed by its resolutionSource. Example: “Will OpenAI release its next flagship ... ?” YES pays $1.00/share if OpenAI's Official Blog confirms public API before Dec 31 2026; otherwise NO pays. Price is your cost per share.";
  }
  if (q.includes("what does no mean")) {
    return "NO is the opposite of YES — you back that the criteria will NOT be met/confirmed in time. If YES price is $0.68, NO is $0.32. Buying NO pays $1.00/share if NO resolves. Both sides shown on each MarketCard as Yes $0.68 / No $0.32.";
  }
  if (q.includes("68%") || q.includes("probability") || q.includes("what does") && q.includes("%")) {
    return "68% YES means the market's current YES price is $0.68 — traders collectively price a 68% chance YES resolves. It is pricing, not certainty: 68% implies ~32% for NO. See the YES consensus number, $0.68/$0.32 prices, and volume/trader count for how strong the consensus is. Price moves with demo trades.";
  }
  if (q.includes("demo mode") || q.includes("what is demo")) {
    return "Demo Mode is the default simulated state. You get $10,000 demo cash (top bar, reset via ↻), all trades are simulated (no real money), positions and Trade history in Portfolio are persisted locally. Switch to Real in the header shows “Real mode preview — trading disabled in this demo build.”";
  }
  if (q.includes("how are markets resolved") || q.includes("how does resolution work") || q.includes("how are markets resolved")) {
    return "Each market has exact resolutionCriteria and resolutionSource (e.g. Official press release on openai.com, CoinGecko BTC index, MOSPI press releases, federalreserve.gov). How this resolves on the Market Detail shows both. Outcome is the published record at that source before the deadline (23:59 UTC), not the price. Check Source of truth link.";
  }
  if (q.includes("zero-volume") || q.includes("zero volume") || q.includes("zero-trader") || q.includes("zero trader") || q.includes("0 volume") || q.includes("0 trader") || q.includes("unseeded")) {
    return "A zero-volume / zero-trader market is Unseeded — flagged amber as “No activity yet / 50% is starting price, not consensus” (MarketCard and Market Detail). Example mkt-7 IBM 1,000 qubits and mkt-8 fusion have 0 volume, 0 traders, 50% not ranked in Trending. First demo trade seeds real price discovery.";
  }
  if (q.includes("where can i find my portfolio") || (q.includes("portfolio") && q.includes("where"))) {
    return "Your Portfolio is at /portfolio — also via left nav Portfolio (shows count) and sidebar snapshot “Open positions / Positions value”. It lists Open positions (market, side, shares, Avg → Now, Value, P&L, Close) and Trade history. Demo cash balance is always top-right.";
  }
  if (q.includes("where can i find trending") || (q.includes("trending") && q.includes("where"))) {
    return "Trending is at /trending — left nav Trending (Flame). It shows 3 demo-ranked sections: Biggest Probability Movers (abs YES% change), Most Traded (highest volume), Most Discussed (comment count). Category pills filter all sections; unseeded 0-volume markets are never ranked.";
  }

  // generic fallbacks for simple keywords
  if (q.includes("omnimarketx") || q.includes("platform")) {
    return "OmniMarketX is a Social Prediction Market & Demo Trading Foundry — demo-only with 8 mock markets (6 live +2 unseeded), 5-step journey Discover→Discuss, demo YES/NO trading with $10,000, Market Detail charts/consensus/resolution, plus Trending/Social/Leaderboard/Portfolio. No real money, no backend — see Home hero or Market Detail for live demo data.";
  }

  // fallback
  return "I'm a demo/local assistant (no LLM, no backend) — I only have mock knowledge of this OmniMarketX build. Try one of these:\n• What is OmniMarketX?\n• How does trading work?\n• What does YES 68% mean?\n• What is Demo Mode?\nOr ask about: How are markets resolved? / What does zero-volume mean? / Where is Portfolio? / Where is Trending?";
}

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      text: "Hi — I'm the OmniMarketX demo assistant (local, no LLM). Ask me “Tell me about this platform” or try the examples below.",
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Lock scroll, ESC, focus
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // focus input after open
    setTimeout(() => inputRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isOpen]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", text: trimmed };
    const reply: Msg = { id: `a-${Date.now()}`, role: "assistant", text: getResponse(trimmed) };
    setMessages((m) => [...m, userMsg, reply]);
    setInput("");
  };

  const clear = () => {
    setMessages([
      {
        id: "welcome2",
        role: "assistant",
        text: "Cleared. Ask me “Tell me about this platform” or try: What is Demo Mode? / How are markets resolved? / What does YES 68% mean?",
      },
    ]);
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Floating button — inspected: no in-code feedback widget found; assume typical bottom-right feedback at 16px, so offset Support to bottom-20 on mobile (above bottom nav) and right-6 desktop, left-auto to avoid overlap */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close support chat" : "Open support chat"}
        aria-expanded={isOpen}
        aria-controls="support-chat-panel"
        className="fixed z-40 flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300
          right-4 bottom-20 lg:right-6 lg:bottom-6
          min-w-[48px] min-h-[48px]"
      >
        {isOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <MessageCircle className="w-5 h-5" aria-hidden="true" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="support-title">
          <button aria-label="Close support chat overlay" onClick={() => setIsOpen(false)} className="absolute inset-0 bg-[#060A14]/60 backdrop-blur-[1px]" />
          <div
            id="support-chat-panel"
            className="relative w-full sm:w-[380px] max-w-[96vw] h-[min(560px,92dvh)] lg:h-[520px] max-h-[92dvh] mr-2 sm:mr-4 mb-2 sm:mb-4 mt-auto bg-[#0B0F19] border border-[#1F2937] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="shrink-0 px-4 py-3 border-b border-[#1F2937] bg-[#111827] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" aria-hidden="true" />
                </span>
                <div className="min-w-0 leading-tight">
                  <h2 id="support-title" className="text-[13px] font-extrabold text-white tracking-tight">
                    OmniMarketX Support
                  </h2>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" aria-hidden="true" />
                    Demo · local assistant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={clear}
                  aria-label="Clear conversation"
                  className="w-9 h-9 rounded-xl bg-[#0B0F19] border border-[#1F2937] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.04] transition-colors min-w-[44px] min-h-[44px]"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close support chat"
                  autoFocus
                  className="w-9 h-9 rounded-xl bg-[#0B0F19] border border-[#1F2937] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.04] transition-colors min-w-[44px] min-h-[44px]"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-[#090D16] scrollbar-none">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap border ${
                    m.role === "user"
                      ? "ml-auto bg-indigo-600 text-white border-indigo-500"
                      : "mr-auto bg-[#111827] text-gray-200 border-[#1F2937]"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              <div className="mr-auto max-w-[85%] rounded-xl bg-amber-500/[0.06] border border-amber-500/20 px-3 py-2 text-[11px] leading-relaxed text-gray-400">
                <span className="inline-flex items-center gap-1.5 font-semibold text-amber-300 mb-1">
                  <Info className="w-3 h-3" aria-hidden="true" /> Demo assistant
                </span>
                <p>Not a live AI service. Answers are local and grounded in this build&apos;s UI. Try: “How does trading work?”</p>
              </div>
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="shrink-0 p-3 border-t border-[#1F2937] bg-[#111827] flex items-center gap-2"
            >
              <label htmlFor="support-input" className="sr-only">
                Ask support
              </label>
              <input
                id="support-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Ask: “Tell me about this platform”'
                className="flex-1 min-w-0 bg-[#0B0F19] border border-[#1F2937] rounded-xl px-3 py-2.5 text-[13px] text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 min-h-[44px]"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={!input.trim()}
                className="shrink-0 w-11 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors border border-indigo-500 min-w-[44px] min-h-[44px]"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

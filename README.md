# OmniMarketX

**A frontend redesign and product enhancement of OmniMarketX**, a social prediction-market platform — built for the OmniMarketX Future Foundry Internship Evaluation.

**Live demo:** https://omnimarket-x.vercel.app/
**Repository:** https://github.com/AyushKumar-alt/OmnimarketX

---

## Overview

No codebase was provided for this evaluation — candidates were asked to use the live OmniMarketX product as a reference and demonstrate improvement, not reproduce the platform. This project is therefore a **focused vertical slice**, not a clone: it rebuilds the core discover → trade → track loop with a specific product thesis applied throughout, rather than attempting every page of the original.

**Product thesis:** *Make the prediction-market experience easier to understand, easier to navigate, and easier to trust — while preserving OmniMarketX's strongest differentiator, the connection between social discussion and prediction.*

The core journey the product is built around:

| Stage | User need | Where it lives |
|---|---|---|
| Discover | Find something worth predicting | Home, Markets, Trending |
| Understand | Know what the market is actually asking | Market Detail |
| Evaluate | Decide if it's worth a position | Market data + AI Market Analyst |
| Predict | Take a YES/NO position | Demo Trading |
| Track | Monitor outcomes | Portfolio |
| Discuss | Compare perspectives | Social |

---

## The Problem

A market card can show `68% YES · $485K volume · 3.2K traders` without answering the questions that actually matter: what exactly resolves this market, what source decides it, and — critically — **is that probability backed by real activity, or is it just where the market opened?**

That last question turned out to be the central design problem. A market with zero trades still displays a confident-looking 50% line, visually indistinguishable from a market with thousands of dollars in volume behind it. Left unaddressed, this misrepresents thin or empty markets as having real consensus.

This became the throughline for the whole redesign: **trust and clarity are treated as product features, not just visual polish.**

---

## My Testing vs. Reported Feedback

Two findings shaped this project, and I want to be precise about their sources:

- **My own testing:** During the first-stage evaluation, I asked the platform's AI support "Tell me about this platform." It failed to answer and defaulted to offering human support — and repeated the same failure on a follow-up. This is the one product gap I verified myself, and it's what the Support Assistant in this build directly addresses (see below).
- **Reported by other candidates, treated as hypotheses:** issues like zero-volume markets displaying misleadingly confident probabilities, inconsistent market-definition text, and unclear first-time-user onboarding. I couldn't independently verify these against the live production backend, but I judged them credible and design-relevant, so I built defensive UX patterns for them (unseeded-market flagging, clearer resolution criteria, guided empty states) rather than presenting them as bugs I personally found.

---

## What Was Built

### Discovery & Trust
Home, Markets, and Trending share one data set and one trust rule: **a market with 0 volume and 0 traders is explicitly labeled "Unseeded — starting price, not consensus,"** visually distinct from markets with real activity. Unseeded markets are also excluded from Trending's activity ranking, so an inactive market can't appear to be gaining attention it hasn't earned. Market Discovery supports category filters, search, sort (volume/traders/newest/expiring), and a "hide unseeded" toggle.

### Market Detail
The hero screen of the product. Shows the market question, YES/NO pricing, a probability history chart, volume, trader count, deadline, and — surfaced directly rather than hidden behind a click — the exact **resolution criteria and resolution source**.

### AI Market Analyst
A deterministic, market-grounded analysis panel (Snapshot, Key Factors, Bull Case, Bear Case, What Could Change the Odds, Resolution Risk) built entirely from the market's own structured data — no live API dependency, so it's fast, predictable, and never invents external information it can't back up. For unseeded markets, it explicitly explains why the 50% starting price shouldn't be read as an established view.

### Demo Trading & Portfolio
Simulated YES/NO trading with fee breakdown, share calculation, and balance validation (rejects zero, negative, non-numeric, and over-balance amounts). Positions and trade history persist locally via Zustand, so portfolio state survives navigation and refresh.

### Social
A lightweight, market-linked feed — not a full social network. Posts connect directly to the markets they discuss, preserving OmniMarketX's core loop of *discussion leading back to prediction*.

### Support Assistant
The direct fix for the gap I found in testing. A small, honestly-labeled **local/demo assistant** (deterministic keyword matching, no LLM API, no backend) that reliably answers platform questions — including the exact test case that failed in the original product: *"Tell me about this platform."* It's deliberately kept separate from the AI Market Analyst, which serves a different purpose (analyzing a specific market vs. explaining the platform). Unknown questions get an honest fallback with example prompts rather than a hallucinated answer.

### Platform Quality
Reorganized navigation grouped by intent (Discover / Participate / Your Activity / System, not a flat list); persistent dark/light theme; a lightweight Settings page (demo profile, appearance, no real auth — see Limitations); responsive layout checked at 375px, 768px, 1024px, and 1440px; and deliberate empty/error states throughout (invalid market ID, empty filter results, unseeded markets, unknown assistant questions) so no screen is a dead end.

---

## Key Product Decisions

**Trust is a feature, not a disclaimer.** Resolution criteria, resolution source, and activity-based flagging are surfaced in the main flow, not buried in a tooltip.

**50% is not always 50% consensus.** The single most important UX rule in this build: a market's starting price and a market's *earned* signal are visually and textually distinguished everywhere they appear.

**The AI explains, it doesn't perform.** Both AI-oriented features are grounded in the app's own data rather than optimized to sound impressive. Neither claims live external knowledge it doesn't have.

**Social supports discovery, it isn't a separate app.** Every market-linked post is a path back to a market.

**Every feature earns its place.** The scope was deliberately kept to the core loop rather than maximizing page count — this is a vertical slice, not a platform clone.

---

## Architecture

```
src/
├── app/              routes: home, markets, market/[id], trending, social, leaderboard, settings
├── components/        market cards, navigation, AI Analyst, Support Assistant, trading UI, social UI
├── data/               mock markets, mock social posts, support knowledge base
├── lib/                 formatting, trust logic, analyst logic
├── store/              Zustand store — demo balance, positions, trade history (persisted)
└── types/               shared TypeScript contracts
```

## Tech Stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide |
| State | Zustand + localStorage |
| Deployment | Vercel |

## Data & AI Approach

All market, social, and leaderboard data is explicit mock data — no production backend was provided, and this project doesn't pretend otherwise. Demo trading state and theme preference persist locally so the experience survives navigation and refresh.

Both AI-oriented features are **deterministic and local**, by design:
- **AI Market Analyst** — built from structured market data already in the app. No API key, no network dependency, no risk of a rate limit or outage breaking the feature during evaluation.
- **Support Assistant** — local keyword-matched responses, clearly labeled as a demo assistant rather than a live AI service. This was a deliberate choice over wiring a real LLM: a flaky third-party API failing during review would recreate the exact problem this feature exists to fix.

## Testing & Validation

```bash
npx tsc --noEmit   # 0 errors
npm run build      # production build passes
```

**Manually verified:** YES and NO trades; zero, negative, non-numeric, and over-balance trade inputs; invalid market routes (`Market not found` rather than a silent fallback); unseeded market display; Support Assistant against its core question set including the original failing case; empty states for filters and search; dark/light theme persistence; layout at 375px, 768px, 1024px, and 1440px.

## Known Limitations

This is an intentionally frontend-focused vertical slice. It does not implement: real authentication (no OAuth/session management — Settings shows a demo profile only), a production backend (no real settlement, real-time updates, or server-side storage), or live external data (both AI features are local/deterministic rather than connected to a real LLM or live market feed). These were out of scope for a frontend evaluation with no backend provided, and are the natural next steps if this moved beyond the evaluation environment — alongside real-time price/social updates, a persistent social system, and usage analytics to validate the UX decisions made here against actual behavior.

## Getting Started

```bash
git clone https://github.com/AyushKumar-alt/OmnimarketX
cd omnimarketx
npm install
npm run dev
```

Open `http://localhost:3000`.

## Screenshots

*(Add after final deployment pass: Home/Discovery, Market Detail with resolution criteria, AI Market Analyst, an unseeded market showing the trust flag, Support Assistant answering "Tell me about this platform," Portfolio, Light mode.)*

---

## Conclusion

The goal of this project was not to add the most features or recreate OmniMarketX in full — it was to answer one question well: *what does a user need to understand before they can trust a prediction enough to trade on it?* That question shaped market discovery, market detail, the AI Analyst, demo trading, and the Support Assistant alike. Where I found a real gap through my own testing (AI support failing basic questions), I built a working, honestly-labeled fix rather than a more impressive-looking but riskier one — a bias toward reliability that runs through the rest of the build as well.

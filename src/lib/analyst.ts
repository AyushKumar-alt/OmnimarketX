import { Market } from "@/types/market";
import type { AIAnalysis } from "@/store/useAIAnalyst";

function daysUntil(dateIso: string): number {
  const ms = new Date(dateIso).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function momentumLabel(history: Market["priceHistory"]): { label: string; delta: number } {
  if (!history || history.length < 2) return { label: "No momentum — single data point", delta: 0 };
  const delta = (history[history.length - 1].yesPrice - history[0].yesPrice) * 100;
  if (delta >= 7) return { label: `Up ${delta.toFixed(1)}pp since ${history[0].timestamp}`, delta };
  if (delta >= 2) return { label: `Gently up ${delta.toFixed(1)}pp`, delta };
  if (delta <= -7) return { label: `Down ${Math.abs(delta).toFixed(1)}pp since ${history[0].timestamp}`, delta };
  if (delta <= -2) return { label: `Gently down ${Math.abs(delta).toFixed(1)}pp`, delta };
  return { label: `Flat (${delta >= 0 ? "+" : ""}${delta.toFixed(1)}pp)`, delta };
}

export function generateMarketAnalysis(market: Market): AIAnalysis {
  const daysLeft = daysUntil(market.endDate);
  const mom = momentumLabel(market.priceHistory);

  const keyFactors: string[] = [];

  if (market.isUnseeded) {
    keyFactors.push("Unseeded market — 0 volume and 0 traders. 50% is the starting price, not a consensus. No meaningful trader signal yet.");
  } else {
    if (market.yesProbability >= 75) {
      keyFactors.push(`Market pricing strongly favors YES at ${market.yesProbability}% ($${market.yesPrice.toFixed(2)}). This reflects collective estimates, not certainty — 1 in 4 priced for NO.`);
    } else if (market.yesProbability >= 60) {
      keyFactors.push(`Moderate YES tilt at ${market.yesProbability}% ($${market.yesPrice.toFixed(2)}). Indicates leaning consensus, with meaningful disagreement still priced.`);
    } else if (market.yesProbability >= 45 && market.yesProbability <= 55) {
      keyFactors.push(`Near 50/50 at ${market.yesProbability}% — market is essentially undecided between YES and NO.`);
    } else if (market.yesProbability <= 25) {
      keyFactors.push(`Market pricing strongly favors NO (YES only ${market.yesProbability}% / $${market.yesPrice.toFixed(2)}). Inverse of a high YES price — same caution: pricing ≠ certainty.`);
    } else if (market.yesProbability < 45) {
      keyFactors.push(`Lean toward NO — YES at ${market.yesProbability}% ($${market.yesPrice.toFixed(2)}).`);
    } else {
      keyFactors.push(`Balanced pricing at ${market.yesProbability}% (YES $${market.yesPrice.toFixed(2)} / NO $${market.noPrice.toFixed(2)}).`);
    }

    if (market.volume < 50000 || market.traderCount < 500) {
      keyFactors.push(`Limited participation — $${market.volume.toLocaleString()} volume across ${market.traderCount.toLocaleString()} traders. Thinner books mean a single trade can move the price more.`);
    } else if (market.volume > 400000 && market.traderCount > 2000) {
      keyFactors.push(`Active participation — $${market.volume.toLocaleString()} volume, ${market.traderCount.toLocaleString()} traders. Deeper consensus than a thin market.`);
    } else {
      keyFactors.push(`Participation: $${market.volume.toLocaleString()} volume · ${market.traderCount.toLocaleString()} traders · $${market.liquidity.toLocaleString()} liquidity.`);
    }

    keyFactors.push(`Momentum: ${mom.label} over ${market.priceHistory.length} tracked points.`);
  }

  if (daysLeft === 0) keyFactors.push("Deadline is today or past — resolution is imminent; prices may be volatile on final information.");
  else if (daysLeft <= 30) keyFactors.push(`Resolves in ${daysLeft} days — short horizon. New information has less time to be absorbed before close.`);
  else if (daysLeft <= 120) keyFactors.push(`Resolves in ${daysLeft} days — medium horizon.`);
  else keyFactors.push(`Distant deadline: ${daysLeft} days remaining. More time for conditions to change before resolution.`);

  if (market.trustLevel === "verified") keyFactors.push("Verified market — source-of-truth is an official publication designated for resolution, not a signal about the creator.");
  else if (market.trustLevel === "high_activity") keyFactors.push("High-activity market — larger crowd, but crowd ≠ correctness.");
  if (market.trustNote) keyFactors.push(market.trustNote);

  let bullCase: string;
  let bearCase: string;

  if (market.isUnseeded) {
    bullCase =
      "No YES/NO signal exists yet. The bull case is simply that the first YES buyers would create the initial price discovery if they judge the resolution criteria (“" +
      market.resolutionCriteria +
      "”) to be achievable before the deadline.";
    bearCase =
      "Similarly, there is no bear signal. Without a single trade, the 50% price will persist. Sellers of YES (buyers of NO) would set the first real price if they see the criteria as unlikely or the deadline as too tight.";
  } else if (market.yesProbability >= 70) {
    bullCase = `Traders currently price YES at ${market.yesProbability}% — bulls are betting the condition (“${market.resolutionCriteria}”) will be met and that ${market.resolutionSource} will publish confirmation before ${new Date(market.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}. Momentum ${mom.delta >= 0 ? "supports" : "is despite"} this view (${mom.label}).`;
    bearCase = `Bears accept they are in the minority at ${market.yesProbability}% but see value: a YES price of $${market.yesPrice.toFixed(2)} still leaves $${market.noPrice.toFixed(2)} for NO. Any delay, stricter-than-expected interpretation of the criteria, or failure of ${market.resolutionSource} to confirm would resolve NO. Pricing is not certainty.`;
  } else if (market.yesProbability <= 30) {
    bullCase = `Contrarian YES case at just ${market.yesProbability}%: YES costs only $${market.yesPrice.toFixed(2)} (pays $1 if correct). Bulls need only believe the market underestimates the chance that ${market.resolutionSource} confirms the criteria before the deadline. Low price = high payout if right, but also reflects broad skepticism.`;
    bearCase = `Consensus leans NO at ${100 - market.yesProbability}% (NO $${market.noPrice.toFixed(2)}). Bears point to the current pricing plus ${mom.label.toLowerCase()} as evidence traders doubt the criteria will be satisfied in time.`;
  } else {
    bullCase = `YES at ${market.yesProbability}% ($${market.yesPrice.toFixed(2)}) — bulls see better-than-coin-flip odds that “${market.resolutionCriteria}” will be confirmed by ${market.resolutionSource} before ${new Date(market.endDate).toLocaleDateString()}. ${mom.delta > 1 ? "Recent upward drift (" + mom.label + ") aligns with this." : "Flat momentum suggests the market is still making up its mind."}`;
    bearCase = `NO at ${100 - market.yesProbability}% ($${market.noPrice.toFixed(2)}) — bears see a ${100 - market.yesProbability}% NO price (≈2-to-1 against YES at ${market.yesProbability}%) and argue the criteria leaves room for a NO. If the bar for proof is high or timing is tight (${daysLeft}d left), NO benefits from any ambiguity or delay.`;
  }

  const whatCouldChange = market.isUnseeded
    ? "Anything: the first trade will move this market off 50% and create the first real signal. Until then, every price level is hypothetical."
    : `Price moves with trades and information about the resolution criteria. A single large trade can shift this ${market.traderCount < 1000 ? "thin" : "moderately liquid"} book by several points. New signals specifically about “${market.resolutionCriteria}” (e.g., an official update from ${market.resolutionSource}) would be the most direct catalyst. Deadline proximity (${daysLeft}d) also matters — less time left means less time for odds to swing.`;

  const resolutionRisk = market.isUnseeded
    ? `Unseeded price is not a forecast. Even after seeding, resolution risk remains: outcome hinges on whether ${market.resolutionSource} publishes a clear confirmation that satisfies the exact criteria (“${market.resolutionCriteria}”). If the source is ambiguous or late, the market may need extended verification — but the pricing shown is still just 50%, not 50% informed confidence.`
    : `Resolution is not this price. It is the published record at ${market.resolutionSource}${market.resolutionSourceUrl ? " (" + market.resolutionSourceUrl + ")" : ""} measured against: “${market.resolutionCriteria}”. Risk includes: (1) interpretation — does a partial or soft announcement count? (2) timing — source must publish before ${new Date(market.endDate).toLocaleDateString()} 23:59 UTC, and (3) source availability — if ${market.resolutionSource} is delayed, resolution is delayed. Trader consensus does not override those words.`;

  return {
    snapshot: {
      probability: market.yesProbability,
      volume: market.volume,
      traderCount: market.traderCount,
      daysLeft,
      category: market.category,
      title: market.title,
      isUnseeded: market.isUnseeded,
    },
    keyFactors: keyFactors.slice(0, 5),
    bullCase,
    bearCase,
    whatCouldChange,
    resolutionRisk,
    references: {
      probabilitySource: market.isUnseeded ? "Starting price 50% (0 trades)" : `Market price YES $${market.yesPrice.toFixed(2)} / NO $${market.noPrice.toFixed(2)}`,
      volumeSource: `$${market.volume.toLocaleString()} total volume`,
      traderCountSource: `${market.traderCount.toLocaleString()} traders · $${market.liquidity.toLocaleString()} liquidity`,
      resolutionCriteria: market.resolutionCriteria,
      resolutionSource: market.resolutionSource,
    },
  };
}

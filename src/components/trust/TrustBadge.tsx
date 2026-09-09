import React from "react";
import { ShieldCheck, AlertTriangle, Activity, Users } from "lucide-react";
import { TrustLevel } from "@/types/market";

interface TrustBadgeProps {
  trustLevel: TrustLevel;
  isUnseeded?: boolean;
  size?: "sm" | "md";
}

const base =
  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold leading-5";

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  trustLevel,
  isUnseeded,
  size = "md",
}) => {
  const iconCls = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";

  if (isUnseeded || trustLevel === "unseeded") {
    return (
      <span
        title="0 trades — 50% is the starting price, not consensus"
        className={`${base} bg-amber-500/10 text-amber-300 border-amber-500/30`}
      >
        <AlertTriangle className={iconCls} aria-hidden="true" />
        <span>Unseeded · 0 traders</span>
      </span>
    );
  }

  switch (trustLevel) {
    case "verified":
      return (
        <span
          title="Resolution source verified"
          className={`${base} bg-blue-500/10 text-blue-300 border-blue-500/30`}
        >
          <ShieldCheck className={iconCls} aria-hidden="true" />
          <span>Verified source</span>
        </span>
      );
    case "high_activity":
      return (
        <span
          title="High volume and trader participation"
          className={`${base} bg-emerald-500/10 text-emerald-300 border-emerald-500/30`}
        >
          <Activity className={iconCls} aria-hidden="true" />
          <span>High liquidity</span>
        </span>
      );
    case "community":
    default:
      return (
        <span
          title="Community-created market"
          className={`${base} bg-purple-500/10 text-purple-300 border-purple-500/30`}
        >
          <Users className={iconCls} aria-hidden="true" />
          <span>Community</span>
        </span>
      );
  }
};

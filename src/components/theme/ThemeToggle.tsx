"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "dark" | "light";

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("omx-theme") as Theme | null;
      const initial: Theme = saved === "light" ? "light" : "dark";
      setTheme(initial);
      document.documentElement.classList.toggle("light", initial === "light");
      document.documentElement.classList.toggle("dark", initial === "dark");
    } catch {}
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("omx-theme", next);
    } catch {}
    document.documentElement.classList.toggle("light", next === "light");
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  if (!mounted) {
    return (
      <div className={`w-full h-10 rounded-xl bg-[#111827] border border-[#1F2937] animate-pulse ${className || ""}`} aria-hidden="true" />
    );
  }

  const isLight = theme === "light";

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      aria-pressed={isLight}
      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
        isLight
          ? "bg-white border-[#E2E8F0] text-slate-700 hover:bg-slate-50"
          : "bg-[#111827] border-[#1F2937] text-gray-300 hover:text-white hover:bg-white/[0.04]"
      } ${className || ""}`}
    >
      {isLight ? (
        <Sun className="w-4 h-4 text-amber-500 shrink-0" aria-hidden="true" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-300 shrink-0" aria-hidden="true" />
      )}
      <span>{isLight ? "Light" : "Dark"}</span>
      <span className="ml-auto text-[11px] font-semibold opacity-60">{isLight ? "☀" : "☾"}</span>
    </button>
  );
};

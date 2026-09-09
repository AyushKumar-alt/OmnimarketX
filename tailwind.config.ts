import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#090D16",
        foreground: "#F9FAFB",
        card: {
          DEFAULT: "#111827",
          border: "#1F2937",
          hover: "#1E293B",
        },
        brand: {
          50: "#EEF2FF",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
        },
        yes: {
          DEFAULT: "#10B981",
          hover: "#059669",
          bg: "rgba(16, 185, 129, 0.12)",
          border: "rgba(16, 185, 129, 0.3)",
        },
        no: {
          DEFAULT: "#F43F5E",
          hover: "#E11D48",
          bg: "rgba(244, 63, 94, 0.12)",
          border: "rgba(244, 63, 94, 0.3)",
        },
        trust: {
          warning: "#F59E0B",
          warningBg: "rgba(245, 158, 11, 0.12)",
          verified: "#3B82F6",
          verifiedBg: "rgba(59, 130, 246, 0.12)",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;

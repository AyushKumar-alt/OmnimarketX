import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SupportChat from "@/components/support/SupportChat";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "OmniMarketX | Social Prediction Market & Demo Trading Foundry",
  description: "Next-generation prediction market vertical slice featuring verified data trust safeguards, simulated demo trading, and social market pulse.",
};

export const viewport: Viewport = {
  themeColor: "#090D16",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('omx-theme');if(t==='light'){document.documentElement.classList.add('light');document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark');document.documentElement.classList.remove('light')}}catch(e){document.documentElement.classList.add('dark')}})();`,
          }}
        />
      </head>
      <body className="bg-[#090D16] text-gray-100 min-h-screen font-sans antialiased">
        {/* Floating OmnimarketX banner */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-3 left-1/2 -translate-x-1/2 z-[80] hidden sm:flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 text-white text-xs font-extrabold tracking-[0.18em] uppercase shadow-xl shadow-indigo-600/25 border border-white/15 animate-omx-float"
          style={{ backgroundSize: "200% 100%" }}
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          OmnimarketX
          <span className="w-2 h-2 rounded-full bg-white/60" />
        </div>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-indigo-600 focus:text-white focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>
        {children}
        <SupportChat />
      </body>
    </html>
  );
}

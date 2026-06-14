"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Command, Crosshair, BarChart2, Activity, Users } from "lucide-react";
import CommandCenter from "./components/CommandCenter";
import MissionControl from "./components/MissionControl";
import InsightsPanel from "./components/InsightsPanel";
import AudienceView from "./components/AudienceView";

type View = "command" | "mission-control" | "insights" | "audience";

export default function Home() {
  const [activeView, setActiveView] = useState<View>("command");
  const [strategyData, setStrategyData] = useState<any>(null);
  const [activeCampaignId, setActiveCampaignId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] flex flex-col font-sans">
      {/* ─── Minimal Header ──────────────────────────────────── */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-[var(--color-border)] glass-dark fixed top-0 w-full z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center shadow-[0_0_15px_rgba(94,106,210,0.5)]">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold tracking-wide text-sm opacity-90">Atlas AI STRATEGIST</span>
        </div>
        <nav className="flex gap-4">
          <button 
            onClick={() => setActiveView("command")}
            className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${activeView === "command" ? "bg-[var(--color-border-strong)]" : "hover:bg-[var(--color-border)] text-[var(--color-secondary)] hover:text-white"}`}
          >
            <Command className="w-3.5 h-3.5" /> Cmd Center
          </button>
          <button 
            onClick={() => setActiveView("insights")}
            className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${activeView === "insights" ? "bg-[var(--color-border-strong)]" : "hover:bg-[var(--color-border)] text-[var(--color-secondary)] hover:text-white"}`}
          >
            <Crosshair className="w-3.5 h-3.5" /> Intelligence
          </button>
          <button 
            onClick={() => setActiveView("audience")}
            className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${activeView === "audience" ? "bg-[var(--color-border-strong)]" : "hover:bg-[var(--color-border)] text-[var(--color-secondary)] hover:text-white"}`}
          >
            <Users className="w-3.5 h-3.5" /> Audience Data
          </button>
        </nav>
      </header>

      {/* ─── Main Content Area ───────────────────────────────── */}
      <main className="flex-1 pt-16 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            {activeView === "command" && (
              <CommandCenter 
                onStrategyGenerated={(data) => {
                  setStrategyData(data);
                  setActiveView("mission-control");
                }} 
              />
            )}
            
            {activeView === "mission-control" && strategyData && (
              <MissionControl 
                strategy={strategyData} 
                onBack={() => setActiveView("command")}
              />
            )}

            {activeView === "insights" && (
              <InsightsPanel />
            )}

            {activeView === "audience" && (
              <AudienceView />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

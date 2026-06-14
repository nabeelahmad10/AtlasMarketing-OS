import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Loader2, TrendingUp, AlertCircle, BrainCircuit } from "lucide-react";

const PLACEHOLDERS = [
  "Recover dormant VIP revenue...",
  "Increase repeat purchases this quarter...",
  "Launch a campaign for high-value customers...",
  "Identify customers likely to churn..."
];

const TICKER_MESSAGES = [
  "VIP audience grew 12% this month",
  "WhatsApp outperforming Email by 21%",
  "14 customers trending toward churn",
  "Potential recovery opportunity ₹2.4L"
];

export default function CommandCenter({ onStrategyGenerated }: { onStrategyGenerated: (data: any) => void }) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const placeholderInterval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 4000);
    
    const tickerInterval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TICKER_MESSAGES.length);
    }, 5000);
    
    return () => {
      clearInterval(placeholderInterval);
      clearInterval(tickerInterval);
    };
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/api/ai/strategy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_goal: prompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.detail) throw new Error(
        typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail)
      );
      onStrategyGenerated(data);
    } catch (err: any) {
      console.warn(err);
      setErrorMsg(err.message || "Failed to generate strategy.");
      setTimeout(() => setErrorMsg(null), 5000);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 dot-grid">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full flex flex-col gap-8 items-center"
      >
        <div className="text-center space-y-4 mb-2">
          <span className="text-xs font-bold tracking-[0.2em] text-[var(--color-primary-light)] uppercase">Atlas Marketing OS</span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white/90">
            Discover your next revenue opportunity.
          </h1>
        </div>

        <div className="w-full relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-[#C850C0] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center bg-[var(--color-card)] border border-[var(--color-border-strong)] rounded-xl p-2 shadow-2xl">
            <Sparkles className="w-6 h-6 text-[var(--color-primary-light)] ml-4 opacity-50" />
            <div className="flex-1 relative flex items-center">
              {prompt.length === 0 && (
                <div className="absolute left-4 right-4 pointer-events-none overflow-hidden h-full flex items-center text-[var(--color-secondary)]/50 text-lg">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={placeholderIndex}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                      className="block truncate"
                    >
                      {PLACEHOLDERS[placeholderIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              )}
              <input
                type="text"
                className="w-full bg-transparent border-none outline-none text-white px-4 py-4 text-lg relative z-10"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                disabled={isGenerating}
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] disabled:opacity-50 text-white p-3 rounded-lg transition-all z-20"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
          
          <AnimatePresence>
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute -bottom-14 left-0 right-0 flex justify-center"
              >
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-lg backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  {errorMsg}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {[
            "Recover dormant VIP revenue",
            "Increase repeat purchases this quarter",
            "Launch a campaign for high-value customers"
          ].map((suggestion, i) => (
            <button
              key={i}
              onClick={() => setPrompt(suggestion)}
              className="text-xs text-[var(--color-secondary)] border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)] px-4 py-2 rounded-full hover:bg-[rgba(255,255,255,0.05)] hover:text-white transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Ambient Intelligence Preview */}
        <div className="w-full mt-12 pt-12 border-t border-[rgba(255,255,255,0.05)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col space-y-2 opacity-60 hover:opacity-100 transition-opacity cursor-default">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--color-success)]" />
                <span className="text-xs font-medium text-[var(--color-secondary)] uppercase tracking-wider">Revenue Opportunities</span>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-2xl font-bold text-white">₹2.4L</span>
                <span className="text-xs text-[var(--color-secondary)] mb-1">from 12 dormant VIPs</span>
              </div>
            </div>

            <div className="flex flex-col space-y-2 opacity-60 hover:opacity-100 transition-opacity cursor-default">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[var(--color-warning)]" />
                <span className="text-xs font-medium text-[var(--color-secondary)] uppercase tracking-wider">Customers At Risk</span>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-2xl font-bold text-white">14</span>
                <span className="text-xs text-[var(--color-secondary)] mb-1">trending toward churn</span>
              </div>
            </div>

            <div className="flex flex-col space-y-2 opacity-60 hover:opacity-100 transition-opacity cursor-default">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-[var(--color-primary-light)]" />
                <span className="text-xs font-medium text-[var(--color-secondary)] uppercase tracking-wider">Campaign Learnings</span>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-2xl font-bold text-white">27</span>
                <span className="text-xs text-[var(--color-secondary)] mb-1">SMS outperforming Email by 21%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Insights Ticker */}
        <div className="w-full flex justify-center mt-6 overflow-hidden h-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={tickerIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-xs text-[var(--color-secondary)] flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse"></div>
              {TICKER_MESSAGES[tickerIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

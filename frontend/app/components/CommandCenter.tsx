import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

export default function CommandCenter({ onStrategyGenerated }: { onStrategyGenerated: (data: any) => void }) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch("http://localhost:8000/api/ai/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_goal: prompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onStrategyGenerated(data);
    } catch (err) {
      console.error(err);
      alert("Failed to generate strategy. See console.");
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
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white/90">
            Good Morning.
          </h1>
          <p className="text-xl text-[var(--color-secondary)]">
            What marketing outcome would you like to achieve today?
          </p>
        </div>

        <div className="w-full relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-[#C850C0] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center bg-[var(--color-card)] border border-[var(--color-border-strong)] rounded-xl p-2 shadow-2xl">
            <Sparkles className="w-6 h-6 text-[var(--color-primary-light)] ml-4 opacity-50" />
            <input
              type="text"
              className="flex-1 bg-transparent border-none outline-none text-white px-4 py-4 text-lg placeholder-[var(--color-secondary)]"
              placeholder="e.g. Bring back inactive premium customers"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              disabled={isGenerating}
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] disabled:opacity-50 text-white p-3 rounded-lg transition-all"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {[
            "Bring back inactive premium customers",
            "Increase repeat purchases this month",
            "Promote our new winter collection",
            "Reward our most loyal customers"
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
      </motion.div>
    </div>
  );
}

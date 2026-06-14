import { motion } from "framer-motion";
import { Users, Target, Zap, Activity, MessageSquare, ArrowRight, Play, ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function StrategyPanel({ strategy, onLaunch, onBack }: any) {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunch = async () => {
    setIsLaunching(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/api/campaigns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: strategy.business_objective,
          segment_id: strategy.segment_id,
          message_template: strategy.campaign_concept,
          channel: strategy.recommended_channel.toLowerCase(),
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onLaunch(data.campaign_id);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to launch campaign.");
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div className="flex-1 flex justify-center p-6 lg:p-12 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl flex flex-col gap-8"
      >
        <button onClick={onBack} className="flex items-center gap-2 text-[var(--color-secondary)] hover:text-white self-start transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Prompt
        </button>

        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">AI Strategy Generated</h2>
            <p className="text-[var(--color-secondary)]">{strategy.business_objective}</p>
          </div>
          <button 
            onClick={handleLaunch}
            disabled={isLaunching || strategy.estimated_reach === 0}
            className="ai-gradient text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-[var(--color-primary)]/20 hover:shadow-[var(--color-primary)]/40 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isLaunching ? "Launching..." : <><Play className="w-4 h-4" /> Execute Campaign</>}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Audience & Channel */}
          <div className="space-y-6 lg:col-span-1">
            <div className="card p-6 glass-dark">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[rgba(255,255,255,0.05)] rounded-lg"><Users className="w-5 h-5 text-[var(--color-info)]" /></div>
                <h3 className="font-semibold text-white">Target Audience</h3>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{strategy.estimated_reach.toLocaleString()}</p>
              <p className="text-sm text-[var(--color-secondary)] leading-relaxed">{strategy.target_audience}</p>
            </div>

            <div className="card p-6 glass-dark">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[rgba(255,255,255,0.05)] rounded-lg"><MessageSquare className="w-5 h-5 text-[var(--color-warning)]" /></div>
                <h3 className="font-semibold text-white">Channel Strategy</h3>
              </div>
              <p className="text-xl font-bold text-white mb-2 capitalize">{strategy.recommended_channel}</p>
              <p className="text-sm text-[var(--color-secondary)] leading-relaxed">{strategy.channel_reasoning}</p>
            </div>
          </div>

          {/* Middle Column: Campaign Concept */}
          <div className="card p-6 glass-dark lg:col-span-1 border border-[var(--color-primary)]/30 ai-gradient-border relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[var(--color-primary)]/20 rounded-lg"><Zap className="w-5 h-5 text-[var(--color-primary-light)]" /></div>
              <h3 className="font-semibold text-white">Campaign Concept</h3>
            </div>
            <div className="bg-[rgba(0,0,0,0.2)] p-4 rounded-xl border border-[rgba(255,255,255,0.05)]">
              <p className="text-white/90 text-sm whitespace-pre-wrap">{strategy.campaign_concept}</p>
            </div>
          </div>

          {/* Right Column: AI Predictions */}
          <div className="card p-6 glass-dark lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[rgba(255,255,255,0.05)] rounded-lg"><Activity className="w-5 h-5 text-[var(--color-success)]" /></div>
              <h3 className="font-semibold text-white">Predicted Outcomes</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[var(--color-secondary)]">Open Rate</span>
                  <span className="text-white font-medium">{(strategy.predicted_open_rate * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-info)]" style={{ width: `${strategy.predicted_open_rate * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[var(--color-secondary)]">Click-Through Rate</span>
                  <span className="text-white font-medium">{(strategy.predicted_ctr * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-success)] shadow-[0_0_10px_var(--color-success)]" style={{ width: `${strategy.predicted_ctr * 100}%` }}></div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-[rgba(255,255,255,0.05)] relative group cursor-help">
                <span className="text-[var(--color-secondary)] text-sm block mb-1">Predicted Revenue Impact</span>
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
                  ₹{strategy.predicted_revenue.toLocaleString()}
                </span>
                
                {/* Deterministic Explanation Tooltip */}
                <div className="absolute top-full mt-2 right-0 w-64 bg-[#111] border border-[rgba(255,255,255,0.1)] p-3 rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                  <p className="text-xs text-white font-medium mb-1 flex items-center gap-1"><Zap className="w-3 h-3 text-[var(--color-primary-light)]"/> Deterministic Model</p>
                  <p className="text-[10px] text-[var(--color-secondary)] leading-relaxed">
                    Revenue calculated mathematically via base rate formulas rather than LLM hallucination: <br/>
                    <code className="bg-[#222] px-1 py-0.5 rounded mt-1 inline-block">({(strategy.predicted_ctr * 100).toFixed(1)}% CTR) × {strategy.estimated_reach} × 5% Conv. × Avg Spend</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

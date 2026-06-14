import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Target, Zap, Activity, MessageSquare, ArrowRight, Play, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import EventFunnel from "./EventFunnel";

export default function MissionControl({ strategy, onBack }: any) {
  const [isLaunching, setIsLaunching] = useState(false);
  const [activeCampaignId, setActiveCampaignId] = useState<number | null>(null);

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
      setActiveCampaignId(data.campaign_id);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to launch campaign.");
    } finally {
      setIsLaunching(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="flex-1 flex justify-center p-6 lg:p-12 overflow-y-auto">
      <div className="w-full max-w-4xl flex flex-col gap-12 pb-24 relative">
        
        {/* Connection Line Background */}
        <div className="absolute left-8 top-16 bottom-0 w-px bg-gradient-to-b from-[var(--color-border)] via-[var(--color-primary)] to-transparent opacity-20 -z-10"></div>

        {/* Header / Back */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <button onClick={onBack} className="flex items-center gap-2 text-[var(--color-secondary)] hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Command Center
          </button>
        </motion.div>

        {/* SECTION 1: GOAL */}
        <motion.section initial="hidden" animate="visible" variants={fadeUp} className="relative">
          <div className="absolute -left-[35px] top-4 w-3 h-3 rounded-full bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]"></div>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-[var(--color-secondary)] uppercase mb-2 block">Objective Generated</span>
              <h2 className="text-3xl font-bold text-white mb-2 leading-tight">{strategy.business_objective}</h2>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-[var(--color-secondary)] mb-1">AI Confidence</span>
              <span className="text-2xl font-bold text-[var(--color-success)]">{strategy.confidence_score}%</span>
            </div>
          </div>
        </motion.section>

        {/* SECTION 2: AUDIENCE & STRATEGY (Side by Side) */}
        <motion.section initial="hidden" animate="visible" variants={fadeUp} className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="absolute -left-[35px] top-8 w-3 h-3 rounded-full bg-[var(--color-info)] shadow-[0_0_10px_var(--color-info)]"></div>
          
          <div className="card p-6 glass-dark hover:border-[var(--color-info)]/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[var(--color-info)]/10 rounded-lg"><Users className="w-4 h-4 text-[var(--color-info)]" /></div>
              <h3 className="font-semibold text-white">Audience Intelligence</h3>
            </div>
            <div className="flex items-end justify-between mb-4">
              <div>
                <span className="text-3xl font-bold text-white block">{strategy.estimated_reach.toLocaleString()}</span>
                <span className="text-xs text-[var(--color-secondary)]">Targeted Users</span>
              </div>
            </div>
            <div className="bg-[rgba(0,0,0,0.3)] p-3 rounded-lg border border-[rgba(255,255,255,0.02)]">
              <span className="text-xs text-[var(--color-secondary)] block mb-1">AI Reasoning</span>
              <p className="text-sm text-white/80">{strategy.target_audience}</p>
            </div>
          </div>

          <div className="card p-6 glass-dark hover:border-[var(--color-warning)]/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[var(--color-warning)]/10 rounded-lg"><MessageSquare className="w-4 h-4 text-[var(--color-warning)]" /></div>
              <h3 className="font-semibold text-white">Channel Strategy</h3>
            </div>
            <div className="mb-4">
              <span className="text-2xl font-bold text-white capitalize">{strategy.recommended_channel}</span>
            </div>
            <div className="bg-[rgba(0,0,0,0.3)] p-3 rounded-lg border border-[rgba(255,255,255,0.02)]">
              <span className="text-xs text-[var(--color-secondary)] block mb-1">Why this channel?</span>
              <p className="text-sm text-white/80">{strategy.channel_reasoning}</p>
            </div>
          </div>
        </motion.section>

        {/* SECTION 3: CONCEPT */}
        <motion.section initial="hidden" animate="visible" variants={fadeUp} className="relative">
          <div className="card p-6 glass border border-[var(--color-primary)]/20">
             <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg"><Target className="w-4 h-4 text-[var(--color-primary)]" /></div>
              <h3 className="font-semibold text-white">Campaign Concept & Copy</h3>
            </div>
            <p className="text-white/90 text-sm whitespace-pre-wrap">{strategy.campaign_concept}</p>
          </div>
        </motion.section>

        {/* SECTION 4: PREDICTION ENGINE */}
        <motion.section initial="hidden" animate="visible" variants={fadeUp} className="relative">
          <div className="absolute -left-[35px] top-6 w-3 h-3 rounded-full bg-[var(--color-success)] shadow-[0_0_10px_var(--color-success)]"></div>
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Activity className="w-4 h-4"/> Deterministic Predictions</h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-4 glass-dark text-center">
              <span className="text-xs text-[var(--color-secondary)] block mb-1">Reach</span>
              <span className="text-xl font-bold text-white">{strategy.estimated_reach}</span>
            </div>
            <div className="card p-4 glass-dark text-center">
              <span className="text-xs text-[var(--color-secondary)] block mb-1">Open Rate</span>
              <span className="text-xl font-bold text-[var(--color-info)]">{(strategy.predicted_open_rate * 100).toFixed(1)}%</span>
            </div>
            <div className="card p-4 glass-dark text-center">
              <span className="text-xs text-[var(--color-secondary)] block mb-1">CTR</span>
              <span className="text-xl font-bold text-[var(--color-primary-light)]">{(strategy.predicted_ctr * 100).toFixed(1)}%</span>
            </div>
            <div className="card p-4 glass-dark text-center relative group cursor-help ai-gradient-border">
              <span className="text-xs text-[var(--color-secondary)] block mb-1">Revenue</span>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
                ₹{strategy.predicted_revenue.toLocaleString()}
              </span>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-[#111] p-2 rounded text-xs text-left opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 border border-[rgba(255,255,255,0.1)]">
                Math Formula: <br/><code>Base Rate × Multiplier × Reach</code>
              </div>
            </div>
          </div>
        </motion.section>

        {/* SECTION 5: EXECUTION LAUNCH */}
        {!activeCampaignId ? (
          <motion.section initial="hidden" animate="visible" variants={fadeUp} className="relative flex justify-center mt-8">
            <button 
              onClick={handleLaunch}
              disabled={isLaunching || strategy.estimated_reach === 0}
              className="ai-gradient text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 shadow-lg shadow-[var(--color-primary)]/20 hover:shadow-[var(--color-primary)]/40 transition-all hover:-translate-y-1 disabled:opacity-50"
            >
              {isLaunching ? "Initiating Launch Sequence..." : <><Play className="w-5 h-5" /> Execute Campaign</>}
            </button>
          </motion.section>
        ) : (
          <motion.section initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="relative mt-8 pt-8 border-t border-[rgba(255,255,255,0.05)]">
            <div className="absolute -left-[35px] top-12 w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] animate-pulse"></div>
            <h3 className="font-semibold text-white mb-6 flex items-center gap-2 text-xl">Live Execution Timeline</h3>
            <div className="card p-6 glass border border-[rgba(255,255,255,0.1)] shadow-2xl">
              <EventFunnel campaignId={activeCampaignId} />
            </div>
            
            {/* Pseudo-Learnings appearing after launch */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }} className="mt-12">
              <div className="absolute -left-[35px] top-[480px] w-3 h-3 rounded-full bg-[var(--color-primary-light)]"></div>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Post-Mortem & Learnings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="card p-4 glass-dark">
                  <span className="text-xs text-[var(--color-success)] mb-2 block">What Worked</span>
                  <p className="text-sm text-white/80">Personalized urgency copy outperformed standard discounts by 14%.</p>
                </div>
                <div className="card p-4 glass-dark">
                  <span className="text-xs text-[var(--color-primary-light)] mb-2 block">Next Recommended Action</span>
                  <p className="text-sm text-white/80">Follow up un-opened users on WhatsApp in 48 hours.</p>
                </div>
              </div>
            </motion.div>
          </motion.section>
        )}

      </div>
    </div>
  );
}

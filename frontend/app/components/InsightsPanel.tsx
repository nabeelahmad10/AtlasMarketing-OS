import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crosshair, BrainCircuit, CheckCircle, TrendingUp, AlertCircle, ArrowLeft, Loader2, ChevronDown, ChevronUp, Zap } from "lucide-react";

export default function InsightsPanel() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API_URL}/api/campaigns`);
        const data = await res.json();
        
        // Auto-analyze campaigns that don't have analysis yet
        const enriched = await Promise.all(data.campaigns.map(async (camp: any) => {
          if (!camp.post_analysis_json) {
            try {
              const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
              const analysisRes = await fetch(`${API_URL}/api/ai/analyze`, {
                 method: "POST",
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({ campaign_id: camp.id }),
               });
               const analysisData = await analysisRes.json();
               return { ...camp, post_analysis_json: JSON.stringify(analysisData) };
            } catch (e) {
              return camp;
            }
          }
          return camp;
        }));
        setCampaigns(enriched);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <div className="flex-1 p-6 lg:p-12 flex justify-center overflow-y-auto">
      <div className="w-full max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-[rgba(255,255,255,0.05)] rounded-lg"><BrainCircuit className="w-6 h-6 text-[var(--color-primary-light)]" /></div>
          <div>
            <h2 className="text-2xl font-bold text-white">Campaign Intelligence</h2>
            <p className="text-[var(--color-secondary)]">AI-generated post-mortems and revenue impact analysis.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {campaigns.map(camp => {
            const analysis = camp.post_analysis_json ? JSON.parse(camp.post_analysis_json) : null;
            const isExpanded = expandedId === camp.id;
            
            // Calculate mock actuals based on DB stats just for the UI demo comparison
            const predictedRev = 24000;
            const actualRev = predictedRev * 1.14; // Mock 14% outperformance
            
            return (
              <motion.div 
                layout
                key={camp.id} 
                className={`card glass-dark overflow-hidden transition-all ${isExpanded ? 'border-[var(--color-primary-light)]/40 shadow-[0_0_20px_rgba(94,106,210,0.15)]' : 'hover:border-[var(--color-border-strong)]'}`}
              >
                {/* Card Header (Always Visible) */}
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : camp.id)}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{camp.name}</h3>
                      <p className="text-sm text-[var(--color-secondary)]">
                        {new Date(camp.created_at).toLocaleDateString()} • {camp.channel.toUpperCase()} • {camp.total_sent} Users
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs text-[var(--color-secondary)] block">Revenue Impact</span>
                        <span className="text-lg font-bold text-[var(--color-success)]">₹{actualRev.toLocaleString()}</span>
                      </div>
                      <div className="w-10 h-10 rounded-full border-2 border-[var(--color-primary)] flex items-center justify-center bg-[var(--color-primary)]/10 text-[var(--color-primary-light)] font-bold text-xs shadow-[0_0_10px_var(--color-primary)]">
                        94
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Insights */}
                  <div className="bg-[#111] rounded-lg p-4 border border-[rgba(255,255,255,0.02)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-[var(--color-warning)] shrink-0" />
                      <span className="text-sm font-medium text-white/90">
                        {analysis && analysis.key_learnings && analysis.key_learnings.length > 0 ? analysis.key_learnings[0] : "Analyzing campaign data..."}
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-[var(--color-secondary)]" /> : <ChevronDown className="w-4 h-4 text-[var(--color-secondary)]" />}
                  </div>
                </div>

                {/* Expanded State: Prediction vs Actual */}
                <AnimatePresence>
                  {isExpanded && analysis && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.2)]"
                    >
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Prediction Comparison */}
                        <div>
                          <h4 className="text-xs font-bold tracking-wider text-[var(--color-secondary)] uppercase mb-4 block">Prediction vs Actual</h4>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-[var(--color-secondary)]">Revenue (Predicted)</span>
                                <span className="text-[var(--color-secondary)]">₹{predictedRev.toLocaleString()}</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#222] rounded-full overflow-hidden">
                                <div className="h-full bg-[var(--color-secondary)] opacity-50" style={{ width: `70%` }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-white font-medium">Revenue (Actual)</span>
                                <span className="text-[var(--color-success)] font-medium">₹{actualRev.toLocaleString()} (+14%)</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#222] rounded-full overflow-hidden">
                                <div className="h-full bg-[var(--color-success)] shadow-[0_0_8px_var(--color-success)]" style={{ width: `85%` }}></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Detailed AI Analysis */}
                        <div>
                          <h4 className="text-xs font-bold tracking-wider text-[var(--color-secondary)] uppercase mb-4 block">AI Narrative</h4>
                          <div className="space-y-3">
                            <p className="text-sm text-white/80 leading-relaxed"><strong className="text-white">Engagement:</strong> {analysis.open_rate_analysis}</p>
                            {analysis.key_learnings && analysis.key_learnings.length > 1 && (
                              <p className="text-sm text-white/80 leading-relaxed"><strong className="text-[var(--color-primary-light)]">Next Action:</strong> {analysis.key_learnings[1]}</p>
                            )}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
          
          {campaigns.length === 0 && (
            <p className="text-[var(--color-secondary)] text-center py-12">No campaigns found. Run a strategy first.</p>
          )}
        </div>
      </div>
    </div>
  );
}

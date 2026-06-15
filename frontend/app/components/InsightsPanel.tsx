import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crosshair, BrainCircuit, CheckCircle, TrendingUp, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

export default function InsightsPanel() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/campaigns");
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCampaigns();
  }, []);

  const handleAnalyze = async (campaign: any) => {
    setSelectedCampaign(campaign);
    if (campaign.post_analysis_json) {
      setAnalysis(JSON.parse(campaign.post_analysis_json));
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const res = await fetch("http://localhost:8000/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_id: campaign.id }),
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze campaign.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 p-6 lg:p-12 flex justify-center">
      <div className="w-full max-w-5xl">
        <AnimatePresence mode="wait">
          {!selectedCampaign ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-[rgba(255,255,255,0.05)] rounded-lg"><Crosshair className="w-6 h-6 text-[var(--color-primary-light)]" /></div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Campaign Intelligence</h2>
                  <p className="text-[var(--color-secondary)]">Select a past campaign to generate an AI post-mortem</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaigns.map(camp => (
                  <div 
                    key={camp.id} 
                    onClick={() => handleAnalyze(camp)}
                    className="card p-5 glass-dark cursor-pointer card-interactive flex justify-between items-center group"
                  >
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-[var(--color-primary-light)] transition-colors">{camp.name}</h3>
                      <p className="text-sm text-[var(--color-secondary)] mt-1">
                        {camp.total_sent} sent • {camp.channel} • {new Date(camp.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {camp.post_analysis_json ? (
                      <span className="text-xs font-medium px-2 py-1 bg-[rgba(16,185,129,0.1)] text-[var(--color-success)] rounded-md">Analyzed</span>
                    ) : (
                      <span className="text-xs font-medium px-2 py-1 bg-[rgba(255,255,255,0.05)] text-[var(--color-secondary)] rounded-md group-hover:bg-[var(--color-primary)]/20 group-hover:text-[var(--color-primary-light)] transition-colors">Analyze</span>
                    )}
                  </div>
                ))}
                {campaigns.length === 0 && (
                  <p className="text-[var(--color-secondary)] col-span-2 text-center py-12">No campaigns found. Run a strategy first.</p>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <button 
                onClick={() => setSelectedCampaign(null)} 
                className="flex items-center gap-2 text-[var(--color-secondary)] hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Campaigns
              </button>

              <div className="border-b border-[rgba(255,255,255,0.1)] pb-6">
                <h2 className="text-3xl font-bold text-white mb-2">{selectedCampaign.name}</h2>
                <p className="text-[var(--color-secondary)]">AI Post-Mortem Analysis</p>
              </div>

              {isAnalyzing ? (
                <div className="py-24 flex flex-col items-center justify-center space-y-4">
                  <BrainCircuit className="w-12 h-12 text-[var(--color-primary-light)] animate-pulse" />
                  <p className="text-[var(--color-secondary)]">AI is analyzing {selectedCampaign.total_sent} event logs...</p>
                </div>
              ) : analysis ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="card p-6 glass-dark space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-[var(--color-info)]" />
                      <h3 className="font-semibold text-white">Engagement Impact</h3>
                    </div>
                    <p className="text-sm text-[var(--color-secondary)] leading-relaxed">{analysis.open_rate_analysis}</p>
                    <p className="text-sm text-[var(--color-secondary)] leading-relaxed">{analysis.ctr_analysis}</p>
                  </div>

                  <div className="card p-6 glass-dark space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
                      <h3 className="font-semibold text-white">Revenue Impact</h3>
                    </div>
                    <p className="text-sm text-[var(--color-secondary)] leading-relaxed">{analysis.revenue_impact_analysis}</p>
                  </div>

                  <div className="card p-6 glass-dark border border-[var(--color-warning)]/30 space-y-4 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-5">
                      <BrainCircuit className="w-32 h-32" />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="w-5 h-5 text-[var(--color-warning)]" />
                      <h3 className="font-semibold text-white">Key Learnings</h3>
                    </div>
                    <ul className="space-y-3">
                      {(analysis.key_learnings || []).map((learning: str, i: number) => (
                        <li key={i} className="flex gap-3 text-sm text-[var(--color-secondary)]">
                          <span className="text-[var(--color-warning)] mt-0.5">•</span>
                          <span>{learning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

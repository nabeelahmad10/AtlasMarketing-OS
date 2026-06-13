import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Clock, Send, CheckCircle, MailOpen, MousePointerClick } from "lucide-react";

export default function EventFunnel({ campaignId }: { campaignId: number }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API_URL}/api/campaigns/${campaignId}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 1500);
    return () => clearInterval(interval);
  }, [campaignId]);

  if (!data) return <div className="p-12 text-center text-[var(--color-secondary)]">Loading monitor...</div>;

  const total = data.total_sent || 1; // Prevent div by 0
  
  // Custom status breakdown calculation since we changed the state machine
  const breakdown = data.status_breakdown || {};
  const queued = breakdown["queued"] || 0;
  const sent = breakdown["sent"] || 0;
  const delivered = breakdown["delivered"] || 0;
  const opened = breakdown["opened"] || 0;
  const clicked = breakdown["clicked"] || 0;
  const failed = breakdown["failed"] || 0;

  // Waterfall amounts (each stage includes the stages after it for visual funnel logic)
  const funnelQueued = total;
  const funnelSent = sent + delivered + opened + clicked;
  const funnelDelivered = delivered + opened + clicked;
  const funnelOpened = opened + clicked;
  const funnelClicked = clicked;

  const stages = [
    { label: "Queued", count: funnelQueued, icon: Clock, color: "text-gray-400", bg: "bg-gray-400" },
    { label: "Dispatched", count: funnelSent, icon: Send, color: "text-blue-400", bg: "bg-blue-400" },
    { label: "Delivered", count: funnelDelivered, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400" },
    { label: "Opened", count: funnelOpened, icon: MailOpen, color: "text-amber-400", bg: "bg-amber-400" },
    { label: "Clicked", count: funnelClicked, icon: MousePointerClick, color: "text-purple-400", bg: "bg-purple-400" },
  ];

  return (
    <div className="flex-1 p-6 lg:p-12 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(16,185,129,0.1)] text-[var(--color-success)] text-sm font-medium mb-4">
            <Activity className="w-4 h-4 animate-pulse" /> Live Monitoring
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{data.name}</h2>
          <p className="text-[var(--color-secondary)]">Tracking real-time events across the delivery network</p>
        </div>

        <div className="grid gap-4 mt-8">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const percentage = (stage.count / total) * 100;
            return (
              <motion.div 
                key={stage.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card p-5 glass-dark flex items-center gap-6"
              >
                <div className={`p-3 rounded-xl bg-[rgba(255,255,255,0.05)] ${stage.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <h3 className="font-semibold text-white">{stage.label}</h3>
                      <p className="text-sm text-[var(--color-secondary)]">{stage.count} events</p>
                    </div>
                    <span className="text-lg font-bold text-white">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 w-full bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${stage.bg}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ type: "spring", stiffness: 50 }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {failed > 0 && (
          <div className="mt-4 p-4 border border-red-500/30 bg-red-500/10 rounded-xl text-red-400 text-center text-sm">
            Warning: {failed} communications failed to deliver.
          </div>
        )}
      </div>
    </div>
  );
}

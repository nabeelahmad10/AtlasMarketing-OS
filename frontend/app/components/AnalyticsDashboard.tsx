"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Send,
  CheckCircle2,
  Eye,
  MousePointerClick,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  ChevronDown,
  Zap,
} from "lucide-react";
import { getAnalytics, getCampaigns, type AnalyticsResponse, type Campaign } from "../lib/api";

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Auto-refresh every 5 seconds to show live callback updates
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin mx-auto mb-4" />
          <p className="text-sm text-[#999]">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-[#999]">No analytics data available. Launch a campaign first.</p>
      </div>
    );
  }

  const { overview, campaigns, engagement, recent_activity } = analytics;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#111] mb-2">Analytics</h1>
          <p className="text-[#666]">Campaign performance & delivery insights</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              autoRefresh
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-[#F5F5F7] text-[#999]"
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${autoRefresh ? "animate-pulse" : ""}`} />
            {autoRefresh ? "Live" : "Paused"}
          </button>
          <motion.button
            onClick={fetchAnalytics}
            className="p-2.5 bg-[#F5F5F7] rounded-xl hover:bg-[#EEEEF0] transition-colors"
            whileTap={{ rotate: 180 }}
          >
            <RefreshCw className="w-4 h-4 text-[#666]" />
          </motion.button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <MetricCard icon={Send} label="Total Sent" value={overview.total_sent} color="#4F46E5" />
        <MetricCard icon={CheckCircle2} label="Delivered" value={overview.total_delivered} color="#10B981" />
        <MetricCard icon={Eye} label="Opened" value={overview.total_opened} color="#3B82F6" />
        <MetricCard icon={MousePointerClick} label="Clicked" value={overview.total_clicked} color="#8B5CF6" />
        <MetricCard icon={AlertTriangle} label="Failed" value={overview.total_failed} color="#EF4444" />
        <MetricCard icon={BarChart3} label="Campaigns" value={overview.total_campaigns} color="#F59E0B" />
      </div>

      {/* Rate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <RateCard
          label="Delivery Rate"
          rate={overview.delivery_rate}
          benchmark={90}
          color="#10B981"
          description="% of messages successfully delivered"
        />
        <RateCard
          label="Open Rate"
          rate={overview.open_rate}
          benchmark={40}
          color="#3B82F6"
          description="% of delivered messages opened"
        />
        <RateCard
          label="Click Rate"
          rate={overview.click_rate}
          benchmark={15}
          color="#8B5CF6"
          description="% of opened messages clicked"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Performance Table */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-[rgba(0,0,0,0.06)]">
              <h3 className="text-sm font-semibold text-[#111] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#4F46E5]" />
                Campaign Performance
              </h3>
            </div>

            {campaigns.length === 0 ? (
              <div className="p-8 text-center">
                <Zap className="w-8 h-8 text-[#ddd] mx-auto mb-3" />
                <p className="text-sm text-[#999]">No campaigns yet. Create one using the AI Campaign Builder.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[rgba(0,0,0,0.04)]">
                      <th className="text-left py-3 px-5 text-[10px] font-semibold text-[#999] uppercase tracking-wider">Campaign</th>
                      <th className="text-center py-3 px-3 text-[10px] font-semibold text-[#999] uppercase tracking-wider">Sent</th>
                      <th className="text-center py-3 px-3 text-[10px] font-semibold text-[#999] uppercase tracking-wider">Deliv.</th>
                      <th className="text-center py-3 px-3 text-[10px] font-semibold text-[#999] uppercase tracking-wider">Opened</th>
                      <th className="text-center py-3 px-3 text-[10px] font-semibold text-[#999] uppercase tracking-wider">Clicked</th>
                      <th className="text-center py-3 px-3 text-[10px] font-semibold text-[#999] uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign, i) => (
                      <motion.tr
                        key={campaign.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-[rgba(0,0,0,0.04)] hover:bg-[rgba(79,70,229,0.02)]"
                      >
                        <td className="py-3.5 px-5">
                          <div>
                            <p className="text-sm font-semibold text-[#111]">{campaign.name}</p>
                            <p className="text-[10px] text-[#999]">{campaign.channel} | {campaign.segment_name || `Segment #${campaign.segment_id}`}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center text-sm font-medium text-[#111]">{campaign.total_sent}</td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="text-sm font-medium text-green-600">{campaign.total_delivered}</span>
                          <span className="text-[10px] text-[#999] block">{campaign.delivery_rate}%</span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="text-sm font-medium text-blue-600">{campaign.total_opened}</span>
                          <span className="text-[10px] text-[#999] block">{campaign.open_rate}%</span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="text-sm font-medium text-purple-600">{campaign.total_clicked}</span>
                          <span className="text-[10px] text-[#999] block">{campaign.click_rate}%</span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <StatusBadge status={campaign.status} />
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Delivery Funnel Visualization */}
          {campaigns.length > 0 && (
            <div className="card p-5 mt-4">
              <h3 className="text-sm font-semibold text-[#111] mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#4F46E5]" />
                Aggregate Delivery Funnel
              </h3>
              <FunnelChart
                sent={overview.total_sent}
                delivered={overview.total_delivered}
                opened={overview.total_opened}
                clicked={overview.total_clicked}
                failed={overview.total_failed}
              />
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Engagement Summary */}
          <div className="card p-5">
            <h4 className="text-sm font-semibold text-[#111] mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#4F46E5]" />
              Engagement Summary
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#999]">Customers Reached</span>
                <span className="text-sm font-semibold text-[#111]">{engagement.customers_reached || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#999]">Total Messages</span>
                <span className="text-sm font-semibold text-[#111]">{engagement.total_communications || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#999]">Active Campaigns</span>
                <span className="text-sm font-semibold text-[#111]">
                  {campaigns.filter((c) => c.status === "sending").length}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="card p-5">
            <h4 className="text-sm font-semibold text-[#111] mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#4F46E5]" />
              Recent Activity
            </h4>
            {recent_activity.length === 0 ? (
              <p className="text-xs text-[#999] text-center py-4">No activity yet</p>
            ) : (
              <div className="space-y-3">
                {recent_activity.slice(0, 8).map((activity, i) => (
                  <motion.div
                    key={`${activity.id}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <StatusDot status={activity.status} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[#111] truncate">
                        <span className="font-medium">{activity.customer_name}</span>
                      </p>
                      <p className="text-[10px] text-[#999]">
                        {activity.status} | {activity.campaign_name}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub Components ───────────────────────────────────────────

function MetricCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4"
    >
      <Icon className="w-5 h-5 mb-2" style={{ color }} />
      <p className="text-2xl font-bold text-[#111]">{value}</p>
      <p className="text-[10px] text-[#999] mt-0.5">{label}</p>
    </motion.div>
  );
}

function RateCard({ label, rate, benchmark, color, description }: { label: string; rate: number; benchmark: number; color: string; description: string }) {
  const isGood = rate >= benchmark;
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-[#111]">{label}</p>
        <div className={`flex items-center gap-1 text-xs font-medium ${isGood ? "text-green-600" : "text-orange-600"}`}>
          {isGood ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {isGood ? "Good" : "Below avg"}
        </div>
      </div>
      <p className="text-3xl font-bold mb-1" style={{ color }}>{rate}%</p>
      <p className="text-[10px] text-[#999]">{description}</p>
      {/* Progress Bar */}
      <div className="mt-3 h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(rate, 100)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function FunnelChart({ sent, delivered, opened, clicked, failed }: { sent: number; delivered: number; opened: number; clicked: number; failed: number }) {
  const stages = [
    { label: "Sent", value: sent, color: "#6B7280", percent: 100 },
    { label: "Delivered", value: delivered, color: "#10B981", percent: sent > 0 ? (delivered / sent) * 100 : 0 },
    { label: "Opened", value: opened, color: "#3B82F6", percent: sent > 0 ? (opened / sent) * 100 : 0 },
    { label: "Clicked", value: clicked, color: "#8B5CF6", percent: sent > 0 ? (clicked / sent) * 100 : 0 },
  ];

  return (
    <div className="space-y-3">
      {stages.map((stage, i) => (
        <div key={stage.label} className="flex items-center gap-4">
          <span className="text-xs text-[#999] w-16 text-right">{stage.label}</span>
          <div className="flex-1 h-8 bg-[#F5F5F7] rounded-lg overflow-hidden relative">
            <motion.div
              className="h-full rounded-lg flex items-center justify-end pr-3"
              style={{ background: stage.color }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(stage.percent, 2)}%` }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
            >
              {stage.percent > 15 && (
                <span className="text-[10px] font-semibold text-white">
                  {stage.value}
                </span>
              )}
            </motion.div>
            {stage.percent <= 15 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#666]">
                {stage.value}
              </span>
            )}
          </div>
          <span className="text-xs font-medium text-[#111] w-12">{stage.percent.toFixed(0)}%</span>
        </div>
      ))}
      {failed > 0 && (
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#999] w-16 text-right">Failed</span>
          <div className="flex-1 h-8 bg-[#F5F5F7] rounded-lg overflow-hidden">
            <motion.div
              className="h-full rounded-lg bg-red-500 flex items-center justify-end pr-3"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max((failed / sent) * 100, 2)}%` }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              {(failed / sent) * 100 > 15 && (
                <span className="text-[10px] font-semibold text-white">{failed}</span>
              )}
            </motion.div>
          </div>
          <span className="text-xs font-medium text-red-600 w-12">{((failed / sent) * 100).toFixed(0)}%</span>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    sending: "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-green-50 text-green-700 border-green-200",
    draft: "bg-gray-50 text-gray-700 border-gray-200",
    channel_error: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex px-2.5 py-0.5 text-[10px] font-medium rounded-full border capitalize ${
        styles[status] || "bg-gray-50 text-gray-700 border-gray-200"
      }`}
    >
      {status === "sending" && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse mr-1.5 self-center" />}
      {status}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    sent: "#6B7280",
    delivered: "#10B981",
    opened: "#3B82F6",
    clicked: "#8B5CF6",
    failed: "#EF4444",
    pending: "#D1D5DB",
  };

  return (
    <div
      className="w-2 h-2 rounded-full shrink-0"
      style={{ background: colors[status] || "#D1D5DB" }}
    />
  );
}

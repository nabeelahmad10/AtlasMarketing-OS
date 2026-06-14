"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Users,
  BarChart3,
  Zap,
  Target,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Shield,
  Globe,
} from "lucide-react";

interface HeroSectionProps {
  onNavigate: (view: "audience" | "ai" | "analytics") => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const stats = [
    { label: "Customers Managed", value: "50+", icon: Users },
    { label: "AI Segments", value: "Real-time", icon: Target },
    { label: "Channels Supported", value: "4+", icon: MessageSquare },
    { label: "Delivery Tracking", value: "Live", icon: TrendingUp },
  ];

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Segmentation",
      description: "Describe your audience in plain English. Our AI translates it into precise customer segments instantly.",
      color: "#C850C0",
    },
    {
      icon: MessageSquare,
      title: "Smart Campaign Builder",
      description: "AI generates personalized messages tailored to each segment's demographics and purchase behavior.",
      color: "#5B86E5",
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track delivery, opens, and clicks as they happen. Watch your campaign funnel update live.",
      color: "#FF5F6D",
    },
    {
      icon: Target,
      title: "Behavioral Targeting",
      description: "Segment by spend, recency, category preferences, and custom tags. Data-driven targeting at scale.",
      color: "#36D1DC",
    },
    {
      icon: Zap,
      title: "Async Delivery Engine",
      description: "Two-service architecture with simulated multi-channel delivery and automatic status callbacks.",
      color: "#FF8A00",
    },
    {
      icon: Shield,
      title: "Campaign Intelligence",
      description: "Delivery funnels, open rates, click-through tracking, and per-customer communication timelines.",
      color: "#10B981",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 dot-grid opacity-50" />

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#4F46E5]/10 rounded-full blur-3xl animate-float" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-[#C850C0]/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-[#36D1DC]/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(79,70,229,0.2)] bg-[rgba(79,70,229,0.05)] text-[#4F46E5] text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            AI-Native Marketing Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#111] leading-[1.08] mb-6"
          >
            Reach your shoppers{" "}
            <span className="ai-gradient-text">intelligently</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-[#666] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Describe your audience in plain English. AI builds the segment, crafts the message, and launches the campaign.
            Track everything in real-time.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              onClick={() => onNavigate("ai")}
              className="group ai-gradient text-white px-8 py-4 rounded-2xl text-base font-semibold shadow-xl shadow-[#4F46E5]/20 flex items-center gap-3"
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Sparkles className="w-5 h-5" />
              Launch AI Campaign
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>

            <motion.button
              onClick={() => onNavigate("audience")}
              className="px-8 py-4 rounded-2xl text-base font-semibold border border-[rgba(0,0,0,0.12)] text-[#111] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all flex items-center gap-3 bg-white"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              <Users className="w-5 h-5" />
              View Audience
            </motion.button>
          </motion.div>
        </div>

        {/* Floating Workspace Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 relative"
        >
          <div className="relative mx-auto max-w-5xl">
            {/* Main Card */}
            <div className="card p-6 sm:p-8 shadow-2xl shadow-black/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <div className="flex-1 h-8 bg-[#F5F5F7] rounded-lg flex items-center px-4">
                  <span className="text-xs text-[#999]">luxe-crm.app/dashboard</span>
                </div>
              </div>

              {/* Mock Dashboard */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <DashboardStatCard label="Total Customers" value="50" trend="+12%" color="#4F46E5" />
                <DashboardStatCard label="Campaigns Sent" value="Live" trend="Active" color="#10B981" />
                <DashboardStatCard label="AI Segments" value="Real-time" trend="NL-powered" color="#C850C0" />
              </div>

              {/* AI Prompt Preview */}
              <div className="relative bg-[#F5F5F7] rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 ai-gradient rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-[#111]">AI Campaign Builder</span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-[rgba(0,0,0,0.06)]">
                  <p className="text-sm text-[#666] italic">
                    &ldquo;Find me high-value customers from Mumbai who bought winter gear in the last 3 months...&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-6 -right-4 card px-4 py-3 shadow-xl flex items-center gap-3"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#111]">Campaign Live</p>
                <p className="text-xs text-green-600">92% delivered</p>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 card px-4 py-3 shadow-xl flex items-center gap-3"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Target className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#111]">Segment Created</p>
                <p className="text-xs text-purple-600">23 shoppers matched</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Row */}
      <section className="relative border-y border-[rgba(0,0,0,0.06)] bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <Icon className="w-6 h-6 mx-auto mb-3 text-[#4F46E5]" />
                  <p className="text-2xl sm:text-3xl font-bold text-[#111]">{stat.value}</p>
                  <p className="text-sm text-[#666] mt-1">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-[#4F46E5] uppercase tracking-wider mb-3"
          >
            Platform Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-[#111]"
          >
            Everything you need to{" "}
            <span className="ai-gradient-text">engage shoppers</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card card-interactive p-6 cursor-default"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: `${feature.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-semibold text-[#111] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#666] leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Architecture Section */}
      <section className="relative bg-[#111] text-white py-24 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#4F46E5] uppercase tracking-wider mb-3">
              System Architecture
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Built for <span className="ai-gradient-text">reliability & scale</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <ArchCard
              title="CRM API"
              description="FastAPI backend handling data, segments, campaigns, and AI operations. Async-first with SQLite."
              items={["Customer Management", "AI Segmentation", "Campaign Orchestration"]}
            />
            <ArchCard
              title="Channel Service"
              description="Separate stubbed service simulating multi-channel delivery with realistic async callbacks."
              items={["Delivery Simulation", "Status Callbacks", "Retry with Backoff"]}
            />
            <ArchCard
              title="Next.js Dashboard"
              description="Premium frontend with real-time data, AI prompt interface, and live analytics tracking."
              items={["Audience Explorer", "AI Campaign Builder", "Live Analytics"]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="card ai-gradient-border p-12 sm:p-16 max-w-3xl mx-auto"
        >
          <Sparkles className="w-10 h-10 text-[#4F46E5] mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111] mb-4">
            Ready to reach your shoppers?
          </h2>
          <p className="text-[#666] mb-8 max-w-lg mx-auto">
            Use AI to build segments, craft messages, and launch campaigns — all from a single prompt.
          </p>
          <motion.button
            onClick={() => onNavigate("ai")}
            className="ai-gradient text-white px-8 py-4 rounded-2xl text-base font-semibold shadow-xl flex items-center gap-3 mx-auto"
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Sparkles className="w-5 h-5" />
            Start Building with AI
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(0,0,0,0.06)] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 ai-gradient rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-[#111]">LUXE<span className="text-[#4F46E5]">CRM</span></span>
            </div>
            <p className="text-sm text-[#999]">
              Built for the Xeno Engineering Internship Assignment 2026
            </p>
            <div className="flex items-center gap-4 text-sm text-[#666]">
              <a href="https://github.com" className="hover:text-[#4F46E5] transition-colors">GitHub</a>
              <span className="text-[#ddd]">|</span>
              <span>FastAPI + Next.js + AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Sub Components ────────────────────────────────────────────

function DashboardStatCard({ label, value, trend, color }: { label: string; value: string; trend: string; color: string }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-[rgba(0,0,0,0.06)]">
      <p className="text-xs text-[#999] mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="text-xs font-medium mt-1" style={{ color }}>{trend}</p>
    </div>
  );
}

function ArchCard({ title, description, items }: { title: string; description: string; items: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-[rgba(255,255,255,0.6)] mb-4">{description}</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-[rgba(255,255,255,0.8)]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

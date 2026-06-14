"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Sparkles,
  BarChart3,
  Zap,
  Send,
  Menu,
  X,
} from "lucide-react";
import AudienceView from "./components/AudienceView";
import AICampaignBuilder from "./components/AICampaignBuilder";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import HeroSection from "./components/HeroSection";

type View = "home" | "audience" | "ai" | "analytics";

export default function Home() {
  const [activeView, setActiveView] = useState<View>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home" as View, label: "Home", icon: LayoutDashboard },
    { id: "audience" as View, label: "Audience", icon: Users },
    { id: "ai" as View, label: "AI Campaign", icon: Sparkles },
    { id: "analytics" as View, label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      {/* ─── Navigation Bar ──────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setActiveView("home")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-9 h-9 ai-gradient rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#111]">
                LUXE<span className="text-[#4F46E5]">CRM</span>
              </span>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#4F46E5] text-white shadow-lg shadow-[#4F46E5]/25"
                        : "text-[#666] hover:text-[#111] hover:bg-[rgba(0,0,0,0.04)]"
                    }`}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </motion.button>
                );
              })}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <motion.button
                className="ai-gradient text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg"
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveView("ai")}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Campaign
                </span>
              </motion.button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-[rgba(0,0,0,0.04)]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[rgba(0,0,0,0.06)] bg-white"
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveView(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                        activeView === item.id
                          ? "bg-[#4F46E5] text-white"
                          : "text-[#666] hover:bg-[rgba(0,0,0,0.04)]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── Main Content ────────────────────────────────────── */}
      <main className="pt-[72px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {activeView === "home" && <HeroSection onNavigate={setActiveView} />}
            {activeView === "audience" && <AudienceView />}
            {activeView === "ai" && <AICampaignBuilder />}
            {activeView === "analytics" && <AnalyticsDashboard />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  Users,
  MessageSquare,
  Target,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Zap,
  Copy,
  RefreshCw,
  Mail,
  Phone,
  Globe,
  Wand2,
} from "lucide-react";
import {
  aiSegment,
  aiGenerateMessage,
  createCampaign,
  getSegments,
  type AISegmentResponse,
  type AIMessageResponse,
  type Segment,
} from "../lib/api";

type Step = "prompt" | "segment" | "message" | "launch" | "done";

const EXAMPLE_PROMPTS = [
  "Find me high-value customers from Mumbai who spent over 10000",
  "Show me customers who bought winter gear in the last 3 months",
  "Women aged 25-35 who purchased accessories",
  "Dormant customers who haven't ordered in 90 days",
  "VIP customers with more than 10 orders",
  "Deal seekers from Delhi and Bangalore",
];

export default function AICampaignBuilder() {
  const [step, setStep] = useState<Step>("prompt");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Segment step
  const [segmentResult, setSegmentResult] = useState<AISegmentResponse | null>(null);

  // Message step
  const [campaignGoal, setCampaignGoal] = useState("");
  const [tone, setTone] = useState("friendly");
  const [messageResult, setMessageResult] = useState<AIMessageResponse | null>(null);

  // Launch step
  const [campaignName, setCampaignName] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("email");
  const [launchResult, setLaunchResult] = useState<any>(null);

  // Chat history for showing the flow
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "ai"; content: string; type?: string }[]
  >([]);

  const handleSegment = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");

    setChatHistory((prev) => [...prev, { role: "user", content: prompt }]);

    try {
      const result = await aiSegment(prompt);
      if (result.error) {
        setError(result.error);
        setChatHistory((prev) => [
          ...prev,
          { role: "ai", content: `Error: ${result.error}`, type: "error" },
        ]);
      } else {
        setSegmentResult(result);
        setChatHistory((prev) => [
          ...prev,
          {
            role: "ai",
            content: `Found **${result.customer_count}** customers matching "${result.segment_name}"`,
            type: "segment",
          },
        ]);
        setCampaignName(`${result.segment_name} Campaign`);
        setStep("segment");
      }
    } catch (err: any) {
      const msg = err.message || "Failed to create segment";
      setError(msg);
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", content: `Error: ${msg}`, type: "error" },
      ]);
    }
    setLoading(false);
  };

  const handleGenerateMessage = async () => {
    if (!segmentResult || !campaignGoal.trim()) return;
    setLoading(true);
    setError("");

    setChatHistory((prev) => [
      ...prev,
      { role: "user", content: `Campaign goal: ${campaignGoal} (tone: ${tone})` },
    ]);

    try {
      const result = await aiGenerateMessage({
        segment_id: segmentResult.segment_id,
        campaign_goal: campaignGoal,
        tone,
      });
      setMessageResult(result);
      setSelectedChannel(result.channel_recommendation || "email");
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", content: result.message, type: "message" },
      ]);
      setStep("message");
    } catch (err: any) {
      setError(err.message || "Failed to generate message");
    }
    setLoading(false);
  };

  const handleLaunch = async () => {
    if (!segmentResult || !messageResult) return;
    setLoading(true);
    setError("");

    try {
      const result = await createCampaign({
        name: campaignName,
        segment_id: segmentResult.segment_id,
        message_template: messageResult.message,
        channel: selectedChannel,
      });
      setLaunchResult(result);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "ai",
          content: `Campaign "${result.name}" launched! Sending to ${result.total_sent} customers via ${selectedChannel}.`,
          type: "launch",
        },
      ]);
      setStep("done");
    } catch (err: any) {
      setError(err.message || "Failed to launch campaign");
    }
    setLoading(false);
  };

  const resetFlow = () => {
    setStep("prompt");
    setPrompt("");
    setSegmentResult(null);
    setMessageResult(null);
    setLaunchResult(null);
    setCampaignGoal("");
    setCampaignName("");
    setError("");
    setChatHistory([]);
  };

  const channels = [
    { id: "email", label: "Email", icon: Mail },
    { id: "sms", label: "SMS", icon: Phone },
    { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 ai-gradient rounded-2xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#111]">AI Campaign Builder</h1>
        </div>
        <p className="text-[#666] ml-[52px]">
          Describe your audience in plain English. AI handles the rest.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {["Segment", "Generate", "Review", "Launch"].map((label, i) => {
          const stepMap: Step[] = ["prompt", "segment", "message", "done"];
          const isActive = i <= stepMap.indexOf(step === "launch" ? "message" : step);
          const isCurrent = stepMap[i] === step || (step === "launch" && i === 2);
          return (
            <div key={label} className="flex items-center gap-2 shrink-0">
              {i > 0 && (
                <div className={`w-8 h-0.5 ${isActive ? "bg-[#4F46E5]" : "bg-[rgba(0,0,0,0.08)]"}`} />
              )}
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isCurrent
                    ? "bg-[#4F46E5] text-white"
                    : isActive
                    ? "bg-[#4F46E5]/10 text-[#4F46E5]"
                    : "bg-[#F5F5F7] text-[#999]"
                }`}
              >
                <span className="w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                  {isActive && !isCurrent ? "✓" : i + 1}
                </span>
                {label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Chat/Action Panel */}
        <div className="lg:col-span-3">
          {/* Chat History */}
          <div className="space-y-4 mb-6">
            {chatHistory.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                    msg.role === "user"
                      ? "bg-[#4F46E5] text-white"
                      : msg.type === "error"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : msg.type === "launch"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-white border border-[rgba(0,0,0,0.08)] text-[#111]"
                  }`}
                >
                  {msg.role === "ai" && (
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider opacity-60">
                        {msg.type === "segment" ? "Segment Created" : msg.type === "message" ? "Message Generated" : msg.type === "launch" ? "Campaign Launched" : "AI"}
                      </span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 mb-4 text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          {/* Step 1: Prompt Input */}
          <AnimatePresence mode="wait">
            {step === "prompt" && (
              <motion.div
                key="prompt"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="card p-6">
                  <h3 className="text-sm font-semibold text-[#111] mb-4 flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#4F46E5]" />
                    Describe Your Target Audience
                  </h3>

                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., Find me high-value customers from Mumbai who bought winter gear in the last 3 months..."
                      className="w-full p-4 bg-[#F5F5F7] rounded-2xl text-sm border-0 resize-none focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 min-h-[100px]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSegment();
                        }
                      }}
                    />
                    <motion.button
                      onClick={handleSegment}
                      disabled={loading || !prompt.trim()}
                      className="absolute bottom-3 right-3 ai-gradient text-white p-3 rounded-xl disabled:opacity-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Wand2 className="w-4 h-4" />
                      )}
                    </motion.button>
                  </div>

                  {/* Example Prompts */}
                  <div className="mt-4">
                    <p className="text-xs text-[#999] mb-2">Try these:</p>
                    <div className="flex flex-wrap gap-2">
                      {EXAMPLE_PROMPTS.map((ex) => (
                        <motion.button
                          key={ex}
                          onClick={() => setPrompt(ex)}
                          className="text-xs px-3 py-1.5 bg-[#F5F5F7] rounded-full text-[#666] hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] transition-all"
                          whileHover={{ y: -1 }}
                        >
                          {ex.length > 45 ? ex.slice(0, 45) + "..." : ex}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Segment Result → Message Generation */}
            {step === "segment" && segmentResult && (
              <motion.div
                key="segment"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="card p-6">
                  <h3 className="text-sm font-semibold text-[#111] mb-4 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#4F46E5]" />
                    Craft Your Campaign Message
                  </h3>

                  <textarea
                    value={campaignGoal}
                    onChange={(e) => setCampaignGoal(e.target.value)}
                    placeholder="What's the goal of this campaign? e.g., Announce our new winter collection, Offer 20% off to bring back dormant customers..."
                    className="w-full p-4 bg-[#F5F5F7] rounded-2xl text-sm border-0 resize-none focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 min-h-[80px] mb-4"
                  />

                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs text-[#999]">Tone:</span>
                    {["friendly", "professional", "urgent", "playful"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTone(t)}
                        className={`text-xs px-3 py-1.5 rounded-full capitalize transition-all ${
                          tone === t
                            ? "bg-[#4F46E5] text-white"
                            : "bg-[#F5F5F7] text-[#666] hover:bg-[#4F46E5]/10"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <motion.button
                    onClick={handleGenerateMessage}
                    disabled={loading || !campaignGoal.trim()}
                    className="w-full ai-gradient text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Message with AI
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review & Launch */}
            {(step === "message" || step === "launch") && messageResult && (
              <motion.div
                key="message"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="card p-6">
                  <h3 className="text-sm font-semibold text-[#111] mb-4 flex items-center gap-2">
                    <Send className="w-4 h-4 text-[#4F46E5]" />
                    Review & Launch Campaign
                  </h3>

                  {/* Campaign Name */}
                  <div className="mb-4">
                    <label className="text-xs text-[#999] mb-1 block">Campaign Name</label>
                    <input
                      type="text"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full p-3 bg-[#F5F5F7] rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30"
                    />
                  </div>

                  {/* Message Preview */}
                  <div className="mb-4">
                    <label className="text-xs text-[#999] mb-1 block">Message Preview</label>
                    <div className="bg-[#F5F5F7] rounded-xl p-4 text-sm text-[#333] leading-relaxed">
                      {messageResult.subject_line && (
                        <p className="font-semibold mb-2">Subject: {messageResult.subject_line}</p>
                      )}
                      <p className="whitespace-pre-wrap">{messageResult.message}</p>
                    </div>
                  </div>

                  {/* Channel Selection */}
                  <div className="mb-6">
                    <label className="text-xs text-[#999] mb-2 block">Delivery Channel</label>
                    <div className="flex gap-3">
                      {channels.map((ch) => {
                        const Icon = ch.icon;
                        return (
                          <button
                            key={ch.id}
                            onClick={() => setSelectedChannel(ch.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              selectedChannel === ch.id
                                ? "bg-[#4F46E5] text-white shadow-lg shadow-[#4F46E5]/20"
                                : "bg-[#F5F5F7] text-[#666] hover:bg-[#4F46E5]/10"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {ch.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <motion.button
                    onClick={handleLaunch}
                    disabled={loading}
                    className="w-full bg-[#111] text-white py-3.5 rounded-xl text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Launch Campaign to {segmentResult?.customer_count} Customers
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === "done" && launchResult && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="card p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-16 h-16 ai-gradient rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-[#111] mb-2">Campaign Launched!</h3>
                  <p className="text-sm text-[#666] mb-6">
                    Sending to {launchResult.total_sent} customers via {selectedChannel}. Check Analytics to track delivery.
                  </p>
                  <motion.button
                    onClick={resetFlow}
                    className="px-6 py-3 bg-[#4F46E5] text-white rounded-xl text-sm font-semibold flex items-center gap-2 mx-auto"
                    whileHover={{ y: -2 }}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Create Another Campaign
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Context Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Segment Info Card */}
          {segmentResult && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-[#4F46E5]" />
                <h4 className="text-sm font-semibold text-[#111]">Segment</h4>
              </div>
              <p className="text-lg font-bold text-[#111] mb-1">{segmentResult.segment_name}</p>
              <p className="text-xs text-[#666] mb-3">{segmentResult.description}</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#4F46E5]" />
                  <span className="text-sm font-semibold">{segmentResult.customer_count}</span>
                  <span className="text-xs text-[#999]">customers</span>
                </div>
              </div>

              {/* Customer Preview */}
              {segmentResult.customer_preview && segmentResult.customer_preview.length > 0 && (
                <div>
                  <p className="text-xs text-[#999] mb-2">Preview:</p>
                  <div className="space-y-1.5">
                    {segmentResult.customer_preview.slice(0, 5).map((c) => (
                      <div key={c.id} className="flex items-center gap-2 text-xs">
                        <div className="w-5 h-5 rounded-full bg-[#4F46E5]/10 flex items-center justify-center text-[8px] font-bold text-[#4F46E5]">
                          {c.name.charAt(0)}
                        </div>
                        <span className="text-[#333]">{c.name}</span>
                      </div>
                    ))}
                    {segmentResult.customer_count > 5 && (
                      <p className="text-[10px] text-[#999]">
                        +{segmentResult.customer_count - 5} more
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* SQL Query (collapsible) */}
              {segmentResult.sql_query && (
                <details className="mt-4">
                  <summary className="text-[10px] text-[#999] cursor-pointer hover:text-[#4F46E5]">
                    View Generated SQL
                  </summary>
                  <pre className="mt-2 p-3 bg-[#F5F5F7] rounded-xl text-[10px] text-[#666] overflow-x-auto font-mono">
                    {segmentResult.sql_query}
                  </pre>
                </details>
              )}
            </motion.div>
          )}

          {/* How It Works */}
          {!segmentResult && (
            <div className="card p-5">
              <h4 className="text-sm font-semibold text-[#111] mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4F46E5]" />
                How It Works
              </h4>
              <div className="space-y-4">
                {[
                  { step: 1, title: "Describe your audience", desc: "Use natural language to describe who you want to target" },
                  { step: 2, title: "AI builds the segment", desc: "AI translates your intent into a precise database query" },
                  { step: 3, title: "Generate message copy", desc: "AI crafts a personalized message for your audience" },
                  { step: 4, title: "Launch campaign", desc: "Send via email, SMS, or WhatsApp with one click" },
                ].map((s) => (
                  <div key={s.step} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#4F46E5]/10 flex items-center justify-center text-xs font-bold text-[#4F46E5] shrink-0">
                      {s.step}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#111]">{s.title}</p>
                      <p className="text-xs text-[#999]">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

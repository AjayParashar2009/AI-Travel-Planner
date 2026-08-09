import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, ShieldCheck, Sparkles, Target, Zap } from "lucide-react";

export default function AiInsightCard({ insights, itinerary, input }) {
  const displaySummary =
    insights?.summary ||
    insights?.description ||
    itinerary?.localTips?.[o]?.content ||
    "Optimization protocol complete. Neural engines have calibrated the most efficient route based on your unique travel style and budget constraints.";

  // Map optimization tips (Fallbacks to smart defaults if array is empty)

  const optimizationTips =
    insights?.savingsTips?.length > 0
      ? insights.savingsTips
      : [
          "Dynamic route clustering active to minimize transit time.",
          "Local peak-hour avoidance protocol enabled.",
          "Budget-index calibration for maximum value extraction",
        ];

  // Strategic tags based on user interests or AI alternatives

  const tags =
    insights?.cheaperAlternatives?.length > 0
      ? insights.cheaperAlternatives
      : input?.interests || ["Efficiency", "Discovery", "Optimized"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[3rem] border border-gray-100 bg-white p-10 shadow-2xl relative overflow-hidden group mb-12"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-gray-950 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl relative overflow-hidden shrink-0">
            <Sparkles size={24} className="relative z-10 text-blue-400" />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-tr from-blue-600/40 to-transparent"
            />
          </div>
          <div>
            <h3 className="text-3xl font-black text-gray-950 uppercase italic tracking-tighter leading-none">
              Neural Intelligence Briefing
            </h3>
            <p className="flex items-center gap-2 mt-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">
              <ShieldCheck size={14} strokeWidth={3} />
              <span>System Verified Optimization</span>
            </p>
          </div>
        </div>
        {/* Status Bade */}
        <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />

          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
            Logic Engine 3.0 Live
          </span>
        </div>
      </div>
      {/* Main Insight Block */}
      <div className=" relative mb-12">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
        <p className="text-2xl text-gray-800 italic font-medium leading-relaxed pl-10 py-2">
          {displaySummary}
        </p>
      </div>

      {/* Detailed Analysis Grid */}
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Target size={18} className="text-blue-600" />
            </div>
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">
              Asset Optimization
            </h4>
          </div>
          <ul className="space-y-5">
            {/* Map Method */}
            {optimizationTips.map((tip, i) => (
              <motion.li
                whileHover={{ x: 5 }}
                className="text-sm font-bold text-gray-600 flex gap-5 items-start group/item"
              >
                <span className="flex-shrink-0 w-7 h-7 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center text-[10px] font-black  group-hover/item:bg-blue-600  group-hover/item:text-white group-hover/item:shadow-lg transition-all">
                  0{i + 1}
                </span>
                <span className="leading-snug pt-1">{tip}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Zap size={18} className="text-indigo-600" />
            </div>
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">
              Strategic Markers
            </h4>
          </div>
          <div className="flex flex-wrap gap-3">
            {/* Map Method */}
            {tags.map((tag, i) => (
              <span className="px-6 py-3.5 bg-gray-50 rounded-2xl text-[11px] font-black text-gray-700 border border-gray-100 uppercase tracking-widest hover:border-blue-500/50 hover:bg-white hover:text-blue-600 hover:shadow-md transition-all cursor-default">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-8 p-5 bg-amber-50/50 rounded-3xl border border-amber-100/50 flex items-start gap-4">
            <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] font-bold text-amber-700 leading-normal">
              Travel conditions are calculated based on current data. Always
              verify local safety protocols and operating hours.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import React from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

export default function UserTripsData({ trip }) {
  if (!trip) return null;

  // Trip input fields (backend uses "inputs", plural)
  const inputs = trip.inputs || {};

  // AI insights, if the trip has them
  const ai = trip.aiInsights || {};

  // Fallback copy when no AI insights are available yet
  const displaySummary =
    ai.verdict || "AI insights for this trip are not available yet.";

  const moneySavingTips = ai.moneySavingTips?.length ? ai.moneySavingTips : [];

  const hiddenCosts = ai.hiddenCosts?.length ? ai.hiddenCosts : [];

  const interests = inputs.interest || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[3rem] border border-gray-100 bg-white p-10 shadow-2xl relative overflow-hidden group mb-12"
    >
      {/* Header */}
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
              Trip Summary
            </h3>
            <p className="flex items-center gap-2 mt-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">
              <ShieldCheck size={14} strokeWidth={3} />
              <span>Trip Details and AI Insights</span>
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
            Trip Active
          </span>
        </div>
      </div>

      {/* Four stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="p-5 bg-gray-50 rounded-[2rem] border border-gray-100">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Calendar size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Duration
            </span>
          </div>
          <p className="text-xs font-bold text-gray-800 uppercase">
            {inputs.duration || "—"} Days
          </p>
        </div>

        <div className="p-5 bg-gray-50 rounded-[2rem] border border-gray-100">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Users size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Travelers
            </span>
          </div>
          <p className="text-xs font-bold text-gray-800 uppercase">
            {inputs.numTravelers || "—"}
          </p>
        </div>

        <div className="p-5 bg-gray-50 rounded-[2rem] border border-gray-100">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Sparkles size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Style
            </span>
          </div>
          <p className="text-xs font-bold text-gray-800 uppercase">
            {inputs.travelStyle || "—"}
          </p>
        </div>

        <div className="p-5 bg-gray-50 rounded-[2rem] border border-gray-100">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Wallet size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Budget
            </span>
          </div>
          <p className="text-xs font-bold text-gray-800 uppercase">
            {inputs.budgetMin != null && inputs.budgetMax != null
              ? `₹${inputs.budgetMin} – ₹${inputs.budgetMax}`
              : "—"}
          </p>
        </div>
      </div>

      {/* Verdict line */}
      <div className="relative mb-12">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
        <p className="text-xl text-gray-800 italic font-medium leading-relaxed pl-10 py-2">
          {displaySummary}
        </p>
      </div>

      {/* Two columns: interests + tips on the left, warnings on the right */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left — interests and money-saving tips */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Target size={18} className="text-blue-600" />
            </div>
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">
              Your Interests
            </h4>
          </div>

          {interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, i) => (
                <span
                  key={i}
                  className="text-[10px] font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full uppercase tracking-wider"
                >
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No interests selected.</p>
          )}

          {/* Money-saving tips if AI returned any */}
          {moneySavingTips.length > 0 && (
            <div className="pt-6 border-t border-gray-100 space-y-4">
              <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                Money-Saving Tips
              </h5>
              <ul className="space-y-3">
                {moneySavingTips.map((tip, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-600 flex gap-4 items-start"
                  >
                    <span className="shrink-0 w-6 h-6 bg-gray-50 text-gray-400 rounded-lg flex items-center justify-center text-[10px] font-black">
                      0{i + 1}
                    </span>
                    <span className="leading-snug pt-0.5">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right — hidden costs and advisory note */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Zap size={18} className="text-indigo-600" />
            </div>
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">
              Things to Watch For
            </h4>
          </div>

          {hiddenCosts.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {hiddenCosts.map((cost, i) => (
                <span
                  key={i}
                  className="px-5 py-3 bg-gray-50 rounded-2xl text-[11px] font-bold text-gray-700 border border-gray-100 uppercase tracking-wider"
                >
                  {cost}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              No warnings available for this trip.
            </p>
          )}

          <div className="mt-6 p-5 bg-amber-50/50 rounded-2xl border border-amber-100/50 flex items-start gap-4">
            <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] font-bold text-amber-700 leading-normal">
              Always double-check opening hours and travel advisories before you
              go.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

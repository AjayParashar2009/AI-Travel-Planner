import React, { useState } from "react";
import Navbar from "../components/Navbar";
import {
  Activity,
  Calendar,
  Globe,
  PenIcon,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import ControlField from "../components/ControlField";
import SummaryRow from "../components/SummaryRow";
import { AnimatePresence, motion } from "framer-motion";
import HudStats from "../components/HudStats";
import { BudgetBarChart, BudgetPieChart } from "../components/ChartCard";
import AiInsightCard from "../components/AiInsightCard";
import { budgetAPI } from "../services/api";
import toast from "react-hot-toast";

// Format a number as Indian Rupees
const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return "—";
  return `₹${Number(value).toLocaleString()}`;
};

export default function BudgetEstimator() {
  // Form state — holds the user's trip inputs
  const [form, setForm] = useState({
    destination: "",
    duration: 0,
    travelers: 1,
    budget: "mid-range",
  });

  // Result state — holds the calculated budget returned by the API
  const [budget, setBudget] = useState(null);

  // AI insights state — holds the AI-generated suggestions for the budget
  const [insights, setInsights] = useState([]);

  // Loading state — true while the API calls are in progress
  const [loading, setLoading] = useState(false);

  // Update a single field in the form
  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Handle form submit — calculate budget then fetch AI insights
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!form.destination || !form.duration) {
      toast.error("Enter a destination and duration");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Calculate the budget
      const calcRes = await budgetAPI.calculate({
        destination: form.destination,
        inputs: {
          duration: Number(form.duration),
          numTravelers: Number(form.travelers),
          accommodationType: form.budget,
          travelSeason: "shoulder",
          dailyFoodPreference: "mix",
          userCurrency: "INR",
        },
      });

      const budgetData = calcRes?.data?.budget;
      setBudget(budgetData);

      // Step 2: Fetch AI insights for the calculated budget
      try {
        const insightRes = await budgetAPI.getInsight(budgetData._id);
        const ai = insightRes?.data?.aiInsights;
        if (ai) {
          setBudget((prev) => ({ ...prev, aiInsights: ai }));
          setInsights([{ aiInsights: ai }]);
        }
      } catch (aiErr) {
        // AI insight failure should not block the main result
        console.error("AI INSIGHT ERROR:", aiErr?.response?.data || aiErr);
      }

      toast.success("Budget calculated");
    } catch (err) {
      console.error("CALCULATION ERROR:", err);
      console.error(
        "VALIDATION ERRORS:",
        JSON.stringify(err?.response?.data?.errors, null, 2),
      );
      toast.error(err?.response?.data?.error || "Calculation failed");
    } finally {
      setLoading(false);
    }
  };

  // Whether we have results to display
  const hasResults = !!budget;

  return (
    <div className="min-h-screen bg-[#020203] text-gray-300 font-sans overflow-hidden">
      <Navbar />

      <div className="flex min-h-screen pt-24">
        {/* Left sidebar — input form */}
        <aside className="w-[30%] shrink-0 min-h-[calc(100vh-6rem)] flex flex-col border-r border-white/5 bg-[#050507] p-8 overflow-y-auto custom-scrollbar">
          {/* Sidebar heading */}
          <div className="mb-10">
            <h1 className="text-3xl font-black tracking-tighter text-white italic uppercase leading-none">
              Budget <span className="text-blue-600">Estimator</span>
            </h1>
            <p className="text-xs text-gray-500 mt-2">
              Enter your trip details to estimate costs
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Destination input */}
            <ControlField label="Destination">
              <div className="relative group">
                <Target
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500"
                />
                <input
                  type="text"
                  value={form.destination}
                  onChange={(e) => updateField("destination", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 font-bold text-white outline-none focus:border-blue-500/50 text-sm uppercase"
                  placeholder="e.g. Tokyo, Japan"
                />
              </div>
            </ControlField>

            {/* Duration and travelers — side by side */}
            <div className="grid grid-cols-2 gap-4">
              <ControlField label="Days">
                <div className="relative">
                  <Calendar
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  />
                  <input
                    type="number"
                    min="1"
                    value={form.duration || ""}
                    onChange={(e) => updateField("duration", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 font-bold text-white outline-none focus:border-blue-500/50 text-sm"
                    placeholder="7"
                  />
                </div>
              </ControlField>
              <ControlField label="Travelers">
                <div className="relative">
                  <User
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  />
                  <input
                    type="number"
                    min="1"
                    value={form.travelers}
                    onChange={(e) => updateField("travelers", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 font-bold text-white outline-none focus:border-blue-500/50 text-sm"
                    placeholder="2"
                  />
                </div>
              </ControlField>
            </div>

            {/* Budget tier select */}
            <ControlField label="Budget Level">
              <select
                value={form.budget}
                onChange={(e) => updateField("budget", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 font-bold text-blue-500 outline-none text-sm cursor-pointer"
              >
                <option value="hostel">Budget</option>
                <option value="mid-range">Standard</option>
                <option value="luxury">Premium</option>
              </select>
            </ControlField>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3"
            >
              {loading ? "Calculating…" : "Calculate Budget"}
            </button>
          </form>

          {/* Sidebar footer — quick summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-auto pt-8 border-t border-white/5 space-y-4"
          >
            <SummaryRow
              label="Estimated Total"
              value={budget ? formatCurrency(budget.breakdown?.total) : "—"}
              highlight
            />
            <SummaryRow
              label="Status"
              value={loading ? "Calculating…" : "Ready"}
              color={loading ? "text-amber-500" : "text-emerald-500"}
            />
          </motion.div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar bg-black space-y-8">
          <AnimatePresence mode="wait">
            {!hasResults ? (
              // Empty state — shown before calculation
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[500px] border border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 bg-white/[0.01]"
              >
                <Activity size={48} className="text-blue-500/30" />
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-500">
                    No results yet
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Fill in the form and click Calculate Budget
                  </p>
                </div>
              </motion.div>
            ) : (
              // Results view — shown after calculation
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Top stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <HudStats
                    icon={Globe}
                    label="Destination"
                    color="text-blue-500"
                    value={form.destination}
                  />
                  <HudStats
                    icon={Zap}
                    label="Cost Per Day"
                    color="text-amber-500"
                    value={formatCurrency(
                      budget?.breakdown?.total / Number(form.duration || 1),
                    )}
                  />
                  <HudStats
                    icon={ShieldCheck}
                    label="Emergency Buffer"
                    color="text-emerald-500"
                    value="15% Included"
                  />
                </div>

                {/* Charts row — pie chart and bar chart side by side */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <BudgetPieChart breakdown={budget?.breakdown} />
                  <BudgetBarChart breakdown={budget?.breakdown} />
                </div>

                {/* AI insights section */}
                <div className="flex flex-col min-h-[300px]">
                  {insights.length === 0 ? (
                    // Placeholder shown while AI insights are loading or unavailable
                    <div className="flex-1 bg-blue-600/5 border border-blue-500/20 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center">
                      <Sparkles size={40} className="text-blue-500 mb-6" />
                      <h4 className="text-2xl font-bold text-white uppercase italic">
                        AI Suggestions
                      </h4>
                      <p className="text-xs text-blue-400 mt-2">
                        Generating insights for your trip…
                      </p>
                    </div>
                  ) : (
                    // Actual AI insights card
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AiInsightCard insights={insights} />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

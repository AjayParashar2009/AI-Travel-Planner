import { Activity, AlertTriangle, BarChart3, Wallet } from "lucide-react";
import React from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

// Colors used for the chart segments, cycling through
const COLORS = [
  "#2563EB",
  "#3B82F6",
  "#1E40AF",
  "#64748B",
  "#94A3B8",
  "#CBD5E1",
  "#0F172A",
  "#334155",
];

// Human-readable labels for each breakdown key
const LABELS = {
  accommodation: "LODGING",
  food: "DINING",
  transport: "TRANSIT",
  activities: "LEISURE",
  flights: "AIRFARE",
  insurance: "INSURANCE",
  miscellaneous: "EXTRAS",
  emergencyBuffer: "BUFFER",
};

// Custom tooltip shown on hover for both charts
function CustomToolTip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  const total = data.payload?.total || 0;
  const percent = total ? ((data.value / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="bg-black border border-white/10 px-4 py-3 rounded-xl shadow-2xl">
      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500 mb-1">
        {data.name}
      </p>
      <p className="text-xl font-black text-white tracking-tighter">
        ₹{Number(data.value)?.toLocaleString()}
      </p>
      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1">
        {percent}% of total
      </p>
    </div>
  );
}

// Convert a breakdown object into an array of chart data points
function buildData(breakdown) {
  if (!breakdown) return [];

  // Compute total if it isn't present in the object
  const total =
    breakdown.total ??
    Object.entries(breakdown)
      .filter(([key]) => !["total", "perPerson"].includes(key))
      .reduce((acc, [, val]) => acc + (Number(val) || 0), 0);

  return Object.entries(breakdown)
    .filter(([key, val]) => {
      if (["total", "perPerson"].includes(key)) return false;
      return Number(val) > 0;
    })
    .map(([key, value], idx) => ({
      name: LABELS[key] || key.toUpperCase(),
      value: Number(value) || 0,
      total,
      color: COLORS[idx % COLORS.length],
    }));
}

// ---------- Pie Chart ----------
export function BudgetPieChart({ breakdown }) {
  const data = buildData(breakdown);
  if (!data.length) return null;

  // Prefer the stored total; otherwise use the computed total from buildData
  const total = breakdown.total ?? data[0]?.total ?? 0;

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6">
      {/* Chart header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
          <Activity size={14} className="text-blue-500" />
          Cost Breakdown
        </h3>
      </div>

      {/* Chart with total shown in the centre */}
      <div className="h-[260px] w-full relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <span className="text-gray-600 text-[9px] font-black uppercase tracking-[0.3em] mb-0.5">
            Total
          </span>
          <span className="text-3xl font-black text-white tracking-tighter italic">
            ₹{Number(total).toLocaleString()}
          </span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={105}
              paddingAngle={3}
              dataKey="value"
              stroke="#0A0A0B"
              strokeWidth={4}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomToolTip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-6 pt-6 border-t border-white/5">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest truncate">
                {item.name}
              </span>
            </div>
            <span className="text-[11px] font-black text-white whitespace-nowrap">
              ₹{item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BudgetPieChart;

// ---------- Bar Chart ----------
export function BudgetBarChart({ breakdown }) {
  const data = buildData(breakdown);
  if (!data.length) return null;

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6">
      <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
        <BarChart3 size={14} className="text-blue-500" />
        Cost Distribution
      </h3>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="name"
              stroke="#475569"
              tick={{ fontSize: 9, fontWeight: 900, fill: "#64748B" }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={50}
            />
            <YAxis
              stroke="#475569"
              tick={{ fontSize: 9, fontWeight: 900, fill: "#64748B" }}
            />
            <Tooltip
              content={<CustomToolTip />}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ---------- Over/Under Budget ----------
export function BudgetOverUnder({ total = 0, targetBudget = 0 }) {
  if (!targetBudget) return null;

  const diff = targetBudget - total;
  const isOver = diff < 0;

  // Real percent used (can exceed 100) — display as-is
  const realPercent = (total / targetBudget) * 100;

  // Visual bar width caps at 100% so it never overflows
  const barWidth = Math.min(realPercent, 100);

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/5 p-8 bg-white/[0.02]">
      {/* Background icon */}
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
        <Wallet size={140} strokeWidth={1} className="text-white" />
      </div>

      {/* Header with status and amount */}
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <div
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${
              isOver ? "text-red-500" : "text-emerald-500"
            }`}
          >
            <AlertTriangle size={14} />
            {isOver ? "Over Budget" : "Within Budget"}
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter leading-none uppercase italic">
            ₹{Math.abs(diff).toLocaleString()}
          </h2>
          <p className="text-[9px] font-black text-gray-600 mt-3 uppercase tracking-[0.4em]">
            {isOver ? "Over your budget" : "Remaining"}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-end">
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">
            Budget Used
          </span>
          <span
            className={`text-2xl font-black italic ${
              isOver ? "text-red-500" : "text-emerald-500"
            }`}
          >
            {realPercent.toFixed(0)}%
          </span>
        </div>
        <div className="h-4 bg-white/5 rounded-full border border-white/10 p-[2px]">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              isOver ? "bg-red-500" : "bg-emerald-500"
            }`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
}

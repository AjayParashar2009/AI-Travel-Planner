import React from "react";

export default function HUDMetric({
  icon: Icon,
  label,
  value,
  color = "text-white",
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
      <Icon size="14" className="text-gray-500" />
      <div>
        <p className="text-[7px] font-black text-gray-500 uppercase tracking-[0.02em] mb-0.5">
          {label}
        </p>
        <p className={`text-[11px] font-bold leading-none ${color}`}>{value}</p>
      </div>
    </div>
  );
}

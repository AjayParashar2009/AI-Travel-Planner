import React from "react";

export default function HudStats({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white/[0.03] border border-white/5  p-6 rounded-2xl flex items-center gap-4">
      <div className={`p-3 rounded-xl bg-black/40 ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest leading-none mb-1">
          {label}
        </p>
        <p className="text-base font-bold text-white uppercase truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

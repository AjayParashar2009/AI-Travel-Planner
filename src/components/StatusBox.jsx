import React from "react";

export default function StatusBox({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-[#111113] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-white/20 transition-all group">
      <div
        className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center ${color} mb-8 group-hover:scale-110 transition-transform`}
      >
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-white tracking-tighter">
            {value}
          </span>
          <span className="text-[9px] font-bold text-gray-700 italic uppercase">
            {sub}
          </span>
        </div>
      </div>
    </div>
  );
}

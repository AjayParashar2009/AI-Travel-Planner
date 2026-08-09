import React from "react";

export default function HeaderBade({ icon: Icon, label, value }) {
  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 hover:bg-white/5 transition-all">
      <Icon size={16} className="text-blue-500" />
      <div className="flex flex-col">
        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">
          {label}
        </span>
        <span className="text-sm font-black uppercase text-white tracking-tighter">
          {value || "---"}
        </span>
      </div>
    </div>
  );
}

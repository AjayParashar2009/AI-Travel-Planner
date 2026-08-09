import React from "react";

export default function LogisticRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-5 group">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-500 shrink-0 border border-white/5 group-hover:bg-blue-600/10 group-hover:border-blue-500/20 transition-all">
        <Icon size={20} />
      </div>

      <div className="overflow-hidden">
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">
          {label}
        </p>

        <p className="text-sm font-black text-white uppercase truncate tracking-tighter">
          {value}
        </p>
      </div>
    </div>
  );
}

import React from "react";

export default function Counter({ label, value, setter }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-2 group hover:border-blue-500/30 transition-all">
      <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">
        {label}
      </span>
      <div className="flex items-center gap-6">
        <button
          type="button"
          className="text-gray-600 hover:text-white transition-all font-bold"
          onClick={() => setter(value - 1)}
        >
          -
        </button>
        <span className="text-lg font-black text-white ">{value}</span>
        <button
          type="button"
          className="text-gray-600 hover:text-white transition-all font-bold"
          onClick={() => setter(value + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}

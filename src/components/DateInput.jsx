import { Calendar } from "lucide-react";
import React from "react";

export default function DateInput({ label, value, onChange }) {
  return (
    <div className="relative group">
      <Calendar
        size={14}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500/50 group-focus-within:text-blue-500 transition-all pointer-events-none"
      />
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-blue-500/50 transition-all text-xs font-bold text-white uppercase"
      />
    </div>
  );
}

import React from "react";

export default function SummaryRow({
  label,
  value,
  highlight,
  color = "text-white",
}) {
  return (
    <div className="flex justify-between items-end">
      <span className="text-[9px] font-bold text-gray-600 uppercase -tracking-widest">
        {label}
      </span>
      <span
        className={`font-black ${highlight ? "text-2xl italic leading-none" : "text-sm"} ${color}`}
      >
        {value}
      </span>
    </div>
  );
}

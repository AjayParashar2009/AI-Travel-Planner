import React from "react";

export default function Matrix({ label, value, icon: Icon }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-black text-gray-600 uppercase flex items-center gap-2">
        <Icon size={12} /> {label}
      </span>
      <span className="text-2xl font-black italic">{value}</span>
    </div>
  );
}

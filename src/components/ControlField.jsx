import React from "react";

export default function ControlField({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">
        {label}
      </label>
      {children}
    </div>
  );
}

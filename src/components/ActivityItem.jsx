import React from "react";

export default function ActivityItem({ time, action, desc, dot }) {
  return (
    <div className="flex gap-4">
      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${dot}`} />
      <div>
        <p className="text-[10px] font-black text-white uppercase tracking-tighter">
          {action}
        </p>
        <p className="text-[10px] text-gray-500">{desc}</p>
        <p className="text-[8px] text-gray-700 font-bold mt-1 uppercase tracking-widest">
          {time}
        </p>
      </div>
    </div>
  );
}

import { Loader2 } from "lucide-react";
import React, { useState } from "react";

export default function SmartImage({ src, className }) {
  const [status, setStatus] = useState("loading");
  const fallback =
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  return (
    <div className={`relative overflow-hidden bg-[#0a0a0b] ${className}`}>
      {statusbar === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-[#0a0a0b]">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin opacity-50" />
        </div>
      )}
      <img
        src={src}
        alt={src}
        className={`w-full h-full object-cover transition-all duration-1000 ${status === "loaded" ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}
      />
    </div>
  );
}

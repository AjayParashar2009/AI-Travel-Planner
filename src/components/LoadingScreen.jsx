import React from "react";
import { Globe, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#020203] flex items-center justify-center">
      <div className="flex flex-col items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center mb-6"
        >
          <Globe size={28} className="text-blue-500 animate-pulse" />
        </motion.div>

        {/* Brand */}
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">
          Wander <span className="text-blue-600 not-italic">AI.</span>
        </h1>

        {/* Loading indicator */}
        <div className="flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
          <Loader2 size={13} className="text-blue-500 animate-spin" />
          Initializing System
        </div>

        {/* Progress line */}
        <div className="w-48 h-[2px] bg-white/5 mt-6 overflow-hidden rounded-full">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-full h-full bg-blue-600"
          />
        </div>
      </div>
    </div>
  );
}

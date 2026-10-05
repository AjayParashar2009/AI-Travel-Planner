// import React from "react";
// import { Globe, Loader2 } from "lucide-react";
// import { motion } from "framer-motion";

// export default function LoadingScreen() {
//   return (
//     <div className="fixed inset-0 z-[9999] bg-[#020203] flex items-center justify-center">
//       <div className="flex flex-col items-center">
//         {/* Logo */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center mb-6"
//         >
//           <Globe size={28} className="text-blue-500 animate-pulse" />
//         </motion.div>

//         {/* Brand */}
//         <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">
//           Wander <span className="text-blue-600 not-italic">AI.</span>
//         </h1>

//         {/* Loading indicator */}
//         <div className="flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
//           <Loader2 size={13} className="text-blue-500 animate-spin" />
//           Initializing System
//         </div>

//         {/* Progress line */}
//         <div className="w-48 h-[2px] bg-white/5 mt-6 overflow-hidden rounded-full">
//           <motion.div
//             initial={{ x: "-100%" }}
//             animate={{ x: "100%" }}
//             transition={{
//               duration: 1.2,
//               repeat: Infinity,
//               ease: "linear",
//             }}
//             className="w-full h-full bg-blue-600"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }





/*****************************************************************************/
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
          Yatra<span className="text-blue-600 not-italic">AI.</span>
        </h1>

        {/* Loading indicator */}
        <div className="flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
          <Loader2 size={13} className="text-blue-500 animate-spin" />
          Loading
        </div>

        {/* Three pulsing dots */}
        <div className="flex gap-1.5 mt-5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-1.5 h-1.5 rounded-full bg-blue-500"
            />
          ))}
        </div>
      </div>
    </div>
  );
}






/*****************************************************************************/
// import React from "react";
// import { Globe } from "lucide-react";
// import { motion } from "framer-motion";

// export default function LoadingScreen() {
//   return (
//     <div className="fixed inset-0 z-[9999] bg-[#020203] flex items-center justify-center">
//       <div className="flex flex-col items-center">
//         {/* Globe inside a rotating ring */}
//         <div className="relative w-20 h-20 mb-6">
//           {/* Outer rotating ring */}
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
//             className="absolute inset-0 rounded-full border-2 border-white/5 border-t-blue-500"
//           />

//           {/* Inner static circle with globe */}
//           <div className="absolute inset-2 rounded-full border border-white/10 flex items-center justify-center">
//             <Globe size={24} className="text-blue-500" />
//           </div>
//         </div>

//         {/* Brand */}
//         <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">
//           Yatra<span className="text-blue-600 not-italic">AI.</span>
//         </h1>

//         {/* Loading text */}
//         <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
//           Loading your data
//         </p>
//       </div>
//     </div>
//   );
// }


/*****************************************************************************/
// import React from "react";
// import { Globe } from "lucide-react";
// import { motion } from "framer-motion";

// export default function LoadingScreen() {
//   return (
//     <div className="fixed inset-0 z-[9999] bg-[#020203] flex items-center justify-center">
//       <div className="flex flex-col items-center">
//         {/* Logo — animates in with a slight bounce */}
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(37,99,235,0.3)]"
//         >
//           <Globe size={28} className="text-white" />
//         </motion.div>

//         {/* Brand — slides up after logo */}
//         <motion.h1
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.15 }}
//           className="text-3xl font-black italic uppercase tracking-tighter text-white"
//         >
//           Yatra<span className="text-blue-600 not-italic">AI.</span>
//         </motion.h1>

//         {/* Tagline */}
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5, delay: 0.3 }}
//           className="mt-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500"
//         >
//           Plan Smarter. Travel Better.
//         </motion.p>

//         {/* Progress bar */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.3, delay: 0.5 }}
//           className="w-52 h-[2px] bg-white/5 mt-8 overflow-hidden rounded-full"
//         >
//           <motion.div
//             initial={{ x: "-100%" }}
//             animate={{ x: "100%" }}
//             transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
//             className="w-full h-full bg-blue-600"
//           />
//         </motion.div>
//       </div>
//     </div>
//   );
// }
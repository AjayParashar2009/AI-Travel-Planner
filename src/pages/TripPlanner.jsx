import React from "react";
import Navbar from "../components/Navbar";
import {
  Activity,
  ArrowRight,
  Compass,
  Cpu,
  Layers,
  ShieldCheck,
  Target,
} from "lucide-react";
import ControlField from "../components/ControlField";
import DateInput from "../components/DateInput";
import Counter from "../components/Counter";
import PreviewStatus from "../components/PreviewStatus";
import { AnimatePresence, motion } from "framer-motion";

export default function TripPlanner() {
  return (
    <div className="h-screen bg-[#020203] text-gray-300 font-sans overflow-hidden flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden pt-20">
        <aside className="w-full lg:w-[35%] border-r border-white/5 bg-white/[0.01] p-8 flex-col overflow-y-auto custom-scrollbar">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2 text-blue-500">
              <Cpu size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                Planner Engin v4.0
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white italic uppercase">
              Route <span className="text-blue-600">Synthesis</span>
            </h1>
          </div>

          <form action="" className="space-y-8">
            {/* Destination */}
            <ControlField label="Target Sector">
              <div className="relative group">
                <Target
                  size={16}
                  className="absolute left-4 top-1/2 -translate-1/2 text-gray-600 group-focus-within:text-blue-500 transition-all"
                />
                <input
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-12 pr-4 font-bold text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-700 uppercase"
                  placeholder="E>G PARIS, FRANCE"
                />
              </div>
            </ControlField>
            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <DateInput label="Infiltration" />
              <DateInput label="Exertion" />
            </div>
            {/* Travelers */}

            <div className="grid grid-cols-2 gap-4">
              <Counter label="Adult units" />
              <Counter label="Child units" />
            </div>

            {/* Budget Terminal */}

            <ControlField label="fiscal Range (INR)">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-1">
                <input
                  type="number"
                  name=""
                  id=""
                  className="w-full bg-transparent py-3 px-4 font-mono text-lg font-bold text-center outline-none"
                />
                <ArrowRight size={12} className="text-gray-700" />
                <input
                  type="null"
                  className="w-full bg-transparent py-3 px-4 font-mono text-lg font-bold text-center outline-none text-blue-400"
                />
              </div>
            </ControlField>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-5 rounded-xl font-black text-lg uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-blue-600/10"
            >
              Initialize Generation
            </button>
          </form>

          {/* System Footer */}
          <div className="mt-auto pt-10 border-t border-white/5 flex items-center gap-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <ShieldCheck size={16} className="text-emerald-500" />
            </div>
            <p className="text-[9px] text-gray-500 leading-relaxed uppercase font-bold tracking-tight">
              Neural node encryption active. Path finding algorithms utilizing
              real-time global telemetry.
            </p>
          </div>
        </aside>
        {/* Right Panel */}
        <main className="flex-1 overflow-y-auto py-8 lg:p-12 custom-scrollbar bg-black">
          <div className="max-w-4xl mx-auto space-y-12">
            <section>
              <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Layers size={18} className="text-blue-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                    Experience Layers
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-blue-500/50">
                  Selected
                </span>
              </header>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Map Method */}
                <button
                  className={`group relative flex items-center gap-4 p-6 rounded-[2rem] border transition-all duration-300`}
                >
                  <span className={`text-2xl transition-all duration-500`}>
                    Icon
                  </span>
                  <div className="text-left">
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest`}
                    >
                      Item ID
                    </p>
                    <p className="text-[8px] text-gray-600 font-bold uppercase mt-0.5">
                      Vector Active
                    </p>
                  </div>
                  {/* Conditional Rendering */}
                  <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                </button>
              </div>
            </section>

            {/* Section Live preview Hud */}
            <section className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all">
                <Compass
                  size={100}
                  className="animate-[spin_10s_linear_infinite]"
                />
              </div>

              <div className="relative z-10">
                <div
                  className="flex
                items-center gap-3 mb-10"
                >
                  <Activity size={18} className="text-blue-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                    Mission Live Preview
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <PreviewStatus
                    label="Objective"
                    value="{}"
                    sub="Deployment Sector"
                  />
                  <PreviewStatus
                    label="Personal"
                    value="{}"
                    sub="Active Deployment"
                  />
                  <PreviewStatus
                    label="Duration"
                    value="{}"
                    sub="Temporal Cycle"
                  />
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {/* Conditional Rendering */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center"
        >
          <div className="relative mb-12">
            <div className="w-24 h-24 border border-blue-500/20 rounded-full border-t-blue-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border border-blue-500/10 rounded-full border-b-blue-500 animate-spin-slow" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-white font-black uppercase tracking-[0.6em] text-xs">
              Dummy Content
            </p>
            <p className="text-blue-500/40 font-mono text-[8px] uppercase">
              Bypassing Regional Firewalls...Done
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

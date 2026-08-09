import React from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CloudSun,
  Cpu,
  Fingerprint,
  Globe,
  Layers,
  Lock,
  Play,
  Radar,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: {
    once: true,
    amount: 0.2,
  },
  transition: {
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1],
  },
};

export default function Home() {
  return (
    <div>
      <Navbar />

      {/* Hero section */}
      <section className="relative pt-32 pb-20 px-6 border border-white/5 min-h-screen">
        <div className="absolute inset-0 bg-[url('/hero-bg.svg')] bg-cover bg-center opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 xl:gap-16 items-center relative z-10">
          <div className="w-full max-w-[700px]">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[0.9] text-white uppercase italic mb-6">
                Future of <br />
                <span className="text-blue-600 not-italic">Exploration</span>
              </h1>

              <p className="text-base md:text-lg text-gray-500 max-w-xl mb-8 font-medium">
                The world's first autonomous travel architect. We don't just
                book trips; we synthesize experiences using real-time global
                intelligence.
              </p>

              <div className="flex flex-wrap gap-3 md:gap-4">
                <a
                  href="#"
                  className="px-6 md:px-8 py-3 md:py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(37,99,235,0.2)] flex items-center gap-2"
                >
                  Initialize Mission
                  <ArrowRight size={16} />
                </a>

                <button className="px-6 md:px-8 py-3 md:py-4 border border-white/10 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all flex items-center gap-2">
                  <Play size={14} fill="currentColor" />
                  System Demo
                </button>
              </div>
            </motion.div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[480px] xl:max-w-[520px] rounded-[40px] overflow-hidden border border-white/10 bg-[#0a0a0b] shadow-2xl ml-auto">
              <img
                src="https://images.unsplash.com/photo-1618867374765-f7702badaf59?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Hero image showing futuristic travel exploration"
                className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[8px] font-black uppercase text-blue-400 tracking-widest">
                    Operation Sector
                  </span>
                </div>

                <p className="text-lg md:text-xl font-black italic text-white uppercase leading-tight">
                  Patagonia Ride Expedition
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tactical Modules Updates */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <motion.div
            {...fadeInUp}
            className="md:col-span-8 bg-[#08080a] border border-white/5 rounded-[3rem] p-8 group overflow-hidden relative"
          >
            <div className="flex justify-between items-start mb-12">
              <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20 group-hover:scale-110 transition-all duration-500">
                <Cpu size={32} className="text-blue-50" />
              </div>
              <div className="text-right">
                <span className="block text-[9px] font-black text-blue-500 uppercase tracking-[0.4em]">
                  Process Node
                </span>
                <span className="block text-[8px] font-mono text-gray-700 uppercase tracking-widest">
                  Latency:0.82ms
                </span>
              </div>
            </div>
            <h3 className="text-4xl font-black text-white italic uppercase mb-4 tracking-tighter">
              Neural <br /> <span>Synthesis</span>
            </h3>
            <p className="text-gray-500 text-lg max-w-md font-medium leading-relaxed">
              Autonomous multi-vector routing. Our engine generates 14-day
              itineraries across global nodes in under 800ms.
            </p>
            <div className="absolute -right-20 -bottom-10 z-0 text-white/5 group-hover:text-white/10 transition-all duration-500 pointer-events-none">
              <Zap size={400} strokeWidth={1} />
            </div>
          </motion.div>

          {/* Vibe Check */}
          <motion.div
            {...fadeInUp}
            className="md:col-span-4 bg-[#0a0505] border border-red-900/10 rounded-[3rem] p-8 flex flex-col justify-between group hover:border-red-600/30 transition-all"
          >
            <div className="relative">
              <Activity className="text-red-600 animate-pulse" size={36} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white uppercase italic mb-2">
                Vibe-Check
              </h3>
              <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest leading-relaxed">
                Sentiment analysis of local hotspots and urban density.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vertical Highlight */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <motion.div
            {...fadeInUp}
            className="md:col-span-4 bg-blue-600 rounded-[3rem] p-8 relative overflow-hidden hover:shadow-[0_0_50px_rgba(37,99,235,0.15)]"
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <ShieldCheck
                size={48}
                className="text-white group-hover:rotate-12 transition-all duration-500"
              />
              <h3 className="text-3xl font-black text-white italic uppercase mb-3 tracking-tighter">
                SafeNode <br />
                Protocol
              </h3>
              <p className="text-blue-100 text-xs font-bold uppercase tracking-widest opacity-80">
                Tracking 4K+ nodes for maximum environment stability.
              </p>
            </div>
            <Globe
              size={280}
              className="absolute -bottom-20 -right-20 text-white/10 animate-spin-slow pointer-events-none"
            />
          </motion.div>

          {/* Encryption */}
          <motion.div
            {...fadeInUp}
            className="md:col-span-8 bg-[#08080a] border border-white/5 rounded-[3rem] p-8 flex items-center justify-between group relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-blue-600" />
                <span className="text-[9px] font-black uppercase text-blue-500 tracking-[0.3em]">
                  Security Uplink
                </span>
              </div>

              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">
                256-bit AES
              </h3>

              <div className="flex gap-4">
                <Fingerprint className="text-blue-600/40" size={20} />
                <Lock className="text-blue-600/40" size={20} />
              </div>
            </div>
            <Layers
              size={160}
              className="text-blue-600/5 group-hover:text-blue-600/10 group-hover:rotate-90 transition-all duration-1000 mr-6"
            />
          </motion.div>

          {/* Curation */}
          <motion.div
            {...fadeInUp}
            className="md:col-span-12 bg-[#0a0a05] border border-yellow-900/10 rounded-[3rem] p-8 flex items-center justify-between group hover:bg-yellow-950/5 transition-all"
          >
            <div className="flex items-center gap-6">
              <Star
                size={36}
                className="text-yellow-600 group-hover:rotate-180 transition-all duration-700"
              />
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-widest">
                  Curated Excellence
                </h3>
                <p className="text-[8px] text-yellow-600/50 font-mono mt-1 font-bold uppercase tracking-[0.2em]">
                  Verified Excellence
                </p>
              </div>
            </div>
            <div className="hidden md:flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-6 h-1 bg-yellow-600 -translate-x-full group-hover:translate-x-0 transition-all duration-500"
                  style={{ transitionDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Autonomous Logistic */}
      <section className="py-20 px-6 bg-[#050507] border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeInUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg mb-6">
              <Cpu size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Logic Engine
              </span>
            </div>
            <h2 className="text-5xl font-black text-white italic uppercase mb-8 leading-none">
              Autonomous
              <br />
              Logistics
            </h2>
            <div className="space-y-8">
              {[
                {
                  s: "01",
                  t: "Constrain Ingestion",
                  d: "Specify budget, duration, and sensory preferences.",
                },
                {
                  s: "02",
                  t: "Vector Synthesis",
                  d: "AI cross-references millions of data points for optimal paths.",
                },
                {
                  s: "03",
                  t: "Live Deployment",
                  d: "Dynamic updates sent to your device every 60 seconds.",
                },
              ].map((step, i) => (
                <div key={i} className="flex gap-6 group">
                  <span className="text-blue-600 font-black text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                    {step.s}
                  </span>
                  <div>
                    <h4 className="text-xl font-black text-white italic uppercase mb-1 tracking-tighter">
                      {step.t}
                    </h4>
                    <p className="text-gray-500 text-base">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Autonomous logistics visualization"
              className="rounded-[3rem] grayscale opacity-40 border border-white/10"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-8 bg-blue-600/10 backdrop-blur-3xl rounded-full border border-blue-500/20 shadow-2xl animate-pulse">
                <Activity size={48} className="text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Atmospheric */}
      <section className="py-32 relative overflow-hidden text-center px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent" />
        <motion.div {...fadeInUp} className="relative z-10">
          <CloudSun size={72} className="text-blue-500 mx-auto mb-8" />
          <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter mb-6 leading-none">
            Atmospheric <br /> Awareness
          </h2>
          <p className="text-gray-500 text-2xl leading-relaxed max-w-3xl mx-auto font-medium">
            We track weather and political tides, rerouting your journey if
            conditions become sub-optimal. Your mission never static.
          </p>
        </motion.div>
      </section>

      {/* Global Deployments */}
      <section className="py-20 px-6 bg-[#050507]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-5xl font-black text-white italic uppercase leading-none">
              Global <br />{" "}
              <span className="text-blue-600 not-italic">Deployments.</span>
            </h2>
            <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2 text-blue-500 text-[9px] font-black tracking-widest uppercase">
              <Radar size={14} className="animate-spin-slow" />
              Live
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                img: "https://images.unsplash.com/photo-1715607817921-aa6417a19dbd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                title: "Shibuya Crossing",
                loc: "Tokyo, JP",
              },
              {
                img: "https://plus.unsplash.com/premium_photo-1732568404499-8561e0788a13?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                title: "Glenfinnan Viaduct",
                loc: "Scotland, UK",
              },
              {
                img: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=683&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                title: "Venice Canal",
                loc: "Venice, IT",
              },
            ].map((node, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                className="group relative h-[500px] rounded-[3rem] overflow-hidden border border-white/5"
              >
                <div className="group relative rounded-[3rem] overflow-hidden border border-white/5">
                  <img
                    src={node.img}
                    alt={node.title}
                    className="w-full grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-8 left-8">
                    <p className="text-blue-500 font-black uppercase tracking-[0.3rem] text-[9px] mb-1">
                      {node.loc}
                    </p>
                    <h4 className="text-3xl text-white font-black italic uppercase">
                      {node.title}
                    </h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Satellite Network */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Satellite network visualization"
              className="rounded-[3rem] border border-white/10 mix-blend-screen opacity-50"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-6 leading-none">
              Global Linkage Protocol
            </h2>
            <p className="text-gray-500 text-base mb-8 font-medium">
              WanderAI connects to a mesh network of 400+ satellites to ensure
              your itinerary is updated even in zero-connectivity deadzones.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white/5 rounded-3xl">
                <h4 className="text-white font-black uppercase text-[10px] mb-1 tracking-widest">
                  Uptime
                </h4>
                <p className="text-2xl font-black text-blue-600 italic">
                  99.99%
                </p>
              </div>
              <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                <h4 className="text-white font-black uppercase text-[10px] mb-1 tracking-widest">
                  Latency
                </h4>
                <p className="text-2xl font-black text-blue-600 italic">12ms</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terminal */}
      <section className="py-20 px-6 bg-[#030305]">
        <div className="max-w-5xl mx-auto bg-black rounded-[2.5rem] border border-white/10 p-8 font-mono shadow-2xl relative">
          <div className="flex gap-2 mb-6 border-b border-white/5 pb-3">
            <div className="w-3 h-3 rounded-full bg-red-500/20" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
            <div className="w-3 h-3 rounded-full bg-green-500/20" />
          </div>
          <div className="space-y-3 text-sm">
            <p className="text-blue-500 text-xs">
              [{">"}] Initializing Global Routing Table
            </p>
            <p className="text-gray-500 text-xs">
              [{">"}] Fetching Real-Time Pricing (Flight_ID: AX-902)
            </p>
            <p className="text-emerald-500 text-xs">
              [{">"}] OPTIMAL PATH DISCOVERED: 0.82s Total Processing Time
            </p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="pt-40 pb-32 px-6 text-center">
        <motion.div {...fadeInUp}>
          <h2 className="text-7xl md:text-[100px] font-black text-white uppercase italic tracking-tighter mb-12 leading-[0.8]">
            Plan Less <br />{" "}
            <span className="text-blue-600 not-italic">Explore more</span>
          </h2>
          <a
            href="#"
            className="px-16 py-8 bg-white text-black rounded-2xl text-xl font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-4 shadow-[0_40px_80px_rgba(255,255,255,0.1)] inline-block"
          >
            Initialize Mission
          </a>
        </motion.div>
      </section>

      {/* Footer Final */}
      <footer className="py-12 px-6 border-t border-white/5 bg-black relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-black text-white uppercase italic tracking-tighter">
            Wander <span className="text-blue-600">AI</span>
          </div>
          <div className="flex gap-8 text-[9px] font-black text-gray-600 uppercase tracking-[0.4em]">
            <a
              href="#"
              className="text-blue-500 transition-colors hover:text-blue-400"
            >
              Safety
            </a>
            <a
              href="#"
              className="text-blue-500 transition-colors hover:text-blue-400"
            >
              Network
            </a>
            <a
              href="#"
              className="text-blue-500 transition-colors hover:text-blue-400"
            >
              Privacy
            </a>
          </div>
          <p className="text-gray-500 text-xs">
            &copy; Distribution Architecture // Encrypted Mission Data
          </p>
        </div>
      </footer>
    </div>
  );
}

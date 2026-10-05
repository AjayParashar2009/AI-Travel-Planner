import React from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  CloudSun,
  Cpu,
  Globe,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

// Reusable fade-in-up animation for scroll-triggered sections
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

export default function Home() {
  return (
    <div>
      <Navbar />

      {/* Hero section — main headline and CTA */}
      <section className="relative pt-32 pb-20 px-6 border-b border-white/5 min-h-screen">
        <div className="absolute inset-0 bg-[url('/hero-bg.svg')] bg-cover bg-center opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 xl:gap-16 items-center relative z-10">
          {/* Hero copy */}
          <div className="w-full max-w-[700px]">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[0.9] text-white uppercase italic mb-6">
                Plan Smarter.
                <br />
                <span className="text-blue-600 not-italic">Travel Better.</span>
              </h1>

              <p className="text-base md:text-lg text-gray-400 max-w-xl mb-8 font-medium leading-relaxed">
                YatraAI builds a personalised day-by-day itinerary for your trip
                — based on your destination, budget, and travel style.
              </p>

              <div className="flex flex-wrap gap-3 md:gap-4">
                {/* Primary CTA — go to plan page */}
                <Link
                  to="/plan"
                  className="px-6 md:px-8 py-3 md:py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(37,99,235,0.2)] flex items-center gap-2"
                >
                  Plan a Trip
                  <ArrowRight size={16} />
                </Link>

                {/* Secondary CTA — link to dashboard */}
                <Link
                  to="/dashboard"
                  className="px-6 md:px-8 py-3 md:py-4 border border-white/10 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all flex items-center gap-2"
                >
                  Try It Free
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Hero image with caption */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[480px] xl:max-w-[520px] rounded-[40px] overflow-hidden border border-white/10 bg-[#0a0a0b] shadow-2xl ml-auto">
              <img
                src="https://images.unsplash.com/photo-1618867374765-f7702badaf59?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Scenic travel destination"
                className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={12} className="text-blue-400" />
                  <span className="text-[9px] font-black uppercase text-blue-400 tracking-widest">
                    Featured Destination
                  </span>
                </div>
                <p className="text-lg md:text-xl font-black italic text-white uppercase leading-tight">
                  Patagonia, Argentina
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features row — three cards */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Feature 1 — how it works (wide) */}
          <motion.div
            {...fadeInUp}
            className="md:col-span-8 bg-[#08080a] border border-white/5 rounded-[3rem] p-8 group overflow-hidden relative"
          >
            <div className="flex justify-between items-start mb-12">
              <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20 group-hover:scale-110 transition-all duration-500">
                <Cpu size={32} className="text-blue-400" />
              </div>
            </div>
            <h3 className="text-4xl font-black text-white italic uppercase mb-4 tracking-tighter">
              Smart
              <br />
              <span>Itineraries</span>
            </h3>
            <p className="text-gray-400 text-lg max-w-md font-medium leading-relaxed">
              Enter your destination, budget, and travel dates. Our AI builds a
              full day-by-day plan in seconds.
            </p>
            <div className="absolute -right-20 -bottom-10 z-0 text-white/5 group-hover:text-white/10 transition-all duration-500 pointer-events-none">
              <Sparkles size={400} strokeWidth={1} />
            </div>
          </motion.div>

          {/* Feature 2 — local insights */}
          <motion.div
            {...fadeInUp}
            className="md:col-span-4 bg-[#0a0505] border border-red-900/10 rounded-[3rem] p-8 flex flex-col justify-between group hover:border-red-600/30 transition-all"
          >
            <div className="relative">
              <Activity className="text-red-500" size={36} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white uppercase italic mb-2">
                Local Insights
              </h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                Get tips about local customs, food, and hidden costs before you
                arrive.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Second feature row */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Feature 3 — travel safety (highlighted) */}
          <motion.div
            {...fadeInUp}
            className="md:col-span-4 bg-blue-600 rounded-[3rem] p-8 relative overflow-hidden hover:shadow-[0_0_50px_rgba(37,99,235,0.15)]"
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <ShieldCheck size={48} className="text-white" />
              <h3 className="text-3xl font-black text-white italic uppercase mb-3 tracking-tighter">
                Travel
                <br />
                Safety
              </h3>
              <p className="text-blue-100 text-xs font-bold uppercase tracking-widest opacity-90">
                Safety tips and advisories for your destination, built into
                every plan.
              </p>
            </div>
            <Globe
              size={280}
              className="absolute -bottom-20 -right-20 text-white/10 pointer-events-none"
            />
          </motion.div>

          {/* Feature 4 — security */}
          <motion.div
            {...fadeInUp}
            className="md:col-span-8 bg-[#08080a] border border-white/5 rounded-[3rem] p-8 flex items-center justify-between group relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-blue-600" />
                <span className="text-[9px] font-black uppercase text-blue-500 tracking-[0.3em]">
                  Your Data
                </span>
              </div>

              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">
                Secure by Default
              </h3>
              <p className="text-gray-500 text-sm font-medium max-w-md">
                Your trips and personal details are stored privately on your
                account.
              </p>
            </div>
          </motion.div>

          {/* Feature 5 — recommendations */}
          <motion.div
            {...fadeInUp}
            className="md:col-span-12 bg-[#0a0a05] border border-yellow-900/10 rounded-[3rem] p-8 flex items-center justify-between group hover:bg-yellow-950/5 transition-all"
          >
            <div className="flex items-center gap-6">
              <Star
                size={36}
                className="text-yellow-500 group-hover:rotate-180 transition-all duration-700"
              />
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-widest">
                  Handpicked Recommendations
                </h3>
                <p className="text-[10px] text-yellow-600/70 mt-1 font-bold uppercase tracking-[0.2em]">
                  Every trip tailored to your interests
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works — three steps with image */}
      <section className="py-20 px-6 bg-[#050507] border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeInUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg mb-6">
              <Cpu size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                How It Works
              </span>
            </div>
            <h2 className="text-5xl font-black text-white italic uppercase mb-8 leading-none">
              Three Simple
              <br />
              Steps
            </h2>
            <div className="space-y-8">
              {[
                {
                  s: "01",
                  t: "Enter your details",
                  d: "Destination, budget, duration, and travel style.",
                },
                {
                  s: "02",
                  t: "AI plans your trip",
                  d: "We generate a day-by-day itinerary matched to your inputs.",
                },
                {
                  s: "03",
                  t: "Get your itinerary",
                  d: "Review, adjust, and export your trip as a PDF.",
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
              alt="Trip planning illustration"
              className="rounded-[3rem] grayscale opacity-40 border border-white/10"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-8 bg-blue-600/10 backdrop-blur-3xl rounded-full border border-blue-500/20 shadow-2xl">
                <Activity size={48} className="text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weather-aware planning */}
      <section className="py-32 relative overflow-hidden text-center px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent" />
        <motion.div {...fadeInUp} className="relative z-10">
          <CloudSun size={72} className="text-blue-500 mx-auto mb-8" />
          <h2 className="text-5xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-6 leading-none">
            Weather-Aware <br /> Planning
          </h2>
          <p className="text-gray-400 text-xl leading-relaxed max-w-3xl mx-auto font-medium">
            Travel plans shouldn't fall apart when it rains. We factor in
            weather and local conditions so you always have a backup.
          </p>
        </motion.div>
      </section>

      {/* Popular destinations */}
      <section className="py-20 px-6 bg-[#050507]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-5xl font-black text-white italic uppercase leading-none">
              Popular
              <br />
              <span className="text-blue-600 not-italic">Destinations.</span>
            </h2>
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
            ].map((place, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                className="group relative h-[500px] rounded-[3rem] overflow-hidden border border-white/5"
              >
                <img
                  src={place.img}
                  alt={place.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-8 left-8">
                  <p className="text-blue-500 font-black uppercase tracking-[0.3rem] text-[9px] mb-1">
                    {place.loc}
                  </p>
                  <h4 className="text-3xl text-white font-black italic uppercase">
                    {place.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final call to action */}
      <section className="pt-40 pb-32 px-6 text-center">
        <motion.div {...fadeInUp}>
          <h2 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter mb-12 leading-[0.9]">
            Plan Less.
            <br />
            <span className="text-blue-600 not-italic">Explore More.</span>
          </h2>
          <Link
            to="/plan"
            className="px-16 py-8 bg-white text-black rounded-2xl text-xl font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-2 shadow-[0_40px_80px_rgba(255,255,255,0.1)] inline-block"
          >
            Get Started
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-black text-white uppercase italic tracking-tighter">
            Yatra<span className="text-blue-600">AI</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-blue-400 transition-colors">
              About
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Privacy
            </a>
          </div>
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} YatraAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

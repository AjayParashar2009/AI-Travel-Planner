import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import {
  Building2,
  Calendar,
  Coffee,
  MapPin,
  Moon,
  Share2,
  ShieldCheck,
  Sun,
  TrainFront,
  Users,
  Wallet,
} from "lucide-react";
import HeaderBade from "../components/HeaderBade";
import TimeLineCard from "../components/TimeLineCard";
import AiInsightCard from "../components/AiInsightCard";
import MapView from "../components/MapView";
import LogisticRow from "../components/LogisticRow";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { tripAPI } from "../services/api";
import LoadingScreen from "../components/LoadingScreen";
import ExportPDFButton from "../components/ExportPDFButton";

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(0);

  // 🛑 FIX: Change to null instead of 0 to avoid passing invalid string to map
  const [mapFocus, setMapFocus] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await tripAPI.getById(id);
        const data = res.data?.trip || res.data || res;
        setTrip(data);
      } catch (error) {
        toast.error("Trip data unavailable");
        navigate("/trips");
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id, navigate]);

  const totalCost = useMemo(() => {
    if (!trip?.itinerary?.days) return 0;
    return trip.itinerary.days.reduce((acc, day) => {
      return (
        acc +
        (parseFloat(day.morning?.estimatedCost) || 0) +
        (parseFloat(day.afternoon?.estimatedCost) || 0) +
        (parseFloat(day.evening?.estimatedCost) || 0)
      );
    }, 0);
  }, [trip]);

  if (loading) return <LoadingScreen />;
  if (!trip) return null;

  const { destination, itinerary, input, logistics, insights } = trip;
  const cityName = destination.split(",")[0].trim();
  const currentDay = itinerary?.days?.[activeDay];

  return (
    <div className="min-h-screen bg-[#050506] text-white font-sans selection:bg-blue-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[70vh] w-full flex items-end pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1121&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Travel destination"
            className="w-full h-full object-cover scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#050506] via-[#050506]/40 to-transparent" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1.5 bg-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-600/20">
                Confirmed Trip
              </span>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <MapPin size={14} className="text-blue-500" />
                {destination}
              </p>
            </div>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic leading-[0.85] mb-10">
              {cityName} <span className="text-blue-600">.</span>
            </h1>
            <div className="flex flex-wrap items-center gap-6">
              <HeaderBade
                icon={Calendar}
                label="duration"
                value={`${itinerary?.days?.length} Days`}
              />
              <HeaderBade
                icon={Users}
                label="Group"
                value={input?.numTravelers}
              />
              <div className="bg-blue-600/10 backdrop-blur-xl border border-blue-500/30 px-6 py-3 rounded-2xl flex items-center gap-4 group-hover:bg-blue-600/20 transition-all shadow-2xl">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <Wallet size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-blue-400 uppercase tracking-[0.2]">
                    Total Investment
                  </span>
                  <span className="text-xl font-black text-white tracking-tighter">
                    ₹{totalCost.toLocaleString()}
                    <span className="text-[10px] text-blue-400 ml-2 font-bold uppercase italic">
                      {input?.budget}
                    </span>
                  </span>
                </div>
              </div>

              <div className="ml-auto flex gap-3">
                {/* PDF Component */}
                <ExportPDFButton tripData={trip} />
                <button
                  className="p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/20 transition-all"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link shared");
                  }}
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Content Grid */}

      <main className="container mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-12">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-white/5 scrollbar-hide">
            {/* Map Method */}
            {itinerary?.days?.map((_, i) => (
              <button
                key={i}
                className={`px-8 py-4 rounded-2xl text-xs font-black uppercase transition-all whitespace-nowrap ${activeDay === i ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" : "bg-white/5 text-gray-500 hover:text-white"}`}
                onClick={() => setActiveDay(i)}
              >
                Day {i + 1}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <TimeLineCard
              time="09:30 AM"
              period="Morning"
              icon={Sun}
              data={currentDay?.morning}
              onFocus={() => setMapFocus("morning")}
            />

            <TimeLineCard
              time="01:30 PM"
              period="Afternoon"
              icon={Coffee}
              data={currentDay?.afternoon}
              onFocus={() => setMapFocus("afternoon")}
            />

            <TimeLineCard
              time="08:30 PM"
              period="Evening"
              icon={Moon}
              data={currentDay?.evening}
              onFocus={() => setMapFocus("evening")}
            />
          </div>

          {/* 🛑 FIX FOR KEY WARNING: Pass insights safely or fallback to empty array */}
          <AiInsightCard insights={insights || []} />
        </div>
        {/* Right Side */}
        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-24 space-y-8">
            {/* Map */}
            <div className="h-[400px] bg-black rounded-[2.5rem] overflow-hidden border border-white/10 relative shadow-2xl">
              <MapView
                destination={destination}
                itinerary={itinerary}
                activeDay={activeDay}
                focusLocation={mapFocus}
              />
            </div>

            {/* Operations Hub */}
            <div className="bg-[#0a0a0b] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[100px] rounded-full" />

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4rem] mb-6">
                  Operations Hub
                </h3>

                <div className="space-y-6">
                  <LogisticRow
                    icon={Building2}
                    label="Accommodation"
                    value={logistics?.hotel || `Boutique Stay in ${cityName}`}
                  />
                  <LogisticRow
                    icon={TrainFront}
                    label="Transit Network"
                    value={logistics?.transport || `Local Integrated Transit`}
                  />
                </div>
              </div>
              <div className="p-8 border-t border-white/5 space-y-6">
                <h3 className="text[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
                  Essential Intel
                </h3>
                <LogisticRow
                  icon={ShieldCheck}
                  label="Safety Protocol"
                  value="Region Verified -Safe"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

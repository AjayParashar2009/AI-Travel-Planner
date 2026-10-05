import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  Activity,
  ArrowRight,
  Compass,
  Layers,
  Loader2,
  ShieldCheck,
  Target,
} from "lucide-react";
import ControlField from "../components/ControlField";
import DateInput from "../components/DateInput";
import Counter from "../components/Counter";
import PreviewStatus from "../components/PreviewStatus";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { tripAPI } from "../services/api";

// Interest options shown as buttons in the right panel
const INTERESTS = [
  { id: "Nature", icon: "🌲" },
  { id: "Food", icon: "🍛" },
  { id: "Culture", icon: "🏛️" },
  { id: "Shopping", icon: "🛍️" },
  { id: "Nightlife", icon: "🌃" },
  { id: "Adventure", icon: "🏔️" },
  { id: "History", icon: "📜" },
  { id: "Art", icon: "🎨" },
  { id: "Beaches", icon: "🏖️" },
];

// Loading messages shown while generating
const LOADING_PHASE = [
  "Finding places to visit…",
  "Estimating costs…",
  "Putting your trip together…",
];

export default function TripPlanner() {
  const navigate = useNavigate();

  // Loading and phase state
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);

  // Form state
  const [form, setForm] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    adults: 2,
    kids: 0,
    budgetMin: 1500,
    budgetMax: 4500,
    interest: [],
  });

  // Cycle through loading messages every 2 seconds
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingPhase((prev) => (prev + 1) % LOADING_PHASE.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  // Toggle an interest on/off
  const toggleInterest = (id) => {
    setForm((f) => ({
      ...f,
      interest: f.interest.includes(id)
        ? f.interest.filter((i) => i !== id)
        : [...f.interest, id],
    }));
  };

  // Handle form submit — generate a trip
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate destination
    if (!form.destination.trim()) {
      toast.error("Please enter a destination");
      return;
    }

    // Validate dates
    if (!form.startDate || !form.endDate) {
      toast.error("Please pick start and end dates");
      return;
    }

    // Validate budget range
    if (Number(form.budgetMin) > Number(form.budgetMax)) {
      toast.error("Minimum budget cannot be higher than maximum");
      return;
    }

    setLoading(true);
    setLoadingPhase(0);

    try {
      // Calculate number of days between start and end
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      const duration =
        Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) || 1;

      // Call the API to generate the trip
      const res = await tripAPI.generate({
        destination: form.destination,
        inputs: {
          startDate: form.startDate,
          endDate: form.endDate,
          duration,
          numTravelers: form.adults + form.kids,
          travelStyle: "Balanced",
          interest: form.interest,
          budgetMin: Number(form.budgetMin) || 0,
          budgetMax: Number(form.budgetMax) || 0,
        },
      });

      // Extract the trip from the response
      const trip = res?.data?.trip ?? res?.data?.Trip ?? res?.data;
      if (!trip?._id) throw new Error("No trip returned");

      // Navigate to the trip details page
      navigate(`/trip/${trip._id}`);
    } catch (error) {
      setLoading(false);
      setLoadingPhase(0);
      toast.error("Could not generate the trip. Please try again.");
    }
  };

  return (
    <div className="h-screen bg-[#020203] text-gray-300 font-sans overflow-hidden flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden pt-20">
        {/* Left sidebar — form */}
        <aside className="w-full lg:w-[35%] border-r border-white/5 bg-white/[0.01] p-8 flex flex-col overflow-y-auto custom-scrollbar">
          {/* Heading */}
          <div className="mb-10">
            <h1 className="text-3xl font-black tracking-tight text-white italic uppercase">
              Plan Your <span className="text-blue-600">Trip</span>
            </h1>
            <p className="text-xs text-gray-500 mt-2">
              Tell us where and when — we'll do the rest
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Destination */}
            <ControlField label="Destination">
              <div className="relative group">
                <Target
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-all"
                />
                <input
                  type="text"
                  value={form.destination}
                  onChange={(e) =>
                    setForm({ ...form, destination: e.target.value })
                  }
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 font-bold text-white outline-none uppercase focus:border-blue-500/50 transition-all placeholder:text-gray-700"
                  placeholder="e.g. Paris, France"
                />
              </div>
            </ControlField>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <DateInput
                label="Start Date"
                value={form.startDate}
                onChange={(v) => setForm({ ...form, startDate: v })}
              />
              <DateInput
                label="End Date"
                value={form.endDate}
                onChange={(v) => setForm({ ...form, endDate: v })}
              />
            </div>

            {/* Travelers */}
            <div className="grid grid-cols-2 gap-4">
              <Counter
                label="Adults"
                value={form.adults}
                setter={(v) => setForm({ ...form, adults: v })}
              />
              <Counter
                label="Children"
                value={form.kids}
                setter={(v) => setForm({ ...form, kids: v })}
              />
            </div>

            {/* Budget range */}
            <ControlField label="Budget Range (₹)">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-1">
                <input
                  type="number"
                  className="w-full bg-transparent py-3 px-4 font-mono text-lg font-bold text-center outline-none text-white"
                  value={form.budgetMin}
                  onChange={(e) =>
                    setForm({ ...form, budgetMin: Number(e.target.value) })
                  }
                />
                <ArrowRight size={12} className="text-gray-700 shrink-0" />
                <input
                  type="number"
                  className="w-full bg-transparent py-3 px-4 font-mono text-lg font-bold text-center outline-none text-blue-400"
                  value={form.budgetMax}
                  onChange={(e) =>
                    setForm({ ...form, budgetMax: Number(e.target.value) })
                  }
                />
              </div>
            </ControlField>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-xl font-black text-lg uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-blue-600/10 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Generate Itinerary <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Sidebar footer */}
          <div className="mt-auto pt-10 border-t border-white/5 flex items-center gap-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg shrink-0">
              <ShieldCheck size={16} className="text-emerald-500" />
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Your trip is generated using AI and saved to your account.
            </p>
          </div>
        </aside>

        {/* Right panel — interests and preview */}
        <main className="flex-1 overflow-y-auto py-8 lg:p-12 custom-scrollbar bg-black">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Interests */}
            <section>
              <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Layers size={18} className="text-blue-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                    Your Interests
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-blue-500/70">
                  {form.interest.length} selected
                </span>
              </header>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {INTERESTS.map((item) => {
                  const active = form.interest.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`group relative flex items-center gap-4 p-6 rounded-[2rem] border transition-all duration-300 ${
                        active
                          ? "bg-blue-600/10 border-blue-500/50"
                          : "bg-white/[0.02] border-white/5 hover:border-white/20"
                      }`}
                      onClick={() => toggleInterest(item.id)}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <p
                        className={`text-[10px] font-black uppercase tracking-widest ${
                          active ? "text-blue-400" : "text-gray-400"
                        }`}
                      >
                        {item.id}
                      </p>
                      {active && (
                        <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Live preview */}
            <section className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all pointer-events-none">
                <Compass
                  size={100}
                  className="animate-[spin_10s_linear_infinite]"
                />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-10">
                  <Activity size={18} className="text-blue-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                    Trip Preview
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <PreviewStatus
                    label="Destination"
                    value={form.destination || "Not set"}
                    sub="Where you're going"
                  />
                  <PreviewStatus
                    label="Travelers"
                    value={`${form.adults + form.kids} ${
                      form.adults + form.kids === 1 ? "person" : "people"
                    }`}
                    sub="Adults + children"
                  />
                  <PreviewStatus
                    label="Duration"
                    value={
                      form.startDate && form.endDate
                        ? `${Math.max(
                            1,
                            Math.ceil(
                              Math.abs(
                                new Date(form.endDate) -
                                  new Date(form.startDate),
                              ) / 86400000,
                            ),
                          )} days`
                        : "Not set"
                    }
                    sub="From start to end date"
                  />
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            {/* Spinner */}
            <div className="relative mb-12">
              <div className="w-24 h-24 border border-blue-500/20 rounded-full border-t-blue-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border border-blue-500/10 rounded-full border-b-blue-500 animate-spin" />
              </div>
            </div>

            {/* Loading message */}
            <div className="text-center space-y-2">
              <p className="text-white font-black uppercase tracking-[0.6em] text-xs">
                {LOADING_PHASE[loadingPhase]}
              </p>
              <p className="text-blue-500/50 text-[10px]">
                This may take a few seconds
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

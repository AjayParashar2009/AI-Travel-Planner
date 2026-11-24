import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { AnimatePresence, motion } from "framer-motion";
import SmartImage from "../components/SmartImage";
import Matrix from "../components/Matrix";
import {
  ArrowRight,
  Calendar,
  Loader2,
  Monitor,
  Plus,
  Trash,
  Users,
} from "lucide-react";
import { tripAPI } from "../services/api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import useUnsplashImage from "../hooks/useUnsplashImage"; // <-- Import the hook

// Helper component to handle the image fetching for each trip
function TripImage({ destination, type, className }) {
  const imageUrl = useUnsplashImage(destination);

  // Fallback if the API takes too long or fails
  const fallback = `https://picsum.photos/seed/${encodeURIComponent(destination || "travel")}/${type === "hero" ? "1200/800" : "400/400"}`;

  return <SmartImage src={imageUrl || fallback} className={className} />;
}

export default function SavedTrips() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await tripAPI.getHistory();
        const list = Array.isArray(data) ? data : data.trips || [];
        setTrips(list);
        if (list.length > 0) setSelectedTrip(list[0]);
      } catch (error) {
        toast.error("Could not load your trips");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this trip? This cannot be undone.")) return;

    setDeleting(id);
    try {
      await tripAPI.delete(id);
      const updated = trips.filter((t) => t._id !== id);
      setTrips(updated);
      if (selectedTrip?._id === id) setSelectedTrip(updated[0] || null);
      toast.success("Trip deleted");
    } catch (error) {
      toast.error("Could not delete the trip");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#070708] text-[#fafafa] font-sans selection:bg-blue-500/30 overflow-hidden">
      <Navbar />

      <main className="flex h-screen pt-20">
        {/* Left panel — detail view */}
        <section className="hidden lg:flex flex-[1.4] relative border-r border-white/5 overflow-hidden bg-[#0a0a0b]">
          <AnimatePresence mode="wait">
            {selectedTrip ? (
              <motion.div
                key={selectedTrip._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col relative"
              >
                {/* Background image */}
                <div className="absolute inset-0 z-0">
                  <TripImage
                    destination={selectedTrip.destination}
                    type="hero"
                    className="w-full h-full opacity-30 grayscale-[0.2]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#070708] via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 p-16 flex flex-col h-full">
                  <header>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-px bg-blue-500" />
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">
                        Trip #{selectedTrip._id.slice(-6)}
                      </span>
                    </div>
                    <h2 className="text-7xl xl:text-8xl font-black tracking-tighter uppercase italic leading-[0.85] mt-6">
                      {selectedTrip.destination?.split(",")[0] || "Untitled"}
                    </h2>
                  </header>

                  <div className="mt-auto grid grid-cols-2 gap-8 border-t border-white/10 pt-12 pb-8">
                    <Matrix
                      label="Duration"
                      value={`${selectedTrip.inputs?.duration || "—"} Days`}
                      icon={Calendar}
                    />
                    <Matrix
                      label="Travelers"
                      value={
                        selectedTrip.inputs?.numTravelers?.toLocaleString() ||
                        "—"
                      }
                      icon={Users}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Link
                      to={`/trip/${selectedTrip._id}`}
                      className="flex flex-1 items-center justify-center gap-4 py-6 bg-blue-600 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-500 transition-all"
                    >
                      View Trip
                    </Link>
                    <button
                      className="w-20 flex items-center justify-center rounded-3xl bg-white/5 border border-white/10 text-gray-500 hover:text-red-500 transition-all disabled:opacity-50"
                      onClick={() => handleDelete(selectedTrip._id)}
                      disabled={deleting === selectedTrip._id}
                    >
                      {deleting === selectedTrip._id ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <Trash size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="m-auto text-center">
                <Monitor size={48} className="mx-auto mb-4 text-gray-700" />
                <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">
                  No trips yet
                </p>
                <p className="text-xs text-gray-700 mt-2">
                  Plan a trip to see it here
                </p>
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* Right sidebar — list */}
        <section className="flex-1 overflow-y-auto bg-[#070708] p-8 lg:p-10 custom-scrollbar">
          <div className="flex justify-between items-end mb-12">
            <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white">
              My Trips
            </h1>
            <Link
              to="/plan"
              className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-blue-500 hover:bg-blue-600 hover:text-white transition-all"
              title="Plan a new trip"
            >
              <Plus size={24} />
            </Link>
          </div>

          <div className="grid gap-4">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-white/5 rounded-[2rem] animate-pulse"
                />
              ))
            ) : trips.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-sm text-gray-500">No trips yet</p>
                <p className="text-xs text-gray-600 mt-1">
                  Click + to plan your first trip
                </p>
              </div>
            ) : (
              trips.map((trip) => (
                <motion.div
                  key={trip._id}
                  className={`group relative p-4 rounded-[2.5rem] border transition-all duration-500 cursor-pointer ${
                    selectedTrip?._id === trip._id
                      ? "bg-blue-600/10 border-blue-500/40"
                      : "bg-white/[0.02] border-white/5 hover:border-white/20"
                  }`}
                  onClick={() => setSelectedTrip(trip)}
                >
                  <div className="flex items-center gap-5 relative z-10">
                    {/* Use the new TripImage component here */}
                    <TripImage
                      destination={trip.destination}
                      type="thumb"
                      className="w-16 h-16 rounded-2xl shrink-0 object-cover"
                    />

                    <div className="flex-1 overflow-hidden">
                      <h4
                        className={`font-black text-lg tracking-tighter uppercase italic truncate ${
                          selectedTrip?._id === trip._id
                            ? "text-blue-400"
                            : "text-white"
                        }`}
                      >
                        {trip.destination?.split(",")[0] || "Untitled"}
                      </h4>
                      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                        {trip.inputs?.duration || "—"} Day Trip
                      </p>
                    </div>
                    <ArrowRight
                      size={18}
                      className="text-gray-600 group-hover:text-white transition-colors"
                    />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

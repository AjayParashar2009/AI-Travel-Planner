import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import HUDMetric from "../components/HUDMetric";
import StatusBox from "../components/StatusBox";
import {
  Activity,
  ArrowRight,
  Clock,
  History,
  Loader2,
  Plane,
  Sparkles,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";
import ActivityItem from "../components/ActivityItem";
import { useAuth } from "../context/AuthContext";
import { budgetAPI, tripAPI } from "../services/api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Dashboard() {
  // Get the logged-in user from auth context
  const { user } = useAuth();

  // Loading state for the initial data fetch
  const [loading, setLoading] = useState(false);

  // Recent trips and budgets shown on the dashboard
  const [recentTrips, setRecentTrips] = useState([]);
  const [recentBudget, setRecentBudget] = useState([]);

  // Current time string shown in the header
  const loginTimeStamp = new Date().toLocaleDateString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Fetch the user's recent trips and budgets on page load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Fetch trips and budgets in parallel — one failure shouldn't block the other
        const [tripsData, budgetData] = await Promise.allSettled([
          tripAPI.getHistory(),
          budgetAPI?.getHistory ? budgetAPI.getHistory() : Promise.resolve([]),
        ]);

        // Show the 5 most recent trips
        if (tripsData.status === "fulfilled") {
          setRecentTrips(tripsData.value.slice(0, 5));
        }

        // Show the 5 most recent budgets
        if (budgetData.status === "fulfilled") {
          setRecentBudget(budgetData.value.slice(0, 5));
        }
      } catch (error) {
        console.error("Dashboard fetch failed:", error);
        toast.error("Could not load your data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] font-sans selection:bg-blue-500/30">
      <Navbar />

      <main className="max-w-[1700px] mx-auto px-6 pt-28 pb-10">
        {/* Header — welcome message and quick info */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12 border-b border-white/5 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs text-gray-500 mb-3">
              Logged in as{" "}
              <span className="text-white">
                {user?.email || "demo@example.com"}
              </span>
            </p>
            <h1 className="text-5xl font-black tracking-tighter leading-none">
              Welcome{" "}
              <span className="text-blue-500">
                {user?.name?.split(" ")[0] || "User"}
              </span>
            </h1>
          </motion.div>

          {/* Quick info metrics */}
          <div className="flex flex-wrap items-center gap-4">
            <HUDMetric icon={Clock} label="Time" value={loginTimeStamp} />
            <HUDMetric
              icon={User}
              label="Account"
              value={user?.isAdmin ? "Administrator" : "Standard"}
              color="text-blue-400"
            />
          </div>
        </header>

        {/* Top row — profile card, credits, and main CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Profile card */}
          <div className="bg-[#111113] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
              <User size={24} className="text-blue-500" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">
              Your Profile
            </h3>
            <p className="text-xl font-bold text-white truncate">
              {user?.name || "User"}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <History size={12} className="text-gray-500" />
              <p className="text-[10px] font-medium text-gray-500">
                Since {loginTimeStamp}
              </p>
            </div>
          </div>

          {/* Status box — total trips count */}
          <StatusBox
            icon={Plane}
            label="Total Trips"
            value={recentTrips.length}
            sub="Trips planned"
            color="text-blue-400"
          />

          {/* Main call-to-action — plan a new trip */}
          <Link
            to="/plan"
            className="lg:col-span-2 bg-gradient-to-br from-[#4285f4] to-[#1a73e8] rounded-[2.5rem] p-10 flex flex-col justify-between group relative overflow-hidden transition-all shadow-[0_2px_50px_rgba(66,133,244,0.3)] cursor-pointer"
          >
            <div className="relative z-10">
              <Sparkles
                size={40}
                className="text-white mb-8 group-hover:rotate-45 transition-all duration-500"
              />
              <h2 className="text-4xl font-black tracking-tighter text-white mb-2">
                Plan a Trip
              </h2>
              <p className="text-white/70 font-medium">
                Start planning with AI
              </p>
            </div>
            <div className="flex justify-end relative z-10">
              <span className="bg-white text-blue-600 px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest group-hover:scale-105 transition-all">
                Start
              </span>
            </div>
          </Link>
        </div>

        {/* Bottom row — recent trips and recent budgets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent trips list */}
          <div className="lg:col-span-8 bg-[#111113] border border-white/5 rounded-[3rem] p-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg">
                  <Plane size={16} className="text-blue-500" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">
                  Recent Trips
                </h3>
              </div>
              <Link
                to="/trips"
                className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors"
              >
                View All
              </Link>
            </div>

            {/* Trip list with loading and empty states */}
            <div className="space-y-3 mt-6">
              {loading ? (
                // Loading spinner
                <div className="flex justify-center py-20">
                  <Loader2 className="animate-spin text-white/20" size={24} />
                </div>
              ) : recentTrips.length === 0 ? (
                // Empty state
                <div className="text-center py-20">
                  <p className="text-sm text-gray-500">No trips yet</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Plan your first trip to see it here
                  </p>
                </div>
              ) : (
                // Trip cards
                recentTrips.map((trip, index) => (
                  <motion.div
                    key={trip._id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={`/trip/${trip._id}`}
                      className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-all group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                          <span className="text-blue-500 font-bold text-lg">
                            {trip.destination?.[0]?.toUpperCase() || "?"}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-white group-hover:text-[#4285f4] transition-all">
                            {trip.destination || "Untitled Trip"}
                          </h4>
                          <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
                            {trip.input?.duration
                              ? `${trip.input.duration} days`
                              : "Not specified"}
                          </span>
                        </div>
                      </div>
                      <ArrowRight
                        size={20}
                        className="text-gray-700 group-hover:text-white transition-all"
                      />
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Recent budgets sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#111113] border border-white/5 rounded-[3rem] p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#34a853] flex items-center gap-2">
                  <TrendingUp size={14} />
                  Recent Budgets
                </h3>
                <Wallet size={14} className="text-gray-600" />
              </div>
              <div className="space-y-6">
                {recentBudget.map((budget, i) => (
                  <ActivityItem
                    key={budget._id || i}
                    time="Recent"
                    action={budget.destination?.split(",")[0] || "Unknown"}
                    desc={`Budget: ₹${budget.breakdown?.total || "—"}`}
                    dot="bg-green-500"
                  />
                ))}
                {recentBudget.length === 0 && (
                  <ActivityItem
                    time="Now"
                    action="No budgets yet"
                    desc="Calculate a budget to see it here"
                    dot="bg-yellow-500"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

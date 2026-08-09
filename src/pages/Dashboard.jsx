import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { animate, motion } from "framer-motion";
import HUDMetric from "../components/HUDMetric";
import StatusBox from "../components/StatusBox";
import {
  Activity,
  ArrowRight,
  Clock,
  CloudSun,
  Compass,
  Cpu,
  Globe,
  History,
  Link as LinkIcon, // Renamed to avoid conflict with react-router Link
  Loader2,
  LogIn,
  Map,
  Plane,
  Shield,
  Sparkles,
  TrendingUp,
  User,
  Wallet,
  Zap,
} from "lucide-react";
import ActivityItem from "../components/ActivityItem";
import { useAuth } from "../context/AuthContext";
import { budgetAPI, tripAPI } from "../services/api";
import toast from "react-hot-toast";
// IMPORTANT: You must import Link from react-router-dom
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [recentTrips, setRecentTrips] = useState([]);
  const [recentBudget, setRecentBudget] = useState([]);
  const loginTimeStamp = new Date().toLocaleDateString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [tripsData, budgetData] = await Promise.allSettled([
          tripAPI.getHistory(),
          budgetAPI?.getHistory ? budgetAPI.getHistory() : Promise.resolve([]),
        ]);

        if (tripsData.status === "fulfilled") {
          setRecentTrips(tripsData.value.slice(0, 5));
        }

        if (budgetData.status === "fulfilled") {
          setRecentBudget(budgetData.value.slice(0, 5));
        }
      } catch (error) {
        console.error("Dashboard sync failed:", error);
        toast.error("Sync failed");
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
        {/* Identity */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12 border-b border-white/5 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex -space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#4285f4]" />
                <div className="w-3 h-3 rounded-full bg-[#EA4335]" />
                <div className="w-3 h-3 rounded-full bg-[#fbbc05]" />
                <div className="w-3 h-3 rounded-full bg-[#34a853]" />
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Session Active:{" "}
                <span className="text-white">
                  {user?.email || "Demo@gmail.com"}
                </span>
              </span>
            </div>
            <h1 className="text-5xl md:text-5xl font-black tracking-tighter leading-none">
              Welcome{" "}
              <span className="text-blue-500">
                {user?.name?.split(" ")[0] || "User"}
              </span>
            </h1>
          </motion.div>
          <div className="flex flex-wrap items-center gap-4">
            <HUDMetric
              icon={Clock}
              label="System Time"
              value={loginTimeStamp}
            />
            <HUDMetric icon={CloudSun} label="Weather" value="Syncing..." />
            <HUDMetric icon={Map} label="Region" value="Global/Edge" />
            <HUDMetric
              icon={Shield}
              label="Auth Tier"
              value={user?.isAdmin ? "Administrator" : "Standard"}
              color="text-blue-400"
            />
          </div>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#111113] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
              <User size={24} className="text-blue-500" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">
              Identity Profile
            </h3>
            <p className="text-xl font-bold text-white truncate">
              {user?.name || "Modi ji"}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <History size={12} className="text-gray-500 " />
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter">
                In:{loginTimeStamp}
              </p>
            </div>
            <p className="text-[9px] font-mono text-gray-600 mt-4 bg-white/5 p-2 rounded-lg border border-white/5">
              ID {user?.id || "Session Expired"}
            </p>
            <div className="mt-6 pt-6 border-t border-white/5 relative z-10 flex justify-between items-center">
              <span className="text-[9px] font-bold text-green-500 flex items-center gap-1.5 uppercase">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Secure Node
              </span>
              <LogIn
                size={14}
                className="text-gray-600 group-hover:text-blue-500 transition-colors"
              />
            </div>
          </div>
          <StatusBox
            icon={Zap}
            label="System Credits"
            value="1,250"
            sub="Compute Units"
            color="text-yellow-400"
          />

          {/* Main Journey Action */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#4285f4] to-[#1a73e8] rounded-[2.5rem] p-10 flex flex-col justify-between group relative overflow-hidden transition-all shadow-[0_2px_50px_rgba(66,133,244,0.3)] cursor-pointer">
            {/* FIX: This was using Link incorrectly. If you want to wrap an element, you need <Link to="/plan">...</Link> */}
            <Link to="/plan" className="absolute inset-0 z-20" />
            <div className="relative z-10">
              <Compass
                size={40}
                className="text-white mb-8 group-hover:rotate-45 transition-all duration-500"
              />
              <h2 className="text-4xl font-black tracking-tighter text-white mb-2">
                New Itinerary
              </h2>
              <div className="flex items-center gap-2 text-white/70 font-medium">
                <Sparkles size={16} />
                <span>Initialize AI Synthesis</span>
              </div>
            </div>
            <div className="flex justify-end relative z-10">
              <div className="bg-white text-blue-600 px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                Launch
              </div>
            </div>
            <Globe
              size={280}
              className="absolute -right-20 -bottom-20 opacity-10 text-white rotate-12"
            />
          </div>
        </div>

        {/* Record & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Trip Logs */}
          <div className="lg:col-span-8 bg-[#111113] border border-white/5 rounded-[3rem] p-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg">
                  <Plane size={16} className="text-blue-500" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">
                  Flight Archives
                </h3>
              </div>
              <Link
                to="/trips"
                className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors"
              >
                View All Logs
              </Link>
            </div>

            {/* Conditional Rendering */}
            <div className="space-y-3 mt-6">
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="animate-spin text-white/20" size={24} />
                </div>
              ) : (
                recentTrips.map((trip, index) => (
                  <motion.div
                    key={trip._id || index} // ALWAYS add a key in maps
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={`/trip/${trip._id}`}
                      className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-all group block"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                          {/* <Plane size={20} className="text-blue-500" /> */}
                          <span className="text-blue-500 font-bold">
                            {trip.destination[0]}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-white group-hover:text-[#4285f4] transition-all">
                            {trip.destination || "Untitled Trip"}
                          </h4>

                          <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
                            {trip.input?.duration
                              ? `${trip.input.duration} Day Mission`
                              : "Mission Ready"}
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

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#111113] border border-white/5 rounded-[3rem] p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#34a853] flex items-center gap-2">
                  <TrendingUp size={14} />
                </h3>
                <Wallet size={14} className="text-gray-600" />
              </div>
              <div className="space-y-6">
                {recentBudget.map((budget, i) => (
                  <ActivityItem
                    time="Active"
                    action={budget.destination.split(",")[0]}
                    desc={`Budget:₹${budget.breakdown.total || "----"}`}
                    dot="bg-green-500"
                  />
                ))}
                {recentBudget.length === 0 && (
                  <ActivityItem
                    time="Now"
                    action="Syncing Budget"
                    desc="No financial data found"
                    dot="bg-yellow-500"
                  />
                )}
              </div>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/5 rounded-[2.5rem] p-8 group">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/5 rounded-xl text-blue-400">
                  <Cpu size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">
                    Core Health
                  </h4>
                  <p className="text-[10px] text-gray-500 italic">
                    Node Cluster 09 Active
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-4/5 shadow-[0_0_10px_#4285f4]" />
            </div>
            <div className="flex justify-between mt-4">
              <div className="flex items-center gap-1">
                <Activity size={10} className="text-green-500" />
                <span className="text-[8px] text-gray-500 uppercase font-bold">
                  Stable
                </span>
              </div>
              <span className="text-[8px] text-gray-700 font-mono">
                {user?.id}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

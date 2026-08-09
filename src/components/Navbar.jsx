import React, { useEffect, useState } from "react";
import {
  Globe,
  Cpu,
  Briefcase,
  Compass,
  LayoutDashboard,
  Wallet,
  User,
  LogOut,
  Menu,
  Activity,
  X,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  {
    path: "/dashboard",
    label: "OVERVIEW",
    icon: <LayoutDashboard size={14} />,
  },
  {
    path: "/plan",
    label: "PLANNER",
    icon: <Compass size={14} />,
  },
  {
    path: "/budget",
    label: "AUDIT",
    icon: <Wallet size={14} />,
  },
  {
    path: "/trips",
    label: "JOURNEYS",
    icon: <Briefcase size={14} />,
  },
];

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
      <div
        className={`max-w-7xl mx-auto h-16 px-6 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-between ${scrolled ? "bg-black/80 backdrop-blur-xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : "bg-transparent border-transparent"}`}
      >
        {/* Logo */}
        <Link
          to={user ? "/dashboard" : "/"}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center transition-transform duration-500 group-hover:rotate-90">
            <Globe className="text-white" size={18} />
          </div>

          <div>
            <h1 className="text-xl font-black text-white italic uppercase">
              Wander <span className="text-blue-500">AI</span>
            </h1>

            <div className="flex items-center gap-1">
              <Cpu size={10} className="text-blue-400" />
              <span className="text-[8px] tracking-[0.3em] text-blue-400">
                OS_CORE_V0.5
              </span>
            </div>
          </div>
        </Link>

        {/* Nav Links */}
        {user && (
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-md">
            {navLinks.map(({ path, label, icon }) => (
              <Link
                to={path}
                key={path}
                href={path}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-white transition-all duration-300 hover:bg-blue-600 hover:text-white
                  ${isActive(path) ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "text-gray-500 hover:text-white hover:bg-white/5"}`}
              >
                {icon}
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* User Action */}
        <div className="flex items-center gap-4">
          {/* Conditional Rendering */}
          {user ? (
            <>
              {/* Profile */}
              <div className="hidden lg:flex items-center gap-3 bg-white/2 border border-white/5 py-1.5 pl-2 pr-4 rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center border">
                  <User
                    size={12}
                    className="text-gray-400 group-hover:text-blue-500 transition-colors duration-300"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-[10px] font-black text-white leading-none mb-1 uppercase tracking-tight">
                    {user.name}
                  </p>
                </div>
              </div>
              {/* Session Logout */}
              <button
                className="w-10 h-10 rounded-xl bg-white/2 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 transition-all flex items-center justify-center"
                title="Terminate Session"
              >
                <LogOut size={16} />
              </button>

              {/* Mobile Toggle */}
              <button
                className="md:hidden w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center gap-2"
            >
              Login <Activity size={12} className="animate-pulse" />
            </Link>
          )}
          {/* Else */}
        </div>
      </div>
      {/* Mobile */}
      {/* Mobile Menu */}
      <AnimatePresence>
        {user && menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-[85px] left-6 right-6 bg-black/95 backdrop-blur-2xl rounded-2xl border border-white/10 p-4 shadow-2xl"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map(({ path, label, icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-xl text-[11px] font-black uppercase transition-all ${
                    isActive(path)
                      ? "bg-blue-600 text-white"
                      : "text-white hover:bg-white/5"
                  }`}
                >
                  {icon}
                  {label}
                </Link>
              ))}
            </div>

            <div className="h-px bg-white/5 my-2 mx-2" />

            <button className="flex items-center gap-4 p-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all w-full">
              <LogOut size={16} />
              Terminate Session
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

import React, { useEffect, useState } from "react";
import {
  Globe,
  Briefcase,
  Compass,
  LayoutDashboard,
  Wallet,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

// Navigation links shown in the navbar (desktop and mobile)
const navLinks = [
  {
    path: "/dashboard",
    label: "DASHBOARD",
    icon: <LayoutDashboard size={14} />,
  },
  {
    path: "/plan",
    label: "PLAN TRIP",
    icon: <Compass size={14} />,
  },
  {
    path: "/budget",
    label: "BUDGET",
    icon: <Wallet size={14} />,
  },
  {
    path: "/trips",
    label: "MY TRIPS",
    icon: <Briefcase size={14} />,
  },
];

export default function Navbar() {
  // Get logged-in user and logout function from AuthContext
  const { user, logout } = useAuth();

  // Current route, used to highlight the active nav link
  const location = useLocation();

  // Controls the mobile menu open/close state
  const [menuOpen, setMenuOpen] = useState(false);

  // Tracks whether the page has scrolled (changes navbar style)
  const [scrolled, setScrolled] = useState(false);

  // Add scroll listener to update navbar background on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if a nav link is the current page
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
      <div
        className={`max-w-7xl mx-auto h-16 px-6 rounded-2xl flex items-center justify-between transition-all ${
          scrolled
            ? "bg-black/80 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            : "bg-black/20 backdrop-blur-md border border-white/10"
        }`}
      >
        {/* Logo — links to dashboard if logged in, otherwise home */}
        <Link
          to={user ? "/dashboard" : "/"}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center transition-transform duration-500 group-hover:rotate-90">
            <Globe className="text-white" size={18} />
          </div>

          <h1 className="text-xl font-black text-white italic uppercase">
            Yatra<span className="text-blue-500">AI</span>
          </h1>
        </Link>

        {/* Desktop nav links — only shown when user is logged in */}
        {user && (
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-md">
            {navLinks.map(({ path, label, icon }) => (
              <Link
                to={path}
                key={path}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all duration-300 ${
                  isActive(path)
                    ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                {icon}
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Logged-in user name */}
              <div className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/5 py-1.5 pl-2 pr-4 rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                  <User size={12} className="text-gray-400" />
                </div>
                <p className="text-[10px] font-black text-white uppercase tracking-tight">
                  {user.name}
                </p>
              </div>

              {/* Logout button */}
              <button
                className="w-10 h-10 rounded-xl bg-white/5 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 transition-all flex items-center justify-center"
                title="Log Out"
                onClick={logout}
              >
                <LogOut size={16} />
              </button>

              {/* Mobile menu toggle button */}
              <button
                className="md:hidden w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </>
          ) : (
            /* Login button — shown when user is not logged in */
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              Log In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu — slides in below navbar when open */}
      <AnimatePresence>
        {user && menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-[85px] left-6 right-6 bg-black/95 backdrop-blur-2xl rounded-2xl border border-white/10 p-4 shadow-2xl"
          >
            {/* Mobile nav links */}
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

            {/* Divider */}
            <div className="h-px bg-white/5 my-2 mx-2" />

            {/* Mobile logout button */}
            <button
              onClick={logout}
              className="flex items-center gap-4 p-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all w-full"
            >
              <LogOut size={16} />
              Log Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

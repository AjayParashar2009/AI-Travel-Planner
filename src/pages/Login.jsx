import React, { useState } from "react";
import {
  Fingerprint,
  Globe,
  Loader2,
  Lock,
  Mail,
  Radar,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import TacticalInput from "../components/TacticalInput";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Authorization Failed please check your credentials",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020203] flex font-sans selection:bg-blue-600 selection:text-white text-gray-400 overflow-hidden">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-[50%] bg-[#050507] relative flex-col justify-between p-16 overflow-hidden border-r border-white/5">
        {/* Tactical Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Bottom Blue Glow */}
        <div className="absolute bottom-[-5%] right-[-10%] w-[400px] h-[400px] bg-blue-900/10 blur-[120px] rounded-full" />

        {/* Top Blue Glow */}
        <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full" />

        {/* BRAND HEADER */}
        <Link
          to="/"
          className="relative z-10 flex items-center justify-start gap-3 group"
        >
          <div className="w-12 h-12 shrink-0 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-center transition-transform duration-500 group-hover:rotate-90">
            <Globe className="text-white" size={20} />
          </div>
          <span className="text-2xl whitespace-nowrap font-black italic uppercase tracking-tighter text-white">
            WANDER <span className="text-blue-600 not-italic">AI.</span>
          </span>
        </Link>

        {/* CONTENT SECTION */}
        <div className="relative z-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-7xl font-black leading-[0.85] tracking-tighter mb-8 text-white uppercase italic">
              Welcome
              <br />
              <span className="text-blue-600 not-italic">Back User</span>
            </h2>

            <p className="text-lg text-gray-500 mb-12 leading-relaxed font-medium max-w-[560px]">
              Synchronize your profile to access your AI-generated itineraries,
              live field telemetry, and encrypted travel vaults.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white/[0.03] backdrop-blur-md rounded-[32px] border border-white/10 group hover:border-blue-500/30 transition-all duration-300">
                <Radar className="text-blue-500 mb-4 animate-pulse" size={24} />
                <h4 className="font-black text-white uppercase italic text-xs tracking-widest mb-1">
                  Live Sync
                </h4>
                <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">
                  Global Node Connectivity
                </p>
              </div>

              <div className="p-6 bg-white/[0.03] backdrop-blur-md rounded-[32px] border border-white/10 group hover:border-blue-500/30 transition-all duration-300">
                <Fingerprint
                  className="text-blue-500 mb-4 animate-pulse"
                  size={24}
                />
                <h4 className="font-black text-white uppercase italic text-xs tracking-widest mb-1">
                  Encrypted
                </h4>
                <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">
                  AES-256 Vault Active
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FOOTER META */}
        <div className="relative z-10 text-[9px] font-black text-gray-700 uppercase tracking-[0.4em] flex gap-12 whitespace-nowrap">
          <span>Core_System v5.2</span>
          <span>Verified_uplink</span>
          <span className="text-blue-900">ID: WAI-LOG-902</span>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative bg-[#020203]">
        {/* Form Header */}
        <div className="w-full max-w-md mb-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-3 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
            <ShieldCheck size={14} /> Authorization Terminal Required
          </div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">
            Credentials
          </h1>
          <p className="text-gray-600 font-bold uppercase text-xs tracking-widest">
            Unregistered User{" "}
            <Link
              to="/registration"
              className="text-blue-500 hover:text-blue-400 transition-colors"
            >
              Create an Account
            </Link>
          </p>
        </div>

        {/* Form Body */}
        <div className="w-full max-w-md bg-[#08080a] rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-6 mt-6 p-4 bg-red-950/20 rounded-2xl border border-red-900/20 text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-4"
            >
              <ShieldAlert size={18} className="animate-pulse shrink-0" />

              <span>{error}</span>
            </motion.div>
          )}

          <form className="p-8 space-y-5" onSubmit={handleSubmit}>
            <TacticalInput
              label="User Email"
              icon={Mail}
              type="email"
              placeholder="admin@onlineittuts.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                  Security Passkey
                </label>
                <Link
                  href="#"
                  className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-400"
                >
                  Forgot Password
                </Link>
              </div>
              <TacticalInput
                icon={Lock}
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group relative bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-950/20 mt-8 active:scale-95"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>

        {/* Trusted Badges */}
        <div className="w-full max-w-md mt-6 grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <Sparkles size={14} className="text-blue-500" />
            Google_ID
          </button>

          <button className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <Fingerprint size={14} />
            Biometric
          </button>
        </div>

        <p className="mt-8 text-center text-[9px] font-black text-gray-800 uppercase tracking-[0.5em]">
          Encrypted End-to-End // WanderAI Architecture
        </p>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import {
  Activity,
  ChevronRight,
  Compass,
  Globe,
  Loader2,
  Lock,
  Mail,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Target,
  User,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import TacticalInput from "../components/TacticalInput";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Registration() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    country: "IND",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const err = {};

    if (formData.name.length < 2) {
      err.name = "ENTRY_REQUIRED: NAME";
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      err.email = "INVALID_UPLINK: EMAIL";
    }

    if (formData.password.length < 6) {
      err.password = "SECURITY_BREACH: PASSKEY_TOO_SHORT";
    }

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();

    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await register(formData);

      toast.success(`Welcome aboard, ${formData.name.split(" ")[0]}`);

      navigate("/dashboard");
    } catch (err) {
      setErrors({
        general: err.response?.data?.error || "Connection Failure......",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020203] flex font-sans selection:bg-blue-600 selection:text-white text-gray-400 overflow-hidden">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[50%] bg-[#050507] relative flex-col justify-between p-16 overflow-hidden border-r border-white/5">
        {/* Background Overlay with */}
        <div className="absolute inset-0 bg-[url('')] bg-cover bg-center grayscale opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020203] via-transparent to-[#020203]" />
        {/* Brand Header */}
        <Link to="/" className="required: z-10 flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center transition-transform duration-500 group-hover:rotate-90 shrink-0">
            <Globe className="text-white" size={18} />
          </div>
          <span className="text-2xl font-black italic uppercase tracking-tighter text-white">
            Wander <span className="text-blue-600 not-italic">AI.</span>
          </span>
        </Link>

        {/* Hero Content */}
        <div className="relative z-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-7xl font-black leading-[0.85] tracking-tighter mb-8 text-white uppercase italic">
              The World <br />{" "}
              <span className="text-blue-600 not-italic">Tailored</span>
            </h2>
            <p className="text-lg text-gray-500 mb-12 leading-relaxed font-medium">
              Join the next generation of explorers using neural logistics to
              reach coordinates the map.
            </p>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-8 bg-white/[0.02] backdrop-blur-lg rounded-[32px] border border-white/5 group-hover:border-blue-500/30 transition-all">
              <Target
                size={28}
                className="text-blue-500 mb-4 group-hover:rotate-45 transition-all"
              />
              <h4 className="font-black text-white uppercase italic text-xs tracking-widest mb-1">
                Precision
              </h4>
              <p className="text-[10px] text-gray-600 uppercase font tracking-[0.2em]">
                Neural Node Routing
              </p>
            </div>
            <div className="p-8 bg-white/[0.02] backdrop-blur-lg rounded-[32px] border border-white/5 group-hover:border-blue-500/30 transition-all">
              <Activity
                size={28}
                className="text-blue-500 mb-4 group-hover:rotate-45 transition-all"
              />
              <h4 className="font-black text-white uppercase italic text-xs tracking-widest mb-1">
                Real Time
              </h4>
              <p className="text-[10px] text-gray-600 uppercase font tracking-[0.2em]">
                Active Field Telemetry
              </p>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="relative z-10 text-[9px] font-black text-gray-700 uppercase tracking-[0.05em]">
          &copy; WanderAi // Global Deployment Active
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative bg-[#020203]">
        <div className="w-full max-w-[460px] relative">
          {/* Header */}
          <div className="mb-12 text-center lg:text-left px-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-[0_0_20px-rgba(37,99,235,01)]">
              <Compass size={14} className="animate-spin-slow" /> New Mission
              Deployment
            </div>
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">
              Create Profile
            </h1>
            <p className="text-gray-600 font-black text-white italic uppercase tracking-tightern mb-4">
              Existing Account?{" "}
              <Link
                to="/login"
                className="text-blue-500 hover:text-blue-400 transition-all underline-offset-4 underline"
              >
                Login Now
              </Link>
            </p>
          </div>

          {/* Main Form Card */}
          <div className="bg-[#08080a] rounded-[40px] border border-white/5 p-2 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent" />
            {/* Conditional Rendering */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mx-5 mt-6 bg-red-950/20 rounded-2xl border border-red-900/20 text-red-500 p-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-4"
              >
                <ShieldAlert size={18} className="animate-pulse" />
                {errors.general}
              </motion.div>
            )}
            <form className="p-8 space-y-5" onSubmit={handleSubmit}>
              <TacticalInput
                label="Username"
                icon={User}
                type="text"
                placeholder="Narendra Modi"
                value={formData.name}
                error={errors.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <TacticalInput
                label="Email"
                icon={Mail}
                type="email"
                placeholder="narendramodi1234@gmail.com"
                value={formData.email}
                error={errors.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <TacticalInput
                label="Password"
                icon={Lock}
                type="password"
                placeholder="***********"
                value={formData.password}
                error={errors.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full group relative bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-950/20 mt-8 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 />
                ) : (
                  <>
                    Register Now <ChevronRight />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Trusted Bades */}
          <div className="mt-12 flex items-center justify-center gap-10 opacity-20 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
            <div className="flex items-center gap-2 font-black text-[9px] uppercase tracking-[0.02em] text-white">
              <ShieldCheck size={14} className="text-blue-500" />
              AES-256
            </div>
            <div className="flex items-center gap-2 font-black text-[9px] uppercase tracking-[0.02em] text-white">
              <Zap size={14} className="text-blue-500" />
              INSTANT SYNC
            </div>
            <div className="flex items-center gap-2 font-black text-[9px] uppercase tracking-[0.02em] text-white">
              <MapPin size={14} className="text-blue-500" />
              GLOBAL NODES
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

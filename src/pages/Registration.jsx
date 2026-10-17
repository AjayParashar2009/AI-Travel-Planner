import React, { useState } from "react";
import {
  Activity,
  ChevronRight,
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
import { motion } from "framer-motion";
import TacticalInput from "../components/TacticalInput";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Registration() {
  // Get register function from auth context
  const { register } = useAuth();

  // Router navigation
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    country: "India",
  });

  // Validation and general errors
  const [errors, setErrors] = useState({});

  // Loading state
  const [loading, setLoading] = useState(false);

  // Validate the form fields before submit
  const validate = () => {
    const err = {};

    if (formData.name.trim().length < 2) {
      err.name = "Please enter your name";
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      err.email = "Please enter a valid email";
    }

    if (formData.password.length < 6) {
      err.password = "Password must be at least 6 characters";
    }

    return err;
  };

  // Handle form submit — register the user
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

      toast.success(`Welcome, ${formData.name.split(" ")[0]}!`);

      navigate("/dashboard");
    } catch (err) {
      setErrors({
        general:
          err.response?.data?.error ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020203] flex font-sans selection:bg-blue-600 selection:text-white text-gray-400 overflow-hidden">
      {/* Left panel — branding and info */}
      <div className="hidden lg:flex lg:w-[50%] bg-[#050507] relative flex-col justify-between p-16 overflow-hidden border-r border-white/5">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020203] via-transparent to-[#020203]" />

        {/* Logo — links home */}
        <Link to="/" className="relative z-10 flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center transition-transform duration-500 group-hover:rotate-90 shrink-0">
            <Globe className="text-white" size={18} />
          </div>
          <span className="text-2xl font-black italic uppercase tracking-tighter text-white">
            Yatra<span className="text-blue-600 not-italic">AI.</span>
          </span>
        </Link>

        {/* Welcome copy */}
        <div className="relative z-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-7xl font-black leading-[0.85] tracking-tighter mb-8 text-white uppercase italic">
              The World,
              <br />
              <span className="text-blue-600 not-italic">Tailored to You</span>
            </h2>
            <p className="text-lg text-gray-500 mb-12 leading-relaxed font-medium">
              Create an account to start planning your next trip with AI.
            </p>
          </motion.div>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-8 bg-white/[0.02] backdrop-blur-lg rounded-[32px] border border-white/5">
              <Target size={28} className="text-blue-500 mb-4" />
              <h4 className="font-black text-white uppercase italic text-xs tracking-widest mb-1">
                Accurate
              </h4>
              <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">
                Plans that match your budget
              </p>
            </div>
            <div className="p-8 bg-white/[0.02] backdrop-blur-lg rounded-[32px] border border-white/5">
              <Activity size={28} className="text-blue-500 mb-4" />
              <h4 className="font-black text-white uppercase italic text-xs tracking-widest mb-1">
                Up to Date
              </h4>
              <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">
                See your trip in real time
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-[10px] font-bold text-gray-700 uppercase tracking-[0.2em]">
          © {new Date().getFullYear()} YatraAI. All rights reserved.
        </div>
      </div>

      {/* Right panel — registration form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative bg-[#020203]">
        <div className="w-full max-w-[460px]">
          {/* Form heading */}
          <div className="mb-12 text-center lg:text-left px-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Globe size={14} /> Create Account
            </div>
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">
              Sign Up
            </h1>
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-500 hover:text-blue-400 transition-all underline underline-offset-4"
              >
                Log in
              </Link>
            </p>
          </div>

          {/* Form card */}
          <div className="bg-[#08080a] rounded-[40px] border border-white/5 p-2 shadow-2xl relative overflow-hidden">
            {/* General error message */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mx-5 mt-6 bg-red-950/20 rounded-2xl border border-red-900/20 text-red-500 p-4 text-[11px] font-bold flex items-center gap-4"
              >
                <ShieldAlert size={18} className="shrink-0" />
                {errors.general}
              </motion.div>
            )}

            <form className="p-8 space-y-5" onSubmit={handleSubmit}>
              {/* Name input */}
              <TacticalInput
                label="Name"
                icon={User}
                type="text"
                placeholder="John Doe"
                value={formData.name}
                error={errors.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              {/* Email input */}
              <TacticalInput
                label="Email"
                icon={Mail}
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                error={errors.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              {/* Password input */}
              <TacticalInput
                label="Password"
                icon={Lock}
                type="password"
                placeholder="At least 6 characters"
                value={formData.password}
                error={errors.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />

              {/* Country input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">
                  Country
                </label>
                <TacticalInput
                  icon={Globe} // Make sure to import Globe from lucide-react
                  type="text"
                  placeholder="e.g. India"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-950/20 mt-8 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Create Account <ChevronRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex items-center justify-center gap-10 text-gray-500">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck size={14} className="text-blue-500" />
              Secure
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
              <Zap size={14} className="text-blue-500" />
              Fast
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
              <MapPin size={14} className="text-blue-500" />
              Anywhere
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

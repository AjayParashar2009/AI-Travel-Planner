import React, { useState } from "react";
import {
  Fingerprint,
  Globe,
  Loader2,
  Lock,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import TacticalInput from "../components/TacticalInput";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { authAPI } from "../services/api";

export default function Login() {
  // Get login and setUser functions from auth context
  const { login, setUser } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Error and loading states
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle regular email/password submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Login failed. Please check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login success
  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);
    try {
      const res = await authAPI.googleLogin(credentialResponse.credential);

      // Save token and user to local storage
      localStorage.setItem("wander_token", res.data.token);
      localStorage.setItem("wander_user", JSON.stringify(res.data.user));

      // Update the AuthContext state so the app knows we are logged in
      setUser(res.data.user);

      // Navigate to dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.error || "Google login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020203] flex font-sans selection:bg-blue-600 selection:text-white text-gray-400 overflow-hidden">
      {/* Left panel — branding and info */}
      <div className="hidden lg:flex lg:w-[50%] bg-[#050507] relative flex-col justify-between p-16 overflow-hidden border-r border-white/5">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Blue glow effects */}
        <div className="absolute bottom-[-5%] right-[-10%] w-[400px] h-[400px] bg-blue-900/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full" />

        {/* Logo — links home */}
        <Link
          to="/"
          className="relative z-10 flex items-center justify-start gap-3 group"
        >
          <div className="w-12 h-12 shrink-0 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-center transition-transform duration-500 group-hover:rotate-90">
            <Globe className="text-white" size={20} />
          </div>
          <span className="text-2xl whitespace-nowrap font-black italic uppercase tracking-tighter text-white">
            Yatra<span className="text-blue-600 not-italic">AI.</span>
          </span>
        </Link>

        {/* Welcome copy and feature highlights */}
        <div className="relative z-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-7xl font-black leading-[0.85] tracking-tighter mb-8 text-white uppercase italic">
              Welcome
              <br />
              <span className="text-blue-600 not-italic">Back.</span>
            </h2>

            <p className="text-lg text-gray-500 mb-12 leading-relaxed font-medium max-w-[560px]">
              Log in to access your saved trips and AI-generated itineraries.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* Feature — fast access */}
              <div className="p-6 bg-white/[0.03] backdrop-blur-md rounded-[32px] border border-white/10">
                <Zap className="text-blue-500 mb-4" size={24} />
                <h4 className="font-black text-white uppercase italic text-xs tracking-widest mb-1">
                  Quick Access
                </h4>
                <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">
                  Your trips, anywhere
                </p>
              </div>

              {/* Feature — secure */}
              <div className="p-6 bg-white/[0.03] backdrop-blur-md rounded-[32px] border border-white/10">
                <Fingerprint className="text-blue-500 mb-4" size={24} />
                <h4 className="font-black text-white uppercase italic text-xs tracking-widest mb-1">
                  Secure
                </h4>
                <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">
                  Your data is protected
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer text */}
        <div className="relative z-10 text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">
          Plan Smarter. Travel Better.
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative bg-[#020203]">
        {/* Form heading */}
        <div className="w-full max-w-md mb-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-3">
            <ShieldCheck size={14} /> Secure Login
          </div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">
            Log In
          </h1>
          <p className="text-gray-600 font-bold uppercase text-xs tracking-widest">
            Don't have an account?{" "}
            <Link
              to="/registration"
              className="text-blue-500 hover:text-blue-400 transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Form card */}
        <div className="w-full max-w-md bg-[#08080a] rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden">
          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-6 mt-6 p-4 bg-red-950/20 rounded-2xl border border-red-900/20 text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-4"
            >
              <ShieldAlert size={18} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form className="p-8 space-y-5" onSubmit={handleSubmit}>
            {/* Email input */}
            <TacticalInput
              label="Email"
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            {/* Password input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-400"
                  onClick={() => alert("Password reset is not yet available")}
                >
                  Forgot password?
                </button>
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

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full group relative bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-950/20 mt-8 active:scale-95"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Log In"
              )}
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="w-full max-w-md my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
            Or continue with
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Google Login Button */}
        <div className="w-full max-w-md flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Login Failed")}
            theme="filled_black"
            shape="pill"
            text="continue_with"
            size="large"
          />
        </div>

        <p className="mt-8 text-center text-[10px] font-bold text-gray-700 uppercase tracking-[0.3em]">
          Your data is encrypted and secure
        </p>
      </div>
    </div>
  );
}

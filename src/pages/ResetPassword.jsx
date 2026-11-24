import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/auth/reset-password/${token}`, { password });
      toast.success("Password reset successful!");
      navigate("/login");
    } catch (error) {
      toast.error("Invalid or expired token.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020203] flex items-center justify-center text-white">
      <form onSubmit={handleSubmit} className="bg-[#08080a] p-8 rounded-3xl border border-white/10 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Set New Password</h2>
        <input
          type="password"
          placeholder="New Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 mb-4 outline-none focus:border-blue-500"
          required
          minLength={6}
        />
        <button type="submit" className="w-full bg-blue-600 py-3 rounded-xl font-bold hover:bg-blue-500">
          Reset Password
        </button>
      </form>
    </div>
  );
}
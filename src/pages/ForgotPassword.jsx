import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/auth/forgot-password", { email });
      toast.success("Reset link sent to your email!");
    } catch (error) {
      toast.error("Error sending email. Check if the email exists.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020203] flex items-center justify-center text-white">
      <form onSubmit={handleSubmit} className="bg-[#08080a] p-8 rounded-3xl border border-white/10 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 mb-4 outline-none focus:border-blue-500"
          required
        />
        <button type="submit" className="w-full bg-blue-600 py-3 rounded-xl font-bold hover:bg-blue-500">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
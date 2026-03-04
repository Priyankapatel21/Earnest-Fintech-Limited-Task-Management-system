"use client";

import { useState } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    setIsLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      const token = res.data.demoToken;
      if (token) {
        toast.success("Success! Redirecting to Reset Page (Demo Mode)...", { duration: 4000, icon: '🚀' });
        setTimeout(() => { router.push(`/reset-password?token=${token}`); }, 2000);
      } else {
        toast.error("User not found in database");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#FDF9FF] flex items-center justify-center p-6 md:p-24 font-sans">
      <div className="w-full max-w-[450px] bg-white rounded-[2.5rem] shadow-2xl p-10 md:p-12 text-center border border-gray-50">
        <div className="mb-8">
          <h1 className="text-xl font-black text-[#5C59C2] tracking-tighter mb-2">SyncTask</h1>
          <h2 className="text-3xl font-black text-gray-900 mb-2 leading-tight">Forgot Password</h2>
          <p className="text-gray-400 font-bold text-xs">Enter your email to receive a reset link</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label className="block text-xs font-black text-gray-700 mb-1.5 ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="Try your registered email" 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-3.5 text-black font-bold outline-none focus:border-gray-900 transition-all placeholder:text-gray-300 shadow-sm" 
            />
          </div>
          <button disabled={isLoading} className="w-full bg-[#5C59C2] hover:bg-[#4B48A3] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-[#5C59C2]/20 transition-all active:scale-[0.98]">
            {isLoading ? "Processing..." : "Send Reset Link"}
          </button>
        </form>
        <p className="mt-8 text-xs font-black text-gray-400">
          Remember your password? <Link href="/login" className="text-[#5C59C2] hover:underline ml-1">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
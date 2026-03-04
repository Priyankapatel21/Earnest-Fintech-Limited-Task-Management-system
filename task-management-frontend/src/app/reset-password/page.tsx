"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) return toast.error("Missing reset token");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    if (newPassword.length < 6) return toast.error("Password too short");

    setIsLoading(true);
    try {
      await api.post("/auth/reset-password", { token, newPassword });
      toast.success("Password updated! Please login with your new password.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Invalid or expired token");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#FDF9FF] flex items-center justify-center p-6 md:p-24 font-sans">
      <div className="w-full max-w-[450px] bg-white rounded-[2.5rem] shadow-2xl p-10 md:p-12 text-center border border-gray-50">
        <div className="mb-8">
          <h1 className="text-xl font-black text-[#5C59C2] tracking-tighter mb-2">SyncTask</h1>
          <h2 className="text-3xl font-black text-gray-900 mb-2 leading-tight">New Password</h2>
          <p className="text-gray-400 font-bold text-xs">Set your new account password</p>
        </div>

        <form onSubmit={handleReset} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-black text-gray-700 mb-1.5 ml-1">New Password</label>
            <input 
              type="password" 
              placeholder="Min 6 characters" 
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-3.5 text-black font-bold outline-none focus:border-gray-900 transition-all" 
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-700 mb-1.5 ml-1">Confirm Password</label>
            <input 
              type="password" 
              placeholder="Repeat password" 
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-3.5 text-black font-bold outline-none focus:border-gray-900 transition-all" 
              required
            />
          </div>

          <button 
            disabled={isLoading || !token}
            className="w-full bg-[#5C59C2] hover:bg-[#4B48A3] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-[#5C59C2]/20 transition-all active:scale-[0.98] mt-4 disabled:opacity-50"
          >
            {isLoading ? "Updating Database..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}


export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center font-black text-[#5C59C2]">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
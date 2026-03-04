"use client";

import { useState } from "react";
import api, { setAccessToken } from "@/lib/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return toast.error("All fields are required");

    try {
      const res = await api.post("/auth/register", { name, email, password });
      setAccessToken(res.data.accessToken);
      
      toast.success("Registration successful! Welcome to SyncTask.");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      try {
        const userInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const res = await api.post("/auth/google", {
          name: userInfo.data.name,
          email: userInfo.data.email,
          googleId: userInfo.data.sub,
        });
        setAccessToken(res.data.accessToken);
        toast.success("Registration successful!");
        router.push("/dashboard");
      } catch (error) {
        toast.error("Google registration failed");
      } finally {
        setIsGoogleLoading(false);
      }
    },
  });

  return (
    <div className="h-screen bg-[#FDF9FF] flex items-center justify-center p-6 md:p-20 overflow-hidden font-sans">
      <div className="w-full max-w-[850px] h-[550px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex transition-all border border-gray-50">
        <div className="flex-1 flex flex-col p-10 md:p-12 justify-center">
          <div className="mb-6">
            <h1 className="text-xl font-black text-[#5C59C2] tracking-tighter mb-1">SyncTask</h1>
            <h2 className="text-3xl font-black text-gray-900 mb-1 leading-tight">Create Account</h2>
            <p className="text-gray-400 font-bold text-xs">Join SyncTask and start organizing</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-xs font-black text-gray-700 mb-1 ml-1">Full Name</label>
              <input 
                type="text" 
                placeholder="Enter your name" 
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-black outline-none focus:border-gray-900 transition-all placeholder:text-gray-300 shadow-sm" 
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-700 mb-1 ml-1">Email</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-black outline-none focus:border-gray-900 transition-all placeholder:text-gray-300 shadow-sm" 
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-700 mb-1 ml-1">Password</label>
              <input 
                type="password" 
                placeholder="Create a password" 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-black outline-none focus:border-gray-900 transition-all placeholder:text-gray-300 shadow-sm" 
              />
            </div>

            <button className="w-full bg-[#5C59C2] hover:bg-[#4B48A3] text-white py-3.5 rounded-xl font-black text-md shadow-lg shadow-[#5C59C2]/20 transition-all active:scale-[0.98] mt-2">
              Create Account
            </button>
          </form>

          <div className="text-center mt-5 space-y-3">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-full border-t border-gray-100"></div>
              <span className="relative bg-white px-3 text-xs font-black text-gray-300">Or continue</span>
            </div>

            <button 
              type="button"
              onClick={() => handleGoogleLogin()}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 py-2.5 rounded-xl font-black border border-gray-100 transition-all shadow-sm active:scale-[0.98]"
            >
              <img src="/googles.svg" alt="Google" className="w-4 h-4" />
              <span className="text-xs font-black text-gray-800">Sign up with Google</span>
            </button>

            <p className="text-xs font-black text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-[#5C59C2] hover:underline ml-1">Login</Link>
            </p>
          </div>
        </div>

        <div className="flex-1 bg-[#A5A2F2] p-10 flex flex-col justify-center items-center rounded-r-[2.5rem] hidden lg:flex text-center">
          <div className="relative w-full h-64 mb-6 drop-shadow-2xl flex items-center justify-center">
            <img src="/login-illustration.png" alt="Dashboard" className="max-w-full max-h-full object-contain" />
          </div>
          <h3 className="text-white text-xl font-black mb-2 leading-tight">Master Your Workflow</h3>
          <p className="text-white/80 font-bold text-xs leading-relaxed px-8">Manage your task in a easy and more efficient way with SyncTask...</p>
        </div>
      </div>
    </div>
  );
}
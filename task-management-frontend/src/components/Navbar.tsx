"use client";

import { LogOut } from "lucide-react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar({ name, darkMode }: { name: string; darkMode: boolean }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      toast.success("Logged out");
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex items-center">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-[#5C59C2] rounded-full flex items-center justify-center text-white font-black shadow-lg shadow-[#5C59C2]/20 text-xs md:text-base">
          {name.charAt(0).toUpperCase()}
        </div>
        

        <div className="hidden sm:flex flex-col">
          <p className={`text-xs md:text-sm font-black leading-none transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className="inline md:hidden">{name.split(' ')[0]}</span>
            <span className="hidden md:inline">
              {name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
            </span>
          </p>
          <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest mt-1 text-gray-400">
            Logged In
          </p>
        </div>

        <button 
          onClick={handleLogout}
          className={`ml-1 md:ml-3 p-2 transition-colors ${
            darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'
          }`}
          title="Logout"
        >
          <LogOut size={16} className="md:w-[18px] md:h-[18px]" />
        </button>
      </div>
    </div>
  );
}
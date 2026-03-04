"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";
import Navbar from "@/components/Navbar"; 
import useAuth from "@/hooks/useAuth";     
import { Search, ListFilter, Plus, LayoutDashboard, Clock, CheckCircle, ChevronDown, Moon, Sun, ArrowUpDown } from "lucide-react"; 

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(false);
  const { loading, user } = useAuth(); 
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  const [searchTerm, setSearchTerm] = useState(""); 
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => setSearch(searchTerm), 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const { data } = useQuery({
    queryKey: ["tasks", search], 
    queryFn: async () => (await api.get("/tasks", { params: { search } })).data,
    enabled: !loading && !!user,
  });

  const tasks = data?.data || [];

  const filteredTasks = useMemo(() => {
    let result = tasks.filter((task: any) => {
      const matchesTab = activeTab === "all" || (activeTab === "pending" ? !task.status : task.status);
      const matchesCategory = filterCategory === "All" || task.category === filterCategory;
      return matchesTab && matchesCategory;
    });
    return [...result].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [tasks, activeTab, filterCategory, sortBy]);

  const completedCount = tasks.filter((t: any) => t.status).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  if (loading) return <div className="flex h-screen items-center justify-center font-black text-[#5C59C2] uppercase tracking-widest animate-pulse">Syncing SyncTask...</div>;

  return (
    <div className={`flex flex-col md:flex-row h-screen transition-all duration-300 ${darkMode ? 'bg-gray-950 text-white' : 'bg-[#FDF9FF] text-gray-900'}`}>
      
      {/* SIDEBAR: Restored to w-72 for that spacious Desktop feel */}
      <aside className={`w-72 border-r hidden md:flex flex-col p-8 transition-colors ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="mb-12 pb-6 border-b border-gray-50">
          <p className="text-2xl font-black text-[#5C59C2]">SyncTask</p>
        </div>
        
        <nav className="space-y-2 flex-1">
          <button onClick={() => setActiveTab("all")} className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold text-sm transition-all ${activeTab === "all" ? "bg-[#5C59C2] text-white shadow-xl shadow-[#5C59C2]/30" : "text-gray-400 hover:bg-gray-50"}`}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => setActiveTab("pending")} className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold text-sm transition-all ${activeTab === "pending" ? "bg-[#5C59C2] text-white shadow-xl shadow-[#5C59C2]/30" : "text-gray-400 hover:bg-gray-50"}`}>
            <Clock size={20} /> In Progress
          </button>
          <button onClick={() => setActiveTab("completed")} className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold text-sm transition-all ${activeTab === "completed" ? "bg-[#5C59C2] text-white shadow-xl shadow-[#5C59C2]/30" : "text-gray-400 hover:bg-gray-50"}`}>
            <CheckCircle size={20} /> Completed
          </button>
        </nav>

        {/* Progress Card */}
        <div className="mt-auto pt-6">
          <div className={`p-5 rounded-[2rem] border transition-all ${darkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-[#A5A2F2]/10 border-[#A5A2F2]/20'}`}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Workspace</span>
              <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-[#5C59C2]/10 text-[#5C59C2]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200/50 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-[#5C59C2] transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden pb-20 md:pb-0">
        {/* HEADER: Clean and aligned */}
        <header className={`flex justify-between items-center px-6 md:px-12 py-6 transition-colors ${darkMode ? 'bg-gray-900' : 'bg-transparent'}`}>
           <div className="md:hidden">
             <p className="text-xl font-black text-[#5C59C2]">SyncTask</p>
           </div>
           <div className="hidden md:flex flex-1" /> 
           <div className="flex items-center gap-4 md:gap-8"> 
              <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-12 flex items-center justify-center rounded-full transition-all hover:rotate-12 ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white shadow-sm text-gray-400'}`} >
                {darkMode ? <Sun size={22} /> : <Moon size={22} />}
              </button>
              <Navbar name={user?.name || "User"} darkMode={darkMode} />
           </div>
        </header>

        {/* CONTENT AREA: md:p-12 restores the wide desktop look */}
        <div className="p-6 md:p-12 overflow-y-auto">
          <div className="mb-12">
            <h1 className={`text-3xl md:text-5xl font-black tracking-tight transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Hey, {user?.name ? user.name.split(' ')[0] : "User"}
            </h1>
            <p className="text-gray-400 font-bold mt-2 uppercase text-[11px] tracking-[0.2em]">Manage your daily flow</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 mb-12">
            {/* Search: md:max-w-md for desktop */}
            <div className="relative w-full md:max-w-md">
              <Search size={20} className="absolute left-5 top-4 text-gray-400" />
              <input 
                type="text" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                placeholder="Search your tasks..." 
                className={`w-full pl-14 pr-6 py-4 border rounded-2xl outline-none font-bold transition-all ${darkMode ? 'bg-gray-900 border-gray-800 text-white focus:border-[#5C59C2]' : 'bg-white border-gray-100 shadow-sm text-gray-900 focus:border-[#5C59C2]'}`} 
              />
            </div>

            {/* Desktop Action Buttons */}
            <div className="flex w-full md:w-auto gap-3">
               <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-4 border rounded-2xl font-black text-sm ${darkMode ? 'bg-gray-900 border-gray-800 text-gray-300' : 'bg-white border-gray-100 text-gray-600 shadow-sm'}`}>
                 <ListFilter size={20} /> Filter
               </button>
               <button onClick={() => setShowModal(true)} className="flex-1 md:hidden bg-[#5C59C2] text-white px-6 py-4 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2">
                 <Plus size={20} /> New
               </button>
            </div>

            <button onClick={() => setShowModal(true)} className="hidden md:flex bg-[#5C59C2] text-white px-8 py-4 rounded-2xl font-black shadow-2xl shadow-[#5C59C2]/40 items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all ml-auto">
              <Plus size={22} /> Create Task
            </button>
          </div>

          {/* TASK GRID: Perfect spacing for Desktop and Mobile */}
          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredTasks.map((task: any) => <TaskCard key={task.id} task={task} darkMode={darkMode} />)}
            </div>
          ) : (
            <EmptyState darkMode={darkMode} setShowModal={setShowModal} />
          )}
        </div>
      </main>

      {/* MOBILE BOTTOM NAV: Fixed to bottom for phone users */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t p-4 flex justify-around items-center z-50 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-2xl'}`}>
        <button onClick={() => setActiveTab("all")} className={activeTab === "all" ? "text-[#5C59C2]" : "text-gray-400"}><LayoutDashboard size={24}/></button>
        <button onClick={() => setActiveTab("pending")} className={activeTab === "pending" ? "text-[#5C59C2]" : "text-gray-400"}><Clock size={24}/></button>
        <button onClick={() => setActiveTab("completed")} className={activeTab === "completed" ? "text-[#5C59C2]" : "text-gray-400"}><CheckCircle size={24}/></button>
        <button onClick={() => setShowModal(true)} className="bg-[#5C59C2] text-white p-3 rounded-full shadow-lg"><Plus size={24}/></button>
      </div>

      {showModal && <TaskForm onClose={() => setShowModal(false)} />}
    </div>
  );
}

function EmptyState({ darkMode, setShowModal }: { darkMode: boolean; setShowModal: any }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className={`w-24 h-24 mb-6 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-[#A5A2F2]/10'}`}>
        <CheckCircle className="text-[#A5A2F2]" size={40} />
      </div>
      <h3 className={`text-xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No tasks found</h3>
      <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-8">Ready to start your flow?</p>
      <button onClick={() => setShowModal(true)} className="text-[#5C59C2] font-black text-sm hover:underline">+ Create first task</button>
    </div>
  );
}
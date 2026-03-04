"use client";

import { useState, useEffect } from "react";
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
  
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); 
  const [sortBy, setSortBy] = useState("newest");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearch(searchTerm);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const { data, isLoading: isQueryLoading } = useQuery({
    queryKey: ["tasks", search], 
    queryFn: async () => (await api.get("/tasks", { params: { search } })).data,
    enabled: !loading,
  });

  const tasks = data?.data || [];
  const completedCount = tasks.filter((t: any) => t.status).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  
  let filteredTasks = tasks.filter((task: any) => {
    const matchesTab = activeTab === "all" || (activeTab === "pending" ? !task.status : task.status);
    const matchesCategory = filterCategory === "All" || task.category === filterCategory;
    return matchesTab && matchesCategory;
  });
  
  filteredTasks = [...filteredTasks].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortBy === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className={`flex flex-col md:flex-row h-screen transition-all duration-300 ${darkMode ? 'bg-gray-950 text-white' : 'bg-[#FDF9FF] text-gray-900'}`}>
      
      <aside className={`w-64 border-r hidden md:flex flex-col p-6 transition-colors ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="mb-10 pb-4 border-b border-gray-50">
          <p className="text-2xl font-black text-[#5C59C2]">SyncTask</p>
        </div>
        
        <nav className="space-y-1 flex-1">
          <button onClick={() => setActiveTab("all")} className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${activeTab === "all" ? "bg-[#5C59C2] text-white shadow-lg shadow-[#5C59C2]/30" : "text-gray-500 hover:bg-gray-50"}`}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => setActiveTab("pending")} className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${activeTab === "pending" ? "bg-[#5C59C2] text-white shadow-lg shadow-[#5C59C2]/30" : "text-gray-500 hover:bg-gray-50"}`}>
            <Clock size={18} /> In Progress
          </button>
          <button onClick={() => setActiveTab("completed")} className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${activeTab === "completed" ? "bg-[#5C59C2] text-white shadow-lg shadow-[#5C59C2]/30" : "text-gray-500 hover:bg-gray-50"}`}>
            <CheckCircle size={18} /> Completed
          </button>
        </nav>

        <div className="mt-auto px-2 pb-4">
          <div className={`p-4 rounded-2xl border transition-all duration-500 ${darkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-[#A5A2F2]/10 border-[#A5A2F2]/20'}`}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Workspace</span>
              <span className={`text-[11px] font-black px-2 py-0.5 rounded-full transition-colors ${progressPercent === 100 ? 'bg-green-100 text-green-600' : 'bg-[#A5A2F2]/20 text-[#5C59C2]'}`}>
                {progressPercent}%
              </span>
            </div>
            <div className="w-full bg-gray-200/50 h-2 rounded-full overflow-hidden relative">
              <div className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${progressPercent === 100 ? 'bg-green-500' : 'bg-[#5C59C2]'}`} style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className={`flex justify-between items-center px-6 md:px-8 py-4 transition-colors ${darkMode ? 'bg-gray-900 border-b border-gray-800' : 'bg-transparent'}`}>
           <div className="md:hidden">
             <p className="text-xl font-black text-[#5C59C2]">SyncTask</p>
           </div>
           <div className="hidden md:flex flex-1" /> 
           <div className="flex items-center gap-4 md:gap-6"> 
              <button onClick={() => setDarkMode(!darkMode)} className={`w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-105 ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-400'}`} >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Navbar name={user?.name || "User"} darkMode={darkMode} />
           </div>
        </header>

        <div className="p-6 md:p-8 overflow-y-auto">
          <div className="mb-8">
            <h1 className={`text-3xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Hey, {user?.name? user.name.split(' ')[0] : "User"}
            </h1>
            <p className="text-gray-400 font-bold mt-1 uppercase text-[10px] tracking-widest">Manage your daily flow</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-3 mb-10">

            <div className="relative w-full md:flex-1 md:max-w-xs">
              <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
              <input 
                type="text" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                placeholder="Search..." 
                className={`w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none font-bold focus:border-gray-900 transition-all ${darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white text-gray-900 shadow-sm'}`} 
              />
            </div>

            <div className="flex w-full md:w-auto gap-2">
               <div className="relative flex-1 md:flex-none">
                 <button onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSortOpen(false); }} className={`w-full flex items-center justify-center gap-2 px-5 py-3 border border-gray-200 rounded-xl font-bold ${darkMode ? 'bg-gray-900 text-gray-300 border-gray-800' : 'bg-white text-gray-600'}`}>
                   <ListFilter size={18} /> <span>{filterCategory === "All" ? "Filter" : filterCategory}</span> <ChevronDown size={14} className={isFilterOpen ? "rotate-180 transition-transform" : ""} />
                 </button>
                 {isFilterOpen && (
                   <div className={`absolute left-0 mt-3 w-48 rounded-2xl shadow-2xl z-[100] border p-2 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                     {["All", "Work", "Personal", "Shopping", "Health"].map(cat => (
                       <button key={cat} onClick={() => {setFilterCategory(cat); setIsFilterOpen(false);}} className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg ${filterCategory === cat ? 'bg-[#5C59C2] text-white' : 'hover:bg-[#5C59C2]/10 transition-colors'}`}>
                         {cat}
                       </button>
                     ))}
                   </div>
                 )}
               </div>

               <div className="relative flex-1 md:flex-none">
                 <button onClick={() => { setIsSortOpen(!isSortOpen); setIsFilterOpen(false); }} className={`w-full flex items-center justify-center gap-2 px-5 py-3 border border-gray-200 rounded-xl font-bold ${darkMode ? 'bg-gray-900 text-gray-300 border-gray-800' : 'bg-white text-gray-600'}`}>
                   <ArrowUpDown size={18} /> <span>Sort</span> <ChevronDown size={14} className={isSortOpen ? "rotate-180 transition-transform" : ""} />
                 </button>
                 {isSortOpen && (
                   <div className={`absolute left-0 mt-3 w-48 rounded-2xl shadow-2xl z-[100] border p-2 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                     <button onClick={() => {setSortBy("newest"); setIsSortOpen(false);}} className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg ${sortBy === "newest" ? "text-[#5C59C2]" : "hover:bg-[#5C59C2]/10"}`}>Newest Date</button>
                     <button onClick={() => {setSortBy("oldest"); setIsSortOpen(false);}} className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg ${sortBy === "oldest" ? "text-[#5C59C2]" : "hover:bg-[#5C59C2]/10"}`}>Oldest Date</button>
                   </div>
                 )}
               </div>
            </div>

            <button onClick={() => setShowModal(true)} className="hidden md:flex bg-[#5C59C2] text-white px-6 py-3 rounded-xl font-black shadow-lg shadow-[#5C59C2]/30 items-center gap-2 hover:bg-[#4B48A3] active:scale-95 transition-all ml-auto">
              <Plus size={20} /> New Task
            </button>
          </div>

          {loading || isQueryLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
               <div className="w-12 h-12 border-4 border-[#5C59C2]/20 border-t-[#5C59C2] rounded-full animate-spin mb-4"></div>
               <p className="font-black text-[#5C59C2] uppercase tracking-widest animate-pulse">Syncing Tasks...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task: any) => <TaskCard key={task.id} task={task} darkMode={darkMode} />)
              ) : (
                <EmptyState darkMode={darkMode} setShowModal={setShowModal} />
              )}
            </div>
          )}
        </div>
      </main>

      <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t p-3 flex justify-around items-center z-50 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl'}`}>
        <button onClick={() => setActiveTab("all")} className={activeTab === "all" ? "text-[#5C59C2]" : "text-gray-400"}><LayoutDashboard size={20}/></button>
        <button onClick={() => setActiveTab("pending")} className={activeTab === "pending" ? "text-[#5C59C2]" : "text-gray-400"}><Clock size={20}/></button>
        <button onClick={() => setActiveTab("completed")} className={activeTab === "completed" ? "text-[#5C59C2]" : "text-gray-400"}><CheckCircle size={20}/></button>
        <button onClick={() => setShowModal(true)} className="bg-[#5C59C2] text-white p-2 rounded-lg"><Plus size={20}/></button>
      </div>

      {showModal && <TaskForm onClose={() => setShowModal(false)} />}
    </div>
  );
}

function EmptyState({ darkMode, setShowModal }: { darkMode: boolean; setShowModal: any }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center col-span-full">
      <div className={`w-24 h-24 mb-6 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-[#A5A2F2]/10'}`}>
        <CheckCircle className="text-[#A5A2F2]" size={40} />
      </div>
      <h3 className={`text-xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No tasks found</h3>
      <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-8">Ready to start your flow?</p>
      <button onClick={() => setShowModal(true)} className="text-[#5C59C2] font-black text-sm hover:underline underline-offset-4">+ Create your first task</button>
    </div>
  );
}
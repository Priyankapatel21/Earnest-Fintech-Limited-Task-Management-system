"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";
import Navbar from "@/components/Navbar"; 
import useAuth from "@/hooks/useAuth";     
import { Search, ListFilter, Plus, LayoutDashboard, Clock, CheckCircle, ChevronDown, Moon, Sun, ArrowUpDown, Menu } from "lucide-react"; 

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

  if (loading) return <div className="flex h-screen items-center justify-center font-black text-[#5C59C2] uppercase tracking-widest animate-pulse">Syncing...</div>;

  return (
    <div className={`flex flex-col md:flex-row h-screen transition-all duration-300 ${darkMode ? 'bg-gray-950 text-white' : 'bg-[#FDF9FF] text-gray-900'}`}>
      
      <aside className={`w-64 border-r hidden md:flex flex-col p-6 transition-colors ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="mb-10 pb-4 border-b border-gray-50">
          <p className="text-2xl font-black text-[#5C59C2]">SyncTask</p>
        </div>
        <nav className="space-y-1 flex-1">
          <NavButton active={activeTab === "all"} onClick={() => setActiveTab("all")} icon={<LayoutDashboard size={18}/>} label="Dashboard" />
          <NavButton active={activeTab === "pending"} onClick={() => setActiveTab("pending")} icon={<Clock size={18}/>} label="In Progress" />
          <NavButton active={activeTab === "completed"} onClick={() => setActiveTab("completed")} icon={<CheckCircle size={18}/>} label="Completed" />
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden pb-20 md:pb-0">

        <header className={`flex md:hidden justify-between items-center px-6 py-4 border-b ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <p className="text-xl font-black text-[#5C59C2]">SyncTask</p>
          <Navbar name={user?.name || "User"} darkMode={darkMode} />
        </header>

        <header className={`hidden md:flex justify-between items-center px-8 py-4 transition-colors ${darkMode ? 'bg-gray-900' : 'bg-transparent'}`}>
          <div className="flex-1" /> 
          <div className="flex items-center gap-6"> 
            <button onClick={() => setDarkMode(!darkMode)} className={`w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-105 ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-400'}`} >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Navbar name={user?.name || "User"} darkMode={darkMode} />
          </div>
        </header>

        <div className="p-4 md:p-8 overflow-y-auto">
          <div className="mb-6">
            <h1 className={`text-2xl md:text-3xl font-black tracking-tight transition-colors duration-300 ${
    darkMode ? 'text-white' : 'text-gray-900'
  }`}>
    Hey, {user?.name ? user.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : "User"}
  </h1>
            <p className="text-gray-400 font-bold uppercase text-[9px] tracking-widest mt-1">Manage your flow</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
            <div className="relative w-full sm:flex-1 lg:max-w-xs">
              <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
              <input 
                type="text" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                placeholder="Search tasks..." 
                className={`w-full pl-12 pr-4 py-3 border rounded-xl outline-none font-bold focus:border-[#5C59C2] transition-all ${darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-100 shadow-sm'}`} 
              />
            </div>

            <div className="flex w-full sm:w-auto gap-2">
              <button onClick={() => setShowModal(true)} className="flex-1 sm:hidden bg-[#5C59C2] text-white px-4 py-3 rounded-xl font-black shadow-lg flex items-center justify-center gap-2">
                <Plus size={18} /> New
              </button>
              <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 border rounded-xl font-bold ${darkMode ? 'bg-gray-900 text-gray-300 border-gray-800' : 'bg-white text-gray-600 border-gray-100 shadow-sm'}`}>
                <ListFilter size={18} /> <span>Filter</span>
              </button>
            </div>
            
            <button onClick={() => setShowModal(true)} className="hidden sm:flex bg-[#5C59C2] text-white px-6 py-3 rounded-xl font-black shadow-lg shadow-[#5C59C2]/30 items-center gap-2 hover:bg-[#4B48A3] active:scale-95 transition-all ml-auto">
              <Plus size={20} /> New Task
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredTasks.map((task: any) => <TaskCard key={task.id} task={task} darkMode={darkMode} />)}
          </div>
        </div>
      </main>

      <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t p-2 flex justify-around items-center z-50 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]'}`}>
        <MobileNavIcon active={activeTab === "all"} onClick={() => setActiveTab("all")} icon={<LayoutDashboard size={20}/>} />
        <MobileNavIcon active={activeTab === "pending"} onClick={() => setActiveTab("pending")} icon={<Clock size={20}/>} />
        <MobileNavIcon active={activeTab === "completed"} onClick={() => setActiveTab("completed")} icon={<CheckCircle size={20}/>} />
        <button onClick={() => setDarkMode(!darkMode)} className="p-3 text-gray-400">
          {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
        </button>
      </div>

      {showModal && <TaskForm onClose={() => setShowModal(false)} />}
    </div>
  );
}

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${active ? "bg-[#5C59C2] text-white shadow-lg shadow-[#5C59C2]/30" : "text-gray-500 hover:bg-gray-50"}`}>
    {icon} {label}
  </button>
);

const MobileNavIcon = ({ active, onClick, icon }: any) => (
  <button onClick={onClick} className={`p-3 rounded-xl transition-all ${active ? "text-[#5C59C2] bg-[#5C59C2]/10" : "text-gray-400"}`}>
    {icon}
  </button>
);
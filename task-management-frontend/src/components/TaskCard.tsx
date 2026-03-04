"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import TaskForm from "./TaskForm"; 
import { Trash2, Edit3, CheckCircle, Circle, Calendar } from "lucide-react";

export default function TaskCard({ task, darkMode }: { task: any; darkMode: boolean }) {
  const queryClient = useQueryClient();
  const [showEditModal, setShowEditModal] = useState(false);

  const refetch = () => queryClient.invalidateQueries({ queryKey: ["tasks"] });

  const categoryColors: any = {
    Work: "bg-[#5C59C2]",
    Personal: "bg-[#A5A2F2]",
    Shopping: "bg-[#FFB443]",
    Health: "bg-[#2ECC71]"
  };

  const handleToggle = async () => {
    try {
      await api.patch(`/tasks/${task.id}/toggle`);
      refetch();
    } catch { toast.error("Failed to update status"); }
  };

  const handleDelete = async () => {
    if (confirm("Delete this task?")) {
      try {
        await api.delete(`/tasks/${task.id}`);
        refetch();
      } catch { toast.error("Delete failed"); }
    }
  };

  return (
    <>
      <div className={`group p-5 rounded-[2rem] border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative 
        ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}
        ${task.status ? 'opacity-50' : ''}`}>
        
        <div className="flex justify-between items-start mb-4">
          <button onClick={handleToggle} className="transition-transform active:scale-90 outline-none">
            {task.status ? (
              <CheckCircle className="text-[#2ECC71]" size={24} /> 
            ) : (
              <Circle className={`${darkMode ? 'text-gray-700' : 'text-gray-200'} hover:text-[#5C59C2] transition-colors`} size={24} />
            )}
          </button>
          
          <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-all">
             <button onClick={() => setShowEditModal(true)} className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} text-gray-400 hover:text-[#5C59C2]`}>
               <Edit3 size={16}/>
             </button>
             <button onClick={handleDelete} className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} text-gray-400 hover:text-red-500`}>
               <Trash2 size={16}/>
             </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
           <div className={`w-2 h-2 rounded-full ${categoryColors[task.category] || "bg-gray-400"}`} />
           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{task.category}</span>
        </div>

        <h3 className={`text-lg font-black mb-1.5 leading-tight tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'} ${task.status ? 'line-through text-gray-300' : ''}`}>
          {task.title}
        </h3>
        
        <p className={`text-xs line-clamp-2 mb-5 font-bold leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {task.description || "No description provided."}
        </p>
        
        <div className={`flex items-center gap-3 mt-auto pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-50'}`}>
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400">
            <Calendar size={13} className="text-[#A5A2F2]" />
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "No Date"}
          </div>
        </div>
      </div>

      {showEditModal && <TaskForm task={task} onClose={() => setShowEditModal(false)} />}
    </>
  );
}
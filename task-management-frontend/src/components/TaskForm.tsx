"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { X, Calendar, Tag, Save } from "lucide-react";

interface TaskFormProps { onClose: () => void; task?: any; }

export default function TaskForm({ onClose, task }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [category, setCategory] = useState(task?.category || "Personal");
  const [dueDate, setDueDate] = useState(task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
  
  const queryClient = useQueryClient();
  const isEditMode = !!task;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.patch(`/tasks/${task.id}`, { title, description, dueDate, category });
        toast.success("Task updated");
      } else {
        await api.post("/tasks", { title, description, dueDate, category });
        toast.success("Task created");
      }
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
    } catch { toast.error(isEditMode ? "Update failed" : "Error creating task"); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"><X size={20} /></button>
        <h2 className="font-black text-2xl mb-6 text-gray-900">{isEditMode ? "Edit Task" : "Add New Task"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Title</label>
            <input className="w-full border border-gray-100 p-3 rounded-xl outline-none font-bold focus:border-gray-900 text-gray-900" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Description</label>
            <textarea className="w-full border border-gray-100 p-3 rounded-xl outline-none font-medium focus:border-gray-900 text-gray-900 min-h-[100px]" placeholder="Description..." value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Due Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                <input type="date" className="w-full border border-gray-100 p-3 pl-10 rounded-xl outline-none font-bold text-sm bg-white focus:border-gray-900" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Category</label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 text-gray-400" size={18} />
                <select className="w-full border border-gray-100 p-3 pl-10 rounded-xl outline-none font-bold text-sm bg-white appearance-none focus:border-gray-900" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Personal">Personal</option><option value="Work">Work</option><option value="Shopping">Shopping</option><option value="Health">Health</option>
                </select>
              </div>
            </div>
          </div>
          <button type="submit" className="w-full bg-[#5C59C2] text-white py-4 rounded-xl font-black shadow-lg shadow-[#5C59C2]/20 transition-all active:scale-95 flex items-center justify-center gap-2">
            {isEditMode ? <><Save size={18} /> SAVE CHANGES</> : "CREATE TASK"}
          </button>
        </form>
      </div>
    </div>
  );
}
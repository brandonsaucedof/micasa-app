"use client";

import { useTransition, useState } from "react";
import { updateInventoryQuantity, updateInventoryStatus } from "@/app/actions/inventory";
import { Minus, Plus, AlertCircle, CheckCircle2, ChevronDown } from "lucide-react";

type ItemProps = {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  minQuantity: number;
  status: string;
};

export default function InventoryItem({ id, name, unit, quantity, minQuantity, status }: ItemProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticQty, setOptimisticQty] = useState(quantity);
  const [optimisticStatus, setOptimisticStatus] = useState(status);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const handleQtyChange = (delta: number) => {
    const newQty = Math.max(0, optimisticQty + delta);
    setOptimisticQty(newQty);
    
    // Auto calculate status for optimism
    let newStatus = "suficiente";
    if (newQty <= 0) newStatus = "agotado";
    else if (newQty <= minQuantity) newStatus = "poco";
    setOptimisticStatus(newStatus);

    startTransition(() => {
      updateInventoryQuantity(id, newQty, minQuantity);
    });
  };

  const handleStatusChange = (newStatus: string) => {
    setOptimisticStatus(newStatus);
    setShowStatusMenu(false);
    startTransition(() => {
      updateInventoryStatus(id, newStatus);
    });
  };

  const getStatusColor = (s: string) => {
    if (s === "suficiente") return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/50";
    if (s === "poco") return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50";
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50";
  };

  return (
    <div className={`p-4 rounded-2xl border bg-white dark:bg-slate-900 flex flex-col space-y-3 transition-colors ${isPending ? 'opacity-70' : 'opacity-100'} shadow-sm ${getStatusColor(optimisticStatus)}`}>
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg">{name}</h3>
        
        {/* Status Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/50 dark:bg-slate-950/50 text-xs font-semibold backdrop-blur-sm shadow-sm"
          >
            <span className="capitalize">{optimisticStatus}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          
          {showStatusMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-10">
              <button onClick={() => handleStatusChange("suficiente")} className="w-full text-left px-4 py-2 text-xs font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20">Suficiente</button>
              <button onClick={() => handleStatusChange("poco")} className="w-full text-left px-4 py-2 text-xs font-medium text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20">Poco</button>
              <button onClick={() => handleStatusChange("agotado")} className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">Agotado</button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-baseline space-x-1">
          <span className="text-2xl font-black text-slate-900 dark:text-white">{optimisticQty}</span>
          <span>{unit}</span>
        </div>
        
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
          <button 
            onClick={() => handleQtyChange(-1)}
            disabled={optimisticQty <= 0 || isPending}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 shadow-sm hover:text-indigo-600 disabled:opacity-50 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleQtyChange(1)}
            disabled={isPending}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 shadow-sm hover:text-indigo-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

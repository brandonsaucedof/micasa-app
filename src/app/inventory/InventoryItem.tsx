"use client";

import { useTransition, useState } from "react";
import { updateInventoryQuantity, updateInventoryStatus, addToShoppingList } from "@/app/actions/inventory";
import { Minus, Plus, ChevronDown, ShoppingCart, CheckCircle2 } from "lucide-react";

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
  const [addedToList, setAddedToList] = useState(false);

  const handleAddToList = () => {
    setAddedToList(true);
    startTransition(() => {
      addToShoppingList(id);
      setTimeout(() => setAddedToList(false), 2000);
    });
  };

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
    if (s === "suficiente") return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    if (s === "poco") return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
  };

  return (
    <div className={`p-4 rounded-3xl glass-card flex flex-col space-y-4 transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md ${isPending ? 'opacity-70 scale-95' : 'opacity-100'} ${getStatusColor(optimisticStatus)} border`}>
      <div className="flex justify-between items-start">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight pr-2">{name}</h3>
        
        {/* Status Dropdown */}
        <div className="relative flex-shrink-0 z-20">
          <button 
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full bg-white/60 dark:bg-slate-900/60 text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm border border-white/20 dark:border-slate-700/30 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            <span>{optimisticStatus}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          <button
            onClick={handleAddToList}
            disabled={isPending || addedToList}
            className="ml-2 flex items-center space-x-1 px-2.5 py-1.5 rounded-full bg-primary-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {addedToList ? <CheckCircle2 className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
          </button>
          
          {showStatusMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/10 border border-slate-100 dark:border-slate-700/50 overflow-hidden z-30 animate-pop-in origin-top-right">
              <button onClick={() => handleStatusChange("suficiente")} className="w-full text-left px-4 py-3 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">Suficiente</button>
              <button onClick={() => handleStatusChange("poco")} className="w-full text-left px-4 py-3 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">Poco</button>
              <button onClick={() => handleStatusChange("agotado")} className="w-full text-left px-4 py-3 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Agotado</button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-end justify-between mt-auto">
        <div className="flex items-baseline space-x-1">
          <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{optimisticQty}</span>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{unit}</span>
        </div>
        
        <div className="flex items-center space-x-1.5 bg-white/50 dark:bg-slate-900/50 p-1.5 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-slate-700/30">
          <button 
            onClick={() => handleQtyChange(-1)}
            disabled={optimisticQty <= 0 || isPending}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 shadow-sm hover:text-emerald-600 dark:hover:text-emerald-400 disabled:opacity-40 transition-all active:scale-90"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleQtyChange(1)}
            disabled={isPending}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 shadow-sm hover:text-emerald-600 dark:hover:text-emerald-400 transition-all active:scale-90"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

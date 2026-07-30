"use client";

import { useTransition, useState } from "react";
import { toggleShoppingItem, deleteShoppingItem } from "@/app/actions/shopping";
import { Check, Trash2 } from "lucide-react";

type ItemProps = {
  id: string;
  name: string;
  isPurchased: boolean;
};

export default function ShoppingItem({ id, name, isPurchased }: ItemProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticPurchased, setOptimisticPurchased] = useState(isPurchased);

  const handleToggle = () => {
    const newState = !optimisticPurchased;
    setOptimisticPurchased(newState);
    startTransition(() => {
      toggleShoppingItem(id, newState);
    });
  };

  const handleDelete = () => {
    if (confirm("¿Eliminar de la lista?")) {
      startTransition(() => {
        deleteShoppingItem(id);
      });
    }
  };

  return (
    <div className={`flex items-center justify-between p-4 glass-card rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 ${optimisticPurchased ? 'border-emerald-200/50 dark:border-emerald-900/50 opacity-70 scale-[0.98]' : ''} ${isPending ? 'opacity-50' : ''}`}>
      <button 
        onClick={handleToggle}
        className="flex items-center flex-1 text-left group"
      >
        <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center mr-4 transition-all duration-300 ${optimisticPurchased ? 'bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/30' : 'border-slate-300 dark:border-slate-600 group-hover:border-primary-400 dark:group-hover:border-primary-500'}`}>
          {optimisticPurchased && <Check className="w-4 h-4 text-white" />}
        </div>
        <span className={`font-bold text-lg transition-all duration-300 ${optimisticPurchased ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-300'}`}>
          {name}
        </span>
      </button>
      
      <button 
        onClick={handleDelete}
        disabled={isPending}
        className="p-2.5 text-slate-300 hover:text-white dark:text-slate-600 hover:bg-red-500 rounded-xl transition-all shadow-sm hover:shadow-red-500/30 active:scale-90"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}

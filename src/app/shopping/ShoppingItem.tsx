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
    <div className={`flex items-center justify-between p-4 bg-white dark:bg-slate-900 border rounded-2xl transition-all ${optimisticPurchased ? 'border-emerald-200 dark:border-emerald-900/50 opacity-60' : 'border-slate-200 dark:border-slate-800 shadow-sm'} ${isPending ? 'opacity-50' : ''}`}>
      <button 
        onClick={handleToggle}
        className="flex items-center flex-1 text-left"
      >
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${optimisticPurchased ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600'}`}>
          {optimisticPurchased && <Check className="w-4 h-4 text-white" />}
        </div>
        <span className={`font-medium text-lg transition-all ${optimisticPurchased ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
          {name}
        </span>
      </button>
      
      <button 
        onClick={handleDelete}
        disabled={isPending}
        className="p-2 text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}

"use client";

import { useTransition, useState } from "react";
import { updateInventoryQuantity, updateInventoryStatus, addToShoppingList, deleteInventoryProduct } from "@/app/actions/inventory";
import { Minus, Plus, ShoppingCart, CheckCircle2, Trash2, X, Settings2 } from "lucide-react";

type ItemProps = {
  id: string;
  productId: string;
  name: string;
  unit: string;
  quantity: number;
  minQuantity: number;
  status: string;
  addedByName?: string;
};

export default function InventoryItem({ id, productId, name, unit, quantity, minQuantity, status, addedByName }: ItemProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticQty, setOptimisticQty] = useState(quantity);
  const [optimisticStatus, setOptimisticStatus] = useState(status);
  const [addedToList, setAddedToList] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToList = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Prevent opening modal
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
    startTransition(() => {
      updateInventoryStatus(id, newStatus);
    });
  };

  const handleDelete = () => {
    if (confirm(`¿Estás seguro de que deseas eliminar "${name}" del inventario?`)) {
      setIsModalOpen(false);
      startTransition(() => {
        deleteInventoryProduct(productId);
      });
    }
  };

  const getStatusColor = (s: string) => {
    if (s === "suficiente") return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    if (s === "poco") return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
  };

  return (
    <>
      {/* Clean Card UI */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className={`p-4 rounded-3xl glass-card flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-md cursor-pointer ${isPending ? 'opacity-70 scale-95' : 'opacity-100'} ${getStatusColor(optimisticStatus)} border min-h-[140px] relative overflow-hidden group`}
      >
        {/* Top Info */}
        <div className="z-10 relative">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight pr-8">{name}</h3>
          {addedByName && (
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 opacity-70">Añadido por: {addedByName}</p>
          )}
        </div>

        {/* Configuration Icon (Visible on hover) */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 text-slate-400">
          <Settings2 className="w-4 h-4" />
        </div>

        {/* Bottom Bar: Qty and Cart */}
        <div className="flex items-end justify-between mt-auto z-10 relative">
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{optimisticQty}</span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{unit}</span>
          </div>
          
          <button
            onClick={handleAddToList}
            disabled={isPending || addedToList}
            className="flex items-center space-x-1 p-2.5 rounded-full bg-primary-500 text-white shadow-md hover:bg-primary-600 transition-colors disabled:opacity-50 shrink-0 transform active:scale-90"
          >
            {addedToList ? <CheckCircle2 className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div>
        
        {/* Status indicator bar (Background accent) */}
        <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${optimisticStatus === 'suficiente' ? 'bg-emerald-400' : optimisticStatus === 'poco' ? 'bg-amber-400' : 'bg-red-400'} opacity-20 group-hover:opacity-40 transition-opacity`} />
      </div>

      {/* Configuration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in p-4 sm:p-0">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl border border-white/20 dark:border-slate-800 animate-slide-up overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{name}</h2>
                <p className="text-sm font-bold text-slate-500 mt-1">Configuración del producto</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Quantity Modifier */}
              <div className="glass-panel p-4 rounded-3xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Cantidad Actual</p>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{optimisticQty}</span>
                    <span className="text-sm font-bold text-slate-500">{unit}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <button 
                    onClick={() => handleQtyChange(-1)}
                    disabled={optimisticQty <= 0 || isPending}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-emerald-500 disabled:opacity-40 transition-all active:scale-90"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleQtyChange(1)}
                    disabled={isPending}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-all active:scale-90"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-2">Estado Manual</p>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => handleStatusChange("suficiente")} 
                    className={`py-3 px-2 rounded-2xl text-xs font-black transition-colors ${optimisticStatus === "suficiente" ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                  >
                    Suficiente
                  </button>
                  <button 
                    onClick={() => handleStatusChange("poco")} 
                    className={`py-3 px-2 rounded-2xl text-xs font-black transition-colors ${optimisticStatus === "poco" ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                  >
                    Poco
                  </button>
                  <button 
                    onClick={() => handleStatusChange("agotado")} 
                    className={`py-3 px-2 rounded-2xl text-xs font-black transition-colors ${optimisticStatus === "agotado" ? 'bg-red-500 text-white shadow-md shadow-red-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                  >
                    Agotado
                  </button>
                </div>
              </div>

              {/* Delete Area */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={handleDelete} 
                  disabled={isPending} 
                  className="w-full flex items-center justify-center px-4 py-4 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-500 text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 group"
                >
                  <Trash2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Eliminar Producto Definitivamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

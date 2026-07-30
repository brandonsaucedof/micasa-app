"use client";

import { useState } from "react";
import { BarChart3, PackageCheck, Receipt, Calendar } from "lucide-react";

type PurchaseItem = {
  id: string;
  name: string;
  planning_week: string;
  purchase_id: string;
};

type Purchase = {
  id: string;
  total_amount: number;
  created_at: string;
  store_name: string;
};

type AnalyticsContentProps = {
  purchases: Purchase[];
  shoppingItems: PurchaseItem[];
};

export default function AnalyticsContent({ purchases, shoppingItems }: AnalyticsContentProps) {
  const [selectedWeek, setSelectedWeek] = useState<string>("Semana 1");
  const weeks = ["Semana 1", "Semana 2", "Semana 3", "Semana 4"];

  // Calculate total spent per week
  const getSpentForWeek = (week: string) => {
    // Find all purchase_ids associated with this week's shopping items
    const weekPurchaseIds = new Set(
      shoppingItems.filter(item => item.planning_week === week && item.purchase_id).map(i => i.purchase_id)
    );
    
    // Sum the total amounts of those purchases
    return purchases
      .filter(p => weekPurchaseIds.has(p.id))
      .reduce((sum, p) => sum + Number(p.total_amount), 0);
  };

  // Get items for the selected week
  const itemsForSelectedWeek = shoppingItems.filter(item => item.planning_week === selectedWeek);

  return (
    <div className="space-y-6">
      
      {/* Resumen Semanal Chart Box */}
      <div className="glass-card p-6 rounded-3xl shadow-sm">
        <h2 className="font-extrabold text-slate-900 dark:text-white text-lg flex items-center mb-4">
          <BarChart3 className="w-5 h-5 mr-2 text-primary-500" />
          Gasto por Semana
        </h2>
        
        <div className="flex items-end justify-between h-32 mb-2 gap-2">
          {weeks.map(week => {
            const spent = getSpentForWeek(week);
            const maxSpent = Math.max(...weeks.map(w => getSpentForWeek(w))) || 1;
            const height = Math.max((spent / maxSpent) * 100, 5); // min 5% height
            const isActive = selectedWeek === week;
            
            return (
              <div 
                key={week}
                onClick={() => setSelectedWeek(week)}
                className="flex flex-col items-center flex-1 cursor-pointer group"
              >
                <div className="relative w-full flex justify-center h-full items-end pb-2">
                  <div 
                    className={`w-full max-w-[40px] rounded-t-xl transition-all duration-500 ${isActive ? 'bg-primary-500 shadow-lg shadow-primary-500/30' : 'bg-slate-200 dark:bg-slate-700 group-hover:bg-primary-300 dark:group-hover:bg-primary-800'}`}
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
                <p className={`text-[10px] font-bold ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  {week.replace('Semana ', 'S')}
                </p>
                <p className="text-xs font-black text-slate-900 dark:text-white">
                  Bs{spent.toFixed(0)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detalle de la semana seleccionada */}
      <div className="glass-panel p-1 rounded-2xl shadow-inner border border-slate-200/50 dark:border-slate-800/50 flex mb-4">
        {weeks.map(week => (
          <button
            key={week}
            onClick={() => setSelectedWeek(week)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              selectedWeek === week
                ? "bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm"
                : "text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50"
            }`}
          >
            {week}
          </button>
        ))}
      </div>

      <div className="glass-card p-6 rounded-3xl shadow-md border-t-4 border-t-primary-500">
        <h3 className="font-extrabold text-slate-900 dark:text-white mb-4 flex items-center">
          <PackageCheck className="w-5 h-5 mr-2 text-primary-500" />
          Comprado en {selectedWeek}
        </h3>
        
        {itemsForSelectedWeek.length === 0 ? (
          <div className="text-center py-6 opacity-60">
            <Receipt className="w-8 h-8 mx-auto mb-2 text-slate-400" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No hay compras en esta semana.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {itemsForSelectedWeek.map(item => (
              <li key={item.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}

// Just an icon helper
function CheckCircle2(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

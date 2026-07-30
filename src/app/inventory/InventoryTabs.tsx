"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Package, Archive } from "lucide-react";

export default function InventoryTabs({ currentTab }: { currentTab: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex bg-white/20 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-1 shadow-inner border border-white/30 dark:border-slate-700/50 mb-6">
      <button
        onClick={() => setTab("active")}
        className={`flex-1 flex items-center justify-center py-2 text-xs font-bold rounded-xl transition-all ${
          currentTab === "active"
            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" 
            : "text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-slate-700/50"
        }`}
      >
        <Package className="w-4 h-4 mr-2" />
        Activos
      </button>
      <button
        onClick={() => setTab("archived")}
        className={`flex-1 flex items-center justify-center py-2 text-xs font-bold rounded-xl transition-all ${
          currentTab === "archived"
            ? "bg-slate-500 text-white shadow-md shadow-slate-500/30" 
            : "text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-slate-700/50"
        }`}
      >
        <Archive className="w-4 h-4 mr-2" />
        Archivados
      </button>
    </div>
  );
}

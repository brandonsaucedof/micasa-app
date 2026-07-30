"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MonthSelector({ currentMonthStr }: { currentMonthStr: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentDate = new Date(currentMonthStr + "-01T12:00:00Z"); // Evitar problemas de zona horaria
  
  const handlePrev = () => {
    const prev = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    updateMonth(prev);
  };
  
  const handleNext = () => {
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    updateMonth(next);
  };
  
  const updateMonth = (date: Date) => {
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const params = new URLSearchParams(searchParams.toString());
    params.set('month', monthStr);
    router.push(`${pathname}?${params.toString()}`);
  };

  const monthName = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

  return (
    <div className="flex items-center justify-between w-full max-w-[200px] mb-4 bg-white/20 dark:bg-slate-800/50 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/30 dark:border-slate-700/50 shadow-sm mx-auto z-20 relative">
      <button onClick={handlePrev} className="p-1 hover:bg-white/30 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-100 dark:text-slate-300">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <span className="text-xs font-bold capitalize text-white">{monthName}</span>
      <button onClick={handleNext} className="p-1 hover:bg-white/30 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-100 dark:text-slate-300">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

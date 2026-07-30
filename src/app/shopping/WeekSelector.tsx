"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function WeekSelector({ currentWeek }: { currentWeek: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const weeks = ["Semana 1", "Semana 2", "Semana 3", "Semana 4"];

  const setWeek = (week: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('week', week);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex bg-white/20 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-1 shadow-inner border border-white/30 dark:border-slate-700/50">
      {weeks.map(week => {
        const isActive = week === currentWeek;
        return (
          <button
            key={week}
            onClick={() => setWeek(week)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              isActive 
                ? "bg-primary-500 text-white shadow-md shadow-primary-500/30" 
                : "text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-slate-700/50"
            }`}
          >
            {week}
          </button>
        );
      })}
    </div>
  );
}

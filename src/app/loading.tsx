import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full min-h-[50vh] animate-fade-in relative z-20">
      <div className="w-20 h-20 bg-white/40 dark:bg-slate-800/40 rounded-[2rem] flex flex-col items-center justify-center backdrop-blur-xl shadow-2xl border border-white/40 dark:border-slate-700/50 animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-premium opacity-10"></div>
        <Loader2 className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-spin relative z-10" />
      </div>
      <p className="mt-6 text-sm font-extrabold text-slate-500 dark:text-slate-400 tracking-widest uppercase animate-pulse">
        Cargando
      </p>
    </div>
  );
}

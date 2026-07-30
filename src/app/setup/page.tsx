import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { createHome, joinHome } from "@/app/actions/homes";
import { Home, Plus, KeyRound, AlertCircle, LogOut, Sparkles } from "lucide-react";
import { logout } from "@/app/actions/auth";

export default async function SetupPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Verificar si ya tiene casa
  const { data: membership } = await supabase
    .from("home_members")
    .select("home_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (membership) {
    return redirect("/");
  }

  const params = await searchParams;
  const message = params?.message;

  return (
    <div className="flex-1 flex flex-col p-6 min-h-screen relative overflow-y-auto no-scrollbar">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10 mt-4 animate-fade-in z-10">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Bienvenido</h1>
        <form action={logout}>
          <button type="submit" className="text-slate-500 hover:text-red-500 transition-colors p-2 glass-panel rounded-full hover:bg-white/80 dark:hover:bg-slate-800/80">
            <LogOut className="w-5 h-5" />
          </button>
        </form>
      </div>

      <div className="text-center mb-10 animate-slide-up z-10">
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 bg-primary-500 blur-lg opacity-40 rounded-full"></div>
          <div className="relative w-20 h-20 bg-gradient-premium text-white rounded-full flex items-center justify-center shadow-xl shadow-primary-500/40 transform hover:scale-105 transition-transform duration-300">
            <Home className="w-10 h-10" />
            <Sparkles className="absolute top-0 right-0 w-5 h-5 text-yellow-300 animate-pulse-slow" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          Configura tu Hogar
        </h2>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
          Crea un nuevo espacio o únete a uno existente para empezar a gestionar.
        </p>
      </div>

      {message && (
        <div className="mb-6 bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-start text-sm border border-red-500/20 animate-pop-in z-10">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
          <p className="font-medium">{message}</p>
        </div>
      )}

      <div className="space-y-6 z-10 flex-1 flex flex-col justify-center pb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        
        {/* Crear Casa */}
        <div className="glass-card p-6 rounded-3xl group">
          <div className="flex items-center space-x-4 mb-5">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Crear nueva casa</h3>
              <p className="text-xs font-medium text-primary-500 dark:text-primary-400">Serás el administrador</p>
            </div>
          </div>
          
          <form action={createHome} className="space-y-4">
            <input
              name="name"
              type="text"
              placeholder="Ej. Familia Saucedo"
              required
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white rounded-xl text-sm font-bold transition-all transform hover:-translate-y-0.5 shadow-md shadow-primary-500/20"
            >
              Crear mi casa
            </button>
          </form>
        </div>

        <div className="relative flex items-center py-2 opacity-60">
          <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
          <span className="flex-shrink-0 mx-4 text-xs font-bold text-slate-500 dark:text-slate-400 tracking-widest">O TAMBIÉN</span>
          <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
        </div>

        {/* Unirse a Casa */}
        <div className="glass-card p-6 rounded-3xl group">
          <div className="flex items-center space-x-4 mb-5">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-inner">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Unirse con código</h3>
              <p className="text-xs font-medium text-emerald-500 dark:text-emerald-400">Si alguien ya creó una casa</p>
            </div>
          </div>
          
          <form action={joinHome} className="space-y-4">
            <input
              name="code"
              type="text"
              placeholder="CÓDIGO DE 6 DÍGITOS"
              required
              maxLength={6}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 uppercase tracking-widest text-center font-bold placeholder:font-medium placeholder:tracking-normal placeholder:text-slate-400 transition-all shadow-sm"
            />
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-sm font-bold transition-all transform hover:-translate-y-0.5 shadow-md shadow-emerald-500/20"
            >
              Unirme a la casa
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import { createClient } from "@/utils/supabase/server";
import { logout } from "@/app/actions/auth";
import { User, LogOut, Settings, ChevronLeft, ShieldCheck, Moon, Bell } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex-1 flex flex-col relative h-full">
      {/* Premium Header */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between z-10 animate-fade-in bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0">
        <div className="flex items-center space-x-3">
          <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:scale-105">
            <ChevronLeft className="w-5 h-5 -ml-0.5" />
          </Link>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Perfil</h1>
        </div>
        <button className="p-2.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 glass rounded-full transition-all hover:scale-105 relative shadow-sm">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-6 flex flex-col space-y-6 pb-24 z-10 animate-slide-up">
        {/* Profile Card */}
        <div className="bg-gradient-premium p-1 rounded-3xl shadow-xl shadow-primary-500/20">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl p-6 rounded-[22px] flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
            
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-primary-500 rounded-full blur-md opacity-40"></div>
              <div className="w-24 h-24 bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center relative border-4 border-white dark:border-slate-800 shadow-lg z-10">
                <User className="w-10 h-10" />
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center z-20 shadow-sm">
                <ShieldCheck className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1 relative z-10">
              {user.user_metadata?.name || "Usuario Premium"}
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 relative z-10">
              {user.email}
            </p>
          </div>
        </div>

        {/* Settings Menu */}
        <div className="glass-panel rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Moon className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">Tema Oscuro</span>
            </div>
            <div className="w-12 h-6 bg-primary-500 rounded-full p-1 flex justify-end shadow-inner cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
          <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bell className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">Notificaciones</span>
            </div>
            <div className="w-12 h-6 bg-slate-300 dark:bg-slate-700 rounded-full p-1 flex justify-start shadow-inner cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="glass-panel rounded-3xl overflow-hidden shadow-sm border border-red-200/50 dark:border-red-900/30">
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-4 text-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-bold group"
            >
              <LogOut className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span>Cerrar sesión</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

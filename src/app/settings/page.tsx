import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Settings as SettingsIcon, LogOut, Home as HomeIcon, ShoppingCart, Package, TrendingUp } from "lucide-react";
import { logout } from "@/app/actions/auth";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const firstName = user.user_metadata?.name || "Usuario";

  return (
    <div className="flex-1 flex flex-col relative h-full bg-slate-50 dark:bg-slate-950">
      
      {/* Premium Header */}
      <header className="px-6 pt-10 pb-6 flex items-center justify-between z-10 sticky top-0 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center">
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl flex items-center justify-center mr-3 shadow-inner">
            <SettingsIcon className="w-5 h-5" />
          </div>
          Ajustes
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-8 pb-32 no-scrollbar animate-slide-up">
        
        <SettingsClient initialName={firstName} email={user.email || ""} />

        {/* Account Section */}
        <div>
          <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 ml-2">Cuenta</h3>
          <div className="glass-panel rounded-3xl overflow-hidden">
            <form action={logout}>
              <button type="submit" className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LogOut className="w-5 h-5 ml-1" />
                  </div>
                  <span className="font-bold text-red-500">Cerrar Sesión</span>
                </div>
              </button>
            </form>
          </div>
        </div>

      </main>

      {/* Premium Floating Bottom Navigation */}
      <div className="absolute bottom-6 left-6 right-6 z-20">
        <nav className="glass-panel rounded-full px-6 py-3.5 flex justify-between items-center shadow-2xl">
          <Link href="/" className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <HomeIcon className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Inicio</span>
          </Link>
          <Link href="/shopping" className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ShoppingCart className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Compras</span>
          </Link>
          <Link href="/inventory" className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <Package className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Casa</span>
          </Link>
          <Link href="/expenses" className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <TrendingUp className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Analytics</span>
          </Link>
          <button className="flex flex-col items-center p-2 text-slate-800 dark:text-slate-200 relative">
            <div className="absolute -top-1 w-8 h-1 bg-slate-800 dark:bg-slate-200 rounded-full"></div>
            <SettingsIcon className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Ajustes</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

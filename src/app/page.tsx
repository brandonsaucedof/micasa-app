import { createClient } from "@/utils/supabase/server";
import { LogOut, Plus, ShoppingCart, Package, TrendingUp, Bell, User } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const firstName = user.user_metadata?.name?.split(" ")[0] || "Usuario";

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 px-6 py-5 rounded-b-[2rem] shadow-sm flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <Link href="/profile">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors">
              <User className="w-5 h-5" />
            </div>
          </Link>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Hola, {firstName}</p>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
              🏠 Casa Sin Asignar
            </h1>
          </div>
        </div>
        <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-500 text-white p-4 rounded-2xl shadow-md shadow-indigo-200 dark:shadow-none relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <ShoppingCart className="w-6 h-6 mb-3 text-indigo-100" />
            <h3 className="text-2xl font-bold">0</h3>
            <p className="text-xs font-medium text-indigo-100 mt-1">Por comprar</p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <Package className="w-6 h-6 mb-3 text-orange-500" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">0</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">En inventario</p>
          </div>
        </div>

        {/* Expenses Widget */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Gastado este mes</p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bs 0</h2>
          </div>
          <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Setup Call to Action */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 p-5 rounded-2xl text-center space-y-3">
          <h3 className="font-bold text-indigo-900 dark:text-indigo-100">Configura tu Casa</h3>
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            Crea una casa o únete a una existente para empezar a gestionar tus compras.
          </p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors shadow-sm">
            Crear Casa
          </button>
        </div>

      </main>

      {/* Floating Action Button */}
      <button className="absolute bottom-20 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition-all z-20">
        <Plus className="w-6 h-6" />
      </button>

      {/* Bottom Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-10 sticky bottom-0">
        <button className="flex flex-col items-center p-2 text-indigo-600 dark:text-indigo-400">
          <HomeIcon className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Inicio</span>
        </button>
        <button className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ShoppingCart className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Compras</span>
        </button>
        <button className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <Package className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Casa</span>
        </button>
        <button className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <TrendingUp className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Gastos</span>
        </button>
      </nav>
    </div>
  );
}

// Temporary icon to avoid naming conflict with component
function HomeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

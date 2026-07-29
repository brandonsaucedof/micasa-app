import { Home, ShoppingCart, Package2, BarChart3, Plus } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="px-6 py-8 pb-4 bg-indigo-600 text-white rounded-b-3xl shadow-md z-10">
        <h1 className="text-xl font-medium opacity-90">👋 Hola, Brandon</h1>
        <h2 className="text-3xl font-bold mt-1 flex items-center gap-2">
          <Home className="w-8 h-8" /> Casa Saucedo
        </h2>
      </header>

      {/* Main Content (Scrollable) */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col items-center text-center">
            <ShoppingCart className="w-8 h-8 text-indigo-500 mb-2" />
            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">8</span>
            <span className="text-sm text-slate-500 dark:text-slate-400 leading-tight mt-1">pendientes</span>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col items-center text-center">
            <Package2 className="w-8 h-8 text-amber-500 mb-2" />
            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">3</span>
            <span className="text-sm text-slate-500 dark:text-slate-400 leading-tight mt-1">por acabarse</span>
          </div>
        </div>

        {/* Expenses Summary */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BarChart3 className="w-24 h-24" />
          </div>
          <p className="text-indigo-100 font-medium">Gastado este mes</p>
          <p className="text-4xl font-bold mt-1">Bs 1.350</p>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">Acciones rápidas</h3>
          <div className="space-y-3">
            <button className="w-full bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50 flex items-center gap-4 active:scale-95 transition-transform">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Plus className="w-5 h-5" />
              </div>
              <span className="font-medium">Agregar producto</span>
            </button>
            <button className="w-full bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50 flex items-center gap-4 active:scale-95 transition-transform">
              <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <span className="font-medium">Agregar a compras</span>
            </button>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button className="absolute bottom-24 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 active:scale-90 transition-all z-20">
        <Plus className="w-6 h-6" />
      </button>

      {/* Bottom Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-around p-4 z-10 safe-area-bottom pb-8">
        <button className="flex flex-col items-center text-indigo-600 dark:text-indigo-400">
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Inicio</span>
        </button>
        <button className="flex flex-col items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <ShoppingCart className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Compras</span>
        </button>
        <button className="flex flex-col items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <Package2 className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Casa</span>
        </button>
        <button className="flex flex-col items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <BarChart3 className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Estadísticas</span>
        </button>
      </nav>
    </div>
  );
}

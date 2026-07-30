import { createClient } from "@/utils/supabase/server";
import { LogOut, Plus, ShoppingCart, Package, TrendingUp, Bell, User, Settings, Zap } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user's home
  const { data: membership } = await supabase
    .from("home_members")
    .select("homes(id, name)")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!membership || !membership.homes) {
    redirect("/setup");
  }

  // Type assertion since we know homes is not an array from this query
  const currentHome = membership.homes as unknown as { id: string, name: string };
  const firstName = user.user_metadata?.name?.split(" ")[0] || "Usuario";

  return (
    <div className="flex-1 flex flex-col relative h-full">
      
      {/* Premium Header */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between z-10 animate-fade-in">
        <div className="flex items-center space-x-4">
          <Link href="/profile" className="relative group">
            <div className="absolute inset-0 bg-primary-500 rounded-full blur-md opacity-40 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative w-12 h-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center border border-white/50 dark:border-slate-700/50 shadow-lg">
              <User className="w-6 h-6" />
            </div>
          </Link>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hola, {firstName}</p>
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center">
              {currentHome.name}
            </h1>
          </div>
        </div>

      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 pt-4 pb-32 space-y-6 no-scrollbar z-10 animate-slide-up">
        
        {/* Hero Card */}
        <div className="relative overflow-hidden bg-gradient-premium p-6 rounded-3xl shadow-xl shadow-primary-500/20 text-white">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-500/40 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-1">
              <Zap className="w-4 h-4 text-yellow-300" />
              <p className="text-xs font-bold text-primary-100 uppercase tracking-widest">Resumen del mes</p>
            </div>
            <h2 className="text-3xl font-extrabold mb-4 mt-2">Bs 0 <span className="text-sm font-medium text-primary-200">gastados</span></h2>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/20">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <p className="text-xs font-medium text-primary-100">Dentro del presupuesto</p>
              </div>
              <Link href="/expenses" className="text-xs font-bold hover:text-primary-200 transition-colors flex items-center">
                Ver más <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/shopping" className="glass-card p-5 rounded-3xl flex flex-col group">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">0</h3>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">Por comprar</p>
          </Link>
          
          <Link href="/inventory" className="glass-card p-5 rounded-3xl flex flex-col group">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">0</h3>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">En inventario</p>
          </Link>
        </div>

        {/* Settings/Info Widget */}
        <Link href="/family" className="glass-panel p-5 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Configurar hogar</h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Invita miembros o ajusta reglas</p>
            </div>
          </div>
          <div className="text-slate-400 group-hover:text-primary-500 transition-colors">
            <span className="text-xl">→</span>
          </div>
        </Link>

      </main>



      {/* Premium Floating Bottom Navigation */}
      <div className="absolute bottom-6 left-6 right-6 z-20">
        <nav className="glass-panel rounded-full px-6 py-3.5 flex justify-between items-center shadow-2xl">
          <button className="flex flex-col items-center p-2 text-primary-600 dark:text-primary-400 relative">
            <div className="absolute -top-1 w-8 h-1 bg-primary-600 dark:bg-primary-400 rounded-full"></div>
            <HomeIcon className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Inicio</span>
          </button>
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
            <span className="text-[10px] font-bold">Gastos</span>
          </Link>
        </nav>
      </div>
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
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

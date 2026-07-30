import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TrendingUp, Receipt, Calendar, Package, ShoppingCart, Home as HomeIcon } from "lucide-react";

export default async function ExpensesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: membership } = await supabase
    .from("home_members")
    .select("home_id")
    .eq("user_id", user.id)
    .single();

  if (!membership) redirect("/setup");

  // Obtener compras con el nombre de quien compró
  const { data: purchases } = await supabase
    .from("purchases")
    .select(`
      id,
      total_amount,
      store_name,
      created_at,
      users (
        name
      )
    `)
    .eq("home_id", membership.home_id)
    .order("created_at", { ascending: false });

  const totalSpent = purchases?.reduce((sum, p) => sum + Number(p.total_amount), 0) || 0;

  return (
    <div className="flex-1 flex flex-col relative h-full">
      
      {/* Premium Hero Header */}
      <header className="relative bg-gradient-premium pt-12 pb-20 px-6 rounded-b-[3rem] z-10 shadow-2xl shadow-primary-500/20 overflow-hidden animate-fade-in">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 bottom-0 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner border border-white/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-primary-100 text-sm font-bold uppercase tracking-widest mb-2">Gasto Acumulado</p>
          <h1 className="text-5xl font-black text-white flex items-center">
            <span className="text-3xl font-medium opacity-80 mr-2">Bs</span>
            {totalSpent.toFixed(2)}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 -mt-10 relative z-20 space-y-6 pb-32 animate-slide-up">
        
        <div className="glass-panel p-6 rounded-3xl shadow-xl flex items-center justify-between mb-2">
          <div>
            <h2 className="font-extrabold text-slate-900 dark:text-white text-lg">Historial de tickets</h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Todas las compras del hogar</p>
          </div>
          <div className="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-3 py-1.5 rounded-full text-xs font-black border border-primary-100 dark:border-primary-800/50">
            {purchases?.length || 0} items
          </div>
        </div>

        <div className="space-y-4">
          {purchases?.length === 0 ? (
            <div className="glass-card p-10 rounded-3xl text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Receipt className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Sin gastos</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Aún no hay compras registradas.</p>
            </div>
          ) : (
            purchases?.map((p: any, index: number) => {
              const date = new Date(p.created_at);
              return (
                <div key={p.id} className="glass-card p-4 rounded-3xl flex items-center justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 border border-primary-100/50 dark:border-primary-800/30">
                      <Receipt className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {p.store_name || "Compra General"}
                      </h3>
                      <div className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">{p.users?.name || "Alguien"}</span>
                        <span className="mx-2 opacity-30">•</span>
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {date.toLocaleDateString("es-ES", { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right pl-3">
                    <p className="font-black text-slate-900 dark:text-white text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      Bs{Number(p.total_amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </main>

      {/* Premium Floating Bottom Navigation */}
      <div className="absolute bottom-6 left-6 right-6 z-30">
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
          <button className="flex flex-col items-center p-2 text-purple-500 dark:text-purple-400 relative">
            <div className="absolute -top-1 w-8 h-1 bg-purple-500 dark:bg-purple-400 rounded-full"></div>
            <TrendingUp className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Gastos</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

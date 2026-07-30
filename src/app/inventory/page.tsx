import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Plus, Search, ShoppingCart, TrendingUp, Home as HomeIcon } from "lucide-react";
import InventoryItem from "./InventoryItem";

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [membershipRes, inventoryItemsRes] = await Promise.all([
    supabase.from("home_members").select("home_id").eq("user_id", user.id).single(),
    supabase.from("inventory").select(`
        id,
        quantity,
        status,
        products (
          id,
          name,
          unit,
          minimum_quantity,
          categories (
            id,
            name,
            icon
          )
        )
      `).order("updated_at", { ascending: false })
  ]);

  const { data: membership } = membershipRes;
  const { data: inventoryItems } = inventoryItemsRes;

  if (!membership) {
    redirect("/setup");
  }

  const groupedInventory: Record<string, any[]> = {};
  
  if (inventoryItems) {
    inventoryItems.forEach(item => {
      const product = item.products as any;
      if (!product) return;
      const categoryName = product.categories?.name || "Sin Categoría";
      if (!groupedInventory[categoryName]) {
        groupedInventory[categoryName] = [];
      }
      groupedInventory[categoryName].push({
        id: item.id,
        name: product.name,
        unit: product.unit,
        quantity: item.quantity,
        minQuantity: product.minimum_quantity,
        status: item.status
      });
    });
  }

  return (
    <div className="flex-1 flex flex-col relative h-full">
      
      {/* Glass Header */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between z-10 animate-fade-in sticky top-0 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center">
          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mr-3 shadow-inner">
            <Package className="w-5 h-5" />
          </div>
          Inventario
        </h1>
        <button className="p-2.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 glass rounded-full transition-all hover:scale-105 relative shadow-sm">
          <Search className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-8 pb-40 no-scrollbar z-10 animate-slide-up">
        
        {Object.keys(groupedInventory).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 opacity-50 relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-20"></div>
              <Package className="w-10 h-10 text-slate-400 dark:text-slate-500 relative z-10" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">Tu inventario está vacío</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
              Añade los productos que tienes en casa para empezar a llevar el control.
            </p>
            <Link 
              href="/inventory/new"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-emerald-500/30 transform hover:-translate-y-1 active:scale-95"
            >
              Añadir primer producto
            </Link>
          </div>
        ) : (
          Object.keys(groupedInventory).map((categoryName, index) => (
            <div key={categoryName} className="space-y-4 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center space-x-2">
                <div className="h-1.5 w-6 bg-emerald-500 rounded-full"></div>
                <h2 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {categoryName}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {groupedInventory[categoryName].map(item => (
                  <InventoryItem key={item.id} {...item} />
                ))}
              </div>
            </div>
          ))
        )}

      </main>

      {/* FAB - Agregar */}
      <Link href="/inventory/new" className="absolute bottom-24 right-6 w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-1 active:translate-y-0 text-white rounded-full flex items-center justify-center transition-all z-20">
        <Plus className="w-8 h-8" />
      </Link>

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
          <button className="flex flex-col items-center p-2 text-emerald-600 dark:text-emerald-400 relative">
            <div className="absolute -top-1 w-8 h-1 bg-emerald-600 dark:bg-emerald-400 rounded-full"></div>
            <Package className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Casa</span>
          </button>
          <Link href="/expenses" className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <TrendingUp className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Gastos</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

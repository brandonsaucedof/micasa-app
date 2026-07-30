import { createClient } from "@/utils/supabase/server";
import { getCurrentUser, getHomeMembership } from "@/utils/supabase/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Plus, Search, ShoppingCart, TrendingUp, Home as HomeIcon, Archive, Settings } from "lucide-react";
import InventoryItem from "./InventoryItem";
import InventoryTabs from "./InventoryTabs";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await getCurrentUser();

  const params = await searchParams;
  const currentTab = params?.tab || "active";

  if (!user) {
    redirect("/login");
  }

  const membership = await getHomeMembership();

  if (!membership) {
    redirect("/setup");
  }

  const supabase = await createClient();
  const { data: inventoryItems } = await supabase.from("inventory").select(`
        id,
        quantity,
        status,
        products (
          id,
          name,
          unit,
          minimum_quantity,
          is_permanent,
          users (
            name
          ),
          categories (
            id,
            name,
            icon
          )
        )
      `)
      .eq("home_id", membership.home_id)
      .order("updated_at", { ascending: false })
      .limit(200);

  const activeInventory: Record<string, any[]> = {};
  const archivedInventory: Record<string, any[]> = {};
  
  if (inventoryItems) {
    inventoryItems.forEach(item => {
      const product = item.products as any;
      if (!product) return;
      
      const isArchived = product.is_permanent === false && item.quantity <= 0;
      const categoryName = product.categories?.name || "Sin Categoría";
      
      const targetGroup = isArchived ? archivedInventory : activeInventory;

      if (!targetGroup[categoryName]) {
        targetGroup[categoryName] = [];
      }
      targetGroup[categoryName].push({
        id: item.id,
        productId: product.id,
        name: product.name,
        unit: product.unit,
        quantity: item.quantity,
        minQuantity: product.minimum_quantity,
        status: item.status,
        addedByName: product.users?.name || "Desconocido"
      });
    });
  }

  const displayedInventory = currentTab === "archived" ? archivedInventory : activeInventory;

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

      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-8 pb-40 no-scrollbar z-10 animate-slide-up">
        
        <InventoryTabs currentTab={currentTab} />

        {Object.keys(displayedInventory).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 opacity-50 relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-20"></div>
              {currentTab === "archived" ? (
                <Archive className="w-10 h-10 text-slate-400 dark:text-slate-500 relative z-10" />
              ) : (
                <Package className="w-10 h-10 text-slate-400 dark:text-slate-500 relative z-10" />
              )}
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
              {currentTab === "archived" ? "No hay productos archivados" : "Tu inventario está vacío"}
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
              {currentTab === "archived" 
                ? "Los productos de 'una sola vez' aparecerán aquí cuando se agoten." 
                : "Añade los productos que tienes en casa para empezar a llevar el control."}
            </p>
            {currentTab === "active" && (
              <Link 
                href="/inventory/new"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-emerald-500/30 transform hover:-translate-y-1 active:scale-95"
              >
                Añadir primer producto
              </Link>
            )}
          </div>
        ) : (
          Object.keys(displayedInventory).map((categoryName, index) => (
            <div key={categoryName} className="space-y-4 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center space-x-2">
                <div className="h-1.5 w-6 bg-emerald-500 rounded-full"></div>
                <h2 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {categoryName}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {displayedInventory[categoryName].map(item => (
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
            <span className="text-[10px] font-bold">Analytics</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <Settings className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Ajustes</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

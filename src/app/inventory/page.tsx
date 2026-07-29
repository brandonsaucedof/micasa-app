import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Plus, Search, ChevronLeft } from "lucide-react";
import InventoryItem from "./InventoryItem";

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verificar membresía
  const { data: membership } = await supabase
    .from("home_members")
    .select("home_id")
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    redirect("/setup");
  }

  // Obtener inventario con los productos y categorías
  const { data: inventoryItems } = await supabase
    .from("inventory")
    .select(`
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
    `)
    .eq("home_id", membership.home_id)
    .order("updated_at", { ascending: false });

  // Agrupar por categoría
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
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 pb-24 h-full overflow-y-auto">
      {/* Header Fijo */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Link href="/" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
            <Package className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Inventario
          </h1>
        </div>
        <button className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <Search className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-6">
        
        {Object.keys(groupedInventory).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <Package className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Tu inventario está vacío</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs">
              Añade los productos que tienes en casa para empezar a llevar el control.
            </p>
            <Link 
              href="/inventory/new"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors shadow-sm"
            >
              Añadir primer producto
            </Link>
          </div>
        ) : (
          Object.keys(groupedInventory).map(categoryName => (
            <div key={categoryName} className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pl-1">
                {categoryName}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {groupedInventory[categoryName].map(item => (
                  <InventoryItem key={item.id} {...item} />
                ))}
              </div>
            </div>
          ))
        )}

      </main>

      {/* FAB - Agregar */}
      <Link href="/inventory/new" className="absolute bottom-20 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition-all z-20">
        <Plus className="w-6 h-6" />
      </Link>
    </div>
  );
}

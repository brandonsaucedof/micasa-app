import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Receipt, Store } from "lucide-react";
import { checkoutPurchase } from "@/app/actions/shopping";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: membership } = await supabase
    .from("home_members")
    .select("home_id")
    .eq("user_id", user.id)
    .single();

  if (!membership) redirect("/setup");

  // Obtener items listos para pagar
  const { data: items } = await supabase
    .from("shopping_items")
    .select("id, name")
    .eq("home_id", membership.home_id)
    .eq("is_purchased", true)
    .is("purchase_id", null);

  if (!items || items.length === 0) {
    redirect("/shopping");
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 h-full overflow-y-auto">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 flex items-center space-x-3 sticky top-0 z-10">
        <Link href="/shopping" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
          <Receipt className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          Registrar Gasto
        </h1>
      </header>

      <main className="p-6 flex-1">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white mb-1">Total de la compra</h2>
          <p className="text-sm text-slate-500 mb-6">Vas a registrar el pago de {items.length} productos marcados.</p>

          <form action={checkoutPurchase} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Monto Gastado</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-light text-slate-400">$</span>
                <input 
                  type="number" 
                  step="0.01" 
                  name="total_amount" 
                  required 
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-900 dark:text-emerald-100 text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center">
                <Store className="w-3 h-3 mr-1" />
                Tienda o Supermercado (Opcional)
              </label>
              <input 
                type="text" 
                name="store_name" 
                placeholder="Ej. Walmart, Mercado..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/30 transition-transform active:scale-95">
                Guardar Gasto
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 px-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Productos Incluidos:</h3>
          <ul className="space-y-2">
            {items.map(item => (
              <li key={item.id} className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

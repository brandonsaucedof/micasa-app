import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Plus, ChevronLeft, ArrowRight } from "lucide-react";
import ShoppingItem from "./ShoppingItem";
import { addShoppingItem } from "@/app/actions/shopping";

export default async function ShoppingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch membership and items in parallel to reduce waterfall latency
  // We omit the home_id filter because RLS automatically filters by the user's home
  const [membershipRes, itemsRes] = await Promise.all([
    supabase
      .from("home_members")
      .select("home_id")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("shopping_items")
      .select("id, name, is_purchased")
      .is("purchase_id", null)
      .order("created_at", { ascending: false })
  ]);

  const { data: membership } = membershipRes;
  const { data: items } = itemsRes;

  if (!membership) redirect("/setup");

  const checkedCount = items?.filter(i => i.is_purchased).length || 0;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 pb-32 h-full overflow-y-auto">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 flex items-center space-x-3 sticky top-0 z-10">
        <Link href="/" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
          <ShoppingCart className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          Lista de Compras
        </h1>
      </header>

      <main className="p-4 flex-1 flex flex-col space-y-6">
        
        {/* Add Quick Item */}
        <form action={addShoppingItem} className="flex space-x-2">
          <input 
            type="text" 
            name="name"
            placeholder="¿Qué hace falta comprar?" 
            required
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm"
          />
          <button type="submit" className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors shadow-sm">
            <Plus className="w-5 h-5" />
          </button>
        </form>

        {/* List of Items */}
        <div className="space-y-3">
          {items?.length === 0 ? (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Tu lista de compras está vacía.</p>
            </div>
          ) : (
            items?.map(item => (
              <ShoppingItem key={item.id} id={item.id} name={item.name} isPurchased={item.is_purchased} />
            ))
          )}
        </div>

      </main>

      {/* Checkout Footer (Sticky) */}
      {checkedCount > 0 && (
        <div className="fixed bottom-[4.5rem] w-full max-w-md mx-auto left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
          <Link href="/shopping/checkout" className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center justify-between shadow-lg shadow-emerald-600/30 transition-transform active:scale-95">
            <span>Finalizar Compra ({checkedCount} items)</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      )}
    </div>
  );
}

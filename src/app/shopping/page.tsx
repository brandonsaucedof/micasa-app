import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Plus, ArrowRight, Package, TrendingUp, Home as HomeIcon } from "lucide-react";
import ShoppingItem from "./ShoppingItem";
import { addShoppingItem } from "@/app/actions/shopping";

import WeekSelector from "./WeekSelector";

export default async function ShoppingPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const params = await searchParams;
  const currentWeek = params?.week || "Semana 1";

  if (!user) redirect("/login");

  const [membershipRes, itemsRes] = await Promise.all([
    supabase.from("home_members").select("home_id").eq("user_id", user.id).single(),
    // Request planning_week. It requires the new migration!
    supabase.from("shopping_items").select("id, name, is_purchased, planning_week").is("purchase_id", null).order("created_at", { ascending: false })
  ]);

  const { data: membership } = membershipRes;
  const { data: items } = itemsRes;

  if (!membership) redirect("/setup");

  // Filter items by current week (if planning_week is null, assume Semana 1)
  const currentItems = items?.filter(i => (i.planning_week || "Semana 1") === currentWeek) || [];
  const checkedCount = currentItems.filter(i => i.is_purchased).length || 0;

  return (
    <div className="flex-1 flex flex-col relative h-full">
      
      {/* Glass Header */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between z-10 animate-fade-in sticky top-0 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center mr-3">
            <ShoppingCart className="w-5 h-5" />
          </div>
          Lista de Compras
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6 pb-40 no-scrollbar z-10 animate-slide-up">
        
        <WeekSelector currentWeek={currentWeek} />

        {/* Add Quick Item */}
        <form action={addShoppingItem} className="flex space-x-3 group">
          <input type="hidden" name="planning_week" value={currentWeek} />
          <input 
            type="text" 
            name="name"
            placeholder="¿Qué hace falta comprar?" 
            required
            className="flex-1 px-5 py-4 rounded-2xl glass-panel text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 shadow-sm placeholder:text-slate-400 font-medium transition-all"
          />
          <button type="submit" className="w-14 h-14 bg-gradient-premium hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 text-white rounded-2xl flex items-center justify-center flex-shrink-0 transition-all transform active:scale-95">
            <Plus className="w-6 h-6" />
          </button>
        </form>

        {/* List of Items */}
        <div className="space-y-3">
          {currentItems.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center justify-center animate-fade-in">
              <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 opacity-50">
                <ShoppingCart className="w-10 h-10 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Todo listo</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Tu lista para la {currentWeek.toLowerCase()} está vacía.</p>
            </div>
          ) : (
            currentItems.map(item => (
              <ShoppingItem key={item.id} id={item.id} name={item.name} isPurchased={item.is_purchased} />
            ))
          )}
        </div>

      </main>

      {/* Checkout Footer */}
      {checkedCount > 0 && (
        <div className="fixed bottom-24 w-full max-w-md mx-auto left-0 right-0 px-6 z-30 animate-slide-up">
          <Link href="/shopping/checkout" className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-2xl text-sm font-bold flex items-center justify-between shadow-xl shadow-emerald-500/30 transition-all transform hover:-translate-y-1 active:scale-95">
            <span>Finalizar Compra ({checkedCount} items)</span>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      )}

      {/* Premium Floating Bottom Navigation */}
      <div className="absolute bottom-6 left-6 right-6 z-20">
        <nav className="glass-panel rounded-full px-6 py-3.5 flex justify-between items-center shadow-2xl">
          <Link href="/" className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <HomeIcon className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Inicio</span>
          </Link>
          <button className="flex flex-col items-center p-2 text-primary-600 dark:text-primary-400 relative">
            <div className="absolute -top-1 w-8 h-1 bg-primary-600 dark:bg-primary-400 rounded-full"></div>
            <ShoppingCart className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Compras</span>
          </button>
          <Link href="/inventory" className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <Package className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Casa</span>
          </Link>
          <Link href="/expenses" className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <TrendingUp className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Analytics</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TrendingUp, Receipt, Calendar, Package, ShoppingCart, Home as HomeIcon } from "lucide-react";
import MonthSelector from "@/components/MonthSelector";
import AnalyticsContent from "./AnalyticsContent";

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const params = await searchParams;
  
  // Calculate start and end dates for selected month
  const today = new Date();
  const selectedMonthStr = params?.month || `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const startDate = new Date(selectedMonthStr + "-01T00:00:00Z");
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1).toISOString();

  const { data: membership } = await supabase.from("home_members").select("home_id").eq("user_id", user.id).single();
  if (!membership) redirect("/setup");

  const [purchasesRes, shoppingItemsRes] = await Promise.all([
    supabase.from("purchases")
      .select(`
        id,
        total_amount,
        store_name,
        created_at,
        users (
          name
        )
      `)
      .gte("created_at", startDate.toISOString())
      .lt("created_at", endDate)
      .order("created_at", { ascending: false }),
    supabase.from("shopping_items")
      .select("id, name, planning_week, purchase_id")
      .eq("home_id", membership.home_id)
      .not("purchase_id", "is", null)
  ]);

  const { data: purchases } = purchasesRes;
  const { data: shoppingItems } = shoppingItemsRes;

  const totalSpent = purchases?.reduce((sum, p) => sum + Number(p.total_amount), 0) || 0;

  return (
    <div className="flex-1 flex flex-col relative h-full">
      
      {/* Premium Hero Header */}
      <header className="relative bg-gradient-premium pt-12 pb-20 px-6 rounded-b-[3rem] z-10 shadow-2xl shadow-primary-500/20 overflow-hidden animate-fade-in">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 bottom-0 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center">
          <MonthSelector currentMonthStr={selectedMonthStr} />
          <p className="text-primary-100 text-sm font-bold uppercase tracking-widest mb-2 mt-4">Gasto Mensual</p>
          <h1 className="text-5xl font-black text-white flex items-center justify-center">
            <span className="text-3xl font-medium opacity-80 mr-2">Bs</span>
            {totalSpent.toFixed(2)}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 -mt-10 relative z-20 space-y-6 pb-32 animate-slide-up">
        <AnalyticsContent purchases={purchases || []} shoppingItems={shoppingItems || []} />
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

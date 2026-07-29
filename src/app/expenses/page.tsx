import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TrendingUp, Receipt, Calendar, ChevronLeft } from "lucide-react";

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
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 h-full overflow-y-auto">
      <header className="bg-indigo-600 dark:bg-indigo-900 pt-8 pb-16 px-6 rounded-b-[2.5rem] relative z-10 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-white/80 hover:text-white transition-colors">
            <ChevronLeft className="w-7 h-7" />
          </Link>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
        </div>
        <p className="text-indigo-100 text-sm font-medium mb-1">Gasto Acumulado</p>
        <h1 className="text-4xl font-black text-white flex items-center">
          <span className="text-2xl font-normal opacity-80 mr-1">$</span>
          {totalSpent.toFixed(2)}
        </h1>
      </header>

      <main className="px-4 -mt-8 relative z-20 space-y-4 pb-24">
        
        <div className="flex items-center justify-between px-2 mb-2">
          <h2 className="font-bold text-slate-900 dark:text-white text-lg">Historial de tickets</h2>
          <span className="text-xs font-medium text-slate-500 bg-slate-200 dark:bg-slate-800 px-2.5 py-1 rounded-full">
            {purchases?.length || 0} compras
          </span>
        </div>

        {purchases?.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
            <Receipt className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Aún no hay compras registradas.</p>
          </div>
        ) : (
          purchases?.map((p: any) => {
            const date = new Date(p.created_at);
            return (
              <div key={p.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight mb-1">
                      {p.store_name || "Compra General"}
                    </h3>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium">{p.users?.name || "Alguien"}</span>
                      <span className="mx-1.5 opacity-50">•</span>
                      <Calendar className="w-3 h-3 mr-1" />
                      {date.toLocaleDateString("es-ES", { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </div>
                
                <div className="text-right pl-3">
                  <p className="font-bold text-slate-900 dark:text-white text-lg">
                    ${Number(p.total_amount).toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })
        )}

      </main>
    </div>
  );
}

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { createHome, joinHome } from "@/app/actions/homes";
import { Home, Users, Plus, KeyRound, AlertCircle, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

export default async function SetupPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Verificar si ya tiene casa
  const { data: membership } = await supabase
    .from("home_members")
    .select("home_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (membership) {
    return redirect("/");
  }

  const params = await searchParams;
  const message = params?.message;

  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Bienvenido</h1>
        <form action={logout}>
          <button type="submit" className="text-slate-500 hover:text-red-500 transition-colors p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </form>
      </div>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Home className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Configura tu Casa
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
          Para empezar a usar la aplicación, necesitas crear una casa nueva o unirte a una existente.
        </p>
      </div>

      {message && (
        <div className="bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 p-3 rounded-xl flex items-center text-sm border border-red-100 dark:border-red-900/50 mb-6">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          <p>{message}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Crear Casa */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Crear nueva casa</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Serás el administrador</p>
            </div>
          </div>
          
          <form action={createHome} className="space-y-3">
            <input
              name="name"
              type="text"
              placeholder="Ej. Familia Saucedo"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Crear casa
            </button>
          </form>
        </div>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink-0 mx-4 text-xs font-medium text-slate-400">O TAMBIÉN</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        {/* Unirse a Casa */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Unirse con código</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Si alguien ya creó una casa</p>
            </div>
          </div>
          
          <form action={joinHome} className="space-y-3">
            <input
              name="code"
              type="text"
              placeholder="Código de 6 dígitos"
              required
              maxLength={6}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 uppercase tracking-widest text-center font-bold placeholder:font-normal placeholder:tracking-normal"
            />
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Unirme a la casa
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

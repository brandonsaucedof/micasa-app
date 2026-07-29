import { createClient } from "@/utils/supabase/server";
import { logout } from "@/app/actions/auth";
import { User, LogOut, Settings, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Link href="/" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Perfil</h1>
        </div>
        <button className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 p-6 flex flex-col space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center space-y-4 shadow-sm">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {user.user_metadata?.name || "Usuario"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {user.email}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center px-4 py-4 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Cerrar sesión</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

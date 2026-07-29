import Link from "next/link";
import { login } from "@/app/actions/auth";
import { Home, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;
  const message = params?.message;

  return (
    <div className="flex-1 flex flex-col px-6 py-12 justify-center bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto w-full max-w-sm flex flex-col space-y-6">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 mb-2">
            <Home className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Bienvenido a Micasa
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        {message && (
          <div className="bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center text-sm border border-red-100 dark:border-red-900/50">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <p>{message}</p>
          </div>
        )}

        <form action={login} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">
              Correo electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
                Contraseña
              </label>
              <Link href="/reset-password" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
          >
            Iniciar sesión
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </form>

        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}

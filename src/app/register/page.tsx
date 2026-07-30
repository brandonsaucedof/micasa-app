import Link from "next/link";
import { signup } from "@/app/actions/auth";
import { UserPlus, Mail, Lock, User, ArrowRight, AlertCircle, Sparkles } from "lucide-react";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const params = await searchParams;
  const errorMsg = params?.error || params?.message;

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 min-h-screen">
      
      {/* Animated Header */}
      <div className="w-full max-w-sm mb-8 flex flex-col items-center animate-fade-in">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-primary-500 blur-xl opacity-50 rounded-full"></div>
          <div className="relative w-16 h-16 bg-gradient-premium text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <UserPlus className="w-8 h-8" />
            <Sparkles className="absolute -top-1 -left-1 w-4 h-4 text-yellow-300 animate-pulse-slow" />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Crear cuenta
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 text-center">
          Únete a Micasa para gestionar tu hogar
        </p>
      </div>

      {/* Glassmorphic Register Form */}
      <div className="w-full max-w-sm glass-panel p-8 animate-slide-up">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Regístrate</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Completa tus datos para empezar</p>
        </div>

        {errorMsg && (
          <div className="mb-6 bg-red-500/10 text-red-600 dark:text-red-400 p-3.5 rounded-xl flex items-start text-sm border border-red-500/20 animate-pop-in">
            <AlertCircle className="w-5 h-5 mr-2.5 flex-shrink-0 mt-0.5" />
            <p className="font-medium">{errorMsg}</p>
          </div>
        )}

        <form action={signup} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 ml-1" htmlFor="name">
              Nombre
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <User className="w-5 h-5" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Tu nombre"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 ml-1" htmlFor="email">
              Correo electrónico
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 ml-1" htmlFor="password">
              Contraseña
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center py-3.5 px-4 bg-gradient-premium hover:shadow-lg hover:shadow-primary-500/30 text-white rounded-xl text-sm font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Comenzar aventura
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </form>

        <div className="mt-6 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}

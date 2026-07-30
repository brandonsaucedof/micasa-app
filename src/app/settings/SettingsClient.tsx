"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { updateProfile } from "@/app/actions/auth";
import { Moon, Sun, Bell, Users, Check, X, Pencil, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function SettingsClient({ initialName, email }: { initialName: string, email: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(initialName);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setMounted(true);
    const notifs = localStorage.getItem("micasa_notifications");
    if (notifs === "true") setNotificationsEnabled(true);
  }, []);

  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleToggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    localStorage.setItem("micasa_notifications", String(newState));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsPending(true);
    
    const formData = new FormData();
    formData.append("name", name);
    
    try {
      await updateProfile(formData);
      setIsEditingProfile(false);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al actualizar el perfil.");
    } finally {
      setIsPending(false);
    }
  };

  if (!mounted) return <div className="animate-pulse space-y-6">Cargando ajustes...</div>;

  return (
    <div className="space-y-6">
      
      {/* Profile Card (Interactive) */}
      <div className="bg-gradient-to-br from-primary-500 to-indigo-600 p-6 rounded-3xl shadow-xl shadow-primary-500/20 text-white relative overflow-hidden transition-all">
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
        
        {isEditingProfile ? (
          <form onSubmit={handleUpdateProfile} className="relative z-10 space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-primary-100">Actualizar Nombre</h3>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Tu nombre"
              disabled={isPending}
              autoFocus
            />
            <div className="flex space-x-2">
              <button 
                type="submit" 
                disabled={isPending}
                className="flex-1 bg-white text-primary-600 font-bold py-2 rounded-xl text-sm flex items-center justify-center hover:bg-primary-50 transition-colors disabled:opacity-70"
              >
                {isPending ? "Guardando..." : <><Check className="w-4 h-4 mr-1" /> Guardar</>}
              </button>
              <button 
                type="button" 
                onClick={() => { setIsEditingProfile(false); setName(initialName); }}
                disabled={isPending}
                className="flex-1 bg-black/20 text-white font-bold py-2 rounded-xl text-sm flex items-center justify-center hover:bg-black/30 transition-colors"
              >
                <X className="w-4 h-4 mr-1" /> Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="relative z-10 flex items-center justify-between animate-fade-in">
            <div>
              <h2 className="text-2xl font-extrabold">{initialName}</h2>
              <p className="text-primary-100 text-sm font-medium opacity-90">{email}</p>
            </div>
            <button 
              onClick={() => setIsEditingProfile(true)}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-inner hover:bg-white/30 transition-colors active:scale-95"
            >
              <Pencil className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* General Section */}
      <div>
        <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 ml-2">General</h3>
        <div className="glass-panel rounded-3xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/50">
          
          <Link href="/family" className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-200">Familia y Hogar</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-colors" />
          </Link>
          
          <button onClick={handleToggleTheme} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div className="text-left">
                <span className="font-bold text-slate-700 dark:text-slate-200 block">Modo Oscuro</span>
                <span className="text-xs text-slate-400">{theme === 'dark' ? 'Activado' : 'Desactivado'}</span>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${theme === 'dark' ? 'right-0.5' : 'left-0.5'}`}></div>
            </div>
          </button>

          <button onClick={handleToggleNotifications} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="font-bold text-slate-700 dark:text-slate-200 block">Notificaciones</span>
                <span className="text-xs text-slate-400">{notificationsEnabled ? 'Activadas' : 'Desactivadas'}</span>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-colors ${notificationsEnabled ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${notificationsEnabled ? 'right-0.5' : 'left-0.5'}`}></div>
            </div>
          </button>

        </div>
      </div>
      
    </div>
  );
}

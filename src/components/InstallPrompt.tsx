"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

export default function InstallPrompt() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (!isInstallable || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-4 border border-indigo-100 dark:border-slate-700 z-50 flex items-center justify-between animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg">
          <Download className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Instalar App</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Acceso rápido y offline</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleInstallClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          Instalar
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

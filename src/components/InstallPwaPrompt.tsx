import React, { useState, useEffect } from 'react';
import { Download, Sparkles, X, Smartphone, ShieldCheck } from 'lucide-react';

interface InstallPwaPromptProps {
  onTriggerToast: (msg: string) => void;
}

export function InstallPwaPrompt({ onTriggerToast }: InstallPwaPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after 3 seconds for smooth UX
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Also allow manual trigger for demo if beforeinstallprompt hasn't fired yet
    const manualTimer = setTimeout(() => {
      if (!isInstalled && !deferredPrompt) {
        // Show fallback neomorphic install prompt for Los Mochis users
        setShowPrompt(true);
      }
    }, 4500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(manualTimer);
    };
  }, [isInstalled, deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        onTriggerToast('¡PWA Reyplace instalada con éxito en tu dispositivo!');
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instruction for iOS / browser
      onTriggerToast('Para instalar: presiona "Compartir" en Safari y selecciona "Añadir a Inicio"');
    }
    setShowPrompt(false);
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm w-full neo-surface p-5 rounded-3xl border border-cyan-500/40 shadow-2xl animate-fade-in">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-12 h-12 rounded-2xl neo-inset flex items-center justify-center text-cyan-600 dark:text-[#70e9ff] shrink-0">
          <Smartphone className="w-6 h-6" />
        </div>
        <div>
          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-[#70e9ff] mb-1">
            <Sparkles className="w-3 h-3" /> PWA Los Mochis
          </span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            App Oficial Reyplace.mx
          </h4>
        </div>
        <button
          type="button"
          onClick={() => setShowPrompt(false)}
          className="w-7 h-7 rounded-xl neo-inset flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
        Acceso instantáneo sin conexión al catálogo 3D, simulador de seguridad y alertas en tiempo real optimizadas para Sinaloa.
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleInstallClick}
          className="flex-1 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 dark:bg-[#70e9ff] dark:hover:bg-[#56e2ff] text-white dark:text-[#070d1e] text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          <Download className="w-4 h-4" /> Añadir a Pantalla de Inicio
        </button>
        <button
          type="button"
          onClick={() => setShowPrompt(false)}
          className="py-3 px-3.5 rounded-2xl neo-inset text-xs font-semibold text-slate-600 dark:text-slate-400"
        >
          Ahora No
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-800 flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
        <span>Certificación PWA segura con soporte offline cache-first</span>
      </div>
    </div>
  );
}

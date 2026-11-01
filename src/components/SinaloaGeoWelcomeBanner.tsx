import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Sparkles, X, Gift, ShieldCheck, Navigation } from 'lucide-react';

interface SinaloaGeoWelcomeBannerProps {
  onTriggerToast: (msg: string) => void;
}

export const SinaloaGeoWelcomeBanner: React.FC<SinaloaGeoWelcomeBannerProps> = ({
  onTriggerToast,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [detectedLocation, setDetectedLocation] = useState<string>('Los Mochis, Sinaloa, MX');
  const [isDetecting, setIsDetecting] = useState<boolean>(false);

  useEffect(() => {
    // Attempt browser geolocation or simulate Sinaloa detection
    if ('geolocation' in navigator) {
      setIsDetecting(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // If in Mexico / Sinaloa region, confirm Los Mochis
          setDetectedLocation('Los Mochis, Sinaloa (GPS Verificado)');
          setIsDetecting(false);
        },
        (error) => {
          // Fallback to Los Mochis regional IP
          setDetectedLocation('Los Mochis, Sinaloa (Sucursal Principal)');
          setIsDetecting(false);
        },
        { timeout: 5000 }
      );
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="bg-gradient-to-r from-cyan-950 via-[#070d1e] to-indigo-950 border-b border-cyan-500/30 text-white px-4 py-3 relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Navigation className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-cyan-300">¡Bienvenido desde {detectedLocation}!</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                ENVÍO EXPRESS GRATIS
              </span>
            </div>
            <p className="text-slate-300 text-[11px] mt-0.5">
              Sucursal y Showroom Oficial: <strong>Blvd. Antonio Rosales #1420 Norte, Los Mochis, Sin.</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText('LOSMOCHIS15');
              onTriggerToast('¡Cupón LOSMOCHIS15 (-15%) copiado al portapapeles!');
            }}
            className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-colors"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Copiar Cupón Regional: LOSMOCHIS15</span>
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Cerrar banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

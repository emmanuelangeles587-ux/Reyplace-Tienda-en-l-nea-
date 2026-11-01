import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Activity, AlertTriangle, ShieldCheck, Zap, Thermometer, ArrowUpRight } from 'lucide-react';

interface ZoneData {
  id: string;
  name: string;
  kwhMonth: number;
  temperature: number;
  status: 'optimal' | 'moderate' | 'leak';
  leakReason: string;
  colorClass: string;
}

const ZONES: ZoneData[] = [
  {
    id: 'sala',
    name: 'Sala Principal & Entretenimiento',
    kwhMonth: 340,
    temperature: 23.5,
    status: 'optimal',
    leakReason: 'Consumo optimizado por iluminación circadiana LED',
    colorClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
  },
  {
    id: 'cocina',
    name: 'Cocina Gourmet & Electrodomésticos',
    kwhMonth: 580,
    temperature: 28.2,
    status: 'leak',
    leakReason: 'Alto consumo en refrigeración y climatización por fugas térmicas',
    colorClass: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
  },
  {
    id: 'recamara',
    name: 'Recámara Master & Enclave',
    kwhMonth: 290,
    temperature: 21.0,
    status: 'optimal',
    leakReason: 'Modo nocturno Matter activo con aislamiento térmico',
    colorClass: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
  },
  {
    id: 'terraza',
    name: 'Terraza Perimetral & Seguridad',
    kwhMonth: 420,
    temperature: 31.8,
    status: 'moderate',
    leakReason: 'Cámaras PTZ 4K y reflectores activos 24/7',
    colorClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
  },
];

export const EnergyHeatMap: React.FC = () => {
  const [activeZone, setActiveZone] = useState<ZoneData>(ZONES[1]); // Default to Cocina (leak)

  return (
    <div className="neo-surface rounded-[32px] p-6 md:p-10 border border-slate-200/80 dark:border-slate-800/80 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 neo-inset px-3 py-1 rounded-full text-xs font-bold text-rose-600 dark:text-rose-400 mb-2">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>Mapa de Calor Térmico & Fugas Energéticas</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Análisis Térmico por Zonas del Hogar
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Monitoreo en tiempo real basado en sensores de presencia, temperatura y amperaje para detectar puntos críticos de desperdicio eléctrico.
          </p>
        </div>

        <div className="neo-inset px-4 py-3 rounded-2xl flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
          <div className="text-xs">
            <p className="font-bold text-slate-900 dark:text-white">1 Fuga Crítica Detectada</p>
            <p className="text-slate-500 dark:text-slate-400">Cocina Gourmet (-$340 MXN/mes)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Visual Heatmap Floor Plan Representation */}
        <div className="lg:col-span-7 neo-inset p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Esquema Térmico 3D de Propiedad
            </span>
            <span className="font-mono text-cyan-600 dark:text-[#70e9ff]">
              Sensores IoT Activos: 18/18
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {ZONES.map((zone) => {
              const isSelected = activeZone.id === zone.id;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setActiveZone(zone)}
                  className={`p-5 rounded-2xl text-left border transition-all relative overflow-hidden group ${
                    isSelected
                      ? 'ring-2 ring-cyan-500 bg-slate-200/80 dark:bg-slate-800/80 shadow-lg'
                      : 'neo-surface hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${zone.colorClass}`}
                    >
                      {zone.status === 'leak' ? 'Fuga Térmica' : zone.status === 'moderate' ? 'Moderado' : 'Óptimo'}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-900 dark:text-white pr-14 mt-1">
                    {zone.name}
                  </p>

                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Consumo</p>
                      <p className="text-sm font-extrabold font-mono-num text-slate-800 dark:text-white">
                        {zone.kwhMonth} kWh
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Temp</p>
                      <p className="text-sm font-extrabold font-mono-num text-slate-800 dark:text-white">
                        {zone.temperature}°C
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Zone Analysis Card */}
        <div className="lg:col-span-5 neo-surface p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 space-y-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl neo-inset flex items-center justify-center ${
                activeZone.status === 'leak'
                  ? 'text-rose-500'
                  : activeZone.status === 'moderate'
                  ? 'text-amber-500'
                  : 'text-emerald-500'
              }`}
            >
              {activeZone.status === 'leak' ? (
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              ) : (
                <Thermometer className="w-6 h-6" />
              )}
            </div>
            <div>
              <span className="text-[11px] font-semibold text-cyan-600 dark:text-[#70e9ff]">
                Diagnóstico de Zona
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {activeZone.name}
              </h4>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center justify-between py-2 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Consumo Mensual:</span>
              <strong className="font-mono-num text-slate-900 dark:text-white">
                {activeZone.kwhMonth} kWh (${Math.round(activeZone.kwhMonth * 3.2)} MXN)
              </strong>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Temperatura Promedio:</span>
              <strong className="font-mono-num text-slate-900 dark:text-white">
                {activeZone.temperature}°C
              </strong>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Estado de Eficiencia:</span>
              <span
                className={`font-bold ${
                  activeZone.status === 'leak'
                    ? 'text-rose-500'
                    : activeZone.status === 'moderate'
                    ? 'text-amber-500'
                    : 'text-emerald-500'
                }`}
              >
                {activeZone.status === 'leak' ? 'Atención Requerida' : 'Funcionamiento Normal'}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl neo-inset space-y-1.5 border border-slate-200/60 dark:border-slate-800">
            <p className="text-[11px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-600 dark:text-[#70e9ff]" />
              Recomendación de Automatización REYPLACE:
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeZone.leakReason}. Se sugiere integrar sensores de presencia Matter y válvulas termostáticas inteligentes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

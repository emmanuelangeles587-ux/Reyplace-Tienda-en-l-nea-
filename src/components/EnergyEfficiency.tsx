import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  Zap,
  Sparkles,
  Sliders,
  CheckCircle2,
  X,
  Thermometer,
  Lightbulb,
  PowerOff,
  TrendingDown,
  ArrowRight,
} from 'lucide-react';

const MONTHLY_ENERGY_DATA = [
  { month: 'May', baseMxn: 2480, smartMxn: 1920, kwhSaved: 98 },
  { month: 'Jun', baseMxn: 2890, smartMxn: 2110, kwhSaved: 136 },
  { month: 'Jul', baseMxn: 3340, smartMxn: 2290, kwhSaved: 184 },
  { month: 'Ago', baseMxn: 3520, smartMxn: 2350, kwhSaved: 205 },
  { month: 'Sep', baseMxn: 3110, smartMxn: 2080, kwhSaved: 180 },
  { month: 'Oct', baseMxn: 2650, smartMxn: 1740, kwhSaved: 159 },
];

export const EnergyEfficiency: React.FC = () => {
  const [tariffMultiplier, setTariffMultiplier] = useState<1 | 1.35>(1);
  const [isOptimizationOpen, setIsOptimizationOpen] = useState(false);
  const [optimizationApplied, setOptimizationApplied] = useState(false);
  const [activeAdjustments, setActiveAdjustments] = useState({
    thermostat: true,
    lights: true,
    standby: true,
  });

  const chartData = MONTHLY_ENERGY_DATA.map((row) => {
    const base = Math.round(row.baseMxn * tariffMultiplier);
    const optimizedBonus = optimizationApplied ? 420 : 0;
    const smart = Math.max(800, Math.round(row.smartMxn * tariffMultiplier) - optimizedBonus);
    return {
      ...row,
      base,
      smart,
      ahorroMxn: base - smart,
    };
  });

  const totalSavedMxn = chartData.reduce((acc, r) => acc + r.ahorroMxn, 0);
  const totalKwhSaved = chartData.reduce((acc, r) => acc + r.kwhSaved, 0) + (optimizationApplied ? 142 : 0);
  const avgMonthlySaved = Math.round(totalSavedMxn / chartData.length);

  const handleApplyOptimization = () => {
    setOptimizationApplied(true);
    setIsOptimizationOpen(false);
  };

  return (
    <div className="neo-surface rounded-[28px] p-6 md:p-8 border border-slate-200/80 dark:border-slate-800/80 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-cyan-700 dark:text-[#70e9ff]">
            Telemetría Energética Semestral
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
            Ahorro Eléctrico por Automatización
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Comparativa de consumo tradicional frente a escenas circadianas y sensores mmWave.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOptimizationOpen(true)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
              optimizationApplied
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 shadow-cyan-500/20 animate-pulse'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{optimizationApplied ? 'Optimización IA Activa (-32%)' : 'Optimización Energética'}</span>
          </button>

          <div className="flex items-center gap-1.5 neo-inset p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setTariffMultiplier(1)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                tariffMultiplier === 1
                  ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Residencial
            </button>
            <button
              type="button"
              onClick={() => setTariffMultiplier(1.35)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                tariffMultiplier === 1.35
                  ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              DAC Verano
            </button>
          </div>
        </div>
      </div>

      {/* Key Quantitative Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="neo-inset rounded-2xl p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Ahorro acumulado (6 meses)
          </span>
          <p className="text-2xl font-bold font-mono-num text-emerald-600 dark:text-emerald-400 mt-1">
            ${totalSavedMxn.toLocaleString()} MXN
          </p>
        </div>
        <div className="neo-inset rounded-2xl p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Promedio ahorrado por mes
          </span>
          <p className="text-2xl font-bold font-mono-num text-cyan-700 dark:text-[#70e9ff] mt-1">
            ${avgMonthlySaved.toLocaleString()} MXN/mes
          </p>
        </div>
        <div className="neo-inset rounded-2xl p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Energía reducida verificada
          </span>
          <p className="text-2xl font-bold font-mono-num text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
            <Zap className="w-5 h-5 text-amber-500" />
            {totalKwhSaved} kWh
          </p>
        </div>
      </div>

      {/* Recharts Area Comparison */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="smartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              formatter={(value: any, name?: string | number) => [
                `$${Number(value ?? 0).toLocaleString()} MXN`,
                name === 'base'
                  ? 'Sin Automatización'
                  : name === 'smart'
                  ? 'Con REYPLACE Matter'
                  : 'Ahorro Neto',
              ]}
              contentStyle={{
                backgroundColor: '#0c1631',
                borderColor: '#29437a',
                borderRadius: '14px',
                color: '#f8fafc',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="base"
              stroke="#94a3b8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#baseGrad)"
            />
            <Area
              type="monotone"
              dataKey="smart"
              stroke="#22d3ee"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#smartGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Interactive Optimization Modal */}
      <AnimatePresence>
        {isOptimizationOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="w-full max-w-2xl bg-white dark:bg-[#0c1631] rounded-[32px] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Motor de Optimización Energética IA
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Diagnóstico predictivo basado en telemetría histórica de 6 meses
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOptimizationOpen(false)}
                  className="p-2 rounded-xl neo-inset text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Usage History Insight */}
              <div className="p-4 rounded-2xl neo-inset space-y-1.5 border border-amber-500/20 bg-amber-500/5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <TrendingDown className="w-4 h-4" />
                  <span>Patrón Ineficiente Detectado en Horario Punta (14:00 - 18:00 hrs)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  El sistema registró enfriamiento continuo a <strong>21°C</strong> durante el pico de radiación solar en Sinaloa y luminarias al <strong>100%</strong> en salas desocupadas. Ajustar estos parámetros genera ahorros inmediatos sin sacrificar confort.
                </p>
              </div>

              {/* Actionable Suggestions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Ajustes Recomendados para Clima y Luces
                </h4>

                {/* Thermostat Suggestion */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 neo-surface flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Thermometer className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          Termostato: Escalar a 24°C con Pre-enfriamiento Eco
                        </p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold font-mono-num">
                          +$490 MXN/mes
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Pre-enfría a 22°C antes de las 13:00 hrs (tarifa base) y mantiene a 24°C en horario punta reduciendo un 32% el esfuerzo del compresor Inverter.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={activeAdjustments.thermostat}
                    onChange={(e) =>
                      setActiveAdjustments((prev) => ({ ...prev, thermostat: e.target.checked }))
                    }
                    className="w-5 h-5 rounded accent-cyan-500 shrink-0 mt-1 cursor-pointer"
                  />
                </div>

                {/* Lighting Suggestion */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 neo-surface flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          Iluminación Circadiana al 75% + mmWave Cutoff
                        </p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold font-mono-num">
                          +$220 MXN/mes
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Atenúa luminarias según la luz natural entrante y activa apagado automático tras 3 minutos sin presencia en pasillos y estancias.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={activeAdjustments.lights}
                    onChange={(e) =>
                      setActiveAdjustments((prev) => ({ ...prev, lights: e.target.checked }))
                    }
                    className="w-5 h-5 rounded accent-cyan-500 shrink-0 mt-1 cursor-pointer"
                  />
                </div>

                {/* Standby Cutoff Suggestion */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 neo-surface flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 mt-0.5">
                      <PowerOff className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          Desconexión de Cargas Fantasma (01:00 a 06:00)
                        </p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold font-mono-num">
                          +$130 MXN/mes
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Desactiva tomacorrientes de pantallas secundarias y equipos de sonido durante la madrugada mediante automatización Thread.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={activeAdjustments.standby}
                    onChange={(e) =>
                      setActiveAdjustments((prev) => ({ ...prev, standby: e.target.checked }))
                    }
                    className="w-5 h-5 rounded accent-cyan-500 shrink-0 mt-1 cursor-pointer"
                  />
                </div>
              </div>

              {/* Total Projected Impact & Action */}
              <div className="p-4 rounded-2xl neo-inset flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500">Ahorro adicional proyectado:</span>
                  <p className="text-xl font-bold font-mono-num text-emerald-600 dark:text-emerald-400">
                    +$840 MXN/mes (142 kWh adicionales)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleApplyOptimization}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Aplicar Ajustes Automáticos</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

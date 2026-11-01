import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Zap } from 'lucide-react';

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

  const chartData = MONTHLY_ENERGY_DATA.map((row) => {
    const base = Math.round(row.baseMxn * tariffMultiplier);
    const smart = Math.round(row.smartMxn * tariffMultiplier);
    return {
      ...row,
      base,
      smart,
      ahorroMxn: base - smart,
    };
  });

  const totalSavedMxn = chartData.reduce((acc, r) => acc + r.ahorroMxn, 0);
  const totalKwhSaved = chartData.reduce((acc, r) => acc + r.kwhSaved, 0);
  const avgMonthlySaved = Math.round(totalSavedMxn / chartData.length);

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

        <div className="flex items-center gap-1.5 neo-inset p-1.5 rounded-2xl self-start">
          <button
            type="button"
            onClick={() => setTariffMultiplier(1)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              tariffMultiplier === 1
                ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Residencial Estándar
          </button>
          <button
            type="button"
            onClick={() => setTariffMultiplier(1.35)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              tariffMultiplier === 1.35
                ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Tarifa DAC Verano
          </button>
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
    </div>
  );
};

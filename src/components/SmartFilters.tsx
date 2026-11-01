import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { ProductCategory, ProtocolType } from '../data/products';

export interface FilterState {
  category: ProductCategory | 'all';
  protocols: ProtocolType[];
  maxPrice: number;
  sortBy: 'featured' | 'low' | 'high' | 'savings';
}

interface SmartFiltersProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  totalMatches: number;
}

const PROTOCOLS: ProtocolType[] = [
  'Matter',
  'Apple HomeKit',
  'Zigbee',
  'Google Home',
  'Alexa',
];

const CATEGORIES: Array<ProductCategory | 'all'> = [
  'all',
  'Seguridad',
  'Smart Home',
  'Automatización',
  'Redes',
  'Negocios',
];

export const SmartFilters: React.FC<SmartFiltersProps> = ({
  filters,
  onChange,
  totalMatches,
}) => {
  const toggleProtocol = (proto: ProtocolType) => {
    const exists = filters.protocols.includes(proto);
    const nextProtocols = exists
      ? filters.protocols.filter((p) => p !== proto)
      : [...filters.protocols, proto];
    onChange({ ...filters, protocols: nextProtocols });
  };

  const resetAll = () => {
    onChange({
      category: 'all',
      protocols: [],
      maxPrice: 16000,
      sortBy: 'featured',
    });
  };

  return (
    <div className="neo-surface rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="w-4 h-4 text-cyan-600 dark:text-[#70e9ff]" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Filtrado Inteligente
          </h3>
        </div>
        <button
          type="button"
          onClick={resetAll}
          className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-[#70e9ff] flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Restablecer
        </button>
      </div>

      {/* Category Selector */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Universo de Producto
        </p>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const active = filters.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onChange({ ...filters, category: cat })}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                    : 'neo-inset text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat === 'all' ? 'Todos' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Protocol Compatibility 3D Toggle Switches */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Compatibilidad Específica
        </p>
        <div className="space-y-2">
          {PROTOCOLS.map((proto) => {
            const checked = filters.protocols.includes(proto);
            return (
              <button
                key={proto}
                type="button"
                onClick={() => toggleProtocol(proto)}
                aria-pressed={checked}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all border ${
                  checked
                    ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-800 dark:text-[#70e9ff]'
                    : 'border-transparent neo-inset text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{proto}</span>
                <span
                  className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                    checked
                      ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                      : 'bg-slate-300/70 dark:bg-slate-800 text-transparent'
                  }`}
                >
                  ✓
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Neomorphic Price Range Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <label
            htmlFor="neo-price-slider"
            className="font-semibold text-slate-500 dark:text-slate-400"
          >
            Presupuesto Máximo
          </label>
          <span className="font-mono-num font-bold text-cyan-700 dark:text-[#70e9ff]">
            ${filters.maxPrice.toLocaleString()} MXN
          </span>
        </div>
        <div className="neo-inset p-3 rounded-2xl">
          <input
            id="neo-price-slider"
            type="range"
            min={1000}
            max={16000}
            step={500}
            value={filters.maxPrice}
            onChange={(e) =>
              onChange({ ...filters, maxPrice: Number(e.target.value) })
            }
            className="w-full accent-cyan-600 dark:accent-[#70e9ff] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-mono-num text-slate-500 dark:text-slate-400 mt-1">
            <span>$1,000</span>
            <span>$8,500</span>
            <span>$16,000</span>
          </div>
        </div>
      </div>

      {/* Sort Selector */}
      <div className="space-y-2">
        <label
          htmlFor="neo-sort-select"
          className="block text-xs font-semibold text-slate-500 dark:text-slate-400"
        >
          Ordenar Catálogo
        </label>
        <select
          id="neo-sort-select"
          value={filters.sortBy}
          onChange={(e) =>
            onChange({
              ...filters,
              sortBy: e.target.value as FilterState['sortBy'],
            })
          }
          className="w-full neo-inset rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="featured">Mejor valorados</option>
          <option value="low">Precio: menor a mayor</option>
          <option value="high">Precio: mayor a menor</option>
          <option value="savings">Mayor ahorro energético (kWh)</option>
        </select>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
        Mostrando <strong className="font-mono-num text-slate-900 dark:text-white">{totalMatches}</strong>{' '}
        {totalMatches === 1 ? 'equipo compatible' : 'equipos compatibles'}
      </p>
    </div>
  );
};

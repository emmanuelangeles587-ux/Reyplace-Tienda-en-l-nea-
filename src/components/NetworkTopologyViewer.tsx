import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Radio,
  Wifi,
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  RefreshCw,
  Zap,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { Product } from '../data/products';
import { ConfiguredDevice } from './HomeSimulator';

interface NetworkTopologyViewerProps {
  placedDevices: ConfiguredDevice[];
  products: Product[];
  onAddHub: () => void;
}

export const NetworkTopologyViewer: React.FC<NetworkTopologyViewerProps> = ({
  placedDevices,
  products,
  onAddHub,
}) => {
  const [activeSimulation, setActiveSimulation] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Group devices into mesh roles
  const hubDevices = placedDevices.filter((d) => d.productId === 'hub-matter');
  const routerDevices = placedDevices.filter((d) =>
    ['bulb-rgb', 'thermostat-matter', 'wifi7-mesh'].includes(d.productId)
  );
  const endDevices = placedDevices.filter((d) =>
    ['lock-quantum', 'sensor-iot', 'camera-ptz', 'kit-enterprise'].includes(d.productId)
  );

  const totalHubs = hubDevices.length;
  const totalNodes = placedDevices.length;
  const maxNodesPerHub = 32;

  // Analysis of whether an additional hub is needed
  const needsAdditionalHub = totalNodes > maxNodesPerHub || totalHubs === 0;
  const coverageRatio = totalHubs > 0 ? Math.min(100, Math.round((totalNodes / (totalHubs * maxNodesPerHub)) * 100)) : 100;

  return (
    <div className="neo-surface rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-[#70e9ff] border border-cyan-500/20 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" /> TOPOLOGÍA DINÁMICA MATTER & THREAD
            </span>
            <span className="text-xs text-slate-500">Malla IPv6 Autoreparable</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Visualizador de Red & Comprobador de Hubs
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Observa el enrutamiento de paquetes entre nodos Thread/Matter y valida si tu cobertura requiere coordinadores adicionales.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveSimulation(!activeSimulation)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
            activeSimulation
              ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
              : 'neo-inset text-slate-600 dark:text-slate-300'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{activeSimulation ? 'Simulación Activa' : 'Pausar Simulación'}</span>
        </button>
      </div>

      {/* Hub Capacity & Health Status Banner */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          totalHubs === 0
            ? 'bg-rose-500/10 border-rose-500/40 text-rose-900 dark:text-rose-200'
            : needsAdditionalHub
            ? 'bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200'
            : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
        }`}
      >
        <div className="flex items-start gap-3">
          {totalHubs === 0 ? (
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          ) : needsAdditionalHub ? (
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="text-sm font-bold">
              {totalHubs === 0
                ? '¡Atención! Sin Hub Coordinador Matter en la instalación'
                : needsAdditionalHub
                ? 'Capacidad al Límite: Se recomienda 1 Hub adicional'
                : 'Topología Equilibrada: 1 Hub Matter cubre la red con holgura'}
            </h4>
            <p className="text-xs opacity-90 mt-0.5">
              {totalHubs === 0
                ? 'Los dispositivos Zigbee y Thread requieren un coordinador central para ejecutar rutinas locales y sincronizar con Apple Home/Google Home.'
                : `Tienes ${totalNodes} dispositivos configurados sobre ${totalHubs} Hub(s) activo(s). Carga de red: ${coverageRatio}%.`}
            </p>
          </div>
        </div>

        {(totalHubs === 0 || needsAdditionalHub) && (
          <button
            type="button"
            onClick={onAddHub}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap self-start sm:self-center shrink-0 hover:scale-105 transition-all shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir Hub Neural (+ $1,899 MXN)</span>
          </button>
        )}
      </div>

      {/* Interactive Topology Graph Canvas */}
      <div className="relative w-full h-[400px] rounded-3xl neo-inset border border-slate-200 dark:border-slate-800 bg-[#060c1d] overflow-hidden p-6 flex flex-col justify-between shadow-inner">
        {/* Architectural Grid Background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, #70e9ff 1.5px, transparent 1.5px), linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '36px 36px, 72px 72px, 72px 72px',
          }}
        />

        {/* SVG Mesh Lines Connecting Nodes with animated pulse packets */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Lines from Center Hub (50%, 50%) to Routers and End Devices */}
          {routerDevices.map((_, i) => {
            const angle = (i / Math.max(1, routerDevices.length)) * Math.PI * 2;
            const x2 = 50 + Math.cos(angle) * 32;
            const y2 = 50 + Math.sin(angle) * 32;
            return (
              <g key={`rline-${i}`}>
                <line
                  x1="50%"
                  y1="50%"
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="rgba(112, 233, 255, 0.45)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                {activeSimulation && (
                  <circle
                    r="3.5"
                    fill="#70e9ff"
                    className="animate-ping"
                    cx={`${(50 + x2) / 2}%`}
                    cy={`${(50 + y2) / 2}%`}
                  />
                )}
              </g>
            );
          })}

          {endDevices.map((_, i) => {
            const angle = ((i + 0.5) / Math.max(1, endDevices.length)) * Math.PI * 2;
            const x2 = 50 + Math.cos(angle) * 44;
            const y2 = 50 + Math.sin(angle) * 44;
            return (
              <g key={`eline-${i}`}>
                <line
                  x1="50%"
                  y1="50%"
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="rgba(245, 158, 11, 0.35)"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              </g>
            );
          })}
        </svg>

        {/* Center Node: Thread Border Router / Hub */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all cursor-pointer ${
              totalHubs > 0
                ? 'bg-cyan-500 text-slate-950 border-2 border-white ring-4 ring-cyan-500/30'
                : 'bg-rose-500/80 text-white border-2 border-rose-300'
            }`}
          >
            <Radio className="w-8 h-8 animate-pulse" />
          </div>
          <span className="text-[11px] font-extrabold text-white mt-1.5 px-2 py-0.5 rounded bg-slate-900/80 border border-white/20 whitespace-nowrap">
            {totalHubs > 0 ? 'Hub Neural Matter (Coordinador)' : 'Sin Hub Coordinador'}
          </span>
          <span className="text-[9px] font-mono text-cyan-300">Thread Border Router v1.3</span>
        </div>

        {/* Positioned Routers (Mains-powered) */}
        {routerDevices.map((d, i) => {
          const product = products.find((p) => p.id === d.productId);
          const angle = (i / Math.max(1, routerDevices.length)) * Math.PI * 2;
          const leftPct = 50 + Math.cos(angle) * 32;
          const topPct = 50 + Math.sin(angle) * 32;

          return (
            <motion.div
              key={d.uid}
              style={{ left: `${leftPct}%`, top: `${topPct}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-900/90 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold text-white mt-1 px-1.5 py-0.5 rounded bg-slate-950/80 border border-white/10 truncate max-w-[90px]">
                {product?.name || d.productId}
              </span>
              <span className="text-[8px] font-mono text-emerald-400">Router Node (12ms)</span>
            </motion.div>
          );
        })}

        {/* Positioned End Devices (Battery powered / Sensors) */}
        {endDevices.map((d, i) => {
          const product = products.find((p) => p.id === d.productId);
          const angle = ((i + 0.5) / Math.max(1, endDevices.length)) * Math.PI * 2;
          const leftPct = 50 + Math.cos(angle) * 44;
          const topPct = 50 + Math.sin(angle) * 44;

          return (
            <motion.div
              key={d.uid}
              style={{ left: `${leftPct}%`, top: `${topPct}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900/80 border border-amber-400/70 text-amber-400 flex items-center justify-center shadow-md group-hover:scale-125 transition-transform">
                <Radio className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-medium text-slate-300 mt-1 px-1.5 py-0.5 rounded bg-slate-950/80 border border-white/10 truncate max-w-[80px]">
                {product?.name || d.productId}
              </span>
              <span className="text-[8px] font-mono text-slate-400">End Device</span>
            </motion.div>
          );
        })}

        {/* Canvas Footer Legend */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-t border-white/10 pt-3">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-white">
              <span className="w-3 h-3 rounded bg-cyan-500" /> Coordinador Thread
            </span>
            <span className="flex items-center gap-1.5 text-cyan-300">
              <span className="w-3 h-3 rounded bg-slate-900 border border-cyan-400" /> Nodos Router (Repetidores)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-3 h-3 rounded bg-slate-900 border border-amber-400" /> Dispositivos Finales (Batería)
            </span>
          </div>

          <div className="text-[11px] font-mono text-cyan-300">
            Latencia promedio: 14 ms · Auto-enrutamiento activo
          </div>
        </div>
      </div>
    </div>
  );
};

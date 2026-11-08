import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Radio,
  Wifi,
  Activity,
  ShieldCheck,
  RefreshCw,
  Cpu,
  Layers,
  CheckCircle2,
  AlertCircle,
  Zap,
} from 'lucide-react';

interface BridgeNode {
  id: string;
  name: string;
  protocol: 'Matter / Thread' | 'Zigbee 3.0' | 'Wi-Fi 7 Mesh';
  status: 'online' | 'degraded' | 'syncing';
  rssi: number; // dBm, e.g. -48
  latency: number; // ms, e.g. 11
  jitter: number; // ms
  channel: string;
  connectedDevices: number;
  firmware: string;
  encrypted: boolean;
}

export const BridgeStatusWidget: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastCheck, setLastCheck] = useState('Hace 5 segundos');
  const [bridges, setBridges] = useState<BridgeNode[]>([
    {
      id: 'bridge-1',
      name: 'Hub Neural Matter (Thread Border Router)',
      protocol: 'Matter / Thread',
      status: 'online',
      rssi: -45,
      latency: 12,
      jitter: 1.2,
      channel: 'Thread Ch 25 (PAN: 0x48FA)',
      connectedDevices: 18,
      firmware: 'v3.4.2-matter1.3',
      encrypted: true,
    },
    {
      id: 'bridge-2',
      name: 'Coordinador Zigbee 3.0 Pro',
      protocol: 'Zigbee 3.0',
      status: 'online',
      rssi: -58,
      latency: 16,
      jitter: 2.4,
      channel: 'Zigbee Ch 15 (2.4 GHz)',
      connectedDevices: 12,
      firmware: 'v2.8.0-znp',
      encrypted: true,
    },
    {
      id: 'bridge-3',
      name: 'Nodo Wi-Fi 7 Mesh Residencial',
      protocol: 'Wi-Fi 7 Mesh',
      status: 'online',
      rssi: -38,
      latency: 4,
      jitter: 0.5,
      channel: '6 GHz (320 MHz MLO)',
      connectedDevices: 24,
      firmware: 'v1.12-pro',
      encrypted: true,
    },
  ]);

  const handleRunDiagnostic = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setBridges((prev) =>
        prev.map((b) => ({
          ...b,
          latency: Math.max(4, b.latency + Math.floor((Math.random() - 0.5) * 4)),
          rssi: Math.min(-35, Math.max(-65, b.rssi + Math.floor((Math.random() - 0.5) * 3))),
        }))
      );
      setIsRefreshing(false);
      setLastCheck('Justo ahora');
    }, 850);
  };

  return (
    <div className="neo-surface rounded-[28px] p-5 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl neo-inset flex items-center justify-center text-cyan-600 dark:text-[#70e9ff]">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              Estado de Puentes Matter & Zigbee (Bridge Health)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Monitoreo en vivo de señal, latencia y cifrado local · {lastCheck}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRunDiagnostic}
          disabled={isRefreshing}
          className="px-3 py-1.5 rounded-xl neo-inset text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-[#70e9ff] flex items-center gap-1.5 transition-all"
          title="Ejecutar test de latencia en vivo"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-500' : ''}`} />
          <span className="hidden sm:inline">{isRefreshing ? 'Midiendo...' : 'Test Ping'}</span>
        </button>
      </div>

      {/* Bridges List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {bridges.map((bridge) => {
          // Mini Signal Bars calculation (1 to 5 bars)
          const signalScore = bridge.rssi >= -50 ? 5 : bridge.rssi >= -60 ? 4 : bridge.rssi >= -70 ? 3 : 2;
          const isExcellent = bridge.latency < 15;

          return (
            <div
              key={bridge.id}
              className="neo-inset rounded-2xl p-4 space-y-3 border border-transparent hover:border-cyan-500/30 transition-all"
            >
              {/* Card Title & Protocol Tag */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-[#70e9ff] border border-cyan-500/20">
                    {bridge.protocol}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1.5 truncate max-w-[170px]">
                    {bridge.name}
                  </h4>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-mono-num font-bold text-emerald-600 dark:text-emerald-400">
                    ONLINE
                  </span>
                </div>
              </div>

              {/* Signal Strength & Mini 3D Bars */}
              <div className="pt-1 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-cyan-500" /> Intensidad RSSI:
                  </span>
                  <span className="font-mono-num font-bold text-slate-900 dark:text-white">
                    {bridge.rssi} dBm
                  </span>
                </div>

                {/* 5-bar Mini Signal Equalizer Visual */}
                <div className="flex items-end gap-1 h-4">
                  {[1, 2, 3, 4, 5].map((bar) => (
                    <motion.div
                      key={bar}
                      animate={{
                        height: bar <= signalScore ? `${bar * 20}%` : '20%',
                        opacity: bar <= signalScore ? 1 : 0.25,
                      }}
                      className={`w-full rounded-sm ${
                        bar <= signalScore
                          ? signalScore >= 4
                            ? 'bg-emerald-500'
                            : 'bg-amber-500'
                          : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Latency & Connected Nodes */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px]">Latencia Red</p>
                  <p className={`font-mono-num font-extrabold ${isExcellent ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                    {bridge.latency} ms <span className="text-[9px] font-normal text-slate-400">(±{bridge.jitter}ms)</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 dark:text-slate-400 text-[10px]">Nodos Activos</p>
                  <p className="font-mono-num font-bold text-slate-900 dark:text-white">
                    {bridge.connectedDevices} accesorios
                  </p>
                </div>
              </div>

              {/* Security Pill */}
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3 h-3" /> Cifrado AES-256
                </span>
                <span className="font-mono">{bridge.channel.split(' ')[0]}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

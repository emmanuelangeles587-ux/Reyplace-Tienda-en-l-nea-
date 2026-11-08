import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Lock,
  Unlock,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  Clock,
  Filter,
  Download,
  KeyRound,
  Eye,
  Fingerprint,
  Smartphone,
  Search,
} from 'lucide-react';
import { maskEmail, maskId } from '../utils/masking';

export interface AccessLogItem {
  id: string;
  timestamp: string;
  device: string;
  method: 'Facial 3D' | 'Huella Capacitiva' | 'PIN Dinámico' | 'App Remota' | 'NFC Pass';
  rawUser: string;
  userRole: string;
  status: 'success' | 'failed' | 'tamper_alert';
  details: string;
  cryptoSignature: string;
}

const SAMPLE_ACCESS_LOGS: AccessLogItem[] = [
  {
    id: 'acc-101',
    timestamp: 'Hoy, 19:21:04',
    device: 'Cerradura Quantum 3D · Entrada Principal',
    method: 'Facial 3D',
    rawUser: 'alejandro.rey@reyplace.mx',
    userRole: 'Titular VIP',
    status: 'success',
    details: 'Reconocimiento facial biométrico 3D validado en 280 ms',
    cryptoSignature: 'e4f2...91b8',
  },
  {
    id: 'acc-102',
    timestamp: 'Hoy, 18:45:12',
    device: 'Cerradura Quantum 3D · Entrada Principal',
    method: 'PIN Dinámico',
    rawUser: 'servicio.limpieza@domo.mx',
    userRole: 'Acceso Temporal',
    status: 'success',
    details: 'PIN de un solo uso autorizado dentro de horario permitido',
    cryptoSignature: '8a1c...33f0',
  },
  {
    id: 'acc-103',
    timestamp: 'Hoy, 16:12:50',
    device: 'Cerradura Quantum 3D · Puerta Cochera',
    method: 'PIN Dinámico',
    rawUser: 'desconocido@ip.local',
    userRole: 'No Registrado',
    status: 'failed',
    details: 'Intento de PIN erróneo (intento 2 de 5) bloqueado por enclave',
    cryptoSignature: 'bb09...11de',
  },
  {
    id: 'acc-104',
    timestamp: 'Hoy, 14:05:22',
    device: 'Cerradura Quantum 3D · Entrada Principal',
    method: 'Huella Capacitiva',
    rawUser: 'gabriel.osuna@reyplace.mx',
    userRole: 'Familiar Autorizado',
    status: 'success',
    details: 'Huella dactilar reconocida al primer toque',
    cryptoSignature: '22c1...fe44',
  },
  {
    id: 'acc-105',
    timestamp: 'Hoy, 11:30:18',
    device: 'Cerradura Quantum 3D · Acceso Terraza',
    method: 'App Remota',
    rawUser: 'alejandro.rey@reyplace.mx',
    userRole: 'Titular VIP',
    status: 'success',
    details: 'Apertura remota autorizada por Matter over Wi-Fi',
    cryptoSignature: 'aa77...1902',
  },
  {
    id: 'acc-106',
    timestamp: 'Ayer, 23:14:02',
    device: 'Cerradura Quantum 3D · Entrada Principal',
    method: 'Facial 3D',
    rawUser: 'intruso.no.identificado',
    userRole: 'Sospechoso',
    status: 'tamper_alert',
    details: 'Rostro no coincidente en 3 escaneos nocturnos. Captura 4K guardada.',
    cryptoSignature: 'ff88...4431',
  },
];

interface TimeSeriesPoint {
  label: string;
  exitosos: number;
  fallidos: number;
}

const TIME_SERIES_HOURLY: TimeSeriesPoint[] = [
  { label: '00:00', exitosos: 1, fallidos: 0 },
  { label: '03:00', exitosos: 0, fallidos: 0 },
  { label: '06:00', exitosos: 2, fallidos: 0 },
  { label: '09:00', exitosos: 8, fallidos: 1 },
  { label: '12:00', exitosos: 14, fallidos: 1 },
  { label: '15:00', exitosos: 9, fallidos: 2 },
  { label: '18:00', exitosos: 16, fallidos: 1 },
  { label: '21:00', exitosos: 7, fallidos: 0 },
];

const TIME_SERIES_7DAYS: TimeSeriesPoint[] = [
  { label: 'Lun', exitosos: 42, fallidos: 2 },
  { label: 'Mar', exitosos: 38, fallidos: 3 },
  { label: 'Mié', exitosos: 51, fallidos: 1 },
  { label: 'Jue', exitosos: 46, fallidos: 4 },
  { label: 'Vie', exitosos: 62, fallidos: 2 },
  { label: 'Sáb', exitosos: 55, fallidos: 5 },
  { label: 'Dom', exitosos: 48, fallidos: 1 },
];

export const SmartAccessHistory: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d'>('24h');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed'>('all');

  const chartData = timeRange === '24h' ? TIME_SERIES_HOURLY : TIME_SERIES_7DAYS;

  // Filter logs
  const filteredLogs = useMemo(() => {
    return SAMPLE_ACCESS_LOGS.filter((log) => {
      if (statusFilter === 'success' && log.status !== 'success') return false;
      if (statusFilter === 'failed' && log.status === 'success') return false;
      if (methodFilter !== 'all' && log.method !== methodFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          log.device.toLowerCase().includes(q) ||
          log.rawUser.toLowerCase().includes(q) ||
          log.details.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [statusFilter, methodFilter, searchQuery]);

  const totalSuccess = SAMPLE_ACCESS_LOGS.filter((l) => l.status === 'success').length;
  const totalFailed = SAMPLE_ACCESS_LOGS.filter((l) => l.status !== 'success').length;

  return (
    <div className="neo-surface rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-[#70e9ff] border border-cyan-500/20 flex items-center gap-1.5">
              <KeyRound className="w-3 h-3" /> AUDITORÍA BIOMÉTRICA RESIDENCIAL
            </span>
            <span className="text-xs text-slate-500">Cifrado de Enclave AES-256</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Historial de Accesos Inteligentes (Smart Access History)
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Telemetría cronológica de aperturas faciales 3D, huellas dactilares y tentativas no autorizadas con enmascaramiento de privacidad PII.
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1.5 neo-inset p-1 rounded-xl self-start sm:self-center">
          <button
            type="button"
            onClick={() => setTimeRange('24h')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              timeRange === '24h'
                ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Últimas 24h
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              timeRange === '7d'
                ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Últimos 7 días
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="neo-inset rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Desbloqueos Autorizados
          </span>
          <p className="text-2xl font-black font-mono-num text-emerald-600 dark:text-emerald-400 mt-1">
            {timeRange === '24h' ? '57' : '342'}{' '}
            <span className="text-xs font-normal text-slate-500">(97.4% tasa de éxito)</span>
          </p>
        </div>

        <div className="neo-inset rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Intentos Fallidos / Bloqueados
          </span>
          <p className="text-2xl font-black font-mono-num text-rose-600 dark:text-rose-400 mt-1">
            {timeRange === '24h' ? '5' : '18'}{' '}
            <span className="text-xs font-normal text-slate-500">(Enclave protegido)</span>
          </p>
        </div>

        <div className="neo-inset rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-cyan-500" /> Método Predilecto
          </span>
          <p className="text-2xl font-black font-mono-num text-cyan-600 dark:text-[#70e9ff] mt-1">
            Facial 3D <span className="text-xs font-normal text-slate-500">(68% de uso)</span>
          </p>
        </div>
      </div>

      {/* Time-Series Graph */}
      <div className="neo-inset rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 px-2">
          <span>Cronología de Intentos de Desbloqueo</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-cyan-600 dark:text-[#70e9ff]">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Exitosos
            </span>
            <span className="flex items-center gap-1.5 text-rose-500">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Fallidos / Alerta
            </span>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="failedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
              <XAxis
                dataKey="label"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#091229',
                  borderColor: 'rgba(255,255,255,0.15)',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="exitosos"
                name="Desbloqueos Exitosos"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fill="url(#successGrad)"
              />
              <Area
                type="monotone"
                dataKey="fallidos"
                name="Intentos Fallidos"
                stroke="#f43f5e"
                strokeWidth={2}
                fill="url(#failedGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Integrated System Audit Logs Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar en auditoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl neo-inset bg-transparent border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200"
          >
            <option value="all">Todos los métodos</option>
            <option value="Facial 3D">Reconocimiento Facial 3D</option>
            <option value="Huella Capacitiva">Huella Dactilar</option>
            <option value="PIN Dinámico">Código PIN</option>
            <option value="App Remota">App Remota</option>
          </select>

          <button
            type="button"
            onClick={() => setStatusFilter(statusFilter === 'all' ? 'failed' : statusFilter === 'failed' ? 'success' : 'all')}
            className={`px-3 py-1.5 rounded-xl font-bold border transition-colors ${
              statusFilter === 'failed'
                ? 'bg-rose-500/20 border-rose-500 text-rose-500'
                : statusFilter === 'success'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500'
                : 'neo-inset text-slate-600 dark:text-slate-300'
            }`}
          >
            {statusFilter === 'all' ? 'Estado: Todos' : statusFilter === 'failed' ? 'Solo Bloqueados' : 'Solo Autorizados'}
          </button>
        </div>

        <span className="text-slate-500 font-mono-num">{filteredLogs.length} eventos registrados</span>
      </div>

      {/* Neomorphic Table: System Audit Log */}
      <div className="overflow-x-auto rounded-2xl neo-inset p-1">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
              <th className="p-3">Hora & Fecha</th>
              <th className="p-3">Dispositivo de Acceso</th>
              <th className="p-3">Método</th>
              <th className="p-3">Usuario (PII Protegido)</th>
              <th className="p-3">Estatus</th>
              <th className="p-3">Firma Criptográfica</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {filteredLogs.map((log) => {
              const isSuccess = log.status === 'success';
              const isTamper = log.status === 'tamper_alert';
              const maskedUser = log.rawUser.includes('@') ? maskEmail(log.rawUser) : maskId(log.rawUser);

              return (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="p-3 font-mono-num text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                    {log.device}
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      {log.method === 'Facial 3D' && <Eye className="w-3.5 h-3.5 text-cyan-500" />}
                      {log.method === 'Huella Capacitiva' && <Fingerprint className="w-3.5 h-3.5 text-amber-500" />}
                      {log.method === 'PIN Dinámico' && <KeyRound className="w-3.5 h-3.5 text-indigo-400" />}
                      {log.method === 'App Remota' && <Smartphone className="w-3.5 h-3.5 text-emerald-500" />}
                      <span>{log.method}</span>
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <p className="font-mono text-slate-900 dark:text-white">{maskedUser}</p>
                    <p className="text-[10px] text-slate-400">{log.userRole}</p>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isSuccess
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : isTamper
                          ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40 animate-pulse'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {isSuccess ? (
                        <>
                          <Unlock className="w-3 h-3" /> Autorizado
                        </>
                      ) : isTamper ? (
                        <>
                          <AlertTriangle className="w-3 h-3" /> Alerta Forcejeo
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" /> Bloqueado
                        </>
                      )}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                    SHA-256:{log.cryptoSignature}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

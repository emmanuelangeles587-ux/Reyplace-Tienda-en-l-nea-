import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Lock,
  Unlock,
  Bell,
  BellRing,
  Eye,
  Volume2,
  AlertTriangle,
  CheckCircle2,
  Handshake,
  ShieldCheck,
  KeyRound,
  Check,
  ChevronRight,
} from 'lucide-react';
import { VILLA_CAMERA_FEED } from '../data/products';
import { SecurityAlertItem } from '../hooks/useSecurityNotifications';
import { CloudBridgeChart } from './CloudBridgeChart';
import { BridgeStatusWidget } from './BridgeStatusWidget';
import { SmartAccessHistory } from './SmartAccessHistory';

export interface SmartSecurityState {
  securityArmed: boolean;
  frontDoorLocked: boolean;
  courtyardSiren: boolean;
  perimeterSensorsActive: boolean;
  livingRoomLights: boolean;
  thermostatTemp: number;
}

interface SecurityDashboardProps {
  state: SmartSecurityState;
  onToggleArm: () => void;
  onToggleLock: () => void;
  onTogglePerimeter: () => void;
  onTriggerTestIntrusion: () => void;
  notificationPermission: NotificationPermission;
  onRequestPermission: () => Promise<NotificationPermission> | void;
  recentAlerts: SecurityAlertItem[];
}

export const SecurityDashboard: React.FC<SecurityDashboardProps> = ({
  state,
  onToggleArm,
  onToggleLock,
  onTogglePerimeter,
  onTriggerTestIntrusion,
  notificationPermission,
  onRequestPermission,
  recentAlerts,
}) => {
  const [selectedCameraZone, setSelectedCameraZone] = useState<
    'Acceso Principal' | 'Patio Central'
  >('Acceso Principal');
  const [securityTab, setSecurityTab] = useState<'monitoring' | 'access_history'>('monitoring');

  // Guided Alert Setup Wizard + 3D Handshake Confirmation State
  const [setupStep, setSetupStep] = useState<1 | 2 | 3>(() =>
    notificationPermission === 'granted' ? 3 : 1
  );
  const [systemChannelVerified, setSystemChannelVerified] = useState<boolean>(
    notificationPermission === 'granted'
  );
  const [handshakeCompleted, setHandshakeCompleted] = useState<boolean>(
    notificationPermission === 'granted'
  );
  const [showOnboardingPanel, setShowOnboardingPanel] = useState<boolean>(true);
  const [isHandshaking, setIsHandshaking] = useState<boolean>(false);

  useEffect(() => {
    if (notificationPermission === 'granted' && setupStep === 1) {
      setSetupStep(2);
    }
  }, [notificationPermission, setupStep]);

  const handleBrowserPermissionStep = async () => {
    const res = await onRequestPermission();
    // Move to step 2 even if browser sandbox blocks native popups so user can complete encrypted alert channel handshake
    if (res === 'granted' || res === 'denied' || res === 'default' || res === undefined) {
      setSetupStep(2);
    }
  };

  const handleCompleteHandshake = () => {
    setSystemChannelVerified(true);
    setIsHandshaking(true);
    setTimeout(() => {
      setIsHandshaking(false);
      setHandshakeCompleted(true);
      setSetupStep(3);
      onTriggerTestIntrusion();
    }, 950);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tabs: Monitoreo & Nodos Bridge VS Smart Access History */}
      <div className="flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
        <button
          type="button"
          onClick={() => setSecurityTab('monitoring')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
            securityTab === 'monitoring'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-105'
              : 'neo-surface border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4 text-cyan-500" />
          <span>Monitoreo en Vivo & Nodos Bridge</span>
        </button>

        <button
          type="button"
          onClick={() => setSecurityTab('access_history')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
            securityTab === 'access_history'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-105'
              : 'neo-surface border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <KeyRound className="w-4 h-4 text-emerald-500" />
          <span>Historial de Accesos (Smart Access History)</span>
        </button>
      </div>

      {securityTab === 'access_history' ? (
        <SmartAccessHistory />
      ) : (
        <>
          {/* Guided Initial Notification & System Alert Setup Flow with 3D Handshake */}
          <AnimatePresence>
            {showOnboardingPanel && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="neo-surface rounded-[30px] p-6 md:p-7 border border-slate-200/80 dark:border-slate-800/80 space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-cyan-700 dark:text-[#70e9ff]">
                      Configuración Inicial del Servicio de Alertas
                    </p>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                      Enlace Seguro de Notificaciones del Sistema y Navegador
                    </h2>
                  </div>

                  {handshakeCompleted && (
                    <button
                      type="button"
                      onClick={() => setShowOnboardingPanel(false)}
                      className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white self-start sm:self-center"
                    >
                      Minimizar asistente
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* 3 Guided Steps */}
                  <div className="lg:col-span-7 space-y-3">
                    {/* Step 1 */}
                    <div
                      className={`rounded-2xl p-4 border transition-all flex items-center justify-between gap-4 ${
                        setupStep === 1
                          ? 'border-cyan-500/70 bg-cyan-500/10'
                          : 'border-transparent neo-inset'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl font-mono-num text-xs font-bold flex items-center justify-center shrink-0 ${
                            setupStep > 1 || notificationPermission === 'granted'
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                          }`}
                        >
                          {setupStep > 1 || notificationPermission === 'granted' ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            '01'
                          )}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            Permiso de Notificaciones del Navegador
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                            Autoriza avisos emergentes cuando una cerradura se desbloquee o se active un sensor.
                          </p>
                        </div>
                      </div>
                      {setupStep === 1 && (
                        <button
                          type="button"
                          onClick={handleBrowserPermissionStep}
                          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-[#70e9ff] dark:hover:bg-[#56e2ff] text-white dark:text-[#070d1e] text-xs font-bold shrink-0 flex items-center gap-1.5"
                        >
                          Autorizar <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Step 2 */}
                    <div
                      className={`rounded-2xl p-4 border transition-all flex items-center justify-between gap-4 ${
                        setupStep === 2
                          ? 'border-cyan-500/70 bg-cyan-500/10'
                          : 'border-transparent neo-inset'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl font-mono-num text-xs font-bold flex items-center justify-center shrink-0 ${
                            systemChannelVerified
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : 'neo-inset text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {systemChannelVerified ? <Check className="w-4 h-4" /> : '02'}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            Canal Crítico del Sistema Operativo & Enclave AES-256
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                            Sincroniza llaves de sesión para recibir alertas prioritarias de escritorio sin demora.
                          </p>
                        </div>
                      </div>
                      {setupStep === 2 && (
                        <button
                          type="button"
                          disabled={isHandshaking}
                          onClick={handleCompleteHandshake}
                          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-[#70e9ff] dark:hover:bg-[#56e2ff] text-white dark:text-[#070d1e] text-xs font-bold shrink-0"
                        >
                          {isHandshaking ? 'Negociando...' : 'Iniciar Handshake'}
                        </button>
                      )}
                    </div>

                    {/* Step 3 */}
                    <div
                      className={`rounded-2xl p-4 border transition-all flex items-center justify-between gap-4 ${
                        setupStep === 3
                          ? 'border-emerald-500/60 bg-emerald-500/10'
                          : 'border-transparent neo-inset'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl font-mono-num text-xs font-bold flex items-center justify-center shrink-0 ${
                            handshakeCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'neo-inset text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {handshakeCompleted ? <Check className="w-4 h-4" /> : '03'}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            Servicio de Alertas Verificado
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                            {handshakeCompleted
                              ? 'Túnel criptográfico establecido. Notificaciones en vivo operativas.'
                              : 'Pendiente de confirmación de handshake seguro.'}
                          </p>
                        </div>
                      </div>
                      {handshakeCompleted && (
                        <button
                          type="button"
                          onClick={() => {
                            setHandshakeCompleted(false);
                            setSystemChannelVerified(false);
                            setSetupStep(2);
                          }}
                          className="px-3 py-2 rounded-xl neo-inset text-xs font-semibold text-slate-700 dark:text-slate-200 shrink-0"
                        >
                          Repetir Handshake
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 3D Neomorphic Handshake Animation Stage */}
                  <div
                    className="lg:col-span-5 neo-inset rounded-[26px] p-6 flex flex-col items-center justify-center text-center min-h-[230px] relative overflow-hidden"
                    style={{ perspective: '900px' }}
                  >
                    <motion.div
                      animate={
                        isHandshaking
                          ? {
                              rotateY: [0, 22, -22, 0],
                              rotateX: [0, 10, -8, 0],
                              scale: [1, 1.08, 1],
                            }
                          : handshakeCompleted
                          ? {
                              rotateY: [0, 12, 0],
                              rotateX: [4, -4, 4],
                              scale: 1,
                            }
                          : { rotateY: 0, rotateX: 0, scale: 0.96 }
                      }
                      transition={
                        isHandshaking
                          ? { duration: 0.9, ease: 'easeInOut' }
                          : { duration: 5, repeat: Infinity, ease: 'easeInOut' }
                      }
                      style={{ transformStyle: 'preserve-3d' }}
                      className="relative w-28 h-28 flex items-center justify-center"
                    >
                      {/* Outer 3D Orbital Ring */}
                      <motion.div
                        animate={
                          handshakeCompleted || isHandshaking
                            ? { rotateZ: 360 }
                            : { rotateZ: 0 }
                        }
                        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                        className={`absolute inset-0 rounded-full border-2 border-dashed ${
                          handshakeCompleted
                            ? 'border-emerald-500/70'
                            : isHandshaking
                            ? 'border-cyan-400'
                            : 'border-slate-400/40 dark:border-slate-700'
                        }`}
                      />

                      {/* Elevated 3D Core Emblem */}
                      <div
                        className={`w-20 h-20 rounded-[24px] neo-surface border flex items-center justify-center shadow-xl transition-colors duration-300 ${
                          handshakeCompleted
                            ? 'border-emerald-500/60 text-emerald-500'
                            : isHandshaking
                            ? 'border-cyan-400 text-cyan-500 dark:text-[#70e9ff]'
                            : 'border-slate-300 dark:border-slate-700 text-slate-500'
                        }`}
                      >
                        {handshakeCompleted ? (
                          <Handshake className="w-9 h-9" />
                        ) : isHandshaking ? (
                          <KeyRound className="w-8 h-8" />
                        ) : (
                          <Bell className="w-8 h-8" />
                        )}
                      </div>
                    </motion.div>

                    <div className="mt-4 space-y-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                        {handshakeCompleted && (
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        )}
                        {isHandshaking
                          ? 'Sincronizando Handshake 3D TLS...'
                          : handshakeCompleted
                          ? 'Handshake 3D Confirmado'
                          : 'Esperando Enlace de Alertas'}
                      </p>
                      <p className="text-xs font-mono-num text-slate-500 dark:text-slate-400">
                        {handshakeCompleted
                          ? 'Canal Push Web + Sistema · Latencia 14 ms'
                          : 'Completa los pasos 01 y 02 para activar'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Main Security Status Header */}
          <div className="neo-surface rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-cyan-700 dark:text-[#70e9ff]">
                Monitoreo Cifrado AES-256-GCM
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                Centro de Seguridad en Tiempo Real
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Control directo de cerraduras biométricas, sensores mmWave y alertas push de escritorio.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {!showOnboardingPanel && (
                <button
                  type="button"
                  onClick={() => setShowOnboardingPanel(true)}
                  className="px-3.5 py-2.5 rounded-2xl neo-inset text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  Ver Estado Handshake
                </button>
              )}

              {notificationPermission !== 'granted' && !handshakeCompleted ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowOnboardingPanel(true);
                    handleBrowserPermissionStep();
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 dark:bg-[#70e9ff] dark:hover:bg-[#56e2ff] text-white dark:text-[#070d1e] text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <Bell className="w-4 h-4" /> Configurar Alertas
                </button>
              ) : (
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 px-3 py-2">
                  <BellRing className="w-4 h-4" /> Servicio de alertas enlazado
                </span>
              )}

              <button
                type="button"
                onClick={onTriggerTestIntrusion}
                className="px-4 py-2.5 rounded-2xl border border-amber-500/50 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 text-xs font-semibold transition-colors"
              >
                Simular Evento Perimetral
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Camera Feed Stage (7 cols) */}
            <div className="lg:col-span-7 neo-surface rounded-[28px] p-5 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-600 dark:text-[#70e9ff]" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Domo PTZ 4K · {selectedCameraZone}
                  </h3>
                </div>
                <div className="flex items-center gap-1 neo-inset p-1 rounded-xl">
                  {(['Acceso Principal', 'Patio Central'] as const).map((zone) => (
                    <button
                      key={zone}
                      type="button"
                      onClick={() => setSelectedCameraZone(zone)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        selectedCameraZone === zone
                          ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {zone}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-800 bg-slate-950">
                <img
                  src={VILLA_CAMERA_FEED}
                  alt={`Vista de cámara ${selectedCameraZone}`}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    selectedCameraZone === 'Patio Central'
                      ? 'scale-110 object-right'
                      : 'scale-100'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/40 flex flex-col justify-between p-4 text-white">
                  <div className="flex items-center justify-between text-xs font-mono-num">
                    <span>4K HDR · 60 FPS · Cifrado Local</span>
                    <span>
                      {state.securityArmed ? 'Perímetro Protegido' : 'Monitoreo Pasivo'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span>
                      Cerradura Quantum 3D:{' '}
                      <strong className="text-[#70e9ff]">
                        {state.frontDoorLocked ? 'Bloqueada' : 'Abierta'}
                      </strong>
                    </span>
                    <span className="font-mono-num text-slate-200">
                      Detección IA: 1 residente verificado
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fast Toggles & Sensor Telemetry (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="neo-surface rounded-[28px] p-5 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  Controles Rápidos de Seguridad
                </h3>

                {/* Arm / Disarm Toggle */}
                <div className="neo-inset rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Shield
                      className={`w-5 h-5 ${
                        state.securityArmed
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Sistema de Alarma General
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {state.securityArmed
                          ? 'Armado en modo perimetral'
                          : 'Sistema desarmado'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleArm}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                      state.securityArmed
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                        : 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white'
                    }`}
                  >
                    {state.securityArmed ? 'Armado' : 'Armar'}
                  </button>
                </div>

                {/* Quantum Lock Toggle */}
                <div className="neo-inset rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {state.frontDoorLocked ? (
                      <Lock className="w-5 h-5 text-cyan-600 dark:text-[#70e9ff]" />
                    ) : (
                      <Unlock className="w-5 h-5 text-rose-500" />
                    )}
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Cerradura Principal Quantum 3D
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {state.frontDoorLocked
                          ? 'Pestillo motorizado asegurado'
                          : 'Acceso desbloqueado temporalmente'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleLock}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                      state.frontDoorLocked
                        ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                        : 'bg-rose-600 text-white hover:bg-rose-500'
                    }`}
                  >
                    {state.frontDoorLocked ? 'Bloqueada' : 'Bloquear'}
                  </button>
                </div>

                {/* mmWave Sensors Toggle */}
                <div className="neo-inset rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Volume2
                      className={`w-5 h-5 ${
                        state.perimeterSensorsActive
                          ? 'text-cyan-600 dark:text-[#70e9ff]'
                          : 'text-slate-400'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Radares mmWave & Contactos
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {state.perimeterSensorsActive
                          ? '6 sensores reportando sin anomalías'
                          : 'Sensores en modo mantenimiento'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onTogglePerimeter}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                      state.perimeterSensorsActive
                        ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                        : 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white'
                    }`}
                  >
                    {state.perimeterSensorsActive ? 'Activos' : 'Activar'}
                  </button>
                </div>
              </div>

              {/* Real-time Push Event Log */}
              <div className="neo-surface rounded-[28px] p-5 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Bitácora de Alertas Push
                </h3>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {recentAlerts.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400 py-3">
                      Sin alertas recientes. Cambia el estado de la cerradura o alarma para probar notificaciones en tiempo real.
                    </p>
                  ) : (
                    recentAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="neo-inset rounded-xl p-3 text-xs flex items-start gap-2.5"
                      >
                        {alert.severity === 'critical' || alert.severity === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between gap-2">
                            <strong className="text-slate-900 dark:text-white truncate">
                              {alert.title}
                            </strong>
                            <span className="font-mono-num text-[11px] text-slate-500 shrink-0">
                              {alert.timestamp}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 mt-0.5">{alert.body}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Bridge Status Widget & Cloud Bridge Telemetry */}
          <div className="space-y-6">
            <BridgeStatusWidget />

            <div className="neo-surface rounded-[28px] p-5 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Puente Nube (Cloud Bridge Latency & Throughput)
              </h3>
              <CloudBridgeChart />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

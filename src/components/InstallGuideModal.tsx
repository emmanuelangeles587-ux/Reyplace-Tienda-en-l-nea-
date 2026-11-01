import React, { useState } from 'react';
import {
  ArrowLeft,
  X,
  Check,
  Clock,
  Wrench,
  ShieldCheck,
  ShoppingBag,
  ChevronRight,
  Cpu,
} from 'lucide-react';
import { Product, ProtocolType } from '../data/products';

interface InstallGuideModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (productId: string) => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [screen, setScreen] = useState<1 | 2 | 3>(1);
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [selectedEcosystem, setSelectedEcosystem] = useState<ProtocolType>('Matter');
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
  });
  const [includeRemoteAssist, setIncludeRemoteAssist] = useState<boolean>(true);
  const [verifiedComplete, setVerifiedComplete] = useState<boolean>(false);

  if (!product) return null;

  const totalMinutes = product.installSteps.reduce(
    (acc, step) => acc + step.estimatedMinutes,
    0
  );
  const activeStepObj =
    product.installSteps.find((s) => s.stepNumber === selectedStep) ||
    product.installSteps[0];

  const toggleStepCompleted = (num: number) => {
    setCompletedSteps((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-guide-heading"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="neo-surface w-full max-w-lg rounded-[32px] border border-slate-200/80 dark:border-slate-700/60 overflow-hidden text-slate-900 dark:text-slate-100 transition-all">
        {/* Top Floating App Bar (Reference Mobile Flow Style) */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          {screen > 1 ? (
            <button
              type="button"
              onClick={() => {
                setVerifiedComplete(false);
                setScreen((prev) => (prev === 3 ? 2 : 1));
              }}
              aria-label="Pantalla anterior"
              className="w-10 h-10 rounded-full neo-inset flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-[#70e9ff] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Guía Interactiva · {totalMinutes} min est.
            </span>
          )}

          {/* 3-Screen Progress Stepper */}
          <div className="flex items-center gap-1.5" aria-label="Progreso de guía">
            {[1, 2, 3].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setScreen(idx as 1 | 2 | 3)}
                className={`h-2 rounded-full transition-all ${
                  screen === idx
                    ? 'w-7 bg-cyan-600 dark:bg-[#70e9ff]'
                    : 'w-2 bg-slate-300 dark:bg-slate-700'
                }`}
                aria-label={`Ir a vista ${idx}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar guía de instalación"
            className="w-10 h-10 rounded-full neo-inset flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-rose-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SCREEN 1: Vista Principal / Exploración de Pasos */}
        {screen === 1 && (
          <div className="px-6 pb-6 space-y-5">
            <div className="flex items-center gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700/70"
              />
              <div className="min-w-0">
                <p className="text-xs text-cyan-700 dark:text-[#70e9ff] font-medium">
                  01. Exploración de Instalación
                </p>
                <h2
                  id="install-guide-heading"
                  className="text-xl font-bold tracking-tight truncate"
                >
                  {product.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {product.category} · {product.installSteps.length} etapas verificadas
                </p>
              </div>
            </div>

            {/* Horizontal Protocol Selector */}
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                Selecciona tu ecosistema principal
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.compatibility.map((proto) => (
                  <button
                    key={proto}
                    type="button"
                    onClick={() => setSelectedEcosystem(proto)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedEcosystem === proto
                        ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                        : 'neo-inset text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {proto}
                  </button>
                ))}
              </div>
            </div>

            {/* Step Cards List */}
            <div className="space-y-3">
              {product.installSteps.map((step) => {
                const isDone = completedSteps[step.stepNumber];
                return (
                  <button
                    key={step.stepNumber}
                    type="button"
                    onClick={() => {
                      setSelectedStep(step.stepNumber);
                      setScreen(2);
                    }}
                    className="w-full text-left p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0c1730]/80 hover:border-cyan-500/60 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <span
                        className={`w-8 h-8 rounded-xl font-mono-num text-xs font-semibold flex items-center justify-center shrink-0 ${
                          isDone
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'neo-inset text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {isDone ? <Check className="w-4 h-4" /> : `0${step.stepNumber}`}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                          {step.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {step.requiredTool} · {step.estimatedMinutes} min
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setScreen(2)}
                className="w-full py-3.5 px-5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 dark:bg-[#70e9ff] dark:hover:bg-[#56e2ff] text-white dark:text-[#070d1e] font-bold text-sm transition-colors"
              >
                Configurar Paso a Paso
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 2: Vista de Detalle / Configuración de Etapa */}
        {screen === 2 && (
          <div className="px-6 pb-6 space-y-5">
            <div className="relative rounded-2xl overflow-hidden h-40 border border-slate-200 dark:border-slate-800">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent flex flex-col justify-end p-4">
                <p className="text-xs text-[#70e9ff] font-medium">
                  Etapa 0{activeStepObj.stepNumber} de 0{product.installSteps.length} ·{' '}
                  {selectedEcosystem}
                </p>
                <h3 className="text-lg font-bold text-white">{activeStepObj.title}</h3>
              </div>
            </div>

            {/* Step Selector Tabs */}
            <div className="grid grid-cols-3 gap-2">
              {product.installSteps.map((s) => (
                <button
                  key={s.stepNumber}
                  type="button"
                  onClick={() => setSelectedStep(s.stepNumber)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-colors ${
                    selectedStep === s.stepNumber
                      ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                      : 'neo-inset text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Paso 0{s.stepNumber}
                </button>
              ))}
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeStepObj.description}
            </p>

            {/* Interactive Tool & Time Metadata */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="neo-inset p-3.5 rounded-2xl">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-cyan-600 dark:text-[#70e9ff]" />
                  Herramienta
                </span>
                <p className="font-semibold text-slate-900 dark:text-white mt-1">
                  {activeStepObj.requiredTool}
                </p>
              </div>
              <div className="neo-inset p-3.5 rounded-2xl">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-[#70e9ff]" />
                  Tiempo estimado
                </span>
                <p className="font-semibold font-mono-num text-slate-900 dark:text-white mt-1">
                  {activeStepObj.estimatedMinutes} minutos
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">Recomendación técnica: </strong>
              {activeStepObj.proTip}
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => toggleStepCompleted(activeStepObj.stepNumber)}
                className={`px-4 py-3 rounded-2xl text-xs font-semibold border transition-colors ${
                  completedSteps[activeStepObj.stepNumber]
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {completedSteps[activeStepObj.stepNumber]
                  ? 'Etapa completada ✓'
                  : 'Marcar como lista'}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (selectedStep < product.installSteps.length) {
                    setCompletedSteps((prev) => ({ ...prev, [selectedStep]: true }));
                    setSelectedStep(selectedStep + 1);
                  } else {
                    setCompletedSteps((prev) => ({ ...prev, [selectedStep]: true }));
                    setScreen(3);
                  }
                }}
                className="flex-1 py-3 px-5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 dark:bg-[#70e9ff] dark:hover:bg-[#56e2ff] text-white dark:text-[#070d1e] font-bold text-sm transition-colors"
              >
                {selectedStep < product.installSteps.length
                  ? 'Siguiente Paso'
                  : 'Ver Resumen Final'}
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 3: Vista de Resumen / Verificación y Adquisición */}
        {screen === 3 && (
          <div className="px-6 pb-6 space-y-5">
            <div>
              <p className="text-xs text-cyan-700 dark:text-[#70e9ff] font-medium">
                03. Resumen de Puesta en Marcha
              </p>
              <h3 className="text-xl font-bold mt-0.5">Configuración Lista</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Revisa los parámetros antes de añadir el equipo o validar tu enlace Matter.
              </p>
            </div>

            <div className="neo-inset rounded-2xl p-4 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Dispositivo</span>
                <span className="font-semibold text-right">{product.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Ecosistema de Voz</span>
                <span className="font-semibold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-600 dark:text-[#70e9ff]" />
                  {selectedEcosystem}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Etapas verificadas</span>
                <span className="font-mono-num font-semibold">
                  {completedCount} de {product.installSteps.length} ({totalMinutes} min)
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-300/60 dark:border-slate-800">
                <label
                  htmlFor="remote-assist-toggle"
                  className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Asesoría remota REYPLACE incluida
                </label>
                <input
                  id="remote-assist-toggle"
                  type="checkbox"
                  checked={includeRemoteAssist}
                  onChange={(e) => setIncludeRemoteAssist(e.target.checked)}
                  className="accent-cyan-600 dark:accent-[#70e9ff] w-4 h-4"
                />
              </div>
            </div>

            {/* Price & Value Breakdown */}
            <div className="space-y-2 text-sm px-1">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Equipo Smart Home</span>
                <span className="font-mono-num">${product.price.toLocaleString()} MXN</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Soporte de vinculación {selectedEcosystem}</span>
                <span className="font-mono-num text-emerald-600 dark:text-emerald-400">
                  Sin costo
                </span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Total estimado</span>
                <span className="font-mono-num text-cyan-700 dark:text-[#70e9ff]">
                  ${product.price.toLocaleString()} MXN
                </span>
              </div>
            </div>

            {verifiedComplete ? (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>
                  Guía completada y equipo añadido a tu carrito con perfil {selectedEcosystem}.
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3.5 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                >
                  Cerrar Guía
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product.id);
                    setVerifiedComplete(true);
                  }}
                  className="py-3.5 px-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 dark:bg-[#70e9ff] dark:hover:bg-[#56e2ff] text-white dark:text-[#070d1e] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" /> Añadir Equipo
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Fingerprint, Eye, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

interface BiometricScanModalProps {
  productNames: string[];
  totalAmountMxn: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export const BiometricScanModal: React.FC<BiometricScanModalProps> = ({
  productNames,
  totalAmountMxn,
  onSuccess,
  onCancel,
}) => {
  const [scanType, setScanType] = useState<'fingerprint' | 'retinal'>('fingerprint');
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('Iniciando enclave seguro AES-256...');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    const runScan = () => {
      setProgress(0);
      setIsCompleted(false);
      setStatusText(
        scanType === 'fingerprint'
          ? 'Coloca tu dedo en el sensor capacitivo 3D...'
          : 'Alinea tu mirada con el escáner infrarrojo...'
      );

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsCompleted(true);
            setStatusText('Verificación biométrica militar aprobada.');
            timer = setTimeout(() => {
              onSuccess();
            }, 900);
            return 100;
          }
          const next = prev + 18;
          if (next > 40 && next < 80) {
            setStatusText('Validando certificado X.509 de grado cuántico...');
          } else if (next >= 80) {
            setStatusText('Cifrando pasarela de pago...');
          }
          return next;
        });
      }, 300);
    };

    runScan();

    return () => {
      clearInterval(timer);
      clearTimeout(timer);
    };
  }, [scanType, onSuccess]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="biometric-modal-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="neo-surface w-full max-w-md rounded-[32px] border border-slate-200/80 dark:border-slate-700/80 p-6 md:p-8 space-y-6 text-center shadow-2xl relative overflow-hidden"
      >
        {/* Top Header */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-cyan-700 dark:text-[#70e9ff] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Enclave Militar AES-256-GCM
          </p>
          <h3 id="biometric-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
            Autenticación Biométrica Requerida
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Confirmando adquisición de dispositivos de seguridad ({productNames.join(', ')}) por ${totalAmountMxn.toLocaleString()} MXN.
          </p>
        </div>

        {/* Scan Type Selector */}
        <div className="flex items-center justify-center gap-2 neo-inset p-1.5 rounded-2xl max-w-[240px] mx-auto">
          <button
            type="button"
            onClick={() => setScanType('fingerprint')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              scanType === 'fingerprint'
                ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" /> Huella 3D
          </button>
          <button
            type="button"
            onClick={() => setScanType('retinal')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              scanType === 'retinal'
                ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Escaneo Retinal
          </button>
        </div>

        {/* 3D Neomorphic Interactive Scan Sensor Stage */}
        <div className="relative w-36 h-36 mx-auto neo-inset rounded-full flex items-center justify-center p-2 shadow-inner overflow-hidden">
          {/* Animated Laser Beam */}
          {!isCompleted && (
            <motion.div
              animate={{ y: [-50, 50, -50] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#70e9ff] z-10 pointer-events-none"
            />
          )}

          <div
            className={`w-28 h-28 rounded-full neo-surface border flex items-center justify-center transition-colors duration-500 ${
              isCompleted
                ? 'border-emerald-500 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'border-cyan-500/50 text-cyan-600 dark:text-[#70e9ff]'
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-12 h-12" />
            ) : scanType === 'fingerprint' ? (
              <Fingerprint className="w-12 h-12 animate-pulse" />
            ) : (
              <Eye className="w-12 h-12 animate-pulse" />
            )}
          </div>
        </div>

        {/* Progress Bar & Status */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono-num text-slate-500 dark:text-slate-400">
            <span>{statusText}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full neo-inset overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isCompleted
                  ? 'bg-emerald-500'
                  : 'bg-cyan-600 dark:bg-[#70e9ff]'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-2xl neo-inset text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-rose-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              setProgress(100);
              setIsCompleted(true);
              setTimeout(onSuccess, 400);
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 dark:bg-[#70e9ff] dark:hover:bg-[#56e2ff] text-white dark:text-[#070d1e] font-bold text-xs transition-colors"
          >
            Omitir Escaneo (Demo)
          </button>
        </div>
      </motion.div>
    </div>
  );
};

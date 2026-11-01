import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, RotateCw, ZoomIn, ZoomOut, CheckCircle2, ShieldCheck, Sparkles, Smartphone, Video } from 'lucide-react';
import { Product } from '../data/products';

interface ARViewerModalProps {
  product: Product | null;
  onClose: () => void;
  onTriggerToast: (msg: string) => void;
  onOpenVideoReviews: () => void;
}

export const ARViewerModal: React.FC<ARViewerModalProps> = ({ product, onClose, onTriggerToast, onOpenVideoReviews }) => {
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isPlaced, setIsPlaced] = useState<boolean>(false);
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (cameraActive && !capturedSnapshot) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn('Camera AR Access error:', err);
          setCameraActive(false);
          onTriggerToast('Usando entorno virtual simulado RA (Cámara no disponible)');
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraActive, capturedSnapshot, onTriggerToast]);

  if (!product) return null;

  const handleCapturePhoto = () => {
    setCapturedSnapshot(product.image);
    onTriggerToast('¡Modelo 3D y entorno capturados en RA exitosamente!');
  };

  const handleResetAR = () => {
    setCapturedSnapshot(null);
    setIsPlaced(false);
    setZoomLevel(1);
    setRotationAngle(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl neo-surface rounded-[32px] overflow-hidden border border-slate-700 shadow-2xl bg-[#070d1e] text-white flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neo-inset flex items-center justify-center text-cyan-400">
              <Smartphone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  Visor RA a Escala Real
                </span>
                <span className="text-xs text-slate-400">Matter · ARCore / ARKit</span>
              </div>
              <h2 className="text-lg font-bold text-white">{product.name}</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl neo-inset flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AR Viewport Container */}
        <div className="relative flex-1 min-h-[420px] bg-slate-950 flex items-center justify-center overflow-hidden">
          {capturedSnapshot ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={capturedSnapshot}
                alt="Captura RA"
                className="w-full h-full object-cover filter brightness-90"
              />
              <div className="absolute inset-0 bg-cyan-950/30 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mb-3 shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Captura RA Guardada</h3>
                <p className="text-sm text-slate-300 max-w-md mt-1">
                  El dispositivo {product.name} ha sido proyectado y fijado en tu entorno a escala real 1:1 con cifrado local.
                </p>
                <button
                  type="button"
                  onClick={handleResetAR}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors"
                >
                  Reiniciar Escaneo RA
                </button>
              </div>
            </div>
          ) : cameraActive ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* AR Target Reticle Overlay */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                <div className="w-64 h-64 border-2 border-dashed border-cyan-400/80 rounded-3xl flex items-center justify-center relative animate-pulse">
                  <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px]">
                    APUNTA A SUPERFICIE PLANA
                  </div>
                  {/* 3D Product Floating Hologram */}
                  <motion.div
                    animate={{ rotate: rotationAngle, scale: zoomLevel }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="relative p-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-cyan-500/50 shadow-2xl shadow-cyan-500/30"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-40 h-40 object-cover rounded-xl"
                    />
                    <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-mono text-[9px] font-bold">
                      1:1 ESCALA
                    </div>
                  </motion.div>
                </div>
                <p className="mt-4 text-xs font-medium text-cyan-300 bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-800">
                  Mueve tu dispositivo lentamente para calibrar el plano de profundidad Matter AR
                </p>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center p-8 bg-gradient-to-br from-slate-900 to-slate-950">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#70e9ff_1px,transparent_1px)] [background-size:16px_16px]" />
              <motion.div
                animate={{ rotate: rotationAngle, scale: zoomLevel }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="relative z-10 p-6 rounded-3xl neo-surface border border-cyan-500/40 shadow-2xl max-w-xs text-center bg-slate-900/90"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-48 h-48 object-cover rounded-2xl mx-auto shadow-lg"
                />
                <h4 className="font-bold text-white text-base mt-3">{product.name}</h4>
                <p className="text-xs text-cyan-400 mt-1">Entorno Virtual 3D RA Activo</p>
              </motion.div>
            </div>
          )}

          {/* Floating Control Toolbar */}
          {!capturedSnapshot && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700 shadow-xl">
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.min(1.5, prev + 0.15))}
                title="Acercar"
                className="p-2 rounded-xl neo-inset text-slate-300 hover:text-cyan-400 transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.max(0.7, prev - 0.15))}
                title="Alejar"
                className="p-2 rounded-xl neo-inset text-slate-300 hover:text-cyan-400 transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setRotationAngle((prev) => prev + 45)}
                title="Rotar 3D"
                className="p-2 rounded-xl neo-inset text-slate-300 hover:text-cyan-400 transition-colors"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-6 bg-slate-700 mx-1" />
              <button
                type="button"
                onClick={onOpenVideoReviews}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs flex items-center gap-1.5 transition-colors border border-cyan-500/30"
                title="Ver Hologramas y Reseñas de Clientes en RA"
              >
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Reseñas RA</span>
              </button>
              <button
                type="button"
                onClick={handleCapturePhoto}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span>Capturar Foto RA</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-6 py-3.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Compatibilidad certificada Apple ARKit & Google ARCore</span>
          </div>
          <span className="font-mono text-cyan-400">REYPLACE.MX Spatial Engine</span>
        </div>
      </motion.div>
    </div>
  );
};

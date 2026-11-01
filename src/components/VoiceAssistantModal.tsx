import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, X, Sparkles, Bot, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateSection: (section: 'catalogo' | 'simulador' | 'seguridad' | 'energia' | 'soporte') => void;
  onAskReybot: (query: string) => void;
  onTriggerToast: (msg: string) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigateSection,
  onAskReybot,
  onTriggerToast,
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [detectedIntent, setDetectedIntent] = useState<string | null>(null);

  useEffect(() => {
    let recognition: any = null;
    if (isOpen) {
      setIsListening(true);
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'es-MX';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
          processVoiceCommand(text);
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        try {
          recognition.start();
        } catch (e) {
          console.warn('Speech recognition start error:', e);
        }
      } else {
        // Fallback simulation for browsers without Web Speech API
        setTranscript('Escuchando comandos de voz...');
        setTimeout(() => {
          setTranscript('Quiero ver cerraduras inteligentes');
          processVoiceCommand('cerraduras inteligentes');
        }, 2000);
      }
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {}
      }
    };
  }, [isOpen]);

  const processVoiceCommand = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('catálogo') || lower.includes('tienda') || lower.includes('productos')) {
      setDetectedIntent('Navegando al Catálogo Principal');
      setTimeout(() => {
        onNavigateSection('catalogo');
        onClose();
      }, 1200);
    } else if (lower.includes('simulador') || lower.includes('planos')) {
      setDetectedIntent('Navegando al Simulador Smart Home');
      setTimeout(() => {
        onNavigateSection('simulador');
        onClose();
      }, 1200);
    } else if (lower.includes('seguridad') || lower.includes('cámaras') || lower.includes('alarma')) {
      setDetectedIntent('Navegando al Panel de Seguridad');
      setTimeout(() => {
        onNavigateSection('seguridad');
        onClose();
      }, 1200);
    } else if (lower.includes('energía') || lower.includes('perfil') || lower.includes('puntos')) {
      setDetectedIntent('Navegando a Perfil y Eficiencia Energética');
      setTimeout(() => {
        onNavigateSection('energia');
        onClose();
      }, 1200);
    } else if (lower.includes('reybot') || lower.includes('asistente') || lower.includes('recomiéndame')) {
      setDetectedIntent('Consultando con REYBOT AI');
      setTimeout(() => {
        onNavigateSection('soporte');
        onAskReybot(text);
        onClose();
      }, 1200);
    } else {
      setDetectedIntent(`Consulta enviada a REYBOT: "${text}"`);
      setTimeout(() => {
        onNavigateSection('soporte');
        onAskReybot(text);
        onClose();
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md neo-surface rounded-[32px] overflow-hidden border border-slate-700 shadow-2xl bg-[#070d1e] text-white p-8 text-center space-y-6 relative"
      >
        <TooltipForFirstTime />
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full neo-inset flex items-center justify-center text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-20 h-20 rounded-full neo-inset mx-auto flex items-center justify-center text-cyan-400 relative">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500 animate-ping opacity-40" />
          <Mic className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            Comandos de Voz REYPLACE
          </span>
          <h3 className="text-xl font-extrabold text-white">
            {isListening ? 'Escuchando tu voz...' : 'Procesando comando'}
          </h3>
          <p className="text-xs text-slate-400">
            Di frases como: <strong className="text-white">"Muéstrame el catálogo"</strong>, <strong className="text-white">"Abre seguridad"</strong> o <strong className="text-white">"Recomiéndame una cerradura"</strong>.
          </p>
        </div>

        <div className="p-4 rounded-2xl neo-inset border border-slate-800 min-h-[70px] flex flex-col items-center justify-center space-y-1">
          <p className="text-xs text-slate-500">Transcripción en vivo:</p>
          <p className="text-sm font-medium text-cyan-300 italic">
            "{transcript || 'Escuchando frecuencias de audio...'}"
          </p>
        </div>

        {detectedIntent && (
          <div className="p-3 rounded-xl bg-emerald-500/25 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{detectedIntent}</span>
          </div>
        )}
      </motion.div>
    </div>
  );
};

function TooltipForFirstTime() {
  const [show, setShow] = useState(() => !localStorage.getItem('voice_tooltip_shown'));

  useEffect(() => {
    if (show) {
      localStorage.setItem('voice_tooltip_shown', 'true');
      const timer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-20 left-1/2 -translate-x-1/2 w-[90%] bg-slate-800 p-4 rounded-2xl border border-slate-600 shadow-xl z-10"
    >
      <p className="text-xs text-white">
        💡 <strong className="text-cyan-400">Tip Rápido:</strong> Puedes navegar, buscar productos y pedir soporte con tu voz. ¡El micrófono está siempre listo!
      </p>
    </motion.div>
  );
}

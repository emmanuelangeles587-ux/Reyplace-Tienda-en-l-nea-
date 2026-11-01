import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Cpu, Zap, ArrowRight } from 'lucide-react';
import { PRODUCTS, Product } from '../data/products';

interface HeroSlideBarProps {
  onOpenDetail: (product: Product) => void;
  onAddToCart: (productId: string) => void;
}

interface SlideItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  protocols: string[];
  highlight: string;
  ctaText: string;
  productId: string;
}

const HERO_SLIDES: SlideItem[] = [
  {
    id: 'slide-1',
    badge: 'Seguridad Militar & Titanio',
    title: 'Cerradura Biométrica Quantum 3D',
    subtitle: 'Reconocimiento facial infrarrojo en 0.3s y cifrado AES-256 local.',
    description:
      'Construida en titanio cepillado y cristal de obsidiana. Sincronización nativa con Matter, Apple HomeKit, Google Home y Alexa.',
    image: '/src/assets/images/quantum_smart_lock_1793514319752.jpg',
    protocols: ['Matter', 'Apple HomeKit', 'Google Home', 'Alexa'],
    highlight: 'Autonomía de 8 meses · USB-C de respaldo',
    ctaText: 'Ver Especificaciones 3D',
    productId: 'lock-quantum',
  },
  {
    id: 'slide-2',
    badge: 'Vigilancia Perimetral 4K',
    title: 'Villa Smart AI Security Hub',
    subtitle: 'Servidor NVR silencioso con 4 cámaras IP67 y analíticas con IA local.',
    description:
      'Detección de intrusos con aprendizaje profundo, sirena estroboscópica y respaldo RAID cifrado sin cuotas mensuales en la nube.',
    image: '/src/assets/images/smart_villa_camera_feed_1793514327894.jpg',
    protocols: ['Matter', 'Google Home', 'Alexa'],
    highlight: '4 TB de almacenamiento seguro local',
    ctaText: 'Explorar Sistema Villa',
    productId: 'hub-villa-ai',
  },
  {
    id: 'slide-3',
    badge: 'Eficiencia Energética & Confort',
    title: 'Kit Iluminación Circadiana & Hub Matter',
    subtitle: 'Ajuste automático de temperatura de color según la hora solar.',
    description:
      'Reduce hasta un 32% tu consumo eléctrico mensual mientras protege tu hogar con pasarela Zigbee de largo alcance y encriptación de grado bancario.',
    image: '/src/assets/images/smart_home_gateway_1793514323797.jpg',
    protocols: ['Matter', 'Zigbee', 'Apple HomeKit', 'Google Home'],
    highlight: 'Ahorro promedio de $1,450 MXN mensuales',
    ctaText: 'Ver Kit de Automatización',
    productId: 'hub-matter',
  },
];

export const HeroSlideBar: React.FC<HeroSlideBarProps> = ({ onOpenDetail, onAddToCart }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto slide rotation every 6 seconds unless paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const currentSlide = HERO_SLIDES[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleCtaClick = () => {
    const product = PRODUCTS.find((p) => p.id === currentSlide.productId);
    if (product) {
      onOpenDetail(product);
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden neo-surface rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-10 shadow-2xl bg-gradient-to-br from-slate-100/80 via-white/50 to-slate-200/40 dark:from-[#0b1329] dark:via-[#070d1e] dark:to-[#111c38]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Absolute Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 dark:bg-[#70e9ff]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[420px]">
        {/* Left Side: Text and Actions */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 neo-inset px-3.5 py-1.5 rounded-full text-xs font-bold text-cyan-700 dark:text-[#70e9ff]">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>{currentSlide.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
                {currentSlide.title}
              </h1>

              <p className="text-base sm:text-lg font-medium text-slate-700 dark:text-slate-200 leading-snug">
                {currentSlide.subtitle}
              </p>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                {currentSlide.description}
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-2">
                {currentSlide.protocols.map((proto) => (
                  <span
                    key={proto}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg neo-inset text-slate-700 dark:text-slate-300"
                  >
                    {proto}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{currentSlide.highlight}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action Buttons & Navigation Controls */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleCtaClick}
              className="px-6 py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 dark:bg-[#70e9ff] dark:hover:bg-[#56e2ff] text-white dark:text-[#070d1e] font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <span>{currentSlide.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onAddToCart(currentSlide.productId)}
              className="px-5 py-3.5 rounded-2xl neo-inset font-bold text-sm text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-[#70e9ff] transition-colors"
            >
              Comprar Ahora
            </button>

            {/* Slider Arrow Controls */}
            <div className="flex items-center gap-1.5 ml-auto sm:ml-4">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Slide anterior"
                className="w-10 h-10 rounded-xl neo-inset flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-[#70e9ff] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Slide siguiente"
                className="w-10 h-10 rounded-xl neo-inset flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-[#70e9ff] transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: High Definition 3D Product Visual with Neomorphic Frame */}
        <div className="lg:col-span-5 flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id + '-img'}
              initial={{ opacity: 0, scale: 0.95, rotateY: 5 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.95, rotateY: -5 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[340px]"
            >
              <div className="neo-inset p-3.5 rounded-[30px] border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-80 object-cover object-center rounded-[22px] group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Floating Indicator Pill */}
                <div className="absolute bottom-6 left-6 right-6 p-3 rounded-2xl bg-white/85 dark:bg-[#070d1e]/85 backdrop-blur-md border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                      Ecosistema Verificado
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-600 dark:text-[#70e9ff]">
                    HD 3D PRO
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Indicators / Pagination Dots */}
      <div className="relative z-10 flex items-center justify-center gap-2 pt-6 mt-6 border-t border-slate-200/60 dark:border-slate-800/60">
        {HERO_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Ir al slide ${idx + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === idx
                ? 'w-8 bg-cyan-600 dark:bg-[#70e9ff] shadow-sm shadow-cyan-500/50'
                : 'w-2.5 neo-inset hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

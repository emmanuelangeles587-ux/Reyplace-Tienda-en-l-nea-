import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Gift,
  Share2,
  Check,
  Crown,
  Lock,
  Unlock,
  Sparkles,
  Zap,
  Truck,
  Headphones,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Copy,
  Download,
  CreditCard,
  ChevronRight,
  Star,
  Flame,
} from 'lucide-react';
import { MembershipTier } from '../data/products';

interface LoyaltyDashboardProps {
  points: number;
  tier: MembershipTier;
  totalSpentMxn: number;
  pointsDiscount: number;
  onRedeemDiscount: (pointsCost: number, mxnDiscount: number) => void;
  onEarnPoints: (amount: number, reason: string) => void;
}

interface TierDefinition {
  name: MembershipTier;
  label: string;
  minSpend: number;
  minPoints: number;
  color: string;
  badgeBg: string;
  multiplier: string;
  discountRate: string;
  shipping: string;
  earlyAccess: string;
  support: string;
  warranty: string;
  exclusivePerks: string[];
}

const TIERS: TierDefinition[] = [
  {
    name: 'Bronce',
    label: 'Socio Bronce',
    minSpend: 0,
    minPoints: 0,
    color: 'text-amber-700 dark:text-amber-500',
    badgeBg: 'bg-amber-700/15 border-amber-600/30 text-amber-700 dark:text-amber-400',
    multiplier: '1x Puntos',
    discountRate: '0% Base',
    shipping: 'Envío gratis en compras >$1,499 MXN',
    earlyAccess: 'Acceso normal',
    support: 'Soporte estándar vía Chat REYBOT',
    warranty: 'Garantía oficial 1 año',
    exclusivePerks: ['Acumula 1 punto por cada $10 MXN', 'Boletín de novedades tecnológicas'],
  },
  {
    name: 'Plata',
    label: 'Socio Plata',
    minSpend: 5000,
    minPoints: 500,
    color: 'text-slate-400 dark:text-slate-200',
    badgeBg: 'bg-slate-400/15 border-slate-400/40 text-slate-700 dark:text-slate-200',
    multiplier: '1.5x Puntos',
    discountRate: '5% Permanente',
    shipping: 'Envío estándar 100% gratis en todo',
    earlyAccess: 'Early Access 24h a ofertas y drops',
    support: 'Asistencia remota prioritaria para Matter',
    warranty: 'Garantía extendida +6 meses',
    exclusivePerks: ['5% de descuento directo en caja', 'Envío nacional sin costo mínimo', 'Canje flexible de cupones'],
  },
  {
    name: 'Oro',
    label: 'Socio Oro VIP',
    minSpend: 15000,
    minPoints: 1500,
    color: 'text-amber-500 dark:text-amber-300',
    badgeBg: 'bg-amber-400/20 border-amber-400/60 text-amber-600 dark:text-amber-300',
    multiplier: '2x Puntos',
    discountRate: '8% Permanente',
    shipping: 'Envío Express 24h asegurado gratis',
    earlyAccess: 'Early Access exclusivo 48h antes',
    support: 'Ingeniero IoT dedicado 24/7 y videollamada',
    warranty: 'Garantía extendida +1 año REYPLACE Care',
    exclusivePerks: ['8% de descuento en todo el catálogo', 'Línea directa con ingenieros de domótica', 'Kit de bienvenida de accesorios'],
  },
  {
    name: 'Diamante',
    label: 'Socio Diamante Élite',
    minSpend: 35000,
    minPoints: 3500,
    color: 'text-cyan-600 dark:text-[#70e9ff]',
    badgeBg: 'bg-cyan-500/20 border-cyan-400/60 text-cyan-700 dark:text-[#70e9ff]',
    multiplier: '3x Puntos',
    discountRate: '12% Permanente',
    shipping: 'Envío Ultra-Express prioritario mismo día',
    earlyAccess: 'Pase prioritario a reservas privadas',
    support: 'Concierge y visita técnica sin costo en Sinaloa',
    warranty: 'Garantía ilimitada 3 años REYPLACE Care',
    exclusivePerks: ['12% de descuento ilimitado', 'Concierge personal para proyectos residenciales', 'Acceso a showroom VIP Los Mochis'],
  },
];

interface PointActivity {
  id: string;
  type: 'earn' | 'redeem';
  concept: string;
  amount: number;
  date: string;
}

export const LoyaltyDashboard: React.FC<LoyaltyDashboardProps> = ({
  points,
  tier,
  totalSpentMxn,
  pointsDiscount,
  onRedeemDiscount,
  onEarnPoints,
}) => {
  const [referralEmail, setReferralEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'benefits' | 'redeem' | 'history'>('overview');
  const [copiedId, setCopiedId] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activities, setActivities] = useState<PointActivity[]>([
    {
      id: 'act-1',
      type: 'earn',
      concept: 'Compra de Kit Hub Neural Matter & Zigbee',
      amount: 190,
      date: 'Hoy, 14:32',
    },
    {
      id: 'act-2',
      type: 'earn',
      concept: 'Bono de bienvenida a ReyClub VIP',
      amount: 100,
      date: 'Ayer',
    },
    {
      id: 'act-3',
      type: 'earn',
      concept: 'Registro verificado de dispositivo residencial',
      amount: 50,
      date: 'Hace 3 días',
    },
  ]);

  const prevTierRef = useRef<MembershipTier>(tier);
  const [tierCelebration, setTierCelebration] = useState<string | null>(null);

  useEffect(() => {
    if (prevTierRef.current !== tier) {
      setTierCelebration(`¡Felicidades! Has alcanzado el estatus ${tier}`);
    }
    prevTierRef.current = tier;
  }, [tier]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Determine current tier index & target
  const currentTierIndex = TIERS.findIndex((t) => t.name === tier);
  const nextTier = TIERS[currentTierIndex + 1] || null;

  const currentTierDef = TIERS[currentTierIndex] || TIERS[0];
  const nextTierPoints = nextTier ? nextTier.minPoints : currentTierDef.minPoints;
  const pointsRemaining = nextTier ? Math.max(0, nextTier.minPoints - points) : 0;
  const spendRemaining = nextTier ? Math.max(0, nextTier.minSpend - totalSpentMxn) : 0;

  const progressPct = nextTier
    ? Math.min(100, Math.round(((points - currentTierDef.minPoints) / (nextTier.minPoints - currentTierDef.minPoints)) * 100))
    : 100;

  const memberId = 'REY-VIP-8849-MX';

  const handleCopyId = () => {
    navigator.clipboard?.writeText(memberId);
    setCopiedId(true);
    showToast('¡ID de Membresía copiado al portapapeles!');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralEmail.includes('@')) {
      showToast('Ingresa un correo electrónico válido.');
      return;
    }
    onEarnPoints(200, `Invitación enviada a ${referralEmail}`);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'earn',
        concept: `Invitación VIP enviada a ${referralEmail}`,
        amount: 200,
        date: 'Justo ahora',
      },
      ...prev,
    ]);
    showToast(`¡Invitación enviada! +200 pts acreditados.`);
    setReferralEmail('');
  };

  const handleRedeemCoupon = (cost: number, discountMxn: number) => {
    if (points < cost) {
      showToast(`Te faltan ${(cost - points).toLocaleString()} pts para canjear este cupón.`);
      return;
    }
    onRedeemDiscount(cost, discountMxn);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'redeem',
        concept: `Canje de cupón de descuento $${discountMxn.toLocaleString()} MXN`,
        amount: cost,
        date: 'Justo ahora',
      },
      ...prev,
    ]);
    showToast(`¡Cupón de $${discountMxn} MXN aplicado a tu carrito!`);
  };

  return (
    <div className="neo-surface rounded-[32px] p-6 md:p-8 border border-slate-200/80 dark:border-slate-800/80 space-y-8 relative overflow-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-cyan-600 text-white font-semibold text-sm shadow-2xl flex items-center gap-2 border border-cyan-400/40 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tier Upgrade Celebration Banner */}
      <AnimatePresence>
        {tierCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl p-4 border border-amber-400/60 bg-gradient-to-r from-amber-500/20 via-yellow-400/15 to-cyan-500/15 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-500 dark:text-amber-300 flex items-center justify-center shrink-0">
                <Crown className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {tierCelebration}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Tus nuevos beneficios como multiplicador de puntos y descuentos en checkout están activos.
                </p>
              </div>
            </div>
            <button
              onClick={() => setTierCelebration(null)}
              className="text-xs font-bold text-amber-600 dark:text-amber-300 hover:underline shrink-0"
            >
              Cerrar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Digital Membership Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Status & Key Stats */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-[#70e9ff] border border-cyan-500/20 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" /> REYCLUB VIP EXPERIENCE
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Ecosistema Inteligente ReyPlace
            </span>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Programa de Lealtad & Estatus VIP
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Acumula puntos en cada compra, desbloquea descuentos automáticos en tu carrito, envíos sin costo y atención directa de ingeniería en Los Mochis y todo México.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="neo-inset rounded-2xl p-3.5 text-center">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Puntos Disponibles</p>
              <p className="text-2xl font-black font-mono-num text-cyan-600 dark:text-[#70e9ff] mt-0.5">
                {points.toLocaleString()}
              </p>
            </div>
            <div className="neo-inset rounded-2xl p-3.5 text-center">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Gasto Acumulado</p>
              <p className="text-2xl font-black font-mono-num text-slate-900 dark:text-white mt-0.5">
                ${totalSpentMxn.toLocaleString()}
              </p>
            </div>
            <div className="neo-inset rounded-2xl p-3.5 text-center">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Descuento Activo</p>
              <p className="text-2xl font-black font-mono-num text-amber-500 dark:text-amber-400 mt-0.5">
                {currentTierDef.discountRate}
              </p>
            </div>
          </div>

          {/* Progress to Next Tier */}
          <div className="neo-surface p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-slate-900 dark:text-white">
                Nivel Actual: <span className={currentTierDef.color}>{currentTierDef.name}</span>
              </span>
              {nextTier ? (
                <span className="text-slate-500 dark:text-slate-400">
                  Próximo: <span className={nextTier.color}>{nextTier.name}</span> ({pointsRemaining.toLocaleString()} pts restantes)
                </span>
              ) : (
                <span className="text-cyan-500 font-extrabold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" /> ¡Nivel Máximo Diamante Alcanzado!
                </span>
              )}
            </div>

            {/* Progress Bar with Milestones */}
            <div className="relative w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-cyan-500 via-amber-400 to-[#70e9ff] rounded-full"
              />
            </div>

            {nextTier && (
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Compras faltantes: ${spendRemaining.toLocaleString()} MXN</span>
                <button
                  type="button"
                  onClick={() => onEarnPoints(pointsRemaining, `Ascenso simulado a Nivel ${nextTier.name}`)}
                  className="font-semibold text-cyan-600 dark:text-[#70e9ff] hover:underline flex items-center gap-1"
                >
                  <Zap className="w-3 h-3" /> Simular ascenso a {nextTier.name}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Holographic Digital VIP Card */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-sm rounded-[28px] p-6 shadow-2xl bg-gradient-to-br from-slate-900 via-[#0a1428] to-slate-950 text-white border border-cyan-500/30 overflow-hidden group">
            {/* Holographic Sheen Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/10 to-amber-300/15 pointer-events-none group-hover:opacity-80 transition-opacity" />
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Card Header */}
            <div className="relative flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-amber-400" />
                <span className="font-display font-extrabold tracking-widest text-sm text-white">
                  REYPLACE VIP
                </span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${currentTierDef.badgeBg}`}>
                {currentTierDef.name}
              </span>
            </div>

            {/* Card Center: Chip & QR */}
            <div className="relative py-6 flex items-center justify-between">
              {/* EMV Microchip */}
              <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 border border-amber-200/50 flex flex-col justify-between p-1.5 shadow-md">
                <div className="w-full h-1 bg-amber-700/30 rounded" />
                <div className="w-full h-1 bg-amber-700/30 rounded" />
              </div>

              {/* QR Code Trigger */}
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center gap-1.5 text-xs font-semibold"
                title="Escanear en Showroom Los Mochis"
              >
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>Pase QR</span>
              </button>
            </div>

            {/* Card Footer: Member ID & Benefits */}
            <div className="relative pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Titular de Membresía</p>
                  <p className="text-sm font-bold tracking-wide">ALEJANDRO REY</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Multiplicador</p>
                  <p className="text-sm font-bold font-mono-num text-amber-400">{currentTierDef.multiplier}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-300">
                <span className="font-mono">{memberId}</span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId ? 'Copiado' : 'Copiar ID'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 text-xs">
            <button
              type="button"
              onClick={() => showToast('Pase digital guardado listo para Apple Wallet / Google Wallet')}
              className="px-4 py-2 rounded-xl neo-inset font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:border-cyan-500/40 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Guardar en Wallet
            </button>
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="px-4 py-2 rounded-xl neo-inset font-bold text-cyan-600 dark:text-[#70e9ff] flex items-center gap-1.5 hover:border-cyan-500/40 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" /> Ver Código QR
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQrModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setShowQrModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="neo-surface p-6 rounded-[28px] max-w-sm w-full text-center space-y-4 border border-slate-700 shadow-2xl bg-white dark:bg-[#070d1e]"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pase Digital QR VIP</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Muestra este código en nuestro Showroom en Los Mochis, Sinaloa para canjes y atención preferente.
              </p>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 inline-block shadow-inner">
                {/* Visual QR Pattern Representation */}
                <div className="w-48 h-48 bg-slate-900 rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-slate-900 rounded" />
                    </div>
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-slate-900 rounded" />
                    </div>
                  </div>
                  <div className="text-center font-mono text-[9px] text-cyan-400">REYPLACE.MX VIP</div>
                  <div className="flex justify-between items-end">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-slate-900 rounded" />
                    </div>
                    <div className="w-8 h-8 bg-cyan-400 rounded-md" />
                  </div>
                </div>
              </div>
              <p className="text-xs font-mono font-bold text-cyan-600 dark:text-[#70e9ff]">{memberId}</p>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold"
              >
                Cerrar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Estatus & Beneficios', icon: Crown },
          { id: 'redeem', label: 'Canjear Puntos', icon: Gift },
          { id: 'benefits', label: 'Tabla Comparativa', icon: Award },
          { id: 'history', label: 'Historial de Puntos', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e] shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & PROGRESS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIERS.map((t, idx) => {
              const isCurrent = t.name === tier;
              const isUnlocked = idx <= currentTierIndex;
              return (
                <div
                  key={t.name}
                  className={`neo-surface rounded-2xl p-5 border transition-all ${
                    isCurrent
                      ? 'border-cyan-500 shadow-lg ring-1 ring-cyan-500/30'
                      : isUnlocked
                      ? 'border-slate-300 dark:border-slate-700 opacity-90'
                      : 'border-slate-200/60 dark:border-slate-800/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${t.badgeBg}`}>
                      {t.name}
                    </span>
                    {isCurrent ? (
                      <span className="text-[11px] font-bold text-cyan-600 dark:text-[#70e9ff] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Actual
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Unlock className="w-3 h-3" /> Desbloqueado
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Bloqueado
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    A partir de <span className="font-mono-num font-semibold">${t.minSpend.toLocaleString()} MXN</span>
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                      <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{t.multiplier}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                      <Truck className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                      <span className="truncate">{t.shipping}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{t.earlyAccess}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                      <Headphones className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{t.support}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ways to Earn Points Fast */}
          <div className="neo-inset rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" /> Maneras de Acumular Puntos Rápidos
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Acelera tu llegada a Nivel Oro y Diamante con estas acciones comunitarias.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  +200 Puntos
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Invita a un Amigo</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Recibe 200 pts cuando tu invitado cree su cuenta y registre su primer dispositivo.
                </p>
                <form onSubmit={handleReferral} className="flex gap-2 pt-1">
                  <input
                    type="email"
                    value={referralEmail}
                    onChange={(e) => setReferralEmail(e.target.value)}
                    placeholder="amigo@correo.com"
                    className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-500"
                  >
                    Enviar
                  </button>
                </form>
              </div>

              <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-[#70e9ff]">
                  +150 Puntos
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Publica una Reseña con Video/Foto</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Comparte tu experiencia real de instalación para guiar a la comunidad y recibe 150 pts.
                </p>
                <button
                  type="button"
                  onClick={() => showToast('Abre cualquier producto en el catálogo y haz clic en "Opiniones y Reseñas" para ganar 150 pts')}
                  className="text-xs font-bold text-cyan-600 dark:text-[#70e9ff] hover:underline pt-2 block"
                >
                  Ir al catálogo a reseñar →
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  +100 Puntos
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Diseña una Habitación en el Simulador</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Arma y guarda tu primer plano con el Diseñador Matter interactivo.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onEarnPoints(100, 'Configuración de habitación inteligente completada');
                    showToast('¡Configuración premiada! +100 pts ReyClub.');
                  }}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-2 block"
                >
                  Validar bono de diseño (+100 pts) →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REDEEM COUPONS */}
      {activeTab === 'redeem' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Centro de Canje de Cupones ReyClub
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Convierte tus puntos acumulados en saldo de descuento directo aplicable en el carrito de compras.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { cost: 150, discount: 150, title: 'Cupón Bienvenida', desc: 'Descuento directo en cualquier accesorio' },
              { cost: 300, discount: 350, title: 'Cupón Plus', desc: 'Ahorro para luminarias y sensores' },
              { cost: 600, discount: 750, title: 'Cupón Premier', desc: 'Descuento especial para Cerradura Quantum o Hub' },
              { cost: 1100, discount: 1500, title: 'Bóveda Diamante', desc: 'Descuento masivo para suites completas' },
            ].map((coupon) => {
              const canAfford = points >= coupon.cost;
              return (
                <div
                  key={coupon.cost}
                  className="neo-surface rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-cyan-500/50 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-[#70e9ff]">
                        {coupon.cost} pts
                      </span>
                      <Gift className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-2xl font-black font-mono-num text-slate-900 dark:text-white">
                      ${coupon.discount.toLocaleString()} MXN
                    </p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{coupon.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{coupon.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRedeemCoupon(coupon.cost, coupon.discount)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                      canAfford
                        ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e] hover:scale-[1.02]'
                        : 'neo-inset text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Canjear y Aplicar al Carrito' : `Faltan ${(coupon.cost - points).toLocaleString()} pts`}
                  </button>
                </div>
              );
            })}
          </div>

          {pointsDiscount > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    Descuento activo en tu carrito: ${pointsDiscount.toLocaleString()} MXN
                  </p>
                  <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400">
                    Se deducirá automáticamente al momento de confirmar tu pedido en la pasarela.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FULL COMPARISON TABLE */}
      {activeTab === 'benefits' && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-4 text-slate-500 font-bold">Beneficio / Privilegio</th>
                  {TIERS.map((t) => (
                    <th key={t.name} className={`py-3 px-4 font-extrabold ${t.color}`}>
                      {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">Gasto Mínimo Requerido</td>
                  {TIERS.map((t) => (
                    <td key={t.name} className="py-3.5 px-4 font-mono-num text-slate-600 dark:text-slate-300">
                      ${t.minSpend.toLocaleString()} MXN
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">Multiplicador de Puntos</td>
                  {TIERS.map((t) => (
                    <td key={t.name} className="py-3.5 px-4 font-bold text-amber-500">
                      {t.multiplier}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">Descuento Permanente Checkout</td>
                  {TIERS.map((t) => (
                    <td key={t.name} className="py-3.5 px-4 font-bold text-cyan-600 dark:text-[#70e9ff]">
                      {t.discountRate}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">Modalidad de Envío</td>
                  {TIERS.map((t) => (
                    <td key={t.name} className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {t.shipping}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">Acceso Anticipado (Early Access)</td>
                  {TIERS.map((t) => (
                    <td key={t.name} className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {t.earlyAccess}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">Soporte Técnico Especializado</td>
                  {TIERS.map((t) => (
                    <td key={t.name} className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {t.support}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">Garantía REYPLACE Care</td>
                  {TIERS.map((t) => (
                    <td key={t.name} className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {t.warranty}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ACTIVITY HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Historial Reciente de Puntos
            </h3>
            <span className="text-xs text-slate-500 font-mono-num">{activities.length} movimientos</span>
          </div>

          <div className="space-y-2">
            {activities.map((act) => (
              <div
                key={act.id}
                className="neo-inset rounded-2xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                      act.type === 'earn'
                        ? 'bg-emerald-500/15 text-emerald-500'
                        : 'bg-amber-500/15 text-amber-500'
                    }`}
                  >
                    {act.type === 'earn' ? '+' : '-'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{act.concept}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{act.date}</p>
                  </div>
                </div>

                <span
                  className={`text-sm font-black font-mono-num ${
                    act.type === 'earn' ? 'text-emerald-500' : 'text-amber-500'
                  }`}
                >
                  {act.type === 'earn' ? `+${act.amount}` : `-${act.amount}`} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

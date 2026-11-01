import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Gift,
  Share2,
  MessageSquarePlus,
  Check,
  Crown,
  Lock,
  Unlock,
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

export const LoyaltyDashboard: React.FC<LoyaltyDashboardProps> = ({
  points,
  tier,
  totalSpentMxn,
  pointsDiscount,
  onRedeemDiscount,
  onEarnPoints,
}) => {
  const [referralEmail, setReferralEmail] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [selectedMilestoneInfo, setSelectedMilestoneInfo] = useState<MembershipTier | null>(
    null
  );
  const [goldUnlockBanner, setGoldUnlockBanner] = useState<boolean>(false);
  const prevTierRef = useRef<MembershipTier>(tier);

  useEffect(() => {
    if (prevTierRef.current !== 'Oro' && tier === 'Oro') {
      setGoldUnlockBanner(true);
    }
    prevTierRef.current = tier;
  }, [tier]);

  const isGold = tier === 'Oro';
  const nextTierName = tier === 'Bronce' ? 'Plata' : tier === 'Plata' ? 'Oro' : 'Oro';
  const nextTierTarget = tier === 'Bronce' ? 500 : 1500;
  const pointsRemaining = isGold ? 0 : Math.max(0, nextTierTarget - points);
  const overallProgressPct = Math.min(100, Math.round((points / 1500) * 100));

  const handleReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralEmail.includes('@')) return;
    onEarnPoints(150, `Invitación enviada a ${referralEmail}`);
    setReferralEmail('');
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewText.trim().length < 8 || reviewSubmitted) return;
    onEarnPoints(80, 'Reseña verificada de producto publicada');
    setReviewSubmitted(true);
    setReviewText('');
  };

  return (
    <div
      className={`neo-surface rounded-[28px] p-6 md:p-8 border transition-colors duration-500 space-y-6 ${
        isGold
          ? 'border-amber-400/70'
          : 'border-slate-200/80 dark:border-slate-800/80'
      }`}
    >
      {/* Gold Tier Unlock Visual Celebration */}
      <AnimatePresence>
        {(isGold || goldUnlockBanner) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl p-4 border border-amber-400/60 bg-gradient-to-r from-amber-500/15 via-yellow-400/10 to-cyan-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3.5">
              <motion.div
                initial={{ rotateY: 0, scale: 0.85 }}
                animate={{ rotateY: 360, scale: 1 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/60 flex items-center justify-center text-amber-500 dark:text-amber-300 shrink-0"
              >
                <Crown className="w-6 h-6" />
              </motion.div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Unlock className="w-4 h-4 text-amber-500" /> Bóveda ReyClub Nivel Oro Desbloqueada
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  8% de descuento automático activo, envíos asegurados sin costo e ingeniería remota VIP habilitada.
                </p>
              </div>
            </div>
            {goldUnlockBanner && (
              <button
                type="button"
                onClick={() => setGoldUnlockBanner(false)}
                className="text-xs font-semibold text-amber-700 dark:text-amber-300 hover:underline self-end sm:self-center shrink-0"
              >
                Entendido
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl neo-inset flex items-center justify-center ${
              isGold
                ? 'text-amber-500 dark:text-amber-300'
                : 'text-cyan-600 dark:text-[#70e9ff]'
            }`}
          >
            {isGold ? <Crown className="w-7 h-7" /> : <Award className="w-7 h-7" />}
          </div>
          <div>
            <p className="text-xs font-semibold text-cyan-700 dark:text-[#70e9ff]">
              Perfil de Socio · Programa ReyClub
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Nivel {tier} ·{' '}
              <span
                className={`font-mono-num ${
                  isGold
                    ? 'text-amber-600 dark:text-amber-300'
                    : 'text-cyan-700 dark:text-[#70e9ff]'
                }`}
              >
                {points.toLocaleString()} pts
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Compras acumuladas: ${totalSpentMxn.toLocaleString()} MXN · Descuento activo en carrito: $
              {pointsDiscount.toLocaleString()} MXN
            </p>
          </div>
        </div>

        {!isGold && (
          <button
            type="button"
            onClick={() =>
              onEarnPoints(pointsRemaining, 'Simulación de ascenso a Nivel ' + nextTierName)
            }
            className="px-4 py-2.5 rounded-2xl neo-inset text-xs font-semibold text-amber-700 dark:text-amber-300 hover:border-amber-400/50 border border-transparent transition-colors self-start md:self-center"
          >
            Simular Ascenso a {nextTierName} (+{pointsRemaining} pts)
          </button>
        )}
      </div>

      {/* Interactive Animated Membership Progress Bar */}
      <div className="neo-inset rounded-[24px] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {isGold ? (
              'Has alcanzado el máximo rango Oro (1,500+ pts)'
            ) : (
              <>
                Te faltan{' '}
                <strong className="font-mono-num text-cyan-700 dark:text-[#70e9ff]">
                  {pointsRemaining.toLocaleString()} puntos
                </strong>{' '}
                para desbloquear el nivel <strong>{nextTierName}</strong>
              </>
            )}
          </span>
          <span className="font-mono-num font-bold text-slate-800 dark:text-slate-200">
            {points.toLocaleString()} / 1,500 pts ({overallProgressPct}%)
          </span>
        </div>

        {/* Animated Bar + Milestone Markers */}
        <div className="relative pt-1 pb-2">
          <div className="h-3.5 w-full rounded-full bg-slate-300/70 dark:bg-slate-900 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgressPct}%` }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className={`h-full rounded-full ${
                isGold
                  ? 'bg-gradient-to-r from-cyan-500 via-amber-400 to-yellow-300'
                  : 'bg-gradient-to-r from-cyan-600 to-[#70e9ff]'
              }`}
            />
          </div>

          {/* Clickable Tier Milestones along the track */}
          <div className="flex items-center justify-between mt-3">
            {[
              { label: 'Bronce' as const, pts: 0 },
              { label: 'Plata' as const, pts: 500 },
              { label: 'Oro' as const, pts: 1500 },
            ].map((ms) => {
              const unlocked = points >= ms.pts;
              return (
                <button
                  key={ms.label}
                  type="button"
                  onClick={() =>
                    setSelectedMilestoneInfo((prev) =>
                      prev === ms.label ? null : ms.label
                    )
                  }
                  className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                    unlocked
                      ? ms.label === 'Oro'
                        ? 'text-amber-600 dark:text-amber-300'
                        : 'text-cyan-700 dark:text-[#70e9ff]'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {unlocked ? (
                    <Unlock className="w-3.5 h-3.5" />
                  ) : (
                    <Lock className="w-3.5 h-3.5" />
                  )}
                  <span>{ms.label}</span>
                  <span className="font-mono-num text-[11px] opacity-80">
                    ({ms.pts}p)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {selectedMilestoneInfo && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-300/60 dark:border-slate-800"
          >
            {selectedMilestoneInfo === 'Bronce' &&
              'Nivel Bronce (0 pts): Acumulas 10 puntos por cada $100 MXN de compra y soporte técnico directo.'}
            {selectedMilestoneInfo === 'Plata' &&
              'Nivel Plata (500 pts): Otorga 4% de descuento directo automático en todo el catálogo y preventas Matter.'}
            {selectedMilestoneInfo === 'Oro' &&
              'Nivel Oro (1,500 pts): Otorga 8% de descuento automático permanente, envío asegurado sin costo y calibración remota VIP.'}
          </motion.div>
        )}
      </div>

      {/* Membership Tiers Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            name: 'Bronce' as const,
            threshold: '0 – 499 pts',
            perks: '10 pts por cada $100 MXN · Soporte prioritario REYBOT',
          },
          {
            name: 'Plata' as const,
            threshold: '500 – 1,499 pts',
            perks: '4% de descuento directo · Acceso anticipado a kits Matter',
          },
          {
            name: 'Oro' as const,
            threshold: '1,500+ pts',
            perks: '8% de descuento directo · Envío asegurado sin costo siempre',
          },
        ].map((item) => {
          const isCurrent = tier === item.name;
          return (
            <div
              key={item.name}
              className={`rounded-2xl p-4 border transition-all ${
                isCurrent
                  ? item.name === 'Oro'
                    ? 'border-amber-400/80 bg-amber-500/10'
                    : 'border-cyan-500/70 bg-cyan-500/10'
                  : 'border-slate-200/70 dark:border-slate-800 neo-inset'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Membresía {item.name}
                </h4>
                <span className="text-xs font-mono-num text-slate-500 dark:text-slate-400">
                  {item.threshold}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {item.perks}
              </p>
            </div>
          );
        })}
      </div>

      {/* Redeem Rewards & Earn Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Gift className="w-4 h-4 text-cyan-600 dark:text-[#70e9ff]" /> Canjear Recompensas en Checkout
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              disabled={points < 200}
              onClick={() => onRedeemDiscount(200, 300)}
              className="text-left neo-inset p-3.5 rounded-2xl border border-transparent hover:border-cyan-500/50 disabled:opacity-45 transition-all"
            >
              <p className="font-bold text-xs text-slate-900 dark:text-white">
                Bono -$300 MXN
              </p>
              <p className="text-[11px] font-mono-num text-cyan-700 dark:text-[#70e9ff] mt-0.5">
                Requiere 200 pts
              </p>
            </button>
            <button
              type="button"
              disabled={points < 500}
              onClick={() => onRedeemDiscount(500, 850)}
              className="text-left neo-inset p-3.5 rounded-2xl border border-transparent hover:border-cyan-500/50 disabled:opacity-45 transition-all"
            >
              <p className="font-bold text-xs text-slate-900 dark:text-white">
                Bono VIP -$850 MXN
              </p>
              <p className="text-[11px] font-mono-num text-cyan-700 dark:text-[#70e9ff] mt-0.5">
                Requiere 500 pts
              </p>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-cyan-600 dark:text-[#70e9ff]" /> Sumar Puntos por Referidos y Reseñas
          </h4>

          <form onSubmit={handleReferral} className="flex gap-2">
            <input
              type="email"
              value={referralEmail}
              onChange={(e) => setReferralEmail(e.target.value)}
              placeholder="Correo de amigo (+150 pts)"
              className="flex-1 neo-inset rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e] text-xs font-bold shrink-0"
            >
              Referir
            </button>
          </form>

          <form onSubmit={handleReview} className="flex gap-2">
            <input
              type="text"
              value={reviewText}
              disabled={reviewSubmitted}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder={
                reviewSubmitted
                  ? 'Reseña registrada (+80 pts acreditados)'
                  : 'Escribe reseña rápida de tu equipo (+80 pts)'
              }
              className="flex-1 neo-inset rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={reviewSubmitted}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold flex items-center gap-1 shrink-0 disabled:opacity-50"
            >
              {reviewSubmitted ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <MessageSquarePlus className="w-3.5 h-3.5" />
              )}
              Publicar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

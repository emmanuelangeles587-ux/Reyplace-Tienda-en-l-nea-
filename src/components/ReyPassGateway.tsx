import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Lock, Unlock, Sparkles, Check, Zap, ArrowRight, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MembershipTier } from '../data/products';
import { validateLuhn } from '../utils/validation';

interface ReyPassGatewayProps {
  totalAmountMxn: number;
  membershipTier: MembershipTier;
  onSuccessfulPayment: (paymentRef: string, isRecurringSaved: boolean, isSplit: boolean) => void;
  onTriggerToast: (msg: string) => void;
}

export function ReyPassGateway({
  totalAmountMxn,
  membershipTier,
  onSuccessfulPayment,
  onTriggerToast,
}: ReyPassGatewayProps) {
  const [saveForRecurring, setSaveForRecurring] = useState<boolean>(true);
  const [useSplitPayment, setUseSplitPayment] = useState<boolean>(false);
  const [selectedSavedCard, setSelectedSavedCard] = useState<string>('card-saved-1');
  const [useNewCard, setUseNewCard] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [cardFields, setCardFields] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  });

  const isCardNumberValid = validateLuhn(cardFields.number.replace(/\D/g, ''));

  // Mock saved cards in ReyPass vault
  const savedCards = [
    { id: 'card-saved-1', brand: 'Visa', last4: '8842', holder: 'Alejandro Rey', expiry: '09/28' },
    { id: 'card-saved-2', brand: 'Mastercard', last4: '3011', holder: 'Alejandro Rey', expiry: '12/27' },
  ];

  const handleExecuteReyPass = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const randomFolio = `REYPASS-${Math.floor(100000 + Math.random() * 900000)}-MX`;
      onSuccessfulPayment(randomFolio, saveForRecurring, useSplitPayment);
      onTriggerToast('¡Pago procesado con éxito a través de pasarela cifrada ReyPass!');
    }, 1800);
  };

  const splitAmount = (totalAmountMxn / 3).toFixed(2);
  const isGold = membershipTier === 'Oro' || membershipTier === 'Diamante';

  return (
    <div className="space-y-5">
      {/* ReyPass Branding Header */}
      <div className="neo-inset p-4 rounded-2xl flex items-center justify-between border border-cyan-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e] flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                ReyPass Secure Vault
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono-num font-bold">
                AES-256
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Pasarela de pagos propietaria de REYPLACE.MX
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400">Total a Pagar</p>
          <p className="text-sm font-bold font-mono-num text-cyan-600 dark:text-[#70e9ff]">
            ${totalAmountMxn.toLocaleString('es-MX')} MXN
          </p>
        </div>
      </div>

      {/* Saved Cards Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Métodos de Pago Guardados ({savedCards.length})</span>
          <button
            type="button"
            onClick={() => setUseNewCard(!useNewCard)}
            className="text-cyan-600 dark:text-[#70e9ff] hover:underline text-[11px]"
          >
            {useNewCard ? 'Usar tarjetas guardadas' : '+ Agregar nueva tarjeta'}
          </button>
        </div>

        {!useNewCard ? (
          <div className="space-y-2">
            {savedCards.map((c) => (
              <label
                key={c.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all border ${
                  selectedSavedCard === c.id
                    ? 'neo-inset border-cyan-500/60 bg-cyan-500/5'
                    : 'neo-surface border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="savedCard"
                    checked={selectedSavedCard === c.id}
                    onChange={() => setSelectedSavedCard(c.id)}
                    className="accent-cyan-600 dark:accent-[#70e9ff]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono-num text-slate-900 dark:text-white">
                        {c.brand} •••• {c.last4}
                      </span>
                      <span className="text-[10px] text-slate-400">{c.expiry}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{c.holder}</p>
                  </div>
                </div>
                <Lock className="w-4 h-4 text-emerald-500" />
              </label>
            ))}
          </div>
        ) : (
          <div className="neo-inset p-4 rounded-2xl space-y-3">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Nueva Tarjeta (Cifrado instantáneo ReyPass Token)
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="Número de tarjeta (4532 ••••)"
                value={cardFields.number}
                onChange={(e) => setCardFields(prev => ({...prev, number: e.target.value}))}
                className="w-full neo-surface rounded-xl px-3 py-2 text-xs font-mono-num focus:outline-none border border-transparent"
              />
              <div className="absolute right-3 top-2.5">
                <AnimatePresence mode="wait">
                  {isCardNumberValid ? (
                    <motion.div
                      key="locked"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Lock className="w-4 h-4 text-emerald-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="unlocked"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Unlock className="w-4 h-4 text-slate-400" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="MM/AA"
                value={cardFields.expiry}
                onChange={(e) => setCardFields(prev => ({...prev, expiry: e.target.value}))}
                className="w-full neo-surface rounded-xl px-3 py-2 text-xs font-mono-num focus:outline-none"
              />
              <input
                type="password"
                maxLength={4}
                placeholder="CVV"
                value={cardFields.cvc}
                onChange={(e) => setCardFields(prev => ({...prev, cvc: e.target.value}))}
                className="w-full neo-surface rounded-xl px-3 py-2 text-xs font-mono-num focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Recurring Subscription Checkbox */}
      <div className="neo-surface p-3.5 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="recurring"
            checked={saveForRecurring}
            onChange={(e) => setSaveForRecurring(e.target.checked)}
            className="w-4 h-4 rounded accent-cyan-600 dark:accent-[#70e9ff]"
          />
          <div>
            <label htmlFor="recurring" className="text-xs font-semibold text-slate-900 dark:text-white cursor-pointer">
              Guardar método cifrado para compras recurrentes y suscripciones
            </label>
            <p className="text-[10px] text-slate-500">
              Facilita futuras compras automáticas de dispositivos y extensiones de garantía.
            </p>
          </div>
        </div>
      </div>

      {/* Gold Level One-Click Split Payments */}
      <div className={`neo-surface p-4 rounded-2xl border ${isGold ? 'border-amber-500/50 bg-amber-500/5' : 'opacity-75'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Crown className={`w-4 h-4 ${isGold ? 'text-amber-500' : 'text-slate-400'}`} />
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Pagos Divididos con 1 Clic (ReyPass Split)
            </span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isGold ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
            {isGold ? 'Desbloqueado Nivel Oro' : 'Requiere Nivel Oro'}
          </span>
        </div>

        {isGold ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useSplitPayment}
                  onChange={(e) => setUseSplitPayment(e.target.checked)}
                  className="accent-amber-500 w-4 h-4"
                />
                Diferir en 3 meses sin intereses ($ {splitAmount} MXN / mes)
              </label>
              <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
            </div>
            {useSplitPayment && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-mono-num bg-amber-500/10 p-2 rounded-xl">
                ✓ Primera mensualidad cobrada hoy. Las siguientes 2 se cargarán automáticamente a tu tarjeta cifrada sin comisiones.
              </p>
            )}
          </div>
        ) : (
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Alcanza el Nivel Oro en ReyClub (1,500 pts) para habilitar el diferimiento automático de pagos en 3 cuotas con un solo clic.
          </p>
        )}
      </div>

      {/* Action Button */}
      <button
        type="button"
        disabled={isProcessing}
        onClick={handleExecuteReyPass}
        className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Autorizando con Bóveda Cifrada ReyPass...</span>
          </div>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4" />
            <span>Autorizar Pago Cifrado por ${totalAmountMxn.toLocaleString('es-MX')} MXN</span>
          </>
        )}
      </button>
    </div>
  );
}

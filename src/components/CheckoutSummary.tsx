import React from 'react';
import { Product, MembershipTier } from '../data/products';

interface CheckoutSummaryProps {
  cart: Map<string, number>;
  products: Product[];
  shippingCost: number;
  pointsDiscount: number;
  membershipTier: MembershipTier;
}

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  cart,
  products,
  shippingCost,
  pointsDiscount,
  membershipTier,
}) => {
  const entries = Array.from(cart.entries());
  const subtotal = entries.reduce((sum, [id, qty]) => {
    const p = products.find((item) => item.id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);

  const tierDiscountRate =
    membershipTier === 'Oro' ? 0.08 : membershipTier === 'Plata' ? 0.04 : 0;
  const tierDiscount = Math.round(subtotal * tierDiscountRate);
  const effectiveShipping = membershipTier === 'Oro' ? 0 : shippingCost;
  const finalTotal = Math.max(
    0,
    subtotal - tierDiscount - pointsDiscount + (subtotal > 0 ? effectiveShipping : 0)
  );

  return (
    <div className="neo-inset rounded-2xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
          Resumen de Orden
        </h4>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono-num">
          {entries.reduce((a, [, q]) => a + q, 0)} uds.
        </span>
      </div>

      <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
        {entries.map(([id, qty]) => {
          const product = products.find((p) => p.id === id);
          if (!product) return null;
          return (
            <div
              key={id}
              className="flex items-center gap-3 pb-2.5 border-b border-slate-200/70 dark:border-slate-800/80 last:border-0 last:pb-0"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {product.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono-num">
                  {qty} × ${product.price.toLocaleString()} MXN
                </p>
              </div>
              <p className="text-xs font-bold font-mono-num text-slate-900 dark:text-white shrink-0">
                ${(product.price * qty).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-300/70 dark:border-slate-800 pt-3 space-y-1.5 text-xs">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Subtotal de equipos</span>
          <span className="font-mono-num">${subtotal.toLocaleString()} MXN</span>
        </div>

        {tierDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <span>Beneficio Nivel {membershipTier}</span>
            <span className="font-mono-num">-${tierDiscount.toLocaleString()} MXN</span>
          </div>
        )}

        {pointsDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <span>Canje de puntos ReyClub</span>
            <span className="font-mono-num">-${pointsDiscount.toLocaleString()} MXN</span>
          </div>
        )}

        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Envío asegurado</span>
          <span className="font-mono-num">
            {effectiveShipping === 0
              ? 'Sin costo'
              : `$${effectiveShipping.toLocaleString()} MXN`}
          </span>
        </div>

        <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-300/70 dark:border-slate-800">
          <span>Total a pagar</span>
          <span className="font-mono-num text-cyan-700 dark:text-[#70e9ff]">
            ${finalTotal.toLocaleString()} MXN
          </span>
        </div>
      </div>
    </div>
  );
};

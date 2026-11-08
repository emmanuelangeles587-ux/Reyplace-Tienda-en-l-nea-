import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Eye,
  Wrench,
  ShoppingBag,
  Bell,
  BellRing,
  Cpu,
} from 'lucide-react';
import { Product } from '../data/products';

interface ProductCard3DProps {
  product: Product;
  currentPrice: number;
  baseCatalogPrice: number;
  hasPriceAlert: boolean;
  onTogglePriceAlert: (productId: string, subscribedPrice: number) => void;
  onOpenDetail: (product: Product) => void;
  onOpenInstallGuide: (product: Product) => void;
  onAddToCart: (productId: string) => void;
  onOpenReviews?: (product: Product) => void;
}

export const ProductCard3D: React.FC<ProductCard3DProps> = ({
  product,
  currentPrice,
  baseCatalogPrice,
  hasPriceAlert,
  onTogglePriceAlert,
  onOpenDetail,
  onOpenInstallGuide,
  onAddToCart,
  onOpenReviews,
}) => {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: Number((-relY * 8).toFixed(2)),
      rotateY: Number((relX * 8).toFixed(2)),
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const isPriceDropped = currentPrice < baseCatalogPrice;

  return (
    <motion.article
      layout
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
      }}
      transition={{ type: 'spring', stiffness: 320, damping: 26, mass: 0.6 }}
      style={{ transformPerspective: 1050 }}
      className="group neo-surface rounded-[28px] border border-slate-200/90 dark:border-slate-800/90 hover:border-cyan-500/70 dark:hover:border-[#70e9ff]/60 overflow-hidden flex flex-col"
    >
      {/* 3D Specular Hardware Pedestal Stage */}
      <div className="hardware-stage aspect-[4/3] bg-slate-200 dark:bg-[#081024] relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
        />

        {/* Quick Price-Drop Alert Subscription Toggle */}
        <button
          type="button"
          onClick={() => onTogglePriceAlert(product.id, currentPrice)}
          aria-pressed={hasPriceAlert}
          title={
            hasPriceAlert
              ? 'Alerta de baja de precio activa'
              : 'Recibir notificación push si baja de precio'
          }
          className={`neo-btn-press absolute top-3 left-3 px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 backdrop-blur-md transition-colors ${
            hasPriceAlert
              ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e] shadow-md'
              : 'bg-slate-950/70 text-slate-100 hover:bg-slate-900/90 border border-white/15'
          }`}
        >
          {hasPriceAlert ? (
            <>
              <BellRing className="w-3.5 h-3.5" /> Alerta Activa
            </>
          ) : (
            <>
              <Bell className="w-3.5 h-3.5" /> Alerta Precio
            </>
          )}
        </button>

        {/* Quick Technical Detail Button */}
        <button
          type="button"
          onClick={() => onOpenDetail(product)}
          aria-label={`Ver especificaciones 3D de ${product.name}`}
          className="neo-btn-press absolute bottom-3 right-3 w-9 h-9 rounded-xl bg-slate-950/75 text-white border border-white/15 flex items-center justify-center hover:bg-cyan-600 dark:hover:bg-[#70e9ff] dark:hover:text-[#070d1e] transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Clean Unboxed Metadata Line with Reviews trigger */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span>{product.category}</span>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={() => onOpenReviews ? onOpenReviews(product) : onOpenDetail(product)}
            className="font-mono-num font-semibold text-amber-500 hover:underline flex items-center gap-0.5"
            title="Ver reseñas de clientes"
          >
            <span>★ {product.rating}</span>
            <span className="text-[10px] text-slate-400">({product.reviewsCount})</span>
          </button>
          <span aria-hidden="true">·</span>
          <span>-{product.monthlyKwhSaved} kWh/mes</span>
        </div>

        <h3 className="font-bold text-base text-slate-900 dark:text-white mt-2 leading-snug">
          <button
            type="button"
            onClick={() => onOpenDetail(product)}
            className="text-left hover:text-cyan-600 dark:hover:text-[#70e9ff] transition-colors"
          >
            {product.name}
          </button>
        </h3>

        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Hardware Material & Security Spec */}
        <div className="mt-3 pt-2.5 border-t border-slate-200/70 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
          <p className="truncate flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-600 dark:text-[#70e9ff] shrink-0" />
            <span>{product.specs.encryption}</span>
          </p>
          <p className="truncate">{product.compatibility.join(' · ')}</p>
        </div>

        {/* Dynamic Price + Action Controls */}
        <div className="mt-auto pt-4 space-y-3">
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span
                className={`text-lg font-extrabold font-mono-num ${
                  isPriceDropped
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-cyan-700 dark:text-[#70e9ff]'
                }`}
              >
                ${currentPrice.toLocaleString()} MXN
              </span>
              {(isPriceDropped || product.originalPrice) && (
                <span className="text-xs font-mono-num text-slate-400 line-through">
                  $
                  {(isPriceDropped
                    ? baseCatalogPrice
                    : product.originalPrice || baseCatalogPrice
                  ).toLocaleString()}
                </span>
              )}
            </div>

            {isPriceDropped && (
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Baja activa
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onOpenInstallGuide(product)}
              className="neo-btn-press py-2.5 px-3 rounded-xl neo-inset text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-[#70e9ff] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Wrench className="w-3.5 h-3.5" /> Instalar
            </button>
            <button
              type="button"
              onClick={() => onAddToCart(product.id)}
              className="neo-btn-press py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-[#70e9ff] dark:hover:bg-[#56e2ff] text-white dark:text-[#070d1e] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Añadir
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Minus, X, ShoppingBag, Scale, Trash2 } from 'lucide-react';
import { Product, ProtocolType } from '../data/products';

interface NeomorphicComparisonTableProps {
  selectedProducts: Product[];
  allProducts: Product[];
  onRemoveProduct: (productId: string) => void;
  onAddProduct: (productId: string) => void;
  onClearAll: () => void;
  onAddToCart: (productId: string) => void;
}

const COMPARE_PROTOCOLS: ProtocolType[] = [
  'Matter',
  'Zigbee',
  'Apple HomeKit',
  'Google Home',
  'Alexa',
];

export const NeomorphicComparisonTable: React.FC<NeomorphicComparisonTableProps> = ({
  selectedProducts,
  allProducts,
  onRemoveProduct,
  onAddProduct,
  onClearAll,
  onAddToCart,
}) => {
  const availableToAdd = allProducts.filter(
    (p) => !selectedProducts.some((sel) => sel.id === p.id)
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      id="comparador-tecnico"
      className="neo-surface rounded-[32px] p-6 md:p-8 border border-slate-200/80 dark:border-slate-800/80 space-y-6"
    >
      {/* Header & Quick Add Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-cyan-700 dark:text-[#70e9ff] flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" /> Matriz Comparativa Lado a Lado
          </p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Tabla Comparativa Neomórfica ({selectedProducts.length}/3 equipos)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Evalúa protocolos de seguridad, cifrado y compatibilidad nativa Matter, Zigbee y Apple HomeKit.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {selectedProducts.length < 3 && availableToAdd.length > 0 && (
            <select
              aria-label="Agregar equipo a la tabla comparativa"
              value=""
              onChange={(e) => {
                if (e.target.value) onAddProduct(e.target.value);
              }}
              className="neo-inset rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">+ Agregar equipo ({3 - selectedProducts.length} disp.)</option>
              {availableToAdd.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — ${item.price.toLocaleString()} MXN
                </option>
              ))}
            </select>
          )}

          {selectedProducts.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="px-3.5 py-2.5 rounded-xl neo-inset text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-500 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Vaciar tabla
            </button>
          )}
        </div>
      </div>

      {selectedProducts.length === 0 ? (
        <div className="neo-inset rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Selecciona hasta 3 productos del catálogo pulsando «Comparar» en cualquier tarjeta o usa el selector superior.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {allProducts.slice(0, 3).map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => onAddProduct(sample.id)}
                className="px-3.5 py-2 rounded-xl bg-cyan-600/15 text-cyan-800 dark:text-[#70e9ff] text-xs font-semibold hover:bg-cyan-600 hover:text-white dark:hover:bg-[#70e9ff] dark:hover:text-[#070d1e] transition-colors"
              >
                + {sample.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800">
                <th className="py-4 pr-4 w-48 align-bottom text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Parámetro Técnico
                </th>
                <AnimatePresence initial={false}>
                  {selectedProducts.map((prod) => (
                    <motion.th
                      key={prod.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="py-4 px-4 align-top min-w-[200px]"
                    >
                      <div className="neo-inset rounded-2xl p-3.5 relative space-y-2.5">
                        <button
                          type="button"
                          onClick={() => onRemoveProduct(prod.id)}
                          aria-label={`Quitar ${prod.name} de la comparación`}
                          className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-slate-200/80 dark:bg-slate-800/90 text-slate-500 hover:text-rose-500 flex items-center justify-center transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            {prod.category}
                          </p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                            {prod.name}
                          </p>
                          <p className="text-sm font-extrabold font-mono-num text-cyan-700 dark:text-[#70e9ff] mt-1">
                            ${prod.price.toLocaleString()} MXN
                          </p>
                        </div>
                      </div>
                    </motion.th>
                  ))}
                </AnimatePresence>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/80 text-xs">
              <tr>
                <td className="py-3.5 pr-4 font-semibold text-slate-600 dark:text-slate-400">
                  Cifrado y Seguridad
                </td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-200">
                    {p.specs.encryption}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3.5 pr-4 font-semibold text-slate-600 dark:text-slate-400">
                  Conectividad Física / Radio
                </td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    {p.specs.connectivity}
                  </td>
                ))}
              </tr>

              {/* Protocol Matrix Rows: Matter, Zigbee, Apple HomeKit, Google Home, Alexa */}
              {COMPARE_PROTOCOLS.map((proto) => (
                <tr key={proto}>
                  <td className="py-3 pr-4 font-semibold text-slate-600 dark:text-slate-400">
                    Compatibilidad {proto}
                  </td>
                  {selectedProducts.map((p) => {
                    const supported = p.compatibility.includes(proto);
                    return (
                      <td key={p.id} className="py-3 px-4">
                        {supported ? (
                          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                            <Check className="w-4 h-4" /> Nativo certificado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                            <Minus className="w-4 h-4" /> Vía puente externo
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              <tr>
                <td className="py-3.5 pr-4 font-semibold text-slate-600 dark:text-slate-400">
                  Latencia de Respuesta
                </td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="py-3.5 px-4 font-mono-num text-slate-800 dark:text-slate-200">
                    {p.specs.responseLatency}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3.5 pr-4 font-semibold text-slate-600 dark:text-slate-400">
                  Alimentación y Autonomía
                </td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    {p.specs.powerSource}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3.5 pr-4 font-semibold text-slate-600 dark:text-slate-400">
                  Protección Ambiental
                </td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    {p.specs.weatherRating}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3.5 pr-4 font-semibold text-slate-600 dark:text-slate-400">
                  Ahorro Eléctrico Estimado
                </td>
                {selectedProducts.map((p) => (
                  <td
                    key={p.id}
                    className="py-3.5 px-4 font-mono-num font-semibold text-emerald-600 dark:text-emerald-400"
                  >
                    -{p.monthlyKwhSaved} kWh/mes
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-600 dark:text-slate-400">
                  Acción Directa
                </td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="py-4 px-4">
                    <button
                      type="button"
                      onClick={() => onAddToCart(p.id)}
                      className="w-full py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-[#70e9ff] dark:hover:bg-[#56e2ff] text-white dark:text-[#070d1e] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Añadir al Carrito
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </motion.section>
  );
};

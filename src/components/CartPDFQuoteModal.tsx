import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Printer,
  Download,
  Share2,
  X,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Calendar,
  Building,
  Hash,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Product } from '../data/products';

export interface CartItemEntry {
  product: Product;
  quantity: number;
}

interface CartPDFQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItemEntry[];
  subtotalMxn: number;
  discountMxn?: number;
  shippingMxn?: number;
}

export const CartPDFQuoteModal: React.FC<CartPDFQuoteModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  subtotalMxn,
  discountMxn = 0,
  shippingMxn = 0,
}) => {
  const [clientName, setClientName] = useState('Residencia Familia Rey');
  const [clientCity, setClientCity] = useState('Los Mochis, Sinaloa');
  const [propertyType, setPropertyType] = useState('Residencia Domótica Premium');
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Quote Folio & Dates
  const folio = useRef(`REY-COT-2026-${Math.floor(100000 + Math.random() * 900000)}`).current;
  const today = new Date();
  const dateStr = today.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const expiryDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
    'es-MX',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  // Calculated Monthly Savings according to equipment in cart
  const hasThermostat = cartItems.some((ci) => ci.product.id === 'thermostat-matter');
  const hasLights = cartItems.some((ci) => ci.product.id === 'bulb-rgb');
  const hasSensors = cartItems.some((ci) => ci.product.id === 'sensor-iot');
  const totalItemCount = cartItems.reduce((acc, ci) => acc + ci.quantity, 0);

  // Base smart home savings algorithm
  const climateKwhMonthly = hasThermostat ? 136 : totalItemCount > 0 ? 45 : 0;
  const climateMxnMonthly = Math.round(climateKwhMonthly * 3.65);

  const lightingKwhMonthly = hasLights ? 58 : totalItemCount > 2 ? 30 : 0;
  const lightingMxnMonthly = Math.round(lightingKwhMonthly * 3.65);

  const standbyKwhMonthly = hasSensors ? 38 : totalItemCount > 3 ? 20 : 0;
  const standbyMxnMonthly = Math.round(standbyKwhMonthly * 3.65);

  const totalKwhSavedMonthly = climateKwhMonthly + lightingKwhMonthly + standbyKwhMonthly;
  const totalMxnSavedMonthly = climateMxnMonthly + lightingMxnMonthly + standbyMxnMonthly;
  const annualMxnSavings = totalMxnSavedMonthly * 12;

  const totalInstallationMxn = subtotalMxn > 15000 ? 0 : 2500; // Courtesy if over $15k
  const finalTotal = subtotalMxn - discountMxn + shippingMxn + totalInstallationMxn;
  const estimatedRoiMonths =
    totalMxnSavedMonthly > 0 ? Math.max(6, Math.round(finalTotal / totalMxnSavedMonthly)) : 18;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `Presupuesto Oficial REYPLACE.MX (${folio})\nTotal: $${finalTotal.toLocaleString()} MXN\nAhorro mensual proyectado: $${totalMxnSavedMonthly.toLocaleString()} MXN (${totalKwhSavedMonthly} kWh/mes)\nValidez: ${expiryDate}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:fixed print:inset-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl bg-white dark:bg-[#0c1631] text-slate-900 dark:text-slate-100 rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden print:max-h-none print:shadow-none print:border-none print:rounded-none"
      >
        {/* Modal Top Actions (Hidden in print) */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-50/80 dark:bg-slate-900/60 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-[#70e9ff] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Presupuesto Ejecutivo Smart Home
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Folio oficial: {folio} · Con certificación de ahorro energético
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl neo-inset text-xs font-semibold flex items-center gap-1.5 text-slate-700 dark:text-slate-200"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-500" />
              <span>{copied ? '¡Copiado!' : 'Compartir'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-[#70e9ff] dark:hover:bg-[#56e2ff] text-white dark:text-[#070d1e] text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Descargar / Imprimir PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl neo-inset text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div
          ref={printRef}
          className="p-6 md:p-10 overflow-y-auto space-y-8 print:p-8 print:text-black print:overflow-visible print:bg-white"
        >
          {/* Header of Quotation */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800 print:border-slate-300">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl font-black tracking-tight text-slate-900 dark:text-white print:text-slate-900">
                  REYPLACE<span className="text-cyan-500">.MX</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-[#70e9ff] border border-cyan-500/20 uppercase tracking-widest print:text-cyan-700">
                  OFICIAL
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm print:text-slate-600">
                Ecosistema Digital Inteligente & Domótica de Alta Fidelidad
                <br />
                Los Mochis, Sinaloa, México · RFC: REY-240815-MX1
                <br />
                Soporte y Garantía Nacional: hola@reyplace.mx
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
                Presupuesto Certificado
              </span>
              <p className="text-lg font-mono-num font-bold text-cyan-600 dark:text-[#70e9ff] print:text-cyan-700">
                {folio}
              </p>
              <p className="text-xs text-slate-500 print:text-slate-600">
                <strong>Fecha de emisión:</strong> {dateStr}
              </p>
              <p className="text-xs text-slate-500 print:text-slate-600">
                <strong>Vigencia de precios:</strong> {expiryDate} (30 días)
              </p>
            </div>
          </div>

          {/* Client Details Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl neo-inset print:border print:border-slate-300 print:bg-slate-50">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Titular / Residencia
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white print:text-slate-900">
                {clientName}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Ubicación del Proyecto
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white print:text-slate-900">
                {clientCity}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Tipo de Inmueble
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white print:text-slate-900">
                {propertyType}
              </p>
            </div>
          </div>

          {/* Products Breakdown Table */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 print:text-slate-900">
              <Layers className="w-4 h-4 text-cyan-500" />
              Desglose de Dispositivos & Hardware Certificado Matter
            </h4>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 print:border-slate-300">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 print:bg-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-bold">Dispositivo</th>
                    <th className="py-3 px-3 font-bold">Protocolos</th>
                    <th className="py-3 px-3 font-bold text-center">Cant.</th>
                    <th className="py-3 px-3 font-bold text-right">P. Unitario</th>
                    <th className="py-3 px-4 font-bold text-right">Importe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 print:divide-slate-300">
                  {cartItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-500 italic">
                        No hay productos en el carrito. Añade equipos para generar el presupuesto completo.
                      </td>
                    </tr>
                  ) : (
                    cartItems.map((ci) => {
                      const itemSubtotal = ci.product.price * ci.quantity;
                      return (
                        <tr
                          key={ci.product.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                        >
                          <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white print:text-slate-900">
                            <div>{ci.product.name}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                              Garantía 24 meses · Cifrado local
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono-num text-[11px] text-slate-600 dark:text-slate-300">
                            {ci.product.compatibility.join(', ')}
                          </td>
                          <td className="py-3 px-3 font-mono-num text-center font-bold">
                            {ci.quantity}
                          </td>
                          <td className="py-3 px-3 font-mono-num text-right text-slate-600 dark:text-slate-300">
                            ${ci.product.price.toLocaleString()} MXN
                          </td>
                          <td className="py-3 px-4 font-mono-num text-right font-bold text-slate-900 dark:text-white print:text-slate-900">
                            ${itemSubtotal.toLocaleString()} MXN
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly Energy Savings Analysis (Key Requirement) */}
          <div className="p-6 rounded-3xl neo-surface border border-emerald-500/30 dark:border-emerald-500/30 bg-emerald-500/5 space-y-4 print:border-emerald-700 print:bg-emerald-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white print:text-slate-900">
                    Proyección de Ahorros Energéticos Mensuales (Auditoría CFE)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 print:text-slate-700">
                    Cálculo automatizado basado en tarifas de Sinaloa y optimización por escenas
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
                  Ahorro Mensual Estimado
                </span>
                <p className="text-2xl font-bold font-mono-num text-emerald-600 dark:text-emerald-400">
                  ${totalMxnSavedMonthly.toLocaleString()} MXN/mes
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl neo-inset print:border print:border-slate-300 print:bg-white">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  Climatización Inverter
                </span>
                <p className="text-sm font-bold font-mono-num text-slate-900 dark:text-white print:text-slate-900 mt-0.5">
                  -{climateKwhMonthly} kWh · ${climateMxnMonthly} MXN/mes
                </p>
                <p className="text-[10px] text-slate-500">Ajuste de termostato 21°C ➔ 24°C</p>
              </div>

              <div className="p-3.5 rounded-2xl neo-inset print:border print:border-slate-300 print:bg-white">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  Iluminación Circadiana
                </span>
                <p className="text-sm font-bold font-mono-num text-slate-900 dark:text-white print:text-slate-900 mt-0.5">
                  -{lightingKwhMonthly} kWh · ${lightingMxnMonthly} MXN/mes
                </p>
                <p className="text-[10px] text-slate-500">Atenuación al 75% con luz diurna</p>
              </div>

              <div className="p-3.5 rounded-2xl neo-inset print:border print:border-slate-300 print:bg-white">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  Corte de Cargas Fantasma
                </span>
                <p className="text-sm font-bold font-mono-num text-slate-900 dark:text-white print:text-slate-900 mt-0.5">
                  -{standbyKwhMonthly} kWh · ${standbyMxnMonthly} MXN/mes
                </p>
                <p className="text-[10px] text-slate-500">Radares mmWave y apagado nocturno</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-1 font-medium">
              <span>
                ⚡ Reducción total de consumo:{' '}
                <strong className="text-emerald-600 dark:text-emerald-400">
                  {totalKwhSavedMonthly} kWh/mes
                </strong>
              </span>
              <span>
                💰 Ahorro anual estimado:{' '}
                <strong className="text-emerald-600 dark:text-emerald-400">
                  ${annualMxnSavings.toLocaleString()} MXN/año
                </strong>
              </span>
              <span>
                🎯 Retorno de inversión (ROI):{' '}
                <strong className="text-cyan-600 dark:text-[#70e9ff]">
                  {estimatedRoiMonths} meses
                </strong>
              </span>
            </div>
          </div>

          {/* Financial Totals */}
          <div className="flex flex-col sm:flex-row justify-end">
            <div className="w-full sm:w-80 space-y-2 p-5 rounded-2xl neo-inset print:border print:border-slate-300 print:bg-white">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Subtotal Equipos:</span>
                <span className="font-mono-num">${subtotalMxn.toLocaleString()} MXN</span>
              </div>
              {discountMxn > 0 && (
                <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Descuento ReyClub / Promoción:</span>
                  <span className="font-mono-num">-${discountMxn.toLocaleString()} MXN</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Instalación & Mapeo Matter:</span>
                <span className="font-mono-num">
                  {totalInstallationMxn === 0 ? (
                    <strong className="text-cyan-500">BONIFICADA</strong>
                  ) : (
                    `$${totalInstallationMxn.toLocaleString()} MXN`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Envío Asegurado Nacional:</span>
                <span className="font-mono-num">
                  {shippingMxn === 0 ? 'GRATIS' : `$${shippingMxn.toLocaleString()} MXN`}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-base font-bold text-slate-900 dark:text-white print:text-slate-900">
                <span>Total Presupuesto:</span>
                <span className="font-mono-num text-cyan-600 dark:text-[#70e9ff] print:text-slate-900">
                  ${finalTotal.toLocaleString()} MXN
                </span>
              </div>
              <p className="text-[10px] text-slate-400 text-right">IVA del 16% incluido</p>
            </div>
          </div>

          {/* Official Signatures & Digital Seal */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 print:border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white print:text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Certificación de Garantía REYPLACE.MX
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Este presupuesto incluye soporte técnico prioritario, garantía de reemplazo express de 24 meses, aprovisionamiento local Matter/Thread y migración transparente de llaves de acceso biométricas.
              </p>
              <p className="text-[10px] font-mono-num text-slate-400 break-all">
                Sello Digital SHA-256: 8f4c2e17b80a13d9f96b27d498c81190a424c5e302a4cce
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end text-left sm:text-right space-y-1">
              <div className="w-32 border-b border-slate-400 pb-1 text-center font-serif text-sm italic text-slate-700 dark:text-slate-300">
                Ing. A. Rey
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white print:text-slate-900">
                Dirección de Operaciones Domóticas
              </p>
              <p className="text-[11px] text-slate-500">REYPLACE.MX · Los Mochis, Sinaloa</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Print Button */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center print:hidden">
          <span className="text-xs text-slate-500">
            Imprime o selecciona &apos;Guardar como PDF&apos; en tu navegador.
          </span>
          <button
            type="button"
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 dark:bg-[#70e9ff] dark:hover:bg-[#56e2ff] text-white dark:text-[#070d1e] text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Archivo PDF</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

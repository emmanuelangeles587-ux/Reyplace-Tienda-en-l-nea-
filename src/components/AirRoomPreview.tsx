import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, Image as ImageIcon, CheckCircle2, ShieldCheck, Download, ShoppingBag } from 'lucide-react';
import { Product } from '../data/products';

interface AirRoomPreviewProps {
  products: Product[];
  onAddToCart: (productId: string) => void;
}

const ROOM_OPTIONS = [
  'Sala de Estar',
  'Cocina Gourmet',
  'Oficina Ejecutiva',
  'Recámara Master',
];

export const AirRoomPreview: React.FC<AirRoomPreviewProps> = ({ products, onAddToCart }) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [selectedRoom, setSelectedRoom] = useState<string>('Sala de Estar');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [promptUsed, setPromptUsed] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isMockResult, setIsMockResult] = useState<boolean>(false);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const handleGenerateRender = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-room-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: selectedProduct?.name || 'Smart Device',
          roomType: selectedRoom,
        }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        setPromptUsed(data.promptUsed || '');
        setIsMockResult(Boolean(data.isMock));
      }
    } catch (err) {
      console.error('AI Room Preview Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="neo-surface rounded-[32px] p-6 md:p-10 border border-slate-200/80 dark:border-slate-800/80 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 neo-inset px-3 py-1 rounded-full text-xs font-bold text-cyan-600 dark:text-[#70e9ff] mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Generador IA de Habitaciones · Gemini & Imagen 3</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Previsualización Realista con IA
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Genera renders arquitectónicos 8K fotorrealistas de cómo lucirán tus dispositivos inteligentes instalados en tipos específicos de habitaciones.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Product Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              1. Selecciona el Dispositivo Inteligente
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full neo-inset px-4 py-3 rounded-2xl text-sm font-medium bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {p.name} (${p.price.toLocaleString()} MXN)
                </option>
              ))}
            </select>
          </div>

          {/* Room Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              2. Selecciona el Tipo de Habitación
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {ROOM_OPTIONS.map((room) => (
                <button
                  key={room}
                  type="button"
                  onClick={() => setSelectedRoom(room)}
                  className={`p-3 rounded-2xl text-xs font-bold text-left transition-all ${
                    selectedRoom === room
                      ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e] shadow-lg shadow-cyan-500/20'
                      : 'neo-inset text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-[#70e9ff]'
                  }`}
                >
                  {room}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerateRender}
            className="w-full py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 dark:bg-[#70e9ff] dark:hover:bg-[#56e2ff] text-white dark:text-[#070d1e] font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 disabled:opacity-50 transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generando Render Arquitectónico 8K...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generar Vista Previa con IA</span>
              </>
            )}
          </button>

          {selectedProduct && (
            <div className="neo-inset p-4 rounded-2xl space-y-2 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {selectedProduct.name}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-600 dark:text-[#70e9ff]">
                  ${selectedProduct.price.toLocaleString()} MXN
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                {selectedProduct.description}
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onAddToCart(selectedProduct.id)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Añadir al Carrito
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Display / Preview Column */}
        <div className="lg:col-span-7">
          <div className="neo-inset p-4 rounded-[28px] border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-cyan-600 dark:text-[#70e9ff]" />
                Visualizador IA · {selectedRoom}
              </span>
              {generatedImageUrl && (
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Render 8K Listo
                </span>
              )}
            </div>

            <div className="relative w-full h-[380px] rounded-[20px] overflow-hidden bg-slate-900 flex items-center justify-center shadow-inner">
              {isGenerating ? (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin flex items-center justify-center" />
                  <p className="text-sm font-bold text-white">Sintetizando arquitectura de interiores...</p>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Aplicando texturas neomórficas, iluminación circadiana y optimización para {selectedRoom}.
                  </p>
                </div>
              ) : generatedImageUrl ? (
                <img
                  src={generatedImageUrl}
                  alt="Render IA Habitación"
                  className="w-full h-full object-cover rounded-[20px]"
                />
              ) : (
                <div className="text-center p-6 space-y-3">
                  <div className="w-14 h-14 rounded-2xl neo-inset mx-auto flex items-center justify-center text-cyan-500">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Listo para generar tu espacio</h4>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Selecciona un dispositivo y una habitación, luego haz clic en "Generar Vista Previa con IA" para visualizar el resultado.
                  </p>
                </div>
              )}
            </div>

            {promptUsed && (
              <div className="p-3 rounded-xl neo-surface text-[11px] font-mono text-slate-500 dark:text-slate-400 space-y-1">
                <p className="font-bold text-slate-700 dark:text-slate-300">Prompt Contextual IA:</p>
                <p className="italic">{promptUsed}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

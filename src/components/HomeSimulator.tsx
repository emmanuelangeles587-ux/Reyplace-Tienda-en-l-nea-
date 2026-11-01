import React, { useState } from 'react';
import {
  Home,
  Building2,
  Briefcase,
  Plus,
  Trash2,
  Bookmark,
  ShoppingBag,
  Mic,
  Check,
} from 'lucide-react';
import { Product } from '../data/products';

type PropertyType = 'Apartamento Urbano' | 'Residencia Amplia' | 'Oficina Ejecutiva';
type RoomType = 'Sala Principal' | 'Recámara Master' | 'Acceso & Fachada' | 'Cocina Gourmet';

interface PlacedDevice {
  uid: string;
  productId: string;
  room: RoomType;
  xPct: number;
  yPct: number;
}

interface SavedScenario {
  id: string;
  name: string;
  property: PropertyType;
  devices: PlacedDevice[];
}

interface HomeSimulatorProps {
  products: Product[];
  onAddScenarioToCart: (productIds: string[]) => void;
  onScenarioInteraction: (productId: string) => void;
}

const PROPERTY_PRESETS: Record<PropertyType, { area: string; note: string }> = {
  'Apartamento Urbano': {
    area: '95 m² · 1 nodo Matter recomendado',
    note: 'Prioriza cerradura biométrica sin llaves, iluminación circadiana y radar mmWave.',
  },
  'Residencia Amplia': {
    area: '380 m² · Red Wi-Fi 7 Mesh recomendada',
    note: 'Cobertura perimetral 4K en fachada, cerradura Quantum 3D y automatización multizona.',
  },
  'Oficina Ejecutiva': {
    area: '160 m² · VLAN aislada para accesos',
    note: 'Control de asistencia biométrico, videovigilancia continua y ahorro en climatización.',
  },
};

const ROOMS: RoomType[] = [
  'Sala Principal',
  'Recámara Master',
  'Acceso & Fachada',
  'Cocina Gourmet',
];

export const HomeSimulator: React.FC<HomeSimulatorProps> = ({
  products,
  onAddScenarioToCart,
  onScenarioInteraction,
}) => {
  const [property, setProperty] = useState<PropertyType>('Residencia Amplia');
  const [activeRoom, setActiveRoom] = useState<RoomType>('Sala Principal');
  const [placedDevices, setPlacedDevices] = useState<PlacedDevice[]>([
    {
      uid: 'init-1',
      productId: 'hub-matter',
      room: 'Sala Principal',
      xPct: 48,
      yPct: 52,
    },
    {
      uid: 'init-2',
      productId: 'bulb-rgb',
      room: 'Sala Principal',
      xPct: 26,
      yPct: 34,
    },
    {
      uid: 'init-3',
      productId: 'lock-quantum',
      room: 'Acceso & Fachada',
      xPct: 68,
      yPct: 45,
    },
  ]);

  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [activeRoutine, setActiveRoutine] = useState<string | null>(null);

  const addDeviceToRoom = (productId: string, xPct?: number, yPct?: number) => {
    const offset = (placedDevices.length * 13) % 55;
    const nextItem: PlacedDevice = {
      uid: `${productId}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      productId,
      room: activeRoom,
      xPct: xPct ?? 22 + offset,
      yPct: yPct ?? 28 + ((placedDevices.length * 17) % 46),
    };
    setPlacedDevices((prev) => [...prev, nextItem]);
    onScenarioInteraction(productId);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const productId = e.dataTransfer.getData('productId');
    if (!productId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = Math.min(86, Math.max(12, ((e.clientX - rect.left) / rect.width) * 100));
    const relY = Math.min(82, Math.max(16, ((e.clientY - rect.top) / rect.height) * 100));
    addDeviceToRoom(productId, Math.round(relX), Math.round(relY));
  };

  const removePlaced = (uid: string) => {
    setPlacedDevices((prev) => prev.filter((d) => d.uid !== uid));
  };

  const saveCurrentScenario = () => {
    if (placedDevices.length === 0) return;
    const nextScenario: SavedScenario = {
      id: `scn-${Date.now()}`,
      name: `${property} (${placedDevices.length} equipos)`,
      property,
      devices: [...placedDevices],
    };
    setSavedScenarios((prev) => [nextScenario, ...prev.slice(0, 3)]);
  };

  const roomDevices = placedDevices.filter((d) => d.room === activeRoom);
  const scenarioTotalPrice = placedDevices.reduce((sum, item) => {
    const p = products.find((prod) => prod.id === item.productId);
    return sum + (p ? p.price : 0);
  }, 0);
  const scenarioMonthlyKwh = placedDevices.reduce((sum, item) => {
    const p = products.find((prod) => prod.id === item.productId);
    return sum + (p ? p.monthlyKwhSaved : 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Top Scenario Header & Property Selector */}
      <div className="neo-surface rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-cyan-700 dark:text-[#70e9ff]">
              Arquitecto de Espacios Matter
            </p>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              Simulador Interactivo de Hogar Inteligente
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Elige tu tipo de propiedad, arrastra o añade dispositivos por habitación y ejecuta rutinas Google Home y Alexa.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                { label: 'Apartamento Urbano', icon: Building2 },
                { label: 'Residencia Amplia', icon: Home },
                { label: 'Oficina Ejecutiva', icon: Briefcase },
              ] as const
            ).map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => setProperty(label)}
                className={`px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-colors ${
                  property === label
                    ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                    : 'neo-inset text-slate-700 dark:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="neo-inset rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="text-slate-700 dark:text-slate-300">
            <strong>{property}:</strong> {PROPERTY_PRESETS[property].note}
          </span>
          <span className="font-mono-num text-cyan-700 dark:text-[#70e9ff] shrink-0">
            {PROPERTY_PRESETS[property].area}
          </span>
        </div>
      </div>

      {/* Main Drag & Drop Canvas + Catalog Tray */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Draggable Equipment Tray (4 cols) */}
        <div className="lg:col-span-4 neo-surface rounded-[28px] p-5 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Equipos Disponibles
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Arrastra al plano o pulsa + para colocar en {activeRoom}.
            </p>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {products.map((prod) => (
              <div
                key={prod.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('productId', prod.id);
                }}
                className="neo-inset rounded-2xl p-3 flex items-center gap-3 cursor-grab active:cursor-grabbing hover:border-cyan-500/50 border border-transparent transition-all"
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-11 h-11 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {prod.name}
                  </p>
                  <p className="text-[11px] font-mono-num text-slate-500 dark:text-slate-400">
                    ${prod.price.toLocaleString()} MXN · -{prod.monthlyKwhSaved} kWh/mes
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addDeviceToRoom(prod.id)}
                  aria-label={`Añadir ${prod.name} a ${activeRoom}`}
                  className="w-8 h-8 rounded-xl bg-cyan-600/15 text-cyan-700 dark:text-[#70e9ff] hover:bg-cyan-600 hover:text-white dark:hover:bg-[#70e9ff] dark:hover:text-[#070d1e] flex items-center justify-center transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Blueprint Stage & Routines (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="neo-surface rounded-[28px] p-5 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            {/* Room Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {ROOMS.map((room) => {
                  const countInRoom = placedDevices.filter((d) => d.room === room).length;
                  return (
                    <button
                      key={room}
                      type="button"
                      onClick={() => setActiveRoom(room)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        activeRoom === room
                          ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                          : 'neo-inset text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {room} ({countInRoom})
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={saveCurrentScenario}
                className="text-xs font-semibold text-cyan-700 dark:text-[#70e9ff] hover:underline flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5" /> Guardar Escenario
              </button>
            </div>

            {/* Architectural Drop Canvas */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="relative h-80 rounded-2xl neo-inset border border-dashed border-cyan-600/40 dark:border-[#70e9ff]/35 overflow-hidden select-none"
            >
              {/* Subtle Architectural Floorplan Grid Lines */}
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(100,116,139,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(100,116,139,0.25) 1px, transparent 1px)',
                  backgroundSize: '36px 36px',
                }}
              />

              <div className="absolute top-3 left-4 text-xs text-slate-500 dark:text-slate-400">
                Plano Activo: <strong className="text-slate-900 dark:text-white">{activeRoom}</strong>
              </div>

              {roomDevices.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center pointer-events-none">
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                    Arrastra cámaras, sensores o iluminación aquí, o usa el botón + de la lista izquierda para integrarlos en {activeRoom}.
                  </p>
                </div>
              )}

              {roomDevices.map((placed) => {
                const prod = products.find((p) => p.id === placed.productId);
                if (!prod) return null;
                return (
                  <div
                    key={placed.uid}
                    style={{ left: `${placed.xPct}%`, top: `${placed.yPct}%` }}
                    className="-translate-x-1/2 -translate-y-1/2 absolute neo-surface rounded-2xl px-3 py-2 border border-cyan-500/50 flex items-center gap-2.5 shadow-lg"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-8 h-8 rounded-lg object-cover shrink-0"
                    />
                    <div className="max-w-[130px]">
                      <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                        {prod.name}
                      </p>
                      <p className="text-[10px] text-cyan-700 dark:text-[#70e9ff]">
                        {activeRoutine ? `Rutina: ${activeRoutine}` : 'Enlazado Matter'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePlaced(placed.uid)}
                      aria-label={`Quitar ${prod.name}`}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Google Home & Alexa Routine Triggers */}
            <div className="pt-1 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-cyan-600 dark:text-[#70e9ff]" />
                  Probar Rutina Automatizada (Google Home / Alexa)
                </span>
                {activeRoutine && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Escena «{activeRoutine}» activa
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    name: 'Llegada Segura',
                    detail: 'Desbloquea Quantum 3D y enciende luz cálida al 70%',
                  },
                  {
                    name: 'Noche Blindada',
                    detail: 'Arma domos 4K, cierra accesos y apaga luminarias',
                  },
                  {
                    name: 'Modo Eco Ausente',
                    detail: 'Activa radares mmWave y reduce consumo climático',
                  },
                ].map((rt) => (
                  <button
                    key={rt.name}
                    type="button"
                    onClick={() => setActiveRoutine(rt.name)}
                    className={`text-left p-3 rounded-2xl text-xs transition-all border ${
                      activeRoutine === rt.name
                        ? 'border-cyan-500/70 bg-cyan-500/10'
                        : 'border-transparent neo-inset'
                    }`}
                  >
                    <p className="font-bold text-slate-900 dark:text-white">{rt.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {rt.detail}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Scenario Summary & Add All to Cart */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs space-y-0.5">
                <p className="text-slate-500 dark:text-slate-400">
                  Total proyecto ({placedDevices.length} equipos):{' '}
                  <strong className="font-mono-num text-base text-slate-900 dark:text-white">
                    ${scenarioTotalPrice.toLocaleString()} MXN
                  </strong>
                </p>
                <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Beneficio estimado: -{scenarioMonthlyKwh} kWh/mes de ahorro energético integrado
                </p>
              </div>

              <button
                type="button"
                disabled={placedDevices.length === 0}
                onClick={() =>
                  onAddScenarioToCart(placedDevices.map((d) => d.productId))
                }
                className="px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 dark:bg-[#70e9ff] dark:hover:bg-[#56e2ff] text-white dark:text-[#070d1e] font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-45 transition-colors shrink-0"
              >
                <ShoppingBag className="w-4 h-4" /> Añadir Escenario al Carrito
              </button>
            </div>
          </div>

          {/* Saved Scenarios List */}
          {savedScenarios.length > 0 && (
            <div className="neo-surface rounded-[24px] p-4 border border-slate-200/80 dark:border-slate-800/80 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Escenarios Guardados
              </h4>
              <div className="flex flex-wrap gap-2">
                {savedScenarios.map((scn) => (
                  <button
                    key={scn.id}
                    type="button"
                    onClick={() => {
                      setProperty(scn.property);
                      setPlacedDevices(scn.devices);
                    }}
                    className="neo-inset px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-[#70e9ff]"
                  >
                    Restaurar: {scn.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

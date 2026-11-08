import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Building2,
  Briefcase,
  Plus,
  Trash2,
  Bookmark,
  ShoppingBag,
  Check,
  Share2,
  Save,
  Sliders,
  Sparkles,
  Zap,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Thermometer,
  Video,
  Lock,
  Unlock,
  Radio,
  Wifi,
  Cpu,
  Layers,
  Copy,
  FolderOpen,
  Film,
  Sun,
  Moon,
  Wind,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { Product, ProtocolType } from '../data/products';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';

export type PropertyType = 'Apartamento Urbano' | 'Residencia Amplia' | 'Penthouse Ejecutivo';
export type RoomType =
  | 'Sala Principal'
  | 'Recámara Master'
  | 'Cocina Gourmet'
  | 'Acceso & Fachada'
  | 'Jardín & Terraza'
  | 'Estudio & Home Office'
  | 'Cine & Entretenimiento';

export interface ConfiguredDevice {
  uid: string;
  productId: string;
  room: RoomType;
  xPct: number;
  yPct: number;
  isOn?: boolean;
  isLocked?: boolean;
  temp?: number;
  color?: string;
}

export interface SavedConfiguration {
  id: string;
  name: string;
  property: PropertyType;
  devices: ConfiguredDevice[];
  createdAt: string;
  shareCode: string;
}

interface HomeSimulatorProps {
  products: Product[];
  onAddScenarioToCart: (productIds: string[]) => void;
  onScenarioInteraction: (productId: string) => void;
}

const PROPERTY_PRESETS: Record<PropertyType, { area: string; icon: any; note: string }> = {
  'Apartamento Urbano': {
    area: '95 m² · 1 nodo Matter recomendado',
    icon: Home,
    note: 'Prioriza cerradura biométrica sin llaves, iluminación circadiana y radar mmWave.',
  },
  'Residencia Amplia': {
    area: '380 m² · Red Wi-Fi 7 Mesh recomendada',
    icon: Building2,
    note: 'Cobertura perimetral 4K en fachada, cerradura Quantum 3D y automatización multizona.',
  },
  'Penthouse Ejecutivo': {
    area: '220 m² · VLAN aislada y control de climatización',
    icon: Briefcase,
    note: 'Control biométrico en accesos, videovigilancia continua y ahorro térmico inteligente.',
  },
};

const ROOMS: { type: RoomType; label: string; defaultColor: string }[] = [
  { type: 'Sala Principal', label: 'Sala Principal', defaultColor: '#10b981' },
  { type: 'Recámara Master', label: 'Recámara Master', defaultColor: '#6366f1' },
  { type: 'Cocina Gourmet', label: 'Cocina Gourmet', defaultColor: '#f59e0b' },
  { type: 'Acceso & Fachada', label: 'Acceso & Fachada', defaultColor: '#06b6d4' },
  { type: 'Jardín & Terraza', label: 'Jardín & Terraza', defaultColor: '#14b8a6' },
  { type: 'Estudio & Home Office', label: 'Home Office', defaultColor: '#8b5cf6' },
  { type: 'Cine & Entretenimiento', label: 'Cine Privado', defaultColor: '#ec4899' },
];

export const HomeSimulator: React.FC<HomeSimulatorProps> = ({
  products,
  onAddScenarioToCart,
  onScenarioInteraction,
}) => {
  const [property, setProperty] = useState<PropertyType>('Residencia Amplia');
  const [activeRoom, setActiveRoom] = useState<RoomType>('Sala Principal');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedScene, setSelectedScene] = useState<string | null>(null);

  // Placed devices
  const [placedDevices, setPlacedDevices] = useState<ConfiguredDevice[]>([
    {
      uid: 'init-1',
      productId: 'hub-matter',
      room: 'Sala Principal',
      xPct: 50,
      yPct: 45,
      isOn: true,
    },
    {
      uid: 'init-2',
      productId: 'bulb-rgb',
      room: 'Sala Principal',
      xPct: 28,
      yPct: 30,
      isOn: true,
      color: '#70e9ff',
    },
    {
      uid: 'init-3',
      productId: 'lock-quantum',
      room: 'Acceso & Fachada',
      xPct: 65,
      yPct: 50,
      isLocked: true,
    },
    {
      uid: 'init-4',
      productId: 'thermostat-matter',
      room: 'Sala Principal',
      xPct: 75,
      yPct: 32,
      isOn: true,
      temp: 22,
    },
  ]);

  // Saved configurations
  const [savedConfigs, setSavedConfigs] = useState<SavedConfiguration[]>([
    {
      id: 'cfg-default-1',
      name: 'Residencia Smart Sinaloa VIP',
      property: 'Residencia Amplia',
      devices: [
        { uid: 'd1', productId: 'hub-matter', room: 'Sala Principal', xPct: 50, yPct: 45, isOn: true },
        { uid: 'd2', productId: 'lock-quantum', room: 'Acceso & Fachada', xPct: 65, yPct: 50, isLocked: true },
        { uid: 'd3', productId: 'camera-ptz', room: 'Acceso & Fachada', xPct: 35, yPct: 25, isOn: true },
        { uid: 'd4', productId: 'bulb-rgb', room: 'Sala Principal', xPct: 30, yPct: 35, isOn: true },
      ],
      createdAt: 'Ayer',
      shareCode: 'REY-HOME-7842',
    },
  ]);

  const [configNameInput, setConfigNameInput] = useState<string>('');
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [shareConfigCode, setShareConfigCode] = useState<string>('REY-HOME-7842');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Add device
  const addDeviceToRoom = (productId: string, xPct?: number, yPct?: number) => {
    const offset = (placedDevices.length * 15) % 50;
    const nextItem: ConfiguredDevice = {
      uid: `${productId}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      productId,
      room: activeRoom,
      xPct: xPct ?? 30 + offset,
      yPct: yPct ?? 35 + ((placedDevices.length * 12) % 40),
      isOn: true,
      isLocked: true,
      temp: 23,
      color: '#70e9ff',
    };
    setPlacedDevices((prev) => [...prev, nextItem]);
    onScenarioInteraction(productId);
    showToast('Dispositivo añadido a la habitación.');
  };

  const removeDevice = (uid: string) => {
    setPlacedDevices((prev) => prev.filter((d) => d.uid !== uid));
  };

  const toggleDeviceState = (uid: string, field: 'isOn' | 'isLocked') => {
    setPlacedDevices((prev) =>
      prev.map((d) => (d.uid === uid ? { ...d, [field]: !d[field] } : d))
    );
  };

  const setDeviceTemp = (uid: string, tempDelta: number) => {
    setPlacedDevices((prev) =>
      prev.map((d) =>
        d.uid === uid ? { ...d, temp: Math.min(28, Math.max(18, (d.temp || 22) + tempDelta)) } : d
      )
    );
  };

  // Scene presets
  const applyScene = (sceneName: string) => {
    setSelectedScene(sceneName);
    if (sceneName === 'cine') {
      setPlacedDevices((prev) =>
        prev.map((d) => {
          if (d.productId === 'bulb-rgb') return { ...d, isOn: true, color: '#f59e0b' };
          if (d.productId === 'lock-quantum') return { ...d, isLocked: true };
          if (d.productId === 'thermostat-matter') return { ...d, temp: 21, isOn: true };
          return d;
        })
      );
      showToast('Escena Noche de Cine activada: Iluminación cálida tenue, clima 21°C y cerrojos blindados.');
    } else if (sceneName === 'seguridad') {
      setPlacedDevices((prev) =>
        prev.map((d) => {
          if (d.productId === 'lock-quantum') return { ...d, isLocked: true };
          if (d.productId === 'camera-ptz') return { ...d, isOn: true };
          if (d.productId === 'bulb-rgb') return { ...d, isOn: false };
          return d;
        })
      );
      showToast('Escena Seguridad Perimetral: Cámaras armadas y todos los accesos bloqueados.');
    } else if (sceneName === 'eco') {
      setPlacedDevices((prev) =>
        prev.map((d) => {
          if (d.productId === 'thermostat-matter') return { ...d, temp: 25 };
          if (d.productId === 'bulb-rgb') return { ...d, isOn: false };
          return d;
        })
      );
      showToast('Modo Ahorro Energético Eco: Climatización a 25°C y luces apagadas.');
    } else if (sceneName === 'confort') {
      setPlacedDevices((prev) =>
        prev.map((d) => {
          if (d.productId === 'bulb-rgb') return { ...d, isOn: true, color: '#70e9ff' };
          if (d.productId === 'thermostat-matter') return { ...d, temp: 23, isOn: true };
          return d;
        })
      );
      showToast('Modo Confort Circadiano: Iluminación 5000K y clima a 23°C.');
    }
  };

  // Compatibility & Recommendation Analysis
  const currentRoomDevices = placedDevices.filter((d) => d.room === activeRoom);
  const allPlacedProductIds = Array.from(new Set(placedDevices.map((d) => d.productId)));
  const allPlacedProducts = allPlacedProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  // Protocols detected in the overall home
  const detectedProtocols = Array.from(
    new Set(allPlacedProducts.flatMap((p) => p.compatibility))
  );

  const hasMatterHub = placedDevices.some((d) => d.productId === 'hub-matter');
  const hasZigbeeDevice = allPlacedProducts.some((p) => p.compatibility.includes('Zigbee'));
  const cameraCount = placedDevices.filter((d) => d.productId === 'camera-ptz').length;
  const hasWifiMesh = placedDevices.some((d) => d.productId === 'wifi7-mesh');
  const hasLock = placedDevices.some((d) => d.productId === 'lock-quantum');
  const hasSensor = placedDevices.some((d) => d.productId === 'sensor-iot');
  const hasThermostat = placedDevices.some((d) => d.productId === 'thermostat-matter');

  const compatibilityIssues: {
    type: 'warning' | 'recommendation' | 'success';
    title: string;
    description: string;
    actionProduct?: string;
    actionLabel?: string;
  }[] = [];

  if (hasZigbeeDevice && !hasMatterHub) {
    compatibilityIssues.push({
      type: 'warning',
      title: 'Falta Hub Coordinador Zigbee/Thread',
      description:
        'Tienes dispositivos Zigbee y Thread seleccionados pero ningún coordinador central. Añade el Hub Neural Matter para enlazarlos localmente sin internet.',
      actionProduct: 'hub-matter',
      actionLabel: 'Añadir Hub Neural (+ $1,899 MXN)',
    });
  }

  if (cameraCount >= 2 && !hasWifiMesh) {
    compatibilityIssues.push({
      type: 'recommendation',
      title: 'Demanda de Ancho de Banda 4K Detectada',
      description:
        `Tienes ${cameraCount} cámaras PTZ 4K. Para evitar congestión en el router residencial de tu proveedor, se recomienda la torre Wi-Fi 7 Mesh Tri-Band.`,
      actionProduct: 'wifi7-mesh',
      actionLabel: 'Añadir Wi-Fi 7 Mesh (+ $6,499 MXN)',
    });
  }

  if (hasLock && !hasSensor) {
    compatibilityIssues.push({
      type: 'recommendation',
      title: 'Automatización de Acceso Inteligente',
      description:
        'Combina tu Cerradura Quantum 3D con el Kit de Sensores mmWave para activar rebloqueo automático y encendido de bienvenida.',
      actionProduct: 'sensor-iot',
      actionLabel: 'Añadir Sensores mmWave (+ $1,099 MXN)',
    });
  }

  if (!hasThermostat && (activeRoom === 'Sala Principal' || activeRoom === 'Recámara Master')) {
    compatibilityIssues.push({
      type: 'recommendation',
      title: 'Climatización Inverter Sugerida',
      description:
        'La habitación no cuenta con termostato inteligente. Agrega el Termostato Ecobee Pro Matter para ahorrar hasta 26% de energía.',
      actionProduct: 'thermostat-matter',
      actionLabel: 'Añadir Termostato Matter (+ $3,499 MXN)',
    });
  }

  if (hasMatterHub && hasLock && hasThermostat) {
    compatibilityIssues.push({
      type: 'success',
      title: 'Ecosistema Matter Certificado y Balanceado',
      description:
        'Tu configuración cuenta con Thread Border Router, seguridad biométrica y control de clima local. Excelente interoperabilidad.',
    });
  }

  // Price & energy metrics
  const scenarioTotalPrice = placedDevices.reduce((sum, item) => {
    const p = products.find((prod) => prod.id === item.productId);
    return sum + (p ? p.price : 0);
  }, 0);

  const scenarioMonthlyKwh = placedDevices.reduce((sum, item) => {
    const p = products.find((prod) => prod.id === item.productId);
    return sum + (p ? p.monthlyKwhSaved : 0);
  }, 0);

  const bundleDiscountPrice = Math.round(scenarioTotalPrice * 0.9); // 10% Bundle discount

  // Save current design
  const handleSaveConfig = async () => {
    const name = configNameInput.trim() || `${property} - ${activeRoom} (${placedDevices.length} equipos)`;
    const newShareCode = `REY-HOME-${Math.floor(1000 + Math.random() * 9000)}`;
    const newConfig: SavedConfiguration = {
      id: `cfg-${Date.now()}`,
      name,
      property,
      devices: [...placedDevices],
      createdAt: 'Justo ahora',
      shareCode: newShareCode,
    };

    setSavedConfigs((prev) => [newConfig, ...prev]);
    setShowSaveModal(false);
    setConfigNameInput('');
    showToast(`¡Configuración "${name}" guardada con éxito!`);

    // Optional Firestore persist
    if (auth.currentUser) {
      try {
        await addDoc(collection(db, 'users', auth.currentUser.uid, 'configurations'), {
          ...newConfig,
          userId: auth.currentUser.uid,
        });
      } catch (err) {
        console.warn('Config saved locally:', err);
      }
    }
  };

  const handleShareClick = () => {
    const code = `REY-HOME-${Math.floor(1000 + Math.random() * 9000)}`;
    setShareConfigCode(code);
    setShowShareModal(true);
  };

  const handleCopyShare = () => {
    const url = `https://reyplace.mx/configurador?share=${shareConfigCode}`;
    navigator.clipboard?.writeText(url);
    setCopiedCode(true);
    showToast('Enlace de configuración copiado al portapapeles.');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAddAllToCart = () => {
    const ids = placedDevices.map((d) => d.productId);
    if (ids.length === 0) {
      showToast('Agrega dispositivos a la habitación antes de comprar.');
      return;
    }
    onAddScenarioToCart(ids);
    showToast(`¡Paquete de ${ids.length} equipos añadido al carrito con 10% de descuento bundle!`);
  };

  // Filter products to add
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-slate-900 text-white font-semibold text-sm shadow-2xl flex items-center gap-2 border border-cyan-400/50 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header & Property Selector */}
      <div className="neo-surface rounded-[32px] p-6 md:p-8 border border-slate-200/80 dark:border-slate-800/80 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-[#70e9ff] border border-cyan-500/20 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> ARQUITECTO VIRTUAL MATTER & THREAD
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Diseño Interactivo de Espacios
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              Configurador Interactivo de Hogar Inteligente
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Selecciona habitaciones, añade y opera dispositivos en tiempo real, verifica compatibilidad multiprotocolo y exporta tu paquete con descuento de bundle.
            </p>
          </div>

          {/* Action Buttons: Save & Share */}
          <div className="flex items-center gap-2.5 self-start md:self-center">
            <button
              type="button"
              onClick={() => setShowSaveModal(true)}
              className="px-4 py-2.5 rounded-2xl neo-inset font-bold text-xs flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:border-cyan-500/50 transition-colors"
            >
              <Save className="w-4 h-4 text-cyan-500" />
              <span>Guardar Diseño</span>
            </button>
            <button
              type="button"
              onClick={handleShareClick}
              className="px-4 py-2.5 rounded-2xl neo-inset font-bold text-xs flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:border-cyan-500/50 transition-colors"
            >
              <Share2 className="w-4 h-4 text-amber-500" />
              <span>Compartir</span>
            </button>
          </div>
        </div>

        {/* Property Type Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {(Object.keys(PROPERTY_PRESETS) as PropertyType[]).map((propKey) => {
            const preset = PROPERTY_PRESETS[propKey];
            const Icon = preset.icon;
            const isSelected = property === propKey;
            return (
              <button
                key={propKey}
                type="button"
                onClick={() => setProperty(propKey)}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-500/5 dark:bg-cyan-500/10 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-cyan-600 text-white dark:bg-[#70e9ff] dark:text-[#070d1e]'
                        : 'neo-inset text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{propKey}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{preset.area}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Room Tabs & Scene Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Room Selector Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {ROOMS.map((r) => {
            const isSelected = activeRoom === r.type;
            const countInRoom = placedDevices.filter((d) => d.room === r.type).length;
            return (
              <button
                key={r.type}
                type="button"
                onClick={() => setActiveRoom(r.type)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-105'
                    : 'neo-surface border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <span>{r.label}</span>
                {countInRoom > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono-num ${
                      isSelected
                        ? 'bg-cyan-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {countInRoom}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Scene Presets */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden xl:inline">
            Escenas Rápidas:
          </span>
          {[
            { id: 'cine', label: 'Cine', icon: Film },
            { id: 'seguridad', label: 'Seguridad', icon: ShieldCheck },
            { id: 'eco', label: 'Eco', icon: Sun },
            { id: 'confort', label: 'Confort', icon: Wind },
          ].map((scene) => {
            const Icon = scene.icon;
            const isActive = selectedScene === scene.id;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => applyScene(scene.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? 'bg-amber-400 text-slate-900 font-extrabold'
                    : 'neo-inset text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{scene.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage: Floorplan Canvas + Devices Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Room Floorplan Canvas (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="neo-surface rounded-[32px] border border-slate-200/90 dark:border-slate-800/90 p-6 relative overflow-hidden bg-slate-950 text-white min-h-[460px] flex flex-col justify-between shadow-2xl">
            {/* Ambient dynamic room glow based on light settings */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-700 opacity-40 blur-3xl"
              style={{
                background: currentRoomDevices.some((d) => d.productId === 'bulb-rgb' && d.isOn)
                  ? 'radial-gradient(circle at 40% 40%, rgba(112, 233, 255, 0.45), transparent 70%)'
                  : 'radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.8), transparent 70%)',
              }}
            />

            {/* Canvas Header Bar */}
            <div className="relative flex items-center justify-between pb-4 border-b border-white/10 z-10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {activeRoom} · Plano Interactivo
                  </h3>
                  <p className="text-xs text-slate-400">
                    {currentRoomDevices.length} equipos activos en este espacio
                  </p>
                </div>
              </div>

              {/* Room Live Metrics */}
              <div className="flex items-center gap-4 text-xs">
                {currentRoomDevices.some((d) => d.productId === 'thermostat-matter') && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-cyan-300 font-mono font-bold">
                    <Thermometer className="w-3.5 h-3.5" />
                    {currentRoomDevices.find((d) => d.productId === 'thermostat-matter')?.temp || 22}°C
                  </span>
                )}
                {currentRoomDevices.some((d) => d.productId === 'lock-quantum') && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-amber-300 font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    {currentRoomDevices.find((d) => d.productId === 'lock-quantum')?.isLocked
                      ? 'Cerrojo Activo'
                      : 'Abierto'}
                  </span>
                )}
              </div>
            </div>

            {/* Room Blueprint Visual Canvas Area */}
            <div className="relative flex-1 w-full min-h-[320px] rounded-2xl border border-white/10 bg-slate-900/60 p-4 overflow-hidden z-10">
              {/* Architectural Grid & Dimension Lines */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, #70e9ff 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
                  backgroundSize: '24px 24px, 48px 48px, 48px 48px',
                }}
              />

              {/* Room Boundary Walls Representation */}
              <div className="absolute inset-4 border-2 border-dashed border-white/20 rounded-xl pointer-events-none flex items-center justify-center">
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-600 select-none">
                  ZONA DE COBERTURA · {activeRoom.toUpperCase()}
                </span>
              </div>

              {/* Empty State in Room */}
              {currentRoomDevices.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3 z-0">
                  <div className="w-12 h-12 rounded-2xl neo-inset flex items-center justify-center text-slate-500">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-300">Esta habitación está vacía</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      Selecciona cualquier dispositivo del panel derecho para añadirlo a {activeRoom}.
                    </p>
                  </div>
                </div>
              )}

              {/* Placed Interactive Devices */}
              {currentRoomDevices.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;

                const isBulb = product.id === 'bulb-rgb';
                const isLock = product.id === 'lock-quantum';
                const isCam = product.id === 'camera-ptz';
                const isThermostat = product.id === 'thermostat-matter';
                const isHub = product.id === 'hub-matter';

                return (
                  <motion.div
                    key={item.uid}
                    layout
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    style={{
                      left: `${item.xPct}%`,
                      top: `${item.yPct}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="absolute z-20 group"
                  >
                    {/* Device Node Icon & Interaction */}
                    <div
                      className={`relative p-2.5 rounded-2xl backdrop-blur-md border shadow-xl flex items-center gap-2 transition-all cursor-pointer ${
                        item.isOn || item.isLocked
                          ? 'bg-slate-900/90 border-cyan-400 text-cyan-300 shadow-cyan-500/20'
                          : 'bg-slate-900/70 border-white/20 text-slate-400'
                      }`}
                    >
                      {/* Active Cone for Cameras */}
                      {isCam && item.isOn && (
                        <div className="absolute -bottom-12 -left-6 w-24 h-16 bg-cyan-400/15 border-b-2 border-cyan-400/40 rounded-b-full pointer-events-none animate-pulse" />
                      )}

                      {/* Icon */}
                      {isBulb && <Lightbulb className={`w-5 h-5 ${item.isOn ? 'text-amber-400' : ''}`} />}
                      {isLock && (
                        item.isLocked ? (
                          <Lock className="w-5 h-5 text-amber-400" />
                        ) : (
                          <Unlock className="w-5 h-5 text-emerald-400" />
                        )
                      )}
                      {isCam && <Video className="w-5 h-5 text-cyan-400" />}
                      {isThermostat && <Thermometer className="w-5 h-5 text-rose-400" />}
                      {isHub && <Radio className="w-5 h-5 text-[#70e9ff] animate-spin-slow" />}
                      {!isBulb && !isLock && !isCam && !isThermostat && !isHub && (
                        <Cpu className="w-5 h-5 text-indigo-400" />
                      )}

                      <div className="hidden sm:block text-left min-w-0 pr-1">
                        <p className="text-[11px] font-bold text-white truncate max-w-[110px]">
                          {product.name}
                        </p>
                        <p className="text-[9px] text-slate-400 truncate">
                          {isLock
                            ? item.isLocked
                              ? 'Bloqueada'
                              : 'Abierta'
                            : isThermostat
                            ? `${item.temp || 22}°C Inverter`
                            : item.isOn
                            ? 'Encendido'
                            : 'Inactivo'}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDevice(item.uid);
                        }}
                        className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Eliminar de la habitación"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Quick Control Floating Bubble on Hover / Click */}
                    <div className="mt-2 hidden group-hover:flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-950/90 border border-white/20 shadow-lg text-[10px]">
                      {isBulb && (
                        <button
                          type="button"
                          onClick={() => toggleDeviceState(item.uid, 'isOn')}
                          className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold"
                        >
                          {item.isOn ? 'Apagar' : 'Encender'}
                        </button>
                      )}
                      {isLock && (
                        <button
                          type="button"
                          onClick={() => toggleDeviceState(item.uid, 'isLocked')}
                          className="px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold"
                        >
                          {item.isLocked ? 'Abrir' : 'Bloquear'}
                        </button>
                      )}
                      {isThermostat && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setDeviceTemp(item.uid, -1)}
                            className="w-4 h-4 rounded bg-slate-800 flex items-center justify-center font-bold"
                          >
                            -
                          </button>
                          <span>{item.temp || 22}°C</span>
                          <button
                            type="button"
                            onClick={() => setDeviceTemp(item.uid, 1)}
                            className="w-4 h-4 rounded bg-slate-800 flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>
                      )}
                      {isCam && (
                        <button
                          type="button"
                          onClick={() => toggleDeviceState(item.uid, 'isOn')}
                          className="px-2 py-0.5 rounded bg-cyan-600 text-white font-bold"
                        >
                          {item.isOn ? 'Pausar AI' : 'Vigilar'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Canvas Footer Summary Bar */}
            <div className="relative pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs z-10">
              <div className="flex items-center gap-4 text-slate-300">
                <span>Total en casa: <strong className="text-white">{placedDevices.length} equipos</strong></span>
                <span>Ahorro proyectado: <strong className="text-emerald-400">-{scenarioMonthlyKwh} kWh/mes</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 line-through">${scenarioTotalPrice.toLocaleString()} MXN</p>
                  <p className="text-sm font-extrabold text-cyan-400">${bundleDiscountPrice.toLocaleString()} MXN (Bundle -10%)</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddAllToCart}
                  className="px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-2 transition-all hover:scale-105"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Comprar Todo el Paquete</span>
                </button>
              </div>
            </div>
          </div>

          {/* Compatibility Engine & Recommendations Section */}
          <div className="neo-surface rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-[#70e9ff] flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Matriz de Compatibilidad & Sugerencias de Domótica
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Análisis en tiempo real de protocolos (Matter, Thread, Zigbee 3.0, Wi-Fi 6E/7)
                  </p>
                </div>
              </div>

              {/* Protocol Badges */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {detectedProtocols.map((proto) => (
                  <span
                    key={proto}
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {proto}
                  </span>
                ))}
              </div>
            </div>

            {/* Diagnostic Cards */}
            <div className="space-y-3">
              {compatibilityIssues.map((issue, idx) => {
                const isWarn = issue.type === 'warning';
                const isRec = issue.type === 'recommendation';
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isWarn
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
                        : isRec
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-900 dark:text-cyan-200'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isWarn ? (
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      ) : isRec ? (
                        <Sparkles className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <h5 className="text-xs font-bold">{issue.title}</h5>
                        <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{issue.description}</p>
                      </div>
                    </div>

                    {issue.actionProduct && (
                      <button
                        type="button"
                        onClick={() => addDeviceToRoom(issue.actionProduct!)}
                        className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:scale-105 transition-all whitespace-nowrap self-start sm:self-center shrink-0"
                      >
                        {issue.actionLabel}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Drawer: Device Catalog to Add (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="neo-surface rounded-[32px] p-5 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Catálogo de Accesorios</span>
                <span className="text-xs font-normal text-slate-500">Haz clic para colocar</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Destino: <strong className="text-cyan-600 dark:text-[#70e9ff]">{activeRoom}</strong>
              </p>
            </div>

            {/* Quick Category Filter */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'seguridad', label: 'Seguridad' },
                { id: 'automatización', label: 'Clima & Hub' },
                { id: 'smart home', label: 'Iluminación' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === c.id
                      ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                      : 'neo-inset text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Products List */}
            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredProducts.map((p) => {
                const isAlreadyInRoom = currentRoomDevices.some((d) => d.productId === p.id);
                return (
                  <div
                    key={p.id}
                    className="neo-inset rounded-2xl p-3 flex items-center justify-between gap-3 group hover:border-cyan-500/40 transition-all border border-transparent"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {p.name}
                      </p>
                      <p className="text-[11px] font-mono-num text-cyan-600 dark:text-[#70e9ff] font-semibold">
                        ${p.price.toLocaleString()} MXN
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {p.compatibility.slice(0, 2).map((proto) => (
                          <span
                            key={proto}
                            className="text-[9px] px-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          >
                            {proto}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => addDeviceToRoom(p.id)}
                      className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center hover:scale-110 transition-transform shrink-0"
                      title={`Añadir ${p.name} a ${activeRoom}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Saved Configurations List */}
          {savedConfigs.length > 0 && (
            <div className="neo-surface rounded-[28px] p-5 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-amber-500" /> Diseños Guardados
              </h4>
              <div className="space-y-2">
                {savedConfigs.map((cfg) => (
                  <div
                    key={cfg.id}
                    className="p-3 rounded-xl neo-inset flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white truncate max-w-[170px]">
                        {cfg.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {cfg.devices.length} dispositivos · {cfg.createdAt}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPlacedDevices(cfg.devices);
                        setProperty(cfg.property);
                        showToast(`Diseño "${cfg.name}" cargado en el simulador.`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-600 text-white font-bold text-[10px]"
                    >
                      Cargar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setShowSaveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="neo-surface p-6 rounded-[28px] max-w-md w-full space-y-4 border border-slate-700 bg-white dark:bg-[#070d1e]"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Guardar Configuración</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Guarda este plano con los {placedDevices.length} dispositivos para consultarlo después o compartirlo con tu arquitecto o instalador.
              </p>
              <input
                type="text"
                value={configNameInput}
                onChange={(e) => setConfigNameInput(e.target.value)}
                placeholder="Ej. Mi Residencia Matter en Los Mochis"
                className="w-full px-4 py-2.5 rounded-xl neo-inset text-xs bg-transparent border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 py-2.5 rounded-xl neo-inset text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-600 text-white text-xs font-bold"
                >
                  Guardar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="neo-surface p-6 rounded-[28px] max-w-md w-full space-y-4 border border-slate-700 bg-white dark:bg-[#070d1e] text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mx-auto">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Compartir Configuración</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cualquier persona con este enlace o código podrá ver y cotizar este diseño de hogar inteligente.
              </p>
              <div className="p-3 rounded-xl neo-inset flex items-center justify-between text-xs font-mono font-bold text-cyan-600 dark:text-[#70e9ff]">
                <span>{`https://reyplace.mx/configurador?share=${shareConfigCode}`}</span>
                <button
                  type="button"
                  onClick={handleCopyShare}
                  className="p-1.5 rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 ml-2"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold"
              >
                Cerrar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

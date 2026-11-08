/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from './context/AuthContext';
import { PermissionsProvider } from './context/PermissionsProvider';
import { motion, LayoutGroup } from 'motion/react';
import {
  ShoppingBag,
  Search,
  Wrench,
  Eye,
  Sun,
  Moon,
  X,
  Check,
  CreditCard,
  Cpu,
  AlertCircle,
  Send,
  Bot,
  ShieldCheck,
  Plus,
  Minus,
  Trash2,
  Scale,
  Crown,
  Sparkles,
  Mic,
  Lock,
  Unlock,
  Star,
} from 'lucide-react';
import {
  PRODUCTS,
  BRAND_EMBLEM,
  Product,
  MembershipTier,
} from './data/products';
import {
  formatCardNumber,
  formatExpiry,
  detectCardBrand,
  validateLuhn,
  validateCardFields,
  CardValidationErrors,
} from './utils/validation';
import { computeRecommendations } from './utils/recommendations';
import { useSecurityNotifications } from './hooks/useSecurityNotifications';
import { SmartFilters, FilterState } from './components/SmartFilters';
import { InstallGuideModal } from './components/InstallGuideModal';
import { CheckoutSummary } from './components/CheckoutSummary';
import { EnergyEfficiency } from './components/EnergyEfficiency';
import { SecurityDashboard, SmartSecurityState } from './components/SecurityDashboard';
import { LoyaltyDashboard } from './components/LoyaltyDashboard';
import { HomeSimulator } from './components/HomeSimulator';
import { NeomorphicComparisonTable } from './components/NeomorphicComparisonTable';
import { BiometricScanModal } from './components/BiometricScanModal';
import { RoutineBuilder } from './components/RoutineBuilder';
import { HeroSlideBar } from './components/HeroSlideBar';
import { ARViewerModal } from './components/ARViewerModal';
import { AirRoomPreview } from './components/AirRoomPreview';
import { EnergyHeatMap } from './components/EnergyHeatMap';
import { WeatherWidget } from './components/WeatherWidget';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { ARVideoReviewsModal, ARVideoReview } from './components/ARVideoReviewsModal';
import { ProductReviewsSystem } from './components/ProductReviewsSystem';
import { DynamicMetaTags } from './components/DynamicMetaTags';
import { SinaloaGeoWelcomeBanner } from './components/SinaloaGeoWelcomeBanner';
import { InstallPwaPrompt } from './components/InstallPwaPrompt';
import { ReyPassGateway } from './components/ReyPassGateway';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { saveCart, getCart } from './lib/firebase.ts';

type MainSection = 'catalogo' | 'simulador' | 'vip' | 'seguridad' | 'energia' | 'soporte';

export default function App() {
  // Dual-Theme State (Dark Luxury default, intuitive Light Neomorphic toggle)
  const [isDark, setIsDark] = useState<boolean>(true);
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Active Navigation View
  const [activeSection, setActiveSection] = useState<MainSection>('catalogo');
  const [simulatorSubTab, setSimulatorSubTab] = useState<
    'escenario' | 'rutinas' | 'render-ia'
  >('escenario');

  // Search & 3D Neomorphic Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    protocols: [],
    maxPrice: 16000,
    sortBy: 'featured',
  });

  // Side-by-Side Neomorphic Product Comparison State (Up to 3 products)
  const [compareIds, setCompareIds] = useState<string[]>([
    'lock-quantum',
    'camera-ptz',
    'hub-matter',
  ]);

  // Cart & Checkout Drawer State
  const [cart, setCart] = useState<Map<string, number>>(
    () => new Map([['hub-matter', 1]])
  );
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [checkoutStep, setCheckoutStep] = useState<
    'cart' | 'shipping' | 'payment' | 'success'
  >('cart');
  const [shippingMethod, setShippingMethod] = useState<
    'express' | 'standard' | 'showroom'
  >('express');
  const [paymentMethod, setPaymentMethod] = useState<'reypass' | 'card' | 'crypto'>('reypass');
  const [cryptoAsset, setCryptoAsset] = useState<'USDT' | 'BTC' | 'ETH' | 'SOL'>('USDT');

  // Card Payment Fields + Per-Field Visual Validation (Luhn Algorithm)
  const [cardFields, setCardFields] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  });
  const [cardTouched, setCardTouched] = useState<Record<string, boolean>>({});
  const [cardErrors, setCardErrors] = useState<CardValidationErrors>({});
  const [lastOrderRef, setLastOrderRef] = useState<string>('REY-84920-MX');
  const [showBiometricScan, setShowBiometricScan] = useState<boolean>(false);
  const { role, setRole, user, signIn, signOut, isAuthenticated } = useAuth();
  const [showSuperAdmin, setShowSuperAdmin] = useState<boolean>(false);
  const [gatewayType, setGatewayType] = useState<'reypass' | 'luhn'>('reypass');

  useEffect(() => {
    if (user) {
      getCart(user.uid).then(setCart);
    } else {
      setCart(new Map([['hub-matter', 1]]));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      saveCart(user.uid, cart);
    }
  }, [cart, user]);

  // Product Detail Modal & Floating 3-Screen Install Guide Modal
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [installGuideProduct, setInstallGuideProduct] = useState<Product | null>(null);
  const [arViewerProduct, setArViewerProduct] = useState<Product | null>(null);
  const [reviewsProduct, setReviewsProduct] = useState<Product | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isARVideoReviewsOpen, setIsARVideoReviewsOpen] = useState<boolean>(false);

  // User Behavior Signals for Hybrid Recommendation Engine
  const [viewedIds, setViewedIds] = useState<string[]>(['lock-quantum']);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [simulatorInteractedIds, setSimulatorInteractedIds] = useState<string[]>([
    'hub-matter',
  ]);

  // Loyalty Program State (ReyClub VIP: Bronce, Plata, Oro, Diamante)
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(320);
  const [totalSpentMxn, setTotalSpentMxn] = useState<number>(3200);
  const [pointsDiscountMxn, setPointsDiscountMxn] = useState<number>(0);

  const membershipTier: MembershipTier = useMemo(() => {
    if (loyaltyPoints >= 3500 || totalSpentMxn >= 35000) return 'Diamante';
    if (loyaltyPoints >= 1500 || totalSpentMxn >= 15000) return 'Oro';
    if (loyaltyPoints >= 500 || totalSpentMxn >= 5000) return 'Plata';
    return 'Bronce';
  }, [loyaltyPoints, totalSpentMxn]);

  const nextTierTarget =
    membershipTier === 'Bronce' ? 500 : membershipTier === 'Plata' ? 1500 : 3500;
  const pointsToNextTier =
    membershipTier === 'Diamante' ? 0 : Math.max(0, nextTierTarget - loyaltyPoints);
  const miniProgressPct = Math.min(100, Math.round((loyaltyPoints / 3500) * 100));

  // Real-time Security State & Browser Push Notifications
  const {
    permission: notificationPermission,
    requestDesktopPermission,
    sendNotification,
    recentAlerts,
  } = useSecurityNotifications();

  const [securityState, setSecurityState] = useState<SmartSecurityState>({
    securityArmed: true,
    frontDoorLocked: true,
    courtyardSiren: false,
    perimeterSensorsActive: true,
    livingRoomLights: true,
    thermostatTemp: 22.5,
  });

  // REYBOT AI Support Chat State
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: 'user' | 'model'; text: string }>
  >([
    {
      role: 'model',
      text: 'Bienvenido a REYPLACE.MX. Soy REYBOT, tu consultor de arquitectura Smart Home y Seguridad. Puedo ayudarte a elegir equipos compatibles con Matter, Google Home o Alexa, revisar pasos de instalación o resolver dudas de pago con tarjetas y criptomonedas.',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Subtle Toast Feedback
  const [toast, setToast] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3400);
  };

  // Validate Card Fields Reactively
  useEffect(() => {
    setCardErrors(validateCardFields(cardFields));
  }, [cardFields]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);
      const matchesCat =
        filters.category === 'all' || product.category === filters.category;
      const matchesPrice = product.price <= filters.maxPrice;
      const matchesProtocols =
        filters.protocols.length === 0 ||
        filters.protocols.every((proto) => product.compatibility.includes(proto));

      return matchesSearch && matchesCat && matchesPrice && matchesProtocols;
    }).sort((a, b) => {
      if (filters.sortBy === 'low') return a.price - b.price;
      if (filters.sortBy === 'high') return b.price - a.price;
      if (filters.sortBy === 'savings') return b.monthlyKwhSaved - a.monthlyKwhSaved;
      return b.rating - a.rating;
    });
  }, [searchQuery, filters]);

  const comparedProducts = useMemo(
    () =>
      compareIds
        .map((id) => PRODUCTS.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p)),
    [compareIds]
  );

  const toggleCompareProduct = (productId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 3) {
        triggerToast('Puedes comparar hasta 3 equipos simultáneamente. Se reemplazó el más antiguo.');
        return [...prev.slice(1), productId];
      }
      triggerToast('Equipo agregado a la Tabla Comparativa Neomórfica');
      return [...prev, productId];
    });
  };

  // Personalized Recommendations
  const behaviorContext = useMemo(
    () => ({
      viewedProductIds: viewedIds,
      purchasedProductIds: purchasedIds,
      simulatorInteractedIds,
      cartProductIds: Array.from(cart.keys()),
      preferredProtocols: filters.protocols,
    }),
    [viewedIds, purchasedIds, simulatorInteractedIds, cart, filters.protocols]
  );

  const homeRecommendations = useMemo(
    () => computeRecommendations(PRODUCTS, behaviorContext, 3),
    [behaviorContext]
  );

  const modalRecommendations = useMemo(
    () => computeRecommendations(PRODUCTS, behaviorContext, 2, detailProduct),
    [behaviorContext, detailProduct]
  );

  const checkoutRecommendations = useMemo(
    () => computeRecommendations(PRODUCTS, behaviorContext, 2),
    [behaviorContext]
  );

  // Cart Helpers
  const addToCart = (productId: string) => {
    setCart((prev) => {
      const next = new Map(prev);
      next.set(productId, (next.get(productId) || 0) + 1);
      return next;
    });
    const item = PRODUCTS.find((p) => p.id === productId);
    if (item) {
      triggerToast(`${item.name} añadido al carrito`);
    }
  };

  const addMultipleToCart = (productIds: string[]) => {
    setCart((prev) => {
      const next = new Map(prev);
      productIds.forEach((id) => {
        next.set(id, (next.get(id) || 0) + 1);
      });
      return next;
    });
    setIsCartOpen(true);
    setCheckoutStep('cart');
    triggerToast(`${productIds.length} equipos del escenario añadidos al carrito`);
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const next = new Map(prev);
      const updated = (next.get(productId) || 0) + delta;
      if (updated <= 0) {
        next.delete(productId);
      } else {
        next.set(productId, updated);
      }
      return next;
    });
  };

  const openProductDetail = (product: Product) => {
    setViewedIds((prev) =>
      prev.includes(product.id) ? prev : [product.id, ...prev.slice(0, 8)]
    );
    setDetailProduct(product);
  };

  const cartCount = Array.from(cart.values()).reduce((a, b) => a + b, 0);
  const cartProductNames = useMemo(() => {
    return Array.from(cart.keys())
      .map((id) => PRODUCTS.find((p) => p.id === id)?.name)
      .filter((name): name is string => Boolean(name));
  }, [cart]);
  const cartSubtotalMxn = useMemo(() => {
    return Array.from(cart.entries()).reduce((sum, [id, qty]) => {
      const p = PRODUCTS.find((item) => item.id === id);
      return sum + (p ? p.price * qty : 0);
    }, 0);
  }, [cart]);
  const shippingCost =
    shippingMethod === 'express' ? 199 : shippingMethod === 'standard' ? 99 : 0;

  // Checkout submission -> Trigger Biometric Scan Modal
  const handleInitiateCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'card') {
      setCardTouched({ number: true, name: true, expiry: true, cvc: true });
      const currentErrors = validateCardFields(cardFields);
      setCardErrors(currentErrors);
      if (Object.keys(currentErrors).length > 0) {
        triggerToast('Verifica los campos marcados en tu tarjeta antes de confirmar.');
        return;
      }
    }
    setShowBiometricScan(true);
  };

  const handleBiometricScanSuccess = () => {
    setShowBiometricScan(false);
    const subtotal = Array.from(cart.entries()).reduce((sum, [id, qty]) => {
      const p = PRODUCTS.find((item) => item.id === id);
      return sum + (p ? p.price * qty : 0);
    }, 0);

    const earnedPoints = Math.max(25, Math.round(subtotal / 10));
    const orderedIds = Array.from(cart.keys());

    setLoyaltyPoints((prev) => prev + earnedPoints);
    setTotalSpentMxn((prev) => prev + subtotal);
    setPurchasedIds((prev) => Array.from(new Set([...orderedIds, ...prev])));
    setPointsDiscountMxn(0);
    setLastOrderRef(`REY-${Math.floor(10000 + Math.random() * 89999)}-MX`);
    setCart(new Map());
    setCheckoutStep('success');
    triggerToast(`Biometría 3D aprobada · +${earnedPoints} pts ReyClub acreditados`);
  };

  // Security Handlers
  const handleToggleSecurityArm = () => {
    const nextArmed = !securityState.securityArmed;
    setSecurityState((prev) => ({ ...prev, securityArmed: nextArmed }));
    sendNotification(
      nextArmed ? 'Sistema REYPLACE Armado' : 'Sistema REYPLACE Desarmado',
      nextArmed
        ? 'Vigilancia perimetral 4K y sensores mmWave activados.'
        : 'La alarma perimetral fue desactivada por el usuario.',
      nextArmed ? 'info' : 'warning'
    );
  };

  const handleToggleFrontLock = () => {
    const nextLocked = !securityState.frontDoorLocked;
    setSecurityState((prev) => ({ ...prev, frontDoorLocked: nextLocked }));
    sendNotification(
      nextLocked
        ? 'Cerradura Quantum 3D Asegurada'
        : 'Alerta: Cerradura Principal Abierta',
      nextLocked
        ? 'El pestillo motorizado de acceso principal está bloqueado.'
        : 'Se desbloqueó la cerradura principal Quantum 3D.',
      nextLocked ? 'info' : 'critical'
    );
  };

  const handleTogglePerimeter = () => {
    const nextActive = !securityState.perimeterSensorsActive;
    setSecurityState((prev) => ({ ...prev, perimeterSensorsActive: nextActive }));
    sendNotification(
      'Estado de Sensores mmWave',
      nextActive
        ? 'Los 6 radares de presencia y apertura están en línea.'
        : 'Sensores perimetrales puestos en pausa temporal.',
      nextActive ? 'info' : 'warning'
    );
  };

  const handleTestIntrusionAlert = () => {
    sendNotification(
      'Actividad Detectada en Fachada',
      'Cámara Domo PTZ 4K identificó movimiento fuera de horario y encendió reflectores disuasorios.',
      'critical'
    );
    triggerToast('Alerta push de seguridad emitida');
  };

  // Loyalty Handlers
  const handleRedeemPoints = (cost: number, mxnValue: number) => {
    if (loyaltyPoints < cost) return;
    setLoyaltyPoints((prev) => prev - cost);
    setPointsDiscountMxn((prev) => prev + mxnValue);
    triggerToast(`Bono de -$${mxnValue} MXN aplicado a tu próximo pedido`);
  };

  const handleEarnLoyaltyPoints = (amount: number, reason: string) => {
    setLoyaltyPoints((prev) => prev + amount);
    triggerToast(`+${amount} pts ReyClub: ${reason}`);
  };

  // AI Chat Handler
  const handleSendChat = async (e?: React.FormEvent, presetPrompt?: string) => {
    if (e) e.preventDefault();
    const messageToSend = (presetPrompt ?? chatInput).trim();
    if (!messageToSend || isAiLoading) return;

    if (!presetPrompt) setChatInput('');
    const updatedHistory = [
      ...chatMessages,
      { role: 'user' as const, text: messageToSend },
    ];
    setChatMessages(updatedHistory);
    setIsAiLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageToSend,
          history: updatedHistory.slice(-8),
        }),
      });
      const data = await response.json();
      setChatMessages([
        ...updatedHistory,
        {
          role: 'model',
          text:
            data.reply ||
            'Puedo ayudarte a dimensionar tu red Matter o seleccionar cerraduras biométricas.',
        },
      ]);
    } catch {
      setChatMessages([
        ...updatedHistory,
        {
          role: 'model',
          text: 'No fue posible contactar al servidor de asistencia en este momento. Intenta nuevamente en unos segundos.',
        },
      ]);
    } finally {
      setIsAiLoading(false);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    }
  };

  const cardDigitsOnly = cardFields.number.replace(/\D/g, '');
  const isCardLuhnValid = cardDigitsOnly.length >= 13 && validateLuhn(cardDigitsOnly);



  return (
    <PermissionsProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070d1e] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <DynamicMetaTags selectedCategory={filters.category} detailProduct={detailProduct} />
      <SinaloaGeoWelcomeBanner onTriggerToast={triggerToast} />

      {/* Strict 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/90 dark:bg-[#070d1e]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Single Wordmark */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('catalogo');
            }}
            className="font-display text-2xl font-bold tracking-tighter text-slate-900 dark:text-white whitespace-nowrap shrink-0"
          >
            REYPLACE.MX
          </a>

          {/* Zone 2: 4 Clean Single-Line Text Navigation Links */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            {[
                { id: 'catalogo', label: 'Catálogo' },
                { id: 'simulador', label: 'Configurador' },
                { id: 'vip', label: 'Club VIP' },
                { id: 'seguridad', label: 'Seguridad' },
                { id: 'energia', label: 'Ecosistema' },
                { id: 'soporte', label: 'REYBOT' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id as MainSection)}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-cyan-600 dark:hover:text-[#70e9ff] ${
                  activeSection === item.id
                    ? 'text-slate-900 dark:text-white font-semibold'
                    : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Cart Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsCartOpen(true);
                if (checkoutStep === 'success') setCheckoutStep('cart');
              }}
              className="px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Carrito ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Luxury Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 dark:bg-[#02050e] text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 via-transparent to-slate-900/40" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
                <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tighter leading-[0.9] text-white">
                    CONECTAMOS.<br />
                    INNOVAMOS.<br />
                    TRANSFORMAMOS.
                </h1>
                <p className="text-lg md:text-xl text-slate-300 max-w-lg leading-relaxed">
                    Elevando la experiencia de hogar inteligente a un estándar de lujo, seguridad y eficiencia energética.
                </p>
                <button 
                  onClick={() => setActiveSection('catalogo')}
                  className="px-8 py-4 rounded-full bg-cyan-500 text-white font-bold text-lg transition-all hover:bg-cyan-400 hover:scale-105"
                >
                    Explorar Colección
                </button>
            </div>
            <div className="flex-1 w-full md:max-w-md">
                <img 
                    src="/assets/aistudio/363506389_1793582639543287_366adfed.jpg"
                    alt="ReyPlace Logo"
                    className="w-full h-auto object-contain rounded-3xl neo-surface"
                />
            </div>
          </div>
      </section>

      {/* Secondary Workspace Bar: Interactive Membership Progress Widget + Theme Switch */}
      <div className="border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-100/60 dark:bg-[#091229]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex md:hidden items-center gap-4 overflow-x-auto py-0.5">
            {(
              [
                { id: 'catalogo', label: 'Catálogo' },
                { id: 'simulador', label: 'Configurador' },
                { id: 'vip', label: 'Club VIP' },
                { id: 'seguridad', label: 'Seguridad' },
                { id: 'energia', label: 'Ecosistema' },
                { id: 'soporte', label: 'REYBOT' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`whitespace-nowrap font-semibold ${
                  activeSection === item.id
                    ? 'text-cyan-700 dark:text-[#70e9ff]'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setActiveSection('vip')}
            className="hidden md:flex items-center gap-3 group text-left"
          >
            <span className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-[#70e9ff] transition-colors">
              {membershipTier === 'Oro' && (
                <Crown className="w-3.5 h-3.5 text-amber-400" />
              )}
              Socio ReyClub {membershipTier} ·{' '}
              <span className="font-mono-num">{loyaltyPoints} pts</span>
            </span>

            <div className="w-28 h-2 rounded-full neo-inset overflow-hidden">
              <motion.div
                initial={false}
                animate={{ width: `${miniProgressPct}%` }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className={`h-full rounded-full ${
                  membershipTier === 'Oro'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-300'
                    : 'bg-cyan-600 dark:bg-[#70e9ff]'
                }`}
              />
            </div>

            <span className="text-slate-500 dark:text-slate-400">
              {membershipTier === 'Oro'
                ? 'Nivel Oro Desbloqueado ★'
                : `Faltan ${pointsToNextTier} pts para ${
                    membershipTier === 'Bronce' ? 'Plata' : 'Oro'
                  }`}
            </span>
          </button>

          <div className="flex items-center gap-3 ml-auto">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={signOut}
                className="px-3 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold transition-colors"
              >
                Salir
              </button>
            ) : (
              <button
                type="button"
                onClick={signIn}
                className="px-3 py-1.5 rounded-full bg-cyan-600 text-white dark:bg-[#70e9ff] dark:text-[#070d1e] text-xs font-bold transition-colors"
              >
                Ingresar
              </button>
            )}
            <WeatherWidget />

             <div className="relative group">
              {/* Tooltip for First Visit */}
              {typeof window !== 'undefined' && !localStorage.getItem('voice_tooltip_shown_main') && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 bg-slate-900 p-3 rounded-xl border border-slate-700 shadow-2xl z-50"
                >
                  <p className="text-[10px] text-white">
                    ¡Prueba nuestra <strong className="text-cyan-400">Voz IA</strong>! Navega y busca productos usando comandos de voz.
                  </p>
                  <button 
                    onClick={() => {
                      localStorage.setItem('voice_tooltip_shown_main', 'true');
                      const element = document.getElementById('voice-tooltip-wrapper');
                      if(element) element.style.display = 'none';
                    }}
                    className="absolute -bottom-2 right-2 text-[8px] bg-slate-700 px-2 py-0.5 rounded-full"
                  >
                    Entendido
                  </button>
                </motion.div>
              )}
              <button
                type="button"
                id="voice-tooltip-wrapper"
                onClick={() => {
                  localStorage.setItem('voice_tooltip_shown_main', 'true');
                  setIsVoiceModalOpen(true);
                }}
                className="neo-inset px-3.5 py-1.5 rounded-xl font-semibold text-cyan-700 dark:text-[#70e9ff] flex items-center gap-1.5 hover:scale-105 transition-transform"
                title="Activar Comandos de Voz"
              >
                <Mic className="w-4 h-4 animate-pulse text-cyan-500" />
                <span>Voz IA</span>
              </button>
             </div>

            {compareIds.length > 0 && activeSection === 'catalogo' && (
              <a
                href="#comparador-tecnico"
                className="neo-inset px-3 py-1.5 rounded-xl font-semibold text-cyan-700 dark:text-[#70e9ff] flex items-center gap-1.5"
              >
                <Scale className="w-3.5 h-3.5" /> Comparando ({compareIds.length}/3)
              </a>
            )}

            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              className="neo-inset px-3 py-1.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:text-cyan-600 dark:hover:text-[#70e9ff] transition-colors"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> Modo Claro
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" /> Modo Oscuro
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main
        id="inicio"
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-12"
      >
        {activeSection === 'catalogo' && (
          <>
            <HeroSlideBar
              onOpenDetail={openProductDetail}
              onAddToCart={addToCart}
            />

            <section className="py-12 bg-slate-100 dark:bg-[#091229] rounded-[32px] my-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Experiencia Inmersiva</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <video 
                            src="/assets/aistudio/378770323_1793582605081051_6c8a7df1.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full rounded-3xl neo-surface shadow-2xl"
                        />
                        <video 
                            src="/assets/aistudio/378770323_1792582766939876_6c8a7df1.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full rounded-3xl neo-surface shadow-2xl"
                        />
                    </div>
                </div>
            </section>
            
            <section className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-cyan-700 dark:text-[#70e9ff]">
                    Sugerencias Personalizadas
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                    Recomendados para tu Ecosistema
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Basado en tu navegación, carrito e interacciones en el simulador
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {homeRecommendations.map(({ product, reason }, idx) => (
                  <motion.article
                    key={product.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.4,
                      delay: idx * 0.07,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="neo-surface rounded-[26px] p-4 border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-4"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700/70"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-[11px] text-cyan-700 dark:text-[#70e9ff] font-medium truncate">
                        {reason}
                      </p>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-mono-num font-bold text-xs text-slate-900 dark:text-white">
                          ${product.price.toLocaleString()} MXN
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setInstallGuideProduct(product)}
                            className="px-2.5 py-1.5 rounded-lg neo-inset text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-[#70e9ff]"
                          >
                            Instalar
                          </button>
                          <button
                            type="button"
                            onClick={() => addToCart(product.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e] text-[11px] font-bold"
                          >
                            Añadir
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>

            <section
              id="tienda-grid"
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              <aside className="lg:col-span-3 lg:sticky lg:top-24">
                <SmartFilters
                  filters={filters}
                  onChange={setFilters}
                  totalMatches={filteredProducts.length}
                />
              </aside>

              <div className="lg:col-span-9 space-y-6">
                <div className="neo-surface rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3">
                  <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar cerraduras biométricas, cámaras 4K, hubs Matter o routers Wi-Fi 7..."
                    aria-label="Buscar dispositivos en el catálogo"
                    className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none py-1.5"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white px-2"
                    >
                      Limpiar
                    </button>
                  )}
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="neo-surface rounded-[28px] p-12 text-center space-y-3 border border-slate-200/80 dark:border-slate-800/80">
                    <p className="text-base font-bold text-slate-900 dark:text-white">
                      Ningún equipo coincide con los filtros activos.
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Amplía el rango de presupuesto o desmarca protocolos específicos para ver todo el catálogo.
                    </p>
                  </div>
                ) : (
                  <LayoutGroup>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product, index) => {
                      const isCompared = compareIds.includes(product.id);
                      return (
                        <motion.article
                          layout
                          key={product.id}
                          initial={{ opacity: 0, y: 24, scale: 0.98 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: true, amount: 0.14 }}
                          transition={{
                            duration: 0.45,
                            delay: (index % 3) * 0.08,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          whileHover={{ y: -5 }}
                          className={`neo-surface rounded-[28px] border overflow-hidden flex flex-col transition-colors duration-200 ${
                            isCompared
                              ? 'border-cyan-500/80'
                              : 'border-slate-200/80 dark:border-slate-800/80'
                          }`}
                        >
                          <div className="relative aspect-[4/3] overflow-hidden bg-slate-200 dark:bg-slate-900">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                            <div className="absolute bottom-3 right-3 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => toggleCompareProduct(product.id)}
                                aria-pressed={isCompared}
                                title="Comparar especificaciones lado a lado"
                                className={`h-9 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md transition-colors ${
                                  isCompared
                                    ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                                    : 'bg-slate-950/75 text-white hover:bg-cyan-600'
                                }`}
                              >
                                <Scale className="w-3.5 h-3.5" />
                                {isCompared ? 'En Tabla' : 'Comparar'}
                              </button>

                              <button
                                type="button"
                                onClick={() => openProductDetail(product)}
                                aria-label={`Ver especificaciones de ${product.name}`}
                                className="w-9 h-9 rounded-xl bg-slate-950/75 text-white flex items-center justify-center hover:bg-cyan-600 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="p-5 flex-1 flex flex-col">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                              <span>{product.category}</span>
                              <span aria-hidden="true">·</span>
                              <button
                                type="button"
                                onClick={() => setReviewsProduct(product)}
                                className="font-mono-num font-semibold text-amber-500 hover:underline flex items-center gap-0.5"
                                title="Ver opiniones y calificaciones de clientes"
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
                                onClick={() => openProductDetail(product)}
                                className="text-left hover:text-cyan-600 dark:hover:text-[#70e9ff] transition-colors"
                              >
                                {product.name}
                              </button>
                            </h3>

                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                              {product.description}
                            </p>

                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3">
                              {product.compatibility.join(' · ')}
                            </p>

                            <div className="mt-auto pt-4 space-y-3">
                              <div className="flex items-baseline gap-2">
                                <span className="text-lg font-extrabold font-mono-num text-cyan-700 dark:text-[#70e9ff]">
                                  ${product.price.toLocaleString()} MXN
                                </span>
                                {product.originalPrice && (
                                  <span className="text-xs font-mono-num text-slate-400 line-through">
                                    ${product.originalPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => setInstallGuideProduct(product)}
                                  className="py-2.5 px-3 rounded-xl neo-inset text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-[#70e9ff] flex items-center justify-center gap-1.5 transition-colors"
                                >
                                  <Wrench className="w-3.5 h-3.5" /> Instalar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => addToCart(product.id)}
                                  className="py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-[#70e9ff] dark:hover:bg-[#56e2ff] text-white dark:text-[#070d1e] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                                >
                                  <ShoppingBag className="w-3.5 h-3.5" /> Añadir
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                  </LayoutGroup>
                )}
              </div>
            </section>

            <NeomorphicComparisonTable
              selectedProducts={comparedProducts}
              allProducts={PRODUCTS}
              onRemoveProduct={(id) =>
                setCompareIds((prev) => prev.filter((item) => item !== id))
              }
              onAddProduct={(id) => toggleCompareProduct(id)}
              onClearAll={() => setCompareIds([])}
              onAddToCart={(id) => addToCart(id)}
            />
          </>
        )}

        {activeSection === 'simulador' && (
          <div className="space-y-8">
            {/* Sub-navigation for Simulator: Escenario vs Constructor de Rutinas */}
            <div className="flex items-center gap-2 neo-surface p-1.5 rounded-2xl max-w-lg mx-auto border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSimulatorSubTab('escenario')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  simulatorSubTab === 'escenario'
                    ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Diseñador de Planos
              </button>
              <button
                type="button"
                onClick={() => setSimulatorSubTab('rutinas')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  simulatorSubTab === 'rutinas'
                    ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Rutinas
              </button>
              <button
                type="button"
                onClick={() => setSimulatorSubTab('render-ia')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  simulatorSubTab === 'render-ia'
                    ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Render IA
              </button>
            </div>

            {simulatorSubTab === 'escenario' ? (
              <HomeSimulator
                products={PRODUCTS}
                onAddScenarioToCart={addMultipleToCart}
                onScenarioInteraction={(prodId) =>
                  setSimulatorInteractedIds((prev) =>
                    prev.includes(prodId) ? prev : [prodId, ...prev]
                  )
                }
              />
            ) : simulatorSubTab === 'rutinas' ? (
              <RoutineBuilder products={PRODUCTS} />
            ) : (
              <AirRoomPreview products={PRODUCTS} onAddToCart={addToCart} />
            )}
          </div>
        )}

        {activeSection === 'seguridad' && (
          <SecurityDashboard
            state={securityState}
            onToggleArm={handleToggleSecurityArm}
            onToggleLock={handleToggleFrontLock}
            onTogglePerimeter={handleTogglePerimeter}
            onTriggerTestIntrusion={handleTestIntrusionAlert}
            notificationPermission={notificationPermission}
            onRequestPermission={requestDesktopPermission}
            recentAlerts={recentAlerts}
          />
        )}

        {activeSection === 'vip' && (
          <div className="space-y-8">
            <LoyaltyDashboard
              points={loyaltyPoints}
              tier={membershipTier}
              totalSpentMxn={totalSpentMxn}
              pointsDiscount={pointsDiscountMxn}
              onRedeemDiscount={handleRedeemPoints}
              onEarnPoints={handleEarnLoyaltyPoints}
            />
          </div>
        )}

        {activeSection === 'energia' && (
          <div className="space-y-8">
            <LoyaltyDashboard
              points={loyaltyPoints}
              tier={membershipTier}
              totalSpentMxn={totalSpentMxn}
              pointsDiscount={pointsDiscountMxn}
              onRedeemDiscount={handleRedeemPoints}
              onEarnPoints={handleEarnLoyaltyPoints}
            />
            <EnergyEfficiency />
            <EnergyHeatMap />
          </div>
        )}

        {activeSection === 'soporte' && (
          <section className="max-w-4xl mx-auto neo-surface rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 overflow-hidden flex flex-col h-[72vh]">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl neo-inset flex items-center justify-center text-cyan-600 dark:text-[#70e9ff]">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                    REYBOT · Ingeniería y Soporte IA
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Consultoría en tiempo real sobre Matter, instalación y seguridad residencial
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e] font-medium'
                        : 'neo-inset text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="neo-inset rounded-2xl px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                    Analizando especificaciones de compatibilidad...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="px-6 py-2.5 border-t border-slate-200/70 dark:border-slate-800 flex gap-2 overflow-x-auto">
              {[
                '¿Qué necesito para automatizar un departamento con Apple HomeKit?',
                '¿Cómo funciona la Cerradura Biométrica Quantum 3D sin internet?',
                '¿Qué criptomonedas aceptan en el checkout?',
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSendChat(undefined, q)}
                  className="neo-inset px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-[#70e9ff] whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => handleSendChat(e)}
              className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-3"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Escribe tu consulta técnica para REYBOT..."
                className="flex-1 neo-inset rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                type="submit"
                disabled={isAiLoading || !chatInput.trim()}
                className="px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 dark:bg-[#70e9ff] dark:hover:bg-[#56e2ff] text-white dark:text-[#070d1e] font-bold text-sm flex items-center gap-2 disabled:opacity-45 transition-colors"
              >
                <Send className="w-4 h-4" /> Enviar
              </button>
            </form>
          </section>
        )}
      </main>

      {/* Product Detail Modal */}
      {detailProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDetailProduct(null);
          }}
        >
          <div className="neo-surface w-full max-w-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-700/70 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-slate-200 dark:bg-slate-900">
                <img
                  src={detailProduct.image}
                  alt={detailProduct.name}
                  className="w-full h-full min-h-[240px] object-cover"
                />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-cyan-700 dark:text-[#70e9ff] font-semibold">
                      {detailProduct.category} · ★ {detailProduct.rating}
                    </p>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                      {detailProduct.name}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDetailProduct(null)}
                    aria-label="Cerrar detalle"
                    className="w-8 h-8 rounded-full neo-inset flex items-center justify-center text-slate-600 dark:text-slate-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {detailProduct.description}
                </p>

                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {detailProduct.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-600 dark:text-[#70e9ff] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xl font-extrabold font-mono-num text-cyan-700 dark:text-[#70e9ff]">
                    ${detailProduct.price.toLocaleString()} MXN
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        const target = detailProduct;
                        setDetailProduct(null);
                        setReviewsProduct(target);
                      }}
                      className="px-3 py-2.5 rounded-xl neo-inset text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1.5 transition-colors"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> Reseñas ({detailProduct.reviewsCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const target = detailProduct;
                        setDetailProduct(null);
                        setArViewerProduct(target);
                      }}
                      className="px-3 py-2.5 rounded-xl neo-inset text-xs font-bold text-cyan-600 dark:text-[#70e9ff] flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> RA
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const target = detailProduct;
                        setDetailProduct(null);
                        setInstallGuideProduct(target);
                      }}
                      className="px-3 py-2.5 rounded-xl neo-inset text-xs font-bold flex items-center gap-1.5"
                    >
                      <Wrench className="w-3.5 h-3.5" /> Guía
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(detailProduct.id);
                        setDetailProduct(null);
                        setIsCartOpen(true);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e] text-xs font-bold"
                    >
                      Añadir al Carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {modalRecommendations.length > 0 && (
              <div className="p-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Equipos Complementarios Sugeridos
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {modalRecommendations.map(({ product, reason }) => (
                    <div
                      key={product.id}
                      className="neo-inset rounded-2xl p-3 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {reason}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addToCart(product.id)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e] text-xs font-bold shrink-0"
                      >
                        +${product.price.toLocaleString()}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Biometric Scan 3D Modal triggered on secure security checkout */}
      {showBiometricScan && (
        <BiometricScanModal
          productNames={cartProductNames.length > 0 ? cartProductNames : ['Equipos Smart Home']}
          totalAmountMxn={cartSubtotalMxn + shippingCost - pointsDiscountMxn}
          onSuccess={handleBiometricScanSuccess}
          onCancel={() => setShowBiometricScan(false)}
        />
      )}

      {/* 3-Screen Neomorphic Floating Installation Guide Modal */}
      <InstallGuideModal
        product={installGuideProduct}
        onClose={() => setInstallGuideProduct(null)}
        onAddToCart={(id) => addToCart(id)}
      />

      {/* Product Reviews and Ratings System Modal */}
      {reviewsProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setReviewsProduct(null);
          }}
        >
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[32px]">
            <button
              type="button"
              onClick={() => setReviewsProduct(null)}
              aria-label="Cerrar reseñas"
              className="absolute top-6 right-6 z-30 w-10 h-10 rounded-2xl neo-inset flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <ProductReviewsSystem
              product={reviewsProduct}
              onClose={() => setReviewsProduct(null)}
              onEarnPoints={handleEarnLoyaltyPoints}
              isAdmin={role === 'superadmin' || showSuperAdmin}
            />
          </div>
        </div>
      )}

      {/* Cart & Multi-Step Checkout Drawer with Luhn Validation & Order Summary */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          <aside
            aria-label="Carrito y pago seguro"
            className="absolute inset-y-0 right-0 w-full max-w-md neo-surface border-l border-slate-200 dark:border-slate-800 flex flex-col"
          >
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                  {checkoutStep === 'cart'
                    ? 'Tu Carrito Inteligente'
                    : checkoutStep === 'shipping'
                    ? 'Método de Envío'
                    : checkoutStep === 'payment'
                    ? 'Pago Encriptado'
                    : 'Orden Confirmada'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ReyClub Nivel {membershipTier} · {loyaltyPoints} pts disponibles
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                aria-label="Cerrar carrito"
                className="w-9 h-9 rounded-full neo-inset flex items-center justify-center text-slate-600 dark:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {checkoutStep === 'cart' && (
                <>
                  {cart.size === 0 ? (
                    <div className="py-16 text-center space-y-2">
                      <ShoppingBag className="w-10 h-10 mx-auto text-slate-400" />
                      <p className="font-bold text-sm text-slate-900 dark:text-white">
                        Tu carrito está vacío
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Añade cerraduras, hubs o escenarios desde el catálogo.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {Array.from(cart.entries()).map(([id, qty]) => {
                        const prod = PRODUCTS.find((p) => p.id === id);
                        if (!prod) return null;
                        return (
                          <div
                            key={id}
                            className="neo-inset rounded-2xl p-3.5 flex items-center gap-3"
                          >
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-14 h-14 rounded-xl object-cover shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                {prod.name}
                              </h4>
                              <p className="text-xs font-mono-num text-cyan-700 dark:text-[#70e9ff] font-semibold mt-0.5">
                                ${(prod.price * qty).toLocaleString()} MXN
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(id, -1)}
                                aria-label="Disminuir cantidad"
                                className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-5 text-center font-mono-num text-xs font-bold">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(id, 1)}
                                aria-label="Aumentar cantidad"
                                className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(id, -qty)}
                                aria-label="Eliminar producto"
                                className="text-slate-400 hover:text-rose-500 ml-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {checkoutRecommendations.length > 0 && (
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Completa tu instalación antes de pagar
                      </p>
                      {checkoutRecommendations.map(({ product, reason }) => (
                        <div
                          key={product.id}
                          className="neo-inset rounded-xl p-2.5 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {reason}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => addToCart(product.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e] text-xs font-bold shrink-0"
                          >
                            + Añadir
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {checkoutStep === 'shipping' && (
                <div className="space-y-4">
                  <div className="space-y-2.5">
                    {[
                      {
                        id: 'express' as const,
                        label: 'Envío Express Asegurado (24–48 h)',
                        cost: 199,
                      },
                      {
                        id: 'standard' as const,
                        label: 'Envío Estándar Nacional (3–5 días)',
                        cost: 99,
                      },
                      {
                        id: 'showroom' as const,
                        label: 'Entrega en Showroom Los Mochis, Sin.',
                        cost: 0,
                      },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setShippingMethod(opt.id)}
                        className={`w-full text-left p-4 rounded-2xl border flex items-center justify-between transition-all ${
                          shippingMethod === opt.id
                            ? 'border-cyan-500 bg-cyan-500/10'
                            : 'border-transparent neo-inset'
                        }`}
                      >
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {opt.label}
                        </span>
                        <span className="font-mono-num text-xs font-bold text-cyan-700 dark:text-[#70e9ff]">
                          {membershipTier === 'Oro' || opt.cost === 0
                            ? 'Sin costo'
                            : `$${opt.cost} MXN`}
                        </span>
                      </button>
                    ))}
                  </div>

                  <CheckoutSummary
                    cart={cart}
                    products={PRODUCTS}
                    shippingCost={shippingCost}
                    pointsDiscount={pointsDiscountMxn}
                    membershipTier={membershipTier}
                  />
                </div>
              )}

              {checkoutStep === 'payment' && (
                <form
                  id="checkout-payment-form"
                  onSubmit={handleInitiateCheckout}
                  className="space-y-4"
                >
                  <CheckoutSummary
                    cart={cart}
                    products={PRODUCTS}
                    shippingCost={shippingCost}
                    pointsDiscount={pointsDiscountMxn}
                    membershipTier={membershipTier}
                  />

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('reypass')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border ${
                        paymentMethod === 'reypass'
                          ? 'border-cyan-500 bg-cyan-500/10 text-cyan-800 dark:text-[#70e9ff]'
                          : 'border-transparent neo-inset text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> ReyPass
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border ${
                        paymentMethod === 'card'
                          ? 'border-cyan-500 bg-cyan-500/10 text-cyan-800 dark:text-[#70e9ff]'
                          : 'border-transparent neo-inset text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Tarjeta (Luhn)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('crypto')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border ${
                        paymentMethod === 'crypto'
                          ? 'border-cyan-500 bg-cyan-500/10 text-cyan-800 dark:text-[#70e9ff]'
                          : 'border-transparent neo-inset text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Cpu className="w-3.5 h-3.5" /> Cripto
                    </button>
                  </div>

                  {paymentMethod === 'reypass' ? (
                    <ReyPassGateway
                      totalAmountMxn={cartSubtotalMxn + shippingCost - pointsDiscountMxn}
                      membershipTier={membershipTier}
                      onSuccessfulPayment={(folio) => {
                        setLastOrderRef(folio);
                        const earnedPoints = Math.max(25, Math.round((cartSubtotalMxn + shippingCost) / 10));
                        const orderedIds = Array.from(cart.keys());
                        setLoyaltyPoints((prev) => prev + earnedPoints);
                        setTotalSpentMxn((prev) => prev + cartSubtotalMxn);
                        setPurchasedIds((prev) => Array.from(new Set([...orderedIds, ...prev])));
                        setPointsDiscountMxn(0);
                        setCart(new Map());
                        setCheckoutStep('success');
                      }}
                      onTriggerToast={triggerToast}
                    />
                  ) : paymentMethod === 'card' ? (
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <label htmlFor="cc-number" className="font-semibold">
                            Número de Tarjeta
                          </label>
                          <span className="text-slate-500 dark:text-slate-400">
                            {detectCardBrand(cardFields.number)}
                          </span>
                        </div>
                        <input
                          id="cc-number"
                          type="text"
                          inputMode="numeric"
                          value={cardFields.number}
                          onBlur={() =>
                            setCardTouched((prev) => ({ ...prev, number: true }))
                          }
                          onChange={(e) =>
                            setCardFields((prev) => ({
                              ...prev,
                              number: formatCardNumber(e.target.value),
                            }))
                          }
                          placeholder="4532 0151 1283 0366"
                          className={`w-full neo-inset rounded-xl px-3.5 py-2.5 text-xs font-mono-num focus:outline-none border ${
                            cardTouched.number && cardErrors.number
                              ? 'border-rose-500'
                              : isCardLuhnValid
                              ? 'border-emerald-500'
                              : 'border-transparent'
                          }`}
                        />
                        {cardTouched.number && cardErrors.number && (
                          <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            {cardErrors.number}
                          </p>
                        )}
                        {isCardLuhnValid && (
                          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                            Suma de verificación Luhn válida
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="cc-name" className="block text-xs font-semibold mb-1">
                          Titular de la Tarjeta
                        </label>
                        <input
                          id="cc-name"
                          type="text"
                          value={cardFields.name}
                          onBlur={() =>
                            setCardTouched((prev) => ({ ...prev, name: true }))
                          }
                          onChange={(e) =>
                            setCardFields((prev) => ({ ...prev, name: e.target.value }))
                          }
                          placeholder="Nombre completo como figura en el plástico"
                          className={`w-full neo-inset rounded-xl px-3.5 py-2.5 text-xs focus:outline-none border ${
                            cardTouched.name && cardErrors.name
                              ? 'border-rose-500'
                              : 'border-transparent'
                          }`}
                        />
                        {cardTouched.name && cardErrors.name && (
                          <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            {cardErrors.name}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="cc-exp" className="block text-xs font-semibold mb-1">
                            Vigencia (MM/AA)
                          </label>
                          <input
                            id="cc-exp"
                            type="text"
                            inputMode="numeric"
                            value={cardFields.expiry}
                            onBlur={() =>
                              setCardTouched((prev) => ({ ...prev, expiry: true }))
                            }
                            onChange={(e) =>
                              setCardFields((prev) => ({
                                ...prev,
                                expiry: formatExpiry(e.target.value),
                              }))
                            }
                            placeholder="08/29"
                            className={`w-full neo-inset rounded-xl px-3.5 py-2.5 text-xs font-mono-num focus:outline-none border ${
                              cardTouched.expiry && cardErrors.expiry
                                ? 'border-rose-500'
                                : 'border-transparent'
                            }`}
                          />
                          {cardTouched.expiry && cardErrors.expiry && (
                            <p className="text-[11px] text-rose-500 mt-1">
                              {cardErrors.expiry}
                            </p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="cc-cvc" className="block text-xs font-semibold mb-1">
                            Código CVV
                          </label>
                          <input
                            id="cc-cvc"
                            type="password"
                            inputMode="numeric"
                            maxLength={4}
                            value={cardFields.cvc}
                            onBlur={() =>
                              setCardTouched((prev) => ({ ...prev, cvc: true }))
                            }
                            onChange={(e) =>
                              setCardFields((prev) => ({
                                ...prev,
                                cvc: e.target.value.replace(/\D/g, '').slice(0, 4),
                              }))
                            }
                            placeholder="123"
                            className={`w-full neo-inset rounded-xl px-3.5 py-2.5 text-xs font-mono-num focus:outline-none border ${
                              cardTouched.cvc && cardErrors.cvc
                                ? 'border-rose-500'
                                : 'border-transparent'
                            }`}
                          />
                          {cardTouched.cvc && cardErrors.cvc && (
                            <p className="text-[11px] text-rose-500 mt-1">
                              {cardErrors.cvc}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="neo-inset rounded-2xl p-4 space-y-3">
                      <div className="grid grid-cols-4 gap-2">
                        {(['USDT', 'BTC', 'ETH', 'SOL'] as const).map((coin) => (
                          <button
                            key={coin}
                            type="button"
                            onClick={() => setCryptoAsset(coin)}
                            className={`py-2 rounded-xl text-xs font-bold font-mono-num ${
                              cryptoAsset === coin
                                ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                                : 'bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {coin}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Dirección de liquidación verificada ({cryptoAsset}):
                      </p>
                      <p className="font-mono-num text-[11px] p-2.5 rounded-xl bg-slate-200/70 dark:bg-slate-900 select-all break-all">
                        0x94A8F19C3B07E2D451C88A12F0E39B71_{cryptoAsset}
                      </p>
                    </div>
                  )}
                </form>
              )}

              {checkoutStep === 'success' && (
                <div className="py-10 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Orden Procesada con Éxito
                  </h3>
                  <p className="text-xs font-mono-num text-cyan-700 dark:text-[#70e9ff]">
                    Folio cifrado: {lastOrderRef}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto leading-relaxed">
                    Tus puntos ReyClub fueron sumados automáticamente y las guías interactivas de instalación permanecen disponibles en el catálogo.
                  </p>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-slate-200 dark:border-slate-800">
              {checkoutStep === 'cart' && cart.size > 0 && (
                <button
                  type="button"
                  onClick={() => setCheckoutStep('shipping')}
                  className="w-full py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 dark:bg-[#70e9ff] dark:hover:bg-[#56e2ff] text-white dark:text-[#070d1e] font-bold text-sm transition-colors"
                >
                  Continuar a Envío y Resumen
                </button>
              )}

              {checkoutStep === 'shipping' && (
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="py-3 rounded-2xl neo-inset text-xs font-bold"
                  >
                    Atrás
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('payment')}
                    className="col-span-2 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 dark:bg-[#70e9ff] dark:hover:bg-[#56e2ff] text-white dark:text-[#070d1e] text-xs font-bold"
                  >
                    Proceder al Pago
                  </button>
                </div>
              )}

              {checkoutStep === 'payment' && (
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('shipping')}
                    className="py-3 rounded-2xl neo-inset text-xs font-bold"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    form="checkout-payment-form"
                    className="col-span-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    Confirmar Compra Segura
                  </button>
                </div>
              )}

              {checkoutStep === 'success' && (
                <button
                  type="button"
                  onClick={() => {
                    setCheckoutStep('cart');
                    setIsCartOpen(false);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e] text-xs font-bold"
                >
                  Volver a la Tienda
                </button>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Biometric Scan 3D Modal triggered on secure security checkout */}
      {showBiometricScan && (
        <BiometricScanModal
          productNames={
            cartProductNames.length > 0 ? cartProductNames : ['Equipos Smart Home']
          }
          totalAmountMxn={cartSubtotalMxn + shippingCost - pointsDiscountMxn}
          onSuccess={handleBiometricScanSuccess}
          onCancel={() => setShowBiometricScan(false)}
        />
      )}

      {/* 3-Screen Neomorphic Floating Installation Guide Modal */}
      <InstallGuideModal
        product={installGuideProduct}
        onClose={() => setInstallGuideProduct(null)}
        onAddToCart={(id) => addToCart(id)}
      />

      {/* Augmented Reality Viewer Modal */}
      <ARViewerModal
        product={arViewerProduct}
        onClose={() => setArViewerProduct(null)}
        onTriggerToast={triggerToast}
        onOpenVideoReviews={() => setIsARVideoReviewsOpen(true)}
      />

      {/* AR Video Reviews Hologram Modal */}
      {isARVideoReviewsOpen && arViewerProduct && (
        <ARVideoReviewsModal
          product={arViewerProduct}
          userId={user?.uid}
          onClose={() => setIsARVideoReviewsOpen(false)}
          onTriggerToast={triggerToast}
        />
      )}

      {/* Voice Command Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onNavigateSection={(sec) => setActiveSection(sec)}
        onAskReybot={(q) => handleSendChat(undefined, q)}
        onTriggerToast={triggerToast}
      />

      {/* Subtle Toast Banner */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 neo-surface border border-cyan-500/60 px-4 py-3 rounded-2xl text-xs font-semibold text-slate-900 dark:text-white shadow-xl"
        >
          {toast}
        </div>
      )}

      {/* PWA Initial Setup & Add to Home Screen Prompt */}
      <InstallPwaPrompt onTriggerToast={triggerToast} />

      {/* Hidden SuperAdmin Dashboard Modal */}
      {showSuperAdmin && role === 'superadmin' && (
        <SuperAdminDashboard
          onClose={() => setShowSuperAdmin(false)}
          onTriggerToast={triggerToast}
        />
      )}

      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-10 mt-16 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <strong className="text-slate-900 dark:text-white">REYPLACE.MX</strong> · Conectamos, Innovamos, Transformamos · Los Mochis, Sinaloa, México
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => setShowSuperAdmin(true)}
              className="text-rose-500 hover:underline font-semibold flex items-center gap-1"
            >
              🔒 SuperAdmin Portal
            </button>
            <a
              href="mailto:contacto@reyplace.mx"
              className="hover:text-slate-900 dark:hover:text-white"
            >
              contacto@reyplace.mx
            </a>
            <a
              href="https://wa.me/526682523847"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-white"
            >
              WhatsApp +52 668 252 3847
            </a>
          </div>
        </div>
      </footer>
    </div>
  </PermissionsProvider>
);
}

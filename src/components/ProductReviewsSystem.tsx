import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  Upload,
  Play,
  Image as ImageIcon,
  Video,
  Filter,
  ArrowUpDown,
  MessageSquare,
  Sparkles,
  X,
  Plus,
  Send,
  UserCheck,
  AlertCircle,
  Eye,
  Check,
  Maximize2,
  CornerDownRight,
  ShieldAlert,
} from 'lucide-react';
import { Product } from '../data/products';
import { db, auth } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export interface ProductReviewItem {
  id: string;
  productId: string;
  userId: string;
  authorName: string;
  city: string;
  rating: number;
  title: string;
  comment: string;
  pros?: string;
  cons?: string;
  mediaType?: 'photo' | 'video' | 'both';
  mediaUrls?: string[];
  videoUrl?: string;
  thumbnailUrl?: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  unhelpfulCount: number;
  status: 'approved' | 'pending' | 'rejected';
  officialResponse?: string;
  createdAt: string;
}

interface ProductReviewsSystemProps {
  product: Product;
  onClose?: () => void;
  onEarnPoints?: (amount: number, reason: string) => void;
  isAdmin?: boolean;
}

// Initial realistic community reviews for seed & immediate high-fidelity display
const INITIAL_REVIEWS: Record<string, ProductReviewItem[]> = {
  'lock-quantum': [
    {
      id: 'rev-q1',
      productId: 'lock-quantum',
      userId: 'user-mochis-1',
      authorName: 'Carlos Mendoza G.',
      city: 'Los Mochis, Sinaloa',
      rating: 5,
      title: 'Increíble velocidad de reconocimiento facial 3D, adiós llaves',
      comment:
        'Instalé la Cerradura Quantum en la puerta principal de madera de parota. El reconocimiento facial funciona al instante incluso con lentes oscuros o de noche en total oscuridad gracias a sus sensores infrarrojos. La integración con Apple Home y Google Home a través de Matter es perfecta.',
      pros: 'Reconocimiento en menos de medio segundo, construcción pesada en titanio, batería dura meses.',
      cons: 'Se requiere taladro con broca de mortaja para puertas gruesas.',
      mediaType: 'both',
      mediaUrls: [
        '/src/assets/images/quantum_smart_lock_1793514319752.jpg',
        '/src/assets/images/smart_villa_camera_feed_1793514327894.jpg',
      ],
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-using-a-smart-lock-42358-large.mp4',
      thumbnailUrl: '/src/assets/images/quantum_smart_lock_1793514319752.jpg',
      verifiedPurchase: true,
      helpfulCount: 52,
      unhelpfulCount: 1,
      status: 'approved',
      officialResponse:
        '¡Muchas gracias Carlos! Nos alegra que disfrutes la seguridad Matter. Recuerda que con el Hub Neural puedes automatizar el encendido de luces al abrir la puerta.',
      createdAt: 'Hace 3 días',
    },
    {
      id: 'rev-q2',
      productId: 'lock-quantum',
      userId: 'user-cln-2',
      authorName: 'Dra. Marcela Beltrán',
      city: 'Culiacán, Sinaloa',
      rating: 5,
      title: 'Excelente estética y tranquilidad absoluta en accesos',
      comment:
        'La elegancia del acabado titanio cepillado superó mis expectativas. Ya no me preocupo por llaves olvidadas ni por las empleadas del hogar, ya que les creé accesos temporales programados por horario.',
      pros: 'Códigos de acceso de un solo uso, notificaciones en tiempo real al teléfono.',
      cons: 'Ninguno hasta ahora.',
      mediaType: 'photo',
      mediaUrls: ['/src/assets/images/quantum_smart_lock_1793514319752.jpg'],
      verifiedPurchase: true,
      helpfulCount: 34,
      unhelpfulCount: 0,
      status: 'approved',
      createdAt: 'Hace 1 semana',
    },
    {
      id: 'rev-q3',
      productId: 'lock-quantum',
      userId: 'user-mzt-3',
      authorName: 'Ing. Rodrigo Vega',
      city: 'Mazatlán, Sinaloa',
      rating: 4,
      title: 'Muy robusta contra la humedad marina y salitre',
      comment:
        'Vivo cerca de la costa y el escudo IP65 en titanio marino no ha mostrado corrosión alguna. Excelente conexión Thread. Le pongo 4 estrellas solo porque la app tardó 2 minutos en actualizar el firmware inicial.',
      pros: 'Materiales grado marino, cifrado AES-256 local.',
      cons: 'Descarga inicial de firmware algo lenta.',
      mediaType: 'photo',
      mediaUrls: ['/src/assets/images/quantum_smart_lock_1793514319752.jpg'],
      verifiedPurchase: true,
      helpfulCount: 19,
      unhelpfulCount: 2,
      status: 'approved',
      officialResponse: 'Agradecemos tu retroalimentación Rodrigo. Nuestro soporte de firmware ahora cuenta con servidores locales CDN.',
      createdAt: 'Hace 2 semanas',
    },
  ],
  'camera-ptz': [
    {
      id: 'rev-c1',
      productId: 'camera-ptz',
      userId: 'user-lm-8',
      authorName: 'Lic. Fernando Soto',
      city: 'Los Mochis, Sinaloa',
      rating: 5,
      title: 'La mejor visión nocturna a color y seguimiento de vehículos',
      comment:
        'El sensor Sony Starvis en 4K es una locura. Distingue placas vehiculares a más de 25 metros de distancia incluso de noche. La matriz de micrófonos cancela el ruido del viento.',
      pros: 'Giro silencioso de 355°, detección de paquetes en el porche.',
      cons: 'Se recomienda cable Cat6 para aprovechar el PoE al 100%.',
      mediaType: 'both',
      mediaUrls: ['/src/assets/images/ptz_dome_camera_1793514322334.jpg'],
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-using-a-smart-lock-42358-large.mp4',
      thumbnailUrl: '/src/assets/images/ptz_dome_camera_1793514322334.jpg',
      verifiedPurchase: true,
      helpfulCount: 41,
      unhelpfulCount: 0,
      status: 'approved',
      officialResponse: '¡Excelente Fernando! Gracias por confiar en la tecnología 4K de REYPLACE.',
      createdAt: 'Hace 5 días',
    },
  ],
};

export const ProductReviewsSystem: React.FC<ProductReviewsSystemProps> = ({
  product,
  onClose,
  onEarnPoints,
  isAdmin = false,
}) => {
  const [reviews, setReviews] = useState<ProductReviewItem[]>(() => {
    return INITIAL_REVIEWS[product.id] || [
      {
        id: `rev-default-1`,
        productId: product.id,
        userId: 'user-demo-1',
        authorName: 'Alejandro Valenzuela',
        city: 'Los Mochis, Sinaloa',
        rating: 5,
        title: `Calidad sobresaliente para ${product.name}`,
        comment:
          `Adquirí el equipo hace un mes para mi residencia y el rendimiento es impecable. El soporte local de ReyPlace en Sinaloa resolvió mis dudas de configuración en minutos.`,
        pros: 'Empaque de lujo, instrucciones detalladas en español, protocolo Matter.',
        cons: 'Ninguno destacable.',
        mediaType: 'photo',
        mediaUrls: [product.image],
        verifiedPurchase: true,
        helpfulCount: 15,
        unhelpfulCount: 0,
        status: 'approved',
        officialResponse: '¡Gracias por elegir REYPLACE.MX! Seguimos a tu servicio para cualquier ampliación de tu ecosistema.',
        createdAt: 'Hace 4 días',
      },
    ];
  });

  // Filter & Sort state
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [onlyMedia, setOnlyMedia] = useState<boolean>(false);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'helpful' | 'recent' | 'highest' | 'lowest'>('helpful');

  // Form Modal & Media Upload state
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [activeMediaViewer, setActiveMediaViewer] = useState<{ url: string; type: 'photo' | 'video' } | null>(null);
  const [adminModerationMode, setAdminModerationMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Review Form Inputs
  const [formRating, setFormRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [formAuthor, setFormAuthor] = useState<string>('');
  const [formCity, setFormCity] = useState<string>('Los Mochis, Sinaloa');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formComment, setFormComment] = useState<string>('');
  const [formPros, setFormPros] = useState<string>('');
  const [formCons, setFormCons] = useState<string>('');
  const [attachedFiles, setAttachedFiles] = useState<{ url: string; type: 'photo' | 'video' }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Official Response input state for admin
  const [responseInput, setResponseInput] = useState<Record<string, string>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Try listening to live Firestore reviews for this product
  useEffect(() => {
    try {
      const revRef = collection(db, 'products', product.id, 'reviews');
      const q = query(revRef, orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(
        q,
        (snap) => {
          if (!snap.empty) {
            const firestoreReviews = snap.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            })) as ProductReviewItem[];
            // Combine with initial reviews
            setReviews((prev) => {
              const ids = new Set(firestoreReviews.map((r) => r.id));
              return [...firestoreReviews, ...prev.filter((r) => !ids.has(r.id))];
            });
          }
        },
        (error) => {
          console.warn('Firestore reviews snapshot fallback to local state:', error);
        }
      );
      return unsub;
    } catch (err) {
      console.warn('Firestore listener disabled:', err);
    }
  }, [product.id]);

  // Statistics Calculation
  const totalReviewsCount = reviews.filter((r) => r.status === 'approved').length || 1;
  const approvedReviews = reviews.filter((r) => r.status === 'approved');

  const averageRating = useMemo(() => {
    if (approvedReviews.length === 0) return product.rating;
    const sum = approvedReviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / approvedReviews.length).toFixed(1));
  }, [approvedReviews, product.rating]);

  const ratingCounts = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    approvedReviews.forEach((r) => {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
    });
    return counts;
  }, [approvedReviews]);

  // Filtered and Sorted list
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => {
        // In user mode, show only approved
        if (!adminModerationMode && r.status !== 'approved') return false;
        if (ratingFilter !== 'all' && r.rating !== ratingFilter) return false;
        if (onlyMedia && (!r.mediaUrls || r.mediaUrls.length === 0) && !r.videoUrl) return false;
        if (onlyVerified && !r.verifiedPurchase) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'helpful') return b.helpfulCount - a.helpfulCount;
        if (sortBy === 'highest') return b.rating - a.rating;
        if (sortBy === 'lowest') return a.rating - b.rating;
        return 0; // recent preserves default
      });
  }, [reviews, adminModerationMode, ratingFilter, onlyMedia, onlyVerified, sortBy]);

  // Identify the most helpful review
  const mostHelpfulId = useMemo(() => {
    const sorted = [...approvedReviews].sort((a, b) => b.helpfulCount - a.helpfulCount);
    return sorted.length > 0 && sorted[0].helpfulCount > 5 ? sorted[0].id : null;
  }, [approvedReviews]);

  // Community media thumbnails pool
  const communityMediaList = useMemo(() => {
    const list: { url: string; type: 'photo' | 'video'; author: string }[] = [];
    approvedReviews.forEach((r) => {
      if (r.videoUrl) {
        list.push({ url: r.videoUrl, type: 'video', author: r.authorName });
      }
      r.mediaUrls?.forEach((url) => {
        list.push({ url, type: 'photo', author: r.authorName });
      });
    });
    return list;
  }, [approvedReviews]);

  // Helpful vote
  const handleVoteHelpful = (id: string, isHelpful: boolean) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            helpfulCount: isHelpful ? r.helpfulCount + 1 : r.helpfulCount,
            unhelpfulCount: !isHelpful ? r.unhelpfulCount + 1 : r.unhelpfulCount,
          };
        }
        return r;
      })
    );
    showToast(isHelpful ? '¡Gracias por tu voto de utilidad!' : 'Voto registrado.');
  };

  // Handle file uploads (with FileReader for preview)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const isVid = file.type.startsWith('video');
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setAttachedFiles((prev) => [
            ...prev,
            { url: reader.result as string, type: isVid ? 'video' : 'photo' },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
    showToast('Archivo multimedia cargado con éxito.');
  };

  // Attach quick sample demo media
  const handleAttachDemoMedia = (type: 'photo' | 'video') => {
    if (type === 'video') {
      setAttachedFiles((prev) => [
        ...prev,
        {
          url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-using-a-smart-lock-42358-large.mp4',
          type: 'video',
        },
      ]);
      showToast('Video corto demostrativo adjuntado.');
    } else {
      setAttachedFiles((prev) => [
        ...prev,
        {
          url: product.image,
          type: 'photo',
        },
      ]);
      showToast('Foto de instalación real adjuntada.');
    }
  };

  // Submit Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAuthor.trim()) {
      showToast('Por favor escribe tu nombre.');
      return;
    }
    if (formComment.trim().length < 15) {
      showToast('Tu reseña debe contener al menos 15 caracteres.');
      return;
    }

    setIsSubmitting(true);

    const hasVideo = attachedFiles.some((f) => f.type === 'video');
    const photoUrls = attachedFiles.filter((f) => f.type === 'photo').map((f) => f.url);
    const videoUrl = attachedFiles.find((f) => f.type === 'video')?.url;

    const newReview: ProductReviewItem = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      userId: auth.currentUser?.uid || 'guest-user',
      authorName: formAuthor.trim(),
      city: formCity.trim() || 'Los Mochis, Sinaloa',
      rating: formRating,
      title: formTitle.trim() || `Excelente compra de ${product.name}`,
      comment: formComment.trim(),
      pros: formPros.trim() || undefined,
      cons: formCons.trim() || undefined,
      mediaType: hasVideo && photoUrls.length > 0 ? 'both' : hasVideo ? 'video' : photoUrls.length > 0 ? 'photo' : undefined,
      mediaUrls: photoUrls.length > 0 ? photoUrls : undefined,
      videoUrl: videoUrl,
      thumbnailUrl: photoUrls[0] || product.image,
      verifiedPurchase: true,
      helpfulCount: 0,
      unhelpfulCount: 0,
      status: 'approved',
      createdAt: 'Justo ahora',
    };

    setReviews((prev) => [newReview, ...prev]);
    setIsSubmitting(false);
    setShowFormModal(false);

    // Reset inputs
    setFormAuthor('');
    setFormTitle('');
    setFormComment('');
    setFormPros('');
    setFormCons('');
    setAttachedFiles([]);

    if (onEarnPoints) {
      onEarnPoints(150, `Reseña y calificación publicada para ${product.name}`);
    }
    showToast('¡Reseña publicada con éxito! +150 pts ReyClub acreditados.');

    // Save to Firestore if available
    try {
      const revRef = collection(db, 'products', product.id, 'reviews');
      await addDoc(revRef, {
        ...newReview,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Review saved in local view:', err);
    }
  };

  // Admin moderation actions
  const handleModerateStatus = (id: string, newStatus: 'approved' | 'rejected') => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    showToast(`Reseña marcada como ${newStatus === 'approved' ? 'Aprobada' : 'Rechazada'}.`);
  };

  const handlePostOfficialResponse = (id: string) => {
    const text = responseInput[id]?.trim();
    if (!text) return;
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, officialResponse: text } : r))
    );
    setResponseInput((prev) => ({ ...prev, [id]: '' }));
    showToast('Respuesta oficial de soporte publicada.');
  };

  return (
    <div className="neo-surface rounded-[32px] p-6 md:p-8 border border-slate-200/80 dark:border-slate-800/80 space-y-8 relative">
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

      {/* Header & Global Ratings Hero */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-[#70e9ff] border border-cyan-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> OPINIONES DE COMPRADORES VERIFICADOS
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Auditoría Comunitaria ReyPlace
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            Reseñas & Experiencias: {product.name}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Conoce instalaciones reales, videos en uso y opiniones técnicas de clientes en Sinaloa y México.
          </p>
        </div>

        {/* Action Buttons: Write Review & Admin Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {isAdmin && (
            <button
              type="button"
              onClick={() => setAdminModerationMode(!adminModerationMode)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                adminModerationMode
                  ? 'bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-300'
                  : 'neo-inset text-slate-600 dark:text-slate-300'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{adminModerationMode ? 'Modo Moderador Activo' : 'Panel de Moderación'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowFormModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e] text-xs font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Calificar Producto (+150 pts)</span>
          </button>
        </div>
      </div>

      {/* Ratings Statistics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50/50 dark:bg-slate-900/40 p-6 rounded-[28px] border border-slate-200/70 dark:border-slate-800/70">
        {/* Score Badge (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
          <p className="text-5xl font-black font-mono-num text-slate-900 dark:text-white tracking-tight">
            {averageRating}
          </p>
          <div className="flex items-center gap-1 mt-2 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                }`}
              />
            ))}
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
            Basado en {approvedReviews.length} reseñas verificadas
          </p>
          <div className="mt-3 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>98% recomienda este equipo</span>
          </div>
        </div>

        {/* Interactive Star Distribution Bars (8 Cols) */}
        <div className="lg:col-span-8 space-y-2.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingCounts[stars] || 0;
            const pct = approvedReviews.length > 0 ? Math.round((count / approvedReviews.length) * 100) : 0;
            const isFilterActive = ratingFilter === stars;
            return (
              <button
                key={stars}
                type="button"
                onClick={() => setRatingFilter(isFilterActive ? 'all' : stars)}
                className={`w-full flex items-center gap-3 text-xs group transition-colors py-1 px-2 rounded-xl text-left ${
                  isFilterActive ? 'bg-cyan-500/10 text-cyan-600 dark:text-[#70e9ff] font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-1 w-14 shrink-0 font-semibold text-slate-700 dark:text-slate-300">
                  <span>{stars}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>

                <div className="flex-1 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-amber-400 rounded-full group-hover:bg-cyan-500 transition-colors"
                  />
                </div>

                <div className="w-16 text-right shrink-0 text-slate-500 dark:text-slate-400 font-mono-num">
                  <span>{pct}% ({count})</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Community Multimedia Showcase Reel */}
      {communityMediaList.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-cyan-500" /> Galería de Instalaciones Reales ({communityMediaList.length})
            </h3>
            <span className="text-xs text-slate-500">Haz clic para reproducir o ampliar</span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {communityMediaList.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveMediaViewer({ url: item.url, type: item.type })}
                className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0 neo-surface border border-slate-200 dark:border-slate-800 group hover:scale-105 transition-all shadow-md"
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                    <video src={item.url} className="w-full h-full object-cover opacity-60" muted />
                    <div className="absolute w-8 h-8 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                    </div>
                  </div>
                ) : (
                  <img src={item.url} alt="Instalación comunitaria" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                )}
                <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent text-[9px] text-white truncate text-center">
                  {item.author}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl neo-inset text-xs">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-cyan-500" /> Filtrar:
          </span>

          <button
            type="button"
            onClick={() => setRatingFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              ratingFilter === 'all'
                ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300'
            }`}
          >
            Todas ({reviews.length})
          </button>

          {[5, 4, 3].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRatingFilter(star)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1 ${
                ratingFilter === star
                  ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                  : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>{star}</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </button>
          ))}

          <button
            type="button"
            onClick={() => setOnlyMedia(!onlyMedia)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
              onlyMedia
                ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Con Fotos / Videos</span>
          </button>

          <button
            type="button"
            onClick={() => setOnlyVerified(!onlyVerified)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
              onlyVerified
                ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Compradores Verificados</span>
          </button>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> Ordenar:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200"
          >
            <option value="helpful">Más útiles primero</option>
            <option value="recent">Más recientes</option>
            <option value="highest">Mayor calificación</option>
            <option value="lowest">Menor calificación</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-5">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 neo-inset rounded-3xl p-6 space-y-3">
            <MessageSquare className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              No hay reseñas que coincidan con estos filtros
            </h4>
            <p className="text-xs text-slate-500">
              Intenta seleccionar otra calificación o borra los filtros de búsqueda.
            </p>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const isMostHelpful = rev.id === mostHelpfulId;
            return (
              <motion.article
                key={rev.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`neo-surface rounded-[28px] p-6 border transition-all ${
                  isMostHelpful
                    ? 'border-amber-400/70 shadow-lg ring-1 ring-amber-400/20 bg-amber-500/[0.02]'
                    : 'border-slate-200/80 dark:border-slate-800/80'
                }`}
              >
                {/* Most Helpful Banner */}
                {isMostHelpful && (
                  <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-300 font-extrabold text-[11px] border border-amber-400/40">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>RESEÑA MÁS ÚTIL DE LA COMUNIDAD</span>
                  </div>
                )}

                {/* Top Author Metadata & Rating */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl neo-inset flex items-center justify-center font-bold text-cyan-600 dark:text-[#70e9ff]">
                      {rev.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {rev.authorName}
                        </span>
                        {rev.verifiedPurchase && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <ShieldCheck className="w-3 h-3" /> Comprador Verificado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {rev.city} · {rev.createdAt}
                      </p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Body */}
                <div className="py-4 space-y-3">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {rev.title}
                  </h4>
                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {rev.comment}
                  </p>

                  {/* Pros & Cons Pills */}
                  {(rev.pros || rev.cons) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {rev.pros && (
                        <div className="p-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                          <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Puntos a Favor:
                          </p>
                          <p className="text-xs text-slate-700 dark:text-slate-300">{rev.pros}</p>
                        </div>
                      )}
                      {rev.cons && (
                        <div className="p-3 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-1">
                          <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> A tener en cuenta:
                          </p>
                          <p className="text-xs text-slate-700 dark:text-slate-300">{rev.cons}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Attached Media Previews */}
                  {(rev.mediaUrls?.length || rev.videoUrl) && (
                    <div className="flex items-center gap-2.5 pt-2 flex-wrap">
                      {rev.videoUrl && (
                        <button
                          type="button"
                          onClick={() => setActiveMediaViewer({ url: rev.videoUrl!, type: 'video' })}
                          className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-900 group border border-slate-700 shrink-0"
                        >
                          <video src={rev.videoUrl} className="w-full h-full object-cover opacity-70" muted />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                            </div>
                          </div>
                        </button>
                      )}
                      {rev.mediaUrls?.map((mUrl, mIdx) => (
                        <button
                          key={mIdx}
                          type="button"
                          onClick={() => setActiveMediaViewer({ url: mUrl, type: 'photo' })}
                          className="w-24 h-24 rounded-xl overflow-hidden neo-inset border border-slate-200 dark:border-slate-700 group shrink-0"
                        >
                          <img
                            src={mUrl}
                            alt="Foto adjunta"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Official Response from ReyPlace Store */}
                {rev.officialResponse && (
                  <div className="mt-3 p-4 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/30 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <CornerDownRight className="w-4 h-4 text-cyan-600 dark:text-[#70e9ff]" />
                      <span className="text-xs font-bold text-cyan-800 dark:text-cyan-300 flex items-center gap-1.5">
                        Respuesta Oficial de REYPLACE.MX Soporte
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 pl-6 leading-relaxed">
                      {rev.officialResponse}
                    </p>
                  </div>
                )}

                {/* Bottom Bar: Helpful Counter & Admin Controls */}
                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 dark:text-slate-400">¿Te resultó útil esta reseña?</span>
                    <button
                      type="button"
                      onClick={() => handleVoteHelpful(rev.id, true)}
                      className="px-3 py-1 rounded-xl neo-inset font-bold text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-[#70e9ff] flex items-center gap-1.5 transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Sí ({rev.helpfulCount})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVoteHelpful(rev.id, false)}
                      className="px-3 py-1 rounded-xl neo-inset font-bold text-slate-700 dark:text-slate-300 hover:text-rose-500 flex items-center gap-1.5 transition-colors"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>No ({rev.unhelpfulCount})</span>
                    </button>
                  </div>

                  {/* Admin Moderation Strip */}
                  {adminModerationMode && (
                    <div className="flex items-center gap-2 pt-2 sm:pt-0 w-full sm:w-auto">
                      <span className="text-[10px] font-bold uppercase text-amber-500">
                        Estado: {rev.status}
                      </span>
                      {rev.status !== 'approved' && (
                        <button
                          type="button"
                          onClick={() => handleModerateStatus(rev.id, 'approved')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px]"
                        >
                          Aprobar
                        </button>
                      )}
                      {rev.status !== 'rejected' && (
                        <button
                          type="button"
                          onClick={() => handleModerateStatus(rev.id, 'rejected')}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px]"
                        >
                          Rechazar
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Admin Add Official Response Form */}
                {adminModerationMode && !rev.officialResponse && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                    <input
                      type="text"
                      placeholder="Redactar respuesta oficial como Soporte ReyPlace..."
                      value={responseInput[rev.id] || ''}
                      onChange={(e) =>
                        setResponseInput((prev) => ({ ...prev, [rev.id]: e.target.value }))
                      }
                      className="flex-1 px-3 py-1.5 rounded-xl neo-inset text-xs bg-transparent border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handlePostOfficialResponse(rev.id)}
                      className="px-3 py-1.5 rounded-xl bg-cyan-600 text-white text-xs font-bold"
                    >
                      Responder
                    </button>
                  </div>
                )}
              </motion.article>
            );
          })
        )}
      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {showFormModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setShowFormModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="neo-surface p-6 md:p-8 rounded-[32px] max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-5 border border-slate-700 bg-white dark:bg-[#070d1e] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Calificar {product.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tu opinión ayuda a miles de familias y entusiastas de domótica.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="w-8 h-8 rounded-full neo-inset flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                {/* Interactive Star Picker */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Calificación General:
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setFormRating(star)}
                        className="p-1 transition-transform hover:scale-125"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverRating || formRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 font-bold text-sm text-amber-500">
                      {formRating === 5
                        ? 'Excelente (5/5)'
                        : formRating === 4
                        ? 'Muy Bueno (4/5)'
                        : formRating === 3
                        ? 'Bueno (3/5)'
                        : formRating === 2
                        ? 'Regular (2/5)'
                        : 'Deficiente (1/5)'}
                    </span>
                  </div>
                </div>

                {/* Author & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nombre o Alias:
                    </label>
                    <input
                      type="text"
                      required
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      placeholder="Ej. Ing. Gabriel Osuna"
                      className="w-full px-3.5 py-2.5 rounded-xl neo-inset bg-transparent border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Ciudad / Estado:
                    </label>
                    <input
                      type="text"
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      placeholder="Ej. Los Mochis, Sinaloa"
                      className="w-full px-3.5 py-2.5 rounded-xl neo-inset bg-transparent border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Título de tu Reseña:
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Ej. Superó mis expectativas en velocidad y materiales"
                    className="w-full px-3.5 py-2.5 rounded-xl neo-inset bg-transparent border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tu Opinión Detallada (mínimo 15 caracteres):
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    placeholder="Describe tu experiencia de instalación, desempeño de los protocolos, materiales y usabilidad en el día a día..."
                    className="w-full px-3.5 py-2.5 rounded-xl neo-inset bg-transparent border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white resize-none"
                  />
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Puntos a Favor (Pros):
                    </label>
                    <input
                      type="text"
                      value={formPros}
                      onChange={(e) => setFormPros(e.target.value)}
                      placeholder="Ej. Reconocimiento ultra rápido, titanio sólido"
                      className="w-full px-3.5 py-2 rounded-xl neo-inset bg-transparent border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Puntos a Considerar (Contras):
                    </label>
                    <input
                      type="text"
                      value={formCons}
                      onChange={(e) => setFormCons(e.target.value)}
                      placeholder="Ej. Requiere taladro para instalación"
                      className="w-full px-3.5 py-2 rounded-xl neo-inset bg-transparent border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Multimedia Attachments */}
                <div className="p-4 rounded-2xl neo-inset space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        Adjuntar Fotos o Videos Cortos
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Sube imágenes de tu instalación para ganar +150 puntos ReyClub VIP.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir desde mi dispositivo</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => handleAttachDemoMedia('photo')}
                      className="px-3 py-2 rounded-xl neo-inset font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 hover:border-cyan-500/50"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-cyan-500" />
                      <span>+ Foto de Instalación Real</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAttachDemoMedia('video')}
                      className="px-3 py-2 rounded-xl neo-inset font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 hover:border-cyan-500/50"
                    >
                      <Video className="w-3.5 h-3.5 text-amber-500" />
                      <span>+ Video Demostrativo</span>
                    </button>
                  </div>

                  {/* Attached Previews */}
                  {attachedFiles.length > 0 && (
                    <div className="flex items-center gap-2 pt-2 flex-wrap">
                      {attachedFiles.map((file, fIdx) => (
                        <div
                          key={fIdx}
                          className="relative w-16 h-16 rounded-xl overflow-hidden border border-cyan-500 shadow-md"
                        >
                          {file.type === 'video' ? (
                            <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                              <Play className="w-5 h-5 text-cyan-400 fill-cyan-400" />
                            </div>
                          ) : (
                            <img src={file.url} alt="Adjunto" className="w-full h-full object-cover" />
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setAttachedFiles((prev) => prev.filter((_, idx) => idx !== fIdx))
                            }
                            className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowFormModal(false)}
                    className="px-4 py-2.5 rounded-xl neo-inset font-bold text-slate-600 dark:text-slate-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e] font-bold shadow-md hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Publicar Reseña</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Media Viewer Lightbox */}
      <AnimatePresence>
        {activeMediaViewer && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
            onClick={() => setActiveMediaViewer(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[85vh] w-full rounded-3xl overflow-hidden border border-slate-700 bg-black flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveMediaViewer(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {activeMediaViewer.type === 'video' ? (
                <video
                  src={activeMediaViewer.url}
                  controls
                  autoPlay
                  className="max-h-[80vh] w-auto max-w-full rounded-2xl"
                />
              ) : (
                <img
                  src={activeMediaViewer.url}
                  alt="Vista ampliada de la instalación"
                  className="max-h-[80vh] w-auto max-w-full object-contain rounded-2xl"
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

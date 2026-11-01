import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Video,
  Play,
  Star,
  CheckCircle2,
  MapPin,
  Upload,
  Plus,
  X,
  Sparkles,
  ShieldCheck,
  User,
} from 'lucide-react';
import { Product } from '../data/products';

export interface ARVideoReview {
  id: string;
  productId: string;
  authorName: string;
  city: string;
  rating: number;
  comment: string;
  videoUrl: string;
  thumbnailUrl: string;
  verifiedPurchase: boolean;
  date: string;
  likesCount: number;
}

export const INITIAL_AR_REVIEWS: ARVideoReview[] = [
  {
    id: 'rev-1',
    productId: 'lock-quantum',
    authorName: 'Alejandro Valenzuela',
    city: 'Los Mochis, Sinaloa',
    rating: 5,
    comment: 'Instalado en la entrada principal de mi residencia en Los Mochis. El reconocimiento facial 3D es instantáneo y la estética de titanio luce impecable.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-using-a-smart-lock-42358-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
    verifiedPurchase: true,
    date: 'Hace 2 días',
    likesCount: 38,
  },
  {
    id: 'rev-2',
    productId: 'camera-ptz',
    authorName: 'Sofía Montaño',
    city: 'Culiacán, Sinaloa',
    rating: 5,
    comment: 'La visión nocturna a color de la PTZ 4K capta cada detalle del jardín. Excelente cobertura Matter sin pérdida de señal.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-security-camera-recording-in-a-hallway-42359-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
    verifiedPurchase: true,
    date: 'Hace 5 días',
    likesCount: 24,
  },
  {
    id: 'rev-3',
    productId: 'hub-matter',
    authorName: 'Carlos Mendívil',
    city: 'Los Mochis, Sinaloa',
    rating: 5,
    comment: 'El Hub Matter centralizó mis 45 dispositivos inteligentes sin latencia. Muy fácil de configurar con Google Home.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-smart-home-control-panel-animation-42360-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    verifiedPurchase: true,
    date: 'Hace 1 semana',
    likesCount: 45,
  },
];

interface ARVideoReviewsModalProps {
  product: Product;
  reviews: ARVideoReview[];
  onAddReview: (review: ARVideoReview) => void;
  onClose: () => void;
  onTriggerToast: (msg: string) => void;
}

export const ARVideoReviewsModal: React.FC<ARVideoReviewsModalProps> = ({
  product,
  reviews,
  onAddReview,
  onClose,
  onTriggerToast,
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'record'>('browse');
  const [selectedVideo, setSelectedVideo] = useState<ARVideoReview | null>(
    reviews.find((r) => r.productId === product.id) || reviews[0] || null
  );

  // New review form state
  const [authorName, setAuthorName] = useState('');
  const [city, setCity] = useState('Los Mochis, Sinaloa');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) {
      onTriggerToast('Por favor completa tu nombre y tu opinión.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newRev: ARVideoReview = {
        id: `rev-${Date.now()}`,
        productId: product.id,
        authorName: authorName.trim(),
        city: city.trim(),
        rating,
        comment: comment.trim(),
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-using-a-smart-lock-42358-large.mp4',
        thumbnailUrl: product.image,
        verifiedPurchase: true,
        date: 'Hace un momento',
        likesCount: 1,
      };
      onAddReview(newRev);
      setSelectedVideo(newRev);
      setIsSubmitting(false);
      setActiveTab('browse');
      setAuthorName('');
      setComment('');
      onTriggerToast('¡Reseña en RA publicada con éxito! +150 pts ReyClub acreditados.');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl neo-surface rounded-[32px] overflow-hidden border border-slate-700 shadow-2xl bg-[#070d1e] text-white flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neo-inset flex items-center justify-center text-cyan-400">
              <Video className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  Realidad Aumentada & Hologramas
                </span>
                <span className="text-xs text-slate-400">Experiencia Inmersiva REYPLACE</span>
              </div>
              <h2 className="text-lg font-bold text-white">Reseñas en RA: {product.name}</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl neo-inset flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="px-6 py-3 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'browse'
                  ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Ver Hologramas en RA ({productReviews.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('record')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeTab === 'record'
                  ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> Dejar Reseña en RA (+150 pts)
            </button>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Superpón la opinión del cliente junto al equipo en tu entorno
          </span>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {activeTab === 'browse' ? (
            <>
              {/* Left Column: Video Hologram Player Simulated in Room */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center group">
                  {selectedVideo ? (
                    <>
                      <video
                        src={selectedVideo.videoUrl}
                        poster={selectedVideo.thumbnailUrl}
                        controls
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      {/* AR Hologram Badge Overlay */}
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 flex items-center gap-2 text-xs font-bold text-cyan-400 shadow-lg">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Holograma RA Activo · {selectedVideo.city}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-8 text-slate-500">
                      <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Selecciona una reseña para visualizar el video holográfico en RA.</p>
                    </div>
                  )}
                </div>

                {selectedVideo && (
                  <div className="neo-surface p-5 rounded-2xl border border-slate-800 space-y-3 bg-slate-900/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
                          {selectedVideo.authorName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                            {selectedVideo.authorName}
                            {selectedVideo.verifiedPurchase && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </h4>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-cyan-400" /> {selectedVideo.city} · {selectedVideo.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span>{selectedVideo.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{selectedVideo.comment}"
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: List of AR Reviews */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Reseñas de la Comunidad en Los Mochis y México
                </h3>
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {productReviews.length === 0 ? (
                    <div className="p-8 text-center neo-surface rounded-2xl border border-slate-800">
                      <p className="text-xs text-slate-400">
                        Aún no hay reseñas en RA para este producto. ¡Sé el primero en compartir tu experiencia y gana +150 puntos ReyClub!
                      </p>
                    </div>
                  ) : (
                    productReviews.map((rev) => {
                      const isSelected = selectedVideo?.id === rev.id;
                      return (
                        <div
                          key={rev.id}
                          onClick={() => setSelectedVideo(rev)}
                          className={`p-4 rounded-2xl neo-surface border transition-all cursor-pointer flex gap-3 items-start ${
                            isSelected
                              ? 'border-cyan-500 bg-cyan-950/20 shadow-lg shadow-cyan-500/10'
                              : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
                          }`}
                        >
                          <img
                            src={rev.thumbnailUrl}
                            alt={rev.authorName}
                            className="w-16 h-16 object-cover rounded-xl shrink-0 border border-slate-700"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h5 className="font-bold text-xs text-white truncate">{rev.authorName}</h5>
                              <span className="text-[10px] text-amber-400 flex items-center gap-0.5">
                                <Star className="w-3 h-3 fill-amber-400" /> {rev.rating}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">{rev.city}</p>
                            <p className="text-xs text-slate-300 mt-1 line-clamp-2">{rev.comment}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="max-w-xl mx-auto w-full py-4 space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-white">Comparte tu experiencia instalada en casa</h3>
                <p className="text-xs text-slate-400">
                  Graba o sube un video corto de {product.name} instalado en tu hogar para ayudar a otros usuarios y obtén <span className="text-cyan-400 font-bold">+150 puntos ReyClub</span>.
                </p>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4 neo-surface p-6 rounded-3xl border border-slate-800 bg-slate-900/60">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tu Nombre</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Ej. Roberto Sánchez"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ciudad y Estado</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ej. Los Mochis, Sinaloa"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Calificación (1 a 5 Estrellas)</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-2 rounded-xl transition-colors ${
                          rating >= star ? 'text-amber-400 bg-amber-400/10' : 'text-slate-600 bg-slate-950'
                        }`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-amber-400 ml-2">{rating}.0 Estrellas</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tu Opinión e Instalación</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe cómo fue la instalación y cómo funciona en tu casa..."
                    rows={3}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-dashed border-slate-700 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-white">Video Corto de Demostración en RA</p>
                  <p className="text-[11px] text-slate-400">Se adjuntará simulación de video optimizada para visor espacial</p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-500/20"
                >
                  {isSubmitting ? (
                    <span>Publicando Reseña en RA...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Publicar Reseña y Ganar +150 Puntos</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Reseñas verificadas con encriptación espacial REYPLACE</span>
          </div>
          <span className="font-mono text-cyan-400">Matter AR Hologram Engine</span>
        </div>
      </motion.div>
    </div>
  );
};

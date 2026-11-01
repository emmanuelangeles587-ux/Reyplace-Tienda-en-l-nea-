import { Product, ProtocolType } from '../data/products';

export interface UserBehaviorContext {
  viewedProductIds: string[];
  purchasedProductIds: string[];
  simulatorInteractedIds: string[];
  cartProductIds: string[];
  preferredProtocols: ProtocolType[];
}

export interface ScoredRecommendation {
  product: Product;
  score: number;
  reason: string;
}

// Collaborative co-occurrence matrix derived from Smart Home bundle affinities
const COLLABORATIVE_BUNDLES: Record<string, Record<string, number>> = {
  'lock-quantum': { 'hub-matter': 0.94, 'camera-ptz': 0.88, 'sensor-iot': 0.76 },
  'camera-ptz': { 'wifi7-mesh': 0.91, 'lock-quantum': 0.85, 'kit-enterprise': 0.79 },
  'hub-matter': { 'bulb-rgb': 0.93, 'sensor-iot': 0.9, 'lock-quantum': 0.84 },
  'bulb-rgb': { 'hub-matter': 0.92, 'sensor-iot': 0.87, 'wifi7-mesh': 0.65 },
  'wifi7-mesh': { 'camera-ptz': 0.89, 'kit-enterprise': 0.86, 'hub-matter': 0.78 },
  'sensor-iot': { 'hub-matter': 0.95, 'bulb-rgb': 0.84, 'lock-quantum': 0.77 },
  'kit-enterprise': { 'wifi7-mesh': 0.93, 'hub-matter': 0.8, 'sensor-iot': 0.74 },
};

export const computeRecommendations = (
  allProducts: Product[],
  ctx: UserBehaviorContext,
  limit = 3,
  anchorProduct?: Product | null
): ScoredRecommendation[] => {
  const activeSignals = new Set([
    ...ctx.viewedProductIds,
    ...ctx.purchasedProductIds,
    ...ctx.simulatorInteractedIds,
    ...ctx.cartProductIds,
  ]);

  const candidates = allProducts.filter(
    (p) => !ctx.cartProductIds.includes(p.id) && p.id !== anchorProduct?.id
  );

  const scored: ScoredRecommendation[] = candidates.map((candidate) => {
    let score = candidate.rating * 10;
    let reason = 'Alta valoración en proyectos residenciales Matter';

    // 1. Anchor Product Similarity (Product Detail Modal context)
    if (anchorProduct) {
      if (anchorProduct.relatedIds.includes(candidate.id)) {
        score += 42;
        reason = `Complemento directo para ${anchorProduct.name}`;
      }
      const sharedProtos = candidate.compatibility.filter((c) =>
        anchorProduct.compatibility.includes(c)
      );
      score += sharedProtos.length * 6;
    }

    // 2. Collaborative Filtering from Cart & Past Purchases
    for (const signalId of activeSignals) {
      const affinity = COLLABORATIVE_BUNDLES[signalId]?.[candidate.id] || 0;
      if (affinity > 0) {
        score += affinity * 38;
        const sourceProd = allProducts.find((item) => item.id === signalId);
        if (sourceProd && !anchorProduct) {
          reason = `Frecuentemente integrado junto con ${sourceProd.name}`;
        }
      }
    }

    // 3. Content-Based Filtering from Smart Home Simulator & Filter Preferences
    if (ctx.simulatorInteractedIds.includes(candidate.id)) {
      score += 26;
      reason = 'Probado en tu Simulador de Hogar Inteligente';
    }

    if (ctx.preferredProtocols.length > 0) {
      const matchingProtos = candidate.compatibility.filter((p) =>
        ctx.preferredProtocols.includes(p)
      );
      if (matchingProtos.length > 0) {
        score += matchingProtos.length * 14;
        reason = `Compatible con tu filtro ${matchingProtos[0]}`;
      }
    }

    return { product: candidate, score, reason };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
};

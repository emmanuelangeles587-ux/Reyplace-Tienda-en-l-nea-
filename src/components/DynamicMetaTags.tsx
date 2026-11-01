import React, { useEffect } from 'react';
import { Product } from '../data/products';

interface DynamicMetaTagsProps {
  selectedCategory: string;
  detailProduct: Product | null;
}

export const DynamicMetaTags: React.FC<DynamicMetaTagsProps> = ({
  selectedCategory,
  detailProduct,
}) => {
  useEffect(() => {
    let title = 'REYPLACE.MX · Smart Home & Seguridad en Los Mochis, Sinaloa';
    let description =
      'Tienda líder en Smart Home, automatización y seguridad inteligente en Los Mochis, Sinaloa, México. Cámaras 4K, cerraduras biométricas, Matter, Zigbee y Apple HomeKit.';

    if (detailProduct) {
      title = `${detailProduct.name} | REYPLACE.MX Los Mochis`;
      description = `${detailProduct.description} - Precio: $${detailProduct.price.toLocaleString()} MXN. Envío express y garantía en Los Mochis, Sinaloa.`;
    } else if (selectedCategory && selectedCategory !== 'all') {
      title = `Catálogo de ${selectedCategory} | REYPLACE.MX Los Mochis`;
      description = `Explora los mejores dispositivos de ${selectedCategory} con compatibilidad Matter y Apple HomeKit en Los Mochis, Sinaloa.`;
    }

    document.title = title;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description);
    }
  }, [selectedCategory, detailProduct]);

  return null;
};

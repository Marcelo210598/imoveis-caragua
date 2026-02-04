'use client';

import Link from 'next/link';
import { Bed, Bath, Car, Maximize, Heart } from 'lucide-react';
import { Property } from '@/types/property';
import { formatPrice, formatArea } from '@/lib/utils';
import { useFavorites } from '@/components/favorites/FavoritesProvider';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import DealBadge from './DealBadge';
import LoginModal from './auth/LoginModal';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { data: session } = useSession();
  const { isFavorited, toggle } = useFavorites();
  const [loginOpen, setLoginOpen] = useState(false);

  const imgSrc =
    property.photos && property.photos.length > 0
      ? property.photos[0].url
      : null;

  const propertySlug = property.externalId || property.id;
  const favorited = isFavorited(property.id);

  function handleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      setLoginOpen(true);
      return;
    }

    toggle(property.id);
  }

  return (
    <>
      <Link href={`/imoveis/${encodeURIComponent(propertySlug)}`}>
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 card-hover cursor-pointer">
          {/* Image */}
          <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800 overflow-hidden">
            {imgSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imgSrc}
                alt={property.title || 'Imovel'}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Maximize size={48} />
              </div>
            )}

            {/* Deal badge */}
            {property.dealScore >= 60 && (
              <div className="absolute top-3 right-3">
                <DealBadge score={property.dealScore} />
              </div>
            )}

            {/* Source badge */}
            <div className="absolute top-3 left-3">
              <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {property.source}
              </span>
            </div>

            {/* Favorite button */}
            <button
              onClick={handleFavorite}
              className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-200 ${
                favorited
                  ? 'bg-red-50 text-red-500 hover:bg-red-100 scale-110'
                  : 'bg-white/80 text-gray-400 hover:text-red-400 hover:bg-white'
              }`}
              aria-label={favorited ? 'Remover dos favoritos' : 'Favoritar'}
            >
              <Heart
                size={18}
                fill={favorited ? 'currentColor' : 'none'}
              />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {formatPrice(property.price)}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 min-h-[2.5rem]">
              {property.title || `${property.propertyType} em ${property.city}`}
            </p>

            <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-3">
              {property.neighborhood
                ? `${property.neighborhood}, ${property.city}`
                : property.city}
            </p>

            {/* Features */}
            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm">
              {property.bedrooms != null && (
                <span className="flex items-center gap-1">
                  <Bed size={16} />
                  {property.bedrooms}
                </span>
              )}
              {property.bathrooms != null && (
                <span className="flex items-center gap-1">
                  <Bath size={16} />
                  {property.bathrooms}
                </span>
              )}
              {property.parkingSpaces != null && (
                <span className="flex items-center gap-1">
                  <Car size={16} />
                  {property.parkingSpaces}
                </span>
              )}
              {property.area != null && (
                <span className="flex items-center gap-1">
                  <Maximize size={16} />
                  {formatArea(property.area)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

import Link from 'next/link';
import { Bed, Bath, Car, Maximize } from 'lucide-react';
import { Property } from '@/types/property';
import { formatPrice, formatArea } from '@/lib/utils';
import DealBadge from './DealBadge';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const imgSrc =
    property.photos && property.photos.length > 0
      ? property.photos[0].url
      : null;

  // Usar externalId para imoveis scraped, id para os criados por usuarios
  const propertySlug = property.externalId || property.id;

  return (
    <Link href={`/imoveis/${encodeURIComponent(propertySlug)}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover cursor-pointer">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
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
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {formatPrice(property.price)}
          </p>

          <p className="text-sm text-gray-500 line-clamp-2 mb-3 min-h-[2.5rem]">
            {property.title || `${property.propertyType} em ${property.city}`}
          </p>

          <p className="text-sm text-primary-600 font-medium mb-3">
            {property.neighborhood
              ? `${property.neighborhood}, ${property.city}`
              : property.city}
          </p>

          {/* Features */}
          <div className="flex items-center gap-4 text-gray-500 text-sm">
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
  );
}

"use client";

import Link from "next/link";
import {
  Bed,
  Bath,
  Car,
  Maximize,
  Heart,
  ArrowLeftRight,
  Sparkles,
} from "lucide-react";
import { Property } from "@/types/property";
import { formatPrice, formatArea } from "@/lib/utils";
import { cleanPropertyTitle } from "@/lib/titleCleaner";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import { useSession } from "next-auth/react";
import { useState } from "react";
import DealBadge from "./DealBadge";
import LoginModal from "./auth/LoginModal";
import ImageWithFallback from "./ImageWithFallback";

interface PropertyCardProps {
  property: Property;
  isComparing?: boolean;
  onToggleCompare?: () => void;
}

export default function PropertyCard({
  property,
  isComparing,
  onToggleCompare,
}: PropertyCardProps) {
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

  function handleCompare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onToggleCompare?.();
  }

  const cleanTitle = cleanPropertyTitle(
    property.title,
    property.propertyType,
    property.city,
  );

  return (
    <>
      <Link href={`/imoveis/${encodeURIComponent(propertySlug)}`}>
        <div
          className={`bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border card-hover cursor-pointer transition-all ${
            isComparing
              ? "border-primary-500 ring-2 ring-primary-200 dark:ring-primary-800"
              : (property as any).isFeatured
                ? "border-amber-200 dark:border-amber-800 ring-1 ring-amber-100 dark:ring-amber-900/40 shadow-md"
                : "border-gray-100 dark:border-gray-800"
          }`}
        >
          {/* Image */}
          <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800 overflow-hidden">
            {imgSrc ? (
              <ImageWithFallback
                src={imgSrc}
                alt={cleanTitle}
                className="w-full h-full object-cover"
                fallbackClassName="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Maximize size={48} />
              </div>
            )}

            {/* Highlighted/Featured badge */}
            {((property as any).highlighted ||
              (property as any).isFeatured) && (
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg border border-white/20">
                  <Sparkles size={12} className="text-yellow-200" />
                  Destaque
                </span>
              </div>
            )}

            {/* Deal badge */}
            {property.dealScore >= 60 && (
              <div className="absolute top-3 right-3">
                <DealBadge score={property.dealScore} />
              </div>
            )}

            {/* Source badge - Only show if NOT featured/highlighted to avoid clutter */}
            {!(
              (property as any).highlighted || (property as any).isFeatured
            ) && (
              <div className="absolute top-3 left-3">
                <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                  {property.source}
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div className="absolute bottom-3 right-3 flex gap-2">
              {/* Compare button */}
              {onToggleCompare && (
                <button
                  onClick={handleCompare}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isComparing
                      ? "bg-primary-500 text-white hover:bg-primary-600"
                      : "bg-white/80 text-gray-400 hover:text-primary-500 hover:bg-white"
                  }`}
                  aria-label={
                    isComparing ? "Remover da comparação" : "Comparar"
                  }
                  title="Comparar imóveis"
                >
                  <ArrowLeftRight size={16} />
                </button>
              )}

              {/* Favorite button */}
              <button
                onClick={handleFavorite}
                className={`p-2 rounded-full transition-all duration-200 ${
                  favorited
                    ? "bg-red-50 text-red-500 hover:bg-red-100 scale-110"
                    : "bg-white/80 text-gray-400 hover:text-red-400 hover:bg-white"
                }`}
                aria-label={favorited ? "Remover dos favoritos" : "Favoritar"}
              >
                <Heart size={18} fill={favorited ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {formatPrice(property.price)}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 min-h-[2.5rem]">
              {cleanTitle}
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

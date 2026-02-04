'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface FavoriteButtonProps {
  propertyId: string;
  isFavorited?: boolean;
  size?: number;
  className?: string;
  onAuthRequired?: () => void;
}

export default function FavoriteButton({
  propertyId,
  isFavorited = false,
  size = 20,
  className = '',
  onAuthRequired,
}: FavoriteButtonProps) {
  const { data: session } = useSession();
  const [favorited, setFavorited] = useState(isFavorited);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      onAuthRequired?.();
      return;
    }

    if (loading) return;

    setLoading(true);
    setAnimating(true);

    const newState = !favorited;
    setFavorited(newState);

    try {
      const res = await fetch(`/api/property/${propertyId}/favorite`, {
        method: newState ? 'POST' : 'DELETE',
      });

      if (!res.ok) {
        setFavorited(!newState); // Reverter
      }
    } catch {
      setFavorited(!newState); // Reverter
    } finally {
      setLoading(false);
      setTimeout(() => setAnimating(false), 300);
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      className={`p-2 rounded-full transition-all duration-200 ${
        favorited
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-white/80 text-gray-400 hover:text-red-400 hover:bg-white'
      } ${animating ? 'scale-125' : 'scale-100'} ${className}`}
      aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart
        size={size}
        fill={favorited ? 'currentColor' : 'none'}
        className="transition-all duration-200"
      />
    </button>
  );
}

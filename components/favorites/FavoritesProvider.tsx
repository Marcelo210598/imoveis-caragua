'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface FavoritesContextType {
  favoriteIds: Set<string>;
  isFavorited: (propertyId: string) => boolean;
  toggle: (propertyId: string) => Promise<void>;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favoriteIds: new Set(),
  isFavorited: () => false,
  toggle: async () => {},
  loading: false,
});

export function useFavorites() {
  return useContext(FavoritesContext);
}

export default function FavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Carregar favoritos quando usuario loga
  useEffect(() => {
    if (!session?.user?.id) {
      setFavoriteIds(new Set());
      return;
    }

    async function loadFavorites() {
      try {
        const res = await fetch('/api/user/favorites/ids');
        const data = await res.json();
        setFavoriteIds(new Set(data.ids || []));
      } catch {
        // Silencioso
      }
    }

    loadFavorites();
  }, [session?.user?.id]);

  const isFavorited = useCallback(
    (propertyId: string) => favoriteIds.has(propertyId),
    [favoriteIds]
  );

  const toggle = useCallback(
    async (propertyId: string) => {
      if (loading) return;
      setLoading(true);

      const wasFavorited = favoriteIds.has(propertyId);
      const newIds = new Set(favoriteIds);

      if (wasFavorited) {
        newIds.delete(propertyId);
      } else {
        newIds.add(propertyId);
      }
      setFavoriteIds(newIds);

      try {
        const res = await fetch(`/api/property/${propertyId}/favorite`, {
          method: wasFavorited ? 'DELETE' : 'POST',
        });

        if (!res.ok) {
          // Reverter
          setFavoriteIds(favoriteIds);
        }
      } catch {
        setFavoriteIds(favoriteIds);
      } finally {
        setLoading(false);
      }
    },
    [favoriteIds, loading]
  );

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isFavorited, toggle, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

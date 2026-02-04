'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Heart } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types/property';
import LoginModal from '@/components/auth/LoginModal';

export default function FavoritosPage() {
  const { data: session, status } = useSession();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      setLoading(false);
      return;
    }

    async function loadFavorites() {
      try {
        const res = await fetch('/api/user/favorites');
        const data = await res.json();
        setProperties(data.properties || []);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, [session, status]);

  if (status === 'loading' || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Meus Favoritos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Meus Favoritos</h1>
            <p className="text-gray-500 mb-6">
              Faca login para salvar seus imoveis favoritos.
            </p>
            <button
              onClick={() => setLoginOpen(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
            >
              Entrar com telefone
            </button>
          </div>
        </div>
        <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      </>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Meus Favoritos</h1>
        <div className="text-center py-20">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-2">Nenhum imovel favoritado ainda.</p>
          <p className="text-gray-400">
            Explore os imoveis e clique no coracao para salvar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Meus Favoritos</h1>
        <span className="text-gray-500">
          {properties.length} {properties.length === 1 ? 'imovel' : 'imoveis'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}

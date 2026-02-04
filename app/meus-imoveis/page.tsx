'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  Heart,
  Trash2,
  Eye,
  Home,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import LoginModal from '@/components/auth/LoginModal';

interface DashboardProperty {
  id: string;
  title: string | null;
  propertyType: string;
  city: string;
  neighborhood: string | null;
  price: number | null;
  status: string;
  photos: { url: string }[];
  _count: { favorites: number };
  createdAt: string;
}

export default function MeusImoveisPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [properties, setProperties] = useState<DashboardProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === 'loading') return;
    if (!session) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const res = await fetch('/api/user/properties');
        const data = await res.json();
        setProperties(data.properties || []);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [session, authStatus]);

  async function toggleStatus(id: string, currentStatus: string) {
    setActionLoading(id);
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    try {
      const res = await fetch(`/api/property/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
        );
      }
    } catch {
      // silencioso
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteProperty(id: string) {
    if (!confirm('Tem certeza que deseja remover este imovel?')) return;

    setActionLoading(id);

    try {
      const res = await fetch(`/api/property/${id}`, { method: 'DELETE' });

      if (res.ok) {
        setProperties((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      // silencioso
    } finally {
      setActionLoading(null);
    }
  }

  if (authStatus === 'loading' || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Meus Imoveis</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <Home size={64} className="mx-auto text-gray-300 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Meus Imoveis</h1>
            <p className="text-gray-500 mb-6">
              Faca login para ver e gerenciar seus anuncios.
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Imoveis</h1>
          <p className="text-gray-500 mt-1">
            {properties.length} {properties.length === 1 ? 'anuncio' : 'anuncios'}
          </p>
        </div>
        <Link
          href="/imoveis/novo"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors"
        >
          <Plus size={18} />
          Novo anuncio
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-20">
          <Home size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-2">Nenhum anuncio ainda.</p>
          <p className="text-gray-400 mb-6">
            Publique seu primeiro imovel gratuitamente.
          </p>
          <Link
            href="/imoveis/novo"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            <Plus size={18} />
            Anunciar imovel
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => {
            const photo = property.photos[0]?.url;
            const isActive = property.status === 'ACTIVE';
            const isLoading = actionLoading === property.id;

            return (
              <div
                key={property.id}
                className={`bg-white rounded-xl border border-gray-100 p-4 transition-opacity ${
                  !isActive ? 'opacity-60' : ''
                }`}
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo}
                        alt={property.title || 'Imovel'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Home size={32} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {property.title ||
                            `${property.propertyType} em ${property.city}`}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {property.neighborhood
                            ? `${property.neighborhood}, ${property.city}`
                            : property.city}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>

                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {formatPrice(property.price)}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Heart size={14} />
                        {property._count.favorites}
                      </span>
                      <span>
                        Criado em{' '}
                        {new Date(property.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
                  <Link
                    href={`/imoveis/${property.id}`}
                    className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <Eye size={16} />
                    Ver anuncio
                  </Link>

                  <button
                    onClick={() => toggleStatus(property.id, property.status)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : isActive ? (
                      <ToggleRight size={16} />
                    ) : (
                      <ToggleLeft size={16} />
                    )}
                    {isActive ? 'Desativar' : 'Reativar'}
                  </button>

                  <button
                    onClick={() => deleteProperty(property.id)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 ml-auto"
                  >
                    <Trash2 size={16} />
                    Remover
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

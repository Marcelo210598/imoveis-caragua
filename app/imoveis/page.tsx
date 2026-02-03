'use client';

import { Suspense, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Property, PropertyFilters } from '@/types/property';
import PropertyGrid from '@/components/PropertyGrid';
import FilterSidebar from '@/components/FilterSidebar';

const ITEMS_PER_PAGE = 24;

function serializeFilters(f: PropertyFilters): string {
  return JSON.stringify({
    city: f.city || '',
    minPrice: f.minPrice || 0,
    maxPrice: f.maxPrice || 0,
    bedrooms: f.bedrooms || 0,
    onlyDeals: f.onlyDeals || false,
    searchTerm: f.searchTerm || '',
  });
}

function ImoveisContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const initialCity = searchParams.get('city') || undefined;

  const [filters, setFilters] = useState<PropertyFilters>({
    city: initialCity,
  });

  const [cities, setCities] = useState<string[]>([]);
  const filterKey = serializeFilters(filters);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    async function fetchProperties() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.city) params.set('city', filters.city);
        if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
        if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
        if (filters.bedrooms) params.set('bedrooms', String(filters.bedrooms));
        if (filters.onlyDeals) params.set('onlyDeals', 'true');
        if (filters.searchTerm) params.set('search', filters.searchTerm);

        const res = await fetch(`/api/properties?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setProperties(data.properties);
        if (data.cities) setCities(data.cities);
        setPage(1);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        console.error('Erro ao carregar imoveis:', err);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  const handleFilterChange = useCallback((newFilters: PropertyFilters) => {
    setFilters(newFilters);
  }, []);

  const paginatedProperties = useMemo(() => {
    return properties.slice(0, page * ITEMS_PER_PAGE);
  }, [properties, page]);

  const hasMore = paginatedProperties.length < properties.length;

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Todos os Imoveis</h1>
      <p className="text-gray-500 mb-8">
        {loading
          ? 'Carregando...'
          : `${properties.length} imoveis encontrados`}
      </p>

      <div className="flex gap-8">
        <FilterSidebar
          cities={cities}
          filters={filters}
          onFilterChange={handleFilterChange}
          totalCount={properties.length}
        />

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                >
                  <div className="aspect-[4/3] skeleton" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 w-32 skeleton rounded" />
                    <div className="h-4 w-full skeleton rounded" />
                    <div className="h-4 w-24 skeleton rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <PropertyGrid properties={paginatedProperties} />
              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-8 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
                  >
                    Carregar mais
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function ImoveisPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense
        fallback={
          <div className="text-center py-16 text-gray-400">Carregando...</div>
        }
      >
        <ImoveisContent />
      </Suspense>
    </div>
  );
}

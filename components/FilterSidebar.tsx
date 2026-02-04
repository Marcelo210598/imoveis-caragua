'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { PropertyFilters } from '@/types/property';
import SearchBar from './SearchBar';

interface FilterSidebarProps {
  cities: string[];
  filters: PropertyFilters;
  onFilterChange: (filters: PropertyFilters) => void;
  totalCount: number;
}

export default function FilterSidebar({
  cities,
  filters,
  onFilterChange,
  totalCount,
}: FilterSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice?.toString() || '');
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice?.toString() || '');
  const filtersRef = useRef(filters);
  filtersRef.current = filters;
  const onFilterChangeRef = useRef(onFilterChange);
  onFilterChangeRef.current = onFilterChange;

  const update = useCallback((partial: Partial<PropertyFilters>) => {
    onFilterChangeRef.current({ ...filtersRef.current, ...partial });
  }, []);

  // Debounce price inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      const minPrice = localMinPrice ? Number(localMinPrice) : undefined;
      const maxPrice = localMaxPrice ? Number(localMaxPrice) : undefined;
      if (minPrice !== filtersRef.current.minPrice || maxPrice !== filtersRef.current.maxPrice) {
        update({ minPrice, maxPrice });
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [localMinPrice, localMaxPrice, update]);

  const clearFilters = () => {
    setLocalMinPrice('');
    setLocalMaxPrice('');
    onFilterChange({});
  };

  const hasFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== '' && v !== false
  );

  const btnClass = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-sm border transition-colors ${
      active
        ? 'bg-primary-500 text-white border-primary-500'
        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary-300'
    }`;

  const inputClass =
    'px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500';

  const filterContent = (
    <div className="space-y-6">
      {/* Search */}
      <SearchBar
        onSearch={(term) => update({ searchTerm: term || undefined })}
        placeholder="Buscar..."
      />

      {/* Venda / Aluguel */}
      <div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Modalidade</h3>
        <div className="flex gap-2">
          {[
            { value: 'venda', label: 'Venda' },
            { value: 'aluguel', label: 'Aluguel' },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() =>
                update({ type: filters.type === t.value ? undefined : t.value })
              }
              className={btnClass(filters.type === t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* City */}
      <div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Cidade</h3>
        <div className="space-y-2">
          {cities.map((city) => (
            <label key={city} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="city"
                checked={filters.city === city}
                onChange={() =>
                  update({ city: filters.city === city ? undefined : city })
                }
                className="accent-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{city}</span>
            </label>
          ))}
          {filters.city && (
            <button
              onClick={() => update({ city: undefined })}
              className="text-xs text-primary-500 hover:underline"
            >
              Todas as cidades
            </button>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Faixa de preco</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={localMinPrice}
            onChange={(e) => setLocalMinPrice(e.target.value)}
            className={inputClass}
          />
          <input
            type="number"
            placeholder="Max"
            value={localMaxPrice}
            onChange={(e) => setLocalMaxPrice(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Quartos</h3>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() =>
                update({ bedrooms: filters.bedrooms === n ? undefined : n })
              }
              className={btnClass(filters.bedrooms === n)}
            >
              {n === 4 ? '4+' : n}
            </button>
          ))}
        </div>
      </div>

      {/* Deals toggle */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.onlyDeals || false}
            onChange={(e) => update({ onlyDeals: e.target.checked || undefined })}
            className="accent-primary-500 w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            🔥 So oportunidades
          </span>
        </label>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-2 text-sm text-red-500 hover:text-red-600 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
        >
          Limpar filtros
        </button>
      )}

      {/* Count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        {totalCount} imoveis encontrados
      </p>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 mb-4"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <SlidersHorizontal size={16} />
        Filtros
        {hasFilters && (
          <span className="bg-primary-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            !
          </span>
        )}
      </button>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 p-6 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">Filtros</h2>
              <button onClick={() => setMobileOpen(false)}>
                <X size={24} className="text-gray-500" />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
          <h2 className="font-bold text-lg mb-4">Filtros</h2>
          {filterContent}
        </div>
      </div>
    </>
  );
}

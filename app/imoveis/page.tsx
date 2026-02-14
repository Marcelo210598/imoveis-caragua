"use client";

import {
  Suspense,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useSearchParams } from "next/navigation";
import { Property, PropertyFilters } from "@/types/property";
import PropertyGrid from "@/components/PropertyGrid";
import FilterSidebar from "@/components/FilterSidebar";
import CompareDrawer from "@/components/CompareDrawer";
import SearchBar from "@/components/SearchBar";
import { Map, List } from "lucide-react";
import dynamic from "next/dynamic";
import PropertyAlertButton from "@/components/PropertyAlert";
import PushSubscribe from "@/components/PushSubscribe";
import AdBanner from "@/components/AdBanner";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse flex items-center justify-center text-gray-400">
      Carregando mapa...
    </div>
  ),
});

const ITEMS_PER_PAGE = 24;

function serializeFilters(f: PropertyFilters): string {
  return JSON.stringify({
    city: f.city || "",
    type: f.type || "",
    propertyType: f.propertyType || "",
    minPrice: f.minPrice || 0,
    maxPrice: f.maxPrice || 0,
    minArea: f.minArea || 0,
    maxArea: f.maxArea || 0,
    bedrooms: f.bedrooms || 0,
    onlyDeals: f.onlyDeals || false,
    searchTerm: f.searchTerm || "",
  });
}

function ImoveisContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const initialCity = searchParams.get("city") || undefined;

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
        if (filters.city) params.set("city", filters.city);
        if (filters.type) params.set("type", filters.type);
        if (filters.propertyType)
          params.set("propertyType", filters.propertyType);
        if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
        if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
        if (filters.minArea) params.set("minArea", String(filters.minArea));
        if (filters.maxArea) params.set("maxArea", String(filters.maxArea));
        if (filters.bedrooms) params.set("bedrooms", String(filters.bedrooms));
        if (filters.onlyDeals) params.set("onlyDeals", "true");
        if (filters.searchTerm) params.set("search", filters.searchTerm);

        const res = await fetch(`/api/properties?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setProperties(data.properties);
        if (data.cities) setCities(data.cities);
        setPage(1);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("Erro ao carregar imoveis:", err);
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

  const handleSearch = useCallback((term: string) => {
    setFilters((prev) => ({ ...prev, searchTerm: term || undefined }));
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompareIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev,
    );
  }, []);

  const paginatedProperties = useMemo(() => {
    return properties.slice(0, page * ITEMS_PER_PAGE);
  }, [properties, page]);

  const hasMore = paginatedProperties.length < properties.length;

  return (
    <>
      {/* Prominent Search Bar */}
      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="🔍 Buscar por bairro, cidade, tipo de imóvel..."
          className="max-w-2xl"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Todos os Imóveis
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {loading
              ? "Carregando..."
              : `${properties.length} imóveis encontrados`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <PushSubscribe />
          <PropertyAlertButton />

          {/* View toggle: List / Map */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setShowMap(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                !showMap
                  ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <List size={16} />
              Lista
            </button>
            <button
              onClick={() => setShowMap(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                showMap
                  ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Map size={16} />
              Mapa
            </button>
          </div>
        </div>
      </div>

      {/* Map View */}
      {showMap && !loading && (
        <div className="mb-6">
          <PropertyMap properties={properties} />
        </div>
      )}

      <div className="lg:flex lg:gap-8">
        <FilterSidebar
          cities={cities}
          filters={filters}
          onFilterChange={handleFilterChange}
          totalCount={properties.length}
        />

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800"
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
              <AdBanner slot="1234567890" className="mb-8" />
              <PropertyGrid
                properties={paginatedProperties}
                compareIds={compareIds}
                onToggleCompare={toggleCompare}
              />
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

      {/* Compare Drawer */}
      <CompareDrawer
        properties={properties}
        selected={compareIds}
        onToggle={toggleCompare}
        onClear={() => setCompareIds([])}
      />
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

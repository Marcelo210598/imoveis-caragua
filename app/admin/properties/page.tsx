"use client";

import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// Definindo tipos localmente para evitar dependências circulares ou complexas
type Property = {
  id: string;
  title: string;
  city: string;
  price: number;
  source: string;
  createdAt: string;
  isFeatured: boolean;
  views: number;
  owner?: {
    name: string | null;
    phone: string | null;
  };
};

type Pagination = {
  total: number;
  pages: number;
  page: number;
  limit: number;
};

export default function AdminPropertiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  // Estado local para o input de busca para permitir debounce
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );

  // Sincronizar URL com estado
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  useEffect(() => {
    fetchProperties(page, search);
  }, [page, search]);

  // Debounce para atualizar a URL quando o usuário digita
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== search) {
        const params = new URLSearchParams(searchParams);
        if (searchTerm) params.set("search", searchTerm);
        else params.delete("search");
        params.set("page", "1"); // Resetar para página 1 na nova busca
        router.push(`/admin/properties?${params.toString()}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, search, router, searchParams]);

  async function fetchProperties(pageNumber: number, searchText: string) {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: pageNumber.toString(),
        limit: "20",
        search: searchText,
      });
      const res = await fetch(`/api/admin/properties?${query}`);
      if (!res.ok) throw new Error("Falha na requisição");
      const data = await res.json();
      setProperties(data.properties);
      setPagination(data.pagination);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar imóveis");
    } finally {
      setLoading(false);
    }
  }

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`/admin/properties?${params.toString()}`);
  }

  async function toggleFeature(propertyId: string, currentStatus: boolean) {
    const newStatus = !currentStatus;

    // Optimistic update
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, isFeatured: newStatus } : p,
      ),
    );

    try {
      const res = await fetch(`/api/admin/properties/${propertyId}/feature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: newStatus }),
      });

      if (!res.ok) throw new Error("Falha ao atualizar");

      toast.success(newStatus ? "Imóvel destacado!" : "Destaque removido");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar destaque");
      // Revert optimistic update
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId ? { ...p, isFeatured: currentStatus } : p,
        ),
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-sm text-gray-500 hover:text-primary-600 mb-1 inline-flex items-center gap-1 transition-colors"
            >
              <ChevronLeft size={14} /> Voltar ao Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gerenciar Imóveis
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Visualize, busque e destaque imóveis da plataforma.
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por título, cidade ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Imóvel</th>
                  <th className="px-6 py-4">Preço</th>
                  <th className="px-6 py-4">Fonte</th>
                  <th className="px-6 py-4 text-center">Destaque</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4 text-center flex justify-center">
                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4"></td>
                    </tr>
                  ))
                ) : properties.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Search className="w-8 h-8 text-gray-300" />
                        <p>Nenhum imóvel encontrado.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  properties.map((prop) => (
                    <tr
                      key={prop.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span
                            className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-primary-600 transition-colors"
                            title={prop.title}
                          >
                            {prop.title || "Sem título"}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin size={12} /> {prop.city}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {prop.price.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            prop.source === "USER"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          {prop.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() =>
                            toggleFeature(prop.id, prop.isFeatured)
                          }
                          className={`p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
                            prop.isFeatured
                              ? "bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-500 dark:hover:bg-gray-600"
                          }`}
                          title={
                            prop.isFeatured
                              ? "Remover destaque"
                              : "Destacar imóvel"
                          }
                          aria-label={
                            prop.isFeatured
                              ? "Remover destaque"
                              : "Destacar imóvel"
                          }
                        >
                          <Sparkles
                            size={18}
                            fill={prop.isFeatured ? "currentColor" : "none"}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(prop.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/imoveis/${prop.id}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium transition-colors"
                        >
                          Ver <ExternalLink size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/30">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Página{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {pagination.page}
                </span>{" "}
                de{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {pagination.pages}
                </span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300 transition-colors"
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300 transition-colors"
                  aria-label="Próxima página"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

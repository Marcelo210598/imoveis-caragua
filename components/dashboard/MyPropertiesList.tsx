"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Edit,
  Eye,
  MessageSquare,
  Star,
  Trash2,
  Power,
  PowerOff,
} from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is installed, otherwise standard alert for now
import { formatPrice } from "@/lib/utils";

type Property = {
  id: string;
  title: string | null;
  price: number | null;
  status: "ACTIVE" | "INACTIVE" | "SOLD";
  city: string;
  neighborhood: string | null;
  photos: { url: string }[];
  _count: {
    favorites: number;
    messages: number;
  };
  updatedAt: string;
};

export default function MyPropertiesList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/user/properties");
      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties || []);
      }
    } catch (error) {
      console.error("Erro ao carregar imoveis", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      const res = await fetch(`/api/property/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)),
        );
        toast.success(
          `Imovel ${newStatus === "ACTIVE" ? "ativado" : "desativado"}`,
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar status", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm("Tem certeza que deseja excluir este imóvel? Ação irreversível.")
    )
      return;

    try {
      const res = await fetch(`/api/property/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProperties((prev) => prev.filter((p) => p.id !== id));
        toast.success("Imovel excluido com sucesso");
      }
    } catch (error) {
      console.error("Erro ao excluir", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Você ainda não tem imóveis
        </h3>
        <p className="text-gray-500 mb-6">
          Comece anunciando seu imóvel agora mesmo.
        </p>
        <Link
          href="/imoveis/novo"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          Anunciar Imóvel
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {properties.map((property) => (
        <div
          key={property.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col sm:flex-row"
        >
          {/* Imagem */}
          <div className="relative w-full sm:w-48 h-32 sm:h-auto bg-gray-200">
            {property.photos[0] ? (
              <img
                src={property.photos[0].url}
                alt={property.title || "Imovel"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Sem foto
              </div>
            )}
            <div className="absolute top-2 left-2">
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  property.status === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {property.status === "ACTIVE" ? "Ativo" : "Inativo"}
              </span>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <Link
                  href={`/imoveis/${property.id}`}
                  className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 transition-colors line-clamp-1"
                >
                  {property.title || "Sem título"}
                </Link>
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {formatPrice(property.price)}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {property.neighborhood}, {property.city}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1" title="Mensagens">
                  <MessageSquare size={16} />
                  <span>{property._count.messages}</span>
                </div>
                <div className="flex items-center gap-1" title="Favoritos">
                  <Star size={16} />
                  <span>{property._count.favorites}</span>
                </div>
                <div
                  className="flex items-center gap-1"
                  title="Visualizações (Review)"
                >
                  <Eye size={16} />
                  <span>-</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() =>
                    handleToggleStatus(property.id, property.status)
                  }
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title={property.status === "ACTIVE" ? "Desativar" : "Ativar"}
                >
                  {property.status === "ACTIVE" ? (
                    <Power size={18} />
                  ) : (
                    <PowerOff size={18} />
                  )}
                </button>
                <Link
                  href={`/imoveis/${property.id}/editar`}
                  className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  title="Editar"
                >
                  <Edit size={18} />
                </Link>
                <button
                  onClick={() => handleDelete(property.id)}
                  className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

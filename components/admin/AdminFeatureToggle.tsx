"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Loader2, Zap, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface AdminFeatureToggleProps {
  propertyId: string;
  isFeatured: boolean;
  featuredExpiresAt?: string | null;
  onSuccess?: () => void;
}

export default function AdminFeatureToggle({
  propertyId,
  isFeatured,
  featuredExpiresAt,
  onSuccess,
}: AdminFeatureToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = async (action: "activate" | "deactivate", duration?: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/properties/${propertyId}/feature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          duration,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erro ao atualizar destaque");
        return;
      }

      toast.success(data.message);
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const formattedExpiry = featuredExpiresAt
    ? new Date(featuredExpiresAt).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const Modal = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      <div className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Zap fill="currentColor" size={20} />
            {isFeatured ? "Remover Destaque" : "Ativar Destaque"}
          </h3>
          <p className="text-amber-100 text-sm mt-1">
            Controle manual de destaques (sem pagamento necessário)
          </p>
        </div>

        <div className="p-6 space-y-4">
          {isFeatured && featuredExpiresAt && (
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex gap-2">
              <AlertCircle size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  Destaque ativo até
                </p>
                <p className="text-blue-700 dark:text-blue-300">{formattedExpiry}</p>
              </div>
            </div>
          )}

          {isFeatured ? (
            <button
              onClick={() => handleToggle("deactivate")}
              disabled={loading}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-600 disabled:opacity-50 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Removendo...
                </>
              ) : (
                "Remover Destaque"
              )}
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Escolha a duração:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[7, 15, 30].map((days) => (
                  <button
                    key={days}
                    onClick={() => handleToggle("activate", days)}
                    disabled={loading}
                    className="py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500 disabled:opacity-50 text-white font-medium text-sm transition-all flex items-center justify-center gap-1"
                  >
                    {loading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      `${days}d`
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleToggle("activate", 999)} // ~3 anos
                disabled={loading}
                className="w-full py-2 px-3 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-green-600 disabled:opacity-50 text-white font-medium text-sm transition-all flex items-center justify-center gap-1"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                  </>
                ) : (
                  "Indefinido"
                )}
              </button>
            </div>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          Alteração manual de destaque - Sem pagamento
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all flex items-center gap-1.5 ${
          isFeatured
            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50"
            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
        title={isFeatured ? "Clique para remover" : "Clique para ativar"}
      >
        <Zap size={14} fill={isFeatured ? "currentColor" : "none"} />
        {isFeatured ? "Destaque Ativo" : "Sem Destaque"}
      </button>
      {isOpen && mounted && createPortal(<Modal />, document.body)}
    </>
  );
}

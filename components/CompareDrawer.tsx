"use client";

import { useState, useMemo } from "react";
import { Property } from "@/types/property";
import { formatPrice, formatArea } from "@/lib/utils";
import { X, ArrowLeftRight } from "lucide-react";
import ImageWithFallback from "./ImageWithFallback";

interface CompareDrawerProps {
  properties: Property[];
  selected: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
}

export default function CompareDrawer({
  properties,
  selected,
  onToggle,
  onClear,
}: CompareDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const compared = useMemo(
    () => properties.filter((p) => selected.includes(p.id)),
    [properties, selected],
  );

  if (selected.length === 0) return null;

  return (
    <>
      {/* Floating bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-primary-600 text-white rounded-2xl px-6 py-3 shadow-2xl flex items-center gap-4 animate-slide-up">
        <ArrowLeftRight size={20} />
        <span className="font-medium">
          {selected.length} imóve{selected.length > 1 ? "is" : "l"} selecionado
          {selected.length > 1 ? "s" : ""}
        </span>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white text-primary-600 px-4 py-1.5 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors"
        >
          Comparar
        </button>
        <button
          onClick={onClear}
          className="text-white/70 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Full-screen comparison modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ArrowLeftRight size={22} />
                Comparar Imóveis
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-4 text-left text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 sticky left-0">
                      Característica
                    </th>
                    {compared.map((p) => (
                      <th key={p.id} className="p-4 text-center min-w-[200px]">
                        <div className="space-y-2">
                          {p.photos?.[0] && (
                            <div className="w-full h-32 rounded-lg overflow-hidden">
                              <ImageWithFallback
                                src={p.photos[0].url}
                                alt={p.title || "Imóvel"}
                                className="w-full h-full object-cover"
                                fallbackClassName="w-full h-full"
                              />
                            </div>
                          )}
                          <button
                            onClick={() => onToggle(p.id)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Remover
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  <Row
                    label="Preço"
                    values={compared.map((p) => formatPrice(p.price))}
                    highlight
                  />
                  <Row label="Cidade" values={compared.map((p) => p.city)} />
                  <Row
                    label="Bairro"
                    values={compared.map((p) => p.neighborhood || "—")}
                  />
                  <Row
                    label="Tipo"
                    values={compared.map((p) => p.propertyType)}
                  />
                  <Row
                    label="Área"
                    values={compared.map((p) =>
                      p.area ? formatArea(p.area) : "—",
                    )}
                  />
                  <Row
                    label="Quartos"
                    values={compared.map((p) =>
                      p.bedrooms != null ? String(p.bedrooms) : "—",
                    )}
                  />
                  <Row
                    label="Banheiros"
                    values={compared.map((p) =>
                      p.bathrooms != null ? String(p.bathrooms) : "—",
                    )}
                  />
                  <Row
                    label="Vagas"
                    values={compared.map((p) =>
                      p.parkingSpaces != null ? String(p.parkingSpaces) : "—",
                    )}
                  />
                  <Row
                    label="Preço/m²"
                    values={compared.map((p) =>
                      p.pricePerSqm
                        ? `R$ ${Math.round(p.pricePerSqm).toLocaleString("pt-BR")}`
                        : "—",
                    )}
                  />
                  <Row
                    label="Deal Score"
                    values={compared.map((p) =>
                      p.dealScore > 0 ? `${p.dealScore}/100` : "—",
                    )}
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Row({
  label,
  values,
  highlight = false,
}: {
  label: string;
  values: string[];
  highlight?: boolean;
}) {
  return (
    <tr>
      <td className="p-4 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 sticky left-0">
        {label}
      </td>
      {values.map((v, i) => (
        <td
          key={i}
          className={`p-4 text-center text-sm ${
            highlight
              ? "font-bold text-lg text-primary-600 dark:text-primary-400"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          {v}
        </td>
      ))}
    </tr>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Bell,
  BellPlus,
  X,
  Trash2,
  Loader2,
  MapPin,
  Home,
  DollarSign,
  Maximize2,
} from "lucide-react";

interface Alert {
  id: string;
  city: string | null;
  propertyType: string | null;
  maxPrice: number | null;
  minArea: number | null;
  active: boolean;
}

const CITIES = ["Caraguatatuba", "Ubatuba", "Ilhabela", "São Sebastião"];
const PROPERTY_TYPES = [
  { value: "Apartamento", label: "Apartamento" },
  { value: "Casa", label: "Casa" },
  { value: "Terreno", label: "Terreno" },
  { value: "Comercial", label: "Comercial" },
];

export default function PropertyAlertButton() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");

  // Fetch existing alerts
  useEffect(() => {
    if (isOpen && session?.user) {
      setLoading(true);
      fetch("/api/alerts")
        .then((r) => r.json())
        .then((data) => setAlerts(data.alerts || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen, session]);

  const createAlert = async () => {
    if (!city && !propertyType && !maxPrice && !minArea) return;

    setSaving(true);
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, propertyType, maxPrice, minArea }),
      });

      if (res.ok) {
        const data = await res.json();
        setAlerts((prev) => [data.alert, ...prev]);
        // Reset form
        setCity("");
        setPropertyType("");
        setMaxPrice("");
        setMinArea("");
      } else {
        const err = await res.json();
        alert(err.error || "Erro ao criar alerta");
      }
    } catch {
      alert("Erro de conexão");
    }
    setSaving(false);
  };

  const deleteAlert = async (id: string) => {
    try {
      await fetch(`/api/alerts?id=${id}`, { method: "DELETE" });
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch {
      console.error("Failed to delete alert");
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
          bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300
          hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors border border-amber-200 dark:border-amber-800"
      >
        <BellPlus size={16} />
        Criar Alerta
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Dialog */}
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Bell size={20} />
                  <h2 className="font-bold text-lg">Alertas de Imóveis</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-amber-100 text-xs mt-1">
                Receba notificações de novos imóveis que se encaixam no que você
                procura
              </p>
            </div>

            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Create new alert form */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Novo Alerta
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <MapPin size={12} /> Cidade
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                    >
                      <option value="">Todas</option>
                      {CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <Home size={12} /> Tipo
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                    >
                      <option value="">Todos</option>
                      {PROPERTY_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <DollarSign size={12} /> Preço máx.
                    </label>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Ex: 500000"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <Maximize2 size={12} /> Área mín. (m²)
                    </label>
                    <input
                      type="number"
                      value={minArea}
                      onChange={(e) => setMinArea(e.target.value)}
                      placeholder="Ex: 50"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                    />
                  </div>
                </div>

                <button
                  onClick={createAlert}
                  disabled={
                    saving || (!city && !propertyType && !maxPrice && !minArea)
                  }
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold text-sm hover:from-amber-500 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <BellPlus size={16} />
                  )}
                  Criar Alerta
                </button>
              </div>

              {/* Existing alerts */}
              {loading ? (
                <div className="flex justify-center py-4">
                  <Loader2 size={20} className="animate-spin text-gray-400" />
                </div>
              ) : alerts.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Seus Alertas ({alerts.length}/5)
                  </p>
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl p-3"
                    >
                      <div className="flex flex-wrap gap-1.5">
                        {alert.city && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                            📍 {alert.city}
                          </span>
                        )}
                        {alert.propertyType && (
                          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                            🏠 {alert.propertyType}
                          </span>
                        )}
                        {alert.maxPrice && (
                          <span className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                            💰 até R$ {alert.maxPrice.toLocaleString("pt-BR")}
                          </span>
                        )}
                        {alert.minArea && (
                          <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                            📐 {alert.minArea}m²+
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 transition-colors shrink-0 ml-2"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

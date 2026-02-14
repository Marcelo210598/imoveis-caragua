import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Loader2, Zap, Check } from "lucide-react";
import { toast } from "sonner";
import { Property } from "@/types/property";

interface FeatureButtonProps {
  property: Property;
  compact?: boolean;
}

export default function FeatureButton({
  property,
  compact = false,
}: FeatureButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = async (planType: "weekly" | "monthly") => {
    setLoading(planType);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          planType,
        }),
      });

      const data = await res.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        toast.error(data.error || "Erro ao iniciar pagamento");
      }
    } catch (error) {
      toast.error("Erro de conexão com o servidor");
    } finally {
      setLoading(null);
    }
  };

  const Modal = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      <div className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Zap fill="currentColor" />
            Destacar Imóvel
          </h3>
          <p className="text-amber-100 text-sm mt-1">
            Aumente as visualizações do seu imóvel em até 5x!
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Weekly Plan */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-amber-400 transition-colors cursor-pointer relative overflow-hidden group">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-lg dark:text-white">Semanal</h4>
              <span className="text-xl font-bold text-amber-500">R$ 19,90</span>
            </div>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1 mb-4">
              <li className="flex items-center gap-1.5">
                <Check size={14} className="text-green-500" /> Topo das buscas
                por 7 dias
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={14} className="text-green-500" /> Selo de
                "Destaque"
              </li>
            </ul>
            <button
              onClick={() => handleCheckout("weekly")}
              disabled={!!loading}
              className="w-full py-2 rounded-lg bg-gray-100 dark:bg-gray-800 font-medium text-gray-900 dark:text-white group-hover:bg-amber-500 group-hover:text-white transition-all disabled:opacity-50"
            >
              {loading === "weekly" ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                "Escolher Semanal"
              )}
            </button>
          </div>

          {/* Monthly Plan */}
          <div className="border-2 border-amber-500 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
              MAIS POPULAR
            </div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-lg dark:text-white">Mensal</h4>
              <div className="text-right">
                <span className="text-xs text-gray-400 line-through mr-1">
                  R$ 79,90
                </span>
                <span className="text-xl font-bold text-amber-500">
                  R$ 49,90
                </span>
              </div>
            </div>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1 mb-4">
              <li className="flex items-center gap-1.5">
                <Check size={14} className="text-green-500" /> Topo das buscas
                por 30 dias
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={14} className="text-green-500" /> Selo de
                "Destaque"
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={14} className="text-green-500" /> Economia de 40%
              </li>
            </ul>
            <button
              onClick={() => handleCheckout("monthly")}
              disabled={!!loading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading === "monthly" ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                "Escolher Mensal"
              )}
            </button>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 text-center text-xs text-gray-400">
          Pagamento seguro via Mercado Pago (Pix/Cartão)
        </div>
      </div>
    </div>
  );

  if (compact) {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all"
          title="Destacar Imóvel"
        >
          <Zap size={16} fill="currentColor" />
        </button>
        {isOpen && mounted && createPortal(<Modal />, document.body)}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all font-medium text-sm"
      >
        <Zap size={16} fill="currentColor" />
        Destacar Imóvel
      </button>
      {isOpen && mounted && createPortal(<Modal />, document.body)}
    </>
  );
}

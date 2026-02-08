import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Fale Conosco | LN Imóveis",
  description:
    "Entre em contato com a equipe do LN Imóveis para suporte, dúvidas ou parcerias.",
};

export default function ContatoPage() {
  const phoneNumber = "5512992433988";
  const displayPhone = "(12) 99243-3988";
  const message = encodeURIComponent(
    "Olá! Preciso de ajuda com o site LN Imóveis.",
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Fale Conosco
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Estamos aqui para ajudar você a encontrar o imóvel ideal ou tirar
            suas dúvidas.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-8 space-y-8">
            {/* WhatsApp / Telefone */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-xl text-green-600 dark:text-green-400">
                <MessageCircle size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  WhatsApp & Suporte
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Atendimento rápido para dúvidas, suporte técnico ou parcerias.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors"
                  >
                    <MessageCircle size={18} />
                    Chamar no WhatsApp
                  </a>
                  <a
                    href={`tel:${phoneNumber}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
                  >
                    <Phone size={18} />
                    {displayPhone}
                  </a>
                </div>
              </div>
            </div>

            {/* Email (Placeholder/Future) */}
            {/* 
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-xl text-blue-600 dark:text-blue-400">
                <Mail size={32} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  E-mail
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  contato@lnimoveis.com.br
                </p>
              </div>
            </div>
            */}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800">
            Horário de atendimento: Segunda a Sexta, das 9h às 18h.
          </div>
        </div>
      </div>
    </div>
  );
}

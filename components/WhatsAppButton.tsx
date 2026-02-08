"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics/react";

export default function WhatsAppButton() {
  const pathname = usePathname();

  // Não exibir no dashboard ou páginas admin
  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")) {
    return null;
  }

  const phoneNumber = "5512999999999"; // Substituir pelo número real
  const message = encodeURIComponent(
    "Olá! Vi o site Litoral Norte Imóveis e gostaria de mais informações.",
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  const handleClick = () => {
    track("WhatsApp Click", { path: pathname || "unknown" });
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 animate-bounce-slow"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle size={32} />
    </a>
  );
}

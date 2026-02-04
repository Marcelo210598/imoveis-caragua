'use client';

import { ExternalLink, MessageCircle } from 'lucide-react';

interface ContactButtonProps {
  source: string;
  url?: string | null;
  ownerPhone?: string | null;
  ownerName?: string | null;
  propertyTitle?: string | null;
}

export default function ContactButton({
  source,
  url,
  ownerPhone,
  ownerName,
  propertyTitle,
}: ContactButtonProps) {
  if (source === 'USER' && ownerPhone) {
    const phone = ownerPhone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Oi${ownerName ? ` ${ownerName}` : ''}! Vi seu anuncio "${propertyTitle || 'imovel'}" no Litoral Norte Imoveis e tenho interesse. Podemos conversar?`
    );
    const waUrl = `https://wa.me/55${phone}?text=${message}`;

    return (
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-green-500 text-white font-semibold py-3.5 rounded-xl hover:bg-green-600 transition-colors"
      >
        <MessageCircle size={18} />
        Tenho interesse (WhatsApp)
      </a>
    );
  }

  if (url) {
    const portalName =
      source === 'ZAP' ? 'ZAP Imoveis' : source === 'VIVAREAL' ? 'VivaReal' : 'Portal';

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-primary-500 text-white font-semibold py-3.5 rounded-xl hover:bg-primary-600 transition-colors"
      >
        <ExternalLink size={18} />
        Ver no {portalName}
      </a>
    );
  }

  return null;
}

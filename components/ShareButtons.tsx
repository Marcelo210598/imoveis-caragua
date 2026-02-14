"use client";

import { useState } from "react";
import {
  Share2,
  MessageCircle,
  Facebook,
  Twitter,
  Link2,
  Check,
  X,
} from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
  price?: string;
}

export default function ShareButtons({ title, url, price }: ShareButtonsProps) {
  const [showPanel, setShowPanel] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${url}`
      : `https://imoveis-caragua.vercel.app${url}`;

  const text = price
    ? `${title} - ${price} | LN Imóveis`
    : `${title} | LN Imóveis`;

  const handleShare = async () => {
    // Try native share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({ title: text, url: fullUrl });
        return;
      } catch {
        // User cancelled or not supported
      }
    }
    setShowPanel(!showPanel);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = fullUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500 hover:bg-green-600",
      href: `https://wa.me/?text=${encodeURIComponent(`${text}\n${fullUrl}`)}`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-sky-500 hover:bg-sky-600",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(fullUrl)}`,
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
          bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400
          hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title="Compartilhar"
      >
        <Share2 size={14} />
        Compartilhar
      </button>

      {showPanel && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPanel(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 w-56 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Compartilhar
              </p>
              <button
                onClick={() => setShowPanel(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex gap-2 mb-3">
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-white transition-transform hover:scale-105 ${link.color}`}
                  title={link.name}
                >
                  <link.icon size={18} />
                  <span className="text-[10px] font-medium">{link.name}</span>
                </a>
              ))}
            </div>

            <button
              onClick={copyLink}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium transition-colors ${
                copied
                  ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {copied ? (
                <>
                  <Check size={14} />
                  Link copiado!
                </>
              ) : (
                <>
                  <Link2 size={14} />
                  Copiar link
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

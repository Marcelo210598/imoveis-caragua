"use client";

import { useState, useEffect } from "react";
import { X, Download, Share } from "lucide-react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      return;
    }

    // Check if dismissed previously in this session
    if (sessionStorage.getItem("install-prompt-dismissed")) {
      return;
    }

    // Detect iOS
    const isIosDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      // Show prompt for iOS immediately if not installed and not dismissed
      setShowPrompt(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem("install-prompt-dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-8 md:bottom-8 md:max-w-sm animate-in slide-in-from-bottom-5 duration-500">
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-800 p-4 rounded-2xl shadow-xl flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-xl text-primary-600 dark:text-primary-400">
              <Download size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100">
                Instalar App
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Acesse seus imóveis mais rápido e offline.
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {isIOS ? (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl text-xs text-gray-600 dark:text-gray-300">
            Para instalar no iOS: toque em{" "}
            <Share size={12} className="inline mx-1" /> e selecione{" "}
            <strong>Adicionar à Tela de Início</strong>.
          </div>
        ) : (
          <button
            onClick={handleInstall}
            className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Instalar Agora
          </button>
        )}
      </div>
    </div>
  );
}

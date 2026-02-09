"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { publicVapidKey } from "@/lib/push-client";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function NotificationManager() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper to convert VAPID key
  // ... (same logic as before)

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          setIsSubscribed(!!subscription);
          setLoading(false);
        });
      });
    } else {
      setLoading(false); // Push not supported
    }
  }, []);

  async function subscribeUser() {
    setLoading(true);
    try {
      if (!("serviceWorker" in navigator)) {
        toast.error("Seu navegador não suporta notificações.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;

      // Request permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("Você precisa permitir notificações.");
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: { "Content-Type": "application/json" },
      });

      setIsSubscribed(true);
      toast.success("Notificações ativadas com sucesso!");
    } catch (error) {
      console.error("Failed to subscribe:", error);
      toast.error("Erro ao ativar notificações.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-2">
        <Loader2 className="animate-spin text-gray-400" size={20} />
      </div>
    );
  }

  return (
    <button
      onClick={subscribeUser}
      disabled={isSubscribed}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
        isSubscribed
          ? "bg-green-100 text-green-700 cursor-default"
          : "bg-primary-50 text-primary-700 hover:bg-primary-100"
      }`}
    >
      {isSubscribed ? <Bell size={18} /> : <BellOff size={18} />}
      <span>
        {isSubscribed ? "Notificações Ativas" : "Ativar Notificações"}
      </span>
    </button>
  );
}

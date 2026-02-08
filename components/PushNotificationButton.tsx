"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff } from "lucide-react";
import { useSession } from "next-auth/react";

export default function PushNotificationButton() {
  const { data: session } = useSession();
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }

    // Verificar se já está inscrito
    if ("serviceWorker" in navigator && session?.user) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          setSubscribed(!!sub);
        });
      });
    }
  }, [session]);

  const subscribe = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      alert("Push notifications não são suportadas neste navegador");
      return;
    }

    setLoading(true);
    try {
      // Registrar service worker
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      // Solicitar permissão
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== "granted") {
        setLoading(false);
        return;
      }

      // Criar subscription (sem VAPID por simplicidade - usar servidor próprio)
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: undefined, // Usar VAPID em produção
      });

      // Salvar no servidor
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });

      if (res.ok) {
        setSubscribed(true);
      }
    } catch (err) {
      console.error("Erro ao inscrever:", err);
    }
    setLoading(false);
  };

  const unsubscribe = async () => {
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        await fetch(
          `/api/push/subscribe?endpoint=${encodeURIComponent(subscription.endpoint)}`,
          {
            method: "DELETE",
          },
        );
      }

      setSubscribed(false);
    } catch (err) {
      console.error("Erro ao cancelar:", err);
    }
    setLoading(false);
  };

  if (!session?.user || permission === "denied") {
    return null;
  }

  return (
    <button
      onClick={subscribed ? unsubscribe : subscribe}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        subscribed
          ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
      }`}
      title={subscribed ? "Desativar notificações" : "Ativar notificações"}
    >
      {loading ? (
        <span className="animate-spin">⏳</span>
      ) : subscribed ? (
        <Bell size={18} className="text-green-600" />
      ) : (
        <BellOff size={18} />
      )}
      <span className="hidden sm:inline">
        {subscribed ? "Notificações ativas" : "Ativar notificações"}
      </span>
    </button>
  );
}

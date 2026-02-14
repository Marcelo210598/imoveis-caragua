"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";

export default function PushSubscribe() {
  const [permission, setPermission] = useState<
    NotificationPermission | "loading"
  >("loading");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("denied");
      return;
    }
    setPermission(Notification.permission);

    // Check if already subscribed
    if ("serviceWorker" in navigator && Notification.permission === "granted") {
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (sub) setSubscribed(true);
        });
      });
    }
  }, []);

  const subscribe = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    setLoading(true);
    try {
      // Request permission
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== "granted") {
        setLoading(false);
        return;
      }

      // Register/get service worker
      const reg = await navigator.serviceWorker.ready;

      // Subscribe to push
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      // Send subscription to backend
      const res = await fetch("/api/web-push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });

      if (res.ok) {
        setSubscribed(true);
      }
    } catch (error) {
      console.error("[PUSH] Subscribe error:", error);
    }
    setLoading(false);
  };

  const unsubscribe = async () => {
    if (!("serviceWorker" in navigator)) return;

    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();

      if (sub) {
        await sub.unsubscribe();

        // Notify backend
        await fetch("/api/web-push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
      }
      setSubscribed(false);
    } catch (error) {
      console.error("[PUSH] Unsubscribe error:", error);
    }
    setLoading(false);
  };

  // Hide on unsupported browsers
  if (
    permission === "loading" ||
    (typeof window !== "undefined" && !("Notification" in window))
  ) {
    return null;
  }

  if (permission === "denied") {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-400 px-3 py-2">
        <BellOff size={14} />
        <span>Notificações bloqueadas</span>
      </div>
    );
  }

  return (
    <button
      onClick={subscribed ? unsubscribe : subscribe}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
        subscribed
          ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900"
          : "bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900"
      } disabled:opacity-50`}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : subscribed ? (
        <Bell size={16} className="text-emerald-500" />
      ) : (
        <Bell size={16} />
      )}
      {subscribed ? "Notificações ativas" : "Ativar notificações"}
    </button>
  );
}

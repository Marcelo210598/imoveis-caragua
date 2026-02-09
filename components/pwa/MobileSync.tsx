"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export function MobileSync() {
  const { data: session } = useSession();

  useEffect(() => {
    // Função para lidar com mensagens vindas do App Mobile (WebView)
    const handleMessage = async (event: MessageEvent) => {
      try {
        // No React Native WebView, event.data vem como string JSON
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (data.type === "EXPO_PUSH_TOKEN" && data.token && session?.user) {
          console.log("Mobile Token received:", data.token);

          // Enviar para API
          await fetch("/api/user/push-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: data.token,
              platform: "android", // Webview não sabe facil o OS, assumindo android por enquanto ou ajustando no app.js
            }),
          });
        }
      } catch (error) {
        // Ignorar erros de parse (mensagens de outras fontes)
      }
    };

    // Escutar mensagens do RN WebView
    // iOS: window.addEventListener("message", ...)
    // Android: document.addEventListener("message", ...)
    if (typeof window !== "undefined") {
      window.addEventListener("message", handleMessage);
      // @ts-ignore
      document.addEventListener("message", handleMessage); // Suporte legado Android
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("message", handleMessage);
        // @ts-ignore
        document.removeEventListener("message", handleMessage);
      }
    };
  }, [session]);

  return null; // Componente sem UI
}

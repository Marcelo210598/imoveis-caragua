import { prisma } from "@/lib/prisma";

/**
 * Sends push notifications to all registered mobile devices
 * when a new property is created.
 */
export async function notifyNewProperty(
  propertyTitle: string,
  propertyId: string,
  city: string,
) {
  try {
    // Get all registered devices
    const devices = await prisma.mobileDevice.findMany({
      select: { token: true },
    });

    if (devices.length === 0) return;

    // Send Expo push notifications
    const messages = devices.map((device) => ({
      to: device.token,
      sound: "default" as const,
      title: "🏠 Novo Imóvel Disponível!",
      body: `${propertyTitle} em ${city}`,
      data: { propertyId, url: `/imoveis/${propertyId}` },
    }));

    // Expo push API - batch send
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(messages),
    });

    if (!response.ok) {
      console.error(
        "[PUSH] Failed to send notifications:",
        await response.text(),
      );
    }
  } catch (error) {
    console.error("[PUSH] Error sending notifications:", error);
  }
}

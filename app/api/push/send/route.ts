import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPushNotification } from "@/lib/push";

export async function POST(request: Request) {
  const session = await auth();

  // Apenas admins podem enviar (ou dono do site)
  // Por enquanto, checo se está logado. Ideal: check role === 'ADMIN'
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Opcional: checar role
  if (session.user.role !== "ADMIN") {
    // return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { title, body, url, userId } = await request.json();

    // Buscar subscrições (todas ou de um user específico)
    const where = userId ? { userId } : {};
    const subscriptions = await prisma.pushSubscription.findMany({ where });

    const payload = JSON.stringify({
      title,
      body,
      url: url || "/",
    });

    const results = await Promise.all(
      subscriptions.map((sub) =>
        sendPushNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload,
        ),
      ),
    );

    const successCount = results.filter((r) => r).length;

    return NextResponse.json({
      success: true,
      sent: successCount,
      total: subscriptions.length,
    });
  } catch (error) {
    console.error("Error sending push:", error);
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 },
    );
  }
}

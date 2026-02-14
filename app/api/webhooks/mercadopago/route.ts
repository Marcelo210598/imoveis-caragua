import { NextRequest, NextResponse } from "next/server";
import { payment } from "@/lib/mercadopago";
import { prisma } from "@/lib/prisma";
import { addDays } from "date-fns";

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const topic = url.searchParams.get("topic") || url.searchParams.get("type");
    const id = url.searchParams.get("id") || url.searchParams.get("data.id");

    // Mercado Pago documentation says it sends body with type and data
    const body = await req.json().catch(() => ({}));
    const action = body.action;
    const type = body.type || topic;
    const dataId = body.data?.id || id;

    if (type !== "payment") {
      return NextResponse.json({ status: "ignored" });
    }

    if (!dataId) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    // Verify payment status
    const paymentInfo = await payment.get({ id: dataId });

    if (!paymentInfo) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const { status, external_reference, transaction_amount } = paymentInfo;

    // Find local transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: external_reference },
      include: { property: true },
    });

    if (!transaction) {
      // Transaction not found or invalid reference
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    // Update Transaction
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: status || "unknown",
        externalId: String(dataId),
        metadata: {
          ...((transaction.metadata as object) || {}),
          payment_info: { id: dataId, status },
        },
      },
    });

    // If approved, Feature the Property
    if (status === "approved" && transaction.propertyId) {
      const days = (transaction.metadata as any)?.days || 30; // default fallout

      const currentExpiry = transaction.property?.featuredExpiresAt;
      const now = new Date();
      const baseDate =
        currentExpiry && currentExpiry > now ? currentExpiry : now;
      const newExpiry = addDays(baseDate, days);

      await prisma.property.update({
        where: { id: transaction.propertyId },
        data: {
          isFeatured: true,
          featuredExpiresAt: newExpiry,
        },
      });
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

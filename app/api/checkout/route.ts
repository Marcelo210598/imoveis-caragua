import { NextRequest, NextResponse } from "next/server";
import { preference } from "@/lib/mercadopago";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { propertyId, planType } = await req.json();

    if (!propertyId || !planType) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 },
      );
    }

    // Define plans
    const plans = {
      weekly: {
        title: `Destaque Semanal - ${property.title?.substring(0, 30)}...`,
        price: 19.9,
        days: 7,
      },
      monthly: {
        title: `Destaque Mensal - ${property.title?.substring(0, 30)}...`,
        price: 49.9,
        days: 30,
      },
    };

    const plan = plans[planType as keyof typeof plans];
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Create a pending transaction record
    const transaction = await prisma.transaction.create({
      data: {
        status: "pending",
        amount: plan.price,
        type: `feature_listing_${planType}`,
        userId: session.user.id,
        propertyId: property.id,
        metadata: { days: plan.days },
      },
    });

    // Create Preference on Mercado Pago
    const result = await preference.create({
      body: {
        items: [
          {
            id: planType,
            title: plan.title,
            quantity: 1,
            unit_price: plan.price,
            currency_id: "BRL",
          },
        ],
        payer: {
          email: session.user.email || "user@example.com",
        },
        externalReference: transaction.id,
        backUrls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/properties?success=true`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/properties?error=true`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/properties?pending=true`,
        },
        autoReturn: "approved",
        notificationUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://litoral-norte-imoveis.vercel.app"}/api/webhooks/mercadopago`,
      },
    });

    return NextResponse.json({ init_point: result.init_point });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

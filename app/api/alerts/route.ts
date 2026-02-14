import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - List user's alerts
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const alerts = await prisma.propertyAlert.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("[ALERTS] Get error:", error);
    return NextResponse.json(
      { error: "Failed to get alerts" },
      { status: 500 },
    );
  }
}

// POST - Create a new alert
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { city, propertyType, maxPrice, minArea } = body;

    // Validate at least one filter
    if (!city && !propertyType && !maxPrice && !minArea) {
      return NextResponse.json(
        { error: "Selecione pelo menos um critério" },
        { status: 400 },
      );
    }

    // Max 5 alerts per user
    const count = await prisma.propertyAlert.count({
      where: { userId: session.user.id },
    });

    if (count >= 5) {
      return NextResponse.json(
        { error: "Máximo de 5 alertas atingido" },
        { status: 400 },
      );
    }

    const alert = await prisma.propertyAlert.create({
      data: {
        userId: session.user.id,
        city: city || null,
        propertyType: propertyType || null,
        maxPrice: maxPrice ? Number(maxPrice) : null,
        minArea: minArea ? Number(minArea) : null,
      },
    });

    return NextResponse.json({ alert }, { status: 201 });
  } catch (error) {
    console.error("[ALERTS] Create error:", error);
    return NextResponse.json(
      { error: "Failed to create alert" },
      { status: 500 },
    );
  }
}

// DELETE - Remove an alert
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing alert ID" }, { status: 400 });
    }

    // Verify ownership
    const alert = await prisma.propertyAlert.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    await prisma.propertyAlert.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ALERTS] Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete alert" },
      { status: 500 },
    );
  }
}

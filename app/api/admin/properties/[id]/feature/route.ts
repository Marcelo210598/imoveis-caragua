import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addDays } from "date-fns";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    // Verificar se é admin
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const propertyId = params.id;
    const { action, duration } = await req.json();

    if (!action || !["activate", "deactivate"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Use 'activate' or 'deactivate'" },
        { status: 400 }
      );
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    if (action === "activate") {
      // Ativar destaque
      const durationDays = duration || 30; // Default: 30 dias
      const expiresAt = addDays(new Date(), durationDays);

      await prisma.property.update({
        where: { id: propertyId },
        data: {
          isFeatured: true,
          featuredExpiresAt: expiresAt,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Destaque ativado por ${durationDays} dias`,
        property: {
          id: propertyId,
          isFeatured: true,
          featuredExpiresAt: expiresAt,
        },
      });
    } else {
      // Desativar destaque
      await prisma.property.update({
        where: { id: propertyId },
        data: {
          isFeatured: false,
          featuredExpiresAt: null,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Destaque desativado",
        property: {
          id: propertyId,
          isFeatured: false,
          featuredExpiresAt: null,
        },
      });
    }
  } catch (error: any) {
    console.error("Feature toggle error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

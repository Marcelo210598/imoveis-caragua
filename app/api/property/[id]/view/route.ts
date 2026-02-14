import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = decodeURIComponent(params.id);
    const body = await req.json().catch(() => ({}));
    const source = body.source ? String(body.source).slice(0, 50) : null;
    const viewerId = body.viewerId ? String(body.viewerId) : null;

    // Transaction: Record individual view AND increment counter
    await prisma.$transaction([
      prisma.propertyView.create({
        data: {
          propertyId: id,
          source,
          viewerId,
        },
      }),
      prisma.property.update({
        where: { id },
        data: { views: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error tracking view:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

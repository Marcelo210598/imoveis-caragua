import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Listar imoveis do usuario logado
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const where: any = { ownerId: session.user.id };
  if (status) {
    where.status = status;
  }

  const properties = await prisma.property.findMany({
    where,
    include: {
      photos: { orderBy: { order: "asc" } },
      _count: { select: { favorites: true, messages: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ properties });
}

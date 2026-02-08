import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  // Verificar se é admin (por enquanto, qualquer usuário autenticado)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const [
    totalProperties,
    totalUsers,
    totalFavorites,
    propertiesByCity,
    propertiesByType,
    recentProperties,
    propertiesBySource,
  ] = await Promise.all([
    prisma.property.count({ where: { status: "ACTIVE" } }),
    prisma.user.count(),
    prisma.favorite.count(),
    prisma.property.groupBy({
      by: ["city"],
      _count: { id: true },
      where: { status: "ACTIVE" },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
    prisma.property.groupBy({
      by: ["propertyType"],
      _count: { id: true },
      where: { status: "ACTIVE" },
    }),
    prisma.property.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        city: true,
        price: true,
        source: true,
        createdAt: true,
      },
    }),
    prisma.property.groupBy({
      by: ["source"],
      _count: { id: true },
      where: { status: "ACTIVE" },
    }),
  ]);

  return NextResponse.json({
    stats: {
      totalProperties,
      totalUsers,
      totalFavorites,
    },
    charts: {
      byCity: propertiesByCity.map((c) => ({
        name: c.city || "Sem cidade",
        value: c._count.id,
      })),
      byType: propertiesByType.map((t) => ({
        name: t.propertyType || "Outro",
        value: t._count.id,
      })),
      bySource: propertiesBySource.map((s) => ({
        name: s.source || "USER",
        value: s._count.id,
      })),
    },
    recentProperties,
  });
}

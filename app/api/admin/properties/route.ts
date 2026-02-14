import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const search = searchParams.get("search") || "";
  const skip = (page - 1) * limit;

  const where: any = {
    status: "ACTIVE", // Por enquanto apenas ativos
  };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
      { id: { equals: search } }, // Busca exata por ID se for um UUID valido (tratado pelo prisma ou se for string simples)
    ];
  }

  try {
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        take: limit,
        skip,
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          title: true,
          city: true,
          price: true,
          source: true,
          isFeatured: true, // Importante para o destaque
          createdAt: true,
          views: true,
          owner: {
            select: { name: true, phone: true },
          },
        },
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({
      properties,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Erro ao listar imoveis admin:", error);
    return NextResponse.json(
      { error: "Erro ao buscar imoveis" },
      { status: 500 },
    );
  }
}

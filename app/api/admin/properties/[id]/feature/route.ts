import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth();

  // Verificar se é admin (por enquanto, qualquer autenticado pode ser admin ou verificar role)
  // Ajuste conforme sua lógica de role
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  // TODO: Verificar role ADMIN se necessário
  // if (session.user.role !== 'ADMIN') ...

  const id = params.id;
  const { isFeatured } = await request.json();

  try {
    const updated = await prisma.property.update({
      where: { id },
      data: {
        isFeatured: isFeatured,
        // Se for destaque, define validade de 30 dias, senão remove
        featuredExpiresAt: isFeatured
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          : null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar destaque:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar imóvel" },
      { status: 500 },
    );
  }
}

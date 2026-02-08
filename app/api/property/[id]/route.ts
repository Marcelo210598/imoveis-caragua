// Hard delete implementation - feb 2026
import { NextRequest, NextResponse } from "next/server";
import { getPropertyById } from "@/lib/properties";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIP, RATE_LIMITS } from "@/lib/rate-limit";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const property = await getPropertyById(decodeURIComponent(params.id));

  if (!property) {
    return NextResponse.json(
      { error: "Imovel nao encontrado" },
      { status: 404 },
    );
  }

  return NextResponse.json(property);
}

// Atualizar status do imovel (dono pode desativar/reativar)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  // Rate limiting - 20 req/min por IP
  const ip = getClientIP(request);
  const rateLimit = await checkRateLimit(
    `modify-property:${ip}`,
    RATE_LIMITS.MODIFY_PROPERTY,
  );
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Muitas requisicoes. Tente novamente em 1 minuto." },
      { status: 429 },
    );
  }

  const property = await prisma.property.findUnique({
    where: { id: params.id },
  });

  if (!property) {
    return NextResponse.json(
      { error: "Imovel nao encontrado" },
      { status: 404 },
    );
  }

  if (property.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Sem permissao" }, { status: 403 });
  }

  const body = await request.json();

  // Converter tipos numéricos se necessário (embora o frontend deva mandar certo)
  // Mas Prisma espera os tipos corretos.

  const data: any = { ...body };

  // Remover campos que não devem ser alterados diretamente ou tratados separadamente
  delete data.id;
  delete data.createdAt;
  delete data.updatedAt;
  delete data.ownerId;
  delete data.views;

  // Se houver fotos, tratar separadamente se for substituir tudo
  // Por simplificacao, vamos assumir que o frontend manda photoUrls e substituimos
  if (data.photoUrls) {
    const photoUrls = data.photoUrls as string[];
    delete data.photoUrls;

    // Atualizar dados básicos primeiro
    await prisma.property.update({
      where: { id: params.id },
      data: {
        ...data,
        photos: {
          deleteMany: {},
          create: photoUrls.map((url, index) => ({
            url,
            order: index,
          })),
        },
      },
    });
  } else {
    // Atualizar sem mexer nas fotos
    await prisma.property.update({
      where: { id: params.id },
      data,
    });
  }

  const updated = await prisma.property.findUnique({
    where: { id: params.id },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({ property: updated });
}

// Deletar imovel permanentemente (hard delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  // Rate limiting - 20 req/min por IP
  const ip = getClientIP(request);
  const rateLimit = await checkRateLimit(
    `modify-property:${ip}`,
    RATE_LIMITS.MODIFY_PROPERTY,
  );
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Muitas requisicoes. Tente novamente em 1 minuto." },
      { status: 429 },
    );
  }

  const property = await prisma.property.findUnique({
    where: { id: params.id },
  });

  if (!property) {
    return NextResponse.json(
      { error: "Imovel nao encontrado" },
      { status: 404 },
    );
  }

  if (property.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Sem permissao" }, { status: 403 });
  }

  // Hard delete - remove permanentemente do banco
  // As fotos e favoritos serão removidos automaticamente por cascade
  await prisma.property.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}

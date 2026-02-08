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
  const allowedFields = ["status", "title", "description", "price"] as const;
  const data: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  }

  const updated = await prisma.property.update({
    where: { id: params.id },
    data,
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
  const rateLimit = checkRateLimit(
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

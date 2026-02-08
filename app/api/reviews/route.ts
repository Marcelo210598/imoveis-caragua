import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createReviewSchema = z.object({
  propertyId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

// GET - Listar reviews de um imóvel
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId");

  if (!propertyId) {
    return NextResponse.json({ error: "propertyId required" }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { propertyId },
    include: {
      user: { select: { id: true, name: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calcular média
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return NextResponse.json({
    reviews,
    avgRating: Math.round(avgRating * 10) / 10,
    totalReviews: reviews.length,
  });
}

// POST - Criar review
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createReviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados invalidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { propertyId, rating, comment } = parsed.data;

  // Verificar se o imóvel existe
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    return NextResponse.json(
      { error: "Imovel nao encontrado" },
      { status: 404 },
    );
  }

  // Verificar se já existe uma review deste usuário
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_propertyId: {
        userId: session.user.id,
        propertyId,
      },
    },
  });

  if (existingReview) {
    // Atualizar review existente
    const updated = await prisma.review.update({
      where: { id: existingReview.id },
      data: { rating, comment },
    });
    return NextResponse.json({ review: updated, updated: true });
  }

  // Criar nova review
  const review = await prisma.review.create({
    data: {
      rating,
      comment,
      userId: session.user.id,
      propertyId,
    },
  });

  return NextResponse.json({ review }, { status: 201 });
}

// DELETE - Remover review
export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const reviewId = searchParams.get("id");

  if (!reviewId) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const review = await prisma.review.findUnique({ where: { id: reviewId } });

  if (!review || review.userId !== session.user.id) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 403 });
  }

  await prisma.review.delete({ where: { id: reviewId } });

  return NextResponse.json({ success: true });
}

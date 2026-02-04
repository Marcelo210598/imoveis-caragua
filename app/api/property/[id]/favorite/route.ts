import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Favoritar imovel
export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  }

  const propertyId = params.id;

  // Verificar se imovel existe
  const property = await prisma.property.findFirst({
    where: {
      OR: [{ id: propertyId }, { externalId: propertyId }],
    },
    select: { id: true, ownerId: true, title: true, propertyType: true, city: true },
  });

  if (!property) {
    return NextResponse.json({ error: 'Imovel nao encontrado' }, { status: 404 });
  }

  // Criar favorito (ignora se ja existe)
  let isNew = false;
  try {
    await prisma.favorite.create({
      data: {
        userId: session.user.id,
        propertyId: property.id,
      },
    });
    isNew = true;
  } catch {
    // Unique constraint - ja favoritado, tudo certo
  }

  // Notificar dono do imovel (se eh de usuario e nao eh o proprio)
  if (isNew && property.ownerId && property.ownerId !== session.user.id) {
    const propertyTitle = property.title || `${property.propertyType} em ${property.city}`;
    await prisma.notification.create({
      data: {
        userId: property.ownerId,
        type: 'FAVORITE',
        title: 'Novo favorito!',
        message: `Alguem favoritou seu imovel "${propertyTitle}"`,
        propertyId: property.id,
      },
    }).catch(() => {
      // Nao impedir a acao principal se notificacao falhar
    });
  }

  return NextResponse.json({ favorited: true });
}

// Desfavoritar imovel
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  }

  const propertyId = params.id;

  // Buscar imovel pelo id ou externalId
  const property = await prisma.property.findFirst({
    where: {
      OR: [{ id: propertyId }, { externalId: propertyId }],
    },
  });

  if (!property) {
    return NextResponse.json({ error: 'Imovel nao encontrado' }, { status: 404 });
  }

  await prisma.favorite.deleteMany({
    where: {
      userId: session.user.id,
      propertyId: property.id,
    },
  });

  return NextResponse.json({ favorited: false });
}

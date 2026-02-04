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
  });

  if (!property) {
    return NextResponse.json({ error: 'Imovel nao encontrado' }, { status: 404 });
  }

  // Criar favorito (ignora se ja existe)
  try {
    await prisma.favorite.create({
      data: {
        userId: session.user.id,
        propertyId: property.id,
      },
    });
  } catch {
    // Unique constraint - ja favoritado, tudo certo
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

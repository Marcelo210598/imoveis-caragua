import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Retorna IDs dos imoveis favoritados pelo usuario
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ids: [] });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    select: { propertyId: true },
  });

  return NextResponse.json({
    ids: favorites.map((f) => f.propertyId),
  });
}

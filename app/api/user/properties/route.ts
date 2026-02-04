import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Listar imoveis do usuario logado
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  }

  const properties = await prisma.property.findMany({
    where: { ownerId: session.user.id },
    include: {
      photos: { orderBy: { order: 'asc' } },
      _count: { select: { favorites: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ properties });
}

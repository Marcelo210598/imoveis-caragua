import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Atualizar perfil do usuario
export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  }

  const body = await request.json();
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 100) : undefined;

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name !== undefined && { name }),
    },
    select: { id: true, name: true, phone: true, avatarUrl: true },
  });

  return NextResponse.json({ user: updated });
}

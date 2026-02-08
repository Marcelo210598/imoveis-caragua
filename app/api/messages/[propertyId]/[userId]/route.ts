import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Buscar mensagens de uma conversa específica
export async function GET(
  request: NextRequest,
  { params }: { params: { propertyId: string; userId: string } },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const { propertyId, userId: otherUserId } = params;
  const currentUserId = session.user.id;

  // Buscar mensagens da conversa
  const messages = await prisma.message.findMany({
    where: {
      propertyId,
      OR: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, name: true } },
    },
  });

  // Marcar mensagens como lidas
  await prisma.message.updateMany({
    where: {
      propertyId,
      senderId: otherUserId,
      receiverId: currentUserId,
      read: false,
    },
    data: { read: true },
  });

  // Buscar info do imóvel e outro usuário
  const [property, otherUser] = await Promise.all([
    prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, title: true, city: true },
    }),
    prisma.user.findUnique({
      where: { id: otherUserId },
      select: { id: true, name: true, phone: true },
    }),
  ]);

  return NextResponse.json({
    messages,
    property,
    otherUser,
  });
}

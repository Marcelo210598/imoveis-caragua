import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Listar conversas do usuário
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const userId = session.user.id;

  // Buscar todas as mensagens agrupadas por propertyId e outro usuário
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    include: {
      sender: { select: { id: true, name: true, phone: true } },
      receiver: { select: { id: true, name: true, phone: true } },
      property: { select: { id: true, title: true, city: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Agrupar por conversação (propertyId + outro usuário)
  const conversationsMap = new Map<
    string,
    {
      propertyId: string;
      propertyTitle: string;
      propertyCity: string;
      otherUser: { id: string; name: string | null; phone: string };
      lastMessage: string;
      lastMessageAt: Date;
      unreadCount: number;
    }
  >();

  for (const msg of messages) {
    const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
    const key = `${msg.propertyId}-${otherUser.id}`;

    if (!conversationsMap.has(key)) {
      const unreadCount = messages.filter(
        (m) =>
          m.propertyId === msg.propertyId &&
          m.receiverId === userId &&
          !m.read &&
          (m.senderId === otherUser.id || m.receiverId === otherUser.id),
      ).length;

      conversationsMap.set(key, {
        propertyId: msg.propertyId,
        propertyTitle: msg.property.title || "Imóvel",
        propertyCity: msg.property.city,
        otherUser: {
          id: otherUser.id,
          name: otherUser.name,
          phone: otherUser.phone,
        },
        lastMessage: msg.content,
        lastMessageAt: msg.createdAt,
        unreadCount,
      });
    }
  }

  return NextResponse.json({
    conversations: Array.from(conversationsMap.values()),
  });
}

// POST - Enviar mensagem
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const { propertyId, receiverId, content } = body;

  if (!propertyId || !receiverId || !content?.trim()) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  // Verificar se o imóvel existe
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    return NextResponse.json(
      { error: "Imóvel não encontrado" },
      { status: 404 },
    );
  }

  // Criar mensagem
  const message = await prisma.message.create({
    data: {
      content: content.trim().slice(0, 2000),
      senderId: session.user.id,
      receiverId,
      propertyId,
    },
    include: {
      sender: { select: { id: true, name: true, phone: true } },
    },
  });

  // Criar notificação para o destinatário
  await prisma.notification.create({
    data: {
      userId: receiverId,
      type: "MESSAGE",
      title: "Nova mensagem",
      message: `${session.user.name || "Alguém"} enviou uma mensagem sobre ${property.title || "um imóvel"}`,
      propertyId,
    },
  });

  return NextResponse.json({ message }, { status: 201 });
}

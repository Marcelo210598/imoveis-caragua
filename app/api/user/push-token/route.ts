import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  token: z.string().min(1, "Token is required"),
  platform: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { token, platform } = schema.parse(body);

    // Salvar ou atualizar o token
    await prisma.mobileDevice.upsert({
      where: { token },
      update: {
        userId: session.user.id,
        platform: platform || "android",
        updatedAt: new Date(),
      },
      create: {
        token,
        userId: session.user.id,
        platform: platform || "android",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[MOBILE_PUSH_TOKEN]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { checkRateLimit, getClientIP, RATE_LIMITS } from "@/lib/rate-limit";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  // Rate limiting - 30 req/min por IP
  const ip = getClientIP(request);
  const rateLimit = checkRateLimit(`upload:${ip}`, RATE_LIMITS.UPLOAD);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Muitas requisicoes de upload. Tente novamente em 1 minuto." },
      { status: 429 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { error: "Nenhum arquivo enviado" },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Tipo de arquivo nao permitido. Use JPG, PNG ou WebP." },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Arquivo muito grande. Maximo 5MB." },
      { status: 400 },
    );
  }

  const timestamp = Date.now();
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `properties/${session.user.id}/${timestamp}.${ext}`;

  const blob = await put(filename, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return NextResponse.json({ url: blob.url });
}

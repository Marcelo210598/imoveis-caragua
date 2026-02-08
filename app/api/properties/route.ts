import { NextRequest, NextResponse } from "next/server";
import { filterProperties, getUniqueCities } from "@/lib/properties";
import { PropertyFilters } from "@/types/property";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPropertySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { checkRateLimit, getClientIP, RATE_LIMITS } from "@/lib/rate-limit";

const MAX_PROPERTIES_PER_USER = 5;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const filters: PropertyFilters = {};

  const city = searchParams.get("city");
  if (city) filters.city = city;

  const minPrice = searchParams.get("minPrice");
  if (minPrice) filters.minPrice = Number(minPrice);

  const maxPrice = searchParams.get("maxPrice");
  if (maxPrice) filters.maxPrice = Number(maxPrice);

  const bedrooms = searchParams.get("bedrooms");
  if (bedrooms) filters.bedrooms = Number(bedrooms);

  const onlyDeals = searchParams.get("onlyDeals");
  if (onlyDeals === "true") filters.onlyDeals = true;

  const search = searchParams.get("search");
  if (search) filters.searchTerm = search;

  const type = searchParams.get("type");
  if (type) filters.type = type;

  const propertyType = searchParams.get("propertyType");
  if (propertyType) filters.propertyType = propertyType;

  const minArea = searchParams.get("minArea");
  if (minArea) filters.minArea = Number(minArea);

  const maxArea = searchParams.get("maxArea");
  if (maxArea) filters.maxArea = Number(maxArea);

  const [filtered, cities] = await Promise.all([
    filterProperties(filters),
    getUniqueCities(),
  ]);

  return NextResponse.json({
    properties: filtered,
    total: filtered.length,
    cities,
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  // Rate limiting - 10 req/min por IP
  const ip = getClientIP(request);
  const rateLimit = checkRateLimit(
    `create-property:${ip}`,
    RATE_LIMITS.CREATE_PROPERTY,
  );
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Muitas requisicoes. Tente novamente em 1 minuto." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(rateLimit.resetTime),
        },
      },
    );
  }

  // Limite anti-spam
  const userPropertyCount = await prisma.property.count({
    where: { ownerId: session.user.id, status: "ACTIVE" },
  });

  if (userPropertyCount >= MAX_PROPERTIES_PER_USER) {
    return NextResponse.json(
      {
        error: `Limite de ${MAX_PROPERTIES_PER_USER} imoveis ativos por usuario.`,
      },
      { status: 403 },
    );
  }

  const body = await request.json();
  const parsed = createPropertySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados invalidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const property = await prisma.property.create({
    data: {
      source: "USER",
      status: "ACTIVE",
      type: data.type,
      propertyType: data.propertyType,
      title: data.title,
      description: data.description || null,
      price: data.price,
      area: data.area || null,
      bedrooms: data.bedrooms ?? null,
      bathrooms: data.bathrooms ?? null,
      parkingSpaces: data.parkingSpaces ?? null,
      city: data.city,
      citySlug: slugify(data.city),
      neighborhood: data.neighborhood || null,
      address: data.address || null,
      ownerId: session.user.id,
      photos: {
        create: data.photoUrls.map((url, index) => ({
          url,
          order: index,
        })),
      },
    },
    include: {
      photos: { orderBy: { order: "asc" } },
    },
  });

  return NextResponse.json({ property }, { status: 201 });
}

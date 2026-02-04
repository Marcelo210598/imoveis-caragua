import { prisma } from '@/lib/prisma';
import { PropertyFilters, CityStats } from '@/types/property';
import { Prisma } from '@/lib/generated/prisma/client';

export async function getAllProperties() {
  return prisma.property.findMany({
    where: { status: 'ACTIVE' },
    include: { photos: { orderBy: { order: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function filterProperties(filters: PropertyFilters) {
  const where: Prisma.PropertyWhereInput = {
    status: 'ACTIVE',
  };

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.city) {
    where.city = filters.city;
  }

  if (filters.minPrice || filters.maxPrice) {
    where.price = {};
    if (filters.minPrice) where.price.gte = filters.minPrice;
    if (filters.maxPrice) where.price.lte = filters.maxPrice;
  }

  if (filters.bedrooms) {
    if (filters.bedrooms >= 4) {
      where.bedrooms = { gte: 4 };
    } else {
      where.bedrooms = filters.bedrooms;
    }
  }

  if (filters.propertyType) {
    where.propertyType = filters.propertyType;
  }

  if (filters.onlyDeals) {
    where.dealScore = { gte: 60 };
  }

  if (filters.searchTerm) {
    const term = filters.searchTerm;
    where.OR = [
      { title: { contains: term, mode: 'insensitive' } },
      { neighborhood: { contains: term, mode: 'insensitive' } },
      { address: { contains: term, mode: 'insensitive' } },
      { city: { contains: term, mode: 'insensitive' } },
      { propertyType: { contains: term, mode: 'insensitive' } },
    ];
  }

  return prisma.property.findMany({
    where,
    include: { photos: { orderBy: { order: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPropertyById(id: string) {
  // Tentar buscar por externalId primeiro (compatibilidade com dados scraped)
  const property = await prisma.property.findFirst({
    where: {
      OR: [
        { externalId: id },
        { id: id },
      ],
    },
    include: {
      photos: { orderBy: { order: 'asc' } },
      owner: { select: { id: true, name: true, phone: true, avatarUrl: true } },
    },
  });

  return property;
}

export async function getTopDeals(limit: number = 10) {
  return prisma.property.findMany({
    where: {
      status: 'ACTIVE',
      dealScore: { gte: 60 },
    },
    include: { photos: { orderBy: { order: 'asc' } } },
    orderBy: { dealScore: 'desc' },
    take: limit,
  });
}

export async function getCityStats(): Promise<CityStats[]> {
  const stats = await prisma.property.groupBy({
    by: ['city', 'citySlug'],
    where: { status: 'ACTIVE' },
    _count: { id: true },
    _avg: { price: true, pricePerSqm: true },
  });

  return stats.map((s) => ({
    name: s.city,
    slug: s.citySlug || s.city.toLowerCase(),
    count: s._count.id,
    avgPrice: Math.round(s._avg.price || 0),
    avgPriceSqm: Math.round(s._avg.pricePerSqm || 0),
  }));
}

export async function getUniqueCities(): Promise<string[]> {
  const cities = await prisma.property.findMany({
    where: { status: 'ACTIVE' },
    select: { city: true },
    distinct: ['city'],
    orderBy: { city: 'asc' },
  });

  return cities.map((c) => c.city);
}

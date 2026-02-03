import fs from 'fs';
import path from 'path';
import { Property, PropertyFilters, CityStats } from '@/types/property';

const DATA_PATH = path.join(
  process.cwd(),
  '..',
  'litoral-norte-scraper',
  'data',
  'processed',
  'all_properties.json'
);

let cachedProperties: Property[] | null = null;

export function getAllProperties(): Property[] {
  if (cachedProperties) return cachedProperties;

  try {
    const fileContents = fs.readFileSync(DATA_PATH, 'utf8');
    cachedProperties = JSON.parse(fileContents) as Property[];
    return cachedProperties;
  } catch (error) {
    console.error('Erro ao carregar imoveis:', error);
    return [];
  }
}

export function filterProperties(
  properties: Property[],
  filters: PropertyFilters
): Property[] {
  return properties.filter((p) => {
    if (filters.city && p.city !== filters.city) return false;

    if (filters.minPrice && (p.price || 0) < filters.minPrice) return false;
    if (filters.maxPrice && (p.price || 0) > filters.maxPrice) return false;

    if (filters.bedrooms) {
      if (filters.bedrooms >= 4) {
        if ((p.bedrooms || 0) < 4) return false;
      } else {
        if (p.bedrooms !== filters.bedrooms) return false;
      }
    }

    if (filters.propertyType && p.property_type !== filters.propertyType)
      return false;

    if (filters.onlyDeals && p.deal_score < 60) return false;

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      const searchable = [
        p.title,
        p.neighborhood,
        p.address,
        p.city,
        p.property_type,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!searchable.includes(term)) return false;
    }

    return true;
  });
}

export function getPropertyById(id: string): Property | null {
  const properties = getAllProperties();
  return properties.find((p) => p.external_id === id) || null;
}

export function getTopDeals(limit: number = 10): Property[] {
  const properties = getAllProperties();
  return properties
    .filter((p) => p.deal_score >= 60)
    .sort((a, b) => b.deal_score - a.deal_score)
    .slice(0, limit);
}

export function getCityStats(): CityStats[] {
  const properties = getAllProperties();
  const cityMap = new Map<
    string,
    { count: number; totalPrice: number; totalPriceSqm: number; validSqm: number }
  >();

  for (const p of properties) {
    const stats = cityMap.get(p.city) || {
      count: 0,
      totalPrice: 0,
      totalPriceSqm: 0,
      validSqm: 0,
    };
    stats.count++;
    if (p.price) stats.totalPrice += p.price;
    if (p.price_per_sqm) {
      stats.totalPriceSqm += p.price_per_sqm;
      stats.validSqm++;
    }
    cityMap.set(p.city, stats);
  }

  const citySlugMap: Record<string, string> = {
    Caraguatatuba: 'caraguatatuba',
    'Sao Sebastiao': 'sao-sebastiao',
    Ubatuba: 'ubatuba',
    Ilhabela: 'ilhabela',
  };

  return Array.from(cityMap.entries()).map(([name, stats]) => ({
    name,
    slug: citySlugMap[name] || name.toLowerCase(),
    count: stats.count,
    avgPrice: stats.count > 0 ? Math.round(stats.totalPrice / stats.count) : 0,
    avgPriceSqm:
      stats.validSqm > 0
        ? Math.round(stats.totalPriceSqm / stats.validSqm)
        : 0,
  }));
}

export function getUniqueCities(): string[] {
  const properties = getAllProperties();
  return Array.from(new Set(properties.map((p) => p.city))).sort();
}

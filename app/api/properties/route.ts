import { NextRequest, NextResponse } from 'next/server';
import { filterProperties, getUniqueCities } from '@/lib/properties';
import { PropertyFilters } from '@/types/property';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const filters: PropertyFilters = {};

  const city = searchParams.get('city');
  if (city) filters.city = city;

  const minPrice = searchParams.get('minPrice');
  if (minPrice) filters.minPrice = Number(minPrice);

  const maxPrice = searchParams.get('maxPrice');
  if (maxPrice) filters.maxPrice = Number(maxPrice);

  const bedrooms = searchParams.get('bedrooms');
  if (bedrooms) filters.bedrooms = Number(bedrooms);

  const onlyDeals = searchParams.get('onlyDeals');
  if (onlyDeals === 'true') filters.onlyDeals = true;

  const search = searchParams.get('search');
  if (search) filters.searchTerm = search;

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

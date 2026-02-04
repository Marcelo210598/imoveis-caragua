export interface PropertyPhoto {
  id: string;
  url: string;
  order: number;
  propertyId?: string;
  createdAt?: Date | string;
}

export interface PropertyOwner {
  id: string;
  name: string | null;
  phone: string;
  avatarUrl: string | null;
}

export interface Property {
  id: string;
  externalId: string | null;
  source: string;
  status: string;
  type: string;
  propertyType: string;
  title: string | null;
  description: string | null;
  price: number | null;
  area: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  city: string;
  citySlug: string | null;
  neighborhood: string | null;
  address: string | null;
  url: string | null;
  latitude: number | null;
  longitude: number | null;
  pricePerSqm: number | null;
  dealScore: number;
  avgNeighborhoodPriceSqm: number | null;
  scrapedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  ownerId: string | null;
  photos: PropertyPhoto[];
  owner?: PropertyOwner | null;
}

export interface PropertyFilters {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  propertyType?: string;
  onlyDeals?: boolean;
  searchTerm?: string;
}

export interface CityStats {
  name: string;
  slug: string;
  count: number;
  avgPrice: number;
  avgPriceSqm: number;
}

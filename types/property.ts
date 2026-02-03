export interface Property {
  external_id: string;
  source: string;
  type: string;
  property_type: string;
  title: string | null;
  price: number | null;
  area: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parking_spaces: number | null;
  city: string;
  city_slug?: string;
  neighborhood: string | null;
  address: string | null;
  url: string;
  photos: string[];
  price_per_sqm: number | null;
  deal_score: number;
  avg_neighborhood_price_sqm?: number | null;
  sources?: string[];
  scraped_at?: string;
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

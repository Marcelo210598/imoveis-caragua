import { PropertySource } from "@/lib/generated/prisma/client";
import { ScraperLogger } from "./logger";

export interface ScrapedProperty {
  externalId: string;
  source: PropertySource;
  url: string;
  type: "venda" | "aluguel";
  propertyType: string;
  title: string;
  description?: string;
  price: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  city: string;
  neighborhood?: string;
  address?: string;
  photoUrls: string[];
  features?: string[];
  latitude?: number;
  longitude?: number;
}

export interface ScraperConfig {
  source: PropertySource;
  delayMs?: number;
  timeout?: number;
  maxRetries?: number;
  cities: string[];
}

export abstract class BaseScraper {
  protected logger: ScraperLogger;
  protected config: ScraperConfig;

  constructor(config: ScraperConfig, logger?: ScraperLogger) {
    this.config = {
      delayMs: 2000,
      timeout: 30000,
      maxRetries: 3,
      ...config,
    };
    this.logger = logger || new ScraperLogger();
  }

  abstract scrape(filters?: any): Promise<ScrapedProperty[]>;

  protected async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  protected getStandardCityName(rawCity: string): string {
    const normalized = rawCity.toLowerCase().trim();
    if (normalized.includes("caragua")) return "Caraguatatuba";
    if (normalized.includes("tuba")) return "Ubatuba";
    if (normalized.includes("sebastiao") || normalized.includes("sebastião"))
      return "Sao Sebastiao";
    if (normalized.includes("ilhabela")) return "Ilhabela";
    return rawCity; // Retorna original se não der match, normalizer vai tratar depois
  }
}

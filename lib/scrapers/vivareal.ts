import { BaseScraper, ScrapedProperty, ScraperConfig } from "./base";
import { PropertySource } from "@/lib/generated/prisma/client";
import axios from "axios";
import * as cheerio from "cheerio";
import { DataNormalizer } from "./normalizer";

export class VivaRealScraper extends BaseScraper {
  constructor(config: Partial<ScraperConfig> = {}) {
    super({
      source: PropertySource.VIVAREAL,
      cities: ["Caraguatatuba", "Ubatuba", "Sao Sebastiao", "Ilhabela"],
      ...config,
    });
  }

  async scrape(filters?: any): Promise<ScrapedProperty[]> {
    const results: ScrapedProperty[] = [];
    const cities = filters?.cities || this.config.cities;

    this.logger.info(
      `Iniciando scraping do VivaReal para ${cities.length} cidades`,
    );

    for (const city of cities) {
      try {
        const properties = await this.scrapeCity(city);
        results.push(...properties);
        await this.delay(this.config.delayMs || 2500);
      } catch (error) {
        this.logger.error(`Erro ao processar cidade ${city}:`, error);
      }
    }

    return results;
  }

  private async scrapeCity(city: string): Promise<ScrapedProperty[]> {
    const cityNameNormalized = city
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/ã/g, "a")
      .replace(/á/g, "a")
      .replace(/õ/g, "o");
    const url = `https://www.vivareal.com.br/venda/sp/${cityNameNormalized}/`;

    this.logger.info(`Acessando ${url}`);

    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);
      const properties: ScrapedProperty[] = [];

      $(".property-card__container").each((_, element) => {
        try {
          const el = $(element);
          const link = el.find("a.property-card__content-link").attr("href");
          if (!link) return;

          const fullUrl = link.startsWith("http")
            ? link
            : `https://www.vivareal.com.br${link}`;
          const externalId = link.split("/")[3] || `viva-${Math.random()}`; // Tentativa de extrair ID

          const rawPrice = el
            .find(".property-card__price")
            .text()
            .match(/\d+/g)
            ?.join("");
          const title = el.find(".property-card__title").text().trim();
          const address = el.find(".property-card__address").text().trim();

          if (!rawPrice || !title) return;

          const rawData: ScrapedProperty = {
            source: PropertySource.VIVAREAL,
            externalId: externalId,
            url: fullUrl,
            type: "venda",
            propertyType: "imovel",
            title: title,
            price: Number(rawPrice),
            city: this.getStandardCityName(city),
            address: address,
            photoUrls: [], // VivaReal carrega imagens via JS muitas vezes, difícil pegar no HTML inicial
            features: [],
          };

          const normalized = DataNormalizer.normalize(rawData);
          if (normalized) properties.push(normalized);
        } catch (e) {
          // ignore error
        }
      });

      return properties;
    } catch (error) {
      this.logger.error(
        `Erro VivaReal: ${error instanceof Error ? error.message : "Unknown"}`,
      );
      return [];
    }
  }
}

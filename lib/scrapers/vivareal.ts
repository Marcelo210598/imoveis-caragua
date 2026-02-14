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
      .replace(/á/g, "a")
      .replace(/õ/g, "o");

    // Scrape first 3 pages
    const properties: ScrapedProperty[] = [];
    const MAX_PAGES = 3;

    for (let page = 1; page <= MAX_PAGES; page++) {
      const url = `https://www.vivareal.com.br/venda/sp/${cityNameNormalized}/?pagina=${page}`;
      this.logger.info(`Acessando página ${page}: ${url}`);

      try {
        const pageProps = await this.scrapePage(url, city);
        if (pageProps.length === 0) break; // Stop if no results
        properties.push(...pageProps);
        await this.delay(2000); // Wait between pages
      } catch (e) {
        this.logger.error(`Erro na página ${page} de ${city}`);
      }
    }

    return properties;
  }

  private async scrapePage(
    url: string,
    city: string,
  ): Promise<ScrapedProperty[]> {
    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
          "Accept-Encoding": "gzip, deflate, br",
          Referer: "https://www.google.com/",
          "Upgrade-Insecure-Requests": "1",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "cross-site",
          "Sec-Fetch-User": "?1",
          "Cache-Control": "max-age=0",
        },
        timeout: 15000,
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
          const externalId = link.split("/")[3] || `viva-${Math.random()}`;

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
            photoUrls: [],
            features: [],
          };

          const normalized = DataNormalizer.normalize(rawData);
          if (normalized) properties.push(normalized);
        } catch (e) {
          // ignore error
        }
      });

      return properties;
    } catch (error: any) {
      this.logger.error(`Erro VivaReal: ${error.message || "Unknown"}`);
      return [];
    }
  }
}

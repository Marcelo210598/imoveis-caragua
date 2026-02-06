import { BaseScraper, ScrapedProperty, ScraperConfig } from "./base";
import { PropertySource } from "@/lib/generated/prisma";
import axios from "axios";
import * as cheerio from "cheerio";
import { DataNormalizer } from "./normalizer";

export class OLXScraper extends BaseScraper {
  constructor(config: Partial<ScraperConfig> = {}) {
    super({
      source: PropertySource.OLX,
      cities: ["Caraguatatuba", "Ubatuba", "Sao Sebastiao", "Ilhabela"],
      ...config,
    });
  }

  async scrape(filters?: any): Promise<ScrapedProperty[]> {
    const results: ScrapedProperty[] = [];
    const cities = filters?.cities || this.config.cities;

    this.logger.info(`Iniciando scraping OLX para ${cities.length} cidades`);

    for (const city of cities) {
      try {
        const properties = await this.scrapeCity(city);
        results.push(...properties);
        await this.delay(this.config.delayMs || 3000);
      } catch (error) {
        this.logger.error(`Erro ao processar cidade ${city} no OLX:`, error);
      }
    }

    return results;
  }

  private async scrapeCity(city: string): Promise<ScrapedProperty[]> {
    // Mapping simples de cidades para URL da OLX (precisa ser preciso)
    // SP > Vale do Paraíba e Litoral Norte
    // Regiões:
    // Caraguatatuba: https://www.olx.com.br/imoveis/estado-sp/vale-do-paraiba-and-litoral-norte/caraguatatuba

    let urlCityPart = "";
    const normalizedCity = city.toLowerCase();

    if (normalizedCity.includes("caragua")) urlCityPart = "caraguatatuba";
    else if (normalizedCity.includes("ubatuba")) urlCityPart = "ubatuba";
    else if (normalizedCity.includes("ilhabela")) urlCityPart = "ilhabela";
    else if (normalizedCity.includes("sebastiao"))
      urlCityPart = "sao-sebastiao";
    else return [];

    const url = `https://www.olx.com.br/imoveis/estado-sp/vale-do-paraiba-e-litoral-norte/${urlCityPart}`;

    this.logger.info(`Acessando ${url}`);

    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0 4472.124 Safari/537.36",
        },
      });

      const $ = cheerio.load(response.data);
      const properties: ScrapedProperty[] = [];

      // O seletor da OLX muda frequentemente e usa classes geradas aleatoriamente
      // Estratégia: buscar por atributo data-lurker-detail="list_id" ou links de properties

      const items = $("ul#ad-list li a"); // Tentar um seletor genérico na lista de anúncios

      items.each((_, element) => {
        try {
          const el = $(element);
          const link = el.attr("href") || "";

          if (!link.includes("/imoveis/")) return;

          const title = el.find("h2").text().trim();
          const priceText = el.find("h3").text().replace("R$", "").trim(); // Geralmente o preço está num h3 ou próximo
          const rawPrice = priceText.replace(/\./g, "");

          if (!title || !rawPrice) return;

          // Extrair location do texto se possível, ou assumir a da busca

          const rawData: ScrapedProperty = {
            source: PropertySource.OLX,
            externalId: link.split("-").pop() || `olx-${Math.random()}`, // ID geralmente é o último segmento numérico
            url: link,
            type: "venda", // Simplificação
            propertyType: "imovel",
            title: title,
            price: Number(rawPrice),
            city: this.getStandardCityName(city),
            photoUrls: [],
            features: [],
          };

          const normalized = DataNormalizer.normalize(rawData);
          if (normalized) properties.push(normalized);
        } catch (e) {
          // ignore
        }
      });

      return properties;
    } catch (error) {
      this.logger.error(
        `Erro OLX: ${error instanceof Error ? error.message : "Unknown"}`,
      );
      return [];
    }
  }
}

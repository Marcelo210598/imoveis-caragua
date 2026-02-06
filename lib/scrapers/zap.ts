import { BaseScraper, ScrapedProperty, ScraperConfig } from "./base";
import { PropertySource } from "@/lib/generated/prisma/client";
import axios from "axios";
import * as cheerio from "cheerio";
import { DataNormalizer } from "./normalizer";

export class ZapScraper extends BaseScraper {
  constructor(config: Partial<ScraperConfig> = {}) {
    super({
      source: PropertySource.ZAP,
      cities: ["Caraguatatuba", "Ubatuba", "Sao Sebastiao", "Ilhabela"],
      ...config,
    });
  }

  async scrape(filters?: any): Promise<ScrapedProperty[]> {
    const results: ScrapedProperty[] = [];
    const cities = filters?.cities || this.config.cities;

    this.logger.info(
      `Iniciando scraping do ZAP Imóveis para ${cities.length} cidades`,
    );

    for (const city of cities) {
      try {
        const properties = await this.scrapeCity(city);
        results.push(...properties);
        await this.delay(this.config.delayMs || 2000);
      } catch (error) {
        this.logger.error(`Erro ao processar cidade ${city}:`, error);
      }
    }

    this.logger.info(
      `Finalizado scraping ZAP. Total: ${results.length} imóveis.`,
    );
    return results;
  }

  private async scrapeCity(city: string): Promise<ScrapedProperty[]> {
    const cityNameNormalized = city
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/ã/g, "a")
      .replace(/á/g, "a")
      .replace(/õ/g, "o");
    // URL base para venda e aluguel - vamos iterar por ambos ou fazer uma busca geral
    // Ex: https://www.zapimoveis.com.br/venda/imoveis/sp+caraguatatuba/

    // ZAP usa uma API interna ou renderização SSR. Vamos tentar scrape do HTML primeiro.
    // Nota: ZAP tem proteção forte (Cloudflare). Em produção real, precisaria de proxies/Puppeteer.
    // Aqui faremos uma implementação "best effort" via axios com headers simulados.

    const url = `https://www.zapimoveis.com.br/venda/imoveis/sp+${cityNameNormalized}/`;

    this.logger.info(`Acessando ${url}`);

    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
          Referer: "https://www.google.com/",
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);
      const properties: ScrapedProperty[] = [];

      // Seletores podem mudar, isso é frágil e idealmente deve ser atualizado
      const listings = $(".card-container"); // Exemplo de seletor genérico

      listings.each((_, element) => {
        try {
          // Extração Mockada/Estimada - Seletores reais precisam ser verificados no site vivo
          const el = $(element);
          const link = el.find("a").attr("href");
          if (!link) return;

          const fullUrl = link.startsWith("http")
            ? link
            : `https://www.zapimoveis.com.br${link}`;
          const externalId = link.split("/")[2]; // Ex: /imovel/ID-XYZ

          const rawPrice = el
            .find(".simple-card__price strong")
            .text()
            .replace(/\D/g, "");
          const title = el.find(".simple-card__address").text().trim();

          if (!rawPrice || !title) return;

          const rawData: ScrapedProperty = {
            source: PropertySource.ZAP,
            externalId: externalId || `zap-${Math.random()}`, // Fallback ID
            url: fullUrl,
            type: "venda", // Assumindo venda pela URL, poderia ser dinâmico
            propertyType: "imovel", // Genérico, normalizer tenta refinar
            title: title,
            price: Number(rawPrice),
            city: this.getStandardCityName(city),
            photoUrls: [],
            features: [],
          };

          const normalized = DataNormalizer.normalize(rawData);
          if (normalized) properties.push(normalized);
        } catch (e) {
          this.logger.warn("Erro ao parsear imóvel individual", e);
        }
      });

      if (properties.length === 0) {
        this.logger.warn(
          `Nenhum imóvel encontrado em ${city}. Os seletores podem estar desatualizados ou bloqueio ativo.`,
        );
      }

      return properties;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        this.logger.error(`BLOQUEIO ZAP (403): O site detectou o bot.`);
      }
      throw error;
    }
  }
}

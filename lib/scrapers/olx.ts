import { BaseScraper, ScrapedProperty, ScraperConfig } from "./base";
import { PropertySource } from "@/lib/generated/prisma/client";
import axios from "axios";
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
    let urlCityPart = "";
    const normalizedCity = city.toLowerCase();

    if (normalizedCity.includes("caragua")) urlCityPart = "caraguatatuba";
    else if (normalizedCity.includes("ubatuba")) urlCityPart = "ubatuba";
    else if (normalizedCity.includes("ilhabela")) urlCityPart = "ilhabela";
    else if (normalizedCity.includes("sebastiao"))
      urlCityPart = "sao-sebastiao";
    else return [];

    const urlBase = `https://www.olx.com.br/imoveis/estado-sp/vale-do-paraiba-e-litoral-norte/${urlCityPart}`;
    const properties: ScrapedProperty[] = [];
    const MAX_PAGES = 3;

    for (let page = 1; page <= MAX_PAGES; page++) {
      const url = page === 1 ? urlBase : `${urlBase}?o=${page}`;
      this.logger.info(`Acessando página ${page}: ${url}`);

      try {
        const response = await axios.get(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          },
          timeout: 10000,
        });

        const html = response.data;
        const match = html.match(
          /<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/,
        );

        if (!match || !match[1]) {
          this.logger.warn(
            `OLX: __NEXT_DATA__ não encontrado em ${city} (página ${page})`,
          );
          break;
        }

        const data = JSON.parse(match[1]);
        const ads = data.props?.pageProps?.ads || [];

        if (ads.length === 0) break;

        for (const ad of ads) {
          try {
            if (!ad.subject || !ad.url || !ad.price) continue;

            // Ignore professional ads if needed, or non-real estate
            // "categoryName" usually "Casas", "Apartamentos", etc.

            const rawPrice = ad.priceValue
              ? ad.priceValue.replace(/\D/g, "")
              : "0";

            // Map properties (features)
            const features: string[] = [];
            if (ad.properties) {
              ad.properties.forEach((p: any) => {
                if (
                  p.name === "re_features" ||
                  p.name === "re_complex_features"
                ) {
                  features.push(...p.value.split(", "));
                }
              });
            }

            // Map images
            const photoUrls = ad.images
              ? ad.images.map((i: any) => i.original)
              : [];

            const rawData: ScrapedProperty = {
              source: PropertySource.OLX,
              externalId: String(ad.listId),
              url: ad.url,
              type: "venda",
              propertyType: this.mapCategory(ad.categoryName),
              title: ad.subject,
              price: Number(rawPrice),
              city:
                ad.locationDetails?.municipality ||
                this.getStandardCityName(city),
              neighborhood: ad.locationDetails?.neighbourhood,
              photoUrls: photoUrls,
              features: features,
            };

            const normalized = DataNormalizer.normalize(rawData);
            if (normalized) properties.push(normalized);
          } catch (e) {
            // ignore individual item error
          }
        }

        await this.delay(2000);
      } catch (e) {
        this.logger.error(`Erro na página ${page} de ${city}: ${e.message}`);
        break;
      }
    }

    this.logger.info(
      `OLX: Encontrados ${properties.length} imóveis em ${city}`,
    );
    return properties;
  }

  private mapCategory(
    cat: string,
  ): "imovel" | "casa" | "apartamento" | "terreno" {
    if (!cat) return "imovel";
    const c = cat.toLowerCase();
    if (c.includes("casa")) return "casa";
    if (c.includes("apartamento")) return "apartamento";
    if (c.includes("terreno") || c.includes("lote")) return "terreno";
    return "imovel";
  }
}

import { ScrapedProperty } from "./base";

export class DataNormalizer {
  static normalize(property: ScrapedProperty): ScrapedProperty | null {
    try {
      // Validar campos obrigatórios
      if (
        !property.externalId ||
        !property.title ||
        !property.price ||
        !property.city
      ) {
        return null;
      }

      // Normalizar Preço
      // Remove decimais extras se necessário, garante number positivo
      const price = Math.max(0, Math.floor(property.price));

      // Normalizar Tipo de Imóvel
      const propertyType = this.normalizePropertyType(property.propertyType);

      // Normalizar Cidade
      const city = this.normalizeCity(property.city);

      // Limpar strings
      const title = property.title.trim().substring(0, 150); // Limite do DB pode variar
      const description = property.description?.trim();
      const neighborhood = property.neighborhood?.trim();

      return {
        ...property,
        price,
        propertyType,
        city,
        title,
        description,
        neighborhood,
      };
    } catch (error) {
      console.error("Erro ao normalizar propriedade:", error);
      return null;
    }
  }

  private static normalizePropertyType(type: string): string {
    const t = type.toLowerCase();
    if (t.includes("apt") || t.includes("apartamento")) return "apartamento";
    if (t.includes("casa")) return "casa";
    if (t.includes("terreno") || t.includes("lote")) return "terreno";
    if (t.includes("comercial") || t.includes("loja") || t.includes("sala"))
      return "comercial";
    if (t.includes("rural") || t.includes("chacara") || t.includes("sitio"))
      return "rural";
    return "outro";
  }

  private static normalizeCity(city: string): string {
    const c = city
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    if (c.includes("caragua")) return "Caraguatatuba";
    if (c.includes("ubatuba")) return "Ubatuba";
    if (c.includes("sebastiao")) return "Sao Sebastiao";
    if (c.includes("ilhabela")) return "Ilhabela";
    return city;
  }
}

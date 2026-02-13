/**
 * Limpa títulos de imóveis scraped, removendo informações redundantes
 * e formatando de maneira legível para o usuário.
 *
 * Exemplos:
 * "Apartamento 2 Quartos Lagoinha Ubatuba Com Garagem 57M2 Venda Rs410000 Id"
 * -> "Apartamento 2 Quartos em Lagoinha com Garagem"
 */

// Padrões a remover dos títulos
const PATTERNS_TO_REMOVE = [
  /\brs?\s*\d{3,}(?:[.,]\d+)?\b/gi, // Rs410000, R$500.000
  /\bvenda\b/gi, // "Venda"
  /\baluguel\b/gi, // "Aluguel"
  /\blocação\b/gi, // "Locação"
  /\b\d+\s*m2?\b/gi, // "57M2", "120 m2"
  /\b\d+\s*m²\b/gi, // "57m²"
  /\bid\b/gi, // trailing "Id"
  /\bcod\.?\s*\d+\b/gi, // "Cod. 123"
  /\bref\.?\s*\d+\b/gi, // "Ref 456"
  /\bcódigo\s*:?\s*\d+\b/gi, // "Código: 789"
  /\bà venda\b/gi, // "à venda"
  /\bpara comprar\b/gi, // "para comprar"
  /\bpara alugar\b/gi, // "para alugar"
  /\bpara locação\b/gi, // "para locação"
];

// Preposições para inserir caso estejam faltando
const LOCATIONS_NEED_EM =
  /^(apartamento|casa|terreno|sobrado|studio|flat|kitnet|cobertura|sala|loja|galpão|chácara|sítio)\s+(\d+\s+quartos?\s+)?([A-ZÀ-Ú])/i;

export function cleanPropertyTitle(
  title: string | null,
  propertyType?: string,
  city?: string,
): string {
  if (!title) {
    // Fallback: gera um título a partir do tipo e cidade
    const type = capitalizePropertyType(propertyType || "imóvel");
    return city ? `${type} em ${city}` : type;
  }

  let cleaned = title;

  // Remove padrões indesejados
  for (const pattern of PATTERNS_TO_REMOVE) {
    cleaned = cleaned.replace(pattern, "");
  }

  // Remove espaços, vírgulas e pontos múltiplos
  cleaned = cleaned
    .replace(/\s{2,}/g, " ")
    .replace(/,\s*,/g, ",")
    .replace(/\s*,\s*$/g, "")
    .replace(/^\s*,\s*/g, "")
    .trim();

  // Capitaliza primeira letra de cada palavra
  cleaned = cleaned
    .split(" ")
    .map((w) =>
      w.length > 2
        ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        : w.toLowerCase(),
    )
    .join(" ");

  // Capitaliza primeira letra do resultado
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  // Troca "Com" por "com" no meio da frase
  cleaned = cleaned.replace(/\sCom\s/g, " com ");

  // Se ficou muito curto, usa fallback
  if (cleaned.length < 5) {
    const type = capitalizePropertyType(propertyType || "imóvel");
    return city ? `${type} em ${city}` : type;
  }

  return cleaned;
}

function capitalizePropertyType(type: string): string {
  const map: Record<string, string> = {
    casa: "Casa",
    apartamento: "Apartamento",
    terreno: "Terreno",
    sobrado: "Sobrado",
    cobertura: "Cobertura",
    kitnet: "Kitnet",
    studio: "Studio",
    flat: "Flat",
    sala: "Sala Comercial",
    loja: "Loja",
    galpão: "Galpão",
    chácara: "Chácara",
    sítio: "Sítio",
    imóvel: "Imóvel",
  };
  return (
    map[type.toLowerCase()] || type.charAt(0).toUpperCase() + type.slice(1)
  );
}

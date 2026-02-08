import { z } from "zod";

/**
 * Sanitiza strings para prevenir XSS
 * Remove/escapa tags HTML perigosas
 */
function sanitizeString(str: string): string {
  return str
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Schema customizado que sanitiza strings automaticamente
 */
const sanitizedString = (schema: z.ZodString) =>
  schema.transform(sanitizeString);

/**
 * Validação de UUID v4
 */
export const uuidSchema = z.string().uuid("ID invalido");

export const createPropertySchema = z.object({
  type: z.enum(["venda", "aluguel"], { message: "Selecione venda ou aluguel" }),
  propertyType: z.enum(
    ["apartamento", "casa", "terreno", "comercial", "rural", "outro"],
    {
      message: "Selecione o tipo de imovel",
    },
  ),
  city: z.string().min(1, "Selecione a cidade"),
  neighborhood: z
    .string()
    .max(100)
    .optional()
    .transform((v) => (v ? sanitizeString(v) : v)),
  title: sanitizedString(
    z
      .string()
      .min(5, "Titulo deve ter no minimo 5 caracteres")
      .max(120, "Titulo muito longo"),
  ),
  description: z
    .string()
    .max(2000, "Descricao muito longa")
    .optional()
    .transform((v) => (v ? sanitizeString(v) : v)),
  price: z.number().positive("Preco deve ser positivo"),
  area: z.number().positive("Area deve ser positiva").optional(),
  bedrooms: z.number().int().min(0).max(20).optional(),
  bathrooms: z.number().int().min(0).max(20).optional(),
  parkingSpaces: z.number().int().min(0).max(20).optional(),
  address: z
    .string()
    .max(200)
    .optional()
    .transform((v) => (v ? sanitizeString(v) : v)),
  photoUrls: z
    .array(z.string().url())
    .min(1, "Adicione pelo menos 1 foto")
    .max(10, "Maximo 10 fotos"),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;

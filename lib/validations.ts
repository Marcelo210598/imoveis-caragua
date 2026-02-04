import { z } from 'zod';

export const createPropertySchema = z.object({
  type: z.enum(['venda', 'aluguel'], { message: 'Selecione venda ou aluguel' }),
  propertyType: z.enum(['apartamento', 'casa', 'terreno', 'comercial', 'rural', 'outro'], {
    message: 'Selecione o tipo de imovel',
  }),
  city: z.string().min(1, 'Selecione a cidade'),
  neighborhood: z.string().optional(),
  title: z.string().min(5, 'Titulo deve ter no minimo 5 caracteres').max(120, 'Titulo muito longo'),
  description: z.string().max(2000, 'Descricao muito longa').optional(),
  price: z.number().positive('Preco deve ser positivo'),
  area: z.number().positive('Area deve ser positiva').optional(),
  bedrooms: z.number().int().min(0).max(20).optional(),
  bathrooms: z.number().int().min(0).max(20).optional(),
  parkingSpaces: z.number().int().min(0).max(20).optional(),
  address: z.string().max(200).optional(),
  photoUrls: z.array(z.string().url()).min(1, 'Adicione pelo menos 1 foto').max(10, 'Maximo 10 fotos'),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;

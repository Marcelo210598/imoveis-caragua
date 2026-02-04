import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient, PropertySource } from '../lib/generated/prisma/client';
import fs from 'fs';
import path from 'path';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface RawProperty {
  external_id: string;
  source: string;
  type: string;
  property_type: string;
  title: string | null;
  price: number | null;
  area: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parking_spaces: number | null;
  city: string;
  city_slug?: string;
  neighborhood: string | null;
  address: string | null;
  url: string;
  photos: string[];
  scraped_at?: string;
  price_per_sqm: number | null;
  deal_score: number;
  avg_neighborhood_price_sqm?: number | null;
}

function mapSource(source: string): PropertySource {
  const map: Record<string, PropertySource> = {
    ZAP: 'ZAP',
    VIVAREAL: 'VIVAREAL',
    MULTIPLE: 'MULTIPLE',
  };
  return map[source] || 'VIVAREAL';
}

async function main() {
  console.log('Lendo properties.json...');
  const dataPath = path.join(__dirname, '..', 'data', 'properties.json');
  const raw: RawProperty[] = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log(`${raw.length} imoveis encontrados.`);

  // Limpar dados existentes
  console.log('Limpando tabelas...');
  await prisma.propertyPhoto.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.message.deleteMany();
  await prisma.property.deleteMany();

  console.log('Inserindo imoveis...');
  let count = 0;

  for (const p of raw) {
    await prisma.property.create({
      data: {
        externalId: p.external_id,
        source: mapSource(p.source),
        status: 'ACTIVE',
        type: p.type,
        propertyType: p.property_type,
        title: p.title,
        price: p.price,
        area: p.area,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        parkingSpaces: p.parking_spaces,
        city: p.city,
        citySlug: p.city_slug || null,
        neighborhood: p.neighborhood,
        address: p.address,
        url: p.url,
        pricePerSqm: p.price_per_sqm,
        dealScore: p.deal_score,
        avgNeighborhoodPriceSqm: p.avg_neighborhood_price_sqm || null,
        scrapedAt: p.scraped_at ? new Date(p.scraped_at) : null,
        photos: {
          create: (p.photos || []).map((url, index) => ({
            url,
            order: index,
          })),
        },
      },
    });

    count++;
    if (count % 20 === 0) {
      console.log(`  ${count}/${raw.length} inseridos...`);
    }
  }

  console.log(`Seed concluido! ${count} imoveis inseridos.`);
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

import { NextRequest, NextResponse } from "next/server";
import { ZapScraper } from "@/lib/scrapers/zap";
import { VivaRealScraper } from "@/lib/scrapers/vivareal";
import { OLXScraper } from "@/lib/scrapers/olx";
import { prisma } from "@/lib/prisma";
import { PropertySource } from "@/lib/generated/prisma/client";

// Impede que a rota seja cacheada (importante para scraping on-demand)
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sources, filters } = body;

    // Default sources
    const sourcesToRun = sources || ["ZAP", "VIVAREAL", "OLX"];

    let totalProcessed = 0;
    let totalSaved = 0;

    // Execução sequencial para não sobrecarregar
    if (sourcesToRun.includes("ZAP")) {
      const zap = new ZapScraper();
      const properties = await zap.scrape(filters);
      const saved = await saveProperties(properties);
      totalProcessed += properties.length;
      totalSaved += saved;
    }

    if (sourcesToRun.includes("VIVAREAL")) {
      const viva = new VivaRealScraper();
      const properties = await viva.scrape(filters);
      const saved = await saveProperties(properties);
      totalProcessed += properties.length;
      totalSaved += saved;
    }

    if (sourcesToRun.includes("OLX")) {
      const olx = new OLXScraper();
      const properties = await olx.scrape(filters);
      const saved = await saveProperties(properties);
      totalProcessed += properties.length;
      totalSaved += saved;
    }

    return NextResponse.json({
      success: true,
      message: `Scraping finalizado. Processados: ${totalProcessed}, Salvos/Atualizados: ${totalSaved}`,
    });
  } catch (error) {
    console.error("Scraping API Error:", error);
    return NextResponse.json(
      { error: "Erro interno no processo de scraping" },
      { status: 500 },
    );
  }
}

async function saveProperties(properties: any[]) {
  let count = 0;
  for (const p of properties) {
    try {
      const photoCreateInput =
        p.photoUrls?.map((url: string) => ({
          url,
        })) || [];

      // Upsert: Cria ou Atualiza
      await prisma.property.upsert({
        where: { externalId: p.externalId },
        update: {
          price: p.price,
          updatedAt: new Date(),
          scrapedAt: new Date(),
          photos: {
            deleteMany: {},
            create: photoCreateInput,
          },
        },
        create: {
          externalId: p.externalId,
          source: p.source,
          url: p.url || "",
          type: p.type || "venda",
          propertyType: p.propertyType || "imovel",
          title: p.title || "Imóvel sem título",
          description: p.description,
          price: p.price,
          city: p.city,
          neighborhood: p.neighborhood,
          address: p.address,
          area: p.area,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          parkingSpaces: p.parkingSpaces,
          scrapedAt: new Date(),
          photos: {
            create: photoCreateInput,
          },
        },
      });
      count++;
    } catch (e) {
      console.warn(`Erro ao salvar imóvel ${p.externalId}:`, e);
    }
  }
  return count;
}

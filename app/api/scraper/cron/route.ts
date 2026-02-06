import { NextResponse } from "next/server";
import { ZapScraper } from "@/lib/scrapers/zap";
import { VivaRealScraper } from "@/lib/scrapers/vivareal";
import { OLXScraper } from "@/lib/scrapers/olx";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  console.log("Cron job started: Scraping properties...");

  try {
    const filters = {
      cities: ["Caraguatatuba", "Ubatuba", "Sao Sebastiao", "Ilhabela"],
    };

    // Run sequentially to manage resources
    const zap = new ZapScraper();
    await saveProperties(await zap.scrape(filters));

    const viva = new VivaRealScraper();
    await saveProperties(await viva.scrape(filters));

    const olx = new OLXScraper();
    await saveProperties(await olx.scrape(filters));

    return NextResponse.json({
      success: true,
      message: "Cron job executed successfully",
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { success: false, error: "Cron job failed" },
      { status: 500 },
    );
  }
}

async function saveProperties(properties: any[]) {
  for (const p of properties) {
    try {
      await prisma.property.upsert({
        where: { externalId: p.externalId },
        update: {
          price: p.price,
          updatedAt: new Date(),
          scrapedAt: new Date(),
        },
        create: {
          externalId: p.externalId,
          source: p.source,
          url: p.url,
          type: p.type,
          propertyType: p.propertyType,
          title: p.title,
          description: p.description,
          price: p.price,
          area: p.area,
          city: p.city,
          neighborhood: p.neighborhood,
          address: p.address,
          scrapedAt: new Date(),
        },
      });
    } catch (e) {
      console.warn("UPSERT WARN", e);
    }
  }
}

import { ZapScraper } from "./lib/scrapers/zap";
import { prisma } from "./lib/prisma";

async function main() {
  console.log("Starting Scraper Debug (ZAP)...");
  const scraper = new ZapScraper();

  // Override logger to print to console
  (scraper as any).logger = {
    info: (msg: string) => console.log(`[INFO] ${msg}`),
    error: (msg: string, err?: any) => console.error(`[ERROR] ${msg}`, err),
    warn: (msg: string) => console.warn(`[WARN] ${msg}`),
  };

  try {
    const properties = await scraper.scrape({ cities: ["Caraguatatuba"] });
    console.log(`Found ${properties.length} properties for Caraguatatuba`);
    if (properties.length > 0) {
      console.log("Sample property:", properties[0]);
    }
  } catch (e) {
    console.error("Scraper failed:", e);
  } finally {
    // await prisma.$disconnect();
  }
}

main();

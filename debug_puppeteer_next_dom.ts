import puppeteer from "puppeteer-core";

async function main() {
  console.log("Starting Puppeteer NEXT_DATA (DOM) Extraction...");
  const browser = await puppeteer.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    );
    await page.setViewport({ width: 1366, height: 768 });

    console.log("Navigating to listings...");
    await page.goto("https://www.vivareal.com.br/venda/sp/caraguatatuba/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // Wait for selector
    try {
      await page.waitForSelector("#__NEXT_DATA__", { timeout: 10000 });
      console.log("Found #__NEXT_DATA__ selector!");

      const nextData = await page.$eval("#__NEXT_DATA__", (el) =>
        JSON.parse(el.textContent || "{}"),
      );

      const explore = (obj: any, path: string = ""): any => {
        if (!obj) return;
        if (
          obj.listings &&
          Array.isArray(obj.listings) &&
          obj.listings.length > 0
        ) {
          console.log(
            `Found listings at ${path}! Count: ${obj.listings.length}`,
          );
          return obj.listings;
        }
        if (typeof obj === "object") {
          for (const k in obj) {
            if (
              k === "search" ||
              k === "result" ||
              k === "initialProps" ||
              k === "pageProps" ||
              k === "props"
            ) {
              explore(obj[k], path + "." + k);
            }
          }
        }
      };

      explore(nextData);
    } catch (e) {
      console.error("Selector #__NEXT_DATA__ not found:", e.message);
      // fallback: try finding listings via class if DOM loaded
      const items = await page.$$(".property-card__container");
      console.log(`Fallback: Found ${items.length} card elements.`);
    }
  } catch (e) {
    console.error("Puppeteer failed:", e);
  } finally {
    // await browser.close();
  }
}

main();

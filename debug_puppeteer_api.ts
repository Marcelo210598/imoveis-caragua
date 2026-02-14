import puppeteer from "puppeteer-core";

async function main() {
  console.log("Starting Puppeteer API Fetch Debug (Minimal)...");
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

    console.log("Navigating to Home...");
    await page.goto("https://www.vivareal.com.br/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // Wait a bit
    await new Promise((r) => setTimeout(r, 5000));

    console.log("Executing fetch inside page...");
    const result = await page.evaluate(async () => {
      try {
        const url =
          "https://glue-api.vivareal.com/v2/listings?addressCity=Caraguatatuba&addressState=SP&business=SALE";
        const res = await fetch(url, {
          headers: {
            "x-domain": "www.vivareal.com.br",
            accept: "application/json",
          },
        });
        if (!res.ok) return { error: res.status, statusText: res.statusText };
        return await res.json();
      } catch (e: any) {
        return { error: e.message };
      }
    });

    console.log("Fetch Result keys:", Object.keys(result));
    if (
      result.search &&
      result.search.result &&
      result.search.result.listings
    ) {
      console.log(
        `Found ${result.search.result.listings.length} listings via API!`,
      );
      console.log(
        "Sample listing:",
        JSON.stringify(result.search.result.listings[0]).substring(0, 100),
      );
    } else {
      console.log("Full result:", JSON.stringify(result, null, 2));
    }
  } catch (e) {
    console.error("Puppeteer failed:", e);
  } finally {
    // await browser.close();
  }
}

main();

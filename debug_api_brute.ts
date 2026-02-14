import puppeteer from "puppeteer-core";

async function main() {
  console.log("Starting Puppeteer API Brute Force...");
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
    console.log("Navigating to Home...");
    await page.goto("https://www.vivareal.com.br/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    // Cookie consent might help, but let's ignore for now.

    console.log("Testing API variations...");

    const variations = [
      "https://glue-api.vivareal.com/v2/listings?addressCity=Caraguatatuba&addressState=SP&business=SALE&listingType=USED",
      "https://glue-api.vivareal.com/v2/listings?addressCity=Caraguatatuba&addressState=SP&business=SALE",
      "https://glue-api.vivareal.com/v2/listings?q=Caraguatatuba&business=SALE",
      "https://glue-api.vivareal.com/v2/listings?addressCity=Caraguatatuba&addressState=SP&business=SALE&unitTypes=APARTMENT",
      "https://glue-api.vivareal.com/v3/locations?q=Caraguatatuba", // Check location API working?
    ];

    await page.evaluate(async (urls) => {
      for (const url of urls) {
        try {
          console.log(`Fetching: ${url}`);
          const res = await fetch(url, {
            headers: {
              "x-domain": "www.vivareal.com.br",
              accept: "application/json",
            },
          });
          if (!res.ok) {
            console.log(`Failed ${url}: ${res.status}`);
            continue;
          }
          const json = await res.json();
          // Check for listings
          let count = 0;
          if (
            json.search &&
            json.search.result &&
            json.search.result.listings
          ) {
            count = json.search.result.listings.length;
          } else if (json.listings) {
            count = json.listings.length;
          } else if (json.locations) {
            console.log(`Locations found: ${json.locations.length}`);
          }

          if (count > 0) {
            console.log(`SUCCESS: ${url} returned ${count} items!`);
            // @ts-ignore
            window.SUCCESS_URL = url;
            // @ts-ignore
            window.SUCCESS_DATA = json;
          } else {
            console.log(`Empty result for ${url}`);
          }
        } catch (e) {
          console.log(`Error fetching ${url}: ${e}`);
        }
      }
    }, variations);
  } catch (e) {
    console.error("Puppeteer failed:", e);
  } finally {
    // await browser.close();
  }
}

main();

import puppeteer from "puppeteer-core";

async function main() {
  console.log("Starting Puppeteer NEXT_DATA Extraction...");
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

    console.log("Navigating to Listings Page...");
    await page.goto("https://www.vivareal.com.br/venda/sp/caraguatatuba/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // Wait a bit
    await new Promise((r) => setTimeout(r, 5000));

    console.log("Extracting __NEXT_DATA__...");
    const nextData = await page.evaluate(() => {
      // @ts-ignore
      return window.__NEXT_DATA__;
    });

    if (nextData) {
      console.log("Found __NEXT_DATA__!");
      // Navigate to find listings
      // Typically: props.pageProps.initialState.search.result.listings
      // Or: props.pageProps.initialProps...

      const explore = (obj: any, path: string = ""): any => {
        if (!obj) return;
        if (obj.listings && Array.isArray(obj.listings)) {
          console.log(
            `Found listings at ${path}! Count: ${obj.listings.length}`,
          );
          if (obj.listings.length > 0)
            console.log(
              "Sample:",
              JSON.stringify(obj.listings[0]).substring(0, 200),
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
    } else {
      console.log("__NEXT_DATA__ not found on window.");
    }
  } catch (e) {
    console.error("Puppeteer failed:", e);
  } finally {
    // await browser.close();
  }
}

main();

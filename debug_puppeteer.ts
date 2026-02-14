import puppeteer from "puppeteer-core";
const fs = require("fs");

async function main() {
  console.log("Starting Puppeteer Debug with Dump...");
  const browser = await puppeteer.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    );
    await page.setViewport({ width: 1366, height: 768 });

    console.log("Navigating to VivaReal...");
    await page.goto("https://www.vivareal.com.br/venda/sp/caraguatatuba/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // Wait for something to load or just wait a bit
    await new Promise((r) => setTimeout(r, 5000));

    const title = await page.title();
    console.log(`Page title: ${title}`);

    const html = await page.content();
    fs.writeFileSync("debug_page.html", html);
    console.log("Saved debug_page.html");

    // Quick check for container class
    const containerCount = (html.match(/property-card__container/g) || [])
      .length;
    console.log(`'property-card__container' count in HTML: ${containerCount}`);
  } catch (e) {
    console.error("Puppeteer failed:", e);
  } finally {
    await browser.close();
  }
}

main();

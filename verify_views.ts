import "dotenv/config";
import { prisma } from "./lib/prisma";

async function main() {
  const views = await prisma.propertyView.findMany({
    where: { source: "test_debug_curl" },
  });
  console.log("Views found:", views.length);
  console.log(views);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    // await prisma.$disconnect();
  });

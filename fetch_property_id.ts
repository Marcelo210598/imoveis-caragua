import "dotenv/config";
import { prisma } from "./lib/prisma";

async function main() {
  const property = await prisma.property.findFirst({
    where: { status: "ACTIVE" },
  });
  console.log(property?.id);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    // await prisma.$disconnect();
  });

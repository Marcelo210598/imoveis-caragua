import { PrismaClient } from "./lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.property.count();
  console.log(`Total properties: ${count}`);

  const bySource = await prisma.property.groupBy({
    by: ["source"],
    _count: {
      _all: true,
    },
  });
  console.log("By Source:", bySource);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

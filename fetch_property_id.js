const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const property = await prisma.property.findFirst();
  console.log(property?.id);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

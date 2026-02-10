// script to promote a user to ADMIN
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🔍 Procurando usuário para promover a ADMIN...");

  // Encontrar o último usuário criado
  const user = await prisma.user.findFirst({
    orderBy: { createdAt: "desc" },
  });

  if (!user) {
    console.log("❌ Nenhum usuário encontrado.");
    return;
  }

  console.log(
    `👤 Usuário encontrado: ${user.name || "Sem nome"} (${user.phone}) - ID: ${user.id}`,
  );
  console.log(`🎓 Role atual: ${user.role}`);

  if (user.role === "ADMIN") {
    console.log("✅ Este usuário já é ADMIN.");
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "ADMIN" },
    });
    console.log("🎉 Usuário promovido a ADMIN com sucesso!");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

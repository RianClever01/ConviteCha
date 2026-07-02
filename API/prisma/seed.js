import { PrismaClient } from "@prisma/client";
import { gifts } from "./giftData.js";

const prisma = new PrismaClient();

async function main() {

  await prisma.gift.deleteMany();

  await prisma.gift.createMany({
    data: gifts.map(gift => ({
      name: gift.name,
      available: true
    }))
  });

  console.log("Presentes importados!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {
      email: "admin@gmail.com",
      password: hashed,
      role: "ADMIN",
      isActive: true,
    },
    create: {
      username: "admin",
      email: "admin@gmail.com",
      password: hashed,
      role: "ADMIN",
    },
  });

  console.log("Seed selesai. Login: email=admin@gmail.com, password=admin123");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => prisma.$disconnect());
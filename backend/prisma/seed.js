const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const guruPassword = await bcrypt.hash("guru123", 10);
  const orangtuaPassword = await bcrypt.hash("ortu123", 10);

  // ================== ADMIN (dibiarkan seperti semula) ==================
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {
      email: "admin@gmail.com",
      password: adminPassword,
      role: "ADMIN",
      isActive: true,
    },
    create: {
      username: "admin",
      email: "admin@gmail.com",
      password: adminPassword,
      role: "ADMIN",
      isActive: true,
    },
  });

  // ================== GURU ==================
  const guruList = [
    {
      username: "siti.aminah",
      email: "siti.aminah@tunasceria.sch.id",
      nama: "Siti Aminah",
      nip: "199001012015012001",
      noTelepon: "081234567001",
      alamat: "Jl. Melati No. 1, Bekasi",
    },
    {
      username: "budi.santoso",
      email: "budi.santoso@tunasceria.sch.id",
      nama: "Budi Santoso",
      nip: "199002022016012002",
      noTelepon: "081234567002",
      alamat: "Jl. Mawar No. 2, Bekasi",
    },
    {
      username: "dewi.lestari",
      email: "dewi.lestari@tunasceria.sch.id",
      nama: "Dewi Lestari",
      nip: "199003032017012003",
      noTelepon: "081234567003",
      alamat: "Jl. Kenanga No. 3, Bekasi",
    },
    {
      username: "agus.setiawan",
      email: "agus.setiawan@tunasceria.sch.id",
      nama: "Agus Setiawan",
      nip: "199004042018012004",
      noTelepon: "081234567004",
      alamat: "Jl. Anggrek No. 4, Bekasi",
    },
    {
      username: "nur.hidayah",
      email: "nur.hidayah@tunasceria.sch.id",
      nama: "Nur Hidayah",
      nip: "199005052019012005",
      noTelepon: "081234567005",
      alamat: "Jl. Dahlia No. 5, Bekasi",
    },
  ];

  for (const guru of guruList) {
    await prisma.user.upsert({
      where: { username: guru.username },
      update: {
        email: guru.email,
        password: guruPassword,
        role: "GURU",
        isActive: true,
        guru: {
          upsert: {
            update: {
              nama: guru.nama,
              nip: guru.nip,
              noTelepon: guru.noTelepon,
              alamat: guru.alamat,
            },
            create: {
              nama: guru.nama,
              nip: guru.nip,
              noTelepon: guru.noTelepon,
              alamat: guru.alamat,
            },
          },
        },
      },
      create: {
        username: guru.username,
        email: guru.email,
        password: guruPassword,
        role: "GURU",
        isActive: true,
        guru: {
          create: {
            nama: guru.nama,
            nip: guru.nip,
            noTelepon: guru.noTelepon,
            alamat: guru.alamat,
          },
        },
      },
    });
  }

  // ================== ORANG TUA ==================
  const orangTuaList = [
    {
      username: "rina.wijaya",
      email: "rina.wijaya@gmail.com",
      nama: "Rina Wijaya",
      noTelepon: "081298765001",
      alamat: "Jl. Cempaka No. 1, Bekasi",
    },
    {
      username: "hendra.kusuma",
      email: "hendra.kusuma@gmail.com",
      nama: "Hendra Kusuma",
      noTelepon: "081298765002",
      alamat: "Jl. Flamboyan No. 2, Bekasi",
    },
    {
      username: "dewi.puspita",
      email: "dewi.puspita@gmail.com",
      nama: "Dewi Puspita",
      noTelepon: "081298765003",
      alamat: "Jl. Teratai No. 3, Bekasi",
    },
    {
      username: "andi.saputra",
      email: "andi.saputra@gmail.com",
      nama: "Andi Saputra",
      noTelepon: "081298765004",
      alamat: "Jl. Seroja No. 4, Bekasi",
    },
    {
      username: "lestari.wulandari",
      email: "lestari.wulandari@gmail.com",
      nama: "Lestari Wulandari",
      noTelepon: "081298765005",
      alamat: "Jl. Kamboja No. 5, Bekasi",
    },
  ];

  for (const ortu of orangTuaList) {
    await prisma.user.upsert({
      where: { username: ortu.username },
      update: {
        email: ortu.email,
        password: orangtuaPassword,
        role: "ORANGTUA",
        isActive: true,
        orangTua: {
          upsert: {
            update: {
              nama: ortu.nama,
              noTelepon: ortu.noTelepon,
              alamat: ortu.alamat,
            },
            create: {
              nama: ortu.nama,
              noTelepon: ortu.noTelepon,
              alamat: ortu.alamat,
            },
          },
        },
      },
      create: {
        username: ortu.username,
        email: ortu.email,
        password: orangtuaPassword,
        role: "ORANGTUA",
        isActive: true,
        orangTua: {
          create: {
            nama: ortu.nama,
            noTelepon: ortu.noTelepon,
            alamat: ortu.alamat,
          },
        },
      },
    });
  }

  console.log("Seed selesai.");
  console.log("Login Admin    : email=admin@gmail.com               password=admin123");
  console.log("Login Guru     : email=siti.aminah@tunasceria.sch.id  password=guru123");
  console.log("Login Orang Tua: email=rina.wijaya@gmail.com          password=ortu123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
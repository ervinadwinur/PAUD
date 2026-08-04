const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const guruList = [
  { username: "siti.aminah", email: "siti.aminah@tunasceria.sch.id", nama: "Siti Aminah", nip: "199001012015012001", noTelepon: "081234567001", alamat: "Jl. Melati No. 1, Bekasi" },
  { username: "budi.santoso", email: "budi.santoso@tunasceria.sch.id", nama: "Budi Santoso", nip: "199002022016012002", noTelepon: "081234567002", alamat: "Jl. Mawar No. 2, Bekasi" },
  { username: "dewi.lestari", email: "dewi.lestari@tunasceria.sch.id", nama: "Dewi Lestari", nip: "199003032017012003", noTelepon: "081234567003", alamat: "Jl. Kenanga No. 3, Bekasi" },
];

// 50 anak (harus tepat 50 baris, dicek otomatis di bawah)
const anakList = [
  ["Ahmad Fauzi", "LAKI_LAKI"], ["Aisyah Putri", "PEREMPUAN"], ["Bagas Pratama", "LAKI_LAKI"], ["Citra Lestari", "PEREMPUAN"], ["Dimas Saputra", "LAKI_LAKI"],
  ["Elisa Maharani", "PEREMPUAN"], ["Farhan Akbar", "LAKI_LAKI"], ["Gita Permata", "PEREMPUAN"], ["Hanif Ramadhan", "LAKI_LAKI"], ["Intan Sari", "PEREMPUAN"],
  ["Johan Kurniawan", "LAKI_LAKI"], ["Keyla Azzahra", "PEREMPUAN"], ["Lukman Hakim", "LAKI_LAKI"], ["Maya Safitri", "PEREMPUAN"], ["Naufal Rizky", "LAKI_LAKI"],
  ["Olivia Amanda", "PEREMPUAN"], ["Putra Wijaya", "LAKI_LAKI"], ["Qonita Zahra", "PEREMPUAN"], ["Rafi Maulana", "LAKI_LAKI"], ["Salsa Kirana", "PEREMPUAN"],
  ["Tegar Prakoso", "LAKI_LAKI"], ["Ulfa Nabila", "PEREMPUAN"], ["Vino Pratama", "LAKI_LAKI"], ["Winda Aprillia", "PEREMPUAN"], ["Xavier Aditya", "LAKI_LAKI"],
  ["Yasmin Aulia", "PEREMPUAN"], ["Zidan Fikri", "LAKI_LAKI"], ["Alya Ramadhani", "PEREMPUAN"], ["Bayu Setiawan", "LAKI_LAKI"], ["Caca Anggraini", "PEREMPUAN"],
  ["Daffa Alfarizi", "LAKI_LAKI"], ["Evelyn Putri", "PEREMPUAN"], ["Fauzan Ardiansyah", "LAKI_LAKI"], ["Ghina Azzahra", "PEREMPUAN"], ["Hilmi Akmal", "LAKI_LAKI"],
  ["Inara Khansa", "PEREMPUAN"], ["Jefri Kurnia", "LAKI_LAKI"], ["Kezia Natalia", "PEREMPUAN"], ["Luthfi Ramadhan", "LAKI_LAKI"], ["Mutiara Salsabila", "PEREMPUAN"],
  ["Nabil Fadillah", "LAKI_LAKI"], ["Ocha Maulida", "PEREMPUAN"], ["Pandu Nugroho", "LAKI_LAKI"], ["Qaisara Humaira", "PEREMPUAN"], ["Rangga Pradipta", "LAKI_LAKI"],
  ["Sinta Aulia", "PEREMPUAN"], ["Taufik Hidayat", "LAKI_LAKI"], ["Ulya Fitriani", "PEREMPUAN"], ["Varel Mahendra", "LAKI_LAKI"], ["Zahra Nurfadila", "PEREMPUAN"],
];

if (anakList.length !== 50) {
  throw new Error(`anakList harus berisi 50 data, saat ini ${anakList.length}`);
}

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const guruPassword = await bcrypt.hash("guru123", 10);
  const orangTuaPassword = await bcrypt.hash("ortu123", 10);

  // 1. Admin
  await prisma.user.upsert({
    where: { username: "admin" },
    update: { email: "admin@gmail.com", password: adminPassword, role: "ADMIN", isActive: true },
    create: { username: "admin", email: "admin@gmail.com", password: adminPassword, role: "ADMIN", isActive: true },
  });

  // 2. Guru
  const guruByUsername = {};
  for (const guru of guruList) {
    const user = await prisma.user.upsert({
      where: { username: guru.username },
      update: {
        email: guru.email,
        password: guruPassword,
        role: "GURU",
        isActive: true,
        guru: {
          upsert: {
            update: { nama: guru.nama, nip: guru.nip, noTelepon: guru.noTelepon, alamat: guru.alamat },
            create: { nama: guru.nama, nip: guru.nip, noTelepon: guru.noTelepon, alamat: guru.alamat },
          },
        },
      },
      create: {
        username: guru.username,
        email: guru.email,
        password: guruPassword,
        role: "GURU",
        isActive: true,
        guru: { create: { nama: guru.nama, nip: guru.nip, noTelepon: guru.noTelepon, alamat: guru.alamat } },
      },
      include: { guru: true },
    });
    guruByUsername[guru.username] = user.guru;
  }

  // 3. Kelas
  const kelasConfig = [
    { nama: "Kupu-kupu", guru: "siti.aminah" },
    { nama: "Lebah", guru: "budi.santoso" },
    { nama: "Gajah", guru: "dewi.lestari" },
  ];
  const kelasByName = {};
  for (const kelas of kelasConfig) {
    const existing = await prisma.kelas.findFirst({ where: { nama: kelas.nama, tahunAjaran: "2026/2027" } });
    const data = { nama: kelas.nama, tahunAjaran: "2026/2027", guruId: guruByUsername[kelas.guru].id };
    kelasByName[kelas.nama] = existing
      ? await prisma.kelas.update({ where: { id: existing.id }, data })
      : await prisma.kelas.create({ data });
  }

  // 4. 50 Orang Tua (masing-masing bisa login) + 50 Siswa
  const daftarLoginOrangTua = [];

  for (let index = 0; index < anakList.length; index += 1) {
    const nomor = String(index + 1).padStart(2, "0");
    const [namaAnak, jenisKelamin] = anakList[index];

    const username = `orangtua${nomor}`;
    const email = `${username}@paudcontoh.id`;
    const namaOrangTua = `Orang Tua ${namaAnak}`;
    const noTelepon = `08129876${String(index + 1).padStart(4, "0")}`;
    const alamat = `Jl. Keluarga Ceria No. ${index + 1}, Bekasi`;

    const user = await prisma.user.upsert({
      where: { username },
      update: {
        email,
        password: orangTuaPassword,
        role: "ORANGTUA",
        isActive: true,
        orangTua: {
          upsert: {
            update: { nama: namaOrangTua, noTelepon, alamat },
            create: { nama: namaOrangTua, noTelepon, alamat },
          },
        },
      },
      create: {
        username,
        email,
        password: orangTuaPassword,
        role: "ORANGTUA",
        isActive: true,
        orangTua: { create: { nama: namaOrangTua, noTelepon, alamat } },
      },
      include: { orangTua: true },
    });

    const kelas = kelasByName[kelasConfig[index % kelasConfig.length].nama];
    const nis = `2026${String(index + 1).padStart(4, "0")}`;
    const tanggalLahir = new Date(2021 + (index % 2), index % 12, (index % 27) + 1);

    await prisma.siswa.upsert({
      where: { nis },
      update: { nama: namaAnak, jenisKelamin, tanggalLahir, alamat, kelasId: kelas.id, orangTuaId: user.orangTua.id },
      create: { nis, nama: namaAnak, jenisKelamin, tanggalLahir, alamat, kelasId: kelas.id, orangTuaId: user.orangTua.id },
    });

    daftarLoginOrangTua.push({ username, email, password: "ortu123", anak: namaAnak });
  }

  console.log("Seed selesai: 1 admin, 3 guru, 3 kelas, 50 orang tua (semua bisa login), dan 50 siswa.\n");

  console.log("=== Login Admin ===");
  console.log("username: admin | email: admin@gmail.com | password: admin123\n");

  console.log("=== Login Guru ===");
  for (const guru of guruList) {
    console.log(`username: ${guru.username} | email: ${guru.email} | password: guru123`);
  }

  console.log("\n=== Login 50 Orang Tua (password sama untuk semua: ortu123) ===");
  for (const login of daftarLoginOrangTua) {
    console.log(`username: ${login.username} | email: ${login.email} | anak: ${login.anak}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
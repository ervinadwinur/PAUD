-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'GURU', 'ORANGTUA');

-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('LAKI_LAKI', 'PEREMPUAN');

-- CreateEnum
CREATE TYPE "StatusAbsensi" AS ENUM ('HADIR', 'IZIN', 'SAKIT', 'ALPA');

-- CreateEnum
CREATE TYPE "StatusPembayaran" AS ENUM ('BELUM_BAYAR', 'MENUNGGU_VERIFIKASI', 'LUNAS', 'DITOLAK');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guru" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "nip" TEXT,
    "noTelepon" TEXT,
    "alamat" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orang_tua" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "noTelepon" TEXT,
    "alamat" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orang_tua_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kelas" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "tahunAjaran" TEXT,
    "guruId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "siswa" (
    "id" SERIAL NOT NULL,
    "nis" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tanggalLahir" TIMESTAMP(3) NOT NULL,
    "jenisKelamin" "JenisKelamin" NOT NULL,
    "alamat" TEXT,
    "fotoUrl" TEXT,
    "kelasId" INTEGER,
    "orangTuaId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "absensi" (
    "id" SERIAL NOT NULL,
    "siswaId" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "status" "StatusAbsensi" NOT NULL,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "absensi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kegiatan_harian" (
    "id" SERIAL NOT NULL,
    "siswaId" INTEGER NOT NULL,
    "guruId" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kegiatan_harian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perkembangan_anak" (
    "id" SERIAL NOT NULL,
    "siswaId" INTEGER NOT NULL,
    "guruId" INTEGER NOT NULL,
    "aspek" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "perkembangan_anak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rapor" (
    "id" SERIAL NOT NULL,
    "siswaId" INTEGER NOT NULL,
    "guruId" INTEGER NOT NULL,
    "semester" TEXT NOT NULL,
    "tahunAjaran" TEXT NOT NULL,
    "fileUrl" TEXT,
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rapor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pembayaran_spp" (
    "id" SERIAL NOT NULL,
    "siswaId" INTEGER NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "status" "StatusPembayaran" NOT NULL DEFAULT 'BELUM_BAYAR',
    "buktiUrl" TEXT,
    "tanggalUpload" TIMESTAMP(3),
    "tanggalVerifikasi" TIMESTAMP(3),
    "diverifikasiOleh" INTEGER,
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pembayaran_spp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "guru_userId_key" ON "guru"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "guru_nip_key" ON "guru"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "orang_tua_userId_key" ON "orang_tua"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "siswa_nis_key" ON "siswa"("nis");

-- CreateIndex
CREATE UNIQUE INDEX "absensi_siswaId_tanggal_key" ON "absensi"("siswaId", "tanggal");

-- CreateIndex
CREATE UNIQUE INDEX "rapor_siswaId_semester_tahunAjaran_key" ON "rapor"("siswaId", "semester", "tahunAjaran");

-- CreateIndex
CREATE UNIQUE INDEX "pembayaran_spp_siswaId_bulan_tahun_key" ON "pembayaran_spp"("siswaId", "bulan", "tahun");

-- AddForeignKey
ALTER TABLE "guru" ADD CONSTRAINT "guru_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orang_tua" ADD CONSTRAINT "orang_tua_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelas" ADD CONSTRAINT "kelas_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "kelas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_orangTuaId_fkey" FOREIGN KEY ("orangTuaId") REFERENCES "orang_tua"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "absensi" ADD CONSTRAINT "absensi_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kegiatan_harian" ADD CONSTRAINT "kegiatan_harian_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kegiatan_harian" ADD CONSTRAINT "kegiatan_harian_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perkembangan_anak" ADD CONSTRAINT "perkembangan_anak_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perkembangan_anak" ADD CONSTRAINT "perkembangan_anak_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rapor" ADD CONSTRAINT "rapor_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rapor" ADD CONSTRAINT "rapor_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pembayaran_spp" ADD CONSTRAINT "pembayaran_spp_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

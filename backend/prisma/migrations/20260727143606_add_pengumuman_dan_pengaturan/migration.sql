-- CreateTable
CREATE TABLE "pengumuman" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "isi" TEXT NOT NULL,
    "lampiranUrl" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengumuman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengaturan_sekolah" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "nama" TEXT NOT NULL DEFAULT 'PAUD Kober Al-Musyawaroh',
    "alamat" TEXT,
    "noTelepon" TEXT,
    "email" TEXT,
    "namaKepala" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengaturan_sekolah_pkey" PRIMARY KEY ("id")
);

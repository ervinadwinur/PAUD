/*
  Warnings:

  - You are about to drop the column `judul` on the `kegiatan_harian` table. All the data in the column will be lost.
  - You are about to drop the column `siswaId` on the `kegiatan_harian` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[kelasId,tanggal]` on the table `kegiatan_harian` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `kelasId` to the `kegiatan_harian` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tema` to the `kegiatan_harian` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `kegiatan_harian` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "kegiatan_harian" DROP CONSTRAINT "kegiatan_harian_siswaId_fkey";

-- AlterTable
ALTER TABLE "kegiatan_harian" DROP COLUMN "judul",
DROP COLUMN "siswaId",
ADD COLUMN     "catatan" TEXT,
ADD COLUMN     "kelasId" INTEGER NOT NULL,
ADD COLUMN     "tema" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "kegiatan_harian_kelasId_tanggal_key" ON "kegiatan_harian"("kelasId", "tanggal");

-- AddForeignKey
ALTER TABLE "kegiatan_harian" ADD CONSTRAINT "kegiatan_harian_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "kelas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

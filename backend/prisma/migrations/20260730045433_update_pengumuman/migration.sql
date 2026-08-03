/*
  Warnings:

  - You are about to drop the `pengumuman` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "pengumuman";

-- CreateTable
CREATE TABLE "Pengumuman" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "fileName" TEXT,
    "filePath" TEXT,
    "fileSize" TEXT,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pengumuman_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pengumuman" ADD CONSTRAINT "Pengumuman_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

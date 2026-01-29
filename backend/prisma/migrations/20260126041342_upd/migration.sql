/*
  Warnings:

  - You are about to drop the column `thumbnail` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `Show` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "thumbnail",
ADD COLUMN     "thumbnailUrl" TEXT;

-- AlterTable
ALTER TABLE "Show" DROP COLUMN "thumbnail",
ADD COLUMN     "thumbnailUrl" TEXT;

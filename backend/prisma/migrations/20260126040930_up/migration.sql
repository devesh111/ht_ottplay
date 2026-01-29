/*
  Warnings:

  - You are about to drop the column `thumbnailUrl` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailUrl` on the `Show` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "thumbnailUrl",
ADD COLUMN     "thumbnail" TEXT;

-- AlterTable
ALTER TABLE "Show" DROP COLUMN "thumbnailUrl",
ADD COLUMN     "thumbnail" TEXT;

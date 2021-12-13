/*
  Warnings:

  - Made the column `regionShort` on table `Team` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_regionShort_fkey";

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "regionShort" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_regionShort_fkey" FOREIGN KEY ("regionShort") REFERENCES "Region"("short") ON DELETE RESTRICT ON UPDATE CASCADE;

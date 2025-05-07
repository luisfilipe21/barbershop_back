/*
  Warnings:

  - You are about to drop the column `barberId` on the `AvailableTime` table. All the data in the column will be lost.
  - You are about to drop the `Barber` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,date,startTime]` on the table `AvailableTime` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `AvailableTime` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('BARBER', 'CLIENT');

-- DropForeignKey
ALTER TABLE "AvailableTime" DROP CONSTRAINT "AvailableTime_barberId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_barberId_fkey";

-- DropIndex
DROP INDEX "AvailableTime_barberId_date_startTime_key";

-- AlterTable
ALTER TABLE "AvailableTime" DROP COLUMN "barberId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CLIENT';

-- DropTable
DROP TABLE "Barber";

-- CreateIndex
CREATE UNIQUE INDEX "AvailableTime_userId_date_startTime_key" ON "AvailableTime"("userId", "date", "startTime");

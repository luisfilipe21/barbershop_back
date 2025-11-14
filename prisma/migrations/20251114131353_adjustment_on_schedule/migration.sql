/*
  Warnings:

  - You are about to drop the `AvailableTime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ClientToSchedule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AvailableTime" DROP CONSTRAINT "AvailableTime_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "AvailableTime" DROP CONSTRAINT "AvailableTime_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ClientToSchedule" DROP CONSTRAINT "_ClientToSchedule_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClientToSchedule" DROP CONSTRAINT "_ClientToSchedule_B_fkey";

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "googleEventId" TEXT;

-- DropTable
DROP TABLE "AvailableTime";

-- DropTable
DROP TABLE "_ClientToSchedule";

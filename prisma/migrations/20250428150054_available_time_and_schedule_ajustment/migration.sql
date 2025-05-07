/*
  Warnings:

  - You are about to drop the column `createdAt` on the `AvailableTime` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `AvailableTime` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `AvailableTime` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `AvailableTime` table. All the data in the column will be lost.
  - You are about to drop the column `wordDayId` on the `AvailableTime` table. All the data in the column will be lost.
  - You are about to drop the `WordDay` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ScheduleToWordDay` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `scheduleId` to the `AvailableTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service` to the `AvailableTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AvailableTime" DROP CONSTRAINT "AvailableTime_wordDayId_fkey";

-- DropForeignKey
ALTER TABLE "_ScheduleToWordDay" DROP CONSTRAINT "_ScheduleToWordDay_A_fkey";

-- DropForeignKey
ALTER TABLE "_ScheduleToWordDay" DROP CONSTRAINT "_ScheduleToWordDay_B_fkey";

-- DropIndex
DROP INDEX "AvailableTime_userId_date_startTime_key";

-- AlterTable
ALTER TABLE "AvailableTime" DROP COLUMN "createdAt",
DROP COLUMN "date",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
DROP COLUMN "wordDayId",
ADD COLUMN     "scheduleId" INTEGER NOT NULL,
ADD COLUMN     "service" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "date" TIMESTAMP(3)[],
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL;

-- DropTable
DROP TABLE "WordDay";

-- DropTable
DROP TABLE "_ScheduleToWordDay";

-- AddForeignKey
ALTER TABLE "AvailableTime" ADD CONSTRAINT "AvailableTime_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailableTime" ADD CONSTRAINT "AvailableTime_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

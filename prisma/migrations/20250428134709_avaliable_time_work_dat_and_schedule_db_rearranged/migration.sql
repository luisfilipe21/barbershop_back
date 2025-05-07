/*
  Warnings:

  - The `date` column on the `AvailableTime` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `barberId` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Schedule` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "AvailableTime" ADD COLUMN     "wordDayId" INTEGER,
DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3)[];

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "barberId",
DROP COLUMN "date";

-- CreateTable
CREATE TABLE "WordDay" (
    "id" SERIAL NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "isWorkDay" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WordDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ScheduleToWordDay" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ScheduleToWordDay_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ScheduleToWordDay_B_index" ON "_ScheduleToWordDay"("B");

-- CreateIndex
CREATE UNIQUE INDEX "AvailableTime_userId_date_startTime_key" ON "AvailableTime"("userId", "date", "startTime");

-- AddForeignKey
ALTER TABLE "AvailableTime" ADD CONSTRAINT "AvailableTime_wordDayId_fkey" FOREIGN KEY ("wordDayId") REFERENCES "WordDay"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScheduleToWordDay" ADD CONSTRAINT "_ScheduleToWordDay_A_fkey" FOREIGN KEY ("A") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScheduleToWordDay" ADD CONSTRAINT "_ScheduleToWordDay_B_fkey" FOREIGN KEY ("B") REFERENCES "WordDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

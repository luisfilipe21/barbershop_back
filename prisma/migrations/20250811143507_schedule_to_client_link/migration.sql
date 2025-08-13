-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "barberId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClientToSchedule" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ClientToSchedule_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ClientToSchedule_B_index" ON "_ClientToSchedule"("B");

-- AddForeignKey
ALTER TABLE "_ClientToSchedule" ADD CONSTRAINT "_ClientToSchedule_A_fkey" FOREIGN KEY ("A") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientToSchedule" ADD CONSTRAINT "_ClientToSchedule_B_fkey" FOREIGN KEY ("B") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

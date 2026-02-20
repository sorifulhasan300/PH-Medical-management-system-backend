/*
  Warnings:

  - You are about to drop the column `specialityId` on the `DoctorSpecialty` table. All the data in the column will be lost.
  - Added the required column `specialtyId` to the `DoctorSpecialty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DoctorSpecialty" DROP COLUMN "specialityId",
ADD COLUMN     "specialtyId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "DoctorSpecialty" ADD CONSTRAINT "DoctorSpecialty_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSpecialty" ADD CONSTRAINT "DoctorSpecialty_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

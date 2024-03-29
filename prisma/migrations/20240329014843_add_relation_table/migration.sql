/*
  Warnings:

  - The primary key for the `user_classes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user_classes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_classes" DROP CONSTRAINT "user_classes_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "user_classes_pkey" PRIMARY KEY ("userId", "classId");

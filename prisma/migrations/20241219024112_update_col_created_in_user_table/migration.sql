/*
  Warnings:

  - You are about to drop the column `create_at` on the `user` table. All the data in the column will be lost.
  - Added the required column `created_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `create_at`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL;

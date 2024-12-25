/*
  Warnings:

  - You are about to drop the `blacklistedtoken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `blacklistedtoken` DROP FOREIGN KEY `BlacklistedToken_userId_fkey`;

-- DropTable
DROP TABLE `blacklistedtoken`;

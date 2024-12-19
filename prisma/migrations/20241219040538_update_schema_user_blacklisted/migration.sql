-- AlterTable
ALTER TABLE `blacklistedtoken` ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `BlacklistedToken` ADD CONSTRAINT `BlacklistedToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

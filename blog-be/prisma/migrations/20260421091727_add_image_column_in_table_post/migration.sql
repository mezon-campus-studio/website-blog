-- AlterTable
ALTER TABLE `post` ADD COLUMN `images` JSON NULL,
    MODIFY `thumbnail_url` VARCHAR(500) NULL;

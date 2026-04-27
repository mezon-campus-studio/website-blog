-- AlterTable
ALTER TABLE `post` ADD COLUMN `is_draft` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `thumbnail_public_id` VARCHAR(255) NULL;

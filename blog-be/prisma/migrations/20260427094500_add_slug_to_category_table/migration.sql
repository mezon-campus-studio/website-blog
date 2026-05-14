-- Add slug to category with backward-safe backfill for existing rows.
ALTER TABLE `category` ADD COLUMN `slug` VARCHAR(255) NULL;

UPDATE `category`
SET `slug` = CONCAT('category-', `id`)
WHERE `slug` IS NULL OR `slug` = '';

ALTER TABLE `category` MODIFY `slug` VARCHAR(255) NOT NULL;

CREATE UNIQUE INDEX `category_slug_key` ON `category`(`slug`);

/*
  Warnings:

  - A unique constraint covering the columns `[user_id,post_id,type]` on the table `user_interaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX `notifications_user_id_created_at_idx` ON `notifications`(`user_id`, `created_at`);

-- CreateIndex
CREATE INDEX `post_user_id_is_draft_created_at_idx` ON `post`(`user_id`, `is_draft`, `created_at`);

-- CreateIndex
CREATE INDEX `post_comment_post_id_created_at_idx` ON `post_comment`(`post_id`, `created_at`);

-- CreateIndex
CREATE INDEX `user_interaction_user_id_type_idx` ON `user_interaction`(`user_id`, `type`);

-- CreateIndex
CREATE UNIQUE INDEX `user_interaction_user_id_post_id_type_key` ON `user_interaction`(`user_id`, `post_id`, `type`);

-- RenameIndex
ALTER TABLE `post` RENAME INDEX `post_category_id_fkey` TO `post_category_id_idx`;

-- RenameIndex
ALTER TABLE `post_bookmark` RENAME INDEX `post_bookmark_user_id_fkey` TO `post_bookmark_user_id_idx`;

-- RenameIndex
ALTER TABLE `post_comment` RENAME INDEX `post_comment_parent_id_fkey` TO `post_comment_parent_id_idx`;

-- RenameIndex
ALTER TABLE `post_like` RENAME INDEX `post_like_user_id_fkey` TO `post_like_user_id_idx`;

-- RenameIndex
ALTER TABLE `report` RENAME INDEX `report_post_id_fkey` TO `report_post_id_idx`;

-- RenameIndex
ALTER TABLE `report` RENAME INDEX `report_user_id_fkey` TO `report_user_id_idx`;

-- RenameIndex
ALTER TABLE `user_interaction` RENAME INDEX `user_interaction_post_id_fkey` TO `user_interaction_post_id_idx`;

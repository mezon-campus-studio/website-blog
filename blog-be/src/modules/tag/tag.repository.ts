import { Tag } from '@prisma/client';
import { CreateTagDto, UpdateTagDto } from './tag.dto';

export interface ITagRepository {
  createTag(data: CreateTagDto, userId: string): Promise<Tag>;

  findById(tagId: string): Promise<Tag | null>;

  findByName(name: string): Promise<Tag | null>;

  findAllTags(): Promise<Tag[]>;

  restoreTag(tagId: string, userId: string): Promise<Tag>;

  updateTag(tagId: string, data: UpdateTagDto, userId: string): Promise<Tag>;

  softDeleteTag(tagId: string, userId: string): Promise<Tag>;
}

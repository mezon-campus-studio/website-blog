import { Tag } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@/common/utils/app-error';
import { ITagRepository } from './tag.repository';
import { CreateTagDto, UpdateTagDto } from './tag.dto';

export class TagService {
  constructor(private readonly tagRepository: ITagRepository) {}

  private normalizeName(name: string): string {
    return name.trim().replace(/\s+/g, ' ');
  }

  async createTag(data: CreateTagDto, userId: string): Promise<Tag> {
    try {
      const name = this.normalizeName(data.name);
      if (!name) {
        throw new BadRequestException('Tag name is required');
      }

      const existingTag = await this.tagRepository.findByName(name);
      if (existingTag && !existingTag.isDeleted) {
        throw new BadRequestException('Tag already exists');
      }

      if (existingTag && existingTag.isDeleted) {
        return await this.tagRepository.restoreTag(existingTag.id, userId);
      }

      return await this.tagRepository.createTag({ name }, userId);
    } catch (error) {
      throw error;
    }
  }

  async getAllTags(): Promise<Tag[]> {
    try {
      return await this.tagRepository.findAllTags();
    } catch (error) {
      throw error;
    }
  }

  async getTagById(tagId: string): Promise<Tag> {
    try {
      const tag = await this.tagRepository.findById(tagId);
      if (!tag) {
        throw new NotFoundException('Tag not found');
      }

      return tag;
    } catch (error) {
      throw error;
    }
  }

  async updateTag(tagId: string, data: UpdateTagDto, userId: string): Promise<Tag> {
    try {
      const tag = await this.tagRepository.findById(tagId);
      if (!tag) {
        throw new NotFoundException('Tag not found');
      }

      const updatePayload: UpdateTagDto = {
        ...data,
      };

      if (updatePayload.name !== undefined) {
        const name = this.normalizeName(updatePayload.name);
        if (!name) {
          throw new BadRequestException('Tag name is required');
        }

        const existingTag = await this.tagRepository.findByName(name);
        if (existingTag && existingTag.id !== tagId && !existingTag.isDeleted) {
          throw new BadRequestException('Tag already exists');
        }

        updatePayload.name = name;
      }

      return await this.tagRepository.updateTag(tagId, updatePayload, userId);
    } catch (error) {
      throw error;
    }
  }

  async softDeleteTag(tagId: string, userId: string): Promise<Tag> {
    try {
      const tag = await this.tagRepository.findById(tagId);
      if (!tag) {
        throw new NotFoundException('Tag not found');
      }

      return await this.tagRepository.softDeleteTag(tagId, userId);
    } catch (error) {
      throw error;
    }
  }
}

import { PrismaClient, Tag } from '@prisma/client';
import { ITagRepository } from './tag.repository';
import { CreateTagDto, UpdateTagDto } from './tag.dto';

export class PrismaTagRepository implements ITagRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createTag(data: CreateTagDto, userId: string): Promise<Tag> {
    return await this.prisma.tag.create({
      data: {
        name: data.name,
        createdBy: userId,
        updatedBy: userId,
      },
    });
  }

  async findById(tagId: string): Promise<Tag | null> {
    return await this.prisma.tag.findUnique({
      where: {
        id: tagId,
      },
    });
  }

  async findByName(name: string): Promise<Tag | null> {
    return await this.prisma.tag.findUnique({
      where: { name },
    });
  }

  async findAllTags(): Promise<Tag[]> {
    return await this.prisma.tag.findMany({
      orderBy: {
        name: 'desc',
      },
    });
  }

  async restoreTag(tagId: string, userId: string): Promise<Tag> {
    return await this.prisma.tag.update({
      where: { id: tagId },
      data: {
        isDeleted: false,
        isActive: true,
        updatedBy: userId,
      },
    });
  }

  async updateTag(tagId: string, data: UpdateTagDto, userId: string): Promise<Tag> {
    return await this.prisma.tag.update({
      where: { id: tagId },
      data: {
        name: data.name,
        updatedAt: new Date(),
        updatedBy: userId,
      },
    });
  }

  async softDeleteTag(tagId: string, userId: string): Promise<Tag> {
    return await this.prisma.tag.update({
      where: { id: tagId },
      data: {
        isDeleted: true,
        isActive: false,
        updatedBy: userId,
        updatedAt: new Date(),
      },
    });
  }
}

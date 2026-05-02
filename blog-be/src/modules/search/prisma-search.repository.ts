import { Post } from '@prisma/client';
import { ISearchRepository } from './search.repository';
import { PrismaClient } from '@prisma/client/extension';

export class PrismaSearchRepository implements ISearchRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async searchPostByKeyword(keyword: string, page: number, limit: number): Promise<Post[]> {
    const result = await this.prisma.post.findMany({
      where: {
        isDeleted: false,
        isActive: true,
        isDraft: false,
        OR: [
          {
            title: {
              contains: keyword,
            },
          },
          {
            content: {
              contains: keyword,
            },
          },
        ],
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return result;
  }
  async searchPostByTag(tagId: string, page: number, limit: number): Promise<Post[]> {
    const result = await this.prisma.post.findMany({
      where: {
        isDeleted: false,
        isActive: true,
        isDraft: false,
        tags: {
          some: {
            tagId: tagId,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      },
    });
    return result;
  }
  async searchPostByCategory(categoryId: string, page: number, limit: number): Promise<Post[]> {
    return await this.prisma.post.findMany({
      where: {
        categoryId: categoryId,
        isDeleted: false,
        isActive: true,
        isDraft: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}

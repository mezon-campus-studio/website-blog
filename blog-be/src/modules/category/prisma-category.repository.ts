import { PrismaClient, Category } from '@prisma/client';
import { ICategoryRepository } from './category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

export class PrismaCategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createCategory(
    data: CreateCategoryDto & { slug: string },
    userId: string,
  ): Promise<Category> {
    return await this.prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        slug: data.slug,
        createdBy: userId,
        updatedBy: userId,
      },
    });
  }

  async findById(categoryId: string): Promise<Category | null> {
    return await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        isDeleted: false,
        isActive: true,
      },
    });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return await this.prisma.category.findUnique({
      where: { slug },
    });
  }

  async updateCategory(
    categoryId: string,
    data: UpdateCategoryDto & { slug?: string },
    userId: string,
  ): Promise<Category> {
    return await this.prisma.category.update({
      where: { id: categoryId },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.slug !== undefined ? { slug: data.slug } : {}),
        updatedBy: userId,
      },
    });
  }

  async softDeleteCategory(categoryId: string, userId: string): Promise<Category> {
    return await this.prisma.category.update({
      where: { id: categoryId },
      data: {
        isDeleted: true,
        isActive: false,
        updatedBy: userId,
      },
    });
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.prisma.category.findMany();
  }
}

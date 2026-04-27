import { Category } from '@prisma/client';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

export interface ICategoryRepository {
  createCategory(data: CreateCategoryDto & { slug: string }, userId: string): Promise<Category>;

  findById(categoryId: string): Promise<Category | null>;

  findBySlug(slug: string): Promise<Category | null>;

  updateCategory(
    categoryId: string,
    data: UpdateCategoryDto & { slug?: string },
    userId: string,
  ): Promise<Category>;

  softDeleteCategory(categoryId: string, userId: string): Promise<Category>;
  getAllCategories(): Promise<Category[]>;
}

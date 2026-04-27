import { Category } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@/common/utils/app-error';
import { normalizeSlug } from '@/common/utils/slug';
import { ICategoryRepository } from './category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

export class CategoryService {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async createCategory(data: CreateCategoryDto, userId: string): Promise<Category> {
    try {
      const name = data.name.trim();

      const slug = normalizeSlug(name);

      if (!slug) {
        throw new BadRequestException('Category name is invalid to generate slug');
      }

      const existingCategory = await this.categoryRepository.findBySlug(slug);

      if (existingCategory) {
        throw new BadRequestException('Slug already exists');
      }

      return await this.categoryRepository.createCategory(
        {
          name,
          description: data.description?.trim(),
          slug,
        },
        userId,
      );
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(
    categoryId: string,
    data: UpdateCategoryDto,
    userId: string,
  ): Promise<Category> {
    try {
      const category = await this.categoryRepository.findById(categoryId);

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      const updatePayload: UpdateCategoryDto & { slug?: string } = {
        ...data,
      };

      if (updatePayload.name !== undefined) {
        const name = updatePayload.name.trim();

        if (!name) {
          throw new BadRequestException('Category name is required');
        }

        const normalizedSlug = normalizeSlug(name);

        if (!normalizedSlug) {
          throw new BadRequestException('Category name is invalid to generate slug');
        }

        const existingCategory = await this.categoryRepository.findBySlug(normalizedSlug);

        if (existingCategory && existingCategory.id !== categoryId) {
          throw new BadRequestException('Category slug already exists');
        }

        updatePayload.name = name;
        updatePayload.slug = normalizedSlug;
      }

      if (updatePayload.description !== undefined) {
        updatePayload.description = updatePayload.description.trim();
      }

      return await this.categoryRepository.updateCategory(categoryId, updatePayload, userId);
    } catch (error) {
      throw error;
    }
  }

  async softDeleteCategory(categoryId: string, userId: string): Promise<Category> {
    try {
      const category = await this.categoryRepository.findById(categoryId);

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      return await this.categoryRepository.softDeleteCategory(categoryId, userId);
    } catch (error) {
      throw error;
    }
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      return await this.categoryRepository.getAllCategories();
    } catch (error) {
      throw error;
    }
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    try {
      const category = await this.categoryRepository.findBySlug(slug);
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      return category;
    } catch (error) {
      throw error;
    }
  }
}

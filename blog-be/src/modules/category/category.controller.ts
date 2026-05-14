import { Request, Response } from 'express';
import { HTTPSTATUS } from '@/config/http.config';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  async createCategory(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: 'Missing authenticated user',
      });
    }

    const category = await this.categoryService.createCategory(
      req.body as CreateCategoryDto,
      userId,
    );

    return res.status(HTTPSTATUS.CREATED).json({
      message: 'Category created successfully',
      data: category,
    });
  }

  async updateCategory(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: 'Missing authenticated user',
      });
    }

    const categoryId = req.params.category_id as string;
    const category = await this.categoryService.updateCategory(
      categoryId,
      req.body as UpdateCategoryDto,
      userId,
    );

    return res.status(HTTPSTATUS.OK).json({
      message: 'Category updated successfully',
      data: category,
    });
  }

  async softDeleteCategory(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: 'Missing authenticated user',
      });
    }

    const categoryId = req.params.category_id as string;
    const category = await this.categoryService.softDeleteCategory(categoryId, userId);

    return res.status(HTTPSTATUS.OK).json({
      message: 'Category hidden successfully',
      data: category,
    });
  }

  async getAllCategories(req: Request, res: Response) {
    const categories = await this.categoryService.getAllCategories();
    return res.status(HTTPSTATUS.OK).json({
      message: 'Get all categories successfully',
      data: categories,
    });
  }

  async getCategoryBySlug(req: Request, res: Response) {
    const slug = req.params.slug as string;
    const category = await this.categoryService.getCategoryBySlug(slug);
    return res.status(HTTPSTATUS.OK).json({
      message: 'Get category by slug successfully',
      data: category,
    });
  }
}

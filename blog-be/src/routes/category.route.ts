import { Router } from 'express';
import { ROLE } from '@prisma/client';
import prisma from '@/lib/prisma';
import { passportAuthenticateJwt } from '@/config/passport.config';
import { authorize } from '@/common/middleware/authorize.middlerware';
import { validateDto } from '@/common/middleware/validate-dto.middleware';
import { asyncHandler } from '@/common/middleware/async-handler.middleware';
import { PrismaCategoryRepository } from '@/modules/category/prisma-category.repository';
import { CategoryService } from '@/modules/category/category.service';
import { CategoryController } from '@/modules/category/category.controller';
import { CreateCategoryDto, UpdateCategoryDto } from '@/modules/category/category.dto';

const categoryRouter = Router();
const categoryRepository = new PrismaCategoryRepository(prisma);
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

categoryRouter.use(passportAuthenticateJwt);

categoryRouter.post(
  '',
  authorize('ADMIN', 'USER'),
  validateDto(CreateCategoryDto),
  asyncHandler(categoryController.createCategory.bind(categoryController)),
);

categoryRouter.put(
  '/:category_id',
  authorize('ADMIN', 'USER'),
  validateDto(UpdateCategoryDto),
  asyncHandler(categoryController.updateCategory.bind(categoryController)),
);

categoryRouter.delete(
  '/:category_id',
  authorize('ADMIN', 'USER'),
  asyncHandler(categoryController.softDeleteCategory.bind(categoryController)),
);

categoryRouter.get(
  '/all',
  authorize('ADMIN'),
  asyncHandler(categoryController.getAllCategories.bind(categoryController)),
);

categoryRouter.get(
  '/:slug',
  authorize('ADMIN', 'USER'),
  asyncHandler(categoryController.getCategoryBySlug.bind(categoryController)),
);

export default categoryRouter;

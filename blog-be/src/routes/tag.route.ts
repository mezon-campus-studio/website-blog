import { Router } from 'express';
import { ROLE } from '@prisma/client';
import prisma from '@/lib/prisma';
import { passportAuthenticateJwt } from '@/config/passport.config';
import { authorize } from '@/common/middleware/authorize.middlerware';
import { asyncHandler } from '@/common/middleware/async-handler.middleware';
import { validateDto } from '@/common/middleware/validate-dto.middleware';
import { PrismaTagRepository } from '@/modules/tag/prisma-tag.repository';
import { TagService } from '@/modules/tag/tag.service';
import { TagController } from '@/modules/tag/tag.controller';
import { CreateTagDto, UpdateTagDto } from '@/modules/tag/tag.dto';

const tagRouter = Router();
const tagRepository = new PrismaTagRepository(prisma);
const tagService = new TagService(tagRepository);
const tagController = new TagController(tagService);

tagRouter.use(passportAuthenticateJwt);

tagRouter.post(
  '',
  authorize(ROLE.ADMIN, ROLE.USER),
  validateDto(CreateTagDto),
  asyncHandler(tagController.createTag.bind(tagController)),
);

tagRouter.get(
  '/all',
  authorize(ROLE.ADMIN, ROLE.USER),
  asyncHandler(tagController.getAllTags.bind(tagController)),
);

tagRouter.get(
  '/:tag_id',
  authorize(ROLE.ADMIN, ROLE.USER),
  asyncHandler(tagController.getTagById.bind(tagController)),
);

tagRouter.put(
  '/:tag_id',
  authorize(ROLE.ADMIN, ROLE.USER),
  validateDto(UpdateTagDto),
  asyncHandler(tagController.updateTag.bind(tagController)),
);

tagRouter.delete(
  '/:tag_id',
  authorize(ROLE.ADMIN, ROLE.USER),
  asyncHandler(tagController.softDeleteTag.bind(tagController)),
);

export default tagRouter;

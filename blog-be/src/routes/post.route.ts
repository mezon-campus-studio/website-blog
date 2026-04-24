import prisma from '@/lib/prisma';
import { PostController } from '@/modules/post/post.controller';
import { PostService } from '@/modules/post/post.service';
import { PrismaPostRepository } from '@/modules/post/prisma-post.repository';
import { NextFunction, Request, Response, Router } from 'express';
import { passportAuthenticateJwt } from '@/config/passport.config';
import { uploadImage } from '@/common/middleware/upload-image.middleware';
import { validateDto } from '@/common/middleware/validate-dto.middleware';
import { CreatePostDto } from '@/modules/post/dto/create-post.dto';
import { asyncHandler } from '@/common/middleware/async-handler.middleware';
import { UpdatePostDto } from '@/modules/post/dto/update-post.dto';

const postRouter = Router();
const postRepository = new PrismaPostRepository(prisma);
const postService = new PostService(postRepository);
const postController = new PostController(postService);
postRouter.post(
  '',
  passportAuthenticateJwt,
  uploadImage.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  validateDto(CreatePostDto),
  asyncHandler(postController.createPost.bind(postController)),
);

postRouter.get('/', asyncHandler(postController.getAllPostPublished.bind(postController)));

postRouter.get('/user/:user_id', asyncHandler(postController.getPostByUserId.bind(postController)));

postRouter.get(
  '/category/:category_id',
  asyncHandler(postController.getPostByCategoryId.bind(postController)),
);

postRouter.put(
  '/:post_id',
  passportAuthenticateJwt,
  uploadImage.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  validateDto(UpdatePostDto),
  asyncHandler(postController.updatePost.bind(postController)),
);

postRouter.delete(
  '/:post_id',
  passportAuthenticateJwt,
  asyncHandler(postController.deletePost.bind(postController)),
);

postRouter.patch(
  '/:post_id/draft',
  passportAuthenticateJwt,
  asyncHandler(postController.saveDraft.bind(postController)),
);

postRouter.patch(
  '/:post_id/publish',
  passportAuthenticateJwt,
  asyncHandler(postController.publishPost.bind(postController)),
);

postRouter.get(
  '/draft',
  passportAuthenticateJwt,
  asyncHandler(postController.getPostDraftByUserId.bind(postController)),
);

postRouter.get(
  '/published',
  passportAuthenticateJwt,
  asyncHandler(postController.getPostPublishedByUserId.bind(postController)),
);

postRouter.get('/:post_id', asyncHandler(postController.getPostById.bind(postController)));

export default postRouter;

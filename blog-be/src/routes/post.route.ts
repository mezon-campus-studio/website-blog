import prisma from '@/lib/prisma';
import { PostController } from '@/modules/post/post.controller';
import { PostService } from '@/modules/post/post.service';
import { PrismaPostRepository } from '@/modules/post/prisma-post.repository';
import { Router } from 'express';
import { passportAuthenticateJwt } from '@/config/passport.config';
import { uploadImage } from '@/common/middleware/upload-image.middleware';
import { validateDto } from '@/common/middleware/validate-dto.middleware';
import {
  AttachTagsDto,
  CreateCommentDto,
  CreatePostDto,
  SharePostDto,
} from '@/modules/post/post.dto';
import { asyncHandler } from '@/common/middleware/async-handler.middleware';
import { UpdatePostDto } from '@/modules/post/post.dto';
import { authorize } from '@/common/middleware/authorize.middlerware';
import { PrismaPostInteractionRepository } from '@/modules/post-interaction/post-interaction.repository';
import { PostInteractionService } from '@/modules/post-interaction/post-interaction.service';
import { PostInteractionController } from '@/modules/post-interaction/post-interaction.controller';

const postRouter = Router();
const postRepository = new PrismaPostRepository(prisma);
const postService = new PostService(postRepository);
const postController = new PostController(postService);
const postInteractionRepository = new PrismaPostInteractionRepository(prisma);
const postInteractionService = new PostInteractionService(postInteractionRepository);
const postInteractionController = new PostInteractionController(postInteractionService);


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

postRouter.get('/reader', asyncHandler(postController.getReaderPosts.bind(postController)));

postRouter.get(
  '/reader/tag/:tag_id',
  asyncHandler(postController.getReaderPostsByTagId.bind(postController)),
);

postRouter.get(
  '/reader/category/:slug',
  asyncHandler(postController.getReaderPostsByCategorySlug.bind(postController)),
);

postRouter.put(
  '/:postId',
  passportAuthenticateJwt,
  uploadImage.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  validateDto(UpdatePostDto),
  asyncHandler(postController.updatePost.bind(postController)),
);

postRouter.delete('/:postId', passportAuthenticateJwt, asyncHandler(postController.deletePost.bind(postController)));

postRouter.patch(
  '/:postId/draft',
  passportAuthenticateJwt,
  asyncHandler(postController.saveDraft.bind(postController)),
);

postRouter.patch('/:postId/publish', passportAuthenticateJwt, asyncHandler(postController.publishPost.bind(postController)));

postRouter.get(
  '/draft',
  passportAuthenticateJwt,
  asyncHandler(postController.getPostDraftByUserId.bind(postController)),
);

postRouter.get(
  '/published',
  asyncHandler(postController.getPostPublishedByUserId.bind(postController)),
);

postRouter.get('/hot', asyncHandler(postController.getHotsPost.bind(postController)));

postRouter.post(
  '/:postId/like',
  authorize('USER', 'ADMIN'),
  asyncHandler(postInteractionController.toggleLikePost.bind(postInteractionController)),
);

postRouter.post(
  '/:postId/bookmark',
  authorize('USER', 'ADMIN'),
  asyncHandler(postInteractionController.toggleBookmarkPost.bind(postInteractionController)),
);

postRouter.post(
  '/:postId/share',
  authorize('USER', 'ADMIN'),
  validateDto(SharePostDto),
  asyncHandler(postInteractionController.sharePost.bind(postInteractionController)),
);

postRouter.get(
  '/:postId/comments',
  asyncHandler(postInteractionController.getCommentsByPostId.bind(postInteractionController)),
);

postRouter.post(
  '/:postId/comments',
  validateDto(CreateCommentDto),
  asyncHandler(postInteractionController.createComment.bind(postInteractionController)),
);

postRouter.delete(
  '/:postId/comments/:commentId',
  authorize('USER', 'ADMIN'),
  asyncHandler(postInteractionController.deleteComment.bind(postInteractionController)),
);

postRouter.post(
  '/:postId/tags',
  passportAuthenticateJwt,
  validateDto(AttachTagsDto),
  asyncHandler(postController.attachTagsToPost.bind(postController)),
);

postRouter.delete(
  '/:postId/tags/:tagId',
  passportAuthenticateJwt,
  asyncHandler(postController.detachTagFromPost.bind(postController)),
);

postRouter.get(
  '/:postId/tags',
  asyncHandler(postController.getTagsByPostId.bind(postController)),
);

postRouter.get(
  '/:postId',
  asyncHandler(postInteractionController.getPostById.bind(postInteractionController)),
);

export default postRouter;

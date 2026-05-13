import prisma from '@/lib/prisma';
import { PostController } from '@/modules/post/post.controller';
import { PostService } from '@/modules/post/post.service';
import { PrismaPostRepository } from '@/modules/post/prisma-post.repository';
import { Router } from 'express';
import { passportAuthenticateJwt } from '@/config/passport.config';
import { uploadImage } from '@/common/middleware/upload-image.middleware';
import { validateDto } from '@/common/middleware/validate-dto.middleware';
import { AttachTagsDto, CreatePostDto } from '@/modules/post/post.dto';
import { asyncHandler } from '@/common/middleware/async-handler.middleware';
import { UpdatePostDto } from '@/modules/post/post.dto';
<<<<<<< HEAD:blog-be/src/routes/post.route.ts
=======
import { authorize } from '@/common/middleware/authorize.middlerware';
>>>>>>> d7dbd35d62c8cad1028ddc0dc74ec2049059ab0e:website-blog/blog-be/src/routes/post.route.ts

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

postRouter.get('/reader', asyncHandler(postController.getReaderPosts.bind(postController)));

postRouter.get(
  '/reader/tag/:tag_id',
  asyncHandler(postController.getReaderPostsByTagId.bind(postController)),
);

postRouter.get(
  '/reader/category/:slug',
  asyncHandler(postController.getReaderPostsByCategorySlug.bind(postController)),
);

<<<<<<< HEAD:blog-be/src/routes/post.route.ts
postRouter.put(
  '/:postId',
  passportAuthenticateJwt,
=======
postRouter.get('/:postId', asyncHandler(postController.getPostById.bind(postController)));

postRouter.use(passportAuthenticateJwt);

postRouter.put(
  '/:postId',
>>>>>>> d7dbd35d62c8cad1028ddc0dc74ec2049059ab0e:website-blog/blog-be/src/routes/post.route.ts
  uploadImage.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  validateDto(UpdatePostDto),
  asyncHandler(postController.updatePost.bind(postController)),
);

<<<<<<< HEAD:blog-be/src/routes/post.route.ts
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
=======
postRouter.delete('/:postId', asyncHandler(postController.deletePost.bind(postController)));

postRouter.patch(
  '/:postId/draft',

  asyncHandler(postController.saveDraft.bind(postController)),
);

postRouter.patch('/:postId/publish', asyncHandler(postController.publishPost.bind(postController)));

postRouter.get(
  '/draft',

>>>>>>> d7dbd35d62c8cad1028ddc0dc74ec2049059ab0e:website-blog/blog-be/src/routes/post.route.ts
  asyncHandler(postController.getPostDraftByUserId.bind(postController)),
);

postRouter.get(
  '/published',
<<<<<<< HEAD:blog-be/src/routes/post.route.ts
=======
  passportAuthenticateJwt,
>>>>>>> d7dbd35d62c8cad1028ddc0dc74ec2049059ab0e:website-blog/blog-be/src/routes/post.route.ts
  asyncHandler(postController.getPostPublishedByUserId.bind(postController)),
);

postRouter.get('/hot', asyncHandler(postController.getHotsPost.bind(postController)));

postRouter.post(
  '/:postId/tags',
<<<<<<< HEAD:blog-be/src/routes/post.route.ts
  passportAuthenticateJwt,
=======
  authorize('ADMIN', 'USER'),
>>>>>>> d7dbd35d62c8cad1028ddc0dc74ec2049059ab0e:website-blog/blog-be/src/routes/post.route.ts
  validateDto(AttachTagsDto),
  asyncHandler(postController.attachTagsToPost.bind(postController)),
);

postRouter.delete(
  '/:postId/tags/:tagId',
<<<<<<< HEAD:blog-be/src/routes/post.route.ts
  passportAuthenticateJwt,
=======
  authorize('ADMIN', 'USER'),
>>>>>>> d7dbd35d62c8cad1028ddc0dc74ec2049059ab0e:website-blog/blog-be/src/routes/post.route.ts
  asyncHandler(postController.detachTagFromPost.bind(postController)),
);

postRouter.get(
  '/:postId/tags',
<<<<<<< HEAD:blog-be/src/routes/post.route.ts
  asyncHandler(postController.getTagsByPostId.bind(postController)),
);

postRouter.get('/:postId', asyncHandler(postController.getPostById.bind(postController)));
=======
  authorize('ADMIN', 'USER'),
  asyncHandler(postController.getTagsByPostId.bind(postController)),
);

postRouter.post(
  '/upload',
  passportAuthenticateJwt,
  uploadImage.single('image'),
  asyncHandler(postController.uploadImage.bind(postController)),
);
>>>>>>> d7dbd35d62c8cad1028ddc0dc74ec2049059ab0e:website-blog/blog-be/src/routes/post.route.ts

export default postRouter;

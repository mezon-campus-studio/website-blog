import prisma from "@/lib/prisma";
import { PostController } from "@/modules/post/post.controller";
import { PostService } from "@/modules/post/post.service";
import { PrismaPostRepository } from "@/modules/post/prisma-post.repository";
import { NextFunction, Request, Response, Router } from "express";
import { passportAuthenticateJwt } from "@/config/passport.config";
import { uploadImage } from "@/common/middleware/upload-image.middleware";

const postRouter = Router();
const postRepository = new PrismaPostRepository(prisma);
const postService = new PostService(postRepository);
const postController = new PostController(postService);
postRouter.post(
    "",
    passportAuthenticateJwt,
    uploadImage.fields(
        [
            { name: "thumbnail", maxCount: 1 },
            { name: "images", maxCount: 10 }
        ]),
    postController.createPost.bind(postController));

postRouter.get("/", postController.getAllPost.bind(postController));

postRouter.get("/:post_id", postController.getPostById.bind(postController));

postRouter.get("/user/:user_id", postController.getPostByUserId.bind(postController));

postRouter.get("/category/:category_id", postController.getPostByCategoryId.bind(postController));

postRouter.put("/:post_id", passportAuthenticateJwt, uploadImage.fields(
    [
        { name: "thumbnail", maxCount: 1 },
        { name: "images", maxCount: 10 }
    ]
), postController.updatePost.bind(postController));

postRouter.delete("/:post_id", passportAuthenticateJwt, postController.deletePost.bind(postController));

postRouter.patch("/:post_id/draft", passportAuthenticateJwt, postController.saveDraft.bind(postController));

postRouter.patch("/:post_id/publish", passportAuthenticateJwt, postController.publishPost.bind(postController));

export default postRouter;
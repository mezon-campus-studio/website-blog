import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { NextFunction, Request, Response } from 'express';
import { UpdatePostDto } from './dto/update-post.dto';

export class PostController {
  constructor(private readonly postService: PostService) {}

  async createPost(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user.id;
    const files = req.files as {
      thumbnail?: Express.Multer.File[];
      images?: Express.Multer.File[];
    };
    const post = await this.postService.createPost(
      req.body as CreatePostDto,
      userId,
      files.thumbnail?.[0],
      files.images,
    );

    res.status(201).json({
      message: 'Post created successfully',
      data: post,
    });
  }

  async updatePost(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user.id;
    const files = req.files as {
      thumbnail?: Express.Multer.File[];
      images?: Express.Multer.File[];
    };
    const postid = req.params.post_id as string;
    const post = await this.postService.updatePost(
      req.body as UpdatePostDto,
      userId,
      postid,
      files.thumbnail?.[0],
      files.images,
    );

    res.status(200).json({
      message: 'Post updated successfully',
      data: post,
    });
  }

  async getPostById(req: Request, res: Response, next: NextFunction) {
    const post = await this.postService.getPostById(req.params.post_id as string);
    res.status(200).json({
      message: 'Post fetched successfully',
      data: post,
    });
  }

  async getAllPostPublished(req: Request, res: Response, next: NextFunction) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const posts = await this.postService.getAllPost(page, limit);
    res.status(200).json({
      message: 'Posts fetched successfully',
      data: posts,
    });
  }

  async getPostByUserId(req: Request, res: Response, next: NextFunction) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const userId = req.params.user_id as string;
    const posts = await this.postService.getPostByUserId(page, limit, userId);
    res.status(200).json({
      message: 'Posts fetched successfully',
      data: posts,
    });
  }

  async getPostByCategoryId(req: Request, res: Response, next: NextFunction) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const categoryId = req.params.category_id as string;
    const posts = await this.postService.getPostByCategoryId(page, limit, categoryId);
    res.status(200).json({
      message: 'Posts fetched successfully',
      data: posts,
    });
  }

  async deletePost(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user.id;
    const postId = req.params.post_id as string;
    await this.postService.deletePost(userId, postId);
    res.status(200).json({
      message: 'Post deleted successfully',
    });
  }

  async saveDraft(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user.id;
    const postId = req.params.post_id as string;
    await this.postService.updateDraftStatus(userId, postId, true);
    res.status(200).json({
      message: 'Post saved as draft successfully',
    });
  }

  async publishPost(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user.id;
    const postId = req.params.post_id as string;
    await this.postService.updateDraftStatus(userId, postId, false);
    res.status(200).json({
      message: 'Post published successfully',
    });
  }

  async getPostDraftByUserId(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const posts = await this.postService.getPostByUserIdAndDraftStatus(page, limit, userId, true);
    res.status(200).json({
      message: 'Post drafts fetched successfully',
      data: posts,
    });
  }

  async getPostPublishedByUserId(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const posts = await this.postService.getPostByUserIdAndDraftStatus(page, limit, userId, false);
    res.status(200).json({
      message: 'Post published fetched successfully',
      data: posts,
    });
  }
}

import { PostService } from './post.service';
import { AttachTagsDto, CreatePostDto } from './post.dto';
import { NextFunction, Request, Response } from 'express';
import { UpdatePostDto } from './post.dto';
import { HTTPSTATUS } from '@/config/http.config';

export class PostController {
  constructor(private readonly postService: PostService) {}

  async createPost(req: Request, res: Response, _next: NextFunction) {
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

  async updatePost(req: Request, res: Response, _next: NextFunction) {
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
    const post = await this.postService.getPostById(req.params.postId as string);
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

  async getHotsPost(req: Request, res: Response, _next: NextFunction){
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const posts = await this.postService.getHotsPost(page, limit);
    res.status(200).json({
      message: 'Posts fetch successfully',
      data: posts
    })
  }
  async getReaderPosts(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const categoryId = req.query.category_id as string | undefined;
    const tagId = req.query.tag_id as string | undefined;
    const posts = await this.postService.getReaderPosts(page, limit, categoryId, tagId);

    res.status(200).json({
      message: 'Reader posts fetched successfully',
      data: posts,
    });
  }

  async getReaderPostsByTagId(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const tagId = req.params.tag_id as string;
    const posts = await this.postService.getReaderPostsByTagId(page, limit, tagId);

    res.status(200).json({
      message: 'Reader posts by tag fetched successfully',
      data: posts,
    });
  }

  async getReaderPostsByCategorySlug(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const slug = req.params.slug as string;
    const posts = await this.postService.getReaderPostsByCategorySlug(page, limit, slug);

    res.status(200).json({
      message: 'Reader posts by category slug fetched successfully',
      data: posts,
    });
  }

  async attachTagsToPost(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: 'Missing authenticated user',
      });
    }
    const postId = req.params.postId as string;
    const { tagIds } = req.body as AttachTagsDto;
    await this.postService.attachTagsToPost(userId, postId, tagIds);
    res.status(200).json({
      message: 'Tags attached to post successfully',
    });
  }

  async detachTagFromPost(req: Request, res: Response) {
    const userId = req.user?.id;
    const postId = req.params.postId as string;

    const tagId = req.params.tagId as string;

    if (!userId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: 'Missing authenticated user',
      });
    }

    if (!tagId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: 'Missing tag id',
      });
    }

    await this.postService.detachTagFromPost(postId, tagId);
    res.status(200).json({
      message: 'Tag detached from post successfully',
    });
  }

  async getTagsByPostId(req: Request, res: Response) {
    const postId = req.params.postId as string;

    const tags = await this.postService.getTagsByPostId(postId);
    res.status(200).json({
      message: 'Tags fetched successfully',
      data: tags,
    });
  }
}

import { NextFunction, Request, Response } from 'express';
import { SharePostDto, CreateCommentDto } from '@/modules/post/post.dto';
import { PostInteractionService } from './post-interaction.service';

export class PostInteractionController {
  constructor(private readonly postInteractionService: PostInteractionService) {}

  async getPostById(req: Request, res: Response, _next: NextFunction) {
    const userId = (req as any).user.id;
    const post = await this.postInteractionService.getPostById(req.params.postId as string, userId);

    res.status(200).json({
      message: 'Post fetched successfully',
      data: post,
    });
  }

  async toggleLikePost(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const postId = req.params.postId as string;
    const result = await this.postInteractionService.toggleLikePost(userId, postId);

    res.status(200).json({
      message: result.liked ? 'Post liked successfully' : 'Post unliked successfully',
      data: result,
    });
  }

  async toggleBookmarkPost(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const postId = req.params.postId as string;
    const result = await this.postInteractionService.toggleBookmarkPost(userId, postId);

    res.status(200).json({
      message: result.bookmarked ? 'Post bookmarked successfully' : 'Post removed from bookmarks',
      data: result,
    });
  }

  async sharePost(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const postId = req.params.postId as string;
    const { platform } = req.body as SharePostDto;
    const result = await this.postInteractionService.sharePost(userId, postId, platform);

    res.status(201).json({
      message: 'Post shared successfully',
      data: result,
    });
  }

  async createComment(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const postId = req.params.postId as string;
    const { content, parentId } = req.body as CreateCommentDto;
    const comment = await this.postInteractionService.createComment(
      userId,
      postId,
      content,
      parentId,
    );

    res.status(201).json({
      message: 'Comment created successfully',
      data: comment,
    });
  }

  async getCommentsByPostId(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const postId = req.params.postId as string;
    const comments = await this.postInteractionService.getCommentsByPostId(page, limit, postId);

    res.status(200).json({
      message: 'Comments fetched successfully',
      data: comments,
    });
  }

  async deleteComment(req: Request, res: Response) {
    const user = req.user as { id: string; role: any };
    const commentId = req.params.commentId as string;

    await this.postInteractionService.deleteComment(user.id, user.role, commentId);

    res.status(200).json({
      message: 'Comment deleted successfully',
    });
  }
}

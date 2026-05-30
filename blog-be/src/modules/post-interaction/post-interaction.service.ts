import { NotificationType, ROLE, SharePlatform } from '@prisma/client';
import { notificationWorker } from '../notification/notification.worker';
import { BadRequestException, UnauthorizedException } from '@/common/utils/app-error';
import {
  BookmarkToggleResult,
  CommentListResponse,
  CommentNode,
  LikeToggleResult,
  PostDetailResponse,
  SharePostResult,
} from '@/modules/post/post-interaction.type';
import { PrismaPostInteractionRepository } from './post-interaction.repository';

export class PostInteractionService {
  constructor(private readonly postInteractionRepository: PrismaPostInteractionRepository) {}

  async getPostById(postId: string, userId: string): Promise<PostDetailResponse> {
    const post = await this.postInteractionRepository.findPostDetailById(postId, userId);

    return post;
  }

  async toggleLikePost(userId: string, postId: string): Promise<LikeToggleResult> {
    const result = await this.postInteractionRepository.toggleLikePost(userId, postId);

    if (result.liked && result.authorId !== userId) {
      await notificationWorker({
        userId: userId,
        targetId: result.authorId,
        postId: postId,
        type: NotificationType.LIKE,
        message: `vừa thích bài viết của bạn: ${result.postTitle}`,
      });
    }

    return result;
  }

  async toggleBookmarkPost(userId: string, postId: string): Promise<BookmarkToggleResult> {
    const result = await this.postInteractionRepository.toggleBookmarkPost(userId, postId);

    if (result.bookmarked && result.authorId !== userId) {
      await notificationWorker({
        userId: userId,
        targetId: result.authorId,
        postId: postId,
        type: NotificationType.BOOKMARK,
        message: `vừa lưu bài viết của bạn: ${result.postTitle}`,
      });
    }

    return result;
  }

  async sharePost(
    userId: string,
    postId: string,
    platform?: SharePlatform,
  ): Promise<SharePostResult> {
    const sharePlatform = platform ?? SharePlatform.COPY_LINK;
    const result = await this.postInteractionRepository.sharePost(userId, postId, sharePlatform);

    if (result.authorId !== userId) {
      await notificationWorker({
        userId: userId,
        targetId: result.authorId,
        postId: postId,
        type: NotificationType.SHARE,
        message: `vừa chia sẻ bài viết của bạn: ${result.postTitle}`,
      });
    }

    return {
      shared: true,
      platform: result.platform,
      shareCount: result.shareCount,
      authorId: result.authorId,
      postTitle: result.postTitle,
    };
  }

  async createComment(
    userId: string,
    postId: string,
    content: string,
    parentId?: string,
  ): Promise<CommentNode> {
    const normalizedContent = content.trim();

    if (!normalizedContent) {
      throw new BadRequestException('Comment content is required');
    }

    const result = await this.postInteractionRepository.createComment(
      userId,
      postId,
      normalizedContent,
      parentId,
    );

    if (result.authorId && result.authorId !== userId) {
      await notificationWorker({
        userId: userId,
        targetId: result.authorId,
        postId: postId,
        type: NotificationType.COMMENT,
        message: `vừa bình luận về bài viết của bạn: ${result.postTitle}`,
      });
    }

    return result;
  }

  async getCommentsByPostId(
    page: number,
    limit: number,
    postId: string,
  ): Promise<CommentListResponse> {
    return await this.postInteractionRepository.getCommentsByPostId(page, limit, postId);
  }

  async deleteComment(userId: string, role: ROLE, commentId: string): Promise<void> {
    const comment = await this.postInteractionRepository.findCommentById(commentId);

    await this.postInteractionRepository.deleteComment(userId, commentId);
    return;
  }
}

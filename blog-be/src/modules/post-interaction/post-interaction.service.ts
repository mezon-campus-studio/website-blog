import { ROLE, SharePlatform } from '@prisma/client';
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
    return await this.postInteractionRepository.toggleLikePost(userId, postId);
  }

  async toggleBookmarkPost(userId: string, postId: string): Promise<BookmarkToggleResult> {
    return await this.postInteractionRepository.toggleBookmarkPost(userId, postId);
  }

  async sharePost(
    userId: string,
    postId: string,
    platform?: SharePlatform,
  ): Promise<SharePostResult> {
    const sharePlatform = platform ?? SharePlatform.COPY_LINK;
    const share = await this.postInteractionRepository.sharePost(userId, postId, sharePlatform);

    return {
      shared: true,
      platform: share.platform,
      shareCount: share.shareCount,
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

    return await this.postInteractionRepository.createComment(
      userId,
      postId,
      normalizedContent,
      parentId,
    );
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
    return
  }
}

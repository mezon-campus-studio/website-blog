import { PrismaClient } from '@prisma/client/extension';
import { Category, InteractionType, Post, PostShare, SharePlatform } from '@prisma/client';
import { NotFoundException } from '@/common/utils/app-error';
import {
  BookmarkToggleResult,
  CommentListResponse,
  CommentNode,
  LikeToggleResult,
  PostDetailResponse,
} from '@/modules/post/post-interaction.type';

type CommentRecord = {
  id: string;
  postId: string;
  userId: string;
  parentId: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  user: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
};

export class PrismaPostInteractionRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async findPostDetailById(postId: string, userId: string): Promise<PostDetailResponse> {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
        isDeleted: false,
        isActive: true,
      },
      select: {
        id: true,
        userId: true,
        categoryId: true,
        title: true,
        slug: true,
        content: true,
        likeCount: true,
        thumbnailUrl: true,
        thumbnailPublicId: true,
        images: true,
        isDraft: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
        updatedBy: true,
        isActive: true,
        isDeleted: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar_url: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          where: {
            isDeleted: false,
            isActive: true,
            tag: {
              isDeleted: false,
              isActive: true,
            },
          },
          select: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
            shares: true,
          },
        },
        likes: {
          where: {
            userId,
            isDeleted: false,
            isActive: true,
          },
          select: {
            id: true,
          },
        },
        bookmarks: {
          where: {
            userId,
            isDeleted: false,
            isActive: true,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return {
      ...post,
      isLiked: post.likes.length > 0,
      isBookmarked: post.bookmarks.length > 0,
    };
  }

  async toggleLikePost(userId: string, postId: string): Promise<LikeToggleResult> {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
        isDeleted: false,
        isActive: true,
      },
      select: {
        id: true,
        likeCount: true,
        userId: true,
        title: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      await this.prisma.$transaction([
        this.prisma.postLike.delete({
          where: {
            postId_userId: {
              postId,
              userId,
            },
          },
        }),
        this.prisma.post.update({
          where: { id: postId },
          data: {
            likeCount: {
              decrement: 1,
            },
            updatedBy: userId,
          },
        }),
        this.prisma.userInteraction.delete({
          where: {
            userId_postId_type: {
              userId,
              postId,
              type: InteractionType.LIKE,
            },
          },
        }),
      ]);

      return {
        liked: false,
        likeCount: Math.max(post.likeCount - 1, 0),
        authorId: post.userId,
        postTitle: post.title,
      };
    }

    await this.prisma.$transaction([
      this.prisma.postLike.create({
        data: {
          postId,
          userId,
          createdBy: userId,
          updatedBy: userId,
        },
      }),
      this.prisma.post.update({
        where: { id: postId },
        data: {
          likeCount: {
            increment: 1,
          },
          updatedBy: userId,
        },
      }),
      this.prisma.userInteraction.upsert({
        where: {
          userId_postId_type: {
            userId,
            postId,
            type: InteractionType.LIKE,
          },
        },
        create: {
          userId,
          postId,
          type: InteractionType.LIKE,
          createdBy: userId,
          updatedBy: userId,
        },
        update: {
          isDeleted: false,
          isActive: true,
          updatedBy: userId,
        },
      }),
    ]);

    return {
      liked: true,
      likeCount: post.likeCount + 1,
      authorId: post.userId,
      postTitle: post.title,
    };
  }

  async toggleBookmarkPost(userId: string, postId: string): Promise<BookmarkToggleResult> {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
        isDeleted: false,
        isActive: true,
      },
      select: { id: true, userId: true, title: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingBookmark = await this.prisma.postBookmark.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingBookmark) {
      await this.prisma.$transaction([
        this.prisma.postBookmark.update({
          where: {
            postId_userId: {
              postId,
              userId,
            },
          },
          data: {
            isDeleted: true,
            isActive: false,
            updatedBy: userId,
          },
        }),
        this.prisma.userInteraction.delete({
          where: {
            userId_postId_type: {
              userId,
              postId,
              type: InteractionType.BOOKMARK,
            },
          },
        }),
      ]);

      return {
        bookmarked: false,
        authorId: post.userId,
        postTitle: post.title,
      };
    }

    await this.prisma.$transaction([
      this.prisma.postBookmark.create({
        data: {
          postId,
          userId,
          createdBy: userId,
          updatedBy: userId,
        },
      }),
      this.prisma.userInteraction.upsert({
        where: {
          userId_postId_type: {
            userId,
            postId,
            type: InteractionType.BOOKMARK,
          },
        },
        create: {
          userId,
          postId,
          type: InteractionType.BOOKMARK,
          createdBy: userId,
          updatedBy: userId,
        },
        update: {
          isDeleted: false,
          isActive: true,
          updatedBy: userId,
        },
      }),
    ]);

    return {
      bookmarked: true,
      authorId: post.userId,
      postTitle: post.title,
    };
  }

  async sharePost(
    userId: string,
    postId: string,
    platform: SharePlatform,
  ): Promise<PostShare & { shareCount: number; authorId: string; postTitle: string }> {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,

        isActive: true,
      },
      select: { id: true, userId: true, title: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const [share] = await this.prisma.$transaction([
      this.prisma.postShare.create({
        data: {
          postId,
          userId,
          platform,
          createdBy: userId,
          updatedBy: userId,
        },
      }),
      this.prisma.userInteraction.upsert({
        where: {
          userId_postId_type: {
            userId,
            postId,
            type: InteractionType.SHARE,
          },
        },
        create: {
          userId,
          postId,
          type: InteractionType.SHARE,
          createdBy: userId,
          updatedBy: userId,
        },
        update: {
          isDeleted: false,
          isActive: true,
          updatedBy: userId,
        },
      }),
    ]);

    const shareCount = await this.prisma.postShare.count({
      where: {
        postId,
        isDeleted: false,
        isActive: true,
      },
    });

    return {
      ...share,
      shareCount,
      authorId: post.userId,
      postTitle: post.title,
    };
  }

  async createComment(
    userId: string,
    postId: string,
    content: string,
    parentId?: string,
  ): Promise<CommentNode> {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
        isDeleted: false,
        isActive: true,
      },
      select: { id: true, userId: true, title: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (parentId) {
      const parentComment = await this.prisma.postComment.findFirst({
        where: {
          id: parentId,
          postId,
        },
        select: { id: true, postId: true },
      });

      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    const [comment] = await this.prisma.$transaction([
      this.prisma.postComment.create({
        data: {
          postId,
          userId,
          parentId: parentId ?? null,
          content,
          createdBy: userId,
          updatedBy: userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar_url: true,
            },
          },
        },
      }),
      this.prisma.userInteraction.upsert({
        where: {
          userId_postId_type: {
            userId,
            postId,
            type: InteractionType.COMMENT,
          },
        },
        create: {
          userId,
          postId,
          type: InteractionType.COMMENT,
          targetId: parentId,
          createdBy: userId,
          updatedBy: userId,
        },
        update: {
          targetId: parentId,
          isDeleted: false,
          isActive: true,
          updatedBy: userId,
        },
      }),
    ]);

    return {
      ...comment,
      replies: [],
      authorId: post.userId,
      postTitle: post.title,
    };
  }

  async getCommentsByPostId(
    page: number,
    limit: number,
    postId: string,
  ): Promise<CommentListResponse> {
    const post = await this.prisma.post.findFirst({
      where: {
        id: postId,
        isDeleted: false,
        isActive: true,
      },
      select: { id: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comments = (await this.prisma.postComment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar_url: true,
          },
        },
      },
    })) as CommentRecord[];

    const commentsByParent = new Map<string | null, CommentRecord[]>();
    for (const comment of comments) {
      const parentKey = comment.parentId ?? null;
      const bucket = commentsByParent.get(parentKey) ?? [];
      bucket.push(comment);
      commentsByParent.set(parentKey, bucket);
    }

    const buildNode = (comment: CommentRecord): CommentNode => ({
      id: comment.id,
      postId: comment.postId,
      userId: comment.userId,
      parentId: comment.parentId,
      content: comment.isDeleted ? '[deleted]' : comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      user: comment.user,
      replies: (commentsByParent.get(comment.id) ?? []).map(buildNode),
    });

    const topLevelComments = commentsByParent.get(null) ?? [];
    const total = topLevelComments.length;
    const items = [...topLevelComments]
      .reverse()
      .slice((page - 1) * limit, (page - 1) * limit + limit)
      .map(buildNode);

    return { items, total, page, limit };
  }

  async findCommentById(commentId: string): Promise<{ id: string; userId: string } | null> {
    return await this.prisma.postComment.findFirst({
      where: { id: commentId },
      select: { id: true, userId: true },
    });
  }

  async deleteComment(userId: string, commentId: string): Promise<void> {
    const comment = await this.prisma.postComment.findFirst({
      where: { id: commentId },
      select: { id: true, userId: true },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.prisma.postComment.update({
      where: { id: commentId },
      data: {
        isDeleted: true,
        isActive: false,
        updatedBy: userId,
      },
    });
  }
}

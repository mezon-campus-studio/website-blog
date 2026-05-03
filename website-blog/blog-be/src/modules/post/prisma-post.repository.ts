import { PrismaClient } from '@prisma/client/extension';
import { CreatePostDto } from './post.dto';
import { Category, Post } from '@prisma/client';
import { IPostRepository } from './post.repository';
import { UpdatePostDto } from './post.dto';
import { readerPostArgs, ReaderPostFilter, ReaderPostItem } from '@/types/post-reader.type';

export class PrismaPostRepository implements IPostRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findBySlug(slug: string): Promise<Post | null> {
    return await this.prisma.post.findUnique({
      where: { slug },
    });
  }

  async createPost(
    data: Omit<CreatePostDto, 'images'> & {
      slug: string;
      thumbnailUrl: string | null;
      thumbnailPublicId: string | null;
      images: { url: string; publicId: string }[];
    },
    userId: string,
  ): Promise<Post> {
    return await this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        thumbnailUrl: data.thumbnailUrl,
        thumbnailPublicId: data.thumbnailPublicId,
        images: data.images.length > 0 ? data.images : undefined,
        categoryId: data.categoryId,
        userId: userId,
        slug: data.slug,
        createdBy: userId,
        updatedBy: userId,
      },
    });
  }

  async updateImages(user_id: string, post_id: string, images: string[]): Promise<Post> {
    return await this.prisma.post.update({
      where: { id: post_id },
      data: {
        images: images,
        updatedAt: new Date(),
        updatedBy: user_id,
      },
    });
  }

  async updateThumbnail(user_id: string, post_id: string, thumbnailUrl: string): Promise<Post> {
    return await this.prisma.post.update({
      where: { id: post_id },
      data: {
        thumbnailUrl: thumbnailUrl,
        updatedAt: new Date(),
        updatedBy: user_id,
      },
    });
  }

  async findPostById(postId: string): Promise<Post | null> {
    return await this.prisma.post.findUnique({
      where: {
        id: postId,
        isDeleted: false,
        isActive: true,
      },
    });
  }
  async findAllPost(page: number, limit: number): Promise<Post[]> {
    return await this.prisma.post.findMany({
      where: {
        isDeleted: false,
        isActive: true,
        isDraft: false,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findPostByUserId(page: number, limit: number, userId: string): Promise<Post[]> {
    return await this.prisma.post.findMany({
      where: {
        userId: userId,
        isDeleted: false,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async updatePost(
    data: Omit<UpdatePostDto, 'images'> & {
      slug: string;
      thumbnailUrl: string | null;
      thumbnailPublicId: string | null;
      images: { url: string; publicId: string }[];
    },
    userId: string,
    postId: string,
  ): Promise<Post> {
    return await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title: data.title,
        content: data.content,
        thumbnailUrl: data.thumbnailUrl,
        thumbnailPublicId: data.thumbnailPublicId,
        images: data.images.length > 0 ? data.images : undefined,
        categoryId: data.categoryId,
        slug: data.slug,
        updatedBy: userId,
      },
    });
  }

  async deletePost(user_id: string, post_id: string): Promise<Post> {
    return await this.prisma.post.update({
      where: {
        id: post_id,
      },
      data: {
        isDeleted: true,
        isActive: false,
        updatedBy: user_id,
      },
    });
  }

  async updateDraftStatus(userId: string, postId: string, isDraft: boolean): Promise<Post> {
    const result = await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        isDraft,
        updatedBy: userId,
      },
    });

    return result;
  }

  async findPostByUserIdAndDraftStatus(
    page: number,
    limit: number,
    userId: string,
    isDraft: boolean,
  ): Promise<Post[]> {
    return await this.prisma.post.findMany({
      where: {
        userId,
        isDraft,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findReaderPosts(filter: ReaderPostFilter): Promise<ReaderPostItem[]> {
    const where: any = {};

    filter.categoryId && (where.categoryId = filter.categoryId);

    filter.categorySlug &&
      (where.category = {
        ...(where.category || {}),
        slug: filter.categorySlug,
      });

    filter.tagId &&
      (where.tags = {
        some: {
          tagId: filter.tagId,
          isDeleted: false,
          isActive: true,
          tag: {
            isDeleted: false,
            isActive: true,
          },
        },
      });

    const posts = await this.prisma.post.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip: (filter.page - 1) * filter.limit,
      take: filter.limit,
      ...readerPostArgs,
    });

    return posts;
  }

  async findCategoryById(categoryId: string): Promise<Category> {
    return await this.prisma.post.findMany({
      where: {
        categoryId,
      },
    });
  }

  async attachTagsToPost(userId: string, postId: string, tagIds: string[]): Promise<void> {
    tagIds = [...new Set(tagIds)];

    const existing = await this.prisma.postTag.findMany({
      where: { postId, isDeleted: false },
    });

    const existingIds = existing.map((t: { tagId: string }) => t.tagId);

    const toAdd = tagIds.filter((id) => !existingIds.includes(id));
    const toRemove = existingIds.filter((id: string) => !tagIds.includes(id));

    return await this.prisma.$transaction([
      // thêm
      this.prisma.post.update({
        where: { id: postId },
        data: {
          tags: {
            create: toAdd.map((tagId) => ({
              tag: { connect: { id: tagId } },
              createdBy: userId,
            })),
          },
        },
      }),

      // xóa
      this.prisma.postTag.deleteMany({
        where: {
          postId,
          tagId: { in: toRemove },
        },
      }),
    ]);
  }

  async detachTagFromPost(postId: string, tagId: string): Promise<void> {
    return await this.prisma.postTag.delete({
      where: {
        postId_tagId: {
          postId,
          tagId,
        },
      },
    });
  }

  async findTagsByPostId(postId: string): Promise<string[]> {
    return await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async findPostByLikeCount(page: number, limit: number): Promise<Post[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate()-30);
    return await this.prisma.post.findMany({
      where: {
        isDraft: false,
        isDeleted: false,
        isActive: true,
        createdAt:{
          gte: thirtyDaysAgo,
        }
      },
      orderBy: {
        likeCount: 'desc'
      },
      skip :(page-1) * limit,
      take: limit,
    });
  }
}

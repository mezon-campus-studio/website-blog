import { PrismaClient } from '@prisma/client/extension';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from '@prisma/client';
import { IPostRepository } from './post.repository';
import { UpdatePostDto } from './dto/update-post.dto';

export class PrismaPostRepository implements IPostRepository {
<<<<<<< HEAD:blog-be/src/modules/post/prisma-post.repository.ts
  constructor(private readonly prisma: PrismaClient) {}
=======
  constructor(private readonly prisma: PrismaClient) { }
>>>>>>> d7dbd35d62c8cad1028ddc0dc74ec2049059ab0e:website-blog/blog-be/src/modules/post/prisma-post.repository.ts

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

<<<<<<< HEAD:blog-be/src/modules/post/prisma-post.repository.ts
  async findPostById(postId: string): Promise<Post | null> {
    return await this.prisma.post.findFirst({
      where: {
        id: postId,
        isDeleted: false,
        isActive: true,
      },
    });
  }
  async findAllPost(page: number, limit: number): Promise<Post[]> {
=======
  async findPostById(postId: string): Promise<any | null> {
    return await this.prisma.post.findUnique({
      where: {
        id: postId,
        isDeleted: false,
        isActive: true,
      },
      ...readerPostArgs,
    });
  }
  async findAllPost(page: number, limit: number): Promise<any[]> {
>>>>>>> d7dbd35d62c8cad1028ddc0dc74ec2049059ab0e:website-blog/blog-be/src/modules/post/prisma-post.repository.ts
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
<<<<<<< HEAD:blog-be/src/modules/post/prisma-post.repository.ts
    });
  }

  async findPostByUserId(page: number, limit: number, userId: string): Promise<Post[]> {
=======
      ...readerPostArgs,
    });
  }

  async findPostByUserId(page: number, limit: number, userId: string): Promise<any[]> {
>>>>>>> d7dbd35d62c8cad1028ddc0dc74ec2049059ab0e:website-blog/blog-be/src/modules/post/prisma-post.repository.ts
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
<<<<<<< HEAD:blog-be/src/modules/post/prisma-post.repository.ts
=======
      ...readerPostArgs,
>>>>>>> d7dbd35d62c8cad1028ddc0dc74ec2049059ab0e:website-blog/blog-be/src/modules/post/prisma-post.repository.ts
    });
  }

  async findPostByCategoryId(page: number, limit: number, categoryId: string): Promise<Post[]> {
    return await this.prisma.post.findMany({
      where: {
        categoryId: categoryId,
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
        userId: userId,
        isDeleted: false,
        isActive: true,
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
        userId: user_id,
        isDeleted: false,
        isActive: true,
      },
      data: {
        isDeleted: true,
        isActive: false,
        updatedBy: user_id,
      },
    });
  }

  async updateDraftStatus(userId: string, postId: string, isDraft: boolean): Promise<Post> {
    const result = await this.prisma.post.updateMany({
      where: {
        id: postId,
        userId,
        isDraft: !isDraft,
      },
      data: {
        isDraft,
        updatedBy: userId,
      },
    });

    return await this.prisma.post.findUniqueOrThrow({
      where: { id: postId },
    });
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
        isDeleted: false,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
<<<<<<< HEAD

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

<<<<<<< HEAD:blog-be/src/modules/post/prisma-post.repository.ts
  async findCategoryById(categoryId: string): Promise<Category> {
    return await this.prisma.post.findMany({
      where: {
        categoryId,
=======
  async findCategoryById(categoryId: string): Promise<Category | null> {
    return await this.prisma.category.findUnique({
      where: {
        id: categoryId,
        isDeleted: false,
        isActive: true,
>>>>>>> d7dbd35d62c8cad1028ddc0dc74ec2049059ab0e:website-blog/blog-be/src/modules/post/prisma-post.repository.ts
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

<<<<<<< HEAD:blog-be/src/modules/post/prisma-post.repository.ts
  async findTagsByPostId(postId: string): Promise<string[]> {
    return await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        tags: {
          include: {
=======
  async findTagsByPostId(postId: string): Promise<Tag[]> {
    const postWithTags = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
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
>>>>>>> d7dbd35d62c8cad1028ddc0dc74ec2049059ab0e:website-blog/blog-be/src/modules/post/prisma-post.repository.ts
            tag: true,
          },
        },
      },
    });
<<<<<<< HEAD:blog-be/src/modules/post/prisma-post.repository.ts
=======

    return postWithTags?.tags.map((t) => t.tag) || [];
>>>>>>> d7dbd35d62c8cad1028ddc0dc74ec2049059ab0e:website-blog/blog-be/src/modules/post/prisma-post.repository.ts
  }

  async findPostByLikeCount(page: number, limit: number): Promise<Post[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return await this.prisma.post.findMany({
      where: {
        isDraft: false,
        isDeleted: false,
        isActive: true,
        createdAt: {
          gte: thirtyDaysAgo,
<<<<<<< HEAD:blog-be/src/modules/post/prisma-post.repository.ts
        },
      },
      orderBy: {
        likeCount: 'desc',
=======
        }
      },
      orderBy: {
        likeCount: 'desc'
>>>>>>> d7dbd35d62c8cad1028ddc0dc74ec2049059ab0e:website-blog/blog-be/src/modules/post/prisma-post.repository.ts
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
=======
>>>>>>> parent of 4c4042a (merge dev)
}

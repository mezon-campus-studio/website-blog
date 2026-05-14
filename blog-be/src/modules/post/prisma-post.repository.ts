import { PrismaClient } from '@prisma/client/extension';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from '@prisma/client';
import { IPostRepository } from './post.repository';
import { UpdatePostDto } from './dto/update-post.dto';

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
    return await this.prisma.post.findFirst({
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
}

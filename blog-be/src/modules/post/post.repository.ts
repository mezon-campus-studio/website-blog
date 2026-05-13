import { CreatePostDto } from './dto/create-post.dto';
import { Post } from '@prisma/client';
import { UpdatePostDto } from './dto/update-post.dto';

export interface IPostRepository {
  createPost(
    data: Omit<CreatePostDto, 'images'> & {
      slug: string;
      thumbnailUrl: string | null;
      thumbnailPublicId: string | null;
      images: { url: string; publicId: string }[];
    },
    userId: string,
  ): Promise<Post>;

  findBySlug(slug: string): Promise<Post | null>;

  updatePost(
    data: Omit<UpdatePostDto, 'images'> & {
      slug: string;
      thumbnailUrl: string | null;
      thumbnailPublicId: string | null;
      images: { url: string; publicId: string }[];
    },
    userId: string,
    postId: string,
  ): Promise<Post>;

  deletePost(user_id: string, post_id: string): Promise<Post>;

  updateDraftStatus(userId: string, postId: string, isDraft: boolean): Promise<Post>;

  updateThumbnail(user_id: string, post_id: string, thumbnailUrl: string): Promise<Post>;

  updateImages(user_id: string, post_id: string, images: string[]): Promise<Post>;

  findPostById(postId: string): Promise<Post | null>;

  findAllPost(page: number, limit: number): Promise<Post[]>;

  findPostByUserId(page: number, limit: number, userId: string): Promise<Post[]>;

  findPostByCategoryId(page: number, limit: number, categoryId: string): Promise<Post[]>;

  findPostByUserIdAndDraftStatus(
    pagr: number,
    limit: number,
    userId: string,
    isDraft: boolean,
  ): Promise<Post[]>;
}

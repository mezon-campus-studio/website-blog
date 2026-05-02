import { Post } from '@prisma/client';

export interface ISearchRepository {
  searchPostByKeyword(keyword: string, page: number, limit: number): Promise<Post[]>;

  searchPostByTag(tagId: string, page: number, limit: number): Promise<Post[]>;

  searchPostByCategory(categoryId: string, page: number, limit: number): Promise<Post[]>;
}
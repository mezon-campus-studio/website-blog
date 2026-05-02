import { BadRequestException } from '@/common/utils/app-error';
import { ISearchRepository } from './search.repository';
import { Post } from '@prisma/client';

export class SearchService {
  constructor(private readonly searchRepository: ISearchRepository) {}
  async searchPostByKeyword(keyword: string, page: number, limit: number): Promise<Post[]> {
    try {
      if (!keyword) {
        throw new BadRequestException('Keyword is required');
      }
      const result = await this.searchRepository.searchPostByKeyword(keyword, page, limit);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async searchPostByTag(tagId: string, page: number, limit: number): Promise<Post[]> {
    try {
      if (!tagId) {
        throw new BadRequestException('Tag ID is required');
      }
      const result = await this.searchRepository.searchPostByTag(tagId, page, limit);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async searchPostByCategory(categoryId: string, page: number, limit: number): Promise<Post[]> {
    return await this.searchRepository.searchPostByCategory(categoryId, page, limit);
  }
}

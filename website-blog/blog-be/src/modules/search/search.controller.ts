import { NextFunction, Request, Response } from 'express';
import { SearchService } from './search.service';

export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  async getPostByKeyWord(req: Request, res: Response, _next: NextFunction) {
    const keyword = req.query.keyword as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const posts = await this.searchService.searchPostByKeyword(keyword, page, limit);
    res.status(200).json({
      message: 'Search successfully',
      data: posts,
    });
  }

  async getPostByTag(req: Request, res: Response, _next: NextFunction) {
    const tagId = req.params.tagId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const posts = await this.searchService.searchPostByTag(tagId, page, limit);
    res.status(200).json({
      message: 'Search successfully',
      data: posts,
    });
  }

  async getPostByCategoryId(req: Request, res: Response, _next: NextFunction) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const categoryId = req.params.categoryId as string;
    const posts = await this.searchService.searchPostByCategory(categoryId, page, limit);
    res.status(200).json({
      message: 'Posts fetched successfully',
      data: posts,
    });
  }
}

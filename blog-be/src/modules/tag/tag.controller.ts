import { Request, Response } from 'express';
import { HTTPSTATUS } from '@/config/http.config';
import { TagService } from './tag.service';
import { CreateTagDto, UpdateTagDto } from './tag.dto';

export class TagController {
  constructor(private readonly tagService: TagService) {}

  async createTag(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: 'Missing authenticated user',
      });
    }

    const tag = await this.tagService.createTag(req.body as CreateTagDto, userId);

    return res.status(HTTPSTATUS.CREATED).json({
      message: 'Tag created successfully',
      data: tag,
    });
  }

  async getAllTags(req: Request, res: Response) {
    const tags = await this.tagService.getAllTags();

    return res.status(HTTPSTATUS.OK).json({
      message: 'Tags fetched successfully',
      data: tags,
    });
  }

  async getTagById(req: Request, res: Response) {
    const tagId = req.params.tag_id as string;
    const tag = await this.tagService.getTagById(tagId);

    return res.status(HTTPSTATUS.OK).json({
      message: 'Tag fetched successfully',
      data: tag,
    });
  }

  async updateTag(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: 'Missing authenticated user',
      });
    }

    const tagId = req.params.tag_id as string;
    const tag = await this.tagService.updateTag(tagId, req.body as UpdateTagDto, userId);

    return res.status(HTTPSTATUS.OK).json({
      message: 'Tag updated successfully',
      data: tag,
    });
  }

  async softDeleteTag(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: 'Missing authenticated user',
      });
    }

    const tagId = req.params.tag_id as string;
    const tag = await this.tagService.softDeleteTag(tagId, userId);

    return res.status(HTTPSTATUS.OK).json({
      message: 'Tag deleted successfully',
      data: tag,
    });
  }
}

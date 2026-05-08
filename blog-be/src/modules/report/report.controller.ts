import { NextFunction, Request, Response } from 'express';
import { ReportService } from './report.service';
import { ReportDto, UpdateReportStatusDto } from './report.dto';
import { ReportStatus } from '@prisma/client';

export class ReportController {
  constructor(private readonly reportService: ReportService) {}
  async createReport(req: Request, res: Response, _next: NextFunction) {
    const userId = (req as any).user.id;
    const result = await this.reportService.createReport(req.body as ReportDto, userId);

    return res.status(201).json({
      message: 'Create report successfully',
      data: result,
    });
  }

  async updateStatus(req: Request, res: Response, _next: NextFunction) {
    const userId = (req as any).user.id;
    const result = await this.reportService.updateStatus(req.body as UpdateReportStatusDto, userId);

    return res.status(200).json({
      message: 'Update status successfully',
      data: result,
    });
  }

  async softdelete(req: Request, res: Response, _next: NextFunction) {
    const user = (req as any).user;
    const reportId = req.params.reportId as string;

    const result = await this.reportService.softdeletReport(reportId, user);
    return res.status(200).json({
      message: 'Delete report successfully',
      data: result,
    });
  }

  async getReportById(req: Request, res: Response, _next: NextFunction) {
    const reportId = req.params.reportId as string;
    const result = await this.reportService.getReportById(reportId);

    return res.status(200).json({
      message: 'Fetch report successfully',
      data: result,
    });
  }
  async getReportByUserId(req: Request, res: Response, _next: NextFunction) {
    const userId = req.params.userId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await this.reportService.getReportByUserId(userId, page, limit);

    return res.status(200).json({
      message: 'Fetch report successfully',
      data: result,
    });
  }

  async getReportByStatus(req: Request, res: Response, _next: NextFunction) {
    const status = req.query.status as ReportStatus;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await this.reportService.getReportByStatus(status, page, limit);

    return res.status(200).json({
      message: 'Fetch report successfully',
      data: result,
    });
  }

  async getMyreport(req: Request, res: Response, _next: NextFunction) {
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await this.reportService.getReportByUserId(userId, page, limit);

    return res.status(200).json({
      message: 'Fetch report successfully',
      data: result,
    });
  }
}

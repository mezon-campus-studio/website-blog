import { Post, Report, ReportStatus } from '@prisma/client';
import { ReportDto, UpdateReportStatusDto } from './report.dto';

export interface IReportRepository {
  createReport(data: ReportDto, userId: string): Promise<Report>;

  findPostById(postId: string): Promise<Post | null>;

  findReportByPostAndUserId(postId: string, userId: string): Promise<Report | null>;

  updateReportStatus(data: UpdateReportStatusDto): Promise<Report>;

  findReportById(reportId: string): Promise<Report | null>;

  softdeleteReport(reportId: string, userId: string): Promise<Report>;

  findReportByUserId(userId: string, page: number, limit: number): Promise<Report[]>;

  findReportByStatus(status: ReportStatus, page: number, limit: number): Promise<Report[]>;
}

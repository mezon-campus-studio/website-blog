import { BadRequestException, NotFoundException } from '@/common/utils/app-error';
import { ReportDto, UpdateReportStatusDto } from './report.dto';
import { IReportRepository } from './report.repository';
import { Report, ReportStatus } from '@prisma/client';

export class ReportService {
  constructor(private readonly reportRepository: IReportRepository) {}

  async createReport(data: ReportDto, userId: string): Promise<Report> {
    try {
      const post = await this.reportRepository.findPostById(data.postId);
      if (!post) {
        throw new BadRequestException('Post not found');
      }
      const report = await this.reportRepository.findReportByPostAndUserId(data.postId, userId);
      if (data.postId === report?.postId && userId === report?.userId) {
        throw new BadRequestException('You have reported this post');
      }
      if (post?.isDeleted === true || post?.isActive === false || post?.isDraft === true) {
        throw new BadRequestException('You cannot report this post');
      }
      return await this.reportRepository.createReport(data, userId);
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(data: UpdateReportStatusDto, userId: string) {
    try {
      const report = await this.reportRepository.findReportById(data.reportId);
      if (!report) {
        throw new NotFoundException('Report not found');
      }
      return await this.reportRepository.updateReportStatus(data);
    } catch (error) {
      throw error;
    }
  }

  async softdeletReport(reportId: string, user: any) {
    try {
      const report = await this.reportRepository.findReportById(reportId);
      if (!report) {
        throw new NotFoundException('Report not found');
      }
      const isOwner = report.userId === user.id;

      if (!isOwner) {
        throw new BadRequestException('You do not have permission to delete this report');
      }
      if (report.status !== ReportStatus.PENDING) {
        throw new BadRequestException('Cannot delete this report');
      }
      return await this.reportRepository.softdeleteReport(reportId, user.id);
    } catch (error) {
      throw error;
    }
  }

  async getReportById(reportId: string): Promise<Report | null> {
    return await this.reportRepository.findReportById(reportId);
  }

  async getReportByUserId(userId: string, page: number, limit: number): Promise<Report[]> {
    return await this.reportRepository.findReportByUserId(userId, page, limit);
  }

  async getReportByStatus(status: ReportStatus, page: number, limit: number): Promise<Report[]> {
    if (!status) {
      throw new BadRequestException('Please choose status');
    }
    return await this.reportRepository.findReportByStatus(status, page, limit);
  }
}

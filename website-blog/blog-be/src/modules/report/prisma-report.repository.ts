import { Post, PrismaClient, Report, ReportStatus } from '@prisma/client';
import { IReportRepository } from './report.repository';
import { ReportDto, UpdateReportStatusDto } from './report.dto';

export class PrismaReportRepository implements IReportRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async createReport(data: ReportDto, userId: string): Promise<Report> {
    return await this.prisma.report.create({
      data: {
        postId: data.postId,
        userId: userId,
        reason: data.reason,
        status: ReportStatus.PENDING,
        createdBy: userId,
        updatedBy: userId,
      },
    });
  }

  async findPostById(postId: string): Promise<Post | null> {
    return await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
  }

  async findReportByPostAndUserId(postId: string, userId: string): Promise<Report | null> {
    return await this.prisma.report.findFirst({
      where: {
        postId: postId,
        userId: userId,
      },
    });
  }

  async updateReportStatus(data: UpdateReportStatusDto): Promise<Report> {
    return await this.prisma.report.update({
      where: {
        id: data.reportId,
      },
      data: {
        status: data.status,
      },
    });
  }

  async findReportById(reportId: string): Promise<Report | null> {
    return await this.prisma.report.findUnique({
      where: {
        id: reportId,
      },
    });
  }

  async softdeleteReport(reportId: string, userId: string): Promise<Report> {
    return await this.prisma.report.update({
      where: {
        id: reportId,
      },
      data: {
        isActive: false,
        isDeleted: true,
        updatedBy: userId,
      },
    });
  }

  async findReportByUserId(userId: string, page: number, limit: number): Promise<Report[]> {
    return await this.prisma.report.findMany({
      where: { userId: userId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findReportByStatus(status: ReportStatus, page: number, limit: number): Promise<Report[]> {
    return await this.prisma.report.findMany({
      where: { status: status },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

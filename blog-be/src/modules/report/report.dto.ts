import { IsEnum, IsIn, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class ReportDto {
  @IsString()
  postId!: string;

  @IsString()
  reason!: string;
}

enum ReportStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
  REVIEWED = 'REVIEWED',
}

export class UpdateReportStatusDto {
  @IsString()
  reportId!: string;

  @IsIn(Object.values(ReportStatus))
  status!: ReportStatus;
}

export class GetReportByStatusDto {
  @IsEnum(ReportStatus)
  status!: ReportStatus;

  @IsOptional()
  @IsInt()
  page?: number;

  @IsOptional()
  @IsInt()
  limit?: number;
}

export class GetReportByUserDto {
  @IsUUID()
  userId!: string;
}

export class GetReportByIdDto {
  @IsUUID()
  reportId!: string;
}

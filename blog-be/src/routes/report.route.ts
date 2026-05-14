import { asyncHandler } from '@/common/middleware/async-handler.middleware';
import { authorize } from '@/common/middleware/authorize.middlerware';
import { validateDto } from '@/common/middleware/validate-dto.middleware';
import { passportAuthenticateJwt } from '@/config/passport.config';
import prisma from '@/lib/prisma';
import { PrismaReportRepository } from '@/modules/report/prisma-report.repository';
import { ReportController } from '@/modules/report/report.controller';
import {
  GetReportByIdDto,
  GetReportByStatusDto,
  GetReportByUserDto,
  ReportDto,
  UpdateReportStatusDto,
} from '@/modules/report/report.dto';
import { ReportService } from '@/modules/report/report.service';
import { Router } from 'express';

const reportRouter = Router();
const reportRepository = new PrismaReportRepository(prisma);
const reportService = new ReportService(reportRepository);
const reportController = new ReportController(reportService);

reportRouter.use(passportAuthenticateJwt);

reportRouter.post(
  '/create',
  validateDto(ReportDto),
  asyncHandler(reportController.createReport.bind(reportController)),
);

reportRouter.patch(
  '/status',
  authorize('ADMIN'),
  validateDto(UpdateReportStatusDto),
  asyncHandler(reportController.updateStatus.bind(reportController)),
);

reportRouter.patch(
  '/:reportId',
  asyncHandler(reportController.softdelete.bind(reportController)),
);

reportRouter.get(
  '/status',
  authorize('ADMIN'),
  validateDto(GetReportByStatusDto, 'query'),
  asyncHandler(reportController.getReportByStatus.bind(reportController)),
);

reportRouter.get('/myreport', asyncHandler(reportController.getMyreport.bind(reportController)));

reportRouter.get(
  '/user/:userId',
  authorize('ADMIN'),
  validateDto(GetReportByUserDto, 'params'),
  asyncHandler(reportController.getReportByUserId.bind(reportController)),
);

reportRouter.get(
  '/:reportId',
  authorize('ADMIN'),
  validateDto(GetReportByIdDto, 'params'),
  asyncHandler(reportController.getReportById.bind(reportController)),
);
export default reportRouter;

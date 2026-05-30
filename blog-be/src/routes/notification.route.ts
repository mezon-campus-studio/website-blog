import { asyncHandler } from '@/common/middleware/async-handler.middleware';
import { passportAuthenticateJwt } from '@/config/passport.config';
import prisma from '@/lib/prisma';
import { PrismaNotificationRepository } from '@/modules/notification/notification-prisma.repository';
import { NotificationController } from '@/modules/notification/notification.controller';
import { NotificationService } from '@/modules/notification/notification.service';
import { Router } from 'express';

const notificationRouter = Router();
const notificationRepository = new PrismaNotificationRepository(prisma);
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

notificationRouter.use(passportAuthenticateJwt);
notificationRouter.get(
  '/user',
  asyncHandler(notificationController.getNotificationsByUserId.bind(notificationController)),
);
export default notificationRouter;

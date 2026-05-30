import { NextFunction } from 'express';
import { NotificationService } from './notification.service';
import { Request, Response } from 'express';

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  async getNotificationsByUserId(req: Request, res: Response, _next: NextFunction) {
    const userId = req.user?.id as string;
    const notifications = await this.notificationService.getNotificationsByUserId(userId);
    res.status(200).json({
      message: 'Get notifications successfully',
      data: notifications,
    });
  }
}

import { Notification } from '@prisma/client';
import { INotificationRepository } from './notification.repository';

export class NotificationService {
  constructor(private readonly notificationRepository: INotificationRepository) {}

  async getNotificationsByUserId(userId: string): Promise<any[]> {
    return await this.notificationRepository.findNotificationsByUserId(userId);
  }
}

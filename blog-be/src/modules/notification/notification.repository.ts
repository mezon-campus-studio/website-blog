import { Notification } from '@prisma/client';

export interface INotificationRepository {
  findNotificationsByUserId(userId: string): Promise<any[]>;
}

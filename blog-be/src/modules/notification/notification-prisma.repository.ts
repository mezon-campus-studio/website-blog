import { Notification, PrismaClient } from '@prisma/client';
import { INotificationRepository } from './notification.repository';

export class PrismaNotificationRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findNotificationsByUserId(userId: string): Promise<any[]> {
    const notifications = await this.prisma.notification.findMany({
      where: {
        userId,
        isDeleted: false,
        isActive: true,
      },
      include: {
        post: {
          select: { id: true, title: true }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const targetIds = Array.from(new Set(notifications.map(n => n.targetId).filter(Boolean))) as string[];
    const actors = await this.prisma.user.findMany({
      where: { id: { in: targetIds } },
      select: { id: true, name: true, avatar_url: true }
    });
    
    const actorMap = new Map();
    actors.forEach(a => actorMap.set(a.id, a));

    return notifications.map(n => {
      const actor = n.targetId ? actorMap.get(n.targetId) : null;
      return {
        id: n.id,
        type: n.type.toLowerCase(),
        message: n.message,
        isRead: false,
        createdAt: n.createdAt,
        actor: actor ? {
            id: actor.id,
            name: actor.name,
            avatar: actor.avatar_url,
        } : { id: 'unknown', name: 'System' },
        post: n.post ? {
            id: n.post.id,
            title: n.post.title,
        } : { id: 'unknown', title: 'Deleted Post' },
      };
    });
  }
}

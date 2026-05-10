export type NotificationType = 'like' | 'comment' | 'share' | 'report';

export interface Notification {
  id: string;
  type: NotificationType;
  actor: {
    id: string;
    name: string;
    avatar?: string;
  };
  post: {
    id: string;
    title: string;
  };
  isRead: boolean;
  createdAt: string;
  message?: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

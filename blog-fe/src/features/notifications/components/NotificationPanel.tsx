import React from 'react';
import { NotificationItem } from './NotificationItem';
import { useNotificationStore } from '../store/notificationStore';
import { useMarkAllAsRead, useMarkAsRead } from '../hooks/useNotifications';
import Link from 'next/link';
import { Check, BellOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';

interface NotificationPanelProps {
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const { notifications, unreadCount } = useNotificationStore();
  const { mutate: markAllRead } = useMarkAllAsRead();
  const { mutate: markRead } = useMarkAsRead();

  const handleMarkRead = (id: string) => {
    markRead(id);
  };

  return (
    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-card border rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <h3 className="font-bold text-lg">Notifications</h3>
        {unreadCount > 0 && (
          <button 
            onClick={() => markAllRead()}
            className="text-xs flex items-center gap-1 text-primary hover:underline font-medium"
          >
            <Check size={14} />
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem 
              key={notification.id} 
              notification={notification} 
              onClick={(id) => {
                handleMarkRead(id);
                // navigate logic could be here or inside NotificationItem
              }}
            />
          ))
        ) : (
          <div className="p-8 text-center flex flex-col items-center gap-2 text-muted-foreground">
            <BellOff size={32} strokeWidth={1.5} />
            <p>No notifications yet</p>
          </div>
        )}
      </div>

      <div className="p-2 border-t bg-muted/10">
        <Link href="/notifications" onClick={onClose}>
          <Button variant="outline" className="w-full text-xs h-9 gap-2">
            View all notifications
            <ArrowRight size={14} />
          </Button>
        </Link>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '@/features/notifications/hooks/useNotifications';
import { NotificationItem } from '@/features/notifications/components/NotificationItem';
import { Button } from '@/components/ui';
import { Bell, Check, Trash2, Filter } from 'lucide-react';

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const { mutate: markRead } = useMarkAsRead();
  const { mutate: markAllRead } = useMarkAllAsRead();

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-12 px-4 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded mb-8"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 w-full bg-muted rounded mb-4"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-12 px-4 min-h-[80vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bell className="text-primary" />
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with your activities and interactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => markAllRead()}
            disabled={!notifications?.some(n => !n.isRead)}
          >
            <Check size={16} />
            Mark all read
          </Button>
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        {notifications && notifications.length > 0 ? (
          <div className="divide-y">
            {notifications.map((notification) => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onClick={(id) => markRead(id)}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Bell size={32} className="text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-xl">All caught up!</h3>
              <p className="text-muted-foreground">You don't have any notifications at the moment.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

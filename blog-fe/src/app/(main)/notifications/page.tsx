'use client';

import React from 'react';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '@/features/notifications/hooks/useNotifications';
import { NotificationItem } from '@/features/notifications/components/NotificationItem';
import { Button } from '@/components/ui';
import { Bell, Check, Sparkles, Inbox } from 'lucide-react';
import { useNotificationStore } from '@/features/notifications/store/notificationStore';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const { isLoading } = useNotifications();
  const { notifications } = useNotificationStore();
  const { mutate: markRead } = useMarkAsRead();
  const { mutate: markAllRead } = useMarkAllAsRead();
  const router = useRouter();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="container max-w-3xl py-16 px-4">
        <div className="flex flex-col gap-6">
          <div className="h-10 w-48 bg-card-bg/50 border border-card-border animate-pulse rounded-full"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 w-full bg-card-bg/40 border border-card-border/50 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-16 px-4 min-h-[85vh] flex flex-col justify-start">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-card-border/60">
        <div className="space-y-1.5">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            <Bell className="text-primary animate-bounce" size={32} style={{ animationDuration: '3s' }} />
            Notifications
          </h1>
          <p className="text-sm text-muted-foreground/80 font-medium">
            {unreadCount > 0 ? (
              <span className="text-primary font-bold">You have {unreadCount} unread interactions</span>
            ) : (
              "Stay updated with your activities and social circle."
            )}
          </p>
        </div>

        {notifications.some(n => !n.isRead) && (
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 self-start md:self-auto border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 font-bold uppercase tracking-widest text-[10px] px-5 py-2.5 rounded-full transition-all shadow-sm"
            onClick={() => markAllRead()}
          >
            <Check size={14} />
            Mark all read
          </Button>
        )}
      </div>

      {/* Main Container */}
      <div className="backdrop-blur-xl bg-card-bg/20 border border-card-border/50 rounded-3xl overflow-hidden shadow-2xl transition-all">
        {notifications && notifications.length > 0 ? (
          <div className="divide-y divide-card-border/40">
            {notifications.map((notification) => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onClick={(id) => {
                  markRead(id);
                  if (notification.post?.id) {
                    const targetUrl = notification.type === 'comment'
                      ? `/posts/${notification.post.id}#comments`
                      : `/posts/${notification.post.id}`;
                    router.push(targetUrl);
                  }
                }}
              />
            ))}
          </div>
        ) : (
          /* Premium, Wow-worthy Empty State */
          <div className="py-24 px-6 text-center flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="relative">
              {/* Outer glowing rings */}
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl scale-125 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-pink-500 blur-md opacity-20 scale-110"></div>
              
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary/10 to-pink-500/10 border border-primary/30 flex items-center justify-center relative shadow-lg">
                <Inbox size={40} className="text-primary" />
                <Sparkles size={16} className="text-pink-500 absolute top-2 right-2 animate-bounce" />
              </div>
            </div>
            
            <div className="space-y-2 max-w-md">
              <h3 className="font-black text-2xl tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                All caught up!
              </h3>
              <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium">
                No new alerts. When users like, comment, or share your stories, they will arrive here in real-time.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

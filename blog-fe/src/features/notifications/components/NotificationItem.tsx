import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '../types';
import { Heart, MessageSquare, Share2, AlertTriangle, Circle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  onClick?: (id: string) => void;
}

const actionIcons = {
  like: <Heart className="text-red-500 fill-red-500" size={16} />,
  comment: <MessageSquare className="text-blue-500 fill-blue-500" size={16} />,
  share: <Share2 className="text-green-500" size={16} />,
  report: <AlertTriangle className="text-yellow-500" size={16} />,
};

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
  const { actor, type, post, createdAt, isRead, id } = notification;

  return (
    <div 
      className={cn(
        "flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer border-b last:border-0",
        !isRead && "bg-primary/5"
      )}
      onClick={() => onClick?.(id)}
    >
      <div className="relative">
        {actor.avatar ? (
          <img 
            src={actor.avatar} 
            alt={actor.name} 
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {actor.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 shadow-sm">
          {actionIcons[type]}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug">
          <span className="font-bold">{actor.name}</span>
          {' '}
          {type === 'like' && 'liked your post'}
          {type === 'comment' && 'commented on your post'}
          {type === 'share' && 'shared your post'}
          {type === 'report' && 'reported your post'}
          {': '}
          <span className="font-medium text-primary">"{post.title}"</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </div>

      {!isRead && (
        <div className="flex-shrink-0 self-center">
          <Circle size={8} className="fill-primary text-primary" />
        </div>
      )}
    </div>
  );
};

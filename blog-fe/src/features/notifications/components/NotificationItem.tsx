import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '../types';
import { Heart, MessageSquare, Share2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  onClick?: (id: string) => void;
}

const actionIcons = {
  like: <Heart className="text-pink-500 fill-pink-500" size={12} />,
  comment: <MessageSquare className="text-blue-500 fill-blue-500" size={12} />,
  share: <Share2 className="text-green-500" size={12} />,
  report: <AlertTriangle className="text-yellow-500" size={12} />,
};

const actionBgs = {
  like: 'bg-pink-500/10 border-pink-500/20',
  comment: 'bg-blue-500/10 border-blue-500/20',
  share: 'bg-green-500/10 border-green-500/20',
  report: 'bg-yellow-500/10 border-yellow-500/20',
};

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
  const { actor, type, post, createdAt, isRead, id } = notification;

  return (
    <div 
      className={cn(
        "flex items-start gap-4 p-5 hover:bg-card-bg/60 transition-all duration-300 cursor-pointer border-l-2 relative group",
        isRead ? "border-transparent" : "border-primary bg-primary/3"
      )}
      onClick={() => onClick?.(id)}
    >
      <div className="relative">
        {actor.avatar ? (
          <img 
            src={actor.avatar} 
            alt={actor.name} 
            className="w-11 h-11 rounded-full object-cover border border-card-border shadow-sm group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-primary/10 to-pink-500/10 flex items-center justify-center text-primary font-bold border border-primary/20 shadow-sm group-hover:scale-105 transition-transform text-sm">
            {actor.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className={cn(
          "absolute -bottom-1 -right-1 rounded-full p-1 border shadow-md",
          actionBgs[type] || 'bg-background border-card-border'
        )}>
          {actionIcons[type]}
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-sm leading-relaxed text-foreground/90">
          <span className="font-bold text-foreground hover:text-primary transition-colors">{actor.name}</span>
          {' '}
          <span className="text-muted-foreground">
            {type === 'like' && 'liked your story'}
            {type === 'comment' && 'commented on your story'}
            {type === 'share' && 'shared your story'}
            {type === 'report' && 'reported your story'}
          </span>
          {': '}
          <span className="font-bold text-primary hover:underline italic">"{post.title}"</span>
        </p>
        <p className="text-[11px] text-muted-foreground/75 font-medium flex items-center gap-1">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </div>

      {!isRead && (
        <div className="flex-shrink-0 self-center pl-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]" />
        </div>
      )}
    </div>
  );
};

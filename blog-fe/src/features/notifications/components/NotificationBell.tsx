import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore';
import { NotificationPanel } from './NotificationPanel';
import { cn } from '@/lib/utils';
import { useNotifications } from '../hooks/useNotifications';
import { useSocket } from '../hooks/useSocket';

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useNotificationStore();
  const bellRef = useRef<HTMLDivElement>(null);
  
  // Initialize notifications and socket
  useNotifications();
  useSocket();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-2 rounded-full hover:bg-muted transition-colors relative",
          isOpen && "bg-muted"
        )}
        aria-label="Notifications"
      >
        <Bell size={20} className={cn(unreadCount > 0 && "animate-pulse text-primary")} />
        
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && <NotificationPanel onClose={() => setIsOpen(false)} />}
    </div>
  );
};

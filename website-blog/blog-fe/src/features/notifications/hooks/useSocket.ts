import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { Notification } from '../types';
import { toast } from 'sonner';

const SOCKET_URL = 'https://memorizz-api.onrender.com';

export function useSocket() {
  const { token, user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // Initialize socket
    const socket = io(SOCKET_URL, {
      auth: {
        token: `Bearer ${token}`
      },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket');
      // Join a private room for the user
      socket.emit('join', user.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket');
    });

    // Handle notification events
    const handleNotification = (notification: Notification) => {
      addNotification(notification);
      
      // Show toast
      toast(notification.message || 'New notification', {
        description: `${notification.actor.name} ${notification.type}ed your post: ${notification.post.title}`,
        action: {
          label: 'View',
          onClick: () => {
            // Navigate to notification or post
            window.location.href = `/posts/${notification.post.id}`;
          },
        },
      });
    };

    socket.on('notification', handleNotification);
    socket.on('like', handleNotification);
    socket.on('comment', handleNotification);
    socket.on('share', handleNotification);
    socket.on('report', handleNotification);

    return () => {
      socket.off('notification');
      socket.off('like');
      socket.off('comment');
      socket.off('share');
      socket.off('report');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, user, addNotification]);

  return socketRef.current;
}

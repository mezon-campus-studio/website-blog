import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { Notification, NotificationType } from '../types';
import { toast } from 'sonner';

const getSocketUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://memorizz-api.onrender.com/api';
  return apiUrl.replace(/\/api\/?$/, '');
};

const SOCKET_URL = getSocketUrl();

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

    console.log('🔌 Connecting to WebSocket at:', SOCKET_URL);

    // Initialize socket with token and userId in auth handshake
    const socket = io(SOCKET_URL, {
      auth: {
        token: `Bearer ${token}`,
        userId: user.id,
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
    const handleNotification = (rawNotification: any) => {
      console.log('📩 Received socket notification:', rawNotification);

      // Check if notification is already in the FE format
      if (rawNotification.actor && rawNotification.post) {
        addNotification(rawNotification);
        return;
      }

      // Otherwise, parse and map raw database schema to FE format
      const rawMsg = rawNotification.message || '';
      let actorName = 'Someone';
      const typeLower = (rawNotification.type || 'like').toLowerCase();

      // Extract actor name from message: e.g. "Vu Duc Quy liked your post"
      const typeActions = ['liked', 'commented', 'shared', 'reported'];
      for (const action of typeActions) {
        if (rawMsg.includes(` ${action} `)) {
          actorName = rawMsg.split(` ${action} `)[0];
          break;
        }
      }
      if (actorName === 'Someone' && rawMsg) {
        const words = rawMsg.split(' ');
        if (words.length > 0) actorName = words[0];
      }

      // Extract post title from message quotes: e.g. "liked your post: \"My First Story\""
      let postTitle = 'your post';
      const quoteMatch = rawMsg.match(/"([^"]+)"/);
      if (quoteMatch && quoteMatch[1]) {
        postTitle = quoteMatch[1];
      }

      const feNotification: Notification = {
        id: rawNotification.id || Math.random().toString(),
        type: typeLower as NotificationType,
        actor: {
          id: rawNotification.userId || '',
          name: actorName,
        },
        post: {
          id: rawNotification.postId || '',
          title: postTitle,
        },
        isRead: !rawNotification.isActive, // Active = true means unread
        createdAt: rawNotification.createdAt || new Date().toISOString(),
        message: rawMsg,
      };

      addNotification(feNotification);
      
      // Show high-end modern rich toast
      let toastMsg = `${actorName} `;
      if (typeLower === 'like') toastMsg += 'liked your post';
      else if (typeLower === 'comment') toastMsg += 'commented on your post';
      else if (typeLower === 'share') toastMsg += 'shared your post';
      else if (typeLower === 'report') toastMsg += 'reported your post';
      else toastMsg += 'sent you a notification';

      toast(toastMsg, {
        description: `"${postTitle}"`,
        action: {
          label: 'View',
          onClick: () => {
            if (feNotification.post.id) {
              window.location.href = `/posts/${feNotification.post.id}`;
            }
          },
        },
      });
    };

    socket.on('notification:new', handleNotification);
    socket.on('notification', handleNotification);
    socket.on('like', handleNotification);
    socket.on('comment', handleNotification);
    socket.on('share', handleNotification);
    socket.on('report', handleNotification);

    return () => {
      socket.off('notification:new');
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

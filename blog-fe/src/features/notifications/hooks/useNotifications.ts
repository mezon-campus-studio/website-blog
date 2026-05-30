import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Notification } from '../types';
import { useNotificationStore } from '../store/notificationStore';
import { useEffect } from 'react';

export function useNotifications() {
  const { setNotifications } = useNotificationStore();

  const query = useQuery<Notification[], Error>({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<{ data: Notification[] }>('/notification/user');
        return data.data || [];
      } catch (err: any) {
        console.warn('⚠️ Backend notifications endpoint not available. Using local store notifications.', err.message);
        // Do not throw; return whatever is currently in our in-memory Zustand store
        return useNotificationStore.getState().notifications;
      }
    },
  });

  // Sync with store when data changes
  useEffect(() => {
    if (query.data && query.data.length > 0) {
      setNotifications(query.data);
    }
  }, [query.data, setNotifications]);

  return query;
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  const { markAsRead } = useNotificationStore();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      try {
        await apiClient.patch(`/notification/${id}/read`);
      } catch (err: any) {
        console.warn(`⚠️ Backend markAsRead endpoint not available. Updating local state only.`, err.message);
      }
    },
    onSuccess: (_, id) => {
      markAsRead(id);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  const { markAllAsRead } = useNotificationStore();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      try {
        await apiClient.patch('/notification/read-all');
      } catch (err: any) {
        console.warn('⚠️ Backend markAllAsRead endpoint not available. Updating local state only.', err.message);
      }
    },
    onSuccess: () => {
      markAllAsRead();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

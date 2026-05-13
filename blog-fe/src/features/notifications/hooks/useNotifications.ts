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
      // Temporarily disabled as the backend lacks this endpoint
      // const { data } = await apiClient.get<{ data: Notification[] }>('/notifications');
      // return data.data || [];
      return [];
    },
  });

  // Sync with store when data changes
  useEffect(() => {
    if (query.data) {
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
      await apiClient.patch(`/notifications/${id}/read`);
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
      await apiClient.patch('/notifications/read-all');
    },
    onSuccess: () => {
      markAllAsRead();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { User } from '@/features/auth/types';

export function useAllUsers() {
  return useQuery<User[], Error>({
    queryKey: ['users', 'all'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ users: User[] }>('/users/all');
      return data.users || [];
    },

  });
}

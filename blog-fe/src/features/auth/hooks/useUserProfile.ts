import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface UserProfile {
  id: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  role: string;
  createdAt: string;
}

export function useUserProfile(userId: string) {
  return useQuery<UserProfile, Error>({
    queryKey: ['users', 'profile', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/users/profile/${userId}`);
      return data.profile;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1,
  });
}

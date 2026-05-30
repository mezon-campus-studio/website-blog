import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '../store/authStore';

export interface UserProfile {
  id: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  role: string;
  createdAt: string;
}

export function useUserProfile(userId: string) {
  const token = useAuthStore((s) => s.token);
  
  return useQuery<UserProfile, Error>({
    queryKey: ['users', 'profile', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/users/profile/${userId}`);
      return data.profile;
    },
    enabled: !!userId && !!token,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1,
  });
}

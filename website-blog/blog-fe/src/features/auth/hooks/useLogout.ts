import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import apiClient from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export function useLogout() {
  const logoutStore = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
          await apiClient.post('/auth/logout');
        }
      } catch (error) {
        console.error('Logout API error:', error);
      } finally {
        // Always logout locally even if API fails
        logoutStore();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('auth-storage');
        }
        queryClient.clear();
        router.push('/');
      }
    },
  });
}

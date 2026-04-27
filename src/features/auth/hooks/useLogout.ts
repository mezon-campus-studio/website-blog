import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '../context/AuthContext';

export function useLogout() {
  const { logout: clearAuthState } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Best effort logout on server
      try {
        await apiClient.post('/auth/logout');
      } catch (e) {
        // Ignore errors during logout
      }
    },
    onSettled: () => {
      clearAuthState();
      queryClient.clear();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
  });
}

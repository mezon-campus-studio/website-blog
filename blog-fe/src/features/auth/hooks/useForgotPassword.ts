import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      await apiClient.post('/auth/forgot-password', { email });
      return { success: true };
    },
  });
}

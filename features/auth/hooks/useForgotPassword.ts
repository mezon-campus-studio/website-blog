import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // In real app:
      // await apiClient.post('/auth/forgot-password', { email });
      
      return { success: true };
    },
  });
}

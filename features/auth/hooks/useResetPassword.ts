import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

interface ResetPasswordCredentials {
  token: string;
  password: string;
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (credentials: ResetPasswordCredentials) => {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // In real app:
      // await apiClient.post('/auth/reset-password', credentials);
      
      return { success: true };
    },
  });
}

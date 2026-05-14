import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

interface ResetPasswordCredentials {
  token: string;
  password: string;
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (credentials: ResetPasswordCredentials) => {
      await apiClient.post('/auth/reset-password', credentials);
      return { success: true };
    },
  });
}

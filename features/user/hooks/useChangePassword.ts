import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const response = await apiClient.patch('/users/profile/password', data);
      return response.data;
    },
  });
}

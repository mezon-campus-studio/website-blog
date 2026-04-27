import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function useChangePassword() {
  return useMutation<void, Error, ChangePasswordData>({
    mutationFn: async (data) => {
      await apiClient.patch('/user/profile/password', data);
    },
  });
}

import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import apiClient from '@/lib/api-client';
import { User } from '@/features/auth/types';

export function useUpdateAvatar() {
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.post<{ profile: User }>('/users/profile/avatar', formData);
      return response.data;
    },
    onSuccess: (data) => {
      updateUser(data.profile);
    },
  });
}

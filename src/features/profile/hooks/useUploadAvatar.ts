import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/features/auth/hooks';

export function useUploadAvatar() {
  const { updateUser } = useAuth();

  return useMutation<{ avatar_url: string }, Error, File>({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await apiClient.post<{ avatar_url: string }>('/user/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      updateUser({ avatar_url: data.avatar_url });
    },
  });
}

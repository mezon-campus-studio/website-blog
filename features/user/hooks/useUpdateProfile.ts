import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import apiClient from '@/lib/api-client';
import { User } from '@/features/auth/types';

interface UpdateProfileData {
  name?: string;
  bio?: string;
}

export function useUpdateProfile() {
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const response = await apiClient.patch<{ profile: User }>('/users/profile', data);
      return response.data;
    },
    onSuccess: (data) => {
      updateUser(data.profile);
    },
  });
}

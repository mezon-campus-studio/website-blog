import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/features/auth/hooks';
import { User } from '@/features/auth/types';

interface UpdateProfileData {
  name: string;
  bio?: string;
}

export function useUpdateProfile() {
  const { updateUser } = useAuth();

  return useMutation<User, Error, UpdateProfileData>({
    mutationFn: async (data) => {
      const response = await apiClient.patch<User>('/user/profile', data);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
    },
  });
}

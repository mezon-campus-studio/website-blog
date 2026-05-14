import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { User } from '@/features/auth/types';
import { useAuthStore } from '@/features/auth/store/authStore';

interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: CreateUserDto) => {
      const { data } = await apiClient.post<{ data: User }>('/admin/add-user', dto);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

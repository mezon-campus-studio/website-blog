import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

interface UpdateUserDto {
  name?: string;
  role: 'ADMIN' | 'USER';
}


export function useUpdateUser(userId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateUserDto>({
    mutationFn: async (dto) => {
      await apiClient.patch(`/users/${userId}`, dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'all'] });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (userId) => {
      await apiClient.patch(`/users/${userId}/status`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'all'] });
    },
  });
}

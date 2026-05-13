import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import apiClient from '@/lib/api-client';
import { User } from '@/features/auth/types';

export function useUpdateAvatar() {
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.post<{ profile: User }>('/users/profile/avatar', formData);
      return response.data;
    },
    onSuccess: (data) => {
      const updatedUser = data.profile;
      updateUser(updatedUser);

      // Sync new avatar with Quick Login list (localStorage)
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('saved_accounts');
        if (saved) {
          try {
            const accounts = JSON.parse(saved);
            const updated = accounts.map((a: any) => 
              a.email === updatedUser.email 
                ? { ...a, avatar_url: updatedUser.avatar_url } 
                : a
            );
            localStorage.setItem('saved_accounts', JSON.stringify(updated));
          } catch (e) {
            console.error('Failed to sync saved accounts:', e);
          }
        }
      }
    },
  });
}

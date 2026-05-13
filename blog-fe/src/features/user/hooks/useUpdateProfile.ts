import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import apiClient from '@/lib/api-client';
import { User } from '@/features/auth/types';

interface UpdateProfileData {
  name?: string;
  bio?: string;
  avatar_url?: string;
}

export function useUpdateProfile() {
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      try {
        const response = await apiClient.patch<any>('/users/profile', data);


        return response.data;
      } catch (error: any) {
        console.error('[Profile Update Error]', error.response?.data || error.message);
        throw error;
      }
    },

    onSuccess: (data) => {
      // Handle both { user: ... } and direct user response
      const updatedUser = data.user || data.profile || data;
      updateUser(updatedUser);

      // Sync new name with Quick Login list (localStorage)
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('saved_accounts');
        if (saved) {
          try {
            const accounts = JSON.parse(saved);
            const updated = accounts.map((a: any) => 
              a.email === updatedUser.email 
                ? { ...a, name: updatedUser.name, avatar_url: updatedUser.avatar_url } 
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

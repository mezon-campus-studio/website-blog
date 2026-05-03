import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { User } from '@/features/auth/types';
import { useAuthStore } from '@/features/auth/store/authStore';

interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: CreateUserDto) => {
      // CAPTURE current admin session BEFORE it gets overwritten or cleared
      const adminUser = useAuthStore.getState().user;
      const adminToken = useAuthStore.getState().token;

      console.log('🛠 [useCreateUser] Attempting to create user while preserving Admin:', adminUser?.name);
      
      const signUpData = {
        ...dto,
        confirmPassword: dto.password,
      };

      try {
        const { data } = await apiClient.post<{ user: User }>('/auth/register', signUpData);
        return data;
      } finally {
        // ALWAYS RESTORE Admin Session regardless of success/failure
        // This prevents the admin from being logged out by the backend's Set-Cookie header
        if (adminUser && adminToken) {
          console.log('✅ [useCreateUser] Force-restoring Admin session for:', adminUser.name);
          useAuthStore.getState().setAuth(adminUser, adminToken);
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', adminToken);
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { User } from '../types';
import apiClient from '@/lib/api-client';

interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupResponse {
  message: string;
  accessToken: string;
  user: User;
}

export function useSignup() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<SignupResponse, Error, SignupCredentials>({
    mutationFn: async (credentials) => {
      const { data } = await apiClient.post<SignupResponse>('/auth/register', credentials);
      
      // Auto-login after signup
      setAuth(data.user, data.accessToken);
      
      // Also store token in a simple key for api-client to read easily
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.accessToken);
      }
      
      return data;
    },
  });
}

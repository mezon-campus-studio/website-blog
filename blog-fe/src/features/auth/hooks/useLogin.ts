import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { User } from '../types';
import apiClient from '@/lib/api-client';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  accessToken: string;
  user: User;
}

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const { data } = await apiClient.post<any>('/auth/login', credentials);
      
      // Be flexible: Backend might use accessToken, token, or jwt

      const token = data.accessToken || data.token || data.jwt || data.access_token;
      const user = data.user || data.data?.user || data;

      if (!token) {
        console.error('[Login Error] No token found in response!', data);
      }

      // Store user and token in Zustand
      setAuth(user, token);
      
      // Also store token in a simple key for api-client to read easily
      if (typeof window !== 'undefined' && token) {
        localStorage.setItem('token', token);
      }
      
      return data;
    },
  });
}

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
      const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials);
      
      // Store user and token (accessToken from backend)
      setAuth(data.user, data.accessToken);
      
      return data;
    },
  });
}

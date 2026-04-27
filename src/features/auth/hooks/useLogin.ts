import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { AuthResponse } from '@/features/auth/types';
import { useAuth } from '../context/AuthContext';

interface LoginCredentials {
  email: string;
  password: string;
}

export function useLogin() {
  const { login: setAuthState } = useAuth();

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      setAuthState(data.accessToken, data.user);
    },
  });
}

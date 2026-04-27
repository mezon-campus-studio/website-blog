import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { AuthResponse } from '@/features/auth/types';
import { useAuth } from '../context/AuthContext';

interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function useSignup() {
  const { login: setAuthState } = useAuth();

  return useMutation<AuthResponse, Error, SignupCredentials>({
    mutationFn: async (credentials) => {
      const response = await apiClient.post<AuthResponse>('/auth/register', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      setAuthState(data.accessToken, data.user);
    },
  });
}

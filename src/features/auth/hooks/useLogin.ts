import { useMutation } from '@tanstack/react-query';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: { email: string };
}

/**
 * useLogin — mutation hook for authenticating a user.
 * Replace mutationFn with real API call when backend is ready.
 */
export function useLogin() {
  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      // TODO: Replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (credentials.email === 'error@example.com') {
        throw new Error('Invalid email or password');
      }

      return { token: 'mock-token', user: { email: credentials.email } };
    },
  });
}

import { useMutation } from '@tanstack/react-query';

// Define the credentials type
interface LoginCredentials {
  email: string;
  password?: string;
}

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (credentials.email === 'error@example.com') {
        throw new Error('Invalid email or password');
      }

      return { token: 'mock-token', user: { email: credentials.email } };
    },
  });
}
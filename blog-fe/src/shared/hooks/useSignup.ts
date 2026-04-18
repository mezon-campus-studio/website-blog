import { useMutation } from '@tanstack/react-query';

interface SignupCredentials {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export function useSignup() {
  return useMutation({
    mutationFn: async (credentials: SignupCredentials) => {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (credentials.email === 'error@example.com') {
        throw new Error('This email is already registered, please login instead.');
      }

      return { token: 'mock-token', user: { email: credentials.email, name: credentials.name } };
    },
  });
}

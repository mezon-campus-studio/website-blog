import { useMutation } from '@tanstack/react-query';

interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupResponse {
  token: string;
  user: { email: string; name: string };
}

/**
 * useSignup — mutation hook for registering a new user.
 * Replace mutationFn with real API call when backend is ready.
 */
export function useSignup() {
  return useMutation<SignupResponse, Error, SignupCredentials>({
    mutationFn: async (credentials) => {
      // TODO: Replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (credentials.email === 'error@example.com') {
        throw new Error('This email is already registered. Please log in instead.');
      }

      return {
        token: 'mock-token',
        user: { email: credentials.email, name: credentials.name },
      };
    },
  });
}

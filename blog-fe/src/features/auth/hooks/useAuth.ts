/**
 * useAuth — convenience hook wrapping the Zustand auth store.
 * Provides user, token, and auth actions to components.
 */
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);
  const logout = useAuthStore((s) => s.logout);
  const updateUser = useAuthStore((s) => s.updateUser);

  return {
    user,
    token,
    isAuthenticated: !!token,
    setAuth,
    logout,
    updateUser,
  };
}

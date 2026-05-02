export type Role = 'USER' | 'AUTHOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar_url?: string;
  bio?: string;
  articlesCount?: number;
  followersCount?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

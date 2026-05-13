export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  role: Role;
  isActive: boolean;
  articlesCount?: number;
  followersCount?: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

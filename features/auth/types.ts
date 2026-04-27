export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  AUTHOR = 'AUTHOR',
}

export type Role = 'USER' | 'AUTHOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  articlesCount?: number;
  followersCount?: number;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

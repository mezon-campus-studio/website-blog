/**
 * Common types used across the application
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'writer' | 'admin';
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, string>;
}

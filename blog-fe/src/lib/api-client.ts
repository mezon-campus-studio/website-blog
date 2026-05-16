import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';

const API_BASE_URL = '/memorizz-api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Helper to check if a route is public
const isPublicRoute = (url: string = '') => {
  const publicPaths = [
    '/signin',
    '/signup',
    '/post/hot',
    '/category/all',
    '/category/',
    '/tag/all',
    '/tag',
    '/search'
  ];
  return publicPaths.some(path => url.startsWith(path));
};

// Add a request interceptor to attach the JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isPublic = isPublicRoute(url);

    // Log detailed error info for debugging
    if (error.response) {
      console.error(`❌ API Error [${status}] on ${url}`);
      console.error('Data:', error.response.data);
    }
    // Only clear session for 401 on protected routes
    if (status === 401 && !isPublic) {
      console.error('🚨 Session expired or unauthorized. Clearing session...');
      if (typeof window !== 'undefined') {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';

const API_BASE_URL = '/memorizz-api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Helper to check if a route is public
const isPublicRoute = (url: string = '') => {
  const publicPaths = [
    '/auth/login',
    '/auth/register',
    '/post',
    '/post/hot',
    '/category',
    '/tag',
    '/search'
  ];
  // Check if the URL starts with any of the public paths
  // We use includes or startsWith depending on how specific we want to be
  return publicPaths.some(path => url.includes(path));
};

// Add a request interceptor to attach the JWT token
apiClient.interceptors.request.use(
  (config) => {
    const url = config.url || '';
    const isPublic = isPublicRoute(url);

    // Get token from store first, fallback to localStorage
    let token = useAuthStore.getState().token;
    
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('token');
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else if (!isPublic) {
      console.warn(`[API Request] NO TOKEN found for ${url}`);
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
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Clear zustand store
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

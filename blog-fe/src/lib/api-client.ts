import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/memorizz-api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Helper to check if a route is public
const isPublicRoute = (url: string = '') => {
  // Normalize URL to a relative pathname
  let path = url;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const urlObj = new URL(url);
      path = urlObj.pathname;
    } catch (e) {}
  }
  
  // Strip API base path prefixes if present
  path = path.replace(/^\/memorizz-api/, '').replace(/^\/api/, '');

  const publicPaths = [
    '/signin',
    '/signup',
    '/post/hot',
    '/post/',
    '/category/all',
    '/category/',
    '/tag/all',
    '/tag',
    '/search'
  ];
  return publicPaths.some(p => path.startsWith(p));
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
      // Avoid printing noisy red console errors for backend's missing notification endpoints
      const isNotification404 = status === 404 && url.includes('/notification/');
      
      if (!isNotification404) {
        console.error(`❌ API Error [${status}] on ${url}`);
        console.error('Data:', error.response.data);
      }
    }
    
    // Only clear session for 401 on protected routes when a token exists
    if (status === 401 && !isPublic) {
      const token = useAuthStore.getState().token;
      if (token) {
        console.error('🚨 Session expired or unauthorized. Clearing session...');
        if (typeof window !== 'undefined') {
          useAuthStore.getState().logout();
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

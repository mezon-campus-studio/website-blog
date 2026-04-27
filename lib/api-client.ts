import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach Token to Headers
apiClient.interceptors.request.use(
  (config) => {
    // Get token directly from store (no hook needed)
    const token = useAuthStore.getState().token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized error handling (e.g., 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid -> Logout immediately
      useAuthStore.getState().logout();
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

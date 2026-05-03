import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Post } from '../types';

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation<Post, Error, any>({
    mutationFn: async (inputData) => {
      let finalData: any;

      if (inputData instanceof FormData) {
        inputData.delete('isDraft');
        inputData.delete('tags');

        // Ensure categoryId is a string and not empty
        if (!inputData.get('categoryId')) {
          console.warn('[PostForm] Missing categoryId, ensure you select one in the form');
        }

        if (!inputData.get('thumbnail')) {
          // Send an empty Blob to prevent backend from crashing with "undefined" req.files
          // This satisfies the backend's "files.thumbnail" access without uploading a real image
          const emptyBlob = new Blob([''], { type: 'image/png' });
          inputData.set('thumbnail', emptyBlob, 'empty.png');
        }
        finalData = inputData;
      } else {
        finalData = { ...inputData };
        delete finalData.isDraft;
        delete finalData.tags;
      }

      try {
        const { data } = await apiClient.post<{ message: string; data: Post }>('/post', finalData);
        return data.data;
      } catch (error: any) {
        // Log detailed validation errors from backend
        if (error.response?.data) {
          console.error('❌ BACKEND VALIDATION ERROR:', JSON.stringify(error.response.data, null, 2));
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useMyPosts(status?: 'draft' | 'published') {
  return useQuery<Post[], Error>({
    queryKey: ['posts', 'my', status],
    queryFn: async () => {
      // Mapping internal status to backend endpoints
      const endpoint = status === 'draft' ? '/post/draft' : status === 'published' ? '/post/published' : '/post/user/me';
      const { data } = await apiClient.get<{ data: Post[] }>(endpoint);
      return data.data || [];
    },
  });
}

export function useAllPosts() {
  return useQuery<Post[], Error>({
    queryKey: ['posts', 'all'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Post[] }>('/post');
      return data.data || [];
    },
  });
}

export function useHottestPosts() {
  return useQuery<Post[], Error>({
    queryKey: ['posts', 'hottest'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Post[] }>('/post/hot');
      return data.data || [];
    },
  });
}

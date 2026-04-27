import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Post } from '../types';

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation<Post, Error, FormData>({
    mutationFn: async (formData) => {
      const { data } = await apiClient.post<{ message: string; data: Post }>('/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data.data;
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

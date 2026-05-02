import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Post } from '../types';

export function usePost(id: string) {
  return useQuery<Post, Error>({
    queryKey: ['posts', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Post }>(`/post/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await apiClient.delete(`/post/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useUpdatePost(id: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, FormData>({
    mutationFn: async (formData) => {
      await apiClient.put(`/post/${id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', id] });
    },
  });
}

export function usePostBySlug(slug: string) {
  return useQuery<Post, Error>({
    queryKey: ['posts', 'slug', slug],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Post }>(`/post/slug/${slug}`);
      return data.data;
    },
    enabled: !!slug,
  });
}

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
      // Backend UpdatePostDto does NOT allow isDraft or tagIds
      formData.delete('isDraft');
      formData.delete('tagIds');
      
      await apiClient.put(`/post/${id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', id] });
    },
  });
}

export function usePublishPost() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await apiClient.patch(`/post/${id}/publish`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', id] });
    },
  });
}

export function useSaveDraft() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await apiClient.patch(`/post/${id}/draft`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', id] });
    },
  });
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Tag } from '../types';
import { Post } from '@/features/posts/types';
import { useAuthStore } from '@/features/auth/store/authStore';


interface CreateTagPayload {
  name: string;
  description?: string;
}

interface UpdateTagPayload {
  tag_id: string;
  name?: string;
  description?: string;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useAllTags() {
  const user = useAuthStore((state) => state.user);
  return useQuery<Tag[], Error>({
    queryKey: ['tags', 'all'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Tag[] }>('/tag/all');
      return data.data || [];
    },
    enabled: !!user,
  });
}

export function useTagById(id: string) {
  return useQuery<Tag, Error>({
    queryKey: ['tags', 'id', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Tag }>(`/tag/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function usePostsByTagId(tagId: string) {
  return useQuery<Post[], Error>({
    queryKey: ['posts', 'tag', tagId],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Post[] }>(`/post/reader/tag/${tagId}`);
      return data.data || [];
    },
    enabled: !!tagId,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateTagPayload) => {
      const { data } = await apiClient.post<{ data: Tag }>('/tag', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tag_id, ...payload }: UpdateTagPayload) => {
      const { data } = await apiClient.put<{ data: Tag }>(`/tag/${tag_id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tag_id: string) => {
      await apiClient.delete(`/tag/${tag_id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}
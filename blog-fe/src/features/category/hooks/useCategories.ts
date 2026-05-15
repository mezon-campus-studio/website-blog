import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Category } from '../types';
import { Post } from '@/features/posts/types';
import { useAuthStore } from '@/features/auth/store/authStore';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CreateCategoryPayload {
  name: string;
  description?: string;
}

interface UpdateCategoryPayload {
  category_id: string;
  name?: string;
  description?: string;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useAllCategories() {
   const user = useAuthStore((state) => state.user);
  return useQuery<Category[], Error>({
    queryKey: ['categories', 'all'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Category[] }>('/category/all');
      return data.data || [];
    },
     enabled: !!user,
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery<Category, Error>({
    queryKey: ['categories', 'slug', slug],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Category }>(`/category/${slug}`);
      return data.data;
    },
    enabled: !!slug,
  });
}

export function usePostsByCategorySlug(slug: string) {
  return useQuery<Post[], Error>({
    queryKey: ['posts', 'category', slug],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Post[] }>(`/post/reader/category/${slug}`);
      return data.data || [];
    },
    enabled: !!slug,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCategoryPayload) => {
      const { data } = await apiClient.post<{ data: Category }>('/category', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ category_id, ...payload }: UpdateCategoryPayload) => {
      const { data } = await apiClient.put<{ data: Category }>(`/category/${category_id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category_id: string) => {
      await apiClient.delete(`/category/${category_id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
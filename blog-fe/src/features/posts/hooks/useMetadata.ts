import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Category[] }>('/category/all');
      return data.data || [];
    },
  });
};

export const useTags = () => {
  return useQuery<Tag[], Error>({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Tag[] }>('/tag/all');
      return data.data || [];
    },
  });
};

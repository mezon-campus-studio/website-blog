import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Post } from '../types';
import { useAuthStore } from '@/features/auth/store/authStore';

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formData, shouldPublish = false }: { formData: FormData; shouldPublish?: boolean }) => {
      try {
        console.log(`[useCreatePost] Creating draft...`);

        // Step 1: Create the post
        // Remove isDraft because the backend DTO doesn't allow it
        formData.delete('isDraft');

        const response = await apiClient.post<{ message: string; data: Post }>('/post', formData);
        const createdPost = response.data.data;

        console.log(`[useCreatePost] Draft created with ID:`, createdPost?.id);

        // Step 2: If publishing, wait a tiny bit then call publish
        if (shouldPublish && createdPost?.id) {
          console.log(`[useCreatePost] Waiting for DB sync...`);
          await new Promise(resolve => setTimeout(resolve, 500));

          console.log(`[useCreatePost] Calling publish API...`);
          await apiClient.patch(`/post/${createdPost.id}/publish`, {});
          console.log(`[useCreatePost] Published successfully!`);
        }

        return createdPost;
      } catch (error: any) {
        if (error.response?.data) {
          console.error('❌ BACKEND ERROR:', JSON.stringify(error.response.data, null, 2));
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
  const user = useAuthStore((state) => state.user);

  return useQuery<Post[], Error>({
    queryKey: ['posts', 'my', user?.id, status],
    queryFn: async () => {
      if (!user?.id) return [];

      // Using the generic user posts endpoint which is stable in the backend
      const { data } = await apiClient.get<{ data: Post[] }>(`/post/user/${user.id}`);
      const posts = data.data || [];

      // Filter locally based on status as the backend endpoint doesn't support it
      if (status === 'draft') {
        return posts.filter(p => p.isDraft);
      }
      if (status === 'published') {
        return posts.filter(p => !p.isDraft);
      }

      return posts;
    },
    enabled: !!user?.id,
  });
}

export function useAllPosts(page = 1, limit = 10) {
  return useQuery<Post[], Error>({
    queryKey: ['posts', 'all', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Post[] }>(`/post?page=${page}&limit=${limit}`);
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

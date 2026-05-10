import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Post } from '../types';
import { useAuthStore } from '@/features/auth/store/authStore';

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation<Post, Error, any>({
    mutationFn: async (inputData) => {
      let finalData: any;
      let shouldPublish = false;

      if (inputData instanceof FormData) {
        shouldPublish = inputData.get('isDraft') === 'false';
        inputData.delete('isDraft');
        
        if (!inputData.get('thumbnail')) {
          const emptyBlob = new Blob([''], { type: 'image/png' });
          inputData.set('thumbnail', emptyBlob, 'empty.png');
        }
        finalData = inputData;
      } else {
        shouldPublish = inputData.isDraft === false;
        finalData = { ...inputData };
        delete finalData.isDraft;
      }

      try {
        const { data } = await apiClient.post<{ message: string; data: Post }>('/post', finalData);
        const createdPost = data.data;

        // If user wanted to publish, call the publish endpoint after creation
        if (shouldPublish && createdPost.id) {
          console.log(`[useCreatePost] Publishing post ${createdPost.id}...`);
          await apiClient.patch(`/post/${createdPost.id}/publish`);
        }

        return createdPost;
      } catch (error: any) {
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

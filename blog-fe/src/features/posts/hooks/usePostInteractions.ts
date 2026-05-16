import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { 
  Comment, 
  CommentListResponse, 
  LikeToggleResult, 
  BookmarkToggleResult, 
  SharePostResult, 
  SharePlatform 
} from '../types';

// ─── LIKE ──────────────────────────────────────────────────────────────────
export function useLikePost(postId: string) {
  const queryClient = useQueryClient();

  return useMutation<LikeToggleResult, Error>({
    mutationFn: async () => {
      const { data } = await apiClient.post<{ data: LikeToggleResult }>(`/post/${postId}/like`);
      return data.data;
    },
    onSuccess: () => {
      // Invalidate both the post detail and potentially lists
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// ─── BOOKMARK ──────────────────────────────────────────────────────────────
export function useBookmarkPost(postId: string) {
  const queryClient = useQueryClient();

  return useMutation<BookmarkToggleResult, Error>({
    mutationFn: async () => {
      const { data } = await apiClient.post<{ data: BookmarkToggleResult }>(`/post/${postId}/bookmark`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// ─── SHARE ─────────────────────────────────────────────────────────────────
export function useSharePost(postId: string) {
  const queryClient = useQueryClient();

  return useMutation<SharePostResult, Error, { platform?: SharePlatform }>({
    mutationFn: async ({ platform }) => {
      const { data } = await apiClient.post<{ data: SharePostResult }>(`/post/${postId}/share`, { platform });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });
}

// ─── COMMENTS ──────────────────────────────────────────────────────────────
export function useComments(postId: string, page = 1, limit = 10) {
  return useQuery<CommentListResponse, Error>({
    queryKey: ['comments', postId, page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: CommentListResponse }>(`/post/${postId}/comments`, {
        params: { page, limit },
      });
      return data.data;
    },
    enabled: !!postId,
  });
}

export function useAddComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation<Comment, Error, { content: string; parentId?: string }>({
    mutationFn: async ({ content, parentId }) => {
      const { data } = await apiClient.post<{ data: Comment }>(`/post/${postId}/comments`, {
        content,
        parentId,
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });
}

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (commentId: string) => {
      await apiClient.delete(`/post/${postId}/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });
}

// ─── REPORT (real API) ─────────────────────────────────────────────────────
interface ReportPayload {
  postId: string;
  reason: string;
}

export function useReportPost() {
  return useMutation({
    mutationFn: async ({ postId, reason }: ReportPayload) => {
      console.log('📤 Sending Report:', { postId, reason });
      const { data } = await apiClient.post('/report/create', { postId, reason });
      return data;
    },
  });
}

import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Comment } from '../types';

// ─── LIKE (mock – swap endpoint khi BE xong) ───────────────────────────────
export function useLikePost(postId: string, initialCount = 0) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);

  const toggle = useCallback(() => {
    setLiked((prev) => {
      setCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
    // TODO: replace with real API call when BE is ready
    // apiClient.post(`/post/${postId}/like`)
  }, [postId]);

  return { liked, count, toggle };
}

// ─── COMMENTS (mock – swap endpoint khi BE xong) ──────────────────────────
const MOCK_COMMENTS: Comment[] = [
  {
    id: 'mock-1',
    postId: '',
    userId: 'u1',
    content: 'Great article! Really enjoyed reading this.',
    user: { name: 'Alice' },
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    id: 'mock-2',
    postId: '',
    userId: 'u2',
    content: 'Very insightful, thanks for sharing.',
    user: { name: 'Bob' },
    createdAt: new Date(Date.now() - 7200_000).toISOString(),
  },
];

export function useComments(postId: string) {
  return useQuery<Comment[]>({
    queryKey: ['comments', postId],
    queryFn: async () => {
      // TODO: replace with real API: GET /post/:postId/comments
      await new Promise((r) => setTimeout(r, 300));
      return MOCK_COMMENTS.map((c) => ({ ...c, postId }));
    },
  });
}

export function useAddComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string): Promise<Comment> => {
      // TODO: replace with real API: POST /post/:postId/comments
      await new Promise((r) => setTimeout(r, 200));
      return {
        id: `mock-${Date.now()}`,
        postId,
        userId: 'me',
        content,
        user: { name: 'You' },
        createdAt: new Date().toISOString(),
      };
    },
    onSuccess: (newComment) => {
      queryClient.setQueryData<Comment[]>(['comments', postId], (old = []) => [
        ...old,
        newComment,
      ]);
    },
  });
}

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      // TODO: replace with real API: DELETE /comments/:id
      await new Promise((r) => setTimeout(r, 200));
      return commentId;
    },
    onSuccess: (commentId) => {
      queryClient.setQueryData<Comment[]>(['comments', postId], (old = []) =>
        old.filter((c) => c.id !== commentId)
      );
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
    mutationFn: async ({ postId, reason }: { postId: string; reason: string }) => {
      console.log('📤 Sending Report:', { postId, reason });
      const { data } = await apiClient.post('/report/create', { postId, reason });
      return data;
    },
  });
}

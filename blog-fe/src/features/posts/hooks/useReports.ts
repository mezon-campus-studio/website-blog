import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Report, ReportStatus } from '@/features/posts/types';

// ─── User: xem report của mình ─────────────────────────────────────────────
export function useMyReports() {
  return useQuery<Report[]>({
    queryKey: ['reports', 'my'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Report[] }>('/report/myreport');
      return data.data || [];
    },
  });
}

// ─── Admin: xem report theo status ─────────────────────────────────────────
export function useReportsByStatus(status: ReportStatus = 'PENDING', page = 1, limit = 20) {
  return useQuery<Report[]>({
    queryKey: ['reports', 'status', status, page],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Report[] }>(
        `/report/status?status=${status}`
      );
      return data.data || [];
    },
  });
}

// ─── Admin: update status của report ───────────────────────────────────────
export function useUpdateReportStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, status }: { reportId: string; status: ReportStatus }) => {
      const { data } = await apiClient.patch<{ message: string }>('/report/status', {
        reportId,
        status,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

// ─── User: rút report (soft-delete) ────────────────────────────────────────
export function useDeleteReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportId: string) => {
      const { data } = await apiClient.patch<{ message: string }>(`/report/${reportId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'my'] });
    },
  });
}

// ─── Admin: xóa bài viết bị report ────────────────────────────────────────
export function useDeleteReportedPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { data } = await apiClient.delete<{ message: string }>(`/post/${postId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

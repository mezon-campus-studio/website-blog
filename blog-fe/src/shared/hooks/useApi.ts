import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import type { 
  UseQueryOptions, 
  UseSuspenseQueryOptions, 
  UseSuspenseQueryResult 
} from '@tanstack/react-query';

/**
 * Standard API hook for component-level data fetching
 */
export function useApi<TData, TError = Error>(
  options: UseSuspenseQueryOptions<TData, TError>
): UseSuspenseQueryResult<TData, TError> {
  return useSuspenseQuery({
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10,   // 10 minutes
    retry: 1,
    ...options,
  });
}

/**
 * Paginated API hook with longer cache duration
 */
export function usePaginatedApi<TData, TError = Error>(
  options: UseSuspenseQueryOptions<TData, TError>
): UseSuspenseQueryResult<TData, TError> {
  return useSuspenseQuery({
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 15,    // 15 minutes
    retry: 1,
    ...options,
  });
}
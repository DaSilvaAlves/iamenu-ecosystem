/**
 * React Hooks for API calls
 *
 * Provides useApi and useMutation hooks for data fetching
 */

import { useState, useEffect, useCallback } from 'react';

interface AxiosLikeResponse<T> {
  data: T;
}

interface AxiosLikeError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
}

interface UseMutationOptions<T, V> {
  onSuccess?: (data: T, variables: V) => void;
  onError?: (error: unknown, variables: V) => void;
  onSettled?: () => void;
}

interface UseInfiniteApiOptions<T> {
  limit?: number;
  getNextPageParam?: (result: T) => unknown;
}

/**
 * useApi - Hook for GET requests with automatic fetching
 *
 * @example
 * const { data, loading, error, refetch } = useApi(
 *   () => communityApi.posts.list({ page: 1 }),
 *   [page]
 * );
 */
export function useApi<T = unknown>(
  apiFn: () => Promise<AxiosLikeResponse<T>>,
  deps: unknown[] = [],
  options: UseApiOptions<T> = {}
) {
  const { immediate = true, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFn();
      const result = response.data;
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err: unknown) {
      const axiosErr = err as AxiosLikeError;
      const errorMessage = axiosErr.response?.data?.message || axiosErr.message || 'An error occurred';
      setError(errorMessage);
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFn, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, immediate]);

  return {
    data,
    loading,
    error,
    refetch: execute,
    setData
  };
}

/**
 * useMutation - Hook for POST/PUT/PATCH/DELETE requests
 *
 * @example
 * const { mutate, loading, error } = useMutation(
 *   (data) => communityApi.posts.create(data),
 *   { onSuccess: () => refetchPosts() }
 * );
 *
 * // Usage
 * mutate({ title: 'New Post', body: 'Content' });
 */
export function useMutation<T = unknown, V = unknown>(
  mutationFn: (variables: V) => Promise<AxiosLikeResponse<T>>,
  options: UseMutationOptions<T, V> = {}
) {
  const { onSuccess, onError, onSettled } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const mutate = useCallback(async (variables: V) => {
    setLoading(true);
    setError(null);

    try {
      const response = await mutationFn(variables);
      const result = response.data;
      setData(result);
      onSuccess?.(result, variables);
      return result;
    } catch (err: unknown) {
      const axiosErr = err as AxiosLikeError;
      const errorMessage = axiosErr.response?.data?.message || axiosErr.message || 'An error occurred';
      setError(errorMessage);
      onError?.(err, variables as V);
      throw err;
    } finally {
      setLoading(false);
      onSettled?.();
    }
  }, [mutationFn, onSuccess, onError, onSettled]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    mutate,
    loading,
    error,
    data,
    reset,
    isLoading: loading,
    isError: !!error,
    isSuccess: !!data && !error
  };
}

interface PaginatedResult {
  pagination?: {
    totalPages?: number;
    total?: number;
  };
}

/**
 * usePaginatedApi - Hook for paginated GET requests
 *
 * @example
 * const {
 *   data,
 *   loading,
 *   page,
 *   totalPages,
 *   nextPage,
 *   prevPage,
 *   goToPage
 * } = usePaginatedApi(
 *   (params) => communityApi.posts.list(params),
 *   { limit: 10 }
 * );
 */
export function usePaginatedApi<T extends PaginatedResult = PaginatedResult>(
  apiFn: (params: Record<string, unknown>) => Promise<AxiosLikeResponse<T>>,
  initialParams: Record<string, unknown> = {}
) {
  const [page, setPage] = useState(1);
  const [params, setParams] = useState(initialParams);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const { data, loading, error, refetch } = useApi<T>(
    () => apiFn({ ...params, page }),
    [page, JSON.stringify(params)],
    {
      onSuccess: (result: T) => {
        if (result.pagination) {
          setTotalPages(result.pagination.totalPages || 1);
          setTotalItems(result.pagination.total || 0);
        }
      }
    }
  );

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(p => p + 1);
    }
  }, [page, totalPages]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(p => p - 1);
    }
  }, [page]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const updateParams = useCallback((newParams: Record<string, unknown>) => {
    setParams(prev => ({ ...prev, ...newParams }));
    setPage(1); // Reset to first page when params change
  }, []);

  return {
    data,
    loading,
    error,
    page,
    totalPages,
    totalItems,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage,
    prevPage,
    goToPage,
    updateParams,
    refetch
  };
}

interface InfinitePageData {
  data?: unknown[];
  [key: string]: unknown;
}

/**
 * useInfiniteApi - Hook for infinite scroll/load more
 *
 * @param apiFn - API function that accepts { page, limit, ...params }
 * @param options - Options { limit, getNextPageParam }
 */
export function useInfiniteApi<T extends InfinitePageData = InfinitePageData>(
  apiFn: (params: Record<string, unknown>) => Promise<AxiosLikeResponse<T>>,
  options: UseInfiniteApiOptions<T> = {}
) {
  const { limit = 20, getNextPageParam } = options;

  const [pages, setPages] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiFn({ page, limit });
      const result = response.data;

      setPages(prev => [...prev, result]);

      // Determine if there are more pages
      const nextPageValue = getNextPageParam
        ? getNextPageParam(result)
        : (result.data as unknown[] | undefined)?.length === limit;

      setHasMore(!!nextPageValue);
      setPage(p => p + 1);

      return result;
    } catch (err: unknown) {
      const axiosErr = err as AxiosLikeError;
      setError(axiosErr.response?.data?.message || axiosErr.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFn, page, limit, loading, hasMore, getNextPageParam]);

  const reset = useCallback(() => {
    setPages([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  // Flatten all pages into single data array
  const data = pages.flatMap(p => (p.data || [p]) as unknown[]);

  return {
    data,
    pages,
    loading,
    error,
    hasMore,
    loadMore,
    reset
  };
}

export default {
  useApi,
  useMutation,
  usePaginatedApi,
  useInfiniteApi
};

/**
 * React Hooks for API calls
 *
 * Provides useApi and useMutation hooks for data fetching
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * useApi - Hook for GET requests with automatic fetching
 *
 * @param {Function} apiFn - API function to call (must return a Promise)
 * @param {Array} deps - Dependencies to re-fetch when changed
 * @param {Object} options - Options { immediate: boolean, onSuccess, onError }
 *
 * @example
 * const { data, loading, error, refetch } = useApi(
 *   () => communityApi.posts.list({ page: 1 }),
 *   [page]
 * );
 */
export function useApi(apiFn, deps = [], options = {}) {
  const { immediate = true, onSuccess, onError } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFn();
      const result = response.data;
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
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
 * @param {Function} mutationFn - Mutation function that accepts data
 * @param {Object} options - Options { onSuccess, onError, onSettled }
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
export function useMutation(mutationFn, options = {}) {
  const { onSuccess, onError, onSettled } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = useCallback(async (variables) => {
    setLoading(true);
    setError(null);

    try {
      const response = await mutationFn(variables);
      const result = response.data;
      setData(result);
      onSuccess?.(result, variables);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      onError?.(err, variables);
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

/**
 * usePaginatedApi - Hook for paginated GET requests
 *
 * @param {Function} apiFn - API function that accepts { page, limit, ...params }
 * @param {Object} initialParams - Initial query parameters
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
export function usePaginatedApi(apiFn, initialParams = {}) {
  const [page, setPage] = useState(1);
  const [params, setParams] = useState(initialParams);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const { data, loading, error, refetch } = useApi(
    () => apiFn({ ...params, page }),
    [page, JSON.stringify(params)],
    {
      onSuccess: (result) => {
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

  const goToPage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const updateParams = useCallback((newParams) => {
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

/**
 * useInfiniteApi - Hook for infinite scroll/load more
 *
 * @param {Function} apiFn - API function that accepts { page, limit, ...params }
 * @param {Object} options - Options { limit, getNextPageParam }
 */
export function useInfiniteApi(apiFn, options = {}) {
  const { limit = 20, getNextPageParam } = options;

  const [pages, setPages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiFn({ page, limit });
      const result = response.data;

      setPages(prev => [...prev, result]);

      // Determine if there are more pages
      const nextPage = getNextPageParam
        ? getNextPageParam(result)
        : result.data?.length === limit;

      setHasMore(!!nextPage);
      setPage(p => p + 1);

      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
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
  const data = pages.flatMap(p => p.data || p);

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

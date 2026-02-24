// ===== COMMUNITY API CLIENT =====
// Connects Prototype-Vision to Community API Backend
// Uses API_CONFIG for dynamic URL resolution (production vs development)

import { API_CONFIG } from '../config/api';
import { mockData } from './mockData';

const API_BASE = API_CONFIG.COMMUNITY_API;
const API_BASE_URL = API_CONFIG.COMMUNITY_BASE;

// Flag to track if we're in offline/mock mode
let useMockData = false;

// Helper function to handle API responses
const handleResponse = async (response: Response): Promise<unknown> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' })) as { message?: string };
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
};

// Authorized fetch - automatically adds JWT token to requests
const authorizedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getToken();

  // Don't set Content-Type for FormData - browser will set it with boundary
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string>),
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

// Get JWT token from localStorage (if exists)
const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Set JWT token in localStorage
const setToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

// Remove JWT token
const clearToken = (): void => {
  localStorage.removeItem('auth_token');
};

// Get user ID from JWT token
const getUserIdFromToken = (): string | null => {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { userId?: string; sub?: string };
    return payload.userId || payload.sub || null;
  } catch {
    return null;
  }
};

interface PostParams {
  limit?: number;
  offset?: number;
  groupId?: string;
  userGroupIds?: string;
  search?: string;
  category?: string;
  sortBy?: string;
}

interface CommentParams {
  limit?: number;
  offset?: number;
}

interface PaginationParams {
  limit?: number | string;
  offset?: number | string;
}

interface PostData {
  title: string;
  body: string;
  category: string;
  groupId?: string;
  tags?: string[];
  image?: File;
  [key: string]: unknown;
}

interface GroupData {
  name: string;
  description?: string;
  category: string;
  type: string;
  coverImage?: File;
  [key: string]: unknown;
}

interface CommentData {
  content: string;
  [key: string]: unknown;
}

export const CommunityAPI = {
  // ===== AUTHENTICATION =====

  /**
   * Get test JWT token (development only)
   */
  getTestToken: async (): Promise<string> => {
    // Don't use authorizedFetch here - we're getting the token!
    const response = await fetch(`${API_BASE}/auth/test-token`);
    const data = await handleResponse(response) as { token: string };
    setToken(data.token);
    return data.token;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!getToken();
  },

  /**
   * Logout (clear token)
   */
  logout: (): void => {
    clearToken();
  },

  // ===== POSTS =====

  /**
   * Get all posts (paginated with search and filters)
   * Falls back to mock data if API is unavailable
   */
  getPosts: async ({ limit = 20, offset = 0, groupId, userGroupIds, search, category, sortBy }: PostParams = {}) => {
    // If we're in mock mode or API is unavailable, return mock data
    if (useMockData) {
      return getMockPosts({ limit, offset, search, category, sortBy });
    }

    try {
      let url = `${API_BASE}/posts?limit=${limit}&offset=${offset}`;
      if (groupId) url += `&groupId=${groupId}`;
      if (userGroupIds) url += `&userGroupIds=${encodeURIComponent(userGroupIds)}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (category) url += `&category=${encodeURIComponent(category)}`;
      if (sortBy) url += `&sortBy=${sortBy}`;

      const response = await authorizedFetch(url);
      return handleResponse(response);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      console.warn('API unavailable, falling back to mock data:', errMsg);
      useMockData = true;
      return getMockPosts({ limit, offset, search, category, sortBy });
    }
  },

  /**
   * Get post by ID
   */
  getPost: async (id: string) => {
    const response = await authorizedFetch(`${API_BASE}/posts/${id}`);
    return handleResponse(response);
  },

  /**
   * Create new post (requires authentication)
   */
  createPost: async (postData: PostData) => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    // If image is provided, use FormData, otherwise use JSON
    let body: FormData | string;
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`
    };

    if (postData.image) {
      const formData = new FormData();
      formData.append('title', postData.title);
      formData.append('body', postData.body);
      formData.append('category', postData.category);
      if (postData.groupId) formData.append('groupId', postData.groupId);
      if (postData.tags) formData.append('tags', JSON.stringify(postData.tags));
      formData.append('image', postData.image);
      body = formData;
      // Don't set Content-Type for FormData - browser will set it with boundary
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(postData);
    }

    const response = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers,
      body
    });
    return handleResponse(response);
  },

  /**
   * Update post (requires authentication, only author)
   */
  updatePost: async (id: string, updates: Record<string, unknown>) => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await authorizedFetch(`${API_BASE}/posts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  },

  /**
   * Delete post (requires authentication, only author)
   */
  deletePost: async (id: string): Promise<void> => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await authorizedFetch(`${API_BASE}/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Delete failed' })) as { message?: string };
      throw new Error(error.message);
    }
  },

  /**
   * Toggle reaction on a post (requires authentication)
   */
  toggleReaction: async (postId: string, reactionType: string) => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await authorizedFetch(`${API_BASE}/posts/${postId}/react`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reactionType })
    });

    return handleResponse(response);
  },

  /**
   * Get reaction counts for a post
   */
  getPostReactions: async (postId: string) => {
    const response = await authorizedFetch(`${API_BASE}/posts/${postId}/reactions`);
    return handleResponse(response);
  },

  // ===== NOTIFICATIONS =====

  /**
   * Get user notifications (requires authentication)
   */
  getNotifications: async ({ limit = 20, offset = 0 }: CommentParams = {}) => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await authorizedFetch(
      `${API_BASE}/notifications?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return handleResponse(response);
  },

  /**
   * Mark notification as read (requires authentication)
   */
  markNotificationAsRead: async (id: string) => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await authorizedFetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  /**
   * Mark all notifications as read (requires authentication)
   */
  markAllNotificationsAsRead: async () => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await authorizedFetch(`${API_BASE}/notifications/read-all`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // ===== GROUPS =====

  /**
   * Get all groups (paginated with search and filters)
   */
  getGroups: async ({ limit = 50, offset = 0, search, category, type, sortBy }: {
    limit?: number;
    offset?: number;
    search?: string;
    category?: string;
    type?: string;
    sortBy?: string;
  } = {}) => {
    let url = `${API_BASE}/groups?limit=${limit}&offset=${offset}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (type) url += `&type=${type}`;
    if (sortBy) url += `&sortBy=${sortBy}`;

    const response = await authorizedFetch(url);
    return handleResponse(response);
  },

  /**
   * Get group by ID
   */
  getGroup: async (id: string) => {
    const response = await authorizedFetch(`${API_BASE}/groups/${id}`);
    return handleResponse(response);
  },

  /**
   * Get groups by category
   */
  getGroupsByCategory: async (category: string) => {
    const response = await authorizedFetch(`${API_BASE}/groups/category/${category}`);
    return handleResponse(response);
  },

  /**
   * Get user's groups (groups the user is member of)
   */
  getUserGroups: async (userId: string) => {
    const response = await authorizedFetch(`${API_BASE}/groups/user/${userId}`);
    return handleResponse(response);
  },

  /**
   * Create new group (requires authentication)
   */
  createGroup: async (groupData: GroupData) => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    // If cover image is provided, use FormData, otherwise use JSON
    let body: FormData | string;
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`
    };

    if (groupData.coverImage) {
      const formData = new FormData();
      formData.append('name', groupData.name);
      if (groupData.description) formData.append('description', groupData.description);
      formData.append('category', groupData.category);
      formData.append('type', groupData.type);
      formData.append('coverImage', groupData.coverImage);
      body = formData;
      // Don't set Content-Type for FormData - browser will set it with boundary
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(groupData);
    }

    const response = await authorizedFetch(`${API_BASE}/groups`, {
      method: 'POST',
      headers,
      body
    });
    return handleResponse(response);
  },

  // ===== COMMENTS =====

  /**
   * Get comments for a post
   */
  getComments: async (postId: string, { limit = 20, offset = 0 }: CommentParams = {}) => {
    const response = await authorizedFetch(
      `${API_BASE}/posts/${postId}/comments?limit=${limit}&offset=${offset}`
    );
    return handleResponse(response);
  },

  /**
   * Create new comment (requires authentication)
   */
  createComment: async (postId: string, commentData: CommentData) => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    const response = await authorizedFetch(`${API_BASE}/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(commentData)
    });
    return handleResponse(response);
  },

  /**
   * Delete comment (requires authentication, only author)
   */
  deleteComment: async (postId: string, commentId: string): Promise<void> => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await authorizedFetch(`${API_BASE}/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Delete failed' })) as { message?: string };
      throw new Error(error.message);
    }
  },

  /**
   * Toggle reaction on a comment (requires authentication)
   */
  toggleCommentReaction: async (postId: string, commentId: string, reactionType: string) => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await authorizedFetch(`${API_BASE}/posts/${postId}/comments/${commentId}/react`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reactionType })
    });

    return handleResponse(response);
  },

  /**
   * Get reaction counts for a comment
   */
  getCommentReactions: async (postId: string, commentId: string) => {
    const response = await authorizedFetch(`${API_BASE}/posts/${postId}/comments/${commentId}/reactions`);
    return handleResponse(response);
  },

  // ===== PROFILES =====

  /**
   * Get user profile
   */
  getProfile: async (userId: string) => {
    const response = await authorizedFetch(`${API_BASE}/profiles/${userId}`);
    return handleResponse(response);
  },

  /**
   * Update profile (requires authentication)
   */
  updateProfile: async (userId: string, profileData: Record<string, unknown>) => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const formData = new FormData();
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== undefined && profileData[key] !== null) {
        formData.append(key, profileData[key] as string | Blob);
      }
    });

    const response = await authorizedFetch(`${API_BASE}/profiles/${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    return handleResponse(response);
  },

  /**
   * Get user statistics
   */
  getUserStats: async (userId: string) => {
    const response = await authorizedFetch(`${API_BASE}/profiles/${userId}/stats`);
    return handleResponse(response);
  },

  /**
   * Get user's posts
   */
  getUserPosts: async (userId: string, params: PaginationParams = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', String(params.limit));
    if (params.offset) queryParams.append('offset', String(params.offset));

    const response = await authorizedFetch(`${API_BASE}/profiles/${userId}/posts?${queryParams}`);
    return handleResponse(response);
  },

  /**
   * Search profiles by username
   */
  searchProfiles: async ({ q }: { q: string }) => {
    const response = await authorizedFetch(`${API_BASE}/profiles/search?q=${encodeURIComponent(q)}`);
    return handleResponse(response);
  },

  // ===== FOLLOWERS/FOLLOWING =====

  /**
   * Follow a user (requires authentication)
   */
  followUser: async (userId: string) => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await authorizedFetch(`${API_BASE}/profiles/${userId}/follow`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  /**
   * Unfollow a user (requires authentication)
   */
  unfollowUser: async (userId: string) => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await authorizedFetch(`${API_BASE}/profiles/${userId}/follow`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  /**
   * Check if authenticated user is following this user
   */
  getFollowStatus: async (userId: string) => {
    const token = getToken();
    if (!token) {
      return { data: { isFollowing: false } };
    }

    const response = await authorizedFetch(`${API_BASE}/profiles/${userId}/follow/status`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  /**
   * Get user's followers list
   */
  getFollowers: async (userId: string, params: PaginationParams = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', String(params.limit));
    if (params.offset) queryParams.append('offset', String(params.offset));

    const response = await authorizedFetch(`${API_BASE}/profiles/${userId}/followers?${queryParams}`);
    return handleResponse(response);
  },

  /**
   * Get users that this user is following
   */
  getFollowing: async (userId: string, params: PaginationParams = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', String(params.limit));
    if (params.offset) queryParams.append('offset', String(params.offset));

    const response = await authorizedFetch(`${API_BASE}/profiles/${userId}/following?${queryParams}`);
    return handleResponse(response);
  },

  /**
   * Get follower and following counts for a user
   */
  getFollowCounts: async (userId: string) => {
    const response = await authorizedFetch(`${API_BASE}/profiles/${userId}/follow/counts`);
    return handleResponse(response);
  }
};

// Export token helpers for external use
export const Auth = {
  getToken,
  setToken,
  clearToken,
  getUserId: getUserIdFromToken,
  isAuthenticated: CommunityAPI.isAuthenticated,
  logout: CommunityAPI.logout,
  getTestToken: CommunityAPI.getTestToken
};

// ===== MOCK DATA HELPERS =====

interface MockPost {
  title: string;
  body: string;
  category: string;
  reactions?: { like?: number };
  _count?: { comments?: number };
  [key: string]: unknown;
}

/**
 * Get mock posts with filtering and sorting
 */
const getMockPosts = ({ limit = 20, offset = 0, search, category, sortBy }: {
  limit?: number;
  offset?: number;
  search?: string;
  category?: string;
  sortBy?: string;
} = {}) => {
  let posts = [...mockData.posts] as MockPost[];

  // Apply search filter
  if (search) {
    const query = search.toLowerCase();
    posts = posts.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.body.toLowerCase().includes(query)
    );
  }

  // Apply category filter
  if (category) {
    posts = posts.filter(p => p.category === category);
  }

  // Apply sorting
  if (sortBy === 'popular') {
    posts.sort((a, b) => (b.reactions?.like || 0) - (a.reactions?.like || 0));
  } else if (sortBy === 'commented') {
    posts.sort((a, b) => (b._count?.comments || 0) - (a._count?.comments || 0));
  }
  // Default is 'recent' which is already the order

  // Apply pagination
  const paginatedPosts = posts.slice(offset, offset + limit);

  return {
    data: paginatedPosts,
    pagination: {
      total: posts.length,
      limit,
      offset,
      hasMore: offset + limit < posts.length
    }
  };
};

/**
 * Get mock comments for a post
 */
export const getMockComments = (postId: string) => {
  const comments = (mockData.comments as Record<string, unknown[]>)[postId] || [];
  return {
    data: comments,
    pagination: { total: comments.length }
  };
};

/**
 * Get mock groups
 */
export const getMockGroups = () => {
  return {
    data: mockData.groups,
    pagination: { total: mockData.groups.length }
  };
};

/**
 * Get mock profile
 */
export const getMockProfile = () => {
  return {
    data: mockData.profile
  };
};

// ===== IMAGE URL HELPERS =====

/**
 * Construct full image URL from relative path
 * Handles both production (empty base) and development (localhost)
 */
export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  // If it's already a full URL (https:// or http://), return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // If we're in mock mode or no base URL, return empty
  if (useMockData || !API_BASE_URL) {
    return '';
  }
  return `${API_BASE_URL}${path}`;
};

/**
 * Check if we're currently using mock data
 */
export const isUsingMockData = (): boolean => useMockData;

/**
 * Force switch to mock data mode (for testing)
 */
export const enableMockMode = (): void => {
  useMockData = true;
};

export default CommunityAPI;

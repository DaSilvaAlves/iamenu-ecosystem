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
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
};

// Authorized fetch - automatically adds JWT token to requests
const authorizedFetch = async (url, options = {}) => {
  const token = getToken();

  // Don't set Content-Type for FormData - browser will set it with boundary
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
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
const getToken = () => {
  return localStorage.getItem('auth_token');
};

// Set JWT token in localStorage
const setToken = (token) => {
  localStorage.setItem('auth_token', token);
};

// Remove JWT token
const clearToken = () => {
  localStorage.removeItem('auth_token');
};

// Get user ID from JWT token
const getUserIdFromToken = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || payload.sub;
  } catch {
    return null;
  }
};

export const CommunityAPI = {
  // ===== AUTHENTICATION =====

  /**
   * Get test JWT token (development only)
   * @returns {Promise<string>} JWT token
   */
  getTestToken: async () => {
    // Don't use authorizedFetch here - we're getting the token!
    const response = await fetch(`${API_BASE}/auth/test-token`);
    const data = await handleResponse(response);
    setToken(data.token);
    return data.token;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!getToken();
  },

  /**
   * Logout (clear token)
   */
  logout: () => {
    clearToken();
  },

  // ===== POSTS =====

  /**
   * Get all posts (paginated with search and filters)
   * Falls back to mock data if API is unavailable
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Items per page (default: 20)
   * @param {number} params.offset - Offset for pagination (default: 0)
   * @param {string} params.groupId - Optional group filter
   * @param {string} params.userGroupIds - Comma-separated group IDs for "my groups" tab
   * @param {string} params.search - Search query
   * @param {string} params.category - Category filter
   * @param {string} params.sortBy - Sort by (recent, popular, commented)
   * @returns {Promise<Object>} Posts data with pagination
   */
  getPosts: async ({ limit = 20, offset = 0, groupId, userGroupIds, search, category, sortBy } = {}) => {
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
    } catch (error) {
      console.warn('API unavailable, falling back to mock data:', error.message);
      useMockData = true;
      return getMockPosts({ limit, offset, search, category, sortBy });
    }
  },

  /**
   * Get post by ID
   * @param {string} id - Post ID
   * @returns {Promise<Object>} Post data
   */
  getPost: async (id) => {
    const response = await authorizedFetch(`${API_BASE}/posts/${id}`);
    return handleResponse(response);
  },

  /**
   * Create new post (requires authentication)
   * @param {Object} postData
   * @param {string} postData.title - Post title
   * @param {string} postData.body - Post content
   * @param {string} postData.category - Category (dica, duvida, showcase, evento)
   * @param {string[]} postData.tags - Tags array
   * @returns {Promise<Object>} Created post
   */
  createPost: async (postData) => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    // If image is provided, use FormData, otherwise use JSON
    let body;
    let headers = {
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
   * @param {string} id - Post ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated post
   */
  updatePost: async (id, updates) => {
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
   * @param {string} id - Post ID
   * @returns {Promise<void>}
   */
  deletePost: async (id) => {
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
      const error = await response.json().catch(() => ({ message: 'Delete failed' }));
      throw new Error(error.message);
    }
  },

  /**
   * Toggle reaction on a post (requires authentication)
   * @param {string} postId - Post ID
   * @param {string} reactionType - Type of reaction (like, useful, thanks)
   * @returns {Promise<Object>} Result with action (added/removed)
   */
  toggleReaction: async (postId, reactionType) => {
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
   * @param {string} postId - Post ID
   * @returns {Promise<Object>} Reaction counts { like: 5, useful: 2, ... }
   */
  getPostReactions: async (postId) => {
    const response = await authorizedFetch(`${API_BASE}/posts/${postId}/reactions`);
    return handleResponse(response);
  },

  // ===== NOTIFICATIONS =====

  /**
   * Get user notifications (requires authentication)
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Items per page (default: 20)
   * @param {number} params.offset - Offset for pagination (default: 0)
   * @returns {Promise<Object>} Notifications data with pagination
   */
  getNotifications: async ({ limit = 20, offset = 0 } = {}) => {
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
   * @param {string} id - Notification ID
   * @returns {Promise<Object>} Updated notification
   */
  markNotificationAsRead: async (id) => {
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
   * @returns {Promise<Object>} Result with count
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
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Items per page (default: 50)
   * @param {number} params.offset - Offset for pagination (default: 0)
   * @param {string} params.search - Search query
   * @param {string} params.category - Category filter (region/theme)
   * @param {string} params.type - Type filter (public/private)
   * @param {string} params.sortBy - Sort by (name, members, posts, recent)
   * @returns {Promise<Object>} Groups data with pagination
   */
  getGroups: async ({ limit = 50, offset = 0, search, category, type, sortBy } = {}) => {
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
   * @param {string} id - Group ID
   * @returns {Promise<Object>} Group data with recent posts
   */
  getGroup: async (id) => {
    const response = await authorizedFetch(`${API_BASE}/groups/${id}`);
    return handleResponse(response);
  },

  /**
   * Get groups by category
   * @param {string} category - Category (region, theme, type)
   * @returns {Promise<Object>} Filtered groups
   */
  getGroupsByCategory: async (category) => {
    const response = await authorizedFetch(`${API_BASE}/groups/category/${category}`);
    return handleResponse(response);
  },

  /**
   * Get user's groups (groups the user is member of)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Groups data with membership info
   */
  getUserGroups: async (userId) => {
    const response = await authorizedFetch(`${API_BASE}/groups/user/${userId}`);
    return handleResponse(response);
  },

  /**
   * Create new group (requires authentication)
   * @param {Object} groupData
   * @param {string} groupData.name - Group name
   * @param {string} groupData.description - Group description
   * @param {string} groupData.category - Category (region, theme, type)
   * @param {string} groupData.type - Type (public, private)
   * @param {File} groupData.coverImage - Optional cover image
   * @returns {Promise<Object>} Created group
   */
  createGroup: async (groupData) => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    // If cover image is provided, use FormData, otherwise use JSON
    let body;
    let headers = {
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
   * @param {string} postId - Post ID
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Items per page (default: 20)
   * @param {number} params.offset - Offset for pagination (default: 0)
   * @returns {Promise<Object>} Comments data with pagination
   */
  getComments: async (postId, { limit = 20, offset = 0 } = {}) => {
    const response = await authorizedFetch(
      `${API_BASE}/posts/${postId}/comments?limit=${limit}&offset=${offset}`
    );
    return handleResponse(response);
  },

  /**
   * Create new comment (requires authentication)
   * @param {string} postId - Post ID
   * @param {Object} commentData
   * @param {string} commentData.content - Comment content
   * @returns {Promise<Object>} Created comment
   */
  createComment: async (postId, commentData) => {
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
   * @param {string} postId - Post ID
   * @param {string} commentId - Comment ID
   * @returns {Promise<void>}
   */
  deleteComment: async (postId, commentId) => {
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
      const error = await response.json().catch(() => ({ message: 'Delete failed' }));
      throw new Error(error.message);
    }
  },

  /**
   * Toggle reaction on a comment (requires authentication)
   * @param {string} postId - Post ID
   * @param {string} commentId - Comment ID
   * @param {string} reactionType - Type of reaction (like, useful, thanks)
   * @returns {Promise<Object>} Result with action (added/removed)
   */
  toggleCommentReaction: async (postId, commentId, reactionType) => {
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
   * @param {string} postId - Post ID
   * @param {string} commentId - Comment ID
   * @returns {Promise<Object>} Reaction counts { like: 5, useful: 2, ... }
   */
  getCommentReactions: async (postId, commentId) => {
    const response = await authorizedFetch(`${API_BASE}/posts/${postId}/comments/${commentId}/reactions`);
    return handleResponse(response);
  },

  // ===== PROFILES =====

  /**
   * Get user profile
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Profile data
   */
  getProfile: async (userId) => {
    const response = await authorizedFetch(`${API_BASE}/profiles/${userId}`);
    return handleResponse(response);
  },

  /**
   * Update profile (requires authentication)
   * @param {string} userId - User ID
   * @param {Object} profileData - Profile data (can include files)
   * @returns {Promise<Object>} Updated profile
   */
  updateProfile: async (userId, profileData) => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const formData = new FormData();
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== undefined && profileData[key] !== null) {
        formData.append(key, profileData[key]);
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
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User stats
   */
  getUserStats: async (userId) => {
    const response = await authorizedFetch(`${API_BASE}/profiles/${userId}/stats`);
    return handleResponse(response);
  },

  /**
   * Get user's posts
   * @param {string} userId - User ID
   * @param {Object} params - Query params (limit, offset)
   * @returns {Promise<Object>} User posts
   */
  getUserPosts: async (userId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);

    const response = await authorizedFetch(`${API_BASE}/profiles/${userId}/posts?${queryParams}`);
    return handleResponse(response);
  },

  /**
   * Search profiles by username
   * @param {Object} params - Query parameters
   * @param {string} params.q - Search query
   * @returns {Promise<Object>} Matching profiles
   */
  searchProfiles: async ({ q }) => {
    const response = await authorizedFetch(`${API_BASE}/profiles/search?q=${encodeURIComponent(q)}`);
    return handleResponse(response);
  },

  // ===== FOLLOWERS/FOLLOWING =====

  /**
   * Follow a user (requires authentication)
   * @param {string} userId - User ID to follow
   * @returns {Promise<Object>} Follow relationship
   */
  followUser: async (userId) => {
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
   * @param {string} userId - User ID to unfollow
   * @returns {Promise<Object>} Success message
   */
  unfollowUser: async (userId) => {
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
   * @param {string} userId - User ID to check
   * @returns {Promise<Object>} { isFollowing: boolean }
   */
  getFollowStatus: async (userId) => {
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
   * @param {string} userId - User ID
   * @param {Object} params - Query params (limit, offset)
   * @returns {Promise<Object>} Followers list with pagination
   */
  getFollowers: async (userId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);

    const response = await authorizedFetch(`${API_BASE}/profiles/${userId}/followers?${queryParams}`);
    return handleResponse(response);
  },

  /**
   * Get users that this user is following
   * @param {string} userId - User ID
   * @param {Object} params - Query params (limit, offset)
   * @returns {Promise<Object>} Following list with pagination
   */
  getFollowing: async (userId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);

    const response = await authorizedFetch(`${API_BASE}/profiles/${userId}/following?${queryParams}`);
    return handleResponse(response);
  },

  /**
   * Get follower and following counts for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} { followersCount, followingCount }
   */
  getFollowCounts: async (userId) => {
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

/**
 * Get mock posts with filtering and sorting
 */
const getMockPosts = ({ limit = 20, offset = 0, search, category, sortBy } = {}) => {
  let posts = [...mockData.posts];

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
export const getMockComments = (postId) => {
  const comments = mockData.comments[postId] || [];
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
 * @param {string} path - Relative path to image (e.g., /uploads/image.jpg)
 * @returns {string} Full URL or empty string if no path
 */
export const getImageUrl = (path) => {
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
export const isUsingMockData = () => useMockData;

/**
 * Force switch to mock data mode (for testing)
 */
export const enableMockMode = () => {
  useMockData = true;
};

export default CommunityAPI;

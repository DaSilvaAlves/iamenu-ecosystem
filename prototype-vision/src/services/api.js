// ===== COMMUNITY API CLIENT =====
// Connects Prototype-Vision to Community API Backend (localhost:3001)

const API_BASE = 'http://localhost:3001/api/v1/community';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
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
    let url = `${API_BASE}/posts?limit=${limit}&offset=${offset}`;
    if (groupId) url += `&groupId=${groupId}`;
    if (userGroupIds) url += `&userGroupIds=${encodeURIComponent(userGroupIds)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (sortBy) url += `&sortBy=${sortBy}`;

    const response = await fetch(url);
    return handleResponse(response);
  },

  /**
   * Get post by ID
   * @param {string} id - Post ID
   * @returns {Promise<Object>} Post data
   */
  getPost: async (id) => {
    const response = await fetch(`${API_BASE}/posts/${id}`);
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

    const response = await fetch(`${API_BASE}/posts/${id}`, {
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

    const response = await fetch(`${API_BASE}/posts/${id}`, {
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

    const response = await fetch(`${API_BASE}/posts/${postId}/react`, {
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
    const response = await fetch(`${API_BASE}/posts/${postId}/reactions`);
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

    const response = await fetch(
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

    const response = await fetch(`${API_BASE}/notifications/${id}/read`, {
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

    const response = await fetch(`${API_BASE}/notifications/read-all`, {
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

    const response = await fetch(url);
    return handleResponse(response);
  },

  /**
   * Get group by ID
   * @param {string} id - Group ID
   * @returns {Promise<Object>} Group data with recent posts
   */
  getGroup: async (id) => {
    const response = await fetch(`${API_BASE}/groups/${id}`);
    return handleResponse(response);
  },

  /**
   * Get groups by category
   * @param {string} category - Category (region, theme, type)
   * @returns {Promise<Object>} Filtered groups
   */
  getGroupsByCategory: async (category) => {
    const response = await fetch(`${API_BASE}/groups/category/${category}`);
    return handleResponse(response);
  },

  /**
   * Get user's groups (groups the user is member of)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Groups data with membership info
   */
  getUserGroups: async (userId) => {
    const response = await fetch(`${API_BASE}/groups/user/${userId}`);
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

    const response = await fetch(`${API_BASE}/groups`, {
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
    const response = await fetch(
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

    const response = await fetch(`${API_BASE}/posts/${postId}/comments`, {
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

    const response = await fetch(`${API_BASE}/posts/${postId}/comments/${commentId}`, {
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

    const response = await fetch(`${API_BASE}/posts/${postId}/comments/${commentId}/react`, {
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
    const response = await fetch(`${API_BASE}/posts/${postId}/comments/${commentId}/reactions`);
    return handleResponse(response);
  },

  // ===== PROFILES =====

  /**
   * Get user profile
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Profile data
   */
  getProfile: async (userId) => {
    const response = await fetch(`${API_BASE}/profiles/${userId}`);
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

    const response = await fetch(`${API_BASE}/profiles/${userId}`, {
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
    const response = await fetch(`${API_BASE}/profiles/${userId}/stats`);
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

    const response = await fetch(`${API_BASE}/profiles/${userId}/posts?${queryParams}`);
    return handleResponse(response);
  },

  /**
   * Search profiles by username
   * @param {Object} params - Query parameters
   * @param {string} params.q - Search query
   * @returns {Promise<Object>} Matching profiles
   */
  searchProfiles: async ({ q }) => {
    const response = await fetch(`${API_BASE}/profiles/search?q=${encodeURIComponent(q)}`);
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

export default CommunityAPI;

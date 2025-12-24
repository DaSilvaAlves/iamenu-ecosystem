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
   * Get all posts (paginated)
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Items per page (default: 20)
   * @param {number} params.offset - Offset for pagination (default: 0)
   * @returns {Promise<Object>} Posts data with pagination
   */
  getPosts: async ({ limit = 20, offset = 0 } = {}) => {
    const response = await fetch(
      `${API_BASE}/posts?limit=${limit}&offset=${offset}`
    );
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

    const response = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData)
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

  // ===== GROUPS =====

  /**
   * Get all groups (paginated)
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Items per page (default: 50)
   * @param {number} params.offset - Offset for pagination (default: 0)
   * @returns {Promise<Object>} Groups data with pagination
   */
  getGroups: async ({ limit = 50, offset = 0 } = {}) => {
    const response = await fetch(
      `${API_BASE}/groups?limit=${limit}&offset=${offset}`
    );
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
   * Create new group (requires authentication)
   * @param {Object} groupData
   * @param {string} groupData.name - Group name
   * @param {string} groupData.description - Group description
   * @param {string} groupData.category - Category (region, theme, type)
   * @param {string} groupData.type - Type (public, private)
   * @returns {Promise<Object>} Created group
   */
  createGroup: async (groupData) => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE}/groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(groupData)
    });
    return handleResponse(response);
  }
};

// Export token helpers for external use
export const Auth = {
  getToken,
  setToken,
  clearToken,
  isAuthenticated: CommunityAPI.isAuthenticated,
  logout: CommunityAPI.logout,
  getTestToken: CommunityAPI.getTestToken
};

export default CommunityAPI;

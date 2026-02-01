/**
 * API Client - Centralized Axios instance with JWT handling
 *
 * Features:
 * - Automatic token injection
 * - Automatic token refresh on 401/403
 * - Request/Response interceptors
 * - Error handling
 */

import axios from 'axios';
import { API_CONFIG } from '../../config/api';

// Token storage keys
const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Token management
export const tokenManager = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  hasTokens: () => !!localStorage.getItem(ACCESS_TOKEN_KEY)
};

// Create axios instance
const apiClient = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Track if we're currently refreshing to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401/403 and we haven't tried to refresh yet
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      tokenManager.getRefreshToken()
    ) {
      if (isRefreshing) {
        // Wait for the refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenManager.getRefreshToken();
        const response = await axios.post(
          `${API_CONFIG.COMMUNITY_API}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        tokenManager.setTokens(accessToken, newRefreshToken);

        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenManager.clearTokens();

        // Dispatch event for UI to handle (redirect to login)
        window.dispatchEvent(new CustomEvent('auth:logout', {
          detail: { reason: 'session_expired' }
        }));

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Service-specific API clients
export const communityApi = {
  baseURL: API_CONFIG.COMMUNITY_API,

  // Posts
  posts: {
    list: (params) => apiClient.get(`${API_CONFIG.COMMUNITY_API}/posts`, { params }),
    get: (id) => apiClient.get(`${API_CONFIG.COMMUNITY_API}/posts/${id}`),
    create: (data) => apiClient.post(`${API_CONFIG.COMMUNITY_API}/posts`, data),
    update: (id, data) => apiClient.patch(`${API_CONFIG.COMMUNITY_API}/posts/${id}`, data),
    delete: (id) => apiClient.delete(`${API_CONFIG.COMMUNITY_API}/posts/${id}`),
    react: (id, reactionType) => apiClient.post(`${API_CONFIG.COMMUNITY_API}/posts/${id}/reactions`, { reactionType })
  },

  // Groups
  groups: {
    list: (params) => apiClient.get(`${API_CONFIG.COMMUNITY_API}/groups`, { params }),
    get: (id) => apiClient.get(`${API_CONFIG.COMMUNITY_API}/groups/${id}`),
    create: (data) => apiClient.post(`${API_CONFIG.COMMUNITY_API}/groups`, data),
    join: (id) => apiClient.post(`${API_CONFIG.COMMUNITY_API}/groups/${id}/join`),
    leave: (id) => apiClient.post(`${API_CONFIG.COMMUNITY_API}/groups/${id}/leave`)
  },

  // Profiles
  profiles: {
    get: (userId) => apiClient.get(`${API_CONFIG.COMMUNITY_API}/profiles/${userId}`),
    update: (userId, data) => apiClient.patch(`${API_CONFIG.COMMUNITY_API}/profiles/${userId}`, data),
    follow: (userId) => apiClient.post(`${API_CONFIG.COMMUNITY_API}/profiles/${userId}/follow`),
    unfollow: (userId) => apiClient.delete(`${API_CONFIG.COMMUNITY_API}/profiles/${userId}/follow`)
  },

  // Notifications
  notifications: {
    list: (params) => apiClient.get(`${API_CONFIG.COMMUNITY_API}/notifications`, { params }),
    markRead: (id) => apiClient.patch(`${API_CONFIG.COMMUNITY_API}/notifications/${id}/read`),
    markAllRead: () => apiClient.patch(`${API_CONFIG.COMMUNITY_API}/notifications/read-all`)
  },

  // Gamification
  gamification: {
    getPoints: (userId) => apiClient.get(`${API_CONFIG.COMMUNITY_API}/gamification/points/${userId}`),
    getLeaderboard: (params) => apiClient.get(`${API_CONFIG.COMMUNITY_API}/gamification/leaderboard`, { params }),
    getAchievements: (userId) => apiClient.get(`${API_CONFIG.COMMUNITY_API}/gamification/achievements/${userId}`)
  },

  // Auth
  auth: {
    refresh: (refreshToken) => apiClient.post(`${API_CONFIG.COMMUNITY_API}/auth/refresh`, { refreshToken }),
    logout: (refreshToken) => apiClient.post(`${API_CONFIG.COMMUNITY_API}/auth/logout`, { refreshToken }),
    logoutAll: () => apiClient.post(`${API_CONFIG.COMMUNITY_API}/auth/logout-all`),
    getSessions: () => apiClient.get(`${API_CONFIG.COMMUNITY_API}/auth/sessions`)
  }
};

export const marketplaceApi = {
  baseURL: API_CONFIG.MARKETPLACE_API,

  // Suppliers
  suppliers: {
    list: (params) => apiClient.get(`${API_CONFIG.MARKETPLACE_API}/suppliers`, { params }),
    get: (id) => apiClient.get(`${API_CONFIG.MARKETPLACE_API}/suppliers/${id}`),
    getProducts: (id, params) => apiClient.get(`${API_CONFIG.MARKETPLACE_API}/suppliers/${id}/products`, { params })
  },

  // Products
  products: {
    list: (params) => apiClient.get(`${API_CONFIG.MARKETPLACE_API}/products`, { params }),
    compare: (params) => apiClient.get(`${API_CONFIG.MARKETPLACE_API}/products/compare`, { params })
  },

  // Quotes (RFQ)
  quotes: {
    create: (data) => apiClient.post(`${API_CONFIG.MARKETPLACE_API}/quotes/request`, data),
    list: (params) => apiClient.get(`${API_CONFIG.MARKETPLACE_API}/quotes/requests`, { params }),
    respond: (id, data) => apiClient.post(`${API_CONFIG.MARKETPLACE_API}/quotes/${id}/respond`, data)
  },

  // Collective Bargains
  bargains: {
    list: (params) => apiClient.get(`${API_CONFIG.MARKETPLACE_API}/collective-bargains`, { params }),
    get: (id) => apiClient.get(`${API_CONFIG.MARKETPLACE_API}/collective-bargains/${id}`),
    join: (id, data) => apiClient.post(`${API_CONFIG.MARKETPLACE_API}/collective-bargains/${id}/join`, data)
  }
};

export const academyApi = {
  baseURL: API_CONFIG.ACADEMY_API,

  // Courses
  courses: {
    list: (params) => apiClient.get(`${API_CONFIG.ACADEMY_API}/courses`, { params }),
    get: (id) => apiClient.get(`${API_CONFIG.ACADEMY_API}/courses/${id}`),
    getBySlug: (slug) => apiClient.get(`${API_CONFIG.ACADEMY_API}/courses/slug/${slug}`)
  },

  // Enrollments
  enrollments: {
    list: (params) => apiClient.get(`${API_CONFIG.ACADEMY_API}/enrollments`, { params }),
    create: (courseId) => apiClient.post(`${API_CONFIG.ACADEMY_API}/enrollments`, { courseId }),
    updateProgress: (enrollmentId, data) => apiClient.patch(`${API_CONFIG.ACADEMY_API}/enrollments/${enrollmentId}/progress`, data)
  },

  // Certificates
  certificates: {
    list: (params) => apiClient.get(`${API_CONFIG.ACADEMY_API}/certificates`, { params }),
    verify: (code) => apiClient.get(`${API_CONFIG.ACADEMY_API}/certificates/verify/${code}`)
  }
};

export const businessApi = {
  baseURL: API_CONFIG.BUSINESS_API,

  // Dashboard
  dashboard: {
    getStats: (period) => apiClient.get(`${API_CONFIG.BUSINESS_API}/dashboard/stats`, { params: { period } }),
    getTopProducts: (limit) => apiClient.get(`${API_CONFIG.BUSINESS_API}/dashboard/top-products`, { params: { limit } }),
    getAlerts: () => apiClient.get(`${API_CONFIG.BUSINESS_API}/dashboard/alerts`),
    getOpportunities: () => apiClient.get(`${API_CONFIG.BUSINESS_API}/dashboard/opportunities`),
    getSalesTrends: (period) => apiClient.get(`${API_CONFIG.BUSINESS_API}/dashboard/sales-trends`, { params: { period } }),
    getMenuEngineering: () => apiClient.get(`${API_CONFIG.BUSINESS_API}/dashboard/menu-engineering`),
    getDemandForecast: () => apiClient.get(`${API_CONFIG.BUSINESS_API}/dashboard/demand-forecast`),
    getPeakHours: () => apiClient.get(`${API_CONFIG.BUSINESS_API}/dashboard/peak-hours-heatmap`),
    getBenchmark: () => apiClient.get(`${API_CONFIG.BUSINESS_API}/dashboard/benchmark`)
  },

  // Onboarding
  onboarding: {
    setup: (formData) => apiClient.post(`${API_CONFIG.BUSINESS_API}/onboarding/setup`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getStatus: () => apiClient.get(`${API_CONFIG.BUSINESS_API}/onboarding/status`),
    downloadTemplate: () => apiClient.get(`${API_CONFIG.BUSINESS_API}/onboarding/template`, { responseType: 'blob' })
  }
};

// Default export
export default apiClient;

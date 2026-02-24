/**
 * Business Intelligence API Client
 * Conecta-se ao backend Business API (porta 3004)
 */

import { API_CONFIG } from '../config/api';

const API_BASE = API_CONFIG.BUSINESS_API;

const getToken = (): string | null => {
  return localStorage.getItem('auth_token') || null;
};

const getHeaders = (includeAuth = true): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

export const OnboardingAPI = {
  async setup(formData: FormData) {
    const token = getToken();

    const response = await fetch(`${API_BASE}/onboarding/setup`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Setup failed');
    }

    return response.json();
  },

  async downloadTemplate() {
    const response = await fetch(`${API_BASE}/onboarding/template`);

    if (!response.ok) {
      throw new Error('Failed to download template');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template-menu-iamenu.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  async getStatus() {
    const response = await fetch(`${API_BASE}/onboarding/status`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get status');
    }

    return response.json();
  }
};

export const DashboardAPI = {
  async getStats(period = 'semana') {
    const response = await fetch(`${API_BASE}/dashboard/stats?period=${period}`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get stats');
    }

    return response.json();
  },

  async getTopProducts(limit = 5) {
    const response = await fetch(`${API_BASE}/dashboard/top-products?limit=${limit}`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get top products');
    }

    return response.json();
  },

  async getAlerts() {
    const response = await fetch(`${API_BASE}/dashboard/alerts`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get alerts');
    }

    return response.json();
  },

  async getOpportunities() {
    const response = await fetch(`${API_BASE}/dashboard/opportunities`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get opportunities');
    }

    return response.json();
  },

  async getSalesTrends(period = 'hoje') {
    const response = await fetch(`${API_BASE}/dashboard/sales-trends?period=${period}`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get sales trends');
    }

    return response.json();
  },

  async getAIPrediction() {
    const response = await fetch(`${API_BASE}/dashboard/ai-prediction`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get AI prediction');
    }

    return response.json();
  },

  async getMenuEngineering() {
    const response = await fetch(`${API_BASE}/dashboard/menu-engineering`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get menu engineering data');
    }

    return response.json();
  },

  async getDemandForecast() {
    const response = await fetch(`${API_BASE}/dashboard/demand-forecast`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get demand forecast');
    }

    return response.json();
  },

  async getPeakHoursHeatmap() {
    const response = await fetch(`${API_BASE}/dashboard/peak-hours-heatmap`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get peak hours heatmap');
    }

    return response.json();
  },

  async getBenchmark() {
    const response = await fetch(`${API_BASE}/dashboard/benchmark`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get benchmark data');
    }

    return response.json();
  }
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
};

export const hasAuthToken = () => {
  return !!getToken();
};

/**
 * Business Intelligence API Client
 * Conecta-se ao backend Business API (porta 3003)
 */

const API_BASE = 'http://localhost:3003/api/v1/business';

// Helper para obter token (assumindo que está no localStorage)
const getToken = () => {
  return localStorage.getItem('auth_token') || null;
};

// Helper para headers com auth
const getHeaders = (includeAuth = true) => {
  const headers = {
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

/**
 * Onboarding API
 */
export const OnboardingAPI = {
  /**
   * Setup inicial do restaurante
   * @param {FormData} formData - Dados do form (multipart com file upload opcional)
   */
  async setup(formData) {
    const token = getToken();

    const response = await fetch(`${API_BASE}/onboarding/setup`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Não incluir Content-Type para multipart/form-data (browser define automaticamente)
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Setup failed');
    }

    return response.json();
  },

  /**
   * Download template Excel
   */
  async downloadTemplate() {
    const response = await fetch(`${API_BASE}/onboarding/template`);

    if (!response.ok) {
      throw new Error('Failed to download template');
    }

    // Download file
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

  /**
   * Verificar status do onboarding
   */
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

/**
 * Dashboard API
 */
export const DashboardAPI = {
  /**
   * Obter estatísticas gerais
   * @param {string} period - 'hoje', 'semana', 'mes', 'ano'
   */
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

  /**
   * Obter top produtos
   * @param {number} limit - Número de produtos (default: 5)
   */
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

  /**
   * Obter alertas críticos
   */
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

  /**
   * Obter oportunidades de melhoria
   */
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

  /**
   * Obter tendências de vendas (hora a hora ou diárias)
   * @param {string} period - 'hoje', 'semana', 'mes'
   */
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

  /**
   * Obter previsão IA com sugestões acionáveis
   */
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

  /**
   * Obter matriz de rentabilidade (Menu Engineering)
   */
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

  /**
   * Obter previsão de demanda para próximos 7 dias
   */
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

  /**
   * Obter mapa de calor de horários de pico semanais
   */
  async getPeakHoursHeatmap() {
    const response = await fetch(`${API_BASE}/dashboard/peak-hours-heatmap`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get peak hours heatmap');
    }

    return response.json();
  }
};

/**
 * Helpers
 */
export const setAuthToken = (token) => {
  localStorage.setItem('auth_token', token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
};

export const hasAuthToken = () => {
  return !!getToken();
};

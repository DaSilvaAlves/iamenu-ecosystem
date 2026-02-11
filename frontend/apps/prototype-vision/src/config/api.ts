/**
 * API Configuration - Centralized API URLs
 * Uses environment variables with fallback to localhost for development
 *
 * PRODUCTION SETUP (Vercel):
 * Set these environment variables in your Vercel project settings:
 * - VITE_COMMUNITY_API_URL=https://your-api-domain.com/api/v1/community
 * - VITE_MARKETPLACE_API_URL=https://your-api-domain.com/api/v1/marketplace
 * - VITE_BUSINESS_API_URL=https://your-api-domain.com/api/v1/business
 * - VITE_ACADEMY_API_URL=https://your-api-domain.com/api/v1/academy
 *
 * If no production API is available, the app will automatically fallback to mock data.
 */

// ===== TYPE DEFINITIONS =====

interface APIConfigType {
  COMMUNITY_API: string;
  MARKETPLACE_API: string;
  BUSINESS_API: string;
  ACADEMY_API: string;
  TAKEAWAY_API: string;
  COMMUNITY_BASE: string;
  MARKETPLACE_BASE: string;
  IS_DEMO_MODE: boolean;
}

// ===== ENVIRONMENT DETECTION =====

// Check if we're in production without a configured backend
const isProductionWithoutBackend = import.meta.env.PROD && !import.meta.env.VITE_COMMUNITY_API_URL;

// Check if we're in production based on URL to avoid build env issues
const isVercel = typeof window !== 'undefined' && (
  window.location.hostname.includes('vercel.app') ||
  window.location.hostname.includes('prototype-vision')
);
const isProd = import.meta.env.PROD || isVercel;

console.log('🌐 Truth Seeker: Environment Detection ->', {
  isProd,
  isVercel,
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'node'
});

// ===== API CONFIGURATION =====

export const API_CONFIG: APIConfigType = {
  // Backend API URLs
  COMMUNITY_API: isVercel
    ? 'https://iamenucommunity-api-production.up.railway.app/api/v1/community'
    : (
        import.meta.env.VITE_COMMUNITY_API_URL ||
        (isProd
          ? 'https://iamenucommunity-api-production.up.railway.app/api/v1/community'
          : 'http://localhost:3001/api/v1/community')
      ),

  MARKETPLACE_API: isVercel
    ? 'https://iamenumarketplace-api-production.up.railway.app/api/v1/marketplace'
    : (
        import.meta.env.VITE_MARKETPLACE_API_URL ||
        (isProd
          ? 'https://iamenumarketplace-api-production.up.railway.app/api/v1/marketplace'
          : 'http://localhost:3002/api/v1/marketplace')
      ),

  BUSINESS_API: isVercel
    ? 'https://iamenubusiness-api-production.up.railway.app/api/v1/business'
    : (
        import.meta.env.VITE_BUSINESS_API_URL ||
        (isProd
          ? 'https://iamenubusiness-api-production.up.railway.app/api/v1/business'
          : 'http://localhost:3004/api/v1/business')
      ),

  ACADEMY_API: isVercel
    ? 'https://iamenuacademy-api-production.up.railway.app/api/v1/academy'
    : (
        import.meta.env.VITE_ACADEMY_API_URL ||
        (isProd
          ? 'https://iamenuacademy-api-production.up.railway.app/api/v1/academy'
          : 'http://localhost:3003/api/v1/academy')
      ),

  TAKEAWAY_API: isVercel
    ? 'https://takeway-proxy-production.up.railway.app/api/supabase'
    : (
        import.meta.env.VITE_TAKEAWAY_API_URL ||
        (isProd
          ? 'https://takeway-proxy-production.up.railway.app/api/supabase'
          : 'http://localhost:3006/api/supabase')
      ),

  // Base URLs without /api/v1 prefix
  COMMUNITY_BASE: isVercel
    ? 'https://iamenucommunity-api-production.up.railway.app'
    : (
        import.meta.env.VITE_COMMUNITY_API_URL?.replace('/api/v1/community', '') ||
        (isProd
          ? 'https://iamenucommunity-api-production.up.railway.app'
          : 'http://localhost:3001')
      ),

  MARKETPLACE_BASE: isVercel
    ? 'https://iamenumarketplace-api-production.up.railway.app'
    : (
        import.meta.env.VITE_MARKETPLACE_API_URL?.replace('/api/v1/marketplace', '') ||
        (isProd
          ? 'https://iamenumarketplace-api-production.up.railway.app'
          : 'http://localhost:3002')
      ),

  // Helper flag to check if we're in demo mode
  IS_DEMO_MODE: isProductionWithoutBackend
};

console.log('🔗 API URLs ->', {
  Community: API_CONFIG.COMMUNITY_API,
  Marketplace: API_CONFIG.MARKETPLACE_API,
  Business: API_CONFIG.BUSINESS_API,
  Academy: API_CONFIG.ACADEMY_API,
  Takeaway: API_CONFIG.TAKEAWAY_API
});

export default API_CONFIG;

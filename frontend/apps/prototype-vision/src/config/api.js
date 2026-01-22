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

// Check if we're in production without a configured backend
const isProductionWithoutBackend = import.meta.env.PROD && !import.meta.env.VITE_COMMUNITY_API_URL;

// Check if we're in production based on URL to avoid build env issues
const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
const isProd = import.meta.env.PROD || isVercel;

export const API_CONFIG = {
  // Backend API URLs
  COMMUNITY_API: import.meta.env.VITE_COMMUNITY_API_URL || (isProd ? 'https://iamenucommunity-api-production.up.railway.app/api/v1/community' : 'http://localhost:3004/api/v1/community'),
  MARKETPLACE_API: import.meta.env.VITE_MARKETPLACE_API_URL || (isProd ? '/api/v1/marketplace' : 'http://localhost:3005/api/v1/marketplace'),
  BUSINESS_API: import.meta.env.VITE_BUSINESS_API_URL || (isProd ? '/api/v1/business' : 'http://localhost:3002/api/v1/business'),
  ACADEMY_API: import.meta.env.VITE_ACADEMY_API_URL || (isProd ? '/api/v1/academy' : 'http://localhost:3003/api/v1/academy'),

  // Base URLs without /api/v1 prefix
  COMMUNITY_BASE: import.meta.env.VITE_COMMUNITY_API_URL?.replace('/api/v1/community', '') || (isProd ? 'https://iamenucommunity-api-production.up.railway.app' : 'http://localhost:3004'),
  MARKETPLACE_BASE: import.meta.env.VITE_MARKETPLACE_API_URL?.replace('/api/v1/marketplace', '') || (isProd ? '' : 'http://localhost:3005'),

  // Helper flag to check if we're in demo mode
  IS_DEMO_MODE: isProductionWithoutBackend
};

export default API_CONFIG;
